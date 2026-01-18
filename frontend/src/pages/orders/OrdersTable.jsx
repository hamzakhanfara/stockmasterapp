import React, { useContext, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Stack, Button } from '@mui/material';
import { observer } from 'mobx-react-lite';
import { useApiClient } from '../../api/client';
import { useStore } from '../../context/useStoreHooks';


function getColumns(orderStore) {
  return [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'date', headerName: 'Date', width: 130 },
    { field: 'status', headerName: 'Statut', width: 120 },
    { field: 'total', headerName: 'Total (€)', width: 120 },
    { field: 'details', headerName: 'Détails', width: 200 },
    {
      field: 'actions',
      headerName: 'Actions',
      width: 180,
      renderCell: (params) => (
        <Stack direction="row" spacing={1}>
          <Button size="small">Supprimer</Button>
          <Button size="small">Refaire</Button>
          <Button size="small" onClick={() => orderStore.downloadOrderPdf(params.row.id)}>PDF</Button>
        </Stack>
      ),
    },
  ];
}


const OrdersTable = observer(({ordersList}) => {
    const rootStore = useStore();
    const orderStore = rootStore.Order;
    const getClient = useApiClient();
  // Adapter les données pour le DataGrid
  const rows = ordersList.map(order => ({
    id: order.id,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    status: order.status,
    total: order.totalAmount,
    details: order.items ? order.items.map(i => `${i.quantity}x ${i.product?.name || ''}`).join(', ') : '',
  }));

  return (
    <Paper sx={{ p: 2 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={getColumns(orderStore)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        disableSelectionOnClick
        loading={orderStore.fetchState.list === 'pending'}
      />
    </Paper>
  );
});
export default OrdersTable;