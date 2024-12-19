/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  MonitorsDataResult,
  SiteDaysStatus,
  SiteStatus,
} from "~/types/main";
import { formatNumber } from "./helper";
import dayjs from "dayjs";

/**
 * Format site data.
 * @param data The site data to format.
 * @returns The formatted site data.
 */
export const formatSiteData = (
  data: any,
  dates: dayjs.Dayjs[],
): MonitorsDataResult | undefined => {
  if (!data?.monitors) return undefined;
  const { public: configPublic } = useRuntimeConfig();
  const { showLink } = configPublic;
  const sites: any[] = data.monitors;
  // 解析站点数据
  const formatData = sites?.map((site: any): SiteStatus => {
    // 解析每日数据
    const ranges = site.custom_uptime_ranges.split("-");
    const percent = formatNumber(ranges.pop() || 0);
    const dailyData: SiteDaysStatus[] = [];
    const timeMap = new Map();
    // 处理每日数据
    dates.forEach((date, index) => {
      timeMap.set(date.format("YYYYMMDD"), index);
      dailyData[index] = {
        date: date.unix(),
        percent: formatNumber(ranges[index] || 0),
        down: { times: 0, duration: 0 },
      };
    });
    // 获取总数据
    const total = { times: 0, duration: 0 };
    site?.logs?.forEach((log: any) => {
      if (log?.type === 1 || log?.type === 99) {
        const date = dayjs.unix(log?.datetime).format("YYYYMMDD");
        const dateIndex = timeMap.get(date);
        // 修改每日数据
        if (dateIndex !== undefined) {
          // 更新每日数据
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
      name: site?.friendly_name || "未命名站点",
      url: showLink ? site?.url : undefined,
      status: site?.status ?? 8,
      type: site?.type ?? 1,
      interval: site?.interval ?? 0,
      percent,
      days: dailyData?.reverse(),
      down: total,
    };
  });
  return {
    status: formatData.reduce(
      (acc, site) => {
        if (site.status === 2) acc.ok++;
        else if (site.status === 8 || site.status === 9) acc.error++;
        else if (site.status === 0 || site.status === 1) acc.unknown++;
        return acc;
      },
      { count: formatData.length, ok: 0, error: 0, unknown: 0 },
    ),
    data: formatData,
    timestamp: Date.now(),
  };
};
