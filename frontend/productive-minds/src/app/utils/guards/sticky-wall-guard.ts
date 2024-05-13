import { ResolveFn } from '@angular/router';
import { StickyWallService } from '../../services/sticky-wall/sticky-wall.service';
import { inject } from '@angular/core';
import { catchError, of } from 'rxjs';

export const StickyWallResolveQuard: ResolveFn<any> = (route, state) => {
  const sticky: StickyWallService = inject(StickyWallService);
  return sticky.getStickies().pipe(
    catchError((error) => {
      return of(error);
    })
  );
};
