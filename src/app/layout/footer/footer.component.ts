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
            <li><a routerLink="/unisex">Unisexe</a></li>
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
            <a href="https://www.facebook.com/assaftunisie" target="_blank" rel="noopener" aria-label="Facebook">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M14 8.3h2.1V5.1c-.4-.1-1.6-.2-3-.2-3 0-5 1.8-5 5.2v2.9H4.8v3.6h3.3V24h4v-7.4h3.3l.5-3.6h-3.8v-2.5c0-1 .3-1.7 1.9-1.7Z"/></svg>
            </a>
            <a href="https://www.instagram.com/assafperfumes/" target="_blank" rel="noopener" aria-label="Instagram">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M7.4 2h9.2A5.4 5.4 0 0 1 22 7.4v9.2a5.4 5.4 0 0 1-5.4 5.4H7.4A5.4 5.4 0 0 1 2 16.6V7.4A5.4 5.4 0 0 1 7.4 2Zm0 2A3.4 3.4 0 0 0 4 7.4v9.2A3.4 3.4 0 0 0 7.4 20h9.2a3.4 3.4 0 0 0 3.4-3.4V7.4A3.4 3.4 0 0 0 16.6 4H7.4Zm4.6 3.4A4.6 4.6 0 1 1 7.4 12 4.6 4.6 0 0 1 12 7.4Zm0 2A2.6 2.6 0 1 0 14.6 12 2.6 2.6 0 0 0 12 9.4Zm5-2.6a1.1 1.1 0 1 1-1.1 1.1A1.1 1.1 0 0 1 17 6.8Z"/></svg>
            </a>
            <a href="https://www.tiktok.com/@assaf.tunisie" target="_blank" rel="noopener" aria-label="TikTok">
              <svg viewBox="0 0 24 24" aria-hidden="true"><path d="M15.8 2c.3 2.4 1.7 3.9 4.2 4.1v3.4a7.7 7.7 0 0 1-4.1-1.2v6.7c0 4.3-2.8 7-6.7 7A6.3 6.3 0 0 1 3 15.6c0-4 3.2-6.8 7.5-6.4v3.6c-2-.3-3.7.8-3.7 2.8a2.5 2.5 0 0 0 2.6 2.7c1.7 0 2.7-1 2.7-3.1V2h3.7Z"/></svg>
            </a>
          </div>
        </div>
      </div>
      <div class="footer-bottom"><span>© 2026 ASSAF Tunisie</span><span><span class="footer-mini-icon">💵</span> Cash a la livraison · <span class="footer-mini-icon">🚚</span> Partout en Tunisie</span></div>
    </footer>
  `
})
export class FooterComponent {}
