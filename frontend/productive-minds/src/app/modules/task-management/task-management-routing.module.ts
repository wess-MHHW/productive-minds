import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { SettingsComponent } from './components/settings/settings.component';
import { TodayComponent } from './components/today/today.component';
import { SearchComponent } from './components/search/search.component';
import { UpcomingComponent } from './components/upcoming/upcoming.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { StickyWallComponent } from './components/sticky-wall/sticky-wall.component';
import { FilterComponent } from './components/filter/filter.component';
import { TodayResolveGuard } from '../../utils/guards/today-resolve.guard';
import { TomorrowResolveGuard } from '../../utils/guards/tomorrow-resolve.guard';
import { WeekResolveGuard } from '../../utils/guards/week-resolve.guard';
import { NatureResolveGuard } from '../../utils/guards/category-resolve.guard';
import { StickyWallResolveQuard } from '../../utils/guards/sticky-wall-guard';

const routes: Routes = [
  {
    path: '',
    children: [
      {
        path: '',
        redirectTo: 'today',
        pathMatch: 'full',
      },
      {
        path: 'search',
        component: SearchComponent,
      },
      {
        path: 'today',
        component: TodayComponent,
        resolve: { data: TodayResolveGuard },
      },
      {
        path: 'upcoming',
        component: UpcomingComponent,
        resolve: {
          today: TodayResolveGuard,
          tomorrow: TomorrowResolveGuard,
          week: WeekResolveGuard,
        },
      },
      {
        path: 'calendar',
        component: CalendarComponent,
      },
      {
        path: 'sticky-wall',
        component: StickyWallComponent,
        resolve: {
          data: StickyWallResolveQuard,
        },
      },
      {
        path: ':nature/:title',
        component: FilterComponent,
        resolve: {
          data: NatureResolveGuard,
        },
      },

      {
        path: 'settings',
        component: SettingsComponent,
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TaskManagementRoutingModule {}
