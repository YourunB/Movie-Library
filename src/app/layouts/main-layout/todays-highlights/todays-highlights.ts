import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { forkJoin, map, Observable, switchMap } from 'rxjs';
import { MatDialog } from '@angular/material/dialog';
import {
  TrailerModal,
  TrailerModalData,
} from '../../../shared/components/trailer-modal/trailer-modal';
import { Router } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';
import { toObservable } from '@angular/core/rxjs-interop';

interface HighlightText {
  id: number;
  title: string;
  overview?: string;
  trailerUrl: string | null;
}

@Component({
  selector: 'app-todays-highlights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, TranslatePipe],
  templateUrl: './todays-highlights.html',
  styleUrls: ['./todays-highlights.scss'],
})
export class TodaysHighlights {
  private tmdb = inject(TmdbService);
  private dialog = inject(MatDialog);
  private router = inject(Router);
  highlights$!: Observable<HighlightText[]>;
  constructor() {
    this.highlights$ = toObservable(this.tmdb.langRequests).pipe(
      switchMap(() =>
        this.tmdb.getNowPlayingMovies().pipe(
          switchMap((res: TmdbPage<TmdbMovie>) => {
            const movies = (res.results ?? []).slice(0, 4);

            return forkJoin(
              movies.map((m) =>
                this.tmdb.getMovieVideos(m.id).pipe(
                  map((videos) => {
                    const trailer = videos.results.find(
                      (v) => v.type === 'Trailer' && v.site === 'YouTube'
                    );
                    return {
                      id: m.id,
                      title: m.title,
                      overview: m.overview,
                      trailerUrl: trailer
                        ? `https://www.youtube.com/watch?v=${trailer.key}`
                        : null,
                    };
                  })
                )
              )
            );
          })
        )
      )
    );
  }
  openTrailerModal(h: HighlightText): void {
    const data: TrailerModalData = {
      movieTitle: h.title,
      movieId: h.id,
    };
    this.dialog.open(TrailerModal, {
      data,
      width: '90vw',
      maxWidth: '900px',
      maxHeight: '80vh',
      panelClass: 'trailer-modal-panel',
    });
  }

  openMovie(h: HighlightText): void {
    this.router.navigate(['/movie', h.id]);
  }
}
