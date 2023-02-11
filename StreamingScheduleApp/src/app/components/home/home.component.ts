import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { StorageWrapper } from 'src/app/StorageWrapper';
import { AuthService } from 'src/app/services/auth.service';
import { Stream } from 'src/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  streamerName: string = '';
  allStreams!: Record<any, any>;
  haveStreams: boolean = false;
  keyArray: Array<string> = [];
  numberStreams: number = 0;
  storageWrapper: StorageWrapper = StorageWrapper.getInstance('numberStreams');
  userLoggedIn: boolean = false;

  constructor(
    private db: AngularFireDatabase,
    public authService: AuthService
  ) {}

  ngOnInit(): void {
    this.authService.loggedInObservable.subscribe((subscriber) => {
      this.changeStatus(subscriber);
      console.log('subscriberHome called + ' + subscriber);
    });

    this.db
      .list('streamList')
      .query.get()
      .then((values) => {
        this.allStreams = values.val() as Record<any, any>;
        this.keyArray = Object.keys(this.allStreams);
        console.log(this.allStreams);
        this.haveStreams = true;
        this.numberStreams = this.keyArray.length;
        this.storageWrapper.setItem(this.numberStreams.toString());
      });
  }

  changeStatus(status: boolean) {
    this.userLoggedIn = status;
    console.log('changeStatus home called + ' + this.userLoggedIn);
  }

  goToStreamLink(name: string): void {
    location.href = `https://twitch.tv/${name}`;
  }

  deleteStream(key: any) {
    this.db
      .list('streamList')
      .remove(key)
      .then(() => {
        console.log('Stream deleted successfully!');
        const temp: any = {};

        Object.keys(this.allStreams).forEach((tempkey) => {
          if (tempkey !== key) {
            temp[tempkey] = this.allStreams[tempkey];
          } else {
            this.keyArray.splice(this.keyArray.indexOf(tempkey), 1);
          }
        });
        this.allStreams = temp;
        this.numberStreams = this.keyArray.length;
        this.storageWrapper.setItem(this.numberStreams.toString());
        if (this.numberStreams > 0) {
          this.haveStreams = true;
        } else {
          this.haveStreams = false;
        }
      })
      .catch((error) => {
        console.error(error);
      });
  }
}
