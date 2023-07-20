import { makeAutoObservable } from "mobx";

class Status {
  siteState = "loading";

  constructor() {
    makeAutoObservable(this);
  }

  changeSiteState(val) {
    this.siteState = val;
  }
}

export default Status;
