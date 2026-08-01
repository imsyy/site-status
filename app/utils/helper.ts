/**
 * Jump to a link.
 * @param url The link to jump to.
 */
export const jumpLink = (url: string) => window.open(url, "_blank");

/**
 * Format a number to two decimal places.
 * @param num The number to format.
 * @returns The formatted number.
 */
export const formatNumber = (num: number) => Math.floor(num * 100) / 100;

/**
 * Compute the SHA-256 digest of a string as a lowercase hex string.
 * Uses Web Crypto (secure contexts: HTTPS or localhost).
 * @param text The text to hash.
 */
export const sha256Hex = async (text: string): Promise<string> => {
  const data = new TextEncoder().encode(text);
  const digest = await crypto.subtle.digest("SHA-256", data);
  return [...new Uint8Array(digest)]
    .map((byte) => byte.toString(16).padStart(2, "0"))
    .join("");
};

/**
 * 获取站点数据
 * @param t 可选的 i18n 翻译函数，用于本地化错误提示
 */
export const getSiteData = async (t?: (key: string) => string) => {
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
    window.$message.error(t?.("meta.fetchError") || "Failed to fetch site data");
  }
};
