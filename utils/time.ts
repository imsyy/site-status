import dayjs from "dayjs";

interface FormatTimeOptions {
  // 是否显示时分秒
  showTime?: boolean;
  // 若为今日，是否仅显示时分秒
  showOnlyTimeIfToday?: boolean;
}

/**
 * 格式化时间
 * @param time 时间戳
 * @param options 选项
 * @param options.showTime 是否显示时分秒
 * @param options.showOnlyTimeIfToday 若为今日，是否仅显示时分秒
 * @returns 格式化后的时间字符串
 */
export const formatTime = (
  time: number,
  options: FormatTimeOptions = {},
): string => {
  if (!time) return "未知时间";
  const { showTime = false, showOnlyTimeIfToday = false } = options;
  const correctedTime = time < 10000000000 ? time * 1000 : time;

  const date = dayjs(correctedTime);
  const today = dayjs().startOf("day");

  // 若为今日
  if (showOnlyTimeIfToday && date.isSame(today, "day")) {
    return date.format("HH:mm:ss");
  }
  const formatString = showTime ? "YYYY-MM-DD HH:mm:ss" : "YYYY-MM-DD";
  return date.format(formatString);
};

/**
 * 格式化时长
 * @param seconds 秒数
 * @returns 格式化后的时长字符串
 */
export const formatDuration = (seconds: number): string => {
  const days = Math.floor(seconds / (24 * 3600));
  const hours = Math.floor((seconds % (24 * 3600)) / 3600);
  const minutes = Math.floor((seconds % 3600) / 60);
  const secs = seconds % 60;

  const parts = [];
  if (days > 0) parts.push(`${days} 天`);
  if (hours > 0 || days > 0) parts.push(`${hours} 小时`);
  if (minutes > 0 || hours > 0 || days > 0) parts.push(`${minutes} 分钟`);
  parts.push(`${secs} 秒`);

  return parts.join(" ");
};

/**
 * 格式化检测时长
 * @param interval 时长
 * @returns 格式化后的时长字符串
 */
export const formatInterval = (interval: number): string => {
  if (interval >= 3600) {
    // 超过1小时
    const hours = Math.floor(interval / 3600);
    const minutes = Math.floor((interval % 3600) / 60);
    return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`;
  } else if (interval >= 60) {
    // 超过1分钟
    const minutes = Math.floor(interval / 60);
    const seconds = interval % 60;
    return seconds > 0 ? `${minutes}m ${seconds}s` : `${minutes}m`;
  } else return `${interval}s`;
};
