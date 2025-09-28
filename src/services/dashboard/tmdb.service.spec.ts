import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LanguageService } from '../../app/shared/services/language.service';
import {
  TmdbMovie,
  TmdbPage,
  TmdbPerson,
  TmdbReview,
} from '../../models/dashboard';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpSpy: jasmine.SpyObj<HttpClient>;

  const mockMovie: TmdbMovie = { id: 1, title: 'Test Movie' } as TmdbMovie;
  const mockPerson: TmdbPerson = { id: 10, name: 'Test Person' } as TmdbPerson;
  const mockReview: TmdbReview = { id: 'r1', author: 'Critic' } as TmdbReview;

  const mockMoviePage: TmdbPage<TmdbMovie> = {
    page: 1,
    results: [mockMovie],
    total_pages: 1,
    total_results: 1,
  };

  const mockPersonPage: TmdbPage<TmdbPerson> = {
    page: 1,
    results: [mockPerson],
    total_pages: 1,
    total_results: 1,
  };

  const mockReviewPage: TmdbPage<TmdbReview> = {
    page: 1,
    results: [mockReview],
    total_pages: 1,
    total_results: 1,
  };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: LanguageService,
          useValue: {
            language$: of('en'),
          },
        },
      ],
    });

    service = TestBed.inject(TmdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fallback to default language if unknown', () => {
    TestBed.resetTestingModule();
    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        {
          provide: LanguageService,
          useValue: {
            language$: of('xx'),
          },
        },
      ],
    });
    service = TestBed.inject(TmdbService);
    expect(service.langRequests()).toBe('xx');
    expect(service['lang']).toBe('en-US');
  });

  it('should fetch top rated movies', () => {
    httpSpy.get.and.returnValue(of(mockMoviePage));
    service.getTopRatedMovies(1).subscribe((res) => {
      expect(res.results[0].title).toBe('Test Movie');
    });
  });

  it('should fetch popular people', () => {
    httpSpy.get.and.returnValue(of(mockPersonPage));
    service.getPopularPeople(1).subscribe((res) => {
      expect(res.results[0].name).toBe('Test Person');
    });
  });

  it('should fetch person details', () => {
    httpSpy.get.and.returnValue(of(mockPerson));
    service.getPersonDetails(10).subscribe((res) => {
      expect(res.name).toBe('Test Person');
    });
  });

  it('should fetch person combined credits', () => {
    const mockCredits = {
      cast: [{ id: 1, media_type: 'movie', title: 'Role' }],
      crew: [{ id: 2, media_type: 'movie', name: 'Director' }],
    };
    httpSpy.get.and.returnValue(of(mockCredits));
    service.getPersonCombinedCredits(10).subscribe((res) => {
      expect(res.cast[0].title).toBe('Role');
      expect(res.crew[0].name).toBe('Director');
    });
  });

  it('should fetch movie reviews', () => {
    httpSpy.get.and.returnValue(of(mockReviewPage));
    service.getMovieReviews(1, 1).subscribe((res) => {
      expect(res.results[0].author).toBe('Critic');
    });
  });

  it('should fetch upcoming movies', () => {
    httpSpy.get.and.returnValue(of(mockMoviePage));
    service.getUpcomingMovies(1).subscribe((res) => {
      expect(res.results.length).toBe(1);
    });
  });

  it('should fetch now playing movies', () => {
    httpSpy.get.and.returnValue(of(mockMoviePage));
    service.getNowPlayingMovies(1).subscribe((res) => {
      expect(res.results.length).toBe(1);
    });
  });

  it('should fetch movie videos', () => {
    const mockVideos = {
      id: 1,
      results: [{ key: 'abc123', site: 'YouTube', type: 'Trailer', name: 'Official Trailer' }],
    };
    httpSpy.get.and.returnValue(of(mockVideos));
    service.getMovieVideos(1).subscribe((res) => {
      expect(res.results[0].key).toBe('abc123');
    });
  });

  it('should build image URL with slash', () => {
    const url = service.img('/poster.jpg', 'w500');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('should build image URL without slash', () => {
    const url = service.img('poster.jpg', 'w500');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('should return null for missing image path', () => {
    expect(service.img(null)).toBeNull();
    expect(service.img(undefined)).toBeNull();
  });

  it('should call get with default params', () => {
    httpSpy.get.and.returnValue(of({}));
    service['get']('/test').subscribe();
    expect(httpSpy.get).toHaveBeenCalledWith(
      jasmine.stringMatching(/\/test$/),
      jasmine.objectContaining({ params: jasmine.anything() })
    );
  });
});
