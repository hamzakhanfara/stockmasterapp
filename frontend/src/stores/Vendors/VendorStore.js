import { makeAutoObservable, flow } from "mobx";
import { STATE } from "../../constants";
import { ApiClient } from '../../api/client';

export default class VendorStore {
  client = null;
  vendorslist = [];
  selectedVendor = null;
  vendorStats = null;
  
  fetchState = {
    list: STATE.DONE,
    create: STATE.DONE,
    get: STATE.DONE,
    update: STATE.DONE,
    delete: STATE.DONE,
    stats: STATE.DONE,
  }
  
  error = null;

  constructor(client) {
    makeAutoObservable(this, {
      fetchListVendors: flow,
      createVendor: flow,
      getVendor: flow,
      updateVendor: flow,
      deleteVendor: flow,
      fetchVendorStats: flow,
    });
    if (client) this.client = client;
    this.setupFlows();
  }

  reset() {
    this.vendorslist = [];
    this.selectedVendor = null;
    this.vendorStats = null;
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

    this.createVendor = flow(function* (name, userId, description, extra = {}) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        let newVendor = yield this.client.createVendor(name, userId, description, extra);
        newVendor = newVendor?.vendor || newVendor;
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
        let vendor = yield this.client.getVendor(id);
        vendor = vendor?.vendor || vendor;
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
        let updatedVendor = yield this.client.updateVendor(id, data);
        updatedVendor = updatedVendor?.vendor || updatedVendor;
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

    this.fetchVendorStats = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.stats = STATE.PENDING;
      this.error = null;
      try {
        const result = yield this.client.getVendorStats(id);
        this.vendorStats = result.stats;
        this.fetchState.stats = STATE.DONE;
        return result.stats;
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

  clearSelectedVendor() {
    this.selectedVendor = null;
  }
}
