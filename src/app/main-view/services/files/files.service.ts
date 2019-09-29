import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IFilesData, IFilesUploadDefinition} from './files.service.models';
import {catchError, filter, map} from 'rxjs/operators';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {HttpClient, HttpEventType} from '@angular/common/http';
import {environment} from '../../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets definition for files
   * @param controllerSource Controller url
   */
  public getFilesUploadDefinition(controllerSource: string): Observable<IFilesUploadDefinition> {

    return this._httpClient
      .get<IFilesUploadDefinition>(`${environment.serverOrigin}/${controllerSource}/getFilesUploadDefinition`)
      .pipe(
        catchError(() => of(null)),
      );

  }

  /**
   * Gets information about all files
   * @param controllerSource Controller url
   * @param paginator Paginator state
   * @param fileName File name filter
   */
  public getFilesInformation(
    controllerSource: string, paginator?: IPaginatorState, fileName: string = ''
  ): Observable<IFilesData> {

    return this._httpClient.post<IFilesData>(
      `${environment.serverOrigin}/${controllerSource}/getFilesInformation`,
      paginator,
      {
        params: {
          searchPhrase: fileName
        }
      }
    );

  }

  /**
   * Renames file
   * @param controllerSource Controller url
   * @param id File id
   * @param name File new name
   */
  public renameFile(controllerSource: string, id: number, name: string): Observable<boolean> {

    return this._httpClient.put<boolean>(
      `${environment.serverOrigin}/${controllerSource}/renameFile/${id}`,
      null,
      {
        params: {name}
      }
    ).pipe(
      catchError(() => of(false))
    );

  }

  /**
   * Deletes file
   * @param controllerSource Controller url
   * @param id File id to delete
   */
  public deleteFile(controllerSource: string, id: number): Observable<boolean> {

    return this._httpClient.delete<boolean>(
      `${environment.serverOrigin}/${controllerSource}/deleteFile/${id}`,
    ).pipe(
      catchError(() => of(false))
    );

  }

  /**
   * Downloads file
   * @param controllerSource Controller url
   * @param id File id to download
   * @return File data or number for progress
   */
  public downloadFile(controllerSource: string, id: number): Observable<Blob | number> {

    return this._httpClient.get<Blob>(
      `${environment.serverOrigin}/${controllerSource}/downloadFile/${id}`,
      {reportProgress: true, observe: 'events', responseType: 'blob' as any}
    ).pipe(
      filter(({type}) =>
        type === HttpEventType.Sent ||
        type === HttpEventType.DownloadProgress ||
        type === HttpEventType.Response
      ),
      map(event => { // Depending on event type

        switch (event.type) {

          case HttpEventType.Sent:
            return 0;

          case HttpEventType.DownloadProgress:
            return Math.round(100 * event.loaded / event.total);

          case HttpEventType.Response:
            return event.body;

        }

      }),
      catchError(() => of(null))
    );

  }

  /**
   * Uploads file
   * @param controllerSource Controller source
   * @param file File to upload
   * @return Boolean true or false depending on success or number for progress
   */
  public uploadFile(controllerSource: string, file: File): Observable<boolean | number> {

    // Creating form data
    const formData = new FormData();
    formData.append('file', file);

    // Return request
    return this._httpClient.post<boolean>(
      `${environment.serverOrigin}/${controllerSource}/uploadFile`, formData, {
        reportProgress: true, observe: 'events',
      }).pipe(
      filter(({type}) =>
        type === HttpEventType.Sent ||
        type === HttpEventType.UploadProgress ||
        type === HttpEventType.Response
      ),
      map(event => { // Depending on event type

        switch (event.type) {

          case HttpEventType.Sent:
            return 0;

          case HttpEventType.UploadProgress:
            return Math.round(100 * event.loaded / event.total);

          case HttpEventType.Response:
            return event.body;

        }

      }),
      catchError(err => of(false))
    );

  }

}
