// Filtered option data (used in autocomplete and chips)
export interface IFilteredOptionData {
  value: any;
  displayName: string;
}

// Form control update
export interface IFormControlUpdate {
  name: string; // form control to update
  value: any; // new value to assign
}
