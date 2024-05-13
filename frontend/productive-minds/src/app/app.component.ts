import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from './services/authentication/auth.service';
import { UserService } from './services/user/user.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
})
export class AppComponent implements OnInit {
  auth: AuthService = inject(AuthService);
  user: UserService = inject(UserService);
  title = 'productive-minds';

  ngOnInit(): void {
    this.auth.autoLogin();
  }
}
