import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Router } from '@angular/router';

@Component({
  selector: 'app-nav-bar',
  templateUrl: './nav-bar.component.html',
  styleUrls: ['./nav-bar.component.scss'],
})
export class NavBarComponent implements OnInit {
  public profileName: string;
  activeUser: string | null;
  auth: AngularFireAuth;

  constructor(
    public afAuth: AngularFireAuth,
    private router: Router,
    private db: AngularFireDatabase
  ) {
    this.profileName = 'Ralu';
    this.activeUser = null;
    this.auth = afAuth;
  }

  ngOnInit(): void {
    this.getStarted();
  }

  async getStarted() {
    this.activeUser = (await this.auth.currentUser)?.email ?? null;
    var details: string[];
    details = [];
    await this.getDetails().then((value) => {
      details = value as string[];
    });

    this.profileName = details[0];

    if (this.profileName) {
      let names = this.profileName.split(' ');
    }
  }

  getDetails() {
    return new Promise((resolve, reject) => {
      this.db
        .list('users/' + localStorage.getItem('user') + '/info')
        .valueChanges()
        .subscribe((value) => {
          resolve(value);
        });
    });
  }

  logout(): void {
    this.afAuth.signOut();
    localStorage.removeItem('user');
    this.router.navigate(['./home']);
  }

  login(): void {
    this.router.navigate(['./login']);
  }

  goToDashboard() {
    this.router.navigate(['./dashboard']);
  }

  goToContact() {
    this.router.navigate(['./contact']);
  }

  goToHome() {
    this.router.navigate(['./home']);
  }
}
