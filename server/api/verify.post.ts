import { createHash, timingSafeEqual } from "node:crypto";
import { signJwt } from "../utils/jwt";
import { checkRateLimit, resetRateLimit } from "../utils/rate-limit";

const isProd = process.env.NODE_ENV === "production";

export default defineEventHandler(
  async (
    event,
  ): Promise<{
    code: 200 | 401 | 429 | 500;
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
      if (typeof body?.password !== "string" || body.password.length === 0) {
        throw new Error("Password is required");
      }

      // 限流：同一 IP 10 分钟内最多尝试 5 次
      const clientIp = getRequestIP(event) || "unknown";
      if (!checkRateLimit(clientIp)) {
        setResponseStatus(event, 429);
        return {
          code: 429,
          message: "Too many attempts, please try again later",
        };
      }

      // 密码验证（恒定时间比较，防时序攻击）
      const hashedPassword = createHash("sha256")
        .update(sitePassword)
        .digest("hex");
      const received = Buffer.from(body.password, "hex");
      const expected = Buffer.from(hashedPassword, "hex");
      const isMatch =
        received.length === expected.length &&
        timingSafeEqual(received, expected);

      if (!isMatch) {
        setResponseStatus(event, 401);
        return {
          code: 401,
          message: "password is incorrect",
        };
      }

      // 登录成功，清除限流计数
      resetRateLimit(clientIp);

      // jwt token
      const token = await signJwt("30d");
      // 设置 Cookie
      setCookie(event, "authToken", token, {
        httpOnly: true,
        secure: isProd,
        path: "/",
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
