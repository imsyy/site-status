import * as jose from "jose";

// SECRET_KEY
const config = useRuntimeConfig();
const { siteSecretKey } = config;
const SECRET_KEY = new TextEncoder().encode(siteSecretKey);

/**
 * Generate a JWT token
 */
export const signJwt = async (expiresIn: string = "30d"): Promise<string> => {
  try {
    const token = await new jose.SignJWT({ user: "admin" })
      .setProtectedHeader({ alg: "HS256" }) // HS256
      .setExpirationTime(expiresIn) // expires
      .sign(SECRET_KEY); // secret key
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
    await jose.jwtVerify(token, SECRET_KEY);
    return true;
  } catch (error) {
    console.error("Error verifying JWT:", error);
    return false;
  }
};
