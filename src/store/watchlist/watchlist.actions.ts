import { createAction, props } from '@ngrx/store';
import { TmdbMovie } from '../../models/dashboard';

export const addMovie = createAction(
  '[Watchlist] Add movie Movie',
  props<{ movie: TmdbMovie }>()
);

export const deleteMovieById = createAction(
  '[Dashboard] Load Movie By ID',
  props<{ movieId: number }>()
);
