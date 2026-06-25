import { Routes } from '@angular/router';
import { AdminComponent } from './pages/admin/admin.component';
import { CartComponent } from './pages/cart/cart.component';
import { CatalogComponent } from './pages/catalog/catalog.component';
import { CheckoutComponent } from './pages/checkout/checkout.component';
import { HomeComponent } from './pages/home/home.component';
import { ProductDetailComponent } from './pages/product-detail/product-detail.component';
import { SuccessComponent } from './pages/success/success.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'collections', component: CatalogComponent, data: { title: 'Tous les <em>Parfums</em>' } },
  { path: 'elle', component: CatalogComponent, data: { title: '<em>Pour Elle</em>', categoryMatch: 'pour elle' } },
  { path: 'lui', component: CatalogComponent, data: { title: '<em>Pour Lui</em>', categoryMatch: 'pour lui' } },
  { path: 'unisex', component: CatalogComponent, data: { title: '<em>Unisex</em>', categoryMatch: 'unisex' } },
  { path: 'exclusives', component: CatalogComponent, data: { title: 'Collections <em>Exclusives</em>', collection: true } },
  { path: 'product/:id', component: ProductDetailComponent },
  { path: 'cart', component: CartComponent },
  { path: 'checkout', component: CheckoutComponent },
  { path: 'success', component: SuccessComponent },
  { path: 'admin', component: AdminComponent },
  { path: '**', redirectTo: '' }
];
