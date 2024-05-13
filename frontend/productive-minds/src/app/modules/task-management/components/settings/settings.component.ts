import { Component, OnDestroy, OnInit, ViewChild, inject } from '@angular/core';
import { AuthService } from '../../../../services/authentication/auth.service';
import { Subscription, map, take } from 'rxjs';
import { User } from '../../../../interfaces/user';
import { FormControl, FormGroup, NgForm, Validators } from '@angular/forms';
import { passwordsValidator } from '../../../../utils/functions/confirm-password-validator';
import { UserService } from '../../../../services/user/user.service';
import { formatResponse } from '../../../../utils/functions/format-response';
import { Category } from '../../../../interfaces/category';
import { Tag } from '../../../../interfaces/tag';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrl: './settings.component.css',
})
export class SettingsComponent implements OnInit, OnDestroy {
  @ViewChild('#Personal') personal: any;
  auth: AuthService = inject(AuthService);
  user: UserService = inject(UserService);
  type: Array<string> = ['password', 'password', 'password', 'password'];
  placeholders!: User;
  sub!: Subscription;
  colors: Array<string> = [
    '#ff6b6b',
    '#da77f2',
    '#9775fa',
    '#5c7cfa',
    '#66d9e8',
    '#8ce99a',
    '#ffd43b',
    '#ff922b',
  ];

  details!: FormGroup;
  show: Array<boolean> = [false, false];
  messages: Array<string> = ['', '', '', ''];
  loading: boolean = false;
  current!: User | null;

  toggle(index: number) {
    this.type[index] = this.type[index] === 'text' ? 'password' : 'text';
  }

  changeColor(nature: string, title: string, color: string) {
    if (nature === 'category') {
      let item = this.placeholders.categories?.find(
        (item) => item.title === title
      );
      item!.color = color;
    } else {
      let item = this.placeholders.tags?.find((item) => item.title === title);
      item!.color = color;
    }
  }

  updateUser() {
    this.show[0] = true;
    let body: Record<string, string> = {};
    if (this.details.valid) {
      this.loading = true;
      for (let [key, value] of Object.entries(this.details.value)) {
        let v: any = value;
        if (key === 'password') {
          if (v.original.length !== 0) {
            body['password'] = v.original;
          }
        } else {
          if (v.trim().length !== 0) {
            body[key] = v;
          }
        }
      }

      this.user
        .updateUser(body)
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
            this.show[0] = false;
            this.details.reset();
          },
          error: (error) => {
            this.loading = false;
            if (error.status === 0) {
              this.messages[0] =
                'Sorry, the server is busy. Please try again later"';
            } else {
              this.messages[0] = error.error.message;
              let timeout = setTimeout((): void => {
                this.messages[0] = '';
                clearTimeout(timeout);
              }, 5000);
            }
          },
        });
    }
  }

  ngOnInit(): void {
    this.sub = this.auth.user.subscribe({
      next: (data) => {
        this.placeholders = structuredClone(data!);
        this.current = structuredClone(data!);
      },
    });

    this.details = new FormGroup({
      name: new FormControl(''),
      email: new FormControl(
        '',
        Validators.pattern(/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/)
      ),
      occupation: new FormControl(''),
      password: new FormGroup(
        {
          original: new FormControl('', [Validators.minLength(8)]),
          confirm: new FormControl(''),
        },
        passwordsValidator
      ),
      currentPassword: new FormControl('', Validators.required),
    });
  }

  deleteAccount(form: NgForm) {
    this.loading = true;
    this.show[1] = true;
    if (form.valid) {
      this.user
        .deleteUser(form.value.password)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.loading = false;
            this.auth.logout();
          },
          error: (error) => {
            this.loading = false;
            if (error.status === 0) {
              this.messages[3] =
                'Sorry, the server is busy. Please try again later"';
            } else {
              this.messages[3] = error.error.message;
              let timeout = setTimeout((): void => {
                this.messages[3] = '';
                clearTimeout(timeout);
              }, 5000);
            }
          },
        });
    }
  }

  deleteCategories() {
    this.user
      .deleteCategories()
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[1] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[1] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[1] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  deleteCategory(title: string) {
    this.loading = true;
    this.user
      .deleteCategory(title)
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[1] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[1] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[1] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  deleteTags() {
    this.loading = true;
    this.user
      .deleteTags()
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[2] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[2] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[2] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  deleteTag(title: string) {
    this.loading = true;
    this.user
      .deleteTag(title)
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[2] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[2] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[2] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  saveTags(tags: NgForm) {
    this.loading = true;
    let result: Array<Tag> = [];
    for (let tag of this.placeholders.tags!) {
      if (
        Object.keys(tags.value).includes(tag.title) &&
        tags.value[tag.title].trim().length !== 0
      ) {
        result.push({
          title: tags.value[tag.title].trim(),
          color: tag.color,
          count: tag.count,
        });
      } else {
        result.push(tag);
      }
    }
    this.user
      .updateTags(result)
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[2] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[2] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[2] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  saveCategories(categories: NgForm) {
    this.loading = true;
    let result: Array<Category> = [];
    for (let category of this.placeholders.categories!) {
      if (
        Object.keys(categories.value).includes(category.title) &&
        categories.value[category.title].trim().length !== 0
      ) {
        result.push({
          title: categories.value[category.title].trim(),
          color: category.color,
          count: category.count,
        });
      } else {
        result.push(category);
      }
    }

    this.user
      .updateCategories(result)
      .pipe(
        take(1),
        map((data) =>
          formatResponse(
            data.data.user,
            this.auth.user.getValue()?.token!,
            data.data.today,
            data.data.upcoming
          )
        )
      )
      .subscribe({
        next: (user) => {
          localStorage.setItem('user', JSON.stringify(user));
          this.loading = false;
          this.auth.user.next(user);
        },
        error: (error) => {
          this.loading = false;
          if (error.status === 0) {
            this.messages[1] =
              'Sorry, the server is busy. Please try again later"';
          } else {
            this.messages[1] = error.error.message;
            let timeout = setTimeout((): void => {
              this.messages[1] = '';
              clearTimeout(timeout);
            }, 5000);
          }
        },
      });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
  }
}
