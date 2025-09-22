import {
  Component,
  ElementRef,
  inject,
  OnInit,
  ViewChild,
} from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { TmdbService } from '../../../shared/services/dashboard/tmdb.service';
import { map, Observable, startWith } from 'rxjs';
import { TmdbMovie, TmdbPage } from '../../../../models/dashboard';
import { BreakpointObserver } from '@angular/cdk/layout';
import { RouterModule } from '@angular/router';
import { AuthService } from '../../../shared/services/auth.service';

interface UpcomingMovie {
  id: number;
  title: string;
  imgSrc: string | null;
  releaseDate: string | null;
}

@Component({
  selector: 'app-upcoming-movies',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    DatePipe,
    RouterModule,
  ],
  templateUrl: './upcoming-movies.html',
  styleUrls: ['./upcoming-movies.scss'],
})
export class UpcomingMovies implements OnInit {
  private tmdb = inject(TmdbService);
  private breakpoint = inject(BreakpointObserver);
  authService = inject(AuthService);
  movies$!: Observable<UpcomingMovie[]>;
  

  @ViewChild('slider', { static: false })
  sliderRef!: ElementRef<HTMLDivElement>;

  ngOnInit(): void {
    this.movies$ = this.tmdb.getUpcomingMovies().pipe(
      map((res: TmdbPage<TmdbMovie>) =>
        res.results.slice(0, 10).map((m: TmdbMovie) => ({
          id: m.id,
          title: m.title,
          imgSrc:
            this.tmdb.img(m.poster_path, 'w342') ?? 'assets/placeholder.jpg',
          releaseDate: m.release_date ?? null,
        }))
      )
    );
  }

  cardWidth$: Observable<number> = this.breakpoint
    .observe([
      '(max-width: 400px)',
      '(max-width: 576px)',
      '(max-width: 768px)',
      '(max-width: 992px)',
      '(max-width: 1200px)',
    ])
    .pipe(
      map((result) => {
        if (result.breakpoints['(max-width: 400px)']) return 140;
        if (result.breakpoints['(max-width: 576px)']) return 160;
        if (result.breakpoints['(max-width: 768px)']) return 180;
        if (result.breakpoints['(max-width: 992px)']) return 200;
        if (result.breakpoints['(max-width: 1200px)']) return 220;
        return 240;
      }),
      startWith(200) // default
    );

  scroll(direction: 'prev' | 'next', cardWidth: number): void {
    if (!this.sliderRef) return;
    const slider = this.sliderRef.nativeElement;
    slider.scrollBy({
      left: direction === 'next' ? cardWidth * 3 : -cardWidth * 3,
      behavior: 'smooth',
    });
  }
}
