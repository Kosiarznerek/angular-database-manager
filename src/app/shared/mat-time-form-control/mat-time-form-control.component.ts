import {Component, Input, OnInit, TemplateRef} from '@angular/core';
import {FormControl, FormGroup} from '@angular/forms';
import {IFormControlConfiguration} from '../dynamic-form/dynamic-form.component.models';
import {distinctUntilChanged, map} from 'rxjs/operators';

@Component({
  selector: 'app-mat-time-form-control',
  templateUrl: './mat-time-form-control.component.html',
  styleUrls: ['./mat-time-form-control.component.scss']
})
export class MatTimeFormControlComponent implements OnInit {

  // Component input
  @Input() control: IFormControlConfiguration;
  @Input() validatorsTemplate: TemplateRef<HTMLElement>;
  @Input() formGroupContext: FormGroup;

  // Control value
  public controlValue: FormControl;

  constructor() {

    this.controlValue = new FormControl();

  }

  ngOnInit() {

    // Clone validators
    this.controlValue.setValidators(this.formGroupContext.get(this.control.name).validator);

    // Clone current value
    this.controlValue.setValue(this.ISOToString(
      this.formGroupContext.get(this.control.name).value
    ));

    // Set value change from control to hidden
    this.controlValue.valueChanges.pipe(
      distinctUntilChanged(),
      map(this.stringToDate)
    ).subscribe(value => this.formGroupContext.get(this.control.name).setValue(value));

    // Set value change from hidden to control
    this.formGroupContext.get(this.control.name).valueChanges.pipe(
      map(this.ISOToString)
    ).subscribe(value => this.controlValue.setValue(value));

  }

  /**
   * Converts string to date object
   * @param value Value to parse eg 23:45
   */
  private stringToDate(value: string): Date {

    // Empty
    if (!value || value === '') {
      return null;
    }

    // Extract hours and minutes
    const hours = Number(value.split(':')[0]);
    const minutes = Number(value.split(':')[1]);

    // Return date
    return new Date(new Date(0).setHours(hours, minutes));

  }

  /**
   * Converts date to string
   * @param date Date to parse
   */
  private ISOToString(date: string): string {

    // No value
    if (!date || date === '') {
      return null;
    }

    // Convert to object
    const dateObject: Date = new Date(date);

    // Convert to string
    const hours: string = dateObject.getHours().toString().padStart(2, '0');
    const minutes: string = dateObject.getMinutes().toString().padStart(2, '0');

    // Return
    return `${hours}:${minutes}`;

  }

}
