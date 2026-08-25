import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { RouterLink } from '@angular/router';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ProcessoService } from '../../../core/services/processo.service';
import { ClienteService } from '../../../core/services/cliente.service';
import { UsuarioService } from '../../../core/services/usuario.service';
import { AuthService } from '../../../core/services/auth.service';
import { ProcessoResponse, PapelProcesso } from '../../../core/models/processo.model';
import { ClienteResponse } from '../../../core/models/cliente.model';
import { UsuarioResponse } from '../../../core/models/usuario.model';

@Component({
  selector: 'app-processos-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './processos-list.html',
  styleUrl: './processos-list.scss',
})
export class ProcessosList implements OnInit {
  readonly processos = signal<ProcessoResponse[]>([]);
  readonly clientes = signal<ClienteResponse[]>([]);
  readonly usuarios = signal<UsuarioResponse[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showModal = signal(false);
  readonly showEquipeModal = signal(false);
  readonly processoSelecionado = signal<ProcessoResponse | null>(null);

  readonly form: FormGroup;
  readonly equipeForm: FormGroup;

  readonly papeis: PapelProcesso[] = ['RESPONSAVEL', 'COLABORADOR', 'VISUALIZADOR'];

  readonly usuariosDisponiveis = computed(() => {
    const processo = this.processoSelecionado();
    if (!processo) return this.usuarios();

    const idsNaEquipe = new Set(processo.equipe.map((v) => v.usuarioId));
    return this.usuarios().filter((u) => !idsNaEquipe.has(u.id));
  });

  constructor(
    private processoService: ProcessoService,
    private clienteService: ClienteService,
    private usuarioService: UsuarioService,
    private authService: AuthService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      numero: ['', [Validators.required]],
      titulo: ['', [Validators.required]],
      clienteId: [null, [Validators.required]],
    });

    this.equipeForm = this.fb.group({
      usuarioId: [null, [Validators.required]],
      papel: ['COLABORADOR', [Validators.required]],
    });
  }

  ngOnInit(): void {
    this.carregar();
    this.carregarClientes();
    this.carregarUsuarios();
  }

  carregar(): void {
    this.loading.set(true);
    this.processoService.listar(this.currentPage()).subscribe({
      next: (page) => {
        this.processos.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível carregar os processos.');
        this.loading.set(false);
      },
    });
  }

  carregarClientes(): void {
    this.clienteService.listar(0, 100).subscribe({
      next: (page) => this.clientes.set(page.content),
      error: () => {},
    });
  }

  carregarUsuarios(): void {
    this.usuarioService.listar().subscribe({
      next: (usuarios) => this.usuarios.set(usuarios),
      error: () => {},
    });
  }

  irParaPagina(page: number): void {
    this.currentPage.set(page);
    this.carregar();
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

    this.processoService.criar(this.form.getRawValue()).subscribe({
      next: () => {
        this.showModal.set(false);
        this.carregar();
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível criar o processo.');
      },
    });
  }

  excluir(processo: ProcessoResponse): void {
    if (!confirm(`Excluir o processo "${processo.numero}"?`)) return;

    this.processoService.deletar(processo.id).subscribe({
      next: () => this.carregar(),
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível excluir o processo.');
      },
    });
  }

  abrirEquipe(processo: ProcessoResponse): void {
    this.processoSelecionado.set(processo);
    this.equipeForm.reset({ usuarioId: null, papel: 'COLABORADOR' });
    this.showEquipeModal.set(true);
  }

  fecharEquipeModal(): void {
    this.showEquipeModal.set(false);
    this.processoSelecionado.set(null);
  }

  adicionarColaborador(): void {
    if (this.equipeForm.invalid) {
      this.equipeForm.markAllAsTouched();
      return;
    }

    const processo = this.processoSelecionado();
    if (!processo) return;

    this.processoService.adicionarColaborador(processo.id, this.equipeForm.getRawValue()).subscribe({
      next: () => {
        this.processoService.buscarPorId(processo.id).subscribe({
          next: (atualizado) => {
            this.processoSelecionado.set(atualizado);
            this.equipeForm.reset({ usuarioId: null, papel: 'COLABORADOR' });
            this.carregar();
          },
        });
      },
      error: (err: HttpErrorResponse) => {
        this.errorMessage.set(err.error?.message ?? 'Não foi possível adicionar o colaborador.');
      },
    });
  }

  ehResponsavel(processo: ProcessoResponse): boolean {
    const meuId = this.authService.id();
    if (meuId === null) return false;

    const vinculo = processo.equipe.find((v) => v.usuarioId === meuId);
    return vinculo?.papel === 'RESPONSAVEL';
  }
}