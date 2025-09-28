import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GalleryPage } from './gallery.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, of } from 'rxjs';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { AuthService } from '../../shared/services/auth.service';
import { TmdbMovie } from '../../../models/dashboard';
import { WritableSignal, signal } from '@angular/core';

describe('GalleryPage', () => {
  let fixture: ComponentFixture<GalleryPage>;
  let component: GalleryPage;

  beforeEach(() => {
    const activatedRouteStub = {
      queryParamMap: of(new Map([['q', 'Matrix']])),
    };

    const tmdbServiceStub: Partial<TmdbService> = {
      langRequests: signal('en') as WritableSignal<string>,
      searchMovies: () =>
        of({
          page: 1,
          results: [{ id: 1, title: 'Matrix' }] as TmdbMovie[],
          total_pages: 1,
          total_results: 1,
        }),
    };

    const watchlistServiceStub: Partial<WatchlistService> = {
      isMovieInWatchlist: () => of(false),
      addMovie: () => void 0,
      removeMovie: () => void 0,
    };

    const authServiceStub: Partial<AuthService> = {
      authenticatedSubject: new BehaviorSubject<boolean>(true),
    };

    TestBed.configureTestingModule({
      imports: [
        GalleryPage,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        { provide: ActivatedRoute, useValue: activatedRouteStub },
        { provide: TmdbService, useValue: tmdbServiceStub },
        { provide: WatchlistService, useValue: watchlistServiceStub },
        { provide: AuthService, useValue: authServiceStub },
      ],
    });

    fixture = TestBed.createComponent(GalleryPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have 6 skeletons by default', () => {
    expect(component.skeletons.length).toBe(6);
  });

  it('should not throw when toggleFavorite is called', () => {
    const movie = {
      id: 1,
      title: 'Matrix',
      poster_path: '',
      release_date: '',
    };
    expect(() => component.toggleFavorite(movie)).not.toThrow();
  });
});
