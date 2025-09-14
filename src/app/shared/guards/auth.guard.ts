import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = new Router();

  if (authService.isAuthenticated()) {
    return true;
  } else {
    router.navigate(['/signin']);
    return false;
  }
};
