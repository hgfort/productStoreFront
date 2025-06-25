import { OrderResponse } from './order-response.interface';
export interface CustomerResponse {
  id: number;
  name: string;
  phone: string;
  address: string;
  email: string;
  orders: OrderResponse[];
}
