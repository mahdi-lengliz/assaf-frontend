import { Injectable } from '@angular/core';
import { BehaviorSubject, forkJoin, map, of, tap } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { ApiService } from './api.service';
import { assetUrl } from '../config/api.config';
import { Category } from '../models/category.model';
import { Product } from '../models/product.model';

@Injectable({ providedIn: 'root' })
export class StoreService {
  private readonly categoriesSubject = new BehaviorSubject<Category[]>([]);
  private readonly productsSubject = new BehaviorSubject<Product[]>([]);
  private readonly loadingSubject = new BehaviorSubject<boolean>(false);

  readonly categories$ = this.categoriesSubject.asObservable();
  readonly products$ = this.productsSubject.asObservable();
  readonly loading$ = this.loadingSubject.asObservable();

  constructor(private apiService: ApiService) {}

  get categories(): Category[] {
    return this.categoriesSubject.value;
  }

  get products(): Product[] {
    return this.productsSubject.value;
  }

  load(): void {
    this.loadingSubject.next(true);
    forkJoin({
      categories: this.apiService.getCategories().pipe(catchError(() => of([]))),
      products: this.apiService.getProducts().pipe(catchError(() => of([])))
    }).pipe(
      map(result => ({
        categories: result.categories,
        products: result.products.map(product => this.normalizeProduct(product))
      })),
      tap(() => this.loadingSubject.next(false))
    ).subscribe(result => {
      this.categoriesSubject.next(result.categories);
      this.productsSubject.next(result.products);
    });
  }

  replaceProduct(product: Product): void {
    const normalized = this.normalizeProduct(product);
    const products = this.products.some(item => item.id === normalized.id)
      ? this.products.map(item => item.id === normalized.id ? normalized : item)
      : [...this.products, normalized];
    this.productsSubject.next(products);
  }

  removeProduct(productId: number): void {
    this.productsSubject.next(this.products.filter(item => item.id !== productId));
  }

  private normalizeProduct(product: Product): Product {
    return {
      ...product,
      price: Number(product.price),
      categoryId: Number(product.categoryId || product.cat),
      collection: Boolean(product.collection || product.isCollection),
      imageUrl: this.absoluteImageUrl(product.imageUrl),
      imageUrl2: this.absoluteImageUrl(product.imageUrl2),
      imageUrl3: this.absoluteImageUrl(product.imageUrl3),
      imageUrl4: this.absoluteImageUrl(product.imageUrl4),
      notes: product.notes || []
    };
  }

  private absoluteImageUrl(url?: string): string | undefined {
    return assetUrl(url);
  }
}
