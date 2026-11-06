export function paginate(items, page = 1, pageSize = 20) {
  if (!Array.isArray(items)) throw new TypeError('Expected an array');
  if (!Number.isSafeInteger(page) || page < 1 || !Number.isSafeInteger(pageSize) || pageSize < 1 || pageSize > 100) throw new RangeError('Invalid pagination');
  const total = items.length, pages = Math.ceil(total / pageSize);
  const start = (page - 1) * pageSize;
  return { data: page > pages ? [] : items.slice(start, start + pageSize), page, pageSize, total, hasNext: page < pages };
}
function positive(value) { if (!Number.isSafeInteger(value) || value < 1) throw new RangeError('Expected positive safe integer'); }
export function createCache(capacity = 100) {
  positive(capacity);
  const entries = new Map();
  return {
    set(key, value, ttlMs, now = Date.now()) {
      positive(ttlMs);
      if (entries.size >= capacity && !entries.has(key)) entries.delete(entries.keys().next().value);
      entries.set(key, { value, expires: now + ttlMs });
    },
    get(key, now = Date.now()) {
      const entry = entries.get(key);
      if (!entry || entry.expires <= now) { entries.delete(key); return { hit: false }; }
      return { hit: true, value: entry.value };
    }
  };
}
export function createLimiter({ limit = 5, windowMs = 60000, capacity = 100 } = {}) {
  positive(limit); positive(windowMs); positive(capacity);
  const entries = new Map();
  return function allow(key, now = Date.now()) {
    let entry = entries.get(key);
    if (!entry || entry.resetAt <= now) {
      if (!entry && entries.size >= capacity) entries.delete(entries.keys().next().value);
      entry = { count: 0, resetAt: now + windowMs }; entries.set(key, entry);
    }
    if (entry.count >= limit) return { allowed: false, retryAfterMs: entry.resetAt - now };
    entry.count++;
    return { allowed: true, remaining: limit - entry.count };
  };
}
export function checkUploadHint(file, maximumBytes = 2000000) {
  if (!file || !Number.isFinite(file.size) || file.size <= 0) return 'Choose a non-empty file.';
  if (file.size > maximumBytes) return 'Choose a smaller file.';
  return null;
}
