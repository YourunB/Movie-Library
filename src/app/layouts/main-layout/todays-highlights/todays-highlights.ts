import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { forkJoin, map, Observable, switchMap } from 'rxjs';

interface HighlightText {
  id: number;
  title: string;
  overview: string;
  trailerUrl: string | null;
}

@Component({
  selector: 'app-todays-highlights',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule],
  templateUrl: './todays-highlights.html',
  styleUrls: ['./todays-highlights.scss']
})
export class TodaysHighlights {
  private tmdb = inject(TmdbService);

  highlights$: Observable<HighlightText[]> = this.tmdb.getNowPlayingMovies().pipe(
  switchMap((res: TmdbPage<TmdbMovie>) => {
    const movies = res.results.slice(0, 4);
    return forkJoin(
      movies.map(m =>
        this.tmdb.getMovieVideos(m.id).pipe(
          map(videos => {
            const trailer = videos.results.find(v => v.type === 'Trailer' && v.site === 'YouTube');
            return {
              id: m.id,
              title: m.title,
              overview: m.overview,
              trailerUrl: trailer ? `https://www.youtube.com/watch?v=${trailer.key}` : null
            };
          })
        )
      )
    );
  })
);
}
