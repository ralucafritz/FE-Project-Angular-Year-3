import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { Router } from '@angular/router';
import { BehaviorSubject, Subject} from 'rxjs';

/**
 * This is a service that provides authentication functionality for 
 * a user which  includes methods for creating a new user account, 
 * logging in, logging out, and checking the user's current login 
 * status. It also has properties for emitting booleans indicating 
 * whether the user s logged in or not and emitting error messages 
 * if necessary.
 * 
 * The 'signupUser' method takes in a user object and returns 
 * a promise that resolves to the result of creating a new user 
 * account with the given email and password.
 * 
 * The 'loginUser' method takes in an email and password and returns 
 * a promise that resolves to the result of logging in with the 
 * given credentials.
 * 
 * The 'logoutUser' method signs out the current user and updates 
 * the 'loggedIn$' subject.
 * 
 * The 'checkStatusLogin' method subscribes to the user property 
 * of 'AngularFireAuth' and updates the 'loggedIn$' subject to indicate 
 * whether the user is currently logged in.
 */

@Injectable({
  providedIn: 'root',
})

export class AuthService {
  // Emits a boolean indicating whether the user is logged in or not
  loggedIn$ = new BehaviorSubject<boolean>(false);
  // Emits a string indicating an error message
  errorMessage$ = new Subject<string>();

  // Injecting the AuthService and AngularFireAuth dependencies
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

   // Method takes in a user object and returns a promise that 
   // resolves to the result of calling 
   // 'createUserWithEmailAndPassword' on 'AngularFireAuth'
  signupUser(user: any): Promise<any> {
    return this.afAuth
      .createUserWithEmailAndPassword(user.email, user.password)
      .then((result) => {
        // If the sign up is successful, update the loggedIn$ subject 
        // by calling the 'next' method and passing 'true' as an argument
        this.loggedIn$.next(true);
        // Convert the user's email to lowercase and 
        // store the first 4 characters of in 'localStorage'
        // in order to be used for the 'Greeting message'
        let emailLower = user.email.toLowerCase();
        localStorage.setItem('user', emailLower.slice(0, 4));
        // Navigate the user to the './home' route
        this.router.navigate(['./home']);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/account-exists-with-different-credential':
          case 'auth/email-already-in-use':
            this.errorMessage$.next('Email already used.');
            break;
          case 'auth/invalid-email':
            this.errorMessage$.next('Invalid email. Please try again.');
            break;
          default:
            this.errorMessage$.next('Signup failed. Please try again.');
        }
        this.loggedIn$.next(false);
      });
  }

  // Method takes in an email and password, and returns a 
  // promise that resolves to the result of calling 
  // 'signInWithEmailAndPassword' on 'AngularFireAuth'
  loginUser(email: string, password: string): Promise<any> {
    return this.afAuth
      .signInWithEmailAndPassword(email, password)
      .then(() => {
        // If the sign in is successful, update the loggedIn$ subject and navigate to the home route
        this.loggedIn$ .next(true);
        // Navigate the user to the './home' route
        this.router.navigate(['./home']);
      })
      .catch((error) => {
        switch (error.code) {
          case 'auth/wrong-password':
          case 'auth/user-not-found':
          case 'auth/user-disabled':
          case 'auth/invalid-email':
            this.errorMessage$.next('Invalid credentials. Please try again.');
            break;
          default:
            this.errorMessage$.next('Login failed. Please try again.');
        }
      });
  }
  // Method calls 'signOut' on 'AngularFireAuth' and 
  // updates the 'loggedIn$' subject
  logoutUser() {
    this.afAuth.signOut().then(() => {
      this.router.navigate(['./login']);
    });
    localStorage.removeItem('user');
    this.loggedIn$.next(false);
  }


  // Method subscribes to the user property of 'AngularFireAuth'
  // The method sets the value of the 'loggedIn$' subject 
  // to 'true' if the user's email is not 'null' or 'undefined',
  // otherwise, it sets the value to 'false'
  checkStatusLogin() {
    this.afAuth.user.subscribe((user) => {
      this.loggedIn$.next(user?.email !== null && user?.email !== undefined);
    });
  }

}
