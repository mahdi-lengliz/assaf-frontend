import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Product } from '../../core/models/product.model';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { StoreService } from '../../core/services/store.service';
import { ToastService } from '../../core/services/toast.service';
import { categoryLabel, formatPrice, stockInfo } from '../../core/utils/format.utils';
import { FooterComponent } from '../../layout/footer/footer.component';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule, FooterComponent],
  template: `
    @if (product) {
      <div class="detail-wrap">
        <div class="detail-media">
          <div class="detail-img-box">
            @if (images().length > 0) { <img [src]="images()[activeImage]" [alt]="product.name" fetchpriority="high" decoding="async"> }
            @else { <span class="detail-emoji">{{ product.emoji || '🧴' }}</span> }
          </div>
          @if (images().length > 1) {
            <button class="detail-arrow detail-prev" type="button" aria-label="Image precedente" (click)="prevImage()">‹</button>
            <button class="detail-arrow detail-next" type="button" aria-label="Image suivante" (click)="nextImage()">›</button>
            <div class="detail-dots">
              @for (image of images(); track image; let index = $index) {
                <button type="button" [class.active]="activeImage === index" (click)="activeImage = index" [attr.aria-label]="'Afficher image ' + (index + 1)"></button>
              }
            </div>
          }
        </div>
        <div>
          <div class="breadcrumb"><button type="button" (click)="router.navigateByUrl('/')">Accueil</button><span>/</span><button type="button" (click)="router.navigateByUrl('/collections')">Parfums</button><span>/</span><span>{{ product.name }}</span></div>
          <div class="d-cat">{{ productCategoryLabel() }} · Authentique</div>
          <h1 class="d-name">{{ product.name }}</h1><div class="d-sub">{{ product.sub || 'Eau de Parfum' }}</div>
          @if (product.perfumeSize) { <div class="d-size">Contenance : {{ product.perfumeSize }} ML</div> }
          <div class="d-price">{{ formatPrice(product.price) }}</div><div class="d-stock" [ngClass]="stockInfo(product.stock).cls">{{ stockInfo(product.stock).label }}</div>
          <p class="d-desc">{{ product.description }}</p>
          @if (product.notes.length) { <div class="notes-label">Notes Olfactives</div><div class="notes-row">@for (note of product.notes; track note) { <span class="note-tag">{{ note }}</span> }</div> }
          @if (stockInfo(product.stock).canBuy) { <div class="qty-selector"><span class="qty-label">Quantité</span><button class="qty-b" type="button" aria-label="Diminuer la quantité" (click)="qty = max(1, qty - 1)">−</button><span class="qty-n">{{ qty }}</span><button class="qty-b" type="button" aria-label="Augmenter la quantité" (click)="qty = min(product.stock, qty + 1)">+</button></div> }
          <div class="d-actions"><button class="btn-full-dark" type="button" [disabled]="!stockInfo(product.stock).canBuy" (click)="addCart()">{{ stockInfo(product.stock).canBuy ? 'Ajouter au panier · ' + formatPrice(product.price * qty) : 'Rupture de stock' }}</button>@if (stockInfo(product.stock).canBuy) { <button class="btn-full-border" type="button" (click)="buyNow()">Commander maintenant →</button> }</div>
          <div class="trust-row"><span class="trust-item">✅ 100% Authentique</span><span class="trust-item">💵 Cash livraison</span><span class="trust-item">🚚 Livraison 2-5j</span><span class="trust-item">↻ Retour facile</span></div>
        </div>
      </div>
      <app-footer></app-footer>
    }
  `
})
export class ProductDetailComponent implements OnInit {
  product: Product | null = null;
  activeImage = 0;
  qty = 1;
  max = Math.max;
  min = Math.min;
  protected readonly formatPrice = formatPrice;
  protected readonly stockInfo = stockInfo;

  constructor(private route: ActivatedRoute, private apiService: ApiService, private cartService: CartService, private toastService: ToastService, private storeService: StoreService, public router: Router) {}

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    this.product = this.storeService.products.find(item => item.id === id) || null;
    if (!this.product) {
      this.apiService.getProduct(id).subscribe(product => this.product = { ...product, price: Number(product.price), notes: product.notes || [], collection: Boolean(product.collection || product.isCollection) });
    }
  }

  images(): string[] {
    if (!this.product) return [];
    return [this.product.imageUrl, this.product.imageUrl2, this.product.imageUrl3, this.product.imageUrl4].filter(Boolean) as string[];
  }

  prevImage(): void {
    const total = this.images().length;
    if (total < 2) return;
    this.activeImage = this.activeImage === 0 ? total - 1 : this.activeImage - 1;
  }

  nextImage(): void {
    const total = this.images().length;
    if (total < 2) return;
    this.activeImage = this.activeImage === total - 1 ? 0 : this.activeImage + 1;
  }

  productCategoryLabel(): string {
    if (!this.product) return 'ASSAF';
    const category = this.storeService.categories.find(item => item.id === this.product?.categoryId);
    return category ? categoryLabel(category.name) : 'ASSAF';
  }

  addCart(): void {
    if (!this.product) return;
    this.cartService.add(this.product, this.qty);
    this.toastService.show(`${this.product.name} ajouté au panier`);
  }

  buyNow(): void {
    this.addCart();
    this.router.navigateByUrl('/checkout');
  }
}
