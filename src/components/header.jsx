import { observer } from "mobx-react-lite";
import { Statistic } from "antd";
import { CSSTransition, SwitchTransition } from "react-transition-group";
import { formatTimestamp } from "@/utils/timeTools";
import CountUp from "react-countup";
import useStores from "@/hooks/useStores";

// 倒计时数据
const { Countdown } = Statistic;
const deadline = Date.now() + 1000 * 60 * 5;

const refreshNow = () => {
  console.log("finished");
};

const Header = observer(() => {
  const { status, cache } = useStores();

  const siteName = import.meta.env.VITE_SITE_NAME;

  // 状态文本
  const statusNames = {
    loading: "站点状态加载中",
    error: "部分站点出现异常",
    allError: "全部站点出现异常",
    normal: "所有站点运行正常",
    wrong: "数据请求失败",
  };

  return (
    <header id="header" className={status.siteState}>
      <SwitchTransition mode="out-in">
        <CSSTransition key={status.siteState} classNames="fade" timeout={300}>
          <div className={`cover ${status.siteState}`} />
        </CSSTransition>
      </SwitchTransition>
      <div className="container">
        <div className="menu">
          <span className="logo">{siteName}</span>
        </div>
        <div className="status">
          <div className={`icon ${status.siteState}`} />
          <div className="r-text">
            <SwitchTransition mode="out-in">
              <CSSTransition
                key={status.siteState}
                classNames="fade"
                timeout={300}
              >
                <div className="text">{statusNames[status.siteState]}</div>
              </CSSTransition>
            </SwitchTransition>
            <div className="tip">
              <SwitchTransition mode="out-in">
                <CSSTransition
                  key={status.siteState}
                  classNames="fade"
                  timeout={300}
                >
                  {status.siteState === "loading" ? (
                    <span>数据加载中...</span>
                  ) : status.siteState === "wrong" ? (
                    <span>这可能是临时性问题，请刷新后重试</span>
                  ) : (
                    <div className="time">
                      <span className="last-update">
                        {`上次更新于 ${
                          formatTimestamp(cache.siteData?.timestamp).justTime
                        }`}
                      </span>
                      {/* <span>更新频率 5 分钟</span> */}
                      <Countdown
                        className="timeout"
                        title={null}
                        value={deadline}
                        onFinish={refreshNow}
                      />
                    </div>
                  )}
                </CSSTransition>
              </SwitchTransition>
            </div>
          </div>
          <SwitchTransition mode="out-in">
            <CSSTransition
              key={status.siteOverview}
              classNames="fade"
              timeout={300}
            >
              {status.siteOverview ? (
                <div className="overview">
                  <div className="count">
                    <span className="name">站点总数</span>
                    <CountUp
                      className="num"
                      end={status.siteOverview.count}
                      duration={1}
                    />
                  </div>
                  <div className="status-num">
                    <div className="ok-count">
                      <span className="name">正常</span>
                      <CountUp
                        className="num"
                        end={status.siteOverview.okCount}
                        duration={1}
                      />
                    </div>
                    <div className="down-count">
                      <span className="name">异常</span>
                      <span className="num">
                        <CountUp
                          className="num"
                          end={status.siteOverview.downCount}
                          duration={1}
                        />
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="overview" />
              )}
            </CSSTransition>
          </SwitchTransition>
        </div>
      </div>
    </header>
  );
});

export default Header;
