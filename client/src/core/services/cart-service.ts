import { Injectable, signal, computed } from '@angular/core';
import { Sparepart } from '../../types/sparepart';

export type CartItem = {
  sparepart: Sparepart;
  quantity: number;
};

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey = 'cart';
  items = signal<CartItem[]>(this.loadFromStorage());

  totalItems = computed(() =>
    this.items().reduce((sum, item) => sum + item.quantity, 0)
  );

  private loadFromStorage(): CartItem[] {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : [];
  }

  private saveToStorage() {
    localStorage.setItem(this.storageKey, JSON.stringify(this.items()));
  }

  addItem(sparepart: Sparepart, quantity: number) {
    if (quantity <= 0) return;

    const existing = this.items().find(i => i.sparepart.id === sparepart.id);
    if (existing) {
      this.items.update(items =>
        items.map(i =>
          i.sparepart.id === sparepart.id
            ? { ...i, quantity: i.quantity + quantity }
            : i
        )
      );
    } else {
      this.items.update(items => [...items, { sparepart, quantity }]);
    }
    this.saveToStorage();
  }

  updateQuantity(sparepartId: string, quantity: number) {
    if (quantity <= 0) {
      this.removeItem(sparepartId);
      return;
    }
    this.items.update(items =>
      items.map(i =>
        i.sparepart.id === sparepartId ? { ...i, quantity } : i
      )
    );
    this.saveToStorage();
  }

  removeItem(sparepartId: string) {
    this.items.update(items => items.filter(i => i.sparepart.id !== sparepartId));
    this.saveToStorage();
  }

  clearCart() {
    this.items.set([]);
    localStorage.removeItem(this.storageKey);
  }
}