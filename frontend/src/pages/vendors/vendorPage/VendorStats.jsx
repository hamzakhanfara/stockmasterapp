import React from 'react';
import { Box, Typography, Button, Grid, Paper } from '@mui/material';
import { observer } from 'mobx-react-lite';
import InsertChartIcon from '@mui/icons-material/InsertChart';
import ReceiptIcon from '@mui/icons-material/Receipt';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PersonAddIcon from '@mui/icons-material/PersonAdd';

const stats = [
  {
    icon: <InsertChartIcon sx={{ fontSize: 32, color: '#ff5e5e' }} />,
    value: '$1k',
    label: 'Total Sales',
    sub: '+8% from yesterday',
    subColor: '#ff5e5e',
    bg: '#ffeaea',
  },
  {
    icon: <ReceiptIcon sx={{ fontSize: 32, color: '#ffb347' }} />,
    value: '300',
    label: 'Total Order',
    sub: '+5% from yesterday',
    subColor: '#ffb347',
    bg: '#fff6e5',
  },
  {
    icon: <CheckCircleIcon sx={{ fontSize: 32, color: '#4cd964' }} />,
    value: '5',
    label: 'Product Sold',
    sub: '+1.2% from yesterday',
    subColor: '#4cd964',
    bg: '#eafff2',
  },
  {
    icon: <PersonAddIcon sx={{ fontSize: 32, color: '#a259ff' }} />,
    value: '8',
    label: 'New Customers',
    sub: '0.5% from yesterday',
    subColor: '#a259ff',
    bg: '#f3eaff',
  },
];

const VendorStats = observer(({vendorsName, vendorDescription}) => {
    return (
  <Paper elevation={0} sx={{ px: 5, py: 2, borderRadius: 3, bgcolor: '#fff', boxShadow: '0 2px 8px #f0f1f2' }}>
    <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
      <Box>
        <Typography variant="h6" fontWeight={700} color="#232360">{vendorsName}</Typography>
        <Typography variant="body2" color="text.secondary">{vendorDescription}</Typography>
      </Box>
      <Button variant="outlined" size="small" sx={{ borderRadius: 2, textTransform: 'none' }}>Export</Button>
    </Box>
    <Grid container spacing={2} justifyContent="center">
      {stats.map((stat, idx) => (
        <Grid item xs={12} sm={6} md={3} key={idx} sx={{ display: 'flex' }}>
          <Box
            sx={{
              flex: 1,
              bgcolor: stat.bg,
              borderRadius: 2,
              p: 2.5,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'flex-start',
              minHeight: 120,
              width: '100%',
            }}
          >
            <Box mb={1}>{stat.icon}</Box>
            <Typography variant="h6" fontWeight={700}>{stat.value}</Typography>
            <Typography variant="body2" color="text.secondary" fontWeight={500}>{stat.label}</Typography>
            <Typography variant="caption" sx={{ color: stat.subColor, fontWeight: 600, mt: 0.5 }}>{stat.sub}</Typography>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Paper>
)});

export default VendorStats;
