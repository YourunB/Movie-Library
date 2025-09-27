import { TestBed } from '@angular/core/testing';
import { MovieResolver } from './movie.resolver';
import { Store } from '@ngrx/store';
import { ActivatedRouteSnapshot, convertToParamMap } from '@angular/router';
import { loadMovieById } from '../dashboard/dashboard.actions';
import { Observable } from 'rxjs';

describe('MovieResolver', () => {
  let resolver: MovieResolver;
  let storeSpy: jasmine.SpyObj<Store<unknown>>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj<Store<unknown>>('Store', ['dispatch']);

    TestBed.configureTestingModule({
      providers: [
        MovieResolver,
        { provide: Store, useValue: spy }
      ]
    });

    resolver = TestBed.inject(MovieResolver);
    storeSpy = TestBed.inject(Store) as jasmine.SpyObj<Store<unknown>>;
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });

  it('should dispatch loadMovieById when id is present', (done: DoneFn) => {
    const route: ActivatedRouteSnapshot = {
      paramMap: convertToParamMap({ id: '123' })
    } as ActivatedRouteSnapshot;

    const result$: Observable<true> = resolver.resolve(route);

    result$.subscribe(result => {
      expect(result).toBeTrue();
      expect(storeSpy.dispatch).toHaveBeenCalledWith(loadMovieById({ id: '123' }));
      done();
    });
  });

  it('should not dispatch anything when id is missing', (done: DoneFn) => {
    const route: ActivatedRouteSnapshot = {
      paramMap: convertToParamMap({})
    } as ActivatedRouteSnapshot;

    const result$: Observable<true> = resolver.resolve(route);

    result$.subscribe(result => {
      expect(result).toBeTrue();
      expect(storeSpy.dispatch).not.toHaveBeenCalled();
      done();
    });
  });
});
