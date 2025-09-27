import { Component, inject, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { TmdbMovie, TmdbPage } from '../../../models/dashboard';
import { Observable, switchMap } from 'rxjs';
import { map, take } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import {
  MovieCardComponent,
  MovieCardModel,
} from '../../shared/components/movie-card/movie-card';
import { PosterUrlPipe } from '../../shared/pipes/poster-url.pipe';
import { AuthService } from '../../shared/services/auth.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { TranslatePipe } from '@ngx-translate/core';
import { toObservable, toSignal } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatCardModule,
    MovieCardComponent,
    PosterUrlPipe,
    TranslatePipe,
  ],
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
  @Input() title!: string;
  public route = inject(ActivatedRoute);
  public tmdb = inject(TmdbService);
  watchListService = inject(WatchlistService);
  authService = inject(AuthService);
  isAuth$: Observable<boolean>;
  skeletons = Array(6);

  constructor() {
    this.isAuth$ = this.authService.authenticatedSubject;
  }

  movies = toSignal(
    this.route.queryParamMap.pipe(
      map((params) => params.get('q') ?? ''),
      switchMap((query) =>
        toObservable(this.tmdb.langRequests).pipe(
          switchMap(() => this.tmdb.searchMovies(query))
        )
      ),
      map((res: TmdbPage<TmdbMovie>) => res.results ?? [])
    ),
    { initialValue: [] as TmdbMovie[] }
  );

  toggleFavorite(movie: MovieCardModel): void {
    this.watchListService
      .isMovieInWatchlist(movie.id)
      .pipe(take(1))
      .subscribe((isInWatchlist) => {
        if (isInWatchlist) {
          this.watchListService.removeMovie(movie.id);
        } else {
          const normalized = {
            ...movie,
            poster_path: movie.poster_path ?? null,
            release_date: movie.release_date ?? null,
          } as unknown as TmdbMovie;

          this.watchListService.addMovie(normalized);
        }
      });
  }
}
