import {Component, ElementRef, Input, OnInit, TemplateRef, ViewChild} from '@angular/core';
import {
  IFilteredOptionData,
  IFormControlConfiguration as IFormControlBasicConfiguration
} from '../dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';
import {COMMA, ENTER} from '@angular/cdk/keycodes';
import {MatAutocomplete, MatAutocompleteSelectedEvent} from '@angular/material/autocomplete';

// Adding type to value
interface IFormControlConfiguration extends IFormControlBasicConfiguration {
  value: IFilteredOptionData[];
}

@Component({
  selector: 'app-mat-chips-form-control',
  templateUrl: './mat-chips-form-control.component.html',
  styleUrls: ['./mat-chips-form-control.component.scss']
})
export class MatChipsFormControlComponent implements OnInit {

  // Component data
  private _control: IFormControlConfiguration;
  @Input() validatorsTemplate: TemplateRef<HTMLElement>;
  @Input() formGroupContext: FormGroup;

  // Refs
  @ViewChild('dataInput', {static: true}) private _dataInput: ElementRef<HTMLInputElement>;
  @ViewChild('auto', {static: true}) private _matAutocomplete: MatAutocomplete;

  // Settings
  public selectable: boolean;
  public removable: boolean;
  public separatorKeysCodes: number[];
  public addChipOnBlur: boolean;

  constructor() {
    this.selectable = true;
    this.removable = true;
    this.separatorKeysCodes = [ENTER, COMMA];
    this.addChipOnBlur = true;
  }

  ngOnInit() {
  }

  @Input()
  public set control(control: IFormControlConfiguration) {

    this._control = control;
    if (!Array.isArray(control.value)) {
      control.value = [];
    }

  }

  public get control(): IFormControlConfiguration {

    return this._control;

  }

  /**
   * On chip remove
   */
  public removeChip(toRemove: IFilteredOptionData): void {

    this._control.value = this._control.value.filter(v => v.value !== toRemove.value);
    this.formGroupContext.get(this._control.name).setValue(this._control.value);

  }

  /**
   * On selected chip
   */
  public selectedChip(event: MatAutocompleteSelectedEvent): void {

    this._control.value.push(event.option.value as IFilteredOptionData);
    this._dataInput.nativeElement.value = '';
    this.formGroupContext.get(this._control.name).setValue(null);
    this.formGroupContext.get(this._control.name).setValue(this._control.value);

  }

  /**
   * Function used in view to extract display names for mat-autocomplete
   */
  public matAutocompleteDisplayWith(data?: IFilteredOptionData): string | null {

    return data ? data.displayName : null;

  }

}
