import * as React from 'react';
import Box from '@mui/joy/Box';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import { Cliente } from '../data/clientes';

type ClienteFormPaneProps = {
  cliente?: Cliente;
};

export default function ClienteFormPane(props: ClienteFormPaneProps) {
  const { cliente } = props;

  return (
    <Sheet
      sx={{
        height: { xs: 'calc(100dvh - var(--Header-height))', md: '100dvh' },
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
        flex: 1,
      }}
    >
      <Box
        sx={{
          py: { xs: 2, md: 2 },
          px: { xs: 1, md: 2 },
          borderBottom: '1px solid',
          borderColor: 'divider',
          backgroundColor: 'background.body',
        }}
      >
        <Typography
          component="h2"
          level="title-lg"
          sx={{ fontWeight: 'lg', fontSize: 'lg' }}
        >
          {cliente ? `Cliente: ${cliente.nome}` : 'Selecione um cliente'}
        </Typography>
      </Box>
      <Box
        sx={{
          display: 'flex',
          flex: 1,
          minHeight: 0,
          px: 2,
          py: 3,
          overflowY: 'auto',
          flexDirection: 'column',
        }}
      >
        <Stack spacing={2} sx={{ alignItems: 'center', justifyContent: 'center', height: '100%' }}>
          <Typography level="body-lg" textAlign="center">
            Área reservada para o formulário de cliente
          </Typography>
          <Typography level="body-md" textAlign="center">
            Selecione um cliente na lista à esquerda para editar ou adicionar um novo cliente
          </Typography>
        </Stack>
      </Box>
    </Sheet>
  );
} 