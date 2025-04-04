import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { ListItemButtonProps } from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Avatar from '@mui/joy/Avatar';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import { Cliente } from '../data/clientes';
import { toggleSidebar } from '../utils';

type ClienteListItemProps = {
  cliente: Cliente;
  selectedClienteId?: string;
  setSelectedCliente: (cliente: Cliente) => void;
};

export default function ClienteListItem(props: ClienteListItemProps) {
  const { cliente, selectedClienteId, setSelectedCliente } = props;
  const selected = selectedClienteId === cliente.id;
  const isPF = cliente.tipoCliente === 'PF';

  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleSidebar();
            setSelectedCliente(cliente);
          }}
          selected={selected}
          color="neutral"
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1 }}
        >
          <Stack direction="row" spacing={1.5}>
            <Avatar color={isPF ? 'success' : 'primary'}>
              {isPF ? <PersonIcon /> : <BusinessIcon />}
            </Avatar>
            <Box sx={{ flex: 1 }}>
              <Typography level="title-sm">{cliente.nome}</Typography>
              <Typography level="body-sm">{cliente.documento}</Typography>
            </Box>
            <Box sx={{ lineHeight: 1.5, textAlign: 'right' }}>
              <Typography
                level="body-xs"
                noWrap
                sx={{ display: { xs: 'none', md: 'block' } }}
              >
                {cliente.timestamp}
              </Typography>
            </Box>
          </Stack>
          <Typography
            level="body-sm"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: '2',
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}
          >
            {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'} • ID: {cliente.id}
          </Typography>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
} 