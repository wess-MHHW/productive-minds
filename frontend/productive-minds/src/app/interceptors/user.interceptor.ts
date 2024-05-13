import { HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from '../services/authentication/auth.service';
import { inject } from '@angular/core';
import { exhaustMap, take } from 'rxjs';

export const userInterceptor: HttpInterceptorFn = (req, next) => {
  let auth: AuthService = inject(AuthService);
  return auth.user.pipe(
    take(1),
    exhaustMap((user) => {
      if (!user) {
        return next(req);
      }
      const modified = req.clone({
        setHeaders: { Authorization: `Bearer ${user.token}` },
      });
      return next(modified);
    })
  );
};
