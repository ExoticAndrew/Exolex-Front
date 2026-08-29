import { Component, ElementRef, HostListener, ViewChild, AfterViewInit } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-mission',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './mission.html',
  styleUrl: './mission.scss',
})
export class Mission implements AfterViewInit {
  @ViewChild('missionSection') sectionRef!: ElementRef<HTMLElement>;

  readonly texto =
    'Todo processo tem um prazo. E perder um único prazo pode custar uma causa inteira. ' +
    'O Exolex existe para que isso nunca aconteça — cada prazo visível, cada responsável ' +
    'notificado, cada equipe alinhada em tempo real.';

  words: string[] = [];
  progress = 0;

  ngAfterViewInit(): void {
    this.words = this.texto.split(' ');
    this.onScroll();
  }

  @HostListener('window:scroll')
  onScroll(): void {
    if (!this.sectionRef) return;

    const rect = this.sectionRef.nativeElement.getBoundingClientRect();
    const start = window.innerHeight;
    const end = -rect.height * 0.3;

    let progresso = (start - rect.top) / (start - end);
    progresso = Math.max(0, Math.min(1, progresso));
    this.progress = progresso;
  }

  isActive(index: number): boolean {
    const ratio = (index + 1) / this.words.length;
    return ratio <= this.progress;
  }
}