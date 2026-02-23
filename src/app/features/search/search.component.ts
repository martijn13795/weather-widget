import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search.component.html',
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
