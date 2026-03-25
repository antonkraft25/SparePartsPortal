import { HttpClient } from '@angular/common/http';
import { inject, Injectable, signal } from '@angular/core';
import { environment } from '../../environments/environment';
import { single } from 'rxjs';
import { Sparepart } from '../../types/sparepart';

@Injectable({
  providedIn: 'root',
})
export class SparepartService {
  private http = inject(HttpClient);
  private baseUrl = environment.apiUrl;
  sparePart = signal<Sparepart | null >(null); 

  getSpareparts(){
    return this.http.get<Sparepart[]>(this.baseUrl + 'spareparts');
  }

  updateSparepart(sparepart: Sparepart) {
    return this.http.put<Sparepart>(this.baseUrl + 'spareparts/' + sparepart.id, sparepart);
  }

  createSparepart(data: { name: string, location: string, prize: string, purchasePrize: string, balance: number, productIds: string[] }) {
    return this.http.post<Sparepart>(this.baseUrl + 'spareparts', data);
  }

  deleteSparepart(id: string) {
  return this.http.delete(this.baseUrl + 'spareparts/' + id);
}
}
