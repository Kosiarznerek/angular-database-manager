import {NgModule} from '@angular/core';
import {Route, RouterModule} from '@angular/router';

import {SignInComponent} from './pages/sign-in/sign-in.component';
import {NewComponent} from './pages/new/new.component';
import {ResetPasswordComponent} from './pages/reset-password/reset-password.component';

const routes: Route[] = [
  {path: '', component: SignInComponent},
  {path: 'new', component: NewComponent},
  {path: 'reset-password', component: ResetPasswordComponent}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forChild(routes)]
})
export class AccountRoutingModule {
}
