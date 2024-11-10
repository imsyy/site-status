import { useState, useEffect } from "react";
import { SwitchTransition, CSSTransition } from "react-transition-group";
import { formatNumber, formatDuration } from "@/utils/timeTools";
import { LinkTwo } from "@icon-park/react";
import { Tooltip, Button, Result, Modal, Input, message } from "antd";
import CustomLink from "@/components/customLink";
import SiteCharts from "@/components/siteCharts";

const SiteStatus = ({ siteData, days, status }) => {
  const [siteDetailsShow, setSiteDetailsShow] = useState(false);
  const [siteDetailsData, setSiteDetailsData] = useState(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [passwordInput, setPasswordInput] = useState("");

  const isShowLinks = import.meta.env.VITE_SHOW_LINKS === "true";
  const correctPassword = import.meta.env.VITE_PASSWORD;

  useEffect(() => {
    const authorized = localStorage.getItem("isAuthorized");
    if (authorized === "true") {
      setIsAuthorized(true);
    }
  }, []);

  const handlePasswordSubmit = () => {
    if (passwordInput === correctPassword) {
      setIsAuthorized(true);
      localStorage.setItem("isAuthorized", "true");
    } else {
      message.error("密码错误，请重试");
    }
  };

  const showSiteDetails = (data) => {
    setSiteDetailsShow(true);
    setSiteDetailsData(data);
  };

  const closeSiteDetails = () => {
    setSiteDetailsShow(false);
    setSiteDetailsData(null);
  };
  if (correctPassword) {
  if (!isAuthorized) {
    return (
      <Modal
        title="请输入密码"
        open={!isAuthorized}
        footer={null}
        closable={false}
        centered
        style={{ width: "520px !important" }} // 设置弹窗宽度
      >
        <Input.Password
          placeholder="输入密码"
          value={passwordInput}
          onChange={(e) => setPasswordInput(e.target.value)}
          onPressEnter={handlePasswordSubmit}
          addonAfter={
            <Button
              type="primary"
              onClick={handlePasswordSubmit}
              style={{
                height: "30px !important",
              }}
            >
              提交
            </Button>
          }
        />
        <style>
          {`
            .ant-input-group-addon {
              background-color: rgba(0, 0, 0, 0%) !important;
              border: 1px solid rgba(217, 217, 0, 0) !important;
              padding: 0px 0px 0px 13px !important;
            }
          `}
        </style>
      </Modal>
    );
  }}

  return (
    <SwitchTransition mode="out-in">
      <CSSTransition key={status.siteState} classNames="fade" timeout={100}>
        {status.siteState !== "wrong" ? (
          status.siteState !== "loading" && siteData ? (
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
                    {isShowLinks ? (
                      <CustomLink iconDom={<LinkTwo />} to={site.url} />
                    ) : null}
                    <div
                      className={`status ${
                        site.status === "ok"
                          ? "normal"
                          : site.status === "unknown"
                          ? "unknown"
                          : "error"
                      }`}
                    >
                      <div className="icon" />
                      <span className="tip">
                        {site.status === "ok"
                          ? "正常访问"
                          : site.status === "unknown"
                          ? "状态未知"
                          : "无法访问"}
                      </span>
                    </div>
                  </div>
                  <div
                    className="timeline"
                    onClick={() => {
                      showSiteDetails(site);
                    }}
                  >
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
              {/* 站点详情 */}
              <Modal
                title={siteDetailsData?.name}
                open={siteDetailsShow}
                footer={null}
                onOk={closeSiteDetails}
                onCancel={closeSiteDetails}
                bodyStyle={{ marginTop: "20px" }}
              >
                <SiteCharts siteDetails={siteDetailsData} />
              </Modal>
            </div>
          ) : (
            <div className="loading" />
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
