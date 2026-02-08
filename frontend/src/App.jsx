import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { SignedIn, SignedOut, useAuth } from '@clerk/clerk-react';
import { Layout } from './components/layout/Layout';
import { Dashboard } from './pages/dashboard/Dashboard';
import { Vendors } from './pages/vendors/Vendors';
import VendorPage from './pages/vendors/vendorPage/VendorPage';
import Products from './pages/products/Products';
import Orders from './pages/orders/Orders';
import CreateOrderPage from './pages/orders/CreateOrderPage';
import POSPage from './pages/POSPage/POSPage';
import LandingPage from './pages/landingPage/LandingPage';
import SignInPage from './pages/auth/SignInPage';
import SignUpPage from './pages/auth/SignUpPage';

const LandingPageWrapper = () => {
  const { isSignedIn } = useAuth();
  
  if (isSignedIn) {
    return <Navigate to="/dashboard" replace />;
  }
  
  return <LandingPage />;
};

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public routes */}
        <Route path="/" element={<LandingPageWrapper />} />
        <Route path="/sign-in" element={<SignInPage />} />
        <Route path="/sign-up" element={<SignUpPage />} />
        
        {/* Protected routes */}
        <Route
          path="/dashboard"
          element={
            <SignedIn>
              <Layout>
                <Dashboard />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/vendors"
          element={
            <SignedIn>
              <Layout>
                <Vendors />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/vendors/:id"
          element={
            <SignedIn>
              <Layout>
                <VendorPage />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/products"
          element={
            <SignedIn>
              <Layout>
                <Products />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/orders"
          element={
            <SignedIn>
              <Layout>
                <Orders />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/orders/create"
          element={
            <SignedIn>
              <Layout>
                <CreateOrderPage />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/pos"
          element={
            <SignedIn>
              <Layout>
                <POSPage />
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/shelves"
          element={
            <SignedIn>
              <Layout>
                <div>Shelves Page (coming soon)</div>
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/users"
          element={
            <SignedIn>
              <Layout>
                <div>Users Page (coming soon)</div>
              </Layout>
            </SignedIn>
          }
        />
        <Route
          path="/settings"
          element={
            <SignedIn>
              <Layout>
                <div>Settings Page (coming soon)</div>
              </Layout>
            </SignedIn>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
