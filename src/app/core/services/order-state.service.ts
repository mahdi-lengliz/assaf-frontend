import { Injectable } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class OrderStateService {
  private orderRef = '';

  set ref(value: string) {
    this.orderRef = value;
  }

  get ref(): string {
    return this.orderRef;
  }
}
