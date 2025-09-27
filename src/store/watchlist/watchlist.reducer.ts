import { createReducer, on } from '@ngrx/store';
import * as WatchListActions from './watchlist.actions';
import { InitialWachlistState } from './watchlist.store';

export const watchlistReducer = createReducer(
  InitialWachlistState,

  on(WatchListActions.addMovie, (state, { movie }) => {
    const isMoviePresent = state.favorite.some(
      (favMovie) => favMovie.id === movie.id
    );

    return {
      ...state,
      favorite: isMoviePresent ? state.favorite : [...state.favorite, movie],
    };
  }),
  on(WatchListActions.deleteMovieById, (state, { movieId }) => ({
    ...state,
    favorite: state.favorite.filter((favMovie) => favMovie.id !== movieId),
  })),
  on(WatchListActions.loadListOfMovies, (state, { movies }) => ({
    ...state,
    favorite: movies,
  })),
   on(WatchListActions.emptyListOfMovies, (state) => ({
    ...state,
    favorite: [],
  }))
);
