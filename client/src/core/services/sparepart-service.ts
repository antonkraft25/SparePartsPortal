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
}
