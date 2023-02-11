import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-alerts',
  templateUrl: './alerts.component.html',
  styleUrls: ['./alerts.component.scss']
})
export class AlertsComponent implements OnInit {
  
  @Input() needAlert = false;
  @Input() showAlert = false;
  @Input() alertMessage: string = "";
  @Input() errorMessage$: Observable<string>= new Observable<string>();

  constructor() { }

  ngOnInit(): void {
  }

}
