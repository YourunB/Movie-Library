import {
  selectWatchListState,
  selectFavoriteMovies,
} from './watchlist.selectors';
import { WatchListState } from './watchlist.store';
import { TmdbMovie } from '../../models/dashboard';

describe('Watchlist Selectors', () => {
  const movie: TmdbMovie = {
    id: 1,
    title: 'Test Movie',
    poster_path: '/poster.jpg',
    release_date: '2025-01-01',
  };

  const state = {
    watchlist: {
      favorite: [movie],
    } satisfies WatchListState,
  };

  it('should select watchlist state', () => {
    const result = selectWatchListState.projector(state.watchlist);
    expect(result.favorite).toEqual([movie]);
  });

  it('should select favorite movies', () => {
    const result = selectFavoriteMovies.projector(state.watchlist);
    expect(result).toEqual([movie]);
  });
});
