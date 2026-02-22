import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { DailyForecast, ForecastPeriod } from '../../core/weather.models';

@Component({
  selector: 'app-forecast',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" aria-label="Forecast">
      <h3>Next hours</h3>
      <div class="hourly" role="list">
        @for (period of hourly; track $index) {
          <div class="slot" role="listitem">
            <p class="time">{{ period.time | date: 'shortTime' }}</p>
            <img [src]="period.iconCode" [alt]="period.description" />
            <p class="temp">{{ period.temperature | number: '1.0-0' }}°</p>
            <p class="desc">{{ period.description }}</p>
          </div>
        }
      </div>
    </section>

    <section class="card" aria-label="Daily forecast">
      <h3>Next days</h3>
      <div class="daily" role="list">
        @for (day of daily; track $index) {
          <div class="day" role="listitem">
            <div class="day__label">
              <p class="date">{{ day.date | date: 'EEE' }}</p>
              <p class="date muted">{{ day.date | date: 'MMM d' }}</p>
            </div>
            <div class="day__temps">
              <span class="max">{{ day.maxTemp | number: '1.0-0' }}°</span>
              <span class="min">{{ day.minTemp | number: '1.0-0' }}°</span>
            </div>
            <div class="day__icon">
              <img [src]="day.iconCode" [alt]="day.description" />
              <p class="desc">{{ day.description }}</p>
            </div>
          </div>
        }
      </div>
    </section>
  `,
  styleUrls: ['./forecast.component.scss'],
})
export class ForecastComponent {
  @Input() hourly: ForecastPeriod[] = [];
  @Input() daily: DailyForecast[] = [];
}
