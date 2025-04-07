import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Sheet from '@mui/joy/Sheet';
import Card from '@mui/joy/Card';
import CardContent from '@mui/joy/CardContent';
import CardOverflow from '@mui/joy/CardOverflow';
import CardActions from '@mui/joy/CardActions';
import Divider from '@mui/joy/Divider';
import IconButton from '@mui/joy/IconButton';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListItemContent from '@mui/joy/ListItemContent';
import ListItemDecorator from '@mui/joy/ListItemDecorator';
import AspectRatio from '@mui/joy/AspectRatio';
import LinearProgress from '@mui/joy/LinearProgress';
import Chip from '@mui/joy/Chip';
import Alert from '@mui/joy/Alert';
import Modal from '@mui/joy/Modal';
import ModalDialog from '@mui/joy/ModalDialog';
import ModalClose from '@mui/joy/ModalClose';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import Input from '@mui/joy/Input';
import Stack from '@mui/joy/Stack';
import Select from '@mui/joy/Select';
import Option from '@mui/joy/Option';
import Tab from '@mui/joy/Tab';
import TabList from '@mui/joy/TabList';
import Tabs from '@mui/joy/Tabs';
import TabPanel from '@mui/joy/TabPanel';
import { tabClasses } from '@mui/joy/Tab';

import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import VisibilityIcon from '@mui/icons-material/Visibility';
import WarningIcon from '@mui/icons-material/Warning';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import ImageIcon from '@mui/icons-material/Image';
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

// Interface para props do componente
interface DocumentosStepProps {
  formData: any;
  updateFormData: (field: string, value: any) => void;
  onBackClick: () => void;
}

// Documentos obrigatórios para a ratificação
const DOCUMENTOS_OBRIGATORIOS = [
  { id: 'matricula', nome: 'Matrícula do Imóvel', descricao: 'Documento de registro da propriedade' },
  { id: 'car', nome: 'Certificado de CAR', descricao: 'Cadastro Ambiental Rural' },
  { id: 'art', nome: 'ART', descricao: 'Anotação de Responsabilidade Técnica' },
  { id: 'mapa', nome: 'Mapa da Propriedade', descricao: 'Mapa georreferenciado da propriedade' },
  { id: 'coc', nome: 'Certidão de Cadastro Imobiliário', descricao: 'Documento de comprovação de cadastro' },
];

// Tipos de documentos aceitos
const TIPOS_DOCUMENTO = [
  { value: 'certificacao', label: 'Certificação' },
  { value: 'contrato', label: 'Contrato' },
  { value: 'laudo', label: 'Laudo Técnico' },
  { value: 'procuracao', label: 'Procuração' },
  { value: 'outro', label: 'Outro' },
];

/**
 * Componente para gerenciamento de documentos
 * Representa o terceiro passo do processo de ratificação
 */
