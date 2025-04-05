import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import { Propriedade } from '../data/propriedades';
import PropriedadesListPane from '../components/PropriedadesListPane';
import PropriedadeFormPane from '../components/PropriedadeFormPane';
import { 
  getPropriedades, 
  createPropriedade, 
  updatePropriedade, 
  deletePropriedade 
} from '../services/propriedadeService';

export default function PropriedadesPage() {
  const [propriedades, setPropriedades] = React.useState<Propriedade[]>([]);
  const [selectedPropriedadeId, setSelectedPropriedadeId] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [error, setError] = React.useState<string | null>(null);
  const [viewMode, setViewMode] = React.useState<'view' | 'edit' | null>(null);
  
  // Carregar lista de propriedades
  const loadPropriedades = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getPropriedades();
      setPropriedades(data);
    } catch (error) {
      console.error('Erro ao carregar propriedades:', error);
      setError('Não foi possível carregar a lista de propriedades. Tente novamente.');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Carregar propriedades na inicialização
  React.useEffect(() => {
    loadPropriedades();
  }, [loadPropriedades]);
  
  // Filtrar propriedades com base no termo de pesquisa
  const filteredPropriedades = React.useMemo(() => {
    if (!searchTerm) return propriedades;
    
    const term = searchTerm.toLowerCase();
    return propriedades.filter(propriedade => {
      // Buscar em vários campos
      return (
        propriedade.nome.toLowerCase().includes(term) ||
        propriedade.matricula.toLowerCase().includes(term) ||
        (propriedade.comarca && propriedade.comarca.toLowerCase().includes(term))
      );
    });
  }, [propriedades, searchTerm]);
  
  // Manipuladores de eventos
  const handlePropriedadeSelect = (id: string) => {
    setSelectedPropriedadeId(id);
    setViewMode('view');
  };
  
  const handlePropriedadeView = (id: string) => {
    setSelectedPropriedadeId(id);
    setViewMode('view');
  };
  
  const handlePropriedadeEdit = (id: string) => {
    setSelectedPropriedadeId(id);
    setViewMode('edit');
  };
  
  const handlePropriedadeCreate = (propriedade: Propriedade) => {
    setPropriedades(prev => [...prev, propriedade]);
    setSelectedPropriedadeId(propriedade.id);
    setViewMode('view');
  };
  
  const handlePropriedadeUpdate = (propriedade: Propriedade) => {
    setPropriedades(prev => 
      prev.map(p => p.id === propriedade.id ? propriedade : p)
    );
  };
  
  const handlePropriedadeDelete = (id: string) => {
    setPropriedades(prev => prev.filter(p => p.id !== id));
    setSelectedPropriedadeId(null);
    setViewMode(null);
  };
  
  const handleSearch = (term: string) => {
    setSearchTerm(term);
  };
  
  const handleAddPropriedadeClick = () => {
    setSelectedPropriedadeId(null);
    setViewMode(null);
    window.location.hash = 'create-property';
  };
  
  const handleCancelView = () => {
    setSelectedPropriedadeId(null);
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
          <Button onClick={loadPropriedades} variant="soft" color="primary">
            Tentar novamente
          </Button>
        </Box>
      )}
      
      {!error && (
        <>
          <PropriedadesListPane
            propriedades={filteredPropriedades}
            loading={loading}
            selectedPropriedadeId={selectedPropriedadeId}
            onPropriedadeSelect={handlePropriedadeSelect}
            onAddPropriedadeClick={handleAddPropriedadeClick}
            onSearch={handleSearch}
            onPropriedadeView={handlePropriedadeView}
            onPropriedadeEdit={handlePropriedadeEdit}
            onPropriedadeDelete={handlePropriedadeDelete}
          />
          
          <PropriedadeFormPane
            selectedPropriedadeId={selectedPropriedadeId}
            viewMode={viewMode}
            onPropriedadeCreated={handlePropriedadeCreate}
            onPropriedadeUpdated={handlePropriedadeUpdate}
            onPropriedadeDeleted={handlePropriedadeDelete}
            onCancelView={handleCancelView}
          />
        </>
      )}
    </Box>
  );
} 