import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-profile',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);

  profileForm = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
  });

  passwordForm = new FormGroup(
    {
      currentPassword: new FormControl('', [Validators.required, Validators.minLength(6)]),
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

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (user) {
      this.profileForm.patchValue({
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
      });
    }
  }

  updateProfile() {
    if (this.profileForm.invalid) {
      this.profileForm.markAllAsTouched();
      return;
    }

    this.accountService.updateProfile(this.profileForm.value as any).subscribe({
      next: (updatedUser) => {
        this.accountService.setCurrentUser(updatedUser);
        this.toastService.success('Profil uppdaterad!');
      },
      error: (err) => {
        this.toastService.error(err.error ?? 'Något gick fel!');
      },
    });
  }

  changePassword() {
    if (this.passwordForm.invalid) {
      this.passwordForm.markAllAsTouched();
      return;
    }

    const { currentPassword, newPassword } = this.passwordForm.value;

    this.accountService
      .changePassword({
        currentPassword: currentPassword!,
        newPassword: newPassword!,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Lösenord ändrat!');
          this.passwordForm.reset();
        },
        error: (err) => {
          this.toastService.error(err.error ?? 'Något gick fel!');
        },
      });
  }
}
