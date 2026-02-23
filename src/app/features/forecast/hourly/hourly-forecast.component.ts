import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ForecastPeriod } from '../../../core/weather.models';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hourly-forecast.component.html',
})
export class HourlyForecastComponent {
  readonly periods = input<ForecastPeriod[]>([]);
}
