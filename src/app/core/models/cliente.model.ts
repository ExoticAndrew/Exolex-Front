export interface ClienteRequest {
  nome: string;
  documento: string;
  email: string;
  telefone: string;
}

export interface ClienteResponse {
  id: number;
  nome: string;
  documento: string;
  email: string;
  telefone: string;
}

export interface Page<T> {
  content: T[];
  totalElements: number;
  totalPages: number;
  number: number;
  size: number;
}
