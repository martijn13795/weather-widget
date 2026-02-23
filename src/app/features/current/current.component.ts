import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { CurrentConditions, Units } from '../../core/weather.models';

@Component({
  selector: 'app-current',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './current.component.html',
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
