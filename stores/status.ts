import { defineStore } from "pinia";
import type { MonitorsDataResult, SiteType } from "~/types/main";

export const useStatusStore = defineStore("status", () => {
  // 登录状态
  const loginStatus = ref<boolean>(false);
  // 站点状态
  const siteStatus = ref<SiteType>("loading");
  // 站点数据
  const siteData = ref<MonitorsDataResult>();
  // 滚动高度
  const scrollTop = ref<number>(0);

  return { loginStatus, siteStatus, siteData, scrollTop };
});
