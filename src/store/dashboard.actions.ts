import { createAction, props } from '@ngrx/store';
import { TmdbMovie, TmdbPerson, TmdbReview } from '../models/dashboard';

export const loadDashboard = createAction('[Dashboard] Load');
export const loadDashboardSuccess = createAction(
  '[Dashboard] Load Success',
  props<{
    trending: TmdbMovie[];
    topRated: TmdbMovie[];
    popularPeople: TmdbPerson[];
    reviews: TmdbReview[];
  }>()
);
export const loadDashboardFailure = createAction(
  '[Dashboard] Load Failure',
  props<{ error: string }>()
);

export const loadMovieById = createAction('[Dashboard] Load Movie By ID', props<{ id: string }>());
export const loadMovieByIdSuccess = createAction('[Dashboard] Load Movie By ID Success', props<{ movie: TmdbMovie }>());
export const loadMovieByIdFailure = createAction('[Dashboard] Load Movie By ID Failure', props<{ error: string }>());

