import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { NowPlayingMovies } from './now-playing-movies';
import { RouterTestingModule } from '@angular/router/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';
import { Observable, BehaviorSubject, of } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { AuthService } from '../../../shared/services/auth.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { WatchlistSignalsStore } from '../../../shared/services/watchlist-signals.store';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';

function emptyPage(): TmdbPage<TmdbMovie> {
  return {
    page: 1,
    results: [],
    total_pages: 1,
    total_results: 0,
  } as TmdbPage<TmdbMovie>;
}

function makeMovie(
  id: number,
  title: string,
  poster: string | null,
  date: string | null
): TmdbMovie {
  return {
    id,
    title,
    poster_path: poster,
    release_date: date,
  } as TmdbMovie;
}

class MockTmdbService {
  public langRequests: WritableSignal<number> = signal(0);
  public triggerLangChange(): void {
    this.langRequests.update((v) => v + 1);
  }

  public getNowPlayingMovies: jasmine.Spy<() => Observable<TmdbPage<TmdbMovie>>> =
    jasmine.createSpy('getNowPlayingMovies').and.returnValue(of(emptyPage()));

  public img(path: string | null | undefined, size: string): string | undefined {
    return path ? `https://img/${size}/${path}` : undefined;
  }
}

class MockAuthService {
  public subj = new BehaviorSubject<boolean>(false);
  public getAuthenticatedObservable(): Observable<boolean> {
    return this.subj.asObservable();
  }
}

class MockWatchlistService {}

class MockWatchlistSignalsStore {
  public toggle: jasmine.Spy<(m: TmdbMovie) => void> = jasmine.createSpy('toggle');
}

class MockBreakpointObserver {
  private subject = new BehaviorSubject<BreakpointState>({ breakpoints: {}, matches: false });
  public observe(queries: string | string[]): Observable<BreakpointState> {
    void queries;
    return this.subject.asObservable();
  }
  public emit(map: Record<string, boolean>): void {
    this.subject.next({ breakpoints: map, matches: Object.values(map).some(Boolean) });
  }
}

