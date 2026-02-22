import { TestBed } from '@angular/core/testing';
import { HttpErrorResponse } from '@angular/common/http';
import { of, throwError } from 'rxjs';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { environment } from '../../environments/environment';
import { GeolocationService } from './geolocation.service';
import { CurrentResponse, ForecastResponse, WeatherApiService } from './weather-api.service';
import { WeatherStore } from './weather.store';
import { WeatherState } from './weather.models';

const baseCurrent = (name: string): CurrentResponse => ({
  name,
  sys: { country: 'NL' },
  dt: 1700000000,
  main: { temp: 12, feels_like: 11, humidity: 75 },
  weather: [{ description: 'Cloudy', icon: '03d' }],
  wind: { speed: 3 },
  coord: { lat: 52, lon: 4 },
});

const baseForecast = (name: string): ForecastResponse => ({
  city: { name, country: 'NL', coord: { lat: 52, lon: 4 } },
  list: Array.from({ length: 10 }).map((_, idx) => {
    const dt = 1700000000 + idx * 10800; // 3h increments
    return {
      dt,
      main: {
        temp: 10 + idx,
        feels_like: 9 + idx,
        humidity: 70,
        temp_min: 10 + idx,
        temp_max: 10 + idx,
      },
      weather: [{ description: 'Cloudy', icon: idx % 2 === 0 ? '03d' : '04d' }],
      wind: { speed: 3 + idx },
    };
  }),
});

class WeatherApiServiceMock {
  getCurrentByCity = vi.fn((city: string, _units: string) => of(baseCurrent(city)));
  getForecastByCity = vi.fn((city: string, _units: string) => of(baseForecast(city)));
  getCurrentByCoords = vi.fn((_lat: number, _lon: number, _units: string) =>
    of(baseCurrent('Coords')),
  );
  getForecastByCoords = vi.fn((_lat: number, _lon: number, _units: string) =>
    of(baseForecast('Coords')),
  );
  reset(): void {
    this.getCurrentByCity.mockClear();
    this.getForecastByCity.mockClear();
    this.getCurrentByCoords.mockClear();
    this.getForecastByCoords.mockClear();
  }
}

class GeolocationServiceMock {
  fail = false;
  code: number | undefined = undefined;
  available = true;
  canUse(): boolean {
    return this.available;
  }
  async getCurrentPosition() {
    if (this.fail) {
      return Promise.reject({ code: this.code } as GeolocationPositionError);
    }
    return { latitude: 52.1, longitude: 4.3 };
  }
}

