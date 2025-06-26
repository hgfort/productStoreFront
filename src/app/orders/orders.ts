import { Component, OnInit } from '@angular/core';
import { OrdersService } from '../services/orders';
import { OrderResponse } from '../interfaces/order-response.interface';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-orders',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './orders.html',
  styleUrls: ['./orders.scss']
})
export class OrdersComponent implements OnInit {
  orders: OrderResponse[] = [];
  filteredOrders: OrderResponse[] = [];
  searchId: string = '';
  displayedColumns: string[] = ['ID', 'ID покупателя', 'Дата', 'Общая сумма', 'Адресс', 'Действия'];

  constructor(
    private ordersService: OrdersService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.ordersService.getAllOrders().subscribe({
      next: (data) => {
        this.orders = data;
        this.filteredOrders = [...data];
      },
      error: (err) => console.error('Ошибказагрузки заказов', err)
    });
  }

  searchById(): void {
    if (!this.searchId) {
      this.filteredOrders = [...this.orders];
      return;
    }

    const id = parseInt(this.searchId);
    if (isNaN(id)) {
      this.filteredOrders = [];
      return;
    }

    this.ordersService.getOrderById(id).subscribe({
      next: (order) => {
        this.filteredOrders = order ? [order] : [];
      },
      error: (err) => {
        console.error('Search error', err);
        this.filteredOrders = [];
      }
    });
  }

  clearSearch(): void {
    this.searchId = '';
    this.filteredOrders = [...this.orders];
  }

  deleteOrder(id: number): void {
    if (confirm('Точно хотите удалить заказ?')) {
      this.ordersService.deleteOrder(id).subscribe({
        next: () => {
          this.orders = this.orders.filter(o => o.id !== id);
          this.filteredOrders = this.filteredOrders.filter(o => o.id !== id);
        },
        error: (err) => console.error('Ошибка удаления', err)
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
  formatDateTime(dateString: string): string {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, '0');
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const year = date.getFullYear();
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');

    return `${day}.${month}.${year} ${hours}:${minutes}`;
  }
  formatCurrency(amount: number): string {
    const formattedAmount = amount.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ' ');
    return `${formattedAmount} ₽`;
  }
}
