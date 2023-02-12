import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

/**
 * This is a component class for a contact form.
 * It uses the AngularFireDatabase for database access,
 * 'FormBuilder' for building a reactive form, and Router for navigation.
 *
 * The component has a 'FormGroup' instance to represent the form for
 * adding a new contact data, which contains three fields:
 * 'username', email and 'message', all of which are required.
 *
 * The 'addStream' method is called when the user submits the form.
 * This method checks if the form is valid and, if so, pushes the form
 * data to the 'contact' node in the Firebase database.
 * The method also logs a message to the console, triggers an alert
 * with a success or error message, and resets the form fields if
 * it was successful.
 *
 * The 'triggerAlert' method sets the 'needAlert' flag to true, indicates
 * that an alert should be displayed to the user. The method also sets
 * the 'isSuccessful' flag based on the success parameter and
 * sets the 'alertMessage' property to a message indicating
 * whether the operation was successful or not.
 */

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  // Form for adding a contact
  addContactForm!: FormGroup;
  // Flag to indicate if an alert is required
  needAlert = false;
  // Flag to indicate if the operation was successful
  isSuccessful = false;
  // Message to be displayed in the alert
  alertMessage: string = '';

  constructor(
    // Injecting the AngularFireDatabase and FormBuilder dependencies
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addContactForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(25)]],
    });
  }

  // Method to add a new contact message to the database
  addContact() {
    // Check if the form is valid
    if (this.addContactForm.valid) {
      // Create an object with the form data
      const addContactFormData = this.addContactForm.value;

      // Push the form data to the 'contact' in the database
      this.db.list('contact').push({ messages: addContactFormData });

      // Trigger alert to show the success
      this.triggerAlert(true);

      // Reset form fields when completed
      this.addContactForm.reset();
    } else {
        // Trigger alert to show the error message
      this.triggerAlert(false);
      return;
    }
  }

  // Method to trigger an alert
  triggerAlert(success: boolean) {
    this.isSuccessful = success;
    this.alertMessage = success
      ? 'The stream has been added successfully.'
      : 'Minimum 25 characters required for the description';
    this.needAlert = true;
  }
}
