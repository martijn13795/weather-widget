import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { Units } from '../../core/weather.models';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsComponent {
  readonly units = input.required<Units>();
  readonly unitsChange = output<Units>();
}
