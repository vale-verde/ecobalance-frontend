import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Sheet from '@mui/joy/Sheet';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import TabPanel from '@mui/joy/TabPanel';
import Autocomplete from '@mui/joy/Autocomplete';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Grid from '@mui/joy/Grid';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import { tabClasses } from '@mui/joy/Tab';

// Mock data para propriedades
const MOCK_PROPRIEDADES = [
  { id: 1, nome: 'Fazenda São João', codigo: 'FSJ001', matricula: '12345', municipio: 'São Paulo', uf: 'SP' },
  { id: 2, nome: 'Sítio Recanto', codigo: 'SR002', matricula: '54321', municipio: 'Campinas', uf: 'SP' },
  { id: 3, nome: 'Rancho Bom Retiro', codigo: 'RBR003', matricula: '67890', municipio: 'Belo Horizonte', uf: 'MG' },
];

// Mock data para usuários responsáveis
const MOCK_RESPONSAVEIS = [
  { id: 1, nome: 'João Silva', email: 'joao.silva@email.com' },
  { id: 2, nome: 'Maria Oliveira', email: 'maria.oliveira@email.com' },
  { id: 3, nome: 'Carlos Pereira', email: 'carlos.pereira@email.com' },
];

// Interface para props do componente
interface PropriedadeStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onBackClick?: () => void;
}

/**
 * Componente para seleção e/ou cadastro de propriedade
 * Representa o primeiro passo do processo de ratificação
 */
