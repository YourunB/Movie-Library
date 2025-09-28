import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BehaviorSubject, of } from 'rxjs';
import { LanguageService } from '../language.service';
import {
  TmdbMovie,
  TmdbPage,
  TmdbVideo,
} from '../../../../models/dashboard';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let language$: BehaviorSubject<string>;

  const mockMovie: TmdbMovie = { id: 1, title: 'Test Movie' } as TmdbMovie;

  const pageOf = <T>(item: T): TmdbPage<T> => ({
    page: 1,
    results: [item],
    total_pages: 1,
    total_results: 1,
  });

  function setup(initialLang: string): void {
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    language$ = new BehaviorSubject<string>(initialLang);

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: LanguageService, useValue: { language$ } },
      ],
    });

    service = TestBed.inject(TmdbService);
  }

  function lastCall() {
    const [url, options] = httpSpy.get.calls.mostRecent()
      .args as [string, { params: HttpParams }];
    return { url, params: options.params };
  }

  beforeEach(function beforeEachSpec(): void {
    setup('en'); // maps to en-US
  });

  it('should be created', function shouldCreate(): void {
    expect(service).toBeTruthy();
  });

  it('maps known language codes and includes them in params', function shouldMapKnownLang(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));

    language$.next('pl'); // => pl-PL
    service.getTopRatedMovies(2).subscribe((res) => {
      expect(res.results[0].id).toBe(1);
    });

    const { params } = lastCall();
    expect(params.get('language')).toBe('pl-PL');
    expect(params.get('page')).toBe('2');
    expect(service.langRequests()).toBe('pl');
    expect((service as unknown as { lang: string }).lang).toBe('pl-PL');
  });

  it('falls back to previous language if mapping is unknown', function shouldFallbackForUnknown(): void {
    // rebuild with an unknown first emission
    TestBed.resetTestingModule();
    httpSpy = jasmine.createSpyObj<HttpClient>('HttpClient', ['get']);
    const unknown$ = new BehaviorSubject<string>('xx');

    TestBed.configureTestingModule({
      providers: [
        { provide: HttpClient, useValue: httpSpy },
        { provide: LanguageService, useValue: { language$: unknown$ } },
      ],
    });

    service = TestBed.inject(TmdbService);

    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.getTrendingMovies(1).subscribe();

    const { params } = lastCall();
    expect(params.get('language')).toBe('en-US');      // default preserved
    expect(service.langRequests()).toBe('xx');         // raw request code
    expect((service as unknown as { lang: string }).lang).toBe('en-US');
  });

  it('fetches trending movies with page param', function shouldFetchTrending(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.getTrendingMovies(3).subscribe();

    const { url, params } = lastCall();
    expect(url).toMatch(/\/trending\/movie\/week$/);
    expect(params.get('page')).toBe('3');
    expect(params.has('api_key')).toBeTrue();
  });

  it('fetches top rated movies', function shouldFetchTopRated(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.getTopRatedMovies(1).subscribe();

    const { url } = lastCall();
    expect(url).toMatch(/\/movie\/top_rated$/);
  });

  it('fetches popular people', function shouldFetchPopularPeople(): void {
    httpSpy.get.and.returnValue(of(pageOf({ id: 10, name: 'Person' })));
    service.getPopularPeople(1).subscribe();

    const { url } = lastCall();
    expect(url).toMatch(/\/person\/popular$/);
  });

  it('fetches movie reviews with page param', function shouldFetchReviews(): void {
    httpSpy.get.and.returnValue(of(pageOf({ id: 'r1', author: 'Critic' })));
    service.getMovieReviews(42, 5).subscribe();

    const { url, params } = lastCall();
    expect(url).toMatch(/\/movie\/42\/reviews$/);
    expect(params.get('page')).toBe('5');
  });

  it('fetches movie by id', function shouldFetchMovieById(): void {
  // ✅ make the mock match the requested id
  httpSpy.get.and.returnValue(of({ id: 7, title: 'Movie #7' } as TmdbMovie));

  service.getMovieById(7).subscribe((res) => {
    expect(res.id).toBe(7);
    expect(res.title).toBe('Movie #7');
  });

  // optional: also assert the URL
  const [url] = httpSpy.get.calls.mostRecent().args as [string, { params: HttpParams }];
  expect(url).toMatch(/\/movie\/7$/);
});

  it('fetches upcoming movies', function shouldFetchUpcoming(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.getUpcomingMovies(2).subscribe();

    const { url, params } = lastCall();
    expect(url).toMatch(/\/movie\/upcoming$/);
    expect(params.get('page')).toBe('2');
  });

  it('fetches now playing movies', function shouldFetchNowPlaying(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.getNowPlayingMovies(4).subscribe();

    const { url, params } = lastCall();
    expect(url).toMatch(/\/movie\/now_playing$/);
    expect(params.get('page')).toBe('4');
  });

  it('searches movies with query param', function shouldSearchMovies(): void {
    httpSpy.get.and.returnValue(of(pageOf(mockMovie)));
    service.searchMovies('matrix', 6).subscribe();

    const { url, params } = lastCall();
    expect(url).toMatch(/\/search\/movie$/);
    expect(params.get('query')).toBe('matrix');
    expect(params.get('page')).toBe('6');
  });

  it('fetches movie videos', function shouldFetchVideos(): void {
    httpSpy.get.and.returnValue(
  of({
    id: 1,
    results: [] as { key: string; site: string; type: string; name: string }[],
  })
);
    service.getMovieVideos(99).subscribe();

    const { url } = lastCall();
    expect(url).toMatch(/\/movie\/99\/videos$/);
  });

  it('requests movie details with videos via append_to_response', function shouldAppendVideos(): void {
    const details = {
      id: 2,
      title: 'Title',
      overview: 'Overview',
      tagline: 'Tag',
      videos: { results: [] as TmdbVideo[] },
    };
    httpSpy.get.and.returnValue(of(details));
    service.getMovieDetailsWithVideos(2).subscribe((res) => {
      expect(res.title).toBe('Title');
      expect(res.videos?.results.length).toBe(0);
    });

    const { url, params } = lastCall();
    expect(url).toMatch(/\/movie\/2$/);
    expect(params.get('append_to_response')).toBe('videos');
  });

  it('maps trailer + overview preferring Official YouTube trailer', function shouldPreferOfficialYouTube(): void {
    const vids: TmdbVideo[] = [
      { key: 'k1', site: 'YouTube', type: 'Trailer', name: 'Official Trailer', published_at: '2024-01-01' } as TmdbVideo,
      { key: 'k2', site: 'YouTube', type: 'Trailer', name: 'Teaser', published_at: '2024-01-02' } as TmdbVideo,
      { key: 'k3', site: 'Vimeo',   type: 'Trailer', name: 'Trailer', published_at: '2024-01-03' } as TmdbVideo,
    ];
    httpSpy.get.and.returnValue(of({
      id: 3, title: 'T', overview: 'O', tagline: 'G', videos: { results: vids }
    }));

    service.getTrailerWithOverview(3).subscribe((res) => {
      expect(res.title).toBe('T');
      expect(res.tagline).toBe('G');
      expect(res.trailer?.key).toBe('k1');
      expect(res.trailer?.publishedAt).toBe('2024-01-01');
    });
  });

  it('falls back to YouTube Trailer when no "official" in name', function shouldFallbackYouTubeTrailer(): void {
    const vids: TmdbVideo[] = [
      { key: 'k2', site: 'YouTube', type: 'Trailer', name: 'Main Trailer', published_at: '2024-02-01' } as TmdbVideo,
      { key: 'k3', site: 'Vimeo',   type: 'Trailer', name: 'Trailer',      published_at: '2024-02-02' } as TmdbVideo,
    ];
    httpSpy.get.and.returnValue(of({
      id: 4, title: 'T2', overview: 'O2', videos: { results: vids }
    }));

    service.getTrailerWithOverview(4).subscribe((res) => {
      expect(res.trailer?.key).toBe('k2');
    });
  });

  it('returns undefined when best trailer is non-YouTube', function shouldReturnUndefinedWhenNonYouTube(): void {
  const vids: TmdbVideo[] = [
    { key: 'vm', site: 'Vimeo', type: 'Trailer', name: 'Trailer', published_at: '2024-03-01' } as TmdbVideo,
  ];
  httpSpy.get.and.returnValue(of({
    id: 5, title: 'T3', overview: 'O3', videos: { results: vids }
  }));

  service.getTrailerWithOverview(5).subscribe((res) => {
    expect(res.trailer).toBeUndefined();
  });
});

  it('returns undefined trailer when none suitable', function shouldReturnUndefinedTrailer(): void {
    const vids: TmdbVideo[] = [
      { key: 'c1', site: 'YouTube', type: 'Clip', name: 'Clip', published_at: '2024-04-01' } as TmdbVideo,
    ];
    httpSpy.get.and.returnValue(of({
      id: 6, title: 'T4', overview: 'O4', videos: { results: vids }
    }));

    service.getTrailerWithOverview(6).subscribe((res) => {
      expect(res.trailer).toBeUndefined();
    });
  });

  it('exposes correct credits endpoint and parses shape', function shouldFetchCredits(): void {
    httpSpy.get.and.returnValue(of({
      id: 7,
      cast: [
        { id: 100, name: 'Actor', character: 'Hero', profile_path: null },
      ],
      crew: [],
    }));

    service.getMovieCredits(7).subscribe((res) => {
      expect(res.cast[0].name).toBe('Actor');
      expect(res.cast[0].profile_path).toBeNull();
    });

    const { url } = lastCall();
    expect(url).toMatch(/\/movie\/7\/credits$/);
  });

  it('builds image URLs and handles edge cases', function shouldBuildImageUrls(): void {
    expect(service.img('/poster.jpg', 'w500')).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
    expect(service.img('poster.jpg', 'original')).toBe('https://image.tmdb.org/t/p/original/poster.jpg');
    expect(service.img('')).toBeNull();
    expect(service.img(null)).toBeNull();
    expect(service.img(undefined)).toBeNull();
  });

  it('private pickPreferredTrailer ordering (direct)', function shouldPreferOrderDirect(): void {
    const pick = (service as unknown as {
      pickPreferredTrailer(list: TmdbVideo[]): TmdbVideo | undefined
    }).pickPreferredTrailer;

    const official = { key: 'a', site: 'YouTube', type: 'Trailer', name: 'OFFICIAL Trailer', published_at: '' } as TmdbVideo;
    const yt = { key: 'b', site: 'YouTube', type: 'Trailer', name: 'Trailer', published_at: '' } as TmdbVideo;
    const anyTr = { key: 'c', site: 'Vimeo', type: 'Trailer', name: 'Trailer', published_at: '' } as TmdbVideo;
    const clip = { key: 'd', site: 'YouTube', type: 'Clip', name: 'Clip', published_at: '' } as TmdbVideo;

    expect(pick([clip, yt, anyTr, official])?.key).toBe('a'); // official wins
    expect(pick([clip, yt, anyTr])?.key).toBe('b');           // YouTube trailer next
    expect(pick([clip, anyTr])?.key).toBe('c');               // any Trailer next
    expect(pick([clip])).toBeUndefined();                     // none
  });

  it('keeps previous mapped language when an unknown code arrives later', function shouldKeepPrevLangOnUnknown(): void {
  // assumes you used BehaviorSubject<string> language$
  // If not, rewire TestBed like in earlier setup with a BehaviorSubject.
  httpSpy.get.and.returnValue(of({ page: 1, results: [], total_pages: 1, total_results: 0 }));

  // switch to a known mapping first
  (language$ as BehaviorSubject<string>).next('ru'); // -> ru-RU
  service.getTopRatedMovies(1).subscribe();

  // now emit unknown; service should keep ru-RU
  (language$ as BehaviorSubject<string>).next('xx');
  service.getTopRatedMovies(1).subscribe();

  const args = httpSpy.get.calls.mostRecent().args as [string, { params: HttpParams }];
  expect(args[1].params.get('language')).toBe('ru-RU');
});

