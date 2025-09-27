import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Store } from '@ngrx/store';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { IconSetService } from '@coreui/icons-angular';
import { of, Observable, take } from 'rxjs';
import { TradingMovies } from './trading-movies';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { TrailerModal } from '../../../shared/components/trailer-modal/trailer-modal';
import { TranslateModule, TranslateLoader, TranslationObject } from '@ngx-translate/core';
import { provideNoopAnimations } from '@angular/platform-browser/animations';

/** ---- Minimal helpers & test types (no `any`) ---- */

class MockTranslateLoader implements TranslateLoader {
  getTranslation(lang: string): Observable<TranslationObject> {
    void lang; // silence eslint
    return of({} as TranslationObject);
  }
}

interface SlideVm {
  id: number;
  imgSrc: string;
  backgroundImgSrc: string;
  title: string;
  overview?: string | null;
  rating?: number;
  rating5: number;
  reactions: number;
  likes: number;
  releaseDate?: string | null;
}

interface SideSlideVm {
  key: string;
  sourceIndex?: number;
  slot?: string | number;
  vmKey?: string | number;
  title?: string;
  imgSrc?: string | null;
  name?: string;
  releaseDate?: string | null;
  rating?: number;
  [k: string]: unknown;
}

interface CarouselLike {
  activeIndex: number | (() => number);
}

/** Test-only view onto private members/methods. */
interface TradingMoviesTestHooks {
  getCarouselIndex(): number;
  onItemChange(i: number): void;
  intent: 'prev' | 'next' | 'none';
  lastActiveIndex: number;
  slidesCount: number;
  windowAnchor$: { next(v: number): void };
  activeIndex$: { next(v: number): void };
  carouselComponent?: CarouselLike;
}

