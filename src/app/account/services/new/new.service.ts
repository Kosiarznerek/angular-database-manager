import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class NewService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets configuration for controls
   */
  public getConfiguration(): Observable<IFormControlConfiguration[]> {

    return this._httpClient
      .get<IFormControlConfiguration[]>(`${environment.serverOrigin}/authentication/0/first-account`)
      .pipe(
        catchError(() => of(null)),
      );

  }

  /**
   * Creates account
   * @param item Account model
   */
  public createAccount(item: object): Observable<boolean> {

    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/authentication/0/first-account`,
      item,
    ).pipe(
      catchError(() => of(false)),
    );

  }

}
