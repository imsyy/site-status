import axios from 'axios';
import dayjs from 'dayjs';
import {
  formatNumber
} from './helper';

export async function GetMonitors(apikey, days) {

  const dates = [];
  const today = dayjs(new Date().setHours(0, 0, 0, 0));
  for (let d = 0; d < days; d++) {
    dates.push(today.subtract(d, 'day'));
  }

  const ranges = dates.map((date) => `${date.unix()}_${date.add(1, 'day').unix()}`);
  const start = dates[dates.length - 1].unix();
  const end = dates[0].add(1, 'day').unix();
  ranges.push(`${start}_${end}`);

  const postdata = {
    api_key: apikey,
    format: 'json',
    logs: 1,
    log_types: '1-2',
    logs_start_date: start,
    logs_end_date: end,
    custom_uptime_ranges: ranges.join('-'),
  };

  const response = await axios.post('https://cors.status.org.cn/uptimerobot/v2/getMonitors', postdata, {
    timeout: 10000
  });
  if (response.data.stat !== 'ok') {
    document.getElementById('status-text').style.display = 'none';
    document.getElementById('status-down').style.display = 'block';
    document.getElementById('status-down').innerHTML = '数据获取出错';
    document.getElementById('status-time-up').innerHTML = '这可能是暂时性的，刷新页面以重试'
    document.getElementById('header').style = 'background: rgb(228,126,126); background: linear-gradient(53deg, rgba(228,126,126,1) 0%, rgba(238,85,85,1) 100%);';
    document.getElementById('status-tip').className = 'status-tip down';
    throw response.data.error;
  };
  return response.data.monitors.map((monitor) => {

    const ranges = monitor.custom_uptime_ranges.split('-');
    const average = formatNumber(ranges.pop());
    const daily = [];
    const map = [];
    dates.forEach((date, index) => {
      map[date.format('YYYYMMDD')] = index;
      daily[index] = {
        date: date,
        uptime: formatNumber(ranges[index]),
        down: {
          times: 0,
          duration: 0
        },
      }
    });

    const total = monitor.logs.reduce((total, log) => {
      if (log.type === 1) {
        const date = dayjs.unix(log.datetime).format('YYYYMMDD');
        total.duration += log.duration;
        total.times += 1;
        daily[map[date]].down.duration += log.duration;
        daily[map[date]].down.times += 1;
      }
      return total;
    }, {
      times: 0,
      duration: 0
    });

    const result = {
      id: monitor.id,
      name: monitor.friendly_name,
      url: monitor.url,
      average: average,
      daily: daily,
      total: total,
      status: 'unknow',
    };


    var d = new Date();
    var hour = d.getHours();
    var minute = d.getMinutes();
    if (minute >= 0 && minute < 10) {
      minute = "0" + minute;
    }
    document.getElementById('status-last-time').innerHTML = hour + "&nbsp;:&nbsp;" + minute;

    if (monitor.status === 2) {
      result.status = 'ok';
      document.getElementById('status-text').innerHTML = "所有站点运行正常";
    };
    if (monitor.status === 9) {
      result.status = 'down';
      document.getElementById('status-text').style.display = 'none';
      document.getElementById('status-down').style.display = 'block';
      document.getElementById('header').style = 'background: rgb(228,126,126); background: linear-gradient(53deg, rgba(228,126,126,1) 0%, rgba(238,85,85,1) 100%);';
      document.getElementById('status-tip').className = 'status-tip down';
      var link = document.createElement('link');
      link.type = 'image/x-icon';
      link.rel = 'shortcut icon';
      link.href = '/favicon-down.ico';
      document.getElementsByTagName('head')[0].appendChild(link);
    };
    return result;
  });
}