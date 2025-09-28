import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component } from '@angular/core';
import { MovieCardComponent, MovieCardModel } from './movie-card';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ActivatedRoute } from '@angular/router';

@Component({
  standalone: true,
  imports: [MovieCardComponent],
  template: `
    <app-movie-card
      [movie]="movie"
      [posterUrl]="posterUrl"
      [showFavorite]="showFavorite"
      [variant]="variant"
      (favorite)="onFavorite($event)"
    />
  `,
})
class HostComponent {
  movie: MovieCardModel = {
    id: 1,
    title: 'Test Movie',
    poster_path: null,
    release_date: '2025-09-28',
    inWatchlist: true,
  };
  posterUrl = 'images/placeholder.jpg';
  showFavorite = true;
  variant: 'default' | 'compact' | 'watchlist' = 'default';

  favoriteEvent: MovieCardModel | null = null;
  onFavorite(movie: MovieCardModel) {
    this.favoriteEvent = movie;
  }
}

describe('MovieCardComponent (via host)', () => {
  let fixture: ComponentFixture<HostComponent>;
  let host: HostComponent;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HostComponent, RouterTestingModule],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            snapshot: {},
          },
        },
      ],
    });

    fixture = TestBed.createComponent(HostComponent);
    host = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should render movie title', () => {
    const titleEl = fixture.debugElement.query(By.css('.title'));
    expect(titleEl.nativeElement.textContent).toContain('Test Movie');
  });

  it('should emit favorite event on icon click', () => {
    const iconEl = fixture.debugElement.query(By.css('.favorite-icon'));
    iconEl.triggerEventHandler('click', new Event('click'));
    expect(host.favoriteEvent).toEqual(host.movie);
  });
});
