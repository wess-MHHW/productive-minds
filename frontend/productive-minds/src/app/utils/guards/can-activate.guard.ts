import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/authentication/auth.service';
import { inject } from '@angular/core';
import { map, take } from 'rxjs';

export const canActivateGuard: CanActivateFn = (route, state) => {
  const auth: AuthService = inject(AuthService);
  const router: Router = inject(Router);
  return auth.user.pipe(
    take(1),
    map((user) => {
      if (user) {
        return true;
      } else {
        return router.createUrlTree(['login']);
      }
    })
  );
};
