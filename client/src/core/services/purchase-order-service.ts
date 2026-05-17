import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { PurchaseOrder } from '../../types/purchase-order';
import { PaginatedResult } from '../../types/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class PurchaseOrderService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getPurchaseOrders(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PaginatedResult<PurchaseOrder>>(
      this.baseUrl + `purchaseorder?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  getPurchaseOrder(id: string) {
    return this.http.get<PurchaseOrder>(this.baseUrl + 'purchaseorder/' + id);
  }

  createPurchaseOrder(items: { sparepartId: string; quantity: number }[]) {
    return this.http.post<{ id: string }>(this.baseUrl + 'purchaseorder', { items });
  }

  receivePurchaseOrder(id: string, items: { sparepartId: string; quantity: number }[]) {
    return this.http.put(this.baseUrl + 'purchaseorder/' + id + '/receive', items);
  }
}
