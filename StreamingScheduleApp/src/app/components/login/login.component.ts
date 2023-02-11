import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  firebaseErrorMessage: string;
  public isLoading = false;
  public displayValidationMessage = false;
  activeUser: string | null;
  errorMessage: string = '';

  constructor(
    private authService: AuthService,
    private router: Router,
    private afAuth: AngularFireAuth
  ) {
    this.loginForm = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', Validators.required),
    });
    this.activeUser = null;
    this.firebaseErrorMessage = '';
    try {
      this.checkAutoLogin();
    } catch {}
  }

  async checkAutoLogin() {
    try {
      this.activeUser = (await this.afAuth.currentUser)?.email ?? null;
      console.log(this.activeUser);
    } catch {}
    if (this.activeUser || localStorage.getItem('user')) {
      this.router.navigate(['./home']);
      console.log('AutoLogin');
    }
  }

  ngOnInit(): void {}

  onSubmit() {
    console.log("onSubmit login")
    if (this.loginForm.invalid) {
      this.displayValidationMessage = true;
      return;
    }
    this.displayValidationMessage = false;
    this.authService
      .loginUser(this.loginForm.value.email, this.loginForm.value.password)
      .then((result) => {
        if (!result) {
          let username = this.loginForm.value.email.replace(/[^a-z0-9]/gi, '');
          localStorage.setItem('user', username);
          this.router.navigate(['/home']);
        } else if (result.isValid == false) {
        }
      });
  }

  switchToSignUp() {
    this.router.navigate(['./signup']);
  }
}
