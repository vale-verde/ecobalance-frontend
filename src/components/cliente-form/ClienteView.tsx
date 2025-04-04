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
import { Cliente, Documento, Socio } from '../../data/clientes';

type ClienteViewProps = {
  cliente: Cliente;
  onEditClick: () => void;
};

type InfoItemProps = {
  label: string;
  value?: string | number | null;
  icon?: React.ReactNode;
};

function InfoItem({ label, value, icon }: InfoItemProps) {
  if (!value) return null;
  
  return (
    <Box sx={{ mb: 2 }}>
      <Typography level="body-xs" sx={{ display: 'flex', alignItems: 'center', mb: 0.5, color: 'text.secondary' }}>
        {icon && <Box component="span" sx={{ mr: 1, display: 'flex' }}>{icon}</Box>}
        {label}
      </Typography>
      <Typography level="body-md">{value}</Typography>
    </Box>
  );
}

type DocumentoItemProps = {
  documento: Documento;
};

function DocumentoItem({ documento }: DocumentoItemProps) {
  let icon = <InsertDriveFileIcon />;
  
  if (documento.tipo.includes('pdf')) {
    icon = <PictureAsPdfIcon />;
  } else if (documento.tipo.includes('image')) {
    icon = <ImageIcon />;
  }
  
  return (
    <Card variant="outlined" sx={{ mb: 1, p: 1 }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ color: 'primary.500' }}>{icon}</Box>
        <Box sx={{ flex: 1 }}>
          <Typography level="body-sm">{documento.nome}</Typography>
          <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
            Adicionado em {documento.dataUpload}
          </Typography>
        </Box>
      </Stack>
    </Card>
  );
}

