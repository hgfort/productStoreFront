import { Routes } from '@angular/router';
import { CustomersComponent } from './customers/customers';
import { OrdersComponent } from './orders/orders';
import { ProductsComponent } from './products/products';

export const routes: Routes = [
  { path: 'customers', component: CustomersComponent },
  { path: 'orders', component: OrdersComponent },
  { path: 'products', component: ProductsComponent },
  { path: '', redirectTo: '/customers', pathMatch: 'full' },
  { path: '**', redirectTo: '/customers' } 
];
