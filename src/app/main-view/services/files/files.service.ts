import {Injectable} from '@angular/core';
import {interval, Observable, of} from 'rxjs';
import {IFileInformation, IFilesData, IFilesUploadDefinition} from './files.service.models';
import {delay, filter, map, takeWhile} from 'rxjs/operators';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {HttpClient} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  // Test data
  private _files: IFileInformation[] = new Array(2000).fill(0).map((v, i) => ({
    id: i,
    name: `Testowy plik ${i}`,
    deletable: Math.random() < 0.9
  }));

  constructor(
    private readonly _httpClient: HttpClient,
  ) {
  }

  /**
   * Gets definition for files
   * @param controllerSource Controller url
   */
  public getFilesUploadDefinition(controllerSource: string): Observable<IFilesUploadDefinition> {

    return of({
      allowUpload: true,
      acceptFileTypes: [],
      maxFileSize: Infinity
    }).pipe(delay(Math.random() * 5_000));

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

    if (!paginator) {
      paginator = {
        currentPage: 1,
        currentPageSize: 20,
        totalPages: 2000 / 20,
        totalRecords: 2000,
        pageSizeOptions: [20, 50, 100]
      };
    }

    return of(this._files).pipe(
      delay(Math.random() * 5_000),
      map(k => k
        .filter(v => v.name.toLowerCase().indexOf(fileName.toLowerCase()) >= 0)
        .slice(
          (paginator.currentPage - 1) * paginator.currentPageSize,
          (paginator.currentPage - 1) * paginator.currentPageSize + paginator.currentPageSize
        )
      ),
      map(values => Object.assign(paginator, {values}))
    );

  }

  /**
   * Renames file
   * @param controllerSource Controller url
   * @param id File id
   * @param name File new name
   */
  public renameFile(controllerSource: string, id: number, name: string): Observable<boolean> {

    this._files.find(v => v.id === id).name = name;
    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Deletes file
   * @param controllerSource Controller url
   * @param id File id to delete
   */
  public deleteFile(controllerSource: string, id: number): Observable<boolean> {

    this._files = this._files.filter(v => v.id !== id);
    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Downloads file
   * @param controllerSource Controller url
   * @param id File id to download
   */
  public downloadFile(controllerSource: string, id: number): Observable<any> {

    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Uploads file
   * @param controllerSource Controller source
   * @param file File to upload
   * @return Boolean true or false depending on success or number for progress
   */
  public uploadFile(controllerSource: string, file: File): Observable<boolean | number> {

    return interval(100).pipe(
      takeWhile(v => v <= 100),
      filter(v => v % 10 === 0),
      map(v => v === 100 ? true : v)
    );

    // return this._httpClient.post<boolean>(controllerSource, file, {
    //   reportProgress: true, observe: 'events', headers: new HttpHeaders(
    //     {'Content-Type': 'multipart/form-data'},
    //   )
    // }).pipe(
    //   map((event) => { // Depending on event type
    //
    //     switch (event.type) {
    //
    //       case HttpEventType.UploadProgress:
    //         return Math.round(100 * event.loaded / event.total);
    //
    //       case HttpEventType.Response:
    //         return event.body;
    //
    //       default:
    //         throw new Error();
    //
    //     }
    //
    //   }),
    //   catchError(err => of(false))
    // );

  }

}
