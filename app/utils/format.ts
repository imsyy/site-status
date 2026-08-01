import dayjs from "dayjs";
import { formatNumber } from "./helper";
import type {
  MonitorsDataResult,
  SiteDaysStatus,
  SiteStatusType,
} from "~~/types/main";

/**
 * UptimeRobot API 返回类型
 * @see https://uptimerobot.com/api/#methods
 */
export interface UptimeRobotMonitor {
  id: number;
  friendly_name?: string;
  url?: string;
  status: 0 | 1 | 2 | 8 | 9;
  type: 1 | 2 | 3 | 4 | 5;
  interval?: number | null;
  custom_uptime_ranges?: string;
  logs?: {
    type: 1 | 2 | 99;
    datetime: number;
    duration: number;
  }[];
}

export interface UptimeRobotResponse {
  monitors?: UptimeRobotMonitor[];
}

/** 将任意值安全转为数字，非法值回退为 0 */
const toNumber = (value: unknown): number => {
  const num = Number(value);
  return Number.isFinite(num) ? num : 0;
};

/**
 * Format site data.
 * @param data The site data to format.
 * @param dates The date range (oldest -> newest).
 * @returns The formatted site data.
 */
export const formatSiteData = (
  data: UptimeRobotResponse,
  dates: dayjs.Dayjs[],
): MonitorsDataResult | undefined => {
  if (!data?.monitors?.length) return undefined;
  const { public: configPublic } = useRuntimeConfig();
  const { showLink } = configPublic;

  // 解析站点数据
  const formatData: SiteStatusType[] = data.monitors.map((site) => {
    // 解析每日数据（最后一个元素为整体统计）
    const ranges = site.custom_uptime_ranges?.split("-") || [];
    const percent = formatNumber(toNumber(ranges.pop()));

    const dailyData: SiteDaysStatus[] = [];
    const timeMap = new Map<string, number>();
    // 处理每日数据
    dates.forEach((date, index) => {
      timeMap.set(date.format("YYYYMMDD"), index);
      dailyData[index] = {
        date: date.unix(),
        percent: formatNumber(toNumber(ranges[index])),
        down: { times: 0, duration: 0 },
      };
    });

    // 汇总故障次数与时长
    const total = { times: 0, duration: 0 };
    site.logs?.forEach((log) => {
      if (log.type === 1 || log.type === 99) {
        const date = dayjs.unix(log.datetime).format("YYYYMMDD");
        const dateIndex = timeMap.get(date);
        // 修改每日数据
        if (dateIndex !== undefined && dailyData[dateIndex]) {
          dailyData[dateIndex].down.times += 1;
          dailyData[dateIndex].down.duration += log.duration;
        }
        // 更新总数据
        total.times += 1;
        total.duration += log.duration;
      }
    });

    return {
      id: site.id,
      name: site.friendly_name || "",
      url: showLink ? site.url : undefined,
      status: site.status ?? 8,
      type: site.type ?? 1,
      interval: site.interval ?? 0,
      percent,
      days: dailyData.reverse(),
      down: total,
    };
  });

  // 统计全局状态
  const status = formatData.reduce(
    (acc, site) => {
      if (site.status === 2) acc.ok++;
      else if (site.status === 8 || site.status === 9) acc.error++;
      else if (site.status === 0 || site.status === 1) acc.unknown++;
      return acc;
    },
    { count: formatData.length, ok: 0, error: 0, unknown: 0 },
  );

  return {
    status,
    data: formatData,
    timestamp: Date.now(),
  };
};
