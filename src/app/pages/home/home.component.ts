import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { StoreService } from '../../core/services/store.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FooterComponent, ProductCardComponent],
  template: `
    <div class="hero">
      <div class="hero-left">
        <div class="hero-tag">Revendeur Officiel · Tunisie</div>
        <h1 class="hero-h1"><em>Greatness</em> or <em>Nothing</em>.</h1>
        <p class="hero-p">Une sélection de parfums de luxe, désormais disponible partout en Tunisie. Livraison rapide, paiement à la réception.</p>
        <div class="hero-ctas"><button class="btn-dark" type="button" (click)="router.navigateByUrl('/collections')">Découvrir la Collection →</button></div>
      </div>
      <div class="hero-right">
        <video class="hero-video" autoplay muted [muted]="true" [defaultMuted]="true" [volume]="0" loop playsinline preload="auto" aria-label="Campagne ASSAF">
          <source src="/assaf-baniere.mp4" type="video/mp4">
        </video>
        <div class="hero-video-overlay"></div>
      </div>
    </div>
    <div class="banners">@for (banner of banners; track banner.title) { <button class="banner" type="button" (click)="router.navigateByUrl(banner.path)"><span class="banner-tag">{{ banner.tag }}</span><span class="banner-title">{{ banner.title }}</span><span class="banner-sub">{{ banner.sub }}</span><span class="banner-link">Découvrir →</span></button> }</div>
    <div class="promo-banners">@for (banner of promoBanners; track banner.tag) { <button class="promo-banner" type="button" (click)="openPromo(banner.productId, banner.prodName, banner.path)"><img [src]="banner.img" [alt]="banner.tag" loading="lazy" decoding="async"><span class="promo-banner-overlay"></span><span class="promo-banner-content"><span class="promo-banner-tag">{{ banner.tag }}</span><span class="promo-banner-title">{{ banner.title }}</span><span class="promo-banner-sub">{{ banner.sub }}</span><span class="promo-banner-btn">{{ banner.btn }} →</span></span></button> }</div>
    <section class="band">
      <div class="sec-head"><div class="sec-tag">Les plus populaires</div><h2 class="sec-h2">Best <em>Sellers</em></h2><div class="sec-line"></div><p class="sec-p">Les parfums ASSAF les plus demandés, disponibles en Tunisie.</p></div>
      <div class="prod-grid">@for (product of bestSellers$ | async; track product.id) { <app-product-card [product]="product"></app-product-card> }</div>
      <div class="center mt"><button class="btn-border" type="button" (click)="router.navigateByUrl('/collections')">Voir tous les parfums →</button></div>
    </section>
    <section><div class="story-grid"><div class="story-img"><img src="/assaf-story-logo-v1.webp" alt="ASSAF" loading="lazy" decoding="async"></div><div><div class="story-tag">À propos</div><h2 class="story-h">L'univers <em>ASSAF</em></h2><p class="story-p">Bonjour, je suis Assaf. Mon histoire a commencé en 1988, au cœur du désert ancestral du Najd, entre dunes dorées, chevaux sauvages et effluves envoûtants d'oud.</p><p class="story-p">En 2021, une vision est née : associer la noblesse du cheval des sables à la richesse de l'oud et aux notes pures d'encens pour créer des fragrances d'exception au caractère royal.</p><p class="story-p">C'est ainsi qu'ont vu le jour nos parfums Annibal, Aroquate et Wild Colt, chacun inspiré par l'héritage, la puissance et l'élégance du Najd.</p><p class="story-p">Chez Assaf, nous créons des parfums avec passion et créativité, pour laisser des souvenirs olfactifs inoubliables.</p><div class="tn-badge">Tunis, Tunisie</div></div></div></section>
    <app-footer></app-footer>
  `
})
export class HomeComponent implements OnInit {
  bestSellers$;

  banners = [
    { tag: 'Pour elle', title: 'Parfums Femme', sub: 'Floraux, poudrés et sucrés', path: '/elle' },
    { tag: 'Pour lui', title: 'Parfums Homme', sub: 'Sillages profonds et masculins', path: '/lui' },
    { tag: 'Collections exclusives', title: 'Nos Collections', sub: 'Coffrets et éditions spéciales', path: '/exclusives' }
  ];
  promoBanners = [
    { tag: 'Collection Femme', title: 'Arrogate Comete', sub: 'Une signature lumineuse, elegante et feminine.', btn: 'Découvrir le parfum', img: '/assaf-promo-arrogate-comete-v1.webp', prodName: 'Arrogate Comete', productId: null, path: '/elle' },
    { tag: 'Sélection Homme', title: 'EDP WILD COLT', sub: 'Un sillage profond, moderne et affirmé.', btn: 'Commander maintenant', img: '/assaf-promo-morinho-v1.webp', prodName: 'EDP WILD COLT', productId: null, path: '/lui' }
  ];

  constructor(private storeService: StoreService, public router: Router) {
    this.bestSellers$ = this.storeService.products$.pipe(map(products => {
      const best = products.filter(product => product.badge === 'Bestseller');
      return (best.length ? best : products).slice(0, 4);
    }));
  }

  ngOnInit(): void {}

  openPromo(productId: number | null, productName: string, fallbackPath: string): void {
    if (productId) {
      const product = this.storeService.products.find(item => item.id === productId);
      if (product) { this.router.navigate(['/product', product.id]); return; }
    }
    const product = this.storeService.products.find(item => item.name.toLowerCase() === productName.toLowerCase());
    this.router.navigate(product ? ['/product', product.id] : [fallbackPath]);
  }
}
