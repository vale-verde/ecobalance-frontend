import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Sheet from '@mui/joy/Sheet';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Alert from '@mui/joy/Alert';
import Divider from '@mui/joy/Divider';
import Chip from '@mui/joy/Chip';
import Stack from '@mui/joy/Stack';
import Grid from '@mui/joy/Grid';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import Avatar from '@mui/joy/Avatar';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import AspectRatio from '@mui/joy/AspectRatio';
import Button from '@mui/joy/Button';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import PersonIcon from '@mui/icons-material/Person';
import BusinessIcon from '@mui/icons-material/Business';
import StarIcon from '@mui/icons-material/Star';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import WorkIcon from '@mui/icons-material/Work';
import DescriptionIcon from '@mui/icons-material/Description';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Documentos obrigatórios para a ratificação (referência para validação)
const DOCUMENTOS_OBRIGATORIOS = [
  { id: 'matricula', nome: 'Matrícula do Imóvel', descricao: 'Documento de registro da propriedade' },
  { id: 'car', nome: 'Certificado de CAR', descricao: 'Cadastro Ambiental Rural' },
  { id: 'art', nome: 'ART', descricao: 'Anotação de Responsabilidade Técnica' },
  { id: 'mapa', nome: 'Mapa da Propriedade', descricao: 'Mapa georreferenciado da propriedade' },
  { id: 'coc', nome: 'Certidão de Cadastro Imobiliário', descricao: 'Documento de comprovação de cadastro' },
];

// Interface para props do componente
interface RevisaoStepProps {
  formData: any;
  onBackClick: () => void;
}

/**
 * Componente para revisão final dos dados
 * Representa o último passo do processo de ratificação
 */
