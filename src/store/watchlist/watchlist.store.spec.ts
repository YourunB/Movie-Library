import { InitialWachlistState } from './watchlist.store';

describe('InitialWachlistState', () => {
  it('should have an empty favorite list', () => {
    expect(InitialWachlistState.favorite).toEqual([]);
  });
});
