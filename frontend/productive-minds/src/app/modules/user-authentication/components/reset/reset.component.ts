import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { passwordsValidator } from '../../../../utils/functions/confirm-password-validator';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../../services/authentication/auth.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrl: './reset.component.css',
})
export class ResetComponent implements OnInit, OnDestroy {
  router: Router = inject(Router);
  type1: 'text' | 'password' = 'password';
  type2: 'text' | 'password' = 'password';
  show: boolean = false;
  form!: FormGroup;
  message: string = '';
  auth: AuthService = inject(AuthService);
  activated: ActivatedRoute = inject(ActivatedRoute);
  token: string = '';
  sub!: Subscription;
  loading: boolean = false;
  toggle1() {
    this.type1 = this.type1 === 'text' ? 'password' : 'text';
  }
  toggle2() {
    this.type2 = this.type2 === 'text' ? 'password' : 'text';
  }

  onSubmit() {
    this.show = true;
    if (this.form.valid) {
      this.loading = true;
      this.auth.resetPassword(this.token, this.form.value.original).subscribe({
        next: (data) => {
          this.loading = false;
          this.router.navigate(['login']);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later"';
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

  ngOnInit(): void {
    this.form = new FormGroup(
      {
        original: new FormControl('', [
          Validators.required,
          Validators.minLength(8),
        ]),
        confirm: new FormControl('', [Validators.required]),
      },
      passwordsValidator
    );

    this.sub = this.activated.params.subscribe((param) => {
      this.token = param['token'];
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
