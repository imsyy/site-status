import { makeAutoObservable } from "mobx";

class Status {
  siteState = "loading";
  siteOverview = null;

  constructor() {
    makeAutoObservable(this);
  }

  changeSiteState(val) {
    this.siteState = val;
  }
  changeSiteOverview(val) {
    this.siteOverview = val;
  }
}

export default Status;
