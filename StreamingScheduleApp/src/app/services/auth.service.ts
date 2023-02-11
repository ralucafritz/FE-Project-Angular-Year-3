import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInObservable: Subject<boolean>;
  private errorMessageSubject = new Subject<string>();
  errorMessage$ = this.errorMessageSubject.asObservable();

  constructor(private router: Router, private afAuth: AngularFireAuth) {
    this.loggedInObservable = new Subject();
  }

  checkStatusLogin() {
    const currentUser = this.afAuth.user;
    currentUser.subscribe((value) => {
      this.loggedInObservable.next(
        value?.email !== null && value?.email !== undefined
      );
      console.log(value + 'checkStatusLogin');
    });
  }

  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        console.log('Auth Service: loginUser: success');
        this.loggedInObservable.next(true);
        this.router.navigate(['./home']);
      })
      .catch((error) => {
        if (
          error.code == 'auth/wrong-password' ||
          error.code == 'auth/user-not-found' ||
          error.code == 'auth/user-disabled' ||
          error.code == 'auth/invalid-email'
        ) {
          this.errorMessageSubject.next('Invalid credentials. Please try again.');
          console.error(error.code);
        } else {
          this.errorMessageSubject.next('Login failed. Please try again.');
          console.error(error.code);
        }
        return { isValid: false };
      });
  }

  logoutUser() {
    this.afAuth.signOut().then((value) => {
      console.log(value + 'logoutValue');
      this.router.navigate(['./login']);
    });
    localStorage.removeItem('user');
    this.loggedInObservable.next(false);
  }

  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        console.log('Auth Service: signUpUser: success');
        this.loggedInObservable.next(true);
        let emailLower = user.email.toLowerCase();
        localStorage.setItem('user', emailLower.slice(0, 4));
        this.router.navigate(['./home']);
      })
      .catch((error) => {
        if (
          error.code == 'auth/account-exists-with-different-credential' ||
          error.code == 'auth/email-already-in-use'
        ) {
          this.errorMessageSubject.next('Email already used.');
          console.error(error.code);
        } else if (error.code == 'auth/invalid-email') {
          this.errorMessageSubject.next('Invalid email. Please try again.');
          console.error(error.code);
        } else {
          this.errorMessageSubject.next('Signup failed. Please try again.');
          console.error(error.code);
        }
        this.loggedInObservable.next(false);
        return { isValid: false };
      });
  }
}
