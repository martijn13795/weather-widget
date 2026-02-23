import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { DailyForecast, ForecastPeriod } from '../../core/weather.models';
import { HourlyForecastComponent } from './hourly/hourly-forecast.component';
import { DailyForecastComponent } from './daily/daily-forecast.component';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule, HourlyForecastComponent, DailyForecastComponent],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  readonly hourly = input<ForecastPeriod[]>([]);
  readonly daily = input<DailyForecast[]>([]);
}
