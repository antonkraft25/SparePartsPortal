import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../core/services/account-service';
import { ToastService } from '../../core/services/toast-service';
import { themes } from '../theme';

@Component({
  standalone: true,
  selector: 'app-nav',
  imports: [FormsModule, RouterLink],
  templateUrl: './nav.html',
  styleUrl: './nav.css',
})
export class Nav implements OnInit {
  protected accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);
  protected creds: any = {};
  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light')
  protected themes = themes;

  ngOnInit(): void {
    document.documentElement.setAttribute('data-theme', this.selectedTheme());
  }

  handeleSelectTheme(theme: string) {
    this.selectedTheme.set(theme); 
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
    const elem = document.activeElement as HTMLDivElement; 
    if (elem) elem.blur();
  }

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
