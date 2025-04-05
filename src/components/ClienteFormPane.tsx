import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import Alert from '@mui/joy/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cliente } from '../data/clientes';
import { 
  getClienteById, 
  createCliente, 
  updateCliente, 
  deleteCliente 
} from '../services/clienteService';
import ClienteEmptyState from './cliente-form/ClienteEmptyState';
import ClienteView from './cliente-form/ClienteView';
import ClienteForm from './cliente-form/ClienteForm';

// Definir os possíveis modos do formulário
type FormMode = 'empty' | 'view' | 'edit' | 'create';

type ClienteFormPaneProps = {
  selectedClienteId?: string | null;
  viewMode?: 'view' | 'edit' | null;
  onClienteCreated?: (cliente: Cliente) => void;
  onClienteUpdated?: (cliente: Cliente) => void;
  onClienteDeleted?: (id: string) => void;
  onCancelView?: () => void;
};

export default function ClienteFormPane({
  selectedClienteId,
  viewMode,
  onClienteCreated,
  onClienteUpdated,
  onClienteDeleted,
  onCancelView
}: ClienteFormPaneProps) {
  // Estado para controlar o modo do formulário
  const [mode, setMode] = React.useState<FormMode>('empty');
  
  // Estado para armazenar o cliente atual
  const [currentCliente, setCurrentCliente] = React.useState<Cliente | null>(null);
  
  // Estados para controle de UI
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  // Efeito para responder a alterações no #create-client via URL
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#create-client') {
        setMode('create');
        setCurrentCliente(null);
        window.location.hash = '';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    // Verificar no carregamento inicial também
    if (window.location.hash === '#create-client') {
      setMode('create');
      setCurrentCliente(null);
      window.location.hash = '';
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  // Carregar cliente quando o ID mudar ou o viewMode mudar
  React.useEffect(() => {
    if (selectedClienteId) {
      setLoading(true);
      setError(null);
      
      getClienteById(selectedClienteId)
        .then(cliente => {
          if (cliente) {
            setCurrentCliente(cliente);
            // Definir o modo com base no viewMode recebido das props
            setMode(viewMode === 'edit' ? 'edit' : 'view');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Erro ao carregar cliente. Tente novamente.');
          setLoading(false);
          console.error(err);
        });
    } else {
      setMode('empty');
      setCurrentCliente(null);
    }
  }, [selectedClienteId, viewMode]);
  
  // Função para criar um novo cliente
  const handleCreateCliente = () => {
    setMode('create');
    setCurrentCliente(null);
  };
  
  // Função para visualizar cliente
  const handleViewCliente = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setMode('view');
  };
  
  // Função para editar cliente atual
  const handleEditCliente = () => {
    if (currentCliente) {
      setMode('edit');
    }
  };
  
  // Função para cancelar edição/criação ou visualização
  const handleCancelEdit = () => {
    if (mode === 'view' && onCancelView) {
      onCancelView();
    } else if (currentCliente) {
      setMode('view');
    } else {
      setMode('empty');
    }
  };
  
  // Função para salvar cliente (criar ou atualizar)
  const handleSaveCliente = (cliente: Cliente) => {
    setLoading(true);
    setError(null);
    
    const savePromise = mode === 'create'
      ? createCliente(cliente)
      : updateCliente(cliente);
    
    savePromise
      .then(savedCliente => {
        setCurrentCliente(savedCliente);
        setMode('view');
        
        // Notificar componente pai sobre a atualização
        if (mode === 'create' && onClienteCreated) {
          onClienteCreated(savedCliente);
        } else if (mode === 'edit' && onClienteUpdated) {
          onClienteUpdated(savedCliente);
        }
      })
      .catch(err => {
        setError('Erro ao salvar cliente. Verifique os dados e tente novamente.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  // Função para excluir cliente
  const handleDeleteCliente = () => {
    if (!currentCliente) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${currentCliente.nome}"?`)) {
      setLoading(true);
      
      deleteCliente(currentCliente.id)
        .then(() => {
          // Notificar componente pai
          if (onClienteDeleted) {
            onClienteDeleted(currentCliente.id);
          }
          
          // Resetar formulário
          setCurrentCliente(null);
          setMode('empty');
        })
        .catch(err => {
          setError('Erro ao excluir cliente. Tente novamente.');
          console.error(err);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };
  
  // Renderizar conteúdo com base no modo
  const renderContent = () => {
    if (loading) {
      return (
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '50vh' }}>
          <CircularProgress />
        </Box>
      );
    }
    
    if (error) {
      return (
        <Alert color="danger" sx={{ mb: 2 }}>
          {error}
        </Alert>
      );
    }
    
    switch (mode) {
      case 'empty':
        return <ClienteEmptyState onCreateClick={handleCreateCliente} />;
      case 'view':
        return currentCliente ? (
          <ClienteView 
            cliente={currentCliente} 
            onEditClick={handleEditCliente} 
            onCancelClick={handleCancelEdit}
          />
        ) : null;
      case 'edit':
        return currentCliente ? (
          <ClienteForm
            cliente={currentCliente}
            isCreating={false}
            onSave={handleSaveCliente}
            onCancel={handleCancelEdit}
          />
        ) : null;
      case 'create':
        return (
          <ClienteForm
            isCreating={true}
            onSave={handleSaveCliente}
            onCancel={handleCancelEdit}
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <Sheet 
      sx={{ 
        height: '100%',
        width: '100%',
        overflowY: 'auto',
        flex: 1,
        p: 3,
        pt: 2,
        pb: 0,
        display: 'flex',
        flexDirection: 'column',
        backgroundColor: 'background.level1',
      }}
    >
      {renderContent()}
    </Sheet>
  );
} 