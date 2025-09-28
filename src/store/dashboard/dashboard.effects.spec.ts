import { TestBed } from '@angular/core/testing';
import { provideMockActions } from '@ngrx/effects/testing';
import { Action } from '@ngrx/store';
import { Observable, Subject, of, throwError } from 'rxjs';
import { signal, WritableSignal } from '@angular/core';

import { DashboardEffects } from './dashboard.effects';
import * as DashboardActions from './dashboard.actions';

import { TmdbService } from '../../app/shared/services/dashboard/tmdb.service';
import { TmdbMovie, TmdbPage, TmdbPerson } from '../../models/dashboard';

describe('DashboardEffects', () => {
  let actions$: Subject<Action>;
  let effects: DashboardEffects;
  let tmdb: jasmine.SpyObj<TmdbService>;

  function page<T>(results: T[] = []): TmdbPage<T> {
    return {
      page: 1,
      total_pages: 1,
      total_results: results.length,
      results,
    };
  }

  beforeEach(() => {
    // Create the spy with the methods the effects call
    const tmdbSpy = jasmine.createSpyObj<TmdbService>('TmdbService', [
      'getTrendingMovies',
      'getTopRatedMovies',
      'getPopularPeople',
      'getMovieById',
    ]);
    (tmdbSpy as unknown as TmdbService & { langRequests: WritableSignal<string> })
      .langRequests = signal('en-US');

    TestBed.configureTestingModule({
      providers: [
        DashboardEffects,
        provideMockActions((): Observable<Action> => (actions$ = new Subject<Action>())),
        { provide: TmdbService, useValue: tmdbSpy },
      ],
    });

    effects = TestBed.inject(DashboardEffects);
    tmdb = TestBed.inject(TmdbService) as jasmine.SpyObj<TmdbService>;
  });

  it('load$ > emits loadDashboardSuccess with fetched lists', (done) => {
    tmdb.getTrendingMovies.and.returnValue(of(page<TmdbMovie>([])));
    tmdb.getTopRatedMovies.and.returnValue(of(page<TmdbMovie>([])));
    tmdb.getPopularPeople.and.returnValue(of(page<TmdbPerson>([])));

    effects.load$.subscribe((action) => {
      expect(action).toEqual(
        DashboardActions.loadDashboardSuccess({
          trending: [],
          topRated: [],
          popularPeople: [],
          reviews: [],
        })
      );
      done();
    });

    actions$.next(DashboardActions.loadDashboard());
  });

  it('load$ > emits loadDashboardFailure when a TMDB call fails', (done) => {
    tmdb.getTrendingMovies.and.returnValue(throwError(() => new Error('boom')));
    tmdb.getTopRatedMovies.and.returnValue(of(page<TmdbMovie>([])));
    tmdb.getPopularPeople.and.returnValue(of(page<TmdbPerson>([])));

    effects.load$.subscribe((action) => {
      expect(action.type).toBe(DashboardActions.loadDashboardFailure.type);
      expect((action as ReturnType<typeof DashboardActions.loadDashboardFailure>).error)
        .toContain('boom');
      done();
    });

    actions$.next(DashboardActions.loadDashboard());
  });

  it('loadMovieById$ > emits loadMovieByIdSuccess on success', (done) => {
    const movie: TmdbMovie = {
      id: 7,
      title: 'Se7en',
      overview: 'Detectives and sins',
      // minimal shape — add fields your project’s TmdbMovie requires
    } as unknown as TmdbMovie;

    tmdb.getMovieById.and.returnValue(of(movie));

    effects.loadMovieById$.subscribe((action) => {
      expect(action).toEqual(
        DashboardActions.loadMovieByIdSuccess({ movie })
      );
      done();
    });

    actions$.next(DashboardActions.loadMovieById({ id: '7' }));
  });

  it('loadMovieById$ > emits loadMovieByIdFailure on error', (done) => {
    tmdb.getMovieById.and.returnValue(throwError(() => new Error('not found')));

    effects.loadMovieById$.subscribe((action) => {
      expect(action.type).toBe(DashboardActions.loadMovieByIdFailure.type);
      expect((action as ReturnType<typeof DashboardActions.loadMovieByIdFailure>).error)
        .toContain('not found');
      done();
    });

    actions$.next(DashboardActions.loadMovieById({ id: '999' }));
  });
});
