import {
  Usuario,
  usuariosData,
  UsuarioFilterOptions,
  UsuarioSortOptions,
  UsuarioPaginationOptions,
  UserPreferences,
  UserRole,
  SystemSettings
} from '../data/usuarios';

// Simulate API latency
const SIMULATED_DELAY = 500;

// localStorage keys
const USUARIOS_STORAGE_KEY = 'ecobalance_usuarios';
const USER_PREFERENCES_KEY = 'ecobalance_user_preferences';
const SYSTEM_SETTINGS_KEY = 'ecobalance_system_settings';

// Initialize localStorage with sample data if empty
const initializeStorage = () => {
  if (!localStorage.getItem(USUARIOS_STORAGE_KEY)) {
    localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuariosData));
  }
  
  // Default user preferences
  if (!localStorage.getItem(USER_PREFERENCES_KEY)) {
    const defaultPreferences: UserPreferences = {
      theme: 'system',
      language: 'pt-BR',
      notifications: {
        email: true,
        app: true,
        ratificacoes: true,
        system: true,
      },
      display: {
        compactMode: false,
        animation: true,
        highContrast: false,
      }
    };
    localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(defaultPreferences));
  }
  
  // Default system settings
  if (!localStorage.getItem(SYSTEM_SETTINGS_KEY)) {
    const defaultSettings: SystemSettings = {
      general: {
        companyName: 'EcoBalance',
        supportEmail: 'suporte@ecobalance.com.br',
        timezone: 'America/Sao_Paulo',
      },
      security: {
        passwordMinLength: 8,
        passwordExpiration: 90, // days
        twoFactorAuth: false,
        sessionTimeout: 30, // minutes
      },
      email: {
        smtpServer: 'smtp.ecobalance.com.br',
        smtpPort: 587,
        senderEmail: 'no-reply@ecobalance.com.br',
        requireAuth: true,
      },
      limits: {
        maxUsers: 100,
        maxProjects: 500,
        storageLimit: 50, // GB
      }
    };
    localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(defaultSettings));
  }
};

/**
 * Aplica filtros aos usuários
 */
const applyFilters = (usuarios: Usuario[], filters: UsuarioFilterOptions): Usuario[] => {
  let result = [...usuarios];
  
  // Filter by search term
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(user => 
      user.nome.toLowerCase().includes(term) ||
      user.email.toLowerCase().includes(term) ||
      user.cargo.toLowerCase().includes(term) ||
      user.departamento.toLowerCase().includes(term) ||
      user.id.toLowerCase().includes(term)
    );
  }
  
  // Filter by role
  if (filters.role && filters.role !== 'all') {
    result = result.filter(user => user.role === filters.role);
  }
  
  // Filter by status
  if (filters.status && filters.status !== 'all') {
    result = result.filter(user => user.status === filters.status);
  }
  
  return result;
};

/**
 * Aplica ordenação aos usuários
 */
const applySort = (usuarios: Usuario[], sort: UsuarioSortOptions): Usuario[] => {
  if (!sort.field) return usuarios;
  
  return [...usuarios].sort((a, b) => {
    const valueA = a[sort.field as keyof Usuario];
    const valueB = b[sort.field as keyof Usuario];
    
    // Compare values
    if (valueA < valueB) {
      return sort.direction === 'asc' ? -1 : 1;
    }
    if (valueA > valueB) {
      return sort.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });
};

/**
 * Aplica paginação aos usuários
 */
const applyPagination = (
  usuarios: Usuario[], 
  pagination: UsuarioPaginationOptions
): { items: Usuario[]; totalItems: number; totalPages: number } => {
  const { page, itemsPerPage } = pagination;
  const totalItems = usuarios.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    items: usuarios.slice(startIndex, endIndex),
    totalItems,
    totalPages
  };
};

/**
 * Obtém todos os usuários com filtros, ordenação e paginação
 */
export const getUsuarios = async (
  filters: UsuarioFilterOptions = {},
  sort: UsuarioSortOptions = { field: 'nome', direction: 'asc' },
  pagination: UsuarioPaginationOptions = { page: 1, itemsPerPage: 10 }
): Promise<{
  items: Usuario[];
  totalItems: number;
  totalPages: number;
}> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      
      // Apply filters and sorting
      const filtered = applyFilters(usuarios, filters);
      const sorted = applySort(filtered, sort);
      
      // Apply pagination
      const { items, totalItems, totalPages } = applyPagination(sorted, pagination);
      
      resolve({
        items,
        totalItems,
        totalPages
      });
    }, SIMULATED_DELAY);
  });
};

