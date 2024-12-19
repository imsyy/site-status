/* eslint-disable @typescript-eslint/no-explicit-any */
import { LRUCache } from "lru-cache";

const cache = new LRUCache<any, any>({
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
export const getCache = <T>(key: string): T | undefined => cache.get(key);

/**
 * 设置缓存
 * @param key 缓存键
 * @param value 缓存值
 */
export const setCache = (key: string, value: any, ttl?: number): void => {
  if (ttl) cache.set(key, value, { ttl });
  else cache.set(key, value);
};

/**
 * 删除缓存
 * @param key 缓存键
 */
export const deleteCache = (key: string): boolean => cache.delete(key);

/**
 * 清空所有缓存
 */
export const clearCache = (): void => cache.clear();
