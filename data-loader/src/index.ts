type BatchFn<K, E> = (keys: K[]) => Promise<E[]>;

interface PromiseMeta<E> {
  resolve: ((entity: E) => void) | null;
  promise: null | Promise<E>;
}

export default class DataLoader<Key, Entity> {
  readonly batchFn: BatchFn<Key, Entity>;
  readonly keys: Key[] = [];
  readonly cache: Map<Key, PromiseMeta<Entity>> = new Map();

  constructor(batchFn: BatchFn<Key, Entity>) {
    this.batchFn = batchFn;
  }

  load(key: Key): Promise<Entity> {
    const cache = this.cache.get(key);

    if (cache && cache.promise) {
      return cache.promise;
    }
    const shouldScheduleBatch = this.cache.size === 0;

    const promiseMeta: PromiseMeta<Entity> = {
      resolve: null,
      promise: null,
    };

    promiseMeta.promise = new Promise<Entity>((resolve) => {
      promiseMeta.resolve = resolve;
    });

    promiseMeta.promise.catch(() => {
      this.cache.delete(key);
    });

    this.cache.set(key, promiseMeta);
    this.keys.push(key);
    if (shouldScheduleBatch) {
      setImmediate(() => {
        this.doBatch(this.keys);
      });
    }
    return promiseMeta.promise;
  }

  doBatch(keys: Key[]): Promise<void> {
    return this.batchFn(keys).then((results) =>
      results.forEach((result, index) => {
        const promiseMeta = this.cache.get(this.keys[index]);
        if (promiseMeta && promiseMeta.resolve) {
          promiseMeta.resolve(result);
        }
      }),
    );
  }
}
