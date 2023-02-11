import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { Subject, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  loggedInObservable: Subject<boolean>;

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
      })
      .catch((error) => {
        if (
          error.code == 'auth/wrong-password' ||
          error.code == 'auth/user-not-found' ||
          error.code == 'auth/user-disabled' ||
          error.code == 'auth/invalid-email'
        ) {
          alert('Invalid credentials. Please try again.');
          console.error(error.code);
        } else {
          alert('Login failed. Please try again.');
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
        let emailLower = user.email.toLowerCase();
        localStorage.setItem("user", emailLower.slice(0,4));
        this.loggedInObservable.next(true);
        console.log("account created");
      })
      .catch((error) => {
        if (
          error.code == 'auth/account-exists-with-different-credential' ||
          error.code == 'auth/email-already-in-use'
        ) {
          alert('Email already used.');
          console.error(error.code);
        } else if (error.code == 'auth/invalid-email') {
          alert('Invalid email. Please try again.');
          console.error(error.code);
        } else {
          alert('Signup failed. Please try again.');

          console.error(error.code);
        }
        this.loggedInObservable.next(false);
        return { isValid: false };
      });
  }
}
