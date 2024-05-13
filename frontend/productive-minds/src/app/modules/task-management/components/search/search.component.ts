import {
  Component,
  Input,
  SimpleChange,
  SimpleChanges,
  inject,
} from '@angular/core';
import { Task } from '../../../../interfaces/task';
import { TaskService } from '../../../../services/task/task.service';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/authentication/auth.service';
import { ActivatedRoute } from '@angular/router';
import { updateUser } from '../../../../utils/functions/update-user';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrl: './search.component.css',
})
export class SearchComponent {
  completed = false;
  @Input() key: string = '';
  auth: AuthService = inject(AuthService);
  task: TaskService = inject(TaskService);
  loading = false;
  message = '';
  tasks: Array<Task> = [];
  current!: User | null;
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  show: boolean = false;
  title: 'edit' | 'create' = 'create';
  selected: Task | null = null;

  edit(task: any) {
    this.title = 'edit';
    this.show = true;
    this.selected = task;
  }

  open() {
    this.title = 'create';
    this.show = true;
    this.selected = null;
  }

  close() {
    this.show = false;
  }

  ngOnInit() {
    this.auth.user.subscribe((data) => {
      this.current = data!;
    });

    this.task.search.subscribe((data) => {
      this.key = data;
      if (this.key.length !== 0) this.loading = true;
      this.task.searchTasks(this.key).subscribe({
        next: (data) => {
          this.loading = false;
          this.tasks = data.data.tasks.map((item: any) => {
            item.category = {
              title: item.category,
              color: this.current?.categories?.find(
                (element) =>
                  element.title.toLowerCase() === item.category.toLowerCase()
              )!.color,
            };

            item.tags = item.tags.map((tag: any) => {
              return {
                title: tag,
                color: this.current?.tags?.find(
                  (element) => element.title.toLowerCase() === tag.toLowerCase()
                )!.color,
              };
            });

            return item;
          });
          this.completed = true;
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
            }, 5000);
          }
        },
      });
    });
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

  private updateUserAndLocalStorage(
    oldTask: Task | null,
    newTask: Task | null
  ) {
    const user = updateUser(this.current!, oldTask, newTask);
    this.auth.user.next(user);
    localStorage.setItem('user', JSON.stringify(this.current));
  }

  private updateTaskList(updatedTask: Task) {
    if (
      updatedTask.title
        .toLocaleLowerCase()
        .startsWith(this.key.toLocaleLowerCase())
    ) {
      const insertIndex = this.tasks.findIndex(
        (element) => element.date < updatedTask.date
      );
      this.tasks.splice(
        insertIndex === -1 ? this.tasks.length : insertIndex,
        0,
        updatedTask
      );
    }
  }

  done(data: any) {
    this.loading = true;
    this.task.updateTask(data).subscribe({
      next: () => {
        let task = this.tasks.find((task) => task._id === data._id);
        this.loading = false;
        if (task) {
          task.done = data.done;
        }
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
        let index = this.tasks.findIndex((item) => item._id === task._id!);
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }

        this.updateUserAndLocalStorage(task, null);

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }

  onEdit(task: { old: Task; new: Task }) {
    this.loading = true;

    this.task.updateTask(task.new).subscribe({
      next: (response) => {
        const updatedTask = response.data.task;
        updatedTask.category = task.new.category;
        updatedTask.tags = task.new.tags;

        let index = this.tasks.findIndex(
          (item) => item._id === updatedTask._id!
        );
        if (index !== -1) {
          this.tasks.splice(index, 1);
        }

        this.updateTaskList(updatedTask);

        this.updateUserAndLocalStorage(task.old, updatedTask);

        this.loading = false;
      },
      error: (error) => {
        this.handleError(error);
      },
    });
  }
}
