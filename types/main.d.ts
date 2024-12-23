// site status
export type SiteType = "loading" | "warn" | "error" | "unknown" | "normal";

export interface SiteDaysStatus {
  // 日期
  date?: number;
  // 百分比
  percent: number;
  // 状态
  down: {
    // 次数
    times: number;
    // 时长
    duration: number;
  };
}

export interface SiteStatusType extends SiteDaysStatus {
  id: number;
  name: string;
  // 0 - 暂停 / 1 - 还未检查 / 2 - 正常 / 8 - 好像寄了 / 9 - 寄了
  status: 0 | 1 | 2 | 8 | 9;
  // 1 - HTTP(s) / 2 - Keyword / 3 - Ping / 4 - Port / 5 - Heartbeat
  type: 1 | 2 | 3 | 4 | 5;
  // 检查间隔（ 秒 ）
  interval: number;
  // 详细数据
  days: SiteDaysStatus[];
  // 站点链接
  url?: string;
}

// monitors result
export interface MonitorsDataResult {
  // 总状态
  status: {
    // 站点总数
    count: number;
    // 正常
    ok: number;
    // 异常
    error: number;
    // 未知
    unknown: number;
  };
  // 总数据
  data: SiteStatusType[];
  // 更新时间
  timestamp: number;
}

export interface MonitorsResult {
  code: number;
  message: string;
  source: "cache" | "api";
  data: MonitorsDataResult | undefined;
}

// site lang
export type SiteLangType = "zh-CN" | "ja-JP" | "ko-KR" | "en";
