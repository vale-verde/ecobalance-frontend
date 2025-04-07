import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import { Link as RouterLink, useLocation } from 'react-router-dom';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/joy/Tooltip';
import { Popper } from '@mui/base/Popper';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import FactCheckIcon from '@mui/icons-material/FactCheck';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';

/**
 * Componente Toggler para seções expansíveis na barra lateral
 */
function Toggler({
  defaultExpanded = false,
  renderToggle,
  children,
}: {
  defaultExpanded?: boolean;
  children: React.ReactNode;
  renderToggle: (params: {
    open: boolean;
    setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  }) => React.ReactNode;
}) {
  const [open, setOpen] = React.useState(defaultExpanded);
  return (
    <React.Fragment>
      {renderToggle({ open, setOpen })}
      <Box
        sx={[
          {
            display: 'grid',
            transition: '0.2s ease',
            '& > *': {
              overflow: 'hidden',
            },
          },
          open ? { gridTemplateRows: '1fr' } : { gridTemplateRows: '0fr' },
        ]}
      >
        {children}
      </Box>
    </React.Fragment>
  );
}

type SidebarProps = {
  onNavigate?: (page: string) => void;
  currentPage?: string;
};

/**
 * Componente de barra lateral que fornece navegação com estado recolhível
 * 
 * Funcionalidades:
 * - Barra lateral expansível/recolhível
 * - Tooltips para o estado recolhido
 * - Submenus flutuantes no estado recolhido
 * - Navegação aninhada com menus dropdown
 */
