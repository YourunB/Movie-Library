import { createReducer, on } from '@ngrx/store';
import { TmdbMovie, TmdbPerson, TmdbReview } from '../../models/dashboard';
import * as DashboardActions from './dashboard.actions';

export interface DashboardState {
  trending: TmdbMovie[];
  topRated: TmdbMovie[];
  popularPeople: TmdbPerson[];
  reviews: TmdbReview[];
  selectedMovie: TmdbMovie | null;
  loading: boolean;
  loadingMovie: boolean;
  error: string | null;
}

export const initialState: DashboardState = {
  trending: [],
  topRated: [],
  popularPeople: [],
  reviews: [],
  selectedMovie: null,
  loading: false,
  loadingMovie: false,
  error: null,
};

export const dashboardReducer = createReducer(
  initialState,
  on(DashboardActions.loadDashboard, (state) => ({
    ...state,
    loading: true,
    error: null,
  })),

  on(DashboardActions.loadDashboardSuccess, (state, payload) => ({
    ...state,
    ...payload,
    loading: false,
    error: null,
  })),

  on(DashboardActions.loadDashboardFailure, (state, { error }) => ({
    ...state,
    loading: false,
    error,
  })),

  on(DashboardActions.loadMovieById, (state) => ({
    ...state,
    loadingMovie: true,
    selectedMovie: null,
  })),

  on(DashboardActions.loadMovieByIdSuccess, (state, { movie }) => ({
    ...state,
    loadingMovie: false,
    selectedMovie: movie,
  })),

  on(DashboardActions.loadMovieByIdFailure, (state, { error }) => ({
    ...state,
    loadingMovie: false,
    error,
  }))
);