it('getTrailerWithOverview returns undefined trailer when videos are missing', function shouldHandleMissingVideos(): void {
  // /movie/{id}?append_to_response=videos returns a payload without `videos`
  httpSpy.get.and.returnValue(of({ id: 8, title: 'No Vids', overview: 'O' }));
  service.getTrailerWithOverview(8).subscribe((res) => {
    expect(res.title).toBe('No Vids');
    expect(res.trailer).toBeUndefined();
  });
});

it('pickPreferredTrailer returns undefined for empty list', function shouldReturnUndefinedForEmptyList(): void {
  const pick = (service as unknown as { pickPreferredTrailer(list: TmdbVideo[]): TmdbVideo | undefined })
    .pickPreferredTrailer;
  expect(pick([])).toBeUndefined();
});

it('img() uses default size w500 when size omitted', function shouldUseDefaultImgSize(): void {
  const url = service.img('poster.jpg'); // no size passed
  expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
});

it('searchMovies keeps full query string including special chars', function shouldKeepSpecialCharsInQuery(): void {
  httpSpy.get.and.returnValue(of({ page: 1, results: [], total_pages: 1, total_results: 0 }));
  service.searchMovies('mad max: fury road', 1).subscribe();

  const args = httpSpy.get.calls.mostRecent().args as [string, { params: HttpParams }];
  expect(args[0]).toMatch(/\/search\/movie$/);
  expect(args[1].params.get('query')).toBe('mad max: fury road'); // HttpParams stores raw, encodes on URL build
});


it('pickPreferredTrailer is case-insensitive for "official" anywhere in name', function shouldMatchOfficialCaseInsensitive(): void {
  const pick = (service as unknown as { pickPreferredTrailer(list: TmdbVideo[]): TmdbVideo | undefined })
    .pickPreferredTrailer;

  const vids: TmdbVideo[] = [
    { key: 'y1', site: 'YouTube', type: 'Trailer', name: 'The OffiCIA L Final Trailer', published_at: '' } as TmdbVideo,
    { key: 'y2', site: 'YouTube', type: 'Trailer', name: 'Teaser', published_at: '' } as TmdbVideo,
  ];
  expect(pick(vids)?.key).toBe('y1');
});
});
