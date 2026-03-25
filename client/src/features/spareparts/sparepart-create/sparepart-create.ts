import { Component, inject, output } from '@angular/core';
import { SparepartService } from '../../../core/services/sparepart-service';
import { ProductService } from '../../../core/services/product-service';
import { Product } from '../../../types/product';
import { Sparepart } from '../../../types/sparepart';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-sparepart-create',
  imports: [FormsModule],
  templateUrl: './sparepart-create.html',
  styleUrl: './sparepart-create.css',
})
export class SparepartCreate {
  protected sparepartService = inject(SparepartService);
  protected productService = inject(ProductService);

  isModalOpen = false;
  currentStep = 1;

  name = '';
  location = '';
  prize = '';
  purchasePrize = '';
  balance = 0;

  products: Product[] = [];
  selectedProductIds: string[] = [];

  sparepartCreated = output<Sparepart>();

  openModal() {
    this.resetForm();
    this.loadProducts();
    this.isModalOpen = true;
  }

  closeModal() {
    this.isModalOpen = false;
  }

  nextStep() {
    if (!this.name.trim() || !this.location.trim() || !this.prize.trim() || !this.purchasePrize.trim()) return;
    this.currentStep = 2;
  }

  prevStep() {
    this.currentStep = 1;
  }

  toggleProduct(productId: string) {
    if (this.selectedProductIds.includes(productId)) {
      this.selectedProductIds = this.selectedProductIds.filter(id => id !== productId);
    } else {
      this.selectedProductIds = [...this.selectedProductIds, productId];
    }
  }

  isSelected(productId: string): boolean {
    return this.selectedProductIds.includes(productId);
  }

  loadProducts() {
    this.productService.getProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products:', err)
    });
  }

  saveSparepart() {
    if (!this.name.trim()) return;
    this.sparepartService.createSparepart({
      name: this.name,
      location: this.location,
      prize: this.prize,
      purchasePrize: this.purchasePrize,
      balance: this.balance,
      productIds: this.selectedProductIds
    }).subscribe({
      next: (sparepart) => {
        this.sparepartCreated.emit(sparepart);
        this.closeModal();
      },
      error: (err) => console.error('Error creating sparepart:', err)
    });
  }

  resetForm() {
    this.currentStep = 1;
    this.name = '';
    this.location = '';
    this.prize = '';
    this.purchasePrize = '';
    this.balance = 0;
    this.selectedProductIds = [];
  }
}
