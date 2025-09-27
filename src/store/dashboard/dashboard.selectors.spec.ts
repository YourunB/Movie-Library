// src/store/dashboard/dashboard.selectors.spec.ts
import {
  selectDashboardState,
  selectTrending,
  selectTopRated,
  selectPopularPeople,
  selectReviews,
  selectLoading,
  selectError,
  selectSelectedMovie,
  selectLoadingMovie,
} from './dashboard.selectors';
import { DashboardState } from './dashboard.reducer';
import { TmdbMovie, TmdbPerson, TmdbReview } from '../../models/dashboard';

describe('Dashboard Selectors', () => {
  // Minimal mock entities (cast to target types to keep tests lightweight)
  const movieA = { id: 1, title: 'Movie A' } as unknown as TmdbMovie;
  const movieB = { id: 2, title: 'Movie B' } as unknown as TmdbMovie;
  const person = { id: 10, name: 'Person X' } as unknown as TmdbPerson;
  const review = { id: 'r1', author: 'Critic', content: 'Great!' } as unknown as TmdbReview;

  const featureState: DashboardState = {
    trending: [movieA],
    topRated: [movieB],
    popularPeople: [person],
    reviews: [review],
    selectedMovie: movieB,
    loading: true,
    loadingMovie: true,
    error: 'Oops',
  };

  interface RootState {
    dashboard: DashboardState;
  }

  const rootState: RootState = { dashboard: featureState };

  it('selectDashboardState returns the feature slice', () => {
    expect(selectDashboardState(rootState)).toBe(featureState);
  });

  it('selectTrending returns trending list', () => {
    // via full selector (root state)
    expect(selectTrending(rootState)).toEqual([movieA]);
    // via projector (unit-level)
    expect(selectTrending.projector(featureState)).toEqual([movieA]);
  });

  it('selectTopRated returns top rated list', () => {
    expect(selectTopRated(rootState)).toEqual([movieB]);
    expect(selectTopRated.projector(featureState)).toEqual([movieB]);
  });

  it('selectPopularPeople returns people list', () => {
    expect(selectPopularPeople(rootState)).toEqual([person]);
    expect(selectPopularPeople.projector(featureState)).toEqual([person]);
  });

  it('selectReviews returns reviews list', () => {
    expect(selectReviews(rootState)).toEqual([review]);
    expect(selectReviews.projector(featureState)).toEqual([review]);
  });

  it('selectLoading returns loading flag', () => {
    expect(selectLoading(rootState)).toBeTrue();
    expect(selectLoading.projector(featureState)).toBeTrue();
  });

  it('selectError returns error message', () => {
    expect(selectError(rootState)).toBe('Oops');
    expect(selectError.projector(featureState)).toBe('Oops');
  });

  it('selectSelectedMovie returns selected movie', () => {
    expect(selectSelectedMovie(rootState)).toBe(movieB);
    expect(selectSelectedMovie.projector(featureState)).toBe(movieB);
  });

  it('selectLoadingMovie returns loadingMovie flag', () => {
    expect(selectLoadingMovie(rootState)).toBeTrue();
    expect(selectLoadingMovie.projector(featureState)).toBeTrue();
  });
});
