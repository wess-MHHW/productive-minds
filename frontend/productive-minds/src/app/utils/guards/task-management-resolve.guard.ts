import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { catchError, exhaustMap, map, of, take } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';
import { UserService } from '../../services/user/user.service';

export const TaskManagementResolveGuard: ResolveFn<any> = (route, state) => {
  const userService: UserService = inject(UserService);
  const auth: AuthService = inject(AuthService);

  return auth.user.pipe(
    take(1),
    exhaustMap((user) => {
      return userService.getUser().pipe(
        map((data) => {
          return data;
        }),
        catchError((error) => {
          return of(error);
        })
      );
    })
  );
};
