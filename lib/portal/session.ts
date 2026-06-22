export const PORTAL_SESSION_COOKIE = "trinity_portal_session";

export const SESSION_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export function getSessionMaxAgeSeconds(): number {
  const hours = Number(process.env.PORTAL_SESSION_HOURS) || 24;
  return hours * 60 * 60;
}
