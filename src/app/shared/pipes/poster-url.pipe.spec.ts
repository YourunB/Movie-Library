import { TestBed } from '@angular/core/testing';
import { PosterUrlPipe } from './poster-url.pipe';
import { TmdbService } from '../services/dashboard/tmdb.service';

type ImageSize = 'w342' | 'w500' | 'original';

describe('PosterUrlPipe', () => {
  let pipe: PosterUrlPipe;
  let tmdb: jasmine.SpyObj<TmdbService>;

  beforeEach(() => {
    const tmdbSpy = jasmine.createSpyObj<TmdbService>('TmdbService', ['img']);

    TestBed.configureTestingModule({
      providers: [
        PosterUrlPipe,                       
        { provide: TmdbService, useValue: tmdbSpy },
      ],
    });

    tmdb = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
    pipe = TestBed.inject(PosterUrlPipe);

    tmdb.img.and.callFake((path?: string | null, size?: ImageSize) => {
      if (!path) return null;
      const s: ImageSize = size ?? 'w342';
      const slash = path.startsWith('/') ? '' : '/';
      return `https://image.tmdb.org/t/p/${s}${slash}${path}`;
    });
  });

  it('should be created', () => {
    expect(pipe).toBeTruthy();
  });

  it('returns TMDB url and uses default size (w342) when path is provided', () => {
    const result = pipe.transform('/poster.jpg');
    expect(tmdb.img).toHaveBeenCalledWith('/poster.jpg', 'w342');
    expect(result).toBe('https://image.tmdb.org/t/p/w342/poster.jpg');
  });

  it('uses the provided size when given', () => {
    const result = pipe.transform('/poster.jpg', 'w500');
    expect(tmdb.img).toHaveBeenCalledWith('/poster.jpg', 'w500');
    expect(result).toBe('https://image.tmdb.org/t/p/w500/poster.jpg');
  });

  it('returns placeholder when path is null', () => {
    tmdb.img.calls.reset();
    const result = pipe.transform(null);
    expect(tmdb.img).not.toHaveBeenCalled();
    expect(result).toBe('images/placeholder.jpg');
  });

  it('returns placeholder when path is undefined', () => {
    tmdb.img.calls.reset();
    const result = pipe.transform(undefined);
    expect(tmdb.img).not.toHaveBeenCalled();
    expect(result).toBe('images/placeholder.jpg');
  });

  it('returns placeholder when TmdbService.img returns null', () => {
    tmdb.img.and.returnValue(null);
    const result = pipe.transform('/poster.jpg');
    expect(tmdb.img).toHaveBeenCalledWith('/poster.jpg', 'w342');
    expect(result).toBe('images/placeholder.jpg');
  });
});
