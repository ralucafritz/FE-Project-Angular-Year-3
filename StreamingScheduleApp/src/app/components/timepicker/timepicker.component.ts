import { Component, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * This component allows users to select a specific time. 
 * It utilizes two select elements, one for hours and another 
 * for minutes, to allow users to select a specific hour and minute. 
 * 
 * The selected hour and minute are then emitted through the 
 * 'onTimeSelected' event emitter. The parent component that uses 
 * this timepicker component can then subscribe to the 
 * 'onTimeSelected' event to receive the selected time.
 * 
 * This component is initialized with the current time, which 
 * is set as the default selected time in the select elements. 
 * 
 * Please note that at present, this component is not currently 
 * utilized within the application. However, it may be integrated 
 * as a feature in the future.
 */

@Component({
  selector: 'app-timepicker',
  templateUrl: './timepicker.component.html',
  styleUrls: ['./timepicker.component.scss'],
})
export class TimepickerComponent implements OnInit {
  // Create a custom event that can be emitted to the parent component
  @Output() onTimeSelected = new EventEmitter<{
    hour: number;
    minute: number;
  }>();

  // Used to set the initial value of the time picker
  time: Date = new Date();
  // Currently selected values of the time picker
  selectedHour: number = this.time.getHours();
  selectedMinute: number = this.time.getMinutes();
  // Arrays with the length of 24 and 60 respectively, 
  // used to populate the select options for hours and minutes
  hours = Array.from({ length: 24 }, (_, i) => i);
  minutes = Array.from({ length: 60 }, (_, i) => i);

  ngOnInit() {}

  updateTime() {
    this.onTimeSelected.emit({
      hour: this.selectedHour,
      minute: this.selectedMinute,
    });
  }
}