describe('App > NowPlayingMovies', () => {
  let fixture: ComponentFixture<NowPlayingMovies>;
  let component: NowPlayingMovies;

  let mockTmdb: MockTmdbService;
  let mockAuth: MockAuthService;
  let mockBp: MockBreakpointObserver;
  let translate: TranslateService;

  const emitBreakpoints = (map: Record<string, boolean>): void => {
    mockBp.emit(map);
    fixture.detectChanges();
  };

  const pushNowPlaying = (page: TmdbPage<TmdbMovie>): void => {
    mockTmdb.getNowPlayingMovies.and.returnValue(of(page));
    mockTmdb.triggerLangChange();
    fixture.detectChanges();
    tick();
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        NowPlayingMovies,
        RouterTestingModule,
        TranslateModule.forRoot(),
      ],
      providers: [
        provideNoopAnimations(),
        { provide: TmdbService, useClass: MockTmdbService },
        { provide: AuthService, useClass: MockAuthService },
        { provide: WatchlistService, useClass: MockWatchlistService },
        { provide: WatchlistSignalsStore, useClass: MockWatchlistSignalsStore },
        { provide: BreakpointObserver, useClass: MockBreakpointObserver },
      ],
    })
      .overrideComponent(NowPlayingMovies, {
        set: {
          template: `
            <section>
              <h2>{{ title() | translate }}</h2>
              <div #slider class="slider"></div>
            </section>
          `,
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(NowPlayingMovies);
    component = fixture.componentInstance;

    mockTmdb = TestBed.inject(TmdbService) as unknown as MockTmdbService;
    mockAuth = TestBed.inject(AuthService) as unknown as MockAuthService;
    mockBp = TestBed.inject(BreakpointObserver) as unknown as MockBreakpointObserver;
    translate = TestBed.inject(TranslateService);

    translate.setTranslation('en', { 'Now Playing': 'Now Playing', Popular: 'Popular' }, true);
    translate.use('en');

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });


  it('should use 240px for large screens (no breakpoints)', fakeAsync(() => {
    emitBreakpoints({});
    tick();
    expect(component.cardWidth()).toBe(240);
  }));

  it('should use 220px for <=1200px breakpoint', fakeAsync(() => {
    emitBreakpoints({ '(max-width: 1200px)': true });
    tick();
    expect(component.cardWidth()).toBe(220);
  }));

  it('should use 180px for <=768px breakpoint', fakeAsync(() => {
    emitBreakpoints({ '(max-width: 768px)': true });
    tick();
    expect(component.cardWidth()).toBe(180);
  }));

  it('should use 140px for <=400px breakpoint', fakeAsync(() => {
    emitBreakpoints({ '(max-width: 400px)': true });
    tick();
    expect(component.cardWidth()).toBe(140);
  }));

  it('should compute card width as a number', fakeAsync(() => {
    emitBreakpoints({ '(max-width: 992px)': true });
    tick();
    expect(typeof component.cardWidth()).toBe('number');
  }));

  it('should initialize with default title', () => {
    expect(component.title()).toBe('Now Playing');
  });

  it('should handle title input changes', () => {
    fixture.componentRef.setInput('title', 'Popular');
    fixture.detectChanges();
    expect(component.title()).toBe('Popular');
  });

  it('should compute movies correctly', fakeAsync(() => {
    const page: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [
        makeMovie(1, 'A', 'a.jpg', '2020-01-01'),
        makeMovie(2, 'B', 'b.jpg', '2021-02-02'),
      ],
      total_pages: 1,
      total_results: 2,
    } as TmdbPage<TmdbMovie>;

    pushNowPlaying(page);
    const mv = component.movies();
    expect(mv.length).toBe(2);
    expect(mv[0].poster_path).toBe('https://img/w342/a.jpg');
    expect(mv[0].release_date).toBe('2020-01-01');
  }));

  it('should limit movies to 12 items', fakeAsync(() => {
    const results: TmdbMovie[] = Array.from({ length: 15 }, (_, i) =>
      makeMovie(i + 1, `M${i + 1}`, `${i + 1}.jpg`, '2020-01-01')
    );

    const page: TmdbPage<TmdbMovie> = {
      page: 1,
      results,
      total_pages: 2,
      total_results: results.length,
    } as TmdbPage<TmdbMovie>;

    pushNowPlaying(page);
    expect(component.movies().length).toBe(12);
  }));

  it('should handle empty movies page', fakeAsync(() => {
    pushNowPlaying(emptyPage());
    expect(component.movies().length).toBe(0);
  }));

  it('should safely handle malformed movies page (no results property)', fakeAsync(() => {
    const malformed = { page: 1 } as unknown as TmdbPage<TmdbMovie>;
    pushNowPlaying(malformed);
    expect(component.movies().length).toBe(0);
  }));

  it('should handle null poster_path in movies', fakeAsync(() => {
    const page: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [makeMovie(1, 'A', null, '2020-01-01')],
      total_pages: 1,
      total_results: 1,
    } as TmdbPage<TmdbMovie>;

    pushNowPlaying(page);
    const mv = component.movies();
    expect(mv[0].poster_path).toBe('assets/placeholder.jpg');
  }));

  it('should handle null release_date in movies', fakeAsync(() => {
    const page: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [makeMovie(1, 'A', 'a.jpg', null)],
      total_pages: 1,
      total_results: 1,
    } as TmdbPage<TmdbMovie>;

    pushNowPlaying(page);
    const mv = component.movies();
    expect(mv[0].release_date).toBe('');
  }));

  it('should refetch movies when language changes', fakeAsync(() => {
    const first: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [makeMovie(1, 'First', 'f.jpg', '2020-01-01')],
      total_pages: 1,
      total_results: 1,
    } as TmdbPage<TmdbMovie>;

    const second: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [makeMovie(2, 'Second', 's.jpg', '2021-02-02')],
      total_pages: 1,
      total_results: 1,
    } as TmdbPage<TmdbMovie>;
    mockTmdb.getNowPlayingMovies.and.returnValues(of(first), of(second));
    mockTmdb.getNowPlayingMovies.calls.reset();

    mockTmdb.triggerLangChange();
    fixture.detectChanges();
    tick();
    expect(component.movies()[0].title).toBe('First');
    mockTmdb.triggerLangChange();
    fixture.detectChanges();
    tick();
    expect(component.movies()[0].title).toBe('Second');
    expect(mockTmdb.getNowPlayingMovies).toHaveBeenCalledTimes(2);
  }));

  it('should get authentication status', fakeAsync(() => {
    expect(component.isAuth()).toBeFalse();
    mockAuth.subj.next(true);
    tick();
    expect(component.isAuth()).toBeTrue();
  }));

  it('should handle unauthenticated user (no crash)', () => {
    expect(component.isAuth()).toBeFalse();
    const call = (component as unknown as { toggleFavorite(m: unknown): void }).toggleFavorite;
    expect(() => call.call(component, makeMovie(123, 'X', 'x.jpg', '2020-01-01'))).not.toThrow();
  });

  it('should scroll slider to next direction when clicking the button', () => {
    type ScrollByFn = (options: ScrollToOptions) => void;
    const scrollBySpy = jasmine.createSpy<ScrollByFn>('scrollBy');
    const mockDiv = { scrollBy: scrollBySpy };
    const nativeRef = { nativeElement: mockDiv as unknown as HTMLDivElement };

    (component as unknown as { sliderRef: () => { nativeElement: HTMLDivElement } | undefined }).sliderRef =
      () => nativeRef as { nativeElement: HTMLDivElement };

    component.scroll('next', 200);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: 600, behavior: 'smooth' });
  });

  it('should scroll slider to previous direction when clicking the button', () => {
    type ScrollByFn = (options: ScrollToOptions) => void;
    const scrollBySpy = jasmine.createSpy<ScrollByFn>('scrollBy');
    const mockDiv = { scrollBy: scrollBySpy };
    const nativeRef = { nativeElement: mockDiv as unknown as HTMLDivElement };

    (component as unknown as { sliderRef: () => { nativeElement: HTMLDivElement } | undefined }).sliderRef =
      () => nativeRef as { nativeElement: HTMLDivElement };

    component.scroll('prev', 200);
    expect(scrollBySpy).toHaveBeenCalledWith({ left: -600, behavior: 'smooth' });
  });

  it('should not throw when slider ref is not available', () => {
    (component as unknown as { sliderRef: () => undefined }).sliderRef = () => undefined;
    expect(() => component.scroll('next', 200)).not.toThrow();
  });

  it('should toggle favorite movie', () => {
    const store = TestBed.inject(WatchlistSignalsStore) as unknown as MockWatchlistSignalsStore;
    const movie = makeMovie(7, 'Fav', 'f.jpg', '2020-01-01');
    (component as unknown as { toggleFavorite(m: unknown): void }).toggleFavorite(movie);
    expect(store.toggle).toHaveBeenCalled();
  });
});
