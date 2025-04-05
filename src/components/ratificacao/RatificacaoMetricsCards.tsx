import * as React from 'react';
import { ColorPaletteProp } from '@mui/joy/styles';
import Grid from '@mui/joy/Grid';
import Card from '@mui/joy/Card';
import Typography from '@mui/joy/Typography';
import Stack from '@mui/joy/Stack';
import Divider from '@mui/joy/Divider';
import Box from '@mui/joy/Box';

// Icons
import FormatListNumberedIcon from '@mui/icons-material/FormatListNumbered';
import PendingActionsIcon from '@mui/icons-material/PendingActions';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DoneAllIcon from '@mui/icons-material/DoneAll';
import { RatificacaoFilterOptions } from '../../data/ratificacoes';

/**
 * Props para o componente RatificacaoMetricsCards
 */
type RatificacaoMetricsCardsProps = {
  metrics: {
    total: number;
    pendentes: number;
    aprovadas: number;
    protocoladas: number;
  };
  onFilterClick: (status: RatificacaoFilterOptions['status']) => void;
  currentFilter: RatificacaoFilterOptions['status'];
};

/**
 * Componente que exibe métricas de ratificação em cartões clicáveis
 */
export default function RatificacaoMetricsCards({ 
  metrics, 
  onFilterClick,
  currentFilter
}: RatificacaoMetricsCardsProps) {
  // Define a configuração para cada cartão de métrica
  const metricCards = [
    {
      title: 'Total',
      value: metrics.total,
      icon: <FormatListNumberedIcon />,
      color: 'primary' as ColorPaletteProp,
      filter: 'all' as RatificacaoFilterOptions['status'],
      gradientFrom: '#2563eb',
      gradientTo: '#3b82f6',
    },
    {
      title: 'Pendentes',
      value: metrics.pendentes,
      icon: <PendingActionsIcon />,
      color: 'warning' as ColorPaletteProp,
      filter: 'pending' as RatificacaoFilterOptions['status'],
      gradientFrom: '#f59e0b',
      gradientTo: '#fbbf24',
    },
    {
      title: 'Aprovadas',
      value: metrics.aprovadas,
      icon: <CheckCircleOutlineIcon />,
      color: 'success' as ColorPaletteProp,
      filter: 'approved' as RatificacaoFilterOptions['status'],
      gradientFrom: '#059669',
      gradientTo: '#10b981',
    },
    {
      title: 'Protocoladas',
      value: metrics.protocoladas,
      icon: <DoneAllIcon />,
      color: 'info' as ColorPaletteProp,
      filter: 'protocoled' as RatificacaoFilterOptions['status'],
      gradientFrom: '#0284c7',
      gradientTo: '#0ea5e9',
    }
  ];

  return (
    <Grid container spacing={1.5} sx={{ mb: 2 }}>
      {metricCards.map((card) => {
        // Determine if card is selected
        const isSelected = currentFilter === card.filter;
        
        // Set styles based on selected state
        const cardStyle = isSelected 
          ? {
              background: `linear-gradient(135deg, ${card.gradientFrom}, ${card.gradientTo})`,
              color: 'white',
              boxShadow: 'sm',
              border: 'none',
            }
          : {
              background: `linear-gradient(135deg, ${card.gradientFrom}15, ${card.gradientTo}15)`,
              borderColor: `var(--joy-palette-${card.color}-200)`,
              boxShadow: 'xs',
            };
            
        return (
          <Grid xs={6} md={3} key={card.title}>
            <Card 
              variant={isSelected ? "solid" : "outlined"} 
              color={isSelected ? card.color : "neutral"}
              sx={{ 
                p: 0, 
                overflow: 'hidden',
                transition: 'all 0.2s',
                cursor: 'pointer',
                ...cardStyle,
                // Ensure border is never black in light theme
                borderColor: `var(--joy-palette-${card.color}-200)`,
                '&:hover': {
                  boxShadow: 'md',
                  transform: 'translateY(-2px)',
                  ...(isSelected 
                    ? {} 
                    : { borderColor: `var(--joy-palette-${card.color}-400)` }),
                },
              }} 
              onClick={() => onFilterClick(card.filter)}
            >
              <Box
                sx={{
                  position: 'relative',
                  zIndex: 1,
                  p: { xs: 1.5, md: 2 },
                  height: '100%',
                }}
              >
                <Stack
                  direction="row"
                  justifyContent="space-between"
                  alignItems="center"
                  spacing={1}
                  sx={{ mb: 0.5 }}
                >
                  <Typography 
                    level="body-md" 
                    sx={{ 
                      fontWeight: 600,
                      color: isSelected ? 'white' : `var(--joy-palette-text-secondary)`,
                    }}
                  >
                    {card.title}
                  </Typography>
                  <Box
                    sx={{
                      height: 32,
                      width: 32,
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderRadius: '8px',
                      color: isSelected ? 'white' : `var(--joy-palette-${card.color}-500)`,
                      backgroundColor: isSelected ? 'rgba(255,255,255,0.2)' : `var(--joy-palette-${card.color}-50)`,
                      boxShadow: isSelected ? 'none' : '0 1px 2px rgba(0,0,0,0.05)',
                    }}
                  >
                    {React.cloneElement(card.icon, { 
                      sx: { fontSize: '1.25rem' } 
                    })}
                  </Box>
                </Stack>
                
                <Typography 
                  level="h3" 
                  sx={{ 
                    fontSize: { xs: '1.75rem', md: '2rem' }, 
                    fontWeight: 700,
                    color: isSelected ? 'white' : `var(--joy-palette-text-primary)`,
                    lineHeight: 1,
                    textShadow: isSelected ? 'none' : '0 1px 1px rgba(0,0,0,0.05)',
                  }}
                >
                  {card.value}
                </Typography>
              </Box>
              
              {/* Subtle decorative element */}
              {!isSelected && (
                <Box 
                  sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    right: 0,
                    height: '3px',
                    background: `linear-gradient(90deg, ${card.gradientFrom}, ${card.gradientTo})`,
                  }}
                />
              )}
            </Card>
          </Grid>
        );
      })}
    </Grid>
  );
} 