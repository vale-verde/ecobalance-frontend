export function openSidebar() {
  if (typeof window !== 'undefined') {
    document.body.style.overflow = 'hidden';
    document.documentElement.style.setProperty('--SideNavigation-slideIn', '1');
  }
}

export function closeSidebar() {
  if (typeof window !== 'undefined') {
    document.documentElement.style.removeProperty('--SideNavigation-slideIn');
    document.body.style.removeProperty('overflow');
  }
}

export function toggleSidebar() {
  if (typeof window !== 'undefined' && typeof document !== 'undefined') {
    const slideIn = window
      .getComputedStyle(document.documentElement)
      .getPropertyValue('--SideNavigation-slideIn');
    if (slideIn) {
      closeSidebar();
    } else {
      openSidebar();
    }
  }
}

/**
 * Estilo de scrollbar personalizado para manter consistência visual em toda a aplicação
 * 
 * Este objeto contém todos os estilos necessários para personalizar a barra de rolagem,
 * incluindo largura, cores, border-radius e comportamento ao passar o mouse.
 */
export const customScrollbarStyle = {
  overflowX: 'hidden' as const,
  scrollbarWidth: 'thin' as const,
  '&::-webkit-scrollbar': {
    width: '6px',
    backgroundColor: 'transparent',
  },
  '&::-webkit-scrollbar-thumb': {
    backgroundColor: 'rgba(0,0,0,0.08)',
    borderRadius: '10px',
    transition: 'background-color 0.3s ease',
    '&:hover': {
      backgroundColor: 'rgba(25, 118, 210, 0.3)',
    }
  },
  '&::-webkit-scrollbar-track': {
    backgroundColor: 'transparent',
    margin: '4px 0',
  },
};
