import jwt from "jsonwebtoken";

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    code: 200 | 500 | 401;
    message: string;
    token?: string;
  }> => {
    try {
      const body = await readBody(event);
      const config = useRuntimeConfig();
      const { sitePassword, siteSecretKey } = config;
      if (!sitePassword) {
        throw new Error("Site password not configured");
      }
      // 输入验证
      if (!body?.password || body?.password.length === 0) {
        throw new Error("Password is required");
      }
      // 密码验证
      if (body?.password !== sitePassword) {
        setResponseStatus(event, 401);
        return {
          code: 401,
          message: "password is incorrect",
        };
      }
      // jwt token
      const token = jwt.sign({ authenticated: true }, siteSecretKey, {
        // 过期时间
        expiresIn: "30d",
      });
      // 设置 Cookie
      setCookie(event, "authToken", token, {
        httpOnly: true,
        maxAge: 30 * 24 * 60 * 60,
        sameSite: "strict",
      });
      return {
        code: 200,
        message: "password is correct",
        token,
      };
    } catch (error) {
      console.error("Password validation error:", error);
      setResponseStatus(event, 500);
      return {
        code: 500,
        message: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
);
