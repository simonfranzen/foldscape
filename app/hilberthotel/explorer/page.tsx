"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { palette } from "@/lib/visual/palette";
import { useI18n } from "@/lib/i18n/context";
import type { Locale } from "@/lib/i18n/types";

type Scenario = "one" | "k" | "infinite" | "buses";

interface Guest {
  id: string;
  // Origin description: "g" for original guest, "n" for single new, "bus k pass m" etc.
  origin: "existing" | "new" | "bus";
  bus?: number; // 1..N (for bus origin); also reused as prime index in display
  index: number; // existing guest's room or bus passenger index
  room: number; // 1-based current room (0 = not yet checked in / lobby)
  color: string;
}

const VISIBLE_ROOMS = 64; // rooms 1..VISIBLE_ROOMS rendered as a grid
const ROOMS_PER_ROW = 8;
const OFF_SCREEN_ROOMS = 6; // "…" tail

// First 8 odd primes used as bus bases (k-th odd prime for bus k).
const BUS_PRIMES = [3, 5, 7, 11, 13, 17, 19, 23];

// One hue per bus. Deliberately excludes cyan (= NEW_GUEST_COLOR) so bus 1
// can never be mistaken for a new guest, and starts on rose to match bus 1 in
// the story-page widget (HilbertHotelInline). The first four show in the
// legend; the rest only ever appear as the higher buses' dots.
const BUS_COLORS = [
  palette.signal.rose,   // rose       — bus 1
  "#b794f4",             // violet     — bus 2
  "#86efac",             // green      — bus 3
  palette.signal.amber,  // amber      — bus 4
  "#fca5a5",             // light rose — bus 5
  "#fcd34d",             // yellow     — bus 6
  "#a5b4fc",             // indigo     — bus 7
  "#fb923c",             // orange     — bus 8
];

const EXISTING_COLOR = "#cdd6f4"; // soft white for original guests
const NEW_GUEST_COLOR = palette.signal.cyan; // cyan — same accent as the page

function uid(): string {
  return Math.random().toString(36).slice(2, 9);
}

// Build the initial list of existing guests filling rooms 1..VISIBLE_ROOMS.
function makeExistingGuests(): Guest[] {
  const out: Guest[] = [];
  for (let n = 1; n <= VISIBLE_ROOMS; n++) {
    out.push({
      id: `g-${n}`,
      origin: "existing",
      index: n,
      room: n,
      color: EXISTING_COLOR,
    });
  }
  return out;
}

// The explorer UI is string-heavy, so it carries its own local 8-locale bundle
// (same pattern as app/mobius/explorer and app/eulerchar/explorer). The maths
// formulas (n → 2n, pₖᵐ, 2ⁿ …) stay literal and are not translated.
type ExplorerDict = {
  header: string; // "{n}" placeholder = VISIBLE_ROOMS
  scenarioLabels: Record<Scenario, string>;
  scenarioDescs: Record<Scenario, string>;
  scenarioTitle: string;
  controlsTitle: string;
  speedTitle: string;
  legendTitle: string;
  kTitle: string;
  btnStep: string;
  btnPlay: string;
  btnPause: string;
  btnReset: string;
  stepsUnit: string;
  lobby: string;
  moreWord: string;
  allCheckedIn: string;
  guestOne: string;
  guestMany: string;
  roomsBeyond: string;
  stepWord: string;
  legExisting: string;
  legNew: string;
  newGuestShort: string;
  busWord: string;
  primeWord: string;
  roomsWord: string;
  roomWord: string;
  passengerWord: string;
  wasInWord: string;
  ariaK: string;
  ariaSpeed: string;
  storyLink: string;
};

