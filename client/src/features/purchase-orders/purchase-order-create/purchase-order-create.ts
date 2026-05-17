import { Component, inject, OnInit, output, OnDestroy } from '@angular/core';
import { PurchaseOrderService } from '../../../core/services/purchase-order-service';
import { SparepartService } from '../../../core/services/sparepart-service';
import { Sparepart } from '../../../types/sparepart';
import { ToastService } from '../../../core/services/toast-service';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { Search } from '../../../shared/search/search';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-purchase-order-create',
  imports: [QuantityControl, Search],
  templateUrl: './purchase-order-create.html',
  styleUrl: './purchase-order-create.css',
})
export class PurchaseOrderCreate implements OnInit, OnDestroy {
  private purchaseOrderService = inject(PurchaseOrderService);
  private sparepartService = inject(SparepartService);
  private toastService = inject(ToastService);
  private destroy$ = new Subject<void>();

  isModalOpen = false;
  currentStep = 1;
  spareparts: Sparepart[] = [];
  selectedItems: { sparepart: Sparepart; quantity: number }[] = [];
  searchTerm = '';

  poCreated = output<string>();

  ngOnInit(): void {
    this.loadSpareparts();
  }

  loadSpareparts() {
    this.sparepartService.getSpareparts(1, 100, this.searchTerm).subscribe({
      next: (data) => (this.spareparts = data.items),
      error: (err) => console.error('Error loading spareparts:', err),
    });
  }

  onSearch(term: string) {
    this.searchTerm = term;
    this.loadSpareparts();
  }

  openModal() {
    this.selectedItems = [];
    this.searchTerm = '';
    this.currentStep = 1;
    this.loadSpareparts();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextStep() {
    if (this.selectedItems.length === 0) {
      this.toastService.warning('Välj minst en reservdel!');
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  isSelected(sparepartId: string): boolean {
    return this.selectedItems.some((i) => i.sparepart.id === sparepartId);
  }

  getQuantity(sparepartId: string): number {
    return this.selectedItems.find((i) => i.sparepart.id === sparepartId)?.quantity ?? 1;
  }

  toggleSparepart(sparepart: Sparepart, event?: Event) {
    if (event) event.stopPropagation();
    if (this.isSelected(sparepart.id)) {
      this.selectedItems = this.selectedItems.filter((i) => i.sparepart.id !== sparepart.id);
    } else {
      this.selectedItems = [...this.selectedItems, { sparepart, quantity: 1 }];
    }
  }

  onQuantityChange(sparepartId: string, quantity: number) {
    this.selectedItems = this.selectedItems.map((i) =>
      i.sparepart.id === sparepartId ? { ...i, quantity } : i,
    );
  }

  removeItem(sparepartId: string) {
    this.selectedItems = this.selectedItems.filter((i) => i.sparepart.id !== sparepartId);
  }

  createPurchaseOrder() {
    if (this.selectedItems.length === 0) {
      this.toastService.warning('Välj minst en reservdel!');
      return;
    }

    const items = this.selectedItems.map((i) => ({
      sparepartId: i.sparepart.id,
      quantity: i.quantity,
    }));

    this.purchaseOrderService.createPurchaseOrder(items).subscribe({
      next: (result) => {
        this.toastService.success('Inköpsorder skapad!');
        this.poCreated.emit(result.id);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel!');
        console.error(err);
      },
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
