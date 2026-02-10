
import { makeAutoObservable, flow } from "mobx";
import { STATE } from "../../constants";
import { ApiClient } from '../../api/client';

export default class OrderStore {
  client = null;
  ordersList = [];
  selectedOrder = null;

  fetchState = {
    list: STATE.DONE,
    create: STATE.DONE,
    get: STATE.DONE,
    update: STATE.DONE,
    delete: STATE.DONE,
    stats: STATE.DONE,
  };

  error = null;

  constructor(client) {
    makeAutoObservable(this, {
      fetchListOrders: flow,
      fetchListDraftOrders: flow,
      createOrder: flow,
      parkSale: flow,
      checkout: flow,
      putOnHold: flow,
      getOrder: flow,
      updateOrder: flow,
      deleteOrder: flow,
      fetchStats: flow,
    });
    if (client) this.client = client;
    this.setupFlows();
  }

  reset() {
    this.ordersList = [];
    this.selectedOrder = null;
    this.fetchState = {
      list: STATE.DONE,
      create: STATE.DONE,
      get: STATE.DONE,
      update: STATE.DONE,
      delete: STATE.DONE,
      stats: STATE.DONE,
    };
    this.error = null;
  }

  setupFlows() {
    this.fetchListOrders = flow(function* (params) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.list = STATE.PENDING;
      this.error = null;
      try {
        const data = yield this.client.listOrders(params);
        this.ordersList = data.orders || data;
        this.fetchState.list = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.list = STATE.ERROR;
      }
    }).bind(this);

    this.fetchListDraftOrders = flow(function* () {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.list = STATE.PENDING;
      this.error = null;
      try {
        const data = yield this.client.listDraftOrders();
        this.ordersList = data.orders || data;
        this.fetchState.list = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.list = STATE.ERROR;
      }
    }).bind(this);

    this.createOrder = flow(function* (orderData) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        // Map orderData to API shape
        const items = Array.isArray(orderData?.items) ? orderData.items.map(it => ({
          productId: it.id,
          quantity: it.units,
          price: it.unitPrice,
        })) : [];
        // Get current user to provide userId for backend
        const me = yield this.client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        const newOrder = yield this.client.createOrder({ userId, items });
        this.ordersList.push(newOrder);
        this.fetchState.create = STATE.DONE;
        return newOrder;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    // Checkout: create then set status to CONFIRMED
    this.checkout = flow(function* (orderData) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        const items = Array.isArray(orderData?.items) ? orderData.items.map(it => ({
          productId: it.id,
          quantity: it.units,
          price: it.unitPrice,
        })) : [];
        const me = yield this.client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        const newOrder = yield this.client.createOrder({ userId, items });
        const confirmed = yield this.client.updateOrder(newOrder.id, { status: 'CONFIRMED' });
        this.ordersList.push(confirmed);
        this.fetchState.create = STATE.DONE;
        return confirmed;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    // Park sale: create order in DRAFT status and do not decrement stock
    this.parkSale = flow(function* (orderData) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        const items = Array.isArray(orderData?.items) ? orderData.items.map(it => ({
          productId: it.id,
          quantity: it.units,
          price: it.unitPrice,
        })) : [];
        const me = yield this.client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        const draftOrder = yield this.client.createOrderDraft({ userId, items });
        this.ordersList.push(draftOrder);
        this.fetchState.create = STATE.DONE;
        return draftOrder;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    // Put order on hold: create then set status to WAITING
    this.putOnHold = flow(function* (orderData) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        const items = Array.isArray(orderData?.items) ? orderData.items.map(it => ({
          productId: it.id,
          quantity: it.units,
          price: it.unitPrice,
        })) : [];
        const me = yield this.client.getCurrentUser();
        const userId = me?.user?.id || me?.id;
        const newOrder = yield this.client.createOrder({ userId, items });
        const updated = yield this.client.updateOrder(newOrder.id, { status: 'WAITING' });
        this.ordersList.push(updated);
        this.fetchState.create = STATE.DONE;
        return updated;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    this.getOrder = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.get = STATE.PENDING;
      this.error = null;
      try {
        const order = yield this.client.getOrder(id);
        this.selectedOrder = order;
        this.fetchState.get = STATE.DONE;
        return order;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.get = STATE.ERROR;
      }
    }).bind(this);

    this.updateOrder = flow(function* (id, data) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.update = STATE.PENDING;
      this.error = null;
      try {
        const updatedOrder = yield this.client.updateOrder(id, data);
        const index = this.ordersList.findIndex(o => o.id === id);
        if (index !== -1) {
          this.ordersList[index] = updatedOrder;
        }
        if (this.selectedOrder?.id === id) {
          this.selectedOrder = updatedOrder;
        }
        this.fetchState.update = STATE.DONE;
        return updatedOrder;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.update = STATE.ERROR;
      }
    }).bind(this);

    this.deleteOrder = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.delete = STATE.PENDING;
      this.error = null;
      try {
        yield this.client.deleteOrder(id);
        this.ordersList = this.ordersList.filter(o => o.id !== id);
        if (this.selectedOrder?.id === id) {
          this.selectedOrder = null;
        }
        this.fetchState.delete = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.delete = STATE.ERROR;
      }
    }).bind(this);
    this.downloadOrderPdf = flow(function* (id) {
        if (!this.client) {
            this.error = 'ApiClient not set';
        return;
        }
        try {
            const pdfBlob = yield this.client.downloadOrderPdf(id);
            // Téléchargement côté navigateur
            const url = window.URL.createObjectURL(pdfBlob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `order_${id}.pdf`;
            document.body.appendChild(a);
            a.click();
            a.remove();
            window.URL.revokeObjectURL(url);
        } catch (err) {
            this.error = err?.message || String(err);
        }
    }).bind(this);

    this.fetchStats = flow(function* () {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.stats = STATE.PENDING;
      this.error = null;
      try {
        const data = yield this.client.getOrderStats();
        this.orderStats = data.stats || data;
        this.fetchState.stats = STATE.DONE;
        return this.orderStats;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.stats = STATE.ERROR;
      }
    }).bind(this);
  }

  setClient(client) {
    this.client = client;
  }

  clearError() {
    this.error = null;
  }

  clearSelectedOrder() {
    this.selectedOrder = null;
  }
}
