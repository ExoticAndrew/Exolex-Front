import { Component, Input, computed, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { iniciaisDe, corAvatarDe } from '../../../core/utils/avatar.util';

@Component({
  selector: 'app-avatar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './avatar.html',
  styleUrl: './avatar.scss',
})
export class Avatar {
  @Input({ required: true }) nome = '';
  @Input() fotoUrl: string | null = null;
  @Input() tamanho: 'sm' | 'md' | 'lg' = 'md';

  readonly erroImagem = signal(false);

  readonly iniciais = computed(() => iniciaisDe(this.nome));
  readonly cor = computed(() => corAvatarDe(this.nome));

  onErroImagem(): void {
    this.erroImagem.set(true);
  }
}