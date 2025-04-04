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
import { toggleSidebar } from '../utils';

type ClientesListPaneProps = {
  clientes: Cliente[];
  setSelectedCliente: (cliente: Cliente) => void;
  selectedClienteId: string;
};

export default function ClientesListPane(props: ClientesListPaneProps) {
  const { clientes, setSelectedCliente, selectedClienteId } = props;
  const [searchValue, setSearchValue] = React.useState('');
  const [filteredClientes, setFilteredClientes] = React.useState(clientes);
  const [page, setPage] = React.useState(1);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const totalPages = Math.max(1, Math.ceil(filteredClientes.length / rowsPerPage));
  const startIndex = (page - 1) * rowsPerPage;
  const endIndex = Math.min(startIndex + rowsPerPage, filteredClientes.length);
  const displayedClientes = filteredClientes.slice(startIndex, endIndex);

  React.useEffect(() => {
    if (searchValue.trim() === '') {
      setFilteredClientes(clientes);
    } else {
      const filtered = clientes.filter(
        cliente => cliente.nome.toLowerCase().includes(searchValue.toLowerCase()) ||
                  cliente.documento.toLowerCase().includes(searchValue.toLowerCase())
      );
      setFilteredClientes(filtered);
    }
    setPage(1); // Reset to first page when filtering
  }, [searchValue, clientes]);

  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

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
              {filteredClientes.length}
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
        <IconButton
          variant="plain"
          aria-label="close"
          color="neutral"
          size="sm"
          onClick={() => {
            toggleSidebar();
          }}
          sx={{ display: { sm: 'none' } }}
        >
          <CloseRoundedIcon />
        </IconButton>
      </Stack>
      <Box sx={{ px: 2, pb: 1.5, display: 'flex', gap: 1 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Pesquisar clientes..."
          aria-label="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
          sx={{ flex: 1 }}
        />
        <IconButton
          color="primary"
          aria-label="add client"
          variant="outlined"
          sx={{
            height: '36px',
            width: '36px',
            '& svg': {
              fontSize: '1.2rem',
            },
          }}
        >
          <AddIcon />
        </IconButton>
      </Box>
      <Box sx={{ 
        flex: 1,
        overflowY: 'auto',
        display: 'flex',
        flexDirection: 'column',
      }}>
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
                setSelectedCliente={setSelectedCliente}
                selectedClienteId={selectedClienteId}
              />
            ))
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-sm">Nenhum cliente encontrado</Typography>
            </Box>
          )}
        </List>
      </Box>
      
      {/* Fixed Pagination Footer */}
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