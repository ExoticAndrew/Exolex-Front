import { Routes } from '@angular/router';
import { Landing } from './layout/landing/landing';
import { AuthPage } from './features/auth/auth-page/auth-page';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: AuthPage },
  { path: 'cadastro', component: AuthPage },
];