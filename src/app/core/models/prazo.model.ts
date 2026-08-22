export type StatusPrazo = 'PENDENTE' | 'CUMPRIDO' | 'VENCIDO';

export interface PrazoRequest {
  descricao: string;
  dataVencimento: string;
}

export interface PrazoResponse {
  id: number;
  processoId: number;
  descricao: string;
  dataVencimento: string;
  status: StatusPrazo;
}

export interface AtualizarStatusPrazoRequest {
  status: StatusPrazo;
}