import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { single } from 'rxjs';
import { Sparepart } from '../../types/sparepart';
import { PaginatedResult } from '../../types/paginated-result';

@Injectable({
  providedIn: 'root',
})
export class SparepartService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  sparePart = signal<Sparepart | null>(null);

  getSpareparts(pageNumber: number = 1, pageSize: number = 10, search: string = '') {
    return this.http.get<PaginatedResult<Sparepart>>(
      this.baseUrl + `spareparts?pageNumber=${pageNumber}&pageSize=${pageSize}&search=${search}`,
    );
  }

  updateSparepart(sparepart: Sparepart) {
    return this.http.put<Sparepart>(this.baseUrl + 'spareparts/' + sparepart.id, sparepart);
  }

  createSparepart(data: {
    name: string;
    location: string;
    prize: string;
    purchasePrize: string;
    balance: number;
    productIds: string[];
  }) {
    return this.http.post<Sparepart>(this.baseUrl + 'spareparts', data);
  }

  deleteSparepart(id: string) {
    return this.http.delete(this.baseUrl + 'spareparts/' + id);
  }
}
