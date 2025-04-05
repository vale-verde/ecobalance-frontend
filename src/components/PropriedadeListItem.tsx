import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import ListDivider from '@mui/joy/ListDivider';
import Stack from '@mui/joy/Stack';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Divider from '@mui/joy/Divider';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import VisibilityIcon from '@mui/icons-material/Visibility';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import BusinessIcon from '@mui/icons-material/Business';
import NumbersIcon from '@mui/icons-material/Numbers';
import TagIcon from '@mui/icons-material/Tag';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import { Propriedade } from '../data/propriedades';
import { toggleSidebar } from '../utils';

/**
 * Props para o componente PropriedadeListItem
 */
type PropriedadeListItemProps = {
  propriedade: Propriedade;
  isSelected?: boolean;
  onClick?: () => void;
  onView?: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
};

/**
 * Componente de item de lista para exibir uma propriedade na lista de propriedades
 */
export default function PropriedadeListItem({
  propriedade,
  isSelected = false,
  onClick,
  onView,
  onEdit,
  onDelete
}: PropriedadeListItemProps) {
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);
  const menuRef = React.useRef<HTMLDivElement>(null);

  /**
   * Efeito para detectar cliques fora do menu e fechá-lo
   */
  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node) && menuOpen) {
        setMenuAnchorEl(null);
      }
    }

    if (menuOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [menuOpen]);

  /**
   * Manipuladores de eventos para o menu de ações
   */
  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    if (menuOpen) {
      setMenuAnchorEl(null);
    } else {
      setMenuAnchorEl(event.currentTarget);
    }
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onView) {
      onView();
    } else if (onClick) {
      onClick(); // Default to onClick if onView not provided
    }
    handleMenuClose();
  };

  const handleEditClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onEdit) {
      onEdit();
    }
    handleMenuClose();
  };

  const handleDeleteClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onDelete) {
      onDelete();
    }
    handleMenuClose();
  };
  
  return (
    <React.Fragment>
      <ListItem>
        <ListItemButton
          onClick={() => {
            toggleSidebar();
            if (onView) {
              onView();
            } else if (onClick) {
              onClick();
            }
          }}
          selected={isSelected}
          color="neutral"
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1, position: 'relative' }}
        >
          {/* Conteúdo principal do item */}
          <Stack spacing={1} sx={{ width: '100%' }}>
            {/* Cabeçalho com nome e menu de ações */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                {propriedade.nome}
              </Typography>
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={handleMenuClick}
                aria-label="Opções"
                sx={{
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: 'primary.softBg',
                    color: 'primary.500',
                  },
                  ...(menuOpen && {
                    bgcolor: 'primary.softBg',
                    color: 'primary.500',
                  })
                }}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              
              {/* Menu de ações */}
              <Menu
                ref={menuRef}
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                placement="bottom-end"
                sx={{ 
                  zIndex: 1500,
                  '--Menu-decoratorWidth': '2rem',
                }}
              >
                <MenuItem onClick={handleViewClick}>
                  <ListItemDecorator>
                    <VisibilityIcon fontSize="small" />
                  </ListItemDecorator>
                  Visualizar propriedade
                </MenuItem>
                <MenuItem onClick={handleEditClick}>
                  <ListItemDecorator>
                    <EditIcon fontSize="small" />
                  </ListItemDecorator>
                  Editar propriedade
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteClick} color="danger">
                  <ListItemDecorator sx={{ color: 'inherit' }}>
                    <DeleteIcon fontSize="small" />
                  </ListItemDecorator>
                  Excluir propriedade
                </MenuItem>
              </Menu>
            </Box>
            
            {/* Matrícula da propriedade */}
            <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
              {propriedade.matricula}
            </Typography>
            
            {/* Tags/chips de informação */}
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<NumbersIcon fontSize="small" />}
              >
                ID: {propriedade.id}
              </Chip>
              
              <Chip
                variant="soft"
                color="primary"
                size="sm"
                startDecorator={<LocationOnIcon fontSize="small" />}
              >
                {propriedade.comarca || 'Sem comarca'}
              </Chip>
            </Box>
            
            {/* Data de registro */}
            <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.5 }}>
              Registro em: {propriedade.dataRegistro}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
} 