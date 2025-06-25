import { OrderItemResponse } from './order-item-response.interface';
export interface OrderResponse {
  id: number;
  customerId: number;
  dateTime: string;
  totalAmount: number;
  orderAddress: string;
  items: OrderItemResponse[];
}
