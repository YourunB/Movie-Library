import { Component, inject, ViewChild, ElementRef } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../../services/dashboard/tmdb.service';
import { map, Observable } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';

interface NowPlayingMovie {
  id: number;
  title: string;
  imgSrc: string | null;
  releaseDate: string;
}

@Component({
  selector: 'app-now-playing-movies',
  standalone: true,
  imports: [CommonModule, MatCardModule, MatButtonModule, MatIconModule, DatePipe],
  templateUrl: './now-playing-movies.html',
  styleUrls: ['./now-playing-movies.scss']
})
export class NowPlayingMoviesComponent {
  private tmdb = inject(TmdbService);

  @ViewChild('slider', { static: false }) sliderRef!: ElementRef<HTMLDivElement>;

  movies$: Observable<NowPlayingMovie[]> = this.tmdb.getNowPlayingMovies().pipe(
    map((res: TmdbPage<TmdbMovie>) =>
      res.results.slice(0, 12).map((m: TmdbMovie) => ({
        id: m.id,
        title: m.title,
        imgSrc: this.tmdb.img(m.poster_path, 'w342') ?? 'assets/placeholder.jpg',
        releaseDate: m.release_date ?? ''
      }))
    )
  );

  scroll(direction: 'prev' | 'next'): void {
    if (!this.sliderRef) return;
    const slider = this.sliderRef.nativeElement;
    const cardWidth = 200;
    slider.scrollBy({
      left: direction === 'next' ? cardWidth * 3 : -cardWidth * 3,
      behavior: 'smooth'
    });
  }
}