const RICH_EXPLORER: Record<Locale, ExplorerDict> = {
  en: {
    header: "Hilbert Hotel · rooms 1…{n} (continues ad infinitum)",
    scenarioLabels: {
      one: "1 new guest",
      k: "k new guests",
      infinite: "ℵ₀ new guests",
      buses: "ℵ₀ buses × ℵ₀ guests",
    },
    scenarioDescs: {
      one: "shift n → n + 1, room 1 opens",
      k: "shift n → n + k, rooms 1…k open",
      infinite: "n → 2n, every odd room opens",
      buses: "guest n → 2ⁿ, bus k passenger m → pₖᵐ",
    },
    scenarioTitle: "Scenario",
    controlsTitle: "Controls",
    speedTitle: "Speed",
    legendTitle: "Legend",
    kTitle: "k · new guests",
    btnStep: "Step",
    btnPlay: "Play",
    btnPause: "Pause",
    btnReset: "Reset",
    stepsUnit: "steps/s",
    lobby: "Lobby queue",
    moreWord: "more",
    allCheckedIn: "all checked in",
    guestOne: "guest",
    guestMany: "guests",
    roomsBeyond: "in rooms beyond #",
    stepWord: "Step",
    legExisting: "Existing guest",
    legNew: "New guest (one / k / ℵ₀)",
    newGuestShort: "New guest",
    busWord: "Bus",
    primeWord: "prime",
    roomsWord: "rooms",
    roomWord: "room",
    passengerWord: "passenger",
    wasInWord: "was in",
    ariaK: "k, number of new guests",
    ariaSpeed: "playback speed, steps per second",
    storyLink: "← Story",
  },
  de: {
    header: "Hilberts Hotel · Zimmer 1…{n} (setzt sich unendlich fort)",
    scenarioLabels: {
      one: "1 neuer Gast",
      k: "k neue Gäste",
      infinite: "ℵ₀ neue Gäste",
      buses: "ℵ₀ Busse × ℵ₀ Gäste",
    },
    scenarioDescs: {
      one: "Verschiebung n → n + 1, Zimmer 1 wird frei",
      k: "Verschiebung n → n + k, Zimmer 1…k werden frei",
      infinite: "n → 2n, jedes ungerade Zimmer wird frei",
      buses: "Gast n → 2ⁿ, Bus k Gast m → pₖᵐ",
    },
    scenarioTitle: "Szenario",
    controlsTitle: "Steuerung",
    speedTitle: "Tempo",
    legendTitle: "Legende",
    kTitle: "k · neue Gäste",
    btnStep: "Schritt",
    btnPlay: "Start",
    btnPause: "Pause",
    btnReset: "Zurück",
    stepsUnit: "Schritte/s",
    lobby: "Lobby-Warteschlange",
    moreWord: "weitere",
    allCheckedIn: "alle eingecheckt",
    guestOne: "Gast",
    guestMany: "Gäste",
    roomsBeyond: "in Zimmern jenseits von #",
    stepWord: "Schritt",
    legExisting: "Bisheriger Gast",
    legNew: "Neuer Gast (eins / k / ℵ₀)",
    newGuestShort: "Neuer Gast",
    busWord: "Bus",
    primeWord: "Primzahl",
    roomsWord: "Zimmer",
    roomWord: "Zimmer",
    passengerWord: "Gast",
    wasInWord: "war in",
    ariaK: "k, Anzahl neuer Gäste",
    ariaSpeed: "Abspielgeschwindigkeit, Schritte pro Sekunde",
    storyLink: "← Story",
  },
  es: {
    header: "Hotel de Hilbert · habitaciones 1…{n} (continúa hasta el infinito)",
    scenarioLabels: {
      one: "1 huésped nuevo",
      k: "k huéspedes nuevos",
      infinite: "ℵ₀ huéspedes nuevos",
      buses: "ℵ₀ autocares × ℵ₀ huéspedes",
    },
    scenarioDescs: {
      one: "desplazamiento n → n + 1, se abre la habitación 1",
      k: "desplazamiento n → n + k, se abren 1…k",
      infinite: "n → 2n, se abre cada habitación impar",
      buses: "huésped n → 2ⁿ, autocar k pasajero m → pₖᵐ",
    },
    scenarioTitle: "Escenario",
    controlsTitle: "Controles",
    speedTitle: "Velocidad",
    legendTitle: "Leyenda",
    kTitle: "k · huéspedes nuevos",
    btnStep: "Paso",
    btnPlay: "Reproducir",
    btnPause: "Pausa",
    btnReset: "Reiniciar",
    stepsUnit: "pasos/s",
    lobby: "Cola del vestíbulo",
    moreWord: "más",
    allCheckedIn: "todos registrados",
    guestOne: "huésped",
    guestMany: "huéspedes",
    roomsBeyond: "en habitaciones más allá de #",
    stepWord: "Paso",
    legExisting: "Huésped existente",
    legNew: "Huésped nuevo (uno / k / ℵ₀)",
    newGuestShort: "Huésped nuevo",
    busWord: "Autocar",
    primeWord: "primo",
    roomsWord: "habitaciones",
    roomWord: "habitación",
    passengerWord: "pasajero",
    wasInWord: "estaba en",
    ariaK: "k, número de huéspedes nuevos",
    ariaSpeed: "velocidad de reproducción, pasos por segundo",
    storyLink: "← Historia",
  },
  fr: {
    header: "Hôtel de Hilbert · chambres 1…{n} (se poursuit à l'infini)",
    scenarioLabels: {
      one: "1 nouveau client",
      k: "k nouveaux clients",
      infinite: "ℵ₀ nouveaux clients",
      buses: "ℵ₀ cars × ℵ₀ clients",
    },
    scenarioDescs: {
      one: "décalage n → n + 1, la chambre 1 se libère",
      k: "décalage n → n + k, les chambres 1…k se libèrent",
      infinite: "n → 2n, chaque chambre impaire se libère",
      buses: "client n → 2ⁿ, car k passager m → pₖᵐ",
    },
    scenarioTitle: "Scénario",
    controlsTitle: "Commandes",
    speedTitle: "Vitesse",
    legendTitle: "Légende",
    kTitle: "k · nouveaux clients",
    btnStep: "Pas",
    btnPlay: "Lecture",
    btnPause: "Pause",
    btnReset: "Réinit.",
    stepsUnit: "pas/s",
    lobby: "File du hall",
    moreWord: "de plus",
    allCheckedIn: "tous enregistrés",
    guestOne: "client",
    guestMany: "clients",
    roomsBeyond: "dans les chambres au-delà de #",
    stepWord: "Pas",
    legExisting: "Client existant",
    legNew: "Nouveau client (un / k / ℵ₀)",
    newGuestShort: "Nouveau client",
    busWord: "Car",
    primeWord: "premier",
    roomsWord: "chambres",
    roomWord: "chambre",
    passengerWord: "passager",
    wasInWord: "était en",
    ariaK: "k, nombre de nouveaux clients",
    ariaSpeed: "vitesse de lecture, pas par seconde",
    storyLink: "← Récit",
  },
  it: {
    header: "Hotel di Hilbert · stanze 1…{n} (prosegue all'infinito)",
    scenarioLabels: {
      one: "1 ospite nuovo",
      k: "k ospiti nuovi",
      infinite: "ℵ₀ ospiti nuovi",
      buses: "ℵ₀ pullman × ℵ₀ ospiti",
    },
    scenarioDescs: {
      one: "spostamento n → n + 1, si libera la stanza 1",
      k: "spostamento n → n + k, si liberano 1…k",
      infinite: "n → 2n, si libera ogni stanza dispari",
      buses: "ospite n → 2ⁿ, pullman k passeggero m → pₖᵐ",
    },
    scenarioTitle: "Scenario",
    controlsTitle: "Controlli",
    speedTitle: "Velocità",
    legendTitle: "Legenda",
    kTitle: "k · ospiti nuovi",
    btnStep: "Passo",
    btnPlay: "Play",
    btnPause: "Pausa",
    btnReset: "Azzera",
    stepsUnit: "passi/s",
    lobby: "Coda nella hall",
    moreWord: "altri",
    allCheckedIn: "tutti registrati",
    guestOne: "ospite",
    guestMany: "ospiti",
    roomsBeyond: "in stanze oltre la #",
    stepWord: "Passo",
    legExisting: "Ospite esistente",
    legNew: "Ospite nuovo (uno / k / ℵ₀)",
    newGuestShort: "Ospite nuovo",
    busWord: "Pullman",
    primeWord: "primo",
    roomsWord: "stanze",
    roomWord: "stanza",
    passengerWord: "passeggero",
    wasInWord: "era in",
    ariaK: "k, numero di ospiti nuovi",
    ariaSpeed: "velocità di riproduzione, passi al secondo",
    storyLink: "← Racconto",
  },
  pt: {
    header: "Hotel de Hilbert · quartos 1…{n} (continua até ao infinito)",
    scenarioLabels: {
      one: "1 hóspede novo",
      k: "k hóspedes novos",
      infinite: "ℵ₀ hóspedes novos",
      buses: "ℵ₀ autocarros × ℵ₀ hóspedes",
    },
    scenarioDescs: {
      one: "deslocamento n → n + 1, abre o quarto 1",
      k: "deslocamento n → n + k, abrem 1…k",
      infinite: "n → 2n, abre cada quarto ímpar",
      buses: "hóspede n → 2ⁿ, autocarro k passageiro m → pₖᵐ",
    },
    scenarioTitle: "Cenário",
    controlsTitle: "Controlos",
    speedTitle: "Velocidade",
    legendTitle: "Legenda",
    kTitle: "k · hóspedes novos",
    btnStep: "Passo",
    btnPlay: "Reproduzir",
    btnPause: "Pausa",
    btnReset: "Reiniciar",
    stepsUnit: "passos/s",
    lobby: "Fila do átrio",
    moreWord: "mais",
    allCheckedIn: "todos com check-in",
    guestOne: "hóspede",
    guestMany: "hóspedes",
    roomsBeyond: "em quartos para além do #",
    stepWord: "Passo",
    legExisting: "Hóspede existente",
    legNew: "Hóspede novo (um / k / ℵ₀)",
    newGuestShort: "Hóspede novo",
    busWord: "Autocarro",
    primeWord: "primo",
    roomsWord: "quartos",
    roomWord: "quarto",
    passengerWord: "passageiro",
    wasInWord: "estava em",
    ariaK: "k, número de hóspedes novos",
    ariaSpeed: "velocidade de reprodução, passos por segundo",
    storyLink: "← História",
  },
  sv: {
    header: "Hilberts hotell · rum 1…{n} (fortsätter i oändlighet)",
    scenarioLabels: {
      one: "1 ny gäst",
      k: "k nya gäster",
      infinite: "ℵ₀ nya gäster",
      buses: "ℵ₀ bussar × ℵ₀ gäster",
    },
    scenarioDescs: {
      one: "förskjutning n → n + 1, rum 1 blir ledigt",
      k: "förskjutning n → n + k, rum 1…k blir lediga",
      infinite: "n → 2n, varje udda rum blir ledigt",
      buses: "gäst n → 2ⁿ, buss k passagerare m → pₖᵐ",
    },
    scenarioTitle: "Scenario",
    controlsTitle: "Kontroller",
    speedTitle: "Hastighet",
    legendTitle: "Teckenförklaring",
    kTitle: "k · nya gäster",
    btnStep: "Steg",
    btnPlay: "Spela",
    btnPause: "Paus",
    btnReset: "Återställ",
    stepsUnit: "steg/s",
    lobby: "Lobbykö",
    moreWord: "till",
    allCheckedIn: "alla incheckade",
    guestOne: "gäst",
    guestMany: "gäster",
    roomsBeyond: "i rum bortom #",
    stepWord: "Steg",
    legExisting: "Befintlig gäst",
    legNew: "Ny gäst (en / k / ℵ₀)",
    newGuestShort: "Ny gäst",
    busWord: "Buss",
    primeWord: "primtal",
    roomsWord: "rum",
    roomWord: "rum",
    passengerWord: "passagerare",
    wasInWord: "var i",
    ariaK: "k, antal nya gäster",
    ariaSpeed: "uppspelningshastighet, steg per sekund",
    storyLink: "← Berättelse",
  },
  no: {
    header: "Hilberts hotell · rom 1…{n} (fortsetter i det uendelige)",
    scenarioLabels: {
      one: "1 ny gjest",
      k: "k nye gjester",
      infinite: "ℵ₀ nye gjester",
      buses: "ℵ₀ busser × ℵ₀ gjester",
    },
    scenarioDescs: {
      one: "forskyvning n → n + 1, rom 1 blir ledig",
      k: "forskyvning n → n + k, rom 1…k blir ledige",
      infinite: "n → 2n, hvert oddetallsrom blir ledig",
      buses: "gjest n → 2ⁿ, buss k passasjer m → pₖᵐ",
    },
    scenarioTitle: "Scenario",
    controlsTitle: "Kontroller",
    speedTitle: "Hastighet",
    legendTitle: "Tegnforklaring",
    kTitle: "k · nye gjester",
    btnStep: "Steg",
    btnPlay: "Spill",
    btnPause: "Pause",
    btnReset: "Nullstill",
    stepsUnit: "steg/s",
    lobby: "Lobbykø",
    moreWord: "til",
    allCheckedIn: "alle innsjekket",
    guestOne: "gjest",
    guestMany: "gjester",
    roomsBeyond: "i rom bortenfor #",
    stepWord: "Steg",
    legExisting: "Eksisterende gjest",
    legNew: "Ny gjest (én / k / ℵ₀)",
    newGuestShort: "Ny gjest",
    busWord: "Buss",
    primeWord: "primtall",
    roomsWord: "rom",
    roomWord: "rom",
    passengerWord: "passasjer",
    wasInWord: "var i",
    ariaK: "k, antall nye gjester",
    ariaSpeed: "avspillingshastighet, steg per sekund",
    storyLink: "← Fortelling",
  },
};

