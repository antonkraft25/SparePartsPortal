import { Component, inject, output } from '@angular/core';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { FormsModule } from '@angular/forms';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-customer-edit',
  imports: [FormsModule],
  templateUrl: './customer-edit.html',
  styleUrl: './customer-edit.css',
})
export class CustomerEdit {
  private customerService = inject(CustomerService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  customer: Customer | null = null;
  name = '';
  city = '';
  postalcode = '';
  streetName = '';

  customerUpdated = output<Customer>();

  openModal(customer: Customer) {
    this.customer = { ...customer };
    this.name = customer.name;
    this.city = customer.city;
    this.postalcode = customer.postalcode;
    this.streetName = customer.streetName;
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
    this.customer = null;
  }

  saveCustomer() {
    if (!this.customer) return;
    this.customerService.updateCustomer(this.customer.id, {
      name: this.name,
      city: this.city,
      postalcode: this.postalcode,
      streetName: this.streetName
    }).subscribe({
      next: (updated) => {
        this.toastService.success('Kund uppdaterad!');
        this.customerUpdated.emit(updated);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid uppdatering!');
        console.error('Error updating customer:', err);
      }
    });
  }
}