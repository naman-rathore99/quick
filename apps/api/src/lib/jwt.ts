import jwt from "jsonwebtoken";

function getSecrets() {
  const access = process.env.JWT_ACCESS_SECRET;
  const refresh = process.env.JWT_REFRESH_SECRET;
  if (!access || !refresh) {
    throw new Error("JWT secrets (JWT_ACCESS_SECRET, JWT_REFRESH_SECRET) are not configured.");
  }
  return { access, refresh };
}

export function signAccessToken(userId: string) {
  const { access } = getSecrets();
  return jwt.sign({ sub: userId }, access, { expiresIn: "15m" });
}

export function signRefreshToken(userId: string) {
  const { refresh } = getSecrets();
  return jwt.sign({ sub: userId }, refresh, { expiresIn: "7d" });
}

export function verifyAccessToken(token: string) {
  const { access } = getSecrets();
  return jwt.verify(token, access) as { sub: string };
}

export function verifyRefreshToken(token: string) {
  const { refresh } = getSecrets();
  return jwt.verify(token, refresh) as { sub: string };
}