import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface ToastMessage {
  msg: string;
  type: 'ok' | 'err';
}

@Injectable({ providedIn: 'root' })
export class ToastService {
  private readonly toastSubject = new BehaviorSubject<ToastMessage | null>(null);
  readonly toast$ = this.toastSubject.asObservable();

  show(msg: string, type: 'ok' | 'err' = 'ok'): void {
    this.toastSubject.next({ msg, type });
    setTimeout(() => this.toastSubject.next(null), 3000);
  }
}
