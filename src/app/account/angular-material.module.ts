import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {MatButtonModule} from '@angular/material/button';
import {MatCardModule} from '@angular/material/card';
import {MatSnackBarModule} from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ],
  exports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatSnackBarModule
  ]
})
export class AngularMaterialModule {
}
