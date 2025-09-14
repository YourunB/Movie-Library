import { HttpInterceptorFn } from '@angular/common/http';
import { catchError, throwError } from 'rxjs';

export const themoviedbInterceptor: HttpInterceptorFn = (req, next) => {
  const clonedRequest = req.clone({ url: `https://api.themoviedb.org/3${req.url}` });
  return next(clonedRequest).pipe(
    catchError((error) => {
      return throwError(() => error);
    })
  );
};
