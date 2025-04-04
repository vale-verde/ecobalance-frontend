import * as React from 'react';
import Box from '@mui/joy/Box';
import ListDivider from '@mui/joy/ListDivider';
import ListItem from '@mui/joy/ListItem';
import ListItemButton from '@mui/joy/ListItemButton';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Chip from '@mui/joy/Chip';
import IconButton from '@mui/joy/IconButton';
import Menu from '@mui/joy/Menu';
import MenuItem from '@mui/joy/MenuItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Divider from '@mui/joy/Divider';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import TagIcon from '@mui/icons-material/Tag';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import NumbersIcon from '@mui/icons-material/Numbers';
import { Cliente } from '../data/clientes';
import { toggleSidebar } from '../utils';

type ClienteListItemProps = {
  cliente: Cliente;
  isSelected?: boolean;
  onClick: () => void;
  onEdit?: () => void;
  onDelete?: () => void;
  onView?: () => void;
};

export default function ClienteListItem({
  cliente,
  isSelected = false,
  onClick,
  onEdit,
  onDelete,
  onView
}: ClienteListItemProps) {
  const isPF = cliente.tipoCliente === 'PF';
  const [menuAnchorEl, setMenuAnchorEl] = React.useState<null | HTMLElement>(null);
  const menuOpen = Boolean(menuAnchorEl);

  const handleMenuClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.stopPropagation();
    setMenuAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setMenuAnchorEl(null);
  };

  const handleViewClick = (event: React.MouseEvent) => {
    event.stopPropagation();
    if (onView) {
      onView();
    } else {
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
            onClick();
          }}
          selected={isSelected}
          color="neutral"
          sx={{ flexDirection: 'column', alignItems: 'initial', gap: 1, position: 'relative' }}
        >
          <Stack spacing={1} sx={{ width: '100%' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography level="title-md" sx={{ fontWeight: 'bold' }}>
                {cliente.nome}
              </Typography>
              <IconButton
                variant="plain"
                color="neutral"
                size="sm"
                onClick={handleMenuClick}
              >
                <MoreVertIcon fontSize="small" />
              </IconButton>
              <Menu
                anchorEl={menuAnchorEl}
                open={menuOpen}
                onClose={handleMenuClose}
                placement="bottom-end"
                sx={{ zIndex: 1500 }}
              >
                <MenuItem onClick={handleViewClick}>
                  <ListItemDecorator>
                    <VisibilityIcon fontSize="small" />
                  </ListItemDecorator>
                  Visualizar cliente
                </MenuItem>
                <MenuItem onClick={handleEditClick}>
                  <ListItemDecorator>
                    <EditIcon fontSize="small" />
                  </ListItemDecorator>
                  Editar cliente
                </MenuItem>
                <Divider />
                <MenuItem onClick={handleDeleteClick} color="danger">
                  <ListItemDecorator sx={{ color: 'inherit' }}>
                    <DeleteIcon fontSize="small" />
                  </ListItemDecorator>
                  Excluir cliente
                </MenuItem>
              </Menu>
            </Box>
            
            <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
              {isPF ? cliente.cpf : cliente.cnpj}
            </Typography>
            
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                variant="soft"
                color="neutral"
                size="sm"
                startDecorator={<NumbersIcon fontSize="small" />}
              >
                ID: {cliente.id}
              </Chip>
              
              <Chip
                variant="soft"
                color={isPF ? 'success' : 'primary'}
                size="sm"
                startDecorator={isPF ? <PersonIcon fontSize="small" /> : <BusinessIcon fontSize="small" />}
              >
                {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
              </Chip>
            </Box>
            
            <Typography level="body-xs" sx={{ color: 'text.tertiary', mt: 0.5 }}>
              Cadastrado em: {cliente.timestamp}
            </Typography>
          </Stack>
        </ListItemButton>
      </ListItem>
      <ListDivider sx={{ margin: 0 }} />
    </React.Fragment>
  );
} 