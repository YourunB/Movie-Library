import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../../../store/dashboard/dashboard.actions';
import {
  selectLoadingMovie,
  selectSelectedMovie,
} from '../../../store/dashboard/dashboard.selectors';
import { MatIcon } from '@angular/material/icon';
import { AuthService } from '../../shared/services/auth.service';

@Component({
  selector: 'app-movie',
  standalone: true,
  imports: [CommonModule, MatIcon],
  templateUrl: './movie.page.html',
  styleUrls: ['./movie.page.scss'],
})
export class MoviePage implements OnInit {
  private route = inject(ActivatedRoute);
  private store = inject(Store);
  authService = inject(AuthService);

  movie$ = this.store.select(selectSelectedMovie);
  loading$ = this.store.select(selectLoadingMovie);

  ngOnInit() {
    this.route.paramMap.subscribe((params) => {
      const id = params.get('id');
      if (id) {
        this.store.dispatch(loadMovieById({ id: id }));
      }
    });
  }
}
