
export class MappedIterableIterator<T, U> implements IterableIterator<U> {
  private _target: T[];
  private _mapper: { (value: T): U; };
  private _index: number = 0;

  constructor(target: T[], mapper: { (value: T): U; }) {
    this._target = target;
    this._mapper = mapper;
  }

  [Symbol.iterator](): IterableIterator<U> { return this; }

  next(...args: [] | [undefined]): IteratorResult<U, any> {
    if (this._index < this._target.length) {
      var item = this._target[this._index];
      this._index++;
      return { value: this._mapper(item) };
    }
    return <IteratorReturnResult<any>>{ done: true };
  }
}
