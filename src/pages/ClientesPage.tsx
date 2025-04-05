import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Cliente } from '../data/clientes';
import ClientesListPane from '../components/ClientesListPane';
import ClienteFormPane from '../components/ClienteFormPane';
import { 
  getClientes, 
  createCliente, 
  updateCliente, 
  deleteCliente 
} from '../services/clienteService';

export default function ClientesPage() {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [selectedClienteId, setSelectedClienteId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'view' | 'edit' | null>(null);
  
  // Carregar lista de clientes
  const loadClientes = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getClientes();
      setClientes(data);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
      setError('Não foi possível carregar a lista de clientes. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Carregar clientes na inicialização
  React.useEffect(() => {
    loadClientes();
  }, [loadClientes]);
  
  // Filtrar clientes com base no termo de pesquisa
  const filteredClientes = React.useMemo(() => {
    if (!searchTerm) return clientes;
    
    const term = searchTerm.toLowerCase();
    return clientes.filter(cliente => {
      // Buscar em vários campos
      return (
        cliente.nome.toLowerCase().includes(term) ||
        (cliente.tipoCliente === 'PF' && cliente.cpf?.toLowerCase().includes(term)) ||
        (cliente.tipoCliente === 'PJ' && cliente.cnpj?.toLowerCase().includes(term)) ||
        (cliente.tipoCliente === 'PJ' && cliente.razaoSocial?.toLowerCase().includes(term))
      );
    });
  }, [clientes, searchTerm]);
  
  // Manipuladores de eventos
  const handleClienteSelect = (id: string) => {
    setSelectedClienteId(id);
    setViewMode('view');
  };
  
  const handleClienteView = (id: string) => {
    setSelectedClienteId(id);
    setViewMode('view');
  };
  
  const handleClienteEdit = (id: string) => {
    setSelectedClienteId(id);
    setViewMode('edit');
  };
  
  const handleClienteCreate = (cliente: Cliente) => {
    setClientes(prev => [...prev, cliente]);
    setSelectedClienteId(cliente.id);
    setViewMode('view');
  };
  
  const handleClienteUpdate = (cliente: Cliente) => {
    setClientes(prev => 
      prev.map(c => c.id === cliente.id ? cliente : c)
    );
  };
  
  const handleClienteDelete = (id: string) => {
    setClientes(prev => prev.filter(c => c.id !== id));
    setSelectedClienteId(null);
    setViewMode(null);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleAddClienteClick = () => {
    setSelectedClienteId(null);
    setViewMode(null);
    window.location.hash = 'create-client';
  };
  
  const handleCancelView = () => {
    setSelectedClienteId(null);
    setViewMode(null);
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
      {error && (
        <Box sx={{ p: 2, width: '100%' }}>
          <Typography color="danger" sx={{ mb: 2 }}>
            {error}
          </Typography>
          <Button onClick={loadClientes} variant="soft" color="primary">
            Tentar novamente
          </Button>
        </Box>
      )}
      
      {!error && (
        <>
          <ClientesListPane
            clientes={filteredClientes}
            loading={loading}
            selectedClienteId={selectedClienteId}
            onClienteSelect={handleClienteSelect}
            onAddClienteClick={handleAddClienteClick}
            onSearch={handleSearch}
            onClienteView={handleClienteView}
            onClienteEdit={handleClienteEdit}
            onClienteDelete={handleClienteDelete}
          />
          
          <ClienteFormPane
            selectedClienteId={selectedClienteId}
            viewMode={viewMode}
            onClienteCreated={handleClienteCreate}
            onClienteUpdated={handleClienteUpdate}
            onClienteDeleted={handleClienteDelete}
            onCancelView={handleCancelView}
          />
        </>
      )}
    </Box>
  );
} 