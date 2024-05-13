import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TaskManagementRoutingModule } from './task-management-routing.module';
import { TaskManagementComponent } from './components/task-management/task-management.component';
import { MenuComponent } from './components/menu/menu.component';
import { SettingsComponent } from './components/settings/settings.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';
import { TodayComponent } from './components/today/today.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { SearchComponent } from './components/search/search.component';

import { CalendarComponent } from './components/calendar/calendar.component';
import { StickyWallComponent } from './components/sticky-wall/sticky-wall.component';
import { FilterComponent } from './components/filter/filter.component';
import { TaskComponent } from './components/task/task.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { FormatDatePipe } from './pipes/format-date.pipe';
import { TestPipe } from './pipes/test.pipe';
import { DetailsComponent } from './components/details/details.component';
import { StickyComponent } from './components/sticky/sticky.component';
import { BaseStickyComponent } from './components/base-sticky/base-sticky.component';

@NgModule({
  declarations: [
    TaskManagementComponent,
    MenuComponent,
    SettingsComponent,
    TodayComponent,
    UpcomingComponent,
    SearchComponent,
    CalendarComponent,
    StickyWallComponent,
    FilterComponent,
    TaskComponent,
    DialogComponent,
    FormatDatePipe,
    TestPipe,
    DetailsComponent,
    StickyComponent,
    BaseStickyComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TaskManagementRoutingModule,
    SharedModule,
  ],
  exports: [TaskManagementComponent],
})
export class TaskManagementModule {}
