import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormHelperText from '@mui/joy/FormHelperText';
import FormLabel from '@mui/joy/FormLabel';
import Grid from '@mui/joy/Grid';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Textarea from '@mui/joy/Textarea';
import Typography from '@mui/joy/Typography';
import Alert from '@mui/joy/Alert';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';

import AddIcon from '@mui/icons-material/Add';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import DeleteIcon from '@mui/icons-material/Delete';
import UploadFileIcon from '@mui/icons-material/UploadFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';

import { Cliente, Documento, Socio, Endereco } from '../../data/clientes';

type ClienteFormProps = {
  cliente?: Cliente;
  isCreating?: boolean;
  onSave: (cliente: Cliente) => void;
  onCancel: () => void;
};

type FormErrors = {
  [key: string]: string;
};

export default function ClienteForm({
  cliente,
  isCreating = false,
  onSave,
  onCancel
}: ClienteFormProps) {
  // Estado inicial para cliente novo ou edição
  const [formData, setFormData] = React.useState<Partial<Cliente>>(
    cliente || {
      tipoCliente: 'PF',
      nome: '',
      timestamp: new Date().toLocaleDateString(),
      documentos: []
    }
  );
  
  const [errors, setErrors] = React.useState<FormErrors>({});
  const [activeTab, setActiveTab] = React.useState('dados-principais');
  const [socios, setSocios] = React.useState<Partial<Socio>[]>(
    cliente?.socios || []
  );
  
  const isPF = formData.tipoCliente === 'PF';
  
  // Função para atualizar o estado do formulário
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
    
    // Limpar erro quando o campo é preenchido
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };
  
  // Função para atualizar campos de endereço
  const handleEnderecoChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      endereco: {
        ...(prev.endereco || {}),
        [name]: value
      }
    }));
  };
  
  // Função para atualizar campos do cônjuge
  const handleConjugeChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    // Corrigido para lidar com a possibilidade de undefined
    setFormData((prev) => {
      return {
        ...prev,
        conjuge: {
          ...(prev.conjuge || {
            nome: '', 
            cpf: '', 
            rg: '', 
            dataNascimento: '',
            nacionalidade: ''
          }),
          [name]: value
        }
      };
    });
  };
  
  // Função para mudar o tipo de cliente
  const handleTipoClienteChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tipoCliente = event.target.value as 'PF' | 'PJ';
    setFormData((prev) => ({
      ...prev,
      tipoCliente,
      // Limpar campos específicos de cada tipo
      ...(tipoCliente === 'PF'
        ? { cnpj: undefined, razaoSocial: undefined, numeroMinimoAssinaturas: undefined }
        : { cpf: undefined, rg: undefined, dataNascimento: undefined, estadoCivil: undefined, nacionalidade: undefined, conjuge: undefined })
    }));
  };
  
  // Função para adicionar um novo sócio
  const handleAddSocio = () => {
    const newSocio: Partial<Socio> = {
      id: `socio-${Date.now()}`,
      nome: '',
      cpf: '',
      administrador: false
    };
    setSocios([...socios, newSocio]);
  };
  
  // Função para remover um sócio
  const handleRemoveSocio = (id: string) => {
    setSocios(socios.filter((socio) => socio.id !== id));
  };
  
  // Função para atualizar dados de um sócio
  const handleSocioChange = (
    id: string,
    field: string,
    value: string | boolean
  ) => {
    setSocios(
      socios.map((socio) =>
        socio.id === id ? { ...socio, [field]: value } : socio
      )
    );
  };
  
  // Função para atualizar o endereço de um sócio
  const handleSocioEnderecoChange = (
    id: string,
    field: string,
    value: string
  ) => {
    setSocios(
      socios.map((socio) =>
        socio.id === id
          ? {
              ...socio,
              endereco: {
                ...(socio.endereco || {}),
                [field]: value
              }
            }
          : socio
      )
    );
  };
  
  // Upload de documento simulado
  const handleDocumentoUpload = () => {
    // Simular upload de documento (adicionado arquivo para satisfazer tipagem)
    const newDocumento: Documento = {
      id: `doc-${Date.now()}`,
      nome: `Documento ${(formData.documentos?.length || 0) + 1}`,
      tipo: 'application/pdf',
      dataUpload: new Date().toLocaleDateString(),
      arquivo: 'data:application/pdf;base64,JVBERi0xLjMNCiXi48/TDQoNCjEgMCBvYmoNCjw8DQovVHlwZSAvQ2F0YWxvZw0KL091dGxpbmVzIDIgMCBSDQovUGFnZXMgMyAwIFINCj4+DQplbmRvYmoNCg0KMiAwIG9iag0KPDwNCi9UeXBlIC9PdXRsaW5lcw0KL0NvdW50IDANCj4+DQplbmRvYmoNCg0KMyAwIG9iag0KPDwNCi9UeXBlIC9QYWdlcw0KL0NvdW50IDINCi9LaWRzIFsgNCAwIFIgNiAwIFIgXSANCj4+DQplbmRvYmoNCg0KNCAwIG9iag0KPDwNCi9UeXBlIC9QYWdlDQovUGFyZW50IDMgMCBSDQovUmVzb3VyY2VzIDw8DQovRm9udCA8PA0KL0YxIDkgMCBSIA0KPj4NCi9Qcm9jU2V0IDggMCBSDQo+Pg0KL01lZGlhQm94IFswIDAgNjEyLjAwMDAgNzkyLjAwMDBdDQovQ29udGVudHMgNSAwIFINCj4+DQplbmRvYmoNCg0KNSAwIG9iag0KPDwgL0xlbmd0aCAxMDc0ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBBIFNpbXBsZSBQREYgRmlsZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIFRoaXMgaXMgYSBzbWFsbCBkZW1vbnN0cmF0aW9uIC5wZGYgZmlsZSAtICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjY0LjcwNDAgVGQNCigganVzdCBmb3IgdXNlIGluIHRoZSBWaXJ0dWFsIE1lY2hhbmljcyB0dXRvcmlhbHMuIE1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NTIuNzUyMCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDYyOC44NDgwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjE2Ljg5NjAgVGQNCiggdGV4dC4gQW5kIG1vcmUgdGV4dC4gQm9yaW5nLCB6enp6ei4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNjA0Ljk0NDAgVGQNCiggbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDU5Mi45OTIwIFRkDQooIEFuZCBtb3JlIHRleHQuIEFuZCBtb3JlIHRleHQuICkgVGoNCkVUDQpCVA0KL0YxIDAwMTAgVGYNCjY5LjI1MDAgNTY5LjA4ODAgVGQNCiggQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA1NTcuMTM2MCBUZA0KKCAgKSBUag0KRVQNCmVuZHN0cmVhbQ0KZW5kb2JqDQoNCjYgMCBvYmoNCjw8DQovVHlwZSAvUGFnZQ0KL1BhcmVudCAzIDAgUg0KL1Jlc291cmNlcyA8PA0KL0ZvbnQgPDwNCi9GMSA5IDAgUiANCj4+DQovUHJvY1NldCA4IDAgUg0KPj4NCi9NZWRpYUJveCBbMCAwIDYxMi4wMDAwIDc5Mi4wMDAwXQ0KL0NvbnRlbnRzIDcgMCBSDQo+Pg0KZW5kb2JqDQoNCjcgMCBvYmoNCjw8IC9MZW5ndGggNjc2ID4+DQpzdHJlYW0NCjIgSg0KQlQNCjAgMCAwIHJnDQovRjEgMDAyNyBUZg0KNTcuMzc1MCA3MjIuMjgwMCBUZA0KKCBTaW1wbGUgUERGIEZpbGUgMiApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY4OC42MDgwIFRkDQooIC4uLmNvbnRpbnVlZCBmcm9tIHBhZ2UgMS4gWWV0IG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NzYuNjU2MCBUZA0KKCBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSB0ZXh0LiBBbmQgbW9yZSApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY2NC43MDQwIFRkDQooIHRleHQuIE9oLCBob3cgYm9yaW5nIHR5cGluZyB0aGlzIHN0dWZmLiBCdXQgbm90IGFzIGJvcmluZyBhcyB3YXRjaGluZyApIFRqDQpFVA0KQlQNCi9GMSAwMDEwIFRmDQo2OS4yNTAwIDY1Mi43NTIwIFRkDQooIHBhaW50IGRyeS4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gQW5kIG1vcmUgdGV4dC4gKSBUag0KRVQNCkJUDQovRjEgMDAxMCBUZg0KNjkuMjUwMCA2NDAuODAwMCBUZA0KKCBCb3JpbmcuICBNb3JlLCBhIGxpdHRsZSBtb3JlIHRleHQuIFRoZSBlbmQsIGFuZCBqdXN0IGFzIHdlbGwuICkgVGoNCkVUDQplbmRzdHJlYW0NCmVuZG9iag0KDQo4IDAgb2JqDQpbL1BERiAvVGV4dF0NCmVuZG9iag0KDQo5IDAgb2JqDQo8PA0KL1R5cGUgL0ZvbnQNCi9TdWJ0eXBlIC9UeXBlMQ0KL05hbWUgL0YxDQovQmFzZUZvbnQgL0hlbHZldGljYQ0KL0VuY29kaW5nIC9XaW5BbnNpRW5jb2RpbmcNCj4+DQplbmRvYmoNCg0KMTAgMCBvYmoNCjw8DQovQ3JlYXRvciAoUmF2ZSBcKGh0dHA6Ly93d3cubmV2cm9uYS5jb20vcmF2ZVwpKQ0KL1Byb2R1Y2VyIChOZXZyb25hIERlc2lnbnMpDQovQ3JlYXRpb25EYXRlIChEOjIwMDYwMzAxMDcyODI2KQ0KPj4NCmVuZG9iag0KDQp4cmVmDQowIDExDQowMDAwMDAwMDAwIDY1NTM1IGYNCjAwMDAwMDAwMTkgMDAwMDAgbg0KMDAwMDAwMDA5MyAwMDAwMCBuDQowMDAwMDAwMTQ3IDAwMDAwIG4NCjAwMDAwMDAyMjIgMDAwMDAgbg0KMDAwMDAwMDM5MCAwMDAwMCBuDQowMDAwMDAxNTIyIDAwMDAwIG4NCjAwMDAwMDE2OTAgMDAwMDAgbg0KMDAwMDAwMjQyMyAwMDAwMCBuDQowMDAwMDAyNDU2IDAwMDAwIG4NCjAwMDAwMDI1NzQgMDAwMDAgbg0KDQp0cmFpbGVyDQo8PA0KL1NpemUgMTENCi9Sb290IDEgMCBSDQovSW5mbyAxMCAwIFINCj4+DQoNCnN0YXJ0eHJlZg0KMjcxNA0KJSVFT0YNCg=='
    };
    
    setFormData((prev) => ({
      ...prev,
      documentos: [...(prev.documentos || []), newDocumento]
    }));
  };
  
  // Remover documento
  const handleRemoveDocumento = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documentos: prev.documentos?.filter((doc) => doc.id !== id)
    }));
  };
  
  // Validar formulário
  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};
    
    // Campos comuns
    if (!formData.nome) {
      newErrors.nome = 'Nome é obrigatório';
    }
    
    if (formData.tipoCliente === 'PF') {
      // Validação para Pessoa Física
      if (!formData.cpf) {
        newErrors.cpf = 'CPF é obrigatório';
      } else if (!/^\d{3}\.\d{3}\.\d{3}-\d{2}$/.test(formData.cpf)) {
        newErrors.cpf = 'CPF inválido';
      }
    } else {
      // Validação para Pessoa Jurídica
      if (!formData.cnpj) {
        newErrors.cnpj = 'CNPJ é obrigatório';
      } else if (!/^\d{2}\.\d{3}\.\d{3}\/\d{4}-\d{2}$/.test(formData.cnpj)) {
        newErrors.cnpj = 'CNPJ inválido';
      }
      
      if (!formData.razaoSocial) {
        newErrors.razaoSocial = 'Razão Social é obrigatória';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Salvar cliente
  const handleSave = () => {
    if (validateForm()) {
      // Adicionar sócios apenas se for PJ
      const clienteData: Cliente = {
        ...(formData as Cliente),
        ...(formData.tipoCliente === 'PJ' ? { socios: socios as Socio[] } : {})
      };
      
      onSave(clienteData);
    }
  };
  
  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Cabeçalho do Formulário */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pt: 1 }}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ color: 'primary.500', fontSize: '1.5rem' }}>
            {isCreating ? <PersonAddIcon sx={{ fontSize: 'inherit' }} /> : <EditIcon sx={{ fontSize: 'inherit' }} />}
          </Box>
          <Box>
            <Typography level="h4">
              {isCreating ? 'Cadastrar Novo Cliente' : 'Editar Cliente'}
            </Typography>
            {isCreating && (
              <Typography level="body-sm" color="neutral">
                Preencha as informações para cadastrar um novo cliente
              </Typography>
            )}
          </Box>
        </Stack>
        
        <Chip
          variant="soft"
          color="neutral"
          startDecorator={isPF ? <PersonIcon /> : <BusinessIcon />}
          sx={{ bgcolor: isPF ? 'success.softBg' : 'primary.softBg' }}
        >
          {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
        </Chip>
      </Box>
      
      {/* Seletor de Tipo de Cliente */}
      <Box 
        sx={{ 
          mb: 3, 
          width: 'fit-content',
          borderRadius: 'md',
          p: 0.5,
          backgroundColor: 'background.level2',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={isPF ? "solid" : "plain"}
            color={isPF ? "neutral" : "neutral"}
            startDecorator={<PersonIcon />}
            onClick={() => handleTipoClienteChange({ target: { value: 'PF' } } as React.ChangeEvent<HTMLInputElement>)}
            sx={{ 
              borderRadius: 'md', 
              px: 2,
              py: 1,
              fontWeight: 500,
              fontSize: '0.875rem',
              opacity: isPF ? 1 : 0.7
            }}
          >
            Pessoa Física
          </Button>
          <Button
            variant={!isPF ? "solid" : "plain"}
            color={!isPF ? "neutral" : "neutral"}
            startDecorator={<BusinessIcon />}
            onClick={() => handleTipoClienteChange({ target: { value: 'PJ' } } as React.ChangeEvent<HTMLInputElement>)}
            sx={{ 
              borderRadius: 'md', 
              px: 2,
              py: 1,
              fontWeight: 500,
              fontSize: '0.875rem',
              opacity: !isPF ? 1 : 0.7
            }}
          >
            Pessoa Jurídica
          </Button>
        </Box>
      </Box>
      
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        border: '1px solid',
        borderColor: 'divider',
        borderRadius: 'md',
        overflow: 'hidden',
        boxShadow: 'sm',
        backgroundColor: 'background.surface',
        mb: 3
      }}>
        {/* Abas integradas com conteúdo */}
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as string)} sx={{ height: '100%' }}>
          <TabList 
            sx={{ 
              px: 2,
              pt: 2,
              backgroundColor: 'background.surface',
              borderBottom: '1px solid',
              borderColor: 'divider',
              gap: 1,
              '& .MuiTab-root': {
                fontWeight: 500,
                borderRadius: 'md',
                py: 1,
                transition: 'all 0.2s',
                '&:hover': {
                  bgcolor: 'background.level1',
                },
                '&.Mui-selected': {
                  color: 'primary.600',
                  bgcolor: 'primary.softBg',
                  fontWeight: 600,
                  '&::after': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    bottom: '-1px',
                    left: 0,
                    width: '100%',
                    height: '2px',
                    bgcolor: 'primary.500',
                  }
                },
              },
            }}
          >
            <Tab value="dados-principais">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <PersonIcon sx={{ fontSize: '1.2rem' }} />
                <span>Dados Principais</span>
              </Box>
            </Tab>
            <Tab value="endereco">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <BusinessIcon sx={{ fontSize: '1.2rem' }} />
                <span>Endereço</span>
              </Box>
            </Tab>
            {isPF && formData.estadoCivil === "Casado" && (
              <Tab value="conjuge">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: '1.2rem' }} />
                  <span>Cônjuge</span>
                </Box>
              </Tab>
            )}
            {!isPF && (
              <Tab value="socios">
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <PersonIcon sx={{ fontSize: '1.2rem' }} />
                  <span>Sócios</span>
                </Box>
              </Tab>
            )}
            <Tab value="documentos">
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <InsertDriveFileIcon sx={{ fontSize: '1.2rem' }} />
                <span>Documentos</span>
              </Box>
            </Tab>
          </TabList>
          
          {/* Conteúdo das abas - agora sem bordas separadas */}
          <Box sx={{ 
            p: { xs: 2, md: 3 }, 
            bgcolor: 'background.surface', 
            flex: 1,
            overflow: 'auto'
          }}>
            <TabPanel value="dados-principais" sx={{ p: 0 }}>
              <Grid container spacing={2}>
                {isPF ? (
                  // Campos para Pessoa Física
                  <>
                    <Grid xs={12}>
                      <FormControl error={!!errors.nome}>
                        <FormLabel>Nome Completo</FormLabel>
                        <Input
                          name="nome"
                          value={formData.nome || ''}
                          onChange={handleChange}
                          placeholder="Nome completo"
                          sx={{ borderRadius: 'md' }}
                        />
                        {errors.nome && (
                          <FormHelperText>{errors.nome}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl error={!!errors.cpf}>
                        <FormLabel>CPF</FormLabel>
                        <Input
                          name="cpf"
                          value={formData.cpf || ''}
                          onChange={handleChange}
                          placeholder="000.000.000-00"
                          sx={{ borderRadius: 'md' }}
                        />
                        {errors.cpf && (
                          <FormHelperText>{errors.cpf}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl>
                        <FormLabel>RG</FormLabel>
                        <Input
                          name="rg"
                          value={formData.rg || ''}
                          onChange={handleChange}
                          placeholder="00.000.000-0"
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl>
                        <FormLabel>Data de Nascimento</FormLabel>
                        <Input
                          name="dataNascimento"
                          value={formData.dataNascimento || ''}
                          onChange={handleChange}
                          placeholder="DD/MM/AAAA"
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl>
                        <FormLabel>Nacionalidade</FormLabel>
                        <Input
                          name="nacionalidade"
                          value={formData.nacionalidade || ''}
                          onChange={handleChange}
                          placeholder="Nacionalidade"
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl>
                        <FormLabel>Estado Civil</FormLabel>
                        <Select
                          name="estadoCivil"
                          value={formData.estadoCivil || ''}
                          onChange={(_, value) =>
                            value && setFormData({ 
                              ...formData, 
                              estadoCivil: value as "Solteiro" | "Casado" | "Divorciado" | "Viúvo" | "União Estável" 
                            })
                          }
                          placeholder="Selecione..."
                          sx={{ borderRadius: 'md' }}
                        >
                          <Option value="Solteiro">Solteiro(a)</Option>
                          <Option value="Casado">Casado(a)</Option>
                          <Option value="Divorciado">Divorciado(a)</Option>
                          <Option value="Viúvo">Viúvo(a)</Option>
                          <Option value="União Estável">União Estável</Option>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{ mt: 2 }}>
                      <FormControl>
                        <FormLabel>Observações</FormLabel>
                        <Textarea
                          name="observacoes"
                          value={formData.observacoes || ''}
                          onChange={handleChange}
                          minRows={3}
                          placeholder="Observações adicionais sobre o cliente..."
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                ) : (
                  // Campos para Pessoa Jurídica
                  <>
                    <Grid xs={12} md={6}>
                      <FormControl error={!!errors.razaoSocial}>
                        <FormLabel>Razão Social</FormLabel>
                        <Input
                          name="razaoSocial"
                          value={formData.razaoSocial || ''}
                          onChange={handleChange}
                          placeholder="Razão Social"
                          sx={{ borderRadius: 'md' }}
                        />
                        {errors.razaoSocial && (
                          <FormHelperText>{errors.razaoSocial}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl>
                        <FormLabel>Nome Fantasia</FormLabel>
                        <Input
                          name="nome"
                          value={formData.nome || ''}
                          onChange={handleChange}
                          placeholder="Nome Fantasia"
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={8}>
                      <FormControl error={!!errors.cnpj}>
                        <FormLabel>CNPJ</FormLabel>
                        <Input
                          name="cnpj"
                          value={formData.cnpj || ''}
                          onChange={handleChange}
                          placeholder="00.000.000/0000-00"
                          sx={{ borderRadius: 'md' }}
                        />
                        {errors.cnpj && (
                          <FormHelperText>{errors.cnpj}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={4}>
                      <FormControl>
                        <FormLabel>Número Mínimo de Assinaturas</FormLabel>
                        <Input
                          name="numeroMinimoAssinaturas"
                          type="number"
                          value={formData.numeroMinimoAssinaturas?.toString() || ''}
                          onChange={handleChange}
                          placeholder="1"
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                    <Grid xs={12} sx={{ mt: 2 }}>
                      <FormControl>
                        <FormLabel>Observações</FormLabel>
                        <Textarea
                          name="observacoes"
                          value={formData.observacoes || ''}
                          onChange={handleChange}
                          minRows={3}
                          placeholder="Observações adicionais sobre o cliente..."
                          sx={{ borderRadius: 'md' }}
                        />
                      </FormControl>
                    </Grid>
                  </>
                )}
              </Grid>
            </TabPanel>
            
            <TabPanel value="endereco" sx={{ p: 0 }}>
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <FormControl>
                    <FormLabel>CEP</FormLabel>
                    <Input
                      name="cep"
                      value={formData.endereco?.cep || ''}
                      onChange={handleEnderecoChange}
                      placeholder="00000-000"
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl>
                    <FormLabel>Estado</FormLabel>
                    <Input
                      name="estado"
                      value={formData.endereco?.estado || ''}
                      onChange={handleEnderecoChange}
                      placeholder="Estado"
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl>
                    <FormLabel>Cidade</FormLabel>
                    <Input
                      name="cidade"
                      value={formData.endereco?.cidade || ''}
                      onChange={handleEnderecoChange}
                      placeholder="Cidade"
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Bairro</FormLabel>
                    <Input
                      name="bairro"
                      value={formData.endereco?.bairro || ''}
                      onChange={handleEnderecoChange}
                      placeholder="Bairro"
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Logradouro</FormLabel>
                    <Input
                      name="logradouro"
                      value={formData.endereco?.logradouro || ''}
                      onChange={handleEnderecoChange}
                      placeholder="Rua, Avenida, etc."
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12}>
                  <FormControl>
                    <FormLabel>Complemento</FormLabel>
                    <Input
                      name="complemento"
                      value={formData.endereco?.complemento || ''}
                      onChange={handleEnderecoChange}
                      placeholder="Complemento"
                      sx={{ borderRadius: 'md' }}
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </TabPanel>
            
            {isPF && (
              <TabPanel value="conjuge" sx={{ p: 0 }}>
                <Grid container spacing={2}>
                  <Grid xs={12}>
                    <FormControl>
                      <FormLabel>Nome do Cônjuge</FormLabel>
                      <Input
                        name="nome"
                        value={formData.conjuge?.nome || ''}
                        onChange={handleConjugeChange}
                        placeholder="Nome completo"
                        sx={{ borderRadius: 'md' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <FormControl>
                      <FormLabel>CPF do Cônjuge</FormLabel>
                      <Input
                        name="cpf"
                        value={formData.conjuge?.cpf || ''}
                        onChange={handleConjugeChange}
                        placeholder="000.000.000-00"
                        sx={{ borderRadius: 'md' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <FormControl>
                      <FormLabel>RG do Cônjuge</FormLabel>
                      <Input
                        name="rg"
                        value={formData.conjuge?.rg || ''}
                        onChange={handleConjugeChange}
                        placeholder="00.000.000-0"
                        sx={{ borderRadius: 'md' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <FormControl>
                      <FormLabel>Data de Nascimento</FormLabel>
                      <Input
                        name="dataNascimento"
                        value={formData.conjuge?.dataNascimento || ''}
                        onChange={handleConjugeChange}
                        placeholder="DD/MM/AAAA"
                        sx={{ borderRadius: 'md' }}
                      />
                    </FormControl>
                  </Grid>
                  <Grid xs={12} md={6}>
                    <FormControl>
                      <FormLabel>Nacionalidade</FormLabel>
                      <Input
                        name="nacionalidade"
                        value={formData.conjuge?.nacionalidade || ''}
                        onChange={handleConjugeChange}
                        placeholder="Nacionalidade"
                        sx={{ borderRadius: 'md' }}
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </TabPanel>
            )}
            
            {!isPF && (
              <TabPanel value="socios" sx={{ p: 0 }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                  <Typography level="title-md">Sócios</Typography>
                  <Button
                    startDecorator={<AddIcon />}
                    onClick={handleAddSocio}
                    color="primary"
                    variant="soft"
                    size="sm"
                  >
                    Adicionar Sócio
                  </Button>
                </Stack>
                
                {socios.length === 0 ? (
                  <Alert 
                    color="neutral" 
                    variant="soft" 
                    sx={{ 
                      mb: 2, 
                      borderRadius: 'md',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      p: 3,
                      textAlign: 'center'
                    }}
                  >
                    Nenhum sócio cadastrado. Clique em "Adicionar Sócio" para incluir.
                  </Alert>
                ) : (
                  <Stack spacing={2}>
                    {socios.map((socio, index) => (
                      <Card 
                        key={socio.id} 
                        variant="outlined" 
                        sx={{ 
                          p: 2, 
                          borderRadius: 'lg',
                          transition: 'all 0.2s',
                          ':hover': {
                            borderColor: 'primary.300',
                            boxShadow: '0 0 0 1px var(--joy-palette-primary-300)'
                          }
                        }}
                      >
                        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                          <Typography level="title-sm" startDecorator={<PersonIcon fontSize="small" />}>
                            Sócio {index + 1}
                          </Typography>
                          <IconButton
                            color="danger"
                            variant="plain"
                            onClick={() => handleRemoveSocio(socio.id!)}
                            size="sm"
                          >
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Stack>
                        
                        <Grid container spacing={2}>
                          <Grid xs={12}>
                            <FormControl>
                              <FormLabel>Nome</FormLabel>
                              <Input
                                value={socio.nome || ''}
                                onChange={(e) => handleSocioChange(socio.id!, 'nome', e.target.value)}
                                placeholder="Nome completo"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>CPF</FormLabel>
                              <Input
                                value={socio.cpf || ''}
                                onChange={(e) => handleSocioChange(socio.id!, 'cpf', e.target.value)}
                                placeholder="000.000.000-00"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>RG</FormLabel>
                              <Input
                                value={socio.rg || ''}
                                onChange={(e) => handleSocioChange(socio.id!, 'rg', e.target.value)}
                                placeholder="00.000.000-0"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12}>
                            <FormControl>
                              <FormLabel>É administrador?</FormLabel>
                              <RadioGroup
                                orientation="horizontal"
                                value={socio.administrador ? 'sim' : 'nao'}
                                onChange={(e) => handleSocioChange(
                                  socio.id!,
                                  'administrador',
                                  e.target.value === 'sim'
                                )}
                                sx={{ gap: 2, mt: 1 }}
                              >
                                <Radio 
                                  value="sim" 
                                  label="Sim" 
                                  slotProps={{ input: { 'aria-label': 'Sim' } }}
                                  variant="outlined"
                                />
                                <Radio 
                                  value="nao" 
                                  label="Não" 
                                  slotProps={{ input: { 'aria-label': 'Não' } }}
                                  variant="outlined"
                                />
                              </RadioGroup>
                            </FormControl>
                          </Grid>
                          
                          <Grid xs={12}>
                            <Divider sx={{ my: 2 }}>
                              <Chip size="sm" variant="soft">Endereço do Sócio</Chip>
                            </Divider>
                          </Grid>
                          
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>CEP</FormLabel>
                              <Input
                                value={socio.endereco?.cep || ''}
                                onChange={(e) => handleSocioEnderecoChange(socio.id!, 'cep', e.target.value)}
                                placeholder="00000-000"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>Estado</FormLabel>
                              <Input
                                value={socio.endereco?.estado || ''}
                                onChange={(e) => handleSocioEnderecoChange(socio.id!, 'estado', e.target.value)}
                                placeholder="Estado"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>Cidade</FormLabel>
                              <Input
                                value={socio.endereco?.cidade || ''}
                                onChange={(e) => handleSocioEnderecoChange(socio.id!, 'cidade', e.target.value)}
                                placeholder="Cidade"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12} md={6}>
                            <FormControl>
                              <FormLabel>Bairro</FormLabel>
                              <Input
                                value={socio.endereco?.bairro || ''}
                                onChange={(e) => handleSocioEnderecoChange(socio.id!, 'bairro', e.target.value)}
                                placeholder="Bairro"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                          <Grid xs={12}>
                            <FormControl>
                              <FormLabel>Logradouro</FormLabel>
                              <Input
                                value={socio.endereco?.logradouro || ''}
                                onChange={(e) => handleSocioEnderecoChange(socio.id!, 'logradouro', e.target.value)}
                                placeholder="Logradouro"
                                sx={{ borderRadius: 'md' }}
                              />
                            </FormControl>
                          </Grid>
                        </Grid>
                      </Card>
                    ))}
                  </Stack>
                )}
              </TabPanel>
            )}
            
            <TabPanel value="documentos" sx={{ p: 0 }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 2 }}>
                <Typography level="title-md">Documentos</Typography>
                <Button
                  startDecorator={<UploadFileIcon />}
                  onClick={handleDocumentoUpload}
                  color="primary"
                  variant="soft"
                  size="sm"
                >
                  Adicionar Documento
                </Button>
              </Stack>
              
              {(!formData.documentos || formData.documentos.length === 0) ? (
                <Alert 
                  color="neutral" 
                  variant="soft" 
                  sx={{ 
                    mb: 2, 
                    borderRadius: 'md',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    p: 3,
                    textAlign: 'center'
                  }}
                >
                  Nenhum documento anexado. Clique em "Adicionar Documento" para incluir.
                </Alert>
              ) : (
                <Stack spacing={1}>
                  {formData.documentos.map((doc) => (
                    <Card 
                      key={doc.id} 
                      variant="outlined" 
                      sx={{ 
                        p: 1.5, 
                        borderRadius: 'md',
                        transition: 'all 0.2s',
                        ':hover': {
                          borderColor: 'primary.300',
                          bgcolor: 'background.level1'
                        }
                      }}
                    >
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Box sx={{ 
                          color: 'primary.500', 
                          bgcolor: 'primary.50', 
                          borderRadius: '50%',
                          width: 36,
                          height: 36,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}>
                          {doc.tipo.includes('pdf') ? (
                            <PictureAsPdfIcon />
                          ) : doc.tipo.includes('image') ? (
                            <ImageIcon />
                          ) : (
                            <InsertDriveFileIcon />
                          )}
                        </Box>
                        <Box sx={{ flex: 1 }}>
                          <Typography level="body-sm" fontWeight="medium">{doc.nome}</Typography>
                          <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                            Adicionado em {doc.dataUpload}
                          </Typography>
                        </Box>
                        <IconButton
                          color="danger"
                          variant="plain"
                          onClick={() => handleRemoveDocumento(doc.id)}
                          size="sm"
                        >
                          <DeleteIcon fontSize="small" />
                        </IconButton>
                      </Stack>
                    </Card>
                  ))}
                </Stack>
              )}
            </TabPanel>
          </Box>
        </Tabs>
      </Box>
      
      {/* Ações no rodapé - no footer do formulário */}
      <Box
        sx={{ 
          position: 'sticky',
          bottom: 0,
          zIndex: 10,
          py: 1.5,
          mx: -3, 
          px: 3, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          backgroundColor: 'background.surface',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          width: 'auto',
          height: 65,
          mt: 0
        }}
      >
        <Button
          variant="outlined"
          color="neutral"
          startDecorator={<CancelIcon />}
          onClick={onCancel}
        >
          Cancelar
        </Button>
        <Button
          variant="solid"
          color="primary"
          startDecorator={<SaveIcon />}
          onClick={handleSave}
        >
          {isCreating ? 'Cadastrar' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
} 