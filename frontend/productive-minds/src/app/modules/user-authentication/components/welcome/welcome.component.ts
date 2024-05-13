import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-welcome',
  templateUrl: './welcome.component.html',
  styleUrl: './welcome.component.css',
})
export class WelcomeComponent {
  router: Router = inject(Router);
  signup() {
    this.router.navigate(['signup']);
  }

  login() {
    this.router.navigate(['login']);
  }
}
