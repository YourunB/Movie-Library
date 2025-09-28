import { Action } from '@ngrx/store';
import {
  dashboardReducer,
  initialState,
  DashboardState,
} from './dashboard.reducer';
import * as DashboardActions from './dashboard.actions';
import {
  TmdbMovie,
  TmdbPerson,
  TmdbReview,
} from '../../models/dashboard';

describe('dashboardReducer', () => {
  it('returns the current state for an unknown action', () => {
    const action: Action = { type: 'UNKNOWN' };
    const state = dashboardReducer(initialState, action);
    expect(state).toBe(initialState);
  });

  it('loadDashboard -> sets loading true and clears error', () => {
    const start: DashboardState = {
      ...initialState,
      error: 'boom',
      trending: [{ id: 1 } as unknown as TmdbMovie],
    };

    const state = dashboardReducer(start, DashboardActions.loadDashboard());

    expect(state.loading).toBeTrue();
    expect(state.error).toBeNull();
    expect(state.trending).toBe(start.trending);
    expect(state.topRated).toBe(start.topRated);
    expect(state.popularPeople).toBe(start.popularPeople);
    expect(state.reviews).toBe(start.reviews);
  });

  it('loadDashboardSuccess -> populates lists, clears loading & error', () => {
    const trending: TmdbMovie[] = [{ id: 11 } as unknown as TmdbMovie];
    const topRated: TmdbMovie[] = [{ id: 22 } as unknown as TmdbMovie];
    const popularPeople: TmdbPerson[] = [{ id: 33 } as unknown as TmdbPerson];
    const reviews: TmdbReview[] = [{ id: 'r1' } as unknown as TmdbReview];

    const action = DashboardActions.loadDashboardSuccess({
      trending,
      topRated,
      popularPeople,
      reviews,
    });

    const state = dashboardReducer(
      { ...initialState, loading: true, error: 'err' },
      action
    );

    expect(state.loading).toBeFalse();
    expect(state.error).toBeNull();
    expect(state.trending).toEqual(trending);
    expect(state.topRated).toEqual(topRated);
    expect(state.popularPeople).toEqual(popularPeople);
    expect(state.reviews).toEqual(reviews);
  });

  it('loadDashboardFailure -> sets error and stops loading', () => {
    const state = dashboardReducer(
      { ...initialState, loading: true },
      DashboardActions.loadDashboardFailure({ error: 'oops' })
    );
    expect(state.loading).toBeFalse();
    expect(state.error).toBe('oops');
  });

  it('loadMovieById -> sets loadingMovie true and clears selectedMovie', () => {
    const start: DashboardState = {
      ...initialState,
      selectedMovie: { id: 99 } as unknown as TmdbMovie,
    };

    const state = dashboardReducer(
      start,
      DashboardActions.loadMovieById({ id: '42' }) 
    );

    expect(state.loadingMovie).toBeTrue();
    expect(state.selectedMovie).toBeNull();
    expect(state.trending).toBe(start.trending);
    expect(state.topRated).toBe(start.topRated);
    expect(state.popularPeople).toBe(start.popularPeople);
    expect(state.reviews).toBe(start.reviews);
  });

  it('loadMovieByIdSuccess -> stores movie and clears loadingMovie', () => {
    const movie = { id: 42 } as unknown as TmdbMovie;

    const state = dashboardReducer(
      { ...initialState, loadingMovie: true },
      DashboardActions.loadMovieByIdSuccess({ movie })
    );

    expect(state.loadingMovie).toBeFalse();
    expect(state.selectedMovie).toBe(movie);
    expect(state.error).toBeNull();
  });

  it('loadMovieByIdFailure -> sets error and clears loadingMovie', () => {
    const state = dashboardReducer(
      { ...initialState, loadingMovie: true },
      DashboardActions.loadMovieByIdFailure({ error: 'fail' })
    );

    expect(state.loadingMovie).toBeFalse();
    expect(state.error).toBe('fail');
  });
});
