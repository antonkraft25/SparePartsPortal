import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Customer } from '../../types/customer';

@Injectable({
  providedIn: 'root',
})
export class CustomerService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getCustomers() {
    return this.http.get<Customer[]>(this.baseUrl + 'customer');
  }

  createCustomer(dto: Omit<Customer, 'id'>) {
    return this.http.post<Customer>(this.baseUrl + 'customer', dto);
  }

  updateCustomer(id: string, dto: Omit<Customer, 'id'>) {
    return this.http.put<Customer>(this.baseUrl + 'customer/' + id, dto);
  }
}
