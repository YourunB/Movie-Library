import {
  Component,
  inject,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../../../store/dashboard/dashboard.actions';
import {
  selectLoadingMovie,
  selectSelectedMovie,
} from '../../../store/dashboard/dashboard.selectors';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';
import { WatchlistService } from '../../shared/services/watchlist.service';
import { TmdbMovie } from '../../../models/dashboard';
import { combineLatest, Observable, of, take } from 'rxjs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { map, switchMap } from 'rxjs/operators';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { TranslatePipe } from '@ngx-translate/core';
import { toObservable } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatIcon, ScrollingModule, TranslatePipe, RouterLink],
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit, OnChanges {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  authService = inject(AuthService);
  private tmdb = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);
  watchListService = inject(WatchlistService);

  movie$ = combineLatest([
    this.store.select(selectSelectedMovie),
    toObservable(this.tmdb.langRequests),
  ]).pipe(
    switchMap(([movie]) => {
      if (!movie) {
        return of(null);
      }
      return this.tmdb.getMovieById(movie.id).pipe(
        map((res) => ({
          ...res,
          poster_path:
            this.tmdb.img(res.poster_path, 'w342') ?? 'assets/placeholder.jpg',
        }))
      );
    })
  );
  loading$ = this.store.select(selectLoadingMovie);
  isAuth$: Observable<boolean>;

  constructor() {
    this.isAuth$ = this.authService.authenticatedSubject;
  }

  ngOnChanges(changes: SimpleChanges) {
    for (const inputName in changes) {
      const inputValues = changes[inputName];
      console.log(`Previous ${inputName} == ${inputValues.previousValue}`);
      console.log(`Current ${inputName} == ${inputValues.currentValue}`);
      console.log(`Is first ${inputName} change == ${inputValues.firstChange}`);
    }
  }

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadMovieById({ id }));
      }
    });
  }

  trailerUrl$: Observable<SafeResourceUrl | null> = combineLatest([
    this.route.paramMap,
    toObservable(this.tmdb.langRequests),
  ]).pipe(
    switchMap(([params]) => {
      const id = params.get('id');
      if (!id) return of(null);

      return this.tmdb.getMovieVideos(Number(id)).pipe(
        map((resp) => {
          const yt = resp.results.find(
            (v) =>
              v.site === 'YouTube' &&
              (v.type === 'Trailer' || v.type === 'Teaser')
          );
          if (!yt) return null;

          return this.sanitizer.bypassSecurityTrustResourceUrl(
            `https://www.youtube.com/embed/${yt.key}`
          );
        })
      );
    })
  );

  cast$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id');
      if (!id) return of([]);
      return this.tmdb.getMovieCredits(Number(id)).pipe(map((r) => r.cast));
    })
  );

  toggleFavorite(event: Event, movie: TmdbMovie): void {
    event.stopPropagation();
    event.preventDefault();
    this.watchListService
      .isMovieInWatchlist(movie.id)
      .pipe(take(1))
      .subscribe((isInWatchlist) => {
        if (isInWatchlist) {
          this.watchListService.removeMovie(movie.id);
        } else {
          this.watchListService.addMovie(movie);
        }
      });
  }
}
