import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home.page';
import { SignupPage } from './pages/signup/signup.page';
import { SigninPage } from './pages/signin/signin.page';
import { authGuard } from './shared/guards/auth.guard';
import { NotFoundPage } from './pages/not-found.page/not-found.page';
import { MoviePage } from './pages/movie/movie.page';

export const routes: Routes = [
  { path: '', component: HomePage, canActivate: [authGuard] },
  { path: 'signup', component: SignupPage },
  { path: 'signin', component: SigninPage },
  { path: 'movie/:id', component: MoviePage },
  { path: '**', component: NotFoundPage },
];

