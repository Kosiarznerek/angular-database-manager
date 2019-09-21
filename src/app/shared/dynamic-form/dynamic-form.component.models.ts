// Form control type
import {Observable} from 'rxjs';

export type TFormControlType =
  'text' |
  'password' |
  'number' |
  'email' |
  'date' |
  'boolean' |
  'hidden' |
  'autocomplete' |
  'chips';

// Form control validator interface
export interface IFormControlValidator {
  isRequired: boolean;
  minLength?: number;
  maxLength?: number;
}

// Form control configuration interface
export interface IFormControlConfiguration {
  name: string;
  displayName: string;
  value: any;
  type: TFormControlType;
  validator: IFormControlValidator;
  isDisabled?: boolean;
}

// Filtered option data (used in autocomplete and chips)
export interface IFilteredOptionData {
  value: any;
  displayName: string;
}

// Filtered data provider
export type TFilteredOptionDataProvider = (
  searchPhrase: string | null, // null for first run
  control: IFormControlConfiguration,
  currentFormValue: object,
) => Observable<IFilteredOptionData[]>;

// Form control update
export interface IFormControlUpdate {
  name: string; // form control to update
  value: any; // new value to assign
}

// Form control change handler
export type FormControlChangeHandler = (
  control: IFormControlConfiguration,
) => Observable<IFormControlUpdate[]>;
