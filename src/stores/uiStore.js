import { action, makeAutoObservable } from 'mobx';

class UiStore {
  asideNavCollapsed = false;

  modals = {
    user: false,
    org: false,
    role: false,
    permission: false,
  };

  constructor() {
    makeAutoObservable(this, {
      toggleAsideNav: action.bound,
    });
  }

  toggleAsideNav() {
    this.asideNavCollapsed = !this.asideNavCollapsed;
  }

  toggleModal(name) {
    this.modals[name] = !this.modals[name];
  }
}

export default new UiStore();
