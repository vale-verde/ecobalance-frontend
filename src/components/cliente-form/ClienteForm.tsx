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
import NacionalidadeSelector, { CountryType } from './NacionalidadeSelector';
import { customScrollbarStyle } from '../../utils';

/**
 * Props para o componente de formulário de cliente
 */
type ClienteFormProps = {
  cliente?: Cliente;
  isCreating?: boolean;
  onSave: (cliente: Cliente) => void;
  onCancel: () => void;
};

/**
 * Tipo para armazenar erros de validação do formulário
 */
type FormErrors = {
  [key: string]: string;
};

/**
 * Componente de formulário para cadastro e edição de clientes
 * 
 * Permite o gerenciamento completo de informações do cliente, incluindo
 * dados pessoais, endereço, documentos e sócios (para pessoa jurídica)
 */
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
  
  /**
   * Atualiza o estado do formulário quando um campo é alterado
   */
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
  
  /**
   * Atualiza os campos de endereço no formulário
   */
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
  
  /**
   * Atualiza os campos do cônjuge para pessoa física
   */
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
  
  /**
   * Altera o tipo de cliente entre pessoa física e jurídica,
   * resetando os campos específicos de cada tipo
   */
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
  
  /**
   * Adiciona um novo sócio à lista (apenas para pessoa jurídica)
   */
  const handleAddSocio = () => {
    const newSocio: Partial<Socio> = {
      id: `socio-${Date.now()}`,
      nome: '',
      cpf: '',
      administrador: false
    };
    setSocios([...socios, newSocio]);
  };
  
  /**
   * Remove um sócio da lista pelo ID
   */
  const handleRemoveSocio = (id: string) => {
    setSocios(socios.filter((socio) => socio.id !== id));
  };
  
  /**
   * Atualiza os dados de um sócio específico
   */
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
  
  /**
   * Atualiza o endereço de um sócio específico
   */
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
  
  /**
   * Simula o upload de um novo documento para o cliente
   * (Funcionalidade simplificada para demonstração)
   */
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
  
  /**
   * Remove um documento do cliente pelo ID
   */
  const handleRemoveDocumento = (id: string) => {
    setFormData((prev) => ({
      ...prev,
      documentos: prev.documentos?.filter((doc) => doc.id !== id)
    }));
  };
  
  /**
   * Valida os campos do formulário conforme o tipo de cliente
   * Retorna true se todos os campos obrigatórios estiverem preenchidos
   */
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
  
  /**
   * Salva o cliente após validação dos campos
   * Inclui sócios apenas se for pessoa jurídica
   */
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
  
  const countries = [
    { code: 'AD', label: 'Andorra', phone: '376' },
    { code: 'AE', label: 'United Arab Emirates', phone: '971' },
    { code: 'AF', label: 'Afghanistan', phone: '93' },
    { code: 'AG', label: 'Antigua and Barbuda', phone: '1-268' },
    { code: 'AI', label: 'Anguilla', phone: '1-264' },
    { code: 'AL', label: 'Albania', phone: '355' },
    { code: 'AM', label: 'Armenia', phone: '374' },
    { code: 'AO', label: 'Angola', phone: '244' },
    { code: 'AR', label: 'Argentina', phone: '54' },
    { code: 'AT', label: 'Austria', phone: '43' },
    { code: 'AU', label: 'Australia', phone: '61' },
    { code: 'AZ', label: 'Azerbaijan', phone: '994' },
    { code: 'BA', label: 'Bosnia and Herzegovina', phone: '387' },
    { code: 'BB', label: 'Barbados', phone: '1-246' },
    { code: 'BD', label: 'Bangladesh', phone: '880' },
    { code: 'BE', label: 'Belgium', phone: '32' },
    { code: 'BF', label: 'Burkina Faso', phone: '226' },
    { code: 'BG', label: 'Bulgaria', phone: '359' },
    { code: 'BH', label: 'Bahrain', phone: '973' },
    { code: 'BI', label: 'Burundi', phone: '257' },
    { code: 'BJ', label: 'Benin', phone: '229' },
    { code: 'BO', label: 'Bolivia', phone: '591' },
    { code: 'BR', label: 'Brazil', phone: '55' },
    { code: 'BS', label: 'Bahamas', phone: '1-242' },
    { code: 'BT', label: 'Bhutan', phone: '975' },
    { code: 'BW', label: 'Botswana', phone: '267' },
    { code: 'BY', label: 'Belarus', phone: '375' },
    { code: 'BZ', label: 'Belize', phone: '501' },
    { code: 'CA', label: 'Canada', phone: '1' },
    { code: 'CD', label: 'Congo, Democratic Republic of the', phone: '243' },
    { code: 'CF', label: 'Central African Republic', phone: '236' },
    { code: 'CG', label: 'Congo, Republic of the', phone: '242' },
    { code: 'CH', label: 'Switzerland', phone: '41' },
    { code: 'CI', label: "Cote d'Ivoire", phone: '225' },
    { code: 'CL', label: 'Chile', phone: '56' },
    { code: 'CM', label: 'Cameroon', phone: '237' },
    { code: 'CN', label: 'China', phone: '86' },
    { code: 'CO', label: 'Colombia', phone: '57' },
    { code: 'CR', label: 'Costa Rica', phone: '506' },
    { code: 'CU', label: 'Cuba', phone: '53' },
    { code: 'CV', label: 'Cape Verde', phone: '238' },
    { code: 'CY', label: 'Cyprus', phone: '357' },
    { code: 'CZ', label: 'Czech Republic', phone: '420' },
    { code: 'DE', label: 'Germany', phone: '49' },
    { code: 'DJ', label: 'Djibouti', phone: '253' },
    { code: 'DK', label: 'Denmark', phone: '45' },
    { code: 'DM', label: 'Dominica', phone: '1-767' },
    { code: 'DO', label: 'Dominican Republic', phone: '1-809' },
    { code: 'DZ', label: 'Algeria', phone: '213' },
    { code: 'EC', label: 'Ecuador', phone: '593' },
    { code: 'EE', label: 'Estonia', phone: '372' },
    { code: 'EG', label: 'Egypt', phone: '20' },
    { code: 'ER', label: 'Eritrea', phone: '291' },
    { code: 'ES', label: 'Spain', phone: '34' },
    { code: 'ET', label: 'Ethiopia', phone: '251' },
    { code: 'FI', label: 'Finland', phone: '358' },
    { code: 'FJ', label: 'Fiji', phone: '679' },
    { code: 'FM', label: 'Micronesia, Federated States of', phone: '691' },
    { code: 'FR', label: 'France', phone: '33' },
    { code: 'GA', label: 'Gabon', phone: '241' },
    { code: 'GB', label: 'United Kingdom', phone: '44' },
    { code: 'GD', label: 'Grenada', phone: '1-473' },
    { code: 'GE', label: 'Georgia', phone: '995' },
    { code: 'GH', label: 'Ghana', phone: '233' },
    { code: 'GM', label: 'Gambia', phone: '220' },
    { code: 'GN', label: 'Guinea', phone: '224' },
    { code: 'GQ', label: 'Equatorial Guinea', phone: '240' },
    { code: 'GR', label: 'Greece', phone: '30' },
    { code: 'GT', label: 'Guatemala', phone: '502' },
    { code: 'GW', label: 'Guinea-Bissau', phone: '245' },
    { code: 'GY', label: 'Guyana', phone: '592' },
    { code: 'HK', label: 'Hong Kong', phone: '852' },
    { code: 'HN', label: 'Honduras', phone: '504' },
    { code: 'HR', label: 'Croatia', phone: '385' },
    { code: 'HT', label: 'Haiti', phone: '509' },
    { code: 'HU', label: 'Hungary', phone: '36' },
    { code: 'ID', label: 'Indonesia', phone: '62' },
    { code: 'IE', label: 'Ireland', phone: '353' },
    { code: 'IL', label: 'Israel', phone: '972' },
    { code: 'IN', label: 'India', phone: '91' },
    { code: 'IQ', label: 'Iraq', phone: '964' },
    { code: 'IR', label: 'Iran, Islamic Republic of', phone: '98' },
    { code: 'IS', label: 'Iceland', phone: '354' },
    { code: 'IT', label: 'Italy', phone: '39' },
    { code: 'JM', label: 'Jamaica', phone: '1-876' },
    { code: 'JO', label: 'Jordan', phone: '962' },
    { code: 'JP', label: 'Japan', phone: '81' },
    { code: 'KE', label: 'Kenya', phone: '254' },
    { code: 'KG', label: 'Kyrgyzstan', phone: '996' },
    { code: 'KH', label: 'Cambodia', phone: '855' },
    { code: 'KI', label: 'Kiribati', phone: '686' },
    { code: 'KM', label: 'Comoros', phone: '269' },
    { code: 'KR', label: 'Korea, Republic of', phone: '82' },
    { code: 'KW', label: 'Kuwait', phone: '965' },
    { code: 'KZ', label: 'Kazakhstan', phone: '7' },
    { code: 'LA', label: "Lao People's Democratic Republic", phone: '856' },
    { code: 'LB', label: 'Lebanon', phone: '961' },
    { code: 'LC', label: 'Saint Lucia', phone: '1-758' },
    { code: 'LI', label: 'Liechtenstein', phone: '423' },
    { code: 'LK', label: 'Sri Lanka', phone: '94' },
    { code: 'LR', label: 'Liberia', phone: '231' },
    { code: 'LS', label: 'Lesotho', phone: '266' },
    { code: 'LT', label: 'Lithuania', phone: '370' },
    { code: 'LU', label: 'Luxembourg', phone: '352' },
    { code: 'LV', label: 'Latvia', phone: '371' },
    { code: 'LY', label: 'Libya', phone: '218' },
    { code: 'MA', label: 'Morocco', phone: '212' },
    { code: 'MC', label: 'Monaco', phone: '377' },
    { code: 'MD', label: 'Moldova, Republic of', phone: '373' },
    { code: 'ME', label: 'Montenegro', phone: '382' },
    { code: 'MG', label: 'Madagascar', phone: '261' },
    { code: 'MH', label: 'Marshall Islands', phone: '692' },
    { code: 'MK', label: 'Macedonia, the Former Yugoslav Republic of', phone: '389' },
    { code: 'ML', label: 'Mali', phone: '223' },
    { code: 'MM', label: 'Myanmar', phone: '95' },
    { code: 'MN', label: 'Mongolia', phone: '976' },
    { code: 'MO', label: 'Macao', phone: '853' },
    { code: 'MR', label: 'Mauritania', phone: '222' },
    { code: 'MT', label: 'Malta', phone: '356' },
    { code: 'MU', label: 'Mauritius', phone: '230' },
    { code: 'MV', label: 'Maldives', phone: '960' },
    { code: 'MW', label: 'Malawi', phone: '265' },
    { code: 'MX', label: 'Mexico', phone: '52' },
    { code: 'MY', label: 'Malaysia', phone: '60' },
    { code: 'MZ', label: 'Mozambique', phone: '258' },
    { code: 'NA', label: 'Namibia', phone: '264' },
    { code: 'NE', label: 'Niger', phone: '227' },
    { code: 'NG', label: 'Nigeria', phone: '234' },
    { code: 'NI', label: 'Nicaragua', phone: '505' },
    { code: 'NL', label: 'Netherlands', phone: '31' },
    { code: 'NO', label: 'Norway', phone: '47' },
    { code: 'NP', label: 'Nepal', phone: '977' },
    { code: 'NR', label: 'Nauru', phone: '674' },
    { code: 'NZ', label: 'New Zealand', phone: '64' },
    { code: 'OM', label: 'Oman', phone: '968' },
    { code: 'PA', label: 'Panama', phone: '507' },
    { code: 'PE', label: 'Peru', phone: '51' },
    { code: 'PG', label: 'Papua New Guinea', phone: '675' },
    { code: 'PH', label: 'Philippines', phone: '63' },
    { code: 'PK', label: 'Pakistan', phone: '92' },
    { code: 'PL', label: 'Poland', phone: '48' },
    { code: 'PT', label: 'Portugal', phone: '351' },
    { code: 'PW', label: 'Palau', phone: '680' },
    { code: 'PY', label: 'Paraguay', phone: '595' },
    { code: 'QA', label: 'Qatar', phone: '974' },
    { code: 'RO', label: 'Romania', phone: '40' },
    { code: 'RS', label: 'Serbia', phone: '381' },
    { code: 'RU', label: 'Russian Federation', phone: '7' },
    { code: 'RW', label: 'Rwanda', phone: '250' },
    { code: 'SA', label: 'Saudi Arabia', phone: '966' },
    { code: 'SB', label: 'Solomon Islands', phone: '677' },
    { code: 'SC', label: 'Seychelles', phone: '248' },
    { code: 'SD', label: 'Sudan', phone: '249' },
    { code: 'SE', label: 'Sweden', phone: '46' },
    { code: 'SG', label: 'Singapore', phone: '65' },
    { code: 'SI', label: 'Slovenia', phone: '386' },
    { code: 'SK', label: 'Slovakia', phone: '421' },
    { code: 'SL', label: 'Sierra Leone', phone: '232' },
    { code: 'SM', label: 'San Marino', phone: '378' },
    { code: 'SN', label: 'Senegal', phone: '221' },
    { code: 'SO', label: 'Somalia', phone: '252' },
    { code: 'SR', label: 'Suriname', phone: '597' },
    { code: 'ST', label: 'Sao Tome and Principe', phone: '239' },
    { code: 'SV', label: 'El Salvador', phone: '503' },
    { code: 'SY', label: 'Syrian Arab Republic', phone: '963' },
    { code: 'SZ', label: 'Swaziland', phone: '268' },
    { code: 'TD', label: 'Chad', phone: '235' },
    { code: 'TG', label: 'Togo', phone: '228' },
    { code: 'TH', label: 'Thailand', phone: '66' },
    { code: 'TJ', label: 'Tajikistan', phone: '992' },
    { code: 'TL', label: 'Timor-Leste', phone: '670' },
    { code: 'TM', label: 'Turkmenistan', phone: '993' },
    { code: 'TN', label: 'Tunisia', phone: '216' },
    { code: 'TO', label: 'Tonga', phone: '676' },
    { code: 'TR', label: 'Turkey', phone: '90' },
    { code: 'TT', label: 'Trinidad and Tobago', phone: '1-868' },
    { code: 'TV', label: 'Tuvalu', phone: '688' },
    { code: 'TW', label: 'Taiwan', phone: '886' },
    { code: 'TZ', label: 'United Republic of Tanzania', phone: '255' },
    { code: 'UA', label: 'Ukraine', phone: '380' },
    { code: 'UG', label: 'Uganda', phone: '256' },
    { code: 'US', label: 'United States', phone: '1' },
    { code: 'UY', label: 'Uruguay', phone: '598' },
    { code: 'UZ', label: 'Uzbekistan', phone: '998' },
    { code: 'VA', label: 'Holy See (Vatican City State)', phone: '379' },
    { code: 'VC', label: 'Saint Vincent and the Grenadines', phone: '1-784' },
    { code: 'VE', label: 'Venezuela', phone: '58' },
    { code: 'VN', label: 'Vietnam', phone: '84' },
    { code: 'VU', label: 'Vanuatu', phone: '678' },
    { code: 'WS', label: 'Samoa', phone: '685' },
    { code: 'XK', label: 'Kosovo', phone: '383' },
    { code: 'YE', label: 'Yemen', phone: '967' },
    { code: 'ZA', label: 'South Africa', phone: '27' },
    { code: 'ZM', label: 'Zambia', phone: '260' },
    { code: 'ZW', label: 'Zimbabwe', phone: '263' },
  ];

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative',
      overflow: 'auto',
      ...customScrollbarStyle
    }}>
      {/* Cabeçalho do Formulário */}
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3, pt: 1 }}>
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
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          backgroundColor: 'background.surface',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            variant={isPF ? "solid" : "plain"}
            color="primary"
            startDecorator={<PersonIcon />}
            onClick={() => handleTipoClienteChange({ target: { value: 'PF' } } as React.ChangeEvent<HTMLInputElement>)}
            sx={{ 
              borderRadius: 'md', 
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: '0.875rem',
              opacity: isPF ? 1 : 0.7,
              '&:hover': {
                borderRadius: 'md',
              }
            }}
          >
            Pessoa Física
          </Button>
          <Button
            variant={!isPF ? "solid" : "plain"}
            color="primary"
            startDecorator={<BusinessIcon />}
            onClick={() => handleTipoClienteChange({ target: { value: 'PJ' } } as React.ChangeEvent<HTMLInputElement>)}
            sx={{ 
              borderRadius: 'md', 
              px: 2,
              py: 1,
              fontWeight: 600,
              fontSize: '0.875rem',
              opacity: !isPF ? 1 : 0.7,
              '&:hover': {
                borderRadius: 'md',
              }
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
        boxShadow: 'none',
        backgroundColor: 'background.surface',
        mb: 3
      }}>
        {/* Abas integradas com conteúdo */}
        <Tabs value={activeTab} onChange={(_, value) => setActiveTab(value as string)} sx={{ height: '100%', bgcolor: 'transparent' }}>
          <TabList 
            tabFlex={1}
            size="sm"
            sx={{ 
              px: 2,
              pt: 2,
              justifyContent: 'left',
              borderBottom: '1px solid',
              borderColor: 'divider',
              gap: 1,
              '& .MuiTab-root': {
                fontWeight: '600',
                flex: 'initial',
                color: 'text.tertiary',
                borderRadius: '6px 6px 0 0',
                '&.Mui-selected': {
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
              value="dados-principais" 
              indicatorInset
              sx={{ borderRadius: '6px 6px 0 0' }}
            >
              Dados Principais
            </Tab>
            <Tab 
              value="endereco" 
              indicatorInset
              sx={{ borderRadius: '6px 6px 0 0' }}
            >
              Endereço
            </Tab>
            {/* Adicionar tab de cônjuge quando for PF e casado */}
            {isPF && formData.estadoCivil === "Casado" && (
              <Tab 
                value="conjuge" 
                indicatorInset
                sx={{ borderRadius: '6px 6px 0 0' }}
              >
                Cônjuge
              </Tab>
            )}
            {/* Para PJ também inclui aba de sócios */}
            {!isPF && (
              <Tab 
                value="socios" 
                indicatorInset
                sx={{ borderRadius: '6px 6px 0 0' }}
              >
                Sócios
              </Tab>
            )}
            <Tab 
              value="documentos" 
              indicatorInset
              sx={{ borderRadius: '6px 6px 0 0' }}
            >
              Documentos
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
                      <NacionalidadeSelector 
                        value={
                          formData.nacionalidade 
                            ? countries.find(country => country.label === formData.nacionalidade) 
                            : undefined
                        }
                        onChange={(newValue) => {
                          setFormData((prev) => ({
                            ...prev,
                            nacionalidade: newValue?.label || ''
                          }));
                        }}
                        error={!!errors.nacionalidade}
                        name="nacionalidade"
                      />
                      {errors.nacionalidade && (
                        <FormHelperText>{errors.nacionalidade}</FormHelperText>
                      )}
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
                              estadoCivil: value as "Solteiro" | "Casado" | "Viúvo" | "Divorciado" | "União Estável"
                            })
                          }
                          placeholder="Selecione..."
                          variant="outlined"
                          sx={{ 
                            borderRadius: 'md',
                            width: '100%',
                            minHeight: '36px'
                          }}
                        >
                          <Option value="Solteiro">Solteiro(a)</Option>
                          <Option value="Casado">Casado(a)</Option>
                          <Option value="Viúvo">Viúvo(a)</Option>
                          <Option value="Divorciado">Divorciado(a)</Option>
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
          left: 0,
          right: 0,
          zIndex: 10,
          py: 1.5,
          px: 3, 
          display: 'flex', 
          justifyContent: 'flex-end', 
          gap: 2,
          backgroundColor: 'background.surface',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          width: '100%',
          height: 65,
          marginLeft: 0,
          marginRight: 0,
          boxSizing: 'border-box',
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
          {isCreating ? 'Cadastrar' : 'Salvar'}
        </Button>
      </Box>
    </Box>
  );
} 