import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';
import { BrowserRouter, Routes, Route, useNavigate, useLocation, Navigate } from 'react-router-dom';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';
import AddIcon from '@mui/icons-material/Add';
import ForestIcon from '@mui/icons-material/Forest';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import BarChartIcon from '@mui/icons-material/BarChart';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';

import Sidebar from './components/Sidebar';
import Header from './components/Header';
import ClientesPage from './pages/ClientesPage';
import PropriedadesPage from './pages/PropriedadesPage';
import RatificacoesPage from './pages/RatificacoesPage';
import NovaRatificacaoPage from './pages/NovaRatificacaoPage';
import PerfilPage from './pages/PerfilPage';
import NovoUsuarioPage from './pages/NovoUsuarioPage';
import UsuariosPage from './pages/UsuariosPage';
import ConfiguracoesPage from './pages/ConfiguracoesPage';
import SuportePage from './pages/SuportePage';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Divider from '@mui/joy/Divider';
import Avatar from '@mui/joy/Avatar';
import Stack from '@mui/joy/Stack';

/**
 * Layout principal da aplicação com Sidebar e conteúdo
 */
function MainLayout({ children }: { children: React.ReactNode }) {
  const navigate = useNavigate();
  const location = useLocation();
  const currentPage = location.pathname.substring(1) || 'home';

  return (
    <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
      <Header />
      <Sidebar 
        onNavigate={(page: string) => navigate(`/${page}`)} 
        currentPage={currentPage}
      />
      {children}
    </Box>
  );
}

/**
 * Componente principal da aplicação Ecobalance
 * 
 * Funcionalidades:
 * - Gerenciamento de navegação entre páginas usando React Router
 * - Layout responsivo com barra lateral e conteúdo principal
 */
export default function EcoBalanceApp() {
  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <BrowserRouter basename="/ecobalance-frontend">
        <Routes>
          <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/home" element={<MainLayout><HomePage /></MainLayout>} />
          <Route path="/clientes" element={<MainLayout><ClientesPage /></MainLayout>} />
          <Route path="/propriedades" element={<MainLayout><PropriedadesPage /></MainLayout>} />
          <Route path="/ratificacoes" element={<MainLayout><RatificacoesPage /></MainLayout>} />
          <Route path="/nova-ratificacao" element={<MainLayout><NovaRatificacaoPage /></MainLayout>} />
          <Route path="/perfil" element={<MainLayout><PerfilPage /></MainLayout>} />
          <Route path="/novo-usuario" element={<MainLayout><NovoUsuarioPage /></MainLayout>} />
          <Route path="/usuarios" element={<MainLayout><UsuariosPage /></MainLayout>} />
          <Route path="/configuracoes" element={<MainLayout><ConfiguracoesPage /></MainLayout>} />
          <Route path="/suporte" element={<MainLayout><SuportePage /></MainLayout>} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </CssVarsProvider>
  );
}

/**
 * Página inicial (Home) do EcoBalance
 */