export default function Sidebar({ onNavigate, currentPage = 'dashboard' }: SidebarProps) {
  const location = useLocation();
  const activePath = location.pathname.substring(1) || 'dashboard';
  
  // Estados principais
  const [collapsed, setCollapsed] = React.useState(() => {
    // Recupera o estado da sidebar do localStorage
    const savedState = localStorage.getItem('sidebarCollapsed');
    return savedState ? JSON.parse(savedState) : false;
  });
  const [showToggleButton, setShowToggleButton] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);
  
  /**
   * Refs e estados para os submenus flutuantes
   */
  const cadastrosAnchorRef = React.useRef(null);
  const usuariosAnchorRef = React.useRef(null);
  const [cadastrosOpen, setCadastrosOpen] = React.useState(false);
  const [usuariosOpen, setUsuariosOpen] = React.useState(false);
  const [mouseInCadastrosMenu, setMouseInCadastrosMenu] = React.useState(false);
  const [mouseInUsuariosMenu, setMouseInUsuariosMenu] = React.useState(false);
  const cadastrosTimerRef = React.useRef<NodeJS.Timeout | null>(null);
  const usuariosTimerRef = React.useRef<NodeJS.Timeout | null>(null);

  /**
   * Alterna o estado recolhido da barra lateral
   */
  const toggleCollapse = () => {
    const newCollapsedState = !collapsed;
    setCollapsed(newCollapsedState);
    // Salva o estado no localStorage
    localStorage.setItem('sidebarCollapsed', JSON.stringify(newCollapsedState));
  };

  /**
   * Manipula o clique no ícone de pesquisa no estado recolhido
   */
  const handleSearchClick = () => {
    if (collapsed) {
      setCollapsed(false);
      // Atualiza o localStorage quando a sidebar é expandida pelo ícone de pesquisa
      localStorage.setItem('sidebarCollapsed', 'false');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  /**
   * Estilos compartilhados para botões no estado recolhido
   */
  const collapsedButtonStyle = {
    justifyContent: 'center',
    alignItems: 'center',
    height: '40px',
    width: '40px',
    minHeight: '40px',
    minWidth: '40px',
    maxWidth: '40px',
    padding: 0,
    borderRadius: '8px',
    mx: 'auto',
    position: 'relative',
    zIndex: 1,
  };

  const buttonWithFullHover = {
    ...collapsedButtonStyle,
    '&::before': {
      content: '""',
      display: 'block',
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      borderRadius: '8px',
      zIndex: -1,
    },
  };

  const popperStyles = {
    p: 0.75,
    boxShadow: 'sm',
    borderRadius: '6px',
    border: '1px solid',
    borderColor: 'divider',
    bgcolor: 'var(--joy-palette-background-surface)',
    minWidth: '180px',
  };
  
  const tooltipStyle = {
    zIndex: 10002,
    '--joy-shadowRing': '0 0 0 1px var(--joy-palette-divider)',
    '--Tooltip-background': 'var(--joy-palette-background-surface)',
    '--Tooltip-color': 'var(--joy-palette-text-primary)',
    '--Tooltip-borderRadius': '6px',
  };

  /**
   * Manipuladores de eventos para o menu flutuante de Cadastros
   */
  const handleCadastrosMouseEnter = () => {
    if (cadastrosTimerRef.current) {
      clearTimeout(cadastrosTimerRef.current);
      cadastrosTimerRef.current = null;
    }
    
    if (usuariosOpen) {
      setUsuariosOpen(false);
    }
    
    setCadastrosOpen(true);
  };

  const handleCadastrosMouseLeave = () => {
    if (!mouseInCadastrosMenu) {
      cadastrosTimerRef.current = setTimeout(() => {
        setCadastrosOpen(false);
      }, 300);
    }
  };

  const handleCadastrosMenuMouseEnter = () => {
    setMouseInCadastrosMenu(true);
    if (cadastrosTimerRef.current) {
      clearTimeout(cadastrosTimerRef.current);
      cadastrosTimerRef.current = null;
    }
  };

  const handleCadastrosMenuMouseLeave = () => {
    setMouseInCadastrosMenu(false);
    cadastrosTimerRef.current = setTimeout(() => {
      setCadastrosOpen(false);
    }, 300);
  };

  /**
   * Manipuladores de eventos para o menu flutuante de Usuários
   */
  const handleUsuariosMouseEnter = () => {
    if (usuariosTimerRef.current) {
      clearTimeout(usuariosTimerRef.current);
      usuariosTimerRef.current = null;
    }
    
    if (cadastrosOpen) {
      setCadastrosOpen(false);
    }
    
    setUsuariosOpen(true);
  };

  const handleUsuariosMouseLeave = () => {
    if (!mouseInUsuariosMenu) {
      usuariosTimerRef.current = setTimeout(() => {
        setUsuariosOpen(false);
      }, 300);
    }
  };

  const handleUsuariosMenuMouseEnter = () => {
    setMouseInUsuariosMenu(true);
    if (usuariosTimerRef.current) {
      clearTimeout(usuariosTimerRef.current);
      usuariosTimerRef.current = null;
    }
  };

  const handleUsuariosMenuMouseLeave = () => {
    setMouseInUsuariosMenu(false);
    usuariosTimerRef.current = setTimeout(() => {
      setUsuariosOpen(false);
    }, 300);
  };

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.3s ease',
        zIndex: 10000,
        height: '100dvh',
        width: collapsed ? 'var(--Sidebar-width-collapsed)' : 'var(--Sidebar-width)',
        top: 0,
        p: 2,
        flexShrink: 0,
        display: 'flex',
        flexDirection: 'column',
        gap: 2,
        borderRight: '1px solid',
        borderColor: 'divider',
        '&:hover': { '& .CollapseButton': { opacity: 1 } },
      }}
      onMouseEnter={() => setShowToggleButton(true)}
      onMouseLeave={() => setShowToggleButton(false)}
    >
      <GlobalStyles
        styles={(theme) => ({
          ':root': {
            '--Sidebar-width': '220px',
            '--Sidebar-width-collapsed': '72px',
            [theme.breakpoints.up('lg')]: {
              '--Sidebar-width': '240px',
            },
          },
        })}
      />
      <Box
        className="Sidebar-overlay"
        sx={{
          position: 'fixed',
          zIndex: 9998,
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          opacity: 'var(--SideNavigation-slideIn)',
          backgroundColor: 'var(--joy-palette-background-backdrop)',
          transition: 'opacity 0.4s',
          transform: {
            xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1) + var(--SideNavigation-slideIn, 0) * var(--Sidebar-width, 0px)))',
            lg: 'translateX(-100%)',
          },
        }}
        onClick={() => closeSidebar()}
      />
      
      {/* Botão de recolher/expandir */}
      {showToggleButton && (
        <IconButton
          className="CollapseButton"
          variant="soft"
          color="neutral"
          size="sm"
          onClick={toggleCollapse}
          sx={{
            position: 'absolute',
            right: '-16px',
            top: '50%',
            transform: 'translateY(-50%)',
            zIndex: 10001,
            borderRadius: '50%',
            backgroundColor: 'background.surface',
            boxShadow: 'sm',
            opacity: 0,
            transition: 'opacity 0.3s',
            border: '1px solid',
            borderColor: 'divider',
          }}
        >
          {collapsed ? <ChevronRightIcon /> : <ChevronLeftIcon />}
        </IconButton>
      )}
      
      {/* Seção do logotipo */}
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.3s ease'
      }}>
        <IconButton 
          variant="soft" 
          color="success" 
          size={collapsed ? "md" : "sm"}
          sx={{ 
            bgcolor: 'success.softBg',
            '&:hover': { bgcolor: 'success.softHoverBg' },
            transition: 'all 0.3s ease',
            ...(collapsed && collapsedButtonStyle)
          }}
        >
          <SpaRoundedIcon style={{ 
            color: '#21AA47', 
            fontSize: collapsed ? 22 : 18,
            transition: 'font-size 0.3s ease'
          }} />
        </IconButton>
        {!collapsed && (
          <>
            <Typography level="title-lg" sx={{ ml: 1 }}>Ecobalance</Typography>
            <ColorSchemeToggle sx={{ ml: 'auto' }} />
          </>
        )}
      </Box>
      
      {/* Seção de pesquisa */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        overflow: 'visible'
      }}>
        {collapsed ? (
          <Tooltip
            title="Pesquisar"
            placement="right"
            variant="soft"
            sx={tooltipStyle}
          >
            <IconButton
              size="md"
              onClick={handleSearchClick}
              sx={buttonWithFullHover}
            >
              <SearchRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Input 
            size="sm" 
            startDecorator={<SearchRoundedIcon />} 
            placeholder="Pesquisar" 
            slotProps={{
              input: {
                ref: searchInputRef
              }
            }}
            sx={{ width: '100%' }}
          />
        )}
      </Box>
      
      {/* Navegação principal */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'visible',
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
            transition: 'all 0.3s ease',
            width: '100%',
            '&:hover': {
              overflow: 'visible',
            },
          },
        }}
      >
        <List
          size="sm"
          sx={{
            gap: collapsed ? 2 : 1,
            '--List-nestedInsetStart': collapsed ? '0px' : '30px',
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            width: '100%',
            px: 0,
            pt: 0,
            pb: collapsed ? 1 : 0,
            overflow: 'visible',
            ...(collapsed && {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }),
          }}
        >
          {/* Item Dashboard */}
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Início"
                placement="right"
                variant="soft"
                sx={tooltipStyle}
              >
                <ListItemButton 
                  selected={activePath === 'home'}
                  component={RouterLink}
                  to="/home"
                  sx={buttonWithFullHover}
                >
                  <HomeRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton 
                selected={activePath === 'home'}
                component={RouterLink}
                to="/home"
                sx={{ 
                  width: '100%',
                  mx: 0
                }}
              >
                <HomeRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Início</Typography>
                </ListItemContent>
              </ListItemButton>
            )}
          </ListItem>

          {/* Item Ratificações */}
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Ratificações"
                placement="right"
                variant="soft"
                sx={tooltipStyle}
              >
                <ListItemButton 
                  selected={activePath === 'ratificacoes'}
                  component={RouterLink}
                  to="/ratificacoes"
                  sx={buttonWithFullHover}
                >
                  <FactCheckIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton 
                selected={activePath === 'ratificacoes'}
                component={RouterLink}
                to="/ratificacoes"
                sx={{ 
                  width: '100%',
                  mx: 0
                }}
              >
                <FactCheckIcon />
                <ListItemContent>
                  <Typography level="title-sm">Ratificações</Typography>
                </ListItemContent>
              </ListItemButton>
            )}
          </ListItem>

          {/* Submenu Cadastros */}
          <ListItem 
            nested
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Box sx={{ position: 'relative' }}>
                <ListItemButton 
                  ref={cadastrosAnchorRef}
                  sx={buttonWithFullHover}
                  onMouseEnter={handleCadastrosMouseEnter}
                  onMouseLeave={handleCadastrosMouseLeave}
                >
                  <FolderRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
                
                <Popper 
                  open={cadastrosOpen} 
                  anchorEl={cadastrosAnchorRef.current}
                  placement="right-start"
                  disablePortal
                  modifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8],
                      },
                    },
                  ]}
                  style={{ zIndex: 10003 }}
                >
                  <Sheet
                    variant="outlined"
                    sx={{
                      boxShadow: 'sm',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'var(--joy-palette-background-surface)',
                      minWidth: '180px',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={handleCadastrosMenuMouseEnter}
                    onMouseLeave={handleCadastrosMenuMouseLeave}
                  >
                    <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
                      <Typography level="title-sm" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Cadastros
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ width: '100%' }}>
                      <Box
                        onClick={() => onNavigate && onNavigate('clientes')}
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          width: '100%',
                          cursor: 'pointer',
                          display: 'block',
                          fontSize: '0.875rem',
                          ...(activePath === 'clientes' && {
                            bgcolor: 'var(--joy-palette-primary-softBg)',
                            color: 'var(--joy-palette-primary-softColor)',
                          }),
                          '&:hover': {
                            bgcolor: 'var(--joy-palette-neutral-softHoverBg)',
                          },
                        }}
                      >
                        Clientes
                      </Box>
                      <Box
                        onClick={() => onNavigate && onNavigate('propriedades')}
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          width: '100%',
                          cursor: 'pointer',
                          display: 'block',
                          fontSize: '0.875rem',
                          ...(activePath === 'propriedades' && {
                            bgcolor: 'var(--joy-palette-primary-softBg)',
                            color: 'var(--joy-palette-primary-softColor)',
                          }),
                          '&:hover': {
                            bgcolor: 'var(--joy-palette-neutral-softHoverBg)',
                          },
                        }}
                      >
                        Propriedades
                      </Box>
                    </Box>
                  </Sheet>
                </Popper>
              </Box>
            ) : (
              <Toggler
                defaultExpanded={activePath === 'clientes' || activePath === 'propriedades'}
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    sx={{ 
                      width: '100%',
                      mx: 0
                    }}
                  >
                    <FolderRoundedIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Cadastros</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={[
                        open
                          ? {
                              transform: 'rotate(180deg)',
                            }
                          : {
                              transform: 'none',
                            },
                      ]}
                    />
                  </ListItemButton>
                )}
              >
                {!collapsed && (
                  <List sx={{ 
                    gap: 0.5, 
                    width: '100%',
                    pl: 2,
                    pr: 0
                  }}>
                    <ListItem sx={{ 
                      mt: 0.5,
                      px: 0
                    }}>
                      <ListItemButton
                        selected={activePath === 'clientes'}
                        component={RouterLink}
                        to="/clientes"
                        sx={{ 
                          width: '100%',
                          mx: 0
                        }}
                      >
                        <ListItemContent>
                          <Typography level="title-sm">Clientes</Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ 
                      px: 0
                    }}>
                      <ListItemButton
                        selected={activePath === 'propriedades'}
                        component={RouterLink}
                        to="/propriedades"
                        sx={{ 
                          width: '100%',
                          mx: 0
                        }}
                      >
                        <ListItemContent>
                          <Typography level="title-sm">Propriedades</Typography>
                        </ListItemContent>
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Toggler>
            )}
          </ListItem>
          
          {/* Submenu Usuários */}
          <ListItem 
            nested
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Box sx={{ position: 'relative' }}>
                <ListItemButton 
                  ref={usuariosAnchorRef}
                  sx={buttonWithFullHover}
                  onMouseEnter={handleUsuariosMouseEnter}
                  onMouseLeave={handleUsuariosMouseLeave}
                >
                  <GroupRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
                
                <Popper 
                  open={usuariosOpen} 
                  anchorEl={usuariosAnchorRef.current}
                  placement="right-start"
                  disablePortal
                  modifiers={[
                    {
                      name: 'offset',
                      options: {
                        offset: [0, 8],
                      },
                    },
                  ]}
                  style={{ zIndex: 10003 }}
                >
                  <Sheet
                    variant="outlined"
                    sx={{
                      boxShadow: 'sm',
                      borderRadius: '6px',
                      border: '1px solid',
                      borderColor: 'divider',
                      bgcolor: 'var(--joy-palette-background-surface)',
                      minWidth: '180px',
                      overflow: 'hidden',
                    }}
                    onMouseEnter={handleUsuariosMenuMouseEnter}
                    onMouseLeave={handleUsuariosMenuMouseLeave}
                  >
                    <Box sx={{ px: 1.5, pt: 1, pb: 0.5 }}>
                      <Typography level="title-sm" sx={{ fontWeight: 'bold', fontSize: '0.875rem' }}>
                        Usuários
                      </Typography>
                    </Box>
                    <Divider />
                    <Box sx={{ width: '100%' }}>
                      <Box
                        component={RouterLink}
                        to="/perfil"
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          width: '100%',
                          cursor: 'pointer',
                          display: 'block',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            bgcolor: 'var(--joy-palette-neutral-softHoverBg)',
                          },
                        }}
                        onClick={() => {
                          setUsuariosOpen(false);
                        }}
                      >
                        Meu perfil
                      </Box>
                      <Box
                        component={RouterLink}
                        to="/novo-usuario"
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          width: '100%',
                          cursor: 'pointer',
                          display: 'block',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            bgcolor: 'var(--joy-palette-neutral-softHoverBg)',
                          },
                        }}
                        onClick={() => {
                          setUsuariosOpen(false);
                        }}
                      >
                        Criar novo usuário
                      </Box>
                      <Box
                        component={RouterLink}
                        to="/usuarios"
                        sx={{
                          py: 0.5,
                          px: 1.5,
                          width: '100%',
                          cursor: 'pointer',
                          display: 'block',
                          fontSize: '0.875rem',
                          textDecoration: 'none',
                          color: 'inherit',
                          '&:hover': {
                            bgcolor: 'var(--joy-palette-neutral-softHoverBg)',
                          },
                        }}
                        onClick={() => {
                          setUsuariosOpen(false);
                        }}
                      >
                        Usuários do sistema
                      </Box>
                    </Box>
                  </Sheet>
                </Popper>
              </Box>
            ) : (
              <Toggler
                renderToggle={({ open, setOpen }) => (
                  <ListItemButton 
                    onClick={() => setOpen(!open)}
                    sx={{ 
                      width: '100%',
                      mx: 0
                    }}
                  >
                    <GroupRoundedIcon />
                    <ListItemContent>
                      <Typography level="title-sm">Usuários</Typography>
                    </ListItemContent>
                    <KeyboardArrowDownIcon
                      sx={[
                        open
                          ? {
                              transform: 'rotate(180deg)',
                            }
                          : {
                              transform: 'none',
                            },
                      ]}
                    />
                  </ListItemButton>
                )}
              >
                {!collapsed && (
                  <List sx={{ 
                    gap: 0.5, 
                    width: '100%',
                    pl: 2,
                    pr: 0
                  }}>
                    <ListItem sx={{ 
                      mt: 0.5,
                      px: 0
                    }}>
                      <ListItemButton
                        role="menuitem"
                        component={RouterLink}
                        to="/perfil"
                        selected={activePath === 'perfil'}
                        sx={{ 
                          width: '100%',
                          mx: 0
                        }}
                      >
                        Meu perfil
                      </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ 
                      px: 0
                    }}>
                      <ListItemButton 
                        component={RouterLink}
                        to="/novo-usuario"
                        selected={activePath === 'novo-usuario'}
                        sx={{ 
                          width: '100%',
                          mx: 0
                        }}
                      >
                        Criar novo usuário
                      </ListItemButton>
                    </ListItem>
                    <ListItem sx={{ 
                      px: 0
                    }}>
                      <ListItemButton 
                        component={RouterLink}
                        to="/usuarios"
                        selected={activePath === 'usuarios'}
                        sx={{ 
                          width: '100%',
                          mx: 0
                        }}
                      >
                        Usuários do sistema
                      </ListItemButton>
                    </ListItem>
                  </List>
                )}
              </Toggler>
            )}
          </ListItem>
        </List>
        
        {/* Itens de navegação do rodapé */}
        <List
          size="sm"
          sx={{
            mt: 'auto',
            flexGrow: 0,
            '--ListItem-radius': (theme) => theme.vars.radius.sm,
            '--List-gap': collapsed ? '16px' : '8px',
            mb: 2,
            width: '100%',
            px: 0,
            pt: 0,
            pb: collapsed ? 1 : 0,
            ...(collapsed && {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }),
          }}
        >
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Suporte"
                placement="right"
                variant="soft"
                sx={tooltipStyle}
              >
                <ListItemButton
                  sx={buttonWithFullHover}
                  component={RouterLink}
                  to="/suporte"
                  selected={activePath === 'suporte'}
                >
                  <SupportRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton sx={{ 
                width: '100%',
                mx: 0
              }}
              component={RouterLink}
              to="/suporte"
              selected={activePath === 'suporte'}
              >
                <SupportRoundedIcon />
                Suporte
              </ListItemButton>
            )}
          </ListItem>
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible',
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Configurações"
                placement="right"
                variant="soft"
                sx={tooltipStyle}
              >
                <ListItemButton
                  sx={buttonWithFullHover}
                  component={RouterLink}
                  to="/configuracoes"
                  selected={activePath === 'configuracoes'}
                >
                  <SettingsRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton 
                sx={{ 
                  width: '100%',
                  mx: 0
                }}
                component={RouterLink}
                to="/configuracoes"
                selected={activePath === 'configuracoes'}
              >
                <SettingsRoundedIcon />
                Configurações
              </ListItemButton>
            )}
          </ListItem>
        </List>
      </Box>
      
      {/* Seção de perfil do usuário */}
      <Divider />
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        overflow: 'visible'
      }}>
        {!collapsed && (
          <>
            <Avatar
              variant="outlined"
              size="sm"
              src="https://lh3.googleusercontent.com/a/ACg8ocIvQHS-a-PBDviMxWNSq1adyPKhq-eOFexRxggfZFpoYuOGEG1D=s288-c-no"
            />
            <Box sx={{ minWidth: 0, flex: 1, ml: 1 }}>
              <Typography level="title-sm">John Silverio</Typography>
              <Typography level="body-xs">john@v2carbon.com</Typography>
            </Box>
          </>
        )}
        {collapsed ? (
          <Tooltip
            title="Sair"
            placement="right"
            variant="soft"
            sx={tooltipStyle}
          >
            <IconButton 
              size="md" 
              variant="plain" 
              color="neutral"
              sx={buttonWithFullHover}
            >
              <LogoutRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <IconButton size="sm" variant="plain" color="neutral">
            <LogoutRoundedIcon />
          </IconButton>
        )}
      </Box>
    </Sheet>
  );
}
