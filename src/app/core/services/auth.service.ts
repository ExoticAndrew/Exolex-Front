import { Injectable, signal, computed } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { LoginRequest, CadastroRequest, LoginResponse } from '../models/auth.model';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly apiUrl = `${environment.apiUrl}/auth`;

  private readonly _id = signal<number | null>(null);
  private readonly _token = signal<string | null>(null);
  private readonly _nome = signal<string | null>(null);
  private readonly _fotoUrl = signal<string | null>(null);

  readonly isAuthenticated = computed(() => this._token() !== null);
  readonly id = this._id.asReadonly();
  readonly nome = this._nome.asReadonly();
  readonly fotoUrl = this._fotoUrl.asReadonly();

  constructor(private http: HttpClient) {}

  login(dto: LoginRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/login`, dto).pipe(
      tap(response => this.setSession(response))
    );
  }

  cadastrar(dto: CadastroRequest): Observable<LoginResponse> {
    return this.http.post<LoginResponse>(`${this.apiUrl}/cadastro`, dto).pipe(
      tap(response => this.setSession(response))
    );
  }

  atualizarFotoLocal(url: string): void {
    this._fotoUrl.set(url);
  }

  logout(): void {
    this._id.set(null);
    this._token.set(null);
    this._nome.set(null);
    this._fotoUrl.set(null);
  }

  getToken(): string | null {
    return this._token();
  }

  private setSession(response: LoginResponse): void {
    this._id.set(response.id);
    this._token.set(response.token);
    this._nome.set(response.nome);
    this._fotoUrl.set(response.fotoUrl);
  }
}