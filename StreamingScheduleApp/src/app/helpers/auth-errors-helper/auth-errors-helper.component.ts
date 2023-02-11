import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-auth-errors-helper',
  templateUrl: './auth-errors-helper.component.html',
  styleUrls: ['./auth-errors-helper.component.scss']
})
export class AuthErrorsHelperComponent implements OnInit {

  errorMessage = "";
  needAlert = false;

  @Output() errorMessageEvent = new EventEmitter<any>();

  constructor(private authService: AuthService) {
    this.authService.errorMessage$.subscribe(errorMessage => {
      this.errorMessage = errorMessage;
      this.errorMessageEvent.emit(this.errorMessage);
      this.triggerAlert();
    })
   }

   triggerAlert() {
    this.needAlert = true;
    setTimeout(() => {
      this.needAlert = false;
    }, 10000);
  }

  ngOnInit(): void {
  }

}
