import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TmdbMovie, TmdbPage, TmdbPerson, TmdbReview } from '../../models/dashboard';
import { environment } from '../../environments/environment';



type PosterSize   = 'w92'|'w154'|'w185'|'w342'|'w500'|'w780'|'original';
type BackdropSize = 'w300'|'w780'|'w1280'|'original';
type ImageSize = PosterSize | BackdropSize;
@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.apiBaseUrl;
  private readonly apiKey  = environment.tmdb.apiKey;
  private readonly lang = 'en-US';


  private get<T>(path: string, params: Record<string, string | number> = {}) {
    const p = new HttpParams({
      fromObject: { api_key: this.apiKey, language: this.lang, ...params },
    });
    return this.http.get<T>(`${this.baseUrl}${path}`, { params: p });
  }

  getTrendingMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/trending/movie/week', { page });
  }

  getTopRatedMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/movie/top_rated', { page });
  }

  getPopularPeople(page = 1) {
    return this.get<TmdbPage<TmdbPerson>>('/person/popular', { page });
  }

  getMovieReviews(movieId: number, page = 1) {
    return this.get<TmdbPage<TmdbReview>>(`/movie/${movieId}/reviews`, { page });
  }

  getUpcomingMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/movie/upcoming', { page });
  }

  getNowPlayingMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/movie/now_playing', { page });
  }

  getMovieVideos(movieId: number) {
  return this.get<{ id: number; results: { key: string; site: string; type: string; name: string }[] }>(
    `/movie/${movieId}/videos`
  );
}

  img(path?: string | null, size: ImageSize = 'w500') {
    if (!path) return null;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/${size}${clean}`;
  }
}
