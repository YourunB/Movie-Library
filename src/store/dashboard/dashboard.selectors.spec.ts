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

  const baseState: DashboardState = {
    trending: [movieA],
    topRated: [movieB],
    popularPeople: [person],
    reviews: [review],
    selectedMovie: null,
    loading: true,
    loadingMovie: false,
    error: 'Oops',
  };

  // Infer app state type from a selector input (avoids `any` and index signatures)
  type AppState = Parameters<typeof selectTrending>[0];

  const makeState = (overrides: Partial<DashboardState> = {}): DashboardState => ({
    ...baseState,
    ...overrides,
  });

  const makeRootState = (state: DashboardState): AppState =>
    ({ dashboard: state } as unknown as AppState);

  it('selectDashboardState returns the feature slice', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectDashboardState(rootState)).toBe(state);
  });

  it('selectTrending returns trending list', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectTrending(rootState)).toEqual([movieA]);
    expect(selectTrending.projector(state)).toEqual([movieA]);
  });

  it('selectTopRated returns top rated list', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectTopRated(rootState)).toEqual([movieB]);
    expect(selectTopRated.projector(state)).toEqual([movieB]);
  });

  it('selectPopularPeople returns people list', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectPopularPeople(rootState)).toEqual([person]);
    expect(selectPopularPeople.projector(state)).toEqual([person]);
  });

  it('selectReviews returns reviews list', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectReviews(rootState)).toEqual([review]);
    expect(selectReviews.projector(state)).toEqual([review]);
  });

  it('selectLoading returns loading flag', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectLoading(rootState)).toBeTrue();
    expect(selectLoading.projector(state)).toBeTrue();
  });

  it('selectError returns error message', () => {
    const state = makeState();
    const rootState = makeRootState(state);

    expect(selectError(rootState)).toBe('Oops');
    expect(selectError.projector(state)).toBe('Oops');
  });

  it('selectSelectedMovie returns selected movie', () => {
    const state = makeState({ selectedMovie: movieB });
    const rootState = makeRootState(state);

    // Use toEqual for objects (selectors may return new references)
    expect(selectSelectedMovie(rootState)).toEqual(movieB);
    expect(selectSelectedMovie.projector(state)).toEqual(movieB);
  });

  it('selectLoadingMovie returns loadingMovie flag', () => {
    const state = makeState({ loadingMovie: true });
    const rootState = makeRootState(state);

    expect(selectLoadingMovie(rootState)).toBeTrue();
    expect(selectLoadingMovie.projector(state)).toBeTrue();
  });
});
