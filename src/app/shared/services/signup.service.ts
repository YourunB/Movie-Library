import { Injectable } from '@angular/core';
import { createUserWithEmailAndPassword, UserCredential } from 'firebase/auth';
import { auth } from '../api/farebase';

@Injectable({
  providedIn: 'root',
})
export class SignupService {
  private auth = auth;

  createNewUser(email: string, password: string): Promise<UserCredential> {
    return createUserWithEmailAndPassword(this.auth, email, password);
  }
}
