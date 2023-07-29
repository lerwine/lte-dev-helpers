import { MappedIterableIterator } from './MappedIterableIterator';

export class UriQueryParameterItem {
  // #region name Property
  private _name: string = "";

  /**
   * Gets or sets the name of the URI query parameter.
   * @type {string}
   * @memberof UriQueryParameter
   * @public
   */
  public get name(): string { return this._name; }

  /** @type {string} */
  public set name(value: string) {
    switch (typeof value) {
      case 'undefined':
        this._name = '';
        break;
      case 'object':
        this._name = (value === null) ? '' : '' + value;
        break;
      case 'string':
        this._name = value;
        break;
      default:
        this._name = '' + value;
        break;
    }
  }

  // #endregion
  // #region value Property
  private _value?: string;

  /**
   * Gets or sets the value of the URI query parameter.
   * @type {(string | undefined)}
   * @memberof UriQueryParameter
   * @public
   */
  public get value(): string | undefined { return this._value; }

  /** @type {(string | undefined)} */
  public set value(value: string | undefined) {
    switch (typeof value) {
      case 'undefined':
        this._value = undefined;
        break;
      case 'object':
        this._value = (value === null) ? undefined : '' + value;
        break;
      case 'string':
        this._value = value;
        break;
      default:
        this._value = '' + value;
        break;
    }
  }

  // #endregion
  constructor(name: string, value?: string) {
    switch (typeof name) {
      case 'undefined':
        this._name = '';
        break;
      case 'object':
        this._name = (name === null) ? '' : '' + name;
        break;
      case 'string':
        this._name = name;
        break;
      default:
        this._name = '' + name;
        break;
    }
    switch (typeof value) {
      case 'undefined':
        break;
      case 'object':
        if (value !== null)
          this._value = '' + value;
        break;
      case 'string':
        this._value = value;
        break;
      default:
        this._value = '' + value;
        break;
    }
  }

  static parse(value: string): UriQueryParameterItem {
    switch (typeof value) {
      case 'undefined':
        value = '';
        break;
      case 'object':
        value = (value === null) ? '' : '' + value;
        break;
      case 'string':
        break;
      default:
        value = '' + value;
        break;
    }
    var i = value.indexOf('&');
    if (i < 0)
      return new UriQueryParameterItem(decodeURI(value));
    if (i == 0)
      return new UriQueryParameterItem("", (value.length > 0) ? decodeURI(value.substring(1)) : "");
    return new UriQueryParameterItem(decodeURI(value.substring(0, i)), (i < value.length - 1) ? decodeURI(value.substring(i + 1)) : "");
  }

  toString() {
    if (typeof this._value === 'string')
      return (this._name.length > 0) ? (encodeURIComponent(this._name) + ((this._value.length > 0) ? '&' + encodeURIComponent(this._value) : '&')) :
        (this._value.length > 0) ? '&' + encodeURIComponent(this._value) : '&';
    return (this._name.length > 0) ? encodeURIComponent(this._name) : '';
  }
}

export class UriQueryParameters implements Map<string, string | undefined> {
  private _backingArray: UriQueryParameterItem[] = [];

  get length(): number { return this._backingArray.length; }

  get size(): number { return this._backingArray.length; }

  constructor(items?: UriQueryParameterItem[] | UriQueryParameters) {
    if (typeof items === 'object' && items !== null) {
      if (Array.isArray(items))
        for (var n in items) {
          var i = items[n];
          if (typeof i === 'object' && i !== null && i instanceof UriQueryParameterItem)
            this._backingArray.push(i);
        }
      else if (items instanceof UriQueryParameters)
        for (var n in items._backingArray) 
          this._backingArray.push(items._backingArray[n]);
    }
  }

  static parse(value?: string): UriQueryParameters | undefined {
    if (typeof value !== 'string')
      return;
    if (value.length == 0)
      return new UriQueryParameters();
    return new UriQueryParameters(value.split('&').map(s => UriQueryParameterItem.parse(s)));
  }

  clear(): void { this._backingArray = []; }

  delete(key: string | number): boolean {
    if (this._backingArray.length > 0) {
      if (typeof key === 'number') {
        if (!isNaN(key) && key >= 0 && key < this._backingArray.length) {
          this._backingArray.splice(key, 1);
          return true;
        }
      } else {
        var filtered = this._backingArray.filter(item => item.name !== key);
        if (filtered.length < this._backingArray.length) {
          this._backingArray = filtered;
          return true;
        }
      }
    }
    return false;
  }

