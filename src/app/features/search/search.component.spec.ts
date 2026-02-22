import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { SearchComponent } from './search.component';

describe('SearchComponent', () => {
  let fixture: ComponentFixture<SearchComponent>;
  let component: SearchComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('rejects empty or whitespace-only searches', () => {
    const emitted: string[] = [];
    component.citySearch.subscribe((value) => emitted.push(value));

    component.city = '   ';
    component.submit();

    expect(emitted.length).toBe(0);
  });

  it('emits citySearch for a valid trimmed city', () => {
    const emitted: string[] = [];
    component.citySearch.subscribe((value) => emitted.push(value));

    component.city = '  Emmen  ';
    component.submit();

    expect(emitted).toEqual(['Emmen']);
  });
});
