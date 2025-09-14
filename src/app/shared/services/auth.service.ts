import { Injectable } from '@angular/core';
import { User } from 'firebase/auth';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private userSubject: BehaviorSubject<User | null> =
    new BehaviorSubject<User | null>(null);
  private authenticatedSubject: BehaviorSubject<boolean> =
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
  }
}
