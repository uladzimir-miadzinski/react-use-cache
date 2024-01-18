import {useRef} from 'react';

/**
 * Use Cache API functions only!
 */
export interface Cache<Key extends string, Value> {
    clear: () => void;
    get: (key: Key) => Value | null;
    getAll: () => Record<Key, Value>;
    has: (key: Key) => boolean;
    remove: (key: Key) => void;
    set: (key: Key, value: Value) => void;
}

export const useCache = <Key extends string, Value>(): Cache<Key, Value> => {
    const cacheRef = useRef<Record<Key, Value>>({} as Record<Key, Value>);

    const get = (key: Key) => cacheRef.current[key] ?? null;
    const getAll = () => cacheRef.current;
    const has = (key: Key) => key in cacheRef.current;
    const clear = () => {
        cacheRef.current = {} as Record<Key, Value>;
    };
    const remove = (key: Key) => {
        delete cacheRef.current[key];
    };
    const set = (key: Key, value: Value) => {
        cacheRef.current[key] = value;
    };

    return new Proxy(
        {clear, get, getAll, has, remove, set},
        {
            /**
             * Guard for cache api overrides for developers,
             * If developer tries to do something like this:
             *     `const pointsCache = useCache<string, Point>();
             *     `pointsCache[id] = { x, y }`
             * instead of
             *     `pointsCache.set(id, { x, y })`
             * then error will be thrown.
             */
            set: () => {
                throw Error(`Attempt to override Cache API, to set cache value, use cache.set(key, value) method!`);
            },
        },
    );
};
