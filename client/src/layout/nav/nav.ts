import { Component, computed, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [FormsModule],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  protected creds: any = {};

  protected readonly isLoggedIn = computed(() => !!this.accountService.currentUser());

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (user) => {
        this.accountService.setCurrentUser(user);
        this.router.navigateByUrl('/');
        this.toast.success('Logged in successfully!');
        this.creds = {};
      },
      error: (error) => {
        this.toast.error(error.error ?? error.message);
      }
    });
  }

  logout() {
    this.accountService.logout();
    this.router.navigateByUrl('/');
    this.toast.success('You have been logged out.');
  }
}
