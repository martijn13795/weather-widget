import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SettingsComponent } from './settings.component';

describe('SettingsComponent', () => {
  let fixture: ComponentFixture<SettingsComponent>;
  let component: SettingsComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({ imports: [SettingsComponent] }).compileComponents();
    fixture = TestBed.createComponent(SettingsComponent);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('units', 'metric');
    fixture.detectChanges();
  });

  it('checks the metric radio when units is metric', () => {
    const metric = fixture.nativeElement.querySelector('input[value="metric"]') as HTMLInputElement;
    expect(metric.checked).toBe(true);
  });

  it('emits unit change when imperial is selected', () => {
    const emitted: string[] = [];
    component.unitsChange.subscribe((value) => emitted.push(value as string));

    const imperial = fixture.nativeElement.querySelector(
      'input[value="imperial"]',
    ) as HTMLInputElement;
    imperial.dispatchEvent(new Event('change'));

    expect(emitted).toEqual(['imperial']);
  });
});
