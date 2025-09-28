import { TestBed } from '@angular/core/testing';
import { TmdbService } from './tmdb.service';
import { HttpClient } from '@angular/common/http';
import { of } from 'rxjs';
import { LanguageService } from '../language.service';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';

describe('TmdbService', () => {
  let service: TmdbService;
  let httpSpy: jasmine.SpyObj<HttpClient>;
  let langSpy: jasmine.SpyObj<LanguageService>;

  const mockMovie: TmdbMovie = { id: 1, title: 'Test Movie' } as TmdbMovie;
  const mockPage: TmdbPage<TmdbMovie> = {
    page: 1,
    results: [mockMovie],
    total_pages: 1,
    total_results: 1,
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
    httpSpy.get.and.returnValue(of(mockPage));
    service.getTrendingMovies(1).subscribe((res) => {
      expect(res).toEqual(mockPage);
    });
    expect(httpSpy.get).toHaveBeenCalled();
  });

  it('should fetch movie by ID', () => {
    httpSpy.get.and.returnValue(of(mockMovie));
    service.getMovieById(1).subscribe((res) => {
      expect(res).toEqual(mockMovie);
    });
    expect(httpSpy.get).toHaveBeenCalledWith(
      jasmine.stringMatching(/\/movie\/1$/),
      jasmine.any(Object)
    );
  });

  it('should search movies by query', () => {
    httpSpy.get.and.returnValue(of(mockPage));
    service.searchMovies('test', 1).subscribe((res) => {
      expect(res.results[0].title).toBe('Test Movie');
    });
    expect(httpSpy.get).toHaveBeenCalledWith(
      jasmine.stringMatching(/\/search\/movie$/),
      jasmine.objectContaining({
        params: jasmine.anything(),
      })
    );
  });

  it('should build image URL', () => {
    const url = service.img('/poster.jpg', 'w500');
    expect(url).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('should return null for missing image path', () => {
    expect(service.img(null)).toBeNull();
    expect(service.img(undefined)).toBeNull();
  });
});