  deleteFrom(index: number, count?: number): void {
    if (isNaN(index) || this._backingArray.length < 1 || index >= this._backingArray.length)
      return;
    if (typeof count === 'number' && !isNaN(count)) {
      if (count > 0)
        this._backingArray.splice(index, count);
    }
    else
      this._backingArray = this._backingArray.slice(0, index);
  }

  forEach(callbackfn: (value: string | undefined, key: string, map: Map<string, string | undefined>) => void, thisArg?: any): void {
    var thisObj = this;
    if (arguments.length > 2)
      this._backingArray.forEach(item => callbackfn(item.value, item.name, thisObj), thisArg);

    else
      this._backingArray.forEach(item => callbackfn(item.value, item.name, thisObj));
  }

  get(key: string): string | undefined {
    for (var i = 0; i < this._backingArray.length; i++) {
      var item = this._backingArray[i];
      if (item.name == key)
        return item.value;
    }
    return undefined;
  }

  getItem(index: number): UriQueryParameterItem | undefined {
    if (typeof index === 'number' && !isNaN(index) && index >= 0 && index < this._backingArray.length)
      return this._backingArray[index];
    return undefined;
  }

  has(key: string): boolean {
    for (var i = 0; i < this._backingArray.length; i++) {
      var item = this._backingArray[i];
      if (item.name == key)
        return true;
    }
    return false;
  }

  /**
   * Removes the last element from an array and returns it.
   * If the array is empty, undefined is returned and the array is not modified.
   */
  pop(): UriQueryParameterItem | undefined { return this._backingArray.pop(); }

  /**
   * Appends new elements to the end of an array, and returns the new length of the array.
   * @param items New elements to add to the array.
   */
  push(...items: UriQueryParameterItem[]): number { return this._backingArray.push.apply(this, items); }

  /**
   * Removes the first element from an array and returns it.
   * If the array is empty, undefined is returned and the array is not modified.
   */
  shift(): UriQueryParameterItem | undefined { return this._backingArray.shift(); }

  /**
   * Inserts new elements at the start of an array, and returns the new length of the array.
   * @param items Elements to insert at the start of the array.
   */
  unshift(...items: UriQueryParameterItem[]): number { return this._backingArray.unshift.apply(this, items); }

  /**
   * Returns the index of the first occurrence of a value in an array, or -1 if it is not present.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin the search. If fromIndex is omitted, the search starts at index 0.
   */
  indexOf(searchElement: UriQueryParameterItem, fromIndex?: number): number { return (arguments.length > 1) ? this._backingArray.indexOf(searchElement, fromIndex) : this._backingArray.indexOf(searchElement); }

  /**
   * Returns the index of the last occurrence of a specified value in an array, or -1 if it is not present.
   * @param searchElement The value to locate in the array.
   * @param fromIndex The array index at which to begin searching backward. If fromIndex is omitted, the search starts at the last index in the array.
   */
  lastIndexOf(searchElement: UriQueryParameterItem, fromIndex?: number): number { return (arguments.length > 1) ? this._backingArray.lastIndexOf(searchElement, fromIndex) : this._backingArray.lastIndexOf(searchElement); }