function HomePage() {
  const navigate = useNavigate();
  
  // Dados de estatísticas (mockup)
  const stats = {
    ratificacoes: {
      total: 53,
      pendentes: 12,
      concluidas: 41
    },
    propriedades: {
      total: 87,
      area: 12450, // em hectares
      certificadas: 63
    },
    clientes: {
      total: 42,
      ativos: 37
    }
  };
  
  // Dados de atividades recentes (mockup)
  const recentActivities = [
    { 
      id: 1, 
      type: 'ratificacao', 
      action: 'Nova ratificação criada', 
      description: 'Fazenda São João - São Paulo/SP', 
      date: '2 horas atrás',
      status: 'rascunho'
    },
    { 
      id: 2, 
      type: 'propriedade', 
      action: 'Propriedade atualizada', 
      description: 'Sítio Bela Vista - Campos do Jordão/SP',
      date: '5 horas atrás',
      status: 'concluido'
    },
    { 
      id: 3, 
      type: 'cliente', 
      action: 'Novo cliente cadastrado', 
      description: 'Empresa Agroflorestal Ltda.',
      date: '12 horas atrás',
      status: 'concluido'
    },
    { 
      id: 4, 
      type: 'ratificacao', 
      action: 'Ratificação enviada para revisão', 
      description: 'Rancho Verde Vivo - Belo Horizonte/MG',
      date: '1 dia atrás',
      status: 'revisao'
    },
    { 
      id: 5, 
      type: 'ratificacao', 
      action: 'Ratificação aprovada', 
      description: 'Fazenda Esperança - Ribeirão Preto/SP',
      date: '1 dia atrás',
      status: 'aprovada'
    }
  ];

  // Função para renderizar o ícone com base no tipo de atividade
  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'ratificacao':
        return <FactCheckIcon />;
      case 'propriedade':
        return <ForestIcon />;
      case 'cliente':
        return <PersonRoundedIcon />;
      default:
        return <BarChartIcon />;
    }
  };
  
  // Função para obter a cor do status
  const getStatusColor = (status: string): 'primary' | 'warning' | 'success' | 'neutral' => {
    switch (status) {
      case 'rascunho':
        return 'neutral';
      case 'revisao':
        return 'warning';
      case 'aprovada':
      case 'concluido':
        return 'success';
      default:
        return 'primary';
    }
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
        overflow: 'auto'
      }}
    >
      {/* Breadcrumbs para navegação */}
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
            href="/"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Início
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Banner de boas-vindas */}
      <Sheet
        variant="outlined"
        sx={{
          borderRadius: 'lg',
          p: { xs: 3, md: 4 },
          mb: 3,
          display: 'flex',
          flexDirection: { xs: 'column', md: 'row' },
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
          background: (theme) => 
            theme.palette.mode === 'dark' 
              ? 'linear-gradient(90deg, var(--joy-palette-primary-900) 0%, var(--joy-palette-background-surface) 100%)'
              : 'linear-gradient(90deg, var(--joy-palette-primary-50) 0%, var(--joy-palette-background-surface) 100%)'
        }}
      >
        <Box sx={{ width: '100%', maxWidth: { md: '60%' } }}>
          <Typography level="h2" sx={{ mb: 1 }}>
            Bem-vindo ao EcoBalance
          </Typography>
          <Typography level="body-md" sx={{ mb: 2, maxWidth: '80ch' }}>
            Gerencie suas ratificações ambientais, cadastre propriedades e acompanhe o processo de regularização ambiental com facilidade e praticidade.
          </Typography>
          <Button
            variant="solid"
            color="primary"
            size="lg"
            endDecorator={<ArrowForwardIcon />}
            onClick={() => navigate('/nova-ratificacao')}
            sx={{ mt: 1 }}
          >
            Iniciar nova ratificação
          </Button>
        </Box>
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minWidth: { xs: '100%', md: '180px' },
            py: { xs: 2, md: 0 }
          }}
        >
          <ForestIcon 
            sx={{ 
              fontSize: { xs: 80, md: 120 }, 
              color: 'success.500', 
              opacity: 0.85
            }} 
          />
        </Box>
      </Sheet>
      
      {/* Cards de estatísticas */}
      <Typography level="title-lg" sx={{ mb: 2, fontWeight: 'bold' }}>
        Resumo
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ height: '100%', boxShadow: 'sm' }}>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography level="title-md" fontWeight="bold">Ratificações</Typography>
                <Avatar variant="soft" size="md" color="primary">
                  <FactCheckIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>{stats.ratificacoes.total}</Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Pendentes
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    {stats.ratificacoes.pendentes}
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Concluídas
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    {stats.ratificacoes.concluidas}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="plain" 
                color="primary" 
                size="sm"
                onClick={() => navigate('/ratificacoes')}
                endDecorator={<ArrowForwardIcon fontSize="small" />}
              >
                Ver ratificações
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ height: '100%', boxShadow: 'sm' }}>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography level="title-md" fontWeight="bold">Propriedades</Typography>
                <Avatar variant="soft" size="md" color="success">
                  <ForestIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>{stats.propriedades.total}</Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Certificadas
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    {stats.propriedades.certificadas}
                  </Typography>
                </Box>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Área Total (ha)
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    {stats.propriedades.area.toLocaleString('pt-BR')}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="plain" 
                color="success" 
                size="sm"
                onClick={() => navigate('/propriedades')}
                endDecorator={<ArrowForwardIcon fontSize="small" />}
              >
                Ver propriedades
              </Button>
            </CardActions>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} md={4}>
          <Card variant="outlined" sx={{ height: '100%', boxShadow: 'sm' }}>
            <CardContent sx={{ p: 2 }}>
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  mb: 1
                }}
              >
                <Typography level="title-md" fontWeight="bold">Clientes</Typography>
                <Avatar variant="soft" size="md" color="neutral">
                  <PersonRoundedIcon sx={{ fontSize: 18 }} />
                </Avatar>
              </Box>
              <Typography level="h2" sx={{ mb: 1 }}>{stats.clientes.total}</Typography>
              <Box sx={{ display: 'flex', gap: 3 }}>
                <Box>
                  <Typography level="body-xs" textColor="text.tertiary">
                    Ativos
                  </Typography>
                  <Typography level="body-md" fontWeight="bold">
                    {stats.clientes.ativos}
                  </Typography>
                </Box>
              </Box>
            </CardContent>
            <CardActions sx={{ p: 2, pt: 0 }}>
              <Button 
                variant="plain" 
                color="neutral" 
                size="sm"
                onClick={() => navigate('/clientes')}
                endDecorator={<ArrowForwardIcon fontSize="small" />}
              >
                Ver clientes
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>
      
      {/* Atividades recentes */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography level="title-lg" fontWeight="bold">
          Atividades Recentes
        </Typography>
        <Button 
          variant="solid"
          color="primary"
          size="sm"
          startDecorator={<AddIcon />}
          onClick={() => navigate('/nova-ratificacao')}
        >
          Nova Ratificação
        </Button>
      </Box>
      
      <Sheet 
        variant="outlined" 
        sx={{ 
          borderRadius: 'md', 
          overflow: 'visible',
          mb: 4,
          boxShadow: 'sm',
          minHeight: '200px',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box sx={{ 
          overflow: 'auto',
          flex: 1,
          maxHeight: '400px'
        }}>
          <Stack divider={<Divider />} sx={{ height: '100%' }}>
            {recentActivities && recentActivities.length > 0 ? (
              recentActivities.map((activity) => (
                <Box
                  key={activity.id}
                  sx={{
                    p: 2,
                    display: 'flex',
                    alignItems: 'center',
                    gap: 2,
                    cursor: 'pointer',
                    '&:hover': {
                      bgcolor: 'action.hover',
                    },
                    minHeight: '72px'
                  }}
                  onClick={() => {
                    // Navigate to the appropriate page based on activity type
                    if (activity.type === 'ratificacao') navigate('/ratificacoes');
                    else if (activity.type === 'propriedade') navigate('/propriedades');
                    else if (activity.type === 'cliente') navigate('/clientes');
                  }}
                >
                  <Avatar 
                    size="sm" 
                    variant="soft"
                    color={getStatusColor(activity.status)}
                  >
                    {getActivityIcon(activity.type)}
                  </Avatar>
                  <Box sx={{ 
                    flex: 1,
                    minWidth: 0 // Prevent text from pushing the container wider
                  }}>
                    <Typography level="body-sm" fontWeight="bold" noWrap>{activity.action}</Typography>
                    <Typography level="body-xs" noWrap>{activity.description}</Typography>
                  </Box>
                  <Box sx={{ flexShrink: 0 }}>
                    <Typography level="body-xs" textColor="text.tertiary">
                      {activity.date}
                    </Typography>
                  </Box>
                </Box>
              ))
            ) : (
              <Box sx={{ p: 3, textAlign: 'center', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography level="body-md" color="neutral">
                  Nenhuma atividade recente encontrada
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Sheet>
      
      {/* Links rápidos */}
      <Typography level="title-lg" sx={{ mt: 3, mb: 2 }} fontWeight="bold">
        Acesso Rápido
      </Typography>
      
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: '100%',
              height: '100%',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'neutral.outlinedHoverBorder' },
              cursor: 'pointer',
              boxShadow: 'sm'
            }}
            onClick={() => navigate('/nova-ratificacao')}
          >
            <CardContent sx={{ p: 2, flex: 1 }}>
              <Typography level="title-sm" fontWeight="bold">Nova Ratificação</Typography>
              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                Iniciar um novo processo
              </Typography>
            </CardContent>
            <Avatar size="md" variant="soft" color="primary" sx={{ m: 1.5 }}>
              <AddIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: '100%',
              height: '100%',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'neutral.outlinedHoverBorder' },
              cursor: 'pointer',
              boxShadow: 'sm'
            }}
            onClick={() => navigate('/propriedades')}
          >
            <CardContent sx={{ p: 2, flex: 1 }}>
              <Typography level="title-sm" fontWeight="bold">Propriedades</Typography>
              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                Gerenciar imóveis
              </Typography>
            </CardContent>
            <Avatar size="md" variant="soft" color="success" sx={{ m: 1.5 }}>
              <ForestIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: '100%',
              height: '100%',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'neutral.outlinedHoverBorder' },
              cursor: 'pointer',
              boxShadow: 'sm'
            }}
            onClick={() => navigate('/clientes')}
          >
            <CardContent sx={{ p: 2, flex: 1 }}>
              <Typography level="title-sm" fontWeight="bold">Clientes</Typography>
              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                Gerenciar clientes
              </Typography>
            </CardContent>
            <Avatar size="md" variant="soft" color="neutral" sx={{ m: 1.5 }}>
              <PersonRoundedIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Card>
        </Grid>
        
        <Grid xs={12} sm={6} md={3}>
          <Card
            variant="outlined"
            orientation="horizontal"
            sx={{
              width: '100%',
              height: '100%',
              '&:hover': { bgcolor: 'action.hover', borderColor: 'neutral.outlinedHoverBorder' },
              cursor: 'pointer',
              boxShadow: 'sm'
            }}
            onClick={() => navigate('/perfil')}
          >
            <CardContent sx={{ p: 2, flex: 1 }}>
              <Typography level="title-sm" fontWeight="bold">Meu Perfil</Typography>
              <Typography level="body-xs" sx={{ mt: 0.5 }}>
                Configurações de usuário
              </Typography>
            </CardContent>
            <Avatar size="md" variant="soft" color="primary" sx={{ m: 1.5 }}>
              <PersonRoundedIcon sx={{ fontSize: 18 }} />
            </Avatar>
          </Card>
        </Grid>
      </Grid>
    </Box>
  );
}
