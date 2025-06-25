import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ProductsService } from '../../services/products';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ProductRequest } from '../../interfaces/product-request.interface';
import { ProductResponse } from '../../interfaces/product-response.interface';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './product-form.html',
  styleUrls: ['./product-form.scss']
})
export class ProductFormComponent implements OnInit {
  productForm: FormGroup;
  isEditMode = false;
  productId: number | null = null;
  product: ProductResponse | null = null;

  constructor(
    private fb: FormBuilder,
    private productsService: ProductsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.productForm = this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]],
      price: ['', [Validators.required, Validators.min(0.01)]],
      description: ['', [Validators.required, Validators.maxLength(1000)]],
      manufacturer: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(100)]]
    });
  }

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      if (params['id']) {
        this.isEditMode = true;
        this.productId = +params['id'];
        this.loadProduct(this.productId);
      }
    });
  }

  loadProduct(id: number): void {
    this.productsService.getProductById(id).subscribe({
      next: (product) => {
        this.product = product;
        this.productForm.patchValue({
          title: product.title,
          price: product.price,
          description: product.description,
          manufacturer: product.manufacturer
        });
      },
      error: (err) => console.error('Error loading product', err)
    });
  }

  onSubmit(): void {
    if (this.productForm.invalid) {
      this.productForm.markAllAsTouched();
      return;
    }

    const productData: ProductRequest = this.productForm.value;

    if (this.isEditMode && this.productId) {
      this.productsService.updateProduct(this.productId, productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error updating product', err)
      });
    } else {
      this.productsService.createProduct(productData).subscribe({
        next: () => this.router.navigate(['/products']),
        error: (err) => console.error('Error creating product', err)
      });
    }
  }

  get title() { return this.productForm.get('title'); }
  get price() { return this.productForm.get('price'); }
  get description() { return this.productForm.get('description'); }
  get manufacturer() { return this.productForm.get('manufacturer'); }
}
