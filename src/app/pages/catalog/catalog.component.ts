import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs';
import { filter } from 'rxjs/operators';
import { Product } from '../../core/models/product.model';
import { Category } from '../../core/models/category.model';
import { StoreService } from '../../core/services/store.service';
import { categoryLabel } from '../../core/utils/format.utils';
import { FooterComponent } from '../../layout/footer/footer.component';
import { ProductCardComponent } from '../../shared/product-card/product-card.component';

@Component({
  selector: 'app-catalog',
  standalone: true,
  imports: [AsyncPipe, FormsModule, FooterComponent, ProductCardComponent],
  template: `
    <section class="catalog-section">
      <div class="sec-head"><div class="sec-tag">Catalogue</div><h1 class="sec-h2" [innerHTML]="displayTitle()"></h1><div class="sec-line"></div></div>
      <div class="filters">
        <div class="filter-group">
          <button type="button" [class.selected]="isAllSelected()" (click)="setFilter(null)">Tous</button>
          @for (category of storeService.categories$ | async; track category.id) {
            <button type="button" [class.selected]="isCategorySelected(category)" (click)="setFilter(category.id)">{{ catalogCategoryLabel(category.name) }}</button>
          }
          <button type="button" [class.selected]="collectionFilter" (click)="setCollectionFilter()">Coffret</button>
        </div>
        <div class="filter-group catalog-controls"><input class="fsel catalog-search" type="search" [(ngModel)]="searchTerm" placeholder="Rechercher un parfum..."><select class="fsel" [(ngModel)]="sizeFilter"><option value="">Toutes les contenances</option>@for (size of sizes$ | async; track size) { <option [value]="size">{{ size }} ML</option> }</select><select class="fsel" [(ngModel)]="sort"><option value="default">Sélection</option><option value="asc">Prix croissant</option><option value="desc">Prix décroissant</option></select></div>
      </div>
      @if (storeService.products$ | async; as products) {
        @if (filteredProducts(products).length === 0) { <div class="empty-state"><div class="empty-ico">🧴</div><div class="empty-t">Aucun parfum trouvé</div></div> }
        @else { <div class="prod-grid">@for (product of filteredProducts(products); track product.id) { <app-product-card [product]="product"></app-product-card> }</div> }
      }
    </section>
    <app-footer></app-footer>
  `
})
export class CatalogComponent implements OnInit {
  title = 'Tous les <em>Parfums</em>';
  categoryFilter: number | null = null;
  allFilterSelected = false;
  routeCategoryMatch = '';
  collectionFilter = false;
  sizeFilter = '';
  searchTerm = '';
  sort = 'default';
  protected readonly categoryLabel = categoryLabel;

  sizes$;
  filteredProducts(products: Product[]): Product[] {
    let list = [...products];
    const routeCategoryId = this.getRouteCategoryId();
    const activeCategoryId = this.allFilterSelected ? null : (this.categoryFilter ?? routeCategoryId);
    if (this.collectionFilter) {
      list = list.filter(product => product.collection);
    } else if (activeCategoryId !== null) {
      const activeLabel = this.normalizedCategoryName(this.storeService.categories.find(category => category.id === activeCategoryId)?.name || '');
      list = list.filter(product => {
        const productCategory = this.storeService.categories.find(category => category.id === product.categoryId);
        const productLabel = this.normalizedCategoryName(productCategory?.name || '');
        return activeLabel.includes('pour elle') || activeLabel.includes('pour lui')
          ? product.categoryId === activeCategoryId || productLabel.includes('unisex')
          : product.categoryId === activeCategoryId;
      });
    }
    const search = this.normalizedCategoryName(this.searchTerm.trim());
    if (search) list = list.filter(product => this.productSearchText(product).includes(search));
    if (this.sizeFilter) list = list.filter(product => Number(product.perfumeSize) === Number(this.sizeFilter));
    if (this.sort === 'asc') list.sort((a, b) => a.price - b.price);
    if (this.sort === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }

  constructor(public storeService: StoreService, private route: ActivatedRoute, private router: Router) {
    this.sizes$ = this.storeService.products$.pipe(map(products => [...new Set(products.map(product => product.perfumeSize).filter(Boolean) as number[])].sort((a, b) => a - b)));
  }

  ngOnInit(): void {
    this.applyRouteData();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(() => this.applyRouteData());
  }

  setFilter(categoryId: number | null): void {
    this.categoryFilter = categoryId;
    this.allFilterSelected = categoryId === null;
    this.routeCategoryMatch = '';
    this.collectionFilter = false;
  }

  setCollectionFilter(): void {
    this.categoryFilter = null;
    this.allFilterSelected = false;
    this.collectionFilter = true;
  }

  isAllSelected(): boolean {
    return this.allFilterSelected || (this.categoryFilter === null && !this.routeCategoryMatch && !this.collectionFilter);
  }

  isCategorySelected(category: Category): boolean {
    if (this.collectionFilter) return false;
    if (this.categoryFilter !== null) return this.categoryFilter === category.id;
    return !!this.routeCategoryMatch && this.matchesRouteCategory(category);
  }

  private getRouteCategoryId(): number | null {
    if (!this.routeCategoryMatch) return null;
    return this.storeService.categories.find(category => this.matchesRouteCategory(category))?.id ?? null;
  }

  private matchesRouteCategory(category: Category): boolean {
    return this.normalizedCategoryName(category.name).includes(this.routeCategoryMatch);
  }

  private normalizedCategoryName(name: string): string {
    return name.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '');
  }

  private productSearchText(product: Product): string {
    const category = this.storeService.categories.find(item => item.id === product.categoryId);
    return this.normalizedCategoryName([
      product.name,
      product.sub,
      product.description,
      product.badge,
      category?.name,
      this.catalogCategoryLabel(category?.name || ''),
      ...(product.notes || [])
    ].filter(Boolean).join(' '));
  }

  catalogCategoryLabel(name: string): string {
    const normalized = this.normalizedCategoryName(name);
    if (normalized.includes('women') || normalized.includes('pour elle')) return 'Femme';
    if (normalized.includes('men') || normalized.includes('pour lui')) return 'Homme';
    if (normalized.includes('unisex')) return 'Unisexe';
    return categoryLabel(name);
  }

  displayTitle(): string {
    if (this.allFilterSelected) return 'Tous les <em>Parfums</em>';
    if (this.collectionFilter) return '<em>Coffret</em>';
    if (this.categoryFilter !== null) {
      const category = this.storeService.categories.find(item => item.id === this.categoryFilter);
      return category ? `<em>${this.catalogCategoryLabel(category.name)}</em>` : this.title;
    }
    return this.title;
  }

  private applyRouteData(): void {
    const data = this.route.snapshot.data;
    this.title = data['title'] || 'Tous les <em>Parfums</em>';
    this.categoryFilter = null;
    this.allFilterSelected = false;
    this.routeCategoryMatch = data['categoryMatch'] || '';
    this.collectionFilter = !!data['collection'];
    this.sizeFilter = '';
    this.searchTerm = '';
    this.sort = 'default';
  }
}
