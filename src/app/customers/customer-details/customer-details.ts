import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CustomersService } from '../../services/customers';
import { CustomerResponse } from '../../interfaces/customer-response.interface';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.html',
  styleUrls: ['./customer-details.scss'],
  standalone: true,
  imports: [CommonModule, RouterModule]
})
export class CustomerDetailsComponent implements OnInit {
  customer: CustomerResponse | null = null;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private customersService: CustomersService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadCustomer(+id);
    }
  }

  loadCustomer(id: number): void {
    this.customersService.getCustomerById(id).subscribe({
      next: (customer) => {
        this.customer = customer;
      },
      error: (error) => {
        console.error('Error loading customer:', error);
      }
    });
  }

  viewOrder(orderId: number): void {
    this.router.navigate(['/orders', orderId]);
  }

  goBack(): void {
    this.router.navigate(['/customers']);
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


