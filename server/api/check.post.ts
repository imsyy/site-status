import { verifyJwt } from "../utils/jwt";

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    code: 200 | 500 | 401;
    message: string;
  }> => {
    try {
      const config = useRuntimeConfig();
      const { sitePassword, siteSecretKey } = config;
      if (!sitePassword || !siteSecretKey) {
        return {
          code: 200,
          message: "No password is currently set, no need to log in",
        };
      }
      // 获取 token
      const token = getCookie(event, "authToken");
      if (!token) {
        setResponseStatus(event, 401);
        return { code: 401, message: "User not authenticated" };
      }
      // 验证 Token
      const isLogin = await verifyJwt(token);
      if (!isLogin) {
        setResponseStatus(event, 401);
        return { code: 401, message: "Invalid or expired token" };
      }
      // 验证通过
      return { code: 200, message: "User is authenticated" };
    } catch (error) {
      console.error("Error during authentication check:", error);
      setResponseStatus(event, 500);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);
