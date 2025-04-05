import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Textarea from '@mui/joy/Textarea';
import Checkbox from '@mui/joy/Checkbox';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Divider from '@mui/joy/Divider';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import EditIcon from '@mui/icons-material/Edit';
import AddIcon from '@mui/icons-material/Add';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
import Chip from '@mui/joy/Chip';
import { Propriedade } from '../../data/propriedades';
import { Cliente } from '../../data/clientes';
import { getClientes } from '../../services/clienteService';
import Table from '@mui/joy/Table';
import IconButton from '@mui/joy/IconButton';
import DeleteIcon from '@mui/icons-material/Delete';
import Alert from '@mui/joy/Alert';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import { customScrollbarStyle } from '../../utils';

/**
 * Props para o componente de formulário de propriedade
 */
type PropriedadeFormProps = {
  propriedade?: Propriedade;
  isCreating: boolean;
  onSave: (propriedade: Propriedade) => void;
  onCancel: () => void;
};

/**
 * Componente para criação e edição de propriedades
 */
export default function PropriedadeForm({
  propriedade,
  isCreating,
  onSave,
  onCancel
}: PropriedadeFormProps) {
  // Estados para controlar o formulário
  const [formData, setFormData] = React.useState<Partial<Propriedade>>(
    propriedade || {
      nome: '',
      matricula: '',
      ccir: '',
      car: '',
      numeroART: '',
      comarca: '',
      areaTotal: undefined,
      valorPropriedade: undefined,
      dataRegistro: new Date().toLocaleDateString('pt-BR'),
      observacoes: '',
      endereco: {
        cep: '',
        estado: '',
        cidade: '',
        logradouro: '',
        bairro: '',
        complemento: ''
      },
      documentos: [],
      clientesVinculados: []
    }
  );
  
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState<boolean>(false);
  const [errors, setErrors] = React.useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = React.useState<number>(0);
  const [clienteModalOpen, setClienteModalOpen] = React.useState<boolean>(false);
  const [selectedClienteIds, setSelectedClienteIds] = React.useState<string[]>(
    formData.clientesVinculados || []
  );
  const [clienteSearchTerm, setClienteSearchTerm] = React.useState<string>('');

  // Carregar clientes
  React.useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const clientesData = await getClientes();
        setClientes(clientesData);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Atualizar seleção de clientes quando o formData mudar
  React.useEffect(() => {
    if (formData.clientesVinculados) {
      setSelectedClienteIds(formData.clientesVinculados);
    }
  }, [formData.clientesVinculados]);

  // Clientes filtrados pela busca
  const filteredClientes = React.useMemo(() => {
    if (!clienteSearchTerm) return clientes;
    
    const term = clienteSearchTerm.toLowerCase();
    return clientes.filter(cliente => {
      return (
        cliente.nome.toLowerCase().includes(term) ||
        (cliente.tipoCliente === 'PF' && cliente.cpf?.toLowerCase().includes(term)) ||
        (cliente.tipoCliente === 'PJ' && cliente.cnpj?.toLowerCase().includes(term))
      );
    });
  }, [clientes, clienteSearchTerm]);

  // Clientes já selecionados
  const selectedClientes = React.useMemo(() => {
    return clientes.filter(cliente => selectedClienteIds.includes(cliente.id));
  }, [clientes, selectedClienteIds]);

  // Manipulador de alteração de campos
  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Limpar erro quando o campo for alterado
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  // Manipulador de alteração de campos de endereço
  const handleEnderecoChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      endereco: {
        ...prev.endereco,
        [field]: value
      }
    }));
  };

  // Adicionar cliente à propriedade
  const handleAddCliente = (clienteId: string) => {
    if (!selectedClienteIds.includes(clienteId)) {
      setSelectedClienteIds(prev => [...prev, clienteId]);
    }
  };

  // Remover cliente da propriedade
  const handleRemoveCliente = (clienteId: string) => {
    setSelectedClienteIds(prev => prev.filter(id => id !== clienteId));
  };

  // Finalizar a seleção de clientes no modal
  const handleFinishClienteSelection = () => {
    setFormData(prev => ({
      ...prev,
      clientesVinculados: selectedClienteIds
    }));
    setClienteModalOpen(false);
  };

  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.nome) {
      newErrors.nome = 'O nome da propriedade é obrigatório';
    }

    if (!formData.matricula) {
      newErrors.matricula = 'A matrícula é obrigatória';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Salvar propriedade
  const handleSave = () => {
    if (!validateForm()) {
      return;
    }

    // Criar objeto de propriedade completo
    const propriedadeData: Propriedade = {
      id: propriedade?.id || '000', // ID temporário se for criação
      nome: formData.nome || '',
      matricula: formData.matricula || '',
      dataRegistro: formData.dataRegistro || new Date().toLocaleDateString('pt-BR'),
      ccir: formData.ccir,
      car: formData.car,
      numeroART: formData.numeroART,
      comarca: formData.comarca,
      areaTotal: formData.areaTotal !== undefined ? Number(formData.areaTotal) : undefined,
      valorPropriedade: formData.valorPropriedade !== undefined ? Number(formData.valorPropriedade) : undefined,
      observacoes: formData.observacoes,
      endereco: formData.endereco,
      documentos: formData.documentos || [],
      clientesVinculados: selectedClienteIds
    };

    onSave(propriedadeData);
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Cabeçalho do Formulário */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3, 
          pt: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ 
            color: 'primary.500', 
            fontSize: '1.5rem',
            bgcolor: 'primary.softBg',
            borderRadius: 'md',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            {isCreating ? <AddIcon sx={{ fontSize: 'inherit' }} /> : <EditIcon sx={{ fontSize: 'inherit' }} />}
          </Box>
          <Box>
            <Typography level="h4">
              {isCreating ? 'Nova Propriedade' : 'Editar Propriedade'}
            </Typography>
            <Typography level="body-sm" color="neutral">
              {isCreating ? 'Cadastre uma nova propriedade rural' : 'Altere os dados da propriedade'}
            </Typography>
          </Box>
        </Stack>
        
        <Chip
          variant="soft"
          color="primary"
          startDecorator={<HomeWorkIcon />}
          sx={{ fontWeight: 'medium' }}
        >
          Propriedade Rural
        </Chip>
      </Box>
      
      {/* Conteúdo scrollável */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        overflow: 'auto',
        ...customScrollbarStyle,
        mb: 2,
      }}>
        <Box sx={{
          border: '1px solid',
          borderColor: 'divider',
          borderRadius: 'md',
          backgroundColor: 'background.surface',
          boxShadow: 'sm',
          overflow: 'hidden',
        }}>
          <Tabs
            value={activeTab}
            onChange={(_, value) => {
              if (typeof value === 'number') {
                setActiveTab(value);
              }
            }}
            sx={{ width: '100%', bgcolor: 'transparent' }}
          >
            <TabList
              tabFlex={1}
              size="sm"
              sx={{
                pl: { xs: 2, md: 2 },
                pr: { xs: 2, md: 2 },
                justifyContent: 'left',
                borderBottom: '1px solid',
                borderColor: 'divider',
                pt: 2,
                [`&& .${tabClasses.root}`]: {
                  fontWeight: '600',
                  flex: 'initial',
                  color: 'text.tertiary',
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
              <Tab 
                sx={{ borderRadius: '6px 6px 0 0' }}
                indicatorInset
              >
                Dados Básicos
              </Tab>
              <Tab 
                sx={{ borderRadius: '6px 6px 0 0' }}
                indicatorInset
              >
                Documentos
              </Tab>
              <Tab 
                sx={{ borderRadius: '6px 6px 0 0' }}
                indicatorInset
              >
                Clientes Vinculados
              </Tab>
            </TabList>
            
            {/* Tab: Dados Básicos */}
            <TabPanel value={0} sx={{ p: 3 }}>
              <Sheet 
                variant="plain" 
                sx={{ 
                  borderRadius: 'md', 
                  p: 0,
                  width: '100%',
                  boxShadow: 'none',
                  backgroundColor: 'background.surface',
                }}
              >
                <Stack spacing={2}>
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl error={!!errors.nome} sx={{ flex: 1 }}>
                      <FormLabel>Nome da Propriedade *</FormLabel>
                      <Input
                        value={formData.nome || ''}
                        onChange={(e) => handleChange('nome', e.target.value)}
                        placeholder="Ex: Fazenda São João"
                      />
                      {errors.nome && (
                        <Typography level="body-xs" color="danger">
                          {errors.nome}
                        </Typography>
                      )}
                    </FormControl>
                    
                    <FormControl error={!!errors.matricula} sx={{ flex: 1 }}>
                      <FormLabel>Matrícula *</FormLabel>
                      <Input
                        value={formData.matricula || ''}
                        onChange={(e) => handleChange('matricula', e.target.value)}
                        placeholder="Ex: MAT-12345"
                      />
                      {errors.matricula && (
                        <Typography level="body-xs" color="danger">
                          {errors.matricula}
                        </Typography>
                      )}
                    </FormControl>
                  </Box>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ flex: 1 }}>
                      <FormLabel>CCIR</FormLabel>
                      <Input
                        value={formData.ccir || ''}
                        onChange={(e) => handleChange('ccir', e.target.value)}
                        placeholder="Certificado de Cadastro de Imóvel Rural"
                      />
                    </FormControl>
                    
                    <FormControl sx={{ flex: 1 }}>
                      <FormLabel>CAR</FormLabel>
                      <Input
                        value={formData.car || ''}
                        onChange={(e) => handleChange('car', e.target.value)}
                        placeholder="Cadastro Ambiental Rural"
                      />
                    </FormControl>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Número ART</FormLabel>
                    <Input
                      value={formData.numeroART || ''}
                      onChange={(e) => handleChange('numeroART', e.target.value)}
                      placeholder="Anotação de Responsabilidade Técnica"
                    />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Comarca</FormLabel>
                    <Input
                      value={formData.comarca || ''}
                      onChange={(e) => handleChange('comarca', e.target.value)}
                      placeholder="Ex: São Paulo"
                    />
                  </FormControl>
                  
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <FormControl sx={{ flex: 1 }}>
                      <FormLabel>Área Total (ha)</FormLabel>
                      <Input
                        type="number"
                        value={formData.areaTotal !== undefined ? formData.areaTotal : ''}
                        onChange={(e) => handleChange('areaTotal', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Ex: 120.5"
                        slotProps={{
                          input: {
                            step: '0.01',
                            min: '0'
                          }
                        }}
                      />
                    </FormControl>
                    
                    <FormControl sx={{ flex: 1 }}>
                      <FormLabel>Valor da Propriedade (R$)</FormLabel>
                      <Input
                        type="number"
                        value={formData.valorPropriedade !== undefined ? formData.valorPropriedade : ''}
                        onChange={(e) => handleChange('valorPropriedade', e.target.value ? Number(e.target.value) : undefined)}
                        placeholder="Ex: 1000000"
                        slotProps={{
                          input: {
                            step: '0.01',
                            min: '0'
                          }
                        }}
                      />
                    </FormControl>
                  </Box>
                  
                  <FormControl>
                    <FormLabel>Observações</FormLabel>
                    <Textarea
                      minRows={3}
                      value={formData.observacoes || ''}
                      onChange={(e) => handleChange('observacoes', e.target.value)}
                      placeholder="Informações adicionais sobre a propriedade"
                    />
                  </FormControl>
                </Stack>
              </Sheet>
            </TabPanel>
            
            {/* Tab: Documentos */}
            <TabPanel value={1} sx={{ p: 3 }}>
              <Sheet 
                variant="plain" 
                sx={{ 
                  borderRadius: 'md', 
                  p: 0,
                  width: '100%',
                  boxShadow: 'none',
                  backgroundColor: 'background.surface',
                }}
              >
                <Alert color="warning" sx={{ mb: 2 }}>
                  <Typography level="body-sm">
                    Funcionalidade de upload de documentos disponível em breve.
                  </Typography>
                </Alert>
                
                <Typography level="body-sm" sx={{ mb: 2 }}>
                  Documentos necessários:
                </Typography>
                
                <Stack spacing={2}>
                  <FormControl>
                    <FormLabel>Matrícula do Imóvel</FormLabel>
                    <Input type="file" disabled />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Certificado de CAR</FormLabel>
                    <Input type="file" disabled />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>Mapa da Propriedade</FormLabel>
                    <Input type="file" disabled />
                  </FormControl>
                  
                  <FormControl>
                    <FormLabel>ART (Anotação de Responsabilidade Técnica)</FormLabel>
                    <Input type="file" disabled />
                  </FormControl>
                </Stack>
              </Sheet>
            </TabPanel>
            
            {/* Tab: Clientes Vinculados */}
            <TabPanel value={2} sx={{ p: 3 }}>
              <Sheet 
                variant="plain" 
                sx={{ 
                  borderRadius: 'md', 
                  p: 0,
                  width: '100%',
                  boxShadow: 'none',
                  backgroundColor: 'background.surface',
                }}
              >
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 2 }}>
                  <Button
                    variant="solid"
                    color="primary"
                    startDecorator={<AddIcon />}
                    onClick={() => setClienteModalOpen(true)}
                  >
                    Vincular Cliente
                  </Button>
                </Box>
                
                {selectedClientes.length > 0 ? (
                  <Table>
                    <thead>
                      <tr>
                        <th>Nome</th>
                        <th>Tipo</th>
                        <th>Documento</th>
                        <th>Ações</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedClientes.map(cliente => (
                        <tr key={cliente.id}>
                          <td>{cliente.nome}</td>
                          <td>{cliente.tipoCliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                          <td>{cliente.documento}</td>
                          <td>
                            <IconButton
                              variant="plain"
                              color="danger"
                              size="sm"
                              onClick={() => handleRemoveCliente(cliente.id)}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                ) : (
                  <Box sx={{ p: 2, textAlign: 'center' }}>
                    <Typography level="body-md">
                      Nenhum cliente vinculado a esta propriedade.
                    </Typography>
                    <Typography level="body-sm" sx={{ mt: 1, color: 'text.secondary' }}>
                      Clique em "Vincular Cliente" para adicionar.
                    </Typography>
                  </Box>
                )}
              </Sheet>
            </TabPanel>
          </Tabs>
        </Box>
      </Box>
      
      {/* Ações no rodapé - no footer do formulário - agora fora da área scrollável */}
      <Box
        sx={{ 
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          py: 1.5,
          px: 3, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          backgroundColor: 'background.surface',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          width: '100%',
          height: 65,
          marginLeft: 0,
          marginRight: 0,
          boxSizing: 'border-box',
          gap: 2
        }}
      >
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<CancelIcon />}
          onClick={onCancel}
          sx={{ width: 118 }}
        >
          Cancelar
        </Button>
        <Button
          variant="solid"
          color="primary"
          startDecorator={<SaveIcon />}
          onClick={handleSave}
          sx={{ width: 118 }}
        >
          Salvar
        </Button>
      </Box>
      
      {/* Modal de seleção de clientes */}
      <Modal open={clienteModalOpen} onClose={() => setClienteModalOpen(false)}>
        <ModalDialog size="lg">
          <ModalClose />
          <Typography level="h4">Selecionar Clientes</Typography>
          <Divider sx={{ my: 2 }} />
          
          <FormControl sx={{ mb: 2 }}>
            <FormLabel>Buscar Cliente</FormLabel>
            <Input
              placeholder="Digite o nome ou documento do cliente"
              value={clienteSearchTerm}
              onChange={(e) => setClienteSearchTerm(e.target.value)}
            />
          </FormControl>
          
          {loading ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-md">Carregando clientes...</Typography>
            </Box>
          ) : filteredClientes.length > 0 ? (
            <Box sx={{ maxHeight: '400px', overflow: 'auto' }}>
              <Table>
                <thead>
                  <tr>
                    <th>Selecionar</th>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Documento</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredClientes.map(cliente => (
                    <tr key={cliente.id}>
                      <td style={{ textAlign: 'center' }}>
                        <Checkbox
                          checked={selectedClienteIds.includes(cliente.id)}
                          onChange={(e) => {
                            if (e.target.checked) {
                              handleAddCliente(cliente.id);
                            } else {
                              handleRemoveCliente(cliente.id);
                            }
                          }}
                        />
                      </td>
                      <td>{cliente.nome}</td>
                      <td>{cliente.tipoCliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                      <td>{cliente.documento}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Box>
          ) : (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography level="body-md">
                Nenhum cliente encontrado com o termo de busca.
              </Typography>
            </Box>
          )}
          
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1, mt: 2 }}>
            <Button 
              variant="outlined" 
              color="neutral" 
              onClick={() => setClienteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button 
              variant="solid" 
              color="primary" 
              onClick={handleFinishClienteSelection}
            >
              Confirmar
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
} 