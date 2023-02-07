import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup-page',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
})
export class SignupComponent implements OnInit {
  public isLoading = false;
  public displayValidationMessage = false;
  public passValidationMessage = false;
  public submitted=false;
  signupForm!: FormGroup;
  firebaseErrorMessage: string;
  activeUser: string | null;

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth,
    private db: AngularFireDatabase
  ) {
    this.activeUser = null;
    this.firebaseErrorMessage = '';
    this.checkAutoLogin();
  }

  async checkAutoLogin() {
    try {
      this.activeUser = (await this.afAuth.currentUser)?.email ?? null;
    } catch {}
    if (this.activeUser || localStorage.getItem('user')) {
      this.router.navigate(['./home']);
      console.log('AutoLogin');
    }
  }

  ngOnInit(): void {
    this.signupForm = new FormGroup({
      name: new FormControl('', Validators.required),
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.displayValidationMessage = true;
      return;
    }
    this.displayValidationMessage = false;
    this.isLoading = true;
    var formData = {
      name: this.signupForm.value.name,
    };

    this.authService
      .signupUser(this.signupForm.value)
      .then(async (result) => {
        if (result == null)
        {
            let username = this.signupForm.value.email.replace(/[^a-z0-9]/gi, '')
            await this.db.object('users/' + username + '/info').set(formData);
            localStorage.setItem("user", username);
            // null is success, false means there was an error
            this.router.navigate(['../home']);
        }
          
        else if (result.isValid == false) {
          this.firebaseErrorMessage = result.message;
          this.router.navigate(['../']);
        }
      })
      .catch(() => {
        alert('Error');
      });
  }

  switchToLogin() {
    this.router.navigate(['./login']);
  }
}
