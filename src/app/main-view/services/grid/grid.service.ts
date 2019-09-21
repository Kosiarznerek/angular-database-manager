import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {IActionListItem} from '../../../shared/action-list/action-list.component.models';
import {IFilteredOptionData, IFormControlUpdate,} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {IFormControlConfiguration, IGridData, IGridDefinition} from './grid.service.models';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class GridService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets data
   */
  public getData(controllerSource: string, paginatorState: IPaginatorState = {} as IPaginatorState): Observable<IGridData> {

    return this._httpClient.post<IGridData>(
      `${environment.serverOrigin}/${controllerSource}/getData`,
      paginatorState,
    ).pipe(
      catchError(() => of(null)),
    );

  }

  /**
   * Gets definition for grid
   */
  public getDefinition(controllerSource: string): Observable<IGridDefinition> {

    return this._httpClient
      .get<IGridDefinition>(`${environment.serverOrigin}/${controllerSource}/getDefinition`)
      .pipe(
        catchError(() => of(null)),
      );

  }

  /**
   * Gets controls configuration for data editing
   */
  public getEditItemConfiguration(
    controllerSource: string,
    itemId: IActionListItem['id'],
  ): Observable<IFormControlConfiguration[]> {

    return this._httpClient.get<IFormControlConfiguration[]>(
      `${environment.serverOrigin}/${controllerSource}/getEditItemConfiguration`,
      {params: {itemId: String(itemId)}},
    ).pipe(
      catchError(() => of([])),
    );

  }

  /**
   * Edits item
   */
  public editItem(controllerSource: string, item: object): Observable<boolean> {

    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/${controllerSource}/editItem`,
      item,
    ).pipe(
      catchError(() => of(false)),
    );

  }

  /**
   * Adds item
   */
  public addItem(controllerSource: string, item: object): Observable<boolean> {

    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/${controllerSource}/addItem`,
      item,
    ).pipe(
      catchError(() => of(false)),
    );

  }

  /**
   * Removes item
   */
  public removeItem(controllerSource: string, itemId: IActionListItem['id']): Observable<boolean> {

    return this._httpClient.delete<boolean>(
      `${environment.serverOrigin}/${controllerSource}/removeItem`,
      {params: {itemId: String(itemId)}},
    ).pipe(
      catchError(() => of(false)),
    );

  }

  /**
   * Gets data for autocompletes
   */
  public getFilteredOptionData(
    searchPhrase: string, control: IFormControlConfiguration, currentFormValue: object,
  ): Observable<IFilteredOptionData[]> {

    return this._httpClient.post<IFilteredOptionData[]>(
      `${environment.serverOrigin}/${control.onFilteredOptionData}`,
      {control: this._cloneFormControlConfiguration(control), currentFormValue},
      {params: {searchPhrase}},
    );

  }

  /**
   * Gets property on change response
   */
  public getPropertyOnChangeResponse(controllerSource: string, control: IFormControlConfiguration): Observable<IFormControlUpdate[]> {

    return typeof control.onChange === 'string'
      ? this._httpClient.post<IFormControlUpdate[]>(
        `${environment.serverOrigin}/${controllerSource}/${control.onChange}`,
        this._cloneFormControlConfiguration(control),
      )
      : of([]);

  }

  /**
   * Clones form control configuration
   * @param control Control to parse
   */
  private _cloneFormControlConfiguration(control: IFormControlConfiguration): IFormControlConfiguration {

    const {
      name, displayName, value,
      type, validator, onChange,
      isDisabled, onFilteredOptionData,
    } = control;

    return {
      name, displayName, value,
      type, validator, onChange,
      isDisabled, onFilteredOptionData,
    };

  }

}
