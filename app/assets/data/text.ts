// 全站状态文本
export const siteGlobalText: { [key: string]: string } = {
  loading: "站点状态加载中",
  unknown: "站点状态未知",
  normal: "站点运行正常",
  error: "全部站点出现异常",
  warn: "部分站点出现异常",
};

// 站点监控类型
export const siteType: { [key: number]: { tag: string; text?: string } } = {
  1: {
    tag: "HTTP",
    text: "通过发送 HTTP 或 HTTPS 请求来监测目标服务的可用性",
  },
  2: {
    tag: "KEYWORD",
    text: "通过获取页面内容，并检查返回的内容是否包含指定的关键词",
  },
  3: {
    tag: "PING",
    text: "使用 ICMP 协议向目标服务器发送 Ping 请求",
  },
  4: { tag: "PORT", text: "检测目标服务器的指定端口是否开放" },
  5: {
    tag: "HEARTBEAT",
    text: "由被监控的服务主动发送“心跳信号”到监控服务，表明自身正常运行",
  },
};

// 站点状态类型
export const siteStatus: { [key: number]: { text: string; type: string } } = {
  0: { text: "暂停检测", type: "unknown" },
  1: { text: "还未检查", type: "unknown" },
  2: { text: "正常访问", type: "normal" },
  8: { text: "站点异常", type: "error" },
  9: { text: "无法访问", type: "error" },
};
