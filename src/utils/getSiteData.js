import { formatNumber } from "./timeTools";
import axios from "axios";
import dayjs from "dayjs";

/**
 * 获取监控数据
 * @param {string} apikey - UptimeRobot的API密钥
 * @param {number} days - 获取的天数
 * @param {Object} cache - mobx-cache
 * @param {Object} status - mobx-status
 * @returns {Promise<Array>} - 处理后的监控数据
 */
export const getSiteData = async (apikey, days, cache, status) => {
  try {
    status.changeSiteState("loading");
    
    const dates = [];
    const today = dayjs(new Date().setHours(0, 0, 0, 0));

    // 生成日期范围数组
    for (let d = 0; d < days; d++) {
      dates.push(today.subtract(d, "day"));
    }

    // 生成自定义历史数据范围
    const ranges = dates.map(
      (date) => `${date.unix()}_${date.add(1, "day").unix()}`
    );
    const start = dates[dates.length - 1].unix();
    const end = dates[0].add(1, "day").unix();
    ranges.push(`${start}_${end}`);

    // 缓存的有效期（秒）
    const cacheDuration = 60;

    // 检查是否有可用缓存数据
    if (cache.siteData !== null) {
      const { data, timestamp } = cache.siteData;
      // 当前时间
      const currentTime = new Date().getTime();
      // 检查缓存是否在有效期内
      if (currentTime - timestamp < cacheDuration * 1000) {
        return new Promise((resolve) => {
          const delay = Math.floor(Math.random() * (1200 - 500 + 1)) + 500;
          setTimeout(() => {
            const processedData = dataProcessing(data, dates);
            console.log("触发缓存");
            changeSite(processedData, status);
            resolve(processedData);
          }, delay);
        });
      }
    }

    // 准备请求数据的参数
    const postdata = {
      api_key: apikey,
      format: "json",
      logs: 1,
      log_types: "1-2",
      logs_start_date: start,
      logs_end_date: end,
      custom_uptime_ranges: ranges.join("-"),
    };

    // 发送获取监控数据的请求
    const response = await getMonitorsData(postdata, status);

    // 储存数据到缓存
    if (response.monitors) {
      const monitorsCache = {
        data: response.monitors,
        timestamp: new Date().getTime(),
      };
      cache.changeSiteData(monitorsCache);
    }

    // 处理监控数据
    const processedData = dataProcessing(response.monitors, dates);
    // 更新站点数据
    changeSite(processedData, status);
    return processedData;
  } catch (error) {
    status.changeSiteState("wrong");
    console.error("获取监控数据时出错：" + error);
  }
};

/**
 * 发送获取监控数据的请求
 * @param {Object} data - 请求数据
 * @returns {Promise<Object>} - 监控数据的响应
 */
const getMonitorsData = async (postdata, status) => {
  try {
    const globalApi = import.meta.env.VITE_GLOBAL_API;
    const response = await axios.post(globalApi, postdata, { timeout: 10000 });
    return response.data;
  } catch (error) {
    console.error("获取监控数据时出错：", error);
    status.changeSiteState("wrong");
  }
};

/**
 * 对监控数据进行处理
 * @param {Array} data - 监控数据
 * @param {Array} dates - 日期数组
 * @returns {Array} - 处理后的数据
 */
const dataProcessing = (data, dates) => {
  return data?.map((monitor) => {
    const ranges = monitor.custom_uptime_ranges.split("-");
    const average = formatNumber(ranges.pop());
    const daily = [];
    const map = [];

    dates.forEach((date, index) => {
      map[date.format("YYYYMMDD")] = index;
      daily[index] = {
        date: date,
        uptime: formatNumber(ranges[index]),
        down: { times: 0, duration: 0 },
      };
    });

    /**
     * 统计总故障次数和累计故障时长
     * @param {Object} total - 初始总数
     * @param {Object} log - 日志数据
     * @returns {Object} - 更新后的总数
     */
    const calculateTotal = (total, log) => {
      if (log.type === 1) {
        const date = dayjs.unix(log.datetime).format("YYYYMMDD");
        total.duration += log.duration;
        total.times += 1;
        daily[map[date]].down.duration += log.duration;
        daily[map[date]].down.times += 1;
      }
      return total;
    };

    const total = monitor.logs.reduce(calculateTotal, {
      times: 0,
      duration: 0,
    });

    const result = {
      id: monitor.id,
      name: monitor.friendly_name,
      url: monitor.url,
      average: average,
      daily: daily,
      total: total,
      status: "unknown",
    };

    if (monitor.status === 2) result.status = "ok";
    if (monitor.status === 9) result.status = "down";

    return result;
  });
};

/**
 * 更改站点状态
 * @param {Array} data - 站点数据
 * @param {Object} status - mobx-status
 */
const changeSite = (data, status) => {
  try {
    // 统计数据
    const isAllStatusOk = data.every((item) => item.status === "ok");
    const isAnyStatusOk = data.some((item) => item.status === "ok");
    const okCount = data.filter((item) => item.status === "ok").length;
    const downCount = data.filter((item) => item.status === "down").length;

    // 更改图标
    const faviconLink = document.querySelector('link[rel="shortcut icon"]');
    faviconLink.href = isAllStatusOk
      ? "./images/favicon.ico"
      : "./images/favicon-down.ico";

    // 更改状态
    if (isAllStatusOk) {
      status.changeSiteState("normal");
    } else if (isAnyStatusOk) {
      status.changeSiteState("error");
    } else {
      status.changeSiteState("allError");
    }

    // 更新状态总览
    status.changeSiteOverview({
      count: data.length,
      okCount,
      downCount,
    });
  } catch (error) {
    console.error("更改站点状态时发生错误：", error);
    // 处理错误状态
    status.changeSiteState("error");
  }
};
