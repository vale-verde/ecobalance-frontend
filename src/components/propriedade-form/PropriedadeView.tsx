import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardActions from '@mui/joy/CardActions';
import Chip from '@mui/joy/Chip';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import { Propriedade } from '../../data/propriedades';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import Stack from '@mui/joy/Stack';
import Table from '@mui/joy/Table';
import Sheet from '@mui/joy/Sheet';
import Grid from '@mui/joy/Grid';
import HomeWorkIcon from '@mui/icons-material/HomeWork';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import DescriptionIcon from '@mui/icons-material/Description';
import PersonIcon from '@mui/icons-material/Person';
import VisibilityIcon from '@mui/icons-material/Visibility';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeIcon from '@mui/icons-material/Badge';
import PlaceIcon from '@mui/icons-material/Place';
import MapIcon from '@mui/icons-material/Map';
import AttachMoneyIcon from '@mui/icons-material/AttachMoney';
import ExploreIcon from '@mui/icons-material/Explore';
import CategoryIcon from '@mui/icons-material/Category';
import NoteIcon from '@mui/icons-material/Note';
import { getClientes } from '../../services/clienteService';
import { Cliente } from '../../data/clientes';
import { customScrollbarStyle } from '../../utils';

/**
 * Props para o componente de visualização de propriedade
 */
type PropriedadeViewProps = {
  propriedade: Propriedade;
  onEditClick: () => void;
  onCancelClick: () => void;
  onDeleteClick: () => void;
};

/**
 * Props para o componente de item de informação
 */
type InfoItemProps = {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
};

/**
 * Componente para exibir um item de informação com ícone e valor
 */
function InfoItem({ label, value, icon }: InfoItemProps) {
  if (value === undefined || value === null) return null;
  
  return (
    <Box sx={{ 
      mb: { xs: 2, md: 0 },
      height: '100%',
      display: 'flex',
      flexDirection: 'column',
      minHeight: 64,
    }}>
      <Typography 
        level="body-xs" 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          mb: 0.5, 
          color: 'text.secondary',
          fontWeight: 'medium',
          height: 24,
          lineHeight: '24px'
        }}
      >
        {icon && 
          <Box 
            component="span" 
            sx={{ 
              mr: 1, 
              display: 'flex', 
              color: 'primary.500', 
              width: 20,
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            {icon}
          </Box>
        }
        {label}
      </Typography>
      <Typography 
        level="body-md" 
        sx={{ 
          fontWeight: 'normal',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          lineHeight: 1.5
        }}
      >
        {value.toString() || "-"}
      </Typography>
    </Box>
  );
}

/**
 * Componente para visualização detalhada de uma propriedade
 */
