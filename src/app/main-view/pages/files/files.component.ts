import {Component, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, from, merge, Observable, of, Subject} from 'rxjs';
import {IMenuItem} from '../../services/navigation/navigation.service.models';
import {ActivatedRoute} from '@angular/router';
import {FilesService} from '../../services/files/files.service';
import {v4 as uuid} from 'uuid';
import {
  IFileInformation as IBasicFileInformation,
  IFilesData as IBasicFilesData,
  IFilesUploadDefinition
} from '../../services/files/files.service.models';
import {
  catchError,
  debounceTime,
  distinctUntilChanged,
  filter,
  finalize,
  map,
  mergeMap,
  shareReplay,
  switchMap,
  takeUntil,
  tap
} from 'rxjs/operators';
import {MatDialog, MatSnackBar} from '@angular/material';
import {RenameFileModalComponent} from './rename-file-modal/rename-file-modal.component';
import {IPaginatorState} from '../../../shared/paginator/paginator.component.models';
import {FormControl} from '@angular/forms';
import {saveAs} from 'file-saver';

// Extending file information
interface IFileInformation extends IBasicFileInformation {
  isDeleted?: boolean;
}

// Extending files data
interface IFilesData extends IBasicFilesData {
  values: IFileInformation[];
}

// Currently uploaded file interface
interface ICurrentlyUploadedFile extends File {
  progress: number | boolean;
  id: string;
}

// Currently downloaded file interface
interface ICurrentlyDownloaded extends IFileInformation {
  progress: number | boolean;
  data: Blob;
}

@Component({
  selector: 'app-files',
  templateUrl: './files.component.html',
  styleUrls: ['./files.component.scss']
})
export class FilesComponent implements OnInit, OnDestroy {

  // Component data
  private readonly ngOnDestroy$: Subject<void>;
  public menuItem$: Observable<IMenuItem>;
  private readonly _onPaginatorStateChanges: BehaviorSubject<IPaginatorState>;
  public filesData$: Observable<IFilesData>;
  public fileNameControl: FormControl;
  public showLoadingBackdrop: boolean;

  // Upload file
  public uploadFilesDefinition$: Observable<IFilesUploadDefinition>;
  public readonly currentlyUploadedFiles: Array<ICurrentlyUploadedFile>;
  private readonly _fileWasUploaded$: Subject<void>;

  // Download file
  public readonly currentlyDownloadedFiles: Array<ICurrentlyDownloaded>;

