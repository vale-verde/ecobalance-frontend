/* eslint-disable jsx-a11y/anchor-is-valid */
import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Avatar from '@mui/joy/Avatar';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Link from '@mui/joy/Link';
import Input from '@mui/joy/Input';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Checkbox from '@mui/joy/Checkbox';
import IconButton, { iconButtonClasses } from '@mui/joy/IconButton';
import Typography from '@mui/joy/Typography';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Dropdown from '@mui/joy/Dropdown';

import FilterAltIcon from '@mui/icons-material/FilterAlt';
import SearchIcon from '@mui/icons-material/Search';
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown';
import CheckRoundedIcon from '@mui/icons-material/CheckRounded';
import BlockIcon from '@mui/icons-material/Block';
import AutorenewRoundedIcon from '@mui/icons-material/AutorenewRounded';
import KeyboardArrowRightIcon from '@mui/icons-material/KeyboardArrowRight';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';
import MoreHorizRoundedIcon from '@mui/icons-material/MoreHorizRounded';

/**
 * Dados de exemplo para a tabela de pedidos
 */
const rows = [
  {
    id: 'INV-1234',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1233',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1232',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1231',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1230',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1229',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1228',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1227',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1226',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
  {
    id: 'INV-1225',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'O',
      name: 'Olivia Ryhe',
      email: 'olivia@email.com',
    },
  },
  {
    id: 'INV-1224',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'S',
      name: 'Steve Hampton',
      email: 'steve.hamp@email.com',
    },
  },
  {
    id: 'INV-1223',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Ciaran Murray',
      email: 'ciaran.murray@email.com',
    },
  },
  {
    id: 'INV-1221',
    date: 'Feb 3, 2023',
    status: 'Refunded',
    customer: {
      initial: 'M',
      name: 'Maria Macdonald',
      email: 'maria.mc@email.com',
    },
  },
  {
    id: 'INV-1220',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'C',
      name: 'Charles Fulton',
      email: 'fulton@email.com',
    },
  },
  {
    id: 'INV-1219',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'J',
      name: 'Jay Hooper',
      email: 'hooper@email.com',
    },
  },
  {
    id: 'INV-1218',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'K',
      name: 'Krystal Stevens',
      email: 'k.stevens@email.com',
    },
  },
  {
    id: 'INV-1217',
    date: 'Feb 3, 2023',
    status: 'Paid',
    customer: {
      initial: 'S',
      name: 'Sachin Flynn',
      email: 's.flyn@email.com',
    },
  },
  {
    id: 'INV-1216',
    date: 'Feb 3, 2023',
    status: 'Cancelled',
    customer: {
      initial: 'B',
      name: 'Bradley Rosales',
      email: 'brad123@email.com',
    },
  },
];

/**
 * Função auxiliar que determina se um valor é menor que outro para ordenação.
 */
function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = 'asc' | 'desc';

/**
 * Cria um comparador para ordenação baseado na direção (asc/desc) e propriedade
 */
