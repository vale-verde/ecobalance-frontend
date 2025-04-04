import * as React from 'react';
import { CssVarsProvider } from '@mui/joy/styles';
import CssBaseline from '@mui/joy/CssBaseline';
import Box from '@mui/joy/Box';
import Button from '@mui/joy/Button';
import Breadcrumbs from '@mui/joy/Breadcrumbs';
import Link from '@mui/joy/Link';
import Typography from '@mui/joy/Typography';

import HomeRoundedIcon from '@mui/icons-material/HomeRounded';
import ChevronRightRoundedIcon from '@mui/icons-material/ChevronRightRounded';
import DownloadRoundedIcon from '@mui/icons-material/DownloadRounded';

import Sidebar from './components/Sidebar';
import OrderTable from './components/OrderTable';
import OrderList from './components/OrderList';
import Header from './components/Header';
import ClientesPage from './pages/ClientesPage';

export default function JoyOrderDashboardTemplate() {
  const [currentPage, setCurrentPage] = React.useState<string>('dashboard');
  
  // Simple routing function
  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'clientes':
        return <ClientesPage />;
      case 'dashboard':
      default:
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
            }}
          >
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
                  href="#some-link"
                  aria-label="Home"
                >
                  <HomeRoundedIcon />
                </Link>
                <Link
                  underline="hover"
                  color="neutral"
                  href="#some-link"
                  sx={{ fontSize: 12, fontWeight: 500 }}
                >
                  Dashboard
                </Link>
                <Typography color="primary" sx={{ fontWeight: 500, fontSize: 12 }}>
                  Orders
                </Typography>
              </Breadcrumbs>
            </Box>
            <Box
              sx={{
                display: 'flex',
                mb: 1,
                gap: 1,
                flexDirection: { xs: 'column', sm: 'row' },
                alignItems: { xs: 'start', sm: 'center' },
                flexWrap: 'wrap',
                justifyContent: 'space-between',
              }}
            >
              <Typography level="h2" component="h1">
                Orders
              </Typography>
              <Button
                color="primary"
                startDecorator={<DownloadRoundedIcon />}
                size="sm"
              >
                Download PDF
              </Button>
            </Box>
            <OrderTable />
            <OrderList />
          </Box>
        );
    }
  };

  // Create a context to share the navigation state
  const NavigationContext = React.createContext({
    currentPage,
    setCurrentPage,
  });

  return (
    <CssVarsProvider disableTransitionOnChange>
      <CssBaseline />
      <NavigationContext.Provider value={{ currentPage, setCurrentPage }}>
        <Box sx={{ display: 'flex', minHeight: '100dvh' }}>
          <Header />
          <Sidebar 
            onNavigate={(page: string) => setCurrentPage(page)} 
            currentPage={currentPage}
          />
          {renderCurrentPage()}
        </Box>
      </NavigationContext.Provider>
    </CssVarsProvider>
  );
}
