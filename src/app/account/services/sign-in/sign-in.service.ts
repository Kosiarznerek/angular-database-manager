import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';
import {IAuthenticationToken} from './sign-in.service.models';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets configuration for controls
   */
  public getConfiguration(): Observable<IFormControlConfiguration[]> {

    return this._httpClient
      .get<IFormControlConfiguration[]>(`${environment.serverOrigin}/authentication/0`)
      .pipe(
        catchError(() => of(null)),
      );

  }

  /**
   * Signs in to application
   * @param item Sign in model
   */
  public signIn(item: object): Observable<IAuthenticationToken> {

    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/authentication/0`,
      item,
    ).pipe(
      catchError(() => of(null)),
    );

  }

}
