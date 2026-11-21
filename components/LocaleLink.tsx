"use client";

import NextLink from "next/link";
import type { ComponentProps } from "react";
import { useI18n } from "@/lib/i18n/context";
import { localePath } from "@/lib/i18n/paths";

// Drop-in replacement for next/link: internal absolute hrefs ("/lorenz")
// get the active locale prefix, so a reader on /de/... stays in German and
// crawlers find the translated pages through plain links.
export default function LocaleLink({ href, ...rest }: ComponentProps<typeof NextLink>) {
  const { locale } = useI18n();
  const localized =
    typeof href === "string" && href.startsWith("/") && !href.startsWith("//")
      ? localePath(locale, href)
      : href;
  return <NextLink href={localized} {...rest} />;
}
