import React, { useContext, useEffect } from 'react';
import { DataGrid } from '@mui/x-data-grid';
import { Paper, Stack, IconButton, Chip, Tooltip } from '@mui/material';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DeleteIcon from '@mui/icons-material/Delete';
import VisibilityIcon from '@mui/icons-material/Visibility';
import { useTranslation } from 'react-i18next';
import { observer } from 'mobx-react-lite';
import { useApiClient } from '../../api/client';
import { useStore } from '../../context/useStoreHooks';


function getColumns(orderStore, t, onView) {
  return [
    { field: 'orderNumber', headerName: t('orders.orderNumber') || 'Order #', flex: 0.8, minWidth: 140 },
    { field: 'date', headerName: t('table.createdAt') || 'Created At', flex: 0.8, minWidth: 140 },
    {
      field: 'status',
      headerName: t('orders.status') || 'Status',
      flex: 0.6,
      minWidth: 120,
      renderCell: (params) => {
        const s = params.value;
        const color = s === 'CONFIRMED' ? 'success' : s === 'WAITING' ? 'warning' : 'default';
        return <Chip size="small" label={s} color={color} variant="outlined" />;
      },
    },
    { field: 'total', headerName: t('orders.totalAmount') || 'Total', flex: 0.6, minWidth: 120 },
    { field: 'details', headerName: t('orders.items') || 'Items', flex: 1.2, minWidth: 220 },
    {
      field: 'actions',
      headerName: t('table.actions') || 'Actions',
      flex: 0.6,
      minWidth: 150,
      sortable: false,
      filterable: false,
      renderCell: (params) => (
        <Stack direction="row" spacing={0.5}>
          <Tooltip title={t('orders.view') || 'View'}>
            <IconButton size="small" onClick={() => onView?.(params.row.id)}>
              <VisibilityIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('orders.printPdf') || 'Print PDF'}>
            <IconButton size="small" onClick={() => orderStore.downloadOrderPdf(params.row.id)}>
              <PictureAsPdfIcon fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title={t('common.delete') || 'Delete'}>
            <IconButton size="small" onClick={() => orderStore.deleteOrder(params.row.id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Tooltip>
        </Stack>
      ),
    },
  ];
}


const OrdersTable = observer(({ordersList, onView}) => {
    const rootStore = useStore();
    const orderStore = rootStore.Order;
    const getClient = useApiClient();
  const { t } = useTranslation();
  // Adapter les données pour le DataGrid
  const rows = (ordersList || []).map(order => ({
    id: order.id,
    orderNumber: order.orderNumber,
    date: order.createdAt ? new Date(order.createdAt).toLocaleDateString() : '',
    status: order.status,
    total: Number(order.totalAmount).toFixed(2),
    details: order.items ? order.items.map(i => `${i.quantity}x ${i.product?.name || ''}`).join(', ') : '',
  }));

  return (
    <Paper sx={{ p: 2 }}>
      <DataGrid
        autoHeight
        rows={rows}
        columns={getColumns(orderStore, t, onView)}
        pageSize={10}
        rowsPerPageOptions={[10, 25, 50]}
        disableSelectionOnClick
        loading={orderStore.fetchState.list === 'pending'}
        hideFooterSelectedRowCount
        initialState={{ sorting: { sortModel: [{ field: 'date', sort: 'desc' }] } }}
      />
    </Paper>
  );
});
export default OrdersTable;