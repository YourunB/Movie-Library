import { PreloadingStrategy, Route } from '@angular/router';
import { Observable, of } from 'rxjs';

export class MoviePreloadStrategy implements PreloadingStrategy {
  preload(route: Route, load: () => Observable<unknown>): Observable<unknown> {
    if (route.path?.startsWith('movie')) {
      return load();
    }
    return of(null);
  }
}
