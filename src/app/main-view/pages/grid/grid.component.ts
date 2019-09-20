import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {Observable} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {GridService} from '../../services/grid/grid.service';
import {IGridData, IGridDefinition} from '../../services/grid/grid.service.models';
import {IActionInfo, IActionListItem} from '../../../shared/action-list/action-list.component.models';
import {
    IFilteredOptionData,
    IFormControlConfiguration,
    IFormControlUpdate
} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {finalize, map, shareReplay, switchMap, take, tap} from 'rxjs/operators';
import {EGridState} from './grid.component.models';
import {FormGroup} from '@angular/forms';
import {MatSnackBar} from '@angular/material/snack-bar';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';

@Component({
    templateUrl: './grid.component.html',
    styleUrls: ['./grid.component.scss'],
})
export class GridComponent implements OnInit {

    public menuItem$: Observable<IMenuItem>;

    // Grid data
    public activeGridState: EGridState;
    public gridData$: Observable<IGridData>;
    public gridDefinition$: Observable<IGridDefinition>;

    // Paginator state
    public paginatorState: IPaginatorState;

    // Active form controls configuration
    public activeFormSubmitModeEnabled: boolean; // force to show spinner on form
    public activeFormControlsConfiguration: IFormControlConfiguration[];

    // Simple getters
    public EGridState = EGridState;

    constructor(
        private _activatedRoute: ActivatedRoute,
        private _gridService: GridService,
        private  _matSnackBar: MatSnackBar,
    ) {
    }

    ngOnInit() {
        this.activeGridState = EGridState.ActionList;
        this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;
        this.gridDefinition$ = this.menuItem$.pipe(
            switchMap(({controllerSource}) => this._gridService.getDefinition(controllerSource))
        ).pipe(shareReplay());
        this._loadGridData();
    }

    /**
     * Load grid data
     */
    private _loadGridData(): void {
        this.gridData$ = this.menuItem$.pipe(
            switchMap(({controllerSource}) => this._gridService.getData(
                controllerSource,
                this.paginatorState,
            ).pipe(
                tap(({totalPages, currentPage, currentPageSize, pageSizeOptions, totalRecords}) => this.paginatorState = {
                    totalPages,
                    currentPage,
                    currentPageSize,
                    totalRecords,
                    pageSizeOptions,
                }),
            )),
        ).pipe(shareReplay());
    }

    /**
     * Executes when paginator state has been change
     */
    public onPaginatorStateChangeHandler(state: IPaginatorState): void {
        this.paginatorState = state;
        this._loadGridData();
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
                    take(1),
                    switchMap(({controllerSource}) => this._gridService.getEditItemConfiguration(
                        controllerSource,
                        action.actionListItem.id,
                    )),
                ).subscribe(v => this.activeFormControlsConfiguration = v);
                this.activeGridState = EGridState.EditForm;
                break;

            // Deleting item
            case 'delete':
                this._onDeleteHandler(action.actionListItem);
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
     * Executes when delete button has been clicked
     */
    private _onDeleteHandler(itemData: IActionListItem): void {
        this.menuItem$.pipe(
            take(1),
            map(v => v.controllerSource),
            switchMap(controllerSource =>
                this._gridService.removeItem(controllerSource, itemData.id),
            ),
        ).subscribe(
            response => {
                this._matSnackBar.open(
                    response ? 'Usunięto poprawnie' : 'Błąd podczas usuwania',
                    'Formularz',
                    {duration: 2000},
                );
                if (!response) {
                    return;
                }
                this.activeGridState = EGridState.ActionList;
                this._loadGridData();
            },
            error => this._matSnackBar.open(
                'Błąd podczas usuwania',
                'Formularz',
                {duration: 2000},
            ),
        );
    }

    /**
     * Executes when add form has been submitted
     */
    public onAddSubmitHandler(formData: FormGroup): void {
        // Setting loading to true
        this.activeFormSubmitModeEnabled = true;

        // Submitting form
        this.menuItem$.pipe(
            take(1),
            switchMap(({controllerSource}) => this._gridService.addItem(
                controllerSource,
                formData.getRawValue(),
            )),
            finalize(() => {
                this.activeFormSubmitModeEnabled = false;
            }),
        ).subscribe(
            response => {
                this._matSnackBar.open(
                    response ? 'Dodano poprawnie' : 'Błąd podczas dodawania',
                    'Formularz',
                    {duration: 2000},
                );
                if (!response) {
                    return;
                }
                this.activeGridState = EGridState.ActionList;
                this._loadGridData();
            },
            error => this._matSnackBar.open(
                'Błąd podczas dodawania',
                'Formularz',
                {duration: 2000},
            ),
        );
    }

    /**
     * Executes when edit form has been submitted
     */
    public onEditSubmitHandler(formData: FormGroup): void {
        // Setting loading to true
        this.activeFormSubmitModeEnabled = true;

        // Submitting form
        this.menuItem$.pipe(
            take(1),
            switchMap(({controllerSource}) => this._gridService.editItem(
                controllerSource,
                formData.getRawValue(),
            )),
            finalize(() => {
                this.activeFormSubmitModeEnabled = false;
            }),
        ).subscribe(
            response => {
                this._matSnackBar.open(
                    response ? 'Edytowano poprawnie' : 'Błąd podczas edycji',
                    'Formularz',
                    {duration: 2000},
                );
                if (!response) {
                    return;
                }
                this.activeGridState = EGridState.ActionList;
                this._loadGridData();
            },
            error => this._matSnackBar.open(
                'Błąd podczas edycji',
                'Formularz',
                {duration: 2000},
            ),
        );
    }

    /**
     * Function used to provide data for autocompletes
     */
    public filteredOptionDataProvider = (
        searchPhrase: string, control: IFormControlConfiguration, currentFormValue: object,
    ): Observable<IFilteredOptionData[]> => {
        return this._gridService.getFilteredOptionData(
            searchPhrase,
            control,
            currentFormValue,
        );
    };

    /**
     * Executes when control value on form has changed
     */
    public formControlChangeHandler = (control: IFormControlConfiguration): Observable<IFormControlUpdate[]> => {
        return this.menuItem$.pipe(
            take(1),
            switchMap(({controllerSource}) => this._gridService.getPropertyOnChangeResponse(
                controllerSource,
                control,
            )),
        );
    };

}
