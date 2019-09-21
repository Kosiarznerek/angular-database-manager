import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {HttpClient} from '@angular/common/http';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets configuration for controls
   */
  public getConfiguration(): Observable<IFormControlConfiguration[]> {

    return this._httpClient
      .get<IFormControlConfiguration[]>(`${environment.serverOrigin}/authentication/0/reset-password`)
      .pipe(
        catchError(() => of(null)),
      );

  }

  /**
   * Resets user password
   * @param item Reset password model
   */
  public resetPassword(item: object): Observable<boolean> {

    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/authentication/0/reset-password`,
      item,
    ).pipe(
      catchError(() => of(false)),
    );

  }

}
