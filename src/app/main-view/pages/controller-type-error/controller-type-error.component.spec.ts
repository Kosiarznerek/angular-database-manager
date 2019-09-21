import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ControllerTypeErrorComponent} from './controller-type-error.component';

describe('ControllerTypeErrorComponent', () => {
  let component: ControllerTypeErrorComponent;
  let fixture: ComponentFixture<ControllerTypeErrorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ControllerTypeErrorComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ControllerTypeErrorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
