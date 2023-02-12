import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import {
  ActivatedRouteSnapshot,
  CanActivate,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';

/**
 * This is a guard for controlling access to certain 
 * pages in the application based on the user's authentication 
 * status. The guard implements the 'CanActivate' interface 
 * which allows it to be used as a guard for routes in the application.
 */

@Injectable({
  providedIn: 'root',
})
export class AuthGuard implements CanActivate {
  // Injecting the Router and AngularFireAuth dependencies
  constructor(private router: Router, private afAuth: AngularFireAuth) {}

  // Implementation of the CanActivate interface method
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    // Return a Promise that resolves to a boolean or UrlTree
    return new Promise((resolve, reject) => {
      this.afAuth.onAuthStateChanged((user) => {
        if (user) {
          // If a user is authenticated, resolve the Promise with 'true'
          resolve(true);
        } else {
          // If no user is authenticated, navigate to the login page
          // and resolve the Promise with 'false'
          this.router.navigate(['../login']);
          resolve(false);
        }
      });
    });
  }
}
