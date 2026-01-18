import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, CircularProgress, Alert } from '@mui/material';
import { useAuth } from '@clerk/clerk-react';
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from 'recharts';

export const Dashboard = () => {
  const { getToken } = useAuth();
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShelves: 0,
    totalVendors: 0,
    lowStockProducts: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const token = await getToken();
        setStats({
          totalProducts: 24,
          totalShelves: 5,
          totalVendors: 3,
          lowStockProducts: 2,
        });
        setError(null);
      } catch (err) {
        setError('Failed to fetch dashboard stats');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, [getToken]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '400px' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return <Alert severity="error">{error}</Alert>;
  }

  const mockSalesData = [
    { name: 'Mon', sales: 400 },
    { name: 'Tue', sales: 300 },
    { name: 'Wed', sales: 200 },
    { name: 'Thu', sales: 278 },
    { name: 'Fri', sales: 189 },
    { name: 'Sat', sales: 239 },
    { name: 'Sun', sales: 349 },
  ];

  const mockStockData = [
    { name: 'In Stock', value: stats.totalProducts - stats.lowStockProducts },
    { name: 'Low Stock', value: stats.lowStockProducts },
  ];

  const COLORS = ['#1976d2', '#ff9800'];

  return (
    <Box>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 'bold' }}>
        Dashboard
      </Typography>
    </Box>
  );
};
