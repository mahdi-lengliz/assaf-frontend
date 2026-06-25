import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { API_URL } from '../config/api.config';
import { Category } from '../models/category.model';
import { Product, ProductRequest } from '../models/product.model';
import { AdminStats, Order, OrderCreateRequest } from '../models/order.model';

@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly api = API_URL;

  constructor(private http: HttpClient, private authService: AuthService) {}

  getCategories(): Observable<Category[]> {
    return this.http.get<Category[]>(`${this.api}/categories`);
  }

  getProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.api}/products`);
  }

  getProduct(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.api}/products/${id}`);
  }

  createOrder(request: OrderCreateRequest): Observable<Order> {
    return this.http.post<Order>(`${this.api}/orders`, request);
  }

  getAdminOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(`${this.api}/admin/orders`, { headers: this.authService.authHeaders() });
  }

  getAdminStats(): Observable<AdminStats> {
    return this.http.get<AdminStats>(`${this.api}/admin/stats`, { headers: this.authService.authHeaders() });
  }

  updateOrderStatus(id: number, status: string): Observable<Order> {
    return this.http.patch<Order>(`${this.api}/admin/orders/${id}/status`, { status }, { headers: this.authService.authHeaders() });
  }

  createProduct(request: ProductRequest): Observable<Product> {
    return this.http.post<Product>(`${this.api}/admin/products`, request, { headers: this.authService.authHeaders() });
  }

  updateProduct(id: number, request: ProductRequest): Observable<Product> {
    return this.http.put<Product>(`${this.api}/admin/products/${id}`, request, { headers: this.authService.authHeaders() });
  }

  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api}/admin/products/${id}`, { headers: this.authService.authHeaders() });
  }

  uploadProductImage(file: File): Observable<{ url: string }> {
    const formData = new FormData();
    formData.append('file', file);
    return this.http.post<{ url: string }>(`${this.api}/admin/uploads/product-image`, formData, { headers: this.authService.authHeaders() });
  }
}
