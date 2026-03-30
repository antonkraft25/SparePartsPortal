import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-reset-password',
  imports: [FormsModule, RouterLink],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  email = '';
  newPassword = '';
  confirmPassword = '';

  resetPassword() {
    if (!this.email.trim() || !this.newPassword.trim()) {
      this.toast.warning('Fyll i alla fält!');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toast.error('Lösenorden matchar inte!');
      return;
    }

    this.accountService.resetPassword(this.email, this.newPassword).subscribe({
      next: () => {
        this.toast.success('Lösenordet har återställts!');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.toast.error(err.error?.title ?? err.error ?? 'Något gick fel!');
      },
    });
  }
}