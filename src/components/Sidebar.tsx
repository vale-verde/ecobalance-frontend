import * as React from 'react';
import GlobalStyles from '@mui/joy/GlobalStyles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Card from '@mui/joy/Card';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import Input from '@mui/joy/Input';
import LinearProgress from '@mui/joy/LinearProgress';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemButton, { listItemButtonClasses } from '@mui/joy/ListItemButton';
import ListItemContent from '@mui/joy/ListItemContent';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import ReceiptRoundedIcon from '@mui/icons-material/ReceiptRounded';
import GroupRoundedIcon from '@mui/icons-material/GroupRounded';
import SupportRoundedIcon from '@mui/icons-material/SupportRounded';
import SettingsRoundedIcon from '@mui/icons-material/SettingsRounded';
import FolderRoundedIcon from '@mui/icons-material/FolderRounded';
import PersonRoundedIcon from '@mui/icons-material/PersonRounded';
import HomeWorkRoundedIcon from '@mui/icons-material/HomeWorkRounded';
import CloseRoundedIcon from '@mui/icons-material/CloseRounded';
import LogoutRoundedIcon from '@mui/icons-material/LogoutRounded';
import SpaRoundedIcon from '@mui/icons-material/SpaRounded';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import Tooltip from '@mui/joy/Tooltip';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';

import ColorSchemeToggle from './ColorSchemeToggle';
import { closeSidebar } from '../utils';

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