export default function PropriedadeView({
  propriedade,
  onEditClick,
  onCancelClick,
  onDeleteClick
}: PropriedadeViewProps) {
  const [clientes, setClientes] = React.useState<Cliente[]>([]);
  const [loading, setLoading] = React.useState(false);
  const [activeTab, setActiveTab] = React.useState<number>(0);

  // Carregar clientes vinculados
  React.useEffect(() => {
    const fetchClientes = async () => {
      setLoading(true);
      try {
        const clientesData = await getClientes();
        setClientes(clientesData);
      } catch (error) {
        console.error('Erro ao carregar clientes:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Clientes vinculados à propriedade
  const clientesVinculados = React.useMemo(() => {
    if (!propriedade.clientesVinculados) return [];
    return clientes.filter(cliente => 
      propriedade.clientesVinculados?.includes(cliente.id)
    );
  }, [clientes, propriedade.clientesVinculados]);

  // Formatação de valores para exibição
  const formatCurrency = (value?: number) => {
    if (value === undefined) return 'Não informado';
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  };

  const formatArea = (area?: number) => {
    if (area === undefined) return 'Não informado';
    return `${area.toLocaleString('pt-BR')} ha`;
  };

  return (
    <Box sx={{ 
      height: '100%', 
      display: 'flex', 
      flexDirection: 'column',
      position: 'relative'
    }}>
      {/* Cabeçalho do Formulário */}
      <Box 
        sx={{ 
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          mb: 3, 
          pt: 1,
          borderBottom: '1px solid',
          borderColor: 'divider',
          pb: 2
        }}
      >
        <Stack direction="row" spacing={2} alignItems="center">
          <Box sx={{ 
            color: 'primary.500', 
            fontSize: '1.5rem',
            bgcolor: 'primary.softBg',
            borderRadius: 'md',
            width: 40,
            height: 40,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <VisibilityIcon sx={{ fontSize: 'inherit' }} />
          </Box>
          <Box>
            <Typography level="h4">
              Detalhes da Propriedade
            </Typography>
            <Typography level="body-sm" color="neutral">
              Visualização completa dos dados da propriedade
            </Typography>
          </Box>
        </Stack>
        
        <Chip
          variant="soft"
          color="primary"
          startDecorator={<HomeWorkIcon />}
          sx={{ fontWeight: 'medium' }}
        >
          Propriedade Rural
        </Chip>
      </Box>
      
      {/* Conteúdo scrollável */}
      <Box sx={{ 
        flex: 1, 
        display: 'flex', 
        flexDirection: 'column',
        width: '100%',
        overflow: 'auto',
        ...customScrollbarStyle,
        mb: 2,
      }}>
        <Stack spacing={3} sx={{ width: '100%' }}>
          {/* Dados Básicos */}
          <Sheet 
            variant="outlined" 
            sx={{ 
              borderRadius: 'md', 
              p: 3,
              width: '100%',
              boxShadow: 'none',
              backgroundColor: 'background.surface',
            }}
          >
            <Typography 
              level="title-md" 
              sx={{ 
                mb: 2, 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                color: 'primary.600',
                '& svg': { color: 'primary.500' }
              }}
            >
              <HomeWorkIcon />
              Dados Básicos
            </Typography>
            
            <Grid container spacing={2} sx={{ mt: 0 }}>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Nome da Propriedade" 
                  value={propriedade.nome}
                  icon={<HomeWorkIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Matrícula" 
                  value={propriedade.matricula}
                  icon={<FingerprintIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Comarca" 
                  value={propriedade.comarca}
                  icon={<PlaceIcon fontSize="small" />}
                />
              </Grid>
              
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="CCIR" 
                  value={propriedade.ccir}
                  icon={<BadgeIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="CAR" 
                  value={propriedade.car}
                  icon={<MapIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Número ART" 
                  value={propriedade.numeroART}
                  icon={<CategoryIcon fontSize="small" />}
                />
              </Grid>
              
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Área Total" 
                  value={formatArea(propriedade.areaTotal)}
                  icon={<ExploreIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Valor da Propriedade" 
                  value={formatCurrency(propriedade.valorPropriedade)}
                  icon={<AttachMoneyIcon fontSize="small" />}
                />
              </Grid>
              <Grid xs={12} md={4}>
                <InfoItem 
                  label="Data de Registro" 
                  value={propriedade.dataRegistro}
                  icon={<DescriptionIcon fontSize="small" />}
                />
              </Grid>
              
              <Grid xs={12}>
                <InfoItem 
                  label="Observações" 
                  value={propriedade.observacoes || 'Sem observações'}
                  icon={<NoteIcon fontSize="small" />}
                />
              </Grid>
            </Grid>
          </Sheet>
          
          {/* Localização - preservar o conteúdo mas não mostrar se não houver dados de endereço */}
          {propriedade.endereco && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                width: '100%',
                boxShadow: 'none',
                backgroundColor: 'background.surface',
              }}
            >
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.600',
                  '& svg': { color: 'primary.500' }
                }}
              >
                <LocationOnIcon />
                Localização
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 0 }}>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="CEP" 
                    value={propriedade.endereco.cep}
                    icon={<MarkunreadMailboxIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Estado" 
                    value={propriedade.endereco.estado}
                    icon={<LocationOnIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Cidade" 
                    value={propriedade.endereco.cidade}
                    icon={<LocationOnIcon fontSize="small" />}
                  />
                </Grid>
                
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Logradouro" 
                    value={propriedade.endereco.logradouro}
                    icon={<LocationOnIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Bairro" 
                    value={propriedade.endereco.bairro}
                    icon={<LocationOnIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Complemento" 
                    value={propriedade.endereco.complemento}
                    icon={<LocationOnIcon fontSize="small" />}
                  />
                </Grid>
              </Grid>
            </Sheet>
          )}
          
          {/* Proprietários (antigo Clientes Vinculados) */}
          {propriedade.clientesVinculados && propriedade.clientesVinculados.length > 0 && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                width: '100%',
                boxShadow: 'none',
                backgroundColor: 'background.surface',
              }}
            >
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.600',
                  '& svg': { color: 'primary.500' }
                }}
              >
                <PersonIcon />
                Proprietários
              </Typography>
              
              {loading ? (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography level="body-md">Carregando proprietários...</Typography>
                </Box>
              ) : clientesVinculados.length > 0 ? (
                <Table>
                  <thead>
                    <tr>
                      <th>Nome</th>
                      <th>Tipo</th>
                      <th>Documento</th>
                    </tr>
                  </thead>
                  <tbody>
                    {clientesVinculados.map(cliente => (
                      <tr key={cliente.id}>
                        <td>{cliente.nome}</td>
                        <td>{cliente.tipoCliente === 'PF' ? 'Pessoa Física' : 'Pessoa Jurídica'}</td>
                        <td>{cliente.documento}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              ) : (
                <Box sx={{ p: 2, textAlign: 'center' }}>
                  <Typography level="body-md">
                    Nenhum proprietário vinculado a esta propriedade.
                  </Typography>
                  <Typography level="body-sm" sx={{ mt: 1, color: 'text.secondary' }}>
                    Edite a propriedade para vincular proprietários.
                  </Typography>
                </Box>
              )}
            </Sheet>
          )}
          
          {/* Documentos */}
          {propriedade.documentos && propriedade.documentos.length > 0 && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                width: '100%',
                boxShadow: 'none',
                backgroundColor: 'background.surface',
              }}
            >
              <Typography 
                level="title-md" 
                sx={{ 
                  mb: 2, 
                  display: 'flex', 
                  alignItems: 'center', 
                  gap: 1,
                  color: 'primary.600',
                  '& svg': { color: 'primary.500' }
                }}
              >
                <DescriptionIcon />
                Documentos
              </Typography>
              
              <Table>
                <thead>
                  <tr>
                    <th>Nome</th>
                    <th>Tipo</th>
                    <th>Data de Upload</th>
                    <th>Ações</th>
                  </tr>
                </thead>
                <tbody>
                  {propriedade.documentos.map(doc => (
                    <tr key={doc.id}>
                      <td>{doc.nome}</td>
                      <td>{doc.tipo}</td>
                      <td>{doc.dataUpload}</td>
                      <td>
                        <Button
                          variant="plain"
                          color="primary"
                          size="sm"
                          onClick={() => window.open(doc.arquivo, '_blank')}
                        >
                          Visualizar
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Sheet>
          )}
        </Stack>
      </Box>
      
      {/* Ações no rodapé - no footer do formulário - agora fora da área scrollável */}
      <Box
        sx={{ 
          position: 'sticky',
          bottom: 0,
          left: 0,
          right: 0,
          zIndex: 10,
          py: 1.5,
          px: 3, 
          display: 'flex', 
          justifyContent: 'space-between', 
          backgroundColor: 'background.surface',
          borderTop: '1px solid',
          borderColor: 'divider',
          boxShadow: 'none',
          width: '100%',
          height: 65,
          marginLeft: 0,
          marginRight: 0,
          boxSizing: 'border-box',
        }}
      >
        <Button
          variant="outlined"
          color="danger"
          startDecorator={<DeleteIcon />}
          onClick={onDeleteClick}
          sx={{ width: 118 }}
        >
          Excluir
        </Button>
        
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            color="neutral"
            startDecorator={<CancelIcon />}
            onClick={onCancelClick}
            sx={{ width: 118 }}
          >
            Voltar
          </Button>
          <Button
            variant="solid"
            color="primary"
            startDecorator={<EditIcon />}
            onClick={onEditClick}
            sx={{ width: 118 }}
          >
            Editar
          </Button>
        </Box>
      </Box>
    </Box>
  );
} 