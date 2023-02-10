import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TimepickerComponent } from '../timepicker/timepicker.component';
import { MatDatepickerInputEvent } from '@angular/material/datepicker';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Stream } from 'src/types';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  addStreamForm!: FormGroup;
  allStreams!: Stream[];
  streamerName = '';
  streamDescription = '';
  needAlert = false;
  isSuccessful = false;
  alertMessage: string = "";

  constructor(
    private db: AngularFireDatabase,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit() {
    this.addStreamForm = this.formBuilder.group({
      streamerName: ['', Validators.required],
      streamDescription: ['', Validators.required],
    });
  }

  addStream() {
    if (this.addStreamForm.valid) {
      this.streamerName = this.addStreamForm.value.streamerName;
      this.streamDescription = this.addStreamForm.value.streamDescription;

      const addStreamFormData = {
        streamerName: this.streamerName,
        streamDescription: this.streamDescription,
      };

      this.db
      .list('streamList').push({ streams: addStreamFormData });
      console.log('stream details sent to db');
      this.isSuccessful = true;
      this.triggerAlert();
      this.addStreamForm.reset();
    } else {
      this.isSuccessful = false;
      this.triggerAlert();
      return;
    }
  }

  triggerAlert() {
    this.needAlert = true;
    this.setAlertMessage();
    setTimeout(() => {
      this.needAlert = false;
    }, 30000);
  }

  setAlertMessage(){
    if(this.isSuccessful)
    {
      this.alertMessage = "The stream has been added succesfully."
    }else
    {
      this.alertMessage = "Something went wrong."
    }
  }
}
