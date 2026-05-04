import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { Product } from '../../types/product';
import { PaginatedResult } from '../../types/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;

  getProducts(pageNumber: number = 1, pageSize: number = 10) {
    return this.http.get<PaginatedResult<Product>>(
      this.baseUrl + `product?pageNumber=${pageNumber}&pageSize=${pageSize}`,
    );
  }

  getProduct(id: string) {
    return this.http.get<Product>(this.baseUrl + 'product/' + id);
  }

  createProduct(name: string) {
    return this.http.post<Product>(this.baseUrl + 'product', { name });
  }

  updateProduct(id: string, name: string) {
    return this.http.put<Product>(this.baseUrl + 'product/' + id, { name });
  }

  removeSparepart(productId: string, sparepartId: string) {
    return this.http.delete(this.baseUrl + 'product/' + productId + '/sparepart/' + sparepartId);
  }
}
