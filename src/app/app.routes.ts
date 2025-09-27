import { Routes } from '@angular/router';
import { authGuard } from './shared/guards/auth.guard';
import { MovieResolver } from '../store/movie/movie.resolver';
import { PreUserResolver } from './shared/resolvers/signinup.resolver';

export const routes: Routes = [
  {
    path: '',
    data: { title: 'home-page.title' },
    loadComponent: () =>
      import('./pages/home/home.page').then((m) => m.HomePage),
  },
  {
    path: 'signup',
    data: { title: 'signup.title' },
    loadComponent: () =>
      import('./pages/signup/signup.page').then((m) => m.SignupPage),
    resolve: { preUserData: PreUserResolver },
  },
  {
    path: 'signin',
    data: { title: 'sinin.title' },
    loadComponent: () =>
      import('./pages/signin/signin.page').then((m) => m.SigninPage),
    resolve: { preUserData: PreUserResolver },
  },
  {
    path: 'movie/:id',
    data: { title: 'movie-page.title' },
    loadComponent: () =>
      import('./pages/movie/movie.page').then((m) => m.MoviePage),
    resolve: {
      preload: MovieResolver,
    },
  },
  {
    path: 'person/:id',
    data: { title: 'person-page.title' },
    loadComponent: () =>
      import('./pages/person/person.page').then((m) => m.PersonPage),
  },
  {
    path: 'gallery',
    data: { title: 'gallery-page.title' },
    loadComponent: () =>
      import('./pages/gallery/gallery.page').then((m) => m.GalleryPage),
  },
  {
    path: 'watchlist',
    data: { title: 'watchlist.title' },
    loadComponent: () =>
      import('./pages/watchlist/watchlist.page').then((m) => m.WatchlistPage),
    canActivate: [authGuard],
  },
  {
    path: 'about',
    data: { title: 'about-page.title' },
    loadComponent: () =>
      import('./pages/about/about.page').then((m) => m.AboutPage),
  },
  {
    path: '**',
    data: { title: 'notfound-page' },
    loadComponent: () =>
      import('./pages/not-found/not-found.page').then((m) => m.NotFoundPage),
  },
];
