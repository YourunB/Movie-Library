import { watchlistReducer } from './watchlist.reducer';
import * as WatchListActions from './watchlist.actions';
import { InitialWachlistState } from './watchlist.store';
import { TmdbMovie } from '../../models/dashboard';

describe('watchlistReducer', () => {
  const movie: TmdbMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/poster.jpg',
    release_date: '2025-01-01',
  };

  it('should add a movie to favorites if not present', () => {
    const state = watchlistReducer(InitialWachlistState, WatchListActions.addMovie({ movie }));
    expect(state.favorite).toEqual([movie]);
  });

  it('should not add a movie if already present', () => {
    const initialState = { favorite: [movie] };
    const state = watchlistReducer(initialState, WatchListActions.addMovie({ movie }));
    expect(state.favorite).toEqual([movie]);
  });

  it('should delete a movie by id', () => {
    const initialState = { favorite: [movie] };
    const state = watchlistReducer(initialState, WatchListActions.deleteMovieById({ movieId: 1 }));
    expect(state.favorite).toEqual([]);
  });

  it('should load a list of movies', () => {
    const movies: TmdbMovie[] = [
      { id: 1, title: 'One', poster_path: '', release_date: '' },
      { id: 2, title: 'Two', poster_path: '', release_date: '' },
    ];
    const state = watchlistReducer(InitialWachlistState, WatchListActions.loadListOfMovies({ movies }));
    expect(state.favorite).toEqual(movies);
  });

  it('should empty the list of movies', () => {
    const initialState = { favorite: [movie] };
    const state = watchlistReducer(initialState, WatchListActions.emptyListOfMovies());
    expect(state.favorite).toEqual([]);
  });
});
