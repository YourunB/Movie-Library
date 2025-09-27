import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MoviePage } from './movie.page';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TranslateModule } from '@ngx-translate/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, BrowserModule } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { of, BehaviorSubject } from 'rxjs';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { AuthService } from '../../shared/services/auth.service';
import { TmdbMovie } from '../../../models/dashboard';
import { WritableSignal, signal } from '@angular/core';

interface AppState {
  dashboard: unknown;
}

describe('MoviePage', () => {
  let fixture: ComponentFixture<MoviePage>;
  let component: MoviePage;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        BrowserModule,
        MoviePage,
        HttpClientTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        {
          provide: ActivatedRoute,
          useValue: {
            paramMap: of(new Map([['id', '1']])),
          },
        },
        {
          provide: Store,
          useValue: {
            select: () => of({ id: 1, title: 'Matrix' } as TmdbMovie),
            dispatch: (() => undefined) as unknown as Store<AppState>['dispatch'],
          },
        },
        {
          provide: TmdbService,
          useFactory: () => {
            const sanitizer = TestBed.inject(DomSanitizer);
            return {
              langRequests: signal('en') as WritableSignal<string>,
              getMovieById: () =>
                of({
                  id: 1,
                  title: 'Matrix',
                  poster_path: '/poster.jpg',
                  release_date: '1999-03-31',
                  overview: 'A computer hacker learns about the true nature of reality.',
                }),
              getMovieVideos: () =>
                of({
                  id: 1,
                  results: [
                    {
                      key: 'abc123',
                      site: 'YouTube',
                      type: 'Trailer',
                      name: 'Official Trailer',
                    },
                  ],
                }),
              getMovieCredits: () =>
                of({
                  id: 1,
                  cast: [
                    {
                      id: 101,
                      name: 'Keanu Reeves',
                      character: 'Neo',
                      profile_path: '/keanu.jpg',
                    },
                  ],
                  crew: [],
                }),
              img: (path: string) => `https://image.tmdb.org/t/p/w342${path}`,
              sanitizeTrailerUrl: (key: string) =>
                sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${key}`),
            } as Partial<TmdbService>;
          },
        },
        {
          provide: WatchlistService,
          useValue: {
            isMovieInWatchlist: () => of(false),
            addMovie: (movie: TmdbMovie) => {
              void movie;
            },
            removeMovie: (movieId: number) => {
              void movieId;
            },
          },
        },
        
        {
          provide: AuthService,
          useValue: {
            authenticatedSubject: new BehaviorSubject<boolean>(true),
          },
        },
      ],
    });

    fixture = TestBed.createComponent(MoviePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should not throw when toggleFavorite is called', () => {
    const movie: TmdbMovie = {
      id: 1,
      title: 'Matrix',
      poster_path: '/poster.jpg',
      release_date: '1999-03-31',
      overview: '',
    };
    const event = new Event('click');
    expect(() => component.toggleFavorite(event, movie)).not.toThrow();
  });

  it('should emit cast with at least one actor', (done) => {
    component.cast$.subscribe((cast) => {
      expect(cast.length).toBeGreaterThan(0);
      done();
    });
  });
});
