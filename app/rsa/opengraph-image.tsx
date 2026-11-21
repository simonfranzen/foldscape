import { renderTopicOG } from "@/lib/og/template";

export const runtime = "edge";
export const alt = "RSA Encryption and One-Way Functions · Foldscape";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderTopicOG("rsa");
}
