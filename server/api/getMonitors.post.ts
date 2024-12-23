// https://uptimerobot.com/api/#methods
import dayjs from "dayjs";
import type { MonitorsDataResult, MonitorsResult } from "~~/types/main";
import { getCache, setCache } from "~/utils/cache-server";
import { formatSiteData } from "~/utils/format";

const getRanges = ():
  | {
      dates: dayjs.Dayjs[];
      start: number;
      end: number;
      ranges: string;
    }
  | undefined => {
  try {
    const dates = [];
    const config = useRuntimeConfig();
    const days = config.public.countDays;
    const today = dayjs(new Date().setHours(0, 0, 0, 0));
    // 生成日期范围数组
    for (let d = 0; d < days; d++) dates.push(today.subtract(d, "day"));
    // 生成自定义历史数据范围
    const ranges = dates.map(
      (date) => `${date.unix()}_${date.add(1, "day").unix()}`,
    );
    const start = dates[dates.length - 1].unix();
    const end = dates[0].add(1, "day").unix();
    ranges.push(`${start}_${end}`);
    return { dates, start, end, ranges: ranges.join("-") };
  } catch (error) {
    console.error(error);
    return undefined;
  }
};

/**
 * 获取站点数据
 */
export default defineEventHandler(async (event): Promise<MonitorsResult> => {
  try {
    const config = useRuntimeConfig();
    const { apiUrl, apiKey, sitePassword, siteSecretKey } = config;
    if (!apiUrl || !apiKey) {
      throw new Error("Missing API url or API key");
    }
    // 若登录-验证 token
    if (sitePassword && siteSecretKey) {
      const token = getCookie(event, "authToken");
      if (!token) throw new Error("Please log in first");
      // 验证 Token
      const isLogin = await verifyJwt(token);
      if (!isLogin) throw new Error("Invalid or expired token");
    }
    // 缓存键
    const cacheKey = "site-data";
    // 检查缓存
    const cachedData = getCache(cacheKey);
    if (cachedData) {
      return {
        code: 200,
        message: "success",
        source: "cache",
        data: cachedData as MonitorsDataResult,
      };
    }
    const rangesData = getRanges();
    if (!rangesData) throw new Error("Missing");
    const { dates, ranges, start, end } = rangesData;
    // 构造请求体
    const body = {
      // API key
      api_key: apiKey,
      // json
      format: "json",
      // 显示日志
      logs: 1,
      // 日志类型
      log_types: "1-2",
      // 日期范围
      logs_start_date: start,
      logs_end_date: end,
      custom_uptime_ranges: ranges,
    };
    // 尝试获取
    const result = await $fetch(apiUrl + "getMonitors", {
      method: "POST",
      body,
    });
    // 处理数据
    const data = formatSiteData(result, dates);
    // 缓存数据
    setCache(cacheKey, data, 1000 * 60);
    return {
      code: 200,
      message: "success",
      source: "api",
      data,
    };
  } catch (error) {
    setResponseStatus(event, 500);
    return {
      code: 500,
      message: error instanceof Error ? error.message : "Unknown error",
      source: "api",
      data: undefined,
    };
  }
});
