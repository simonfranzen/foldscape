"use client";

import { useI18n } from "@/lib/i18n/context";

export default function ImprintPage() {
  const { t } = useI18n();
  return (
    <main className="min-h-screen px-6 pb-32 pt-24">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <div className="eml-pill">{t.nav.imprint}</div>
          <h1 className="math-italic text-5xl leading-tight md:text-6xl">{t.imprint.title}</h1>
          <p className="text-sm text-ink-300">{t.imprint.intro}</p>
        </header>

        <section className="glass hairline space-y-5 rounded-2xl border p-8">
          <Row label={t.imprint.company}>zauberware technologies GmbH &amp; Co. KG</Row>
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
            zauberware technologies Beteiligungs GmbH (persönlich haftende Gesellschafterin), HRB
            22326
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

        <section className="glass hairline space-y-3 rounded-2xl border p-8">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {t.imprint.responsibility}
          </div>
          <p className="text-sm leading-relaxed text-ink-200">{t.imprint.responsibilityBody}</p>
        </section>

        <section className="glass hairline space-y-3 rounded-2xl border p-8">
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {t.imprint.disclaimer}
          </div>
          <p className="text-sm leading-relaxed text-ink-200">{t.imprint.disclaimerBody}</p>
        </section>
      </div>
    </main>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="grid grid-cols-1 items-start gap-2 md:grid-cols-[180px_1fr] md:gap-6">
      <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">{label}</div>
      <div className="text-sm leading-relaxed text-ink-100">{children}</div>
    </div>
  );
}
