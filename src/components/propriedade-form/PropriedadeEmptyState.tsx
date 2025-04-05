import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import AddHomeWorkIcon from '@mui/icons-material/AddHomeWork';
import BusinessIcon from '@mui/icons-material/Business';

/**
 * Props para o componente de estado vazio de propriedade
 */
type PropriedadeEmptyStateProps = {
  onCreateClick: () => void;
};

/**
 * Componente que exibe um estado vazio quando nenhuma propriedade está selecionada
 * 
 * Apresenta uma mensagem informativa e um botão para criar uma nova propriedade,
 * melhorando a experiência do usuário quando não há conteúdo para exibir
 */
export default function PropriedadeEmptyState({ onCreateClick }: PropriedadeEmptyStateProps) {
  return (
    <Stack
      spacing={2}
      alignItems="center"
      justifyContent="center"
      sx={{
        flex: 1,
        minHeight: 400,
        py: 8,
        px: 2,
        textAlign: 'center',
      }}
    >
      <Box
        sx={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          backgroundColor: 'background.level2',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          mb: 2,
        }}
      >
        <BusinessIcon sx={{ fontSize: 40, color: 'primary.500' }} />
      </Box>
      
      <Typography level="h3">Nenhuma propriedade selecionada</Typography>
      
      <Typography
        level="body-md"
        sx={{ color: 'text.secondary', maxWidth: 500, mb: 2 }}
      >
        Selecione uma propriedade na lista ao lado para visualizar seus detalhes, ou
        crie uma nova propriedade usando o botão abaixo.
      </Typography>
      
      <Button
        variant="solid"
        color="primary"
        size="lg"
        startDecorator={<AddHomeWorkIcon />}
        onClick={onCreateClick}
        sx={{ mt: 2 }}
        data-testid="empty-state-create-button"
      >
        Criar Nova Propriedade
      </Button>
    </Stack>
  );
} 