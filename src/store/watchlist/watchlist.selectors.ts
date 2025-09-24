import { createFeatureSelector, createSelector } from '@ngrx/store';
import { WatchListState } from './watchlist.store';

export const selectWatchListState = createFeatureSelector<WatchListState>('watchlist');

export const selectFavoriteMovies = createSelector(selectWatchListState, (state: WatchListState) => state.favorite);


