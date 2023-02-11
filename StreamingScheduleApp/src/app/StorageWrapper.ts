type callback = () => void;

export class StorageWrapper {
  listeners: Array<callback> = [];
  key: string;

  private static instance?: StorageWrapper;

  static getInstance(key: string) {
    if (!this.instance) {
      this.instance = new StorageWrapper(key);
    }
    return this.instance;
  }

  private constructor(key: string) {
    this.key = key;
  }

  addEventListener(fn: callback) {
    if (this.listeners.indexOf(fn) === -1) {
      this.listeners.push(fn);
    }
  }

  setItem(value: string) {
    localStorage.setItem(this.key, value);
    this.listeners.forEach((fn) => fn.call(this));
  }

  getItem() {
    return localStorage.getItem(this.key);
  }
}
