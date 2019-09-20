import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './forgot-password.component.html',
    styleUrls: ['./forgot-password.component.scss']
})
export class ForgotPasswordComponent implements OnInit {

    // Component data
    public controlsConfiguration: IFormControlConfiguration[];

    constructor() {
    }

    /**
     * NgOnInit
     */
    ngOnInit() {
        this.controlsConfiguration = [
            {
                name: 'login',
                displayName: 'Login',
                value: '',
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
                value: '',
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
    }

}
