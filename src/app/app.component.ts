import { CommonModule } from '@angular/common';
import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter } from 'rxjs';
import { StoreService } from './core/services/store.service';
import { NavbarComponent } from './layout/navbar/navbar.component';
import { ToastComponent } from './shared/toast/toast.component';

@Component({
  selector: 'app-root',
  imports: [CommonModule, RouterOutlet, NavbarComponent, ToastComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  encapsulation: ViewEncapsulation.None
})
export class AppComponent implements OnInit {
  isAdminRoute = false;

  constructor(private storeService: StoreService, private router: Router) {}

  ngOnInit(): void {
    this.storeService.load();
    this.router.events.pipe(filter(event => event instanceof NavigationEnd)).subscribe(event => {
      this.isAdminRoute = (event as NavigationEnd).urlAfterRedirects.startsWith('/admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
}
