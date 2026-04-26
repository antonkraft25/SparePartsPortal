import { Component, inject, OnInit } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CartService } from '../../../core/services/cart-service';
import { CustomerService } from '../../../core/services/customer-service';
import { AccountService } from '../../../core/services/account-service';
import { ToastService } from '../../../core/services/toast-service';
import { OrderService } from '../../../core/services/order-service';
import { ValidationErrors } from '../../../shared/components/validation-errors/validation-errors';
import { QuantityControl } from '../../../shared/quantity-control/quantity-control';
import { AppValidators } from '../../../core/validators/app-validators';

@Component({
  selector: 'app-order-new',
  imports: [ReactiveFormsModule, ValidationErrors, QuantityControl],
  templateUrl: './order-new.html',
  styleUrl: './order-new.css',
})
export class OrderNew implements OnInit {
  protected cartService = inject(CartService);
  private customerService = inject(CustomerService);
  private accountService = inject(AccountService);
  private toastService = inject(ToastService);
  private orderService = inject(OrderService);
  private router = inject(Router);

  form = new FormGroup({
    streetName: new FormControl('', [Validators.required]),
    city: new FormControl('', [Validators.required]),
    postalcode: new FormControl('', [Validators.required, AppValidators.postalCode()])
  });

  ngOnInit(): void {
    this.loadCustomerAddress();
  }

  loadCustomerAddress() {
    const user = this.accountService.currentUser();
    if (!user) return;

    this.customerService.getCustomer(user.customerId).subscribe({
      next: (customer) => {
        this.form.patchValue({
          streetName: customer.streetName,
          city: customer.city,
          postalcode: customer.postalcode
        });
      },
      error: (err) => console.error('Error loading customer:', err)
    });
  }

  updateQuantity(sparepartId: string, quantity: number) {
    this.cartService.updateQuantity(sparepartId, quantity);
  }

  removeItem(sparepartId: string) {
    this.cartService.removeItem(sparepartId);
  }

  placeOrder() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    if (this.cartService.items().length === 0) {
      this.toastService.warning('Varukorgen är tom!');
      return;
    }

    const order = {
      deliveryAddress: this.form.value,
      items: this.cartService.items().map(i => ({
        sparepartId: i.sparepart.id,
        quantity: i.quantity
      }))
    };

    this.orderService.createOrder(order).subscribe({
      next: () => {
        this.toastService.success('Order lagd!');
        this.cartService.clearCart();
        this.router.navigateByUrl('/');
      },
      error: (err) => {
        this.toastService.error('Något gick fel vid beställning!');
        console.error(err);
      }
    });
  }
}