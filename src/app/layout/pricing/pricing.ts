import { Component, signal, ViewChild, ElementRef } from '@angular/core';
import confetti from 'canvas-confetti';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

interface Plano {
  id: string;
  nome: string;
  descricao: string;
  precoMensal: number;
  recomendado: boolean;
  recursos: string[];
  cta: string;
}

@Component({
  selector: 'app-pricing',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './pricing.html',
  styleUrl: './pricing.scss',
})
export class Pricing {
  readonly anual = signal(false);

  readonly planos: Plano[] = [
    {
      id: 'gratis',
      nome: 'Gratuito',
      descricao: 'Para advogados autônomos começando a organizar a rotina.',
      precoMensal: 0,
      recomendado: false,
      recursos: [
        'Até 10 processos ativos',
        '1 usuário',
        'Prazos e notificações',
        'Suporte por e-mail',
      ],
      cta: 'Começar grátis',
    },
    {
      id: 'profissional',
      nome: 'Profissional',
      descricao: 'Para escritórios pequenos e médios que trabalham em equipe.',
      precoMensal: 79,
      recomendado: true,
      recursos: [
        'Processos ilimitados',
        'Até 10 usuários',
        'Controle de acesso por papel',
        'Notificações em tempo real',
        'Auditoria de alterações',
        'Suporte prioritário',
      ],
      cta: 'Assinar Profissional',
    },
    {
      id: 'escritorio',
      nome: 'Escritório',
      descricao: 'Para bancas maiores com necessidades de escala e segurança.',
      precoMensal: 199,
      recomendado: false,
      recursos: [
        'Tudo do Profissional',
        'Usuários ilimitados',
        'SSO e políticas de segurança',
        'Relatórios avançados',
        'Gerente de conta dedicado',
      ],
      cta: 'Falar com vendas',
    },
  ];

  precoExibido(plano: Plano): number {
    if (plano.precoMensal === 0) return 0;
    return this.anual() ? Math.round(plano.precoMensal * 0.8) : plano.precoMensal;
  }
    digitosPreco(plano: Plano): string[] {
    const valor = this.precoExibido(plano);
    return String(valor).split('');
  }
    alternarPeriodo(): void {
    const novoValor = !this.anual();
    this.anual.set(novoValor);

    if (novoValor) {
      this.dispararConfete();
    }
  }

  private dispararConfete(): void {
    const rect = this.switchBtn.nativeElement.getBoundingClientRect();
    const originX = (rect.left + rect.width / 2) / window.innerWidth;
    const originY = (rect.top + rect.height / 2) / window.innerHeight;

    confetti({
      particleCount: 60,
      spread: 65,
      origin: { x: originX, y: originY },
      colors: ['#2E7BC9', '#072642', '#85B7EB', '#ffffff'],
      ticks: 250,
      gravity: 1.1,
      decay: 0.93,
      startVelocity: 28,
    });
  }
    @ViewChild('switchBtn') switchBtn!: ElementRef<HTMLButtonElement>;
}