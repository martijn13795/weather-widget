import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { DailyForecast } from '../../../core/weather.models';

@Component({
  selector: 'app-daily-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './daily-forecast.component.html',
})
export class DailyForecastComponent {
  readonly days = input<DailyForecast[]>([]);
}
