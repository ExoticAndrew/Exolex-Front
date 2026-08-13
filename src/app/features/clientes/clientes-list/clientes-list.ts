import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ClienteService } from '../../../core/services/cliente.service';
import { ClienteResponse } from '../../../core/models/cliente.model';

@Component({
  selector: 'app-clientes-list',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './clientes-list.html',
  styleUrl: './clientes-list.scss',
})
export class ClientesList implements OnInit {
  readonly clientes = signal<ClienteResponse[]>([]);
  readonly totalPages = signal(0);
  readonly currentPage = signal(0);
  readonly loading = signal(false);
  readonly errorMessage = signal<string | null>(null);

  readonly showModal = signal(false);
  readonly editingId = signal<number | null>(null);
  readonly form: FormGroup;

  constructor(
    private clienteService: ClienteService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      nome: ['', [Validators.required, Validators.minLength(2)]],
      documento: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      telefone: [''],
    });
  }

  ngOnInit(): void {
    this.carregar();
  }

  carregar(): void {
    this.loading.set(true);
    this.clienteService.listar(this.currentPage()).subscribe({
      next: (page) => {
        this.clientes.set(page.content);
        this.totalPages.set(page.totalPages);
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Não foi possível carregar os clientes.');
        this.loading.set(false);
      },
    });
  }

  irParaPagina(page: number): void {
    this.currentPage.set(page);
    this.carregar();
  }

  abrirNovo(): void {
    this.editingId.set(null);
    this.form.reset();
    this.showModal.set(true);
  }

  abrirEdicao(cliente: ClienteResponse): void {
    this.editingId.set(cliente.id);
    this.form.setValue({
      nome: cliente.nome,
      documento: cliente.documento,
      email: cliente.email,
      telefone: cliente.telefone ?? '',
    });
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

    const dto = this.form.getRawValue();
    const id = this.editingId();

    const request$ = id
      ? this.clienteService.atualizar(id, dto)
      : this.clienteService.criar(dto);

    request$.subscribe({
      next: () => {
        this.showModal.set(false);
        this.carregar();
      },
      error: () => {
        this.errorMessage.set('Não foi possível salvar o cliente.');
      },
    });
  }

  excluir(cliente: ClienteResponse): void {
    if (!confirm(`Excluir o cliente "${cliente.nome}"?`)) return;

    this.clienteService.deletar(cliente.id).subscribe({
      next: () => this.carregar(),
      error: () => this.errorMessage.set('Não foi possível excluir o cliente.'),
    });
  }
}