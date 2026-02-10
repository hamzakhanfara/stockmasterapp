import { makeAutoObservable, flow } from "mobx";
import { STATE } from "../../constants";
import { ApiClient } from '../../api/client';

export default class ProductStore {
  client = null;
  productsList = [];
  selectedProduct = null;

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
      fetchListProducts: flow,
      createProduct: flow,
      getProduct: flow,
      updateProduct: flow,
      deleteProduct: flow,
    });
    if (client) this.client = client;
    this.setupFlows();
  }

  reset() {
    this.productsList = [];
    this.selectedProduct = null;
    this.fetchState = {
      list: STATE.DONE,
      create: STATE.DONE,
      get: STATE.DONE,
      update: STATE.DONE,
      delete: STATE.DONE,
    };
    this.error = null;
  }

  setupFlows() {
    this.fetchListProducts = flow(function* (params) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.list = STATE.PENDING;
      this.error = null;
      try {
        const data = yield this.client.listProducts(params);
        this.productsList = data.products || data;
        console.log('[ProductStore.fetchListProducts] fetched products:', this.productsList);
        this.fetchState.list = STATE.DONE;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.list = STATE.ERROR;
      }
    }).bind(this);

    this.createProduct = flow(function* (productData) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.create = STATE.PENDING;
      this.error = null;
      try {
        const newProduct = yield this.client.createProduct(productData);
        this.productsList.push(newProduct);
        this.fetchState.create = STATE.DONE;
        return newProduct;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.create = STATE.ERROR;
      }
    }).bind(this);

    this.getProduct = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.get = STATE.PENDING;
      this.error = null;
      try {
        const product = yield this.client.getProduct(id);
        this.selectedProduct = product;
        this.fetchState.get = STATE.DONE;
        return product;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.get = STATE.ERROR;
      }
    }).bind(this);

    this.updateProduct = flow(function* (id, data) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      console.log('[ProductStore.updateProduct] id:', id, 'data:', data);
      this.fetchState.update = STATE.PENDING;
      this.error = null;
      try {
        const updatedProduct = yield this.client.updateProduct(id, data);
        const index = this.productsList.findIndex(p => p.id === id);
        if (index !== -1) {
          this.productsList[index] = updatedProduct;
        }
        if (this.selectedProduct?.id === id) {
          this.selectedProduct = updatedProduct;
        }
        this.fetchState.update = STATE.DONE;
        return updatedProduct;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.update = STATE.ERROR;
      }
    }).bind(this);

    this.updateProductStock = flow(function* (id, delta) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.update = STATE.PENDING;
      this.error = null;
      try {
        const updatedProduct = yield this.client.updateProductStock(id, delta);
        const index = this.productsList.findIndex(p => p.id === id);
        if (index !== -1) {
          this.productsList[index] = updatedProduct;
        }
        if (this.selectedProduct?.id === id) {
          this.selectedProduct = updatedProduct;
        }
        this.fetchState.update = STATE.DONE;
        return updatedProduct;
      } catch (err) {
        this.error = err?.message || String(err);
        this.fetchState.update = STATE.ERROR;
      }
    }).bind(this);

    this.deleteProduct = flow(function* (id) {
      if (!this.client) {
        this.error = 'ApiClient not set';
        return;
      }
      this.fetchState.delete = STATE.PENDING;
      this.error = null;
      try {
        yield this.client.deleteProduct(id);
        this.productsList = this.productsList.filter(p => p.id !== id);
        if (this.selectedProduct?.id === id) {
          this.selectedProduct = null;
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

  clearSelectedProduct() {
    this.selectedProduct = null;
  }
}
