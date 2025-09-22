import { TmdbMovie } from '../../models/dashboard';

export interface WatchListState {
  favorite: TmdbMovie[];
}

export const InitialWachlistState: WatchListState = {
  favorite: [],
};