export default function RevisaoStep({ formData, onBackClick }: RevisaoStepProps) {
  // Estado para controle das seções expansíveis
  const [expandedSections, setExpandedSections] = React.useState<string[]>([
    'propriedade', 'proprietarios', 'documentos'
  ]);

  // Toggle para expandir/recolher seções
  const handleToggleSection = (section: string) => {
    setExpandedSections(prev => 
      prev.includes(section)
        ? prev.filter(s => s !== section)
        : [...prev, section]
    );
  };

  // Formatar data
  const formatDate = (dateString: string) => {
    if (!dateString) return '-';
    try {
      return new Date(dateString).toLocaleDateString('pt-BR');
    } catch (error) {
      return dateString;
    }
  };

  // Função para retornar o ícone baseado na extensão do arquivo
  const getIconByFileType = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    
    switch (extension) {
      case 'pdf':
        return <PictureAsPdfIcon />;
      case 'jpg':
      case 'jpeg':
      case 'png':
        return <ImageIcon />;
      default:
        return <InsertDriveFileIcon />;
    }
  };

  // Função para formatar o tamanho do arquivo
  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Verificação dos dados obrigatórios
  const verificarDadosObrigatorios = () => {
    const propriedadeCompleta = Boolean(formData.propriedade && formData.responsavel);
    const temProprietarios = formData.proprietarios && formData.proprietarios.length > 0;
    const temRepresentante = formData.proprietarios && formData.proprietarios.some((p: any) => p.representante);
    
    // Verifica se todos os documentos obrigatórios foram enviados
    const documentosObrigatoriosCompletos = DOCUMENTOS_OBRIGATORIOS.every(
      doc => formData.documentos && formData.documentos.some((d: any) => d.tipo === doc.id)
    );
    
    return {
      propriedadeCompleta,
      temProprietarios,
      temRepresentante,
      documentosObrigatoriosCompletos,
      tudoCompleto: propriedadeCompleta && temProprietarios && temRepresentante && documentosObrigatoriosCompletos
    };
  };

  const validacao = verificarDadosObrigatorios();

  return (
    <Box>
      <Typography level="title-md" sx={{ mb: 2 }}>
        Revisão dos Dados da Ratificação
      </Typography>
      
      {!validacao.tudoCompleto && (
        <Alert 
          variant="soft" 
          color="warning" 
          startDecorator={<ErrorOutlineIcon />}
          sx={{ mb: 3 }}
        >
          Há pendências que precisam ser resolvidas antes de finalizar a ratificação.
          Revise os dados nos passos anteriores.
        </Alert>
      )}
      
      {validacao.tudoCompleto && (
        <Alert 
          variant="soft" 
          color="success" 
          startDecorator={<CheckCircleOutlineIcon />}
          sx={{ mb: 3 }}
        >
          Todos os dados necessários foram preenchidos. Você pode enviar a ratificação para revisão.
        </Alert>
      )}
      
      {/* Seção de Dados da Propriedade */}
      <Accordion
        expanded={expandedSections.includes('propriedade')}
        onChange={() => handleToggleSection('propriedade')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          indicator={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: 'background.level1', 
            borderRadius: 'sm',
            '&:hover': { backgroundColor: 'background.level2' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography level="title-sm">Dados da Propriedade</Typography>
            {validacao.propriedadeCompleta ? (
              <Chip color="success" variant="soft" size="sm">Completo</Chip>
            ) : (
              <Chip color="danger" variant="soft" size="sm">Incompleto</Chip>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {formData.propriedade ? (
            <Box>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Nome da Propriedade
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.nome || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Código
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.codigo || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Matrícula
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.matricula || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Área Total (ha)
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.areaTotal || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Área Consolidada (ha)
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.areaConsolidada || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Área de Vegetação (ha)
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.areaVegetacao || '-'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6} md={8}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <LocationOnIcon fontSize="small" color="action" />
                        <Typography level="body-md">
                          {formData.propriedade.municipio || '-'} - {formData.propriedade.uf || '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid xs={12} sm={6} md={4}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <CalendarMonthIcon fontSize="small" color="action" />
                        <Typography level="body-xs" sx={{ color: 'text.secondary', mr: 1 }}>
                          Data de Aquisição:
                        </Typography>
                        <Typography level="body-md">
                          {formatDate(formData.propriedade.dataAquisicao) || '-'}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid xs={12}>
                      <Divider sx={{ my: 1 }} />
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Possui Georreferenciamento
                      </Typography>
                      <Typography level="body-md">
                        {formData.propriedade.possuiGeo === 'sim' ? 'Sim' : 'Não'}
                      </Typography>
                    </Grid>
                    <Grid xs={12} sm={6}>
                      <Typography level="body-xs" sx={{ color: 'text.secondary' }}>
                        Tipo de Imóvel
                      </Typography>
                      <Typography level="body-md" sx={{ textTransform: 'capitalize' }}>
                        {formData.propriedade.tipoImovel || '-'}
                      </Typography>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
              
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Responsável pela Ratificação
              </Typography>
              
              {formData.responsavel ? (
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Avatar size="sm">
                    <WorkIcon />
                  </Avatar>
                  <Box>
                    <Typography level="body-md">
                      {formData.responsavel.nome}
                    </Typography>
                    <Typography level="body-sm" sx={{ color: 'text.tertiary' }}>
                      {formData.responsavel.email}
                    </Typography>
                  </Box>
                </Box>
              ) : (
                <Typography level="body-sm" sx={{ color: 'danger.500' }}>
                  Nenhum responsável selecionado
                </Typography>
              )}
            </Box>
          ) : (
            <Typography level="body-sm" sx={{ color: 'danger.500' }}>
              Nenhuma propriedade selecionada
            </Typography>
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Seção de Proprietários */}
      <Accordion
        expanded={expandedSections.includes('proprietarios')}
        onChange={() => handleToggleSection('proprietarios')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          indicator={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: 'background.level1', 
            borderRadius: 'sm',
            '&:hover': { backgroundColor: 'background.level2' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography level="title-sm">Proprietários</Typography>
            {validacao.temProprietarios && validacao.temRepresentante ? (
              <Chip color="success" variant="soft" size="sm">Completo</Chip>
            ) : (
              <Chip color="danger" variant="soft" size="sm">Incompleto</Chip>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          {formData.proprietarios && formData.proprietarios.length > 0 ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              {formData.proprietarios.map((proprietario: any) => (
                <Card 
                  key={proprietario.id}
                  variant="outlined"
                  sx={{ position: 'relative' }}
                >
                  {proprietario.representante && (
                    <Chip
                      variant="solid"
                      color="warning"
                      size="sm"
                      startDecorator={<StarIcon />}
                      sx={{
                        position: 'absolute',
                        top: 8,
                        right: 8,
                      }}
                    >
                      Representante
                    </Chip>
                  )}
                  
                  <CardContent>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Avatar 
                        color={proprietario.tipo === 'fisica' ? 'primary' : 'success'}
                      >
                        {proprietario.tipo === 'fisica' ? <PersonIcon /> : <BusinessIcon />}
                      </Avatar>
                      
                      <Box sx={{ flex: 1 }}>
                        <Typography level="title-md">
                          {proprietario.nome}
                        </Typography>
                        <Typography level="body-sm">
                          {proprietario.tipo === 'fisica' ? 'CPF' : 'CNPJ'}: {proprietario.documento}
                        </Typography>
                        <Typography level="body-sm">
                          {proprietario.email}
                        </Typography>
                        <Typography level="body-sm">
                          {proprietario.telefone}
                        </Typography>
                      </Box>
                    </Box>
                  </CardContent>
                </Card>
              ))}
            </Box>
          ) : (
            <Typography level="body-sm" sx={{ color: 'danger.500' }}>
              Nenhum proprietário vinculado
            </Typography>
          )}
          
          {formData.proprietarios && formData.proprietarios.length > 0 && !validacao.temRepresentante && (
            <Alert 
              variant="soft" 
              color="warning" 
              startDecorator={<ErrorOutlineIcon />}
              sx={{ mt: 2 }}
            >
              Nenhum proprietário foi definido como representante.
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Seção de Documentos */}
      <Accordion
        expanded={expandedSections.includes('documentos')}
        onChange={() => handleToggleSection('documentos')}
        sx={{ mb: 2 }}
      >
        <AccordionSummary
          indicator={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: 'background.level1', 
            borderRadius: 'sm',
            '&:hover': { backgroundColor: 'background.level2' },
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography level="title-sm">Documentos</Typography>
            {validacao.documentosObrigatoriosCompletos ? (
              <Chip color="success" variant="soft" size="sm">Completo</Chip>
            ) : (
              <Chip color="danger" variant="soft" size="sm">Incompleto</Chip>
            )}
          </Box>
        </AccordionSummary>
        <AccordionDetails>
          <Typography level="title-sm" sx={{ mb: 1 }}>
            Documentos Obrigatórios
          </Typography>
          
          <List size="sm" sx={{ mb: 3 }}>
            {DOCUMENTOS_OBRIGATORIOS.map((doc) => {
              const uploaded = formData.documentos && formData.documentos.some((d: any) => d.tipo === doc.id);
              const documento = formData.documentos && formData.documentos.find((d: any) => d.tipo === doc.id);
              
              return (
                <ListItem key={doc.id}>
                  <ListItemDecorator>
                    {uploaded ? getIconByFileType(documento.arquivo) : <AttachFileIcon />}
                  </ListItemDecorator>
                  <ListItemContent>
                    <Typography level="body-sm">{doc.nome}</Typography>
                    {uploaded && (
                      <Typography level="body-xs" sx={{ mt: 0.5 }}>
                        {documento.arquivo} ({formatFileSize(documento.tamanho)})
                      </Typography>
                    )}
                  </ListItemContent>
                  {uploaded ? (
                    <Chip size="sm" color="success" variant="soft">Enviado</Chip>
                  ) : (
                    <Chip size="sm" color="danger" variant="soft">Pendente</Chip>
                  )}
                </ListItem>
              );
            })}
          </List>
          
          {formData.documentos && formData.documentos.filter((doc: any) => 
            !DOCUMENTOS_OBRIGATORIOS.some(o => o.id === doc.tipo)
          ).length > 0 && (
            <>
              <Typography level="title-sm" sx={{ mb: 1 }}>
                Documentos Adicionais
              </Typography>
              
              <Box 
                sx={{ 
                  display: 'grid',
                  gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
                  gap: 2
                }}
              >
                {formData.documentos
                  .filter((doc: any) => !DOCUMENTOS_OBRIGATORIOS.some(o => o.id === doc.tipo))
                  .map((doc: any) => (
                    <Card key={doc.id} variant="outlined" size="sm">
                      <CardOverflow>
                        <AspectRatio ratio="2">
                          <Box
                            sx={{
                              display: 'flex',
                              alignItems: 'center',
                              justifyContent: 'center',
                              bgcolor: 'background.level1',
                            }}
                          >
                            {getIconByFileType(doc.arquivo)}
                          </Box>
                        </AspectRatio>
                      </CardOverflow>
                      <CardContent>
                        <Typography level="title-sm">{doc.nome}</Typography>
                        <Typography level="body-xs" sx={{ mt: 0.5 }}>
                          {doc.arquivo} ({formatFileSize(doc.tamanho)})
                        </Typography>
                      </CardContent>
                    </Card>
                  ))}
              </Box>
            </>
          )}
          
          {!validacao.documentosObrigatoriosCompletos && (
            <Alert 
              variant="soft" 
              color="warning" 
              startDecorator={<ErrorOutlineIcon />}
              sx={{ mt: 2 }}
            >
              Há documentos obrigatórios pendentes de upload.
            </Alert>
          )}
        </AccordionDetails>
      </Accordion>
      
      {/* Seção de Informações de Processo */}
      <Accordion
        expanded={expandedSections.includes('processo')}
        onChange={() => handleToggleSection('processo')}
      >
        <AccordionSummary
          indicator={<ExpandMoreIcon />}
          sx={{ 
            backgroundColor: 'background.level1', 
            borderRadius: 'sm',
            '&:hover': { backgroundColor: 'background.level2' },
          }}
        >
          <Typography level="title-sm">Informações do Processo</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Stack spacing={2}>
            <Box>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Status Atual
              </Typography>
              <Typography level="body-md" sx={{ textTransform: 'capitalize' }}>
                {formData.status || 'Rascunho'}
              </Typography>
            </Box>
            
            <Box>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Data de Criação
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <CalendarMonthIcon fontSize="small" color="action" />
                <Typography level="body-md">
                  {formatDate(new Date().toISOString())}
                </Typography>
              </Box>
            </Box>
            
            <Box>
              <Typography level="body-sm" sx={{ color: 'text.secondary' }}>
                Última Atualização
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <AccessTimeIcon fontSize="small" color="action" />
                <Typography level="body-md">
                  {new Date().toLocaleTimeString('pt-BR')} - {formatDate(new Date().toISOString())}
                </Typography>
              </Box>
            </Box>
          </Stack>
        </AccordionDetails>
      </Accordion>
      
      {/* Rodapé com resumo da validação */}
      <Box sx={{ mt: 3, display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Divider />
        <Typography level="title-sm" sx={{ mt: 2 }}>
          Resumo da Validação
        </Typography>
        
        <List size="sm">
          <ListItem>
            <ListItemDecorator>
              {validacao.propriedadeCompleta ? 
                <CheckCircleOutlineIcon color="success" /> : 
                <ErrorOutlineIcon color="error" />
              }
            </ListItemDecorator>
            <ListItemContent>Dados da Propriedade</ListItemContent>
            {validacao.propriedadeCompleta ? 
              <Chip size="sm" color="success" variant="soft">Completo</Chip> : 
              <Chip size="sm" color="danger" variant="soft">Incompleto</Chip>
            }
          </ListItem>
          
          <ListItem>
            <ListItemDecorator>
              {validacao.temProprietarios && validacao.temRepresentante ? 
                <CheckCircleOutlineIcon color="success" /> : 
                <ErrorOutlineIcon color="error" />
              }
            </ListItemDecorator>
            <ListItemContent>Proprietários</ListItemContent>
            {validacao.temProprietarios && validacao.temRepresentante ? 
              <Chip size="sm" color="success" variant="soft">Completo</Chip> : 
              <Chip size="sm" color="danger" variant="soft">Incompleto</Chip>
            }
          </ListItem>
          
          <ListItem>
            <ListItemDecorator>
              {validacao.documentosObrigatoriosCompletos ? 
                <CheckCircleOutlineIcon color="success" /> : 
                <ErrorOutlineIcon color="error" />
              }
            </ListItemDecorator>
            <ListItemContent>Documentos Obrigatórios</ListItemContent>
            {validacao.documentosObrigatoriosCompletos ? 
              <Chip size="sm" color="success" variant="soft">Completo</Chip> : 
              <Chip size="sm" color="danger" variant="soft">Incompleto</Chip>
            }
          </ListItem>
        </List>
      </Box>
    </Box>
  );
} 