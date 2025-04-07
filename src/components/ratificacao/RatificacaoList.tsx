import * as React from 'react';
import Box from '@mui/joy/Box';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Link from '@mui/joy/Link';
import IconButton from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import ListDivider from '@mui/joy/ListDivider';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import ModalClose from '@mui/joy/ModalClose';
import ModalDialog from '@mui/joy/ModalDialog';
import Modal from '@mui/joy/Modal';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Button from '@mui/joy/Button';
import Divider from '@mui/joy/Divider';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

// Icons
import VerifiedIcon from '@mui/icons-material/Verified';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

// Componentes próprios
import RatificacaoStatusBadge from './RatificacaoStatusBadge';
import RatificacaoProgressBar from './RatificacaoProgressBar';
import RatificacaoMetricsCards from './RatificacaoMetricsCards';

// Tipos e interfaces
import { 
  Ratificacao, 
  RatificacaoFilterOptions 
} from '../../data/ratificacoes';

/**
 * Props para o componente RatificacaoList
 */
interface RatificacaoListProps {
  data: {
    items: Ratificacao[];
    totalItems: number;
    totalPages: number;
    metrics: {
      total: number;
      pendentes: number;
      aprovadas: number;
      protocoladas: number;
    };
  };
  loading: boolean;
  filters: RatificacaoFilterOptions;
  onSearch: (searchTerm: string) => void;
  onStatusFilter: (status: RatificacaoFilterOptions['status']) => void;
}

/**
 * Menu de ações para cada item da lista
 */
function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem onClick={() => alert('Funcionalidade de visualização não implementada')}>
          <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
          Visualizar
        </MenuItem>
        <MenuItem onClick={() => alert('Funcionalidade de edição não implementada')}>
          <EditIcon fontSize="small" sx={{ mr: 1 }} />
          Editar
        </MenuItem>
        <MenuItem onClick={() => alert('Funcionalidade de download não implementada')}>
          <FileDownloadIcon fontSize="small" sx={{ mr: 1 }} />
          Baixar
        </MenuItem>
        <Divider />
        <MenuItem 
          color="danger" 
          onClick={() => alert('Funcionalidade de exclusão não implementada')}
        >
          <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
          Excluir
        </MenuItem>
      </Menu>
    </Dropdown>
  );
}

/**
 * Componente que exibe a lista de ratificações para dispositivos móveis
 */
