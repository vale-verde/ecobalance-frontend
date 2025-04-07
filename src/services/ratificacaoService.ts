import { 
  Ratificacao, 
  RatificacaoFilterOptions, 
  RatificacaoSortOptions, 
  RatificacaoPaginationOptions,
  RatificacaoMetrics,
  MOCK_RATIFICACOES
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
    localStorage.setItem(RATIFICACOES_STORAGE_KEY, JSON.stringify(MOCK_RATIFICACOES));
  }
};

/**
 * Buscar ratificações com filtragem, ordenação e paginação
 */
export const getRatificacoes = async (
  filters: RatificacaoFilterOptions = { status: 'all' },
  sort: RatificacaoSortOptions = { field: 'dataAtualizacao', direction: 'desc' },
  pagination: RatificacaoPaginationOptions = { page: 1, itemsPerPage: 10 }
): Promise<{
  items: Ratificacao[];
  totalItems: number;
  totalPages: number;
  metrics: RatificacaoMetrics;
}> => {
  // Simular latência de rede
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Aplicar filtros
  let filteredItems = [...MOCK_RATIFICACOES];
  
  // Filtrar por status
  if (filters.status && filters.status !== 'all') {
    filteredItems = filteredItems.filter(item => item.status === filters.status);
  }
  
  // Filtrar por termo de busca
  if (filters.searchTerm) {
    const term = filters.searchTerm.toLowerCase();
    filteredItems = filteredItems.filter(item => 
      item.codigo.toLowerCase().includes(term) ||
      item.propriedade.nome.toLowerCase().includes(term) ||
      item.propriedade.codigo.toLowerCase().includes(term) ||
      item.responsavel.nome.toLowerCase().includes(term) ||
      item.tipoProcesso.toLowerCase().includes(term) ||
      (item.numeroProtocolo && item.numeroProtocolo.toLowerCase().includes(term))
    );
  }
  
  // Filtrar por propriedade
  if (filters.propriedadeId) {
    filteredItems = filteredItems.filter(item => 
      item.propriedade.id === filters.propriedadeId
    );
  }
  
  // Filtrar por responsável
  if (filters.responsavelId) {
    filteredItems = filteredItems.filter(item => 
      item.responsavel.id === filters.responsavelId
    );
  }
  
  // Filtrar por período
  if (filters.periodoInicio || filters.periodoFim) {
    filteredItems = filteredItems.filter(item => {
      const dataItem = new Date(item.dataCriacao);
      
      if (filters.periodoInicio && filters.periodoFim) {
        const inicio = new Date(filters.periodoInicio);
        const fim = new Date(filters.periodoFim);
        return dataItem >= inicio && dataItem <= fim;
      }
      
      if (filters.periodoInicio) {
        const inicio = new Date(filters.periodoInicio);
        return dataItem >= inicio;
      }
      
      if (filters.periodoFim) {
        const fim = new Date(filters.periodoFim);
        return dataItem <= fim;
      }
      
      return true;
    });
  }
  
  // Calcular métricas
  const metrics = {
    total: filteredItems.length,
    pendentes: filteredItems.filter(item => ['rascunho', 'revisao', 'ajuste'].includes(item.status)).length,
    aprovadas: filteredItems.filter(item => item.status === 'aprovada').length,
    protocoladas: filteredItems.filter(item => item.status === 'protocolada').length
  };
  
  // Aplicar ordenação
  filteredItems.sort((a, b) => {
    // Tratamento especial para campos aninhados ou alias
    let valueA, valueB;
    
    // Para cada campo específico, garantir o acesso ao valor correto
    if (sort.field === 'propertyName') {
      valueA = a.propertyName || a.propriedade.nome;
      valueB = b.propertyName || b.propriedade.nome;
    } 
    else if (sort.field === 'ownerName') {
      valueA = a.ownerName || '';
      valueB = b.ownerName || '';
    }
    else if (sort.field === 'registration') {
      valueA = a.registration || a.propriedade.codigo;
      valueB = b.registration || b.propriedade.codigo;
    }
    else if (sort.field === 'protocol') {
      valueA = a.protocol || a.numeroProtocolo || '';
      valueB = b.protocol || b.numeroProtocolo || '';
    }
    else if (sort.field === 'updatedAt') {
      valueA = a.updatedAt || a.dataAtualizacao;
      valueB = b.updatedAt || b.dataAtualizacao;
    }
    else if (sort.field === 'responsavel') {
      valueA = a.responsavel?.nome || '';
      valueB = b.responsavel?.nome || '';
    }
    else {
      valueA = a[sort.field];
      valueB = b[sort.field];
    }
    
    // Comparação de valores
    if (typeof valueA === 'string' && typeof valueB === 'string') {
      return sort.direction === 'asc'
        ? valueA.localeCompare(valueB)
        : valueB.localeCompare(valueA);
    }
    
    // Ordenar números ou datas
    if (valueA !== undefined && valueB !== undefined) {
      return sort.direction === 'asc'
        ? (valueA < valueB ? -1 : valueA > valueB ? 1 : 0)
        : (valueA > valueB ? -1 : valueA < valueB ? 1 : 0);
    }
    
    return 0;
  });
  
  // Aplicar paginação
  const { page, itemsPerPage } = pagination;
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const paginatedItems = filteredItems.slice(startIndex, endIndex);
  
  return {
    items: paginatedItems,
    totalItems: filteredItems.length,
    totalPages: Math.ceil(filteredItems.length / itemsPerPage),
    metrics
  };
};