/**
 * Obtém um usuário pelo ID
 */
export const getUsuarioById = async (id: string): Promise<Usuario | undefined> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      const usuario = usuarios.find(user => user.id === id);
      
      resolve(usuario);
    }, SIMULATED_DELAY);
  });
};

/**
 * Cria um novo usuário
 */
export const createUsuario = async (
  usuario: Omit<Usuario, 'id' | 'dataCriacao' | 'ultimoAcesso'>
): Promise<Usuario> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      
      // Generate new ID
      const lastId = usuarios.length > 0 
        ? parseInt(usuarios[usuarios.length - 1].id.replace('USR', '')) 
        : 0;
      const newId = `USR${(lastId + 1).toString().padStart(3, '0')}`;
      
      // Create new usuario
      const currentDate = new Date().toISOString().split('T')[0];
      const newUsuario: Usuario = {
        ...usuario,
        id: newId,
        dataCriacao: currentDate,
        ultimoAcesso: '-'
      };
      
      // Add to list and save
      usuarios.push(newUsuario);
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
      
      resolve(newUsuario);
    }, SIMULATED_DELAY);
  });
};

/**
 * Atualiza um usuário existente
 */
export const updateUsuario = async (usuario: Usuario): Promise<Usuario> => {
  initializeStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      
      const index = usuarios.findIndex(user => user.id === usuario.id);
      if (index === -1) {
        reject(new Error('Usuário não encontrado'));
        return;
      }
      
      // Update usuario
      usuarios[index] = usuario;
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
      
      resolve(usuario);
    }, SIMULATED_DELAY);
  });
};

/**
 * Exclui um usuário
 */
export const deleteUsuario = async (id: string): Promise<boolean> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      
      const filtered = usuarios.filter(user => user.id !== id);
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(filtered));
      
      resolve(true);
    }, SIMULATED_DELAY);
  });
};

/**
 * Altera o status de um usuário (ativo/inativo)
 */
export const toggleUsuarioStatus = async (id: string): Promise<Usuario> => {
  initializeStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const usuariosString = localStorage.getItem(USUARIOS_STORAGE_KEY) || '[]';
      const usuarios: Usuario[] = JSON.parse(usuariosString);
      
      const index = usuarios.findIndex(user => user.id === id);
      if (index === -1) {
        reject(new Error('Usuário não encontrado'));
        return;
      }
      
      // Toggle status
      const newStatus = usuarios[index].status === 'ativo' ? 'inativo' : 'ativo';
      usuarios[index] = { ...usuarios[index], status: newStatus };
      localStorage.setItem(USUARIOS_STORAGE_KEY, JSON.stringify(usuarios));
      
      resolve(usuarios[index]);
    }, SIMULATED_DELAY);
  });
};

/**
 * Obtém as preferências do usuário atual
 */
export const getUserPreferences = async (): Promise<UserPreferences> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const preferencesString = localStorage.getItem(USER_PREFERENCES_KEY) || '{}';
      const preferences: UserPreferences = JSON.parse(preferencesString);
      
      resolve(preferences);
    }, SIMULATED_DELAY);
  });
};

/**
 * Atualiza as preferências do usuário atual
 */
export const updateUserPreferences = async (preferences: UserPreferences): Promise<UserPreferences> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(USER_PREFERENCES_KEY, JSON.stringify(preferences));
      
      resolve(preferences);
    }, SIMULATED_DELAY);
  });
};

/**
 * Obtém as configurações do sistema
 */
export const getSystemSettings = async (): Promise<SystemSettings> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const settingsString = localStorage.getItem(SYSTEM_SETTINGS_KEY) || '{}';
      const settings: SystemSettings = JSON.parse(settingsString);
      
      resolve(settings);
    }, SIMULATED_DELAY);
  });
};

/**
 * Atualiza as configurações do sistema
 */
export const updateSystemSettings = async (settings: SystemSettings): Promise<SystemSettings> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      localStorage.setItem(SYSTEM_SETTINGS_KEY, JSON.stringify(settings));
      
      resolve(settings);
    }, SIMULATED_DELAY);
  });
}; 