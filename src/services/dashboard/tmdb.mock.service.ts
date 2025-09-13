import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { TmdbPage, TmdbMovie, TmdbPerson, TmdbReview } from '../../models/dashboard';
import {
  TRENDING_MOVIES_MOCK,
  TOP_RATED_MOVIES_MOCK,
  POPULAR_PEOPLE_MOCK,
  REVIEWS_MOCK
} from '../../mocks/tmdb.mock-data';

@Injectable()
export class TmdbMockService {
  getTrendingMovies(): Observable<TmdbPage<TmdbMovie>> {
    return of(TRENDING_MOVIES_MOCK).pipe(delay(300));
  }
  getTopRatedMovies(): Observable<TmdbPage<TmdbMovie>> {
    return of(TOP_RATED_MOVIES_MOCK).pipe(delay(300));
  }
  getPopularPeople(): Observable<TmdbPage<TmdbPerson>> {
    return of(POPULAR_PEOPLE_MOCK).pipe(delay(300));
  }
  getMovieReviews(): Observable<TmdbPage<TmdbReview>> {
    return of(REVIEWS_MOCK).pipe(delay(300));
  }
}
