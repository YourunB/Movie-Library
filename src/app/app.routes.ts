import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { MovieResolver } from '../store/movie/movie.resolver';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'signup',
    loadComponent: () =>
      import('./pages/signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: 'signin',
    loadComponent: () =>
      import('./pages/signin/signin.page').then((m) => m.SigninPage),
  },
  {
    path: 'movie/:id',
    loadComponent: () =>
      import('./pages/movie/movie.page').then((m) => m.MoviePage),
    resolve: {
      preload: MovieResolver,
    },
  },
  {
    path: 'person/:id',
    loadComponent: () =>
      import('./pages/person/person.page').then((m) => m.PersonPage),
  },
  {
    path: 'gallery',
    loadComponent: () =>
      import('./pages/gallery/gallery.page').then((m) => m.GalleryPage),
  },
  {
    path: 'watchlist',
    loadComponent: () =>
      import('./pages/watchlist/watchlist.page').then((m) => m.WatchlistPage),
    canActivate: [authGuard],
  },
  {
    path: 'about',
    loadComponent: () =>
      import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: '**',
    loadComponent: () =>
      import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
