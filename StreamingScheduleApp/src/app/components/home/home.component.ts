import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageWrapper } from 'src/app/StorageWrapper';
import { AuthService } from 'src/app/services/auth.service';

/**
 * This component is responsible for displaying a list of streams
 * that have been stored in a Firebase database and providing
 * links to each stream on Twitch.
 *
 * The component retrieves the streams from the database and stores
 * the information in the 'allStreams' property.
 * The 'ngOnInit' method is called when the component is loaded.
 * It retrieves the list of streams from the 'streamList' node
 * of the Firebase database and stores the list in the 'allStreams'
 * object, the keys of the streams in the 'keyArray' array,
 * and the number of streams in the 'numberStreams' property.
 * The component uses the 'StorageWrapper' class to store the 
 * number of streams in the local storage. The component also uses 
 * the 'AuthService' to check if the user is logged in.
 *
 * The 'deleteStream' method is used to delete a stream from the
 * list of streams in the Firebase database.
 * It takes the key (streamer name) of the stream to be deleted
 * as an argument. If the deletion is successful, the corresponding
 * stream is removed from the 'allStreams' object, the 'keyArray'
 * array, the 'haveStreams' and the 'numberStreams' properties are
 * updated accordingly.
 *
 * The 'triggerAlert' method is used to display an alert message
 * to the user. It takes two arguments: a boolean to indicate if
 * the action was successful and an optional string to display a message.
 * If the action was successful, a success message is displayed.
 * Otherwise, the message provided as an argument, the error message
 * is displayed.
 *
 * The 'goToStreamLink' method generates the link to the
 * corresponding stream on Twitch based on the provided streamer name
 * and redirects the user to that link.
 *
 */

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  // Store all streams from the 'Firebase' database
  allStreams!: Record<any, any>;
  // Store all keys of the streams
  keyArray: Array<string> = [];
  // Instance of the 'StorageWrapper'
  storageWrapper: StorageWrapper = StorageWrapper.getInstance('numberStreams');
  // Number of streams stored in the Firebase database
  numberStreams: number = 0;
  // Flag to indicate if there are streams in the DB or not
  haveStreams: boolean = false;
  // Flag to indicate if a user is logged in or not
  userLoggedIn: boolean = false;
  // Flag to indicate if an alert is required
  needAlert = false;
  // Flag to indicate if the operation was successful
  isSuccessful = false;
  // Message to be displayed in the alert
  alertMessage = '';

  constructor(
    // Injecting the AngularFireDatabase and AuthService dependencies
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    // Fetch the streamList from the Firebase database
    this.db
      .list('streamList')
      .query.get()
      .then((values) => {
        // Store the fetched streams in the allStreams variable
        this.allStreams = values.val() as Record<any, any>;
        // Store all the keys of the streams in the keyArray
        this.keyArray = Object.keys(this.allStreams);
        // Set the haveStreams flag to true, since there are streams
        this.haveStreams = true;
        // Set the number of streams
        this.numberStreams = this.keyArray.length;
        // Store the number of streams in the local storage
        this.storageWrapper.setItem(this.numberStreams.toString());
      });
  }

  // Method to delete a stream from the Firebase database
  deleteStream(key: any) {
    // Remove the stream with the specified key from the Firebase database
    this.db
      .list('streamList')
      .remove(key)
      .then(() => {
        // Temporary object to store the updated list
        const temp: any = {};

        // Loop through all the streams
        Object.keys(this.allStreams).forEach((tempkey) => {
          // If the current key is not the key to be deleted,
          // add it to the temporary object

          if (tempkey !== key) {
            temp[tempkey] = this.allStreams[tempkey];
          } else {
            // If the current key is the key to be deleted,
            // remove it from the 'keyArray'

            this.keyArray.splice(this.keyArray.indexOf(tempkey), 1);
          }
        });
        this.allStreams = temp;
        // Update the number of streams
        this.numberStreams = this.keyArray.length;
        // Set the updated number of streams in the storage
        this.storageWrapper.setItem(this.numberStreams.toString());
        // Update the haveStreams property based on the updated number of streams
        if (this.numberStreams > 0) {
          this.haveStreams = true;
        } else {
          this.haveStreams = false;
        }
        // Trigger alert to show the success
        this.triggerAlert(true);
      })
      .catch((error) => {
        // Trigger alert to show the error
        this.triggerAlert(false, error.toString);
      });
  }

  // Method to trigger an alert
  triggerAlert(success: boolean, message?: string) {
    this.isSuccessful = success;
    this.alertMessage = message
      ? message
      : 'The stream has been deleted successfully.';
    this.needAlert = true;
    console.log(this.alertMessage, this.isSuccessful, this.needAlert);
  }

  // Method to redirect the user to the stream's link on twitch.tv
  goToStreamLink(name: string): void {
    location.href = `https://twitch.tv/${name}`;
  }
}
