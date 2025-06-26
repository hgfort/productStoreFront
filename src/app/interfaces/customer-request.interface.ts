export interface CustomerRequest {
  name: string;
  phone: string;
  address: string;
  email: string;
}
export interface CustomerSearchRequest {
  name: string;
  exactMatch: boolean;
}
