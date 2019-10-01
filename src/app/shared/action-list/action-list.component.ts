import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IActionInfo, IActionListItem} from './action-list.component.models';
import {Observable} from 'rxjs';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {

  // Component data
  @Input() showLoadingBackdrop: boolean;
  @Input() actionListItems$: Observable<IActionListItem[]>;
  @Input() readonly allowAdding: boolean;
  @Output() readonly action: EventEmitter<IActionInfo>;

  constructor() {
    this.action = new EventEmitter<IActionInfo>();
  }

  ngOnInit() {
  }

  /**
   * Executes on add button click
   */
  public onAddButtonClickHandler(): void {

    this.action.emit({
      executedAction: 'add',
      actionListItem: null
    });

  }

  /**
   * Executes on edit button click
   */
  public onEditButtonClickHandler(item: IActionListItem): void {

    this.action.emit({
      executedAction: 'edit',
      actionListItem: item
    });

  }

  /**
   * Executes on delete button click
   */
  public onDeleteButtonClickHandler(item: IActionListItem): void {

    this.action.emit({
      executedAction: 'delete',
      actionListItem: item
    });

  }

}
