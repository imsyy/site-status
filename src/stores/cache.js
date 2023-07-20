import { makeAutoObservable } from "mobx";
import { makePersistable, isHydrated } from "mobx-persist-store";

class Cache {
  // 站点数据
  siteData = null;

  constructor() {
    makeAutoObservable(this);
    makePersistable(this, {
      name: "siteDataCache",
      properties: ["siteData"],
      storage: window.localStorage,
      stringify: true, // 将数据转换为 JSON 字符串格式
    });
  }

  changeSiteData(val) {
    this.siteData = val;
  }

  removeSiteData() {
    this.siteData = null;
  }

  get isHydrated() {
    return isHydrated(this);
  }
}

export default Cache;
