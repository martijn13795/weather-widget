import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { environment } from '../../environments/environment';
import { WeatherApiService } from './weather-api.service';

describe('WeatherApiService', () => {
  let service: WeatherApiService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ imports: [HttpClientTestingModule] });
    service = TestBed.inject(WeatherApiService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('requests current weather by city with units and api key', () => {
    service.getCurrentByCity('Amsterdam', 'metric').subscribe();

    const req = httpMock.expectOne((r) => r.url.startsWith(`${environment.apiBaseUrl}/weather`));
    expect(req.request.method).toBe('GET');
    const search = new URL(req.request.urlWithParams).searchParams;
    expect(search.get('q')).toBe('Amsterdam');
    expect(search.get('units')).toBe('metric');
    expect(search.get('appid')).toBe(environment.apiKey);
    req.flush({});
  });

  it('requests forecast by coordinates', () => {
    service.getForecastByCoords(52, 4, 'imperial').subscribe();

    const req = httpMock.expectOne((r) => r.url.startsWith(`${environment.apiBaseUrl}/forecast`));
    const search = new URL(req.request.urlWithParams).searchParams;
    expect(search.get('lat')).toBe('52');
    expect(search.get('lon')).toBe('4');
    expect(search.get('units')).toBe('imperial');
    expect(search.get('appid')).toBe(environment.apiKey);
    req.flush({});
  });
});
