import { TestBed, ComponentFixture, fakeAsync, tick } from '@angular/core/testing';
import { MoviePage } from './movie.page';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { BehaviorSubject, Observable, of, Subscription, take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { AuthService } from '../../shared/services/auth.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import {
  selectLoadingMovie,
  selectSelectedMovie,
} from '../../../store/dashboard/dashboard.selectors';
import { loadMovieById } from '../../../store/dashboard/dashboard.actions';
import { TmdbMovie, TmdbVideo } from '../../../models/dashboard';
import { signal, WritableSignal } from '@angular/core';
import { TranslateLoader, TranslateModule, TranslationObject } from '@ngx-translate/core';

class FakeLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    if (!lang) { /* lint noop */ }
    return of({} as TranslationObject);
  }
}

describe('MoviePage', () => {
  let store: MockStore;
  let fixture: ComponentFixture<MoviePage>;
  let component: MoviePage;

  let tmdb: jasmine.SpyObj<
    Pick<
      TmdbService,
      'getMovieById' | 'getMovieVideos' | 'getMovieCredits' | 'img'
    > & { langRequests: WritableSignal<string> }
  >;

  let watchlist: jasmine.SpyObj<
    Pick<WatchlistService, 'isMovieInWatchlist' | 'addMovie' | 'removeMovie'>
  >;

  const authSubject = new BehaviorSubject<boolean>(true);
  const authMock: Pick<AuthService, 'authenticatedSubject'> = {
    authenticatedSubject: authSubject,
  };

  const paramMap$ = new BehaviorSubject(convertToParamMap({ id: '42' }));

  const selectedMovie: TmdbMovie = {
    id: 42,
    title: 'Selected',
  } as TmdbMovie;

  beforeEach((): void => {
    const tmdbProps: Pick<TmdbService, 'langRequests'> = {
      langRequests: signal<string>('en-US') as WritableSignal<string>,
    };

    tmdb = jasmine.createSpyObj<
      Pick<
        TmdbService,
        'getMovieById' | 'getMovieVideos' | 'getMovieCredits' | 'img'
      > & { langRequests: WritableSignal<string> }
    >(
      'TmdbService',
      ['getMovieById', 'getMovieVideos', 'getMovieCredits', 'img'],
      tmdbProps
    );

    tmdb.getMovieById.and.returnValue(
      of({ id: 42, poster_path: '/p.jpg', title: 'Reloaded' } as TmdbMovie)
    );
    tmdb.getMovieVideos.and.returnValue(of({ id: 42, results: [] }));
    tmdb.getMovieCredits.and.returnValue(of({ id: 42, cast: [], crew: [] }));
    tmdb.img.and.callFake((p?: string | null, size?: string) =>
      p ? `https://img/${size ?? 'w500'}${p.startsWith('/') ? p : '/' + p}` : null
    );

    watchlist = jasmine.createSpyObj<
      Pick<WatchlistService, 'isMovieInWatchlist' | 'addMovie' | 'removeMovie'>
    >('WatchlistService', ['isMovieInWatchlist', 'addMovie', 'removeMovie']);
    watchlist.isMovieInWatchlist.and.returnValue(of(false));

    TestBed.configureTestingModule({
      imports: [
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: FakeLoader },
        }),
        MoviePage,
      ],
      providers: [
        provideMockStore({
          selectors: [
            { selector: selectSelectedMovie, value: null },
            { selector: selectLoadingMovie, value: false },
          ],
        }),
        { provide: TmdbService, useValue: tmdb },
        { provide: WatchlistService, useValue: watchlist },
        { provide: AuthService, useValue: authMock },
        { provide: ActivatedRoute, useValue: { paramMap: paramMap$.asObservable() } },
      ],
    });

    store = TestBed.inject(MockStore);
    fixture = TestBed.createComponent(MoviePage);
    component = fixture.componentInstance;
  });

  it('dispatches loadMovieById on init and when id changes', fakeAsync((): void => {
    spyOn(store, 'dispatch');

    fixture.detectChanges();

    (store.dispatch as jasmine.Spy).calls.reset();

    paramMap$.next(convertToParamMap({ id: '42' }));
    tick();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(loadMovieById({ id: '42' }));

    (store.dispatch as jasmine.Spy).calls.reset();

    paramMap$.next(convertToParamMap({ id: '7' }));
    tick();

    expect(store.dispatch).toHaveBeenCalledTimes(1);
    expect(store.dispatch).toHaveBeenCalledWith(loadMovieById({ id: '7' }));
  }));

  it('movie$ emits null when there is no selected movie', (): void => {
    fixture.detectChanges();
    component.movie$.pipe(take(1)).subscribe((m) => {
      expect(m).toBeNull();
    });
  });

  it('movie$ refetches full movie and maps poster when selected movie exists', (): void => {
    store.overrideSelector(selectSelectedMovie, selectedMovie);
    store.refreshState();
    fixture.detectChanges();

    tmdb.getMovieById.calls.reset();

    component.movie$.pipe(take(1)).subscribe((m) => {
      expect(m?.id).toBe(42);
      expect(tmdb.getMovieById).toHaveBeenCalledWith(42);
      expect(m?.poster_path).toBe('https://img/w342/p.jpg');
    });
  });

  it('movie$ uses placeholder when poster is missing or img() returns null', (): void => {
    store.overrideSelector(selectSelectedMovie, selectedMovie);
    store.refreshState();

    tmdb.getMovieById.and.returnValue(
      of({ id: 42, poster_path: null, title: 'NoPoster' } as TmdbMovie)
    );

    fixture.detectChanges();

    component.movie$.pipe(take(1)).subscribe((m) => {
      expect(m?.poster_path).toBe('assets/placeholder.jpg');
    });
  });

  it('reacts to language signal changes by re-calling TMDB endpoints (delta counts)', fakeAsync((): void => {
  store.overrideSelector(selectSelectedMovie, selectedMovie);
  store.refreshState();
  fixture.detectChanges();

  const subs: Subscription[] = [];
  subs.push(component.movie$.subscribe());
  subs.push(component.trailerUrl$.subscribe());
  subs.push(component.cast$.subscribe());
  tick();

  const beforeMovie = tmdb.getMovieById.calls.count();
  const beforeVideos = tmdb.getMovieVideos.calls.count();
  const beforeCredits = tmdb.getMovieCredits.calls.count();

  tmdb.langRequests.set('pl');
  paramMap$.next(convertToParamMap({ id: '42' }));
  store.refreshState();

  fixture.detectChanges();
  tick();

  const afterMovie = tmdb.getMovieById.calls.count();
  const afterVideos = tmdb.getMovieVideos.calls.count();
  const afterCredits = tmdb.getMovieCredits.calls.count();

  expect(afterMovie).toBeGreaterThan(beforeMovie);
  expect(afterVideos).toBeGreaterThan(beforeVideos);
  expect(afterCredits).toBeGreaterThan(beforeCredits);

  subs.forEach(s => s.unsubscribe());
}));

  it('trailerUrl$ returns null when no id in route', fakeAsync((): void => {
    paramMap$.next(convertToParamMap({}));
    fixture.detectChanges();
    tmdb.getMovieVideos.calls.reset();

    tick();

    component.trailerUrl$.pipe(take(1)).subscribe((url) => {
      expect(url).toBeNull();
      expect(tmdb.getMovieVideos.calls.count()).toBe(0);
    });
  }));

  it('trailerUrl$ picks YouTube Trailer/Teaser and sanitizes URL', fakeAsync((): void => {
  const sanitizer = TestBed.inject(DomSanitizer);
  const ytKey = 'abc123';

  tmdb.getMovieVideos.and.returnValue(
    of({
      id: 42,
      results: [
        { key: 'vimeoKey', site: 'Vimeo', type: 'Trailer', name: 'Vimeo' } as TmdbVideo,
        { key: ytKey, site: 'YouTube', type: 'Trailer', name: 'Official Trailer' } as TmdbVideo,
      ],
    })
  );
  spyOn(sanitizer, 'bypassSecurityTrustResourceUrl').and.callThrough();

  fixture.detectChanges();

  paramMap$.next(convertToParamMap({ id: '42' }));
  tick();

  component.trailerUrl$.pipe(take(1)).subscribe((url: SafeResourceUrl | null) => {
    expect(sanitizer.bypassSecurityTrustResourceUrl).toHaveBeenCalledWith(
      `https://www.youtube.com/embed/${ytKey}`
    );
    expect(url).toBeTruthy();
  });
}));


  it('trailerUrl$ returns null when no matching YouTube video exists', (): void => {
    fixture.detectChanges();

    tmdb.getMovieVideos.and.returnValue(
      of({
        id: 42,
        results: [{ key: 'vm', site: 'Vimeo', type: 'Trailer', name: 'T' } as TmdbVideo],
      })
    );
    component.trailerUrl$.pipe(take(1)).subscribe((url) => {
      expect(url).toBeNull();
    });
  });

  it('cast$ returns [] when no id; returns cast when id present', fakeAsync((): void => {
    fixture.detectChanges();

    paramMap$.next(convertToParamMap({}));
    tick();
    component.cast$.pipe(take(1)).subscribe((c) => expect(c.length).toBe(0));

    paramMap$.next(convertToParamMap({ id: '42' }));
    tmdb.getMovieCredits.and.returnValue(
      of({
        id: 42,
        cast: [{ id: 1, name: 'Actor', character: 'Hero', profile_path: null }],
        crew: [],
      })
    );
    tick();
    component.cast$.pipe(take(1)).subscribe((c) => {
      expect(c.length).toBe(1);
      expect(c[0].name).toBe('Actor');
    });
  }));

  it('toggleFavorite removes when already in watchlist; adds otherwise', (): void => {
    fixture.detectChanges();

    const ev = new MouseEvent('click');

    watchlist.isMovieInWatchlist.and.returnValue(of(false));
    component.toggleFavorite(ev, { id: 42 } as TmdbMovie);
    expect(watchlist.addMovie).toHaveBeenCalledWith({ id: 42 } as TmdbMovie);

    watchlist.addMovie.calls.reset();
    watchlist.isMovieInWatchlist.and.returnValue(of(true));
    component.toggleFavorite(ev, { id: 42 } as TmdbMovie);
    expect(watchlist.removeMovie).toHaveBeenCalledWith(42);
  });

  it('ngOnChanges logs changes for @Input()', (): void => {
    fixture.detectChanges();

    spyOn(console, 'log');
    component.title = 'New Title';
    component.ngOnChanges({
      title: {
        previousValue: undefined,
        currentValue: 'New Title',
        firstChange: true,
        isFirstChange: () => true,
      },
    });
    expect(console.log).toHaveBeenCalled();
  });

  it('loading$ mirrors selector value', (): void => {
    fixture.detectChanges();

    store.overrideSelector(selectLoadingMovie, true);
    store.refreshState();
    component.loading$.pipe(take(1)).subscribe((v) => expect(v).toBeTrue());
  });
});