function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key,
): (
  a: { [key in Key]: number | string },
  b: { [key in Key]: number | string },
) => number {
  return order === 'desc'
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

/**
 * Componente de menu de ações para cada linha da tabela
 */
function RowMenu() {
  return (
    <Dropdown>
      <MenuButton
        slots={{ root: IconButton }}
        slotProps={{ root: { variant: 'plain', color: 'neutral', size: 'sm' } }}
      >
        <MoreHorizRoundedIcon />
      </MenuButton>
      <Menu size="sm" sx={{ minWidth: 140 }}>
        <MenuItem>Editar</MenuItem>
        <MenuItem>Renomear</MenuItem>
        <MenuItem>Mover</MenuItem>
        <Divider />
        <MenuItem color="danger">Excluir</MenuItem>
      </Menu>
    </Dropdown>
  );
}

/**
 * Componente de tabela de pedidos com funcionalidades de ordenação,
 * paginação e filtros
 */
export default function OrderTable() {
  const [order, setOrder] = React.useState<Order>('desc');
  const [selected, setSelected] = React.useState<readonly string[]>([]);
  const [open, setOpen] = React.useState(false);

  /**
   * Renderiza os controles de filtros
   */
  const renderFilters = () => (
    <React.Fragment>
      <FormControl size="sm">
        <FormLabel>Status</FormLabel>
        <Select
          size="sm"
          placeholder="Filtrar por status"
          slotProps={{ button: { sx: { whiteSpace: 'nowrap' } } }}
        >
          <Option value="paid">Pago</Option>
          <Option value="pending">Pendente</Option>
          <Option value="refunded">Reembolsado</Option>
          <Option value="cancelled">Cancelado</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Cliente</FormLabel>
        <Select size="sm" placeholder="Todos clientes">
          <Option value="all">Todos</Option>
          <Option value="olivia">Olivia Rhye</Option>
          <Option value="steve">Steve Hampton</Option>
          <Option value="ciaran">Ciaran Murray</Option>
          <Option value="maria">Maria Macdonald</Option>
          <Option value="charles">Charles Fulton</Option>
          <Option value="jay">Jay Hooper</Option>
        </Select>
      </FormControl>

      <FormControl size="sm">
        <FormLabel>Data</FormLabel>
        <Select size="sm" placeholder="Todas datas">
          <Option value="all">Todas</Option>
          <Option value="last-hour">Última hora</Option>
          <Option value="last-day">Último dia</Option>
          <Option value="last-week">Última semana</Option>
          <Option value="last-month">Último mês</Option>
          <Option value="last-year">Último ano</Option>
        </Select>
      </FormControl>
    </React.Fragment>
  );

  return (
    <React.Fragment>
      {/* Modal de filtros para visão mobile */}
      <Modal open={open} onClose={() => setOpen(false)}>
        <ModalDialog
          aria-labelledby="filter-modal"
          layout="fullscreen"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
          }}
        >
          <ModalClose />
          <Typography id="filter-modal" level="h2">
            Filtros
          </Typography>
          <Divider sx={{ mt: 1 }} />
          <Sheet sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            {renderFilters()}
            <Button color="primary" onClick={() => setOpen(false)}>
              Aplicar filtros
            </Button>
          </Sheet>
        </ModalDialog>
      </Modal>

      {/* Barra de ferramentas da tabela */}
      <Box
        sx={{
          display: 'flex',
          mb: 2,
          gap: 1,
          flexDirection: { xs: 'column', sm: 'row' },
          alignItems: { xs: 'start', sm: 'center' },
          flexWrap: 'wrap',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography level="h3">Pedidos</Typography>
          <Chip variant="outlined" color="neutral" size="sm">
            {rows.length} pedidos
          </Chip>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Box
            sx={{
              display: { xs: 'inline-flex', md: 'none' },
            }}
          >
            <IconButton
              variant="outlined"
              color="neutral"
              onClick={() => setOpen(true)}
            >
              <FilterAltIcon />
            </IconButton>
          </Box>
          <Box
            sx={{
              display: { xs: 'none', md: 'flex' },
              alignItems: 'center',
              gap: 1,
            }}
          >
            {renderFilters()}
          </Box>
          <Box sx={{ minWidth: 0, flex: 1 }}>
            <FormControl sx={{ flex: 1 }} size="sm">
              <Input
                size="sm"
                placeholder="Pesquisar por ID ou cliente"
                startDecorator={<SearchIcon />}
                endDecorator={
                  <IconButton variant="plain" color="neutral" size="sm">
                    <Typography level="body-xs">⌘ K</Typography>
                  </IconButton>
                }
              />
            </FormControl>
          </Box>
        </Box>
      </Box>

      {/* Tabela de pedidos */}
      <Sheet
        className="OrderTableContainer"
        variant="outlined"
        sx={{
          display: { xs: 'none', sm: 'initial' },
          width: '100%',
          borderRadius: 'sm',
          flexShrink: 1,
          overflow: 'auto',
          minHeight: 0,
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
          {/* Cabeçalho da tabela */}
          <thead>
            <tr>
              <th style={{ width: 48, textAlign: 'center', padding: '12px 6px' }}>
                <Checkbox
                  size="sm"
                  indeterminate={
                    selected.length > 0 && selected.length !== rows.length
                  }
                  checked={selected.length === rows.length}
                  onChange={(event) => {
                    setSelected(
                      event.target.checked ? rows.map((row) => row.id) : [],
                    );
                  }}
                  color={
                    selected.length > 0 || selected.length === rows.length
                      ? 'primary'
                      : undefined
                  }
                  sx={{ verticalAlign: 'text-bottom' }}
                />
              </th>
              <th style={{ width: 120, padding: '12px 6px' }}>
                <Link
                  underline="none"
                  color="primary"
                  component="button"
                  onClick={() => setOrder(order === 'asc' ? 'desc' : 'asc')}
                  fontWeight="lg"
                  endDecorator={<ArrowDropDownIcon />}
                  sx={{
                    '& svg': {
                      transition: '0.2s',
                      transform:
                        order === 'desc' ? 'rotate(0deg)' : 'rotate(180deg)',
                    },
                  }}
                >
                  ID
                </Link>
              </th>
              <th style={{ width: 140, padding: '12px 6px' }}>Data</th>
              <th style={{ width: 140, padding: '12px 6px' }}>Status</th>
              <th style={{ width: 240, padding: '12px 6px' }}>Cliente</th>
              <th style={{ width: 140, padding: '12px 6px' }}> </th>
            </tr>
          </thead>
          
          {/* Corpo da tabela */}
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td style={{ textAlign: 'center', width: 48 }}>
                  <Checkbox
                    size="sm"
                    checked={selected.indexOf(row.id) !== -1}
                    onChange={(event) => {
                      const selectedIndex = selected.indexOf(row.id);
                      let newSelected: readonly string[] = [];

                      if (selectedIndex === -1) {
                        newSelected = newSelected.concat(selected, row.id);
                      } else if (selectedIndex === 0) {
                        newSelected = newSelected.concat(selected.slice(1));
                      } else if (selectedIndex === selected.length - 1) {
                        newSelected = newSelected.concat(selected.slice(0, -1));
                      } else if (selectedIndex > 0) {
                        newSelected = newSelected.concat(
                          selected.slice(0, selectedIndex),
                          selected.slice(selectedIndex + 1),
                        );
                      }

                      setSelected(newSelected);
                    }}
                    color={
                      selected.indexOf(row.id) !== -1 ? 'primary' : undefined
                    }
                    sx={{ verticalAlign: 'text-bottom' }}
                  />
                </td>
                <td>
                  <Typography level="body-xs">{row.id}</Typography>
                </td>
                <td>
                  <Typography level="body-xs">{row.date}</Typography>
                </td>
                <td>
                  <Chip
                    variant="soft"
                    size="sm"
                    startDecorator={
                      {
                        Paid: <CheckRoundedIcon />,
                        Refunded: <AutorenewRoundedIcon />,
                        Cancelled: <BlockIcon />,
                      }[row.status]
                    }
                    color={
                      {
                        Paid: 'success',
                        Refunded: 'neutral',
                        Cancelled: 'danger',
                      }[row.status] as ColorPaletteProp
                    }
                  >
                    {row.status}
                  </Chip>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Avatar size="sm">{row.customer.initial}</Avatar>
                    <div>
                      <Typography level="body-xs">{row.customer.name}</Typography>
                      <Typography level="body-xs">{row.customer.email}</Typography>
                    </div>
                  </Box>
                </td>
                <td>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <Link level="body-xs" component="button">
                      Baixar
                    </Link>
                    <RowMenu />
                  </Box>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      </Sheet>

      {/* Visualização em cards para mobile */}
      <Box
        className="OrderTableMobile"
        sx={{ display: { xs: 'block', sm: 'none' }, paddingLeft: 1 }}
      >
        {rows.map((row) => (
          <Sheet
            key={row.id}
            variant="outlined"
            sx={{
              p: 2,
              mb: 1.5,
              borderRadius: 'sm',
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: 2,
            }}
          >
            <div>
              <Typography level="body-xs">Pedido nº</Typography>
              <Typography fontWeight="md">{row.id}</Typography>
            </div>
            <div>
              <Typography level="body-xs">Data</Typography>
              <Typography fontWeight="md">{row.date}</Typography>
            </div>
            <div>
              <Typography level="body-xs">Cliente</Typography>
              <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                <Avatar size="sm">{row.customer.initial}</Avatar>
                <div>
                  <Typography level="body-xs">{row.customer.name}</Typography>
                  <Typography level="body-xs">{row.customer.email}</Typography>
                </div>
              </Box>
            </div>
            <div>
              <Typography level="body-xs">Status</Typography>
              <Chip
                variant="soft"
                size="sm"
                startDecorator={
                  {
                    Paid: <CheckRoundedIcon />,
                    Refunded: <AutorenewRoundedIcon />,
                    Cancelled: <BlockIcon />,
                  }[row.status]
                }
                color={
                  {
                    Paid: 'success',
                    Refunded: 'neutral',
                    Cancelled: 'danger',
                  }[row.status] as ColorPaletteProp
                }
              >
                {row.status}
              </Chip>
            </div>
            <div>
              <RowMenu />
            </div>
          </Sheet>
        ))}
      </Box>

      {/* Paginação */}
      <Box
        className="Pagination-mobile"
        sx={{
          display: { xs: 'flex', md: 'none' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <IconButton
          aria-label="previous page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowLeftIcon />
        </IconButton>
        <Typography level="body-sm">Página 1 de 10</Typography>
        <IconButton
          aria-label="next page"
          variant="outlined"
          color="neutral"
          size="sm"
        >
          <KeyboardArrowRightIcon />
        </IconButton>
      </Box>
      <Box
        className="Pagination-desktop"
        sx={{
          display: { xs: 'none', md: 'flex' },
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography level="body-sm">Linhas por página:</Typography>
          <Select size="sm" defaultValue={10}>
            <Option value={5}>5</Option>
            <Option value={10}>10</Option>
            <Option value={25}>25</Option>
          </Select>
        </Box>
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <Typography level="body-sm">1–5 de 13</Typography>
          <Box sx={{ display: 'flex', gap: 0.5 }}>
            <IconButton
              aria-label="previous page"
              variant="outlined"
              color="neutral"
              size="sm"
            >
              <KeyboardArrowLeftIcon />
            </IconButton>
            <IconButton
              aria-label="next page"
              variant="outlined"
              color="neutral"
              size="sm"
            >
              <KeyboardArrowRightIcon />
            </IconButton>
          </Box>
        </Box>
      </Box>
    </React.Fragment>
  );
}
