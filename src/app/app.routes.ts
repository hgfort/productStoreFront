import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers';
import { OrdersComponent } from './orders/orders';
import { ProductsComponent } from './products/products';
import { ProductFormComponent } from './products/product-form/product-form';
import { OrderFormComponent } from './orders/order-form/order-form';
import { OrderDetailsComponent } from './orders/order-details/order-details';
import { CustomerDetailsComponent } from './customers/customer-details/customer-details';
import { CustomerFormComponent } from './customers/customer-form/customer-form';

export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'customers/new', component: CustomerFormComponent },
  { path: 'customers/edit/:id', component: CustomerFormComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'products', component: ProductsComponent },
  { path: 'products/new', component: ProductFormComponent },
  { path: 'products/edit/:id', component: ProductFormComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'orders/new', component: OrderFormComponent },
  { path: 'orders/edit/:id', component: OrderFormComponent },
  { path: 'orders/:id', component: OrderDetailsComponent },
  { path: 'customers/:id', component: CustomerDetailsComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: '**', redirectTo: '/customers' } 
];
