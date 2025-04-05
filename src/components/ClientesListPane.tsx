import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input, Button, Select, Option } from '@mui/joy';
import List from '@mui/joy/List';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import ArrowBackIosNewIcon from '@mui/icons-material/ArrowBackIosNew';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';
import ClienteListItem from './ClienteListItem';
import { Cliente } from '../data/clientes';
import { toggleSidebar, customScrollbarStyle } from '../utils';
import CircularProgress from '@mui/joy/CircularProgress';

/**
 * Props para o componente ClientesListPane
 */
type ClientesListPaneProps = {
  clientes: Cliente[];
  loading?: boolean;
  selectedClienteId: string | null;
  onClienteSelect: (id: string) => void;
  onAddClienteClick: () => void;
  onSearch: (searchTerm: string) => void;
  onClienteView?: (id: string) => void;
  onClienteEdit?: (id: string) => void;
  onClienteDelete?: (id: string) => void;
};

/**
 * Componente que exibe uma lista paginada de clientes com funcionalidades de
 * pesquisa, seleção, paginação e ações de CRUD
 */
export default function ClientesListPane({
  clientes,
  loading = false,
  selectedClienteId,
  onClienteSelect,
  onAddClienteClick,
  onSearch,
  onClienteView,
  onClienteEdit,
  onClienteDelete
}: ClientesListPaneProps) {
  // Estados para controle da pesquisa e paginação
  const [searchValue, setSearchValue] = React.useState('');
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  /**
   * Calcula os dados de paginação e determina quais clientes exibir
   */
  const totalPages = Math.max(1, Math.ceil(clientes.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, clientes.length);
  const displayedClientes = clientes.slice(startIndex, endIndex);

  /**
   * Manipuladores de eventos
   */
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };
  
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchValue);
  };
  
  /**
   * Efeito para resetar a página quando a lista de clientes mudar
   */
  React.useEffect(() => {
    setPage(1);
  }, [clientes.length]);
  
  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        width: { xs: '100%', sm: 380 },
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* Cabeçalho com título e contador */}
      <Stack
        direction="row"
        spacing={1}
        sx={{ alignItems: 'center', justifyContent: 'space-between', p: 2, pb: 1.5 }}
      >
        <Typography
          component="h1"
          endDecorator={
            <Chip
              variant="soft"
              color="primary"
              size="md"
              slotProps={{ root: { component: 'span' } }}
            >
              {clientes.length}
            </Chip>
          }
          sx={{ fontSize: { xs: 'md', md: 'lg' }, fontWeight: 'lg', mr: 'auto' }}
        >
          Clientes
        </Typography>
        <IconButton
          variant="plain"
          aria-label="filter"
          color="neutral"
          size="sm"
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <FilterAltIcon />
        </IconButton>
      </Stack>

      {/* Barra de pesquisa e botão de adicionar */}
      <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 1 }}>
        <form onSubmit={handleSearch} style={{ flex: 1, display: 'flex' }}>
          <Input
            size="sm"
            startDecorator={<SearchRoundedIcon />}
            placeholder="Pesquisar clientes..."
            aria-label="Search"
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
        </form>
        <IconButton
          color="primary"
          aria-label="Criar novo cliente"
          variant="outlined"
          onClick={() => {
            onAddClienteClick();
          }}
          sx={{
            height: '36px',
            width: '36px',
            '& svg': {
              fontSize: '1.2rem',
            },
            transition: 'all 0.2s',
            '&:hover': {
              bgcolor: 'primary.softBg',
              borderColor: 'primary.outlinedHoverBorder',
            }
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>

      {/* Lista de clientes com loading state */}
      <Box sx={{ 
          flex: 1,
          overflowY: 'auto',
          display: 'flex',
          flexDirection: 'column',
          ...customScrollbarStyle
      }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
            <CircularProgress />
          </Box>
        ) : (
          <List
            sx={{
              py: 0,
              '--ListItem-paddingY': '0.75rem',
              '--ListItem-paddingX': '1rem',
            }}
          >
            {displayedClientes.length > 0 ? (
              displayedClientes.map((cliente) => (
                <ClienteListItem
                  key={cliente.id}
                  cliente={cliente}
                  isSelected={cliente.id === selectedClienteId}
                  onClick={() => onClienteSelect(cliente.id)}
                  onView={onClienteView ? () => onClienteView(cliente.id) : undefined}
                  onEdit={onClienteEdit ? () => onClienteEdit(cliente.id) : undefined}
                  onDelete={onClienteDelete ? () => onClienteDelete(cliente.id) : undefined}
                />
              ))
            ) : (
              <Box sx={{ p: 2, textAlign: 'center' }}>
                <Typography level="body-sm">Nenhum cliente encontrado</Typography>
              </Box>
            )}
          </List>
        )}
      </Box>
      
      {/* Rodapé com controles de paginação */}
      <Box sx={{ 
        p: 2, 
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        borderTop: '1px solid',
        borderColor: 'divider',
        backgroundColor: 'background.surface'
      }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
          <Select 
            size="sm" 
            value={rowsPerPage.toString()} 
            onChange={(_, value) => {
              if (value) setRowsPerPage(Number(value));
              setPage(1);
            }}
            sx={{ minWidth: 65 }}
          >
            <Option value="10">10</Option>
            <Option value="20">20</Option>
            <Option value="50">50</Option>
          </Select>
          
          <IconButton 
            size="sm"
            disabled={page <= 1} 
            onClick={() => handlePageChange(page - 1)}
            variant="outlined"
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <Typography level="body-sm" sx={{ minWidth: '80px', textAlign: 'center' }}>
            Página {page} de {totalPages}
          </Typography>
          <IconButton 
            size="sm" 
            disabled={page >= totalPages} 
            onClick={() => handlePageChange(page + 1)}
            variant="outlined"
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </Box>
    </Sheet>
  );
} 