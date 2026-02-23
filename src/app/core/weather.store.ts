import { inject, Injectable, computed, signal, OnDestroy } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';
import { environment } from '../../environments/environment';
import { GeolocationService } from './geolocation.service';
import { iconForCode } from './icon-map';
import { WeatherApiService } from './weather-api.service';
import { CurrentResponse, ForecastResponse } from './weather-api.models';
import {
  CurrentConditions,
  DailyForecast,
  ForecastPeriod,
  Units,
  WeatherState,
} from './weather.models';

interface LastQuery {
  type: 'city' | 'coords';
  value: string;
  label: string;
  coords?: { lat: number; lon: number };
}

@Injectable({ providedIn: 'root' })
export class WeatherStore implements OnDestroy {
  private readonly state = signal<WeatherState>({
    hourly: [],
    daily: [],
    units: environment.defaultUnits,
    locationLabel: environment.defaultCity,
    loading: false,
    error: undefined,
    lastRefreshed: undefined,
    current: undefined,
  });

  readonly vm = computed(() => this.state());
  private lastQuery: LastQuery | null = null;
  private readonly storageKeyUnits = 'weather.units';
  private refreshHandle: ReturnType<typeof setInterval> | null = null;
  private visibilityHandler: (() => void) | null = null;

  private readonly api = inject(WeatherApiService);
  private readonly geolocation = inject(GeolocationService);

  constructor() {
    const storedUnits = this.readStoredUnits();

    if (storedUnits && storedUnits !== this.state().units) {
      this.state.update((s) => ({ ...s, units: storedUnits }));
    }

    this.loadByCity(environment.defaultCity);
    this.startAutoRefresh();
    this.setupVisibilityListener();
  }

  ngOnDestroy(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }

