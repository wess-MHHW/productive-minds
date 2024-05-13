import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { LoadingComponent } from './components/loading/loading.component';
import { SharedRoutingModule } from './shared-module-routing.module';
import { DropdownComponent } from './components/dropdown/dropdown.component';

@NgModule({
  declarations: [SnackbarComponent, LoadingComponent, DropdownComponent],
  imports: [CommonModule, SharedRoutingModule],
  exports: [SnackbarComponent, LoadingComponent, DropdownComponent],
})
export class SharedModule {}
