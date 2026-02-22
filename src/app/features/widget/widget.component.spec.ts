import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { WeatherState } from '../../core/weather.models';
import { WidgetComponent } from './widget.component';
import { WeatherStore } from '../../core/weather.store';

class WeatherStoreStub {
  vmState: WeatherState = {
    current: {
      city: 'Groningen',
      country: 'NL',
      temperature: 12,
      feelsLike: 11,
      description: 'Cloudy',
      iconCode: '/icons/Cloud.svg',
      humidity: 70,
      windSpeed: 3,
      timestamp: new Date('2024-01-01T10:00:00Z'),
    },
    hourly: [],
    daily: [],
    units: 'metric',
    locationLabel: 'Groningen',
    loading: false,
    error: undefined,
    lastRefreshed: new Date('2024-01-01T10:00:00Z'),
  } as WeatherState;
  vm = vi.fn(() => this.vmState);
  canGeolocate = vi.fn().mockReturnValue(true);
  loadByCity = vi.fn();
  loadByGeolocation = vi.fn();
  setUnits = vi.fn();
  refresh = vi.fn();

  setVm(state: Partial<WeatherState>) {
    this.vmState = { ...this.vmState, ...state } as WeatherState;
  }
}

describe('WidgetComponent', () => {
  let fixture: ComponentFixture<WidgetComponent>;
  let store: WeatherStoreStub;

  beforeEach(async () => {
    store = new WeatherStoreStub();
    await TestBed.configureTestingModule({
      imports: [WidgetComponent],
      providers: [{ provide: WeatherStore, useValue: store }],
    }).compileComponents();

    fixture = TestBed.createComponent(WidgetComponent);
    fixture.detectChanges();
  });

  it('renders the location label', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('h1')?.textContent).toContain('Groningen');
  });

  it('shows error alert when error is present', () => {
    store.setVm({ error: 'Something went wrong', lastRefreshed: undefined });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.alert')?.textContent).toContain('Something went wrong');
  });

  it('shows loading meta when lastRefreshed is missing', () => {
    store.setVm({ lastRefreshed: undefined, loading: true });
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('.meta')?.textContent).toContain('Loading latest data');
    const refreshButton = compiled.querySelector('button.ghost') as HTMLButtonElement;
    expect(refreshButton.disabled).toBe(true);
  });

  it('triggers refresh handler', () => {
    const component = fixture.componentInstance;
    component.onRefresh();
    expect(store.refresh).toHaveBeenCalled();
  });

  it('delegates city search to the store', () => {
    const component = fixture.componentInstance;
    component.onCitySearch('Amsterdam');
    expect(store.loadByCity).toHaveBeenCalledWith('Amsterdam');
  });

  it('delegates geolocate to the store', () => {
    const component = fixture.componentInstance;
    component.onGeolocate();
    expect(store.loadByGeolocation).toHaveBeenCalled();
  });

  it('delegates unit change to the store', () => {
    const component = fixture.componentInstance;
    component.onUnitsChange('imperial');
    expect(store.setUnits).toHaveBeenCalledWith('imperial');
  });
});
