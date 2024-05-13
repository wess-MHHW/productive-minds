import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  SimpleChanges,
  inject,
} from '@angular/core';
import { AuthService } from '../../../../services/authentication/auth.service';
import { User } from '../../../../interfaces/user';
import { Task } from '../../../../interfaces/task';
import { Tag } from '../../../../interfaces/tag';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { Category } from '../../../../interfaces/category';
import { dateValidator } from '../../../../utils/functions/date.validator';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
})
export class DialogComponent implements OnInit {
  auth: AuthService = inject(AuthService);
  user!: User;
  @Output() close: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Input() type!: string;
  @Input() task: Task | null = null;
  form!: FormGroup;
  show: boolean = false;
  submit: boolean = false;

  @Output() create: EventEmitter<Task> = new EventEmitter<Task>();
  @Output() edit: EventEmitter<{ new: Task; old: Task }> = new EventEmitter<{
    new: Task;
    old: Task;
  }>();
  @Output() delete: EventEmitter<Task> = new EventEmitter<Task>();

  onClick() {
    this.close.emit(false);
  }

  hasTag(task: any, tagTitle: string): boolean {
    return task?.tags?.some((e: Tag) => e.title === tagTitle);
  }

  onSubmit() {
    this.submit = true;
    if (this.form.valid) {
      let task: Task = {
        title: this.form.value.title,
        description: this.form.value.description,
        done: false,
        date: this.form.value.date,
        category: this.form.value.category,
        tags: this.form.value.tags
          .filter((item: any) => item.checked)
          .map((item: any) => ({ title: item.title, color: item.color })),
      };

      if (this.type === 'edit') {
        task['_id'] = this.task?._id;
        this.edit.emit({ old: this.task!, new: task });
      } else {
        this.create.emit(task);
      }
      this.onClick();
    }
  }

  onChange(category: Category | undefined) {
    this.form.patchValue({ category: category });
  }

  formatDate(date: Date | undefined) {
    if (date) {
      date = new Date(date);
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const hours = String(date.getHours()).padStart(2, '0');
      const minutes = String(date.getMinutes()).padStart(2, '0');
      return `${year}-${month}-${day}T${hours}:${minutes}`;
    }
    return null;
  }

  do() {
    if (this.type === 'edit') {
      this.delete.emit(this.task!);
      this.onClick();
    } else {
      this.form.reset();
      this.submit = false;
    }
  }

  ngOnInit(): void {
    this.auth.user.subscribe((data) => {
      this.user = data!;
      this.form = new FormGroup({
        title: new FormControl(this.task?.title || '', [Validators.required]),
        description: new FormControl(this.task?.description || '', []),
        category: new FormGroup({
          title: new FormControl(
            this.task?.category?.title || this.user.categories?.[0]?.title,
            [Validators.required]
          ),
          color: new FormControl(
            this.task?.category?.color || this.user.categories?.[0]?.color,
            [Validators.required]
          ),
        }),
        tags: new FormArray(
          this.user.tags?.map((tag) => {
            return new FormGroup({
              title: new FormControl(tag.title),
              color: new FormControl(tag.color),
              checked: new FormControl(
                this.task?.tags.some((item) => item.title === tag.title)
              ),
            });
          }) || []
        ),
        date: new FormControl(this.formatDate(this.task?.date) || '', [
          Validators.required,
        ]),
      });

      if (this.type === 'create') {
        this.form.get('date')?.addValidators(dateValidator);
      } else {
        this.form.get('date')?.removeValidators(dateValidator);
      }
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (this.form) {
      if (changes.hasOwnProperty('type')) {
        if (changes['type'].currentValue === 'create') {
          this.form.get('date')?.addValidators(dateValidator);
          this.form.reset();
          this.submit = false;
        } else {
          this.submit = false;
          this.form.get('date')?.removeValidators(dateValidator);
          this.form.setValue({
            title: this.task?.title,
            description: this.task?.description,
            category: this.task?.category,
            date: this.formatDate(this.task?.date),
            tags: this.user.tags?.map((tag) => {
              return {
                title: tag.title,
                color: tag.color,
                checked: this.task?.tags.some(
                  (item) => item.title === tag.title
                ),
              };
            }),
          });
        }
      }
    }
  }
}
