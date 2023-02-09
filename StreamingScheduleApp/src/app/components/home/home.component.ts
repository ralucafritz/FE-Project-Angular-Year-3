import { Component, OnInit } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/compat/database';
import { Stream } from 'src/types';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  streamerName: string = "";
  allStreams!: Record<any,any>;
  haveStreams: boolean = false;
  keyArray: string[] = [];
  
  constructor(private db: AngularFireDatabase) { }

  ngOnInit(): void {
    this.db.list('streamList').query.get().then((values)=>{
      this.allStreams = values.val() as Record<any,any>;
      this.keyArray = Object.keys(this.allStreams);
      console.log(values.val());
      this.haveStreams = true;
    });
  }

  goToStreamLink(name: string): void{
    location.href = `https://twitch.tv/${name}`;
  }

}
