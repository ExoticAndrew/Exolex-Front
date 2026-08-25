import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessoService } from '../../../core/services/processo.service';
import { PrazoService } from '../../../core/services/prazo.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoResponse } from '../../../core/models/processo.model';
import { PrazoResponse, StatusPrazo } from '../../../core/models/prazo.model';

@Component({
  selector: 'app-processo-detalhe',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './processo-detalhe.html',
  styleUrl: './processo-detalhe.scss',
})
export class ProcessoDetalhe implements OnInit {
  readonly processo = signal<ProcessoResponse | null>(null);
  readonly prazos = signal<PrazoResponse[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showModal = signal(false);
  readonly form: FormGroup;

  readonly statusOptions: StatusPrazo[] = ['PENDENTE', 'CUMPRIDO', 'VENCIDO'];

  readonly meuPapel = computed(() => {
    const p = this.processo();
    const meuId = this.authService.id();
    if (!p || meuId === null) return null;

    const vinculo = p.equipe.find((v) => v.usuarioId === meuId);
    return vinculo?.papel ?? null;
  });

  readonly podeEditar = computed(() => this.meuPapel() !== 'VISUALIZADOR');

  private processoId!: number;

  constructor(
    private route: ActivatedRoute,
    private processoService: ProcessoService,
    private prazoService: PrazoService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      descricao: ['', [Validators.required]],
      dataVencimento: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.processoId = Number(this.route.snapshot.paramMap.get('id'));
    this.carregarProcesso();
    this.carregarPrazos();
  }

  carregarProcesso(): void {
    this.processoService.buscarPorId(this.processoId).subscribe({
      next: (processo) => this.processo.set(processo),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível carregar o processo.');
      },
    });
  }

  carregarPrazos(): void {
    this.loading.set(true);
    this.prazoService.listar(this.processoId, this.currentPage()).subscribe({
      next: (page) => {
        this.prazos.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível carregar os prazos.');
        this.loading.set(false);
      },
    });
  }

  irParaPagina(page: number): void {
    this.currentPage.set(page);
    this.carregarPrazos();
  }

  abrirNovo(): void {
    this.form.reset();
    this.showModal.set(true);
  }

  fecharModal(): void {
    this.showModal.set(false);
  }

  salvar(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.prazoService.criar(this.processoId, this.form.getRawValue()).subscribe({
      next: () => {
        this.showModal.set(false);
        this.carregarPrazos();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível criar o prazo.');
      },
    });
  }

  mudarStatus(prazo: PrazoResponse, status: StatusPrazo): void {
    this.prazoService.atualizarStatus(this.processoId, prazo.id, { status }).subscribe({
      next: () => this.carregarPrazos(),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível atualizar o status.');
      },
    });
  }

  excluir(prazo: PrazoResponse): void {
    if (!confirm(`Excluir o prazo "${prazo.descricao}"?`)) return;

    this.prazoService.deletar(this.processoId, prazo.id).subscribe({
      next: () => this.carregarPrazos(),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível excluir o prazo.');
      },
    });
  }
}