/**
 * Jump to a link.
 * @param url The link to jump to.
 */
export const jumpLink = (url: string) => window.open(url, "_blank");

/**
 * Format a number.
 * @param num The number to format.
 * @returns The formatted number.
 */
export const formatNumber = (num: number) => Math.floor(num * 100) / 100;

/**
 * Sleep for a certain amount of time.
 * @param ms The amount of time to sleep in milliseconds.
 */
export const sleep = (ms: number) =>
  new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Get site data.
 */
export const getSiteData = async () => {
  const statusStore = useStatusStore();
  try {
    statusStore.siteStatus = "loading";
    const result = await $fetch("/api/getMonitors", { method: "POST" });
    if (result.code !== 200 || !result.data) {
      throw new Error("Error to get site data");
    }
    // 更改数据
    const { status } = result.data;
    statusStore.$patch({
      siteData: result.data,
      siteStatus:
        status.count === status.ok
          ? "normal"
          : status.count === status.error
            ? "error"
            : "warn",
    });
  } catch (error) {
    console.error("error to get site data", error);
    statusStore.siteStatus = "unknown";
    window.$message.error("站点数据获取失败，请重试");
  }
};
