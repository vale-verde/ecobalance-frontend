import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Sheet from '@mui/joy/Sheet';
import Divider from '@mui/joy/Divider';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import Accordion from '@mui/joy/Accordion';
import AccordionDetails from '@mui/joy/AccordionDetails';
import AccordionGroup from '@mui/joy/AccordionGroup';
import AccordionSummary from '@mui/joy/AccordionSummary';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Alert from '@mui/joy/Alert';
import Stack from '@mui/joy/Stack';
import Input from '@mui/joy/Input';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Textarea from '@mui/joy/Textarea';
import Grid from '@mui/joy/Grid';
import Table from '@mui/joy/Table';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemDecorator from '@mui/joy/ListItemDecorator';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import EmailIcon from '@mui/icons-material/Email';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';
import ArticleIcon from '@mui/icons-material/Article';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DescriptionIcon from '@mui/icons-material/Description';
import FactCheckIcon from '@mui/icons-material/FactCheck';
import ForestIcon from '@mui/icons-material/Forest';
import PersonIcon from '@mui/icons-material/Person';
import WarningIcon from '@mui/icons-material/Warning';
import SendIcon from '@mui/icons-material/Send';

/**
 * Página de Suporte e Documentação
 * 
 * Fornece informações sobre o sistema, tutoriais e recursos de ajuda
 */
