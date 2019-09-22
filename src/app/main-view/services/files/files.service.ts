import {Injectable} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IFileInformation} from './files.service.models';
import {delay} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class FilesService {

  constructor() {
  }

  /**
   * Gets information about all files
   * @param controllerSource
   */
  public getFilesInformation(controllerSource: string): Observable<IFileInformation[]> {

    return of(new Array(20).fill(0).map((v, i) => ({
      id: i,
      name: `Testowy plik ${i}`,
      deletable: Math.random() < 0.9
    }))).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Renames file
   * @param id File id
   * @param name File new name
   */
  public renameFile(id: number, name: string): Observable<boolean> {

    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

  /**
   * Deletes file
   * @param id File id to delete
   */
  public deleteFile(id: number): Observable<boolean> {

    return of(true).pipe(
      delay(Math.random() * 5_000)
    );

  }

}
