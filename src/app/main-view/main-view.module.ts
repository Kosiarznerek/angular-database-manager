import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {AngularMaterialModule} from './angular-material.module';

import {MainViewRoutingModule} from './main-view-routing.module';
import {NavigationComponent} from './pages/navigation/navigation.component';
import {GridComponent} from './pages/grid/grid.component';
import {DetailsComponent} from './pages/details/details.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ControllerTypeErrorComponent} from './pages/controller-type-error/controller-type-error.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    NavigationComponent,
    DashboardComponent,
    GridComponent,
    DetailsComponent,
    ControllerTypeErrorComponent,
  ],
  entryComponents: [
    GridComponent,
    DetailsComponent,
    ControllerTypeErrorComponent,
  ],
  imports: [
    CommonModule,
    MainViewRoutingModule,
    AngularMaterialModule,
    SharedModule,
  ],
})
export class MainViewModule {
}
