import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders';
import { OrderResponse } from '../interfaces/order-response.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  displayedColumns: string[] = ['id', 'customerId', 'date', 'totalAmount', 'address', 'actions'];

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getAllOrders().subscribe({
      next: (data) => this.orders = data,
      error: (err) => console.error('Error loading orders', err)
    });
  }

  deleteOrder(id: number): void {
    if (confirm('Точно удаляем?')) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => this.orders = this.orders.filter(o => o.id !== id),
        error: (err) => console.error('Error deleting order', err)
      });
    }
  }

  editOrder(id: number): void {
    this.router.navigate(['/orders/edit', id]);
  }

  viewOrderDetails(id: number): void {
    this.router.navigate(['/orders', id]);
  }
  createNewOrder(): void {
    this.router.navigate(['/orders/new']);
  }
}
