import {Component, EventEmitter, Input, Output} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {
    IFormControlConfiguration as IFormControlBasicConfiguration,
    IFilteredOptionData,
    TFilteredOptionDataProvider, FormControlChangeHandler, IFormControlUpdate,
} from './dynamic-form.component.models';
import {debounceTime, distinctUntilChanged, filter, map, startWith, switchMap, tap} from 'rxjs/operators';
import {Observable} from 'rxjs';

// Extending IFormControlBasicConfiguration
interface IFormControlConfiguration extends IFormControlBasicConfiguration {
    filteredData$?: Observable<IFilteredOptionData[]>; // used for autocomplete
}

@Component({
    selector: 'app-dynamic-form',
    templateUrl: './dynamic-form.component.html',
    styleUrls: ['./dynamic-form.component.scss'],
})
export class DynamicFormComponent {

    // Component data
    @Input() submitButtonText?: string;
    @Input() autocomplete?: 'on' | 'off';
    @Input() formControlChangeHandler: FormControlChangeHandler;
    @Output() formSubmit: EventEmitter<FormGroup>;

    public formData: FormGroup;

    constructor() {
        this.formSubmit = new EventEmitter();
    }

    /**
     * SubmitModeEnabled
     */
    private _submitModeEnabled: boolean;
    @Input()
    get submitModeEnabled(): boolean {
        return this._submitModeEnabled;
    }

    set submitModeEnabled(submitEnabled: boolean) {
        // Update
        this._submitModeEnabled = submitEnabled;

        // Depending on value disable all controls or prevent default
        (this.controlsConfiguration || []).forEach(c =>
            this.formData.controls[c.name][c.isDisabled || submitEnabled ? 'disable' : 'enable'](),
        );
    }

    /**
     * ControlsConfiguration
     */
    private _controlsConfiguration: IFormControlConfiguration[];
    @Input()
    get controlsConfiguration(): IFormControlConfiguration[] {
        return this._controlsConfiguration;
    }

    set controlsConfiguration(configuration: IFormControlConfiguration[]) {

        // Empty data
        if (!Array.isArray(configuration)) {
            this._controlsConfiguration = null;
            return;
        }

        // Clone configuration
        configuration = configuration.map(v => Object.assign({}, v));

        // Creating controls based on configuration
        const controls: { [p: string]: AbstractControl } = {};
        configuration.forEach(control =>
            controls[control.name] = new FormControl({
                value: control.value,
                disabled: control.isDisabled,
            }, this._getControlsValidators(control)),
        );

        // Init form data
        this.formData = new FormGroup(controls);

        // Save
        this._controlsConfiguration = configuration;

        // Add change handler foreach form control
        configuration.forEach(v => this.formData.get(v.name).valueChanges.pipe(
            filter(k => typeof this.formControlChangeHandler === 'function'),
            filter(k => {
                if (v.type === 'chips' || v.type === 'autocomplete') {
                    return k instanceof Object;
                } else {
                    return true;
                }
            }),
            distinctUntilChanged(),
            map(k => v),
            switchMap(control => this.formControlChangeHandler(control).pipe(
                tap(updates => updates.forEach(up => this._applyFormControlUpdate(up))),
            )),
        ).subscribe());

        // Reassigning filtered data provider
        this._reassignFilteredOptionDataProvider();

    }

    /**
     * Applies form control update
     * @param update Update to apply
     */
    private _applyFormControlUpdate(update: IFormControlUpdate): void {

        // Getting control
        const control: AbstractControl = this.formData.get(update.name);
        if (!control) {
            return;
        }

        // Apply update
        control.setValue(update.value);

    }

    /**
     * FilteredOptionDataProvider
     */
    private _filteredOptionDataProvider: TFilteredOptionDataProvider;
    @Input()
    public set filteredOptionDataProvider(provider: TFilteredOptionDataProvider) {
        this._filteredOptionDataProvider = provider;
        this._reassignFilteredOptionDataProvider();
    }

    /**
     * Assigns filtered data provider
     */
    private _reassignFilteredOptionDataProvider(): void {

        // No controls or no provider
        if (!Array.isArray(this._controlsConfiguration) || typeof this._filteredOptionDataProvider !== 'function') {
            return;
        }

        // Assign valueChange to autocomplete and chips
        this._controlsConfiguration
            .filter(v => v.type === 'autocomplete' || v.type === 'chips')
            .forEach(control => control.filteredData$ = this.formData.get(control.name).valueChanges.pipe(
                startWith(''),
                debounceTime(400),
                map(v => typeof v === 'string' ? v : ''),
                switchMap(searchPhrase => this._filteredOptionDataProvider(
                    searchPhrase,
                    control,
                    this.formData.value,
                )),
            ));

    }

    /**
     * Gets validators for control
     */
    private _getControlsValidators(control: IFormControlConfiguration): ValidatorFn[] {
        // Getting validators and type
        const {type, validator} = control;

        // Creating validators array
        const validators: ValidatorFn[] = [];

        // Adding validators
        if (validator.isRequired) {
            validators.push(Validators.required);
        }
        if (typeof validator.minLength === 'number') {
            validators.push(Validators.minLength(validator.minLength));
        }
        if (typeof validator.maxLength === 'number') {
            validators.push(Validators.maxLength(validator.maxLength));
        }
        if (type === 'email') {
            validators.push(Validators.email);
        }

        // Return statement
        return validators;
    }

    /**
     * Executes on form submit
     */
    public onFormSubmitHandler(): void {
        this.formSubmit.emit(this.formData);
    }

    /**
     * Function used in view to extract display names for mat-autocomplete
     */
    public matAutocompleteDisplayWith(data?: IFilteredOptionData): string | null {
        return data ? data.displayName : null;
    }

}
