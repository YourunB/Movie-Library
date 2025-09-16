import { Component, inject } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../../services/dashboard/tmdb.service';
import { map, Observable } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';

interface UpcomingMovie {
  id: number;
  title: string;
  imgSrc: string | null;
  releaseDate: string | null;
}

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './upcoming-movies.html',
  styleUrls: ['./upcoming-movies.scss']
})
export class UpcomingMovies {
  private tmdb = inject(TmdbService);

  movies$: Observable<UpcomingMovie[]> = this.tmdb.getUpcomingMovies().pipe(
    map((res: TmdbPage<TmdbMovie>) =>
      res.results.slice(0, 10).map((m: TmdbMovie) => ({
        id: m.id,
        title: m.title,
        imgSrc: this.tmdb.img(m.poster_path, 'w342') ?? 'assets/placeholder.jpg',
        releaseDate: m.release_date ?? null
      }))
    )
  );
}
