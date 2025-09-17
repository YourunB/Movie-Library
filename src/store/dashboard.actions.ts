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
