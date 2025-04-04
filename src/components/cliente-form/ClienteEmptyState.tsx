import * as React from 'react';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AssignmentIndIcon from '@mui/icons-material/AssignmentInd';

type ClienteEmptyStateProps = {
  onCreateClick: () => void;
};

export default function ClienteEmptyState({ onCreateClick }: ClienteEmptyStateProps) {
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
        <AssignmentIndIcon sx={{ fontSize: 40, color: 'primary.500' }} />
      </Box>
      
      <Typography level="h3">Nenhum cliente selecionado</Typography>
      
      <Typography
        level="body-md"
        sx={{ color: 'text.secondary', maxWidth: 500, mb: 2 }}
      >
        Selecione um cliente na lista ao lado para visualizar seus detalhes, ou
        crie um novo cliente usando o botão abaixo.
      </Typography>
      
      <Button
        variant="solid"
        color="primary"
        size="lg"
        startDecorator={<PersonAddIcon />}
        onClick={onCreateClick}
        sx={{ mt: 2 }}
      >
        Criar Novo Cliente
      </Button>
    </Stack>
  );
} 