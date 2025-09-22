import { TmdbMovie } from '../../models/dashboard';

export interface WatchList {
  favorite: TmdbMovie[];
}

export const InitialWachlistState: WatchList = {
  favorite: [],
};
