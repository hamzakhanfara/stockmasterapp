import React, {useEffect} from 'react';
import OrdersTable from './OrdersTable';
import { Paper, Stack, Typography, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useApiClient } from '../../api/client';
import { useStore } from '../../context/useStoreHooks';
import { STATE } from '../../constants/index';
import { observer } from 'mobx-react-lite';



function OrdersStats() {
  // Dummy stats, replace with real data later
  return (
    <Paper sx={{ p: 2, mb: 2 }}>
      <Stack direction="row" spacing={4}>
        <Stack>
          <Typography variant="h6">Total Orders</Typography>
          <Typography variant="h4">2</Typography>
        </Stack>
        <Stack>
          <Typography variant="h6">Total Revenue</Typography>
          <Typography variant="h4">200 €</Typography>
        </Stack>
        <Stack>
          <Typography variant="h6">En cours</Typography>
          <Typography variant="h4">1</Typography>
        </Stack>
      </Stack>
    </Paper>
  );
}

const Orders = observer(() =>{
  const navigate = useNavigate();
  const rootStore = useStore();
  const orderStore = rootStore.Order;
  const getClient = useApiClient();
  useEffect(() => {
    let mounted = true;
    const initAndFetch = async () => {
        try {
            if (!orderStore.client) {
                const client = await getClient();
                if (mounted) orderStore.setClient(client);
            }
            if (mounted) await orderStore.fetchListOrders();
        } catch (err) {
            console.error('Error loading orders:', err);
        }
    };
    initAndFetch();
    return () => { mounted = false; };
  }, []);
  return (
    <Stack spacing={2}>
      <OrdersStats />
      <Button
        variant="contained"
        color="primary"
        sx={{ alignSelf: 'flex-end', mb: 2 }}
        onClick={() => navigate('/orders/create')}
      >
        Créer un nouvel order
      </Button>
      <OrdersTable ordersList={orderStore.ordersList} />
    </Stack>
  );
})
export default Orders;