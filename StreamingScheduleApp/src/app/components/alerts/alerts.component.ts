import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {

  
  @Input() needAlert = false;
  @Input() showAlert = false;
  @Input() alertMessage: string = "";


  constructor() { }

  ngOnInit(): void {
  }

}
