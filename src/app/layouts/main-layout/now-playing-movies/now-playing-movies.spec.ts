import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NowPlayingMovies } from './now-playing-movies';

describe('NowPlayingMovies', () => {
  let component: NowPlayingMovies;
  let fixture: ComponentFixture<NowPlayingMovies>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NowPlayingMovies]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NowPlayingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
