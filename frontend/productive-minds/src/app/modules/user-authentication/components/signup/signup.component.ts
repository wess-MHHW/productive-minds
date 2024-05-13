import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { passwordsValidator } from '../../../../utils/functions/confirm-password-validator';
import { AuthService } from '../../../../services/authentication/auth.service';
import { take } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { formatResponse } from '../../../../utils/functions/format-response';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css',
})
export class SignupComponent implements OnInit, OnDestroy {
  router: Router = inject(Router);
  auth: AuthService = inject(AuthService);
  type1: 'text' | 'password' = 'password';
  type2: 'text' | 'password' = 'password';
  show: boolean = false;
  form!: FormGroup;
  message: string = '';
  loading: boolean = false;

  toggle1() {
    this.type1 = this.type1 === 'text' ? 'password' : 'text';
  }

  toggle2() {
    this.type2 = this.type2 === 'text' ? 'password' : 'text';
  }

  login() {
    this.router.navigate(['login']);
  }
  onSubmit() {
    this.show = true;
    if (this.form.valid) {
      this.loading = true;
      const user: User = {
        name: this.form.value.name,
        email: this.form.value.email,
        occupation: this.form.value.occupation,
        password: this.form.value.password.original,
      };
      this.auth
        .sinup(user)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.auth.user.next(
              formatResponse(data['data']['user'], data['token'], 0, 0)
            );
            localStorage.setItem(
              'user',
              JSON.stringify(
                formatResponse(data['data']['user'], data['token'])
              )
            );
            this.auth.autoLogout(data['token']);
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
      name: new FormControl('', [Validators.required]),
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
      ]),
      occupation: new FormControl('', [Validators.required]),
      password: new FormGroup(
        {
          original: new FormControl('', [
            Validators.required,
            Validators.minLength(8),
          ]),
          confirm: new FormControl('', [Validators.required]),
        },
        passwordsValidator
      ),
    });
  }

  ngOnDestroy(): void {}
}
