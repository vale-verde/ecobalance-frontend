import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import CircularProgress from '@mui/joy/CircularProgress';
import Alert from '@mui/joy/Alert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { Propriedade } from '../data/propriedades';
import { 
  getPropriedadeById, 
  createPropriedade, 
  updatePropriedade, 
  deletePropriedade 
} from '../services/propriedadeService';
import PropriedadeEmptyState from './propriedade-form/PropriedadeEmptyState';
import PropriedadeView from './propriedade-form/PropriedadeView';
import PropriedadeForm from './propriedade-form/PropriedadeForm';
import { customScrollbarStyle } from '../utils';

/**
 * Modos possíveis para o painel de formulário de propriedade
 */
type FormMode = 'empty' | 'view' | 'edit' | 'create';

/**
 * Props para o componente PropriedadeFormPane
 */
type PropriedadeFormPaneProps = {
  selectedPropriedadeId?: string | null;
  viewMode?: 'view' | 'edit' | null;
  onPropriedadeCreated?: (propriedade: Propriedade) => void;
  onPropriedadeUpdated?: (propriedade: Propriedade) => void;
  onPropriedadeDeleted?: (id: string) => void;
  onCancelView?: () => void;
};

/**
 * Componente de painel de formulário para visualização, criação e edição de propriedades
 * 
 * Responsável por gerenciar todos os estados e operações relacionados a uma propriedade:
 * - Visualização de detalhes
 * - Criação de novas propriedades
 * - Edição de propriedades existentes
 * - Exclusão de propriedades
 */
export default function PropriedadeFormPane({
  selectedPropriedadeId,
  viewMode,
  onPropriedadeCreated,
  onPropriedadeUpdated,
  onPropriedadeDeleted,
  onCancelView
}: PropriedadeFormPaneProps) {
  // Estados principais
  const [mode, setMode] = React.useState<FormMode>('empty');
  const [currentPropriedade, setCurrentPropriedade] = React.useState<Propriedade | null>(null);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [error, setError] = React.useState<string | null>(null);
  
  /**
   * Efeito para responder a alterações no hash da URL para criação de propriedade
   */
  React.useEffect(() => {
    const handleHashChange = () => {
      if (window.location.hash === '#create-property') {
        setMode('create');
        setCurrentPropriedade(null);
        window.location.hash = '';
      }
    };
    
    window.addEventListener('hashchange', handleHashChange);
    
    if (window.location.hash === '#create-property') {
      setMode('create');
      setCurrentPropriedade(null);
      window.location.hash = '';
    }
    
    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);
  
  /**
   * Efeito para carregar dados da propriedade quando o ID selecionado muda
   */
  React.useEffect(() => {
    if (selectedPropriedadeId) {
      setLoading(true);
      setError(null);
      
      getPropriedadeById(selectedPropriedadeId)
        .then(propriedade => {
          if (propriedade) {
            setCurrentPropriedade(propriedade);
            setMode(viewMode === 'edit' ? 'edit' : 'view');
          }
          setLoading(false);
        })
        .catch(err => {
          setError('Erro ao carregar propriedade. Tente novamente.');
          setLoading(false);
          console.error(err);
        });
    } else {
      setMode('empty');
      setCurrentPropriedade(null);
    }
  }, [selectedPropriedadeId, viewMode]);
  
  /**
   * Funções de manipulação de eventos
   */
  const handleCreatePropriedade = () => {
    setMode('create');
    setCurrentPropriedade(null);
  };
  
  const handleViewPropriedade = (propriedade: Propriedade) => {
    setCurrentPropriedade(propriedade);
    setMode('view');
  };
  
  const handleEditPropriedade = () => {
    if (currentPropriedade) {
      setMode('edit');
    }
  };
  
  const handleCancelEdit = () => {
    if (mode === 'view' && onCancelView) {
      onCancelView();
    } else if (currentPropriedade) {
      setMode('view');
    } else {
      setMode('empty');
    }
  };
  
  /**
   * Função para salvar propriedade (criar ou atualizar)
   */
  const handleSavePropriedade = (propriedade: Propriedade) => {
    setLoading(true);
    setError(null);
    
    const savePromise = mode === 'create'
      ? createPropriedade(propriedade)
      : updatePropriedade(propriedade);
    
    savePromise
      .then(savedPropriedade => {
        setCurrentPropriedade(savedPropriedade);
        setMode('view');
        
        if (mode === 'create' && onPropriedadeCreated) {
          onPropriedadeCreated(savedPropriedade);
        } else if (mode === 'edit' && onPropriedadeUpdated) {
          onPropriedadeUpdated(savedPropriedade);
        }
      })
      .catch(err => {
        setError('Erro ao salvar propriedade. Verifique os dados e tente novamente.');
        console.error(err);
      })
      .finally(() => {
        setLoading(false);
      });
  };
  
  /**
   * Função para excluir propriedade
   */
  const handleDeletePropriedade = () => {
    if (!currentPropriedade) return;
    
    if (window.confirm(`Tem certeza que deseja excluir a propriedade "${currentPropriedade.nome}"?`)) {
      setLoading(true);
      
      deletePropriedade(currentPropriedade.id)
        .then(() => {
          if (onPropriedadeDeleted) {
            onPropriedadeDeleted(currentPropriedade.id);
          }
          
          setCurrentPropriedade(null);
          setMode('empty');
        })
        .catch(err => {
          setError('Erro ao excluir propriedade. Tente novamente.');
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
        return <PropriedadeEmptyState onCreateClick={handleCreatePropriedade} />;
      case 'view':
        return currentPropriedade ? (
          <PropriedadeView 
            propriedade={currentPropriedade} 
            onEditClick={handleEditPropriedade} 
            onCancelClick={handleCancelEdit}
            onDeleteClick={handleDeletePropriedade}
          />
        ) : null;
      case 'edit':
        return currentPropriedade ? (
          <PropriedadeForm
            propriedade={currentPropriedade}
            isCreating={false}
            onSave={handleSavePropriedade}
            onCancel={handleCancelEdit}
          />
        ) : null;
      case 'create':
        return (
          <PropriedadeForm
            isCreating={true}
            onSave={handleSavePropriedade}
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
        ...customScrollbarStyle
      }}
    >
      <Box 
        sx={{ 
          display: 'flex', 
          flexDirection: 'column',
          flex: 1,
        }}
      >
        {/* Conteúdo principal */}
        {renderContent()}
      </Box>
    </Sheet>
  );
} 