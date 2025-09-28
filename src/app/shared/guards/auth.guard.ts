import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = new Router();
  const wasUser = localStorage.getItem('userUID');
  if (authService.isAuthenticated() || wasUser) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
