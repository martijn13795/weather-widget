import { CommonModule } from '@angular/common';
import { Component, input } from '@angular/core';
import { CurrentConditions, Units } from '../../core/weather.models';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current.component.html',
  styleUrls: ['./current.component.scss'],
})
export class CurrentComponent {
  readonly current = input.required<CurrentConditions>();
  readonly units = input<Units>('metric');
  readonly loading = input(false);

  get unitsSymbol(): string {
    return this.units() === 'metric' ? 'C' : 'F';
  }

  get windUnit(): string {
    return this.units() === 'metric' ? 'm/s' : 'mph';
  }
}
