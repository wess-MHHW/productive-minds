import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  inject,
} from '@angular/core';
import { Category } from '../../../../interfaces/category';
import { Tag } from '../../../../interfaces/tag';
import { AuthService } from '../../../../services/authentication/auth.service';
import { map, take } from 'rxjs';
import { Router } from '@angular/router';
import { UserService } from '../../../../services/user/user.service';
import { formatResponse } from '../../../../utils/functions/format-response';
import { User } from '../../../../interfaces/user';
import { capitalize } from '../../../../utils/functions/capitalize';
import { FormControl, NgForm } from '@angular/forms';
import { TaskService } from '../../../../services/task/task.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrl: './menu.component.css',
})
export class MenuComponent {
  router: Router = inject(Router);
  auth: AuthService = inject(AuthService);
  user: UserService = inject(UserService);
  task: TaskService = inject(TaskService);
  @Input() show!: boolean;
  @Input() selected!: string;
  @Output() showChange: EventEmitter<boolean> = new EventEmitter<boolean>();
  @Output() selectedChange: EventEmitter<string> = new EventEmitter<string>();
  @Input() categories!: Array<Category>;
  @Input() tags!: Array<Tag>;
  @Output() search: EventEmitter<string> = new EventEmitter();
  searchControl = new FormControl();
  colors: Array<string> = [
    '#ff6b6b',
    '#da77f2',
    '#9775fa',
    '#5c7cfa',
    '#66d9e8',
    '#8ce99a',
    '#ffd43b',
    '#ff922b',
  ];
  color: string = '#5c7cfa';
  option: string = '';
  current!: User | null;

  send() {
    if (this.searchControl.value.trim().length !== 0) {
      this.task.search.next(this.searchControl.value.trim());
    }
  }

  open() {
    this.showChange.emit(true);
  }

  close() {
    this.showChange.emit(false);
    this.selectedChange.emit('today');
  }

  onClick(value: string, option?: string) {
    this.selectedChange.emit(value);
    switch (value) {
      case 'search-field':
        this.option = '';
        this.router.navigate(['dashboard', 'search']);
        break;
      case 'upcoming':
        this.searchControl.setValue('');
        this.option = '';
        this.router.navigate(['dashboard', 'upcoming']);
        break;
      case 'today':
        this.option = '';
        this.searchControl.setValue('');
        this.router.navigate(['dashboard', 'today']);
        break;
      case 'calendar':
        this.searchControl.setValue('');
        this.option = '';
        this.router.navigate(['dashboard', 'calendar']);
        break;
      case 'sticky-wall':
        this.searchControl.setValue('');
        this.option = '';
        this.router.navigate(['dashboard', 'sticky-wall']);
        break;
      case 'settings':
        this.searchControl.setValue('');
        this.option = '';
        this.router.navigate(['dashboard', 'settings']);
        break;
      default:
        this.searchControl.setValue('');
        if (option === 'list') {
          this.option = 'list';
          this.router.navigate([
            'dashboard',
            'categories',
            value.toLocaleLowerCase(),
          ]);
        } else if (option === 'tag') {
          this.option = 'tag';
          this.router.navigate([
            'dashboard',
            'tags',
            value.toLocaleLowerCase().replaceAll(' ', '-'),
          ]);
        }
    }
  }

  onColorChange(color: string) {
    this.color = color;
  }

  logout(value: string) {
    this.selectedChange.emit(value);
    this.auth.logout();
  }

  createTag(input: HTMLInputElement) {
    if (input.value.trim().length !== 0) {
      let tag: Tag = {
        title: capitalize(input.value.trim()),
        color: this.color,
        count: 0,
      };
      this.user
        .addTag(tag)
        .pipe(take(1))
        .subscribe({
          next: (data) => {
            this.current?.tags?.push(tag);
            this.auth.user.next(this.current);
            localStorage.setItem('user', JSON.stringify(this.current));
            input.value = '';
          },
        });
    }
  }

  createCategory(input: HTMLInputElement) {
    let category: Category = {
      title: capitalize(input.value.trim()),
      color: this.color,
      count: 0,
    };

    this.user
      .addCategory(category)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.current?.categories?.push(category);
          this.auth.user.next(this.current);
          localStorage.setItem('user', JSON.stringify(this.current));
          input.value = '';
        },
      });
  }

  hexToRGBA(hex: string, alpha: number): string {
    const r = parseInt(hex.substring(1, 3), 16);
    const g = parseInt(hex.substring(3, 5), 16);
    const b = parseInt(hex.substring(5, 7), 16);
    return `rgba(${r},${g},${b},${alpha})`;
  }

  ngOnInit() {
    this.auth.user.subscribe({
      next: (data) => {
        this.current = structuredClone(data);
      },
    });
  }
}
