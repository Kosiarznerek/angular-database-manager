import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';
import {NewService} from '../../services/new/new.service';
import {Observable} from 'rxjs';
import {finalize} from 'rxjs/operators';
import {MatSnackBar} from '@angular/material/snack-bar';

@Component({
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

  // Component data
  public formSubmitModeEnabled: boolean;
  public controlsConfiguration: Observable<IFormControlConfiguration[]>;

  constructor(
    private readonly _newService: NewService,
    private readonly _matSnackBar: MatSnackBar,
  ) {
  }

  /**
   * NgOnInit
   */
  ngOnInit() {

    // Getting configuration
    this.controlsConfiguration = this._newService.getConfiguration();

  }

  /**
   * On form submit
   */
  public onFormSubmitHandler(data: FormGroup): void {

    // Setting loading to true
    this.formSubmitModeEnabled = true;

    // Submitting data
    this._newService.createAccount(data.getRawValue()).pipe(
      finalize(() => this.formSubmitModeEnabled = false)
    ).subscribe(
      response => this._matSnackBar.open(
        response ? 'Dodano poprawnie' : 'Błąd podczas dodawania',
        'Formularz',
        {duration: 2000},
      ),
      error => this._matSnackBar.open(
        'Błąd podczas dodawania',
        'Formularz',
        {duration: 2000},
      ),
    );

  }

}
