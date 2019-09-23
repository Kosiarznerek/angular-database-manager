import {Component, OnInit} from '@angular/core';
import {BehaviorSubject, merge, Observable, of} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {ActivatedRoute} from '@angular/router';
import {FilesService} from '../../services/files/files.service';
import {IFileInformation as IBasicFileInformation, IFilesData as IBasicFilesData} from '../../services/files/files.service.models';
import {catchError, debounceTime, distinctUntilChanged, filter, finalize, map, shareReplay, switchMap, tap} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RenameFileModalComponent} from './rename-file-modal/rename-file-modal.component';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {FormControl} from '@angular/forms';

// Extending file information
interface IFileInformation extends IBasicFileInformation {
  isDeleted?: boolean;
}

// Extending files data
interface IFilesData extends IBasicFilesData {
  values: IFileInformation[];
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit {

  // Component data
  public menuItem$: Observable<IMenuItem>;
  private readonly _onPaginatorStateChanges: BehaviorSubject<IPaginatorState>;
  public filesData$: Observable<IFilesData>;
  public fileNameControl: FormControl;
  public showLoadingBackdrop: boolean;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _filesService: FilesService,
    private readonly _matDialog: MatDialog,
    private readonly _matSnackBar: MatSnackBar,
  ) {

    // Set paginator change chandler
    this._onPaginatorStateChanges = new BehaviorSubject(null);

  }

  ngOnInit() {

    // Getting menu item data
    this.menuItem$ = this._activatedRoute.data as Observable<IMenuItem>;

    // Creating file name control
    this.fileNameControl = new FormControl('');

    // Creating get files data observable
    const getFilesData$: Observable<IFilesData> = this.menuItem$.pipe(
      tap(() => this.showLoadingBackdrop = true),
      map(v => v.controllerSource),
      switchMap(controllerSource => this._filesService.getFilesInformation(
        controllerSource,
        this._onPaginatorStateChanges.value,
        this.fileNameControl.value
      ).pipe(finalize(() => this.showLoadingBackdrop = false))),
    );

    // Setting files data observable
    this.filesData$ = merge(
      this._onPaginatorStateChanges.pipe( // page change
        switchMap(paginatorState => getFilesData$),
      ),
      this.fileNameControl.valueChanges.pipe( // filter change
        debounceTime(400),
        distinctUntilChanged(),
        switchMap(search => getFilesData$),
      )
    ).pipe(shareReplay());

  }

  /**
   * Executes when page has changed
   * @param event New paginator state
   */
  public onPaginatorStateChange(event: IPaginatorState): void {

    this._onPaginatorStateChanges.next(event);

  }

  /**
   * Executes when delete button was clicked
   * @param file File to delete
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
        file.isDeleted = true;
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
   * @param file File to rename
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

  /**
   * Executes when download button on file was clicked
   * @param file File to download
   */
  public onFileDownloadButtonClick(file: IFileInformation): void {

  }

}
