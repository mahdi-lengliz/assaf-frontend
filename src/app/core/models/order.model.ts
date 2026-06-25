export interface OrderItemRequest {
  productId: number;
  quantity: number;
}

export interface OrderCreateRequest {
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address: string;
  city: string;
  notes: string;
  items: OrderItemRequest[];
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  city: string;
  total: number;
  status: string;
}

export interface AdminStats {
  orders: number;
  pendingOrders: number;
  revenue: number;
  products: number;
}
