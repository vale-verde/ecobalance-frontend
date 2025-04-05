/**
 * Interface para o modelo de dados de Ratificação
 */
export interface Ratificacao {
  id: string;
  propertyName: string;
  ownerName: string;
  registration: string;
  status: 'draft' | 'adjustment' | 'review' | 'approved';
  responsible: {
    id: string;
    name: string;
    initial: string;
    email: string;
  };
  progress: number;
  protocol: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Gera um conjunto de dados de exemplo para ratificações
 */
export const ratificacoesData: Ratificacao[] = [
  {
    id: "RAT00001",
    propertyName: "Fazenda São Francisco",
    ownerName: "João Silva",
    registration: "MT-12345",
    status: "approved",
    responsible: {
      id: "USR001",
      name: "Amanda Oliveira",
      initial: "A",
      email: "amanda@example.com"
    },
    progress: 100,
    protocol: true,
    createdAt: "2023-12-01",
    updatedAt: "2023-12-15"
  },
  {
    id: "RAT00002",
    propertyName: "Sítio Boa Esperança",
    ownerName: "Maria Santos",
    registration: "SP-54321",
    status: "draft",
    responsible: {
      id: "USR002",
      name: "Bruno Costa",
      initial: "B",
      email: "bruno@example.com"
    },
    progress: 30,
    protocol: false,
    createdAt: "2023-12-05",
    updatedAt: "2023-12-05"
  },
  {
    id: "RAT00003",
    propertyName: "Rancho Dois Irmãos",
    ownerName: "Pedro Ferreira",
    registration: "GO-78901",
    status: "adjustment",
    responsible: {
      id: "USR003",
      name: "Carla Mendes",
      initial: "C",
      email: "carla@example.com"
    },
    progress: 60,
    protocol: false,
    createdAt: "2023-11-20",
    updatedAt: "2023-12-10"
  },
  {
    id: "RAT00004",
    propertyName: "Fazenda Três Marias",
    ownerName: "Antônio Oliveira",
    registration: "MG-23456",
    status: "review",
    responsible: {
      id: "USR001",
      name: "Amanda Oliveira",
      initial: "A",
      email: "amanda@example.com"
    },
    progress: 85,
    protocol: false,
    createdAt: "2023-11-15",
    updatedAt: "2023-12-12"
  },
  {
    id: "RAT00005",
    propertyName: "Estância Verde",
    ownerName: "Ricardo Mendes",
    registration: "PR-67890",
    status: "approved",
    responsible: {
      id: "USR004",
      name: "Diego Souza",
      initial: "D",
      email: "diego@example.com"
    },
    progress: 100,
    protocol: true,
    createdAt: "2023-10-30",
    updatedAt: "2023-11-20"
  },
  {
    id: "RAT00006",
    propertyName: "Sítio Dois Lagos",
    ownerName: "Juliana Alves",
    registration: "SC-34567",
    status: "draft",
    responsible: {
      id: "USR002",
      name: "Bruno Costa",
      initial: "B",
      email: "bruno@example.com"
    },
    progress: 15,
    protocol: false,
    createdAt: "2023-12-10",
    updatedAt: "2023-12-10"
  },
  {
    id: "RAT00007",
    propertyName: "Fazenda Rio Claro",
    ownerName: "Fernando Martins",
    registration: "MT-89012",
    status: "adjustment",
    responsible: {
      id: "USR003",
      name: "Carla Mendes",
      initial: "C",
      email: "carla@example.com"
    },
    progress: 50,
    protocol: false,
    createdAt: "2023-11-05",
    updatedAt: "2023-12-08"
  },
  {
    id: "RAT00008",
    propertyName: "Rancho Santa Fé",
    ownerName: "Mariana Costa",
    registration: "GO-45678",
    status: "approved",
    responsible: {
      id: "USR004",
      name: "Diego Souza",
      initial: "D",
      email: "diego@example.com"
    },
    progress: 100,
    protocol: true,
    createdAt: "2023-10-15",
    updatedAt: "2023-11-10"
  },
  {
    id: "RAT00009",
    propertyName: "Fazenda Novo Horizonte",
    ownerName: "Carlos Eduardo",
    registration: "BA-56789",
    status: "review",
    responsible: {
      id: "USR001",
      name: "Amanda Oliveira",
      initial: "A",
      email: "amanda@example.com"
    },
    progress: 90,
    protocol: false,
    createdAt: "2023-11-12",
    updatedAt: "2023-12-14"
  },
  {
    id: "RAT00010",
    propertyName: "Estância Paraíso",
    ownerName: "Patrícia Lima",
    registration: "MS-67890",
    status: "draft",
    responsible: {
      id: "USR002",
      name: "Bruno Costa",
      initial: "B",
      email: "bruno@example.com"
    },
    progress: 25,
    protocol: false,
    createdAt: "2023-12-08",
    updatedAt: "2023-12-12"
  },
  {
    id: "RAT00011",
    propertyName: "Fazenda Vale Verde",
    ownerName: "Roberto Almeida",
    registration: "MT-98765",
    status: "approved",
    responsible: {
      id: "USR003",
      name: "Carla Mendes",
      initial: "C",
      email: "carla@example.com"
    },
    progress: 100,
    protocol: true,
    createdAt: "2023-10-10",
    updatedAt: "2023-11-05"
  },
  {
    id: "RAT00012",
    propertyName: "Sítio Bela Vista",
    ownerName: "Luciana Torres",
    registration: "SP-23456",
    status: "adjustment",
    responsible: {
      id: "USR004",
      name: "Diego Souza",
      initial: "D",
      email: "diego@example.com"
    },
    progress: 65,
    protocol: false,
    createdAt: "2023-11-22",
    updatedAt: "2023-12-13"
  },
  {
    id: "RAT00013",
    propertyName: "Estância Primavera",
    ownerName: "Gabriel Nogueira",
    registration: "MG-34567",
    status: "draft",
    responsible: {
      id: "USR001",
      name: "Amanda Oliveira",
      initial: "A",
      email: "amanda@example.com"
    },
    progress: 20,
    protocol: false,
    createdAt: "2023-12-07",
    updatedAt: "2023-12-07"
  },
  {
    id: "RAT00014",
    propertyName: "Fazenda Belo Monte",
    ownerName: "Renato Pereira",
    registration: "GO-12345",
    status: "review",
    responsible: {
      id: "USR002",
      name: "Bruno Costa",
      initial: "B",
      email: "bruno@example.com"
    },
    progress: 80,
    protocol: false,
    createdAt: "2023-11-18",
    updatedAt: "2023-12-11"
  },
  {
    id: "RAT00015",
    propertyName: "Rancho Águas Claras",
    ownerName: "Camila Rodrigues",
    registration: "PR-23456",
    status: "approved",
    responsible: {
      id: "USR003",
      name: "Carla Mendes",
      initial: "C",
      email: "carla@example.com"
    },
    progress: 100,
    protocol: true,
    createdAt: "2023-10-20",
    updatedAt: "2023-11-15"
  }
];

/**
 * Interface para opções de filtro
 */
export interface RatificacaoFilterOptions {
  searchTerm?: string;
  status?: 'all' | 'draft' | 'adjustment' | 'review' | 'approved' | 'pending' | 'protocoled';
}

/**
 * Interface para opções de ordenação
 */
export interface RatificacaoSortOptions {
  field: keyof Ratificacao | '';
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