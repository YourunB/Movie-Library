import { ComponentFixture, TestBed } from '@angular/core/testing';
import { WatchlistPage } from './watchlist.page';
import { AuthService } from '../../shared/services/auth.service';
import { WatchlistSignalsStore } from '../../shared/services/watchlist-signals.store';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { of } from 'rxjs';

describe('WatchlistPage', () => {
  let fixture: ComponentFixture<WatchlistPage>;
  let component: WatchlistPage;

  const authServiceMock = {
    authenticatedSubject: of(true),
  };

  const watchlistSignalsMock = {
    favorites: () => [],
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    isInWatchlist: (_id: number) => true,
    toggle: jasmine.createSpy('toggle'),
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [WatchlistPage, TranslateModule.forRoot()],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: WatchlistSignalsStore, useValue: watchlistSignalsMock },
        { provide: WatchlistService, useValue: {} },
        { provide: TmdbService, useValue: {} },
        { provide: ActivatedRoute, useValue: {} },
      ],
    });

    fixture = TestBed.createComponent(WatchlistPage);
    component = fixture.componentInstance;
    component.title = 'watchlist.title';
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should call toggle on watchlistSignals when toggleFavorite is called', () => {
    const movie = {
      id: 1,
      title: 'Test Movie',
      poster_path: '/poster.jpg',
      release_date: '2025-01-01',
    };
    component.toggleFavorite(movie);
    expect(watchlistSignalsMock.toggle).toHaveBeenCalledWith(jasmine.objectContaining({ id: 1 }));
  });

  it('should expose isAuth$ as true from AuthService', (done) => {
    component.isAuth$.subscribe((value) => {
      expect(value).toBeTrue();
      done();
    });
  });
});
