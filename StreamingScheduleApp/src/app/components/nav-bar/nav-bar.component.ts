import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';
import { StorageWrapper } from 'src/app/StorageWrapper';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This componentis responsible for handling the navigation bar 
 * at the top of the application. It displays the navigation 
 * links and allows the user to log in and out.
 * 
 * he component has several properties, including 'userLoggedIn' 
 * which is a flag to determine if the user is logged in or not,
 * 'userName' which is the user's name to display in the greeting 
 * message, and 'numberStreams' which is the number of streams.
 * It also has an 'Output' property 'isLoggedInEvent' which emits 
 * an event to notify the parent component about the user's login status.
 * 
 * The 'ngOnInit' method subscribes to the 'loggedIn$' observable 
 * in the authentication service to get notified of 
 * changes in the user's login status.
 * It also calls the 'checkStatusLogin' method in the authentication 
 * service to get the current login status and the 'storageListener' 
 * method to get the number of streams from storage.
 * 
 * The 'changeStatus' method is called whenever the login status changes 
 * and updates the 'userLoggedIn' flag, 'userName' property, and 
 * emits an event through 'isLoggedInEvent'. 
 * 
 * The 'checkLoggedInEvent' method emits the event about the 
 * user's login status.
 * 
 * The 'logout' method calls the 'logoutUser' method in 
 * the authentication service to log out the user.
 * 
 * The 'login','goToDashboard', 'goToContact', and 'goToHome' methods 
 * navigate the user to the login, dashboard, contact, and home pages respectively.
 */

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  // Flag to check if user is logged in or not
  public userLoggedIn: boolean = false;
  // 'EventEmitter' to notify parent component about the user login status
  @Output() isLoggedInEvent = new EventEmitter<boolean>();
  // Store the user name for the 'Greeting message'
  public userName: string | null = '';
  // Store the number of streams
  numberStreams = 0;
  // Instance of storage wrapper
  storageWrapper: StorageWrapper = StorageWrapper.getInstance('numberStreams');

  // Injecting the AuthService, Router and AngularFireDatabase dependencies
  constructor(
    private router: Router,
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Subscribe to the login status changes
    this.authService.loggedIn$.subscribe((subscriber) => {
      this.changeStatus(subscriber);
    });
    // Check the login status
    this.authService.checkStatusLogin();
    // update the number of streams
    this.storageListener();
    // Add the storage listener to listen to the 'storageWrapper'
    this.storageWrapper.addEventListener(this.storageListener.bind(this));
  }

  // Method to handle changes in storage
  storageListener() {
    const storedData = this.storageWrapper.getItem();
    if (storedData === null) {
      return;
    }
    this.numberStreams = JSON.parse(storedData);
  }

  // Method to handle changes in login status
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
  }

  // Method to emit the event about the user login status
  checkLoggedInEvent(status: boolean) {
    this.isLoggedInEvent.emit(status);
  }

  // Method to logout the user
  logout(): void {
    this.authService.logoutUser();
  }

  // Method to navigate to login page
  login(): void {
    this.router.navigate(['./login']);
  }
  // Method to navigate to dashboard page
  goToDashboard() {
    this.router.navigate(['./dashboard']);
  }
  // Method to navigate to contact page
  goToContact() {
    this.router.navigate(['./contact']);
  }
  // Method to navigate to home page
  goToHome() {
    this.router.navigate(['./home']);
  }
}
