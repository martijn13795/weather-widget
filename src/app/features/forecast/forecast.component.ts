import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { DailyForecast, ForecastPeriod } from '../../core/weather.models';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  readonly hourly = input<ForecastPeriod[]>([]);
  readonly daily = input<DailyForecast[]>([]);
}
