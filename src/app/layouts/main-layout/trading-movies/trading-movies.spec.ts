import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TradingMovies } from './trading-movies';

describe('TradingMovies', () => {
  let component: TradingMovies;
  let fixture: ComponentFixture<TradingMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TradingMovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TradingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
