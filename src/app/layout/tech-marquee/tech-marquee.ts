import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

interface Tecnologia {
  nome: string;
  slug: string;
}

@Component({
  selector: 'app-tech-marquee',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './tech-marquee.html',
  styleUrl: './tech-marquee.scss',
})
export class TechMarquee {
  readonly stack: Tecnologia[] = [
    { nome: 'Spring Boot', slug: 'springboot' },
    { nome: 'Angular', slug: 'angular' },
    { nome: 'Apache Kafka', slug: 'apachekafka' },
    { nome: 'PostgreSQL', slug: 'postgresql' },
    { nome: 'TypeScript', slug: 'typescript' },
    { nome: 'Docker', slug: 'docker' },
    { nome: 'Java', slug: 'openjdk' },
  ];

  iconeCinza(slug: string): string {
    return `https://cdn.simpleicons.org/${slug}/8fa8c4`;
  }

  iconeColorido(slug: string): string {
    return `https://cdn.simpleicons.org/${slug}`;
  }
}