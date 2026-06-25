import { AsyncPipe } from '@angular/common';
import { Component } from '@angular/core';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-toast',
  standalone: true,
  imports: [AsyncPipe],
  template: `
    @if (toastService.toast$ | async; as toast) {
      <div class="toast" [class.err]="toast.type === 'err'"><span class="toast-mark">{{ toast.type === 'err' ? '!' : '✓' }}</span>{{ toast.msg }}</div>
    }
  `
})
export class ToastComponent {
  constructor(public toastService: ToastService) {}
}
