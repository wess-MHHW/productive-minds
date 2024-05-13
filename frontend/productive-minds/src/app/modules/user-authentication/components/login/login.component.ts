import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/authentication/auth.service';
import { take } from 'rxjs';
import { formatResponse } from '../../../../utils/functions/format-response';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrl: './login.component.css',
})
export class LoginComponent implements OnInit {
  router: Router = inject(Router);
  show: boolean = false;
  form!: FormGroup;
  message: string = '';
  auth: AuthService = inject(AuthService);
  loading: boolean = false;

  type: 'text' | 'password' = 'password';
  toggle() {
    this.type = this.type === 'text' ? 'password' : 'text';
  }
  signup() {
    this.router.navigate(['signup']);
  }
  reset() {
    this.router.navigate(['forgot-password']);
  }
  onSubmit() {
    this.show = true;
    if (this.form.valid) {
      this.loading = true;
      this.auth
        .login(this.form.value.email, this.form.value.password)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.auth.user.next(
              formatResponse(
                data['data']['user'],
                data['token'],
                data['data']['today'],
                data['data']['upcoming']
              )
            );
            this.auth.autoLogout(data['token']);
            localStorage.setItem(
              'user',
              JSON.stringify(
                formatResponse(
                  data['data']['user'],
                  data['token'],
                  data['data']['today'],
                  data['data']['upcoming']
                )
              )
            );
            this.loading = false;
            this.router.navigate(['dashboard']);
          },
          error: (error) => {
            this.loading = false;
            if (error.status === 0) {
              this.message =
                'Sorry, the server is busy. Please try again later"';
            } else {
              this.message = error.error.message;
              let timeout = setTimeout((): void => {
                this.message = '';
                clearTimeout(timeout);
              }, 5000);
            }
          },
        });
    }
  }

  ngOnInit(): void {
    this.form = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
      ]),
      password: new FormControl('', [Validators.required]),
    });
  }
}
