import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../services/authentication/auth.service';
import { User } from '../../../../interfaces/user';
import { ActivatedRoute } from '@angular/router';
import { formatResponse } from '../../../../utils/functions/format-response';

@Component({
  selector: 'app-task-management',
  templateUrl: './task-management.component.html',
  styleUrl: './task-management.component.css',
})
export class TaskManagementComponent implements OnInit {
  auth: AuthService = inject(AuthService);
  show: boolean = true;
  selected: string = 'today';
  user!: User;
  loading = true;
  activatedRoute: ActivatedRoute = inject(ActivatedRoute);

  ngOnInit(): void {
    this.activatedRoute.data.subscribe({
      next: (data) => {
        if (!data['data'].error) {
          let value = formatResponse(
            data['data']['data']['user'],
            data['data']['token'],
            data['data']['data']['today'],
            data['data']['data']['upcoming']
          );

          this.auth.user.next(value);
          this.auth.autoLogout(value.token);
          localStorage.setItem('user', JSON.stringify(value));
        }
      },
    });

    this.auth.user.subscribe({
      next: (data) => {
        this.user = data!;
      },
    });
  }
}
