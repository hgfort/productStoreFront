import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProductsService } from '../services/products';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { ProductResponse } from '../interfaces/product-response.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './products.html',
  styleUrls: ['./products.scss']
})
export class ProductsComponent implements OnInit {
  products: ProductResponse[] = [];
  searchId: number | null = null;
  foundProduct: ProductResponse | null = null;
  errorMessage: string | null = null;

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
    this.router.navigate(['/products/edit', id]);
  }
  searchById(): void {
    if (!this.searchId) return;

    this.errorMessage = null;
    this.foundProduct = null;

    this.productsService.getProductById(this.searchId).subscribe({
      next: (product) => {
        this.foundProduct = product;
      },
      error: (err) => {
        this.errorMessage = 'Product not found';
        console.error('Search error', err);
      }
    });
  }

  clearSearch(): void {
    this.searchId = null;
    this.foundProduct = null;
    this.errorMessage = null;
  }
}
