import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  userLoggedIn: boolean;
  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.userLoggedIn = false;

    this.afAuth.onAuthStateChanged((user) => {
      if (user) {
        this.userLoggedIn = true;
      } else {
        this.userLoggedIn = false;
      }
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
      })
      .catch((error) => {
        if (
          error.code == 'auth/wrong-password' ||
          error.code == 'auth/user-not-found' ||
          error.code == 'auth/user-disabled' ||
          error.code == 'auth/invalid-email'
        ) {
          alert('Invalid credentials. Please try again.');
        } else {
          alert('Login failed. Please try again.');
        }
      });
  }

  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        let emailLower = user.email.toLowerCase();
      })
      .catch((error) => {
        if (
          error.code == 'auth/account-exists-with-different-credential' ||
          error.code == 'auth/email-already-in-use'
        ) {
          alert('Email already used.');
        } else if (error.code == 'auth/invalid-email') {
          alert('Invalid email. Please try again.');
        } else {
          alert('Signup failed. Please try again.');
        }
      });
  }
}