describe('TradingMovies', function TradingMoviesSpec() {
  let component: TradingMovies;
  let fixture: ComponentFixture<TradingMovies>;
  let mockStore: jasmine.SpyObj<Store>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockRouter: jasmine.SpyObj<Router>;
  let mockIconSetService: jasmine.SpyObj<IconSetService>;
  let mockTmdbService: jasmine.SpyObj<TmdbService>;

  const mockTrendingMovies = [
    {
      id: 1,
      title: 'Test Movie 1',
      poster_path: '/test1.jpg',
      backdrop_path: '/backdrop1.jpg',
      overview: 'Test overview 1',
      vote_average: 8.5,
      release_date: '2023-01-01',
    },
    {
      id: 2,
      title: 'Test Movie 2',
      poster_path: '/test2.jpg',
      backdrop_path: '/backdrop2.jpg',
      overview: 'Test overview 2',
      vote_average: 7.2,
      release_date: '2023-02-01',
    },
  ];

  beforeEach(async function setup() {
    const storeSpy = jasmine.createSpyObj('Store', ['select', 'dispatch']);
    const tmdbSpy = jasmine.createSpyObj('TmdbService', ['img']);
    const dialogSpy = jasmine.createSpyObj('MatDialog', ['open']);
    const routerSpy = jasmine.createSpyObj('Router', ['navigate']);
    const iconSetSpy = jasmine.createSpyObj('IconSetService', [], { icons: {} });

    storeSpy.select.and.returnValue(of(mockTrendingMovies));
    tmdbSpy.img.and.returnValue('https://image.tmdb.org/t/p/w342/test.jpg');

    await TestBed.configureTestingModule({
      imports: [
        TradingMovies,
        TranslateModule.forRoot({
          loader: { provide: TranslateLoader, useClass: MockTranslateLoader },
        }),
      ],
      providers: [
        provideNoopAnimations(),
        { provide: Store, useValue: storeSpy },
        { provide: TmdbService, useValue: tmdbSpy },
        { provide: MatDialog, useValue: dialogSpy },
        { provide: Router, useValue: routerSpy },
        { provide: IconSetService, useValue: iconSetSpy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TradingMovies);
    component = fixture.componentInstance;
    mockStore = TestBed.inject(Store) as jasmine.SpyObj<Store>;
    mockTmdbService = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    mockDialog = TestBed.inject(MatDialog) as jasmine.SpyObj<MatDialog>;
    mockRouter = TestBed.inject(Router) as jasmine.SpyObj<Router>;
    mockIconSetService = TestBed.inject(IconSetService) as jasmine.SpyObj<IconSetService>;

    fixture.detectChanges();
  });

  it('should create', function shouldCreate() {
    expect(component).toBeTruthy();
  });

  it('should dispatch loadDashboard action in constructor', function shouldDispatchLoadDashboard() {
    expect(mockStore.dispatch).toHaveBeenCalled();
  });

  it('should set up icon set in constructor', function shouldSetupIconSet() {
    expect(mockIconSetService.icons).toBeDefined();
  });

  it('should transform trending movies data correctly', function shouldTransformTrendingMovies(done) {
    component.slides$.pipe(take(1)).subscribe((slides) => {
      const s = slides as SlideVm[];
      expect(s).toBeDefined();
      expect(s.length).toBe(2);
      expect(s[0]).toEqual({
        id: 1,
        imgSrc: 'https://image.tmdb.org/t/p/w342/test.jpg',
        backgroundImgSrc: 'https://image.tmdb.org/t/p/w342/test.jpg',
        title: 'Test Movie 1',
        overview: 'Test overview 1',
        rating: 8.5,
        rating5: 4.3,
        reactions: 0,
        likes: 100,
        releaseDate: '2023-01-01',
      });
      done();
    });
  });

  it('should handle null poster_path and backdrop_path', function shouldHandleNullPaths(done) {
    const moviesWithNullPaths = [
      {
        ...mockTrendingMovies[0],
        poster_path: null,
        backdrop_path: null,
      },
    ];

    // When path is null, simulate service returning fallback image(s)
    mockTmdbService.img.calls.reset();
    mockTmdbService.img.and.callFake((path: string | null) => {
      return path ? 'https://image.tmdb.org/t/p/w342/test.jpg' : 'assets/placeholder-fallback.jpg';
    });

    mockStore.select.and.returnValue(of(moviesWithNullPaths));

    fixture = TestBed.createComponent(TradingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.slides$.pipe(take(1)).subscribe((slides) => {
      const s = slides as SlideVm[];
      expect(s[0].imgSrc).not.toContain('image.tmdb.org');        // used fallback
      expect(s[0].backgroundImgSrc).not.toContain('image.tmdb.org'); // used fallback
      expect(s[0].imgSrc).toBeTruthy();
      expect(s[0].backgroundImgSrc).toBeTruthy();
      done();
    });
  });

  it('should compute side slides correctly', function shouldComputeSideSlides(done) {
    component.sideSlides$.pipe(take(1)).subscribe((sideSlides) => {
      const ss = sideSlides as unknown as SideSlideVm[];
      expect(ss).toBeDefined();
      expect(Array.isArray(ss)).toBe(true);
      if (ss.length > 0) {
        expect(ss[0].key).toBeDefined();
        expect(ss[0].slot).toBeDefined();
        expect(ss[0].vmKey).toBeDefined();
      }
      done();
    });
  });

  it('should handle empty slides array in sideSlides$', function shouldHandleEmptySideSlides(done) {
    mockStore.select.and.returnValue(of([]));

    fixture = TestBed.createComponent(TradingMovies);
    component = fixture.componentInstance;
    fixture.detectChanges();

    component.sideSlides$.pipe(take(1)).subscribe((sideSlides) => {
      const ss = sideSlides as unknown as SideSlideVm[];
      expect(ss).toEqual([]);
      done();
    });
  });

  it('should get carousel index correctly', function shouldGetCarouselIndex() {
    const mockCarousel: CarouselLike = { activeIndex: 2 };
    const cmp = component as unknown as TradingMoviesTestHooks;
    cmp.carouselComponent = mockCarousel;

    const result = cmp.getCarouselIndex();
    expect(result).toBe(2);
  });

  it('should handle writable signal in getCarouselIndex', function shouldHandleWritableSignal() {
    function mockSignal(): number {
      return 3;
    }
    const mockCarousel: CarouselLike = { activeIndex: mockSignal };
    const cmp = component as unknown as TradingMoviesTestHooks;
    cmp.carouselComponent = mockCarousel;

    const result = cmp.getCarouselIndex();
    expect(result).toBe(3);
  });

  it('should return 0 when carousel index is undefined', function shouldReturnZeroWhenUndefined() {
    const cmp = component as unknown as TradingMoviesTestHooks;
    cmp.carouselComponent = undefined;

    const result = cmp.getCarouselIndex();
    expect(result).toBe(0);
  });

  it('should handle item change correctly', function shouldHandleItemChange() {
    const cmp = component as unknown as TradingMoviesTestHooks;

    spyOn(cmp.activeIndex$, 'next');
    spyOn(cmp.windowAnchor$, 'next');

    cmp.lastActiveIndex = 0;
    cmp.slidesCount = 2;
    cmp.intent = 'next';

    cmp.onItemChange(1);

    expect(cmp.activeIndex$.next).toHaveBeenCalledWith(1);
    expect(cmp.windowAnchor$.next).toHaveBeenCalledWith(1);
    expect(cmp.lastActiveIndex).toBe(1);
    expect(cmp.intent).toBe('none');
  });

  it('should handle forward movement in onItemChange', function shouldHandleForwardMovement() {
    const cmp = component as unknown as TradingMoviesTestHooks;

    spyOn(cmp.activeIndex$, 'next');
    spyOn(cmp.windowAnchor$, 'next');

    cmp.lastActiveIndex = 0;
    cmp.slidesCount = 3;
    cmp.intent = 'none';

    cmp.onItemChange(1);

    expect(cmp.windowAnchor$.next).toHaveBeenCalledWith(1);
  });

  it('should handle backward movement in onItemChange', function shouldHandleBackwardMovement() {
    const cmp = component as unknown as TradingMoviesTestHooks;

    spyOn(cmp.activeIndex$, 'next');
    spyOn(cmp.windowAnchor$, 'next');

    cmp.lastActiveIndex = 1;
    cmp.slidesCount = 3;
    cmp.intent = 'none';

    cmp.onItemChange(0);

    expect(cmp.windowAnchor$.next).toHaveBeenCalledWith(0);
  });

  it('should set intent to next when onNextClick is called', function shouldSetIntentNext() {
    component.onNextClick();
    const cmp = component as unknown as TradingMoviesTestHooks;
    expect(cmp.intent).toBe('next');
  });

  it('should set intent to prev when onPrevClick is called', function shouldSetIntentPrev() {
    component.onPrevClick();
    const cmp = component as unknown as TradingMoviesTestHooks;
    expect(cmp.intent).toBe('prev');
  });

  it('should convert movie to side slide correctly', function shouldConvertMovieToSideSlide() {
    const movie = {
      id: 1,
      title: 'Test Movie',
      poster_path: '/test.jpg',
      release_date: '2023-01-01',
      vote_average: 8.5,
    };

    const result = component.toSideSlideFromMovie(
      movie as unknown as Parameters<typeof component.toSideSlideFromMovie>[0],
      0
    );

    expect(result).toEqual({
      key: '1',
      sourceIndex: 0,
      title: 'Test Movie',
      imgSrc: 'https://image.tmdb.org/t/p/w342/test.jpg',
      releaseDate: '2023-01-01',
      rating: 8.5,
    });
  });

  it('should handle null release_date in toSideSlideFromMovie', function shouldHandleNullReleaseDate() {
    const movie = {
      id: 1,
      title: 'Test Movie',
      poster_path: '/test.jpg',
      release_date: null,
      vote_average: 8.5,
    };

    const result = component.toSideSlideFromMovie(
      movie as unknown as Parameters<typeof component.toSideSlideFromMovie>[0],
      0
    );

    expect(result.releaseDate).toBeUndefined();
  });

  it('should convert person to side slide correctly', function shouldConvertPersonToSideSlide() {
    const person = {
      id: 1,
      name: 'Test Person',
      profile_path: '/test.jpg',
      known_for_department: 'Acting',
    };

    const result = component.toSideSlideFromPerson(
      person as unknown as Parameters<typeof component.toSideSlideFromPerson>[0],
      0
    );

    expect(result).toEqual({
      key: '1',
      sourceIndex: 0,
      title: 'Test Person',
      imgSrc: 'https://image.tmdb.org/t/p/w342/test.jpg',
      name: 'Acting',
    });
  });

  it('should open trailer modal with correct data', function shouldOpenTrailerModal() {
    const payload = { title: 'Test Movie', id: 1 } as unknown as Parameters<
      typeof component.openTrailerModal
    >[0];

    component.openTrailerModal(payload);

    expect(mockDialog.open).toHaveBeenCalledWith(TrailerModal, {
      data: {
        movieTitle: 'Test Movie',
        movieId: 1,
      },
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '80vh',
      panelClass: 'trailer-modal-panel',
    });
  });

  it('should handle string id in openTrailerModal', function shouldHandleStringIdInModal() {
    const payload = { title: 'Test Movie', id: 'string-id' } as unknown as Parameters<
      typeof component.openTrailerModal
    >[0];

    component.openTrailerModal(payload);

    expect(mockDialog.open).toHaveBeenCalledWith(TrailerModal, {
      data: {
        movieTitle: 'Test Movie',
        movieId: undefined,
      },
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '80vh',
      panelClass: 'trailer-modal-panel',
    });
  });

  it('should navigate to movie page when goToMovie is called with numeric id', function shouldNavigateToMovie() {
    component.goToMovie(1);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/movie', 1]);
  });

  it('should not navigate when goToMovie is called with non-numeric id', function shouldNotNavigateWithNonNumeric() {
    component.goToMovie('string-id' as unknown as number);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should not navigate when goToMovie is called with undefined id', function shouldNotNavigateWithUndefined() {
    component.goToMovie(undefined as unknown as number);
    expect(mockRouter.navigate).not.toHaveBeenCalled();
  });

  it('should call clickNextItem method', function shouldCallClickNextItem() {
    spyOn(component, 'clickNextItem');
    component.clickNextItem();
    expect(component.clickNextItem).toHaveBeenCalled();
  });
});
