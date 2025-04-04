import * as React from 'react';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Typography from '@mui/joy/Typography';
import { Box, Chip, IconButton, Input } from '@mui/joy';
import List from '@mui/joy/List';
import EditNoteRoundedIcon from '@mui/icons-material/EditNoteRounded';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import AddIcon from '@mui/icons-material/Add';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
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
  }, [searchValue, clientes]);

  return (
    <Sheet
      sx={{
        borderRight: '1px solid',
        borderColor: 'divider',
        height: { sm: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        width: { xs: '100%', sm: 320 },
        overflowY: 'auto',
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
          aria-label="add"
          color="neutral"
          size="sm"
          sx={{ display: { xs: 'none', sm: 'unset' } }}
        >
          <AddIcon />
        </IconButton>
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
      <Box sx={{ px: 2, pb: 1.5 }}>
        <Input
          size="sm"
          startDecorator={<SearchRoundedIcon />}
          placeholder="Pesquisar clientes..."
          aria-label="Search"
          value={searchValue}
          onChange={(e) => setSearchValue(e.target.value)}
        />
      </Box>
      <List
        sx={{
          py: 0,
          '--ListItem-paddingY': '0.75rem',
          '--ListItem-paddingX': '1rem',
        }}
      >
        {filteredClientes.length > 0 ? (
          filteredClientes.map((cliente) => (
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
    </Sheet>
  );
} 