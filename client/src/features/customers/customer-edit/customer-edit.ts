import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { AppValidators } from '../../../core/validators/app-validators';

@Component({
  selector: 'app-customer-edit',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './customer-edit.html',
  styleUrl: './customer-edit.css',
})
export class CustomerEdit {
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  customer: Customer | null = null;
  customerUpdated = output<Customer>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalcode: new FormControl('', [Validators.required, AppValidators.postalCode()]),
    streetName: new FormControl('', [Validators.required]),
  });

  openModal(customer: Customer) {
    this.customer = customer;
    this.form.patchValue(customer);
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.customer = null;
  }

  saveCustomer() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.customerService.updateCustomer(this.customer!.id, this.form.value as any).subscribe({
      next: (updated) => {
        this.toastService.success('Kund uppdaterad!');
        this.customerUpdated.emit(updated);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid uppdatering!');
        console.error(err);
      },
    });
  }
}
