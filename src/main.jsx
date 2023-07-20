import React from "react";
import ReactDOM from "react-dom/client";
import App from "@/App.jsx";

import "@/style/index.scss";
import "@icon-park/react/styles/index.css";

// 插件样式
import "mac-scrollbar/dist/mac-scrollbar.css";

ReactDOM.createRoot(document.getElementById("root")).render(
  // <React.StrictMode>
  <App />
  // </React.StrictMode>
);