export default function ClienteView({ cliente, onEditClick }: ClienteViewProps) {
  const isPF = cliente.tipoCliente === 'PF';
  
  return (
    <Stack spacing={4}>
      {/* Cabeçalho */}
      <Box>
        <Stack direction="row" spacing={2} alignItems="center">
          <Chip
            variant="soft"
            color={isPF ? 'success' : 'primary'}
            startDecorator={isPF ? <PersonIcon /> : <BusinessIcon />}
          >
            {isPF ? 'Pessoa Física' : 'Pessoa Jurídica'}
          </Chip>
          <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
            Cadastrado em {cliente.timestamp}
          </Typography>
        </Stack>
      </Box>
      
      <Grid container spacing={3}>
        {/* Dados Principais */}
        <Grid xs={12} md={6}>
          <Sheet 
            variant="outlined" 
            sx={{ 
              borderRadius: 'md', 
              p: 3,
              mb: 3,
            }}
          >
            <Typography level="title-md" sx={{ mb: 2 }}>
              {isPF ? 'Dados Pessoais' : 'Dados da Empresa'}
            </Typography>
            
            {isPF ? (
              /* Pessoa Física */
              <Box>
                <InfoItem 
                  label="Nome Completo" 
                  value={cliente.nome}
                  icon={<PersonIcon fontSize="small" />}
                />
                <InfoItem 
                  label="CPF" 
                  value={cliente.cpf}
                  icon={<FingerprintIcon fontSize="small" />}
                />
                <InfoItem 
                  label="RG" 
                  value={cliente.rg}
                  icon={<BadgeIcon fontSize="small" />}
                />
                <InfoItem 
                  label="Data de Nascimento" 
                  value={cliente.dataNascimento}
                  icon={<CakeIcon fontSize="small" />}
                />
                <InfoItem 
                  label="Nacionalidade" 
                  value={cliente.nacionalidade}
                  icon={<PublicIcon fontSize="small" />}
                />
                <InfoItem 
                  label="Estado Civil" 
                  value={cliente.estadoCivil}
                  icon={<FamilyRestroomIcon fontSize="small" />}
                />
              </Box>
            ) : (
              /* Pessoa Jurídica */
              <Box>
                <InfoItem 
                  label="Razão Social" 
                  value={cliente.razaoSocial}
                  icon={<BusinessIcon fontSize="small" />}
                />
                <InfoItem 
                  label="CNPJ" 
                  value={cliente.cnpj}
                  icon={<FingerprintIcon fontSize="small" />}
                />
                <InfoItem 
                  label="Número Mínimo de Assinaturas" 
                  value={cliente.numeroMinimoAssinaturas}
                  icon={<SupervisorAccountIcon fontSize="small" />}
                />
              </Box>
            )}
          </Sheet>
          
          {/* Endereço */}
          {cliente.endereco && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                mb: 3,
              }}
            >
              <Typography level="title-md" startDecorator={<LocationOnIcon />} sx={{ mb: 2 }}>
                Endereço
              </Typography>
              
              <InfoItem label="CEP" value={cliente.endereco.cep} />
              <InfoItem label="Estado" value={cliente.endereco.estado} />
              <InfoItem label="Cidade" value={cliente.endereco.cidade} />
              <InfoItem label="Bairro" value={cliente.endereco.bairro} />
              <InfoItem label="Logradouro" value={cliente.endereco.logradouro} />
              <InfoItem label="Complemento" value={cliente.endereco.complemento} />
            </Sheet>
          )}
          
          {/* Observações */}
          {cliente.observacoes && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                mb: 3,
              }}
            >
              <Typography level="title-md" startDecorator={<EventNoteIcon />} sx={{ mb: 2 }}>
                Observações
              </Typography>
              
              <Typography>{cliente.observacoes}</Typography>
            </Sheet>
          )}
        </Grid>
        
        <Grid xs={12} md={6}>
          {/* Cônjuge (PF) */}
          {isPF && cliente.conjuge && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                mb: 3,
              }}
            >
              <Typography level="title-md" startDecorator={<FamilyRestroomIcon />} sx={{ mb: 2 }}>
                Dados do Cônjuge
              </Typography>
              
              <InfoItem label="Nome" value={cliente.conjuge.nome} />
              <InfoItem label="CPF" value={cliente.conjuge.cpf} />
              <InfoItem label="RG" value={cliente.conjuge.rg} />
              <InfoItem label="Nacionalidade" value={cliente.conjuge.nacionalidade} />
              <InfoItem label="Data de Nascimento" value={cliente.conjuge.dataNascimento} />
            </Sheet>
          )}
          
          {/* Sócios (PJ) */}
          {!isPF && cliente.socios && cliente.socios.length > 0 && (
            <Sheet 
              variant="outlined" 
              sx={{ 
                borderRadius: 'md', 
                p: 3,
                mb: 3,
              }}
            >
              <Typography level="title-md" startDecorator={<SupervisorAccountIcon />} sx={{ mb: 2 }}>
                Sócios
              </Typography>
              
              {cliente.socios.map((socio: Socio) => (
                <Card
                  key={socio.id}
                  variant="soft"
                  sx={{ mb: 2, p: 2 }}
                >
                  <Stack direction="row" justifyContent="space-between" sx={{ mb: 1 }}>
                    <Typography level="title-sm">{socio.nome}</Typography>
                    {socio.administrador && (
                      <Chip size="sm" variant="solid" color="primary">
                        Administrador
                      </Chip>
                    )}
                  </Stack>
                  
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6}>
                      <InfoItem label="CPF" value={socio.cpf} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <InfoItem label="RG" value={socio.rg} />
                    </Grid>
                  </Grid>
                  
                  <InfoItem label="Nacionalidade" value={socio.nacionalidade} />
                  <InfoItem label="Data de Nascimento" value={socio.dataNascimento} />
                  
                  {socio.endereco && (
                    <Box sx={{ mt: 1 }}>
                      <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                        Endereço
                      </Typography>
                      <Typography level="body-xs">
                        {[
                          socio.endereco.logradouro,
                          socio.endereco.bairro,
                          socio.endereco.cidade,
                          socio.endereco.estado,
                          socio.endereco.cep
                        ].filter(Boolean).join(', ')}
                      </Typography>
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
                mb: 3,
              }}
            >
              <Typography level="title-md" startDecorator={<AttachmentIcon />} sx={{ mb: 2 }}>
                Documentos
              </Typography>
              
              <Stack spacing={1}>
                {cliente.documentos.map((doc) => (
                  <DocumentoItem key={doc.id} documento={doc} />
                ))}
              </Stack>
            </Sheet>
          )}
        </Grid>
      </Grid>
    </Stack>
  );
} 