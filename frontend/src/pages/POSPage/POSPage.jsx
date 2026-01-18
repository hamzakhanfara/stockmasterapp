import React from 'react';
import { Box } from '@mui/material';
import CreateOrderPage from '../orders/CreateOrderPage';
import POSDashboard from './POSDashboard';
import POSCart from './POSCart';

export default function POSPage() {
  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      {/* Partie gauche (vide pour l'instant) */}
      <Box sx={{ flex: 1, borderRight: '1px solid #eee', bgcolor: '#fafbfc' }}>
        <POSDashboard />
      </Box>
      {/* Partie droite (Order UI) */}
      <Box sx={{ flex: 1.2, p: 0, overflow: 'auto' }}>
        <POSCart />
      </Box>
    </Box>
  );
}
