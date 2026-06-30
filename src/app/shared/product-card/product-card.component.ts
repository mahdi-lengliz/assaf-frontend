import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { CartService } from '../../core/services/cart.service';
import { ToastService } from '../../core/services/toast.service';
import { badgeClass, formatPrice, stockInfo } from '../../core/utils/format.utils';

@Component({
  selector: 'app-product-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <button class="prod-card" type="button" (click)="openProduct()">
      <span class="prod-img">
        @if (product.imageUrl) { <img [src]="product.imageUrl" [alt]="product.name" loading="lazy" decoding="async"> }
        @else { <span class="prod-emoji">{{ product.emoji || '🧴' }}</span> }
        @if (product.badge) { <span class="prod-badge" [ngClass]="badgeClass(product.badge)">{{ product.badge }}</span> }
        <span class="stock-tag" [ngClass]="stockInfo(product.stock).cls">{{ stockInfo(product.stock).label }}</span>
        <span class="prod-hover">
          <span class="btn-add" (click)="addToCart($event)">{{ stockInfo(product.stock).canBuy ? '+ Ajouter au panier' : 'Rupture de stock' }}</span>
        </span>
      </span>
      <span class="prod-info">
        <span class="prod-name">{{ product.name }}</span>
        <span class="prod-sub">@if (product.perfumeSize) { Contenance : {{ product.perfumeSize }} ml }</span>
        <span class="prod-bot"><span class="prod-price">{{ formatPrice(product.price) }}</span><span class="prod-see">Voir →</span></span>
      </span>
    </button>
  `
})
export class ProductCardComponent {
  @Input({ required: true }) product!: Product;
  protected readonly formatPrice = formatPrice;
  protected readonly stockInfo = stockInfo;
  protected readonly badgeClass = badgeClass;

  constructor(private router: Router, private cartService: CartService, private toastService: ToastService) {}

  openProduct(): void {
    this.router.navigate(['/product', this.product.id]);
  }

  addToCart(event: Event): void {
    event.stopPropagation();
    if (!stockInfo(this.product.stock).canBuy) return;
    this.cartService.add(this.product);
    this.toastService.show(`${this.product.name} ajoute au panier`);
  }
}
