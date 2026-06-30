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

export interface OrderItem {
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  perfumeSize: number | null;
  imageUrl: string | null;
  emoji: string | null;
}

export interface Order {
  id: number;
  orderNumber: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  city: string;
  total: number;
  status: string;
  items: OrderItem[];
}

export interface AdminStats {
  orders: number;
  pendingOrders: number;
  revenue: number;
  products: number;
}
