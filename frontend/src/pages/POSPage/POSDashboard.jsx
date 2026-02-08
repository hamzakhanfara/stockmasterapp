import { Accordion, AccordionDetails, AccordionSummary, Paper, Typography, Tabs, Tab, Stack, TextField, InputAdornment, Grid, Card, CardContent, Chip, Button, MenuItem, Pagination, Divider, Box } from '@mui/material';
import { observer } from 'mobx-react-lite';
import React from 'react';
import { useTranslation } from 'react-i18next';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import SearchIcon from '@mui/icons-material/Search';
import AddShoppingCartIcon from '@mui/icons-material/AddShoppingCart';
import { formatCurrency } from '../../utils/currency';

const POSDashboard = observer(({ activeTab, onTabChange, search, onSearchChange, products, onAddToCart, heldOrders = [], heldLoading = false, onToggleHeld, onResumeDraft, onDeleteDraft }) => {
  const { t } = useTranslation();
  const [expanded, setExpanded] = React.useState(false);
  const [page, setPage] = React.useState(1);
  const [pageSize, setPageSize] = React.useState(12);

  const handleChange = (panel) => (_event, isExpanded) => {
    setExpanded(isExpanded ? panel : false);
    if (isExpanded && panel === 'panel1' && typeof onToggleHeld === 'function') {
      onToggleHeld();
    }
  };

  React.useEffect(() => {
    setPage(1);
  }, [products, search, pageSize, activeTab]);

  const totalPages = Math.max(1, Math.ceil((products?.length || 0) / pageSize));
  const startIndex = (page - 1) * pageSize;
  const currentProducts = (products || []).slice(startIndex, startIndex + pageSize);

  return (
    <Stack spacing={2}>
      <Typography variant="h5">{t('posDashboard.title') || 'POS'}</Typography>
      <Accordion sx={{ color: 'inherit' }} expanded={expanded === 'panel1'} onChange={handleChange('panel1')}>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1bh-content"
          id="panel1bh-header"
        >
          <Typography variant="h6">{t('pos.parkedSalesPending') || 'Parked Sales (Pending)'}</Typography>
        </AccordionSummary>
        <AccordionDetails>
          {heldLoading ? (
            <Typography variant="body2">{t('common.loading')}</Typography>
          ) : heldOrders.length === 0 ? (
            <Typography variant="body2" color="text.secondary">{t('common.noData')}</Typography>
          ) : (
            <Paper variant="outlined" sx={{ borderRadius: 2 }}>
              {heldOrders.map((o, idx) => {
                const created = o.createdAt ? new Date(o.createdAt) : null;
                const timeStr = created ? created.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : '';
                const now = new Date();
                const diffMin = created ? Math.max(0, Math.round((now.getTime() - created.getTime()) / 60000)) : 0;
                return (
                  <React.Fragment key={o.id}>
                    <Box sx={{ p: 2, display: 'grid', rowGap: 1, columnGap: 2, gridTemplateColumns: { xs: '1fr', sm: '2fr 2fr 1fr auto' }, alignItems: 'center' }}>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('pos.orderId') || 'Order ID'}</Typography>
                        <Typography variant="body2" sx={{ fontWeight: 600 }}>#{o.orderNumber}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('pos.timeParked') || 'Time Parked'}</Typography>
                        <Typography variant="body2">{timeStr} {diffMin ? `(${diffMin}m ${t('pos.ago') || 'ago'})` : ''}</Typography>
                      </Box>
                      <Box>
                        <Typography variant="caption" color="text.secondary">{t('pos.totalAmount') || 'Total Amount'}</Typography>
                        <Typography variant="body2" color="primary" sx={{ fontWeight: 700 }}>{formatCurrency(o.totalAmount)}</Typography>
                      </Box>
                      <Box sx={{ justifySelf: { xs: 'start', sm: 'end' } }}>
                        <Button size="small" variant="outlined" onClick={() => onResumeDraft && onResumeDraft(o.id)}>{t('pos.resume') || 'Resume'}</Button>
                      </Box>
                    </Box>
                    {idx < heldOrders.length - 1 && <Divider />}
                  </React.Fragment>
                );
              })}
            </Paper>
          )}
        </AccordionDetails>
      </Accordion>

      <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'stretch', sm: 'center' }} justifyContent="space-between" spacing={{ xs: 1.5, sm: 2 }}>
        <Tabs value={activeTab} onChange={onTabChange} sx={{ minHeight: 40 }}>
          <Tab value="all" label={t('pos.allProducts') || 'All Products'} sx={{ minHeight: 40 }} />
          <Tab value="electronics" label={t('pos.electronics') || 'Electronics'} disabled sx={{ minHeight: 40 }} />
          <Tab value="furniture" label={t('pos.furniture') || 'Furniture'} disabled sx={{ minHeight: 40 }} />
          <Tab value="accessories" label={t('pos.accessories') || 'Accessories'} disabled sx={{ minHeight: 40 }} />
          <Tab value="fooddrink" label={t('pos.foodAndDrink') || 'Food & Drink'} disabled sx={{ minHeight: 40 }} />
        </Tabs>
        <TextField
          placeholder={t('pos.search') || 'Search'}
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          size="small"
          sx={{ width: { xs: '100%', sm: 260, md: 340 }, '& .MuiInputBase-root': { height: 40 } }}
          InputProps={{ startAdornment: (<InputAdornment position="start"><SearchIcon /></InputAdornment>) }}
        />
      </Stack>

      <Grid container spacing={2}>
        {currentProducts.length === 0 ? (
          <Grid item xs={12}>
            <Paper elevation={0} sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">{t('common.noData')}</Typography>
            </Paper>
          </Grid>
        ) : currentProducts.map((p) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={p.id}>
            <Card sx={{ borderRadius: 2, boxShadow: '0 2px 8px #eef0f3' }}>
              <CardContent>
                <Stack spacing={1}>
                  <Typography variant="subtitle2" noWrap>{p.name}</Typography>
                  <Stack direction="row" spacing={1} alignItems="center">
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>{formatCurrency(p.price)}</Typography>
                    <Chip
                      size="small"
                      label={`${t('pos.stock') || 'Stock'}: ${Number(p.stock || 0)}`}
                      color={p.stock > 10 ? 'success' : p.stock > 0 ? 'warning' : 'default'}
                      variant={p.stock > 0 ? 'filled' : 'outlined'}
                    />
                  </Stack>
                  <Button variant="contained" startIcon={<AddShoppingCartIcon />} onClick={() => onAddToCart(p)} sx={{ mt: 1 }}>
                    {t('pos.addToCart') || 'Add to cart'}
                  </Button>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ mt: 2 }}>
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2">{t('pos.perPage') || 'Per page'}:</Typography>
          <TextField select size="small" value={pageSize} onChange={(e) => setPageSize(Number(e.target.value))} sx={{ width: 100 }}>
            {[8,12,24,48].map(opt => (
              <MenuItem key={opt} value={opt}>{opt}</MenuItem>
            ))}
          </TextField>
        </Stack>
        <Pagination count={totalPages} page={page} onChange={(_e, val) => setPage(val)} color="primary" />
      </Stack>
    </Stack>
  );
});

export default POSDashboard;