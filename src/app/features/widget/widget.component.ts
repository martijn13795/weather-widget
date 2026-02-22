import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WeatherStore } from '../../core/weather.store';
import { WeatherState } from '../../core/weather.models';
import { CurrentComponent } from '../current/current.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { SearchComponent } from '../search/search.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, CurrentComponent, ForecastComponent, SearchComponent, SettingsComponent],
  template: `
    <section class="widget">
      <header class="widget__header">
        <div>
          <p class="eyebrow">Weather widget</p>
          <h1>{{ vm.locationLabel }}</h1>
          <p class="meta" aria-live="polite">
            @if (vm.lastRefreshed) {
              <span>Updated {{ vm.lastRefreshed | date: 'shortTime' }}</span>
            } @else {
              <span>Loading latest data…</span>
            }
          </p>
        </div>
        <div class="header__actions">
          <button
            type="button"
            class="ghost"
            (click)="onRefresh()"
            [disabled]="vm.loading"
            aria-label="Refresh weather data"
          >
            Refresh
          </button>
        </div>
      </header>

      <div class="controls">
        <app-search
          (citySearch)="onCitySearch($event)"
          (useGeolocation)="onGeolocate()"
          [geolocationAvailable]="geolocationAvailable"
          [loading]="vm.loading"
        />
        <app-settings [units]="vm.units" (unitsChange)="onUnitsChange($event)" />
      </div>

      @if (vm.error) {
        <div class="alert" role="alert">{{ vm.error }}</div>
      }

      @if (vm.current) {
        <app-current [current]="vm.current" [units]="vm.units" [loading]="vm.loading" />
      }

      @if (vm.hourly.length || vm.daily.length) {
        <app-forecast [hourly]="vm.hourly" [daily]="vm.daily" />
      }
    </section>
  `,
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent {
  private readonly store = inject(WeatherStore);

  get vm(): WeatherState {
    return this.store.vm();
  }

  get geolocationAvailable() {
    return this.store.canGeolocate();
  }

  onCitySearch(city: string): void {
    this.store.loadByCity(city);
  }

  onGeolocate(): void {
    this.store.loadByGeolocation();
  }

  onUnitsChange(units: 'metric' | 'imperial'): void {
    this.store.setUnits(units);
  }

  onRefresh(): void {
    this.store.refresh();
  }
}
