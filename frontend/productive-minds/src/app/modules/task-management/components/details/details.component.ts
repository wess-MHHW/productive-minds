import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Task } from '../../../../interfaces/task';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() date!: string | Date;
  @Input() tasks!: Array<Task>;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();

  today: Date = new Date();

  onClick() {
    this.close.emit(false);
  }

  compare(task: Task) {
    let today: Date = new Date();

    let date = new Date(task.date);
    return date < today;
  }
}
