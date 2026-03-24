import { Component, inject, output } from '@angular/core';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-product-edit',
  imports: [FormsModule],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit {
   protected productService = inject(ProductService);
  isModalOpen = false;
  product: Product | null = null;
  productName = '';

  productUpdated = output<Product>();

  openModal(product: Product) {
    this.productService.getProduct(product.id).subscribe({
      next: (data) => {
        this.product = data;
        this.productName = data.name;
        this.isModalOpen = true;
      },
      error: (err) => {
        console.error('Error loading product:', err);
      }
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.product = null;
  }

  saveProduct() {
    if (!this.product || !this.productName.trim()) return;
    this.productService.updateProduct(this.product.id, this.productName).subscribe({
      next: (updated) => {
        this.productUpdated.emit(updated);
        this.closeModal();
      },
      error: (err) => {
        console.error('Error updating product:', err);
      }
    });
  }

  removeSparepart(sparepartId: string) {
    if (!this.product) return;
    this.productService.removeSparepart(this.product.id, sparepartId).subscribe({
      next: () => {
        this.product!.spareparts = this.product!.spareparts?.filter(s => s.id !== sparepartId);
      },
      error: (err) => {
        console.error('Error removing sparepart:', err);
      }
    });
  }
}
