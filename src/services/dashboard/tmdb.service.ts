import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { TmdbMovie, TmdbPage, TmdbPerson, TmdbReview } from '../../models/dashboard';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class TmdbService {
  private readonly http = inject(HttpClient);
  private readonly baseUrl = environment.tmdb.apiBaseUrl


  getTrendingMovies() {
    return this.http.get<TmdbPage<TmdbMovie>>(`${this.baseUrl}/trending/movie/week`);
  }

  getTopRatedMovies() {
    return this.http.get<TmdbPage<TmdbMovie>>(`${this.baseUrl}/movie/top_rated`);
  }

  getPopularPeople() {
    return this.http.get<TmdbPage<TmdbPerson>>(`${this.baseUrl}/person/popular`);
  }

  getMovieReviews(movieId: number) {
    return this.http.get<TmdbPage<TmdbReview>>(`${this.baseUrl}/movie/${movieId}/reviews`);
  }
}
