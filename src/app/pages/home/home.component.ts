import { AsyncPipe } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { map } from 'rxjs';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';
import { StoreService } from '../../core/services/store.service';

interface HeroImage {
  src: string;
  alt: string;
  kind: 'editorial' | 'product';
  position?: string;
  srcset?: string;
  sizes?: string;
}

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [AsyncPipe, FooterComponent, ProductCardComponent],
  template: `
    <div class="hero">
      <div class="hero-left">
        <div class="hero-tag">Revendeur Officiel · Tunisie</div>
        <h1 class="hero-h1">Sois <em>Différent</em>.<br>Sois ASSAF.</h1>
        <p class="hero-p">Une sélection de parfums de luxe, désormais disponible partout en Tunisie. Livraison rapide, paiement à la réception.</p>
        <div class="hero-ctas"><button class="btn-dark" type="button" (click)="router.navigateByUrl('/collections')">Découvrir la Collection →</button><button class="btn-border" type="button" (click)="router.navigateByUrl('/elle')">Pour Elle</button></div>
      </div>
      <div class="hero-right">
        @if (heroImages$ | async; as heroImages) {
          @for (image of heroImages; track image.src; let index = $index) {
            <img class="hero-photo" [class.active]="isHeroImageActive(index, heroImages.length)" [class.hero-editorial]="image.kind === 'editorial'" [class.hero-product]="image.kind === 'product'" [style.object-position]="image.position || null" [attr.fetchpriority]="image.kind === 'editorial' ? 'high' : 'low'" [attr.loading]="image.kind === 'editorial' ? 'eager' : 'lazy'" [attr.srcset]="image.srcset || null" [attr.sizes]="image.sizes || null" decoding="async" [src]="image.src" [alt]="image.alt">
          }
          @if (!heroImages.length) {
            <div class="hero-product-fallback"><span>ASSAF</span><small>Parfums Authentiques</small></div>
          }
        }
        <div class="hero-video-overlay"></div>
      </div>
    </div>
    <div class="strip"><div class="strip-inner">@for (item of trustItems; track item.t) { <div class="strip-item"><span class="strip-ico">{{ item.i }}</span><div><span class="strip-t">{{ item.t }}</span><span class="strip-s">{{ item.s }}</span></div></div> }</div></div>
    <div class="banners">@for (banner of banners; track banner.title) { <button class="banner" type="button" (click)="router.navigateByUrl(banner.path)"><span class="banner-ico">{{ banner.ico }}</span><span class="banner-tag">{{ banner.tag }}</span><span class="banner-title">{{ banner.title }}</span><span class="banner-sub">{{ banner.sub }}</span><span class="banner-link">Découvrir →</span></button> }</div>
    <div class="promo-banners">@for (banner of promoBanners; track banner.tag) { <button class="promo-banner" type="button" (click)="openPromo(banner.prodName, banner.path)"><img [src]="banner.img" [alt]="banner.tag" loading="lazy" decoding="async"><span class="promo-banner-overlay"></span><span class="promo-banner-content"><span class="promo-banner-tag">{{ banner.tag }}</span><span class="promo-banner-title">{{ banner.title }}</span><span class="promo-banner-sub">{{ banner.sub }}</span><span class="promo-banner-btn">{{ banner.btn }} →</span></span></button> }</div>
    <section class="band">
      <div class="sec-head"><div class="sec-tag">Les plus populaires</div><h2 class="sec-h2">Best <em>Sellers</em></h2><div class="sec-line"></div><p class="sec-p">Les parfums ASSAF les plus demandés, disponibles en Tunisie.</p></div>
      <div class="prod-grid">@for (product of bestSellers$ | async; track product.id) { <app-product-card [product]="product"></app-product-card> }</div>
      <div class="center mt"><button class="btn-border" type="button" (click)="router.navigateByUrl('/collections')">Voir tous les parfums →</button></div>
    </section>
    <section><div class="story-grid"><div class="story-img"><img src="/assaf-story-logo-v1.webp" alt="ASSAF" loading="lazy" decoding="async"></div><div><div class="story-tag">À propos</div><h2 class="story-h">L'univers <em>ASSAF</em></h2><p class="story-p">ASSAF propose une expérience parfumée élégante, pensée pour les amateurs de sillages raffinés et modernes.</p><p class="story-p">La boutique met l'accent sur une sélection claire, des produits bien présentés et une livraison rapide partout en Tunisie.</p><div class="tn-badge">Tunis, Tunisie</div></div></div></section>
    <app-footer></app-footer>
  `
})
export class HomeComponent implements OnInit, OnDestroy {
  bestSellers$;
  heroImages$;
  activeHeroImage = 0;
  private readonly editorialHeroImage: HeroImage = {
    src: 'assaf-hero-products-v1.webp',
    alt: 'Campagne ASSAF',
    kind: 'editorial',
    position: 'center center',
    srcset: '/assaf-hero-products-mobile-v1.webp 900w, /assaf-hero-products-v1.webp 1500w',
    sizes: '(max-width: 620px) 100vw, 50vw'
  };
  private heroTimer?: ReturnType<typeof setInterval>;
  trustItems = [
    { i: '🚚', t: 'Livraison rapide', s: '2-5 jours partout en Tunisie' },
    { i: '💵', t: 'Cash à la livraison', s: 'Aucune carte requise' },
    { i: '✅', t: '100% Authentique', s: 'Selection ASSAF' },
    { i: '↻', t: 'Retours faciles', s: 'Satisfait ou remboursé' }
  ];
  banners = [
    { tag: 'Pour Elle', title: 'Parfums Femme', sub: 'Floraux, poudrés et sucrés', ico: '🌸', path: '/elle' },
    { tag: 'Pour Lui', title: 'Parfums Homme', sub: 'Sillages profonds et masculins', ico: '🖤', path: '/lui' },
    { tag: 'Collections Exclusives', title: 'Nos Collections', sub: 'Coffrets et éditions spéciales', ico: '🎁', path: '/exclusives' }
  ];
  promoBanners = [
    { tag: 'Collection Femme', title: 'Signature Elle', sub: 'Des notes elegantes, lumineuses et feminines.', btn: 'Découvrir la collection', img: '/assaf-promo-elle.webp', prodName: 'Signature', path: '/elle' },
    { tag: 'Selection Homme', title: 'Signature Lui', sub: 'Des sillages profonds, modernes et affirmes.', btn: 'Commander maintenant', img: '/assaf-promo-lui.webp', prodName: 'Signature', path: '/lui' }
  ];

  constructor(private storeService: StoreService, public router: Router) {
    this.heroImages$ = this.storeService.products$.pipe(map(() => [this.editorialHeroImage]));

    this.bestSellers$ = this.storeService.products$.pipe(map(products => {
      const best = products.filter(product => product.badge === 'Bestseller');
      return (best.length ? best : products).slice(0, 4);
    }));
  }

  ngOnInit(): void {
    this.heroTimer = setInterval(() => {
      this.activeHeroImage += 1;
    }, 5000);
  }

  ngOnDestroy(): void {
    if (this.heroTimer) {
      clearInterval(this.heroTimer);
    }
  }

  openPromo(productName: string, fallbackPath: string): void {
    const product = this.storeService.products.find(item => item.name.toLowerCase().includes(productName.toLowerCase()));
    this.router.navigate(product ? ['/product', product.id] : [fallbackPath]);
  }

  isHeroImageActive(index: number, total: number): boolean {
    return total > 0 && index === this.activeHeroImage % total;
  }
}
