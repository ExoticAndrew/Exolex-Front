import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import {
  ProcessoRequest,
  ProcessoResponse,
  AdicionarColaboradorRequest,
} from '../models/processo.model';
import { Page } from '../models/cliente.model';

@Injectable({ providedIn: 'root' })
export class ProcessoService {
  private readonly apiUrl = `${environment.apiUrl}/processos`;

  constructor(private http: HttpClient) {}

  listar(page = 0, size = 10): Observable<Page<ProcessoResponse>> {
    const params = new HttpParams()
      .set('page', page)
      .set('size', size)
      .set('sort', 'dataAbertura');

    return this.http.get<Page<ProcessoResponse>>(this.apiUrl, { params });
  }

  buscarPorId(id: number): Observable<ProcessoResponse> {
    return this.http.get<ProcessoResponse>(`${this.apiUrl}/${id}`);
  }

  criar(dto: ProcessoRequest): Observable<ProcessoResponse> {
    return this.http.post<ProcessoResponse>(this.apiUrl, dto);
  }

  adicionarColaborador(id: number, dto: AdicionarColaboradorRequest): Observable<void> {
    return this.http.post<void>(`${this.apiUrl}/${id}/colaboradores`, dto);
  }

  deletar(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
}