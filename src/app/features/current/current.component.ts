import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CurrentConditions, Units } from '../../core/weather.models';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule],
  template: `
    <section class="card" aria-label="Current conditions">
      <div class="card__main">
        <div class="temp">
          <img [src]="current.iconCode" [alt]="current.description" />
          <div>
            <p class="label">Now</p>
            <h2>{{ current.temperature | number: '1.0-0' }}°{{ unitsSymbol }}</h2>
            <p class="desc">{{ current.description }}</p>
          </div>
        </div>
        <div class="meta">
          <p>Feels like: {{ current.feelsLike | number: '1.0-0' }}°{{ unitsSymbol }}</p>
          <p>Humidity: {{ current.humidity }}%</p>
          <p>Wind: {{ current.windSpeed | number: '1.0-0' }} {{ windUnit }}</p>
          <p>Updated: {{ current.timestamp | date: 'shortTime' }}</p>
        </div>
      </div>
    </section>
  `,
  styleUrls: ['./current.component.scss'],
})
export class CurrentComponent {
  @Input({ required: true }) current!: CurrentConditions;
  @Input() units: Units = 'metric';
  @Input() loading = false;

  get unitsSymbol(): string {
    return this.units === 'metric' ? 'C' : 'F';
  }

  get windUnit(): string {
    return this.units === 'metric' ? 'm/s' : 'mph';
  }
}
