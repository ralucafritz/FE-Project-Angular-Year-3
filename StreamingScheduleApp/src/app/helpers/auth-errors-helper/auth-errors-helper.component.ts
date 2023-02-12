import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This is a component for handling error messages during the 
 * authentication process.
 * 
 * The component receives the error message from the 'AuthService', 
 * which acts as a communication layer between the component and 
 * the back-end authentication system. The error message is then 
 * emitted to the component's parent component through an 'EventEmitter'.
 * 
 * The component also has a 'triggerAlert' method that sets the 
 * 'needAlert' property to true and after 10 seconds, sets it back 
 * to false, causing the error message to disappear.
 */
@Component({
  selector: 'app-auth-errors-helper',
  templateUrl: './auth-errors-helper.component.html',
  styleUrls: ['./auth-errors-helper.component.scss']
})
export class AuthErrorsHelperComponent implements OnInit {
  // The error message to be displayed in the pop-up alert
  errorMessage = "";
  // Flag indicating whether the error message should be displayed in the alert
  needAlert = false;
  // Event emitter for emitting the error message to the parent component
  @Output() errorMessageEvent = new EventEmitter<any>();

  constructor(private authService: AuthService) {
    // Subscribe to the 'errorMessage$' observable from the 'AuthService'
    // When a new error message is emitted, update the errorMessage and trigger the alert
    this.authService.errorMessage$.subscribe(errorMessage => {
      this.errorMessage = errorMessage;

      // Emitting the error message using the errorMessageEvent EventEmitter
      this.errorMessageEvent.emit(this.errorMessage);

      // Calling the triggerAlert function to show an alert
      this.triggerAlert();
    })
   }

  // Method for triggering the pop-up alert with the error message
  // The alert will be displayed for 10 seconds before being hidden
   triggerAlert() {
    this.needAlert = true;
    setTimeout(() => {
      this.needAlert = false;
    }, 10000);
  }

  ngOnInit(): void {
  }

}
