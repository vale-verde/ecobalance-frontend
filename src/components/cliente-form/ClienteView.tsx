import * as React from 'react';
import Box from '@mui/joy/Box';
import Card from '@mui/joy/Card';
import Chip from '@mui/joy/Chip';
import Divider from '@mui/joy/Divider';
import Grid from '@mui/joy/Grid';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventNoteIcon from '@mui/icons-material/EventNote';
import FingerprintIcon from '@mui/icons-material/Fingerprint';
import BadgeIcon from '@mui/icons-material/Badge';
import CakeIcon from '@mui/icons-material/Cake';
import PublicIcon from '@mui/icons-material/Public';
import FamilyRestroomIcon from '@mui/icons-material/FamilyRestroom';
import SupervisorAccountIcon from '@mui/icons-material/SupervisorAccount';
import AttachmentIcon from '@mui/icons-material/Attachment';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import EditIcon from '@mui/icons-material/Edit';
import CancelIcon from '@mui/icons-material/Cancel';
import VisibilityIcon from '@mui/icons-material/Visibility';
import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import PermContactCalendarIcon from '@mui/icons-material/PermContactCalendar';
import HomeIcon from '@mui/icons-material/Home';
import PlaceIcon from '@mui/icons-material/Place';
import LocationCityIcon from '@mui/icons-material/LocationCity';
import ApartmentIcon from '@mui/icons-material/Apartment';
import MarkunreadMailboxIcon from '@mui/icons-material/MarkunreadMailbox';
import DeleteIcon from '@mui/icons-material/Delete';
import { Cliente, Documento, Socio } from '../../data/clientes';
import { customScrollbarStyle } from '../../utils';

/**
 * Props para o componente de visualização de cliente
 */
type ClienteViewProps = {
  cliente: Cliente;
  onEditClick: () => void;
  onCancelClick?: () => void;
  onDeleteClick?: () => void;
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
  if (!value) return null;
  
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
        {value || "-"}
      </Typography>
    </Box>
  );
}

/**
 * Props para o componente de item de documento
 */
type DocumentoItemProps = {
  documento: Documento;
};

/**
 * Componente para exibir um documento na lista de documentos
 */
