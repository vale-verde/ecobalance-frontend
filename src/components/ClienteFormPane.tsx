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

/**
 * Modos possíveis para o painel de formulário de cliente
 */
type FormMode = 'empty' | 'view' | 'edit' | 'create';

/**
 * Props para o componente ClienteFormPane
 */
type ClienteFormPaneProps = {
  selectedClienteId?: string | null;
  viewMode?: 'view' | 'edit' | null;
  onClienteCreated?: (cliente: Cliente) => void;
  onClienteUpdated?: (cliente: Cliente) => void;
  onClienteDeleted?: (id: string) => void;
  onCancelView?: () => void;
};

/**
 * Componente de painel de formulário para visualização, criação e edição de clientes
 * 
 * Responsável por gerenciar todos os estados e operações relacionados a um cliente:
 * - Visualização de detalhes
 * - Criação de novos clientes
 * - Edição de clientes existentes
 * - Exclusão de clientes
 */
export default function ClienteFormPane({
  selectedClienteId,
  viewMode,
  onClienteCreated,
  onClienteUpdated,
  onClienteDeleted,
  onCancelView
}: ClienteFormPaneProps) {
  // Estados principais
  const [mode, setMode] = React.useState<FormMode>('empty');
  const [currentCliente, setCurrentCliente] = React.useState<Cliente | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  /**
   * Efeito para responder a alterações no hash da URL para criação de cliente
   */
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#create-client') {
        setMode('create');
        setCurrentCliente(null);
        window.location.hash = '';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash === '#create-client') {
      setMode('create');
      setCurrentCliente(null);
      window.location.hash = '';
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  /**
   * Efeito para carregar dados do cliente quando o ID selecionado muda
   */
  React.useEffect(() => {
    if (selectedClienteId) {
      setLoading(true);
      setError(null);
      
      getClienteById(selectedClienteId)
        .then(cliente => {
          if (cliente) {
            setCurrentCliente(cliente);
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
  
  /**
   * Funções de manipulação de eventos
   */
  const handleCreateCliente = () => {
    setMode('create');
    setCurrentCliente(null);
  };
  
  const handleViewCliente = (cliente: Cliente) => {
    setCurrentCliente(cliente);
    setMode('view');
  };
  
  const handleEditCliente = () => {
    if (currentCliente) {
      setMode('edit');
    }
  };
  
  const handleCancelEdit = () => {
    if (mode === 'view' && onCancelView) {
      onCancelView();
    } else if (currentCliente) {
      setMode('view');
    } else {
      setMode('empty');
    }
  };
  
  /**
   * Função para salvar cliente (criar ou atualizar)
   */
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
  
  /**
   * Função para excluir cliente
   */
  const handleDeleteCliente = () => {
    if (!currentCliente) return;
    
    if (window.confirm(`Tem certeza que deseja excluir o cliente "${currentCliente.nome}"?`)) {
      setLoading(true);
      
      deleteCliente(currentCliente.id)
        .then(() => {
          if (onClienteDeleted) {
            onClienteDeleted(currentCliente.id);
          }
          
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
  
  /**
   * Renderiza o conteúdo apropriado com base no modo atual
   */
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
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Cabeçalho com título e botões de ação */}
        <Box 
          sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'space-between',
            mb: 2
          }}
        >
          <Typography 
            level="h3"
            sx={{ 
              fontSize: { xs: 'xl', md: 'xl2' },
              fontWeight: 'bold' 
            }}
          >
            {mode === 'view' && currentCliente ? 'Detalhes do Cliente' : 
             mode === 'edit' && currentCliente ? 'Editar Cliente' : 
             mode === 'create' ? 'Novo Cliente' : 'Cliente'}
          </Typography>
          
          {mode === 'view' && currentCliente && (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                startDecorator={<EditIcon />}
                color="primary"
                variant="soft"
                onClick={handleEditCliente}
              >
                Editar
              </Button>
              <Button
                startDecorator={<DeleteIcon />}
                color="danger"
                variant="soft"
                onClick={handleDeleteCliente}
              >
                Excluir
              </Button>
            </Box>
          )}
        </Box>
        
        {/* Conteúdo principal */}
        {renderContent()}
      </Box>
    </Sheet>
  );
} 