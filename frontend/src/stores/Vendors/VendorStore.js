import { makeAutoObservable, flow } from "mobx";
import { STATE } from "../../constants";
import { ApiClient } from '../../api/client';

export default class VendorStore {
  client = null;
  vendorslist = [];
  selectedVendor = null;
  
  fetchState = {
    list: STATE.DONE,
    create: STATE.DONE,
    get: STATE.DONE,
    update: STATE.DONE,
    delete: STATE.DONE,
  }
  
  error = null;

  constructor(client) {
    makeAutoObservable(this, {
      fetchListVendors: flow,
      createVendor: flow,
      getVendor: flow,
      updateVendor: flow,
      deleteVendor: flow,
    });
    if (client) this.client = client;
    this.setupFlows();
  }

  setupFlows() {
    this.fetchListVendors = flow(function* () {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.list = STATE.PENDING;
      this.error = null;
      try {
        const data = yield this.client.listVendors();
        this.vendorslist = data.vendors;
        this.fetchState.list = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.list = STATE.ERROR;
      }
    }).bind(this);

    this.createVendor = flow(function* (name, userId, description) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        const newVendor = yield this.client.createVendor(name, userId, description);
        this.vendorslist.push(newVendor);
        this.fetchState.create = STATE.DONE;
        return newVendor;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    this.getVendor = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.get = STATE.PENDING;
      this.error = null;
      try {
        const vendor = yield this.client.getVendor(id);
        this.selectedVendor = vendor;
        this.fetchState.get = STATE.DONE;
        return vendor;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.get = STATE.ERROR;
      }
    }).bind(this);

    this.updateVendor = flow(function* (id, data) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.update = STATE.PENDING;
      this.error = null;
      try {
        const updatedVendor = yield this.client.updateVendor(id, data);
        const index = this.vendorslist.findIndex(v => v.id === id);
        if (index !== -1) {
          this.vendorslist[index] = updatedVendor;
        }
        if (this.selectedVendor?.id === id) {
          this.selectedVendor = updatedVendor;
        }
        this.fetchState.update = STATE.DONE;
        return updatedVendor;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.update = STATE.ERROR;
      }
    }).bind(this);

    this.deleteVendor = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.delete = STATE.PENDING;
      this.error = null;
      try {
        yield this.client.deleteVendor(id);
        this.vendorslist = this.vendorslist.filter(v => v.id !== id);
        if (this.selectedVendor?.id === id) {
          this.selectedVendor = null;
        }
        this.fetchState.delete = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.delete = STATE.ERROR;
      }
    }).bind(this);
  }
  
  setClient(client) {
    this.client = client;
  }

  clearError() {
    this.error = null;
  }

  clearSelectedVendor() {
    this.selectedVendor = null;
  }
}
