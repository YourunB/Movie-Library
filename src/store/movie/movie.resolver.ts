import { Injectable, inject } from '@angular/core';
import { Resolve, ActivatedRouteSnapshot } from '@angular/router';
import { Store } from '@ngrx/store';
import { loadMovieById } from '../dashboard/dashboard.actions';
import { Observable, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class MovieResolver implements Resolve<true> {
  private store = inject(Store);

  resolve(route: ActivatedRouteSnapshot): Observable<true> {
    const id = route.paramMap.get('id');
    if (id) {
      this.store.dispatch(loadMovieById({ id }));
    }
    return of(true);
  }
}
