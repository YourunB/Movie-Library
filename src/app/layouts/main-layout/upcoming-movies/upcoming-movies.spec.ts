import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BreakpointObserver, BreakpointState } from '@angular/cdk/layout';
import { of } from 'rxjs';
import { UpcomingMovies, MovieVM } from './upcoming-movies';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { AuthService } from '../../../shared/services/auth.service';
import { WatchlistService } from '../../../shared/services/watchlist.service';
import { WatchlistSignalsStore } from '../../../shared/services/watchlist-signals.store';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { signal, WritableSignal } from '@angular/core';

describe('UpcomingMovies', () => {
  let component: UpcomingMovies;
  let fixture: ComponentFixture<UpcomingMovies>;
  let mockTmdbService: jasmine.SpyObj<TmdbService>;
  let mockBreakpointObserver: jasmine.SpyObj<BreakpointObserver>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockWatchlistSignals: jasmine.SpyObj<WatchlistSignalsStore>;

  const mockMoviesPage: TmdbPage<TmdbMovie> = {
    page: 1,
    results: [
      {
        id: 1,
        title: 'Upcoming Movie 1',
        poster_path: '/upcoming1.jpg',
        release_date: '2024-01-01',
        vote_average: 8.5,
        overview: 'Upcoming overview 1',
      },
      {
        id: 2,
        title: 'Upcoming Movie 2',
        poster_path: '/upcoming2.jpg',
        release_date: '2024-02-01',
        vote_average: 7.2,
        overview: 'Upcoming overview 2',
      },
      {
        id: 3,
        title: 'Upcoming Movie 3',
        poster_path: null,
        release_date: null,
        vote_average: 6.8,
        overview: 'Upcoming overview 3',
      },
    ],
    total_pages: 1,
    total_results: 3,
  };

  interface SliderNativeEl { scrollBy: (options: ScrollToOptions) => void }
  type SliderRefFn = () => { nativeElement: SliderNativeEl } | undefined;

  function fakeImg(path: string | null | undefined): string {
  return path ? 'https://image.tmdb.org/t/p/w342/upcoming.jpg' : 'assets/placeholder.jpg';
}

  beforeEach(async () => {
    const langSig: WritableSignal<string> = signal('en');

    const tmdbSpy = jasmine.createSpyObj<TmdbService>(
      'TmdbService',
      ['img', 'getUpcomingMovies'],
      { langRequests: langSig }
    );

    const breakpointSpy = jasmine.createSpyObj<BreakpointObserver>('BreakpointObserver', ['observe']);
    const authSpy = jasmine.createSpyObj<AuthService>('AuthService', ['getAuthenticatedObservable']);

    const watchlistSpy = jasmine.createSpyObj<WatchlistService>(
      'WatchlistService',
      ['addMovie', 'removeMovie', 'isMovieInWatchlist', 'updateDataBaseOfUserMovies', 'receiveDataBaseOfUserMovies']
    );

    const watchlistSignalsSpy = jasmine.createSpyObj<WatchlistSignalsStore>('WatchlistSignalsStore', ['toggle']);

    tmdbSpy.img.and.callFake(fakeImg as TmdbService['img']);
    tmdbSpy.getUpcomingMovies.and.returnValue(of(mockMoviesPage));

    breakpointSpy.observe.and.returnValue(of<BreakpointState>({ breakpoints: {}, matches: false }));
    authSpy.getAuthenticatedObservable.and.returnValue(of(true));

    await TestBed.configureTestingModule({
      imports: [UpcomingMovies],
      providers: [
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: BreakpointObserver, useValue: breakpointSpy },
        { provide: AuthService, useValue: authSpy },
        { provide: WatchlistService, useValue: watchlistSpy },
        { provide: WatchlistSignalsStore, useValue: watchlistSignalsSpy },
      ],
    })
      .overrideComponent(UpcomingMovies, {
        set: {
          imports: [],
          template: '<div #slider></div>',
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;

    mockTmdbService = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    mockBreakpointObserver = TestBed.inject(BreakpointObserver) as jasmine.SpyObj<BreakpointObserver>;
    mockAuthService = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    mockWatchlistSignals = TestBed.inject(WatchlistSignalsStore) as jasmine.SpyObj<WatchlistSignalsStore>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default title', () => {
    expect(component.title()).toBe('Upcoming');
  });

  it('should compute movies correctly', () => {
    const movies = component.movies();
    expect(movies).toBeDefined();
    expect(Array.isArray(movies)).toBe(true);
    expect(movies.length).toBe(3);

    expect(movies[0]).toEqual({
      id: 1,
      title: 'Upcoming Movie 1',
      poster_path: 'https://image.tmdb.org/t/p/w342/upcoming.jpg',
      release_date: '2024-01-01',
    });
  });

  it('should handle null poster_path in movies', () => {
    const movies = component.movies();
    const movieWithNullPoster = movies.find(m => m.id === 3);
    expect(movieWithNullPoster?.poster_path).toBe('assets/placeholder.jpg');
  });

  it('should handle null release_date in movies', () => {
    const movies = component.movies();
    const movieWithNullDate = movies.find(m => m.id === 3);
    expect(movieWithNullDate?.release_date).toBe('');
  });

  it('should limit movies to 10 items', () => {
    const largeMockPage: TmdbPage<TmdbMovie> = {
      page: 1,
      results: Array.from({ length: 15 }, (_, i) => ({
        id: i + 1,
        title: `Upcoming Movie ${i + 1}`,
        poster_path: `/upcoming${i + 1}.jpg`,
        release_date: '2024-01-01',
        vote_average: 8.5,
        overview: `Upcoming overview ${i + 1}`,
      })),
      total_pages: 1,
      total_results: 15,
    };

    mockTmdbService.getUpcomingMovies.and.returnValue(of(largeMockPage));

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const movies = component.movies();
    expect(movies.length).toBe(10);
  });

  it('should handle empty movies page', () => {
    const emptyMockPage: TmdbPage<TmdbMovie> = {
      page: 1,
      results: [],
      total_pages: 0,
      total_results: 0,
    };
    mockTmdbService.getUpcomingMovies.and.returnValue(of(emptyMockPage));

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const movies = component.movies();
    expect(movies).toEqual([]);
  });

  it('should handle null movies page', () => {
    mockTmdbService.getUpcomingMovies.and.returnValue(
      of(null as unknown as TmdbPage<TmdbMovie>)
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const movies = component.movies();
    expect(movies).toEqual([]);
  });

  it('should compute card width based on breakpoints', () => {
    const cardWidth = component.cardWidth();
    expect(cardWidth).toBeDefined();
    expect(typeof cardWidth).toBe('number');
  });

  it('should handle mobile breakpoint for card width', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: { '(max-width: 400px)': true }, matches: true })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(140);
  });

  it('should handle tablet breakpoint for card width', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: { '(max-width: 768px)': true }, matches: true })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(180);
  });

  it('should handle desktop breakpoint for card width', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: { '(max-width: 1200px)': true }, matches: true })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(220);
  });

  it('should default to 240px card width for large screens', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: {}, matches: false })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(240);
  });

  it('should scroll slider to next direction', () => {
    const mockSlider: SliderNativeEl = { scrollBy: jasmine.createSpy('scrollBy') };
    (component as unknown as { sliderRef: SliderRefFn }).sliderRef = () => ({ nativeElement: mockSlider });

    component.scroll('next', 200);

    expect(mockSlider.scrollBy).toHaveBeenCalledWith({ left: 600, behavior: 'smooth' });
  });

  it('should scroll slider to previous direction', () => {
    const mockSlider: SliderNativeEl = { scrollBy: jasmine.createSpy('scrollBy') };
    (component as unknown as { sliderRef: SliderRefFn }).sliderRef = () => ({ nativeElement: mockSlider });

    component.scroll('prev', 200);

    expect(mockSlider.scrollBy).toHaveBeenCalledWith({ left: -600, behavior: 'smooth' });
  });

  it('should not scroll when slider ref is not available', () => {
    (component as unknown as { sliderRef: SliderRefFn }).sliderRef = () => undefined;
    expect(() => component.scroll('next', 200)).not.toThrow();
  });

  it('should toggle favorite movie', () => {
    const movie: MovieVM = {
      id: 1,
      title: 'Upcoming Movie',
      poster_path: '/upcoming.jpg',
      release_date: '2024-01-01',
    };

    component.toggleFavorite(movie);

    expect(mockWatchlistSignals.toggle).toHaveBeenCalled();
    const arg = mockWatchlistSignals.toggle.calls.mostRecent().args[0] as unknown as TmdbMovie;
    expect(arg.id).toBe(movie.id);
    expect(arg.title).toBe(movie.title);
  });

  it('should get authentication status', () => {
    const isAuth = component.isAuth();
    expect(isAuth).toBe(true);
  });

  it('should handle unauthenticated user', () => {
    mockAuthService.getAuthenticatedObservable.and.returnValue(of(false));

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    const isAuth = component.isAuth();
    expect(isAuth).toBe(false);
  });

  it('should handle title input changes', () => {
    fixture.componentRef.setInput('title', 'Custom Upcoming Title');
    fixture.detectChanges();

    expect(component.title()).toBe('Custom Upcoming Title');
  });

  it('should map movies to MovieVM interface correctly', () => {
    const movies = component.movies();

    movies.forEach(movie => {
      expect(movie.id).toBeDefined();
      expect(movie.title).toBeDefined();
      expect(movie.poster_path).toBeDefined();
      expect(movie.release_date).toBeDefined();

      expect(typeof movie.id).toBe('number');
      expect(typeof movie.title).toBe('string');
      expect(typeof movie.poster_path).toBe('string');
      expect(typeof movie.release_date).toBe('string');
    });
  });

  it('should handle different breakpoint combinations', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({
        breakpoints: { '(max-width: 400px)': true, '(max-width: 576px)': true },
        matches: true,
      })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(140);
  });

  it('should handle medium breakpoint', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: { '(max-width: 576px)': true }, matches: true })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(160);
  });

  it('should handle large tablet breakpoint', () => {
    mockBreakpointObserver.observe.and.returnValue(
      of<BreakpointState>({ breakpoints: { '(max-width: 992px)': true }, matches: true })
    );

    fixture = TestBed.createComponent(UpcomingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.cardWidth()).toBe(200);
  });
});
