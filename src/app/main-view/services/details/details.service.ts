import {Injectable} from '@angular/core';
import {IDetail} from './details.service.models';
import {Observable, of} from 'rxjs';
import {catchError} from 'rxjs/operators';
import {environment} from '../../../../environments/environment';
import {HttpClient} from '@angular/common/http';

@Injectable({
    providedIn: 'root',
})
export class DetailsService {

    constructor(
        private _httpClient: HttpClient,
    ) {
    }

    /**
     * Gets base-details data
     */
    public getDetails(controllerSource: string): Observable<IDetail[]> {

        return this._httpClient
            .get<IDetail[]>(`${environment.serverOrigin}/${controllerSource}`)
            .pipe(
                catchError(() => of([])),
            );

    }

}
