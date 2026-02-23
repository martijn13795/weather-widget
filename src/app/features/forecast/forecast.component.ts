import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DailyForecast, ForecastPeriod } from '../../core/weather.models';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './forecast.component.html',
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  @Input() hourly: ForecastPeriod[] = [];
  @Input() daily: DailyForecast[] = [];
}