export default function DocumentosStep({ formData, updateFormData, onBackClick }: DocumentosStepProps) {
  // Estado para lista de documentos
  const [documentos, setDocumentos] = React.useState<Array<any>>(formData.documentos || []);
  
  // Estado para modal de upload
  const [openUpload, setOpenUpload] = React.useState(false);
  const [tipoDocumento, setTipoDocumento] = React.useState('');
  const [nomeDocumento, setNomeDocumento] = React.useState('');
  const [descricaoDocumento, setDescricaoDocumento] = React.useState('');
  const [uploadProgress, setUploadProgress] = React.useState(0);
  const [isUploading, setIsUploading] = React.useState(false);
  const [uploadError, setUploadError] = React.useState<string | null>(null);
  
  // Estado para modal de visualização
  const [openPreview, setOpenPreview] = React.useState(false);
  const [previewDocument, setPreviewDocument] = React.useState<any>(null);
  
  // Referência para o input de arquivo
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  // Efeito para sincronizar documentos com o formData
  React.useEffect(() => {
    updateFormData('documentos', documentos);
  }, [documentos, updateFormData]);

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

  // Handler para abertura do modal de upload
  const handleOpenUpload = (documentoId?: string) => {
    if (documentoId) {
      // Preencher com dados do documento obrigatório
      const documento = DOCUMENTOS_OBRIGATORIOS.find(doc => doc.id === documentoId);
      if (documento) {
        setNomeDocumento(documento.nome);
        setDescricaoDocumento(documento.descricao);
        setTipoDocumento(documentoId);
      }
    } else {
      // Limpar campos para um novo documento
      setNomeDocumento('');
      setDescricaoDocumento('');
      setTipoDocumento('');
    }
    
    setOpenUpload(true);
  };

  // Handler para upload de arquivo
  const handleFileUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  // Handler para seleção de arquivo
  const handleFileSelected = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) return;
    
    const file = files[0];
    
    // Simular upload
    setIsUploading(true);
    setUploadProgress(0);
    setUploadError(null);
    
    const timer = setInterval(() => {
      setUploadProgress((prevProgress) => {
        if (prevProgress >= 100) {
          clearInterval(timer);
          return 100;
        }
        return prevProgress + 10;
      });
    }, 300);
    
    setTimeout(() => {
      clearInterval(timer);
      setIsUploading(false);
      setUploadProgress(100);
      
      // Adicionar documento à lista
      const newDocumento = {
        id: Math.random().toString(36).substr(2, 9),
        nome: nomeDocumento,
        descricao: descricaoDocumento,
        tipo: tipoDocumento,
        arquivo: file.name,
        tamanho: file.size,
        dataUpload: new Date().toISOString(),
        url: URL.createObjectURL(file), // Criar URL temporária para preview
      };
      
      setDocumentos((prev) => [...prev, newDocumento]);
      
      // Fechar modal após um breve delay
      setTimeout(() => {
        setOpenUpload(false);
        // Reset states
        setNomeDocumento('');
        setDescricaoDocumento('');
        setTipoDocumento('');
        setUploadProgress(0);
        
        // Limpar input de arquivo
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
      }, 1000);
    }, 3000);
  };

  // Handler para remoção de documento
  const handleRemoveDocument = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover este documento?')) {
      setDocumentos((prev) => prev.filter((doc) => doc.id !== id));
    }
  };

  // Handler para preview de documento
  const handlePreviewDocument = (documento: any) => {
    setPreviewDocument(documento);
    setOpenPreview(true);
  };

  // Verifica o status de upload de um documento obrigatório
  const getObrigatorioStatus = (id: string) => {
    return documentos.some((doc) => doc.tipo === id);
  };

  // Calcular percentual de documentos obrigatórios enviados
  const calcularPercentualUpload = () => {
    const totalObrigatorios = DOCUMENTOS_OBRIGATORIOS.length;
    const uploadedObrigatorios = DOCUMENTOS_OBRIGATORIOS.filter((doc) => 
      documentos.some((uploaded) => uploaded.tipo === doc.id)
    ).length;
    
    return (uploadedObrigatorios / totalObrigatorios) * 100;
  };

  // Renderiza o conteúdo do componente
  return (
    <Box>
      <Typography level="title-md" sx={{ mb: 2 }}>
        Documentos da Ratificação
      </Typography>
      
      <Sheet 
        variant="outlined"
        sx={{ 
          p: 2, 
          mb: 3, 
          borderRadius: 'sm'
        }}
      >
        <Typography level="title-sm" sx={{ mb: 2 }}>
          Documentos Obrigatórios
        </Typography>
        
        <Box sx={{ mb: 2 }}>
          <LinearProgress 
            determinate 
            value={calcularPercentualUpload()}
            sx={{ mb: 1 }}
          />
          <Typography level="body-sm">
            {Math.round(calcularPercentualUpload())}% dos documentos obrigatórios enviados
          </Typography>
        </Box>
        
        <List size="sm">
          {DOCUMENTOS_OBRIGATORIOS.map((doc) => {
            const uploaded = getObrigatorioStatus(doc.id);
            const documento = documentos.find((d) => d.tipo === doc.id);
            
            return (
              <ListItem key={doc.id}>
                <ListItemDecorator>
                  {uploaded ? getIconByFileType(documento!.arquivo) : <AttachFileIcon />}
                </ListItemDecorator>
                <ListItemContent>
                  <Typography level="body-sm">{doc.nome}</Typography>
                  <Typography level="body-xs" sx={{ color: 'text.tertiary' }}>
                    {doc.descricao}
                  </Typography>
                  {uploaded && (
                    <Typography level="body-xs" sx={{ mt: 0.5 }}>
                      {documento!.arquivo} ({formatFileSize(documento!.tamanho)})
                    </Typography>
                  )}
                </ListItemContent>
                {uploaded ? (
                  <Box sx={{ display: 'flex', gap: 1 }}>
                    <Chip size="sm" color="success" variant="soft">Enviado</Chip>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="primary"
                      onClick={() => handlePreviewDocument(documento)}
                    >
                      <VisibilityIcon />
                    </IconButton>
                    <IconButton
                      size="sm"
                      variant="plain"
                      color="danger"
                      onClick={() => handleRemoveDocument(documento!.id)}
                    >
                      <DeleteIcon />
                    </IconButton>
                  </Box>
                ) : (
                  <Button
                    size="sm"
                    variant="soft"
                    color="primary"
                    onClick={() => handleOpenUpload(doc.id)}
                  >
                    Enviar
                  </Button>
                )}
              </ListItem>
            );
          })}
        </List>
      </Sheet>
      
      {documentos.filter(doc => !DOCUMENTOS_OBRIGATORIOS.some(o => o.id === doc.tipo)).length > 0 && (
        <Sheet 
          variant="outlined"
          sx={{ 
            p: 2, 
            mb: 3, 
            borderRadius: 'sm'
          }}
        >
          <Typography level="title-sm" sx={{ mb: 2 }}>
            Documentos Adicionais
          </Typography>
          
          <Box 
            sx={{ 
              display: 'grid',
              gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' },
              gap: 2
            }}
          >
            {documentos
              .filter(doc => !DOCUMENTOS_OBRIGATORIOS.some(o => o.id === doc.tipo))
              .map((doc) => (
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
                  <CardActions buttonFlex="0 1 120px">
                    <Button
                      variant="plain"
                      color="neutral"
                      size="sm"
                      startDecorator={<VisibilityIcon />}
                      onClick={() => handlePreviewDocument(doc)}
                    >
                      Visualizar
                    </Button>
                    <Button
                      variant="plain"
                      color="danger"
                      size="sm"
                      startDecorator={<DeleteIcon />}
                      onClick={() => handleRemoveDocument(doc.id)}
                    >
                      Remover
                    </Button>
                  </CardActions>
                </Card>
              ))}
          </Box>
        </Sheet>
      )}
      
      {/* Input invisível para upload de arquivo */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        onChange={handleFileSelected}
        accept=".pdf,.jpg,.jpeg,.png,.doc,.docx"
      />
      
      {/* Modal de upload */}
      <Modal open={openUpload} onClose={() => !isUploading && setOpenUpload(false)}>
        <ModalDialog
          aria-labelledby="upload-modal-title"
          aria-describedby="upload-modal-description"
          sx={{ maxWidth: 500 }}
        >
          <ModalClose disabled={isUploading} />
          <Typography id="upload-modal-title" level="h2">
            Enviar Documento
          </Typography>
          <Typography id="upload-modal-description" textColor="text.tertiary">
            Selecione um arquivo para enviar como documento da ratificação.
          </Typography>
          <Divider sx={{ my: 2 }} />
          <Stack spacing={2}>
            <FormControl>
              <FormLabel>Tipo de Documento</FormLabel>
              <Select
                placeholder="Selecione o tipo de documento"
                value={tipoDocumento}
                onChange={(_, value) => setTipoDocumento(value as string)}
                disabled={isUploading || Boolean(tipoDocumento && DOCUMENTOS_OBRIGATORIOS.some(doc => doc.id === tipoDocumento))}
              >
                {DOCUMENTOS_OBRIGATORIOS.filter(doc => !getObrigatorioStatus(doc.id)).map((doc) => (
                  <Option key={doc.id} value={doc.id}>{doc.nome}</Option>
                ))}
                {TIPOS_DOCUMENTO.map((tipo) => (
                  <Option key={tipo.value} value={tipo.value}>{tipo.label}</Option>
                ))}
              </Select>
            </FormControl>
            
            <FormControl>
              <FormLabel>Nome do Documento</FormLabel>
              <Input
                placeholder="Nome do Documento"
                value={nomeDocumento}
                onChange={(e) => setNomeDocumento(e.target.value)}
                disabled={isUploading}
              />
            </FormControl>
            
            <FormControl>
              <FormLabel>Descrição</FormLabel>
              <Input
                placeholder="Descrição do Documento"
                value={descricaoDocumento}
                onChange={(e) => setDescricaoDocumento(e.target.value)}
                disabled={isUploading}
              />
            </FormControl>
            
            {isUploading && (
              <Box sx={{ width: '100%' }}>
                <LinearProgress
                  determinate
                  value={uploadProgress}
                  sx={{ my: 1 }}
                />
                <Typography level="body-sm" sx={{ textAlign: 'center' }}>
                  Enviando... {uploadProgress}%
                </Typography>
              </Box>
            )}
            
            {uploadError && (
              <Alert color="danger" startDecorator={<WarningIcon />}>
                {uploadError}
              </Alert>
            )}
            
            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end' }}>
              <Button
                variant="outlined"
                color="neutral"
                onClick={() => !isUploading && setOpenUpload(false)}
                disabled={isUploading}
              >
                Cancelar
              </Button>
              <Button
                variant="solid"
                color="primary"
                startDecorator={<CloudUploadIcon />}
                onClick={handleFileUpload}
                loading={isUploading}
                disabled={!nomeDocumento || !tipoDocumento || isUploading}
              >
                Selecionar Arquivo
              </Button>
            </Box>
          </Stack>
        </ModalDialog>
      </Modal>
      
      {/* Modal de preview */}
      <Modal open={openPreview} onClose={() => setOpenPreview(false)}>
        <ModalDialog
          aria-labelledby="preview-modal-title"
          sx={{ maxWidth: '90%', maxHeight: '90vh' }}
        >
          <ModalClose />
          <Typography id="preview-modal-title" level="h2">
            {previewDocument?.nome}
          </Typography>
          <Typography textColor="text.tertiary" sx={{ mb: 2 }}>
            {previewDocument?.descricao}
          </Typography>
          
          <Box sx={{ height: '70vh', overflow: 'auto' }}>
            {previewDocument?.url ? (
              previewDocument.arquivo.toLowerCase().endsWith('.pdf') ? (
                <iframe
                  src={previewDocument.url}
                  width="100%"
                  height="100%"
                  style={{ border: 'none' }}
                  title={previewDocument.nome}
                />
              ) : previewDocument.arquivo.toLowerCase().match(/\.(jpg|jpeg|png)$/) ? (
                <Box
                  component="img"
                  src={previewDocument.url}
                  alt={previewDocument.nome}
                  sx={{ maxWidth: '100%', maxHeight: '100%', display: 'block', margin: '0 auto' }}
                />
              ) : (
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <InsertDriveFileIcon sx={{ fontSize: 100, mb: 2 }} />
                  <Typography level="body-lg">
                    Não é possível visualizar este tipo de arquivo diretamente.
                  </Typography>
                  <Button
                    variant="solid"
                    color="primary"
                    startDecorator={<DownloadIcon />}
                    sx={{ mt: 2 }}
                    component="a"
                    href={previewDocument.url}
                    download={previewDocument.arquivo}
                  >
                    Baixar Arquivo
                  </Button>
                </Box>
              )
            ) : (
              <Typography level="body-lg" sx={{ textAlign: 'center' }}>
                Não foi possível carregar o documento.
              </Typography>
            )}
          </Box>
        </ModalDialog>
      </Modal>
    </Box>
  );
} 