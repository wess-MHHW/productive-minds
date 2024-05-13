import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { StickyWallService } from '../../../../services/sticky-wall/sticky-wall.service';
import { StickyWall } from '../../../../interfaces/sticky-wall';
import { take } from 'rxjs';

@Component({
  selector: 'app-sticky-wall',
  templateUrl: './sticky-wall.component.html',
  styleUrl: './sticky-wall.component.css',
})
export class StickyWallComponent {
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);
  sticky: StickyWallService = inject(StickyWallService);
  message: string = '';
  loading: boolean = false;
  stickies: Array<StickyWall> = [];

  onEdit(content: string) {
    this.loading = true;
    this.sticky
      .createSticky(content)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          let element = this.stickies.find(
            (item) => item._id === data.data.sticky._id
          );
          element!.content = content;
          this.loading = false;
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
  }

  onCreate(content: string) {
    this.loading = true;
    this.sticky
      .createSticky(content)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          this.stickies.unshift(data.data.sticky);
          this.loading = false;
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
  }

  onDelete(id: string) {
    this.loading = true;
    this.sticky
      .deleteSticky(id)
      .pipe(take(1))
      .subscribe({
        next: (data) => {
          let index = this.stickies.findIndex((item) => item._id === id);
          this.stickies.splice(index, 1);
          this.loading = false;
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
  }

  ngOnInit() {
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
          this.stickies = data['data']['data']['stickies'];
        }
      },
    });
  }
}
