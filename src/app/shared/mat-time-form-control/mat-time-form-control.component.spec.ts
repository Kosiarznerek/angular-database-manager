import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatTimeFormControlComponent} from './mat-time-form-control.component';

describe('MatTimeFormControlComponent', () => {
  let component: MatTimeFormControlComponent;
  let fixture: ComponentFixture<MatTimeFormControlComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [MatTimeFormControlComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MatTimeFormControlComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
