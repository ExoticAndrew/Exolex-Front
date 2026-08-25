export interface LoginRequest {
  email: string;
  senha: string;
}

export interface CadastroRequest {
  nome: string;
  email: string;
  senha: string;
}

export interface LoginResponse {
  id: number;
  token: string;
  nome: string;
}