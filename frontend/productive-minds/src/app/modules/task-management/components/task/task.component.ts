import { Component, EventEmitter, Input, Output, inject } from '@angular/core';
import { Task } from '../../../../interfaces/task';
import { AuthService } from '../../../../services/authentication/auth.service';
import { User } from '../../../../interfaces/user';

@Component({
  selector: 'app-task',
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
})
export class TaskComponent {
  @Input() details: boolean = true;
  @Input() task!: Task;
  auth: AuthService = inject(AuthService);
  user!: User;
  @Output() done: EventEmitter<{ _id: string; done: boolean }> =
    new EventEmitter<{ _id: string; done: boolean }>();
  @Output() edit: EventEmitter<Task> = new EventEmitter<Task>();

  onClick() {
    this.done.emit({ _id: this.task._id!, done: !this.task.done });
  }

  onEdit() {
    this.edit.emit(this.task);
  }
}
