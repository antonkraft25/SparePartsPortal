import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';

@Component({
  selector: 'app-product-create',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './product-create.html',
  styleUrl: './product-create.css',
})
export class ProductCreate {
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  productCreated = output<Product>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
  });

  openModal() {
    this.form.reset();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  saveProduct() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.productService.createProduct(this.form.value.name!).subscribe({
      next: (product) => {
        this.toastService.success('Produkt skapad!');
        this.productCreated.emit(product);
        this.closeModal();
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid skapande!');
        console.error(err);
      },
    });
  }
}
