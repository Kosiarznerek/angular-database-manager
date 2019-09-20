import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {MatChipsFormControlComponent} from './mat-chips-form-control.component';

describe('MatChipsFormControlComponent', () => {
    let component: MatChipsFormControlComponent;
    let fixture: ComponentFixture<MatChipsFormControlComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [MatChipsFormControlComponent]
        })
            .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(MatChipsFormControlComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
