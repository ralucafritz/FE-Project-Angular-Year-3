import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
})
export class ContactComponent implements OnInit {
  isList = false;
  addContactForm!: FormGroup;
  username = '';
  email = '';
  message = '';
  needAlert = false;
  showAlert = false;

  constructor(
    private db: AngularFireDatabase,
    private router: Router,
    private formBuilder: FormBuilder
  ) {}

  ngOnInit(): void {
    this.addContactForm = this.formBuilder.group({
      username: ['', Validators.required],
      email: ['', Validators.required],
      message: ['', Validators.required],
    });
  }

  addContact() {
    if (this.addContactForm.valid) {
      this.username = this.addContactForm.value.username;
      this.email = this.addContactForm.value.email;
      this.message = this.addContactForm.value.message;

      const addContactFormData = {
        username: this.username,
        email: this.email,
        message: this.message,
      };

      this.db.list('contact').push({ messages: addContactFormData });
      console.log('contact sent to DB');
      this.showAlert = true;
      this.triggerAlert();
    } else {
      this.showAlert = false;
      this.triggerAlert();
      return;
    }
  }

  triggerAlert() {
    this.needAlert = true;
    setTimeout(() => {
      this.needAlert = false;
    }, 30000);
  }

  refresh() {
    this.router.navigate(['./dashboard']);
  }
}
