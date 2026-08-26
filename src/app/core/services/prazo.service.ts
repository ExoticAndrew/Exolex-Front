import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  PrazoRequest,
  PrazoResponse,
  AtualizarStatusPrazoRequest,
  PrazoProximo,
} from '../models/prazo.model';
import { Page } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class PrazoService {
  private readonly apiUrl = `${environment.apiUrl}/processos`;
  private readonly apiUrlPrazos = `${environment.apiUrl}/prazos`;

  constructor(private http: HttpClient) {}

  listar(processoId: number, page = 0, size = 10): Observable<Page<PrazoResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataVencimento');

    return this.http.get<Page<PrazoResponse>>(`${this.apiUrl}/${processoId}/prazos`, { params });
  }

  listarProximos(): Observable<PrazoProximo[]> {
    return this.http.get<PrazoProximo[]>(`${this.apiUrlPrazos}/proximos`);
  }

  criar(processoId: number, dto: PrazoRequest): Observable<PrazoResponse> {
    return this.http.post<PrazoResponse>(`${this.apiUrl}/${processoId}/prazos`, dto);
  }

  atualizarStatus(
    processoId: number,
    prazoId: number,
    dto: AtualizarStatusPrazoRequest
  ): Observable<PrazoResponse> {
    return this.http.patch<PrazoResponse>(
      `${this.apiUrl}/${processoId}/prazos/${prazoId}/status`,
      dto
    );
  }

  deletar(processoId: number, prazoId: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${processoId}/prazos/${prazoId}`);
  }
}