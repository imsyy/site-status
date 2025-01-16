import SHA256 from "crypto-js/sha256.js";
import { signJwt } from "../utils/jwt";

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
      const { sitePassword } = config;
      if (!sitePassword) {
        throw new Error("Site password not configured");
      }
      // 输入验证
      if (!body?.password || body?.password.length === 0) {
        throw new Error("Password is required");
      }
      // 密码验证
      const hashedPassword = SHA256(sitePassword).toString();
      if (body?.password !== hashedPassword) {
        setResponseStatus(event, 401);
        return {
          code: 401,
          message: "password is incorrect",
        };
      }
      // jwt token
      const token = await signJwt("30d");
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
