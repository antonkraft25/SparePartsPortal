import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { UserList } from '../../../types/userList';

@Component({
  selector: 'app-user-detail',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './user-detail.html',
  styleUrl: './user-detail.css',
})
export class UserDetail implements OnInit {
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  user: UserList | null = null;
  customers: Customer[] = [];
  roles = ['Admin', 'Tekniker', 'Lagerpersonal'];

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    customerId: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadUser(id);
    this.loadCustomers();
  }

  loadUser(id: string) {
    this.userService.getUser(id).subscribe({
      next: (data) => {
        this.user = data;
        this.form.patchValue({
          firstName: data.firstName,
          lastName: data.lastName,
          email: data.email,
          customerId: data.customerId,
          role: data.role,
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading user:', err),
    });
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => (this.customers = data),
      error: (err) => console.error('Error loading customers:', err),
    });
  }

  saveUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userService.updateUser(this.user!.id, this.form.value as any).subscribe({
      next: () => {
        this.toastService.success('Användare uppdaterad!');
        this.router.navigateByUrl('/users');
      },
      error: (err) => {
        this.toastService.error(err.error ?? 'Något gick fel!');
        console.error(err);
      },
    });
  }

  disableUser() {
    if (!this.user) return;
    this.userService.disableUser(this.user.id).subscribe({
      next: () => {
        this.toastService.success('Användare inaktiverad!');
        this.router.navigateByUrl('/users');
      },
      error: (err) => {
        this.toastService.error(err.error ?? 'Något gick fel!');
        console.error(err);
      },
    });
  }
}
