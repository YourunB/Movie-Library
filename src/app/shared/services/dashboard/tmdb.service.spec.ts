import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LanguageService } from '../language.service';
import {
  TmdbMovie,
  TmdbPage,
  TmdbPerson,
  TmdbReview,
  TmdbVideo,
} from '../../../../models/dashboard';

interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  tagline?: string;
  videos?: { results: TmdbVideo[] };
}

describe('TmdbService', () => {
  let service: TmdbService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let langSpy: jasmine.SpyObj<LanguageService>;

  const mockMovie: TmdbMovie = { id: 1, title: 'Test Movie' } as TmdbMovie;
  const mockPerson: TmdbPerson = { id: 10, name: 'Test Person' } as TmdbPerson;
  const mockReview: TmdbReview = { id: 'r1', author: 'Critic' } as TmdbReview;
  const mockVideo: TmdbVideo = {
    key: 'abc123',
    site: 'YouTube',
    type: 'Trailer',
    name: 'Official Trailer',
    published_at: '2023-01-01',
  } as TmdbVideo;

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

  const mockVideosResponse = {
    id: 1,
    results: [mockVideo],
  };

  const mockDetailsWithVideos: TmdbMovieDetails = {
    id: 1,
    title: 'Movie Title',
    overview: 'Movie Overview',
    tagline: 'Movie Tagline',
    videos: { results: [mockVideo] },
  };

  const mockCredits = {
    id: 1,
    cast: [{ id: 1, name: 'Actor', character: 'Hero', profile_path: null }],
    crew: [],
  };

  beforeEach(() => {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    langSpy = jasmine.createSpyObj<LanguageService>('LanguageService', [], {
      language$: of('en'),
    });

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: LanguageService, useValue: langSpy },
      ],
    });

    service = TestBed.inject(TmdbService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should fetch trending movies', () => {
    httpSpy.get.and.returnValue(of(mockMoviePage));
    service.getTrendingMovies(1).subscribe((res) => {
      expect(res).toEqual(mockMoviePage);
    });
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

  it('should fetch movie by ID', () => {
    httpSpy.get.and.returnValue(of(mockMovie));
    service.getMovieById(1).subscribe((res) => {
      expect(res).toEqual(mockMovie);
    });
  });

  it('should search movies by query', () => {
    httpSpy.get.and.returnValue(of(mockMoviePage));
    service.searchMovies('test', 1).subscribe((res) => {
      expect(res.results[0].title).toBe('Test Movie');
    });
  });

  it('should fetch movie videos', () => {
    httpSpy.get.and.returnValue(of(mockVideosResponse));
    service.getMovieVideos(1).subscribe((res) => {
      expect(res.results[0].key).toBe('abc123');
    });
  });

  it('should fetch movie details with videos', () => {
    httpSpy.get.and.returnValue(of(mockDetailsWithVideos));
    service.getMovieDetailsWithVideos(1).subscribe((res) => {
      expect(res.title).toBe('Movie Title');
      expect(res.videos?.results.length).toBe(1);
    });
  });

  it('should return trailer with overview', (done) => {
    httpSpy.get.and.returnValue(of(mockDetailsWithVideos));
    service.getTrailerWithOverview(1).subscribe((res) => {
      expect(res.title).toBe('Movie Title');
      expect(res.trailer?.key).toBe('abc123');
      done();
    });
  });

  it('should fetch movie credits', () => {
    httpSpy.get.and.returnValue(of(mockCredits));
    service.getMovieCredits(1).subscribe((res) => {
      expect(res.cast[0].name).toBe('Actor');
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
});
