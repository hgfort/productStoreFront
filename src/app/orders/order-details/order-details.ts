import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { OrdersService } from '../../services/orders';
import { OrderResponse } from '../../interfaces/order-response.interface';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-order-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './order-details.html',
  styleUrls: ['./order-details.scss']
})
export class OrderDetailsComponent implements OnInit {
  order: OrderResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private ordersService: OrdersService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.ordersService.getOrderById(id).subscribe({
      next: (order) => this.order = order,
      error: (err) => console.error('Error loading order', err)
    });
  }
}
