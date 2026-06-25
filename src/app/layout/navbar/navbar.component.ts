import { CommonModule } from '@angular/common';
import { Component, HostListener } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CartService } from '../../core/services/cart.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <div class="promo">🚚 Livraison gratuite des 300 TND · Partout en Tunisie · Paiement a la livraison 💵</div>
    <nav [class.solid]="solidNav || mobileOpen">
      <a class="brand" routerLink="/">
        <span class="logo">ASSAF<span class="logo-sub">To Be Different · Tunisie</span></span>
      </a>
      <ul class="nav-links">
        @for (link of navLinks; track link.path) {
          <li><a [routerLink]="link.path" routerLinkActive="active" [routerLinkActiveOptions]="link.exact ? { exact: true } : { exact: false }">{{ link.label }}</a></li>
        }
      </ul>
      <div class="nav-r">
        <button class="nav-admin" type="button" (click)="router.navigateByUrl('/admin')">Admin</button>
        <button class="nav-cart" type="button" (click)="router.navigateByUrl('/cart')"><span class="cart-icon" aria-hidden="true">🛍</span> Panier @if (cartService.count() > 0) { <span class="cart-badge">{{ cartService.count() }}</span> }</button>
        <button class="ham" type="button" (click)="mobileOpen = !mobileOpen"><span></span><span></span><span></span></button>
      </div>
    </nav>
    @if (mobileOpen) {
      <div class="mob open">
        @for (link of mobileLinks; track link.path) {
          <a [routerLink]="link.path" (click)="mobileOpen = false">{{ link.label }}</a>
        }
      </div>
    }
  `
})
export class NavbarComponent {
  solidNav = false;
  mobileOpen = false;
  navLinks = [
    { label: 'Accueil', path: '/', exact: true },
    { label: 'Pour Elle', path: '/elle' },
    { label: 'Pour Lui', path: '/lui' },
    { label: 'Unisex', path: '/unisex' },
    { label: 'Collections Exclusives', path: '/exclusives' }
  ];
  mobileLinks = [...this.navLinks, { label: 'Panier', path: '/cart' }];

  constructor(public cartService: CartService, public router: Router) {}

  @HostListener('window:scroll')
  onScroll(): void {
    this.solidNav = window.scrollY > 30;
  }
}
