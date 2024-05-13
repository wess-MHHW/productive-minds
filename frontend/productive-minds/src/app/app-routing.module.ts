import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { UserAuthenticationComponent } from './modules/user-authentication/components/user-authentication/user-authentication.component';
import { TaskManagementComponent } from './modules/task-management/components/task-management/task-management.component';
import { canActivateGuard } from './utils/guards/can-activate.guard';
import { NotFoundComponent } from './modules/not-found/components/not-found/not-found.component';
import { TaskManagementResolveGuard } from './utils/guards/task-management-resolve.guard';

const routes: Routes = [
  {
    path: '',
    component: UserAuthenticationComponent,

    loadChildren: () =>
      import('./modules/user-authentication/user-authentication.module').then(
        (m) => m.UserAuthenticationModule
      ),
  },
  {
    path: 'dashboard',
    component: TaskManagementComponent,
    resolve: {
      data: TaskManagementResolveGuard,
    },
    canActivate: [canActivateGuard],
    loadChildren: () =>
      import('./modules/task-management/task-management-routing.module').then(
        (m) => m.TaskManagementRoutingModule
      ),
  },
  {
    path: '**',
    component: NotFoundComponent,
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
