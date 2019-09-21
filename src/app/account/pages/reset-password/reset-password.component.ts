import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {ResetPasswordService} from '../../services/reset-password/reset-password.service';

@Component({
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.scss']
})
export class ResetPasswordComponent implements OnInit {

  // Component data
  public formSubmitModeEnabled: boolean;
  public controlsConfiguration: Observable<IFormControlConfiguration[]>;

  constructor(
    private readonly _resetPasswordService: ResetPasswordService,
    private readonly _matSnackBar: MatSnackBar,
  ) {
  }

  /**
   * NgOnInit
   */
  ngOnInit() {

    // Getting configuration
    this.controlsConfiguration = this._resetPasswordService.getConfiguration();

  }

  /**
   * On form submit
   */
  public onFormSubmitHandler(data: FormGroup): void {

    // Setting loading to true
    this.formSubmitModeEnabled = true;

    // Submitting data
    this._resetPasswordService.resetPassword(data.getRawValue()).pipe(
      finalize(() => this.formSubmitModeEnabled = false)
    ).subscribe(
      response => this._matSnackBar.open(
        response ? 'Zresetowano poprawnie. Sprawdź email.' : 'Błąd podczas resetowania',
        'Formularz',
        {duration: 2000},
      ),
      error => this._matSnackBar.open(
        'Błąd podczas resetowania',
        'Formularz',
        {duration: 2000},
      ),
    );

  }

}
