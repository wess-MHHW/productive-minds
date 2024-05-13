import { Component, inject } from '@angular/core';
import { TaskService } from '../../../../services/task/task.service';
import { formatDate } from '../../../../utils/functions/format-date';
import { AuthService } from '../../../../services/authentication/auth.service';
import { BehaviorSubject, catchError, exhaustMap, map, of, take } from 'rxjs';
import { Task } from '../../../../interfaces/task';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.css',
})
export class CalendarComponent {
  monthSubject: BehaviorSubject<number> = new BehaviorSubject(
    new Date().getMonth()
  );
  show = false;
  selected: string | Date = '';
  month: number = new Date().getMonth();
  year: number = new Date().getFullYear();
  tasks: Record<string, Array<Task>> = {};
  message = '';
  task: TaskService = inject(TaskService);
  auth: AuthService = inject(AuthService);
  today!: Date;
  dates: Array<string | Date> = [];

  constructor() {
    this.today = new Date();
    this.today.setHours(0, 0, 0, 0);
  }

  onClose(value: boolean) {
    this.show = false;
  }

  select(value: string | Date, i: number) {
    if (i > 6) {
      this.show = true;
      this.selected = value;
    }
  }
  add() {
    let month = this.monthSubject.getValue();
    if (month > 10) {
      this.monthSubject.next(0);
      this.year++;
    } else {
      this.monthSubject.next(++month);
    }
  }
  sub() {
    let month = this.monthSubject.getValue();
    if (month < 1) {
      this.monthSubject.next(11);
      this.year--;
    } else {
      this.monthSubject.next(--month);
    }
  }
  generateRange(month: number, year: number) {
    const firstDay = new Date(year, month, 1);
    let startDate = new Date(firstDay.getTime());
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() - 1);
    }

    const dates: Date[] = [];

    for (let i = 0; i < 42; i++) {
      const currentDate = new Date(
        startDate.getTime() + i * 24 * 60 * 60 * 1000
      );
      dates.push(currentDate);
    }

    const endDay = dates[dates.length - 1].getDate();
    this.dates = [...this.getWeekDays(), ...dates];
  }

  format() {
    new Date(this.year, this.month, 1).toLocaleDateString('en-US', {
      month: 'long',
    });
  }

  getdate() {
    return new Date(this.year, this.month).toLocaleString('en-US', {
      month: 'long',
    });
  }
  getWeekDays() {
    var baseDate = new Date(Date.UTC(2017, 0, 2)); // just a Monday
    var weekDays = [];
    for (let i = 0; i < 7; i++) {
      weekDays.push(baseDate.toLocaleDateString('en-US', { weekday: 'long' }));
      baseDate.setDate(baseDate.getDate() + 1);
    }
    return weekDays;
  }

  formatoo(element: string | Date): string {
    if (typeof element === typeof new Date()) {
      return new Date(element).getDate().toString();
    } else {
      return element.toString();
    }
  }

  getTasks() {
    let start = new Date(this.dates[7]);
    let end = new Date(this.dates[this.dates.length - 1]);

    let interval = `[${formatDate(start)},${formatDate(end)}]`;

    this.auth.user
      .pipe(
        take(1),
        exhaustMap((user) => {
          return this.task.getTasks(`?date[in]=${interval}&sort=-date`).pipe(
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
              let result: Record<string, Array<Task>> = {};
              data.data.tasks.forEach((element: Task) => {
                let date = new Date(element.date);
                date.setHours(0, 0, 0, 0);
                if (result.hasOwnProperty(date.toString())) {
                  result[date.toString()].push(element);
                } else {
                  result[date.toString()] = [element];
                }
              });

              return result;
            }),
            catchError((error) => {
              return of(error);
            })
          );
        })
      )
      .subscribe({
        next: (data) => {
          if (data.error) {
            if (data.status === 0) {
              this.message =
                'Sorry, the server is busy. Please try again later"';
            } else {
              this.message = data.error.message;
              let timeout = setTimeout((): void => {
                this.message = '';
                clearTimeout(timeout);
              }, 5000);
            }
          } else {
            this.tasks = data;
          }
        },
      });
  }

  ngOnInit() {
    this.monthSubject.subscribe((value) => {
      this.month = value;
      this.generateRange(this.month, this.year);
      this.getTasks();
    });
  }
  getLength(key: string, index: number) {
    let result;
    if (this.tasks.hasOwnProperty(key.toString())) {
      result = ' [] ' + this.tasks[key.toString()].length;
    } else {
      result = '';
    }
    return result;
  }
}
