"use client";

import { useState } from "react";
import Link from "next/link";
import { Reveal } from "@/components/Reveal";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

// --------------------------------------------------------------------------
// Email obfuscation: the address is split into two halves and only joined
// inside a click handler that runs in the browser. The SSR HTML therefore
// contains neither a `mailto:` href nor the full literal address, so naive
// scrapers reading the rendered source see nothing usable. A visible
// "Show email" affordance keeps the contact route obvious to humans.
// --------------------------------------------------------------------------
const EMAIL_USER = "simon.franzen";
const EMAIL_HOST = "zauberware.com";

function EmailReveal({ showLabel }: { showLabel: string }) {
  // `revealed` carries the assembled address only after a user click.
  const [revealed, setRevealed] = useState<string | null>(null);

  if (revealed === null) {
    return (
      <button
        type="button"
        onClick={() => setRevealed(`${EMAIL_USER}@${EMAIL_HOST}`)}
        className="text-left text-ink-100 underline decoration-signal-amber/40 underline-offset-4 transition-colors hover:text-signal-amber"
      >
        {showLabel}
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => {
        // Build the mailto target at click time, not at render time, so no
        // bot following the rendered page ever sees the address either.
        window.location.href = `mailto:${EMAIL_USER}@${EMAIL_HOST}`;
      }}
      className="text-left text-ink-100 underline decoration-signal-amber/40 underline-offset-4 transition-colors hover:text-signal-amber"
    >
      {revealed}
    </button>
  );
}

