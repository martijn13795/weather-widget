import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { CurrentComponent } from './current.component';
import { CurrentConditions } from '../../core/weather.models';

const mockCurrent: CurrentConditions = {
  city: 'Groningen',
  country: 'NL',
  temperature: 12,
  feelsLike: 11,
  description: 'Cloudy',
  iconCode: '/icons/Cloud.svg',
  humidity: 70,
  windSpeed: 3,
  timestamp: new Date('2024-01-01T10:00:00Z'),
};

describe('CurrentComponent', () => {
  let fixture: ComponentFixture<CurrentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CurrentComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(CurrentComponent);
    fixture.componentInstance.current = mockCurrent;
    fixture.detectChanges();
  });

  it('renders temperature, description, and icon alt text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('12°');
    expect(compiled.textContent).toContain('Cloudy');
    expect(compiled.querySelector('img')?.getAttribute('alt')).toBe('Cloudy');
  });

  it('shows metric units by default and wind in m/s', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('Feels like: 11°C');
    expect(compiled.textContent).toContain('Wind: 3 m/s');
  });

  it('uses imperial units when selected', () => {
    const imperialFixture = TestBed.createComponent(CurrentComponent);
    imperialFixture.componentInstance.current = mockCurrent;
    imperialFixture.componentInstance.units = 'imperial';
    imperialFixture.detectChanges();

    const compiled = imperialFixture.nativeElement as HTMLElement;
    expect(compiled.textContent).toContain('°F');
    expect(compiled.textContent).toContain('mph');
  });
});
