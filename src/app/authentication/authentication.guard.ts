import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable} from 'rxjs';
import {IAuthenticationToken} from '../account/services/sign-in/sign-in.service.models';

@Injectable({
  providedIn: 'root'
})
export class AuthenticationGuard implements CanActivate {

  constructor(
    private readonly _router: Router,
  ) {
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

    // Not authenticated
    if (!AuthenticationGuard.AuthenticationToken) {
      this._router.navigate(['account']);
      return false;
    }

    // Authenticated
    return true;

  }

  /**
   * Sets user authentication token
   * @param token Token to set
   */
  public static set AuthenticationToken(token: IAuthenticationToken) {

    // Save token data
    if (token) {
      sessionStorage.setItem('accessToken', token.accessToken);
      sessionStorage.setItem('expireDate', token.expireDate);
      return;
    }

    // Otherwise clear token
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('expireDate');

  }

  /**
   * Gets user's authentication token
   */
  public static get AuthenticationToken(): IAuthenticationToken {

    // Getting token data
    const accessToken = sessionStorage.getItem('accessToken');
    const expireDate = sessionStorage.getItem('expireDate');

    // No token data
    if (!accessToken || !expireDate) {
      return null;
    }

    // Return token
    return {accessToken, expireDate};

  }

}
