import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Grid from '@mui/joy/Grid';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Switch from '@mui/joy/Switch';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import IconButton from '@mui/joy/IconButton';
import Snackbar from '@mui/joy/Snackbar';
import Alert from '@mui/joy/Alert';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SettingsIcon from '@mui/icons-material/Settings';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';
import SaveIcon from '@mui/icons-material/Save';
import BusinessIcon from '@mui/icons-material/Business';
import StorageIcon from '@mui/icons-material/Storage';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PersonIcon from '@mui/icons-material/Person';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

import { SystemSettings, rolePermissions } from '../data/usuarios';
import { getSystemSettings, updateSystemSettings } from '../services/usuarioService';

/**
 * Página de configurações do sistema
 */
export default function ConfiguracoesPage() {
  // Estado para as configurações do sistema
  const [settings, setSettings] = React.useState<SystemSettings>({
    general: {
      companyName: '',
      supportEmail: '',
      timezone: '',
    },
    security: {
      passwordMinLength: 8,
      passwordExpiration: 90,
      twoFactorAuth: false,
      sessionTimeout: 30,
    },
    email: {
      smtpServer: '',
      smtpPort: 587,
      senderEmail: '',
      requireAuth: true,
    },
    limits: {
      maxUsers: 100,
      maxProjects: 500,
      storageLimit: 50,
    }
  });
  
  // Estado para acompanhar se os campos foram alterados
  const [hasChanges, setHasChanges] = React.useState(false);
  
  // Estado para o formulário de teste de email
  const [testEmail, setTestEmail] = React.useState('');
  
  // Estado para snackbar
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    color: 'success' | 'danger' | 'warning' | 'neutral';
  }>({
    open: false,
    message: '',
    color: 'success',
  });
  
  // Carregar configurações ao montar o componente
  React.useEffect(() => {
    const loadSettings = async () => {
      try {
        const systemSettings = await getSystemSettings();
        setSettings(systemSettings);
      } catch (error) {
        console.error('Error loading settings:', error);
        setSnackbar({
          open: true,
          message: 'Erro ao carregar configurações.',
          color: 'danger',
        });
      }
    };
    
    loadSettings();
  }, []);
  
  // Manipular mudanças nos campos de entrada
  const handleInputChange = (
    section: keyof SystemSettings,
    field: string,
    value: string | number | boolean
  ) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
    setHasChanges(true);
  };
  
  // Salvar configurações
  const handleSaveSettings = async () => {
    try {
      await updateSystemSettings(settings);
      setSnackbar({
        open: true,
        message: 'Configurações salvas com sucesso!',
        color: 'success',
      });
      setHasChanges(false);
    } catch (error) {
      console.error('Error saving settings:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao salvar configurações.',
        color: 'danger',
      });
    }
  };
  
  // Enviar email de teste
  const handleSendTestEmail = () => {
    // Em um sistema real, aqui chamaríamos a API
    setSnackbar({
      open: true,
      message: `Email de teste enviado para: ${testEmail}`,
      color: 'success',
    });
  };
  
  return (
    <Box
      component="main"
      className="MainContent"
      sx={{
        px: { xs: 2, md: 6 },
        pt: {
          xs: 'calc(12px + var(--Header-height))',
          sm: 'calc(12px + var(--Header-height))',
          md: 3,
        },
        pb: { xs: 2, sm: 2, md: 3 },
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        minWidth: 0,
        height: '100dvh',
        gap: 1,
      }}
    >
      {/* Breadcrumbs */}
      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Breadcrumbs
          size="sm"
          aria-label="breadcrumbs"
          separator={<ChevronRightRoundedIcon fontSize="small" />}
          sx={{ pl: 0 }}
        >
          <Link
            underline="none"
            color="neutral"
            href="#home"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Typography color="primary" fontWeight="500" fontSize="12px">
            Configurações
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Cabeçalho da página */}
      <Box
        sx={{
          display: 'flex',
          mb: 1,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Typography level="h2" component="h1" startDecorator={<SettingsIcon />}>
          Configurações do Sistema
        </Typography>
        
        <Button
          size="sm"
          color="primary"
          startDecorator={<SaveIcon />}
          onClick={handleSaveSettings}
          disabled={!hasChanges}
        >
          Salvar Configurações
        </Button>
      </Box>
      
      {/* Alert indicando a função da página */}
      <Alert
        variant="soft"
        color="neutral"
        sx={{ mb: 2 }}
        startDecorator={<InfoOutlinedIcon />}
      >
        Estas configurações afetam todo o sistema e só estão disponíveis para administradores.
      </Alert>
      
      {/* Tabs para organização das configurações */}
      <Tabs aria-label="Configurações" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
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
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>Geral</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>Segurança</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>Email</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={3}>Limites & Cotas</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={4}>Funções & Permissões</Tab>
        </TabList>
        
        {/* Configurações Gerais */}
        <TabPanel value={0} sx={{ p: 0, pt: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
            }}
          >
            <Typography
              level="title-md"
              startDecorator={<BusinessIcon />}
              sx={{ mb: 3 }}
            >
              Informações da Empresa
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Nome da Empresa</FormLabel>
                  <Input
                    value={settings.general.companyName}
                    onChange={(e) => 
                      handleInputChange('general', 'companyName', e.target.value)
                    }
                  />
                  <FormHelperText>
                    Nome exibido em emails e relatórios
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Email de Suporte</FormLabel>
                  <Input
                    value={settings.general.supportEmail}
                    onChange={(e) => 
                      handleInputChange('general', 'supportEmail', e.target.value)
                    }
                    startDecorator={<EmailIcon />}
                  />
                  <FormHelperText>
                    Email para contato de suporte
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Fuso Horário</FormLabel>
                  <Select
                    value={settings.general.timezone}
                    onChange={(_, value) => 
                      handleInputChange('general', 'timezone', value as string)
                    }
                  >
                    <Option value="America/Sao_Paulo">America/Sao_Paulo (GMT-3)</Option>
                    <Option value="America/New_York">America/New_York (GMT-5/GMT-4)</Option>
                    <Option value="Europe/London">Europe/London (GMT/BST)</Option>
                    <Option value="Europe/Paris">Europe/Paris (GMT+1/GMT+2)</Option>
                  </Select>
                  <FormHelperText>
                    Fuso horário usado para datas e horários
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
          </Sheet>
        </TabPanel>
        
        {/* Configurações de Segurança */}
        <TabPanel value={1} sx={{ p: 0, pt: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
            }}
          >
            <Typography
              level="title-md"
              startDecorator={<SecurityIcon />}
              sx={{ mb: 3 }}
            >
              Segurança
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Comprimento Mínimo da Senha</FormLabel>
                  <Input
                    type="number"
                    value={settings.security.passwordMinLength}
                    onChange={(e) => 
                      handleInputChange('security', 'passwordMinLength', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 6, max: 32 } }}
                  />
                  <FormHelperText>
                    Número mínimo de caracteres para senhas
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Expiração de Senha (dias)</FormLabel>
                  <Input
                    type="number"
                    value={settings.security.passwordExpiration}
                    onChange={(e) => 
                      handleInputChange('security', 'passwordExpiration', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 0, max: 365 } }}
                  />
                  <FormHelperText>
                    Dias até que a senha expire (0 = nunca expira)
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Timeout de Sessão (minutos)</FormLabel>
                  <Input
                    type="number"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => 
                      handleInputChange('security', 'sessionTimeout', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 5, max: 1440 } }}
                  />
                  <FormHelperText>
                    Tempo de inatividade até desconexão automática
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                  <div>
                    <FormLabel>Autenticação de Dois Fatores</FormLabel>
                    <FormHelperText>
                      Requer verificação adicional no login
                    </FormHelperText>
                  </div>
                  <Switch
                    checked={settings.security.twoFactorAuth}
                    onChange={(e) => 
                      handleInputChange('security', 'twoFactorAuth', e.target.checked)
                    }
                  />
                </FormControl>
              </Grid>
            </Grid>
          </Sheet>
        </TabPanel>
        
        {/* Configurações de Email */}
        <TabPanel value={2} sx={{ p: 0, pt: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
            }}
          >
            <Typography
              level="title-md"
              startDecorator={<EmailIcon />}
              sx={{ mb: 3 }}
            >
              Configurações de Email
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Servidor SMTP</FormLabel>
                  <Input
                    value={settings.email.smtpServer}
                    onChange={(e) => 
                      handleInputChange('email', 'smtpServer', e.target.value)
                    }
                    placeholder="smtp.empresa.com.br"
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Porta SMTP</FormLabel>
                  <Input
                    type="number"
                    value={settings.email.smtpPort}
                    onChange={(e) => 
                      handleInputChange('email', 'smtpPort', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 1, max: 65535 } }}
                  />
                  <FormHelperText>
                    Normalmente 25, 465 ou 587
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl>
                  <FormLabel>Email do Remetente</FormLabel>
                  <Input
                    value={settings.email.senderEmail}
                    onChange={(e) => 
                      handleInputChange('email', 'senderEmail', e.target.value)
                    }
                    placeholder="noreply@empresa.com.br"
                    startDecorator={<EmailIcon />}
                  />
                </FormControl>
              </Grid>
              <Grid xs={12} md={6}>
                <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                  <div>
                    <FormLabel>Requer Autenticação</FormLabel>
                    <FormHelperText>
                      Servidor SMTP requer autenticação
                    </FormHelperText>
                  </div>
                  <Switch
                    checked={settings.email.requireAuth}
                    onChange={(e) => 
                      handleInputChange('email', 'requireAuth', e.target.checked)
                    }
                  />
                </FormControl>
              </Grid>
              
              <Grid xs={12}>
                <Divider sx={{ my: 2 }} />
                <Typography level="title-sm" sx={{ mb: 2 }}>
                  Testar Configurações de Email
                </Typography>
                
                <Box
                  sx={{
                    display: 'flex',
                    gap: 1,
                    alignItems: 'flex-end',
                    flexWrap: 'wrap',
                  }}
                >
                  <FormControl sx={{ minWidth: 300, flexGrow: 1 }}>
                    <FormLabel>Email para Teste</FormLabel>
                    <Input
                      value={testEmail}
                      onChange={(e) => setTestEmail(e.target.value)}
                      placeholder="email@exemplo.com.br"
                      startDecorator={<EmailIcon />}
                    />
                  </FormControl>
                  <Button 
                    variant="outlined" 
                    color="neutral"
                    onClick={handleSendTestEmail}
                    disabled={!testEmail || !settings.email.smtpServer}
                  >
                    Enviar Email de Teste
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Sheet>
        </TabPanel>
        
        {/* Configurações de Limites */}
        <TabPanel value={3} sx={{ p: 0, pt: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
            }}
          >
            <Typography
              level="title-md"
              startDecorator={<StorageIcon />}
              sx={{ mb: 3 }}
            >
              Limites e Cotas
            </Typography>
            
            <Grid container spacing={2}>
              <Grid xs={12} md={4}>
                <FormControl>
                  <FormLabel>Máximo de Usuários</FormLabel>
                  <Input
                    type="number"
                    value={settings.limits.maxUsers}
                    onChange={(e) => 
                      handleInputChange('limits', 'maxUsers', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 1, max: 10000 } }}
                    startDecorator={<PeopleAltIcon />}
                  />
                  <FormHelperText>
                    Número máximo de usuários no sistema
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={4}>
                <FormControl>
                  <FormLabel>Máximo de Projetos</FormLabel>
                  <Input
                    type="number"
                    value={settings.limits.maxProjects}
                    onChange={(e) => 
                      handleInputChange('limits', 'maxProjects', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 1, max: 100000 } }}
                  />
                  <FormHelperText>
                    Número máximo de projetos
                  </FormHelperText>
                </FormControl>
              </Grid>
              <Grid xs={12} md={4}>
                <FormControl>
                  <FormLabel>Limite de Armazenamento (GB)</FormLabel>
                  <Input
                    type="number"
                    value={settings.limits.storageLimit}
                    onChange={(e) => 
                      handleInputChange('limits', 'storageLimit', parseInt(e.target.value))
                    }
                    slotProps={{ input: { min: 1, max: 10000 } }}
                  />
                  <FormHelperText>
                    Armazenamento total em gigabytes
                  </FormHelperText>
                </FormControl>
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 4 }}>
              <Typography level="title-sm" sx={{ mb: 2 }}>
                Utilização Atual
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography level="body-xs">Usuários</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                        <Typography level="h3">10</Typography>
                        <Typography level="body-sm">de {settings.limits.maxUsers}</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 'pill',
                          bgcolor: 'neutral.100',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(10 / settings.limits.maxUsers) * 100}%`,
                            bgcolor: 'primary.500',
                          }}
                        />
                      </Box>
                      <Typography level="body-xs" sx={{ mt: 1, textAlign: 'right' }}>
                        10% utilizado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography level="body-xs">Projetos</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                        <Typography level="h3">25</Typography>
                        <Typography level="body-sm">de {settings.limits.maxProjects}</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 'pill',
                          bgcolor: 'neutral.100',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(25 / settings.limits.maxProjects) * 100}%`,
                            bgcolor: 'success.500',
                          }}
                        />
                      </Box>
                      <Typography level="body-xs" sx={{ mt: 1, textAlign: 'right' }}>
                        5% utilizado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
                <Grid xs={12} md={4}>
                  <Card variant="outlined" sx={{ height: '100%' }}>
                    <CardContent sx={{ p: 2 }}>
                      <Typography level="body-xs">Armazenamento</Typography>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', my: 1 }}>
                        <Typography level="h3">8.5 GB</Typography>
                        <Typography level="body-sm">de {settings.limits.storageLimit} GB</Typography>
                      </Box>
                      <Box
                        sx={{
                          height: 10,
                          borderRadius: 'pill',
                          bgcolor: 'neutral.100',
                          overflow: 'hidden',
                        }}
                      >
                        <Box
                          sx={{
                            height: '100%',
                            width: `${(8.5 / settings.limits.storageLimit) * 100}%`,
                            bgcolor: 'warning.500',
                          }}
                        />
                      </Box>
                      <Typography level="body-xs" sx={{ mt: 1, textAlign: 'right' }}>
                        17% utilizado
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Box>
          </Sheet>
        </TabPanel>
        
        {/* Configurações de Funções e Permissões */}
        <TabPanel value={4} sx={{ p: 0, pt: 2 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              p: 3,
            }}
          >
            <Typography
              level="title-md"
              startDecorator={<AdminPanelSettingsIcon />}
              sx={{ mb: 3 }}
            >
              Funções e Permissões
            </Typography>
            
            <Alert
              variant="soft"
              color="warning"
              sx={{ mb: 3 }}
            >
              As permissões de sistema são um recurso fundamental e alterações devem ser feitas com cautela.
            </Alert>
            
            <AccordionGroup sx={{ mb: 2 }}>
              <Accordion>
                <AccordionSummary indicator={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <AdminPanelSettingsIcon sx={{ color: 'danger.500' }} />
                    <Typography level="title-sm">Administrador</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    {rolePermissions.administrador.description}
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(rolePermissions.administrador.can).map(([key, value]) => (
                      <Grid xs={12} sm={6} md={4} key={key}>
                        <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                          <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                          <Switch 
                            checked={value} 
                            // Na prática, aqui teríamos um manipulador para atualizar as permissões
                            disabled
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary indicator={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <DeveloperModeIcon sx={{ color: 'primary.500' }} />
                    <Typography level="title-sm">Desenvolvedor</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    {rolePermissions.desenvolvedor.description}
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(rolePermissions.desenvolvedor.can).map(([key, value]) => (
                      <Grid xs={12} sm={6} md={4} key={key}>
                        <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                          <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                          <Switch 
                            checked={value} 
                            // Na prática, aqui teríamos um manipulador para atualizar as permissões
                            disabled
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
              
              <Accordion>
                <AccordionSummary indicator={<ExpandMoreIcon />}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <PersonIcon sx={{ color: 'success.500' }} />
                    <Typography level="title-sm">Membro</Typography>
                  </Box>
                </AccordionSummary>
                <AccordionDetails>
                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    {rolePermissions.membro.description}
                  </Typography>
                  <Grid container spacing={1}>
                    {Object.entries(rolePermissions.membro.can).map(([key, value]) => (
                      <Grid xs={12} sm={6} md={4} key={key}>
                        <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                          <FormLabel>{key.charAt(0).toUpperCase() + key.slice(1)}</FormLabel>
                          <Switch 
                            checked={value} 
                            // Na prática, aqui teríamos um manipulador para atualizar as permissões
                            disabled
                          />
                        </FormControl>
                      </Grid>
                    ))}
                  </Grid>
                </AccordionDetails>
              </Accordion>
            </AccordionGroup>
            
            <Button
              variant="outlined"
              color="neutral"
              disabled
              sx={{ mt: 2 }}
            >
              Gerenciar Funções Personalizadas
            </Button>
          </Sheet>
        </TabPanel>
      </Tabs>
      
      {/* Snackbar para feedback */}
      <Snackbar
        autoHideDuration={5000}
        open={snackbar.open}
        onClose={() => setSnackbar(prev => ({ ...prev, open: false }))}
        color={snackbar.color}
        size="lg"
      >
        <Alert variant="solid" color={snackbar.color}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
} 