import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { PurchaseOrderService } from '../../../core/services/purchase-order-service';
import { PurchaseOrder } from '../../../types/purchase-order';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../shared/paginator/paginator';
import { PurchaseOrderCreate } from '../purchase-order-create/purchase-order-create';

@Component({
  selector: 'app-purchase-orders-list',
  imports: [DatePipe, RouterLink, Paginator, PurchaseOrderCreate],
  templateUrl: './purchase-orders-list.html',
  styleUrl: './purchase-orders-list.css',
})
export class PurchaseOrdersList implements OnInit {
  private purchaseOrderService = inject(PurchaseOrderService);
  private cdr = inject(ChangeDetectorRef);

  purchaseOrders: PurchaseOrder[] = [];
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadPurchaseOrders();
  }

  loadPurchaseOrders() {
    this.purchaseOrderService.getPurchaseOrders(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.purchaseOrders = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading purchase orders:', err),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadPurchaseOrders();
  }

  onPoCreated() {
    this.loadPurchaseOrders();
  }
}
