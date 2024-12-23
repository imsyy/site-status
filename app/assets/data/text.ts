import type { SelectOption } from "naive-ui";

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

// 语言数据
export const langData: SelectOption[] = [
  {
    label: "简体中文",
    value: "zh-CN",
  },
  {
    label: "English",
    value: "en",
  },
  {
    label: "日本語",
    value: "ja-JP",
  },
  {
    label: "한국어",
    value: "ko-KR",
  },
];
