import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificacaoService } from '../../../core/services/notificacao.service';
import { NotificacaoResponse } from '../../../core/models/notificacao.model';

@Component({
  selector: 'app-notificacao-sino',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notificacao-sino.html',
  styleUrl: './notificacao-sino.scss',
})
export class NotificacaoSino implements OnInit {
  readonly notificacoes = signal<NotificacaoResponse[]>([]);
  readonly naoLidas = signal(0);
  readonly aberto = signal(false);

  constructor(private notificacaoService: NotificacaoService) {}

  ngOnInit(): void {
    this.carregarContador();
  }

  carregarContador(): void {
    this.notificacaoService.contarNaoLidas().subscribe({
      next: (total) => this.naoLidas.set(total),
    });
  }

  toggle(): void {
    this.aberto.set(!this.aberto());
    if (this.aberto()) {
      this.carregarListaEMarcarLidas();
    }
  }

  private carregarListaEMarcarLidas(): void {
    this.notificacaoService.listar().subscribe({
      next: (lista) => {
        this.notificacoes.set(lista);

        const naoLidas = lista.filter((n) => !n.lida);
        if (naoLidas.length === 0) return;

        naoLidas.forEach((n) => {
          this.notificacaoService.marcarComoLida(n.id).subscribe();
        });

        this.naoLidas.set(0);
        this.notificacoes.set(lista.map((n) => ({ ...n, lida: true })));
      },
    });
  }
}