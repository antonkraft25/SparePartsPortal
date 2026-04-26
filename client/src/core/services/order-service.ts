import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  createOrder(order: {
    deliveryAddress: any,
    items: { sparepartId: string, quantity: number }[]
  }) {
    return this.http.post(this.baseUrl + 'order', order);
  }
}