import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { ForecastPeriod } from '../../../core/weather.models';

@Component({
  selector: 'app-hourly-forecast',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hourly-forecast.component.html',
  styleUrls: ['./hourly-forecast.component.scss'],
})
export class HourlyForecastComponent {
  readonly periods = input<ForecastPeriod[]>([]);
}
