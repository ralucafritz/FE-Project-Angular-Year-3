import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts-helper',
  templateUrl: './alerts-helper.component.html',
  styleUrls: ['./alerts-helper.component.scss'],
})
export class AlertsHelperComponent implements OnInit {
  @Input() needAlert = false;
  @Input() showAlert = false;
  @Input() alertMessage = "";

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

  ngOnInit() {
    
  }
}
