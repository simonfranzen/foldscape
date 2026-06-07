import { renderRootOG } from "@/lib/og/template";

export const runtime = "edge";
export const alt = "Foldscape — an atlas of mathematical curiosities";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function Image() {
  return renderRootOG();
}
