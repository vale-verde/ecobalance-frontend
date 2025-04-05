import { 
  Ratificacao, 
  ratificacoesData, 
  RatificacaoFilterOptions, 
  RatificacaoSortOptions, 
  RatificacaoPaginationOptions,
  RatificacaoMetrics
} from '../data/ratificacoes';

// Simulate API latency
const SIMULATED_DELAY = 500;

// localStorage key
const RATIFICACOES_STORAGE_KEY = 'ecobalance_ratificacoes';

/**
 * Inicializa o localStorage com dados de exemplo se vazio
 */
const initializeStorage = () => {
  if (!localStorage.getItem(RATIFICACOES_STORAGE_KEY)) {
    localStorage.setItem(RATIFICACOES_STORAGE_KEY, JSON.stringify(ratificacoesData));
  }
};

/**
 * Aplica filtros às ratificações
 */
const applyFilters = (ratificacoes: Ratificacao[], filters: RatificacaoFilterOptions): Ratificacao[] => {
  let result = [...ratificacoes];
  
  // Filtrar por termo de busca
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    result = result.filter(r => 
      r.id.toLowerCase().includes(term) ||
      r.propertyName.toLowerCase().includes(term) ||
      r.ownerName.toLowerCase().includes(term) ||
      r.registration.toLowerCase().includes(term) ||
      r.responsible.name.toLowerCase().includes(term)
    );
  }
  
  // Filtrar por status
  if (filters.status && filters.status !== 'all') {
    if (filters.status === 'pending') {
      // Pendentes: draft + adjustment
      result = result.filter(r => ['draft', 'adjustment'].includes(r.status));
    } else if (filters.status === 'protocoled') {
      // Protocoladas
      result = result.filter(r => r.protocol);
    } else {
      // Status específico
      result = result.filter(r => r.status === filters.status);
    }
  }
  
  return result;
};

/**
 * Aplica ordenação às ratificações
 */
const applySort = (ratificacoes: Ratificacao[], sort: RatificacaoSortOptions): Ratificacao[] => {
  if (!sort.field) return ratificacoes;
  
  return [...ratificacoes].sort((a, b) => {
    let valueA, valueB;
    
    // Tratamento especial para campos aninhados
    if (sort.field === 'responsible') {
      valueA = a.responsible.name;
      valueB = b.responsible.name;
    } else {
      valueA = a[sort.field as keyof Ratificacao];
      valueB = b[sort.field as keyof Ratificacao];
    }
    
    // Comparar valores
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
 * Aplica paginação às ratificações
 */
const applyPagination = (
  ratificacoes: Ratificacao[], 
  pagination: RatificacaoPaginationOptions
): { items: Ratificacao[]; totalItems: number; totalPages: number } => {
  const { page, itemsPerPage } = pagination;
  const totalItems = ratificacoes.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, totalItems);
  
  return {
    items: ratificacoes.slice(startIndex, endIndex),
    totalItems,
    totalPages
  };
};

/**
 * Calcula métricas das ratificações
 */
const calculateMetrics = (ratificacoes: Ratificacao[]): RatificacaoMetrics => {
  const total = ratificacoes.length;
  const pendentes = ratificacoes.filter(r => ['draft', 'adjustment'].includes(r.status)).length;
  const aprovadas = ratificacoes.filter(r => r.status === 'approved').length;
  const protocoladas = ratificacoes.filter(r => r.protocol).length;
  
  return {
    total,
    pendentes,
    aprovadas,
    protocoladas
  };
};

/**
 * Obtém todas as ratificações com filtros, ordenação e paginação
 */
export const getRatificacoes = async (
  filters: RatificacaoFilterOptions = {},
  sort: RatificacaoSortOptions = { field: 'updatedAt', direction: 'desc' },
  pagination: RatificacaoPaginationOptions = { page: 1, itemsPerPage: 10 }
): Promise<{
  items: Ratificacao[];
  totalItems: number;
  totalPages: number;
  metrics: RatificacaoMetrics;
}> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratificacoesString = localStorage.getItem(RATIFICACOES_STORAGE_KEY) || '[]';
      const ratificacoes: Ratificacao[] = JSON.parse(ratificacoesString);
      
      // Aplicar filtros e ordenação
      const filtered = applyFilters(ratificacoes, filters);
      const sorted = applySort(filtered, sort);
      
      // Calcular métricas
      const metrics = calculateMetrics(ratificacoes);
      
      // Aplicar paginação
      const { items, totalItems, totalPages } = applyPagination(sorted, pagination);
      
      resolve({
        items,
        totalItems,
        totalPages,
        metrics
      });
    }, SIMULATED_DELAY);
  });
};

