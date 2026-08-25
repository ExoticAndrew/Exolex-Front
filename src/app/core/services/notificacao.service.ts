import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { NotificacaoResponse } from '../models/notificacao.model';

@Injectable({ providedIn: 'root' })
export class NotificacaoService {
  private readonly apiUrl = `${environment.apiUrl}/notificacoes`;

  constructor(private http: HttpClient) {}

  listar(): Observable<NotificacaoResponse[]> {
    return this.http.get<NotificacaoResponse[]>(this.apiUrl);
  }

  contarNaoLidas(): Observable<number> {
    return this.http.get<number>(`${this.apiUrl}/nao-lidas`);
  }

  marcarComoLida(id: number): Observable<void> {
    return this.http.patch<void>(`${this.apiUrl}/${id}/lida`, {});
  }
}