import { inject, Injectable } from '@angular/core';
import { Resolve } from '@angular/router';
import { Observable, of } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { SignInUpFormData } from '../../../models/dashboard';

@Injectable({ providedIn: 'root' })
export class PreUserResolver implements Resolve<SignInUpFormData> {
  private authService = inject(AuthService);

  resolve(): Observable<SignInUpFormData> {
    const data = this.authService.getPreuser();
    return of(data);
  }
}
