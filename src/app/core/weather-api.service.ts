import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { Units } from './weather.models';
import { CurrentResponse, ForecastResponse } from './weather-api.models';

@Injectable({ providedIn: 'root' })
export class WeatherApiService {
  private readonly http = inject(HttpClient);

  getCurrentByCity(city: string, units: Units): Observable<CurrentResponse> {
    return this.http.get<CurrentResponse>(this.buildUrl('/weather', { q: city, units }));
  }

  getCurrentByCoords(lat: number, lon: number, units: Units): Observable<CurrentResponse> {
    return this.http.get<CurrentResponse>(this.buildUrl('/weather', { lat, lon, units }));
  }

  getForecastByCity(city: string, units: Units): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(this.buildUrl('/forecast', { q: city, units }));
  }

  getForecastByCoords(lat: number, lon: number, units: Units): Observable<ForecastResponse> {
    return this.http.get<ForecastResponse>(this.buildUrl('/forecast', { lat, lon, units }));
  }

  private buildUrl(
    path: string,
    params: { q?: string; lat?: number; lon?: number; units: Units },
  ): string {
    const base = `${environment.apiBaseUrl}${path}`;
    const url = new URL(base);

    Object.entries(params)
      .filter(([_key, value]) => value !== undefined && value !== null)
      .forEach(([key, value]) => url.searchParams.set(key, String(value)));

    url.searchParams.set('appid', environment.apiKey);

    return url.toString();
  }
}
