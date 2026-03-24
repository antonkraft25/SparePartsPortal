import { Component, inject, output } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-create',
  imports: [FormsModule],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
  protected productService = inject(ProductService);
  isModalOpen = false;
  productName = '';

  productCreated = output<Product>();

  openModal() {
    this.isModalOpen = true;
    this.productName = '';
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveProduct() {
    if (!this.productName.trim()) return;
    this.productService.createProduct(this.productName).subscribe({
      next: (product) => {
        this.productCreated.emit(product);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error creating product:', err);
      }
    });
  }
}
