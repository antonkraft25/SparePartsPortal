import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { PurchaseOrderService } from '../../../core/services/purchase-order-service';
import { PurchaseOrder } from '../../../types/purchase-order';
import { ToastService } from '../../../core/services/toast-service';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-purchase-order-detail',
  imports: [QuantityControl, DatePipe],
  templateUrl: './purchase-order-detail.html',
  styleUrl: './purchase-order-detail.css',
})
export class PurchaseOrderDetail implements OnInit {
  private purchaseOrderService = inject(PurchaseOrderService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private cdr = inject(ChangeDetectorRef);

  po: PurchaseOrder | null = null;
  receiveQuantities: { [sparepartId: string]: number } = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadPurchaseOrder(id);
  }

  loadPurchaseOrder(id: string) {
    this.purchaseOrderService.getPurchaseOrder(id).subscribe({
      next: (data) => {
        this.po = data;
        data.items.forEach((item) => {
          this.receiveQuantities[item.sparepartId] = item.quantity - item.quantityReceived;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading purchase order:', err),
    });
  }

  onQuantityChange(sparepartId: string, quantity: number) {
    this.receiveQuantities[sparepartId] = quantity;
  }

  receivePurchaseOrder() {
    if (!this.po) return;

    const items = this.po.items.map((item) => ({
      sparepartId: item.sparepartId,
      quantity: this.receiveQuantities[item.sparepartId] ?? 0,
    }));

    this.purchaseOrderService.receivePurchaseOrder(this.po.id, items).subscribe({
      next: () => {
        this.toastService.success('Inköpsorder mottagen!');
        this.loadPurchaseOrder(this.po!.id);
      },
      error: (err) => {
        this.toastService.error('Något gick fel!');
        console.error(err);
      },
    });
  }
}
