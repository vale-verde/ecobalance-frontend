import * as React from 'react';
import Box from '@mui/joy/Box';
import Typography from '@mui/joy/Typography';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Stepper from '@mui/joy/Stepper';
import Step from '@mui/joy/Step';
import StepIndicator from '@mui/joy/StepIndicator';
import Check from '@mui/icons-material/Check';
import Sheet from '@mui/joy/Sheet';
import Stack from '@mui/joy/Stack';
import CircularProgress from '@mui/joy/CircularProgress';
import { useNavigate } from 'react-router-dom';

import PropriedadeStep from '../components/novaRatificacao/PropriedadeStep';
import ProprietariosStep from '../components/novaRatificacao/ProprietariosStep';
import DocumentosStep from '../components/novaRatificacao/DocumentosStep';
import RevisaoStep from '../components/novaRatificacao/RevisaoStep';
import RatificacaoProgressBar from '../components/ratificacao/RatificacaoProgressBar';

/**
 * Tela de Nova Ratificação
 * 
 * Implementa um fluxo multi-etapas para criar processos de ratificação
 * para propriedades rurais, permitindo automatizar a geração
 * de documentos legais para processos de ratificação ambiental.
 */
export default function NovaRatificacaoPage() {
  const navigate = useNavigate();
  // Estado para controle do passo atual
  const [activeStep, setActiveStep] = React.useState(0);
  // Estado para controle de carregamento
  const [loading, setLoading] = React.useState(false);
  // Estado para rastrear o progresso de preenchimento
  const [progressPercent, setProgressPercent] = React.useState(0);
  // Estado para os dados do formulário
  const [formData, setFormData] = React.useState({
    propriedade: null,
    responsavel: null,
    proprietarios: [],
    documentos: [],
    status: 'rascunho'
  });

  // Passos do processo de ratificação
  const steps = [
    'Propriedade', 
    'Proprietários', 
    'Documentos', 
    'Revisão'
  ];

  // Função para verificar se o passo atual está completo
  const isStepComplete = (step: number) => {
    switch (step) {
      case 0: // Propriedade
        return formData.propriedade !== null && formData.responsavel !== null;
      case 1: // Proprietários
        return formData.proprietarios.length > 0;
      case 2: // Documentos
        return formData.documentos.length >= 3; // Exemplo: mínimo de 3 documentos
      case 3: // Revisão
        return true; // Revisão sempre pode avançar
      default:
        return false;
    }
  };

  // Atualizar o percentual de progresso
  React.useEffect(() => {
    // Lógica simples para calcular o progresso
    const totalFields = 4; // Propriedade, responsável, proprietários, documentos
    let completedFields = 0;
    
    if (formData.propriedade) completedFields += 1;
    if (formData.responsavel) completedFields += 1;
    if (formData.proprietarios.length > 0) completedFields += 1;
    if (formData.documentos.length >= 3) completedFields += 1;
    
    setProgressPercent(Math.round((completedFields / totalFields) * 100));
  }, [formData]);

  // Manipuladores para navegação entre passos
  const handleNext = () => {
    if (activeStep < steps.length - 1) {
      setActiveStep((prevStep) => prevStep + 1);
    }
  };

  const handleBack = () => {
    if (activeStep > 0) {
      setActiveStep((prevStep) => prevStep - 1);
    } else {
      // Se estiver no primeiro passo, volta para a tela de ratificações
      navigate('/ratificacoes');
    }
  };

  // Manipulador para salvar como rascunho
  const handleSaveAsDraft = async () => {
    setLoading(true);
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1000));
      alert('Ratificação salva como rascunho com sucesso!');
      
      // Atualiza o status
      setFormData(prev => ({
        ...prev,
        status: 'rascunho'
      }));
    } catch (error) {
      console.error('Erro ao salvar rascunho:', error);
      alert('Erro ao salvar rascunho.');
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para enviar para revisão
  const handleSendForReview = async () => {
    setLoading(true);
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Ratificação enviada para revisão com sucesso!');
      
      // Atualiza o status
      setFormData(prev => ({
        ...prev,
        status: 'revisao'
      }));
    } catch (error) {
      console.error('Erro ao enviar para revisão:', error);
      alert('Erro ao enviar para revisão.');
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para gerar ratificação
  const handleGenerateRatification = async () => {
    setLoading(true);
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 2000));
      alert('Documentos de ratificação gerados com sucesso!');
      
      // Atualiza o status
      setFormData(prev => ({
        ...prev,
        status: 'aprovada'
      }));
    } catch (error) {
      console.error('Erro ao gerar ratificação:', error);
      alert('Erro ao gerar documentos de ratificação.');
    } finally {
      setLoading(false);
    }
  };

  // Manipulador para protocolar ratificação
  const handleConfirmProtocol = async () => {
    setLoading(true);
    try {
      // Simulação de chamada de API
      await new Promise(resolve => setTimeout(resolve, 1500));
      alert('Ratificação protocolada com sucesso!');
      
      // Atualiza o status
      setFormData(prev => ({
        ...prev,
        status: 'protocolada'
      }));
    } catch (error) {
      console.error('Erro ao protocolar ratificação:', error);
      alert('Erro ao protocolar ratificação.');
    } finally {
      setLoading(false);
    }
  };

  // Atualiza os dados do formulário
  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Renderiza o conteúdo do passo atual
  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return (
          <PropriedadeStep 
            formData={formData} 
            updateFormData={updateFormData}
            onBackClick={() => navigate('/ratificacoes')}
          />
        );
      case 1:
        return (
          <ProprietariosStep 
            formData={formData} 
            updateFormData={updateFormData}
            onBackClick={handleBack}
          />
        );
      case 2:
        return (
          <DocumentosStep 
            formData={formData} 
            updateFormData={updateFormData}
            onBackClick={handleBack}
          />
        );
      case 3:
        return (
          <RevisaoStep 
            formData={formData}
            onBackClick={handleBack}
          />
        );
      default:
        return <div>Passo não encontrado</div>;
    }
  };

  // Renderiza os botões de ação conforme o passo atual
  const renderActionButtons = () => {
    const isLastStep = activeStep === steps.length - 1;
    const canProceed = isStepComplete(activeStep);
    
    return (
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Stack direction="row" spacing={1}>
          <Button
            variant="outlined"
            color="neutral"
            onClick={handleBack}
            startDecorator={activeStep === 0 ? <ArrowBackIcon /> : undefined}
            disabled={loading}
          >
            Voltar
          </Button>
          
          <Button
            variant="outlined"
            color="primary"
            onClick={handleSaveAsDraft}
            disabled={loading}
          >
            Salvar Rascunho
          </Button>
        </Stack>
        
        <Stack direction="row" spacing={1}>
          {isLastStep ? (
            <>
              {formData.status === 'rascunho' && (
                <Button
                  variant="solid"
                  color="primary"
                  onClick={handleSendForReview}
                  disabled={!canProceed || loading || progressPercent < 100}
                >
                  {loading ? <CircularProgress size="sm" /> : 'Enviar para Revisão'}
                </Button>
              )}
              
              {formData.status === 'revisao' && (
                <Button
                  variant="solid"
                  color="success"
                  onClick={handleGenerateRatification}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size="sm" /> : 'Gerar Ratificação'}
                </Button>
              )}
              
              {formData.status === 'aprovada' && (
                <Button
                  variant="solid"
                  color="success"
                  onClick={handleConfirmProtocol}
                  disabled={loading}
                >
                  {loading ? <CircularProgress size="sm" /> : 'Protocolar'}
                </Button>
              )}
            </>
          ) : (
            <Button
              variant="solid"
              color="primary"
              onClick={handleNext}
              disabled={!canProceed || loading}
            >
              Próximo
            </Button>
          )}
        </Stack>
      </Box>
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
            href="#home"
            aria-label="Home"
          >
            <HomeRoundedIcon />
          </Link>
          <Link
            underline="hover"
            color="neutral"
            href="/ratificacoes"
            onClick={(e) => {
              e.preventDefault();
              navigate('/ratificacoes');
            }}
          >
            Ratificações
          </Link>
          <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
            Nova Ratificação
          </Typography>
        </Breadcrumbs>
      </Box>
      
      {/* Cabeçalho da página */}
      <Box
        sx={{
          display: 'flex',
          mb: 2,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 2,
        }}
      >
        <Typography level="h2" component="h1">
          Nova Ratificação
        </Typography>
        
        <Box 
          sx={{ 
            display: 'flex', 
            flexDirection: 'row', 
            alignItems: 'center', 
            gap: 2,
            borderRadius: 'sm',
            py: 1,
            px: 2,
            minWidth: 220,
            justifyContent: 'space-between'
          }}
        >
          <Typography level="body-sm" sx={{ whiteSpace: 'nowrap' }}>
            Preenchimento: {progressPercent}%
          </Typography>
          <RatificacaoProgressBar 
            progress={progressPercent} 
            width={120}
            showLabel={false}
          />
        </Box>
      </Box>
      
      {/* Stepper para navegação entre etapas - Sem background e borda */}
      <Box sx={{ mb: 2 }}>
        <Stepper sx={{ width: '100%' }}>
          {steps.map((label, index) => (
            <Step 
              key={label}
              active={activeStep === index}
              completed={activeStep > index}
              indicator={
                <StepIndicator 
                  variant={activeStep === index ? 'solid' : 'soft'}
                  color={activeStep === index ? 'primary' : 'neutral'}
                >
                  {activeStep > index ? (
                    <Check fontSize="small" />
                  ) : (
                    index + 1
                  )}
                </StepIndicator>
              }
            >
              {label}
            </Step>
          ))}
        </Stepper>
      </Box>
      
      {/* Conteúdo do passo atual */}
      <Sheet 
        variant="outlined"
        sx={{ 
          borderRadius: 'sm',
          p: { xs: 2, md: 3 },
          flex: 1,
          overflow: 'auto'
        }}
      >
        {renderStepContent()}
      </Sheet>
      
      {/* Botões de ação */}
      <Sheet 
        variant="outlined"
        sx={{ 
          borderRadius: 'sm',
          p: 2
        }}
      >
        {renderActionButtons()}
      </Sheet>
    </Box>
  );
} 