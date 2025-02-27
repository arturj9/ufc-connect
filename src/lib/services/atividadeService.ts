import { Atividade } from "../entities/Atividade";

const LOCAL_STORAGE_KEY = 'atividades';
const isBrowser = typeof window !== 'undefined';

const atividadesIniciais: Atividade[] = [
  {
    id: "1",
    nome: "Pesquisa sobre IA",
    responsavel: "Tiago",
    dataFim: new Date("2025-06-30"),
    descricao: "Projeto de pesquisa sobre inteligência artificial aplicada.",
    tipo: "Pesquisa",
  },
  {
    id: "2",
    nome: "Curso de Programação",
    responsavel: 'Elmano',
    dataFim: new Date("2025-07-20"),
    descricao: "Curso introdutório de programação para iniciantes.",
    tipo: "Docência",
  },
  {
    id: "3",
    nome: "Projeto Social",
    responsavel: 'Jermana',
    dataFim: new Date("2025-09-25"),
    descricao: "Atividade de extensão para suporte educacional comunitário.",
    tipo: "Extensão",
  }
];

const getAtividadesFromStorage = (): Atividade[] => {
  if (!isBrowser) return [];
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  if (!data) {
    saveAtividadesToStorage(atividadesIniciais);
    return atividadesIniciais;
  }
  return JSON.parse(data);
};

const saveAtividadesToStorage = (atividades: Atividade[]): void => {
  if (isBrowser) {
    localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(atividades));
  }
};

export const criarAtividade = (novaAtividade: Omit<Atividade, 'id'>): Atividade | null => {
  const atividades = getAtividadesFromStorage();
  const novaAtividadeComId: Atividade = {
    id: (atividades.length > 0 ? Math.max(...atividades.map(a => Number(a.id))) + 1 : 1).toString(),
    ...novaAtividade,
  };
  atividades.push(novaAtividadeComId);
  saveAtividadesToStorage(atividades);
  return novaAtividadeComId;
};

export const listarAtividades = (): Atividade[] => {
  return getAtividadesFromStorage();
};

export const buscarAtividadePorId = (id: string): Atividade | undefined => {
  const atividades = getAtividadesFromStorage();
  return atividades.find((a) => a.id === id);
};

export const atualizarAtividade = (id: string, dadosAtualizados: Partial<Atividade>): Atividade | undefined => {
  const atividades = getAtividadesFromStorage();
  const index = atividades.findIndex((a) => a.id === id);
  if (index === -1) return undefined;

  atividades[index] = { ...atividades[index], ...dadosAtualizados };
  saveAtividadesToStorage(atividades);
  return atividades[index];
};

export const removerAtividade = (id: string): boolean => {
  const atividades = getAtividadesFromStorage();
  const novasAtividades = atividades.filter((a) => a.id !== id);
  if (novasAtividades.length === atividades.length) return false;

  saveAtividadesToStorage(novasAtividades);
  return true;
};
