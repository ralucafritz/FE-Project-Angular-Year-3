import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This is a component for handling user signup functionality which includes 
 * capturing user input data and validating the input,
 * submitting the login form to the authentication service,
 * and handling the response from the authentication service.
 * The component has several properties and methods, including a
 * form group to capture the user's email and password, error
 * messages to display, a switchToLogin method to navigate the
 * user to the login page, and an onSubmit method to process
 * the user's input and authenticate the user.
 * 
 * The 'onSubmit' method is triggered when the user submits the form.
 * This method validates the form and, if it's valid, calls the 'signupUser' 
 * method of the authentication service with the entered email and password. 
 * If the signup is successful, the 'username' (which is derived from the 
 * email by removing special characters) is stored in the Firebase 
 * database under the 'users/{username}/info' node.
 * 
 * The 'checkAutoLogin' method is used to check for automatic login. 
 * This method retrieves the email of the currently active user from
 * the 'AngularFireAuth' service and if either the active user or the 
 * user stored in local storage exists, the user is redirected to the 
 * home page.
 * 
 * The 'switchToLogin' method navigates the user to the login page.
 */

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  // Form for signup
  signupForm!: FormGroup;
  // Flag to indicate whether to display the form validation error message or not
  public displayValidationMessage = false;
  // Holds the email address of the currently active user
  activeUser: string | null;
  // Message to be displayed in the error alert that gets sent directly from
  // 'AuthService' to the 'AuthErrorsHelper'
  errorMessage: string = '';

  constructor(
    // Injecting the AuthService, Router, AngularFireAuth and AngularFireDatabase dependencies
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    // Setting the initial value of the active user to null
    this.activeUser = null;
    // Attempting to check for automatic login
    this.checkAutoLogin();
  }

  ngOnInit() {
    // Initializing the signup form with the validated email and password inputs
    this.signupForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  // Method called when the signup form is submitted
  onSubmit() {
    // If the login form is invalid, set 'displayValidationMessage' to true and return
    if (this.signupForm.invalid) {
      this.displayValidationMessage = true;
      return;
    }

    // Reset the 'displayValidationMessage' flag
    this.displayValidationMessage = false;

    const signupFormData = {
      name: this.signupForm.value.email.slice(0, 4),
    };

    // Call the signupUser method of the 'AuthService' with the entered email and password
    this.authService.signupUser(this.signupForm.value).then(async (result) => {
      // If the result is not null the signup was successful

      if (result == null) {
        // Remove any special characters from the email address and store the username in DB
        let username = this.signupForm.value.email.replace(/[^a-z0-9]/gi, '');
        await this.db.object('users/' + username + '/info').set(signupFormData);
      } else if (result.isValid == false) {
        // Displays errors automatically from 'AuthService'
      }
    });
  }

  // Method to check for automatic login
  async checkAutoLogin() {
    // Attempting to retrieve the email of the currently active user from AngularFireAuth
    try {
      this.activeUser = (await this.afAuth.currentUser)?.email ?? null;
    } catch {}
    // If either the active user or the user stored in local storage exists, navigate to the home page
    if (this.activeUser || localStorage.getItem('user')) {
      this.router.navigate(['./home']);
    }
  }

  // Method that navigates the user to the login page
  switchToLogin() {
    this.router.navigate(['./login']);
  }
}
