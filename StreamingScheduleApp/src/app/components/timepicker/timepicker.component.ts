import { Component, Output, EventEmitter, OnInit } from '@angular/core';

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements OnInit {
  @Output() onTimeSelected = new EventEmitter<{
    hour: number;
    minute: number;
  }>();
  time: Date = new Date();
  hours: number[] = [];
  minutes: number[] = [];
  selectedHour: number = this.time.getHours();
  selectedMinute: number = this.time.getMinutes();

  ngOnInit() {
    for (let i = 0; i < 24; i++) {
      this.hours.push(i);
    }

    for (let i = 0; i < 60; i++) {
      this.minutes.push(i);
    }
  }

  updateTime() {
    this.time.setHours(this.selectedHour);
    this.time.setMinutes(this.selectedMinute);
    this.onTimeSelected.emit({
      hour: this.selectedHour,
      minute: this.selectedMinute,
    });
  }
}
