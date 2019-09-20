import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {DynamicFormComponent} from './dynamic-form/dynamic-form.component';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';
import {DetailsListComponent} from './details-list/details-list.component';
import {ActionListComponent} from './action-list/action-list.component';
import {InfoCardComponent} from './info-card/info-card.component';
import {
    MatAutocompleteEnforceSelectionDirective
} from './mat-autocomplete-enforce-selection/mat-autocomplete-enforce-selection.directive';
import {
    MatChipsFormControlComponent
} from './mat-chips-form-control/mat-chips-form-control.component';
import {PaginatorComponent} from './paginator/paginator.component';

@NgModule({
    declarations: [
        DynamicFormComponent,
        DetailsListComponent,
        ActionListComponent,
        InfoCardComponent,
        MatAutocompleteEnforceSelectionDirective,
        MatChipsFormControlComponent,
        PaginatorComponent,
    ],
    imports: [
        CommonModule,
        ReactiveFormsModule,
        AngularMaterialModule,
    ],
    exports: [
        DynamicFormComponent,
        DetailsListComponent,
        ActionListComponent,
        InfoCardComponent,
        PaginatorComponent,
    ],
})
export class SharedModule {
}
