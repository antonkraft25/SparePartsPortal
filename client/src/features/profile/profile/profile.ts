import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  imports: [FormsModule],
  templateUrl: './profile.html',
  styleUrl: './profile.css',
})
export class Profile implements OnInit {
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private router = inject(Router);

  firstName = '';
  lastName = '';
  email = '';

  currentPassword = '';
  newPassword = '';
  confirmPassword = '';

  ngOnInit(): void {
    const user = this.accountService.currentUser();
    if (user) {
      this.firstName = user.firstName;
      this.lastName = user.lastName;
      this.email = user.email;
    }
  }

  updateProfile() {
    this.accountService
      .updateProfile({
        firstName: this.firstName,
        lastName: this.lastName,
        email: this.email,
      })
      .subscribe({
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
    if (!this.currentPassword || !this.newPassword || !this.confirmPassword) {
      this.toastService.warning('Fyll i alla fält!');
      return;
    }

    if (this.newPassword !== this.confirmPassword) {
      this.toastService.error('Lösenorden matchar inte!');
      return;
    }

    this.accountService
      .changePassword({
        currentPassword: this.currentPassword,
        newPassword: this.newPassword,
      })
      .subscribe({
        next: () => {
          this.toastService.success('Lösenord ändrat!');
          this.currentPassword = '';
          this.newPassword = '';
          this.confirmPassword = '';
        },
        error: (err) => {
          this.toastService.error(err.error ?? 'Något gick fel!');
        },
      });
  }
}
