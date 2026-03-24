import { ChangeDetectorRef, Component, inject, OnInit } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { ProductCreate } from '../product-create/product-create';

@Component({
  selector: 'app-products-list',
  imports: [ProductCreate],
  templateUrl: './products-list.html',
  styleUrl: './products-list.css',
})
export class ProductsList implements OnInit {
  protected productService = inject(ProductService);
  private cdr = inject(ChangeDetectorRef);
  products: Product[] = [];

  ngOnInit(): void {
     this.loadProducts();
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.cdr.detectChanges();
      },
      error: (err) => {
        console.error('Error loading products:', err);
      }
    });
  }

  onProductCreated(product: Product) {
    this.products = [...this.products, product];
  }

}
