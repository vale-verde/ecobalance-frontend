import * as React from 'react';
import { styled } from '@mui/joy/styles';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

interface RatificacaoProgressBarProps {
  progress: number;
  width?: string | number;
  showLabel?: boolean;
}

/**
 * Componente para exibir a barra de progresso de ratificação
 */
export default function RatificacaoProgressBar({ 
  progress, 
  width = '100%',
  showLabel = true
}: RatificacaoProgressBarProps) {
  // Determina a cor da barra com base no progresso
  const getColorForProgress = (value: number): 'danger' | 'warning' | 'primary' | 'success' => {
    if (value < 25) return 'danger';
    if (value < 50) return 'warning';
    if (value < 100) return 'primary';
    return 'success';
  };
  
  const color = getColorForProgress(progress);
  
  return (
    <Box sx={{ width, display: 'flex', alignItems: 'center', gap: 1 }}>
      <LinearProgress
        determinate
        variant="solid"
        color={color}
        value={progress}
        sx={{ flex: 1 }}
      />
      {showLabel && (
        <Typography level="body-xs" sx={{ flexShrink: 0 }}>
          {progress}%
        </Typography>
      )}
    </Box>
  );
} 