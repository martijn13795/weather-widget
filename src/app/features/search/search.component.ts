import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <form class="search" (ngSubmit)="submit()" role="search">
      <label class="sr-only" for="city-input">Search city</label>
      <input
        id="city-input"
        name="city"
        type="text"
        [(ngModel)]="city"
        placeholder="Search city (e.g. Emmen)"
        [disabled]="loading"
        required
      />
      <button type="submit" [disabled]="loading">Search</button>
      <button
        type="button"
        class="ghost"
        (click)="useGeolocation.emit()"
        [disabled]="!geolocationAvailable || loading"
      >
        Use my location
      </button>
    </form>
  `,
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent {
  @Input() loading = false;
  @Input() geolocationAvailable = false;
  @Output() citySearch = new EventEmitter<string>();
  @Output() useGeolocation = new EventEmitter<void>();

  city = '';

  submit(): void {
    const trimmed = this.city.trim();

    if (!trimmed) return;

    this.citySearch.emit(trimmed);
  }
}
