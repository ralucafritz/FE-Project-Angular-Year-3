import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Stream } from 'src/types';
import { StorageWrapper } from 'src/app/StorageWrapper';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent implements OnInit {
  addStreamForm!: FormGroup;
  allStreams!: Array<Stream>;
  streamerName = '';
  streamDescription = '';
  needAlert = false;
  isSuccessful = false;
  alertMessage: string = '';
  storageWrapper: StorageWrapper = StorageWrapper.getInstance("numberStreams");

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

      this.db.list('streamList').push({ streams: addStreamFormData });
      console.log('stream details sent to db');
      this.isSuccessful = true;
      this.triggerAlert();
      this.addStreamForm.reset();
      const storedData = this.storageWrapper.getItem();
      if (storedData === null) {
        return;
      }
      const numberStreams = JSON.parse(storedData);
      this.storageWrapper.setItem((numberStreams +1).toString())
    } else {
      this.isSuccessful = false;
      this.triggerAlert();
      return;
    }
  }

  triggerAlert() {
    if (this.isSuccessful) {
      this.alertMessage = 'The stream has been added succesfully.';
    } else {
      this.alertMessage = 'Something went wrong.';
    }
    this.needAlert = true;
  }
    
}
