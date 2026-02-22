import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Units } from '../../core/weather.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="settings" role="group" aria-label="Unit settings">
      <label class="toggle">
        <input
          type="radio"
          name="units"
          value="metric"
          [checked]="units === 'metric'"
          (change)="unitsChange.emit('metric')"
        />
        °C
      </label>
      <label class="toggle">
        <input
          type="radio"
          name="units"
          value="imperial"
          [checked]="units === 'imperial'"
          (change)="unitsChange.emit('imperial')"
        />
        °F
      </label>
    </div>
  `,
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  @Input({ required: true }) units!: Units;
  @Output() unitsChange = new EventEmitter<Units>();
}
