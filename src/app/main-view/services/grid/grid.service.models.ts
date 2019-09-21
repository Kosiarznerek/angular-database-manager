// Models imports
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {IActionListItem} from '../../../shared/action-list/action-list.component.models';

// Grid definition interface
export interface IGridDefinition {
  allowAdding: boolean; // is user able to add to grid?
  addConfiguration: IFormControlConfiguration[]; // which controls should be displayed when adding new item?
}

// Grid data interface
export interface IGridData extends IPaginatorState {
  items: IActionListItem[];
}
