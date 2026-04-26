import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../types/order';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-orders-list',
  imports: [DatePipe],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
})
export class OrdersList implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  expandedOrderId: string | null = null;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  toggleExpand(orderId: string) {
    this.expandedOrderId = this.expandedOrderId === orderId ? null : orderId;
  }
}