  /**
   * Determines whether all the members of an array satisfy the specified test.
   * @param predicate A function that accepts up to three arguments. The every method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value false, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  every(predicate: (value: UriQueryParameterItem, index: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => unknown, thisArg?: any): boolean {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    if (arguments.length > 0)
      return this._backingArray.every((value, index) => predicate(value, index, arr), thisArg);
    return this._backingArray.every((value, index) => predicate(value, index, arr));
  }

  /**
   * Determines whether the specified callback function returns true for any element of an array.
   * @param predicate A function that accepts up to three arguments. The some method calls
   * the predicate function for each element in the array until the predicate returns a value
   * which is coercible to the Boolean value true, or until the end of the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function.
   * If thisArg is omitted, undefined is used as the this value.
   */
  some(predicate: (value: UriQueryParameterItem, index: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => unknown, thisArg?: any): boolean {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    if (arguments.length > 0)
      return this._backingArray.some((value, index) => predicate(value, index, arr), thisArg);
    return this._backingArray.some((value, index) => predicate(value, index, arr));
  }

  /**
   * Performs the specified action for each element in an array.
   * @param callbackfn  A function that accepts up to three arguments. forEach calls the callbackfn function one time for each element in the array.
   * @param thisArg  An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  forEachItem(callbackfn: (value: UriQueryParameterItem, index: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => void, thisArg?: any): void {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    if (arguments.length > 0)
      this._backingArray.some((value, index) => callbackfn(value, index, arr), thisArg);

    else
      this._backingArray.some((value, index) => callbackfn(value, index, arr));
  }

  /**
   * Calls a defined callback function on each element of an array, and returns an array that contains the results.
   * @param callbackfn A function that accepts up to three arguments. The map method calls the callbackfn function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the callbackfn function. If thisArg is omitted, undefined is used as the this value.
   */
  map<U>(callbackfn: (value: UriQueryParameterItem, index: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => U, thisArg?: any): U[] {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    if (arguments.length > 0)
      return this._backingArray.map((value, index) => callbackfn(value, index, arr), thisArg);
    return this._backingArray.map((value, index) => callbackfn(value, index, arr));
  }

  /**
   * Returns the elements of an array that meet the condition specified in a callback function.
   * @param predicate A function that accepts up to three arguments. The filter method calls the predicate function one time for each element in the array.
   * @param thisArg An object to which the this keyword can refer in the predicate function. If thisArg is omitted, undefined is used as the this value.
   */
  filter(predicate: (value: UriQueryParameterItem, index: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => unknown, thisArg?: any): UriQueryParameterItem[] {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    if (arguments.length > 0)
      return this._backingArray.filter((value, index) => predicate(value, index, arr), thisArg);
    return this._backingArray.filter((value, index) => predicate(value, index, arr));
  }

  /**
   * Calls the specified callback function for all the elements in an array. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduce method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduce<U>(callbackfn: (previousValue: U, currentValue: UriQueryParameterItem, currentIndex: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => U, initialValue: U): U {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    return this._backingArray.reduce((previousValue, currentValue, currentIndex) => callbackfn(previousValue, currentValue, currentIndex, arr), initialValue);
  }

  /**
   * Calls the specified callback function for all the elements in an array, in descending order. The return value of the callback function is the accumulated result, and is provided as an argument in the next call to the callback function.
   * @param callbackfn A function that accepts up to four arguments. The reduceRight method calls the callbackfn function one time for each element in the array.
   * @param initialValue If initialValue is specified, it is used as the initial value to start the accumulation. The first call to the callbackfn function provides this value as an argument instead of an array value.
   */
  reduceRight<U>(callbackfn: (previousValue: U, currentValue: UriQueryParameterItem, currentIndex: number, queryParameters: ReadonlyArray<UriQueryParameterItem>) => U, initialValue: U): U {
    var arr: ReadonlyArray<UriQueryParameterItem> = this._backingArray;
    return this._backingArray.reduceRight((previousValue, currentValue, currentIndex) => callbackfn(previousValue, currentValue, currentIndex, arr), initialValue);
  }

  set(key: string, value: string | undefined): this {
    for (var i = 0; i < this._backingArray.length; i++) {
      var item = this._backingArray[i];
      if (item.name === key) {
        item.value = value;
        i++;
        while (i < this._backingArray.length) {
          if (this._backingArray[i].name === key)
            this._backingArray.splice(i, 1);

          else
            i++;
        }
        break;
      }
    }
    return this;
  }

  setItem(index: number, value: UriQueryParameterItem): this {
    if (typeof value !== 'object' || value === null || !(value instanceof UriQueryParameterItem))
      throw new Error("Value must be a UriQueryParameter object");
    this._backingArray[index] = value;
    return this;
  }

  entries(): IterableIterator<[string, string | undefined]> { return new MappedIterableIterator<UriQueryParameterItem, [string, string | undefined]>(this._backingArray, item => [item.name, item.value]); }

  keys(): IterableIterator<string> { return new MappedIterableIterator<UriQueryParameterItem, string>(this._backingArray, item => item.name); }

  values(): IterableIterator<string | undefined> { return new MappedIterableIterator<UriQueryParameterItem, string | undefined>(this._backingArray, item => item.value); }

  toString(): string {
    switch (this._backingArray.length) {
      case 0:
        return "";
      case 1:
        return this._backingArray[0].toString();
      default:
        return this._backingArray.map(item => item.toString()).join("&");
    }
  }

  [Symbol.iterator](): IterableIterator<[string, string | undefined]> { return this.entries(); }

  get [Symbol.toStringTag](): string { return toString(); };
}
