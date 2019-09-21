import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {NavigationComponent} from './pages/navigation/navigation.component';

const routes: Routes = [
  {
    path: '', component: NavigationComponent, children: []
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class MainViewRoutingModule {
}
