// UI dictionaries shared across topic-agnostic chrome: navigation labels,
// footer attribution, and the imprint page. Localised in 8 languages; the
// EN dictionary is the source of truth for key parity (see data-invariants).

import type { Locale } from "./types";

export type Dict = {
  nav: { imprint: string; language: string };
  footer: { imprint: string; privacy: string; license: string; copyright: string };
  imprint: {
    title: string;
    intro: string;
    company: string;
    address: string;
    register: string;
    management: string;
    contact: string;
    phone: string;
    email: string;
    responsibility: string;
    responsibilityBody: string;
    disclaimer: string;
    disclaimerBody: string;
  };
};

const en: Dict = {
  nav: {
    imprint: "Imprint",
    language: "Language",
  },
  footer: {
    imprint: "Imprint",
    privacy: "Privacy",
    license: "Open source under CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Imprint",
    intro: "Information in accordance with § 5 DDG.",
    company: "Company",
    address: "Address",
    register: "Commercial Register",
    management: "Management",
    contact: "Contact",
    phone: "Phone",
    email: "Email",
    responsibility: "Responsible for content (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, address as above.",
    disclaimer: "Disclaimer",
    disclaimerBody:
      "Foldscape is a non-commercial visual essay. Texts, visuals and source code are published under CC BY 4.0 (see the LICENSE file in the repository). External links open in a new window; we assume no responsibility for the content of third-party sites.",
  },
};

const de: Dict = {
  nav: {
    imprint: "Impressum",
    language: "Sprache",
  },
  footer: {
    imprint: "Impressum",
    privacy: "Datenschutz",
    license: "Open Source unter CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Impressum",
    intro: "Angaben gemäß § 5 DDG.",
    company: "Unternehmen",
    address: "Anschrift",
    register: "Handelsregister",
    management: "Vertretungsberechtigte",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-Mail",
    responsibility: "Verantwortlich für den Inhalt (§ 18 Abs. 2 MStV)",
    responsibilityBody: "Simon Franzen, Anschrift wie oben.",
    disclaimer: "Haftungshinweis",
    disclaimerBody:
      "Foldscape ist ein nicht-kommerzieller visueller Essay. Texte, Bilder und Quellcode stehen unter CC BY 4.0 (siehe LICENSE-Datei im Repository). Externe Links öffnen in einem neuen Fenster; für die Inhalte fremder Seiten übernehmen wir keine Verantwortung.",
  },
};

const es: Dict = {
  nav: {
    imprint: "Aviso legal",
    language: "Idioma",
  },
  footer: {
    imprint: "Aviso legal",
    privacy: "Privacidad",
    license: "Código abierto bajo CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Aviso legal",
    intro: "Información conforme al § 5 de la Ley alemana de Servicios Digitales (DDG).",
    company: "Empresa",
    address: "Dirección",
    register: "Registro mercantil",
    management: "Dirección",
    contact: "Contacto",
    phone: "Teléfono",
    email: "Correo electrónico",
    responsibility: "Responsable del contenido (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, dirección como arriba.",
    disclaimer: "Aviso de responsabilidad",
    disclaimerBody:
      "Foldscape es un ensayo visual no comercial. Textos, imágenes y código fuente se publican bajo CC BY 4.0 (véase el archivo LICENSE en el repositorio). Los enlaces externos se abren en una nueva ventana; no asumimos responsabilidad por el contenido de sitios de terceros.",
  },
};

const fr: Dict = {
  nav: {
    imprint: "Mentions légales",
    language: "Langue",
  },
  footer: {
    imprint: "Mentions légales",
    privacy: "Confidentialité",
    license: "Open source sous CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Mentions légales",
    intro: "Informations selon § 5 DDG (Allemagne).",
    company: "Société",
    address: "Adresse",
    register: "Registre du commerce",
    management: "Direction",
    contact: "Contact",
    phone: "Téléphone",
    email: "Courriel",
    responsibility: "Responsable du contenu (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adresse ci-dessus.",
    disclaimer: "Avertissement",
    disclaimerBody:
      "Foldscape est un essai visuel non commercial. Textes, images et code source sont publiés sous licence CC BY 4.0 (voir le fichier LICENSE du dépôt). Les liens externes s'ouvrent dans une nouvelle fenêtre ; nous déclinons toute responsabilité quant au contenu de sites tiers.",
  },
};

