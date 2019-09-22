import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';
import {Observable} from 'rxjs';
import {MatSnackBar} from '@angular/material/snack-bar';
import {finalize} from 'rxjs/operators';
import {Router} from '@angular/router';
import {SignInService} from '../../services/sign-in/sign-in.service';
import {AuthenticationGuard} from '../../../authentication/authentication.guard';

@Component({
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

  // Component data
  public formSubmitModeEnabled: boolean;
  public controlsConfiguration: Observable<IFormControlConfiguration[]>;

  constructor(
    private readonly _signInService: SignInService,
    private readonly _matSnackBar: MatSnackBar,
    private readonly _router: Router
  ) {
  }

  /**
   * NgOnInit
   */
  ngOnInit() {

    // Getting configuration
    this.controlsConfiguration = this._signInService.getConfiguration();

  }

  /**
   * On form submit
   */
  public onFormSubmitHandler(data: FormGroup): void {

    // Setting loading to true
    this.formSubmitModeEnabled = true;

    // Submitting data
    this._signInService.signIn(data.getRawValue()).pipe(
      finalize(() => this.formSubmitModeEnabled = false)
    ).subscribe(token => {

        // No token -> show error
        if (!token) {
          this._showSignInErrorSnackBar();
          return;
        }

        // Otherwise save token and navigate to main
        AuthenticationGuard.AuthenticationToken = token;
        this._router.navigate(['main']);

      },
      () => this._showSignInErrorSnackBar(),
    );

  }

  /**
   * Shows sign in error
   */
  private _showSignInErrorSnackBar(): void {

    this._matSnackBar.open(
      'Błąd podczas logowania',
      'Formularz',
      {duration: 2000},
    );

  }

}
