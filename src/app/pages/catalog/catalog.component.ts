import { AsyncPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { map } from 'rxjs';
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
      <div class="sec-head"><div class="sec-tag">Catalogue</div><h1 class="sec-h2" [innerHTML]="title"></h1><div class="sec-line"></div></div>
      <div class="filters">
        <div class="filter-group">
          <button type="button" [class.selected]="isAllSelected()" (click)="setFilter(null)">Tous</button>
          @for (category of storeService.categories$ | async; track category.id) {
            <button type="button" [class.selected]="isCategorySelected(category)" (click)="setFilter(category.id)">{{ categoryLabel(category.name) }}</button>
          }
          <button type="button" [class.selected]="collectionFilter" (click)="setCollectionFilter()">🎁 Collections</button>
        </div>
        <div class="filter-group"><select class="fsel" [(ngModel)]="sizeFilter"><option value="">Toutes les contenances</option>@for (size of sizes$ | async; track size) { <option [value]="size">{{ size }} ML</option> }</select><select class="fsel" [(ngModel)]="sort"><option value="default">Selection</option><option value="asc">Prix croissant</option><option value="desc">Prix decroissant</option></select></div>
      </div>
      @if (storeService.products$ | async; as products) {
        @if (filteredProducts(products).length === 0) { <div class="empty-state"><div class="empty-ico">🧴</div><div class="empty-t">Aucun parfum trouve</div></div> }
        @else { <div class="prod-grid">@for (product of filteredProducts(products); track product.id) { <app-product-card [product]="product"></app-product-card> }</div> }
      }
    </section>
    <app-footer></app-footer>
  `
})
export class CatalogComponent implements OnInit {
  title = 'Tous les <em>Parfums</em>';
  categoryFilter: number | null = null;
  routeCategoryMatch = '';
  collectionFilter = false;
  sizeFilter = '';
  sort = 'default';
  protected readonly categoryLabel = categoryLabel;

  sizes$;
  filteredProducts(products: Product[]): Product[] {
    let list = [...products];
    const routeCategoryId = this.getRouteCategoryId();
    const activeCategoryId = this.categoryFilter ?? routeCategoryId;
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
    if (this.sizeFilter) list = list.filter(product => Number(product.perfumeSize) === Number(this.sizeFilter));
    if (this.sort === 'asc') list.sort((a, b) => a.price - b.price);
    if (this.sort === 'desc') list.sort((a, b) => b.price - a.price);
    return list;
  }

  constructor(public storeService: StoreService, private route: ActivatedRoute) {
    this.sizes$ = this.storeService.products$.pipe(map(products => [...new Set(products.map(product => product.perfumeSize).filter(Boolean) as number[])].sort((a, b) => a - b)));
  }

  ngOnInit(): void {
    this.route.data.subscribe(data => {
      this.title = data['title'] || 'Tous les <em>Parfums</em>';
      this.categoryFilter = null;
      this.routeCategoryMatch = data['categoryMatch'] || '';
      this.collectionFilter = !!data['collection'];
      this.sizeFilter = '';
      this.sort = 'default';
    });
  }

  setFilter(categoryId: number | null): void {
    this.categoryFilter = categoryId;
    this.routeCategoryMatch = '';
    this.collectionFilter = false;
  }

  setCollectionFilter(): void {
    this.categoryFilter = null;
    this.collectionFilter = true;
  }

  isAllSelected(): boolean {
    return this.categoryFilter === null && !this.routeCategoryMatch && !this.collectionFilter;
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
}
