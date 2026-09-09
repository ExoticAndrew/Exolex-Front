import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UsuarioResponse } from '../models/usuario.model';

@Injectable({ providedIn: 'root' })
export class UsuarioService {
  private readonly apiUrl = `${environment.apiUrl}/usuarios`;

  constructor(private http: HttpClient) {}

  listar(): Observable<UsuarioResponse[]> {
    return this.http.get<UsuarioResponse[]>(this.apiUrl);
  }

  atualizarFoto(arquivo: File): Observable<{ fotoUrl: string }> {
    const formData = new FormData();
    formData.append('arquivo', arquivo);
    return this.http.post<{ fotoUrl: string }>(`${this.apiUrl}/me/foto`, formData);
  }
}