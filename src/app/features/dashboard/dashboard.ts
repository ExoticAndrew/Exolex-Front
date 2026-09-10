import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';
import { AuthService } from '../../core/services/auth.service';
import { ProcessoService } from '../../core/services/processo.service';
import { ClienteService } from '../../core/services/cliente.service';
import { PrazoService } from '../../core/services/prazo.service';
import { NotificacaoService } from '../../core/services/notificacao.service';
import { PrazoProximo } from '../../core/models/prazo.model';
import { ProcessoResponse } from '../../core/models/processo.model';
import { Avatar } from '../../shared/components/avatar/avatar';

type Urgencia = 'atrasado' | 'critico' | 'atencao' | 'tranquilo';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink, Avatar],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  readonly prazos = signal<PrazoProximo[]>([]);
  readonly processosRecentes = signal<ProcessoResponse[]>([]);
  readonly totalProcessos = signal(0);
  readonly totalClientes = signal(0);
  readonly notificacoesNaoLidas = signal(0);
  readonly loading = signal(true);
  readonly errorMessage = signal<string | null>(null);

  readonly prazosVencidos = computed(() =>
    this.prazos().filter((p) => this.urgencia(p.dataVencimento) === 'atrasado').length
  );

  readonly prazosUrgentes = computed(() =>
    this.prazos().filter((p) => {
      const u = this.urgencia(p.dataVencimento);
      return u === 'critico' || u === 'atencao';
    }).length
  );

  readonly prazosEmDia = computed(() =>
    this.prazos().filter((p) => this.urgencia(p.dataVencimento) === 'tranquilo').length
  );

  constructor(
    protected authService: AuthService,
    private processoService: ProcessoService,
    private clienteService: ClienteService,
    private prazoService: PrazoService,
    private notificacaoService: NotificacaoService
  ) {}

  ngOnInit(): void {
    this.prazoService.listarProximos().subscribe({
      next: (prazos) => {
        this.prazos.set(prazos);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível carregar os prazos.');
        this.loading.set(false);
      },
    });

    this.processoService.listar(0, 4).subscribe({
      next: (page) => {
        this.processosRecentes.set(page.content);
        this.totalProcessos.set(page.totalElements);
      },
      error: () => {},
    });

    this.clienteService.listar(0, 1).subscribe({
      next: (page) => this.totalClientes.set(page.totalElements),
      error: () => {},
    });

    this.notificacaoService.contarNaoLidas().subscribe({
      next: (total) => this.notificacoesNaoLidas.set(total),
      error: () => {},
    });
  }

  private diasRestantes(dataVencimento: string): number {
    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);
    const data = new Date(dataVencimento + 'T00:00:00');
    return Math.round((data.getTime() - hoje.getTime()) / (1000 * 60 * 60 * 24));
  }

  urgencia(dataVencimento: string): Urgencia {
    const dias = this.diasRestantes(dataVencimento);
    if (dias < 0) return 'atrasado';
    if (dias <= 3) return 'critico';
    if (dias <= 7) return 'atencao';
    return 'tranquilo';
  }

  textoPrazo(dataVencimento: string): string {
    const dias = this.diasRestantes(dataVencimento);
    if (dias < 0) return `Atrasado há ${Math.abs(dias)} dia(s)`;
    if (dias === 0) return 'Vence hoje';
    if (dias === 1) return 'Vence amanhã';
    return `Vence em ${dias} dias`;
  }

  responsavelDe(processo: ProcessoResponse): string {
    const resp = processo.equipe.find((v) => v.papel === 'RESPONSAVEL');
    return resp?.usuarioNome ?? '—';
  }
}