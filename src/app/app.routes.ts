import { Routes } from '@angular/router';
import { Landing } from './layout/landing/landing';
import { AuthPage } from './features/auth/auth-page/auth-page';
import { Shell } from './layout/shell/shell';
import { ClientesList } from './features/clientes/clientes-list/clientes-list';
import { ProcessosList } from './features/processos/processos-list/processos-list';
import { PrazosList } from './features/prazos/prazos-list/prazos-list';
import { authGuard } from './core/guards/auth.guard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: 'login', component: AuthPage },
  { path: 'cadastro', component: AuthPage },
  {
    path: 'app',
    component: Shell,
    canActivate: [authGuard],
    children: [
      { path: '', redirectTo: 'clientes', pathMatch: 'full' },
      { path: 'clientes', component: ClientesList },
      { path: 'processos', component: ProcessosList },
      { path: 'prazos', component: PrazosList },
    ],
  },
];