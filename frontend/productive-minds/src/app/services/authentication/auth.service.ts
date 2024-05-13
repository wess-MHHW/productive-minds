import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { User } from '../../interfaces/user';
import { BehaviorSubject, Observable } from 'rxjs';
import { jwtDecode } from 'jwt-decode';
import { Router } from '@angular/router';
import { UserService } from '../user/user.service';

export class AuthService {
  router: Router = inject(Router);
  http: HttpClient = inject(HttpClient);
  userService: UserService = inject(UserService);
  user: BehaviorSubject<User | null> = new BehaviorSubject<User | null>(null);

  sinup(user: User): Observable<any> {
    return this.http.post(
      'http://localhost:3000/authentication/sign-up',
      user,
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  login(email: string, password: string): Observable<any> {
    return this.http.post(
      'http://localhost:3000/authentication/log-in',
      { email, password },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  forgotPassword(email: string) {
    return this.http.post(
      'http://localhost:3000/authentication/forgot-password',
      { email },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  checkForgotPassword(code: string) {
    return this.http.get(
      'http://localhost:3000/authentication/forgot-password/' + code
    );
  }

  resetPassword(code: string, password: string) {
    return this.http.patch(
      'http://localhost:3000/authentication/reset-password/' + code,
      { password },
      { headers: { 'Content-Type': 'application/json' } }
    );
  }

  logout() {
    this.user.next(null);
    this.router.navigate(['login']);
    localStorage.removeItem('user');
  }

  autoLogout(token: any) {
    const decoded = jwtDecode(token);

    let timeout = setTimeout(() => {
      this.logout();
      clearTimeout(timeout);
    }, (decoded.exp! - decoded.iat!) * 1000);
  }

  autoLogin() {
    if (!localStorage.getItem('user')) {
      return;
    }

    let value = JSON.parse(localStorage.getItem('user')!);

    const decoded = jwtDecode(value['token']);

    if ((decoded.exp! - decoded.iat!) * 1000) {
      this.user.next(value);
      this.router.navigate(['dashboard']);
      localStorage.setItem('user', JSON.stringify(value));
      this.autoLogout(value['token']);
    }
  }
}
