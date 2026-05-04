import { Component, inject, OnInit, ChangeDetectorRef } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { ProductCreate } from '../product-create/product-create';
import { ProductEdit } from '../product-edit/product-edit';
import { AccountService } from '../../../core/services/account-service';
import { Paginator } from '../../../shared/paginator/paginator';

@Component({
  selector: 'app-products-list',
  imports: [ProductCreate, ProductEdit, Paginator],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  protected productService = inject(ProductService);
  protected accountService = inject(AccountService);
  private cdr = inject(ChangeDetectorRef);

  products: Product[] = [];
  totalCount = 0;
  totalPages = 0;
  pageNumber = 1;
  pageSize = 10;

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts(this.pageNumber, this.pageSize).subscribe({
      next: (data) => {
        this.products = data.items;
        this.totalCount = data.totalCount;
        this.totalPages = data.totalPages;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Error loading products:', err),
    });
  }

  onPageChange(event: { pageNumber: number; pageSize: number }) {
    this.pageNumber = event.pageNumber;
    this.pageSize = event.pageSize;
    this.loadProducts();
  }

  onProductCreated(product: Product) {
    this.loadProducts();
  }

  onProductUpdated(updated: Product) {
    this.products = this.products.map((p) => (p.id === updated.id ? updated : p));
  }
}
