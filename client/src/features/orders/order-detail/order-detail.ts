import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../types/order';
import { ToastService } from '../../../core/services/toast-service';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-order-detail',
  imports: [QuantityControl, DatePipe],
  templateUrl: './order-detail.html',
  styleUrl: './order-detail.css',
})
export class OrderDetail implements OnInit {
  private orderService = inject(OrderService);
  private toastService = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private cdr = inject(ChangeDetectorRef);

  order: Order | null = null;
  sendQuantities: { [sparepartId: string]: number } = {};

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) this.loadOrder(id);
  }

  loadOrder(id: string) {
    this.orderService.getOrder(id).subscribe({
      next: (data) => {
        this.order = data;
        data.items.forEach((item) => {
          this.sendQuantities[item.sparepartId] = item.quantity - item.quantitySent;
        });
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading order:', err),
    });
  }

  onQuantityChange(sparepartId: string, quantity: number) {
    this.sendQuantities[sparepartId] = quantity;
  }

  shipOrder() {
    if (!this.order) return;

    const items = this.order.items.map((item) => ({
      sparepartId: item.sparepartId,
      quantity: this.sendQuantities[item.sparepartId] ?? 0,
    }));

    this.orderService.shipOrder(this.order.id, items).subscribe({
      next: () => {
        this.toastService.success('Order skickad!');
        this.loadOrder(this.order!.id);
      },
      error: (err) => {
        this.toastService.error('Något gick fel!');
        console.error(err);
      },
    });
  }
}
