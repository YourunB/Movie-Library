import { Injectable } from '@angular/core';
import { auth } from '../api/farebase';
import { signInWithEmailAndPassword, UserCredential } from 'firebase/auth';

@Injectable({
  providedIn: 'root',
})
export class SigninService {
  private auth = auth;

  signin(email: string, password: string): Promise<UserCredential> {
    return signInWithEmailAndPassword(this.auth, email, password);
  }
}
