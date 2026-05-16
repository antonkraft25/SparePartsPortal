import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { SparepartDetails } from '../sparepart-details/sparepart-details';
import { SparepartCreate } from '../sparepart-create/sparepart-create';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { ToastService } from '../../../core/services/toast-service';
import { AccountService } from '../../../core/services/account-service';
import { Paginator } from '../../../shared/paginator/paginator';
import { Search } from '../../../shared/search/search';

@Component({
  selector: 'app-sparparts-list',
  imports: [SparepartDetails, SparepartCreate, RouterLink, QuantityControl, Paginator, Search],
  templateUrl: './spareparts-list.html',
  styleUrl: './spareparts-list.css',
})
export class SparepartsList implements OnInit {
  protected sparepartService = inject(SparepartService);
  protected cartService = inject(CartService);
  protected accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  spareparts: Sparepart[] = [];
  quantities: { [id: string]: number } = {};
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;
  searchTerm = '';
  ngOnInit(): void {
    this.loadSpareparts();
  }

  loadSpareparts() {
    this.sparepartService.getSpareparts(this.pageNumber, this.pageSize, this.searchTerm).subscribe({
      next: (data) => {
        this.spareparts = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        data.items.forEach((s) => {
          if (!this.quantities[s.id]) this.quantities[s.id] = 0;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading spareparts:', err),
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.pageNumber = 1; // reset to first page on new search
    this.loadSpareparts();
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadSpareparts();
  }

  onQuantityChange(sparepartId: string, quantity: number) {
    this.quantities[sparepartId] = quantity;
  }

  addToCart(sparepart: Sparepart) {
    const quantity = this.quantities[sparepart.id] || 0;
    if (quantity <= 0) {
      this.toastService.warning('Ange antal innan du lägger i varukorgen!');
      return;
    }
    this.cartService.addItem(sparepart, quantity);
    this.quantities[sparepart.id] = 0;
    this.toastService.success(`${sparepart.name} tillagd i varukorgen!`);
  }

  onSparepartSaved(updated: Sparepart) {
    this.spareparts = this.spareparts.map((s) => (s.id === updated.id ? updated : s));
  }

  onSparepartDeactivated(id: string) {
    this.spareparts = this.spareparts.filter((s) => s.id !== id);
    this.totalCount--;
  }

  onSparepartCreated(sparepart: Sparepart) {
    this.loadSpareparts();
  }
}
