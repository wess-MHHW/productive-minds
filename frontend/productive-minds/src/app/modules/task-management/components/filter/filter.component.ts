import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { User } from '../../../../interfaces/user';
import { AuthService } from '../../../../services/authentication/auth.service';
import { TaskService } from '../../../../services/task/task.service';
import { Task } from '../../../../interfaces/task';
import { updateUser } from '../../../../utils/functions/update-user';

@Component({
  selector: 'app-filter',
  templateUrl: './filter.component.html',
  styleUrl: './filter.component.css',
})
export class FilterComponent implements OnInit {
  auth: AuthService = inject(AuthService);
  task: TaskService = inject(TaskService);
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  tasks: Array<Task> = [];
  message: string = '';
  show: boolean = false;
  nature: string = '';
  name: string = '';
  title: 'edit' | 'create' = 'create';
  selected: Task | null = null;
  loading: boolean = false;
  current!: User | null;

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

  ngOnInit(): void {
    this.activatedRoute.paramMap.subscribe((data) => {
      let title = data.get('title')!.toUpperCase();
      this.nature = data.get('nature')!.toLowerCase();
      this.name =
        title.slice(0, 1).toUpperCase() + title.slice(1).toLowerCase();
    });

    this.auth.user.subscribe({
      next: (data) => {
        this.current = data!;
      },
    });

    this.activatedRoute.data.subscribe({
      next: (data) => {
        if (data['data'].error) {
          if (data['data'].status === 0) {
            this.message = 'Sorry, the server is busy. Please try again later"';
          } else {
            this.message = data['data'].error.message;
            let timeout = setTimeout((): void => {
              this.message = '';
              clearTimeout(timeout);
            }, 5000);
          }
        } else {
          this.tasks = data['data'].data.tasks;
        }
      },
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
    if (this.nature === 'categories') {
      if (
        updatedTask.category.title.toLowerCase() === this.name.toLowerCase()
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
    } else if (this.nature === 'tags') {
      let titles = updatedTask.tags.map((tag) => tag.title.toLowerCase());
      if (titles.includes(this.name.toLowerCase())) {
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

  onCreate(task: Task) {
    this.loading = true;

    this.task.createTask(task).subscribe({
      next: (response) => {
        let item = response.data.task;
        item.category = task.category;
        item.tags = task.tags;

        this.updateTaskList(item);

        this.updateUserAndLocalStorage(null, item);

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