/**
 * Obtém uma ratificação pelo ID
 */
export const getRatificacaoById = async (id: string): Promise<Ratificacao | undefined> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratificacoesString = localStorage.getItem(RATIFICACOES_STORAGE_KEY) || '[]';
      const ratificacoes: Ratificacao[] = JSON.parse(ratificacoesString);
      const ratificacao = ratificacoes.find(r => r.id === id);
      
      resolve(ratificacao);
    }, SIMULATED_DELAY);
  });
};

/**
 * Cria uma nova ratificação
 */
export const createRatificacao = async (
  ratificacao: Omit<Ratificacao, 'id' | 'createdAt' | 'updatedAt'>
): Promise<Ratificacao> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratificacoesString = localStorage.getItem(RATIFICACOES_STORAGE_KEY) || '[]';
      const ratificacoes: Ratificacao[] = JSON.parse(ratificacoesString);
      
      // Gerar novo ID
      const lastId = ratificacoes.length > 0 
        ? parseInt(ratificacoes[ratificacoes.length - 1].id.replace('RAT', '')) 
        : 0;
      const newId = `RAT${(lastId + 1).toString().padStart(5, '0')}`;
      
      // Criar nova ratificação
      const currentDate = new Date().toISOString().split('T')[0];
      const newRatificacao: Ratificacao = {
        ...ratificacao,
        id: newId,
        createdAt: currentDate,
        updatedAt: currentDate
      };
      
      // Adicionar à lista e salvar
      ratificacoes.push(newRatificacao);
      localStorage.setItem(RATIFICACOES_STORAGE_KEY, JSON.stringify(ratificacoes));
      
      resolve(newRatificacao);
    }, SIMULATED_DELAY);
  });
};

/**
 * Atualiza uma ratificação existente
 */
export const updateRatificacao = async (ratificacao: Ratificacao): Promise<Ratificacao> => {
  initializeStorage();
  
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const ratificacoesString = localStorage.getItem(RATIFICACOES_STORAGE_KEY) || '[]';
      const ratificacoes: Ratificacao[] = JSON.parse(ratificacoesString);
      
      const index = ratificacoes.findIndex(r => r.id === ratificacao.id);
      if (index === -1) {
        reject(new Error('Ratificação não encontrada'));
        return;
      }
      
      // Atualizar campo updatedAt
      const updatedRatificacao = {
        ...ratificacao,
        updatedAt: new Date().toISOString().split('T')[0]
      };
      
      // Atualizar na lista e salvar
      ratificacoes[index] = updatedRatificacao;
      localStorage.setItem(RATIFICACOES_STORAGE_KEY, JSON.stringify(ratificacoes));
      
      resolve(updatedRatificacao);
    }, SIMULATED_DELAY);
  });
};

/**
 * Exclui uma ratificação
 */
export const deleteRatificacao = async (id: string): Promise<boolean> => {
  initializeStorage();
  
  return new Promise((resolve) => {
    setTimeout(() => {
      const ratificacoesString = localStorage.getItem(RATIFICACOES_STORAGE_KEY) || '[]';
      const ratificacoes: Ratificacao[] = JSON.parse(ratificacoesString);
      
      const filtered = ratificacoes.filter(r => r.id !== id);
      localStorage.setItem(RATIFICACOES_STORAGE_KEY, JSON.stringify(filtered));
      
      resolve(true);
    }, SIMULATED_DELAY);
  });
}; 