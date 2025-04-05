import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Table from '@mui/joy/Table';
import Avatar from '@mui/joy/Avatar';
import Chip from '@mui/joy/Chip';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import IconButton from '@mui/joy/IconButton';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Divider from '@mui/joy/Divider';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import Alert from '@mui/joy/Alert';
import Snackbar from '@mui/joy/Snackbar';
import Checkbox from '@mui/joy/Checkbox';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/Card';

// Icons
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import SearchIcon from '@mui/icons-material/Search';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import DeveloperModeIcon from '@mui/icons-material/DeveloperMode';
import PersonIcon from '@mui/icons-material/Person';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import BlockIcon from '@mui/icons-material/Block';
import ToggleOnIcon from '@mui/icons-material/ToggleOn';
import ToggleOffIcon from '@mui/icons-material/ToggleOff';
import WarningIcon from '@mui/icons-material/Warning';

import { 
  Usuario, 
  UserRole, 
  rolePermissions,
  UsuarioFilterOptions,
  UsuarioSortOptions,
  UsuarioPaginationOptions
} from '../data/usuarios';
import { 
  getUsuarios, 
  toggleUsuarioStatus,
  deleteUsuario 
} from '../services/usuarioService';

/**
 * Página de administração de usuários do sistema
 */
export default function UsuariosPage() {
  // Estados para dados, filtros, ordenação e paginação
  const [users, setUsers] = React.useState<Usuario[]>([]);
  const [filteredUsers, setFilteredUsers] = React.useState<Usuario[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [totalItems, setTotalItems] = React.useState(0);
  const [totalPages, setTotalPages] = React.useState(1);
  
  const [filters, setFilters] = React.useState<UsuarioFilterOptions>({
    status: 'all',
    role: 'all',
  });
  
  const [sort, setSort] = React.useState<UsuarioSortOptions>({
    field: 'nome',
    direction: 'asc',
  });
  
  const [pagination, setPagination] = React.useState<UsuarioPaginationOptions>({
    page: 1,
    itemsPerPage: 10,
  });
  
  const [searchTerm, setSearchTerm] = React.useState('');
  
  // Estados para modais
  const [deleteModalOpen, setDeleteModalOpen] = React.useState(false);
  const [selectedUser, setSelectedUser] = React.useState<Usuario | null>(null);
  const [openFiltersModal, setOpenFiltersModal] = React.useState(false);
  
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
  
  // Estados para seleção
  const [selected, setSelected] = React.useState<string[]>([]);
  
  // Estatísticas de usuários
  const userStats = React.useMemo(() => {
    if (!users.length) return { total: 0, active: 0, inactive: 0 };
    
    return {
      total: users.length,
      active: users.filter(user => user.status === 'ativo').length,
      inactive: users.filter(user => user.status === 'inativo').length,
      admin: users.filter(user => user.role === 'administrador').length,
      dev: users.filter(user => user.role === 'desenvolvedor').length,
      member: users.filter(user => user.role === 'membro').length,
    };
  }, [users]);
  
  // Carregar usuários
  const loadUsers = React.useCallback(async () => {
    setLoading(true);
    try {
      const response = await getUsuarios(
        { 
          ...filters, 
          searchTerm: searchTerm.trim() || undefined
        },
        sort,
        pagination
      );
      
      setUsers(response.items);
      setFilteredUsers(response.items);
      setTotalItems(response.totalItems);
      setTotalPages(response.totalPages);
    } catch (error) {
      console.error('Error fetching users:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao carregar usuários',
        color: 'danger',
      });
    } finally {
      setLoading(false);
    }
  }, [filters, searchTerm, sort, pagination]);
  
  // Carregar dados iniciais
  React.useEffect(() => {
    loadUsers();
  }, [loadUsers]);
  
  // Atualizar tabela ao alterar paginação, filtros, ordenação
  React.useEffect(() => {
    loadUsers();
  }, [pagination.page, pagination.itemsPerPage, filters, sort, loadUsers]);
  
  // Manipulador de busca
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPagination(prev => ({ ...prev, page: 1 }));
    loadUsers();
  };
  
  // Manipulador de alteração de ordenação
  const handleSortChange = (field: keyof Usuario) => {
    setSort(prev => ({
      field,
      direction: prev.field === field && prev.direction === 'asc' ? 'desc' : 'asc',
    }));
  };
  
  // Manipulador de alteração de página
  const handlePageChange = (newPage: number) => {
    setPagination(prev => ({ ...prev, page: newPage }));
  };
  
  // Manipulador para alternar status do usuário
  const handleToggleStatus = async (userId: string) => {
    try {
      await toggleUsuarioStatus(userId);
      loadUsers();
      setSnackbar({
        open: true,
        message: 'Status do usuário alterado com sucesso',
        color: 'success',
      });
    } catch (error) {
      console.error('Error toggling user status:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao alterar status do usuário',
        color: 'danger',
      });
    }
  };
  
  // Manipulador para excluir usuário
  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    
    try {
      await deleteUsuario(selectedUser.id);
      loadUsers();
      setSnackbar({
        open: true,
        message: 'Usuário excluído com sucesso',
        color: 'success',
      });
      setDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting user:', error);
      setSnackbar({
        open: true,
        message: 'Erro ao excluir usuário',
        color: 'danger',
      });
    }
  };
  
  // Ícone para tipo de usuário
  const getRoleIcon = (role: UserRole) => {
    switch (role) {
      case 'administrador':
        return <AdminPanelSettingsIcon sx={{ color: 'danger.500' }} />;
      case 'desenvolvedor':
        return <DeveloperModeIcon sx={{ color: 'primary.500' }} />;
      case 'membro':
        return <PersonIcon sx={{ color: 'success.500' }} />;
      default:
        return <PersonIcon />;
    }
  };
  
  // Menu de ações para cada linha
  const RowMenu = ({ user }: { user: Usuario }) => {
    return (
      <Dropdown>
        <MenuButton
          slots={{ root: IconButton }}
          slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
        >
          <MoreHorizRoundedIcon />
        </MenuButton>
        <Menu size="sm" sx={{ minWidth: 180 }}>
          <MenuItem onClick={() => alert('Visualizar usuário')}>
            <VisibilityIcon fontSize="small" sx={{ mr: 1 }} />
            Visualizar
          </MenuItem>
          <MenuItem onClick={() => alert('Editar usuário')}>
            <EditIcon fontSize="small" sx={{ mr: 1 }} />
            Editar
          </MenuItem>
          <MenuItem onClick={() => handleToggleStatus(user.id)}>
            {user.status === 'ativo' ? (
              <>
                <ToggleOffIcon fontSize="small" sx={{ mr: 1, color: 'danger.500' }} />
                Desativar
              </>
            ) : (
              <>
                <ToggleOnIcon fontSize="small" sx={{ mr: 1, color: 'success.500' }} />
                Ativar
              </>
            )}
          </MenuItem>
          <Divider />
          <MenuItem 
            color="danger" 
            onClick={() => {
              setSelectedUser(user);
              setDeleteModalOpen(true);
            }}
          >
            <DeleteIcon fontSize="small" sx={{ mr: 1 }} />
            Excluir
          </MenuItem>
        </Menu>
      </Dropdown>
    );
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
            Usuários do Sistema
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
        <Typography level="h2" component="h1" startDecorator={<PeopleAltIcon />}>
          Usuários do Sistema
        </Typography>
        <Button
          color="primary"
          startDecorator={<PersonAddIcon />}
          size="sm"
          component={Link}
          href="#novo-usuario"
        >
          Novo Usuário
        </Button>
      </Box>
      
      {/* Resumo de estatísticas */}
      <Box sx={{ mb: 2 }}>
        <Grid container spacing={2}>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2
              }}>
                <Box>
                  <Typography level="body-sm" fontWeight="md" textColor="text.secondary">Total de Usuários</Typography>
                  <Typography level="h2" sx={{ mt: 1, mb: 0.5 }}>{userStats.total}</Typography>
                </Box>
                <Avatar 
                  color="primary" 
                  variant="soft"
                  sx={{ ml: 2 }}
                >
                  <PeopleAltIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2
              }}>
                <Box>
                  <Typography level="body-sm" fontWeight="md" textColor="text.secondary">Usuários Ativos</Typography>
                  <Typography level="h2" sx={{ mt: 1, mb: 0.5 }}>{userStats.active}</Typography>
                </Box>
                <Avatar 
                  color="success" 
                  variant="soft"
                  sx={{ ml: 2 }}
                >
                  <PersonIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2
              }}>
                <Box>
                  <Typography level="body-sm" fontWeight="md" textColor="text.secondary">Usuários Inativos</Typography>
                  <Typography level="h2" sx={{ mt: 1, mb: 0.5 }}>{userStats.inactive}</Typography>
                </Box>
                <Avatar 
                  color="neutral" 
                  variant="soft"
                  sx={{ ml: 2 }}
                >
                  <PersonOffIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
          <Grid xs={12} sm={6} md={3}>
            <Card variant="outlined" sx={{ height: '100%' }}>
              <CardContent sx={{ 
                display: 'flex', 
                flexDirection: 'row',
                alignItems: 'center', 
                justifyContent: 'space-between',
                p: 2
              }}>
                <Box>
                  <Typography level="body-sm" fontWeight="md" textColor="text.secondary">Administradores</Typography>
                  <Typography level="h2" sx={{ mt: 1, mb: 0.5 }}>{userStats.admin || 0}</Typography>
                </Box>
                <Avatar 
                  color="danger" 
                  variant="soft"
                  sx={{ ml: 2 }}
                >
                  <AdminPanelSettingsIcon />
                </Avatar>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
      
      {/* Barra de busca e filtros para desktop/tablet */}
      <Box
        sx={{
          display: { xs: 'none', sm: 'flex' },
          my: 2,
          gap: 2,
          alignItems: 'flex-end',
          flexWrap: 'wrap',
        }}
      >
        <FormControl sx={{ flexGrow: 1, minWidth: '200px' }}>
          <FormLabel>Buscar Usuário</FormLabel>
          <form onSubmit={handleSearch}>
            <Input
              placeholder="Nome, e-mail, departamento..."
              startDecorator={<SearchIcon />}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              fullWidth
              endDecorator={
                searchTerm && (
                  <IconButton variant="plain" onClick={() => setSearchTerm('')}>
                    &times;
                  </IconButton>
                )
              }
            />
          </form>
        </FormControl>
        
        <FormControl sx={{ minWidth: '120px' }}>
          <FormLabel>Função</FormLabel>
          <Select
            placeholder="Todos"
            value={filters.role || 'all'}
            onChange={(_, value) => {
              setFilters(prev => ({
                ...prev,
                role: value as UserRole | 'all',
              }));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="administrador">Administrador</Option>
            <Option value="desenvolvedor">Desenvolvedor</Option>
            <Option value="membro">Membro</Option>
          </Select>
        </FormControl>
        
        <FormControl sx={{ minWidth: '120px' }}>
          <FormLabel>Status</FormLabel>
          <Select
            placeholder="Todos"
            value={filters.status || 'all'}
            onChange={(_, value) => {
              setFilters(prev => ({
                ...prev,
                status: value as 'ativo' | 'inativo' | 'all',
              }));
              setPagination(prev => ({ ...prev, page: 1 }));
            }}
          >
            <Option value="all">Todos</Option>
            <Option value="ativo">Ativos</Option>
            <Option value="inativo">Inativos</Option>
          </Select>
        </FormControl>
      </Box>
      
      {/* Barra de busca para dispositivos móveis */}
      <Box
        sx={{
          display: { xs: 'flex', sm: 'none' },
          my: 2,
          gap: 2,
        }}
      >
        <form onSubmit={handleSearch} style={{ display: 'flex', flex: 1, gap: 8 }}>
          <Input
            placeholder="Buscar usuário..."
            startDecorator={<SearchIcon />}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ flexGrow: 1 }}
          />
          <IconButton variant="outlined" onClick={() => setOpenFiltersModal(true)}>
            <FilterAltIcon />
          </IconButton>
        </form>
      </Box>
      
      {/* Tabela de usuários */}
      <Sheet
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
        }}
      >
        <Table
          aria-labelledby="tableTitle"
          stickyHeader
          hoverRow
          sx={{
            '--TableCell-headBackground': 'var(--joy-palette-background-level1)',
            '--Table-headerUnderlineThickness': '1px',
            '--TableRow-hoverBackground': 'var(--joy-palette-background-level1)',
            '--TableCell-paddingY': '4px',
            '--TableCell-paddingX': '8px',
          }}
        >
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== filteredUsers.length
                  }
                  checked={selected.length === filteredUsers.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? filteredUsers.map((user) => user.id) : [],
                    );
                  }}
                  sx={{ verticalAlign: 'middle' }}
                />
              </th>
              <th style={{ width: 240, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('nome')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Usuário</Typography>
                  {sort.field === 'nome' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 160, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('cargo')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Cargo</Typography>
                  {sort.field === 'cargo' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 160, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('departamento')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Departamento</Typography>
                  {sort.field === 'departamento' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 120, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('role')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Função</Typography>
                  {sort.field === 'role' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 100, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('status')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Status</Typography>
                  {sort.field === 'status' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 140, padding: '12px 6px', cursor: 'pointer' }}
                onClick={() => handleSortChange('dataCriacao')}
              >
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <Typography level="title-sm">Data de Criação</Typography>
                  {sort.field === 'dataCriacao' && (
                    sort.direction === 'asc' ? (
                      <ArrowUpwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    ) : (
                      <ArrowDownwardIcon fontSize="small" sx={{ ml: 0.5 }} />
                    )
                  )}
                </Box>
              </th>
              <th style={{ width: 80, padding: '12px 6px' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                  <Typography level="body-sm">Carregando usuários...</Typography>
                </td>
              </tr>
            ) : filteredUsers.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '1rem' }}>
                  <Typography level="body-sm">Nenhum usuário encontrado</Typography>
                </td>
              </tr>
            ) : (
              filteredUsers.map((user) => (
                <tr key={user.id}>
                  <td style={{ textAlign: 'center' }}>
                    <Checkbox
                      size="sm"
                      checked={selected.includes(user.id)}
                      onChange={(event) => {
                        setSelected((ids) =>
                          event.target.checked
                            ? [...ids, user.id]
                            : ids.filter((id) => id !== user.id)
                        );
                      }}
                      sx={{ verticalAlign: 'middle' }}
                    />
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar size="sm" src={user.avatar}>
                        {user.nome.charAt(0)}
                      </Avatar>
                      <div>
                        <Typography level="body-sm" sx={{ fontWeight: 'md' }}>
                          {user.nome}
                        </Typography>
                        <Typography level="body-xs">
                          {user.email}
                        </Typography>
                      </div>
                    </Box>
                  </td>
                  <td>
                    <Typography level="body-sm">{user.cargo}</Typography>
                  </td>
                  <td>
                    <Typography level="body-sm">{user.departamento}</Typography>
                  </td>
                  <td>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                      {getRoleIcon(user.role)}
                      <Typography level="body-sm">
                        {rolePermissions[user.role].label}
                      </Typography>
                    </Box>
                  </td>
                  <td>
                    <Chip
                      size="sm"
                      variant="soft"
                      color={user.status === 'ativo' ? 'success' : 'neutral'}
                    >
                      {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                    </Chip>
                  </td>
                  <td>
                    <Typography level="body-sm">{user.dataCriacao}</Typography>
                  </td>
                  <td>
                    <RowMenu user={user} />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </Table>
      </Sheet>
      
      {/* Lista no formato mobile */}
      <Box sx={{ display: { xs: 'block', sm: 'none' }, mt: 2 }}>
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography level="body-sm">Carregando usuários...</Typography>
          </Box>
        ) : filteredUsers.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 3 }}>
            <Typography level="body-sm">Nenhum usuário encontrado</Typography>
          </Box>
        ) : (
          filteredUsers.map((user) => (
            <Card
              key={user.id}
              variant="outlined"
              sx={{ mb: 2 }}
            >
              <Box sx={{ p: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm" src={user.avatar}>
                      {user.nome.charAt(0)}
                    </Avatar>
                    <Box>
                      <Typography level="title-sm">{user.nome}</Typography>
                      <Typography level="body-xs">{user.email}</Typography>
                    </Box>
                  </Box>
                  <Chip
                    size="sm"
                    variant="soft"
                    color={user.status === 'ativo' ? 'success' : 'neutral'}
                  >
                    {user.status === 'ativo' ? 'Ativo' : 'Inativo'}
                  </Chip>
                </Box>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Grid container spacing={1}>
                  <Grid xs={6}>
                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>Cargo</Typography>
                    <Typography level="body-sm">{user.cargo}</Typography>
                  </Grid>
                  <Grid xs={6}>
                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>Departamento</Typography>
                    <Typography level="body-sm">{user.departamento}</Typography>
                  </Grid>
                  <Grid xs={6} sx={{ mt: 1 }}>
                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>Função</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mt: 0.5 }}>
                      {getRoleIcon(user.role)}
                      <Typography level="body-sm">
                        {rolePermissions[user.role].label}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid xs={6} sx={{ mt: 1 }}>
                    <Typography level="body-xs" sx={{ color: 'text.secondary' }}>Data de Criação</Typography>
                    <Typography level="body-sm">{user.dataCriacao}</Typography>
                  </Grid>
                </Grid>
                
                <Divider sx={{ my: 1.5 }} />
                
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 1 }}>
                  <IconButton 
                    size="sm" 
                    variant="plain" 
                    color="neutral"
                    onClick={() => alert('Visualizar usuário')}
                  >
                    <VisibilityIcon />
                  </IconButton>
                  <IconButton 
                    size="sm" 
                    variant="plain" 
                    color="neutral"
                    onClick={() => alert('Editar usuário')}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton 
                    size="sm" 
                    variant="plain" 
                    color={user.status === 'ativo' ? 'danger' : 'success'}
                    onClick={() => handleToggleStatus(user.id)}
                  >
                    {user.status === 'ativo' ? <ToggleOffIcon /> : <ToggleOnIcon />}
                  </IconButton>
                  <IconButton 
                    size="sm" 
                    variant="plain" 
                    color="danger"
                    onClick={() => {
                      setSelectedUser(user);
                      setDeleteModalOpen(true);
                    }}
                  >
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Card>
          ))
        )}
      </Box>
      
      {/* Paginação */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mt: 2,
        }}
      >
        <IconButton
          aria-label="página anterior"
          variant="outlined"
          color="neutral"
          size="sm"
          disabled={pagination.page <= 1}
          onClick={() => handlePageChange(pagination.page - 1)}
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm" sx={{ mx: 2 }}>
          Página {pagination.page} de {totalPages}
        </Typography>
        <IconButton
          aria-label="próxima página"
          variant="outlined"
          color="neutral"
          size="sm"
          disabled={pagination.page >= totalPages}
          onClick={() => handlePageChange(pagination.page + 1)}
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
      
      {/* Modal de filtros para mobile */}
      <Modal open={openFiltersModal} onClose={() => setOpenFiltersModal(false)}>
        <ModalDialog 
          aria-labelledby="filter-modal" 
          layout="fullscreen"
          sx={{ maxWidth: 'sm', mx: 'auto' }}
        >
          <ModalClose />
          <Typography id="filter-modal" level="h2">
            Filtros
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Função</FormLabel>
              <Select
                placeholder="Todos"
                value={filters.role || 'all'}
                onChange={(_, value) => {
                  setFilters(prev => ({
                    ...prev,
                    role: value as UserRole | 'all',
                  }));
                }}
              >
                <Option value="all">Todos</Option>
                <Option value="administrador">Administrador</Option>
                <Option value="desenvolvedor">Desenvolvedor</Option>
                <Option value="membro">Membro</Option>
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Status</FormLabel>
              <Select
                placeholder="Todos"
                value={filters.status || 'all'}
                onChange={(_, value) => {
                  setFilters(prev => ({
                    ...prev,
                    status: value as 'ativo' | 'inativo' | 'all',
                  }));
                }}
              >
                <Option value="all">Todos</Option>
                <Option value="ativo">Ativos</Option>
                <Option value="inativo">Inativos</Option>
              </Select>
            </FormControl>
            
            <Button 
              color="primary" 
              onClick={() => {
                setPagination(prev => ({ ...prev, page: 1 }));
                setOpenFiltersModal(false);
                loadUsers();
              }}
            >
              Aplicar Filtros
            </Button>
          </Stack>
        </ModalDialog>
      </Modal>
      
      {/* Modal de confirmação de exclusão */}
      <Modal open={deleteModalOpen} onClose={() => setDeleteModalOpen(false)}>
        <ModalDialog variant="outlined" role="alertdialog">
          <Typography
            level="h2"
            fontSize="md"
            startDecorator={<WarningIcon />}
          >
            Confirmação
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Typography level="body-md">
            Tem certeza que deseja excluir o usuário <strong>{selectedUser?.nome}</strong>?
            Esta ação não pode ser desfeita.
          </Typography>
          <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', pt: 2 }}>
            <Button
              variant="plain"
              color="neutral"
              onClick={() => setDeleteModalOpen(false)}
            >
              Cancelar
            </Button>
            <Button
              variant="solid"
              color="danger"
              onClick={handleDeleteUser}
            >
              Excluir Usuário
            </Button>
          </Box>
        </ModalDialog>
      </Modal>
      
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