function DocumentoItem({ documento }: DocumentoItemProps) {
  let icon = <InsertDriveFileIcon />;
  
  if (documento.tipo.includes('pdf')) {
    icon = <PictureAsPdfIcon />;
  } else if (documento.tipo.includes('image')) {
    icon = <ImageIcon />;
  }
  
  return (
    <Card variant="outlined" sx={{ 
      mb: 1, 
      p: 1.5,
      height: '100%',
      transition: 'all 0.2s',
      '&:hover': {
        boxShadow: 'sm',
        borderColor: 'neutral.outlinedHoverBorder'
      } 
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: 'primary.500', fontSize: '1.25rem' }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography level="body-sm" sx={{ fontWeight: 'medium' }}>{documento.nome}</Typography>
          <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
            Adicionado em {documento.dataUpload}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

/**
 * Componente para visualização detalhada dos dados de um cliente
 * 
 * Exibe todas as informações do cliente em um layout organizado,
 * incluindo dados pessoais/empresariais, endereço, documentos e sócios
 */
export default function ClienteView({ cliente, onEditClick, onCancelClick, onDeleteClick }: ClienteViewProps) {
  const isPF = cliente.tipoCliente === 'PF';
  
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
              Detalhes do Cliente
            </Typography>
            <Typography level="body-sm" color="neutral">
              Visualização completa dos dados do cliente
            </Typography>
          </Box>
        </Stack>
        
        <Chip
          variant="soft"
          color="neutral"
          startDecorator={isPF ? <PersonIcon /> : <BusinessIcon />}
          sx={{ 
            bgcolor: isPF ? 'success.softBg' : 'primary.softBg',
            fontWeight: 'medium'
          }}
        >
          {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
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
          {/* Dados Pessoais / Empresariais */}
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
              {isPF ? <PersonIcon /> : <BusinessIcon />}
              {isPF ? 'Dados Pessoais' : 'Dados da Empresa'}
            </Typography>
            
            {isPF ? (
              /* Pessoa Física */
              <Grid container spacing={2} sx={{ mt: 0 }}>
                {/* Primeira coluna */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Nome Completo" 
                    value={cliente.nome}
                    icon={<AccountCircleIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="CPF" 
                    value={cliente.cpf}
                    icon={<FingerprintIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="RG" 
                    value={cliente.rg}
                    icon={<BadgeIcon fontSize="small" />}
                  />
                </Grid>
                
                {/* Segunda linha */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Data de Nascimento" 
                    value={cliente.dataNascimento}
                    icon={<CakeIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Nacionalidade" 
                    value={cliente.nacionalidade}
                    icon={<PublicIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Estado Civil" 
                    value={cliente.estadoCivil}
                    icon={<FamilyRestroomIcon fontSize="small" />}
                  />
                </Grid>
              </Grid>
            ) : (
              /* Pessoa Jurídica */
              <Grid container spacing={2} sx={{ mt: 0 }}>
                {/* Primeira coluna */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Razão Social" 
                    value={cliente.razaoSocial}
                    icon={<BusinessIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Nome Fantasia"
                    value={cliente.nome}
                    icon={<BusinessIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="CNPJ" 
                    value={cliente.cnpj}
                    icon={<FingerprintIcon fontSize="small" />}
                  />
                </Grid>
                
                {/* Segunda linha */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Número Mínimo de Assinaturas" 
                    value={cliente.numeroMinimoAssinaturas}
                    icon={<SupervisorAccountIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={8}>
                  {/* Espaço reservado para futuros campos */}
                </Grid>
              </Grid>
            )}
          </Sheet>
          
          {/* Cônjuge (PF) */}
          {isPF && cliente.conjuge && cliente.estadoCivil === "Casado" && (
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
                <FamilyRestroomIcon />
                Dados do Cônjuge
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 0 }}>
                {/* Primeira coluna */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Nome" 
                    value={cliente.conjuge.nome}
                    icon={<PermContactCalendarIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="CPF" 
                    value={cliente.conjuge.cpf}
                    icon={<FingerprintIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="RG" 
                    value={cliente.conjuge.rg}
                    icon={<BadgeIcon fontSize="small" />}
                  />
                </Grid>
                
                {/* Segunda linha */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Data de Nascimento" 
                    value={cliente.conjuge.dataNascimento}
                    icon={<CakeIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Nacionalidade" 
                    value={cliente.conjuge.nacionalidade}
                    icon={<PublicIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  {/* Espaço reservado para futuros campos */}
                </Grid>
              </Grid>
            </Sheet>
          )}
          
          {/* Endereço */}
          {cliente.endereco && (
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
                Endereço
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 0 }}>
                {/* Primeira linha */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="CEP" 
                    value={cliente.endereco.cep}
                    icon={<MarkunreadMailboxIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Bairro" 
                    value={cliente.endereco.bairro}
                    icon={<PlaceIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Estado" 
                    value={cliente.endereco.estado}
                    icon={<LocationCityIcon fontSize="small" />}
                  />
                </Grid>
                
                {/* Segunda linha */}
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Logradouro" 
                    value={cliente.endereco.logradouro}
                    icon={<HomeIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Complemento" 
                    value={cliente.endereco.complemento}
                    icon={<ApartmentIcon fontSize="small" />}
                  />
                </Grid>
                <Grid xs={12} md={4}>
                  <InfoItem 
                    label="Cidade" 
                    value={cliente.endereco.cidade}
                    icon={<LocationCityIcon fontSize="small" />}
                  />
                </Grid>
              </Grid>
            </Sheet>
          )}
          
          {/* Observações */}
          {cliente.observacoes && (
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
                <EventNoteIcon />
                Observações
              </Typography>
              
              <Typography sx={{ whiteSpace: 'pre-wrap' }}>{cliente.observacoes}</Typography>
            </Sheet>
          )}
          
          {/* Sócios (PJ) */}
          {!isPF && cliente.socios && cliente.socios.length > 0 && (
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
                <SupervisorAccountIcon />
                Sócios
              </Typography>
              
              {cliente.socios.map((socio: Socio) => (
                <Card
                  key={socio.id}
                  variant="soft"
                  sx={{ 
                    mb: 2, 
                    p: 2,
                    backgroundColor: 'background.level1',
                    boxShadow: 'none',
                  }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography level="title-sm">{socio.nome}</Typography>
                    {socio.administrador && (
                      <Chip size="sm" variant="solid" color="primary">
                        Administrador
                      </Chip>
                    )}
                  </Stack>
                  
                  <Grid container spacing={2} sx={{ mt: 0 }}>
                    <Grid xs={12} sm={4}>
                      <InfoItem label="CPF" value={socio.cpf} />
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <InfoItem label="RG" value={socio.rg} />
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <InfoItem label="Data de Nascimento" value={socio.dataNascimento} />
                    </Grid>
                    <Grid xs={12} sm={4}>
                      <InfoItem label="Nacionalidade" value={socio.nacionalidade} />
                    </Grid>
                    <Grid xs={12} sm={8}>
                      {/* Espaço reservado para futuros campos */}
                    </Grid>
                  </Grid>
                  
                  {socio.endereco && (
                    <Box sx={{ mt: 2 }}>
                      <Typography level="body-sm" 
                        sx={{ 
                          color: 'text.secondary', 
                          mb: 1.5, 
                          fontWeight: 'medium',
                          display: 'flex',
                          alignItems: 'center',
                          gap: 0.5
                        }}
                      >
                        <LocationOnIcon fontSize="small" sx={{ fontSize: '1rem', color: 'primary.500' }} />
                        Endereço
                      </Typography>
                      
                      <Grid container spacing={2} sx={{ mt: 0 }}>
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="CEP" 
                            value={socio.endereco.cep}
                            icon={<MarkunreadMailboxIcon fontSize="small" />}
                          />
                        </Grid>
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="Bairro" 
                            value={socio.endereco.bairro}
                            icon={<PlaceIcon fontSize="small" />}
                          />
                        </Grid>
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="Estado" 
                            value={socio.endereco.estado}
                            icon={<LocationCityIcon fontSize="small" />}
                          />
                        </Grid>
                        
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="Logradouro" 
                            value={socio.endereco.logradouro}
                            icon={<HomeIcon fontSize="small" />}
                          />
                        </Grid>
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="Complemento" 
                            value={socio.endereco.complemento}
                            icon={<ApartmentIcon fontSize="small" />}
                          />
                        </Grid>
                        <Grid xs={12} md={4}>
                          <InfoItem 
                            label="Cidade" 
                            value={socio.endereco.cidade}
                            icon={<LocationCityIcon fontSize="small" />}
                          />
                        </Grid>
                      </Grid>
                    </Box>
                  )}
                </Card>
              ))}
            </Sheet>
          )}
          
          {/* Documentos */}
          {cliente.documentos && cliente.documentos.length > 0 && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                width: '100%',
                mb: 3,
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
                <AttachmentIcon />
                Documentos
              </Typography>
              
              <Grid container spacing={2} sx={{ mt: 0 }}>
                {/* Lista de documentos distribuídos em grid */}
                {cliente.documentos.map((doc) => (
                  <Grid key={doc.id} xs={12} md={3}>
                    <DocumentoItem documento={doc} />
                  </Grid>
                ))}
              </Grid>
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