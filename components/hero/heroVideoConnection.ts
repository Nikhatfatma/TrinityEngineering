import { HERO_VIDEO_SLOW_DOWNLINK_MBPS } from "./heroVideoConfig";

export type ConnectionTier = "unknown" | "fast" | "slow";

type NetworkInformationLike = {
  saveData?: boolean;
  effectiveType?: string;
  downlink?: number;
  addEventListener?: (type: string, listener: () => void) => void;
  removeEventListener?: (type: string, listener: () => void) => void;
};

function getNetworkConnection(): NetworkInformationLike | undefined {
  if (typeof navigator === "undefined") return undefined;

  const nav = navigator as Navigator & {
    connection?: NetworkInformationLike;
    mozConnection?: NetworkInformationLike;
    webkitConnection?: NetworkInformationLike;
  };

  return nav.connection ?? nav.mozConnection ?? nav.webkitConnection;
}

export function isSlowNetworkConnection(conn: NetworkInformationLike): boolean {
  if (conn.saveData) return true;

  const effectiveType = conn.effectiveType?.toLowerCase();
  if (effectiveType === "slow-2g" || effectiveType === "2g") return true;

  if (
    effectiveType === "3g" &&
    typeof conn.downlink === "number" &&
    conn.downlink > 0 &&
    conn.downlink < HERO_VIDEO_SLOW_DOWNLINK_MBPS
  ) {
    return true;
  }

  return false;
}

export function getConnectionTier(): ConnectionTier {
  const conn = getNetworkConnection();
  if (!conn) return "unknown";
  return isSlowNetworkConnection(conn) ? "slow" : "fast";
}

export function subscribeConnectionTier(onChange: (tier: ConnectionTier) => void): () => void {
  const conn = getNetworkConnection();
  if (!conn?.addEventListener) return () => {};

  const handleChange = () => onChange(getConnectionTier());
  conn.addEventListener("change", handleChange);
  return () => conn.removeEventListener?.("change", handleChange);
}
