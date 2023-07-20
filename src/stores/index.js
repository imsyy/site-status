import React from "react";
import Status from "./status";
import Cache from "./cache";

const stores = React.createContext({
  status: new Status(),
  cache: new Cache(),
});

export default stores;
