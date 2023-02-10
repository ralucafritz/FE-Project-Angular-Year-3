import { Component, Input, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable, of, timeInterval, timeout } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public userLoggedIn: boolean;
  public userName: string | null;
  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {
    this.userLoggedIn = false;
    this.userName = '';
  }

  ngOnInit(): void {
    this.getStarted();
    this.authService.loggedInObservable.subscribe((subscriber) => {
      this.changeStatus(subscriber); 
      console.log('subscriberNavBar called + ' + subscriber);
    });
    this.authService.checkStatusLogin();
  }

  changeStatus(status: boolean) {
    this.userLoggedIn = status;
    if (status) {
      this.userName = localStorage.getItem('user');
      if (this.userName !== null && this.userName.length >= 4) {
        this.userName = this.userName.slice(0, 4).toUpperCase();
      }
    } else {
      this.userName = '';
    }
    console.log('changeStatus called + ' + this.userLoggedIn);
  }

  async getStarted() {
    var details: string[];
    details = [];
    await this.getDetails().then((value) => {
      details = value as string[];
    });
  }

  getDetails() {
    return new Promise((resolve, reject) => {
      this.db
        .list('users/' + localStorage.getItem('user') + '/info')
        .valueChanges()
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  logout(): void {
    console.log('LoggedOut');
    this.authService.logoutUser();
  }

  login(): void {
    this.router.navigate(['./login']);
  }

  goToDashboard() {
    this.router.navigate(['./dashboard']);
  }

  goToContact() {
    this.router.navigate(['./contact']);
  }

  goToHome() {
    this.router.navigate(['./home']);
  }

}
