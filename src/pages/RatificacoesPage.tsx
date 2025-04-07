import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import AddIcon from '@mui/icons-material/Add';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import { useNavigate } from 'react-router-dom';

import RatificacaoTable from '../components/ratificacao/RatificacaoTable';
import RatificacaoList from '../components/ratificacao/RatificacaoList';
import { 
  getRatificacoes, 
  createRatificacao, 
  updateRatificacao, 
  deleteRatificacao 
} from '../services/ratificacaoService';
import { 
  Ratificacao, 
  RatificacaoFilterOptions,
  RatificacaoSortOptions,
  RatificacaoPaginationOptions
} from '../data/ratificacoes';

/**
 * Página principal de Ratificações
 * 
 * Exibe a lista de ratificações em formato de tabela para desktop/tablet
 * e em formato de lista de cards para dispositivos móveis
 */
export default function RatificacoesPage() {
  const navigate = useNavigate();
  
  // Estado para armazenar os dados das ratificações
  const [data, setData] = React.useState<{
    items: Ratificacao[];
    totalItems: number;
    totalPages: number;
    metrics: {
      total: number;
      pendentes: number;
      aprovadas: number;
      protocoladas: number;
    };
  }>({
    items: [],
    totalItems: 0,
    totalPages: 1,
    metrics: {
      total: 0,
      pendentes: 0,
      aprovadas: 0,
      protocoladas: 0
    }
  });
  
  // Estados para controle de filtros, ordenação e paginação
  const [filters, setFilters] = React.useState<RatificacaoFilterOptions>({ status: 'all' });
  const [sort, setSort] = React.useState<RatificacaoSortOptions>({ field: 'dataAtualizacao', direction: 'desc' });
  const [pagination, setPagination] = React.useState<RatificacaoPaginationOptions>({ page: 1, itemsPerPage: 10 });
  
  // Estados para controle da interface
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  
  /**
   * Carregar ratificações da API
   */
  const loadRatificacoes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    
    try {
      const result = await getRatificacoes(filters, sort, pagination);
      setData(result);
    } catch (err) {
      console.error('Erro ao carregar ratificações:', err);
      setError('Não foi possível carregar as ratificações. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, [filters, sort, pagination]);
  
  /**
   * Carregar ratificações quando os filtros, ordenação ou paginação mudam
   */
  React.useEffect(() => {
    loadRatificacoes();
  }, [loadRatificacoes]);
  
  /**
   * Manipuladores de eventos para atualização de filtros
   */
  const handleSearch = (searchTerm: string) => {
    setFilters(prev => ({ ...prev, searchTerm }));
    setPagination(prev => ({ ...prev, page: 1 })); // Voltar para primeira página
  };
  
  const handleStatusFilter = (status: RatificacaoFilterOptions['status']) => {
    setFilters(prev => ({ ...prev, status }));
    setPagination(prev => ({ ...prev, page: 1 })); // Voltar para primeira página
  };
  
  /**
   * Manipuladores para ordenação
   */
  const handleSort = (field: keyof Ratificacao, direction: 'asc' | 'desc') => {
    setSort({ field, direction });
  };
  
  /**
   * Manipuladores para paginação
   */
  const handlePageChange = (page: number) => {
    setPagination(prev => ({ ...prev, page }));
  };
  
  const handleRowsPerPageChange = (itemsPerPage: number) => {
    setPagination({ page: 1, itemsPerPage });
  };
  
  /**
   * Navegar para a página de criação de nova ratificação
   */
  const handleCreateRatificacao = () => {
    navigate('/nova-ratificacao');
  };

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 6 },
        pt: {
          xs: 'calc(12px + var(--Header-height))',
          sm: 'calc(12px + var(--Header-height))',
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100dvh',
        gap: 1,
      }}
    >
      {/* Breadcrumbs para navegação */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="/"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Ratificações
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Cabeçalho da página */}
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2" component="h1">
          Ratificações
        </Typography>
        <Button
          color="primary"
          startDecorator={<AddIcon />}
          size="sm"
          onClick={handleCreateRatificacao}
        >
          Nova Ratificação
        </Button>
      </Box>
      
      {/* Exibir mensagem de erro */}
      {error && (
        <Box sx={{ p: 2, width: '100%' }}>
          <Typography color="danger" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button onClick={loadRatificacoes} variant="soft" color="primary">
            Tentar novamente
          </Button>
        </Box>
      )}
      
      {/* Componentes principais */}
      {!error && (
        <>
          <RatificacaoTable 
            data={data}
            loading={loading}
            filters={filters}
            sort={sort}
            pagination={pagination}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
            onSort={handleSort}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowsPerPageChange}
          />
          <RatificacaoList 
            data={data}
            loading={loading}
            filters={filters}
            onSearch={handleSearch}
            onStatusFilter={handleStatusFilter}
          />
        </>
      )}
    </Box>
  );
} 