export default function SuportePage() {
  const [tab, setTab] = React.useState(0);
  const [contactSuccess, setContactSuccess] = React.useState(false);
  const [contactForm, setContactForm] = React.useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleContactSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Em um sistema real, aqui enviaríamos o formulário
    setContactSuccess(true);
    // Reset form after 3 seconds
    setTimeout(() => {
      setContactSuccess(false);
      setContactForm({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 3000);
  };

  const handleContactChange = (field: string, value: string) => {
    setContactForm(prev => ({
      ...prev,
      [field]: value
    }));
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
        overflow: 'auto'
      }}
    >
      {/* Breadcrumbs para navegação */}
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
            href="/"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Suporte
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Cabeçalho da página */}
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
        <Typography level="h2" component="h1">
          Suporte e Documentação
        </Typography>
      </Box>

      {/* Alerta sobre prazo de ratificação */}
      <Alert 
        variant="soft" 
        color="warning" 
        startDecorator={<WarningIcon />}
        sx={{ mb: 3 }}
      >
        <Box>
          <Typography level="title-md">Prazo para Ratificação: 22 de outubro de 2025</Typography>
          <Typography level="body-sm">
            Produtores rurais com propriedades em faixa de fronteira devem realizar a ratificação até esta data.
          </Typography>
        </Box>
      </Alert>

      {/* Conteúdo com abas */}
      <Tabs
        value={tab}
        onChange={(event, value) => setTab(value as number)}
        sx={{ bgcolor: 'background.body' }}
      >
        <TabList
          tabFlex={1}
          size="sm"
          sx={{
            pl: { xs: 0, md: 4 },
            justifyContent: { xs: 'center', md: 'start' },
            [`&& .${tabClasses.root}`]: {
              fontWeight: '600',
              flex: { xs: '1', md: 'initial' },
              [`&.${tabClasses.selected}`]: {
                bgcolor: 'transparent',
                color: 'primary.500',
                '&::after': {
                  height: '2px',
                  bgcolor: 'primary.500',
                },
              },
            },
          }}
        >
          <Tab>Documentação</Tab>
          <Tab>Perguntas Frequentes</Tab>
          <Tab>Contato</Tab>
        </TabList>

        {/* Aba de Documentação */}
        <TabPanel value={0}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <Box sx={{ mb: 4 }}>
                <Typography level="h3" sx={{ mb: 2 }}>Sobre a Ratificação de Imóveis Rurais</Typography>
                <Typography sx={{ mb: 2 }}>
                  Produtores rurais que possuem propriedades dentro da faixa de fronteira — região situada a até 150 km do 
                  território nacional — precisam estar atentos à ratificação do registro imobiliário conforme a Lei Federal nº 13.178/2015.
                </Typography>

                <Alert 
                  variant="outlined" 
                  color="neutral" 
                  startDecorator={<InfoOutlinedIcon />}
                  sx={{ mb: 2 }}
                >
                  <Typography level="body-md">
                    A não regularização dentro do prazo pode resultar na titulação do imóvel pela União, causando a perda do direito 
                    de propriedade para o atual dono.
                  </Typography>
                </Alert>

                <Typography sx={{ mb: 2 }}>
                  O EcoBalance oferece uma solução completa para o gerenciamento do processo de ratificação, 
                  permitindo organizar documentos, acompanhar procedimentos e garantir a conformidade com a legislação vigente.
                </Typography>
                
                <Typography level="h4" sx={{ mb: 2, mt: 3 }}>Documentos Necessários para Ratificação</Typography>
                
                <Box sx={{ overflowX: 'auto' }}>
                  <Table sx={{ mb: 4 }}>
                    <thead>
                      <tr>
                        <th style={{ width: '30%' }}>Documento</th>
                        <th style={{ width: '50%' }}>Descrição</th>
                        <th style={{ width: '20%' }}>Obrigatório</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Matrícula do Imóvel</td>
                        <td>Registro atualizado da propriedade</td>
                        <td>Sim</td>
                      </tr>
                      <tr>
                        <td>Certificado de CAR</td>
                        <td>Cadastro Ambiental Rural</td>
                        <td>Sim</td>
                      </tr>
                      <tr>
                        <td>ART</td>
                        <td>Anotação de Responsabilidade Técnica</td>
                        <td>Sim</td>
                      </tr>
                      <tr>
                        <td>Mapa Georreferenciado</td>
                        <td>Planta técnica da propriedade</td>
                        <td>Sim</td>
                      </tr>
                      <tr>
                        <td>Certidão de Cadastro</td>
                        <td>Documento de comprovação cadastral</td>
                        <td>Sim</td>
                      </tr>
                      <tr>
                        <td>Escritura</td>
                        <td>Documento de transferência</td>
                        <td>Opcional</td>
                      </tr>
                      <tr>
                        <td>Certidões Negativas</td>
                        <td>Comprovação de ausência de débitos</td>
                        <td>Recomendado</td>
                      </tr>
                    </tbody>
                  </Table>
                </Box>
              </Box>

              <Divider sx={{ mb: 4 }} />

              <Box sx={{ mb: 4 }}>
                <Typography level="h3" sx={{ mb: 2 }}>Usando o EcoBalance</Typography>
                
                <AccordionGroup>
                  <Accordion>
                    <AccordionSummary indicator={<ExpandMoreIcon />}>
                      <Typography startDecorator={<FactCheckIcon />} level="title-md">
                        Como iniciar um processo de ratificação
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <List sx={{ pl: 2 }}>
                        <ListItem>
                          <ListItemDecorator>1.</ListItemDecorator>
                          Na página inicial, clique no botão "Nova Ratificação"
                        </ListItem>
                        <ListItem>
                          <ListItemDecorator>2.</ListItemDecorator>
                          Na primeira etapa, selecione ou cadastre a propriedade a ser ratificada
                        </ListItem>
                        <ListItem>
                          <ListItemDecorator>3.</ListItemDecorator>
                          Na etapa de proprietários, vincule os responsáveis pela propriedade
                        </ListItem>
                        <ListItem>
                          <ListItemDecorator>4.</ListItemDecorator>
                          Na etapa de documentação, faça upload dos documentos exigidos
                        </ListItem>
                        <ListItem>
                          <ListItemDecorator>5.</ListItemDecorator>
                          Na etapa de revisão, verifique todos os dados e confirme o processo
                        </ListItem>
                        <ListItem>
                          <ListItemDecorator>6.</ListItemDecorator>
                          Acompanhe o andamento do processo na seção "Ratificações"
                        </ListItem>
                      </List>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary indicator={<ExpandMoreIcon />}>
                      <Typography startDecorator={<ForestIcon />} level="title-md">
                        Gerenciando propriedades
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ mb: 2 }}>
                        O módulo de propriedades permite o registro detalhado de imóveis rurais, incluindo:
                      </Typography>
                      <List sx={{ pl: 2 }}>
                        <ListItem>Informações cadastrais (código, matrícula, localização)</ListItem>
                        <ListItem>Dados geográficos (área total, coordenadas)</ListItem>
                        <ListItem>Características ambientais (áreas de preservação, reserva legal)</ListItem>
                        <ListItem>Documentação (upload e gerenciamento de documentos)</ListItem>
                        <ListItem>Histórico de alterações e atualizações</ListItem>
                      </List>
                      <Typography sx={{ mt: 2 }}>
                        Para acessar, utilize o menu lateral "Propriedades" ou o atalho na página inicial.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary indicator={<ExpandMoreIcon />}>
                      <Typography startDecorator={<PersonIcon />} level="title-md">
                        Cadastro de clientes
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ mb: 2 }}>
                        O cadastro de clientes permite gerenciar:
                      </Typography>
                      <List sx={{ pl: 2 }}>
                        <ListItem>Dados de pessoas físicas e jurídicas</ListItem>
                        <ListItem>Informações de contato (telefone, email, endereço)</ListItem>
                        <ListItem>Documentação (CPF/CNPJ, RG)</ListItem>
                        <ListItem>Associação com propriedades</ListItem>
                        <ListItem>Histórico de processos de ratificação</ListItem>
                      </List>
                      <Typography sx={{ mt: 2 }}>
                        Para cadastrar um novo cliente, acesse o menu "Clientes" e clique no botão "Novo Cliente".
                      </Typography>
                    </AccordionDetails>
                  </Accordion>

                  <Accordion>
                    <AccordionSummary indicator={<ExpandMoreIcon />}>
                      <Typography startDecorator={<DescriptionIcon />} level="title-md">
                        Gerenciando documentos
                      </Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <Typography sx={{ mb: 2 }}>
                        O sistema permite realizar as seguintes operações com documentos:
                      </Typography>
                      <List sx={{ pl: 2 }}>
                        <ListItem>Upload de arquivos em diversos formatos (PDF, JPG, PNG)</ListItem>
                        <ListItem>Categorização por tipo de documento</ListItem>
                        <ListItem>Associação a propriedades e clientes</ListItem>
                        <ListItem>Controle de versões e histórico de alterações</ListItem>
                        <ListItem>Visualização diretamente no sistema</ListItem>
                        <ListItem>Download para armazenamento local</ListItem>
                      </List>
                      <Typography sx={{ mt: 2 }}>
                        Durante o processo de ratificação, o sistema indicará quais documentos são obrigatórios.
                      </Typography>
                    </AccordionDetails>
                  </Accordion>
                </AccordionGroup>
              </Box>
            </Grid>

            <Grid xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    Requisitos do Sistema
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <List sx={{ '--ListItem-paddingY': '0.5rem' }}>
                    <ListItem>
                      <ListItemDecorator>
                        <CheckCircleOutlineIcon color="success" />
                      </ListItemDecorator>
                      Navegador web atualizado
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        <CheckCircleOutlineIcon color="success" />
                      </ListItemDecorator>
                      Conexão à internet
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        <CheckCircleOutlineIcon color="success" />
                      </ListItemDecorator>
                      Resolução mínima: 1280x720
                    </ListItem>
                    <ListItem>
                      <ListItemDecorator>
                        <CheckCircleOutlineIcon color="success" />
                      </ListItemDecorator>
                      Scanner para digitalização
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography level="title-lg" sx={{ mb: 1 }}>
                    Links Úteis
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Stack spacing={1}>
                    <Link href="https://www.gov.br/incra" target="_blank">
                      INCRA - Instituto Nacional de Colonização e Reforma Agrária
                    </Link>
                    <Link href="https://www.gov.br/pt-br/servicos/consultar-o-cadastro-ambiental-rural-car" target="_blank">
                      Consulta ao Cadastro Ambiental Rural (CAR)
                    </Link>
                    <Link href="http://www.planalto.gov.br/ccivil_03/_ato2015-2018/2015/lei/l13178.htm" target="_blank">
                      Lei Federal nº 13.178/2015
                    </Link>
                    <Link href="https://ecobalance.com.br/docs/manual.pdf" target="_blank">
                      Manual do Usuário (PDF)
                    </Link>
                    <Link href="https://ecobalance.com.br/tutoriais" target="_blank">
                      Vídeos Tutoriais
                    </Link>
                  </Stack>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Aba de Perguntas Frequentes */}
        <TabPanel value={1}>
          <Grid container spacing={2}>
            <Grid xs={12} md={8}>
              <Typography level="h3" sx={{ mb: 3 }}>Perguntas Frequentes (FAQ)</Typography>
              
              <AccordionGroup sx={{ mb: 4 }}>
                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Qual o prazo limite para a ratificação?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      O prazo final para ratificação de imóveis rurais em faixa de fronteira é 22 de outubro de 2025, 
                      conforme a Lei Federal nº 13.178/2015.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Quais propriedades precisam ser ratificadas?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Todas as propriedades rurais localizadas na faixa de até 150 km da fronteira nacional precisam 
                      passar pelo processo de ratificação. Esta faixa é conhecida como "faixa de fronteira" e abrange 
                      diversos estados brasileiros que fazem divisa com países vizinhos.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      O que acontece se eu não fizer a ratificação no prazo?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      A União poderá requerer a titulação do imóvel, resultando na perda do direito de propriedade para 
                      o atual dono. Além disso, sem o devido registro, o produtor rural pode enfrentar dificuldades em 
                      financiamentos, venda do imóvel ou qualquer outra negociação envolvendo a terra.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Como sei se minha propriedade está na faixa de fronteira?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      O sistema EcoBalance possui ferramentas de geolocalização que podem identificar se sua propriedade 
                      está dentro da faixa de 150km da fronteira. Alternativamente, consulte o INCRA ou um engenheiro 
                      cartógrafo para essa verificação.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Preciso de ajuda técnica para fazer a ratificação?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Embora o sistema EcoBalance facilite o processo, recomendamos o acompanhamento de um profissional 
                      habilitado (advogado, engenheiro agrônomo ou técnico especializado) para garantir a conformidade legal. 
                      O processo envolve documentação técnica que pode exigir conhecimentos específicos.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Posso ratificar mais de uma propriedade ao mesmo tempo?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      Sim, o sistema EcoBalance permite gerenciar múltiplos processos de ratificação simultaneamente. 
                      Cada propriedade terá seu próprio processo individualizado, com documentação e acompanhamento específicos.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Os documentos enviados no sistema são aceitos legalmente?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      O sistema EcoBalance foi desenvolvido para gerenciar o processo, mas os documentos digitalizados são 
                      apenas cópias de apoio. Para o processo legal junto ao cartório, você precisará apresentar os 
                      documentos originais ou cópias autenticadas conforme exigido pela legislação local.
                    </Typography>
                  </AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary indicator={<ExpandMoreIcon />}>
                    <Typography level="title-md">
                      Qual o tamanho máximo de arquivo para upload?
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography>
                      O sistema aceita arquivos de até 20MB por documento. Caso seus arquivos sejam maiores, 
                      recomendamos compactá-los ou dividi-los em partes menores antes do upload.
                    </Typography>
                  </AccordionDetails>
                </Accordion>
              </AccordionGroup>
            </Grid>

            <Grid xs={12} md={4}>
              <Card variant="outlined" sx={{ mb: 2 }}>
                <CardContent>
                  <Typography level="title-lg" startDecorator={<HelpOutlineIcon />} sx={{ mb: 1 }}>
                    Ainda tem dúvidas?
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <Typography level="body-md" sx={{ mb: 2 }}>
                    Se você não encontrou a resposta para sua dúvida, entre em contato conosco:
                  </Typography>
                  <List sx={{ '--ListItem-paddingY': '0.25rem' }}>
                    <ListItem>
                      <Typography level="body-sm">
                        <strong>E-mail:</strong> suporte@ecobalance.com.br
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography level="body-sm">
                        <strong>Telefone:</strong> (00) 0000-0000
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography level="body-sm">
                        <strong>Horário:</strong> Segunda a Sexta, 8h às 18h
                      </Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Card variant="outlined">
                <CardContent>
                  <Typography level="title-lg" startDecorator={<ArticleIcon />} sx={{ mb: 1 }}>
                    Materiais para Download
                  </Typography>
                  <Divider sx={{ my: 1.5 }} />
                  <List sx={{ '--ListItem-paddingY': '0.5rem' }}>
                    <ListItem>
                      <Link href="https://ecobalance.com.br/docs/guia-rapido.pdf" target="_blank">Guia Rápido de Ratificação (PDF)</Link>
                    </ListItem>
                    <ListItem>
                      <Link href="https://ecobalance.com.br/docs/checklist.pdf" target="_blank">Checklist de Documentos (PDF)</Link>
                    </ListItem>
                    <ListItem>
                      <Link href="https://ecobalance.com.br/docs/procuracao.docx" target="_blank">Modelo de Procuração (DOCX)</Link>
                    </ListItem>
                    <ListItem>
                      <Link href="https://ecobalance.com.br/docs/formulario.pdf" target="_blank">Formulário de Declaração (PDF)</Link>
                    </ListItem>
                    <ListItem>
                      <Link href="https://ecobalance.com.br/docs/manual-sistema.pdf" target="_blank">Manual do Sistema (PDF)</Link>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </TabPanel>

        {/* Aba de Contato */}
        <TabPanel value={2}>
          <Grid container spacing={4}>
            <Grid xs={12} md={6}>
              <Typography level="h3" sx={{ mb: 3 }}>Entre em Contato</Typography>
              
              {contactSuccess ? (
                <Alert 
                  variant="soft" 
                  color="success" 
                  startDecorator={<CheckCircleOutlineIcon />}
                  sx={{ mb: 3 }}
                >
                  <Typography level="title-sm">Mensagem enviada com sucesso!</Typography>
                  <Typography level="body-sm">
                    Agradecemos o seu contato. Nossa equipe responderá em breve.
                  </Typography>
                </Alert>
              ) : (
                <form onSubmit={handleContactSubmit}>
                  <Stack spacing={2}>
                    <FormControl required>
                      <FormLabel>Nome</FormLabel>
                      <Input 
                        placeholder="Seu nome completo" 
                        value={contactForm.name}
                        onChange={(e) => handleContactChange('name', e.target.value)}
                      />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>E-mail</FormLabel>
                      <Input 
                        type="email" 
                        placeholder="seu.email@exemplo.com" 
                        value={contactForm.email}
                        onChange={(e) => handleContactChange('email', e.target.value)}
                      />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Assunto</FormLabel>
                      <Input 
                        placeholder="Informe o assunto" 
                        value={contactForm.subject}
                        onChange={(e) => handleContactChange('subject', e.target.value)}
                      />
                    </FormControl>

                    <FormControl required>
                      <FormLabel>Mensagem</FormLabel>
                      <Textarea 
                        minRows={4} 
                        placeholder="Descreva sua dúvida ou solicitação em detalhes"
                        value={contactForm.message}
                        onChange={(e) => handleContactChange('message', e.target.value)} 
                      />
                    </FormControl>

                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                      <Button
                        type="submit"
                        color="primary"
                        startDecorator={<SendIcon />}
                      >
                        Enviar Mensagem
                      </Button>
                    </Box>
                  </Stack>
                </form>
              )}
            </Grid>
            
            <Grid xs={12} md={6}>
              <Card variant="outlined" sx={{ p: 2, mb: 3 }}>
                <CardContent>
                  <Typography level="title-lg" startDecorator={<EmailIcon />} sx={{ mb: 2 }}>
                    Informações de Contato
                  </Typography>
                  <Divider sx={{ my: 2 }} />
                  <List>
                    <ListItem>
                      <Typography level="body-md">
                        <strong>E-mail:</strong> suporte@ecobalance.com.br
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography level="body-md">
                        <strong>Telefone:</strong> (00) 0000-0000
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography level="body-md">
                        <strong>Atendimento:</strong> Segunda a Sexta, das 8h às 18h
                      </Typography>
                    </ListItem>
                    <ListItem>
                      <Typography level="body-md">
                        <strong>Endereço:</strong> Av. Principal, 1000 - Centro, Cidade - UF, 00000-000
                      </Typography>
                    </ListItem>
                  </List>
                </CardContent>
              </Card>

              <Alert 
                variant="soft" 
                color="primary" 
                sx={{ mb: 3 }}
              >
                <Typography level="body-md">
                  Para dúvidas sobre o processo legal de ratificação, recomendamos consultar também:
                </Typography>
                <List>
                  <ListItem>
                    <Link href="https://www.gov.br/incra" target="_blank">
                      INCRA - Instituto Nacional de Colonização e Reforma Agrária
                    </Link>
                  </ListItem>
                  <ListItem>
                    <Link href="https://www.gov.br/spu/pt-br" target="_blank">
                      SPU - Secretaria de Patrimônio da União
                    </Link>
                  </ListItem>
                </List>
              </Alert>
            </Grid>
          </Grid>
        </TabPanel>
      </Tabs>
    </Box>
  );
} 