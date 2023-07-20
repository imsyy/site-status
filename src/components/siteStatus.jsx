import { SwitchTransition, CSSTransition } from "react-transition-group";
import { formatNumber, formatDuration } from "@/utils/timeTools";
import { LinkTwo } from "@icon-park/react";
import { Tooltip, Button, Result } from "antd";
import CustomLink from "@/components/customLink";

const SiteStatus = ({ siteData, days, status }) => {
  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={status.siteState} classNames="fade" timeout={500}>
        {status.siteState !== "wrong" ? (
          siteData ? (
            <div className="sites">
              {siteData.map((site) => (
                <div
                  key={site.id}
                  className={`site ${
                    site.status !== "ok" ? "error" : "normal"
                  }`}
                >
                  <div className="meta">
                    <div className="name">{site.name}</div>
                    <CustomLink iconDom={<LinkTwo />} to={site.url} />
                    <div
                      className={`status ${
                        site.status === "ok" ? "normal" : "error"
                      }`}
                    >
                      <div className="icon" />
                      <span className="tip">
                        {site.status === "ok" ? "正常访问" : "无法访问"}
                      </span>
                    </div>
                  </div>
                  <div className="timeline">
                    {site.daily.map((data, index) => {
                      const { uptime, down, date } = data;
                      const time = date.format("YYYY-MM-DD");
                      let status = null;
                      let tooltipText = null;
                      if (uptime >= 100) {
                        status = "normal";
                        tooltipText = `可用率 ${formatNumber(uptime)}%`;
                      } else if (uptime <= 0 && down.times === 0) {
                        status = "none";
                        tooltipText = "无数据";
                      } else {
                        status = "error";
                        tooltipText = `故障 ${
                          down.times
                        } 次，累计 ${formatDuration(
                          down.duration
                        )}，可用率 ${formatNumber(uptime)}%`;
                      }
                      return (
                        <Tooltip
                          key={index}
                          // trigger={["hover", "click"]}
                          title={
                            <div className="status-tooltip">
                              <div className="time">{time}</div>
                              <div className="text">{tooltipText}</div>
                            </div>
                          }
                          destroyTooltipOnHide
                        >
                          <div className={`line ${status}`} />
                        </Tooltip>
                      );
                    })}
                  </div>
                  <div className="summary">
                    <div className="now">今天</div>
                    <div className="note">
                      {site.total.times
                        ? `最近 ${days} 天内故障 ${
                            site.total.times
                          } 次，累计 ${formatDuration(
                            site.total.duration
                          )}，平均可用率 ${site.average}%`
                        : `最近 ${days} 天内可用率 ${site.average}%`}
                    </div>
                    <div className="day">
                      {site.daily[site.daily.length - 1].date.format(
                        "YYYY-MM-DD"
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="loading"></div>
          )
        ) : (
          <Result
            status="error"
            title="调用超限或请求错误，请刷新后重试"
            extra={
              <Button
                type="primary"
                danger
                onClick={() => {
                  location.reload();
                }}
              >
                重试
              </Button>
            }
          />
        )}
      </CSSTransition>
    </SwitchTransition>
  );
};

export default SiteStatus;