export default function RatificacaoList({
  data,
  loading,
  filters,
  onSearch,
  onStatusFilter
}: RatificacaoListProps) {
  const [open, setOpen] = React.useState(false);
  const [searchValue, setSearchValue] = React.useState(filters.searchTerm || '');
  const [page, setPage] = React.useState(1);
  const itemsPerPage = 10;
  
  // Cálculos para paginação local
  const startIndex = (page - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, data.items.length);
  const displayedItems = data.items.slice(startIndex, endIndex);
  const totalPages = Math.max(1, Math.ceil(data.items.length / itemsPerPage));
  
  // Manipuladores de eventos
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };
  
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  // Renderiza os filtros de status
  const renderFilters = () => (
    <FormControl size="sm" sx={{ minWidth: 150 }}>
      <FormLabel>Status</FormLabel>
      <Select
        size="sm"
        placeholder="Filtrar por status"
        value={filters.status || 'all'}
        onChange={(_, value) => value && onStatusFilter(value as RatificacaoFilterOptions['status'])}
        slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
      >
        <Option value="all">Todos</Option>
        <Option value="draft">Rascunho</Option>
        <Option value="adjustment">Ajuste</Option>
        <Option value="review">Revisão</Option>
        <Option value="approved">Aprovada</Option>
        <Option value="pending">Pendentes</Option>
        <Option value="protocoled">Protocoladas</Option>
      </Select>
    </FormControl>
  );

  return (
    <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
      {/* Barra de pesquisa */}
      <Sheet
        sx={{
          px: 2,
          py: 1,
          mb: 1,
          display: 'flex',
          flexDirection: 'column',
          gap: 2,
          borderRadius: 'sm',
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: 1 }}>
          <Input
            size="sm"
            placeholder="Pesquisar ratificações..."
            startDecorator={<SearchRoundedIcon />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flex: 1 }}
            endDecorator={
              searchValue && (
                <IconButton 
                  size="sm" 
                  variant="plain" 
                  color="neutral" 
                  onClick={() => {
                    setSearchValue('');
                    onSearch('');
                  }}
                >
                  <CloseRoundedIcon />
                </IconButton>
              )
            }
          />
          <IconButton
            size="sm"
            variant="outlined"
            color="neutral"
            onClick={() => setOpen(true)}
          >
            <FilterAltIcon />
          </IconButton>
        </form>
        
        {/* Modal de filtros */}
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filtros
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Aplicar
              </Button>
            </Box>
          </ModalDialog>
        </Modal>
      </Sheet>
      
      {/* Cartões de métricas */}
      <RatificacaoMetricsCards 
        metrics={data.metrics} 
        onFilterClick={onStatusFilter} 
        currentFilter={filters.status || 'all'} 
      />
      
      {/* Lista de ratificações */}
      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography level="body-sm">Carregando ratificações...</Typography>
        </Box>
      ) : data.items.length === 0 ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}>
          <Typography level="body-sm">Nenhuma ratificação encontrada</Typography>
        </Box>
      ) : (
        displayedItems.map((item) => (
          <List key={item.id} size="sm" sx={{ '--ListItem-paddingX': 0 }}>
            <ListItem
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'flex-start',
                gap: 1,
                p: 2,
              }}
            >
              {/* Cabeçalho do card */}
              <Box sx={{ 
                display: 'flex', 
                width: '100%', 
                justifyContent: 'space-between',
                alignItems: 'flex-start'
              }}>
                {/* Avatar e informações do proprietário */}
                <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                  <Avatar size="sm">{item.responsavel.initial}</Avatar>
                  <Box>
                    <Typography level="body-sm" sx={{ fontWeight: 'md' }}>
                      {item.responsavel.nome}
                    </Typography>
                    <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                      {item.responsavel.email}
                    </Typography>
                  </Box>
                </Box>
                
                {/* Status */}
                <RatificacaoStatusBadge status={item.status} />
              </Box>
              
              {/* Informações principais da propriedade */}
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 0.5 }}>
                  <Typography level="body-md" sx={{ fontWeight: 'md' }}>
                    {item.propertyName}
                  </Typography>
                  {item.protocol && <VerifiedIcon sx={{ fontSize: '1rem', color: 'success.500' }} />}
                </Box>
                <Typography level="body-sm">
                  Proprietário: {item.ownerName}
                </Typography>
                <Typography level="body-sm" sx={{ mb: 1 }}>
                  Matrícula: {item.registration}
                </Typography>
                
                {/* Barra de progresso */}
                <Box sx={{ my: 1.5 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                    <Typography level="body-xs">Progresso</Typography>
                    <Typography level="body-xs">{item.progress}%</Typography>
                  </Box>
                  <RatificacaoProgressBar progress={item.progress} showLabel={false} />
                </Box>
                
                {/* Metadados e ações */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    mt: 1,
                  }}
                >
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Typography level="body-xs">{item.id}</Typography>
                    <Typography level="body-xs">&bull;</Typography>
                    <Typography level="body-xs">
                      Atualizado em: {item.updatedAt}
                    </Typography>
                  </Box>
                  <RowMenu />
                </Box>
              </Box>
            </ListItem>
            <ListDivider />
          </List>
        ))
      )}
      
      {/* Paginação */}
      {data.items.length > 0 && (
        <Box
          className="Pagination-mobile"
          sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', py: 2 }}
        >
          <IconButton
            aria-label="página anterior"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled={page <= 1}
            onClick={() => handlePageChange(page - 1)}
          >
            <KeyboardArrowLeftIcon />
          </IconButton>
          <Typography level="body-sm" sx={{ mx: 2 }}>
            Página {page} de {totalPages}
          </Typography>
          <IconButton
            aria-label="próxima página"
            variant="outlined"
            color="neutral"
            size="sm"
            disabled={page >= totalPages}
            onClick={() => handlePageChange(page + 1)}
          >
            <KeyboardArrowRightIcon />
          </IconButton>
        </Box>
      )}
    </Box>
  );
} 