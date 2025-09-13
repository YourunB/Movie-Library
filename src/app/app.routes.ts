import { Routes } from '@angular/router';
import { HomePage } from './pages/home/home/home.page';
import { SignupPage } from './pages/signup/signup.page';
import { SigninPage } from './pages/signin/signin.page';

export const routes: Routes = [
  { path: '', component: HomePage },
  { path: 'signup', component: SignupPage },
  { path: 'signin', component: SigninPage },
];
