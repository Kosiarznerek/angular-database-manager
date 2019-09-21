import {Injectable} from '@angular/core';
import {IFormControlConfiguration} from '../dynamic-form/dynamic-form.component.models';
import {Observable, of} from 'rxjs';
import {environment} from '../../../environments/environment';
import {HttpClient} from '@angular/common/http';
import {IFilteredOptionData, IFormControlUpdate} from './dynamic-form-data.service.models';

@Injectable({
  providedIn: 'root'
})
export class DynamicFormDataService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
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
  public getPropertyOnChangeResponse(control: IFormControlConfiguration): Observable<IFormControlUpdate[]> {

    return typeof control.onChange === 'string'
      ? this._httpClient.post<IFormControlUpdate[]>(
        `${environment.serverOrigin}/${control.onChange}`,
        this._cloneFormControlConfiguration(control),
      )
      : of([]);

  }

  /**
   * Clones form control configuration
   * To avoid converting circular structure to JSON
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
