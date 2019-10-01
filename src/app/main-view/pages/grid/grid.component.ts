import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {merge, Observable, of, Subject} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {GridService} from '../../services/grid/grid.service';
import {IGridDefinition} from '../../services/grid/grid.service.models';
import {IActionInfo, IActionListItem} from '../../../shared/action-list/action-list.component.models';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {catchError, filter, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {EGridState} from './grid.component.models';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {FormGroup} from '@angular/forms';

@Component({
  templateUrl: './grid.component.html',
  styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {

  public menuItem$: Observable<IMenuItem>;

  // Grid data
  public activeGridState: EGridState;
  public actionListItems$: Observable<IActionListItem[]>;
  public gridDefinition$: Observable<IGridDefinition>;

  // Paginator state
  public paginatorState: IPaginatorState;

  // Active form controls configuration
  public activeFormControlsConfiguration: IFormControlConfiguration[];

  // Simple getters
  public EGridState = EGridState;

  // Events observables
  public isLoading: boolean;
  public readonly paginatorStateChange$: Subject<IPaginatorState>;
  public readonly actionListItemDelete$: Subject<IActionListItem>;
  public readonly actionListItemEdit$: Subject<FormGroup>;
  public readonly actionListItemAdd$: Subject<FormGroup>;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _gridService: GridService,
    private readonly _matSnackBar: MatSnackBar,
  ) {

    // Assign events
    this.paginatorStateChange$ = new Subject();
    this.actionListItemDelete$ = new Subject();
    this.actionListItemEdit$ = new Subject();
    this.actionListItemAdd$ = new Subject();

  }

  ngOnInit() {

    this.activeGridState = EGridState.ActionList;
    this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;
    this.gridDefinition$ = this.menuItem$.pipe(
      switchMap(({controllerSource}) => this._gridService.getDefinition(controllerSource))
    ).pipe(shareReplay());
    this._initActionListItems();

  }

  /**
   * Loads action list item
   */
  private _initActionListItems(): void {

    // Creating get items observable
    const getItems$: Observable<IActionListItem[]> = this.menuItem$.pipe(
      switchMap(({controllerSource}) => this._gridService.getData(
        controllerSource,
        this.paginatorState,
      ).pipe(
        // Update paginator state
        tap(({totalPages, currentPage, currentPageSize, pageSizeOptions, totalRecords}) => this.paginatorState = {
          totalPages,
          currentPage,
          currentPageSize,
          totalRecords,
          pageSizeOptions,
        }),

        // Map to items
        map(v => v.items),
      )),
    );

    // Create action list items
    this.actionListItems$ = merge(
      getItems$, // to first load
      this.paginatorStateChange$.pipe( // page change
        tap(v => this.isLoading = true), // setting loading to true
        switchMap(v => getItems$),
      ),
      this.actionListItemDelete$.pipe( // on item delete
        tap(v => this.isLoading = true), // setting loading to true
        map(itemData => itemData.id),
        switchMap(itemId => this.menuItem$.pipe( // get controller source
          map(v => v.controllerSource),
          switchMap(ctrl => this._gridService.removeItem(ctrl, itemId as string).pipe( // remove item
            catchError(() => of(false)),
            tap(response => this._handleDeleteActionItemResponse(response)),
            filter(response => response), // reload only if success
            switchMap(() => getItems$)
          )),
        )),
      ),
      this.actionListItemAdd$.pipe( // on item add
        tap(v => this.isLoading = true), // setting loading to true
        switchMap(formData => this.menuItem$.pipe( // get controller source
          map(v => v.controllerSource),
          switchMap(ctrl => this._gridService.addItem(ctrl, formData.getRawValue()).pipe( // add item
            tap(response => this._handleAddActionItemResponse(response)),
            filter(response => response), // reload only if success
            switchMap(() => getItems$)
          ))
        ))
      ),
      this.actionListItemEdit$.pipe( // on item edit
        tap(v => this.isLoading = true), // setting loading to true
        switchMap(formData => this.menuItem$.pipe( // get controller source
          map(v => v.controllerSource),
          switchMap(ctrl => this._gridService.editItem(ctrl, formData.getRawValue()).pipe( // edit item
            tap(response => this._handleEditActionItemResponse(response)),
            filter(response => response), // reload only if success
            switchMap(() => getItems$)
          ))
        ))
      )
    ).pipe(
      tap(v => this.isLoading = false), // setting loading to false
      shareReplay()
    );

  }

  /**
   * Executes on action click
   */
  public onActionListItemClickHandler(action: IActionInfo): void {

    // Depending on action
    switch (action.executedAction) {

      // Editing item
      case 'edit':
        this.activeFormControlsConfiguration = null;
        this.menuItem$.pipe(
          switchMap(({controllerSource}) => this._gridService.getEditItemConfiguration(
            controllerSource,
            action.actionListItem.id,
          )),
        ).subscribe(v => this.activeFormControlsConfiguration = v);
        this.activeGridState = EGridState.EditForm;
        break;

      // Deleting item
      case 'delete':
        this.actionListItemDelete$.next(action.actionListItem);
        break;

      // Adding new
      case 'add':
        this.activeFormControlsConfiguration = null;
        this.gridDefinition$.subscribe(({addConfiguration}) =>
          this.activeFormControlsConfiguration = addConfiguration,
        );
        this.activeGridState = EGridState.AddForm;
        break;

      default:
        throw new Error(`Action '${action.executedAction}' is unsupported on grid`);
    }

  }

  /**
   * Handles delete response
   * @param response Response
   */
  private _handleDeleteActionItemResponse(response: boolean): void {

    // Show message
    this._matSnackBar.open(
      response ? 'Usunięto poprawnie' : 'Błąd podczas usuwania',
      'Formularz',
      {duration: 2000},
    );

    // If success go back to action list
    if (response) {
      this.activeGridState = EGridState.ActionList;
    }

  }

  /**
   * Handles add item response
   * @param response Response
   */
  private _handleAddActionItemResponse(response: boolean): void {

    // Show message
    this._matSnackBar.open(
      response ? 'Dodano poprawnie' : 'Błąd podczas dodawania',
      'Formularz',
      {duration: 2000},
    );

    // If success go back to action list
    if (response) {
      this.activeGridState = EGridState.ActionList;
    }

  }

  /**
   * Handles edit item response
   * @param response Response
   */
  private _handleEditActionItemResponse(response: boolean): void {

    // Show message
    this._matSnackBar.open(
      response ? 'Edytowano poprawnie' : 'Błąd podczas edycji',
      'Formularz',
      {duration: 2000},
    );

    // If success go back to action list
    if (response) {
      this.activeGridState = EGridState.ActionList;
    }

  }

}
