export type TipoAtividade = 'Pesquisa' | 'Docência' | 'Extensão';

export interface Atividade {
  id: string;
  nome: string;
  responsavel: string; 
  dataFim: Date; 
  descricao?: string; 
  tipo: TipoAtividade;
}

