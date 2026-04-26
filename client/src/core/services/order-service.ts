import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Order } from '../../types/order';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getOrders() {
    return this.http.get<Order[]>(this.baseUrl + 'order');
  }

  createOrder(order: { deliveryAddress: any; items: { sparepartId: string; quantity: number }[] }) {
    return this.http.post<Order>(this.baseUrl + 'order', order);
  }

  getOrder(id: string) {
    return this.http.get<Order>(this.baseUrl + 'order/' + id);
  }

  shipOrder(id: string, items: { sparepartId: string; quantity: number }[]) {
    return this.http.put(this.baseUrl + 'order/' + id + '/ship', items);
  }
}
