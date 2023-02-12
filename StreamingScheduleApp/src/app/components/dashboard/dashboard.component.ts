import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageWrapper } from 'src/app/StorageWrapper';

/**
 * This is a component responsible for adding new streams to a database.
 * The component also uses a custom class named 'StorageWrapper' that has
 * the ability to listen for 'localStorage' events.
 *
 * The component has a 'FormGroup' instance to represent the form for
 * adding a new stream, which contains two fields: 'streamerName' and
 * 'streamDescription', both of which are required.
 *
 * The 'addStream' method is called when the user submits the form.
 * This method checks if the form is valid and, if so, pushes the form
 * data to the 'streamList' node in the Firebase database.
 * The method also logs a message to the console, triggers an alert
 * with a success or error message, and resets the form fields if
 * it was successful. Additionally, it retrieves the stored data
 * from 'StorageWrapper' and updates the number of streams by
 * incrementing it by one.
 *
 * The 'triggerAlert' method sets the 'needAlert' flag to true, indicates
 * that an alert should be displayed to the user. The method also sets
 * the 'isSuccessful' flag based on the success parameter and
 * sets the 'alertMessage' property to a message indicating
 * whether the operation was successful or not.
 */

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  // Form for adding a stream
  addStreamForm!: FormGroup;
  // Instance of the 'StorageWrapper'
  storageWrapper: StorageWrapper = StorageWrapper.getInstance('numberStreams');
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

  ngOnInit() {
    // Initialize the form for adding a stream.
    this.addStreamForm = new FormGroup({
      streamerName: new FormControl('', [Validators.required]),
      streamDescription: new FormControl('', [
        Validators.required,
        Validators.minLength(25),
      ]),
    });
  }

  addStream() {
    // Check if the form is valid
    if (this.addStreamForm.valid) {
      // Create an object with the form data
      const addStreamFormData = this.addStreamForm.value;
      // Push the form data to the 'streamList' in the database
      this.db.list('streamList').push({ streams: addStreamFormData });

      // Trigger alert to show the success
      this.triggerAlert(true);

      // Reset form fields when completed
      this.addStreamForm.reset();

      // Retrieve data from storageWrapper
      const storedData = this.storageWrapper.getItem();
      if (storedData === null) {
        return;
      }
      // Parse the retrieved data from storageWrapper
      const numberStreams = JSON.parse(storedData);

      // Update the stored data with the addition of a new stream
      // as the addition was successful.
      this.storageWrapper.setItem((numberStreams + 1).toString());
    } else {
        // Trigger alert to show the error problem
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
