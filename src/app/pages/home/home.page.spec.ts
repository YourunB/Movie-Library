import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HomePage } from './home.page';
import { provideMockStore } from '@ngrx/store/testing';
import { Component, Input, Pipe, PipeTransform } from '@angular/core';

@Pipe({ name: 'translate', standalone: true })
class MockTranslatePipe implements PipeTransform {
  transform(value: string): string {
    return value;
  }
}

@Component({ selector: 'app-trading-movies', standalone: true, template: '' })
class MockTradingMovies {}

@Component({ selector: 'app-now-playing-movies', standalone: true, template: '' })
class MockNowPlayingMovies {}

@Component({ selector: 'app-upcoming-movies', standalone: true, template: '' })
class MockUpcomingMovies {}

@Component({ selector: 'app-popular-slider', standalone: true, template: '' })
class MockPopularSlider {}

@Component({ selector: 'app-todays-highlights', standalone: true, template: '' })
class MockTodaysHighlights {}

@Component({ selector: 'app-toggle-section', standalone: true, template: '' })
class MockToggleSectionComponent {
  @Input() primaryLabel!: string;
  @Input() secondaryLabel!: string;
  @Input() hint!: string;
}

describe('HomePage', () => {
  let fixture: ComponentFixture<HomePage>;
  let component: HomePage;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomePage],
      providers: [provideMockStore()],
    })
      .overrideComponent(HomePage, {
        set: {
          imports: [
            MockTradingMovies,
            MockNowPlayingMovies,
            MockUpcomingMovies,
            MockPopularSlider,
            MockTodaysHighlights,
            MockToggleSectionComponent,
            MockTranslatePipe,
          ],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(HomePage);
    component = fixture.componentInstance;
    component.title = 'home.title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should increase counter', () => {
    component.counter = 0;
    component.onCounterIncreased();
    expect(component.counter).toBe(1);
  });

  it('should decrease counter', () => {
    component.counter = 5;
    component.onCounterDecreased();
    expect(component.counter).toBe(4);
  });

  it('should change counter to new value', () => {
    component.onCounterChanged(42);
    expect(component.counter).toBe(42);
  });
});
