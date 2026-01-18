import { makeAutoObservable } from 'mobx';
import VendorStore from './Vendors/VendorStore';
import ProductStore from './Products/ProductStore';
import OrderStore from './Orders/OrderStore';

export class RootStore {
  sidebarOpen = false;
  sidebarCollapsed = false;
  Vendor = new VendorStore();
  Product = new ProductStore();
  Order = new OrderStore
  
  constructor() {
    makeAutoObservable(this);
  }

  openSidebar() {
    this.sidebarOpen = true;
  }

  closeSidebar() {
    this.sidebarOpen = false;
  }

  toggleSidebar() {
    this.sidebarOpen = !this.sidebarOpen;
  }

  toggleSidebarCollapsed() {
    this.sidebarCollapsed = !this.sidebarCollapsed;
  }
}

export const createRootStore = () => new RootStore();
