"use client";

import { useI18n } from "@/lib/i18n/context";

export default function ImprintPage() {
  const { t } = useI18n();
  return (
    <main className="pt-24 pb-32 px-6 min-h-screen">
      <div className="max-w-3xl mx-auto space-y-10">
        <header className="space-y-3">
          <div className="eml-pill">{t.nav.imprint}</div>
          <h1 className="math-italic text-5xl md:text-6xl leading-tight">{t.imprint.title}</h1>
          <p className="text-ink-300 text-sm">{t.imprint.intro}</p>
        </header>

        <section className="glass border hairline rounded-2xl p-8 space-y-5">
          <Row label={t.imprint.company}>
            zauberware technologies GmbH &amp; Co. KG
          </Row>
          <Row label={t.imprint.address}>
            Bachstrasse 17
            <br />
            83209 Prien am Chiemsee
            <br />
            Germany
          </Row>
          <Row label={t.imprint.register}>
            Amtsgericht Traunstein, HRA 11127
            <br />
            zauberware technologies Beteiligungs GmbH (persönlich haftende Gesellschafterin), HRB 22326
          </Row>
          <Row label={t.imprint.management}>Marcus Franzen, Simon Franzen</Row>
          <Row label={t.imprint.phone}>
            <a href="tel:+498051988694" className="text-signal-cyan hover:text-ink-100">
              +49 8051 988 69 46
            </a>
          </Row>
          <Row label={t.imprint.email}>
            <a href="mailto:hello@zauberware.com" className="text-signal-cyan hover:text-ink-100">
              hello@zauberware.com
            </a>
          </Row>
        </section>

        <section className="glass border hairline rounded-2xl p-8 space-y-3">
          <div className="font-mono text-[10px] tracking-widest2 text-signal-violet uppercase">
            {t.imprint.responsibility}
          </div>
          <p className="text-ink-200 text-sm leading-relaxed">{t.imprint.responsibilityBody}</p>
        </section>

        <section className="glass border hairline rounded-2xl p-8 space-y-3">
          <div className="font-mono text-[10px] tracking-widest2 text-signal-violet uppercase">
            {t.imprint.disclaimer}
          </div>
          <p className="text-ink-200 text-sm leading-relaxed">{t.imprint.disclaimerBody}</p>
        </section>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-[180px_1fr] gap-2 md:gap-6 items-start">
      <div className="font-mono text-[10px] tracking-widest2 text-ink-300 uppercase">{label}</div>
      <div className="text-ink-100 text-sm leading-relaxed">{children}</div>
    </div>
  );
}
