import { ResolveFn } from '@angular/router';
import { inject } from '@angular/core';
import { TaskService } from '../../services/task/task.service';
import { catchError, exhaustMap, map, of, take } from 'rxjs';
import { AuthService } from '../../services/authentication/auth.service';

export const NatureResolveGuard: ResolveFn<any> = (route, state) => {
  const task: TaskService = inject(TaskService);
  const auth: AuthService = inject(AuthService);
  let nature = '';
  let title = route.params['title'].toLowerCase();

  if (route.params['nature'] === 'categories') {
    nature = 'category';
  } else if (route.params['nature'] === 'tags') {
    nature = 'tag';
  }

  return auth.user.pipe(
    take(1),
    exhaustMap((user) => {
      return task.getTasks(`?${nature}=${title}&sort=-date`).pipe(
        map((data) => {
          data.data.tasks = data.data.tasks.map((task: any) => {
            task.category = {
              title: task.category,
              color: user?.categories?.find(
                (item) =>
                  item.title.toLowerCase() === task.category.toLowerCase()
              )!.color,
            };
            task.tags = task.tags.map((tag: any) => {
              return {
                title: tag,
                color: user?.tags?.find(
                  (item) => item.title.toLowerCase() === tag.toLowerCase()
                )!.color,
              };
            });

            return task;
          });

          return data;
        }),
        catchError((error) => {
          return of(error);
        })
      );
    })
  );
};
