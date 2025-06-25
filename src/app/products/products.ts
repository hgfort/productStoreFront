import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../interfaces/product-response.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductResponse[] = [];

  constructor(
    private productsService: ProductsService,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts(): void {
    this.productsService.getAllProducts().subscribe({
      next: (data) => this.products = data,
      error: (err) => console.error('Error loading products', err)
    });
  }

  deleteProduct(id: number): void {
    if (confirm('Are you sure you want to delete this product?')) {
      this.productsService.deleteProduct(id).subscribe({
        next: () => {
          // Удаляем продукт из локального массива вместо перезагрузки всех данных
          this.products = this.products.filter(p => p.id !== id);
        },
        error: (err) => console.error('Error deleting product', err)
      });
    }
  }

  createNewProduct(): void {
    this.router.navigate(['/products/new']);
  }
  editProduct(id: number): void {
    alert(`Editing product ${id}. Will be implemented later.`);
  }
}
