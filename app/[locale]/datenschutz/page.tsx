"use client";

import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// Deliberately minimal: the site sets no cookies, loads no third-party
// scripts and runs no analytics, so the only processing worth naming is the
// hosting provider's access log and the three functional browser-storage
// keys. Keep this page in sync if either of those facts changes.
type PrivacyText = {
  title: string;
  updated: string;
  sections: { heading: string; body: string }[];
};

const CONTROLLER =
  "zauberware technologies GmbH & Co. KG, Bachstrasse 17, 83209 Prien am Chiemsee, Germany, hello@zauberware.com";

const PRIVACY: Record<Locale, PrivacyText> = {
  en: {
    title: "Privacy",
    updated: "Last updated: 4 September 2026",
    sections: [
      {
        heading: "Controller",
        body: `${CONTROLLER}. Questions about data protection: hello@zauberware.com.`,
      },
      {
        heading: "Hosting and server logs",
        body: "This site is hosted on AWS Amplify (Amazon Web Services EMEA SARL) in the Frankfurt region (eu-central-1) and delivered through the CloudFront CDN. When you open a page, the provider records technical access data in server logs (IP address, time, requested URL, referrer, browser type). This is needed to deliver the site securely and to detect abuse (Art. 6 (1) (f) GDPR). We do not evaluate these logs for individual users; they are kept by the provider for a limited period and then deleted. A data processing agreement with AWS is in place.",
      },
      {
        heading: "No cookies, no tracking",
        body: "Foldscape sets no cookies, embeds no third-party scripts and runs no analytics or advertising tools. Fonts are served from our own host. The browser stores only three purely functional values on your device: your chosen language, the last scroll position of the atlas and whether the intro animation has played. These are strictly necessary for the site to work as expected and require no consent. They never leave your browser.",
      },
      {
        heading: "Contact",
        body: "If you email us, we process your address and message solely to answer you (Art. 6 (1) (b) and (f) GDPR) and delete the conversation once it is no longer needed.",
      },
      {
        heading: "Your rights",
        body: "You have the right to access, rectification, erasure, restriction of processing, data portability and objection, and the right to lodge a complaint with a supervisory authority, for us the Bavarian State Office for Data Protection Supervision (BayLDA).",
      },
    ],
  },
  de: {
    title: "Datenschutz",
    updated: "Stand: 4. September 2026",
    sections: [
      {
        heading: "Verantwortliche Stelle",
        body: `${CONTROLLER}. Fragen zum Datenschutz: hello@zauberware.com.`,
      },
      {
        heading: "Hosting und Server-Logs",
        body: "Diese Seite wird bei AWS Amplify (Amazon Web Services EMEA SARL) in der Region Frankfurt (eu-central-1) gehostet und über das CDN CloudFront ausgeliefert. Beim Aufruf einer Seite speichert der Anbieter technische Zugriffsdaten in Server-Logs (IP-Adresse, Zeitpunkt, aufgerufene URL, Referrer, Browsertyp). Das ist für den sicheren Betrieb und die Abwehr von Missbrauch erforderlich (Art. 6 Abs. 1 lit. f DSGVO). Wir werten diese Logs nicht personenbezogen aus; der Anbieter bewahrt sie für einen begrenzten Zeitraum auf und löscht sie danach. Mit AWS besteht ein Vertrag zur Auftragsverarbeitung.",
      },
      {
        heading: "Keine Cookies, kein Tracking",
        body: "Foldscape setzt keine Cookies, bindet keine Skripte Dritter ein und nutzt keine Analyse- oder Werbetools. Schriften werden vom eigenen Server geladen. Im Browser werden nur drei rein funktionale Werte auf deinem Gerät gespeichert: die gewählte Sprache, die letzte Scrollposition im Atlas und ob die Intro-Animation schon lief. Sie sind für die Nutzung der Seite unbedingt erforderlich und brauchen keine Einwilligung (§ 25 Abs. 2 TDDDG). Sie verlassen deinen Browser nicht.",
      },
      {
        heading: "Kontakt",
        body: "Wenn du uns eine E-Mail schreibst, verarbeiten wir deine Adresse und Nachricht nur zur Beantwortung (Art. 6 Abs. 1 lit. b und f DSGVO) und löschen den Vorgang, sobald er nicht mehr benötigt wird.",
      },
      {
        heading: "Deine Rechte",
        body: "Du hast das Recht auf Auskunft, Berichtigung, Löschung, Einschränkung der Verarbeitung, Datenübertragbarkeit und Widerspruch sowie das Recht auf Beschwerde bei einer Aufsichtsbehörde, für uns das Bayerische Landesamt für Datenschutzaufsicht (BayLDA).",
      },
    ],
  },
  es: {
    title: "Privacidad",
    updated: "Última actualización: 4 de septiembre de 2026",
    sections: [
      {
        heading: "Responsable",
        body: `${CONTROLLER}. Consultas sobre protección de datos: hello@zauberware.com.`,
      },
      {
        heading: "Alojamiento y registros del servidor",
        body: "Este sitio se aloja en AWS Amplify (Amazon Web Services EMEA SARL) en la región de Fráncfort (eu-central-1) y se distribuye mediante la CDN CloudFront. Al abrir una página, el proveedor guarda datos técnicos de acceso en registros del servidor (dirección IP, hora, URL solicitada, referente, tipo de navegador). Es necesario para operar el sitio con seguridad y detectar abusos (art. 6.1 f RGPD). No evaluamos estos registros por usuario; el proveedor los conserva durante un periodo limitado y después los elimina. Existe un contrato de encargo de tratamiento con AWS.",
      },
      {
        heading: "Sin cookies, sin seguimiento",
        body: "Foldscape no utiliza cookies, no incorpora scripts de terceros ni herramientas de análisis o publicidad. Las fuentes se sirven desde nuestro propio servidor. El navegador guarda en tu dispositivo solo tres valores puramente funcionales: el idioma elegido, la última posición de desplazamiento del atlas y si la animación de introducción ya se reprodujo. Son estrictamente necesarios y no requieren consentimiento. Nunca salen de tu navegador.",
      },
      {
        heading: "Contacto",
        body: "Si nos escribes por correo electrónico, tratamos tu dirección y tu mensaje únicamente para responderte (art. 6.1 b y f RGPD) y los eliminamos cuando dejan de ser necesarios.",
      },
      {
        heading: "Tus derechos",
        body: "Tienes derecho de acceso, rectificación, supresión, limitación del tratamiento, portabilidad y oposición, así como a presentar una reclamación ante una autoridad de control, en nuestro caso la Oficina Bávara de Supervisión de Protección de Datos (BayLDA).",
      },
    ],
  },
  fr: {
    title: "Confidentialité",
    updated: "Dernière mise à jour : 4 septembre 2026",
    sections: [
      {
        heading: "Responsable du traitement",
        body: `${CONTROLLER}. Questions relatives à la protection des données : hello@zauberware.com.`,
      },
      {
        heading: "Hébergement et journaux du serveur",
        body: "Ce site est hébergé sur AWS Amplify (Amazon Web Services EMEA SARL) dans la région de Francfort (eu-central-1) et diffusé via le CDN CloudFront. Lors de l'ouverture d'une page, l'hébergeur enregistre des données techniques d'accès dans ses journaux (adresse IP, heure, URL demandée, référent, type de navigateur). Cela est nécessaire à l'exploitation sécurisée du site et à la détection des abus (art. 6, par. 1, point f du RGPD). Nous n'exploitons pas ces journaux de manière individuelle ; l'hébergeur les conserve pendant une durée limitée puis les supprime. Un contrat de sous-traitance est conclu avec AWS.",
      },
      {
        heading: "Ni cookies, ni traçage",
        body: "Foldscape ne dépose aucun cookie, n'intègre aucun script tiers et n'utilise aucun outil d'analyse ou de publicité. Les polices sont servies depuis notre propre serveur. Le navigateur ne stocke sur votre appareil que trois valeurs purement fonctionnelles : la langue choisie, la dernière position de défilement de l'atlas et le fait que l'animation d'introduction a déjà été jouée. Elles sont strictement nécessaires et ne requièrent aucun consentement. Elles ne quittent jamais votre navigateur.",
      },
      {
        heading: "Contact",
        body: "Si vous nous écrivez par e-mail, nous traitons votre adresse et votre message uniquement pour vous répondre (art. 6, par. 1, points b et f du RGPD) et les supprimons dès qu'ils ne sont plus nécessaires.",
      },
      {
        heading: "Vos droits",
        body: "Vous disposez d'un droit d'accès, de rectification, d'effacement, de limitation du traitement, de portabilité et d'opposition, ainsi que du droit d'introduire une réclamation auprès d'une autorité de contrôle, pour nous l'Office bavarois de surveillance de la protection des données (BayLDA).",
      },
    ],
  },
  it: {
    title: "Privacy",
    updated: "Ultimo aggiornamento: 4 settembre 2026",
    sections: [
      {
        heading: "Titolare del trattamento",
        body: `${CONTROLLER}. Domande sulla protezione dei dati: hello@zauberware.com.`,
      },
      {
        heading: "Hosting e log del server",
        body: "Questo sito è ospitato su AWS Amplify (Amazon Web Services EMEA SARL) nella regione di Francoforte (eu-central-1) e distribuito tramite la CDN CloudFront. All'apertura di una pagina il provider registra dati tecnici di accesso nei log del server (indirizzo IP, orario, URL richiesto, referrer, tipo di browser). È necessario per il funzionamento sicuro del sito e per individuare abusi (art. 6, par. 1, lett. f GDPR). Non analizziamo questi log a livello individuale; il provider li conserva per un periodo limitato e poi li cancella. Con AWS è in essere un contratto di responsabile del trattamento.",
      },
      {
        heading: "Niente cookie, niente tracciamento",
        body: "Foldscape non imposta cookie, non incorpora script di terze parti e non usa strumenti di analisi o pubblicità. I font sono serviti dal nostro server. Il browser memorizza sul tuo dispositivo solo tre valori puramente funzionali: la lingua scelta, l'ultima posizione di scorrimento dell'atlante e se l'animazione introduttiva è già stata riprodotta. Sono strettamente necessari e non richiedono consenso. Non lasciano mai il tuo browser.",
      },
      {
        heading: "Contatto",
        body: "Se ci scrivi via e-mail, trattiamo il tuo indirizzo e il messaggio solo per risponderti (art. 6, par. 1, lett. b e f GDPR) e li cancelliamo quando non sono più necessari.",
      },
      {
        heading: "I tuoi diritti",
        body: "Hai diritto di accesso, rettifica, cancellazione, limitazione del trattamento, portabilità e opposizione, nonché di proporre reclamo a un'autorità di controllo, per noi l'Ufficio bavarese per la vigilanza sulla protezione dei dati (BayLDA).",
      },
    ],
  },
  pt: {
    title: "Privacidade",
    updated: "Última atualização: 4 de setembro de 2026",
    sections: [
      {
        heading: "Responsável pelo tratamento",
        body: `${CONTROLLER}. Dúvidas sobre proteção de dados: hello@zauberware.com.`,
      },
      {
        heading: "Alojamento e registos do servidor",
        body: "Este site está alojado no AWS Amplify (Amazon Web Services EMEA SARL) na região de Frankfurt (eu-central-1) e é distribuído pela CDN CloudFront. Ao abrir uma página, o fornecedor guarda dados técnicos de acesso nos registos do servidor (endereço IP, hora, URL pedido, referenciador, tipo de navegador). Isto é necessário para o funcionamento seguro do site e para detetar abusos (art. 6.º, n.º 1, alínea f do RGPD). Não avaliamos estes registos por utilizador; o fornecedor conserva-os por um período limitado e depois elimina-os. Existe um contrato de subcontratação com a AWS.",
      },
      {
        heading: "Sem cookies, sem rastreio",
        body: "O Foldscape não usa cookies, não incorpora scripts de terceiros nem ferramentas de análise ou publicidade. As fontes são servidas pelo nosso próprio servidor. O navegador guarda no teu dispositivo apenas três valores puramente funcionais: o idioma escolhido, a última posição de deslocamento do atlas e se a animação de introdução já foi reproduzida. São estritamente necessários e não exigem consentimento. Nunca saem do teu navegador.",
      },
      {
        heading: "Contacto",
        body: "Se nos escreveres por e-mail, tratamos o teu endereço e a mensagem apenas para responder (art. 6.º, n.º 1, alíneas b e f do RGPD) e eliminamo-los quando deixarem de ser necessários.",
      },
      {
        heading: "Os teus direitos",
        body: "Tens direito de acesso, retificação, apagamento, limitação do tratamento, portabilidade e oposição, bem como o direito de apresentar reclamação a uma autoridade de controlo, no nosso caso o Gabinete Bávaro de Supervisão da Proteção de Dados (BayLDA).",
      },
    ],
  },
  sv: {
    title: "Integritet",
    updated: "Senast uppdaterad: 4 september 2026",
    sections: [
      {
        heading: "Personuppgiftsansvarig",
        body: `${CONTROLLER}. Frågor om dataskydd: hello@zauberware.com.`,
      },
      {
        heading: "Hosting och serverloggar",
        body: "Sajten hostas på AWS Amplify (Amazon Web Services EMEA SARL) i regionen Frankfurt (eu-central-1) och levereras via CDN-tjänsten CloudFront. När du öppnar en sida sparar leverantören tekniska åtkomstdata i serverloggar (IP-adress, tidpunkt, begärd URL, hänvisande sida, webbläsartyp). Det krävs för säker drift och för att upptäcka missbruk (art. 6.1 f GDPR). Vi utvärderar inte loggarna på individnivå; leverantören sparar dem under en begränsad tid och raderar dem sedan. Ett personuppgiftsbiträdesavtal finns med AWS.",
      },
      {
        heading: "Inga kakor, ingen spårning",
        body: "Foldscape sätter inga kakor, laddar inga tredjepartsskript och använder inga analys- eller annonsverktyg. Typsnitt levereras från vår egen server. Webbläsaren lagrar bara tre rent funktionella värden på din enhet: valt språk, senaste rullningsposition i atlasen och om introanimationen redan har spelats. De är strikt nödvändiga och kräver inget samtycke. De lämnar aldrig din webbläsare.",
      },
      {
        heading: "Kontakt",
        body: "Om du mejlar oss behandlar vi din adress och ditt meddelande enbart för att svara (art. 6.1 b och f GDPR) och raderar ärendet när det inte längre behövs.",
      },
      {
        heading: "Dina rättigheter",
        body: "Du har rätt till tillgång, rättelse, radering, begränsning av behandling, dataportabilitet och invändning samt rätt att klaga hos en tillsynsmyndighet, för oss den bayerska dataskyddsmyndigheten (BayLDA).",
      },
    ],
  },
  no: {
    title: "Personvern",
    updated: "Sist oppdatert: 4. september 2026",
    sections: [
      {
        heading: "Behandlingsansvarlig",
        body: `${CONTROLLER}. Spørsmål om personvern: hello@zauberware.com.`,
      },
      {
        heading: "Hosting og serverlogger",
        body: "Nettstedet driftes på AWS Amplify (Amazon Web Services EMEA SARL) i regionen Frankfurt (eu-central-1) og leveres via CDN-tjenesten CloudFront. Når du åpner en side, lagrer leverandøren tekniske tilgangsdata i serverlogger (IP-adresse, tidspunkt, forespurt URL, henvisende side, nettlesertype). Dette er nødvendig for sikker drift og for å avdekke misbruk (art. 6 nr. 1 bokstav f GDPR). Vi analyserer ikke loggene på individnivå; leverandøren oppbevarer dem i en begrenset periode og sletter dem deretter. Det foreligger en databehandleravtale med AWS.",
      },
      {
        heading: "Ingen informasjonskapsler, ingen sporing",
        body: "Foldscape setter ingen informasjonskapsler, laster ingen tredjepartsskript og bruker ingen analyse- eller annonseverktøy. Skrifttyper leveres fra vår egen server. Nettleseren lagrer bare tre rent funksjonelle verdier på enheten din: valgt språk, siste rulleposisjon i atlaset og om introanimasjonen allerede er spilt av. De er strengt nødvendige og krever ikke samtykke. De forlater aldri nettleseren din.",
      },
      {
        heading: "Kontakt",
        body: "Hvis du sender oss e-post, behandler vi adressen og meldingen din kun for å svare (art. 6 nr. 1 bokstav b og f GDPR) og sletter saken når den ikke lenger er nødvendig.",
      },
      {
        heading: "Dine rettigheter",
        body: "Du har rett til innsyn, retting, sletting, begrensning av behandling, dataportabilitet og å protestere, samt rett til å klage til en tilsynsmyndighet, for oss det bayerske datatilsynet (BayLDA).",
      },
    ],
  },
};

export default function PrivacyPage() {
  const { t, locale } = useI18n();
  const p = PRIVACY[locale] ?? PRIVACY.en;
  return (
    <main className="min-h-screen px-6 pb-32 pt-24">
      <div className="mx-auto max-w-3xl space-y-10">
        <header className="space-y-3">
          <div className="tag-pill">{t.footer.privacy}</div>
          <h1 className="math-italic text-5xl leading-tight md:text-6xl">{p.title}</h1>
          <p className="text-sm text-ink-300">{p.updated}</p>
        </header>

        {p.sections.map((s) => (
          <section key={s.heading} className="glass hairline space-y-3 rounded-2xl border p-8">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {s.heading}
            </div>
            <p className="text-sm leading-relaxed text-ink-200">{s.body}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
