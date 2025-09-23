import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then(m => m.HomePage),
      canActivate: [authGuard],
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then(m => m.SignupPage),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin/signin.page').then(m => m.SigninPage),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie/movie.page').then(m => m.MoviePage),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.page').then(m => m.GalleryPage),
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.page').then(m => m.AboutPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found.page/not-found.page').then(m => m.NotFoundPage),
  },
];