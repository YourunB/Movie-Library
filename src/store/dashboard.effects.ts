import { inject, Injectable } from '@angular/core';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import * as DashboardActions from './dashboard.actions';
import { map, catchError, of, switchMap } from 'rxjs';
import { forkJoin } from 'rxjs';
import { TmdbService } from '../services//dashboard/tmdb.service';
import { TmdbMovie } from '../models/dashboard';

@Injectable()
export class DashboardEffects {
  private readonly actions$ = inject(Actions);
  private readonly tmbdService = inject(TmdbService);

  load$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadDashboard),
      switchMap(() =>
        forkJoin({
          trendingPage: this.tmbdService.getTrendingMovies(),
          topRatedPage: this.tmbdService.getTopRatedMovies(),
          peoplePage: this.tmbdService.getPopularPeople(),
        }).pipe(
          switchMap(({ trendingPage, topRatedPage, peoplePage }) => {
            const trending = trendingPage.results ?? [];
            const topRated = topRatedPage.results ?? [];
            const popularPeople = peoplePage.results ?? [];

            return of(
              DashboardActions.loadDashboardSuccess({
                trending,
                topRated,
                popularPeople,
                reviews: [],
              })
            );
            // return this.tmbdService.getMovieReviews(firstTrending.id).pipe(
            //   map((reviewsPage) =>
            //     DashboardActions.loadDashboardSuccess({
            //       trending,
            //       topRated,
            //       popularPeople,
            //       reviews: reviewsPage.results ?? [],
            //     })
            //   )
            // );
          }),
          catchError((err: unknown) =>
            of(DashboardActions.loadDashboardFailure({ error: String(err) }))
          )
        )
      )
    )
  );

  loadMovieById$ = createEffect(() =>
    this.actions$.pipe(
      ofType(DashboardActions.loadMovieById),
      switchMap(({ id }) =>
        this.tmbdService.getMovieById(Number(id)).pipe(
          map((movie: TmdbMovie) =>
            DashboardActions.loadMovieByIdSuccess({ movie })
          ),
          catchError(err =>
            of(DashboardActions.loadMovieByIdFailure({ error: String(err) }))
          )
        )
      )
    )
  );
  
}
