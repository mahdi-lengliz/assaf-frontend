import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class CartService {
  private readonly storageKey = 'lvn_cart';
  private readonly cartSubject = new BehaviorSubject<CartItem[]>(this.readCart());

  readonly cart$ = this.cartSubject.asObservable();

  get items(): CartItem[] {
    return this.cartSubject.value;
  }

  add(product: Product, quantity = 1): void {
    const existing = this.items.find(item => item.id === product.id);
    const items = existing
      ? this.items.map(item => item.id === product.id ? { ...item, qty: item.qty + quantity } : item)
      : [...this.items, { ...product, qty: quantity }];
    this.setItems(items);
  }

  update(productId: number, quantity: number): void {
    const items = quantity < 1
      ? this.items.filter(item => item.id !== productId)
      : this.items.map(item => item.id === productId ? { ...item, qty: quantity } : item);
    this.setItems(items);
  }

  clear(): void {
    this.setItems([]);
  }

  count(): number {
    return this.items.reduce((sum, item) => sum + item.qty, 0);
  }

  total(): number {
    return this.items.reduce((sum, item) => sum + item.price * item.qty, 0);
  }

  shipping(): number {
    return this.items.length === 0 ? 0 : 15;
  }

  private setItems(items: CartItem[]): void {
    this.cartSubject.next(items);
    localStorage.setItem(this.storageKey, JSON.stringify(items));
  }

  private readCart(): CartItem[] {
    try {
      return JSON.parse(localStorage.getItem(this.storageKey) || '[]');
    } catch {
      return [];
    }
  }
}
