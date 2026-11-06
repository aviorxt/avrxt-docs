import test from 'node:test';
import assert from 'node:assert/strict';
import { paginate, createCache, createLimiter, checkUploadHint } from './recipes.mjs';
test('pagination empty, partial and out-of-range pages', () => {
  assert.deepEqual(paginate([]).data, []);
  assert.deepEqual(paginate([1,2,3], 2, 2).data, [3]);
  assert.equal(paginate([1,2],1,2).hasNext, false);
  assert.deepEqual(paginate([1],9).data, []);
  assert.throws(() => paginate([],0), RangeError);
  assert.throws(() => paginate([],1,101), RangeError);
});
test('cache expiry and entry-count bound', () => {
  const cache = createCache(1);
  cache.set('a', null, 10, 0);
  assert.deepEqual(cache.get('a',9), {hit:true,value:null});
  assert.deepEqual(cache.get('a',10), {hit:false});
  cache.set('a',1,10,20); cache.set('b',2,10,20);
  assert.equal(cache.get('a',21).hit,false);
  assert.equal(cache.get('b',21).value,2);
  assert.throws(() => createCache(0),RangeError);
});
test('limiter boundary, independent keys, reset and eviction', () => {
  const allow = createLimiter({limit:1,windowMs:10,capacity:2});
  assert.equal(allow('a',0).allowed,true);
  assert.deepEqual(allow('a',1),{allowed:false,retryAfterMs:9});
  assert.equal(allow('b',1).allowed,true);
  assert.equal(allow('a',10).allowed,true);
  allow('c',10);
  assert.equal(allow('a',11).allowed,true); // oldest key evicted: local limiter tradeoff
});
test('upload hint rejects empty and large input', () => {
  assert.ok(checkUploadHint({size:0}));
  assert.ok(checkUploadHint({size:3000000}));
  assert.equal(checkUploadHint({size:10}),null);
});
