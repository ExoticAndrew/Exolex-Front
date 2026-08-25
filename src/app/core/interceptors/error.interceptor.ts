import { HttpInterceptorFn, HttpErrorResponse } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError } from 'rxjs';
import { AuthService } from '../services/auth.service';

const MENSAGEM_PADRAO = 'Ocorreu um erro inesperado. Tente novamente mais tarde.';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  return next(req).pipe(
    catchError((erro: HttpErrorResponse) => {
      if (erro.status === 401) {
        authService.logout();
        router.navigate(['/login']);
        return throwError(() => erro);
      }

            const mensagem = erro.error?.message ?? MENSAGEM_PADRAO;
      const erroNormalizado = new HttpErrorResponse({
        error: { ...erro.error, message: mensagem },
        headers: erro.headers,
        status: erro.status,
        statusText: erro.statusText,
        url: erro.url ?? undefined,
      });

      return throwError(() => erroNormalizado);
    })
  );
};