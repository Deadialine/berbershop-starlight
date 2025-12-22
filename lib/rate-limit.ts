const attempts = new Map<string, { count: number; timestamp: number }>();

export function allowRequest(key: string, limit = 10, windowMs = 10 * 60 * 1000) {
  const now = Date.now();
  const entry = attempts.get(key);
  if (!entry) {
    attempts.set(key, { count: 1, timestamp: now });
    return true;
  }
  if (now - entry.timestamp > windowMs) {
    attempts.set(key, { count: 1, timestamp: now });
    return true;
  }
  if (entry.count >= limit) return false;
  attempts.set(key, { count: entry.count + 1, timestamp: entry.timestamp });
  return true;
}
