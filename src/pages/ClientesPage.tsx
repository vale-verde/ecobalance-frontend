import * as React from 'react';
import Box from '@mui/joy/Box';

import ClientesListPane from '../components/ClientesListPane';
import ClienteFormPane from '../components/ClienteFormPane';
import { Cliente, clientesData } from '../data/clientes';

export default function ClientesPage() {
  const [selectedClienteId, setSelectedClienteId] = React.useState('');
  const [selectedCliente, setSelectedCliente] = React.useState<Cliente | undefined>(clientesData[0]);

  const handleSelectCliente = (cliente: Cliente) => {
    setSelectedCliente(cliente);
    setSelectedClienteId(cliente.id);
  };

  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        display: 'flex',
        flex: 1,
        minWidth: 0,
        minHeight: 0,
        height: '100dvh',
      }}
    >
      <ClientesListPane 
        clientes={clientesData} 
        setSelectedCliente={handleSelectCliente}
        selectedClienteId={selectedClienteId}
      />
      <ClienteFormPane 
        cliente={selectedCliente}
      />
    </Box>
  );
} 