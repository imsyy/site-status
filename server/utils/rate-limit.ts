/**
 * 简单的内存限流器（防止暴力破解登录）
 * 注意：多实例部署时各自独立，生产环境建议使用持久化限流方案
 */

interface RateLimitEntry {
  count: number;
  resetAt: number;
}

const MAX_ATTEMPTS = 5;
const WINDOW_MS = 10 * 60 * 1000; // 10 分钟

const attempts = new Map<string, RateLimitEntry>();

/**
 * 检查是否允许继续尝试
 * @param key 限流键（如 IP）
 * @returns true 表示允许，false 表示已被限流
 */
export const checkRateLimit = (key: string): boolean => {
  const now = Date.now();
  const entry = attempts.get(key);

  // 无记录或已过窗口期
  if (!entry || entry.resetAt <= now) {
    attempts.set(key, { count: 1, resetAt: now + WINDOW_MS });
    return true;
  }

  // 超过最大次数
  if (entry.count >= MAX_ATTEMPTS) return false;

  // 累加计数
  entry.count += 1;
  return true;
};

/**
 * 限流失败时清理计数（例如登录成功后调用）
 */
export const resetRateLimit = (key: string): void => {
  attempts.delete(key);
};
