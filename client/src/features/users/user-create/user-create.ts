import { Component, inject, output, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { UserService } from '../../../core/services/user-service';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-user-create',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './user-create.html',
  styleUrl: './user-create.css',
})
export class UserCreate implements OnInit {
  private userService = inject(UserService);
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  customers: Customer[] = [];
  roles = ['Admin', 'Tekniker', 'Lagerpersonal'];

  userCreated = output<void>();

  form = new FormGroup({
    firstName: new FormControl('', [Validators.required]),
    lastName: new FormControl('', [Validators.required]),
    email: new FormControl('', [Validators.required, Validators.email]),
    password: new FormControl('', [Validators.required, Validators.minLength(6)]),
    customerId: new FormControl('', [Validators.required]),
    role: new FormControl('', [Validators.required]),
  });

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers(1, 100).subscribe({
      next: (data) => (this.customers = data.items),
      error: (err) => console.error('Error loading customers:', err),
    });
  }

  openModal() {
    this.form.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveUser() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.userService.createUser(this.form.value as any).subscribe({
      next: () => {
        this.toastService.success('Användare skapad!');
        this.userCreated.emit();
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error(err.error ?? 'Något gick fel!');
        console.error(err);
      },
    });
  }
}
