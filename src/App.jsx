import { useState, useEffect } from "react";
import { observer } from "mobx-react-lite";
import { getSiteData } from "@/utils/getSiteData";
import { GlobalScrollbar } from "mac-scrollbar";
import useStores from "@/hooks/useStores";
import Header from "@/components/header";
import SiteStatus from "@/components/siteStatus";
import Footer from "@/components/footer";

const App = observer(() => {
  const { cache, status } = useStores();
  const [siteData, setSiteData] = useState(null);

  // 加载配置
  const apiKey = import.meta.env.VITE_API_KEY;
  const countDays = import.meta.env.VITE_COUNT_DAYS;

  // 获取站点数据
  const getSiteStatusData = () => {
    setSiteData(null);
    getSiteData(apiKey, countDays, cache, status).then((res) => {
      console.log(res);
      setSiteData(res);
    });
  };

  useEffect(() => {
    getSiteStatusData();
  }, [apiKey, countDays]);

  return (
    <>
      <GlobalScrollbar />
      <Header getSiteData={getSiteStatusData} />
      <main id="main">
        <div className="container">
          <div className="all-site">
            <SiteStatus siteData={siteData} days={countDays} status={status} />
          </div>
        </div>
      </main>
      <Footer />
    </>
  );
});

export default App;
