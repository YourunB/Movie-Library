import { createAction, props } from '@ngrx/store';
import { TmdbMovie } from '../../models/dashboard';

export const addMovie = createAction(
  '[Watchlist] Add Favorite Movie',
  props<{ movie: TmdbMovie }>()
);

export const deleteMovieById = createAction(
  '[Watchlist] Delete Favourite Movie By ID',
  props<{ movieId: number }>()
);

export const loadListOfMovies = createAction(
  '[Watchlist] Load list of favorite Movies',
  props<{ movies: TmdbMovie[] }>()
);

