import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HowItWorks } from '../how-it-works/how-it-works';
import { Mission } from '../mission/mission';
import { Pricing } from '../pricing/pricing';
import { TechMarquee } from '../tech-marquee/tech-marquee';
import { FeatureHub } from '../feature-hub/feature-hub';
import { Footer } from '../footer/footer';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, HowItWorks, Mission, Pricing, TechMarquee, FeatureHub, Footer],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}