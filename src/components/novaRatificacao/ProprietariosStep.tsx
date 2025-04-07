import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';
import SearchIcon from '@mui/icons-material/Search';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import Sheet from '@mui/joy/Sheet';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import TabPanel from '@mui/joy/TabPanel';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Grid from '@mui/joy/Grid';
import RadioGroup from '@mui/joy/RadioGroup';
import Radio from '@mui/joy/Radio';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import Avatar from '@mui/joy/Avatar';
import IconButton from '@mui/joy/IconButton';
import Checkbox from '@mui/joy/Checkbox';
import Alert from '@mui/joy/Alert';
import { tabClasses } from '@mui/joy/Tab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Mock data para clientes
const MOCK_CLIENTES = [
  { id: 1, nome: 'João Silva', documento: '123.456.789-00', tipo: 'fisica', telefone: '(11) 98765-4321', email: 'joao.silva@email.com' },
  { id: 2, nome: 'Maria Souza', documento: '987.654.321-00', tipo: 'fisica', telefone: '(11) 91234-5678', email: 'maria.souza@email.com' },
  { id: 3, nome: 'Empresa ABC Ltda', documento: '12.345.678/0001-90', tipo: 'juridica', telefone: '(11) 3456-7890', email: 'contato@empresaabc.com' },
  { id: 4, nome: 'Roberto Santos', documento: '456.789.123-00', tipo: 'fisica', telefone: '(11) 94567-8901', email: 'roberto.santos@email.com' },
  { id: 5, nome: 'Corporação XYZ S/A', documento: '98.765.432/0001-10', tipo: 'juridica', telefone: '(11) 2345-6789', email: 'contato@corporacaoxyz.com' },
];

// Interface para props do componente
interface ProprietariosStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onBackClick?: () => void;
}

/**
 * Componente para gerenciamento de proprietários
 * Representa o segundo passo do processo de ratificação
 */