// Per-locale UI strings that don't live in the shared bundles because they
// only exist on this page.
type AboutUiStrings = {
  showEmail: string;
  githubLabel: string;
  linkedinLabel: string;
  photoAlt: string;
};
const ABOUT_UI: Record<Locale, AboutUiStrings> = {
  de: {
    showEmail: "E-Mail anzeigen",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  en: {
    showEmail: "Show email",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  es: {
    showEmail: "Mostrar correo",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  fr: {
    showEmail: "Afficher l'e-mail",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  it: {
    showEmail: "Mostra e-mail",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  pt: {
    showEmail: "Mostrar e-mail",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  sv: {
    showEmail: "Visa e-post",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
  no: {
    showEmail: "Vis e-post",
    githubLabel: "GitHub",
    linkedinLabel: "LinkedIn",
    photoAlt: "Simon Franzen, Foldscape",
  },
};

// --------------------------------------------------------------------------
// Editorial "About" page. Distinct from the topic story pages: this is the
// place where Foldscape names its motivation, its studio of origin, and its
// author. Three glass panels, no interactive controls, no playground —
// the page earns its keep by being honest about why the atlas exists and
// where the money goes. Inline `Record<Locale, ...>` keeps the prose out of
// the shared i18n bundles, mirroring `app/banach/page.tsx`.
// --------------------------------------------------------------------------

type AuthorRow = { label: string; value: string };

type RichAbout = {
  hero: {
    pretitle: string;
    title: string;
    tagline: string;
    intro: string;
  };
  motivation: {
    pretitle: string;
    title: string;
    paragraphs: string[];
  };
  studio: {
    pretitle: string;
    title: string;
    body: string;
    linkLabel: string;
  };
  author: {
    pretitle: string;
    title: string;
    intro: string;
    rolesLabel: string;
    roles: AuthorRow[];
    recognitionLabel: string;
    recognition: string[];
    contactLabel: string;
    moreLabel: string;
  };
};

// ---------------- Deutsch (canonical voice) ----------------
const de: RichAbout = {
  hero: {
    pretitle: "Über Foldscape",
    title: "Drei Linsen auf dasselbe Staunen.",
    tagline: "Mathematik, Code, Kunst — verwoben statt sortiert.",
    intro:
      "Foldscape ist ein Atlas mathematischer Kuriositäten. Es ist auch eine kleine Wette: dass die schönsten Ideen aus Mathematik und Informatik nicht hinter Schranken gehören, sondern in den Händen aller, die sie sehen wollen.",
  },
  motivation: {
    pretitle: "Motivation",
    title: "Warum es Foldscape gibt",
    paragraphs: [
      "Ich baue diesen Atlas, weil Mathematik, Programmieren und visuelle Kunst für mich drei Linsen auf dasselbe Staunen sind. Jede zeigt ein anderes Profil derselben Idee — eine Gleichung, ein Algorithmus, ein Bild — und erst alle drei zusammen ergeben das ganze Objekt. Foldscape ist der Versuch, die Übergänge zwischen diesen Linsen sichtbar zu machen, statt sie zu sortieren.",
      "Es gibt einen MINT-Grund und einen leiseren, persönlicheren. Mathematische Ideen werden zu oft als Geheimsprache präsentiert, deren Eintrittspreis ein Studium ist. Das stimmt nicht. Banach–Tarski, Hilberts Hotel, die Mandelbrot-Menge — das sind keine Hochburgen, sondern Erzählungen. Sie verdienen ein Publikum, das sie anfassen, drehen, zerlegen und durchstöbern darf, ohne erst eine Prüfung zu bestehen.",
      "Mir liegt besonders daran, Frauen in Mathematik und Informatik zu stärken. Beide Felder sind reicher und ehrlicher, wenn alle, die in ihnen denken könnten, es auch tun. Ein Atlas allein verändert das nicht — aber er kann eine kleine, freundliche Tür sein, und er kann die richtigen Räume mitfinanzieren.",
      "Konkret: Einnahmen aus diesem Projekt fließen vollständig an Organisationen, die Forschende, Studierende und junge Menschen — insbesondere Frauen und nicht-binäre Personen — in Mathematik und Informatik stärken. Keine versteckten Kosten, keine Werbe-Umwege.",
      "Ich bin keine neutrale Stimme hier. Das ist eine sehr persönliche Sammlung, kuratiert mit der Hand, die sie geschrieben hat. Wenn es dir gefällt: schick es weiter. Wenn dich etwas stört: schreib mir.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Kuratiert unter zauberware",
    body: "Foldscape entsteht im Umfeld von zauberware — einem AI Software Studio aus Prien am Chiemsee, das seit 2012 maßgeschneiderte Digitalisierungs- und KI-Plattformen für den DACH-Raum baut. Remote-first, kein Offshore, mit einem Faible für gründliche Engineering-Arbeit statt schneller Demos. Foldscape ist das offene, nicht-kommerzielle Geschwister: weniger Plattform, mehr Atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Autor",
    title: "Simon Franzen",
    intro:
      "Mehrfacher Gründer und CTO mit über fünfzehn Jahren in maßgeschneiderter Digitalisierung. Schwerpunkt: angewandte KI, nachhaltige Geschäftsmodelle, das Skalieren digitaler Produkte. Aktuell Gründer und CTO bei Reflecta gGmbH — der Community für nachhaltige und soziale Innovationen — und Geschäftsführer bei zauberware.",
    rolesLabel: "Rollen & Schwerpunkte",
    roles: [
      { label: "Aktuell", value: "Founder & CTO, Reflecta gGmbH" },
      { label: "Aktuell", value: "Geschäftsführer, zauberware" },
      { label: "Fokus", value: "Angewandte KI, LLMs, LangChain/LangGraph" },
      { label: "Fokus", value: "Plattform-Engineering, Web & Mobile" },
      { label: "Lehre", value: "Workshops & Vorträge zu KI in der Praxis" },
      { label: "Sprachen", value: "Deutsch, Englisch, Spanisch" },
    ],
    recognitionLabel: "Anerkennung",
    recognition: [
      'Civic Innovation Award 2021 des Bundesministeriums für Arbeit und Soziales — „Gemeinsam wird es KI" (reflecta.network).',
      "Future City Incubator Stipendium 2021 — gemeinwohlorientierte KI-Anwendungen.",
      "Anthropia gGmbH Stipendium 2020 — Förderung sozialer Initiativen.",
    ],
    contactLabel: "Kontakt",
    moreLabel: "Mehr auf zauberware.com",
  },
};

// ---------------- English ----------------
const en: RichAbout = {
  hero: {
    pretitle: "About Foldscape",
    title: "Three lenses on the same wonder.",
    tagline: "Mathematics, code, art — woven together, not sorted apart.",
    intro:
      "Foldscape is an atlas of mathematical curiosities. It is also a small wager: that the most beautiful ideas in maths and computer science belong in the hands of anyone who wants to see them, not behind gates.",
  },
  motivation: {
    pretitle: "Motivation",
    title: "Why Foldscape exists",
    paragraphs: [
      "I am building this atlas because mathematics, programming, and visual art are, to me, three lenses on the same wonder. Each shows a different profile of the same idea — an equation, an algorithm, an image — and only the three together describe the whole object. Foldscape is an attempt to make the passages between those lenses visible, instead of sorting them into separate rooms.",
      "There is a STEM reason and a quieter, more personal one. Mathematical ideas are too often presented as a secret language whose admission fee is a degree. That is not true. Banach–Tarski, Hilbert's Hotel, the Mandelbrot set — these are not citadels. They are stories. They deserve an audience that gets to touch them, rotate them, take them apart, and browse them without first passing an exam.",
      "I care, in particular, about strengthening women in mathematics and computer science. Both fields are richer and more honest when everyone who could think inside them actually does. An atlas alone will not change that — but it can be a small, friendly door, and it can help fund the right rooms.",
      "Concretely: project earnings flow in full to organisations that strengthen researchers, students, and young people — especially women and non-binary people — in maths and CS. No hidden costs, no advertising detours.",
      "I am not a neutral voice here. This is a deeply personal collection, curated by the hand that wrote it. If it lands for you, pass it on. If something rubs you the wrong way, write to me.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Curated under zauberware",
    body: "Foldscape grows out of zauberware — an AI software studio from Prien am Chiemsee, Bavaria, building bespoke digitalisation and AI platforms for the DACH region since 2012. Remote-first, no offshore, with a taste for thorough engineering over fast demos. Foldscape is the open, non-commercial sibling: less platform, more atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Author",
    title: "Simon Franzen",
    intro:
      "Multi-time founder and CTO with more than fifteen years in custom digitalisation. Focus: applied AI, sustainable business models, scaling digital products. Currently founder and CTO at Reflecta gGmbH — the community for sustainable and social innovations — and managing director at zauberware.",
    rolesLabel: "Roles & focus",
    roles: [
      { label: "Current", value: "Founder & CTO, Reflecta gGmbH" },
      { label: "Current", value: "Managing director, zauberware" },
      { label: "Focus", value: "Applied AI, LLMs, LangChain/LangGraph" },
      { label: "Focus", value: "Platform engineering, web & mobile" },
      { label: "Teaching", value: "Workshops and talks on AI in practice" },
      { label: "Languages", value: "German, English, Spanish" },
    ],
    recognitionLabel: "Recognition",
    recognition: [
      'Civic Innovation Award 2021 from the German Federal Ministry of Labour and Social Affairs — "Gemeinsam wird es KI" (reflecta.network).',
      "Future City Incubator Fellowship 2021 — public-interest AI applications.",
      "Anthropia gGmbH fellowship 2020 — support for social initiatives.",
    ],
    contactLabel: "Contact",
    moreLabel: "More at zauberware.com",
  },
};

// ---------------- Español ----------------
const es: RichAbout = {
  hero: {
    pretitle: "Acerca de Foldscape",
    title: "Tres lentes sobre el mismo asombro.",
    tagline: "Matemática, código, arte — entretejidos, no separados.",
    intro:
      "Foldscape es un atlas de curiosidades matemáticas. También es una pequeña apuesta: que las ideas más bellas de las matemáticas y la informática pertenecen a quien quiera verlas, no detrás de puertas cerradas.",
  },
  motivation: {
    pretitle: "Motivación",
    title: "Por qué existe Foldscape",
    paragraphs: [
      "Construyo este atlas porque las matemáticas, la programación y el arte visual son, para mí, tres lentes sobre el mismo asombro. Cada una muestra un perfil distinto de la misma idea — una ecuación, un algoritmo, una imagen — y solo las tres juntas describen el objeto completo. Foldscape intenta hacer visibles los pasajes entre esas lentes, en lugar de ordenarlas en habitaciones aparte.",
      "Hay una razón STEM y otra más callada, más personal. Las ideas matemáticas se presentan demasiadas veces como un idioma secreto cuya entrada cuesta una carrera. No es verdad. Banach–Tarski, el hotel de Hilbert, el conjunto de Mandelbrot — no son ciudadelas. Son relatos. Merecen un público que pueda tocarlos, girarlos, desmontarlos y hojearlos sin aprobar primero un examen.",
      "Me importa, en particular, fortalecer a las mujeres en matemáticas e informática. Ambos campos son más ricos y más honestos cuando piensan en ellos quienes podrían pensar en ellos. Un atlas por sí solo no va a cambiar eso — pero puede ser una puertita amable, y puede ayudar a financiar los espacios correctos.",
      "En concreto: los ingresos del proyecto van íntegros a organizaciones que fortalecen a investigadoras, estudiantes y jóvenes — especialmente mujeres y personas no binarias — en matemáticas e informática. Sin costes ocultos, sin desvíos publicitarios.",
      "No soy una voz neutra aquí. Esta es una colección profundamente personal, curada por la mano que la escribe. Si te llega, pásala. Si algo te molesta, escríbeme.",
    ],
  },
  studio: {
    pretitle: "Estudio",
    title: "Curado bajo zauberware",
    body: "Foldscape nace en el entorno de zauberware — un AI software studio de Prien am Chiemsee (Baviera) que desde 2012 construye plataformas de digitalización y de IA a medida para la región DACH. Remote-first, sin offshore, con preferencia por el trabajo de ingeniería minucioso antes que las demos rápidas. Foldscape es su pariente abierto y no comercial: menos plataforma, más atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Autor",
    title: "Simon Franzen",
    intro:
      "Fundador en serie y CTO con más de quince años en digitalización a medida. Foco: IA aplicada, modelos de negocio sostenibles, escalado de productos digitales. Actualmente fundador y CTO en Reflecta gGmbH — la comunidad de innovaciones sostenibles y sociales — y director general de zauberware.",
    rolesLabel: "Roles y foco",
    roles: [
      { label: "Actual", value: "Fundador y CTO, Reflecta gGmbH" },
      { label: "Actual", value: "Director general, zauberware" },
      { label: "Foco", value: "IA aplicada, LLMs, LangChain/LangGraph" },
      { label: "Foco", value: "Ingeniería de plataforma, web y mobile" },
      { label: "Docencia", value: "Talleres y charlas sobre IA en la práctica" },
      { label: "Idiomas", value: "Alemán, inglés, español" },
    ],
    recognitionLabel: "Reconocimiento",
    recognition: [
      "Civic Innovation Award 2021 del Ministerio Federal Alemán de Trabajo y Asuntos Sociales — «Gemeinsam wird es KI» (reflecta.network).",
      "Beca Future City Incubator 2021 — aplicaciones de IA de interés público.",
      "Beca Anthropia gGmbH 2020 — apoyo a iniciativas sociales.",
    ],
    contactLabel: "Contacto",
    moreLabel: "Más en zauberware.com",
  },
};

// ---------------- Français ----------------
const fr: RichAbout = {
  hero: {
    pretitle: "À propos de Foldscape",
    title: "Trois lentilles sur le même émerveillement.",
    tagline: "Mathématiques, code, art — tressés, pas rangés à part.",
    intro:
      "Foldscape est un atlas de curiosités mathématiques. C'est aussi un petit pari : que les plus belles idées des mathématiques et de l'informatique appartiennent à quiconque veut les voir, et non derrière des portes verrouillées.",
  },
  motivation: {
    pretitle: "Motivation",
    title: "Pourquoi Foldscape existe",
    paragraphs: [
      "Je construis cet atlas parce que les mathématiques, la programmation et l'art visuel sont, pour moi, trois lentilles sur le même émerveillement. Chacune montre un profil différent de la même idée — une équation, un algorithme, une image — et seules les trois réunies décrivent l'objet entier. Foldscape tente de rendre visibles les passages entre ces lentilles, au lieu de les ranger dans des salles séparées.",
      "Il y a une raison STEM, et une plus discrète, plus personnelle. Les idées mathématiques sont trop souvent présentées comme un langage secret dont le ticket d'entrée est un diplôme. C'est faux. Banach–Tarski, l'hôtel de Hilbert, l'ensemble de Mandelbrot — ce ne sont pas des citadelles. Ce sont des récits. Ils méritent un public qui peut les toucher, les tourner, les démonter et les feuilleter sans passer un examen d'abord.",
      "Je tiens particulièrement à renforcer la place des femmes en mathématiques et en informatique. Les deux disciplines sont plus riches et plus honnêtes quand toutes celles et ceux qui pourraient y penser le font effectivement. Un atlas seul ne changera pas cela — mais il peut être une petite porte amicale, et il peut aider à financer les bonnes pièces.",
      "Concrètement : les revenus du projet vont intégralement à des organisations qui renforcent les chercheuses, étudiantes et jeunes — en particulier les femmes et les personnes non binaires — en maths et en informatique. Pas de coûts cachés, pas de détours publicitaires.",
      "Je ne suis pas une voix neutre ici. C'est une collection profondément personnelle, curatée par la main qui l'écrit. Si elle te parle, fais-la circuler. Si quelque chose te dérange, écris-moi.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Sous l'égide de zauberware",
    body: "Foldscape naît dans le sillage de zauberware — un AI software studio basé à Prien am Chiemsee, en Bavière, qui construit depuis 2012 des plateformes de digitalisation et d'IA sur mesure pour la région DACH. Remote-first, sans offshore, avec un goût pour le travail d'ingénierie soigné plutôt que pour les démos rapides. Foldscape en est le pendant ouvert et non commercial : moins de plateforme, plus d'atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Auteur",
    title: "Simon Franzen",
    intro:
      "Fondateur en série et CTO avec plus de quinze ans dans la digitalisation sur mesure. Centres : IA appliquée, modèles d'affaires durables, mise à l'échelle de produits numériques. Actuellement fondateur et CTO chez Reflecta gGmbH — la communauté des innovations durables et sociales — et directeur général de zauberware.",
    rolesLabel: "Rôles et axes",
    roles: [
      { label: "Actuel", value: "Fondateur et CTO, Reflecta gGmbH" },
      { label: "Actuel", value: "Directeur général, zauberware" },
      { label: "Axe", value: "IA appliquée, LLMs, LangChain/LangGraph" },
      { label: "Axe", value: "Ingénierie de plateforme, web et mobile" },
      { label: "Enseignement", value: "Ateliers et conférences sur l'IA appliquée" },
      { label: "Langues", value: "Allemand, anglais, espagnol" },
    ],
    recognitionLabel: "Reconnaissance",
    recognition: [
      "Civic Innovation Award 2021 du ministère fédéral allemand du Travail et des Affaires sociales — « Gemeinsam wird es KI » (reflecta.network).",
      "Bourse Future City Incubator 2021 — applications d'IA d'intérêt général.",
      "Bourse Anthropia gGmbH 2020 — soutien aux initiatives sociales.",
    ],
    contactLabel: "Contact",
    moreLabel: "Plus sur zauberware.com",
  },
};

// ---------------- Italiano ----------------
const it: RichAbout = {
  hero: {
    pretitle: "Su Foldscape",
    title: "Tre lenti sullo stesso stupore.",
    tagline: "Matematica, codice, arte — intrecciati, non separati.",
    intro:
      "Foldscape è un atlante di curiosità matematiche. È anche una piccola scommessa: che le idee più belle della matematica e dell'informatica appartengano a chiunque voglia vederle, non dietro porte chiuse.",
  },
  motivation: {
    pretitle: "Motivazione",
    title: "Perché Foldscape esiste",
    paragraphs: [
      "Costruisco questo atlante perché matematica, programmazione e arte visiva sono, per me, tre lenti sullo stesso stupore. Ciascuna mostra un profilo diverso della stessa idea — un'equazione, un algoritmo, un'immagine — e solo tutte e tre insieme descrivono l'oggetto intero. Foldscape prova a rendere visibili i passaggi fra queste lenti, invece di sistemarle in stanze separate.",
      "C'è una ragione STEM e un'altra più silenziosa, più personale. Le idee matematiche vengono presentate troppo spesso come una lingua segreta il cui biglietto d'ingresso è una laurea. Non è vero. Banach–Tarski, l'hotel di Hilbert, l'insieme di Mandelbrot — non sono cittadelle. Sono racconti. Meritano un pubblico che possa toccarli, ruotarli, smontarli e sfogliarli senza dover prima superare un esame.",
      "Mi sta a cuore, in particolare, rafforzare le donne in matematica e informatica. Entrambi i campi sono più ricchi e più onesti quando ci pensano davvero tutte le persone che potrebbero pensarci. Un atlante da solo non lo cambierà — ma può essere una piccola porta amichevole, e può aiutare a finanziare le stanze giuste.",
      "In concreto: i ricavi del progetto vanno per intero a organizzazioni che rafforzano ricercatrici, studenti e giovani — in particolare donne e persone non binarie — in matematica e informatica. Nessun costo nascosto, nessun aggiramento pubblicitario.",
      "Non sono una voce neutra qui. Questa è una raccolta profondamente personale, curata dalla mano che la scrive. Se ti arriva, fallo girare. Se qualcosa ti dà fastidio, scrivimi.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Curato sotto zauberware",
    body: "Foldscape nasce nell'ambito di zauberware — un AI software studio di Prien am Chiemsee, in Baviera, che dal 2012 costruisce piattaforme di digitalizzazione e IA su misura per l'area DACH. Remote-first, senza offshore, con la preferenza per il lavoro di ingegneria accurato rispetto alle demo veloci. Foldscape ne è la controparte aperta e non commerciale: meno piattaforma, più atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Autore",
    title: "Simon Franzen",
    intro:
      "Più volte fondatore e CTO con oltre quindici anni in digitalizzazione su misura. Fuoco: IA applicata, modelli di business sostenibili, scaling di prodotti digitali. Attualmente fondatore e CTO di Reflecta gGmbH — la comunità per innovazioni sostenibili e sociali — e amministratore di zauberware.",
    rolesLabel: "Ruoli e fuochi",
    roles: [
      { label: "Attuale", value: "Fondatore e CTO, Reflecta gGmbH" },
      { label: "Attuale", value: "Amministratore, zauberware" },
      { label: "Fuoco", value: "IA applicata, LLM, LangChain/LangGraph" },
      { label: "Fuoco", value: "Platform engineering, web e mobile" },
      { label: "Insegnamento", value: "Workshop e talk su IA in pratica" },
      { label: "Lingue", value: "Tedesco, inglese, spagnolo" },
    ],
    recognitionLabel: "Riconoscimenti",
    recognition: [
      "Civic Innovation Award 2021 del Ministero Federale tedesco del Lavoro e degli Affari Sociali — «Gemeinsam wird es KI» (reflecta.network).",
      "Borsa Future City Incubator 2021 — applicazioni di IA di interesse pubblico.",
      "Borsa Anthropia gGmbH 2020 — sostegno a iniziative sociali.",
    ],
    contactLabel: "Contatto",
    moreLabel: "Altro su zauberware.com",
  },
};

// ---------------- Português ----------------
const pt: RichAbout = {
  hero: {
    pretitle: "Sobre o Foldscape",
    title: "Três lentes sobre o mesmo espanto.",
    tagline: "Matemática, código, arte — entrelaçados, não separados.",
    intro:
      "O Foldscape é um atlas de curiosidades matemáticas. É também uma pequena aposta: que as ideias mais belas da matemática e da informática pertencem a quem quiser vê-las, e não atrás de portas fechadas.",
  },
  motivation: {
    pretitle: "Motivação",
    title: "Por que existe o Foldscape",
    paragraphs: [
      "Construo este atlas porque a matemática, a programação e a arte visual são, para mim, três lentes sobre o mesmo espanto. Cada uma mostra um perfil diferente da mesma ideia — uma equação, um algoritmo, uma imagem — e só as três juntas descrevem o objecto inteiro. O Foldscape tenta tornar visíveis as passagens entre essas lentes, em vez de as arrumar em salas separadas.",
      "Há uma razão STEM e outra mais discreta, mais pessoal. As ideias matemáticas são apresentadas vezes de mais como uma língua secreta cujo bilhete de entrada é um curso. Não é verdade. Banach–Tarski, o hotel de Hilbert, o conjunto de Mandelbrot — não são cidadelas. São relatos. Merecem um público que possa tocá-los, rodá-los, desmontá-los e folheá-los sem passar primeiro num exame.",
      "Importa-me particularmente fortalecer as mulheres em matemática e informática. Ambos os campos são mais ricos e mais honestos quando pensam neles todos quantos poderiam pensar. Um atlas sozinho não vai mudar isso — mas pode ser uma pequena porta amigável e pode ajudar a financiar as salas certas.",
      "Em concreto: as receitas do projecto vão integralmente para organizações que fortalecem investigadoras, estudantes e jovens — em particular mulheres e pessoas não binárias — em matemática e informática. Sem custos escondidos, sem desvios publicitários.",
      "Não sou uma voz neutra aqui. Esta é uma colecção profundamente pessoal, curada pela mão que a escreve. Se te chega, faz circular. Se algo te incomoda, escreve-me.",
    ],
  },
  studio: {
    pretitle: "Estúdio",
    title: "Curado sob zauberware",
    body: "O Foldscape nasce no seio de zauberware — um AI software studio de Prien am Chiemsee, na Baviera, que desde 2012 constrói plataformas de digitalização e de IA à medida para a região DACH. Remote-first, sem offshore, com gosto pelo trabalho de engenharia minucioso em vez de demos rápidas. O Foldscape é o seu parente aberto e não comercial: menos plataforma, mais atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Autor",
    title: "Simon Franzen",
    intro:
      "Fundador em série e CTO com mais de quinze anos em digitalização à medida. Foco: IA aplicada, modelos de negócio sustentáveis, escalar produtos digitais. Actualmente fundador e CTO na Reflecta gGmbH — a comunidade de inovações sustentáveis e sociais — e director-geral da zauberware.",
    rolesLabel: "Papéis e foco",
    roles: [
      { label: "Actual", value: "Fundador e CTO, Reflecta gGmbH" },
      { label: "Actual", value: "Director-geral, zauberware" },
      { label: "Foco", value: "IA aplicada, LLMs, LangChain/LangGraph" },
      { label: "Foco", value: "Engenharia de plataforma, web e mobile" },
      { label: "Ensino", value: "Workshops e palestras sobre IA na prática" },
      { label: "Línguas", value: "Alemão, inglês, espanhol" },
    ],
    recognitionLabel: "Reconhecimento",
    recognition: [
      "Civic Innovation Award 2021 do Ministério Federal Alemão do Trabalho e Assuntos Sociais — «Gemeinsam wird es KI» (reflecta.network).",
      "Bolsa Future City Incubator 2021 — aplicações de IA de interesse público.",
      "Bolsa Anthropia gGmbH 2020 — apoio a iniciativas sociais.",
    ],
    contactLabel: "Contacto",
    moreLabel: "Mais em zauberware.com",
  },
};

// ---------------- Svenska ----------------
const sv: RichAbout = {
  hero: {
    pretitle: "Om Foldscape",
    title: "Tre linser på samma förundran.",
    tagline: "Matematik, kod, konst — sammanvävda, inte sorterade isär.",
    intro:
      "Foldscape är en atlas över matematiska kuriositeter. Det är också en liten vadslagning: att de vackraste idéerna inom matematik och datavetenskap hör hemma i händerna på alla som vill se dem, inte bakom stängda dörrar.",
  },
  motivation: {
    pretitle: "Motivation",
    title: "Varför Foldscape finns",
    paragraphs: [
      "Jag bygger den här atlasen för att matematik, programmering och visuell konst för mig är tre linser på samma förundran. Var och en visar en annan profil av samma idé — en ekvation, en algoritm, en bild — och bara alla tre tillsammans beskriver hela objektet. Foldscape försöker göra passagerna mellan dessa linser synliga, i stället för att sortera dem i separata rum.",
      "Det finns ett STEM-skäl och ett tystare, mer personligt skäl. Matematiska idéer presenteras alltför ofta som ett hemligt språk vars inträdesbiljett är en examen. Det är inte sant. Banach–Tarski, Hilberts hotell, Mandelbrotmängden — det är inga citadell. Det är berättelser. De förtjänar en publik som får röra dem, vrida dem, plocka isär dem och bläddra i dem utan att först ta en tenta.",
      "Jag bryr mig särskilt om att stärka kvinnor inom matematik och datavetenskap. Båda fälten blir rikare och mer ärliga när alla som skulle kunna tänka inom dem faktiskt gör det. En atlas ensam kommer inte att ändra det — men den kan vara en liten, vänlig dörr, och den kan hjälpa till att finansiera rätt rum.",
      "Konkret: intäkterna från projektet går i sin helhet till organisationer som stärker forskare, studenter och unga — särskilt kvinnor och icke-binära personer — inom matematik och datavetenskap. Inga dolda kostnader, inga reklamomvägar.",
      "Jag är ingen neutral röst här. Det här är en djupt personlig samling, kurerad av den hand som skriver den. Om den landar hos dig, skicka den vidare. Om något skaver, skriv till mig.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Kurerad under zauberware",
    body: "Foldscape växer ur zauberware — en AI software studio från Prien am Chiemsee i Bayern, som sedan 2012 bygger skräddarsydda digitaliserings- och AI-plattformar för DACH-regionen. Remote-first, ingen offshore, med smak för grundligt ingenjörsarbete framför snabba demos. Foldscape är dess öppna, icke-kommersiella syskon: mindre plattform, mer ateljé.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Författare",
    title: "Simon Franzen",
    intro:
      "Flergångsgrundare och CTO med över femton år inom skräddarsydd digitalisering. Fokus: tillämpad AI, hållbara affärsmodeller, att skala digitala produkter. För närvarande grundare och CTO på Reflecta gGmbH — gemenskapen för hållbara och sociala innovationer — och VD för zauberware.",
    rolesLabel: "Roller och fokus",
    roles: [
      { label: "Nu", value: "Grundare och CTO, Reflecta gGmbH" },
      { label: "Nu", value: "VD, zauberware" },
      { label: "Fokus", value: "Tillämpad AI, LLM, LangChain/LangGraph" },
      { label: "Fokus", value: "Plattformsingenjörskap, web och mobil" },
      { label: "Undervisning", value: "Workshops och föredrag om AI i praktiken" },
      { label: "Språk", value: "Tyska, engelska, spanska" },
    ],
    recognitionLabel: "Erkännanden",
    recognition: [
      "Civic Innovation Award 2021 från det tyska förbundsministeriet för arbete och socialt — «Gemeinsam wird es KI» (reflecta.network).",
      "Future City Incubator-stipendium 2021 — AI-tillämpningar i allmänhetens intresse.",
      "Anthropia gGmbH-stipendium 2020 — stöd till sociala initiativ.",
    ],
    contactLabel: "Kontakt",
    moreLabel: "Mer på zauberware.com",
  },
};

// ---------------- Norsk ----------------
const no: RichAbout = {
  hero: {
    pretitle: "Om Foldscape",
    title: "Tre linser på den samme undringen.",
    tagline: "Matematikk, kode, kunst — sammenvevd, ikke sortert fra hverandre.",
    intro:
      "Foldscape er et atlas over matematiske kuriositeter. Det er også et lite veddemål: at de vakreste ideene i matematikk og informatikk hører hjemme i hendene til alle som vil se dem, ikke bak låste dører.",
  },
  motivation: {
    pretitle: "Motivasjon",
    title: "Hvorfor Foldscape finnes",
    paragraphs: [
      "Jeg bygger dette atlaset fordi matematikk, programmering og visuell kunst for meg er tre linser på den samme undringen. Hver av dem viser en annen profil av den samme ideen — en ligning, en algoritme, et bilde — og bare alle tre sammen beskriver hele objektet. Foldscape forsøker å gjøre passasjene mellom disse linsene synlige, i stedet for å sortere dem inn i separate rom.",
      "Det er en STEM-grunn og en stillere, mer personlig. Matematiske ideer presenteres altfor ofte som et hemmelig språk hvor inngangsbilletten er en grad. Det stemmer ikke. Banach–Tarski, Hilberts hotell, Mandelbrotmengden — det er ikke festninger. Det er fortellinger. De fortjener et publikum som får ta på dem, vri dem, demontere dem og bla i dem uten å bestå en eksamen først.",
      "Det er særlig viktig for meg å styrke kvinner i matematikk og informatikk. Begge fagene blir rikere og mer ærlige når alle som kunne tenkt i dem, faktisk gjør det. Et atlas alene kommer ikke til å endre dette — men det kan være en liten, vennlig dør, og det kan være med på å finansiere de riktige rommene.",
      "Konkret: inntektene fra prosjektet går i sin helhet til organisasjoner som styrker forskere, studenter og unge — særlig kvinner og ikke-binære personer — i matematikk og informatikk. Ingen skjulte kostnader, ingen reklame-omveier.",
      "Jeg er ingen nøytral stemme her. Dette er en dypt personlig samling, kuratert av hånden som skriver den. Hvis den treffer deg, send den videre. Hvis noe skurrer, skriv til meg.",
    ],
  },
  studio: {
    pretitle: "Studio",
    title: "Kuratert under zauberware",
    body: "Foldscape vokser ut av zauberware — et AI software studio fra Prien am Chiemsee i Bayern, som siden 2012 har bygget skreddersydde digitaliserings- og AI-plattformer for DACH-regionen. Remote-first, ingen offshore, med en forkjærlighet for grundig ingeniørarbeid framfor raske demoer. Foldscape er det åpne, ikke-kommersielle søskenet: mindre plattform, mer atelier.",
    linkLabel: "zauberware.com",
  },
  author: {
    pretitle: "Forfatter",
    title: "Simon Franzen",
    intro:
      "Gjentatt gründer og CTO med over femten år innen skreddersydd digitalisering. Fokus: anvendt KI, bærekraftige forretningsmodeller, skalering av digitale produkter. For tiden gründer og CTO i Reflecta gGmbH — fellesskapet for bærekraftige og sosiale innovasjoner — og daglig leder i zauberware.",
    rolesLabel: "Roller og fokus",
    roles: [
      { label: "Nå", value: "Gründer og CTO, Reflecta gGmbH" },
      { label: "Nå", value: "Daglig leder, zauberware" },
      { label: "Fokus", value: "Anvendt KI, LLM-er, LangChain/LangGraph" },
      { label: "Fokus", value: "Plattformsutvikling, web og mobil" },
      { label: "Undervisning", value: "Workshops og foredrag om KI i praksis" },
      { label: "Språk", value: "Tysk, engelsk, spansk" },
    ],
    recognitionLabel: "Anerkjennelse",
    recognition: [
      "Civic Innovation Award 2021 fra det tyske forbundsdepartementet for arbeid og sosiale saker — «Gemeinsam wird es KI» (reflecta.network).",
      "Future City Incubator-stipend 2021 — KI-anvendelser i offentlig interesse.",
      "Anthropia gGmbH-stipend 2020 — støtte til sosiale initiativer.",
    ],
    contactLabel: "Kontakt",
    moreLabel: "Mer på zauberware.com",
  },
};

const RICH_ABOUT: Record<Locale, RichAbout> = { en, de, es, fr, it, pt, sv, no };

const ZAUBERWARE_URL = "https://www.zauberware.com";
const GITHUB_URL = "https://github.com/simonfranzen";
const LINKEDIN_URL = "https://www.linkedin.com/in/simonfranzen/";

export default function AboutPage() {
  const { locale, u } = useI18n();
  const about = RICH_ABOUT[locale];
  const aboutUi = ABOUT_UI[locale];

  return (
    <main className="relative isolate min-h-screen px-6 pb-32 pt-24">
      <div className="grid-bg pointer-events-none fixed inset-0 -z-10 opacity-30" />
      <div className="pointer-events-none fixed inset-0 -z-10 bg-gradient-to-b from-signal-violet/10 via-transparent to-ink-950" />

      {/* Hero */}
      <section className="mx-auto mb-24 max-w-4xl space-y-6 text-center">
        <Reveal>
          <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
            {about.hero.pretitle}
          </div>
        </Reveal>
        <Reveal delay={120}>
          <h1 className="math-italic text-5xl leading-[0.95] tracking-tight md:text-7xl">
            {about.hero.title}
          </h1>
        </Reveal>
        <Reveal delay={240}>
          <p className="math-italic text-xl leading-snug text-ink-200 md:text-2xl">
            {about.hero.tagline}
          </p>
        </Reveal>
        <Reveal delay={360}>
          <p className="mx-auto max-w-2xl leading-relaxed text-ink-200">{about.hero.intro}</p>
        </Reveal>
      </section>

      {/* 1. Motivation — violet */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-4xl space-y-6 rounded-2xl border border-signal-violet/40 p-8 md:p-10">
          <header className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-violet">
              {about.motivation.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">
              {about.motivation.title}
            </h2>
          </header>
          <div className="space-y-4 leading-relaxed text-ink-100">
            {about.motivation.paragraphs.map((p, i) => (
              <p key={i}>{p}</p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* 2. Studio — cyan */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-4xl space-y-5 rounded-2xl border border-signal-cyan/40 p-8 md:p-10">
          <header className="space-y-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {about.studio.pretitle}
            </div>
            <h2 className="math-italic text-3xl leading-tight md:text-4xl">{about.studio.title}</h2>
          </header>
          <p className="leading-relaxed text-ink-100">{about.studio.body}</p>
          <a
            href={ZAUBERWARE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-widest2 text-signal-cyan transition-colors hover:text-ink-100"
          >
            ↗ {about.studio.linkLabel}
          </a>
        </section>
      </Reveal>

      {/* 3. Author — amber */}
      <Reveal>
        <section className="glass hairline mx-auto mb-16 max-w-4xl space-y-6 rounded-2xl border border-signal-amber/40 p-8 md:p-10">
          <header className="flex flex-col items-start gap-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-2">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {about.author.pretitle}
              </div>
              <h2 className="math-italic text-3xl leading-tight md:text-4xl">
                {about.author.title}
              </h2>
            </div>
            {/* Editorial portrait: circular crop via rounded-full + object-cover.
                Plain <img> matches the rest of the codebase (no next/image config). */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/about/simon-franzen.jpg"
              alt={aboutUi.photoAlt}
              width={144}
              height={144}
              className="h-32 w-32 flex-shrink-0 rounded-full object-cover ring-1 ring-ink-700/50 md:h-36 md:w-36"
              loading="lazy"
              decoding="async"
            />
          </header>
          <p className="leading-relaxed text-ink-100">{about.author.intro}</p>

          <div className="grid grid-cols-1 gap-8 pt-2 md:grid-cols-2">
            <div className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {about.author.rolesLabel}
              </div>
              <dl className="space-y-2">
                {about.author.roles.map((row, i) => (
                  <div key={i} className="flex flex-col gap-0.5">
                    <dt className="font-mono text-[10px] uppercase tracking-widest2 text-ink-400">
                      {row.label}
                    </dt>
                    <dd className="text-sm leading-relaxed text-ink-100">{row.value}</dd>
                  </div>
                ))}
              </dl>
            </div>
            <div className="space-y-3">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {about.author.recognitionLabel}
              </div>
              <ul className="space-y-2 text-sm leading-relaxed text-ink-100">
                {about.author.recognition.map((r, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-signal-amber/60" aria-hidden="true">
                      ·
                    </span>
                    <span>{r}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div className="hairline mt-4 flex flex-col gap-3 rounded-xl border border-signal-amber/30 bg-signal-amber/5 p-6 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-amber">
                {about.author.contactLabel}
              </div>
              <EmailReveal showLabel={aboutUi.showEmail} />
            </div>
            <div className="flex flex-wrap gap-2">
              <a
                href={ZAUBERWARE_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-amber/50 hover:text-signal-amber"
              >
                ↗ {about.author.moreLabel}
              </a>
              <a
                href={GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-violet/50 hover:text-signal-violet"
              >
                ↗ {aboutUi.githubLabel}
              </a>
              <a
                href={LINKEDIN_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="hairline rounded-full border px-3 py-2 font-mono text-[11px] uppercase tracking-widest2 text-ink-200 transition-colors hover:border-signal-cyan/50 hover:text-signal-cyan"
              >
                ↗ {aboutUi.linkedinLabel}
              </a>
            </div>
          </div>
        </section>
      </Reveal>

      {/* Back to atlas */}
      <Reveal>
        <div className="mx-auto mt-12 max-w-4xl text-center">
          <Link
            href="/"
            className="hairline inline-block rounded-full border px-6 py-3 font-mono text-xs uppercase tracking-widest2 text-ink-200 transition-colors hover:border-ink-300/50 hover:text-ink-100"
          >
            {u.back}
          </Link>
        </div>
      </Reveal>
    </main>
  );
}
