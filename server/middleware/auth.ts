/**
 * API 访问中间件
 * 校验请求来源（Origin / Referer）与站点主机一致，防止跨站请求伪造（CSRF）
 */
export default defineEventHandler((event) => {
  const url = event.node.req.url;
  // 仅拦截 API 请求
  if (!url?.startsWith("/api")) return;

  const origin = getRequestHeader(event, "origin");
  const referer = getRequestHeader(event, "referer");
  const source = origin || referer;

  // 无来源信息直接拒绝（例如 curl、脚本等非浏览器客户端）
  if (!source) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }

  // 校验来源主机与请求主机一致
  const requestHost = getRequestHost(event);
  let sourceHost = "";
  try {
    sourceHost = new URL(source).host;
  } catch {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }

  if (sourceHost !== requestHost) {
    throw createError({
      statusCode: 403,
      statusMessage: "Access Denied",
    });
  }
});
