import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { CartService } from '../../core/services/cart.service';
import { OrderStateService } from '../../core/services/order-state.service';
import { StoreService } from '../../core/services/store.service';
import { ToastService } from '../../core/services/toast.service';
import { formatPrice } from '../../core/utils/format.utils';

@Component({
  selector: 'app-checkout',
  standalone: true,
  imports: [AsyncPipe, FormsModule],
  template: `
    <div class="co-wrap">
      <h1 class="page-title">Finaliser ma <em>Commande</em></h1>
      <div class="co-grid">
        <form (ngSubmit)="submitOrder()">
          <div class="form-section"><div class="form-sec-title">Vos informations</div><div class="fg"><label>Nom complet *</label><input class="fi" [(ngModel)]="checkout.name" name="name" placeholder="Prenom et Nom"></div><div class="form-2"><div class="fg"><label>Email (optionnel)</label><input class="fi" [(ngModel)]="checkout.email" name="email"></div><div class="fg"><label>Telephone *</label><input class="fi" [(ngModel)]="checkout.phone" name="phone" placeholder="+216 XX XXX XXX"></div></div></div>
          <div class="form-section"><div class="form-sec-title">Adresse de livraison</div><div class="fg"><label>Adresse complete *</label><input class="fi" [(ngModel)]="checkout.address" name="address"></div><div class="fg"><label>Ville / Gouvernorat *</label><select class="fsel" [(ngModel)]="checkout.city" name="city"><option value="">Choisir votre ville...</option>@for (city of cities; track city) { <option [value]="city">{{ city }}</option> }</select></div><div class="fg"><label>Instructions (optionnel)</label><textarea class="fi" rows="3" [(ngModel)]="checkout.notes" name="notes"></textarea></div></div>
          <div class="form-section"><div class="form-sec-title">Mode de paiement</div><div class="pay-method"><span class="pm-icon">💵</span><div><div class="pm-title">Cash à la Livraison — Uniquement</div><div class="pm-sub">Préparez le montant exact. Notre livreur vous appellera 30 min avant.</div></div></div></div>
          <button class="btn-full-dark checkout-submit" type="submit" [disabled]="orderLoading">
            @if (orderLoading) { <span class="checkout-spinner"></span><span>Commande en cours...</span> }
            @else { <span>Confirmer · {{ formatPrice(cartService.total() + cartService.shipping()) }} cash →</span> }
          </button>
        </form>
        <div class="order-box"><div class="ob-title">Ma commande</div>@if (cartService.cart$ | async; as cart) { @for (item of cart; track item.id) { <div class="ob-item">@if (item.imageUrl) { <img class="ob-img" [src]="item.imageUrl" [alt]="item.name" loading="lazy" decoding="async"> } @else { <span class="ob-fallback">{{ item.emoji || '🧴' }}</span> }<div class="ob-info"><div class="ob-name">{{ item.name }}</div><div class="ob-qty">×{{ item.qty }} · {{ item.size || (item.perfumeSize ? item.perfumeSize + ' ML' : '') }}</div></div><span class="ob-price">{{ formatPrice(item.price * item.qty) }}</span></div> } }<div class="ob-shipping"><span>Livraison</span><span>{{ cartService.shipping() === 0 ? 'Gratuite' : formatPrice(cartService.shipping()) }}</span></div><div class="sum-total"><span>Total</span><span>{{ formatPrice(cartService.total() + cartService.shipping()) }}</span></div></div>
      </div>
    </div>
  `
})
export class CheckoutComponent {
  protected readonly formatPrice = formatPrice;
  orderLoading = false;
  checkout = { name: '', email: '', phone: '', address: '', city: '', notes: '' };
  cities = ['Tunis', 'Ariana', 'Ben Arous', 'Manouba', 'Nabeul', 'Bizerte', 'Beja', 'Jendouba', 'Kef', 'Siliana', 'Sousse', 'Monastir', 'Mahdia', 'Sfax', 'Kairouan', 'Kasserine', 'Sidi Bouzid', 'Gabes', 'Medenine', 'Tataouine', 'Gafsa', 'Tozeur', 'Kebili', 'Zaghouan'];

  constructor(public cartService: CartService, private apiService: ApiService, private orderStateService: OrderStateService, private toastService: ToastService, private storeService: StoreService, private router: Router) {}

  submitOrder(): void {
    if (!this.checkout.name.trim() || !this.checkout.phone.match(/[0-9]{8}/) || !this.checkout.address.trim() || !this.checkout.city) {
      this.toastService.show('Verifiez les champs obligatoires', 'err');
      return;
    }
    this.orderLoading = true;
    this.apiService.createOrder({
      customerName: this.checkout.name,
      customerEmail: this.checkout.email,
      customerPhone: this.checkout.phone,
      address: this.checkout.address,
      city: this.checkout.city,
      notes: this.checkout.notes,
      items: this.cartService.items.map(item => ({ productId: item.id, quantity: item.qty }))
    }).subscribe({
      next: order => {
        this.orderStateService.ref = order.orderNumber;
        this.cartService.clear();
        this.storeService.load();
        this.router.navigateByUrl('/success');
      },
      error: error => {
        this.orderLoading = false;
        this.toastService.show(error?.error?.message || 'Commande impossible', 'err');
      }
    });
  }
}
