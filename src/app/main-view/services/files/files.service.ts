import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IFileInformation, IFilesData} from './files.service.models';
import {delay, map} from 'rxjs/operators';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';

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

  constructor() {
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

    console.log('getFilesInformation');

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
   * @param id File id
   * @param name File new name
   */
  public renameFile(id: number, name: string): Observable<boolean> {

    this._files.find(v => v.id === id).name = name;
    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Deletes file
   * @param id File id to delete
   */
  public deleteFile(id: number): Observable<boolean> {

    this._files = this._files.filter(v => v.id !== id);
    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Downloads file
   * @param id File id to download
   */
  public downloadFile(id: number): Observable<any> {

    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

}
