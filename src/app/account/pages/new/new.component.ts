import {Component, OnInit} from '@angular/core';
import {IFormControlConfiguration} from '../../../shared/dynamic-form/dynamic-form.component.models';
import {FormGroup} from '@angular/forms';

@Component({
    templateUrl: './new.component.html',
    styleUrls: ['./new.component.scss']
})
export class NewComponent implements OnInit {

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
                    maxLength: 20,
                },
            },
            {
                name: 'email',
                displayName: 'Email',
                value: '',
                type: 'email',
                validator: {
                    isRequired: true,
                    minLength: 3,
                    maxLength: 20,
                },
            },
            {
                name: 'password',
                displayName: 'Hasło',
                value: '',
                type: 'text',
                validator: {
                    isRequired: true,
                    minLength: 3,
                    maxLength: 20,
                },
            },
            {
                name: 'repeatedPassword',
                displayName: 'Powtórz hasło',
                value: '',
                type: 'text',
                validator: {
                    isRequired: true,
                    minLength: 3,
                    maxLength: 20,
                },
            },
        ];
    }

    /**
     * On form submit
     */
    public onFormSubmitHandler(data: FormGroup): void {
        console.log(data);
    }

}
