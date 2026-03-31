import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { AppValidators } from '../../../core/validators/app-validators';

@Component({
  selector: 'app-customer-create',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './customer-create.html',
  styleUrl: './customer-create.css',
})
export class CustomerCreate {
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  customerCreated = output<Customer>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalcode: new FormControl('', [Validators.required, AppValidators.postalCode()]),
    streetName: new FormControl('', [Validators.required]),
  });

  openModal() {
    this.form.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveCustomer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.customerService.createCustomer(this.form.value as any).subscribe({
      next: (customer) => {
        this.toastService.success('Kund skapad!');
        this.customerCreated.emit(customer);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid skapande!');
        console.error(err);
      },
    });
  }
}
