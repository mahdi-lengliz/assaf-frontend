import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { OrderStateService } from '../../core/services/order-state.service';

@Component({
  selector: 'app-success',
  standalone: true,
  imports: [RouterLink],
  template: `<div class="success-wrap"><div class="suc-ico">✓</div><h1 class="suc-title">Commande Confirmée !</h1><p class="suc-sub">Merci pour votre confiance. Votre commande ASSAF est en cours de préparation.</p><div class="suc-ref">Référence : {{ orderStateService.ref || 'ASF' }}</div><div class="suc-card"><div class="suc-row"><span>Prochaine étape</span><strong>Notre équipe vous contacte dans les 24h</strong></div><div class="suc-row"><span>Paiement</span><strong>Cash à la réception — préparez le montant</strong></div><div class="suc-row"><span>Délai</span><strong>2 à 5 jours selon votre ville</strong></div></div><a class="btn-dark suc-home" routerLink="/">Retour à l'accueil →</a></div>`
})
export class SuccessComponent {
  constructor(public orderStateService: OrderStateService) {}
}
