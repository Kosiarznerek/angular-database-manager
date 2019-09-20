import {Injectable} from '@angular/core';
import {IMenuItem} from './navigation.service.models';
import {HttpClient} from '@angular/common/http';
import {Observable, of} from 'rxjs';
import {environment} from '../../../../environments/environment';
import {catchError} from 'rxjs/operators';

@Injectable({
    providedIn: 'root',
})
export class NavigationService {

    constructor(
        private _httpClient: HttpClient,
    ) {
    }

    /**
     * Gets menu
     */
    public get menuItems(): Observable<IMenuItem[]> {
        return this._httpClient
            .get<IMenuItem[]>(`${environment.serverOrigin}/user-menu`)
            .pipe(
                catchError(() => of([])),
            );
    }

}
