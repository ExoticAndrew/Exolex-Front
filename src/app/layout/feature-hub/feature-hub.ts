import {
  Component,
  ElementRef,
  QueryList,
  ViewChild,
  ViewChildren,
  AfterViewInit,
  OnDestroy,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface Feature {
  titulo: string;
}

interface Conexao {
  id: string;
  d: string;
  length: number;
  duration: number;
  delay: number;
  reverse: boolean;
}

@Component({
  selector: 'app-feature-hub',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './feature-hub.html',
  styleUrl: './feature-hub.scss',
})
export class FeatureHub implements AfterViewInit, OnDestroy {
  readonly internaEsquerda: Feature[] = [
    { titulo: 'Autenticação JWT' },
    { titulo: 'Controle por papel' },
    { titulo: 'Kafka Producer' },
    { titulo: 'Auditoria de alterações' },
  ];

  readonly internaDireita: Feature[] = [
    { titulo: 'Gestão de Processos' },
    { titulo: 'Kafka Consumers' },
    { titulo: 'Notificações em tempo real' },
    { titulo: 'Prazos & vencimentos' },
  ];

  readonly externaEsquerda: Feature[] = [
    { titulo: 'Carteira de Clientes' },
    { titulo: 'PostgreSQL' },
    { titulo: 'Docker' },
  ];

  readonly externaDireita: Feature[] = [
    { titulo: 'Testes automatizados' },
    { titulo: 'TypeScript' },
    { titulo: 'Deploy contínuo' },
  ];

  readonly conexoes = signal<Conexao[]>([]);

  @ViewChild('container') containerRef!: ElementRef<HTMLElement>;
  @ViewChild('core') coreRef!: ElementRef<HTMLElement>;
  @ViewChildren('cardEsq') cardsEsqRef!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('cardDir') cardsDirRef!: QueryList<ElementRef<HTMLElement>>;
  @ViewChildren('pulsePath') pulsePathsRef!: QueryList<ElementRef<SVGPathElement>>;

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    this.recalcular();
    this.resizeObserver = new ResizeObserver(() => this.recalcular());
    this.resizeObserver.observe(this.containerRef.nativeElement);
  }

  ngOnDestroy(): void {
    this.resizeObserver?.disconnect();
  }

  private recalcular(): void {
    if (window.innerWidth <= 900) {
      this.conexoes.set([]);
      return;
    }

    const containerRect = this.containerRef.nativeElement.getBoundingClientRect();
    const coreRect = this.coreRef.nativeElement.getBoundingClientRect();

    const coreX = coreRect.left + coreRect.width / 2 - containerRect.left;
    const coreY = coreRect.top + coreRect.height / 2 - containerRect.top;
    const coreRaio = coreRect.width / 2;

    const anteriores = this.conexoes();
    const novas: Conexao[] = [];

    const gerarLado = (
      cards: ElementRef<HTMLElement>[],
      esquerda: boolean,
      prefixo: string,
      indiceBase: number
    ) => {
      const entradas = [-34, -12, 12, 34];
      const distancias = [102, 132, 132, 102];

      cards.forEach((card, i) => {
        const rect = card.nativeElement.getBoundingClientRect();
        const startX = esquerda
          ? rect.right - containerRect.left
          : rect.left - containerRect.left;
        const startY = rect.top + rect.height / 2 - containerRect.top;

        const entryY = coreY + entradas[i];
        const dy = entryY - coreY;
        const dx = Math.sqrt(Math.max(coreRaio * coreRaio - dy * dy, 0));
        const entryX = esquerda ? coreX - dx : coreX + dx;

        const cotoveloX = esquerda ? coreX - distancias[i] : coreX + distancias[i];

        const raioCanto = 8;
        const sinalX = esquerda ? -1 : 1;
        const sinalY = entryY > startY ? 1 : -1;

        const d = `
          M ${startX} ${startY}
          L ${cotoveloX - sinalX * raioCanto} ${startY}
          Q ${cotoveloX} ${startY} ${cotoveloX} ${startY + sinalY * raioCanto}
          L ${cotoveloX} ${entryY - sinalY * raioCanto}
          Q ${cotoveloX} ${entryY} ${cotoveloX + sinalX * raioCanto} ${entryY}
          L ${entryX} ${entryY}
        `;

        const idx = indiceBase + i;
        const anterior = anteriores[idx];

        novas.push({
          id: `${prefixo}-${i}`,
          d,
          length: anterior?.length ?? 400,
          duration: anterior?.duration ?? 2.8 + Math.random() * 1.8,
          delay: anterior?.delay ?? Math.random() * 5,
          reverse: anterior?.reverse ?? Math.random() < 0.25,
        });
      });
    };

    gerarLado(this.cardsEsqRef.toArray(), true, 'esq', 0);
    gerarLado(this.cardsDirRef.toArray(), false, 'dir', this.internaEsquerda.length);

    this.conexoes.set(novas);
    requestAnimationFrame(() => this.medirComprimentos());
  }

  private medirComprimentos(): void {
    const atualizado = this.conexoes().map((conexao, i) => {
      const elemento = this.pulsePathsRef.get(i)?.nativeElement;
      const length = elemento ? elemento.getTotalLength() : conexao.length;
      return { ...conexao, length };
    });
    this.conexoes.set(atualizado);
  }
}