    if (this.visibilityHandler && typeof document !== 'undefined') {
      document.removeEventListener('visibilitychange', this.visibilityHandler);
    }
  }

  canGeolocate(): boolean {
    return this.geolocation.canUse();
  }

  loadByCity(city: string): void {
    const trimmed = city.trim();

    if (!trimmed) return;

    const currentLabel = this.state().locationLabel;
    this.state.update((s) => ({
      ...s,
      loading: true,
      error: undefined,
      locationLabel: currentLabel,
    }));

    forkJoin([
      this.api.getCurrentByCity(trimmed, this.state().units),
      this.api.getForecastByCity(trimmed, this.state().units),
    ])
      .pipe(
        catchError((err) => {
          this.state.update((s) => ({ ...s, loading: false, error: this.describeError(err) }));
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (!data) return;
        const [current, forecast] = data;
        const label = `${forecast.city?.name ?? trimmed}, ${forecast.city?.country ?? ''}`;
        this.lastQuery = { type: 'city', value: trimmed, label, coords: forecast.city?.coord };
        this.setStateFromApis(current, forecast, label);
      });
  }

  async loadByGeolocation(): Promise<void> {
    try {
      const coords = await this.geolocation.getCurrentPosition();
      const currentLabel = this.state().locationLabel;

      this.lastQuery = {
        type: 'coords',
        value: currentLabel,
        label: currentLabel,
        coords: { lat: coords.latitude, lon: coords.longitude },
      };

      this.state.update((s) => ({ ...s, loading: true, error: undefined }));

      forkJoin([
        this.api.getCurrentByCoords(coords.latitude, coords.longitude, this.state().units),
        this.api.getForecastByCoords(coords.latitude, coords.longitude, this.state().units),
      ])
        .pipe(
          catchError((err) => {
            this.state.update((s) => ({ ...s, loading: false, error: this.describeError(err) }));
            return of(null);
          }),
        )
        .subscribe((data) => {
          if (!data) return;

          const [current, forecast] = data;
          const resolvedLabel = `${forecast.city?.name ?? currentLabel}, ${forecast.city?.country ?? ''}`;
          this.lastQuery = {
            type: 'coords',
            value: resolvedLabel,
            label: resolvedLabel,
            coords: { lat: coords.latitude, lon: coords.longitude },
          };

          this.setStateFromApis(current, forecast, resolvedLabel);
        });
    } catch (err) {
      this.state.update((s) => ({ ...s, error: this.describeError(err), loading: false }));
    }
  }

  // Refreshes the last query. Requests are capped by environment.minRefreshIntervalMs unless
  // force is true, which bypasses the cap and triggers an immediate fetch.
  refresh(force = false): void {
    const last = this.state().lastRefreshed?.getTime();

    if (!force && last && Date.now() - last < environment.minRefreshIntervalMs) {
      return;
    }

    if (!this.lastQuery) {
      this.loadByCity(environment.defaultCity);
      return;
    }

    if (this.lastQuery.type === 'coords' && this.lastQuery.coords) {
      this.fetchByCoords(
        this.lastQuery.coords.lat,
        this.lastQuery.coords.lon,
        this.lastQuery.label,
      );
    } else {
      this.loadByCity(this.lastQuery.value);
    }
  }

  setUnits(units: Units): void {
    if (units === this.state().units) return;

    this.state.update((s) => ({ ...s, units }));
    this.writeStoredUnits(units);
    this.refresh(true);
  }

  private startAutoRefresh(): void {
    if (typeof window === 'undefined') return;

    if (!environment.autoUpdateIntervalMs || environment.autoUpdateIntervalMs <= 0) return;

    if (this.refreshHandle) return;

    this.refreshHandle = setInterval(() => this.refresh(), environment.autoUpdateIntervalMs);
  }

  private pauseAutoRefresh(): void {
    if (this.refreshHandle) {
      clearInterval(this.refreshHandle);
      this.refreshHandle = null;
    }
  }

  private setupVisibilityListener(): void {
    if (typeof document === 'undefined' || !document.addEventListener) return;

    this.visibilityHandler = () => {
      if (document.hidden) {
        this.pauseAutoRefresh();
      } else {
        this.startAutoRefresh();
        this.refresh(true);
      }
    };
    document.addEventListener('visibilitychange', this.visibilityHandler);
  }

  private fetchByCoords(lat: number, lon: number, label: string): void {
    this.state.update((s) => ({ ...s, loading: true, error: undefined, locationLabel: label }));

    forkJoin([
      this.api.getCurrentByCoords(lat, lon, this.state().units),
      this.api.getForecastByCoords(lat, lon, this.state().units),
    ])
      .pipe(
        catchError((err) => {
          this.state.update((s) => ({ ...s, loading: false, error: this.describeError(err) }));
          return of(null);
        }),
      )
      .subscribe((data) => {
        if (!data) return;
        const [current, forecast] = data;
        const resolvedLabel = `${forecast.city?.name ?? label}, ${forecast.city?.country ?? ''}`;
        this.lastQuery = {
          type: 'coords',
          value: resolvedLabel,
          label: resolvedLabel,
          coords: { lat, lon },
        };
        this.setStateFromApis(current, forecast, resolvedLabel);
      });
  }

  private setStateFromApis(
    currentRaw: CurrentResponse,
    forecastRaw: ForecastResponse,
    locationLabel: string,
  ): void {
    const current = this.mapCurrent(currentRaw);
    const hourly = this.mapHourly(forecastRaw);
    const daily = this.mapDaily(forecastRaw);
    this.state.set({
      ...this.state(),
      current,
      hourly,
      daily,
      loading: false,
      error: undefined,
      lastRefreshed: new Date(),
      locationLabel,
    });
  }

  private mapCurrent(raw: CurrentResponse): CurrentConditions {
    return {
      city: raw?.name ?? this.state().locationLabel,
      country: raw?.sys?.country ?? '',
      temperature: raw?.main?.temp ?? 0,
      feelsLike: raw?.main?.feels_like ?? 0,
      description: raw?.weather?.[0]?.description ?? '',
      iconCode: iconForCode(raw?.weather?.[0]?.icon),
      humidity: raw?.main?.humidity ?? 0,
      windSpeed: raw?.wind?.speed ?? 0,
      timestamp: new Date(raw?.dt * 1000),
    };
  }

  private mapHourly(raw: ForecastResponse): ForecastPeriod[] {
    if (!raw?.list) return [];

    return raw.list.slice(0, environment.maxHourlyPeriods).map((entry) => ({
      time: new Date(entry.dt * 1000),
      temperature: entry.main?.temp ?? 0,
      description: entry.weather?.[0]?.description ?? '',
      iconCode: iconForCode(entry.weather?.[0]?.icon),
    }));
  }

  private mapDaily(raw: ForecastResponse): DailyForecast[] {
    if (!raw?.list) return [];

    const groups = new Map<string, ForecastResponse['list']>();

    raw.list.forEach((entry) => {
      const key = new Date(entry.dt * 1000).toISOString().split('T')[0];
      const group = groups.get(key) ?? [];
      group.push(entry);
      groups.set(key, group);
    });

    return Array.from(groups.entries())
      .slice(0, environment.maxDailyPeriods)
      .map(([date, entries]) => {
        const temps = entries
          .map((e) => e.main?.temp)
          .filter((t): t is number => typeof t === 'number');

        if (!temps.length) return null;

        const minTemp = Math.min(...temps);
        const maxTemp = Math.max(...temps);

        // Choose the midpoint entry to approximate midday conditions (i.e. not at night)
        const mid = entries[Math.floor(entries.length / 2)];

        return {
          date: new Date(date),
          minTemp,
          maxTemp,
          description: mid.weather?.[0]?.description ?? '',
          iconCode: iconForCode(mid.weather?.[0]?.icon),
        } as DailyForecast;
      })
      .filter((d): d is DailyForecast => d !== null);
  }

  private describeError(err: unknown): string {
    if (err instanceof HttpErrorResponse) {
      if (err.status === 0) return 'Network error: please check your connection.';
      if (err.status === 401) return 'Unauthorized: check your API key.';
      if (err.status === 404) return 'Location not found. Try another city name.';
      if (err.status === 429) return 'Rate limit exceeded. Please try again in a moment.';
      if (err.status >= 500) return 'Weather service is unavailable. Please retry later.';

      return err.message || 'Request failed.';
    }

    const geoError = err as Partial<GeolocationPositionError>;
    if (typeof geoError?.code === 'number') {
      if (geoError.code === 1) return 'Location permission denied.';
      if (geoError.code === 2) return 'Location unavailable. Check your signal or device settings.';
      if (geoError.code === 3) return 'Location request timed out. Please try again.';
    }

    if (err instanceof Error) return err.message;

    return 'Unable to fetch weather right now.';
  }

  private readStoredUnits(): Units | null {
    if (typeof localStorage === 'undefined') return null;

    const stored = localStorage.getItem(this.storageKeyUnits);

    if (stored === 'metric' || stored === 'imperial') return stored;

    return null;
  }

  private writeStoredUnits(units: Units): void {
    if (typeof localStorage === 'undefined') return;

    localStorage.setItem(this.storageKeyUnits, units);
  }
}
