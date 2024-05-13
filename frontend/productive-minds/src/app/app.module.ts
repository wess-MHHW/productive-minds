import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { UserAuthenticationModule } from './modules/user-authentication/user-authentication.module';
import { AuthService } from './services/authentication/auth.service';
import {
  HttpClientModule,
  provideHttpClient,
  withInterceptors,
} from '@angular/common/http';
import { NotFoundModule } from './modules/not-found/not-found.module';
import { TaskManagementModule } from './modules/task-management/task-management.module';
import { userInterceptor } from './interceptors/user.interceptor';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    UserAuthenticationModule,
    TaskManagementModule,
    NotFoundModule,
    HttpClientModule,
  ],
  providers: [
    AuthService,
    provideHttpClient(withInterceptors([userInterceptor])),
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
