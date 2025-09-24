import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../../../store/dashboard.actions';
import { selectLoadingMovie, selectSelectedMovie } from '../../../store/dashboard.selectors';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { map, switchMap } from 'rxjs/operators';
import { Observable, of } from 'rxjs';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss']
})
export class MoviePage implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  private tmdb = inject(TmdbService);
  private sanitizer = inject(DomSanitizer);

  movie$ = this.store.select(selectSelectedMovie);
  loading$ = this.store.select(selectLoadingMovie);

  trailerUrl$: Observable<SafeResourceUrl | null> = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (!id) return of(null);
      return this.tmdb.getMovieVideos(Number(id)).pipe(
        map(resp => {
          const yt = resp.results.find(v => v.site === 'YouTube' && (v.type === 'Trailer' || v.type === 'Teaser'));
          if (!yt) return null;
          return this.sanitizer.bypassSecurityTrustResourceUrl(`https://www.youtube.com/embed/${yt.key}`);
        })
      );
    })
  );

  cast$ = this.route.paramMap.pipe(
    switchMap(params => {
      const id = params.get('id');
      if (!id) return of([]);
      return this.tmdb.getMovieCredits(Number(id)).pipe(map(r => r.cast.slice(0, 12)));
    })
  );

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadMovieById({ id: id }));
      }
    });
  }
}
