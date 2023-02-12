// function that returns void and can be passed
// as an argument to another function
type callback = () => void;

/**
 * Singleton class that acts as a wrapper around the 'localStorage'.
 * The purpose of this class is to provide a simple interface
 * for accessing 'localStorage' and to allow other components
 * to subscribe to changes made to the 'localStorage'.
 *
 * The class uses the singleton pattern to ensure that there
 * is only one instance of the wrapper for a given key,
 * so that multiple components accessing the same key in 'localStorage'
 * will share the same instance of the wrapper.
 *
 * The 'addEventListener' method is used to register a callback function that will
 * be called whenever the value stored in 'localStorage' under the given key is
 * updated.
 *
 * The 'setItem' method is used to set the value for the given key in 'localStorage'.
 * This method also calls all registered event listeners so that other components
 * that are subscribed to changes to the 'localStorage' can be notified of the update.
 *
 * The 'getItem' method is used to retrieve the value stored under the given key in
 * 'localStorage'.
 */

export class StorageWrapper {
  // List of registered event listeners
  listeners: Array<callback> = [];

  // The key that is used to access the value in 'localStorage'
  key: string;

  // A static reference to the instance of this class that is currently in use
  private static instance?: StorageWrapper;

  // Method to retrieve the instance of this class
  static getInstance(key: string) {
    // If no instance exists, create a new instance with the specified key
    if (!this.instance) {
      this.instance = new StorageWrapper(key);
    }
    // Return the existing or newly created instance
    return this.instance;
  }

  // Private constructor to prevent direct instantiation of the class (Singleton)
  private constructor(key: string) {
    // Store the key that is used to access the value in 'localStorage'
    this.key = key;
  }

  // Method to add an event listener to the listeners array
  addEventListener(fn: callback) {
    // Only add the listener if it doesn't already exist in the array
    if (this.listeners.indexOf(fn) === -1) {
      this.listeners.push(fn);
    }
  }

  // Method to set the value in 'localStorage' with the specified key
  setItem(value: string) {
    // Set the value in 'localStorage'
    localStorage.setItem(this.key, value);
    // Call each registered listener
    this.listeners.forEach((fn) => fn.call(this));
  }
  // Method to retrieve the value in 'localStorage' with the specified key
  getItem() {
    // Return the value from 'localStorage'
    return localStorage.getItem(this.key);
  }
}
