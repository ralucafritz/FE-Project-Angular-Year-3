import { Component, Input, OnInit, SimpleChanges, Output, EventEmitter } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { Observable, of, timeInterval, timeout } from 'rxjs';
import { StorageWrapper } from 'src/app/StorageWrapper';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public userLoggedIn: boolean = false;
  @Output() isLoggedInEvent = new EventEmitter<boolean>();
  public userName: string | null = '';
  numberStreams = 0;
  numberStreamsStorage = 0;
  storageWrapper: StorageWrapper = StorageWrapper.getInstance('numberStreams');

  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.getStarted();
    this.authService.loggedInObservable.subscribe((subscriber) => {
      this.changeStatus(subscriber);
      console.log('subscriberNavBar called + ' + subscriber);
    });
    this.authService.checkStatusLogin();
    this.storageListener();
    this.storageWrapper.addEventListener(this.storageListener.bind(this));
  }

  storageListener() {
    console.log('storagelistener');
    const storedData = this.storageWrapper.getItem();
    if (storedData === null) {
      return;
    }
    this.numberStreamsStorage = JSON.parse(storedData);
    if (this.numberStreamsStorage !== this.numberStreams) {
      this.numberStreams = this.numberStreamsStorage;
    }
  }

  changeStatus(status: boolean) {
    this.userLoggedIn = status;
    this.checkLoggedInEvent(status);
    if (status) {
      this.userName = localStorage.getItem('user');
      if (this.userName !== null && this.userName.length >= 4) {
        this.userName = this.userName.slice(0, 4).toUpperCase();
      }
    } else {
      this.userName = '';
    }
    console.log('changeStatus navbar called + ' + this.userLoggedIn);
  }

  async getStarted() {
    let details: Array<string>;
    details = [];
    await this.getDetails().then((value) => {
      details = value as Array<string>;
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

  checkLoggedInEvent(status: boolean){
    this.isLoggedInEvent.emit(status);
    console.log(`checkLoggedInEvent - ${status}`);
    
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
