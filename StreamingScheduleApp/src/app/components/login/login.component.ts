import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This component is responsible for handling user authentication,
 * which includes capturing user input data and validating the input,
 * submitting the login form to the authentication service,
 * and handling the response from the authentication service.
 * The component has several properties and methods, including a
 * form group to capture the user's email and password, error
 * messages to display, a switchToSignUp method to navigate the
 * user to the signup page, and an onSubmit method to process
 * the user's input and authenticate the user.
 *
 * The 'onSubmit' method is triggered when the user submits the form.
 * This method validates the form and, if it's valid, calls the 'loginUser'
 * method of the authentication service with the entered email and password. 
 * If the login was successful, the method stores the 'username' (which is derived from the 
 * email by removing special characters) * in 'localStorage' 
 * and navigates the user to the home page.
 * 
 * The 'checkAutoLogin' method is used to check for automatic login. 
 * This method retrieves the email of the currently active user from
 * the 'AngularFireAuth' service and if either the active user or the 
 * user stored in local storage exists, the user is redirected to the 
 * home page.
 * 
 * The 'switchToSignUp' method navigates the user to the signup page.
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  // Form for login
  loginForm!: FormGroup;
  // Flag to indicate whether to display the form validation error message or not
  public displayValidationMessage = false;
  // Holds the email address of the currently active user
  activeUser: string | null;
  // Message to be displayed in the error alert that gets sent directly from
  // 'AuthService' to the 'AuthErrorsHelper'
  errorMessage: string = '';

  constructor(
    // Injecting the AuthService, Router and AngularFireAuth dependencies
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    // Setting the initial value of the active user to null
    this.activeUser = null;
    // Attempting to check for automatic login
    try {
      this.checkAutoLogin();
    } catch {}
  }

  ngOnInit() {
    // Initializing the login form with the validated email and password inputs
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  // Method called when the login form is submitted
  onSubmit() {
    // If the login form is invalid, set 'displayValidationMessage' to true and return
    if (this.loginForm.invalid) {
      this.displayValidationMessage = true;
      return;
    }

    // Reset the 'displayValidationMessage' flag
    this.displayValidationMessage = false;

    // Call the loginUser method of the 'AuthService' with the entered email and password
    this.authService
      .loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then((result) => {
        // If the result is not null the login was successful
        if (!result) {
          // Remove any special characters from the email address and store the username in local storage
          let username = this.loginForm.value.email.replace(/[^a-z0-9]/gi, '');
          localStorage.setItem('user', username);
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

  // Method that navigates the user to the signup page
  switchToSignUp() {
    this.router.navigate(['./signup']);
  }
}
