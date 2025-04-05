/**
 * Interface para o modelo de dados de Usuário
 */
export type UserRole = 'administrador' | 'desenvolvedor' | 'membro';

export interface Usuario {
  id: string;
  nome: string;
  email: string;
  avatar: string;
  cargo: string;
  departamento: string;
  role: UserRole;
  telefone: string;
  status: 'ativo' | 'inativo';
  ultimoAcesso: string;
  dataCriacao: string;
}

/**
 * Mapeamento de permissões por tipo de usuário
 */
export const rolePermissions = {
  administrador: {
    label: 'Administrador',
    description: 'Acesso total ao sistema',
    can: {
      cadastrar: true,
      editar: true,
      excluir: true,
      visualizar: true,
      gerenciarUsuarios: true,
      configurarSistema: true
    }
  },
  desenvolvedor: {
    label: 'Desenvolvedor',
    description: 'Acesso avançado ao sistema, sem permissão para algumas áreas administrativas',
    can: {
      cadastrar: true,
      editar: true,
      excluir: true,
      visualizar: true,
      gerenciarUsuarios: false,
      configurarSistema: false
    }
  },
  membro: {
    label: 'Membro',
    description: 'Acesso básico para uso diário do sistema',
    can: {
      cadastrar: true,
      editar: true,
      excluir: false,
      visualizar: true,
      gerenciarUsuarios: false,
      configurarSistema: false
    }
  }
};

/**
 * Dados de exemplo para usuários
 */
export const usuariosData: Usuario[] = [
  {
    id: "USR001",
    nome: "João Silva",
    email: "joao.silva@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    cargo: "Gerente de Projetos",
    departamento: "Projetos",
    role: "administrador",
    telefone: "(11) 98765-4321",
    status: "ativo",
    ultimoAcesso: "2023-12-15 15:30",
    dataCriacao: "2023-01-10"
  },
  {
    id: "USR002",
    nome: "Maria Santos",
    email: "maria.santos@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/2.jpg",
    cargo: "Engenheira Ambiental",
    departamento: "Ambiental",
    role: "desenvolvedor",
    telefone: "(11) 98555-1234",
    status: "ativo",
    ultimoAcesso: "2023-12-14 10:15",
    dataCriacao: "2023-02-15"
  },
  {
    id: "USR003",
    nome: "Pedro Oliveira",
    email: "pedro.oliveira@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/3.jpg",
    cargo: "Analista Técnico",
    departamento: "Técnico",
    role: "membro",
    telefone: "(11) 97777-9999",
    status: "ativo",
    ultimoAcesso: "2023-12-15 09:20",
    dataCriacao: "2023-03-01"
  },
  {
    id: "USR004",
    nome: "Ana Carvalho",
    email: "ana.carvalho@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/4.jpg",
    cargo: "Diretora Executiva",
    departamento: "Diretoria",
    role: "administrador",
    telefone: "(11) 99876-5432",
    status: "ativo",
    ultimoAcesso: "2023-12-14 18:45",
    dataCriacao: "2023-01-05"
  },
  {
    id: "USR005",
    nome: "Lucas Mendes",
    email: "lucas.mendes@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/5.jpg",
    cargo: "Desenvolvedor Full Stack",
    departamento: "TI",
    role: "desenvolvedor",
    telefone: "(11) 96666-7777",
    status: "ativo",
    ultimoAcesso: "2023-12-15 14:30",
    dataCriacao: "2023-04-10"
  },
  {
    id: "USR006",
    nome: "Juliana Costa",
    email: "juliana.costa@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/6.jpg",
    cargo: "Especialista em Ratificações",
    departamento: "Ambiental",
    role: "membro",
    telefone: "(11) 95555-4444",
    status: "inativo",
    ultimoAcesso: "2023-11-30 11:20",
    dataCriacao: "2023-05-20"
  },
  {
    id: "USR007",
    nome: "Ricardo Alves",
    email: "ricardo.alves@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/7.jpg",
    cargo: "Consultor Ambiental",
    departamento: "Consultoria",
    role: "membro",
    telefone: "(11) 94444-3333",
    status: "ativo",
    ultimoAcesso: "2023-12-13 16:10",
    dataCriacao: "2023-06-15"
  },
  {
    id: "USR008",
    nome: "Fernanda Lima",
    email: "fernanda.lima@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/8.jpg",
    cargo: "Gerente de Contas",
    departamento: "Comercial",
    role: "desenvolvedor",
    telefone: "(11) 93333-2222",
    status: "ativo",
    ultimoAcesso: "2023-12-14 09:45",
    dataCriacao: "2023-07-01"
  },
  {
    id: "USR009",
    nome: "Marcos Souza",
    email: "marcos.souza@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/9.jpg",
    cargo: "Assistente Administrativo",
    departamento: "Administrativo",
    role: "membro",
    telefone: "(11) 92222-1111",
    status: "ativo",
    ultimoAcesso: "2023-12-15 08:30",
    dataCriacao: "2023-08-10"
  },
  {
    id: "USR010",
    nome: "Camila Torres",
    email: "camila.torres@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/10.jpg",
    cargo: "Supervisora de Projetos",
    departamento: "Projetos",
    role: "administrador",
    telefone: "(11) 91111-0000",
    status: "inativo",
    ultimoAcesso: "2023-11-10 14:15",
    dataCriacao: "2023-09-05"
  }
];

/**
 * Interface para opções de filtro de usuários
 */
export interface UsuarioFilterOptions {
  searchTerm?: string;
  role?: UserRole | 'all';
  status?: 'ativo' | 'inativo' | 'all';
}

/**
 * Interface para opções de ordenação
 */
export interface UsuarioSortOptions {
  field: keyof Usuario | '';
  direction: 'asc' | 'desc';
}

/**
 * Interface para opções de paginação
 */
export interface UsuarioPaginationOptions {
  page: number;
  itemsPerPage: number;
}

/**
 * Interface para as preferências do usuário
 */
export interface UserPreferences {
  theme: 'light' | 'dark' | 'system';
  language: 'pt-BR' | 'en-US' | 'es';
  notifications: {
    email: boolean;
    app: boolean;
    ratificacoes: boolean;
    system: boolean;
  };
  display: {
    compactMode: boolean;
    animation: boolean;
    highContrast: boolean;
  };
}

/**
 * Configurações de sistema
 */
export interface SystemSettings {
  general: {
    companyName: string;
    supportEmail: string;
    timezone: string;
  };
  security: {
    passwordMinLength: number;
    passwordExpiration: number;
    twoFactorAuth: boolean;
    sessionTimeout: number;
  };
  email: {
    smtpServer: string;
    smtpPort: number;
    senderEmail: string;
    requireAuth: boolean;
  };
  limits: {
    maxUsers: number;
    maxProjects: number;
    storageLimit: number;
  };
} 