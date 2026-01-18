
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
  };

  error = null;

  constructor(client) {
    makeAutoObservable(this, {
      fetchListOrders: flow,
      createOrder: flow,
      putOnHold: flow,
      getOrder: flow,
      updateOrder: flow,
      deleteOrder: flow,
    });
    if (client) this.client = client;
    this.setupFlows();
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
