import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {AuthenticationGuard} from './authentication/authentication.guard';

const routes: Routes = [
  {path: '', pathMatch: 'full', redirectTo: 'account'},
  {path: 'account', loadChildren: () => import('./account/account.module').then(m => m.AccountModule)},
  {
    path: 'main',
    canActivate: [AuthenticationGuard],
    loadChildren: () => import('./main-view/main-view.module').then(m => m.MainViewModule)
  },
  {path: '**', pathMatch: 'full', redirectTo: 'account'}
];

@NgModule({
  exports: [RouterModule],
  imports: [RouterModule.forRoot(routes)]
})
export class AppRoutingModule {
}