export default function ProprietariosStep({ formData, updateFormData, onBackClick }: ProprietariosStepProps) {
  const [selectedTab, setSelectedTab] = React.useState(0);
  const [searchTerm, setSearchTerm] = React.useState('');
  const [isSearching, setIsSearching] = React.useState(false);
  const [searchResults, setSearchResults] = React.useState<Array<any>>([]);
  const [selectedCliente, setSelectedCliente] = React.useState<any>(null);
  const [proprietarios, setProprietarios] = React.useState<Array<any>>(formData.proprietarios || []);
  const [viewMode, setViewMode] = React.useState<'list' | 'search' | 'view' | 'edit' | 'create'>('list');
  const [representanteId, setRepresentanteId] = React.useState<number | null>(
    proprietarios.find(p => p.representante)?.id || null
  );
  const [newCliente, setNewCliente] = React.useState({
    nome: '',
    tipo: 'fisica',
    documento: '',
    telefone: '',
    email: '',
    endereco: {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
    }
  });

  // Efeito para sincronizar proprietários com o formData
  React.useEffect(() => {
    updateFormData('proprietarios', proprietarios);
  }, [proprietarios, updateFormData]);

  // Efeito para filtrar resultados da busca
  React.useEffect(() => {
    if (searchTerm.trim() === '') {
      setSearchResults([]);
      return;
    }
    
    const term = searchTerm.toLowerCase();
    const filtered = MOCK_CLIENTES.filter(
      cliente => 
        cliente.nome.toLowerCase().includes(term) ||
        cliente.documento.includes(term) ||
        cliente.email.toLowerCase().includes(term)
    );
    setSearchResults(filtered);
  }, [searchTerm]);

  // Handler para pesquisa de clientes
  const handleSearch = () => {
    setIsSearching(true);
    // Simula uma busca na API
    setTimeout(() => {
      setIsSearching(false);
    }, 500);
  };

  // Handler para selecionar cliente da pesquisa
  const handleSelectCliente = (cliente: any) => {
    setSelectedCliente(cliente);
    // Update newCliente with the selected data to ensure view mode has correct data
    setNewCliente({
      ...newCliente,
      ...cliente,
      endereco: {
        ...newCliente.endereco,
        ...(cliente.endereco || {})
      }
    });
    setViewMode('view');
  };

  // Handler para adicionar proprietário
  const handleAddProprietario = (cliente: any, isRepresentante: boolean = false) => {
    // Verificar se o cliente já está adicionado
    if (proprietarios.some(p => p.id === cliente.id)) {
      alert('Este cliente já está adicionado como proprietário.');
      return;
    }
    
    const novoProprietario = {
      ...cliente,
      representante: isRepresentante
    };
    
    let novosProprietarios;
    
    if (isRepresentante) {
      // Se for representante, atualiza os outros para não serem
      novosProprietarios = proprietarios.map(p => ({
        ...p,
        representante: false
      }));
      setRepresentanteId(cliente.id);
    } else {
      novosProprietarios = [...proprietarios];
    }
    
    novosProprietarios.push(novoProprietario);
    setProprietarios(novosProprietarios);
    setViewMode('list');
  };

  // Handler para remover proprietário
  const handleRemoveProprietario = (id: number) => {
    const propriedadeRemovida = proprietarios.find(p => p.id === id);
    const eraRepresentante = propriedadeRemovida?.representante;
    
    const novosProprietarios = proprietarios.filter(p => p.id !== id);
    
    if (eraRepresentante && novosProprietarios.length > 0) {
      // Se removeu o representante, define o primeiro como representante
      novosProprietarios[0].representante = true;
      setRepresentanteId(novosProprietarios[0].id);
    } else if (novosProprietarios.length === 0) {
      setRepresentanteId(null);
    }
    
    setProprietarios(novosProprietarios);
  };

  // Handler para definir representante
  const handleSetRepresentante = (id: number) => {
    const novosProprietarios = proprietarios.map(p => ({
      ...p,
      representante: p.id === id
    }));
    
    setProprietarios(novosProprietarios);
    setRepresentanteId(id);
  };

  // Handler para mudanças nos campos do formulário de novo cliente
  const handleNewClienteChange = (field: string, value: any) => {
    if (field.includes('.')) {
      // Handle nested fields (like "endereco.cidade")
      const [parent, child] = field.split('.');
      setNewCliente(prev => ({
        ...prev,
        [parent]: {
          ...(prev[parent as keyof typeof prev] as Record<string, any> || {}),
          [child]: value
        }
      }));
    } else {
      // Handle regular fields
      setNewCliente(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  // Handler para criar novo cliente
  const handleCreateCliente = () => {
    // Simula criação de novo cliente
    const novoCliente = {
      id: Math.floor(Math.random() * 1000),
      ...newCliente
    };
    
    setSelectedCliente(novoCliente);
    setViewMode('view');
  };

  // Handler para editar cliente
  const handleEditCliente = () => {
    // Simula atualização de cliente
    const clienteAtualizado = {
      ...selectedCliente,
      ...newCliente
    };
    
    setSelectedCliente(clienteAtualizado);
    
    // Atualiza na lista de proprietários se já estiver lá
    const isProprietario = proprietarios.some(p => p.id === clienteAtualizado.id);
    if (isProprietario) {
      const novosProprietarios = proprietarios.map(p => 
        p.id === clienteAtualizado.id 
          ? { ...clienteAtualizado, representante: p.representante } 
          : p
      );
      setProprietarios(novosProprietarios);
    }
    
    setViewMode('view');
  };

  // Renderiza a lista de proprietários
  const renderProprietariosList = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="title-md">
          Proprietários Vinculados à Ratificação
        </Typography>
        <Button
          variant="outlined"
          color="primary"
          startDecorator={<AddIcon />}
          onClick={() => setViewMode('search')}
        >
          Adicionar Proprietário
        </Button>
      </Box>
      
      {proprietarios.length === 0 ? (
        <Alert
          variant="outlined"
          color="neutral"
          sx={{ mb: 2 }}
        >
          Nenhum proprietário vinculado. Adicione pelo menos um proprietário para continuar.
        </Alert>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {proprietarios.map((proprietario) => (
            <Card
              key={proprietario.id}
              variant="outlined"
              sx={{ position: 'relative' }}
            >
              {proprietario.representante && (
                <Chip
                  variant="solid"
                  color="warning"
                  size="sm"
                  startDecorator={<StarIcon />}
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                  }}
                >
                  Representante
                </Chip>
              )}
              
              <CardContent>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <Avatar 
                    color={proprietario.tipo === 'fisica' ? 'primary' : 'success'}
                  >
                    {proprietario.tipo === 'fisica' ? <PersonIcon /> : <BusinessIcon />}
                  </Avatar>
                  
                  <Box sx={{ flex: 1 }}>
                    <Typography level="title-md">
                      {proprietario.nome}
                    </Typography>
                    <Typography level="body-sm">
                      {proprietario.tipo === 'fisica' ? 'CPF' : 'CNPJ'}: {proprietario.documento}
                    </Typography>
                    <Typography level="body-sm">
                      {proprietario.email}
                    </Typography>
                    <Typography level="body-sm">
                      {proprietario.telefone}
                    </Typography>
                  </Box>
                </Box>
              </CardContent>
              
              <CardActions buttonFlex="0 1 120px">
                {!proprietario.representante && (
                  <Button
                    variant="plain"
                    color="warning"
                    startDecorator={<StarIcon />}
                    onClick={() => handleSetRepresentante(proprietario.id)}
                  >
                    Definir como Representante
                  </Button>
                )}
                
                <Button
                  variant="plain"
                  color="primary"
                  startDecorator={<EditIcon />}
                  onClick={() => {
                    setSelectedCliente(proprietario);
                    setNewCliente({
                      ...proprietario,
                      endereco: proprietario.endereco || {
                        logradouro: '',
                        numero: '',
                        complemento: '',
                        bairro: '',
                        cidade: '',
                        uf: '',
                        cep: '',
                      }
                    });
                    setViewMode('edit');
                  }}
                >
                  Editar
                </Button>
                
                <Button
                  variant="plain"
                  color="danger"
                  startDecorator={<DeleteIcon />}
                  onClick={() => handleRemoveProprietario(proprietario.id)}
                >
                  Remover
                </Button>
              </CardActions>
            </Card>
          ))}
        </Box>
      )}
    </Box>
  );

  // Renderiza a visualização de pesquisa de clientes
  const renderSearchView = () => (
    <Box>
      <Typography level="title-md" sx={{ mb: 2 }}>
        Buscar Cliente
      </Typography>
      
      <Box sx={{ display: 'flex', gap: 1, mb: 3 }}>
        <FormControl sx={{ flex: 1 }}>
          <Input
            placeholder="Buscar por nome, documento ou email"
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
          onClick={() => {
            setNewCliente({
              nome: '',
              tipo: 'fisica',
              documento: '',
              telefone: '',
              email: '',
              endereco: {
                logradouro: '',
                numero: '',
                complemento: '',
                bairro: '',
                cidade: '',
                uf: '',
                cep: '',
              }
            });
            setViewMode('create');
          }}
        >
          Novo Cliente
        </Button>
      </Box>
      
      {searchTerm && (
        <Typography level="title-sm" sx={{ mb: 1 }}>
          Resultados da pesquisa
        </Typography>
      )}
      
      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        {searchTerm.trim() === '' ? (
          <Typography level="body-sm" sx={{ textAlign: 'center', py: 4 }}>
            Digite um termo de busca para encontrar clientes.
          </Typography>
        ) : searchResults.length === 0 ? (
          <Typography level="body-sm" sx={{ textAlign: 'center', py: 4 }}>
            Nenhum cliente encontrado com os critérios informados.
          </Typography>
        ) : (
          searchResults.map((cliente) => {
            const jaAdicionado = proprietarios.some(p => p.id === cliente.id);
            
            return (
              <Card 
                key={cliente.id} 
                variant="outlined" 
                sx={{ 
                  cursor: jaAdicionado ? 'default' : 'pointer',
                  opacity: jaAdicionado ? 0.7 : 1,
                  '&:hover': jaAdicionado ? {} : { bgcolor: 'action.hover' } 
                }}
                onClick={jaAdicionado ? undefined : () => handleSelectCliente(cliente)}
              >
                <CardContent>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar 
                      color={cliente.tipo === 'fisica' ? 'primary' : 'success'}
                    >
                      {cliente.tipo === 'fisica' ? <PersonIcon /> : <BusinessIcon />}
                    </Avatar>
                    
                    <Box sx={{ flex: 1 }}>
                      <Typography level="title-md">
                        {cliente.nome}
                      </Typography>
                      <Typography level="body-sm">
                        {cliente.tipo === 'fisica' ? 'CPF' : 'CNPJ'}: {cliente.documento}
                      </Typography>
                      <Typography level="body-sm">
                        {cliente.email}
                      </Typography>
                    </Box>
                    
                    {jaAdicionado && (
                      <Chip color="primary" variant="soft">
                        Já adicionado
                      </Chip>
                    )}
                  </Box>
                </CardContent>
              </Card>
            );
          })
        )}
      </Box>
    </Box>
  );

  // Renderiza o formulário de cliente
  const renderClienteForm = (isEditing: boolean) => {
    // When editing, use selected client if available, otherwise use new client template
    const initialData = isEditing && viewMode === 'edit' ? selectedCliente : newCliente;
    
    // Create default address if not present
    const defaultEndereco = {
      logradouro: '',
      numero: '',
      complemento: '',
      bairro: '',
      cidade: '',
      uf: '',
      cep: '',
    };
    
    // Ensure we have default values with properly merged address
    const clienteData = {
      nome: '',
      tipo: 'fisica',
      documento: '',
      telefone: '',
      email: '',
      // Merge the default address with any existing address data
      endereco: {
        ...defaultEndereco,
        ...(initialData?.endereco || {})
      },
      // Spread the rest of initialData
      ...initialData,
    };
    
    return (
      <Box>
        <Tabs
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
            <Tab sx={{ py: 1.5 }}>Endereço</Tab>
            <Tab sx={{ py: 1.5 }}>Documentos</Tab>
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
              <FormLabel>Tipo de Pessoa</FormLabel>
              <FormControl>
                <RadioGroup
                  value={clienteData.tipo}
                  onChange={(e) => handleNewClienteChange('tipo', e.target.value)}
                >
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <Radio
                      value="fisica"
                      label="Pessoa Física"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                    <Radio
                      value="juridica"
                      label="Pessoa Jurídica"
                      disabled={!isEditing && viewMode === 'view'}
                    />
                  </Box>
                </RadioGroup>
              </FormControl>
              
              <FormLabel sx={{ display: 'block' }}>
                {clienteData.tipo === 'fisica' ? 'Nome Completo' : 'Razão Social'}
              </FormLabel>
              <FormControl sx={{ display: 'flex' }}>
                <Input
                  placeholder={clienteData.tipo === 'fisica' ? 'Nome Completo' : 'Razão Social'}
                  value={clienteData.nome}
                  onChange={(e) => handleNewClienteChange('nome', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>
                {clienteData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
              </FormLabel>
              <FormControl>
                <Input
                  placeholder={clienteData.tipo === 'fisica' ? 'CPF' : 'CNPJ'}
                  value={clienteData.documento}
                  onChange={(e) => handleNewClienteChange('documento', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <Divider />

              <FormLabel>E-mail</FormLabel>
              <FormControl>
                <Input
                  placeholder="E-mail"
                  value={clienteData.email}
                  onChange={(e) => handleNewClienteChange('email', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Telefone</FormLabel>
              <FormControl>
                <Input
                  placeholder="Telefone"
                  value={clienteData.telefone}
                  onChange={(e) => handleNewClienteChange('telefone', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>
            </Box>
          </TabPanel>
          
          <TabPanel value={1} sx={{ p: 0 }}>
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
              <FormLabel>Logradouro</FormLabel>
              <FormControl>
                <Input
                  placeholder="Logradouro"
                  value={clienteData.endereco.logradouro}
                  onChange={(e) => handleNewClienteChange('endereco.logradouro', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Número</FormLabel>
              <FormControl>
                <Input
                  placeholder="Número"
                  value={clienteData.endereco.numero}
                  onChange={(e) => handleNewClienteChange('endereco.numero', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Complemento</FormLabel>
              <FormControl>
                <Input
                  placeholder="Complemento"
                  value={clienteData.endereco.complemento}
                  onChange={(e) => handleNewClienteChange('endereco.complemento', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Bairro</FormLabel>
              <FormControl>
                <Input
                  placeholder="Bairro"
                  value={clienteData.endereco.bairro}
                  onChange={(e) => handleNewClienteChange('endereco.bairro', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>Cidade</FormLabel>
              <FormControl>
                <Input
                  placeholder="Cidade"
                  value={clienteData.endereco.cidade}
                  onChange={(e) => handleNewClienteChange('endereco.cidade', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>

              <FormLabel>UF</FormLabel>
              <FormControl>
                <Select
                  placeholder="Selecione o estado"
                  value={clienteData.endereco.uf}
                  onChange={(_, value) => handleNewClienteChange('endereco.uf', value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                >
                  <Option value="SP">São Paulo</Option>
                  <Option value="MG">Minas Gerais</Option>
                  <Option value="RJ">Rio de Janeiro</Option>
                  <Option value="ES">Espírito Santo</Option>
                </Select>
              </FormControl>

              <FormLabel>CEP</FormLabel>
              <FormControl>
                <Input
                  placeholder="CEP"
                  value={clienteData.endereco.cep}
                  onChange={(e) => handleNewClienteChange('endereco.cep', e.target.value)}
                  disabled={!isEditing && viewMode === 'view'}
                  sx={{ bgcolor: !isEditing && viewMode === 'view' ? 'action.selected' : undefined }}
                />
              </FormControl>
            </Box>
          </TabPanel>
          
          <TabPanel value={2} sx={{ p: 0 }}>
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-md">
                Documentos do cliente são gerenciados na etapa de Documentos do processo de ratificação.
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
              onClick={viewMode === 'create' ? handleCreateCliente : handleEditCliente}
            >
              {viewMode === 'create' ? 'Criar Cliente' : 'Salvar Alterações'}
            </Button>
          </Box>
        )}
      </Box>
    );
  };

  // Renderiza a visualização detalhada do cliente
  const renderClienteView = () => (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="title-md">
          Detalhes do Cliente
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => {
              setNewCliente({
                ...selectedCliente,
                endereco: selectedCliente.endereco || {
                  logradouro: '',
                  numero: '',
                  complemento: '',
                  bairro: '',
                  cidade: '',
                  uf: '',
                  cep: '',
                }
              });
              setViewMode('edit');
            }}
          >
            Editar Cliente
          </Button>
        </Box>
      </Box>
      
      {/* Formulário com campos em modo leitura */}
      {renderClienteForm(false)}
      
      {/* Opções para adicionar como proprietário */}
      <Box sx={{ mt: 4 }}>
        <Divider sx={{ mb: 3 }} />
        
        <Typography level="title-md" sx={{ mb: 2 }}>
          Adicionar como Proprietário
        </Typography>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Checkbox
            label="Definir como Representante"
            disabled={representanteId !== null}
          />
        </Box>
        
        <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
          <Button
            variant="solid"
            color="primary"
            onClick={() => handleAddProprietario(selectedCliente, representanteId === null)}
          >
            Adicionar como Proprietário
          </Button>
          <Button
            variant="outlined"
            color="neutral"
            onClick={() => setViewMode('list')}
          >
            Cancelar
          </Button>
        </Box>
      </Box>
    </Box>
  );

  // Renderiza a visualização principal (pesquisa de proprietários)
  const renderMainView = () => (
    <Sheet>
      {/* Include the existing proprietariosList component content */}
      {renderProprietariosList()}
    </Sheet>
  );

  // Renderização condicional com base no modo de visualização
  switch (viewMode) {
    case 'list':
      return renderMainView();
    case 'search':
      return renderSearchView();
    case 'view':
      return renderClienteView();
    case 'edit':
    case 'create':
      return renderClienteForm(true);
    default:
      return null;
  }
} 