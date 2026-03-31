import { Component, inject } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-reset-password',
  imports: [ReactiveFormsModule, RouterLink, ValidationErrors],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css',
})
export class ResetPassword {
  private accountService = inject(AccountService);
  private router = inject(Router);
  private toast = inject(ToastService);

  form = new FormGroup(
    {
      email: new FormControl('', [Validators.required, Validators.email]),
      newPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
      confirmPassword: new FormControl('', [Validators.required]),
    },
    { validators: this.passwordMatchValidator },
  );

  passwordMatchValidator(form: any) {
    const newPassword = form.get('newPassword')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return newPassword === confirmPassword ? null : { passwordMismatch: true };
  }

  resetPassword() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { email, newPassword } = this.form.value;

    this.accountService.resetPassword(email!, newPassword!).subscribe({
      next: () => {
        this.toast.success('Lösenordet har återställts!');
        this.router.navigateByUrl('/login');
      },
      error: (err) => {
        this.toast.error(err.error ?? 'Något gick fel!');
      },
    });
  }
}
