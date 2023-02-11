import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AuthErrorsHelperComponent } from './auth-errors-helper.component';

describe('AuthErrorsHelperComponent', () => {
  let component: AuthErrorsHelperComponent;
  let fixture: ComponentFixture<AuthErrorsHelperComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AuthErrorsHelperComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AuthErrorsHelperComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
