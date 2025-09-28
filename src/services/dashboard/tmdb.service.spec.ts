 import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { BehaviorSubject } from 'rxjs';

import { TmdbService, languageMap } from '../../app/shared/services/dashboard/tmdb.service';
import { LanguageService } from '../../app/shared/services/language.service';
import { environment } from '../../environments/environment';
import { TmdbMovie, TmdbPage, TmdbPerson, TmdbReview, TmdbVideo } from '../../models/dashboard';

class MockLanguageService {
  language$ = new BehaviorSubject<string>('en');
}

describe('TmdbService', () => {
  let service: TmdbService;
  let httpMock: HttpTestingController;
  let langSvc: MockLanguageService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        TmdbService,
        { provide: LanguageService, useClass: MockLanguageService },
      ],
    });

    service = TestBed.inject(TmdbService);
    httpMock = TestBed.inject(HttpTestingController);
    langSvc = TestBed.inject(LanguageService) as unknown as MockLanguageService;
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('builds image urls via img() and handles falsy paths', () => {
    expect(service.img(undefined)).toBeNull();
    expect(service.img(null)).toBeNull();
    expect(service.img('poster.jpg', 'w500'))
      .toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
    expect(service.img('/poster.jpg', 'original'))
      .toBe('https://image.tmdb.org/t/p/original/poster.jpg');
  });

  it('requests trending movies with api_key, language, and page', () => {
    service.getTrendingMovies(2).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/trending/movie/week'));
    expect(req.request.method).toBe('GET');

    const params = req.request.params;
    expect(params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(params.get('language')).toBe('en-US');
    expect(params.get('page')).toBe('2');

    req.flush({} as TmdbPage<TmdbMovie>);
  });

  it('updates language param when LanguageService emits', () => {
    langSvc.language$.next('ru');

    service.getPopularPeople(3).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/person/popular'));
    const params = req.request.params;
    expect(params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(params.get('language')).toBe(languageMap['ru']); // ru-RU
    expect(params.get('page')).toBe('3');

    req.flush({} as TmdbPage<TmdbPerson>);
    expect(service.langRequests()).toBe('ru');
  });

  it('getMovieById hits the correct endpoint with default language', () => {
    service.getMovieById(42).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/movie/42'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(req.request.params.get('language')).toBe('en-US');

    req.flush({ id: 42 } as TmdbMovie);
  });

  it('getMovieReviews uses paging and params', () => {
    service.getMovieReviews(7, 5).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/movie/7/reviews'));
    const params = req.request.params;
    expect(params.get('page')).toBe('5');
    expect(params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(params.get('language')).toBe('en-US');

    req.flush({} as TmdbPage<TmdbReview>);
  });

  it('getMovieCredits hits /movie/:id/credits', () => {
    service.getMovieCredits(101).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/movie/101/credits'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(req.request.params.get('language')).toBe('en-US');

    req.flush({
      id: 101,
      cast: [],
      crew: [],
    });
  });

  it('getMovieDetailsWithVideos appends videos to the response', () => {
    service.getMovieDetailsWithVideos(55).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/movie/55'));
    const params = req.request.params;
    expect(params.get('append_to_response')).toBe('videos');
    expect(params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(params.get('language')).toBe('en-US');

    req.flush({
      id: 55,
      title: 'Example',
      overview: 'Overview',
      tagline: 'Tag',
      videos: { results: [] },
    });
  });

  describe('getTrailerWithOverview (trailer picking & mapping)', () => {
    function flushDetails(
      id: number,
      videos: Partial<TmdbVideo>[],
      extra?: Partial<{ title: string; overview: string; tagline?: string }>
    ) {
      const req = httpMock.expectOne(r => r.url.endsWith(`/movie/${id}`));
      expect(req.request.params.get('append_to_response')).toBe('videos');

      req.flush({
        id,
        title: extra?.title ?? 'T',
        overview: extra?.overview ?? 'O',
        tagline: extra?.tagline,
        videos: { results: videos as TmdbVideo[] },
      });
    }

    it('prefers YouTube "Official" Trailer, then any YouTube Trailer, then any Trailer', (done) => {
      service.getTrailerWithOverview(300).subscribe((res) => {
        expect(res.title).toBe('Inception');
        expect(res.overview).toBe('Mind-bending');
        expect(res.tagline).toBe('Your mind is the scene of the crime.');
        expect(res.trailer?.key).toBe('yt-official');
        expect(res.trailer?.name).toBe('Official Trailer');
        expect(res.trailer?.publishedAt).toBe('2010-05-10');
        done();
      });

      flushDetails(
        300,
        [
          { site: 'YouTube', type: 'Trailer', name: 'Teaser', key: 'yt-teaser', published_at: '2010-05-01' },
          { site: 'Vimeo', type: 'Trailer', name: 'Official Trailer', key: 'vimeo-official', published_at: '2010-05-09' },
          { site: 'YouTube', type: 'Trailer', name: 'Official Trailer', key: 'yt-official', published_at: '2010-05-10' },
        ],
        { title: 'Inception', overview: 'Mind-bending', tagline: 'Your mind is the scene of the crime.' }
      );
    });

    it('falls back to any YouTube Trailer when no "Official" is present', (done) => {
      service.getTrailerWithOverview(301).subscribe((res) => {
        expect(res.trailer?.key).toBe('yt-trailer-1');
        done();
      });

      flushDetails(
        301,
        [
          { site: 'YouTube', type: 'Trailer', name: 'Trailer 1', key: 'yt-trailer-1', published_at: '2020-01-01' },
          { site: 'Vimeo', type: 'Trailer', name: 'Trailer 2', key: 'vim-trailer-2', published_at: '2020-01-02' },
        ]
      );
    });

    it('omits trailer when only non-YouTube trailers exist', (done) => {
      service.getTrailerWithOverview(302).subscribe((res) => {
        expect(res.trailer).toBeUndefined();
        done();
      });

      flushDetails(
        302,
        [
          { site: 'Vimeo', type: 'Trailer', name: 'Official Trailer', key: 'vimeo-only', published_at: '2021-01-01' },
        ]
      );
    });

    it('returns undefined trailer when no trailers returned', (done) => {
      service.getTrailerWithOverview(303).subscribe((res) => {
        expect(res.trailer).toBeUndefined();
        done();
      });

      flushDetails(303, []);
    });
  });

  it('searchMovies sends query + page', () => {
    service.searchMovies('matrix', 4).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/search/movie'));
    const params = req.request.params;
    expect(params.get('query')).toBe('matrix');
    expect(params.get('page')).toBe('4');
    expect(params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(params.get('language')).toBe('en-US');

    req.flush({} as TmdbPage<TmdbMovie>);
  });

  it('getNowPlayingMovies and getUpcomingMovies send page param', () => {
    service.getNowPlayingMovies(2).subscribe();
    let req = httpMock.expectOne(r => r.url.endsWith('/movie/now_playing'));
    expect(req.request.params.get('page')).toBe('2');
    req.flush({} as TmdbPage<TmdbMovie>);

    service.getUpcomingMovies(5).subscribe();
    req = httpMock.expectOne(r => r.url.endsWith('/movie/upcoming'));
    expect(req.request.params.get('page')).toBe('5');
    req.flush({} as TmdbPage<TmdbMovie>);
  });

  it('getMovieVideos hits /movie/:id/videos', () => {
    service.getMovieVideos(999).subscribe();

    const req = httpMock.expectOne(r => r.url.endsWith('/movie/999/videos'));
    expect(req.request.method).toBe('GET');
    expect(req.request.params.get('api_key')).toBe(environment.tmdb.apiKey);
    expect(req.request.params.get('language')).toBe('en-US');

    req.flush({ id: 999, results: [] });
  });
});
