import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UserAuthenticationRoutingModule } from './user-authentication-routing.module';
import { WelcomeComponent } from './components/welcome/welcome.component';
import { LoginComponent } from './components/login/login.component';
import { SignupComponent } from './components/signup/signup.component';
import { ResetComponent } from './components/reset/reset.component';
import { UserAuthenticationComponent } from './components/user-authentication/user-authentication.component';
import { ForgotComponent } from './components/forgot/forgot.component';
import { ReactiveFormsModule } from '@angular/forms';
import { SharedModule } from '../shared-module/shared-module.module';

@NgModule({
  declarations: [
    WelcomeComponent,
    LoginComponent,
    SignupComponent,
    ResetComponent,
    UserAuthenticationComponent,
    ForgotComponent,
  ],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    UserAuthenticationRoutingModule,
    SharedModule,
  ],
  exports: [UserAuthenticationComponent],
})
export class UserAuthenticationModule {}
