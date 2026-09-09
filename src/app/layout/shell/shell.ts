import { Component, ElementRef, ViewChild } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet, Router } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { UsuarioService } from '../../core/services/usuario.service';
import { NotificacaoSino } from '../../shared/components/notificacao-sino/notificacao-sino';
import { Avatar } from '../../shared/components/avatar/avatar';

@Component({
  selector: 'app-shell',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, RouterOutlet, NotificacaoSino, Avatar],
  templateUrl: './shell.html',
  styleUrl: './shell.scss',
})
export class Shell {
  @ViewChild('inputFoto') inputFotoRef!: ElementRef<HTMLInputElement>;

  constructor(
    protected authService: AuthService,
    private usuarioService: UsuarioService,
    private router: Router
  ) {}

  get primeiroNome(): string {
    const nome = this.authService.nome() ?? '';
    return nome.split(' ')[0];
  }

  abrirSeletorFoto(): void {
    this.inputFotoRef.nativeElement.click();
  }

  onFotoSelecionada(event: Event): void {
    const input = event.target as HTMLInputElement;
    const arquivo = input.files?.[0];
    if (!arquivo) return;

    this.usuarioService.atualizarFoto(arquivo).subscribe({
      next: (resp) => this.authService.atualizarFotoLocal(resp.fotoUrl),
      error: () => alert('Não foi possível atualizar a foto. Confirme se é uma imagem válida de até 2MB.'),
    });
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}