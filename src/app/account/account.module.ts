import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AccountRoutingModule} from './account-routing.module';
import {AngularMaterialModule} from './angular-material.module';

import {SignInComponent} from './pages/sign-in/sign-in.component';
import {NewComponent} from './pages/new/new.component';
import {ForgotPasswordComponent} from './pages/forgot-password/forgot-password.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
    declarations: [
        SignInComponent,
        NewComponent,
        ForgotPasswordComponent
    ],
    imports: [
        CommonModule,
        AccountRoutingModule,
        SharedModule,
        AngularMaterialModule
    ]
})
export class AccountModule {
}
