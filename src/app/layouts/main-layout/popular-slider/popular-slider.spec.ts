import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { Store } from '@ngrx/store';
import { IconSetService } from '@coreui/icons-angular';
import { of } from 'rxjs';

import { PopularPeopleSlider } from './popular-slider';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';

describe('App > PopularPeopleSlider (template stub)', () => {
  let fixture: ComponentFixture<PopularPeopleSlider>;

  const mockPeople = [
    { id: 1, name: 'John Doe', profile_path: '/test.jpg', known_for_department: 'Acting', popularity: 85.5 },
    { id: 2, name: 'Jane Smith', profile_path: '/test2.jpg', known_for_department: 'Directing', popularity: 92.3 },
  ];

  let storeSpy: jasmine.SpyObj<Store>;
  let tmdbSpy: jasmine.SpyObj<TmdbService>;
  let breakpointSpy: jasmine.SpyObj<BreakpointObserver>;

  beforeEach(async () => {
    storeSpy = jasmine.createSpyObj('Store', ['select']);
    storeSpy.select.and.returnValue(of(mockPeople));

    tmdbSpy = jasmine.createSpyObj('TmdbService', ['img']);
    tmdbSpy.img.and.returnValue('https://image.tmdb.org/t/p/w185/test.jpg');

    breakpointSpy = jasmine.createSpyObj('BreakpointObserver', ['observe']);
    const defaultState: BreakpointState = { breakpoints: {}, matches: false };
    breakpointSpy.observe.and.returnValue(of(defaultState));

    await TestBed.configureTestingModule({
      imports: [PopularPeopleSlider],
      providers: [
        { provide: Store, useValue: storeSpy },
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: BreakpointObserver, useValue: breakpointSpy },
        { provide: IconSetService, useValue: { icons: {} } as IconSetService },
      ],
    })
      .overrideComponent(PopularPeopleSlider, { set: { template: '<div></div>' } })
      .compileComponents();

    fixture = TestBed.createComponent(PopularPeopleSlider);
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(fixture.componentInstance).toBeTruthy();
  });

  it('should initialize with default inputs', () => {
    const c = fixture.componentInstance;
    expect(c.title()).toBe('Popular People');
    expect(c.itemsPerSlide()).toBe(6);
    expect(c.source()).toBe('people');
  });

  it('should compute slides correctly', () => {
    const slides = fixture.componentInstance.slides();
    expect(Array.isArray(slides)).toBeTrue();
    expect(slides.length).toBe(1);
    expect(slides[0].length).toBe(2);
  });

  it('should track by index correctly', () => {
    expect(fixture.componentInstance.trackByIndex(0)).toBe(0);
  });

  it('should track by person id correctly', () => {
    expect(fixture.componentInstance.trackByPersonId(0, { id: 123 })).toBe(123);
  });

  it('should generate correct links', () => {
    const c = fixture.componentInstance;
    const p = { id: 1, name: 'John Doe' };
    expect(c.getPersonLink(p, 'tmdb')).toBe('https://www.themoviedb.org/person/1');
    expect(c.getPersonLink({ name: 'John Doe' }, 'tmdb')).toBe('https://www.themoviedb.org/search?query=John%20Doe');
    expect(c.getPersonLink({ id: 1, name: '' })).toBe('#');
    expect(c.getPersonLink({ id: 1 })).toBe('#');
  });

  it('should handle (max-width: 400px) -> 1', () => {
    breakpointSpy.observe.and.returnValue(of({
      breakpoints: { '(max-width: 400px)': true },
      matches: true,
    } as BreakpointState));
    fixture = TestBed.createComponent(PopularPeopleSlider);
    fixture.detectChanges();
    expect(fixture.componentInstance.itemsPerSlideSig()).toBe(1);
  });

  it('should handle (max-width: 576px) -> 2', () => {
    breakpointSpy.observe.and.returnValue(of({
      breakpoints: { '(max-width: 576px)': true },
      matches: true,
    } as BreakpointState));
    fixture = TestBed.createComponent(PopularPeopleSlider);
    fixture.detectChanges();
    expect(fixture.componentInstance.itemsPerSlideSig()).toBe(2);
  });

  it('should handle (max-width: 1200px) -> 5', () => {
    breakpointSpy.observe.and.returnValue(of({
      breakpoints: { '(max-width: 1200px)': true },
      matches: true,
    } as BreakpointState));
    fixture = TestBed.createComponent(PopularPeopleSlider);
    fixture.detectChanges();
    expect(fixture.componentInstance.itemsPerSlideSig()).toBe(5);
  });

  it('should default to 6 when no breakpoints match', () => {
    breakpointSpy.observe.and.returnValue(of({ breakpoints: {}, matches: false } as BreakpointState));
    fixture = TestBed.createComponent(PopularPeopleSlider);
    fixture.detectChanges();
    expect(fixture.componentInstance.itemsPerSlideSig()).toBe(6);
  });
});
