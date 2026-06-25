import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AdminStats, Order } from '../../core/models/order.model';
import { Product, ProductRequest } from '../../core/models/product.model';
import { assetUrl, persistedAssetUrl } from '../../core/config/api.config';
import { ApiService } from '../../core/services/api.service';
import { AuthService } from '../../core/services/auth.service';
import { StoreService } from '../../core/services/store.service';
import { ToastService } from '../../core/services/toast.service';
import { categoryLabel, formatPrice, stockInfo } from '../../core/utils/format.utils';

type AdminTab = 'orders' | 'products';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    @if (!authService.isAuthenticated) {
      <div class="login-wrap">
        <div class="login-box">
          <div class="admin-logo">ASSAF<span>Dashboard Admin · Tunisie</span></div>
          <div class="fg"><label>Utilisateur</label><input class="fi" [(ngModel)]="login.username" name="admin_username" autocomplete="off" autocapitalize="none" spellcheck="false"></div>
          <div class="fg"><label>Mot de passe</label><input class="fi" type="password" [(ngModel)]="login.password" name="admin_password" autocomplete="new-password"></div>
          <button class="btn-full-dark" type="button" (click)="adminLogin()">Se connecter</button>
          <button class="btn-full-border" type="button" (click)="router.navigateByUrl('/')">Retour au site</button>
        </div>
      </div>
    } @else {
      <div class="admin-wrap">
        <div class="admin-top">
          <div class="admin-logo">ASSAF<span>Dashboard Admin · Tunisie</span></div>
          <button class="btn-border" type="button" (click)="logout()">Deconnexion</button>
          <button class="btn-border" type="button" (click)="router.navigateByUrl('/')">Retour au site</button>
        </div>

        <div class="stats">
          <div class="stat-card"><div class="stat-l">Commandes</div><div class="stat-v">{{ adminStats.orders }}</div><div class="stat-s">Total</div></div>
          <div class="stat-card"><div class="stat-l">En attente</div><div class="stat-v">{{ adminStats.pendingOrders }}</div><div class="stat-s">A traiter</div></div>
          <div class="stat-card"><div class="stat-l">Chiffre affaires</div><div class="stat-v">{{ formatPrice(adminStats.revenue) }}</div><div class="stat-s">Actives</div></div>
          <div class="stat-card"><div class="stat-l">Produits</div><div class="stat-v">{{ adminStats.products }}</div><div class="stat-s">Catalogue</div></div>
        </div>

        <div class="tabs">
          <button type="button" [class.active]="adminTab === 'orders'" (click)="adminTab = 'orders'"><span class="tab-ico">📦</span> Commandes</button>
          <button type="button" [class.active]="adminTab === 'products'" (click)="adminTab = 'products'"><span class="tab-ico">🧴</span> Produits</button>
        </div>

        @if (adminTab === 'orders') {
          <div class="tbl-wrap">
            <table>
              <thead><tr><th>Reference</th><th>Client</th><th>Telephone</th><th>Ville</th><th>Total</th><th>Statut</th></tr></thead>
              <tbody>
                @for (order of orders; track order.id) {
                  <tr>
                    <td>{{ order.orderNumber }}</td>
                    <td>{{ order.customerName }}</td>
                    <td>{{ order.customerPhone }}</td>
                    <td>{{ order.city }}</td>
                    <td>{{ formatPrice(order.total) }}</td>
                    <td>
                      <div class="status-select" [ngClass]="statusClass(order.status)">
                        <select class="sel-status" [ngModel]="order.status" (ngModelChange)="updateStatus(order, $event)">
                          <option value="PENDING">En attente</option>
                          <option value="CONFIRMED">Confirmee</option>
                          <option value="DELIVERED">Livree</option>
                          <option value="CANCELLED">Annulee</option>
                        </select>
                      </div>
                    </td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        } @else {
          <div class="admin-actions">
            <button class="btn-dark" type="button" (click)="newProduct()">{{ productFormOpen ? 'Annuler' : '+ Nouveau produit' }}</button>
          </div>

          @if (productFormOpen) {
            <div class="pform">
              <div class="pform-title">{{ editingProduct ? 'Modifier le produit' : 'Ajouter un produit' }}</div>
              <div class="pform-grid">
                <div class="fg"><label>Nom *</label><input class="fi" [(ngModel)]="productForm.name"></div>
                <div class="fg"><label>Sous-titre</label><input class="fi" [(ngModel)]="productForm.sub"></div>
                <div class="fg"><label>Contenance ML</label><input class="fi" type="number" [(ngModel)]="productForm.perfumeSize"></div>
                <div class="fg"><label>Prix *</label><input class="fi" type="number" [(ngModel)]="productForm.price"></div>
                <div class="fg">
                  <label>Categorie</label>
                  <select class="fsel" [(ngModel)]="productForm.categoryId">
                    @for (category of storeService.categories$ | async; track category.id) {
                      <option [value]="category.id">{{ categoryLabel(category.name) }}</option>
                    }
                  </select>
                </div>
                <div class="fg"><label>Stock</label><input class="fi" type="number" [(ngModel)]="productForm.stock"></div>
                <div class="fg"><label>Emoji</label><input class="fi" [(ngModel)]="productForm.emoji"></div>
                <div class="fg">
                  <label>Badge</label>
                  <select class="fsel" [(ngModel)]="productForm.badge">
                    <option value="">Aucun badge</option>
                    <option value="Bestseller">⭐ Bestseller</option>
                    <option value="Nouveau">🆕 Nouveau</option>
                    <option value="Exclusif">💎 Exclusif</option>
                  </select>
                </div>
                <div class="fg check"><input type="checkbox" [(ngModel)]="productForm.collection"><label>🎁 Inclure dans Collections Exclusives</label></div>
                <div class="fg">
                  <label>Image principale</label>
                  <label class="image-picker" [class.uploading]="isImageUploading('imageUrl')">
                    <input type="file" accept="image/*" [disabled]="isImageUploading('imageUrl')" (change)="uploadImage($event, 'imageUrl')">
                    @if (productForm.imageUrl) { <img [src]="displayImage(productForm.imageUrl)" alt="Image principale"> }
                    @else { <span class="image-picker-ico">+</span> }
                    @if (isImageUploading('imageUrl')) { <span class="image-upload-state"><span class="image-spinner"></span><span>Upload en cours...</span></span> }
                    @else { <span class="image-picker-text">{{ productForm.imageUrl ? 'Changer l image' : 'Choisir une image' }}</span> }
                  </label>
                  @if (productForm.imageUrl) { <span class="file-url">{{ productForm.imageUrl }}</span> }
                </div>
                <div class="fg">
                  <label>2eme image - optionnel</label>
                  <label class="image-picker" [class.uploading]="isImageUploading('imageUrl2')">
                    <input type="file" accept="image/*" [disabled]="isImageUploading('imageUrl2')" (change)="uploadImage($event, 'imageUrl2')">
                    @if (productForm.imageUrl2) { <img [src]="displayImage(productForm.imageUrl2)" alt="Deuxieme image"> }
                    @else { <span class="image-picker-ico">+</span> }
                    @if (isImageUploading('imageUrl2')) { <span class="image-upload-state"><span class="image-spinner"></span><span>Upload en cours...</span></span> }
                    @else { <span class="image-picker-text">{{ productForm.imageUrl2 ? 'Changer l image' : 'Choisir une image' }}</span> }
                  </label>
                  @if (productForm.imageUrl2) { <span class="file-url">{{ productForm.imageUrl2 }}</span> }
                </div>
                <div class="fg wide"><label>Description</label><textarea class="fi" rows="3" [(ngModel)]="productForm.description"></textarea></div>
                <div class="fg wide"><label>Notes olfactives (virgule)</label><input class="fi" [(ngModel)]="notesText"></div>
              </div>
              <button class="btn-dark" type="button" (click)="saveProduct()">AJOUTER AU CATALOGUE</button>
            </div>
          }

          <div class="tbl-wrap">
            <table>
              <thead><tr><th>Produit</th><th>Taille</th><th>Stock</th><th>Prix</th><th>Badge</th><th>Collection</th><th>Actions</th></tr></thead>
              <tbody>
                @for (product of storeService.products$ | async; track product.id) {
                  <tr>
                    <td>
                      <div class="admin-product-cell">
                        <span class="admin-product-emoji">{{ product.emoji || '🧴' }}</span>
                        <span>
                          <span class="admin-product-name">{{ product.name }}</span>
                          <span class="admin-product-sub">{{ product.sub || 'Eau de Parfum' }}@if (product.perfumeSize) { size: {{ product.perfumeSize }} ml }</span>
                        </span>
                      </div>
                    </td>
                    <td>{{ product.perfumeSize || '-' }} ML</td>
                    <td>{{ stockInfo(product.stock).label }}</td>
                    <td>{{ formatPrice(product.price) }}</td>
                    <td>{{ product.badge || '-' }}</td>
                    <td class="collection-cell">{{ product.collection ? '🎁' : '-' }}</td>
                    <td><button class="abt" type="button" (click)="editProduct(product)">Modifier</button><button class="abt del" type="button" (click)="deleteProduct(product)">Supprimer</button></td>
                  </tr>
                }
              </tbody>
            </table>
          </div>
        }
      </div>
    }
  `
})
export class AdminComponent implements OnInit {
  protected readonly formatPrice = formatPrice;
  protected readonly categoryLabel = categoryLabel;
  protected readonly stockInfo = stockInfo;
  login = { username: '', password: '' };
  adminTab: AdminTab = 'orders';
  orders: Order[] = [];
  adminStats: AdminStats = { orders: 0, pendingOrders: 0, revenue: 0, products: 0 };
  productFormOpen = false;
  editingProduct: Product | null = null;
  notesText = '';
  productForm: ProductRequest;
  imageUploading: Partial<Record<'imageUrl' | 'imageUrl2', boolean>> = {};

  constructor(public authService: AuthService, public storeService: StoreService, public router: Router, private apiService: ApiService, private toastService: ToastService) {
    this.productForm = this.emptyProductForm();
  }

  ngOnInit(): void {
    if (this.authService.isAuthenticated) this.loadAdmin();
  }

  adminLogin(): void {
    this.authService.login(this.login).subscribe({ next: () => { this.toastService.show('Connexion admin reussie'); this.loadAdmin(); }, error: () => this.toastService.show('Identifiants invalides', 'err') });
  }

  logout(): void {
    this.authService.logout();
  }

  loadAdmin(): void {
    this.apiService.getAdminOrders().subscribe({ next: orders => this.orders = orders, error: () => this.authService.logout() });
    this.apiService.getAdminStats().subscribe(stats => this.adminStats = stats);
  }

  updateStatus(order: Order, status: string): void {
    this.apiService.updateOrderStatus(order.id, status).subscribe(updated => { order.status = updated.status; this.loadAdmin(); });
  }

  statusClass(status: string): string {
    if (status === 'CONFIRMED') return 'status-confirmed';
    if (status === 'DELIVERED') return 'status-delivered';
    if (status === 'CANCELLED') return 'status-cancelled';
    return 'status-pending';
  }

  newProduct(): void {
    this.productFormOpen = !this.productFormOpen;
    this.editingProduct = null;
    this.productForm = this.emptyProductForm();
    this.notesText = '';
  }

  editProduct(product: Product): void {
    this.editingProduct = product;
    this.productFormOpen = true;
    this.productForm = { name: product.name, sub: product.sub, perfumeSize: product.perfumeSize, price: product.price, categoryId: product.categoryId, emoji: product.emoji, badge: product.badge, description: product.description, stock: product.stock, imageUrl: persistedAssetUrl(product.imageUrl), imageUrl2: persistedAssetUrl(product.imageUrl2), collection: product.collection };
    this.notesText = product.notes.join(', ');
  }

  saveProduct(): void {
    if (!this.productForm.name.trim() || !this.productForm.price) {
      this.toastService.show('Nom et prix requis', 'err');
      return;
    }
    const payload = { ...this.productForm, categoryId: Number(this.productForm.categoryId), price: Number(this.productForm.price), perfumeSize: this.productForm.perfumeSize ? Number(this.productForm.perfumeSize) : null, stock: Number(this.productForm.stock || 0), notes: this.notesText.split(',').map(note => note.trim()).filter(Boolean) };
    const request = this.editingProduct ? this.apiService.updateProduct(this.editingProduct.id, payload) : this.apiService.createProduct(payload);
    request.subscribe(product => {
      this.storeService.replaceProduct(product);
      this.productFormOpen = false;
      this.editingProduct = null;
      this.productForm = this.emptyProductForm();
      this.notesText = '';
      this.loadAdmin();
      this.toastService.show('Produit sauvegarde');
    });
  }

  uploadImage(event: Event, field: 'imageUrl' | 'imageUrl2'): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    if (!file) return;
    this.imageUploading = { ...this.imageUploading, [field]: true };
    this.apiService.uploadProductImage(file).subscribe({
      next: response => {
        this.productForm = { ...this.productForm, [field]: persistedAssetUrl(response.url) };
        this.toastService.show('Image ajoutee');
      },
      error: error => {
        this.imageUploading = { ...this.imageUploading, [field]: false };
        input.value = '';
        this.toastService.show(error?.error?.message || 'Upload impossible', 'err');
      },
      complete: () => {
        this.imageUploading = { ...this.imageUploading, [field]: false };
        input.value = '';
      }
    });
  }

  deleteProduct(product: Product): void {
    if (!confirm(`Supprimer ${product.name} ?`)) return;
    this.apiService.deleteProduct(product.id).subscribe(() => { this.storeService.removeProduct(product.id); this.loadAdmin(); this.toastService.show('Produit supprime'); });
  }

  private emptyProductForm(): ProductRequest {
    return { name: '', sub: 'Eau de Parfum', perfumeSize: 100, price: null, categoryId: this.storeService.categories[0]?.id ?? 0, emoji: '🧴', badge: '', description: '', stock: 0, imageUrl: '', imageUrl2: '', collection: false };
  }

  displayImage(url?: string): string {
    return assetUrl(url) || '';
  }

  isImageUploading(field: 'imageUrl' | 'imageUrl2'): boolean {
    return Boolean(this.imageUploading[field]);
  }
}
