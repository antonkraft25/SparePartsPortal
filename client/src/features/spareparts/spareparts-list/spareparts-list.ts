import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { SparepartDetails } from '../sparepart-details/sparepart-details';
import { SparepartCreate } from '../sparepart-create/sparepart-create';
import { RouterLink } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { ToastService } from '../../../core/services/toast-service';

@Component({
  selector: 'app-sparparts-list',
  imports: [SparepartDetails, SparepartCreate, RouterLink, QuantityControl],
  templateUrl: './spareparts-list.html',
  styleUrl: './spareparts-list.css',
})
export class SparepartsList implements OnInit {
  protected sparepartService = inject(SparepartService);
  protected cartService = inject(CartService);
  private toastService = inject(ToastService);
  private cdr = inject(ChangeDetectorRef);

  spareparts: Sparepart[] = [];
  quantities: { [id: string]: number } = {};

  ngOnInit(): void {
    this.loadSpareparts();
  }

  loadSpareparts() {
    this.sparepartService.getSpareparts().subscribe({
      next: (data) => {
        this.spareparts = data;
        this.quantities = {};
        data.forEach((s) => (this.quantities[s.id] = 0));
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading spareparts:', err),
    });
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
  }

  onSparepartCreated(sparepart: Sparepart) {
    this.spareparts = [...this.spareparts, sparepart];
  }
}
