import { default as NodeCache, default as nodeCache } from 'node-cache';
let cache:NodeCache|null = null;

export function start(done:()=>void) {
    if (cache) return done();

    cache = new nodeCache();
}

/* Allows you to use the same caching instance in multiple areas by calling this function */
export function instance() {
    return cache;
}