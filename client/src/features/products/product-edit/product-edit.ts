import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-product-edit',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './product-edit.html',
  styleUrl: './product-edit.css',
})
export class ProductEdit {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  product: Product | null = null;
  productUpdated = output<Product>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  openModal(product: Product) {
    this.productService.getProduct(product.id).subscribe({
      next: (data) => {
        this.product = data;
        this.form.patchValue({ name: data.name });
        this.isModalOpen = true;
      },
      error: (err) => console.error('Error loading product:', err),
    });
  }

  closeModal() {
    this.isModalOpen = false;
    this.product = null;
  }

  saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.productService.updateProduct(this.product!.id, this.form.value.name!).subscribe({
      next: (updated) => {
        this.toastService.success('Produkt uppdaterad!');
        this.productUpdated.emit(updated);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid uppdatering!');
        console.error(err);
      },
    });
  }

  removeSparepart(sparepartId: string) {
    if (!this.product) return;
    this.productService.removeSparepart(this.product.id, sparepartId).subscribe({
      next: () => {
        this.toastService.success('Reservdel borttagen från produkt!');
        this.product!.spareparts = this.product!.spareparts?.filter((s) => s.id !== sparepartId);
      },
      error: (err) => {
        this.toastService.error('Något gick fel!');
        console.error(err);
      },
    });
  }
}