const it: Dict = {
  nav: {
    imprint: "Note legali",
    language: "Lingua",
  },
  footer: {
    imprint: "Note legali",
    privacy: "Privacy",
    license: "Open source sotto CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Note legali",
    intro: "Informazioni ai sensi del § 5 DDG (Germania).",
    company: "Azienda",
    address: "Indirizzo",
    register: "Registro delle imprese",
    management: "Amministrazione",
    contact: "Contatti",
    phone: "Telefono",
    email: "E-mail",
    responsibility: "Responsabile del contenuto (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, indirizzo come sopra.",
    disclaimer: "Avviso di responsabilità",
    disclaimerBody:
      "Foldscape è un saggio visivo non commerciale. Testi, immagini e codice sorgente sono pubblicati con licenza CC BY 4.0 (vedi il file LICENSE nel repository). I collegamenti esterni si aprono in una nuova finestra; non ci assumiamo responsabilità per il contenuto di siti di terzi.",
  },
};

const pt: Dict = {
  nav: {
    imprint: "Aviso legal",
    language: "Idioma",
  },
  footer: {
    imprint: "Aviso legal",
    privacy: "Privacidade",
    license: "Código aberto sob CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Aviso legal",
    intro: "Informações conforme § 5 DDG (Alemanha).",
    company: "Empresa",
    address: "Endereço",
    register: "Registro comercial",
    management: "Direção",
    contact: "Contato",
    phone: "Telefone",
    email: "E-mail",
    responsibility: "Responsável pelo conteúdo (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, endereço acima.",
    disclaimer: "Aviso de responsabilidade",
    disclaimerBody:
      "O Foldscape é um ensaio visual não comercial. Textos, imagens e código-fonte são publicados sob CC BY 4.0 (ver o ficheiro LICENSE no repositório). As ligações externas abrem numa nova janela; não assumimos responsabilidade pelo conteúdo de sites de terceiros.",
  },
};

const sv: Dict = {
  nav: {
    imprint: "Juridisk info",
    language: "Språk",
  },
  footer: {
    imprint: "Juridisk info",
    privacy: "Integritet",
    license: "Öppen källkod under CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Juridisk information",
    intro: "Uppgifter enligt § 5 DDG (Tyskland).",
    company: "Företag",
    address: "Adress",
    register: "Handelsregister",
    management: "Ledning",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    responsibility: "Ansvarig för innehåll (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adress enligt ovan.",
    disclaimer: "Ansvarsfriskrivning",
    disclaimerBody:
      "Foldscape är en icke-kommersiell visuell essä. Texter, bilder och källkod publiceras under CC BY 4.0 (se filen LICENSE i repositoriet). Externa länkar öppnas i nytt fönster; vi tar inget ansvar för innehållet på tredjepartssajter.",
  },
};

const no: Dict = {
  nav: {
    imprint: "Juridisk info",
    language: "Språk",
  },
  footer: {
    imprint: "Juridisk info",
    privacy: "Personvern",
    license: "Åpen kildekode under CC BY 4.0",
    copyright: "© 2026 zauberware technologies GmbH & Co. KG",
  },
  imprint: {
    title: "Juridisk informasjon",
    intro: "Opplysninger i henhold til § 5 DDG (Tyskland).",
    company: "Selskap",
    address: "Adresse",
    register: "Handelsregister",
    management: "Ledelse",
    contact: "Kontakt",
    phone: "Telefon",
    email: "E-post",
    responsibility: "Ansvarlig for innholdet (§ 18 (2) MStV)",
    responsibilityBody: "Simon Franzen, adresse som over.",
    disclaimer: "Ansvarsfraskrivelse",
    disclaimerBody:
      "Foldscape er et ikke-kommersielt visuelt essay. Tekster, bilder og kildekode publiseres under CC BY 4.0 (se filen LICENSE i repositoriet). Eksterne lenker åpnes i nytt vindu; vi tar ikke ansvar for innholdet på tredjeparts nettsteder.",
  },
};

export const MESSAGES: Record<Locale, Dict> = { en, de, es, fr, it, pt, sv, no };