/**
 * Criar nova ratificação
 */
export const createRatificacao = async (data: Partial<Ratificacao>): Promise<Ratificacao> => {
  // Simular latência de rede
  await new Promise(resolve => setTimeout(resolve, 800));
  
  // Gerar ID único e código
  const id = MOCK_RATIFICACOES.length + 1;
  const codigo = `RAT-${new Date().getFullYear()}-${String(id).padStart(3, '0')}`;
  
  // Criar nova ratificação
  const newRatificacao: Ratificacao = {
    id,
    codigo,
    status: 'rascunho',
    dataCriacao: new Date().toISOString(),
    dataAtualizacao: new Date().toISOString(),
    tipoProcesso: data.tipoProcesso || 'Regularização Ambiental',
    propriedade: data.propriedade || MOCK_RATIFICACOES[0].propriedade,
    responsavel: data.responsavel || MOCK_RATIFICACOES[0].responsavel,
    progress: 0,
    updatedAt: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' }),
    propertyName: data.propriedade?.nome || MOCK_RATIFICACOES[0].propriedade.nome,
    ownerName: data.responsavel?.nome || MOCK_RATIFICACOES[0].responsavel.nome,
    registration: data.propriedade?.codigo || MOCK_RATIFICACOES[0].propriedade.codigo
  };
  
  // Adicionar à lista (mock - em produção seria persistido no banco)
  MOCK_RATIFICACOES.push(newRatificacao);
  
  return newRatificacao;
};

/**
 * Atualizar ratificação existente
 */
export const updateRatificacao = async (id: number, data: Partial<Ratificacao>): Promise<Ratificacao> => {
  // Simular latência de rede
  await new Promise(resolve => setTimeout(resolve, 700));
  
  // Encontrar índice da ratificação a ser atualizada
  const index = MOCK_RATIFICACOES.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error(`Ratificação com ID ${id} não encontrada`);
  }
  
  // Criar objeto atualizado
  const updatedRatificacao: Ratificacao = {
    ...MOCK_RATIFICACOES[index],
    ...data,
    dataAtualizacao: new Date().toISOString(),
    updatedAt: new Date().toLocaleString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  };
  
  // Atualizar dados derivados se os dados principais foram alterados
  if (data.propriedade) {
    updatedRatificacao.propertyName = data.propriedade.nome;
    updatedRatificacao.registration = data.propriedade.codigo;
  }
  
  if (data.responsavel) {
    updatedRatificacao.ownerName = data.responsavel.nome;
  }
  
  if (data.numeroProtocolo) {
    updatedRatificacao.protocol = data.numeroProtocolo;
  }
  
  // Atualizar na lista (mock - em produção seria persistido no banco)
  MOCK_RATIFICACOES[index] = updatedRatificacao;
  
  return updatedRatificacao;
};

/**
 * Excluir ratificação
 */
export const deleteRatificacao = async (id: number): Promise<void> => {
  // Simular latência de rede
  await new Promise(resolve => setTimeout(resolve, 600));
  
  // Encontrar índice da ratificação a ser excluída
  const index = MOCK_RATIFICACOES.findIndex(item => item.id === id);
  
  if (index === -1) {
    throw new Error(`Ratificação com ID ${id} não encontrada`);
  }
  
  // Remover da lista (mock - em produção seria persistido no banco)
  MOCK_RATIFICACOES.splice(index, 1);
}; 