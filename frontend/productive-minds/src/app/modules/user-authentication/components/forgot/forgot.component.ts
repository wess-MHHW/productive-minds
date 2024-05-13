import { Component, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/authentication/auth.service';
import { take } from 'rxjs';

@Component({
  selector: 'app-forgot',
  templateUrl: './forgot.component.html',
  styleUrl: './forgot.component.css',
})
export class ForgotComponent implements OnInit {
  router: Router = inject(Router);
  disabled: boolean = false;
  step: number = 1;
  show: boolean = false;
  form1!: FormGroup;
  form2!: FormGroup;
  message: string = '';
  auth: AuthService = inject(AuthService);
  loading: boolean = false;

  onSubmit() {
    this.show = true;

    if (this.form1.valid) {
      this.loading = true;
      this.auth
        .forgotPassword(this.form1.value.email)
        .pipe(take(1))
        .subscribe({
          next: (data: any) => {
            this.step = 2;
            this.show = false;
            this.disabled = true;
            this.loading = false;
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
              }, 4000);
            }
          },
        });
    }
  }

  reset() {
    this.show = true;
    if (this.form2.valid) {
      this.loading = true;
      this.auth
        .checkForgotPassword(this.form2.value.code)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.loading = false;
            this.router.navigate(['reset-password', this.form2.value.code]);
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
    this.form1 = new FormGroup({
      email: new FormControl('', [
        Validators.required,
        Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/),
      ]),
    });

    this.form2 = new FormGroup({
      code: new FormControl('', [Validators.required]),
    });
  }
}
