import * as jose from "jose";

/**
 * 获取 JWT 签名密钥
 * 在函数内读取运行时配置，避免模块加载时机问题
 */
const getSecretKey = (): Uint8Array => {
  const config = useRuntimeConfig();
  const { siteSecretKey } = config;
  return new TextEncoder().encode(siteSecretKey);
};

/**
 * Generate a JWT token
 */
export const signJwt = async (expiresIn: string = "30d"): Promise<string> => {
  try {
    const token = await new jose.SignJWT({ user: "admin" })
      .setProtectedHeader({ alg: "HS256" }) // HS256
      .setIssuer("site-status")
      .setSubject("admin")
      .setExpirationTime(expiresIn) // expires
      .sign(getSecretKey()); // secret key
    return token;
  } catch (error) {
    throw new Error("Error signing JWT: " + error);
  }
};

/**
 * Verify a JWT token
 * @param token JWT token
 */
export const verifyJwt = async (token: string): Promise<boolean> => {
  try {
    await jose.jwtVerify(token, getSecretKey(), {
      issuer: "site-status",
    });
    return true;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return false;
  }
};