export default function PropriedadeStep({ formData, updateFormData, onBackClick }: PropriedadeStepProps) {
  // Estados para gerenciar a interface
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState(MOCK_PROPRIEDADES);
  const [selectedPropriedade, setSelectedPropriedade] = React.useState<any>(formData.propriedade || null);
  const [selectedResponsavel, setSelectedResponsavel] = React.useState<any>(formData.responsavel || null);
  const [viewMode, setViewMode] = React.useState<'search' | 'view' | 'edit' | 'create'>(
    formData.propriedade ? 'view' : 'search'
  );
  const [newPropriedade, setNewPropriedade] = React.useState({
    nome: '',
    codigo: '',
    matricula: '',
    areaTotal: '',
    areaConsolidada: '',
    areaVegetacao: '',
    municipio: '',
    uf: '',
    dataAquisicao: '',
    possuiGeo: 'sim',
    tipoImovel: 'rural',
  });

  // Efeito para atualizar resultados de busca com o termo da pesquisa
  React.useEffect(() => {
    if (searchTerm) {
      const filtered = MOCK_PROPRIEDADES.filter(
        prop => 
          prop.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
          prop.matricula.includes(searchTerm)
      );
      setSearchResults(filtered);
    } else {
      setSearchResults(MOCK_PROPRIEDADES);
    }
  }, [searchTerm]);

  // Handler para pesquisa de propriedades
  const handleSearch = () => {
    setIsSearching(true);
    // Simula uma busca na API
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Handler para seleção de propriedade
  const handleSelectPropriedade = (propriedade: any) => {
    setSelectedPropriedade(propriedade);
    // Also update newPropriedade to ensure the form has the correct data when editing
    setNewPropriedade(propriedade);
    updateFormData('propriedade', propriedade);
    setViewMode('view');
  };

  // Handler para seleção de responsável
  const handleResponsavelChange = (event: any, newValue: any) => {
    setSelectedResponsavel(newValue);
    updateFormData('responsavel', newValue);
  };

  // Handler para mudanças nos campos do formulário de nova propriedade
  const handleNewPropriedadeChange = (field: string, value: any) => {
    setNewPropriedade(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Handler para criar nova propriedade
  const handleCreatePropriedade = () => {
    // Simula criação de nova propriedade
    const newProp = {
      id: Math.floor(Math.random() * 1000),
      ...newPropriedade,
    };
    setSelectedPropriedade(newProp);
    updateFormData('propriedade', newProp);
    setViewMode('view');
  };

  // Handler para editar propriedade
  const handleEditPropriedade = () => {
    // Simula atualização de propriedade
    updateFormData('propriedade', {
      ...selectedPropriedade,
      ...newPropriedade
    });
    setViewMode('view');
  };

  // Renderiza a tela de busca e seleção de propriedade
  const renderSearchView = () => (
    <Box>      
      <Typography level="title-md" sx={{ mb: 2 }}>
        Selecione uma propriedade para o processo de ratificação
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Buscar por nome, código ou matrícula"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            startDecorator={<SearchIcon />}
          />
        </FormControl>
        
        <Button 
          variant="solid" 
          color="primary"
          onClick={handleSearch}
          loading={isSearching}
        >
          Buscar
        </Button>
        
        <Button
          variant="outlined"
          color="primary"
          startDecorator={<AddIcon />}
          onClick={() => setViewMode('create')}
        >
          Nova Propriedade
        </Button>
      </Box>
      
      <Typography level="title-sm" sx={{ mb: 1 }}>
        Resultados da pesquisa
      </Typography>
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {searchResults.length === 0 ? (
          <Typography level="body-sm" sx={{ textAlign: 'center', py: 4 }}>
            Nenhuma propriedade encontrada com os critérios informados.
          </Typography>
        ) : (
          searchResults.map((prop) => (
            <Card 
              key={prop.id} 
              variant="outlined" 
              sx={{ 
                cursor: 'pointer',
                '&:hover': { bgcolor: 'action.hover' } 
              }}
              onClick={() => handleSelectPropriedade(prop)}
            >
              <CardContent>
                <Typography level="title-md">{prop.nome}</Typography>
                <Box sx={{ display: 'flex', gap: 2, mt: 1 }}>
                  <Chip size="sm" variant="soft">Código: {prop.codigo}</Chip>
                  <Chip size="sm" variant="soft">Matrícula: {prop.matricula}</Chip>
                  <Chip size="sm" variant="soft">{prop.municipio} - {prop.uf}</Chip>
                </Box>
              </CardContent>
            </Card>
          ))
        )}
      </Box>
    </Box>
  );

  // Renderiza o formulário de propriedade
  const renderPropriedadeForm = (isEditing: boolean) => {
    // When editing, use selected property if available, otherwise use new property template
    const initialData = isEditing && viewMode === 'edit' ? selectedPropriedade : newPropriedade;
    
    // Ensure we have default values
    const propertyData = {
      nome: '',
      codigo: '',
      matricula: '',
      areaTotal: '',
      areaConsolidada: '',
      areaVegetacao: '',
      municipio: '',
      uf: '',
      dataAquisicao: '',
      possuiGeo: 'sim',
      tipoImovel: 'rural',
      ...initialData
    };
    
    return (
      <Box>
        <Tabs 
          aria-label="Propriedade tabs" 
          value={selectedTab} 
          onChange={(_, value) => setSelectedTab(Number(value))}
          sx={{ bgcolor: 'transparent' }}
        >
          <TabList
            tabFlex={1}
            size="sm"
            sx={{
              pl: { xs: 0, md: 4 },
              justifyContent: 'left',
              [`&& .${tabClasses.root}`]: {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                borderRadius: '6px 6px 0 0',
                [`&.${tabClasses.selected}`]: {
                  bgcolor: 'transparent',
                  color: 'text.primary',
                  '&::after': {
                    height: '2px',
                    bgcolor: 'primary.500',
                  },
                },
              },
            }}
          >
            <Tab sx={{ py: 1.5 }}>Dados Básicos</Tab>
            <Tab sx={{ py: 1.5 }}>Documentos</Tab>
            <Tab sx={{ py: 1.5 }}>Proprietários</Tab>
          </TabList>
          <TabPanel value={0} sx={{ p: 0 }}>
            <Box
              sx={{
                pt: 3,
                pb: 3,
                display: 'grid',
                gridTemplateColumns: { xs: '100%', sm: 'minmax(120px, 30%) 1fr' },
                columnGap: { xs: 2, sm: 3, md: 4 },
                rowGap: { xs: 2, sm: 2.5 },
                '& > hr': {
                  gridColumn: '1/-1',
                },
              }}
            >
              <FormLabel sx={{ display: 'block' }}>Nome da Propriedade</FormLabel>
              <FormControl sx={{ display: 'flex' }}>
                <Input
                  placeholder="Nome da Propriedade"
                  value={propertyData.nome}
                  onChange={(e) => handleNewPropriedadeChange('nome', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Código</FormLabel>
              <FormControl>
                <Input
                  placeholder="Código da Propriedade"
                  value={propertyData.codigo}
                  onChange={(e) => handleNewPropriedadeChange('codigo', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Matrícula</FormLabel>
              <FormControl>
                <Input
                  placeholder="Número da Matrícula"
                  value={propertyData.matricula}
                  onChange={(e) => handleNewPropriedadeChange('matricula', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <Divider />

              <FormLabel>Área Total (ha)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Área Total em hectares"
                  value={propertyData.areaTotal}
                  onChange={(e) => handleNewPropriedadeChange('areaTotal', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Área Consolidada (ha)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Área Consolidada em hectares"
                  value={propertyData.areaConsolidada}
                  onChange={(e) => handleNewPropriedadeChange('areaConsolidada', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Área de Vegetação (ha)</FormLabel>
              <FormControl>
                <Input
                  placeholder="Área de Vegetação em hectares"
                  value={propertyData.areaVegetacao}
                  onChange={(e) => handleNewPropriedadeChange('areaVegetacao', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <Divider />

              <FormLabel>Município</FormLabel>
              <FormControl>
                <Input
                  placeholder="Município"
                  value={propertyData.municipio}
                  onChange={(e) => handleNewPropriedadeChange('municipio', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>UF</FormLabel>
              <FormControl>
                <Select
                  placeholder="Selecione o estado"
                  value={propertyData.uf}
                  onChange={(_, value) => handleNewPropriedadeChange('uf', value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                >
                  <Option value="SP">São Paulo</Option>
                  <Option value="MG">Minas Gerais</Option>
                  <Option value="RJ">Rio de Janeiro</Option>
                  <Option value="ES">Espírito Santo</Option>
                </Select>
              </FormControl>

              <FormLabel>Data de Aquisição</FormLabel>
              <FormControl>
                <Input
                  type="date"
                  placeholder="Data de Aquisição"
                  value={propertyData.dataAquisicao}
                  onChange={(e) => handleNewPropriedadeChange('dataAquisicao', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <Divider />

              <FormLabel>Possui Georreferenciamento?</FormLabel>
              <FormControl>
                <RadioGroup
                  value={propertyData.possuiGeo}
                  onChange={(e) => handleNewPropriedadeChange('possuiGeo', e.target.value)}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Radio
                      value="sim"
                      label="Sim"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                    <Radio
                      value="nao"
                      label="Não"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>

              <FormLabel>Tipo de Imóvel</FormLabel>
              <FormControl>
                <RadioGroup
                  value={propertyData.tipoImovel}
                  onChange={(e) => handleNewPropriedadeChange('tipoImovel', e.target.value)}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Radio
                      value="rural"
                      label="Rural"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                    <Radio
                      value="urbano"
                      label="Urbano"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
            </Box>
          </TabPanel>

          <TabPanel value={1} sx={{ p: 0 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-md">
                Documentos da propriedade são gerenciados na etapa de Documentos do processo de ratificação.
              </Typography>
            </Box>
          </TabPanel>

          <TabPanel value={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-md">
                Proprietários são gerenciados na etapa de Proprietários do processo de ratificação.
              </Typography>
            </Box>
          </TabPanel>
        </Tabs>

        {/* Botões de ação para o formulário */}
        {viewMode !== 'view' && (
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
            <Button
              variant="outlined"
              color="neutral"
              onClick={() => viewMode === 'create' ? setViewMode('search') : setViewMode('view')}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              color="primary"
              onClick={viewMode === 'create' ? handleCreatePropriedade : handleEditPropriedade}
            >
              {viewMode === 'create' ? 'Criar Propriedade' : 'Salvar Alterações'}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  // Renderiza a visualização de detalhes da propriedade
  const renderViewPropriedade = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="title-md">
          Detalhes da Propriedade Selecionada
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setNewPropriedade(selectedPropriedade);
              setViewMode('edit');
            }}
          >
            Editar Propriedade
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => {
              setSelectedPropriedade(null);
              updateFormData('propriedade', null);
              setViewMode('search');
            }}
          >
            Trocar Propriedade
          </Button>
        </Box>
      </Box>
      
      {/* Formulário com campos em modo leitura */}
      {renderPropriedadeForm(false)}
      
      {/* Seleção de responsável pela ratificação */}
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 3 }} />
        
        <Typography level="title-md" sx={{ mb: 2 }}>
          Responsável pela Ratificação
        </Typography>
        
        <FormControl sx={{ width: '100%' }}>
          <FormLabel>Selecione o responsável</FormLabel>
          <Autocomplete
            options={MOCK_RESPONSAVEIS}
            getOptionLabel={(option) => option.nome}
            value={selectedResponsavel}
            onChange={handleResponsavelChange}
            placeholder="Selecione o responsável pela ratificação"
          />
        </FormControl>
      </Box>
    </Box>
  );

  // Renderização condicional com base no modo de visualização
  switch (viewMode) {
    case 'search':
      return renderSearchView();
    case 'view':
      return renderViewPropriedade();
    case 'edit':
    case 'create':
      return renderPropriedadeForm(true);
    default:
      return null;
  }
} 