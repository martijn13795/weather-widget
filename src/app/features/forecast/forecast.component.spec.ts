import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ForecastComponent } from './forecast.component';
import { DailyForecast, ForecastPeriod } from '../../core/weather.models';

const sampleHourly: ForecastPeriod[] = [
  {
    time: new Date('2024-01-01T10:00:00Z'),
    temperature: 12,
    description: 'Clouds',
    iconCode: '/icons/Cloud.svg',
  },
  {
    time: new Date('2024-01-01T13:00:00Z'),
    temperature: 14,
    description: 'Sun',
    iconCode: '/icons/Sun.svg',
  },
];

const sampleDaily: DailyForecast[] = [
  {
    date: new Date('2024-01-02'),
    minTemp: 10,
    maxTemp: 15,
    description: 'Rain',
    iconCode: '/icons/Cloud-Drizzle.svg',
  },
];

describe('ForecastComponent', () => {
  let fixture: ComponentFixture<ForecastComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ForecastComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(ForecastComponent);
    fixture.componentInstance.hourly = sampleHourly;
    fixture.componentInstance.daily = sampleDaily;
    fixture.detectChanges();
  });

  it('renders hourly slots with icon alt text', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const slots = compiled.querySelectorAll('.hourly .slot');
    expect(slots.length).toBe(sampleHourly.length);
    expect(slots[0].querySelector('img')?.getAttribute('alt')).toBe('Clouds');
  });

  it('renders daily entries with temperatures and descriptions', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const days = compiled.querySelectorAll('.daily .day');
    expect(days.length).toBe(sampleDaily.length);
    expect(days[0].textContent).toContain('15°');
    expect(days[0].textContent).toContain('10°');
    expect(days[0].querySelector('img')?.getAttribute('alt')).toBe('Rain');
  });
});
