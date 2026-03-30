import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { themes } from '../../../layout/theme';

@Component({
  selector: 'app-login',
  imports: [FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  creds = { email: '', password: '' };

  login() {
    this.accountService.login(this.creds).subscribe({
      next: (user) => {
        this.accountService.setCurrentUser(user);
        this.router.navigateByUrl('/');
        this.toast.success('Inloggad!');
        this.creds = { email: '', password: '' };
      },
      error: (err) => {
        this.toast.error(err.error ?? err.message);
      }
    });
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}