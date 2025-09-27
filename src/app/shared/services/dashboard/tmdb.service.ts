import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import {
  TmdbMovie,
  TmdbPage,
  TmdbPerson,
  TmdbReview,
  TmdbVideo,
} from '../../../../models/dashboard';
import { environment } from '../../../../environments/environment';
import { map } from 'rxjs';
import { LanguageService } from '../language.service';
// import { HistoryService } from '../history.service';

type PosterSize =
  | 'w92'
  | 'w154'
  | 'w185'
  | 'w342'
  | 'w500'
  | 'w780'
  | 'original';
type BackdropSize = 'w300' | 'w780' | 'w1280' | 'original';
type ImageSize = PosterSize | BackdropSize;
interface TmdbVideos {
  results: TmdbVideo[];
}
interface TmdbMovieDetails {
  id: number;
  title: string;
  overview: string;
  tagline?: string;
  videos?: TmdbVideos;
}

export const languageMap: Record<string, string> = {
  en: 'en-US',
  ru: 'ru-RU',
  pl: 'pl-PL',
};

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.apiBaseUrl;
  private readonly apiKey = environment.tmdb.apiKey;
  private lang = 'en-US';
  langRequests = signal<string>('en-US');
  private languageService = inject(LanguageService);
  constructor() {
    this.languageService.language$.subscribe((lang) => {
      this.lang = languageMap[lang] || this.lang;
      this.langRequests.set(lang);
    });
  }

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
    return this.get<TmdbPage<TmdbReview>>(`/movie/${movieId}/reviews`, {
      page,
    });
  }

  getMovieById(movieId: number) {
    return this.get<TmdbMovie>(`/movie/${movieId}`);
  }

  getUpcomingMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/movie/upcoming', { page });
  }

  getNowPlayingMovies(page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/movie/now_playing', { page });
  }

  searchMovies(query: string, page = 1) {
    return this.get<TmdbPage<TmdbMovie>>('/search/movie', { query, page });
  }

  getMovieVideos(movieId: number) {
    return this.get<{
      id: number;
      results: { key: string; site: string; type: string; name: string }[];
    }>(`/movie/${movieId}/videos`);
  }

  img(path?: string | null, size: ImageSize = 'w500') {
    if (!path) return null;
    const clean = path.startsWith('/') ? path : `/${path}`;
    return `https://image.tmdb.org/t/p/${size}${clean}`;
  }

  getMovieDetailsWithVideos(movieId: number) {
    return this.get<TmdbMovieDetails>(`/movie/${movieId}`, {
      append_to_response: 'videos',
    });
  }

  private pickPreferredTrailer(list: TmdbVideo[] = []): TmdbVideo | undefined {
    const lower = (s?: string) => (s ?? '').toLowerCase();
    return (
      list.find(
        (v) =>
          v.site === 'YouTube' &&
          v.type === 'Trailer' &&
          lower(v.name).includes('official')
      ) ||
      list.find((v) => v.site === 'YouTube' && v.type === 'Trailer') ||
      list.find((v) => v.type === 'Trailer') ||
      undefined
    );
  }

  getTrailerWithOverview(movieId: number) {
    return this.getMovieDetailsWithVideos(movieId).pipe(
      map((d) => {
        const trailer = this.pickPreferredTrailer(d.videos?.results ?? []);
        return {
          overview: d.overview,
          tagline: d.tagline,
          title: d.title,
          trailer:
            trailer && trailer.site === 'YouTube'
              ? {
                  key: trailer.key,
                  name: trailer.name,
                  publishedAt: trailer.published_at,
                }
              : undefined,
        };
      })
    );
  }

  getMovieCredits(movieId: number) {
    return this.get<{
      id: number;
      cast: {
        id: number;
        name: string;
        character?: string;
        profile_path: string | null;
      }[];
      crew: unknown[];
    }>(`/movie/${movieId}/credits`);
  }
}
