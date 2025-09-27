import { tmdbAuthInterceptor } from './tmdb-auth.interceptor';
import { HttpRequest, HttpHandlerFn, HttpParams, HttpEvent } from '@angular/common/http';
import { environment } from '../environments/environment';
import { of } from 'rxjs';

describe('tmdbAuthInterceptor', () => {
  const baseUrl = environment.tmdb.apiBaseUrl;
  const apiKey = environment.tmdb.apiKey;

  it('should pass through non-TMDB requests unchanged', (done) => {
    const req = new HttpRequest('GET', 'https://example.com/data');
    const next: HttpHandlerFn = r => {
      expect(r).toBe(req);
      return of({} as HttpEvent<unknown>);
    };

    tmdbAuthInterceptor(req, next).subscribe(() => done());
  });

  it('should append api_key to TMDB requests', (done) => {
    const req = new HttpRequest('GET', `${baseUrl}/movie/123`, {
      params: new HttpParams(),
    });

    const next: HttpHandlerFn = r => {
      expect(r.params.get('api_key')).toBe(apiKey);
      expect(r).not.toBe(req);
      return of({} as HttpEvent<unknown>);
    };

    tmdbAuthInterceptor(req, next).subscribe(() => done());
  });
});
