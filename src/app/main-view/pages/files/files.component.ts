import {Component, OnInit} from '@angular/core';
import {Observable, of} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {ActivatedRoute} from '@angular/router';
import {FilesService} from '../../services/files/files.service';
import {IFileInformation} from '../../services/files/files.service.models';
import {catchError, filter, map, switchMap, tap} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RenameFileModalComponent} from './rename-file-modal/rename-file-modal.component';

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  // Component data
  public menuItem$: Observable<IMenuItem>;
  public files$: Observable<IFileInformation[]>;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _filesService: FilesService,
    private readonly _matDialog: MatDialog,
    private readonly _matSnackBar: MatSnackBar,
  ) {
  }

  ngOnInit() {

    // Getting menu item data
    this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;

    // Getting all files
    this.files$ = this.menuItem$.pipe(
      map(v => v.controllerSource),
      switchMap(controllerSource => this._filesService.getFilesInformation(controllerSource))
    );

  }

  /**
   * Executes when delete button was clicked
   * @param file
   */
  public onFileDeleteButtonClick(file: IFileInformation): void {

    // Showing message
    this._matSnackBar.open( // showing message
      'Trwa usuwanie pliku',
      'Pliki',
      {duration: 2000},
    );

    // Sending request
    this._filesService.deleteFile(file.id).pipe(
      catchError(() => of(false))
    ).subscribe(isSuccess => {

      // Showing message and delete file
      if (isSuccess) {
        this._matSnackBar.open(
          'Usunięto plik poprawnie',
          'Pliki',
          {duration: 2000},
        );
        return;
      }

      // Show error message
      this._matSnackBar.open( // showing message
        'Błąd usuwania pliku',
        'Pliki',
        {duration: 2000},
      );

    });

  }

  /**
   * Executes when rename button was clicked
   * @param file
   */
  public onFileRenameButtonClick(file: IFileInformation): void {

    // Creating dialog
    const dialogRef = this._matDialog.open(RenameFileModalComponent, {
      width: '360px',
      data: file,
    });

    // On file name change
    dialogRef.afterClosed().pipe(
      filter(v => v !== '' && file.name !== v),
      tap(v => this._matSnackBar.open( // showing message
        'Trwa zmienianie nazwy...',
        'Pliki',
        {duration: 2000},
      )),
      switchMap(newFileName => this._filesService.renameFile(file.id, newFileName).pipe(
        map(success => ({success, newFileName})),
      )),
      catchError(e => of({success: false, newFileName: file.name}))
    ).subscribe(response => {

      // If success
      if (response.success) {
        file.name = response.newFileName;
        this._matSnackBar.open(
          'Nazwa została zmieniona.',
          'Pliki',
          {duration: 2000},
        );
        return;
      }

      // Error
      this._matSnackBar.open(
        'Błąd zmiany nazwy pliku',
        'Pliki',
        {duration: 2000},
      );

    });

  }

}
