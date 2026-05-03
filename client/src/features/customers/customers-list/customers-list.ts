import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { CustomerCreate } from '../customer-create/customer-create';
import { CustomerEdit } from '../customer-edit/customer-edit';
import { AccountService } from '../../../core/services/account-service';

@Component({
  selector: 'app-customers-list',
  imports: [CustomerCreate, CustomerEdit],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.css',
})
export class CustomersList implements OnInit {
  protected customerService = inject(CustomerService);
  private cdr = inject(ChangeDetectorRef);
  protected accountService = inject(AccountService);
  customers: Customer[] = [];

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers().subscribe({
      next: (data) => {
        this.customers = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading customers:', err)
    });
  }

  onCustomerCreated(customer: Customer) {
    this.customers = [...this.customers, customer];
  }

  onCustomerUpdated(updated: Customer) {
    this.customers = this.customers.map(c =>
      c.id === updated.id ? updated : c
    );
  }
}