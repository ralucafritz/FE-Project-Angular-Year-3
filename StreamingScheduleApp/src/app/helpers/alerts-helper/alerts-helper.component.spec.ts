import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AlertsHelperComponent } from './alerts-helper.component';

describe('AlertsHelperComponent', () => {
  let component: AlertsHelperComponent;
  let fixture: ComponentFixture<AlertsHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AlertsHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AlertsHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
