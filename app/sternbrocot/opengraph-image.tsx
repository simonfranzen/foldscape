import { renderTopicOG } from "@/lib/og/template";

export const runtime = "edge";
export const alt = "The Stern-Brocot Tree · Foldscape";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderTopicOG("sternbrocot");
}
