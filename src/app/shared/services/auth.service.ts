import { inject, Injectable } from '@angular/core';
import { onAuthStateChanged, User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';
import { auth } from '../api/farebase';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private auth = auth;
  private router = inject(Router);
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  authenticatedSubject: BehaviorSubject<boolean> =
    new BehaviorSubject<boolean>(false);

  setUser(user: User) {
    this.userSubject.next(user);
    this.authenticatedSubject.next(true);
  }

  getUserObservable() {
    return this.userSubject.asObservable();
  }

  getAuthenticatedObservable() {
    return this.authenticatedSubject.asObservable();
  }

  isAuthenticated(): boolean {
    return this.authenticatedSubject.value;
  }

  resetUser() {
    this.userSubject.next(null);
    this.authenticatedSubject.next(false);
    localStorage.removeItem('userUID');
  }

  getCurrentAuthUser() {
    onAuthStateChanged(auth, (user) => {
      if (user?.uid) {
        this.authenticatedSubject.next(true);
        this.userSubject.next(user);
        // this.router.navigate(['/']);
      } else {
        console.log('No user is signed in.');
      }
    });
  }
}
