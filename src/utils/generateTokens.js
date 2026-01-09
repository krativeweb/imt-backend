import { SignJWT, jwtVerify } from "jose";

const getAccessSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_ACCESS_SECRET);

const getRefreshSecretKey = () =>
  new TextEncoder().encode(process.env.JWT_REFRESH_SECRET);

export const generateAccessToken = async (userId) => {
  const secret = getAccessSecretKey();

  const token = await new SignJWT({ id: userId.toString() })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("1h")
    .sign(secret);

  return token;
};

export const generateRefreshToken = async (userId) => {
  const secret = getRefreshSecretKey();

  const token = await new SignJWT({ id: userId.toString() })
    .setProtectedHeader({ alg: "HS256", typ: "JWT" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);

  return token;
};

// helpers to verify tokens
export const verifyAccessToken = async (token) => {
  const secret = getAccessSecretKey();
  const { payload } = await jwtVerify(token, secret);
  return payload;
};

export const verifyRefreshToken = async (token) => {
  const secret = getRefreshSecretKey();
  const { payload } = await jwtVerify(token, secret);
  return payload;
};
