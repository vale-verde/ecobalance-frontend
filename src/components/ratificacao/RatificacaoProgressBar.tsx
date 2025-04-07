import * as React from 'react';
import { styled } from '@mui/joy/styles';
import LinearProgress from '@mui/joy/LinearProgress';
import Typography from '@mui/joy/Typography';
import Box from '@mui/joy/Box';

export interface RatificacaoProgressBarProps {
  progress?: number;
  value?: number; // Alias para progress para compatibilidade
  width?: number;
  showLabel?: boolean;
}

/**
 * Barra de progresso para exibir o avanço do processo de ratificação
 * 
 * Pode ser customizada com diferentes tamanhos e opção para exibir
 * ou ocultar o rótulo com o percentual.
 */
export default function RatificacaoProgressBar({
  progress,
  value,
  width = 100,
  showLabel = true
}: RatificacaoProgressBarProps) {
  // Usar value como fallback se progress não for fornecido
  const progressValue = progress !== undefined ? progress : (value || 0);
  
  return (
    <Box sx={{ width: width }}>
      <LinearProgress
        determinate
        value={progressValue}
        sx={{
          [`& .MuiLinearProgress-bar`]: {
            transition: 'transform 0.3s linear',
          },
        }}
      />
      {showLabel && (
        <Typography
          level="body-xs"
          sx={{
            display: 'block',
            textAlign: 'center',
            mt: 0.5,
          }}
        >
          {progressValue}%
        </Typography>
      )}
    </Box>
  );
} 