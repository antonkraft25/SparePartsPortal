import { Component, inject, signal } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { themes } from '../../../layout/theme';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink, ValidationErrors],
  templateUrl: './login.html',
  styleUrl: './login.css',
})
export class Login {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  protected selectedTheme = signal<string>(localStorage.getItem('theme') || 'light');
  protected themes = themes;

  form = new FormGroup({
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
  });

  login() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.accountService.login(this.form.value as any).subscribe({
      next: (user) => {
        this.accountService.setCurrentUser(user);
        this.router.navigateByUrl('/');
        this.toast.success('Inloggad!');
        this.form.reset();
      },
      error: (err) => {
        this.toast.error(err.error ?? err.message);
      },
    });
  }

  handleSelectTheme(theme: string) {
    this.selectedTheme.set(theme);
    localStorage.setItem('theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }
}
