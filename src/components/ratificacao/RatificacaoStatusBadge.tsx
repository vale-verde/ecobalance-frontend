import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Chip from '@mui/joy/Chip';
import EditNoteIcon from '@mui/icons-material/EditNote';
import PendingIcon from '@mui/icons-material/Pending';
import RateReviewIcon from '@mui/icons-material/RateReview';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

type RatificacaoStatus = 'draft' | 'adjustment' | 'review' | 'approved';

interface RatificacaoStatusBadgeProps {
  status: RatificacaoStatus;
  size?: 'sm' | 'md' | 'lg';
}

/**
 * Componente para exibir distintivos de status para ratificações
 */
export default function RatificacaoStatusBadge({ status, size = 'sm' }: RatificacaoStatusBadgeProps) {
  // Configuração para cada tipo de status
  const statusConfig: Record<
    RatificacaoStatus, 
    { label: string; color: ColorPaletteProp; icon: React.ReactNode }
  > = {
    draft: {
      label: 'Rascunho',
      color: 'neutral',
      icon: <EditNoteIcon />
    },
    adjustment: {
      label: 'Ajuste',
      color: 'warning',
      icon: <PendingIcon />
    },
    review: {
      label: 'Revisão',
      color: 'primary',
      icon: <RateReviewIcon />
    },
    approved: {
      label: 'Aprovada',
      color: 'success',
      icon: <CheckCircleIcon />
    }
  };
  
  const config = statusConfig[status];
  
  return (
    <Chip
      variant="soft"
      size={size}
      color={config.color}
      startDecorator={config.icon}
      sx={{ fontWeight: 500 }}
    >
      {config.label}
    </Chip>
  );
} 