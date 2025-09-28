import { HttpInterceptorFn, HttpParams } from '@angular/common/http';
import { environment } from '../environments/environment';


function isTmdbUrl(requestUrl: string, baseUrl: string): boolean {
  return requestUrl.startsWith(baseUrl);
}

export const tmdbAuthInterceptor: HttpInterceptorFn = (req, next) => {
  const baseUrl = environment.tmdb.apiBaseUrl
  const apiKey = environment.tmdb.apiKey
  

  if (!isTmdbUrl(req.url, baseUrl)) {
    return next(req);
  }

  const paramsWithKey: HttpParams = (req.params ?? new HttpParams()).set('api_key', apiKey);
  const authorizedReq = req.clone({ params: paramsWithKey });
  return next(authorizedReq);
};
