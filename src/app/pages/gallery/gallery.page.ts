import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TmdbService } from '../../shared/services/dashboard/tmdb.service';
import { TmdbMovie, TmdbPage } from '../../../models/dashboard';
import { Observable, switchMap } from 'rxjs';
import { map } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-gallery',
  standalone: true,
  imports: [CommonModule, RouterModule, MatCardModule],
  templateUrl: './gallery.page.html',
  styleUrls: ['./gallery.page.scss'],
})
export class GalleryPage {
  public route = inject(ActivatedRoute);
  public tmdb = inject(TmdbService);

  movies$: Observable<TmdbMovie[]> = this.route.queryParamMap.pipe(
    map(params => params.get('q') ?? ''),
    switchMap(query => this.tmdb.searchMovies(query)),
    map((res: TmdbPage<TmdbMovie>) => res.results ?? [])
  );
}
