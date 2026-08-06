import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HowItWorks } from '../how-it-works/how-it-works';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, HowItWorks],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}