// Form control type
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
  onChange?: string;
  onFilteredOptionData?: string;
}
