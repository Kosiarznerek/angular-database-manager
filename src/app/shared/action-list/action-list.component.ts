import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {IActionInfo, IActionListItem} from './action-list.component.models';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Component({
  selector: 'app-action-list',
  templateUrl: './action-list.component.html',
  styleUrls: ['./action-list.component.scss']
})
export class ActionListComponent implements OnInit {

  // Component data
  public listItems$: Observable<IActionListItem[]>;
  @Input() readonly allowAdding: boolean;
  @Output() readonly action: EventEmitter<IActionInfo>;
  public showLoadingBackdrop: boolean;

  constructor() {
    this.action = new EventEmitter<IActionInfo>();
  }

  ngOnInit() {
  }

  @Input()
  public set actionListItems$(items$: Observable<IActionListItem[]>) {

    // No items -> assign
    if (!this.listItems$) {
      this.listItems$ = items$;
      return;
    }

    // Showing loading backdrop
    this.showLoadingBackdrop = true;

    // Reassigning process
    items$
      .pipe(catchError(() => of([])))
      .subscribe(v => {
        this.listItems$ = of(v);
        this.showLoadingBackdrop = false;
      });

  };

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
