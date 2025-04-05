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
import Checkbox from '@mui/joy/Checkbox';
import Alert from '@mui/joy/Alert';
import Snackbar from '@mui/joy/Snackbar';
import IconButton from '@mui/joy/IconButton';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import EmailIcon from '@mui/icons-material/Email';
import PhoneIcon from '@mui/icons-material/Phone';
import BadgeIcon from '@mui/icons-material/Badge';
import WorkIcon from '@mui/icons-material/Work';
import VisibilityIcon from '@mui/icons-material/Visibility';
import VisibilityOffIcon from '@mui/icons-material/VisibilityOff';
import LockIcon from '@mui/icons-material/Lock';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PersonIcon from '@mui/icons-material/Person';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import SettingsIcon from '@mui/icons-material/Settings';

import { UserRole, rolePermissions } from '../data/usuarios';
import { createUsuario } from '../services/usuarioService';

/**
 * Página para criar novos usuários no sistema com diferentes funções e permissões
 */
export default function NovoUsuarioPage() {
  // Form state
  const [formData, setFormData] = React.useState({
    nome: '',
    email: '',
    telefone: '',
    cargo: '',
    departamento: '',
    role: '' as UserRole | '',
    status: 'ativo' as 'ativo' | 'inativo',
    avatar: '',
    enviarEmail: true,
    gerarSenhaAleatoria: true,
    senha: '',
    confirmarSenha: '',
  });
  
  // Validation state
  const [errors, setErrors] = React.useState<{
    [key: string]: string;
  }>({});
  
  // Password visibility
  const [showPassword, setShowPassword] = React.useState({
    senha: false,
    confirmarSenha: false,
  });
  
  // Alert/Snackbar
  const [snackbar, setSnackbar] = React.useState<{
    open: boolean;
    message: string;
    color: 'success' | 'danger' | 'warning' | 'neutral';
  }>({
    open: false,
    message: '',
    color: 'success',
  });
  
  // Role icon mapping
  const roleIcons = {
    administrador: <AdminPanelSettingsIcon />,
    desenvolvedor: <DeveloperModeIcon />,
    membro: <PersonIcon />,
  };
  
  // Handle input changes
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle select changes
  const handleSelectChange = (
    name: string,
    value: unknown
  ) => {
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when field is edited
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };
  
  // Handle checkbox changes
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
    
    // If generating random password, clear password fields
    if (name === 'gerarSenhaAleatoria' && checked) {
      setFormData(prev => ({ 
        ...prev, 
        senha: '',
        confirmarSenha: '',
      }));
    }
  };
  
  // Validate form
  const validateForm = (): boolean => {
    const newErrors: { [key: string]: string } = {};
    
    // Required fields
    if (!formData.nome) newErrors.nome = 'Nome é obrigatório';
    if (!formData.email) {
      newErrors.email = 'Email é obrigatório';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email inválido';
    }
    if (!formData.role) newErrors.role = 'Função é obrigatória';
    
    // Password validation if not generating random
    if (!formData.gerarSenhaAleatoria) {
      if (!formData.senha) {
        newErrors.senha = 'Senha é obrigatória';
      } else if (formData.senha.length < 8) {
        newErrors.senha = 'Senha deve ter pelo menos 8 caracteres';
      }
      
      if (!formData.confirmarSenha) {
        newErrors.confirmarSenha = 'Confirmação de senha é obrigatória';
      } else if (formData.senha !== formData.confirmarSenha) {
        newErrors.confirmarSenha = 'As senhas não correspondem';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  // Submit form
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      setSnackbar({
        open: true,
        message: 'Por favor, corrija os erros no formulário',
        color: 'danger',
      });
      return;
    }
    
    try {
      // In a real application, we would call API here
      const randomAvatar = `https://mui.com/static/images/avatar/${Math.floor(Math.random() * 8) + 1}.jpg`;
      
      await createUsuario({
        nome: formData.nome,
        email: formData.email,
        telefone: formData.telefone || '(00) 00000-0000',
        cargo: formData.cargo || 'Não especificado',
        departamento: formData.departamento || 'Geral',
        role: formData.role as UserRole,
        status: formData.status,
        avatar: randomAvatar,
      });
      
      setSnackbar({
        open: true,
        message: 'Usuário criado com sucesso!',
        color: 'success',
      });
      
      // Reset form
      setFormData({
        nome: '',
        email: '',
        telefone: '',
        cargo: '',
        departamento: '',
        role: '',
        status: 'ativo',
        avatar: '',
        enviarEmail: true,
        gerarSenhaAleatoria: true,
        senha: '',
        confirmarSenha: '',
      });
      
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao criar usuário. Tente novamente.',
        color: 'danger',
      });
    }
  };
  
  // Generate random password
  const generateRandomPassword = () => {
    const chars = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*()';
    let password = '';
    for (let i = 0; i < 12; i++) {
      password += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return password;
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
          <Link
            underline="hover"
            color="neutral"
            href="#usuarios"
            fontSize="12px"
            fontWeight="500"
          >
            Usuários
          </Link>
          <Typography color="primary" fontWeight="500" fontSize="12px">
            Novo Usuário
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
        <Typography level="h2" component="h1" startDecorator={<PersonAddIcon />}>
          Criar Novo Usuário
        </Typography>
      </Box>
      
      {/* Formulário */}
      <Box component="form" onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          {/* Informações pessoais */}
          <Grid xs={12} md={8}>
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
                mb: 2,
              }}
            >
              <Typography
                level="title-md"
                startDecorator={<BadgeIcon />}
                sx={{ mb: 3 }}
              >
                Informações Pessoais
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <FormControl error={!!errors.nome}>
                    <FormLabel>Nome Completo *</FormLabel>
                    <Input
                      name="nome"
                      placeholder="Nome do Usuário"
                      value={formData.nome}
                      onChange={handleInputChange}
                      startDecorator={<BadgeIcon />}
                    />
                    {errors.nome && (
                      <FormHelperText>{errors.nome}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl error={!!errors.email}>
                    <FormLabel>Email *</FormLabel>
                    <Input
                      type="email"
                      name="email"
                      placeholder="usuario@ecobalance.com.br"
                      value={formData.email}
                      onChange={handleInputChange}
                      startDecorator={<EmailIcon />}
                    />
                    {errors.email && (
                      <FormHelperText>{errors.email}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Telefone</FormLabel>
                    <Input
                      name="telefone"
                      placeholder="(00) 00000-0000"
                      value={formData.telefone}
                      onChange={handleInputChange}
                      startDecorator={<PhoneIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Cargo</FormLabel>
                    <Input
                      name="cargo"
                      placeholder="Cargo do Usuário"
                      value={formData.cargo}
                      onChange={handleInputChange}
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
                      value={formData.departamento}
                      onChange={handleInputChange}
                      startDecorator={<WorkIcon />}
                    />
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      name="status"
                      value={formData.status}
                      onChange={(_, value) => handleSelectChange('status', value)}
                    >
                      <Option value="ativo">Ativo</Option>
                      <Option value="inativo">Inativo</Option>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Sheet>
          </Grid>
          
          {/* Definição da função */}
          <Grid xs={12} md={4}>
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
                mb: 2,
                height: formData.role ? 'calc(100% - 16px)' : 'auto',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <Typography
                level="title-md"
                startDecorator={<SettingsIcon />}
                sx={{ mb: 3 }}
              >
                Função no Sistema
              </Typography>
              
              <FormControl error={!!errors.role} sx={{ mb: 2 }}>
                <FormLabel>Função *</FormLabel>
                <Select
                  name="role"
                  placeholder="Selecione uma função"
                  value={formData.role}
                  onChange={(_, value) => handleSelectChange('role', value)}
                >
                  <Option value="administrador">Administrador</Option>
                  <Option value="desenvolvedor">Desenvolvedor</Option>
                  <Option value="membro">Membro</Option>
                </Select>
                {errors.role && (
                  <FormHelperText>{errors.role}</FormHelperText>
                )}
              </FormControl>
              
              {formData.role && (
                <>
                  <Box sx={{ mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
                    <Avatar
                      color={
                        formData.role === 'administrador'
                          ? 'danger'
                          : formData.role === 'desenvolvedor'
                          ? 'primary'
                          : 'success'
                      }
                    >
                      {roleIcons[formData.role as UserRole]}
                    </Avatar>
                    <Typography level="title-sm">
                      {rolePermissions[formData.role as UserRole].label}
                    </Typography>
                  </Box>
                  
                  <Typography level="body-sm" sx={{ mb: 2 }}>
                    {rolePermissions[formData.role as UserRole].description}
                  </Typography>
                  
                  <Divider sx={{ my: 1 }} />
                  
                  <Typography level="body-xs" sx={{ mb: 1, mt: 1 }}>
                    Permissões desta função:
                  </Typography>
                  
                  <Box sx={{ flexGrow: 1 }}>
                    {Object.entries(rolePermissions[formData.role as UserRole].can).map(([key, value]) => (
                      <Stack
                        key={key}
                        direction="row"
                        spacing={1}
                        alignItems="center"
                        sx={{ mb: 1 }}
                      >
                        <Chip
                          size="sm"
                          variant="soft"
                          color={value ? 'success' : 'danger'}
                          startDecorator={value ? <CheckCircleIcon fontSize="small" /> : null}
                        >
                          {value ? 'Sim' : 'Não'}
                        </Chip>
                        <Typography level="body-sm">
                          {key.charAt(0).toUpperCase() + key.slice(1)}
                        </Typography>
                      </Stack>
                    ))}
                  </Box>
                </>
              )}
            </Sheet>
          </Grid>
          
          {/* Configurações de acesso */}
          <Grid xs={12}>
            <Sheet
              variant="outlined"
              sx={{
                borderRadius: 'md',
                p: 3,
                mb: 2,
              }}
            >
              <Typography
                level="title-md"
                startDecorator={<LockIcon />}
                sx={{ mb: 3 }}
              >
                Configurações de Acesso
              </Typography>
              
              <Grid container spacing={2}>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ gap: 2 }}>
                    <Checkbox
                      name="enviarEmail"
                      checked={formData.enviarEmail}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <FormLabel>Enviar email de boas-vindas</FormLabel>
                      <FormHelperText>
                        Envia um email com instruções de acesso para o novo usuário
                      </FormHelperText>
                    </div>
                  </FormControl>
                </Grid>
                <Grid xs={12} md={6}>
                  <FormControl orientation="horizontal" sx={{ gap: 2 }}>
                    <Checkbox
                      name="gerarSenhaAleatoria"
                      checked={formData.gerarSenhaAleatoria}
                      onChange={handleCheckboxChange}
                    />
                    <div>
                      <FormLabel>Gerar senha aleatória</FormLabel>
                      <FormHelperText>
                        Gera uma senha aleatória segura para o usuário
                      </FormHelperText>
                    </div>
                  </FormControl>
                </Grid>
                
                {!formData.gerarSenhaAleatoria && (
                  <>
                    <Grid xs={12} md={6}>
                      <FormControl error={!!errors.senha}>
                        <FormLabel>Senha</FormLabel>
                        <Input
                          name="senha"
                          type={showPassword.senha ? 'text' : 'password'}
                          placeholder="Digite a senha"
                          value={formData.senha}
                          onChange={handleInputChange}
                          startDecorator={<LockIcon />}
                          endDecorator={
                            <IconButton
                              onClick={() => setShowPassword(prev => ({ ...prev, senha: !prev.senha }))}
                            >
                              {showPassword.senha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          }
                        />
                        {errors.senha ? (
                          <FormHelperText>{errors.senha}</FormHelperText>
                        ) : (
                          <FormHelperText>
                            Mínimo de 8 caracteres
                          </FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid xs={12} md={6}>
                      <FormControl error={!!errors.confirmarSenha}>
                        <FormLabel>Confirmar Senha</FormLabel>
                        <Input
                          name="confirmarSenha"
                          type={showPassword.confirmarSenha ? 'text' : 'password'}
                          placeholder="Confirme a senha"
                          value={formData.confirmarSenha}
                          onChange={handleInputChange}
                          startDecorator={<LockIcon />}
                          endDecorator={
                            <IconButton
                              onClick={() => setShowPassword(prev => ({ ...prev, confirmarSenha: !prev.confirmarSenha }))}
                            >
                              {showPassword.confirmarSenha ? <VisibilityOffIcon /> : <VisibilityIcon />}
                            </IconButton>
                          }
                        />
                        {errors.confirmarSenha && (
                          <FormHelperText>{errors.confirmarSenha}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                  </>
                )}
                
                {formData.gerarSenhaAleatoria && (
                  <Grid xs={12}>
                    <Alert
                      variant="soft"
                      color="neutral"
                      startDecorator={<InfoOutlinedIcon />}
                      sx={{ mb: 1, mt: 1 }}
                    >
                      Uma senha aleatória segura será gerada e enviada por email para o usuário.
                    </Alert>
                  </Grid>
                )}
              </Grid>
            </Sheet>
          </Grid>
          
          {/* Botões de ação */}
          <Grid xs={12}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'flex-end',
                gap: 1,
                mt: 1,
              }}
            >
              <Button
                variant="outlined"
                color="neutral"
                type="button"
                onClick={() => window.history.back()}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                color="primary"
                type="submit"
                startDecorator={<PersonAddIcon />}
              >
                Criar Usuário
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Box>
      
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