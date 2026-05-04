import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { OrderService } from '../../../core/services/order-service';
import { Order } from '../../../types/order';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-orders-list',
  imports: [DatePipe, RouterLink, Paginator],
  templateUrl: './orders-list.html',
  styleUrl: './orders-list.css',
})
export class OrdersList implements OnInit {
  private orderService = inject(OrderService);
  private cdr = inject(ChangeDetectorRef);

  orders: Order[] = [];
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders() {
    this.orderService.getOrders(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.orders = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading orders:', err),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadOrders();
  }
}
