import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from '../../types/customer';
import { PaginatedResult } from '../../types/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getCustomers(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PaginatedResult<Customer>>(
      this.baseUrl + `customer?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  createCustomer(dto: Omit<Customer, 'id'>) {
    return this.http.post<Customer>(this.baseUrl + 'customer', dto);
  }

  updateCustomer(id: string, dto: Omit<Customer, 'id'>) {
    return this.http.put<Customer>(this.baseUrl + 'customer/' + id, dto);
  }

  getCustomer(id: string) {
    return this.http.get<Customer>(this.baseUrl + 'customer/' + id);
  }
}
