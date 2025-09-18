import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../../../store/dashboard.actions';
import { selectLoadingMovie, selectSelectedMovie } from '../../../store/dashboard.selectors';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss']
})
export class MoviePage {
  private route = inject(ActivatedRoute);
  private store = inject(Store);

  movie$ = this.store.select(selectSelectedMovie);
  loading$ = this.store.select(selectLoadingMovie);

  ngOnInit() {
    this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadMovieById({ id: id }));
      }
    });
  }
}
