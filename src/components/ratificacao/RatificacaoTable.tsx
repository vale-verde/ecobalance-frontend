import * as React from 'react';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Checkbox from '@mui/joy/Checkbox';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Link from '@mui/joy/Link';

// Icons
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import VerifiedIcon from '@mui/icons-material/Verified';
import EditIcon from '@mui/icons-material/Edit';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import FileDownloadIcon from '@mui/icons-material/FileDownload';

// Componentes próprios
import RatificacaoStatusBadge from './RatificacaoStatusBadge';
import RatificacaoProgressBar from './RatificacaoProgressBar';
import RatificacaoMetricsCards from './RatificacaoMetricsCards';

// Tipos e interfaces
import { 
  Ratificacao, 
  RatificacaoFilterOptions, 
  RatificacaoSortOptions, 
  RatificacaoPaginationOptions
} from '../../data/ratificacoes';

/**
 * Props para o componente RatificacaoTable
 */
interface RatificacaoTableProps {
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
  sort: RatificacaoSortOptions;
  pagination: RatificacaoPaginationOptions;
  onSearch: (searchTerm: string) => void;
  onStatusFilter: (status: RatificacaoFilterOptions['status']) => void;
  onSort: (field: keyof Ratificacao, direction: 'asc' | 'desc') => void;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rowsPerPage: number) => void;
}

/**
 * Menu de ações para cada linha da tabela
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
 * Componente principal para a tabela de ratificações
 */
