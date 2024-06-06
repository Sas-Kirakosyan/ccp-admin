import { makeAutoObservable } from 'mobx';

class CommonStore {
  constructor() {
    makeAutoObservable(this);
  }
}

export default new CommonStore();
