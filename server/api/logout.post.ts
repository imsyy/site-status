export default eventHandler(
  async (event): Promise<{ code: number; message: string }> => {
    try {
      // 清除 authToken
      setCookie(event, "authToken", "", {
        httpOnly: true,
        maxAge: 0,
        sameSite: "strict",
      });
      return {
        code: 200,
        message: "Token has been invalidated.",
      };
    } catch (error) {
      return {
        code: 500,
        message:
          error instanceof Error
            ? error.message
            : "Internal Server Error. Failed to logout.",
      };
    }
  },
);