  constructor(
    private readonly _activatedRoute: ActivatedRoute,
    private readonly _filesService: FilesService,
    private readonly _matDialog: MatDialog,
    private readonly _matSnackBar: MatSnackBar,
  ) {

    // Create ng on destroy
    this.ngOnDestroy$ = new Subject<void>();

    // Set paginator change chandler
    this._onPaginatorStateChanges = new BehaviorSubject(null);

    // Set array of files
    this.currentlyUploadedFiles = [];

    // Set file was uploaded event
    this._fileWasUploaded$ = new Subject<void>();

    // Set currently downloaded
    this.currentlyDownloadedFiles = [];

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
      ),
      this._fileWasUploaded$.pipe( // file was uploaded
        switchMap(paginatorState => getFilesData$)
      )
    ).pipe(shareReplay());

    // Getting upload files definition
    this.uploadFilesDefinition$ = this.menuItem$.pipe(
      map(v => v.controllerSource),
      switchMap(controllerSource => this._filesService.getFilesUploadDefinition(controllerSource)),
      shareReplay()
    );

  }

  ngOnDestroy(): void {
    this.ngOnDestroy$.next();
  }

  /**
   * Check if array contains files
   * @param data Data to check
   */
  public hasFiles(data: IFileInformation[]): boolean {
    return data
      .filter(v => !v.isDeleted)
      .length > 0;
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
    this.menuItem$.pipe(
      map(v => v.controllerSource),
      switchMap(controllerSource => this._filesService.deleteFile(controllerSource, file.id).pipe(
        catchError(() => of(false))
      ))
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
      switchMap(newFileName => this.menuItem$.pipe(
        map(v => v.controllerSource),
        switchMap(controllerSource => this._filesService.renameFile(controllerSource, file.id, newFileName).pipe(
          map(success => ({success, newFileName}))
        ))
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

    // Add to download list
    this.currentlyDownloadedFiles.unshift(Object.assign({}, file, {progress: 0, data: null}));

    // Show message
    this._matSnackBar.open(`Rozpoczęto pobieranie ${file.name}`, 'Pliki', {duration: 2000});

    // Download file
    this.menuItem$.pipe(
      map(v => v.controllerSource),
      switchMap(controllerSource => this._filesService.downloadFile(controllerSource, file.id)),
      takeUntil(this.ngOnDestroy$)
    ).subscribe(value => {

      // Find file
      const fileToUpdate = this.currentlyDownloadedFiles.find(v => v.id === file.id);

      // Update data
      if (typeof value === 'number') {
        fileToUpdate.progress = value;
      } else if (value !== null) {
        this._matSnackBar.open(`Zakończono pobieranie ${file.name}`, 'Pliki', {duration: 2000});
        fileToUpdate.progress = true;
        fileToUpdate.data = value;
      } else {
        this._matSnackBar.open(`Niepowodzenie pobierania ${file.name}`, 'Pliki', {duration: 2000});
        fileToUpdate.progress = false;
      }

    });

  }

  /**
   * Executes when downloaded file need to be save on computer
   * @param file Downloaded file
   */
  public onFileSaveButtonClick(file: ICurrentlyDownloaded): void {

    saveAs(file.data, file.name);

  }

  /**
   * Executes when value has changed
   * @param input File input
   */
  public onFileControlValueChange(input: EventTarget): void {

    // Extract files
    const {files} = input as HTMLInputElement;

    // No files
    if (files.length === 0) {
      this._matSnackBar.open('Nie wybrano pliku', 'Pliki', {duration: 2000});
      return;
    }

    // Filter files by acceptFileTypes
    const filteredFilesByType$: Observable<File> = this.uploadFilesDefinition$.pipe(
      mergeMap(({acceptFileTypes}) => from(files).pipe(
        filter(({name}) => (/[.]/.exec(name)) // filter files by allowed extensions
          ? acceptFileTypes.includes(/[^.]+$/.exec(name)[0]) ||
          acceptFileTypes.length === 0
          : false
        )
      ))
    );

    // Then filter by max file
    const filesToUpload$: Observable<File> = this.uploadFilesDefinition$.pipe(
      mergeMap(({maxFileSize}) => filteredFilesByType$.pipe(
        filter(({size}) => typeof maxFileSize === 'number' ? size < maxFileSize : true)
      ))
    );

    // Upload files
    this.menuItem$.pipe(
      switchMap(({controllerSource}) => filesToUpload$.pipe(
        map(fileToUpload => Object.assign(fileToUpload, {id: uuid()})), // add id
        mergeMap(fileToUpload => this._filesService.uploadFile(controllerSource, fileToUpload).pipe(
          map(progress => Object.assign(fileToUpload, {progress}))
        ))
      )),
      takeUntil(this.ngOnDestroy$)
    ).subscribe(fileStatus => {

      // File is in array -> update
      if (this.currentlyUploadedFiles.find(f => f.id === fileStatus.id)) {
        const index = this.currentlyUploadedFiles.findIndex(f => f.id === fileStatus.id);
        this.currentlyUploadedFiles[index].progress = fileStatus.progress;

        // If success
        if (fileStatus.progress === true) {
          this._fileWasUploaded$.next();
        }

      } else { // Add
        this.currentlyUploadedFiles.unshift(fileStatus);
      }

    });

  }

}
