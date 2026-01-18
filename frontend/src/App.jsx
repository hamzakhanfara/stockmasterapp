import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { SignedIn, SignedOut, SignInButton } from '@clerk/clerk-react';
import { Box } from '@mui/material';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/Dashboard';
import { Vendors } from './pages/vendors/Vendors';
import VendorPage from './pages/vendors/vendorPage/VendorPage';
import Products from './pages/products/Products';
import Orders from './pages/orders/Orders';
import CreateOrderPage from './pages/orders/CreateOrderPage';
import POSPage from './pages/POSPage/POSPage';

function App() {
  return (
    <BrowserRouter>
      <SignedOut>
        <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
          <SignInButton />
        </Box>
      </SignedOut>
      <SignedIn>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/vendors" element={<Vendors />} />
            <Route path="/vendors/:id" element={<VendorPage />} />
            {/* Placeholder routes for future pages */}
            <Route path="/shelves" element={<div>Shelves Page (coming soon)</div>} />
            <Route path="/products" element={<Products />} />
            <Route path="/orders" element={<Orders />} />
            <Route path="/orders/create" element={<CreateOrderPage />} />
            <Route path="/pos" element={<POSPage />} />
            <Route path="/users" element={<div>Users Page (coming soon)</div>} />
            <Route path="/settings" element={<div>Settings Page (coming soon)</div>} />
          </Routes>
        </Layout>
      </SignedIn>
    </BrowserRouter>
  );
}

export default App;
