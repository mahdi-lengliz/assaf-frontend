import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer>
      <div class="footer-grid">
        <div>
          <div class="footer-logo">ASSAF</div>
          <div class="footer-tag-txt">To Be Different</div>
          <div class="footer-desc">Parfums ASSAF en Tunisie. Authenticite garantie, livraison rapide.</div>
          <div class="footer-badge">TN Revendeur officiel · Tunis</div>
        </div>
        <div>
          <div class="footer-col-h">Navigation</div>
          <ul class="footer-links">
            <li><a routerLink="/">Accueil</a></li>
            <li><a routerLink="/elle">Pour Elle</a></li>
            <li><a routerLink="/lui">Pour Lui</a></li>
            <li><a routerLink="/unisex">Unisex</a></li>
            <li><a routerLink="/exclusives">Collections Exclusives</a></li>
            <li><a routerLink="/cart">Panier</a></li>
          </ul>
        </div>
        <div>
          <div class="footer-col-h">Informations</div>
          <ul class="footer-links"><li>Livraison & Retours</li><li>Authenticite</li><li>Guide des parfums</li><li>FAQ</li></ul>
        </div>
        <div>
          <div class="footer-col-h">Contact</div>
          <ul class="footer-links footer-contact">
            <li><span class="footer-mini-icon">📧</span><a href="mailto:contact@assaf-tn.com">contact&#64;assaf-tn.com</a></li>
            <li><span class="footer-mini-icon">📞</span><a href="tel:+21600000000">+216 XX XXX XXX</a></li>
            <li><span class="footer-mini-icon">📍</span><span>Tunis, Tunisie</span></li>
          </ul>
          <div class="footer-social">
            <a href="https://www.instagram.com/assaf_tn" target="_blank" rel="noopener" aria-label="Instagram">📷</a>
            <a href="https://www.facebook.com/assaf.tn" target="_blank" rel="noopener" aria-label="Facebook">👤</a>
            <a href="https://www.tiktok.com/@assaf_tn" target="_blank" rel="noopener" aria-label="TikTok">🎵</a>
          </div>
        </div>
      </div>
      <div class="footer-bottom"><span>© 2026 ASSAF Tunisie</span><span><span class="footer-mini-icon">💵</span> Cash a la livraison · <span class="footer-mini-icon">🚚</span> Partout en Tunisie</span></div>
    </footer>
  `
})
export class FooterComponent {}
