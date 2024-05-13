import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Task } from '../../../../interfaces/task';
import { TaskService } from '../../../../services/task/task.service';
import { isDateIn } from '../../../../utils/functions/is-date-in';
import { getWeekInterval } from '../../../../utils/functions/get-week';
import { updateUser } from '../../../../utils/functions/update-user';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/authentication/auth.service';

@Component({
  selector: 'app-upcoming',
  templateUrl: './upcoming.component.html',
  styleUrl: './upcoming.component.css',
})
export class UpcomingComponent implements OnInit {
  task: TaskService = inject(TaskService);
  auth: AuthService = inject(AuthService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  today: Array<Task> = [];
  tomorrow: Array<Task> = [];
  week: Array<Task> = [];
  message: string = '';
  show: boolean = false;
  title: 'edit' | 'create' = 'create';
  selected: Task | null = null;
  loading: boolean = false;
  current!: User | null;

  open() {
    this.title = 'create';
    this.show = true;
    this.selected = null;
  }

  close() {
    this.show = false;
  }

  edit(task: any) {
    this.title = 'edit';
    this.show = true;
    this.selected = task;
  }

  ngOnInit() {
    this.auth.user.subscribe({
      next: (data) => {
        this.current = data!;
      },
    });

    this.activatedRoute.data.subscribe({
      next: (data) => {
        let entries = Object.entries(data);

        entries.forEach((entry) => {
          switch (entry[0]) {
            case 'today':
              if (entry[1].error) {
                if (entry[1].status === 0) {
                  this.message =
                    'Sorry, the server is busy. Please try again later"';
                } else {
                  this.message = entry[1].error.message;
                  let timeout = setTimeout((): void => {
                    this.message = '';
                    clearTimeout(timeout);
                  }, 5000);
                }
              } else {
                this.today = entry[1].data.tasks;
              }
              break;
            case 'tomorrow':
              if (entry[1].error) {
                if (entry[1].status === 0) {
                  this.message =
                    'Sorry, the server is busy. Please try again later"';
                } else {
                  this.message = entry[1].error.message;
                  let timeout = setTimeout((): void => {
                    this.message = '';
                    clearTimeout(timeout);
                  }, 5000);
                }
              } else {
                this.tomorrow = entry[1].data.tasks;
              }
              break;
            case 'week':
              if (entry[1].error) {
                if (entry[1].status === 0) {
                  this.message =
                    'Sorry, the server is busy. Please try again later"';
                } else {
                  this.message = data['data'].error.message;
                  let timeout = setTimeout((): void => {
                    this.message = '';
                    clearTimeout(timeout);
                  }, 5000);
                }
              } else {
                this.week = entry[1].data.tasks;
              }
              break;
          }
        });
      },
    });
  }

  private updateTaskLists(updatedTask: Task) {
    const currentDate = new Date();
    const isNewTaskToday = isDateIn(updatedTask.date, currentDate);
    currentDate.setDate(currentDate.getDate() + 1);
    const isNewTaskTomorrow = isDateIn(updatedTask.date, currentDate);
    let interval = getWeekInterval();
    const isNewTaskWeek =
      new Date(updatedTask.date) >= interval[0] &&
      new Date(updatedTask.date) < interval[1];

    if (isNewTaskToday) {
      let insertIndex = this.today.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.today.splice(
        insertIndex === -1 ? this.today.length : insertIndex,
        0,
        updatedTask
      );
      insertIndex = this.week.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.week.splice(
        insertIndex === -1 ? this.week.length : insertIndex,
        0,
        updatedTask
      );
    }

    if (isNewTaskTomorrow) {
      let insertIndex = this.tomorrow.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.tomorrow.splice(
        insertIndex === -1 ? this.tomorrow.length : insertIndex,
        0,
        updatedTask
      );
      insertIndex = this.week.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.week.splice(
        insertIndex === -1 ? this.week.length : insertIndex,
        0,
        updatedTask
      );
    }

    if (!isNewTaskToday && !isNewTaskTomorrow && isNewTaskWeek) {
      let insertIndex = this.week.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.week.splice(
        insertIndex === -1 ? this.week.length : insertIndex,
        0,
        updatedTask
      );
    }
  }

  private updateUserAndLocalStorage(
    oldTask: Task | null,
    newTask: Task | null
  ) {
    const user = updateUser(this.current!, oldTask, newTask);
    this.auth.user.next(user);
    localStorage.setItem('user', JSON.stringify(this.current));
  }

  private handleError(error: any) {
    this.loading = false;
    if (error.status === 0) {
      this.message = 'Sorry, the server is busy. Please try again later"';
    } else {
      this.message = error.error.message;
      let timeout = setTimeout((): void => {
        this.message = '';
        clearTimeout(timeout);
      }, 5000);
    }
  }

  onEdit(task: { old: Task; new: Task }) {
    this.loading = true;
    this.task.updateTask(task.new).subscribe({
      next: (response) => {
        const updatedTask = response.data.task;
        updatedTask.category = task.new.category;
        updatedTask.tags = task.new.tags;

        let index;
        index = this.today.findIndex((item) => item._id === updatedTask._id!);
        if (index !== -1) {
          this.today.splice(index, 1);
        }
        index = this.tomorrow.findIndex(
          (item) => item._id === updatedTask._id!
        );
        if (index !== -1) {
          this.tomorrow.splice(index, 1);
        }
        index = this.week.findIndex((item) => item._id === updatedTask._id!);
        if (index !== -1) {
          this.week.splice(index, 1);
        }

        this.updateTaskLists(updatedTask);

        this.updateUserAndLocalStorage(task.old, updatedTask);

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  onCreate(task: Task) {
    this.loading = true;

    this.task.createTask(task).subscribe({
      next: (response) => {
        let item = response.data.task;
        item.category = task.category;
        item.tags = task.tags;

        let index;
        index = this.today.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.today.splice(index, 1);
        }
        index = this.tomorrow.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.tomorrow.splice(index, 1);
        }
        index = this.week.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.week.splice(index, 1);
        }

        this.updateTaskLists(item);

        this.updateUserAndLocalStorage(null, item);

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  done(data: any) {
    this.loading = true;
    this.task.updateTask(data).subscribe({
      next: () => {
        let task;
        task = this.today.find((item) => item._id === data._id);
        if (task) {
          task.done = data.done;
        }

        task = this.tomorrow.find((item) => item._id === data._id);
        if (task) {
          task.done = data.done;
        }

        task = this.week.find((item) => item._id === data._id);
        if (task) {
          task.done = data.done;
        }

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  onDelete(task: Task) {
    this.loading = true;
    this.task.deleteTask(task._id!).subscribe({
      next: () => {
        let index;
        index = this.today.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.today.splice(index, 1);
        }
        index = this.tomorrow.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.tomorrow.splice(index, 1);
        }
        index = this.week.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.week.splice(index, 1);
        }

        this.updateUserAndLocalStorage(task, null);

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }
}