export default function HilbertHotelExplorer() {
  const { a, u, locale } = useI18n();
  const topic = a.topics.hilberthotel;
  const x = RICH_EXPLORER[locale];

  const [scenario, setScenario] = useState<Scenario>("one");
  const [k, setK] = useState(3);
  const [step, setStep] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [speed, setSpeed] = useState(6); // steps per second
  const [guests, setGuests] = useState<Guest[]>(() => makeExistingGuests());
  const [queue, setQueue] = useState<Guest[]>([]); // guests not yet placed
  const [highlightRooms, setHighlightRooms] = useState<Record<number, string>>({});

  // Reset whenever scenario or k changes
  useEffect(() => {
    resetScenario(scenario, k);
  }, [scenario, k]);

  function resetScenario(sc: Scenario, kk: number) {
    setPlaying(false);
    setStep(0);
    setHighlightRooms({});
    const existing = makeExistingGuests();
    setGuests(existing);

    if (sc === "one") {
      setQueue([
        {
          id: `new-${uid()}`,
          origin: "new",
          index: 1,
          room: 0,
          color: NEW_GUEST_COLOR,
        },
      ]);
    } else if (sc === "k") {
      const q: Guest[] = [];
      for (let i = 1; i <= kk; i++) {
        q.push({
          id: `new-${i}-${uid()}`,
          origin: "new",
          index: i,
          room: 0,
          color: NEW_GUEST_COLOR,
        });
      }
      setQueue(q);
    } else if (sc === "infinite") {
      // Queue the new guests that will occupy odd rooms 1..VISIBLE_ROOMS.
      const q: Guest[] = [];
      const oddCount = Math.ceil(VISIBLE_ROOMS / 2);
      for (let i = 1; i <= oddCount; i++) {
        q.push({
          id: `new-${i}-${uid()}`,
          origin: "new",
          index: i,
          room: 0,
          color: NEW_GUEST_COLOR,
        });
      }
      setQueue(q);
    } else if (sc === "buses") {
      // Bus passengers: one row per bus, several passengers each.
      const q: Guest[] = [];
      for (let b = 0; b < BUS_PRIMES.length; b++) {
        const prime = BUS_PRIMES[b];
        let m = 1;
        // Add as many passengers as fit into VISIBLE_ROOMS via prime^m.
        while (Math.pow(prime, m) <= VISIBLE_ROOMS) {
          q.push({
            id: `bus-${b + 1}-${m}-${uid()}`,
            origin: "bus",
            bus: b + 1,
            index: m,
            room: 0,
            color: BUS_COLORS[b % BUS_COLORS.length],
          });
          m++;
        }
      }
      setQueue(q);
    }
  }

  // Compute total steps in current scenario
  const totalSteps = useMemo(() => {
    if (scenario === "one") return VISIBLE_ROOMS + 1; // shift then place 1
    if (scenario === "k") return VISIBLE_ROOMS + k; // shift then place k
    if (scenario === "infinite") return VISIBLE_ROOMS + Math.ceil(VISIBLE_ROOMS / 2);
    if (scenario === "buses") {
      // existing relocation steps + total queued bus passengers
      const passengers = BUS_PRIMES.reduce((acc, p) => {
        let m = 1;
        let c = 0;
        while (Math.pow(p, m) <= VISIBLE_ROOMS) {
          m++;
          c++;
        }
        return acc + c;
      }, 0);
      return VISIBLE_ROOMS + passengers;
    }
    return 0;
  }, [scenario, k]);

  // Advance one step. Each setter is called once at the top level — no
  // setState calls nested inside another setState's updater — so React 18
  // strict-mode dev double-invocations don't append the same guest twice.
  function advance() {
    if (step >= totalSteps) return;
    const s = step + 1;
    applyStep(s);
    setStep(s);
  }

  function applyStep(s: number) {
    if (scenario === "one") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: fromRoom + 1 } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [fromRoom + 1]: "shift" });
      } else {
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: 1 }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ 1: "new" });
      }
    } else if (scenario === "k") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: fromRoom + k } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [fromRoom + k]: "shift" });
      } else {
        const placeIdx = s - VISIBLE_ROOMS; // 1..k
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: placeIdx }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [placeIdx]: "new" });
      }
    } else if (scenario === "infinite") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        const toRoom = 2 * fromRoom;
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: toRoom } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [toRoom]: "shift" });
      } else {
        const placeIdx = s - VISIBLE_ROOMS; // 1..oddCount
        const targetRoom = 2 * placeIdx - 1;
        const first = queue[0];
        if (!first) return;
        setGuests((gs) => [...gs, { ...first, room: targetRoom }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [targetRoom]: "new" });
      }
    } else if (scenario === "buses") {
      if (s <= VISIBLE_ROOMS) {
        const fromRoom = VISIBLE_ROOMS - s + 1;
        const toRoom = Math.pow(2, fromRoom);
        setGuests((gs) =>
          gs.map((g) =>
            g.origin === "existing" && g.room === fromRoom ? { ...g, room: toRoom } : g,
          ),
        );
        setHighlightRooms({ [fromRoom]: "shift", [toRoom]: "shift" });
      } else {
        const first = queue[0];
        if (!first || first.origin !== "bus" || first.bus === undefined) return;
        const prime = BUS_PRIMES[first.bus - 1];
        const target = Math.pow(prime, first.index);
        setGuests((gs) => [...gs, { ...first, room: target }]);
        setQueue((q) => q.slice(1));
        setHighlightRooms({ [target]: "bus" });
      }
    }
  }

  // Play loop
  useEffect(() => {
    if (!playing) return;
    if (step >= totalSteps) {
      setPlaying(false);
      return;
    }
    const interval = setInterval(
      () => {
        advance();
      },
      1000 / Math.max(1, speed),
    );
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playing, speed, step, totalSteps]);

  // Build a map from room number → guests currently in that room
  const roomToGuests = useMemo(() => {
    const map: Record<number, Guest[]> = {};
    for (const g of guests) {
      if (g.room <= 0) continue;
      if (!map[g.room]) map[g.room] = [];
      map[g.room].push(g);
    }
    return map;
  }, [guests]);

  // How many guests are off-screen (room > VISIBLE_ROOMS)?
  const offScreenGuests = useMemo(
    () => guests.filter((g) => g.room > VISIBLE_ROOMS).length,
    [guests],
  );

  const scenarioLabels = x.scenarioLabels;

  const scenarioFormula: Record<Scenario, string> = {
    one: "n → n + 1",
    k: `n → n + ${k}`,
    infinite: "n → 2n  ·  odd rooms ← new",
    buses: "guest n → 2ⁿ  ·  bus k passenger m → pₖᵐ",
  };

  return (
    <main className="flex min-h-screen flex-col pt-14">
      <div className="grid flex-1 grid-cols-1 gap-0 lg:grid-cols-[1fr_420px]">
        {/* Main view */}
        <div className="relative flex min-h-[60vh] flex-col gap-4 bg-ink-950 p-4 lg:min-h-[calc(100vh-3.5rem)] lg:p-6">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-200">
              {x.header.replace("{n}", String(VISIBLE_ROOMS))}
            </div>
            <div className="glass hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {scenarioFormula[scenario]}
            </div>
          </div>

          {/* The room grid */}
          <div className="hairline flex-1 overflow-auto rounded-2xl border bg-ink-950 p-4">
            <div
              className="grid gap-1.5"
              style={{ gridTemplateColumns: `repeat(${ROOMS_PER_ROW}, minmax(0, 1fr))` }}
            >
              {Array.from({ length: VISIBLE_ROOMS }, (_, i) => i + 1).map((roomNum) => {
                const occupants = roomToGuests[roomNum] ?? [];
                const highlight = highlightRooms[roomNum];
                const borderClass =
                  highlight === "new"
                    ? "border-signal-cyan/80 bg-signal-cyan/10"
                    : highlight === "shift"
                      ? "border-signal-amber/60 bg-signal-amber/5"
                      : highlight === "bus"
                        ? "border-signal-rose/60 bg-signal-rose/5"
                        : occupants.length > 0
                          ? "hairline bg-ink-900/40"
                          : "border-ink-700/30 bg-ink-950";
                return (
                  <div
                    key={roomNum}
                    className={`relative rounded-md border ${borderClass} flex aspect-square flex-col items-center justify-between p-1.5 transition-colors`}
                  >
                    <div className="font-mono text-[9px] text-ink-400">{roomNum}</div>
                    <div className="flex flex-1 flex-wrap items-center justify-center gap-0.5">
                      {occupants.slice(0, 4).map((g) => (
                        <div
                          key={g.id}
                          className="rounded-full"
                          style={{
                            backgroundColor: g.color,
                            width: occupants.length > 1 ? 6 : 10,
                            height: occupants.length > 1 ? 6 : 10,
                            boxShadow: `0 0 6px ${g.color}80`,
                          }}
                          title={
                            g.origin === "existing"
                              ? `${x.legExisting} (${x.wasInWord} ${g.index})`
                              : g.origin === "bus"
                                ? `${x.busWord} ${g.bus} · ${x.passengerWord} ${g.index}`
                                : `${x.newGuestShort} #${g.index}`
                          }
                        />
                      ))}
                      {occupants.length > 4 && (
                        <span className="font-mono text-[8px] text-ink-300">
                          +{occupants.length - 4}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
              {/* Off-screen indicator cells */}
              {Array.from({ length: OFF_SCREEN_ROOMS }, (_, i) => i).map((i) => (
                <div
                  key={`off-${i}`}
                  className="flex aspect-square items-center justify-center rounded-md border border-dashed border-ink-700/40 font-mono text-xs text-ink-500"
                >
                  …
                </div>
              ))}
            </div>
          </div>

          {/* Lobby / queue strip */}
          <div className="glass hairline flex flex-wrap items-center gap-3 rounded-md border px-3 py-2">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.lobby} ({queue.length})
            </div>
            <div className="flex flex-1 flex-wrap items-center gap-1">
              {queue.slice(0, 40).map((g) => (
                <div
                  key={g.id}
                  className="rounded-full"
                  style={{
                    backgroundColor: g.color,
                    width: 8,
                    height: 8,
                    boxShadow: `0 0 4px ${g.color}80`,
                  }}
                  title={
                    g.origin === "bus"
                      ? `${x.busWord} ${g.bus} · ${x.passengerWord} ${g.index} → ${x.roomWord} ${
                          g.bus ? Math.pow(BUS_PRIMES[g.bus - 1], g.index) : "?"
                        }`
                      : `${x.newGuestShort} #${g.index}`
                  }
                />
              ))}
              {queue.length > 40 && (
                <span className="font-mono text-[10px] text-ink-400">
                  +{queue.length - 40} {x.moreWord} · ℵ₀
                </span>
              )}
              {queue.length === 0 && (
                <span className="font-mono text-[10px] text-ink-500">{x.allCheckedIn}</span>
              )}
            </div>
            {offScreenGuests > 0 && (
              <div className="font-mono text-[10px] text-ink-400">
                {offScreenGuests} {offScreenGuests === 1 ? x.guestOne : x.guestMany}{" "}
                {x.roomsBeyond}
                {VISIBLE_ROOMS}
              </div>
            )}
          </div>

          {/* Step progress */}
          <div className="glass hairline flex items-center justify-between gap-3 rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
            <span>
              {x.stepWord} {step} / {totalSteps}
            </span>
            <div className="mx-3 h-1 flex-1 overflow-hidden rounded bg-ink-800">
              <div
                className="h-full bg-signal-cyan"
                style={{ width: `${totalSteps > 0 ? (step / totalSteps) * 100 : 0}%` }}
              />
            </div>
            <span className="text-signal-cyan">{scenarioLabels[scenario]}</span>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="hairline scrollbar-thin flex flex-col overflow-y-auto border-l bg-ink-900/40">
          <div className="hairline space-y-3 border-b p-6">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-signal-cyan">
              {topic.title}
            </div>
            <h1 className="math-italic text-3xl leading-tight text-ink-100">{topic.tagline}</h1>
            <p className="text-sm leading-relaxed text-ink-200">{topic.body}</p>
          </div>

          {/* Scenario picker */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.scenarioTitle}
            </div>
            <div className="grid grid-cols-1 gap-2">
              {(["one", "k", "infinite", "buses"] as const).map((id) => (
                <button
                  key={id}
                  onClick={() => setScenario(id)}
                  className={`rounded-md border px-3 py-2 text-left transition-colors ${
                    scenario === id
                      ? "border-signal-cyan/60 bg-signal-cyan/10 text-signal-cyan"
                      : "hairline text-ink-200 hover:border-signal-cyan/40 hover:text-ink-100"
                  }`}
                >
                  <div className="font-mono text-xs">{x.scenarioLabels[id]}</div>
                  <div className="mt-0.5 font-mono text-[10px] text-ink-400">
                    {x.scenarioDescs[id]}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* k slider — only visible for k scenario */}
          {scenario === "k" && (
            <div className="hairline space-y-3 border-b p-5">
              <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
                {x.kTitle}
              </div>
              <div className="flex items-center justify-between font-mono text-sm">
                <span className="text-signal-cyan">{k}</span>
              </div>
              <input
                type="range"
                aria-label={x.ariaK}
                value={k}
                min={1}
                max={10}
                step={1}
                onChange={(e) => setK(parseInt(e.target.value))}
                className="w-full accent-signal-cyan"
              />
            </div>
          )}

          {/* Controls */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.controlsTitle}
            </div>
            <div className="grid grid-cols-4 gap-2">
              <button
                onClick={() => {
                  setPlaying(false);
                  advance();
                }}
                disabled={step >= totalSteps}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40 disabled:hover:border-ink-700 disabled:hover:text-ink-200"
              >
                {x.btnStep}
              </button>
              <button
                onClick={() => setPlaying(true)}
                disabled={step >= totalSteps || playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40"
              >
                {x.btnPlay}
              </button>
              <button
                onClick={() => setPlaying(false)}
                disabled={!playing}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-cyan/50 hover:text-signal-cyan disabled:opacity-40"
              >
                {x.btnPause}
              </button>
              <button
                onClick={() => resetScenario(scenario, k)}
                className="hairline rounded-md border px-3 py-2 font-mono text-[10px] uppercase tracking-widest text-ink-200 hover:border-signal-rose/50 hover:text-signal-rose"
              >
                {x.btnReset}
              </button>
            </div>
          </div>

          {/* Speed */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.speedTitle}
            </div>
            <div className="flex items-center justify-between font-mono text-sm">
              <span className="text-signal-amber">
                {speed} {x.stepsUnit}
              </span>
            </div>
            <input
              type="range"
              aria-label={x.ariaSpeed}
              value={speed}
              min={1}
              max={40}
              step={1}
              onChange={(e) => setSpeed(parseInt(e.target.value))}
              className="w-full accent-signal-amber"
            />
          </div>

          {/* Legend */}
          <div className="hairline space-y-3 border-b p-5">
            <div className="font-mono text-[10px] uppercase tracking-widest2 text-ink-300">
              {x.legendTitle}
            </div>
            <div className="space-y-2 font-mono text-[10px] text-ink-200">
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full"
                  style={{ background: EXISTING_COLOR, width: 10, height: 10 }}
                />
                {x.legExisting}
              </div>
              <div className="flex items-center gap-2">
                <span
                  className="inline-block rounded-full"
                  style={{ background: NEW_GUEST_COLOR, width: 10, height: 10 }}
                />
                {x.legNew}
              </div>
              {scenario === "buses" &&
                BUS_PRIMES.slice(0, 4).map((p, i) => (
                  <div key={p} className="flex items-center gap-2">
                    <span
                      className="inline-block rounded-full"
                      style={{ background: BUS_COLORS[i], width: 10, height: 10 }}
                    />
                    {x.busWord} {i + 1} · {x.primeWord} {p} ({x.roomsWord} {p}, {p * p}, {p * p * p},
                    …)
                  </div>
                ))}
            </div>
          </div>

          <div className="p-5">
            <Link
              href="/hilberthotel"
              className="hairline mb-2 block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-cyan/40 hover:text-signal-cyan"
            >
              {x.storyLink}
            </Link>
            <Link
              href="/"
              className="hairline block w-full rounded-md border py-2 text-center font-mono text-[10px] uppercase tracking-widest2 text-ink-300 transition-colors hover:border-signal-violet/40 hover:text-signal-violet"
            >
              {u.back}
            </Link>
          </div>
        </aside>
      </div>
    </main>
  );
}