export default function RatificacaoTable({
  data,
  loading,
  filters,
  sort,
  pagination,
  onSearch,
  onStatusFilter,
  onSort,
  onPageChange,
  onRowsPerPageChange
}: RatificacaoTableProps) {
  const [open, setOpen] = React.useState(false);
  const [selected, setSelected] = React.useState<number[]>([]);
  const [searchValue, setSearchValue] = React.useState(filters.searchTerm || '');
  
  // Alternar ordem quando o campo for clicado
  const handleSortClick = (field: keyof Ratificacao) => {
    if (sort.field === field) {
      onSort(field, sort.direction === 'asc' ? 'desc' : 'asc');
    } else {
      onSort(field, 'asc');
    }
  };
  
  // Renderizar filtros para desktop e tablet
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
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
      <FormControl size="sm">
        <FormLabel>Responsável</FormLabel>
        <Select size="sm" placeholder="Todos">
          <Option value="all">Todos</Option>
          <Option value="amanda">Amanda Oliveira</Option>
          <Option value="bruno">Bruno Costa</Option>
          <Option value="carla">Carla Mendes</Option>
          <Option value="diego">Diego Souza</Option>
        </Select>
      </FormControl>
      <FormControl size="sm">
        <FormLabel>Progresso</FormLabel>
        <Select size="sm" placeholder="Todos">
          <Option value="all">Todos</Option>
          <Option value="0-25">0-25%</Option>
          <Option value="25-50">25-50%</Option>
          <Option value="50-75">50-75%</Option>
          <Option value="75-100">75-100%</Option>
          <Option value="100">Concluídas (100%)</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );
  
  const handleSubmitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };

  return (
    <React.Fragment>
      {/* Barra de pesquisa e filtros para dispositivos móveis */}
      <Sheet
        className="SearchAndFilters-mobile"
        sx={{ display: { xs: 'flex', sm: 'none' }, my: 1, gap: 1 }}
      >
        <form onSubmit={handleSubmitSearch} style={{ display: 'flex', flex: 1 }}>
          <Input
            size="sm"
            placeholder="Pesquisar"
            startDecorator={<SearchIcon />}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
        </form>
        <IconButton
          size="sm"
          variant="outlined"
          color="neutral"
          onClick={() => setOpen(true)}
        >
          <FilterAltIcon />
        </IconButton>
        <Modal open={open} onClose={() => setOpen(false)}>
          <ModalDialog aria-labelledby="filter-modal" layout="fullscreen">
            <ModalClose />
            <Typography id="filter-modal" level="h2">
              Filtros
            </Typography>
            <Divider sx={{ my: 2 }} />
            <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {renderFilters()}
              <Button color="primary" onClick={() => setOpen(false)}>
                Aplicar
              </Button>
            </Sheet>
          </ModalDialog>
        </Modal>
      </Sheet>

      {/* Barra de pesquisa e filtros para tablet e desktop */}
      <Box
        className="SearchAndFilters-tabletUp"
        sx={{
          borderRadius: 'sm',
          py: 2,
          display: { xs: 'none', sm: 'flex' },
          flexWrap: 'wrap',
          gap: 1.5,
          '& > *': {
            minWidth: { xs: '120px', md: '160px' },
          },
        }}
      >
        <FormControl sx={{ flex: 1 }} size="sm">
          <FormLabel>Buscar ratificação</FormLabel>
          <form onSubmit={handleSubmitSearch} style={{ display: 'flex' }}>
            <Input 
              size="sm" 
              placeholder="Pesquisar" 
              startDecorator={<SearchIcon />} 
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              fullWidth
            />
          </form>
        </FormControl>
        {renderFilters()}
      </Box>
      
      {/* Cartões de métricas */}
      <RatificacaoMetricsCards 
        metrics={data.metrics} 
        onFilterClick={onStatusFilter} 
        currentFilter={filters.status || 'all'} 
      />

      {/* Tabela para tablet e desktop */}
      <Sheet
        className="RatificacaoTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length < data.items.length
                  }
                  checked={
                    data.items.length > 0 && selected.length === data.items.length
                  }
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? data.items.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === data.items.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('id')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'id' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  ID
                </Button>
              </th>
              <th style={{ width: 240, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('propriedade')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'propriedade' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  Propriedade
                </Button>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('codigo')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'codigo' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  Registro
                </Button>
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('status')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'status' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  Status
                </Button>
              </th>
              <th style={{ width: 180, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('responsavel')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'responsavel' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  Responsável
                </Button>
              </th>
              <th style={{ width: 160, padding: '12px 6px' }}>
                <Button
                  variant="plain"
                  color="primary"
                  onClick={() => handleSortClick('progress')}
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    fontWeight: 'lg',
                    display: 'inline-flex',
                    alignItems: 'center',
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        sort.field === 'progress' 
                          ? (sort.direction === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)')
                          : 'rotate(0deg)',
                    },
                  }}
                >
                  Progresso
                </Button>
              </th>
              <th style={{ width: 100, padding: '12px 6px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px' }}>
                  <Typography level="body-sm">Carregando ratificações...</Typography>
                </td>
              </tr>
            ) : data.items.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '24px' }}>
                  <Typography level="body-sm">Nenhuma ratificação encontrada</Typography>
                </td>
              </tr>
            ) : (
              data.items.map((row) => (
                <tr key={row.id}>
                  <td style={{ textAlign: 'center', width: 48 }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(row.id)}
                      color={selected.includes(row.id) ? 'primary' : undefined}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? [...ids, row.id]
                            : ids.filter((itemId) => itemId !== row.id),
                        );
                      }}
                      slotProps={{ checkbox: { sx: { textAlign: 'left' } } }}
                      sx={{ verticalAlign: 'text-bottom' }}
                    />
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                      <Typography level="body-xs">{row.id}</Typography>
                      {row.protocol && (
                        <VerifiedIcon 
                          sx={{ 
                            fontSize: '1rem', 
                            color: 'success.500',
                            verticalAlign: 'middle'
                          }} 
                        />
                      )}
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-xs" sx={{ fontWeight: 'md' }}>
                      {row.propertyName}
                    </Typography>
                    <Typography level="body-xs">
                      {row.ownerName}
                    </Typography>
                  </td>
                  <td>
                    <Typography level="body-xs">{row.registration}</Typography>
                  </td>
                  <td>
                    <RatificacaoStatusBadge status={row.status} />
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar size="sm">{row.responsavel.initial}</Avatar>
                      <div>
                        <Typography level="body-xs">{row.responsavel.nome}</Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <RatificacaoProgressBar progress={row.progress} width={120} />
                  </td>
                  <td>
                    <RowMenu />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>

      {/* Paginação para desktop */}
      <Box
        className="Pagination-laptopUp"
        sx={{
          pt: 2,
          gap: 1,
          [`& .${iconButtonClasses.root}`]: { borderRadius: '50%' },
          display: {
            xs: 'none',
            md: 'flex',
          },
        }}
      >
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          startDecorator={<KeyboardArrowLeftIcon />}
          disabled={pagination.page <= 1}
          onClick={() => onPageChange(pagination.page - 1)}
        >
          Anterior
        </Button>

        <Box sx={{ flex: 1 }} />
        
        {/* Exibir páginas */}
        {Array.from({ length: Math.min(7, data.totalPages) }, (_, i) => {
          // Se temos muitas páginas, mostra primeira, última e páginas ao redor da atual
          const totalIndicators = 7;
          let pageNum: number | string;
          
          if (data.totalPages <= totalIndicators) {
            pageNum = i + 1; // Mostrar 1, 2, 3, 4, 5, 6, 7
          } else {
            const leftBound = Math.max(1, pagination.page - 2);
            const rightBound = Math.min(data.totalPages, leftBound + totalIndicators - 3);
            
            if (i === 0) {
              pageNum = 1;
            } else if (i === totalIndicators - 1) {
              pageNum = data.totalPages;
            } else if (i === 1 && leftBound > 2) {
              pageNum = "…";
            } else if (i === totalIndicators - 2 && rightBound < data.totalPages - 1) {
              pageNum = "…";
            } else {
              pageNum = leftBound + i - 1;
              if (pageNum > data.totalPages) {
                return null;
              }
            }
          }
          
          // Se é um separador "…", não é clicável
          if (pageNum === "…") {
            return (
              <IconButton
                key={`ellipsis-${i}`}
                size="sm"
                variant="plain"
                color="neutral"
                disabled
              >
                {pageNum}
              </IconButton>
            );
          }
          
          return (
            <IconButton
              key={`page-${pageNum}`}
              size="sm"
              variant={pagination.page === pageNum ? "solid" : "outlined"}
              color={pagination.page === pageNum ? "primary" : "neutral"}
              onClick={() => typeof pageNum === 'number' && onPageChange(pageNum)}
            >
              {pageNum}
            </IconButton>
          );
        })}
        
        <Box sx={{ flex: 1 }} />
        <Button
          size="sm"
          variant="outlined"
          color="neutral"
          endDecorator={<KeyboardArrowRightIcon />}
          disabled={pagination.page >= data.totalPages}
          onClick={() => onPageChange(pagination.page + 1)}
        >
          Próximo
        </Button>
      </Box>
    </React.Fragment>
  );
} 