import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Stack from '@mui/joy/Stack';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Sheet from '@mui/joy/Sheet';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Grid from '@mui/joy/Grid';
import Switch from '@mui/joy/Switch';
import IconButton from '@mui/joy/IconButton';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import TabPanel from '@mui/joy/TabPanel';
import Tabs from '@mui/joy/Tabs';
import Alert from '@mui/joy/Alert';
import Snackbar from '@mui/joy/Snackbar';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EditIcon from '@mui/icons-material/Edit';
import LockIcon from '@mui/icons-material/Lock';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import SettingsIcon from '@mui/icons-material/Settings';
import NotificationsIcon from '@mui/icons-material/Notifications';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import SaveIcon from '@mui/icons-material/Save';
import DarkModeIcon from '@mui/icons-material/DarkMode';
import TranslateIcon from '@mui/icons-material/Translate';
import SpeedIcon from '@mui/icons-material/Speed';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

import { Usuario, UserPreferences, rolePermissions } from '../data/usuarios';
import { getUserPreferences, updateUserPreferences } from '../services/usuarioService';

/**
 * Página de perfil do usuário que permite visualizar e editar informações pessoais,
 * alterar senha e configurar preferências do sistema
 */
export default function PerfilPage() {
  // Usuário atual (mock data, em um sistema real seria obtido via estado global ou context)
  const [currentUser, setCurrentUser] = React.useState<Usuario>({
    id: "USR001",
    nome: "João Silva",
    email: "joao.silva@ecobalance.com.br",
    avatar: "https://mui.com/static/images/avatar/1.jpg",
    cargo: "Gerente de Projetos",
    departamento: "Projetos",
    role: "administrador",
    telefone: "(11) 98765-4321",
    status: "ativo",
    ultimoAcesso: "2023-12-15 15:30",
    dataCriacao: "2023-01-10"
  });
  
  // Estado para preferências do usuário
  const [preferences, setPreferences] = React.useState<UserPreferences>({
    theme: 'system',
    language: 'pt-BR',
    notifications: {
      email: true,
      app: true,
      ratificacoes: true,
      system: true,
    },
    display: {
      compactMode: false,
      animation: true,
      highContrast: false,
    }
  });
  
  // Estado para formulário de alteração de senha
  const [passwordForm, setPasswordForm] = React.useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  
  // Estado para visibilidade da senha
  const [showPassword, setShowPassword] = React.useState({
    current: false,
    new: false,
    confirm: false,
  });
  
  // Estados para modos de edição
  const [editingInfo, setEditingInfo] = React.useState(false);
  const [editedUser, setEditedUser] = React.useState(currentUser);
  
  // Estado para feedback ao usuário
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    color: 'success' | 'danger' | 'warning';
  }>({
    open: false,
    message: '',
    color: 'success',
  });
  
  // Carregar preferências ao montar o componente
  React.useEffect(() => {
    const loadPreferences = async () => {
      try {
        const prefs = await getUserPreferences();
        setPreferences(prefs);
      } catch (error) {
        console.error('Erro ao carregar preferências:', error);
      }
    };
    
    loadPreferences();
  }, []);
  
  // Handles para campos de informações pessoais
  const handleInfoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setEditedUser(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle para salvar informações pessoais
  const handleSaveInfo = () => {
    setCurrentUser(editedUser);
    setEditingInfo(false);
    
    setSnackbar({
      open: true,
      message: 'Informações atualizadas com sucesso!',
      color: 'success',
    });
    
    // Em um sistema real, aqui chamaríamos a API para atualizar o usuário
  };
  
  // Handle para cancelar edição
  const handleCancelEdit = () => {
    setEditedUser(currentUser);
    setEditingInfo(false);
  };
  
  // Handle para alteração de preferências
  const handlePreferenceChange = (
    section: keyof UserPreferences, 
    setting: string, 
    value: boolean | string
  ) => {
    setPreferences(prev => {
      if (typeof prev[section] === 'object' && setting in (prev[section] as object)) {
        return {
          ...prev,
          [section]: {
            ...(prev[section] as object),
            [setting]: value
          }
        };
      } else {
        return {
          ...prev,
          [section]: value
        };
      }
    });
    
    // Em um sistema real, chamaríamos a API para atualizar as preferências
    updateUserPreferences(preferences).catch(error => {
      console.error('Erro ao atualizar preferências:', error);
    });
  };
  
  // Handle para mudança nos campos de senha
  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({ ...prev, [name]: value }));
  };
  
  // Handle para alteração de senha
  const handleSavePassword = () => {
    // Validação básica
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setSnackbar({
        open: true,
        message: 'As senhas não coincidem.',
        color: 'danger',
      });
      return;
    }
    
    if (passwordForm.newPassword.length < 8) {
      setSnackbar({
        open: true,
        message: 'A senha deve ter pelo menos 8 caracteres.',
        color: 'danger',
      });
      return;
    }
    
    // Em um sistema real, chamaríamos a API para alterar a senha
    setSnackbar({
      open: true,
      message: 'Senha alterada com sucesso!',
      color: 'success',
    });
    
    // Reset form
    setPasswordForm({
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
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
            Meu Perfil
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
        <Typography level="h2" component="h1">
          Meu Perfil
        </Typography>
      </Box>
      
      {/* Tabs para navegação entre seções */}
      <Tabs aria-label="Seções do perfil" defaultValue={0} sx={{ bgcolor: 'transparent' }}>
        <TabList 
          tabFlex={1}
          size="sm"
          sx={{ 
            '--TabList-gap': '0px',
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
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={0}>Informações Pessoais</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={1}>Alterar Senha</Tab>
          <Tab sx={{ borderRadius: '6px 6px 0 0' }} indicatorInset value={2}>Preferências</Tab>
        </TabList>
        
        {/* Informações Pessoais */}
        <TabPanel value={0} sx={{ p: 0 }}>
          <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} sx={{ mt: 3 }}>
            {/* Cartão com avatar e informações básicas */}
            <Card variant="outlined" sx={{ maxWidth: { xs: '100%', md: 340 }, width: '100%' }}>
              <CardContent sx={{ alignItems: 'center', textAlign: 'center' }}>
                <Box sx={{ position: 'relative', width: 120, height: 120, mx: 'auto', mt: 1, mb: 2 }}>
                  <Avatar
                    src={currentUser.avatar}
                    sx={{ '--Avatar-size': '120px', position: 'absolute', top: 0, left: 0 }}
                  />
                  <IconButton
                    aria-label="Alterar foto de perfil"
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    sx={{
                      bgcolor: 'background.body',
                      position: 'absolute',
                      zIndex: 2,
                      borderRadius: '50%',
                      right: 2,
                      bottom: 2,
                      boxShadow: 'sm',
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                </Box>
                <Typography level="title-lg">{currentUser.nome}</Typography>
                <Typography level="body-sm" sx={{ maxWidth: '24ch', mb: 2 }}>
                  {currentUser.cargo}
                </Typography>
                <Chip 
                  size="sm" 
                  variant="soft"
                  color="primary"
                  sx={{ mr: 1 }}
                >
                  {rolePermissions[currentUser.role].label}
                </Chip>
                <Chip 
                  size="sm" 
                  variant="soft"
                  color={currentUser.status === 'ativo' ? 'success' : 'neutral'}
                >
                  {currentUser.status === 'ativo' ? 'Ativo' : 'Inativo'}
                </Chip>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <EmailIcon color="action" fontSize="small" />
                    <Typography level="body-sm" sx={{ flexGrow: 1, textAlign: 'left' }}>
                      {currentUser.email}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <PhoneIcon color="action" fontSize="small" />
                    <Typography level="body-sm" sx={{ flexGrow: 1, textAlign: 'left' }}>
                      {currentUser.telefone}
                    </Typography>
                  </Stack>
                  <Stack direction="row" spacing={2} sx={{ alignItems: 'center' }}>
                    <WorkIcon color="action" fontSize="small" />
                    <Typography level="body-sm" sx={{ flexGrow: 1, textAlign: 'left' }}>
                      {currentUser.departamento}
                    </Typography>
                  </Stack>
                </Stack>
                
                <Divider sx={{ my: 2 }} />
                
                <Stack spacing={1} sx={{ width: '100%' }}>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography level="body-xs">ID:</Typography>
                    <Typography level="body-xs">{currentUser.id}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography level="body-xs">Data de Criação:</Typography>
                    <Typography level="body-xs">{currentUser.dataCriacao}</Typography>
                  </Stack>
                  <Stack direction="row" sx={{ justifyContent: 'space-between' }}>
                    <Typography level="body-xs">Último Acesso:</Typography>
                    <Typography level="body-xs">{currentUser.ultimoAcesso}</Typography>
                  </Stack>
                </Stack>
              </CardContent>
            </Card>
            
            {/* Formulário de informações pessoais */}
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                width: '100%',
                p: 3,
              }}
            >
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                <Typography level="title-md">Detalhes Pessoais</Typography>
                {!editingInfo ? (
                  <Button
                    size="sm"
                    variant="outlined"
                    color="neutral"
                    startDecorator={<EditIcon />}
                    onClick={() => setEditingInfo(true)}
                  >
                    Editar
                  </Button>
                ) : (
                  <Stack direction="row" spacing={1}>
                    <Button
                      size="sm"
                      variant="outlined"
                      color="danger"
                      onClick={handleCancelEdit}
                    >
                      Cancelar
                    </Button>
                    <Button
                      size="sm"
                      variant="solid"
                      color="primary"
                      startDecorator={<SaveIcon />}
                      onClick={handleSaveInfo}
                    >
                      Salvar
                    </Button>
                  </Stack>
                )}
              </Box>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Nome Completo</FormLabel>
                    <Input
                      name="nome"
                      placeholder="Nome Completo"
                      value={editingInfo ? editedUser.nome : currentUser.nome}
                      onChange={handleInfoChange}
                      disabled={!editingInfo}
                      startDecorator={<BadgeIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Email</FormLabel>
                    <Input
                      name="email"
                      type="email"
                      placeholder="email@exemplo.com"
                      value={editingInfo ? editedUser.email : currentUser.email}
                      onChange={handleInfoChange}
                      disabled={!editingInfo}
                      startDecorator={<EmailIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={editingInfo ? editedUser.telefone : currentUser.telefone}
                      onChange={handleInfoChange}
                      disabled={!editingInfo}
                      startDecorator={<PhoneIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Cargo</FormLabel>
                    <Input
                      name="cargo"
                      placeholder="Cargo"
                      value={editingInfo ? editedUser.cargo : currentUser.cargo}
                      onChange={handleInfoChange}
                      disabled={!editingInfo}
                      startDecorator={<WorkIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Departamento</FormLabel>
                    <Input
                      name="departamento"
                      placeholder="Departamento"
                      value={editingInfo ? editedUser.departamento : currentUser.departamento}
                      onChange={handleInfoChange}
                      disabled={!editingInfo}
                      startDecorator={<WorkIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Função no Sistema</FormLabel>
                    <Input
                      placeholder={rolePermissions[currentUser.role].label}
                      value={rolePermissions[currentUser.role].label}
                      disabled
                      startDecorator={<LockIcon />}
                    />
                    <Typography level="body-xs" mt={0.5}>
                      A função é determinada pelo administrador do sistema
                    </Typography>
                  </FormControl>
                </Grid>
                
                <Grid xs={12}>
                  <Typography level="title-sm" sx={{ mt: 2, mb: 1 }}>Permissões de Usuário</Typography>
                  <Sheet 
                    variant="outlined" 
                    sx={{ 
                      p: 2, 
                      borderRadius: 'md', 
                      bgcolor: 'background.level1' 
                    }}
                  >
                    <Typography level="body-sm" mb={1}>
                      Como {rolePermissions[currentUser.role].label}, você tem as seguintes permissões:
                    </Typography>
                    <Grid container spacing={1} sx={{ mt: 1 }}>
                      {Object.entries(rolePermissions[currentUser.role].can).map(([key, value]) => (
                        <Grid xs={12} sm={6} md={4} key={key}>
                          <Stack direction="row" spacing={1} alignItems="center">
                            <Chip 
                              variant="soft" 
                              size="sm"
                              color={value ? 'success' : 'danger'}
                              startDecorator={value ? <CheckCircleIcon fontSize="small" /> : null}
                            >
                              {value ? 'Sim' : 'Não'}
                            </Chip>
                            <Typography level="body-sm">
                              {key.charAt(0).toUpperCase() + key.slice(1)}
                            </Typography>
                          </Stack>
                        </Grid>
                      ))}
                    </Grid>
                  </Sheet>
                </Grid>
              </Grid>
            </Sheet>
          </Stack>
        </TabPanel>
        
        {/* Alterar Senha */}
        <TabPanel value={1} sx={{ p: 0 }}>
          <Sheet
            variant="outlined"
            sx={{
              borderRadius: 'md',
              maxWidth: 600,
              mx: 'auto',
              mt: 3,
              p: 3,
            }}
          >
            <Typography level="title-md" sx={{ mb: 3 }}>
              Alterar Senha
            </Typography>
            
            <Stack spacing={3}>
              <FormControl>
                <FormLabel>Senha Atual</FormLabel>
                <Input
                  name="currentPassword"
                  type={showPassword.current ? 'text' : 'password'}
                  placeholder="Senha atual"
                  value={passwordForm.currentPassword}
                  onChange={handlePasswordChange}
                  startDecorator={<LockIcon />}
                  endDecorator={
                    <IconButton
                      onClick={() => setShowPassword(prev => ({ ...prev, current: !prev.current }))}
                    >
                      {showPassword.current ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  }
                />
              </FormControl>
              
              <FormControl>
                <FormLabel>Nova Senha</FormLabel>
                <Input
                  name="newPassword"
                  type={showPassword.new ? 'text' : 'password'}
                  placeholder="Nova senha"
                  value={passwordForm.newPassword}
                  onChange={handlePasswordChange}
                  startDecorator={<LockIcon />}
                  endDecorator={
                    <IconButton
                      onClick={() => setShowPassword(prev => ({ ...prev, new: !prev.new }))}
                    >
                      {showPassword.new ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  }
                />
                <Typography level="body-xs" mt={0.5}>
                  A senha deve ter pelo menos 8 caracteres
                </Typography>
              </FormControl>
              
              <FormControl>
                <FormLabel>Confirmar Nova Senha</FormLabel>
                <Input
                  name="confirmPassword"
                  type={showPassword.confirm ? 'text' : 'password'}
                  placeholder="Confirmar nova senha"
                  value={passwordForm.confirmPassword}
                  onChange={handlePasswordChange}
                  startDecorator={<LockIcon />}
                  endDecorator={
                    <IconButton
                      onClick={() => setShowPassword(prev => ({ ...prev, confirm: !prev.confirm }))}
                    >
                      {showPassword.confirm ? <VisibilityOffIcon /> : <VisibilityIcon />}
                    </IconButton>
                  }
                />
              </FormControl>
              
              <Box sx={{ mt: 2, display: 'flex', justifyContent: 'flex-end' }}>
                <Button
                  color="primary"
                  onClick={handleSavePassword}
                  disabled={
                    !passwordForm.currentPassword ||
                    !passwordForm.newPassword ||
                    !passwordForm.confirmPassword
                  }
                >
                  Alterar Senha
                </Button>
              </Box>
            </Stack>
          </Sheet>
        </TabPanel>
        
        {/* Preferências */}
        <TabPanel value={2} sx={{ p: 0 }}>
          <Stack spacing={2} sx={{ mt: 3 }}>
            {/* Preferências de interface */}
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
              }}
            >
              <Typography startDecorator={<SettingsIcon />} level="title-md" sx={{ mb: 3 }}>
                Preferências de Interface
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Tema do Sistema</FormLabel>
                    <Select
                      value={preferences.theme}
                      onChange={(_, value) => handlePreferenceChange('theme', '', value as string)}
                      placeholder="Tema"
                      startDecorator={<DarkModeIcon />}
                    >
                      <Option value="light">Claro</Option>
                      <Option value="dark">Escuro</Option>
                      <Option value="system">Sistema (Automático)</Option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Idioma</FormLabel>
                    <Select
                      value={preferences.language}
                      onChange={(_, value) => handlePreferenceChange('language', '', value as string)}
                      placeholder="Idioma"
                      startDecorator={<TranslateIcon />}
                    >
                      <Option value="pt-BR">Português</Option>
                      <Option value="en-US">English</Option>
                      <Option value="es">Español</Option>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Modo Compacto</FormLabel>
                      <Typography level="body-xs">
                        Reduz espaçamentos e tamanho de elementos
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.display.compactMode}
                      onChange={(event) => 
                        handlePreferenceChange('display', 'compactMode', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Animações</FormLabel>
                      <Typography level="body-xs">
                        Habilita transições e animações de interface
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.display.animation}
                      onChange={(event) => 
                        handlePreferenceChange('display', 'animation', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={4}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Alto Contraste</FormLabel>
                      <Typography level="body-xs">
                        Aumenta contraste para melhor legibilidade
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.display.highContrast}
                      onChange={(event) => 
                        handlePreferenceChange('display', 'highContrast', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Sheet>
            
            {/* Preferências de notificações */}
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
              }}
            >
              <Typography startDecorator={<NotificationsIcon />} level="title-md" sx={{ mb: 3 }}>
                Preferências de Notificações
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Notificações por Email</FormLabel>
                      <Typography level="body-xs">
                        Receber notificações por email
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.notifications.email}
                      onChange={(event) => 
                        handlePreferenceChange('notifications', 'email', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Notificações no Aplicativo</FormLabel>
                      <Typography level="body-xs">
                        Receber notificações dentro do sistema
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.notifications.app}
                      onChange={(event) => 
                        handlePreferenceChange('notifications', 'app', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Alertas de Ratificações</FormLabel>
                      <Typography level="body-xs">
                        Receber atualizações sobre ratificações
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.notifications.ratificacoes}
                      onChange={(event) => 
                        handlePreferenceChange('notifications', 'ratificacoes', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ justifyContent: 'space-between' }}>
                    <div>
                      <FormLabel>Alertas do Sistema</FormLabel>
                      <Typography level="body-xs">
                        Receber notificações de segurança e sistema
                      </Typography>
                    </div>
                    <Switch
                      checked={preferences.notifications.system}
                      onChange={(event) => 
                        handlePreferenceChange('notifications', 'system', event.target.checked)
                      }
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Sheet>
            
            {/* Informações de suporte */}
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
              }}
            >
              <Typography startDecorator={<SpeedIcon />} level="title-md" sx={{ mb: 3 }}>
                Informações do Sistema
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography level="body-sm" fontWeight="bold">
                      Versão do Sistema
                    </Typography>
                    <Typography level="body-sm">
                      v2.5.0
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography level="body-sm" fontWeight="bold">
                      Última Atualização
                    </Typography>
                    <Typography level="body-sm">
                      15/12/2023
                    </Typography>
                  </Stack>
                </Grid>
                <Grid xs={12} md={4}>
                  <Stack spacing={1}>
                    <Typography level="body-sm" fontWeight="bold">
                      Suporte Técnico
                    </Typography>
                    <Typography level="body-sm">
                      suporte@ecobalance.com.br
                    </Typography>
                  </Stack>
                </Grid>
              </Grid>
            </Sheet>
          </Stack>
        </TabPanel>
      </Tabs>
      
      {/* Snackbar para feedback */}
      <Snackbar
        autoHideDuration={5000}
        open={snackbar.open}
        onClose={() => setSnackbar({ ...snackbar, open: false })}
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