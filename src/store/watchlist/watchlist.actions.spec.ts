import {
  addMovie,
  deleteMovieById,
  loadListOfMovies,
  emptyListOfMovies,
} from './watchlist.actions';
import { TmdbMovie } from '../../models/dashboard';

describe('Watchlist Actions', () => {
  it('should create addMovie action with payload', () => {
    const movie: TmdbMovie = {
      id: 1,
      title: 'Test Movie',
      poster_path: '/poster.jpg',
      release_date: '2025-01-01',
    };
    const action = addMovie({ movie });
    expect(action.type).toBe('[Watchlist] Add Favorite Movie');
    expect(action.movie).toEqual(movie);
  });

  it('should create deleteMovieById action with movieId', () => {
    const action = deleteMovieById({ movieId: 42 });
    expect(action.type).toBe('[Watchlist] Delete Favourite Movie By ID');
    expect(action.movieId).toBe(42);
  });

  it('should create loadListOfMovies action with movies array', () => {
    const movies: TmdbMovie[] = [
      { id: 1, title: 'Movie One', poster_path: '', release_date: '' },
      { id: 2, title: 'Movie Two', poster_path: '', release_date: '' },
    ];
    const action = loadListOfMovies({ movies });
    expect(action.type).toBe('[Watchlist] Load list of favorite Movies');
    expect(action.movies).toEqual(movies);
  });

  it('should create emptyListOfMovies action without payload', () => {
    const action = emptyListOfMovies();
    expect(action.type).toBe('[Watchlist] Reload list of favorite Movies');
  });
});
