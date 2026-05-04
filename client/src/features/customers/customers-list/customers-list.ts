import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { CustomerService } from '../../../core/services/customer-service';
import { Customer } from '../../../types/customer';
import { CustomerCreate } from '../customer-create/customer-create';
import { CustomerEdit } from '../customer-edit/customer-edit';
import { AccountService } from '../../../core/services/account-service';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-customers-list',
  imports: [CustomerCreate, CustomerEdit, Paginator],
  templateUrl: './customers-list.html',
  styleUrl: './customers-list.css',
})
export class CustomersList implements OnInit {
  protected customerService = inject(CustomerService);
  protected accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);

  customers: Customer[] = [];
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadCustomers();
  }

  loadCustomers() {
    this.customerService.getCustomers(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.customers = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading customers:', err),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadCustomers();
  }

  onCustomerCreated(customer: Customer) {
    this.loadCustomers();
  }

  onCustomerUpdated(updated: Customer) {
    this.customers = this.customers.map((c) => (c.id === updated.id ? updated : c));
  }
}
