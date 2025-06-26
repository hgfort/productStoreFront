import { Component, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { OrdersService } from '../../services/orders';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { OrderRequest } from '../../interfaces/order-request.interface';
import { OrderResponse } from '../../interfaces/order-response.interface';
import { ProductsService } from '../../services/products';
import { ProductResponse } from '../../interfaces/product-response.interface';

@Component({
  selector: 'app-order-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './order-form.html',
  styleUrls: ['./order-form.scss']
})
export class OrderFormComponent implements OnInit {
  orderForm: FormGroup;
  isEditMode = false;
  orderId: number | null = null;
  products: ProductResponse[] = [];

  constructor(
    private fb: FormBuilder,
    private ordersService: OrdersService,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.orderForm = this.fb.group({
      customerId: ['', [Validators.required, Validators.min(1)]],
      orderAddress: ['', [Validators.required, Validators.minLength(3)]],
      items: this.fb.array([])
    });
  }

  ngOnInit(): void {
    this.loadProducts();

    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.orderId = +params['id'];
        this.loadOrder(this.orderId);
      }
    });
  }

  get items(): FormArray {
    return this.orderForm.get('items') as FormArray;
  }

  addItem(productId?: number, quantity: number = 1): void {
    this.items.push(this.fb.group({
      productId: [productId || '', [Validators.required, Validators.min(1)]],
      quantity: [quantity, [Validators.required, Validators.min(1)]]
    }));
  }

  removeItem(index: number): void {
    this.items.removeAt(index);
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (products) => this.products = products,
      error: (err) => console.error('Error loading products', err)
    });
  }

  loadOrder(id: number): void {
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.orderForm.patchValue({
          customerId: order.customerId,
          orderAddress: order.orderAddress
        });

        while (this.items.length) {
          this.items.removeAt(0);
        }

        order.items.forEach(item => {
          this.addItem(item.productId, item.quantity);
        });
      },
      error: (err) => console.error('Error loading order', err)
    });
  }

  onSubmit(): void {
    if (this.orderForm.invalid) {
      this.orderForm.markAllAsTouched();
      return;
    }

    const orderData: OrderRequest = this.orderForm.value;

    if (this.isEditMode && this.orderId) {
      this.ordersService.updateOrder(this.orderId, orderData).subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (err) => console.error('Error updating order', err)
      });
    } else {
      this.ordersService.createOrder(orderData).subscribe({
        next: () => this.router.navigate(['/orders']),
        error: (err) => console.error('Error creating order', err)
      });
    }
  }

  cancel(): void {
    this.router.navigate(['/orders']);
  }
  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedAmount} ₽`;
  }
}
