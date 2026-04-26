import { Component, Input, output, input } from '@angular/core';

@Component({
  selector: 'app-quantity-control',
  templateUrl: './quantity-control.html',
  styleUrl: './quantity-control.css',
})
export class QuantityControl {
  @Input() quantity = 0;
  @Input() min = 0;
  @Input() max = 9999;

  quantityChange = output<number>();

  increment() {
    if (this.quantity < this.max) {
      this.quantity++;
      this.quantityChange.emit(this.quantity);
    }
  }

  decrement() {
    if (this.quantity > this.min) {
      this.quantity--;
      this.quantityChange.emit(this.quantity);
    }
  }

  onInputChange(event: Event) {
    const value = parseInt((event.target as HTMLInputElement).value);
    if (!isNaN(value) && value >= this.min && value <= this.max) {
      this.quantity = value;
      this.quantityChange.emit(this.quantity);
    }
  }
}