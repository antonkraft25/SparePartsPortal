import { Component, inject, output } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { SparepartService } from '../../../core/services/sparepart-service';
import { ProductService } from '../../../core/services/product-service';
import { Sparepart } from '../../../types/sparepart';
import { Product } from '../../../types/product';
import { ToastService } from '../../../core/services/toast-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { AppValidators } from '../../../core/validators/app-validators';

@Component({
  selector: 'app-sparepart-create',
  imports: [ReactiveFormsModule, ValidationErrors],
  templateUrl: './sparepart-create.html',
  styleUrl: './sparepart-create.css',
})
export class SparepartCreate {
  private sparepartService = inject(SparepartService);
  private productService = inject(ProductService);
  private toastService = inject(ToastService);

  isModalOpen = false;
  currentStep = 1;
  products: Product[] = [];
  selectedProductIds: string[] = [];

  sparepartCreated = output<Sparepart>();

  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    location: new FormControl('', [Validators.required]),
    prize: new FormControl('', [
      Validators.required,
      AppValidators.numeric(),
      AppValidators.minValue(0),
    ]),
    purchasePrize: new FormControl('', [
      Validators.required,
      AppValidators.numeric(),
      AppValidators.minValue(0),
    ]),
    balance: new FormControl(0, [Validators.required, AppValidators.minValue(0)]),
  });

  openModal() {
    this.form.reset({ balance: 0 });
    this.selectedProductIds = [];
    this.currentStep = 1;
    this.loadProducts();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextStep() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  toggleProduct(productId: string) {
    if (this.selectedProductIds.includes(productId)) {
      this.selectedProductIds = this.selectedProductIds.filter((id) => id !== productId);
    } else {
      this.selectedProductIds = [...this.selectedProductIds, productId];
    }
  }

  isSelected(productId: string): boolean {
    return this.selectedProductIds.includes(productId);
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => (this.products = data),
      error: (err) => console.error('Error loading products:', err),
    });
  }

  saveSparepart() {
    if (this.form.invalid) return;

    this.sparepartService
      .createSparepart({
        name: this.form.value.name!,
        location: this.form.value.location!,
        prize: this.form.value.prize!,
        purchasePrize: this.form.value.purchasePrize!,
        balance: this.form.value.balance!,
        productIds: this.selectedProductIds,
      })
      .subscribe({
        next: (sparepart) => {
          this.toastService.success('Reservdel skapad!');
          this.sparepartCreated.emit(sparepart);
          this.closeModal();
        },
        error: (err) => {
          this.toastService.error('Något gick fel vid skapande!');
          console.error(err);
        },
      });
  }
}
