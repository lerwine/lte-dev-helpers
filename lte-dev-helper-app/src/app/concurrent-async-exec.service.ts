import { Injectable } from '@angular/core';

/**
 * Service for checking concurrency of asynchronous functions.
 * @export
 * @class ConcurrentAsyncExecService
 */
@Injectable({
  providedIn: 'root'
})
export class ConcurrentAsyncExecService {
  constructor() { }

  private _concurrencySymbols: { [key: symbol]: symbol; } = {};

  /**
   * Starts an asynchronous function, checking results for concurrency.
   * @template T - The type of promised result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {{ (): Promise<T>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<T>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key.
   * @memberof ConcurrentAsyncExecService
   */
  async start<T>(key: symbol, asyncFunc: { (): Promise<T>; }, onReject?: { (reason: any): void; }): Promise<T> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const result = asyncFunc();
    if (typeof onReject === 'function')
      result.catch(e => {
        if (this._concurrencySymbols[key] === c)
          onReject(e);
      });
    const r = await result;
    return (this._concurrencySymbols[key] === c) ? r : await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a promised value, checking results for concurrency.
   * @template T - The type of promised input value to pass to the asynchronous function.
   * @template U - The type of promised final result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} argPromise - The promised value to pass as the argument to the asynchronous function.
   * @param {{ (arg: T): Promise<U>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<U>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key or the original promise was rejected.
   * @memberof ConcurrentAsyncExecService
   */
  async then<T, U>(key: symbol, argPromise: Promise<T>, asyncFunc: { (arg: T): Promise<U>; }, onReject?: { (reason: any): void; }): Promise<U> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const arg = await argPromise;
    if (this._concurrencySymbols[key] === c) {
      const result = asyncFunc(arg);
      if (typeof onReject === 'function')
        result.catch(e => {
          if (this._concurrencySymbols[key] === c)
            onReject(e);
        });
      const r = await result;
      if (this._concurrencySymbols[key] === c)
        return r;
    }
    return await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a rejected promised value, checking results for concurrency.
   * @template T - The type of orignal promised value.
   * @template U - The type of promised alternate result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} promise - The original promised value whose rejected reason is passed as the argument to the asynchronous function.
   * @param {{ (reason: any): Promise<U>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {(Promise<T | U>)} - The result of the asynchronous function if the original promise was rejected; otherwise, the original promised value is returned. If another process was started with the same key, then a rejected promise will be returned.
   * @memberof ConcurrentAsyncExecService
   */
  async catch<T, U>(key: symbol, promise: Promise<T>, asyncFunc: { (reason: any): Promise<U>; }, onReject?: { (reason: any): void; }): Promise<T | U> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    return promise.catch(async reason => {
      if (this._concurrencySymbols[key] === c) {
        const result = asyncFunc(reason);
        if (typeof onReject === 'function')
          result.catch(e => {
            if (this._concurrencySymbols[key] === c)
              onReject(e);
          });
        const r = await result;
        if (this._concurrencySymbols[key] === c)
          return r;
      }
      return await Promise.reject();
    });
  }

  /**
   * Starts an asynchronous function, checking results for concurrency.
   * @template T - The argument value to pass to the asynchonous function.
   * @template U - The type of promised result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {T} arg - The value to pass as the argument to the asynchronous function.
   * @param {{ (arg: T): Promise<U>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<U>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key.
   * @memberof ConcurrentAsyncExecService
   */
  async start1<T, U>(key: symbol, arg: T, asyncFunc: { (arg: T): Promise<U>; }, onReject?: { (reason: any): void; }): Promise<U> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const result = asyncFunc(arg);
    if (typeof onReject === 'function')
      result.catch(e => {
        if (this._concurrencySymbols[key] === c)
          onReject(e);
      });
    const r = await result;
    return (this._concurrencySymbols[key] === c) ? r : await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a promised value, checking results for concurrency.
   * @template T - The type of promised input value to pass as the first argument to the asynchronous function.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of promised final result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} arg1Promise - The promised value to pass as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {{ (arg1: T, arg2: U): Promise<V>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<V>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key or the original promise was rejected.
   * @memberof ConcurrentAsyncExecService
   */
  async then1<T, U, V>(key: symbol, arg1Promise: Promise<T>, arg2: U, asyncFunc: { (arg1: T, arg2: U): Promise<V>; }, onReject?: { (reason: any): void; }): Promise<V> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const value = await arg1Promise;
    if (this._concurrencySymbols[key] === c) {
      const result = asyncFunc(value, arg2);
      if (typeof onReject === 'function')
        result.catch(e => {
          if (this._concurrencySymbols[key] === c)
            onReject(e);
        });
      const r = await result;
      if (this._concurrencySymbols[key] === c)
        return r;
    }
    return await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a rejected promised value, checking results for concurrency.
   * @template T - The type of orignal promised value.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of promised alternate result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} promise - The original promised value whose rejected reason is passed as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {{ (reason: any, arg: U): Promise<V>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {(Promise<T | V>)} - The result of the asynchronous function if the original promise was rejected; otherwise, the original promised value is returned. If another process was started with the same key, then a rejected promise will be returned.
   * @memberof ConcurrentAsyncExecService
   */
  async catch1<T, U, V>(key: symbol, promise: Promise<T>, arg2: U, asyncFunc: { (reason: any, arg2: U): Promise<V>; }, onReject?: { (reason: any): void; }): Promise<T | V> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    return promise.catch(async reason => {
      if (this._concurrencySymbols[key] === c) {
        const result = asyncFunc(reason, arg2);
        if (typeof onReject === 'function')
          result.catch(e => {
            if (this._concurrencySymbols[key] === c)
              onReject(e);
          });
        const r = await result;
        if (this._concurrencySymbols[key] === c)
          return r;
      }
      return await Promise.reject();
    });
  }

  /**
   * Starts an asynchronous function, checking results for concurrency.
   * @template T - The type of value to pass as the first argument to the asynchronous function.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of promised result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {T} arg1 - The value to pass as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {{ (arg1: T, arg2: U): Promise<V>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<V>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key.
   * @memberof ConcurrentAsyncExecService
   */
  async start2<T, U, V>(key: symbol, arg1: T, arg2: U, asyncFunc: { (arg1: T, arg2: U): Promise<V>; }, onReject?: { (reason: any): void; }): Promise<V> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const result = asyncFunc(arg1, arg2);
    if (typeof onReject === 'function')
      result.catch(e => {
        if (this._concurrencySymbols[key] === c)
          onReject(e);
      });
    const r = await result;
    return (this._concurrencySymbols[key] === c) ? r : await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a promised value, checking results for concurrency.
   * @template T - The type of promised input value to pass as the first argument to the asynchronous function.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of value to pass as the third argument to the asynchronous function.
   * @template W - The type of promised final result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} arg1Promise - The promised value to pass as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {V} arg3 - The value to pass as the third argument to the asynchronous function.
   * @param {{ (arg1: T, arg2: U, arg3: V): Promise<W>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<W>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key or the original promise was rejected.
   * @memberof ConcurrentAsyncExecService
   */
  async then2<T, U, V, W>(key: symbol, arg1Promise: Promise<T>, arg2: U, arg3: V, asyncFunc: { (arg1: T, arg2: U, arg3: V): Promise<W>; }, onReject?: { (reason: any): void; }): Promise<W> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const value = await arg1Promise;
    if (this._concurrencySymbols[key] === c) {
      const result = asyncFunc(value, arg2, arg3);
      if (typeof onReject === 'function')
        result.catch(e => {
          if (this._concurrencySymbols[key] === c)
            onReject(e);
        });
      const r = await result;
      if (this._concurrencySymbols[key] === c)
        return r;
    }
    return await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a rejected promised value, checking results for concurrency.
   * @template T - The type of orignal promised value.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of value to pass as the third argument to the asynchronous function.
   * @template W - The type of promised alternate result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} promise - The original promised value whose rejected reason is passed as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {V} arg3 - The value to pass as the third argument to the asynchronous function.
   * @param {{ (reason: any, arg1: U, arg2: V): Promise<W>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {(Promise<T | W>)} - The result of the asynchronous function if the original promise was rejected; otherwise, the original promised value is returned. If another process was started with the same key, then a rejected promise will be returned.
   * @memberof ConcurrentAsyncExecService
   */
  async catch2<T, U, V, W>(key: symbol, promise: Promise<T>, arg2: U, arg3: V, asyncFunc: { (reason: any, arg2: U, arg3: V): Promise<W>; }, onReject?: { (reason: any): void; }): Promise<T | W> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    return promise.catch(async reason => {
      if (this._concurrencySymbols[key] === c) {
        const result = asyncFunc(reason, arg2, arg3);
        if (typeof onReject === 'function')
          result.catch(e => {
            if (this._concurrencySymbols[key] === c)
              onReject(e);
          });
        const r = await result;
        if (this._concurrencySymbols[key] === c)
          return r;
      }
      return await Promise.reject();
    });
  }

  /**
   * Starts an asynchronous function, checking results for concurrency.
   * @template T - The type of value to pass as the first argument to the asynchronous function.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of value to pass as the third argument to the asynchronous function.
   * @template W - The type of promised result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {T} arg1 - The value to pass as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {V} arg3 - The value to pass as the third argument to the asynchronous function.
   * @param {{ (arg1: T, arg2: U, arg3: V): Promise<W>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<W>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key.
   * @memberof ConcurrentAsyncExecService
   */
  async start3<T, U, V, W>(key: symbol, arg1: T, arg2: U, arg3: V, asyncFunc: { (arg1: T, arg2: U, arg3: V): Promise<W>; }, onReject?: { (reason: any): void; }): Promise<W> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    var result = asyncFunc(arg1, arg2, arg3);
    if (typeof onReject === 'function')
      result.catch(e => {
        if (this._concurrencySymbols[key] === c)
          onReject(e);
      });
    const r = await result;
    return (this._concurrencySymbols[key] === c) ? r : await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a promised value, checking results for concurrency.
   * @template T - The type of promised input value to pass as the first argument to the asynchronous function.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of value to pass as the third argument to the asynchronous function.
   * @template W - The type of value to pass as the fourth argument to the asynchronous function.
   * @template X - The type of promised final result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} arg1Promise - The promised value to pass as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {V} arg3 - The value to pass as the third argument to the asynchronous function.
   * @param {W} arg4 - The value to pass as the fourth argument to the asynchronous function.
   * @param {{ (arg1: T, arg2: U, arg3: V, arg4: W): Promise<X>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {Promise<X>} - The promised value returned by asyncFunc or a rejected promise if another process was started with the same key or the original promise was rejected.
   * @memberof ConcurrentAsyncExecService
   */
  async then3<T, U, V, W, X>(key: symbol, arg1Promise: Promise<T>, arg2: U, arg3: V, arg4: W, asyncFunc: { (arg1: T, arg2: U, arg3: V, arg4: W): Promise<X>; }, onReject?: { (reason: any): void; }): Promise<X> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    const value = await arg1Promise;
    if (this._concurrencySymbols[key] === c) {
      const result = asyncFunc(value, arg2, arg3, arg4);
      if (typeof onReject === 'function')
        result.catch(e => {
          if (this._concurrencySymbols[key] === c)
            onReject(e);
        });
      const r = await result;
      if (this._concurrencySymbols[key] === c)
        return r;
    }
    return await Promise.reject();
  }

  /**
   * Starts an asynchronous function from a rejected promised value, checking results for concurrency.
   * @template T - The type of orignal promised value.
   * @template U - The type of value to pass as the second argument to the asynchronous function.
   * @template V - The type of value to pass as the third argument to the asynchronous function.
   * @template W - The type of value to pass as the fourth argument to the asynchronous function.
   * @template X - The type of promised alternate result value.
   * @param {symbol} key - Identifies the concurrent process.
   * @param {Promise<T>} promise - The original promised value whose rejected reason is passed as the first argument to the asynchronous function.
   * @param {U} arg2 - The value to pass as the second argument to the asynchronous function.
   * @param {V} arg3 - The value to pass as the third argument to the asynchronous function.
   * @param {W} arg4 - The value to pass as the fourth argument to the asynchronous function.
   * @param {{ (reason: any, arg1: U, arg2: V, arg3: W): Promise<X>; }} asyncFunc - The asynchronous function that gets invoked if no other process was not started with the same key.
   * @param {{ (reason: any): void; }} [onReject] - The optional function that gets called when the promise from the asynchronous function is rejected and another process was not started with the same key.
   * @return {(Promise<T | X>)} - The result of the asynchronous function if the original promise was rejected; otherwise, the original promised value is returned. If another process was started with the same key, then a rejected promise will be returned.
   * @memberof ConcurrentAsyncExecService
   */
  async catch3<T, U, V, W, X>(key: symbol, promise: Promise<T>, arg2: U, arg3: V, arg4: W, asyncFunc: { (reason: any, arg2: U, arg3: V, arg4: W): Promise<X>; }, onReject?: { (reason: any): void; }): Promise<T | X> {
    const c = Symbol();
    this._concurrencySymbols[key] = c;
    return promise.catch(async reason => {
      if (this._concurrencySymbols[key] === c) {
        const result = asyncFunc(reason, arg2, arg3, arg4);
        if (typeof onReject === 'function')
          result.catch(e => {
            if (this._concurrencySymbols[key] === c)
              onReject(e);
          });
        const r = await result;
        if (this._concurrencySymbols[key] === c)
          return r;
      }
      return await Promise.reject();
    });
  }
}
