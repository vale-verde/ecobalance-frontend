/**
 * Tipos e dados mock para o sistema de ratificações do EcoBalance
 */

/**
 * Interface para os objetos de Ratificação
 */
export interface Ratificacao {
  id: number;
  codigo: string;
  status: RatificacaoStatus;
  propriedade: {
    id: number;
    nome: string;
    codigo: string;
    municipio: string;
    uf: string;
  };
  responsavel: {
    id: number;
    nome: string;
    email?: string;
    initial?: string;
  };
  dataAtualizacao: string;
  dataCriacao: string;
  tipoProcesso: string;
  numeroProtocolo?: string;
  progress?: number; // Progresso da ratificação em percentual
  propertyName?: string; // Alias para propriedade.nome
  ownerName?: string; // Nome do proprietário
  registration?: string; // Alias para matrícula
  protocol?: string; // Alias para numeroProtocolo
  updatedAt?: string; // Alias para dataAtualizacao
}

/**
 * Status possíveis para uma ratificação
 */
export type RatificacaoStatus = 'rascunho' | 'revisao' | 'ajuste' | 'aprovada' | 'protocolada';

/**
 * Interface para opções de filtro
 */
export interface RatificacaoFilterOptions {
  searchTerm?: string;
  status?: 'all' | RatificacaoStatus;
  propriedadeId?: number;
  responsavelId?: number;
  periodoInicio?: string;
  periodoFim?: string;
}

/**
 * Interface para opções de ordenação
 */
export interface RatificacaoSortOptions {
  field: keyof Ratificacao;
  direction: 'asc' | 'desc';
}

/**
 * Interface para opções de paginação
 */
export interface RatificacaoPaginationOptions {
  page: number;
  itemsPerPage: number;
}

/**
 * Interface para as métricas de ratificação
 */
export interface RatificacaoMetrics {
  total: number;
  pendentes: number;
  aprovadas: number;
  protocoladas: number;
}

/**
 * Dados mock para ratificações
 */
export const MOCK_RATIFICACOES: Ratificacao[] = [
  {
    id: 1,
    codigo: 'RAT-2023-001',
    status: 'protocolada',
    propriedade: {
      id: 1,
      nome: 'Fazenda São João',
      codigo: 'FSJ001',
      municipio: 'São Paulo',
      uf: 'SP'
    },
    responsavel: {
      id: 1,
      nome: 'João Silva',
      email: 'joao.silva@example.com',
      initial: 'J'
    },
    dataAtualizacao: '2023-04-15T14:30:00Z',
    dataCriacao: '2023-04-10T09:15:00Z',
    tipoProcesso: 'Regularização Ambiental',
    numeroProtocolo: 'PROT-2023-0123',
    progress: 100,
    propertyName: 'Fazenda São João',
    ownerName: 'João Silva',
    registration: 'FSJ001',
    protocol: 'PROT-2023-0123',
    updatedAt: '15/04/2023'
  },
  {
    id: 2,
    codigo: 'RAT-2023-002',
    status: 'aprovada',
    propriedade: {
      id: 2,
      nome: 'Sítio Recanto',
      codigo: 'SR002',
      municipio: 'Campinas',
      uf: 'SP'
    },
    responsavel: {
      id: 2,
      nome: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      initial: 'M'
    },
    dataAtualizacao: '2023-04-18T11:20:00Z',
    dataCriacao: '2023-04-12T10:30:00Z',
    tipoProcesso: 'Compensação Ambiental',
    progress: 85,
    propertyName: 'Sítio Recanto',
    ownerName: 'Maria Oliveira',
    registration: 'SR002',
    updatedAt: '18/04/2023'
  },
  {
    id: 3,
    codigo: 'RAT-2023-003',
    status: 'revisao',
    propriedade: {
      id: 3,
      nome: 'Rancho Bom Retiro',
      codigo: 'RBR003',
      municipio: 'Belo Horizonte',
      uf: 'MG'
    },
    responsavel: {
      id: 3,
      nome: 'Carlos Pereira',
      email: 'carlos.pereira@example.com',
      initial: 'C'
    },
    dataAtualizacao: '2023-04-19T16:45:00Z',
    dataCriacao: '2023-04-17T14:00:00Z',
    tipoProcesso: 'Licenciamento Ambiental',
    progress: 60,
    propertyName: 'Rancho Bom Retiro',
    ownerName: 'Carlos Pereira',
    registration: 'RBR003',
    updatedAt: '19/04/2023'
  },
  {
    id: 4,
    codigo: 'RAT-2023-004',
    status: 'rascunho',
    propriedade: {
      id: 1,
      nome: 'Fazenda São João',
      codigo: 'FSJ001',
      municipio: 'São Paulo',
      uf: 'SP'
    },
    responsavel: {
      id: 4,
      nome: 'Amanda Rocha',
      email: 'amanda.rocha@example.com',
      initial: 'A'
    },
    dataAtualizacao: '2023-04-20T09:30:00Z',
    dataCriacao: '2023-04-20T09:30:00Z',
    tipoProcesso: 'Recuperação de Áreas Degradadas',
    progress: 25,
    propertyName: 'Fazenda São João',
    ownerName: 'Amanda Rocha',
    registration: 'FSJ001',
    updatedAt: '20/04/2023'
  },
  {
    id: 5,
    codigo: 'RAT-2023-005',
    status: 'ajuste',
    propriedade: {
      id: 4,
      nome: 'Chácara Vista Alegre',
      codigo: 'CVA004',
      municipio: 'Ribeirão Preto',
      uf: 'SP'
    },
    responsavel: {
      id: 5,
      nome: 'Roberto Almeida',
      email: 'roberto.almeida@example.com',
      initial: 'R'
    },
    dataAtualizacao: '2023-04-21T15:20:00Z',
    dataCriacao: '2023-04-16T11:45:00Z',
    tipoProcesso: 'Certificação Ambiental',
    progress: 40,
    propertyName: 'Chácara Vista Alegre',
    ownerName: 'Roberto Almeida',
    registration: 'CVA004',
    updatedAt: '21/04/2023'
  }
]; 