export type StatusProcesso = 'ATIVO' | 'ARQUIVADO' | 'ENCERRADO';

export type PapelProcesso = 'RESPONSAVEL' | 'COLABORADOR' | 'VISUALIZADOR';

export interface ProcessoRequest {
  numero: string;
  titulo: string;
  clienteId: number;
}

export interface VinculoResponse {
  usuarioId: number;
  usuarioNome: string;
  papel: PapelProcesso;
}

export interface ProcessoResponse {
  id: number;
  numero: string;
  titulo: string;
  status: StatusProcesso;
  dataAbertura: string;
  clienteNome: string;
  equipe: VinculoResponse[];
}

export interface AdicionarColaboradorRequest {
  usuarioId: number;
  papel: PapelProcesso;
}