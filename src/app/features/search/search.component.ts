import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  readonly loading = input(false);
  readonly geolocationAvailable = input(false);
  readonly citySearch = output<string>();
  readonly useGeolocation = output<void>();

  city = '';

  submit(): void {
    const trimmed = this.city.trim();

    if (!trimmed) return;

    this.citySearch.emit(trimmed);
  }
}
