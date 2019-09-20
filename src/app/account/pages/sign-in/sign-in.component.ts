import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';
import {Router} from '@angular/router';

@Component({
    templateUrl: './sign-in.component.html',
    styleUrls: ['./sign-in.component.scss']
})
export class SignInComponent implements OnInit {

    // Component data
    public controlsConfiguration: IFormControlConfiguration[];

    constructor(
        private _router: Router
    ) {
    }

    /**
     * NgOnInit
     */
    ngOnInit() {
        this.controlsConfiguration = [
            {
                name: 'login',
                displayName: 'Login',
                value: 'asd',
                type: 'text',
                validator: {
                    isRequired: true,
                    minLength: 3,
                    maxLength: 20
                }
            },
            {
                name: 'password',
                displayName: 'Hasło',
                value: 'asd',
                type: 'text',
                validator: {
                    isRequired: true,
                    minLength: 3,
                    maxLength: 20
                }
            }
        ];
    }

    /**
     * On form submit
     */
    public onFormSubmitHandler(data: FormGroup): void {
        console.log(data);
        this._router.navigate(['main']);
    }

}
