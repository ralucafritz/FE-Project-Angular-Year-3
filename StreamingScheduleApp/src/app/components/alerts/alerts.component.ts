import { Component, Input, OnInit } from '@angular/core';

/**
 * This is a that represents an alert box.
 * The component has three input properties: 'needAlert', 'showAlert' and 'alertMessage'.
 * The 'needAlert' and 'showAlert' properties are booleans that determine if an alert is
 * needed and if it was successful. The 'alertMessage' property is
 * a string that represents the message to be displayed in the alert box.
 * 
 * The 'triggerAlert' method is called in the component's constructor and
 * sets the 'needAlert' property to true, and after 10 seconds, sets it back
 * to false and sets the 'alertMessage' property to an empty string.
 */

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss'],
})
export class AlertsComponent implements OnInit {
  // Flag to indicate if an alert is required
  @Input() needAlert = false;
  // Flag to indicate if the operation was successful
  @Input() isSuccessful = false;
  // Message to be displayed in the alert
  @Input() alertMessage: string = '';

  constructor() {
    this.triggerAlert();
  }

  triggerAlert() {
    this.needAlert = true;
    setTimeout(() => {
      this.needAlert = false;
      this.alertMessage = "";
    }, 10000);
  }


  ngOnInit(): void {}
}