describe('WeatherStore', () => {
  let store: WeatherStore;
  let apiMock: WeatherApiServiceMock;
  let storageMock: Storage;
  afterEach(() => vi.restoreAllMocks());

  beforeEach(() => {
    storageMock = (() => {
      const data = new Map<string, string>();
      return {
        get length() {
          return data.size;
        },
        clear: () => data.clear(),
        getItem: (key: string) => (data.has(key) ? data.get(key)! : null),
        key: (index: number) => Array.from(data.keys())[index] ?? null,
        removeItem: (key: string) => data.delete(key),
        setItem: (key: string, value: string) => data.set(key, value),
      } satisfies Storage;
    })();
    vi.stubGlobal('localStorage', storageMock);
    vi.useFakeTimers();
    vi.setSystemTime(new Date('2024-01-01T00:00:00Z'));
    apiMock = new WeatherApiServiceMock();
    TestBed.configureTestingModule({
      providers: [
        WeatherStore,
        { provide: WeatherApiService, useValue: apiMock },
        { provide: GeolocationService, useClass: GeolocationServiceMock },
      ],
    });
    store = TestBed.inject(WeatherStore);
    apiMock.reset();
  });

  it('loads by city and maps current, hourly, and daily data', () => {
    store.loadByCity('Paris');

    const vm: WeatherState = store.vm();
    expect(apiMock.getCurrentByCity).toHaveBeenCalledWith('Paris', 'metric');
    expect(apiMock.getForecastByCity).toHaveBeenCalledWith('Paris', 'metric');
    expect(vm.locationLabel).toContain('Paris');
    expect(vm.current?.temperature).toBe(12);
    expect(vm.hourly.length).toBeGreaterThan(0);
    expect(vm.daily.length).toBeGreaterThan(0);
  });

  it('refreshes with new units and re-fetches data', () => {
    store.loadByCity('Paris');
    apiMock.reset();

    store.setUnits('imperial');

    expect(apiMock.getCurrentByCity).toHaveBeenCalledWith('Paris', 'imperial');
    expect(apiMock.getForecastByCity).toHaveBeenCalledWith('Paris', 'imperial');
    expect(store.vm().units).toBe('imperial');
    expect(localStorage.getItem('weather.units')).toBe('imperial');
  });

  it('loads by geolocation when available', async () => {
    await store.loadByGeolocation();

    expect(apiMock.getCurrentByCoords).toHaveBeenCalled();
    expect(apiMock.getForecastByCoords).toHaveBeenCalled();
    expect(store.vm().locationLabel).toContain(',');
    expect(store.vm().hourly.length).toBeGreaterThan(0);
  });

  it('returns an empty daily forecast when temps are missing', () => {
    const emptyTempForecast: ForecastResponse = {
      city: { name: 'Paris', country: 'FR', coord: { lat: 0, lon: 0 } },
      list: [
        {
          dt: 1700000000,
          main: {
            temp: undefined as unknown as number,
            feels_like: undefined as unknown as number,
            humidity: undefined as unknown as number,
            temp_min: undefined as unknown as number,
            temp_max: undefined as unknown as number,
          },
          weather: [{ description: 'Cloudy', icon: '03d' }],
          wind: { speed: 1 },
        },
      ],
    };

    apiMock.getForecastByCity.mockReturnValue(of(emptyTempForecast));

    store.loadByCity('Paris');

    expect(store.vm().daily).toEqual([]);
  });

  it('sets a helpful error when city is not found (404)', () => {
    apiMock.getCurrentByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })),
    );
    apiMock.getForecastByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 404, statusText: 'Not Found' })),
    );

    store.loadByCity('NowhereLand');

    expect(store.vm().error).toBe('Location not found. Try another city name.');
    expect(store.vm().loading).toBe(false);
  });

  it('surfaces geolocation permission denied', async () => {
    const geo = TestBed.inject(GeolocationService) as GeolocationServiceMock;
    geo.fail = true;
    geo.code = 1;

    await store.loadByGeolocation();

    expect(store.vm().error).toBe('Location permission denied.');
    expect(store.vm().loading).toBe(false);
  });

  it('skips refresh when called within interval', () => {
    store.loadByCity('Paris');
    const last = store.vm().lastRefreshed?.getTime() ?? Date.now();
    vi.spyOn(Date, 'now').mockReturnValue(last + 1000);
    apiMock.reset();

    store.refresh();

    expect(apiMock.getCurrentByCity).not.toHaveBeenCalled();
    expect(apiMock.getForecastByCity).not.toHaveBeenCalled();
  });

  it('does nothing when city input is empty', () => {
    apiMock.reset();
    store.loadByCity('   ');
    expect(apiMock.getCurrentByCity).not.toHaveBeenCalled();
    expect(apiMock.getForecastByCity).not.toHaveBeenCalled();
  });

  it('reports geolocation availability', () => {
    const geo = TestBed.inject(GeolocationService) as GeolocationServiceMock;
    geo.available = false;
    expect(store.canGeolocate()).toBe(false);
    geo.available = true;
    expect(store.canGeolocate()).toBe(true);
  });

  it('refreshes via coords when last query was geolocation', async () => {
    await store.loadByGeolocation();
    apiMock.reset();

    store.refresh(true);

    expect(apiMock.getCurrentByCoords).toHaveBeenCalledWith(52.1, 4.3, 'metric');
    expect(apiMock.getForecastByCoords).toHaveBeenCalledWith(52.1, 4.3, 'metric');
  });

  it('maps empty forecast safely through loadByCity', () => {
    apiMock.getForecastByCity.mockReturnValue(
      of({ city: { name: 'Paris', country: 'FR', coord: { lat: 0, lon: 0 } } } as ForecastResponse),
    );
    store.loadByCity('Paris');
    expect(store.vm().hourly).toEqual([]);
    expect(store.vm().daily).toEqual([]);
  });

  it('surfaces different HTTP errors via public API', () => {
    apiMock.getCurrentByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Offline' })),
    );
    apiMock.getForecastByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 0, statusText: 'Offline' })),
    );
    store.loadByCity('Paris');
    expect(store.vm().error).toContain('Network error');

    apiMock.getCurrentByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
    );
    apiMock.getForecastByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 401, statusText: 'Unauthorized' })),
    );
    store.loadByCity('Paris');
    expect(store.vm().error).toContain('Unauthorized');

    apiMock.getCurrentByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429, statusText: 'Too Many' })),
    );
    apiMock.getForecastByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 429, statusText: 'Too Many' })),
    );
    store.loadByCity('Paris');
    expect(store.vm().error).toContain('Rate limit');

    apiMock.getCurrentByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server' })),
    );
    apiMock.getForecastByCity.mockReturnValue(
      throwError(() => new HttpErrorResponse({ status: 500, statusText: 'Server' })),
    );
    store.loadByCity('Paris');
    expect(store.vm().error).toContain('unavailable');
  });

  it('restores persisted units from localStorage', () => {
    storageMock.setItem('weather.units', 'imperial');

    const freshStore = TestBed.runInInjectionContext(() => new WeatherStore());
    expect(freshStore.vm().units).toBe('imperial');
  });

  it('auto-refreshes on interval', () => {
    apiMock.reset();
    vi.advanceTimersByTime(environment.autoUpdateIntervalMs + 100);
    expect(apiMock.getCurrentByCity).toHaveBeenCalled();
    expect(apiMock.getForecastByCity).toHaveBeenCalled();
  });

  it('pauses auto-refresh when document becomes hidden', () => {
    apiMock.reset();
    const original = Object.getOwnPropertyDescriptor(document, 'hidden');
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });

    document.dispatchEvent(new Event('visibilitychange'));
    vi.advanceTimersByTime(environment.autoUpdateIntervalMs + 100);

    expect(apiMock.getCurrentByCity).not.toHaveBeenCalled();
    expect(apiMock.getForecastByCity).not.toHaveBeenCalled();

    if (original) {
      Object.defineProperty(document, 'hidden', original);
    }
  });

  it('resumes auto-refresh with immediate fetch when document becomes visible', () => {
    apiMock.reset();
    const original = Object.getOwnPropertyDescriptor(document, 'hidden');
    Object.defineProperty(document, 'hidden', { value: true, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));
    apiMock.reset();

    Object.defineProperty(document, 'hidden', { value: false, configurable: true });
    document.dispatchEvent(new Event('visibilitychange'));

    expect(apiMock.getCurrentByCity).toHaveBeenCalled();
    expect(apiMock.getForecastByCity).toHaveBeenCalled();

    vi.advanceTimersByTime(environment.autoUpdateIntervalMs + 100);
    expect(apiMock.getCurrentByCity).toHaveBeenCalledTimes(2);
    expect(apiMock.getForecastByCity).toHaveBeenCalledTimes(2);

    if (original) {
      Object.defineProperty(document, 'hidden', original);
    }
  });
});
