import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { HowItWorks } from '../how-it-works/how-it-works';
import { Mission } from '../mission/mission';

@Component({
  selector: 'app-landing',
  imports: [RouterLink, HowItWorks, Mission],
  templateUrl: './landing.html',
  styleUrl: './landing.scss',
})
export class Landing {}