import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { WeatherStore } from '../../core/weather.store';
import { CurrentComponent } from '../current/current.component';
import { ForecastComponent } from '../forecast/forecast.component';
import { SearchComponent } from '../search/search.component';
import { SettingsComponent } from '../settings/settings.component';

@Component({
  selector: 'app-widget',
  standalone: true,
  imports: [CommonModule, CurrentComponent, ForecastComponent, SearchComponent, SettingsComponent],
  templateUrl: './widget.component.html',
  styleUrls: ['./widget.component.scss'],
})
export class WidgetComponent {
  private readonly store = inject(WeatherStore);

  readonly vm = this.store.vm;

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
