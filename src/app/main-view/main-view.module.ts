import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ReactiveFormsModule} from '@angular/forms';
import {AngularMaterialModule} from './angular-material.module';

import {MainViewRoutingModule} from './main-view-routing.module';
import {NavigationComponent} from './pages/navigation/navigation.component';
import {GridComponent} from './pages/grid/grid.component';
import {DetailsComponent} from './pages/details/details.component';
import {FilesComponent} from './pages/files/files.component';
import {RenameFileModalComponent} from './pages/files/rename-file-modal/rename-file-modal.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {ControllerTypeErrorComponent} from './pages/controller-type-error/controller-type-error.component';
import {SharedModule} from '../shared/shared.module';

@NgModule({
  declarations: [
    NavigationComponent,
    DashboardComponent,
    GridComponent,
    DetailsComponent,
    FilesComponent,
    RenameFileModalComponent,
    ControllerTypeErrorComponent,
  ],
  entryComponents: [
    GridComponent,
    DetailsComponent,
    FilesComponent,
    RenameFileModalComponent,
    ControllerTypeErrorComponent,
  ],
  imports: [
    CommonModule,
    MainViewRoutingModule,
    AngularMaterialModule,
    SharedModule,
    ReactiveFormsModule,
  ],
})
export class MainViewModule {
}
