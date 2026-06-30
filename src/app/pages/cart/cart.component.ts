import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CartService } from '../../core/services/cart.service';
import { formatPrice } from '../../core/utils/format.utils';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    <div class="cart-wrap">
      <h1 class="page-title">Votre <em>Panier</em></h1>
      @if (cartService.cart$ | async; as cart) {
        @if (cart.length === 0) {
          <div class="empty-state"><div class="empty-ico">🛍</div><div class="empty-t">Votre panier est vide</div><div class="empty-s">Explorez notre collection de parfums ASSAF</div><button class="btn-dark" type="button" (click)="router.navigateByUrl('/collections')">Decouvrir les parfums →</button></div>
        } @else {
          <div class="cart-layout">
            <div>
              @for (item of cart; track item.id) {
                <div class="cart-item">
                  <div class="ci-img">@if (item.imageUrl) { <img [src]="item.imageUrl" [alt]="item.name" loading="lazy" decoding="async"> } @else { <span>{{ item.emoji || '🧴' }}</span> }</div>
                  <div><div class="ci-name">{{ item.name }}</div><div class="ci-sub">{{ item.sub }} @if (item.perfumeSize) { · {{ item.perfumeSize }} ML }</div><div class="ci-qty"><button class="ci-qb" type="button" (click)="cartService.update(item.id, item.qty - 1)">−</button><span>{{ item.qty }}</span><button class="ci-qb" type="button" (click)="cartService.update(item.id, item.qty + 1)">+</button><button class="ci-remove" type="button" (click)="cartService.update(item.id, 0)">Retirer</button></div></div>
                  <div><div class="ci-price">{{ formatPrice(item.price * item.qty) }}</div><div class="ci-unit">{{ formatPrice(item.price) }} / u</div></div>
                </div>
              }
            </div>
            <div class="sum-box"><div class="sum-title">Recapitulatif</div><div class="sum-row"><span>Sous-total</span><span>{{ formatPrice(cartService.total()) }}</span></div><div class="sum-row"><span>Livraison</span><span>{{ formatPrice(cartService.shipping()) }}</span></div><div class="sum-total"><span>Total</span><span>{{ formatPrice(cartService.total() + cartService.shipping()) }}</span></div><div class="cod-box"><span>💵</span><div><div class="cod-title">Paiement a la livraison</div><div class="cod-sub">Preparez le montant en especes.</div></div></div><button class="btn-full-dark" type="button" (click)="router.navigateByUrl('/checkout')">Confirmer la commande →</button><button class="btn-full-border" type="button" (click)="router.navigateByUrl('/collections')">Continuer mes achats</button></div>
          </div>
        }
      }
    </div>
  `
})
export class CartComponent {
  protected readonly formatPrice = formatPrice;
  constructor(public cartService: CartService, public router: Router) {}
}
