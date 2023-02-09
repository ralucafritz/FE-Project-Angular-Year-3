import { Component, OnInit, SimpleChanges } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Stream } from 'src/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  template:
    '<app-nav-bar [noUpcomingStreams]="noUpcomingStreams" class="hidden"></app-nav-bar>',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  streamerName: string = '';
  allStreams!: Record<any, any>;
  haveStreams: boolean = false;
  keyArray: string[] = [];
  noUpcomingStreams: number = 0;

  constructor(private db: AngularFireDatabase) {}

  ngOnInit(): void {
    this.db
      .list('streamList')
      .query.get()
      .then((values) => {
        this.allStreams = values.val() as Record<any, any>;
        this.keyArray = Object.keys(this.allStreams);
        this.noUpcomingStreams = this.keyArray.length;
        console.log(this.noUpcomingStreams);
        console.log(values.val());
        this.haveStreams = true;
      });
  }

  goToStreamLink(name: string): void {
    location.href = `https://twitch.tv/${name}`;
  }

  deleteStream(key: any) {
    this.db
      .list('streamList')
      .query.get()
      .then((values) => {
        this.keyArray = Object.keys(this.allStreams);
        this.keyArray.forEach((element) => {
          if (values.val() === key) {
          }
        });
      });
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(changes + "home");
  }
}
