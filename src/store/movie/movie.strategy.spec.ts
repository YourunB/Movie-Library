import { MoviePreloadStrategy } from './movie.strategy';
import { Route } from '@angular/router';
import { of } from 'rxjs';

describe('MoviePreloadStrategy', () => {
  let strategy: MoviePreloadStrategy;

  beforeEach(() => {
    strategy = new MoviePreloadStrategy();
  });

  it('should preload route if path starts with "movie"', (done: DoneFn) => {
    const route: Route = { path: 'movie-details' };
    const loadFn = jasmine.createSpy('load').and.returnValue(of('loaded'));

    strategy.preload(route, loadFn).subscribe(result => {
      expect(loadFn).toHaveBeenCalled();
      expect(result).toBe('loaded');
      done();
    });
  });

  it('should not preload route if path does not start with "movie"', (done: DoneFn) => {
    const route: Route = { path: 'dashboard' };
    const loadFn = jasmine.createSpy('load');

    strategy.preload(route, loadFn).subscribe(result => {
      expect(loadFn).not.toHaveBeenCalled();
      expect(result).toBeNull();
      done();
    });
  });

  it('should not preload route if path is undefined', (done: DoneFn) => {
    const route: Route = {};
    const loadFn = jasmine.createSpy('load');

    strategy.preload(route, loadFn).subscribe(result => {
      expect(loadFn).not.toHaveBeenCalled();
      expect(result).toBeNull();
      done();
    });
  });
});
