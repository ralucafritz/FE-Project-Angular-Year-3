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
  public submitted = false;
  signupForm!: FormGroup;
  firebaseErrorMessage: string;
  activeUser: string | null;
  errorMessage: string = '';

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
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [
        Validators.required,
        Validators.minLength(6),
      ]),
    });
  }

  onSubmit() {
    if (this.signupForm.invalid) {
      this.displayValidationMessage = true;
      return;
    }
    this.displayValidationMessage = false;
    this.isLoading = true;
    const formData = {
      name: this.signupForm.value.email.slice(0, 4),
    };

    this.authService.signupUser(this.signupForm.value).then(async (result) => {
      if (result == null) {
        let username = this.signupForm.value.email.replace(/[^a-z0-9]/gi, '');
        await this.db.object('users/' + username + '/info').set(formData);
      } else if (result.isValid == false) {
        this.authService.errorMessage$.subscribe((errorMessage) => {
          this.errorMessage = errorMessage;
          console.log(errorMessage);
        });
        this.router.navigate(['./signup']);
      }
    });
  }

  switchToLogin() {
    this.router.navigate(['./login']);
  }
}
