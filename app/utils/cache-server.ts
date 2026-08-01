import { LRUCache } from "lru-cache";

const cache = new LRUCache<string, unknown>({
  // 最大缓存条目数
  max: 100,
  // 缓存过期时间（毫秒）
  ttl: 1000 * 60 * 5,
});

/**
 * 获取缓存
 * @param key 缓存键
 * @returns 缓存值，若不存在则返回 undefined
 */
export const getCache = <T>(key: string): T | undefined => cache.get(key) as T;

/**
 * 设置缓存
 * @param key 缓存键
 * @param value 缓存值
 * @param ttl 可选的自定义过期时间（毫秒）
 */
export const setCache = (key: string, value: unknown, ttl?: number): void => {
  if (ttl) cache.set(key, value, { ttl });
  else cache.set(key, value);
};