export default function Sidebar({ onNavigate, currentPage = 'dashboard' }: SidebarProps) {
  const [collapsed, setCollapsed] = React.useState(false);
  const [showToggleButton, setShowToggleButton] = React.useState(false);
  const searchInputRef = React.useRef<HTMLInputElement>(null);

  const toggleCollapse = () => {
    setCollapsed(!collapsed);
  };

  const handleSearchClick = () => {
    if (collapsed) {
      setCollapsed(false);
      // Focus the search input after the sidebar expands
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 300);
    }
  };

  // Style for consistent button and icon sizing in collapsed mode
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
    mx: 'auto', // Centraliza o botão horizontalmente
    position: 'relative', // Importante para o hover não ser cortado
    zIndex: 1, // Garantir que o hover fique visível
  };

  // Estilo adicional para garantir que o hover não seja cortado
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

  return (
    <Sheet
      className="Sidebar"
      sx={{
        position: { xs: 'fixed', md: 'sticky' },
        transform: {
          xs: 'translateX(calc(100% * (var(--SideNavigation-slideIn, 0) - 1)))',
          md: 'none',
        },
        transition: 'transform 0.4s, width 0.3s ease', // Smooth transition for width
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
      
      {/* Toggle button that appears on hover */}
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
      
      {/* Logo and header section */}
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
      
      {/* Search section */}
      <Box sx={{ 
        display: 'flex',
        justifyContent: 'center',
        overflow: 'visible' // Importante para o hover não ser cortado
      }}>
        {collapsed ? (
          <Tooltip
            title="Pesquisar"
            placement="right"
            variant="soft"
          >
            <IconButton
              size="md"
              onClick={handleSearchClick}
              sx={collapsedButtonStyle}
            >
              <SearchRoundedIcon sx={{ fontSize: 22 }} />
            </IconButton>
          </Tooltip>
        ) : (
          <Input 
            size="sm" 
            startDecorator={<SearchRoundedIcon />} 
            placeholder="Search" 
            slotProps={{
              input: {
                ref: searchInputRef
              }
            }}
            sx={{ width: '100%' }}
          />
        )}
      </Box>
      
      {/* Main navigation section */}
      <Box
        sx={{
          minHeight: 0,
          overflow: 'visible', // Alterado de 'hidden auto' para permitir que o hover seja visível fora do container
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          [`& .${listItemButtonClasses.root}`]: {
            gap: 1.5,
            transition: 'all 0.3s ease',
            width: '100%',
            '&:hover': {
              // Garantir que o hover não seja recortado
              overflow: 'visible',
            },
          },
        }}
      >
        {/* Main menu list */}
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
            overflow: 'visible', // Importante para o hover não ser cortado
            ...(collapsed && {
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }),
          }}
        >
          {/* Dashboard item */}
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Dashboard"
                placement="right"
                variant="soft"
                sx={{ zIndex: 10002 }}
              >
                <ListItemButton 
                  selected={currentPage === 'dashboard'}
                  onClick={() => onNavigate && onNavigate('dashboard')}
                  sx={buttonWithFullHover}
                >
                  <DashboardRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton 
                selected={currentPage === 'dashboard'}
                onClick={() => onNavigate && onNavigate('dashboard')}
                sx={{ 
                  width: '100%',
                  mx: 0
                }}
              >
                <DashboardRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Dashboard</Typography>
                </ListItemContent>
              </ListItemButton>
            )}
          </ListItem>

          {/* Ratificação item */}
          <ListItem 
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Ratificação"
                placement="right"
                variant="soft"
                sx={{ zIndex: 10002 }}
              >
                <ListItemButton 
                  selected={currentPage === 'ratificacao'}
                  onClick={() => onNavigate && onNavigate('ratificacao')}
                  sx={buttonWithFullHover}
                >
                  <ReceiptRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton 
                selected={currentPage === 'ratificacao'}
                onClick={() => onNavigate && onNavigate('ratificacao')}
                sx={{ 
                  width: '100%',
                  mx: 0
                }}
              >
                <ReceiptRoundedIcon />
                <ListItemContent>
                  <Typography level="title-sm">Ratificação</Typography>
                </ListItemContent>
              </ListItemButton>
            )}
          </ListItem>

          {/* Cadastros dropdown */}
          <ListItem 
            nested
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            <Toggler
              defaultExpanded={currentPage === 'clientes' || currentPage === 'propriedades'}
              renderToggle={({ open, setOpen }) => (
                collapsed ? (
                  <Tooltip
                    title="Cadastros"
                    placement="right"
                    variant="soft"
                    sx={{ zIndex: 10002 }}
                  >
                    <ListItemButton 
                      onClick={() => setOpen(!open)}
                      sx={buttonWithFullHover}
                    >
                      <FolderRoundedIcon sx={{ fontSize: 22 }} />
                    </ListItemButton>
                  </Tooltip>
                ) : (
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
                )
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
                      selected={currentPage === 'clientes'}
                      onClick={() => onNavigate && onNavigate('clientes')}
                      sx={{ 
                        width: '100%',
                        mx: 0
                      }}
                    >
                      <PersonRoundedIcon />
                      <ListItemContent>
                        <Typography level="title-sm">Clientes</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ 
                    px: 0
                  }}>
                    <ListItemButton
                      selected={currentPage === 'propriedades'}
                      onClick={() => onNavigate && onNavigate('propriedades')}
                      sx={{ 
                        width: '100%',
                        mx: 0
                      }}
                    >
                      <HomeWorkRoundedIcon />
                      <ListItemContent>
                        <Typography level="title-sm">Propriedades</Typography>
                      </ListItemContent>
                    </ListItemButton>
                  </ListItem>
                </List>
              )}
            </Toggler>
          </ListItem>
          
          {/* Usuários dropdown */}
          <ListItem 
            nested
            sx={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              p: collapsed ? 0 : undefined,
              px: 0,
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            <Toggler
              renderToggle={({ open, setOpen }) => (
                collapsed ? (
                  <Tooltip
                    title="Usuários"
                    placement="right"
                    variant="soft"
                    sx={{ zIndex: 10002 }}
                  >
                    <ListItemButton 
                      onClick={() => setOpen(!open)}
                      sx={buttonWithFullHover}
                    >
                      <GroupRoundedIcon sx={{ fontSize: 22 }} />
                    </ListItemButton>
                  </Tooltip>
                ) : (
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
                )
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
                      component="a"
                      href="/joy-ui/getting-started/templates/profile-dashboard/"
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
                    <ListItemButton sx={{ 
                      width: '100%',
                      mx: 0
                    }}>
                      Criar novo usuário
                    </ListItemButton>
                  </ListItem>
                  <ListItem sx={{ 
                    px: 0
                  }}>
                    <ListItemButton sx={{ 
                      width: '100%',
                      mx: 0
                    }}>
                      Usuários do sistema
                    </ListItemButton>
                  </ListItem>
                </List>
              )}
            </Toggler>
          </ListItem>
        </List>
        
        {/* Footer menu items (Support, Settings) */}
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
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Suporte"
                placement="right"
                variant="soft"
                sx={{ zIndex: 10002 }}
              >
                <ListItemButton
                  sx={buttonWithFullHover}
                >
                  <SupportRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton sx={{ 
                width: '100%',
                mx: 0
              }}>
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
              overflow: 'visible', // Importante para o hover não ser cortado
            }}
          >
            {collapsed ? (
              <Tooltip
                title="Configurações"
                placement="right"
                variant="soft"
                sx={{ zIndex: 10002 }}
              >
                <ListItemButton
                  sx={buttonWithFullHover}
                >
                  <SettingsRoundedIcon sx={{ fontSize: 22 }} />
                </ListItemButton>
              </Tooltip>
            ) : (
              <ListItemButton sx={{ 
                width: '100%',
                mx: 0
              }}>
                <SettingsRoundedIcon />
                Configurações
              </ListItemButton>
            )}
          </ListItem>
        </List>
      </Box>
      
      {/* User profile section */}
      <Divider />
      <Box sx={{ 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center',
        transition: 'all 0.3s ease',
        overflow: 'visible' // Importante para o hover não ser cortado
      }}>
        {!collapsed && (
          <>
            <Avatar
              variant="outlined"
              size="sm"
              src="https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=286"
            />
            <Box sx={{ minWidth: 0, flex: 1, ml: 1 }}>
              <Typography level="title-sm">Siriwat K.</Typography>
              <Typography level="body-xs">siriwatk@test.com</Typography>
            </Box>
          </>
        )}
        {collapsed ? (
          <Tooltip
            title="Logout"
            placement="right"
            variant="soft"
            sx={{ zIndex: 10002 }}
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
