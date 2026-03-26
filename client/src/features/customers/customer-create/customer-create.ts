import { Component, inject, output } from '@angular/core';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-customer-create',
  imports: [FormsModule],
  templateUrl: './customer-create.html',
  styleUrl: './customer-create.css',
})
export class CustomerCreate {
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  name = '';
  city = '';
  postalcode = '';
  streetName = '';

  customerCreated = output<Customer>();

  openModal() {
    this.resetForm();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveCustomer() {
    if (!this.name.trim() || !this.city.trim() || !this.postalcode.trim() || !this.streetName.trim()) {
      this.toastService.warning('Fyll i alla fält!');
      return;
    }
    this.customerService.createCustomer({
      name: this.name,
      city: this.city,
      postalcode: this.postalcode,
      streetName: this.streetName
    }).subscribe({
      next: (customer) => {
        this.toastService.success('Kund skapad!');
        this.customerCreated.emit(customer);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid skapande!');
        console.error('Error creating customer:', err);
      }
    });
  }

  resetForm() {
    this.name = '';
    this.city = '';
    this.postalcode = '';
    this.streetName = '';
  }
}