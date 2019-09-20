import {IDetail} from '../details-list/details-list.component.models';

// Action list item interface
export interface IActionListItem {
    id: string | number;
    headerTitle: string;
    headerDescription: string;
    editable: boolean;
    deletable: boolean;
    details: IDetail[];
}

// Action info
export interface IActionInfo {
    executedAction: 'edit' | 'delete' | 'add';
    actionListItem: IActionListItem | null;
}
