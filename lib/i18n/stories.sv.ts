import type { StoriesDict } from "./stories";

export const sv: StoriesDict = {
  sectionLabels: {
    cathedral: "Katedral",
    atelier: "Atelier",
    resonance: "Resonans",
    story: "Berättelse",
    explorer: "Utforskare",
    sandbox: "Sandlåda",
    sound: "Ljud",
  },
  pages: {
    mandelbrot: {
      pretitle: "Tema II · Kaos",
      title: "Mandelbrotmängden",
      tagline: "Kvadrera och addera. För evigt.",
      intro:
        "Ett av matematikens mest fotograferade objekt är visualiseringen av en absurt enkel regel. Nedan: vad regeln är, vad vi egentligen tittar på, och en knapp rakt in i Utforskaren för när du vill flyga.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Regeln",
          title: "Välj ett komplext tal, iterera sedan",
          body: "Välj ett godtyckligt komplext tal c. Starta en följd vid z₀ = 0 och tillämpa zₙ₊₁ = zₙ² + c om och om igen. Det är hela regeln. Vi ställer sedan en enda ja/nej-fråga: förblir följden begränsad, eller försvinner den till slut mot oändligheten? Mängden av värden c för vilka följden förblir begränsad — det är Mandelbrotmängden. Allt annat, inklusive den berömda bilden, är bara ett färgrikt svar på den frågan.",
        },
        {
          pretitle: "Steg två · Att betrakta banan",
          title: "Tre punkter, tre öden",
          body: "Det hjälper att faktiskt se följden. För ett c djupt inne i mängden drar sig banan samman kring en liten ögla och lämnar den aldrig. För ett c precis utanför driver banan utåt och exploderar inom en handfull steg. För ett c precis på randen dansar banan för evigt, utan att någonsin stanna eller fly. De tre animerade panelerna nedan visar dessa tre regimer sida vid sida.",
        },
        {
          pretitle: "Steg tre · Varför bilden är oändlig",
          title: "Randen förenklas aldrig",
          body: "När du väl färgar varje c efter hur snabbt dess bana flyr, tänds randen upp. Det häpnadsväckande faktum, bevisat av Tan Lei och andra, är att randen är självlik i djup mening — varhelst du zoomar in finner du nya små kopior av hela formen, omgivna av filigran som aldrig upprepas. Det är därför Utforskaren går ända ner till 10¹⁰ zoom: det finns verkligen något nytt på varje skala.",
        },
        {
          pretitle: "Steg fyra · Fixpunkterna",
          title: "Var matematiken gömmer sig",
          body: "Inuti den stora kardioiden i mitten konvergerar iterationen till en enda fixpunkt. Inuti varje rund skiva som hänger på den konvergerar iterationen till en 2-cykel, sedan en 4-cykel, sedan 8 — samma periodfördubblingskaskad som hos den logistiska avbildningen. Mandelbrotmängden är, i en precis mening, en karta över var den logistiska berättelsen är lugn och var den kantrar till kaos. Två berömda kaotiska system, en bild.",
        },
      ],
    },
    life: {
      pretitle: "Tema III · Beräkning",
      title: "Conways Game of Life",
      tagline: "Fyra regler. Universum följer.",
      intro:
        "Martin Gardner presenterade Conways regler i sin spalt i Scientific American i oktober 1970. Två tidskriftssidor, fyra regelrader, och en gemenskap av matematiker har tillbringat femtio år med att upptäcka vad som redan låg i dem. Sandlådan låter dig rita och köra vilket mönster som helst — men först, de fyra reglerna i aktion.",
      ctaInteractive: "→ Öppna Sandlådan",
      sections: [
        {
          pretitle: "Steg ett · Reglerna",
          title: "Födelse, överlevnad, död — och inget annat",
          body: "Rutnätet är oändligt, varje cell är antingen levande eller död, och varje cell tittar på sina åtta grannar. Om en död cell omges av exakt tre levande grannar tänds den; om en levande cell redan har två eller tre runt sig går den hel vidare till nästa steg. Varje annat fall — för få grannar, för många grannar, inga grannar — dödar cellen. De fyra animerade demonstrationerna nedan visar varje regel utlösas på ett fem-gånger-fem-rutnät.",
        },
        {
          pretitle: "Steg två · Från regler till rörelse",
          title: "Glidaren vandrar",
          body: "Ett mönster av fem celler, Glidaren, är den minsta rörliga saken i Life. Se den ta sina steg. Efter fyra generationer har den återgått till sin ursprungliga form men förflyttats en cell diagonalt. Så fungerar rörelse i en värld utan begrepp om rörelse: en form som efter några tillämpningar av reglerna är lika med sig själv någon annanstans.",
        },
        {
          pretitle: "Steg tre · Från rörelse till beräkning",
          title: "Glidare bär information",
          body: "Om en glidare rör sig kan den siktas. Om den kan siktas kan den kollidera med andra glidare. Från kollisioner kan du bygga AND, OR, NOT — och från dessa varje boolesk krets. Människor har byggt Turingmaskiner, Game of Life-simulatorer och hela programmerbara datorer enbart av noggrant arrangerade glidare. Sandlådan har Gosper-glidarkanonen som förinställning: ett mönster som avfyrar en glidare var trettionde generation, för evigt.",
        },
        {
          pretitle: "Steg fyra · Vad detta säger oss",
          title: "Komplexitet behöver inga komplexa regler",
          body: "Det djupare påståendet är filosofiskt. Life visar att utarbetad struktur — rörelse, replikation, beräkning, till och med medvetande, om man tror på de starka versionerna — kan rymmas inom en regel liten nog att skrivas på ett vykort. Det är samma lärdom som NAND erbjuder för logiken och Regel 110 för cellulära automater. En liten primitiv, tillämpad med disciplin, räcker.",
        },
      ],
    },
    nand: {
      pretitle: "Tema · Logik",
      title: "Sheffer-strecket",
      tagline: "En grind räcker för all digital logik.",
      intro:
        "NAND-grinden är den enklaste datormaskinvara du kan hålla i huvudet. Byggaren låter dig växla mellan grindar och se deras NAND-skelett uppdateras i realtid.",
      ctaInteractive: "→ Öppna Byggaren",
      sections: [
        {
          pretitle: "Steg ett · Grinden",
          title: "Fyra rader, fastslagna 1913",
          body: "Henry Sheffers streck (a ↑ b) är negationen av AND. Den ger 1 om inte båda ingångarna är 1. Sheffers artikel från 1913 visade att denna enda operator — tillsammans med konstanter och variabler — kan uttrycka vilken sats som helst i klassisk boolesk logik. Charles Sanders Peirce hade tyst noterat samma faktum i ett opublicerat manuskript trettio år tidigare; båda kom fram till resultatet oberoende av varandra.",
        },
        {
          pretitle: "Steg två · Bygga allt annat",
          title: "Samma sten, många former",
          body: "Knepet är sammansättning. Skicka NAND:s utgång tillbaka in i en annan NAND, ibland koppla en kopia av en ingång till sig själv, och de fyra klassiska grindarna faller nästan omedelbart ut. NOT är en NAND. AND är två. OR är tre. XOR är fyra. Varje annat booleskt uttryck kan sedan sättas samman av dessa.",
        },
        {
          pretitle: "Steg tre · Varför chip bryr sig",
          title: "Ett hav av NAND-grindar i kisel",
          body: "CMOS-transistorer implementerar NAND med fyra transistorer — färre än AND eller OR. Eftersom varje booleskt uttryck reduceras till NAND-grindar syntetiserar chipdesigner ofta en hel krets enbart av dem: en rad identiska NAND-celler, kopplade till adderare, multiplexrar, minne, så småningom en CPU. Varje modern dator är, fysiskt, Sheffer-strecket itererat några miljarder gånger.",
        },
        {
          pretitle: "Steg fyra · Den andra sidan",
          title: "NAND vann chippet, NOR vann Månen",
          body: "NOR (¬(a ∨ b)) är den andra funktionellt fullständiga ensamgrinden. Apollo Guidance Computer som landade människor på Månen var helt byggd av NOR-grindar. NAND vann konsumentchipsracet; NOR vann Månen. Två sätt att bygga ett universum — välj en sida.",
        },
      ],
    },
    iota: {
      pretitle: "Tema · Beräkning",
      title: "Iota-kombinatorn",
      tagline: "En symbol, Turing-fullständig.",
      intro:
        "Iota är den enklaste kända basen med en enda kombinator: en enda omskrivningsregel ur vilken varje beräkningsbar funktion följer. Reduceraren läser vilket SKI- eller Iota-uttryck som helst och skriver om det, steg för steg, till dess normalform.",
      ctaInteractive: "→ Öppna Reduceraren",
      sections: [
        {
          pretitle: "Steg ett · Kombinatorisk logik",
          title: "Två bokstäver som beräknar allt",
          body: "På 1920-talet visade Moses Schönfinkel och Haskell Curry att all beräkning kunde byggas från två små regler. Kalla dem S och K. De tar andra saker som indata och arrangerar om dem — inga variabler krävs. Tillsammans bildar de SKI-kombinatorkalkylen, som bevisligen är lika kraftfull som varje lambdakalkyl, varje programmeringsspråk, varje Turingmaskin.",
        },
        {
          pretitle: "Steg två · En symbol",
          title: "Chris Barkers Iota",
          body: "År 2001 fann Chris Barker en enda kombinator som innehåller både S och K. Han kallade den Iota (ι, ℩) och definierade den som ι x = x S K. Från den enda raden kan både S och K härledas på nytt. Tillämpa Iota på Iota i ett specifikt mönster och S faller ut. Ett annat mönster ger K. Med inget annat än symbolen ι och parenteser kan vilken beräkningsbar funktion som helst uttryckas.",
        },
        {
          pretitle: "Steg tre · Bevisets form",
          title: "Universalitet i en enda symbol",
          body: "Argumentet är kort. Iotas definition ger x S K när den tillämpas på x. Välj x smart — Iota igen, tillämpad på Iota, tillämpad på Iota — och uppvecklingen skalar av lager efter lager tills bara K återstår. Välj ett annat mönster och bara S återstår. Eftersom S och K tillsammans är Turing-fullständiga (Schönfinkel, 1924) och Iota producerar båda, måste Iota ensam också vara det.",
        },
        {
          pretitle: "Steg fyra · Varför det spelar roll",
          title: "Ett filosofiskt kvitto",
          body: "Iota producerar inte snabba eller läsbara program — den producerar existensbevis. Varje algoritm som kan skrivas i något språk kan kodas som ett Iota-uttryck. Reduceraren i nästa rum låter dig skriva ett uttryck och se det skrivas om, steg för steg, till sin normalform (när en sådan existerar). Det är beräkning i sin mest avskalade form: en enda symbol, en enda regel, hela matematiken.",
        },
      ],
    },
    rule110: {
      pretitle: "Tema · Beräkning",
      title: "Regel 110",
      tagline: "En åttabitarsregel, bevisligen universell.",
      intro:
        "En byte av regel, tillämpad på en rad av bitar, räcker för att koda vilken beräkning som helst. Simulatorn låter dig ändra regel, frö och hastighet i realtid.",
      ctaInteractive: "→ Öppna Simulatorn",
      sections: [
        {
          pretitle: "Steg ett · Uppställningen",
          title: "En rad celler, en regel, upprepa",
          body: "En elementär cellulär automat körs på en rad celler, var och en svart eller vit. Nästa generation ritas under: varje cell tittar på sig själv och sina två omedelbara grannar — tre celler — och avgör sin färg enligt en fast regel. Åtta möjliga grannskapsmönster; för var och en, ett en-bits svar. Åtta bitar = en byte = en av 256 möjliga regler. Stephen Wolfram numrerade dem 0 till 255 i binär form.",
        },
        {
          pretitle: "Steg två · Att läsa regel 110",
          title: "Åtta mönster, en byte",
          body: "Skriv ner de åtta tre-cells-mönstren i fallande binär ordning: 111, 110, 101, …, 000. Under varje mönster, skriv nästa-generations-värdet för mittcellen. Läs raden av svar som ett enda binärt tal — för regel 110 blir det 01101110, vilket är 110 i decimalform. Regeln är just den byten.",
        },
        {
          pretitle: "Steg tre · En pixel odlar ett universum",
          title: "Starta från en enda prick",
          body: "Sätt en enda svart cell på översta raden, allt annat vitt. Tillämpa regeln; rita nästa generation under. Upprepa under några hundra rader. Med regel 110 är resultatet varken det tråkiga helsvarta/helvita som regler som 0 eller 255 ger, eller den enkla Sierpiński som regel 90 ger — det är en permanent rörlig trafik av triangulära glidare mot en randig bakgrund, lagrad till något som genuint aldrig stannar.",
        },
        {
          pretitle: "Steg fyra · Cooks bevis",
          title: "Det är, bevisligen, en dator",
          body: "I slutet av 1990-talet visade Matthew Cook hur man arrangerar specifika glidarmönster i regel 110 så att deras kollisioner fungerar som logiska grindar — och sedan hur man monterar ett fungerande cykliskt taggsystem, som självt är Turing-fullständigt. Beviset är invecklat, men slutsatsen är ren: denna åttabitarsregel, tillämpad på en rad bitar, är universell. Vilken beräkning du än kan göra, kan du göra den i regel 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Tema · Kaos",
      title: "Den logistiska avbildningen",
      tagline: "En oskyldig formel där ordning tippar över i kaos.",
      intro:
        "En fickformat modell för nästa års befolkning som, med ett enda reglage vridet, blir det mest studerade stycket kaos i matematiken. Utforskaren låter dig vrida det reglaget i realtid.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Formeln",
          title: "En formel för morgondagens befolkning",
          body: "Pierre-François Verhulsts logistiska ekvation från 1845, samplad i diskret tid, ger avbildningen xₙ₊₁ = r · xₙ · (1 − xₙ). Läs x som en bråkdel av bärkraften mellan 0 och 1; r som tillväxttakten. Termen (1 − x) är bromsen — för många individer svälter nästa generation. Med 0 ≤ r ≤ 4 förblir iterationen begränsad.",
        },
        {
          pretitle: "Steg två · Från fred till kaos",
          title: "Fördubbling, fördubbling, borta",
          body: "För r under 1 dör varje befolkning ut. Från 1 upp till 3 stabiliserar den sig kring en enda fixpunkt — en stadig befolkning. Vid r = 3 förlorar fixpunkten sin stabilitet och delas i en 2-cykel: i år upp, nästa år ner. Vid r ≈ 3.449 blir 2-cykeln en 4-cykel, vid r ≈ 3.544 en 8-cykel, och fördubblingarna staplas allt snabbare tills r ≈ 3.56995, där systemet slutligen faller i kaos.",
        },
        {
          pretitle: "Steg tre · Feigenbaums universella konstant",
          title: "Ett tal som färdas mellan system",
          body: "Mät förhållandet mellan längderna av två på varandra följande fördubblingsintervall. Talet som kommer ut är δ ≈ 4.66920… — Mitchell Feigenbaums konstant. Det häpnadsväckande faktumet är att samma konstant dyker upp i helt orelaterade system: Hénon-avbildningen, Duffing-oscillatorn, även experimentell vätskekonvektion. Periodfördubbling är en universell väg till kaos, och δ är dess fingeravtryck.",
        },
        {
          pretitle: "Steg fyra · Öar av ordning",
          title: "Där lugnet gömmer sig inuti kaoset",
          body: "Inuti den kaotiska regimen stabiliserar systemet sig plötsligt tillbaka till en stabil 3-cykel vid r ≈ 1 + √8 ≈ 3.8284. Därifrån fördubblas den igen — period 6, 12, 24 — och åter in i kaos. Li-Yorke-satsen gör poängen rigorös: 'period tre implicerar kaos.' Robert Mays artikel från 1976, 'Simple mathematical models with very complicated dynamics', lade hela historien framför biologerna. Den har inte lämnat sedan dess.",
        },
      ],
    },
    lorenz: {
      pretitle: "Tema · Kaos",
      title: "Lorenz-attraktorn",
      tagline: "Tre rader kod, en fjäril.",
      intro:
        "En leksaksmodell av atmosfären som av en slump uppfann kaosteorin. Utforskaren integrerar ekvationerna i realtid och låter dig se banan vägra att upprepa sig.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · En leksaksatmosfär",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, meteorolog vid MIT, försökte simulera konvektion — luft som värms underifrån och kyls ovanifrån. Margaret Hamilton hade programmerat de tidigare väderkörningarna; Ellen Fetter körde beräkningarna bakom trekvationsmodellen. Han skar ner problemet till tre variabler och tre ekvationer. Artikeln från 1963, 'Deterministic Nonperiodic Flow', hävdade att även denna drastiska förenkling kunde bete sig oförutsägbart. Artikeln förblev till stor del oläst i ett decennium.",
        },
        {
          pretitle: "Steg två · De tre ekvationerna",
          title: "Tre kopplade rader",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ är Prandtl-talet, ρ Rayleigh-talet, β det geometriska bildförhållandet. De berömda kaotiska värdena är σ = 10, ρ = 28, β = 8/3, fastslagna av Lorenz själv. Ändra ρ och systemet löper genom en lång katalog av beteenden — fixpunkter, periodiska banor, övergående kaos — innan det når den kanoniska fjärilen.",
        },
        {
          pretitle: "Steg tre · Fjärilen",
          title: "En attraktor i 3D",
          body: "Integrera framåt i tiden och banan slingrar sig kring två instabila jämviktslägen, hoppande mellan dem i en sekvens som aldrig upprepas. Formen, i tre dimensioner, ser ut som en fjärils vingar — därav namnet. Attraktorn är varken en kurva eller en yta; dess Hausdorff-dimension är cirka 2.06. Det är en sällsam attraktor: tät i sig själv, aldrig sluten, fraktal på varje skala.",
        },
        {
          pretitle: "Steg fyra · Känsligt beroende",
          title: "Varför väderprognoser har en horisont",
          body: "Ta två startpunkter som skiljer sig med en del på hundratusen. Efter en kort tid är de två banorna helt okorrelerade. Lorenz formaliserade detta som känsligt beroende av begynnelsevillkoren; den ledande Lyapunov-exponenten är positiv. I en föreläsning 1972 frågade han om 'en fjäril som slår med vingarna i Brasilien kan utlösa en tornado i Texas' — och gav metaforen som definierade fältet. Anledningen till att väderprognoser förfaller efter ungefär två veckor är samma exponent, i den verkliga atmosfären.",
        },
      ],
    },
    fourier: {
      pretitle: "Tema · Analys",
      title: "Fouriertransformen",
      tagline: "Varje signal är en summa av sinusvågor.",
      intro:
        "Ett av de djupaste enskilda fakta i matematiken — och den tysta motorn bakom MP3, JPEG, Wi-Fi och MRT. Utforskaren låter dig lägga till övertoner en i taget och se en fyrkantvåg framträda ur rena sinusfunktioner.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Fouriers påstående",
          title: "Värmeledning, 1822",
          body: "Joseph Fourier publicerade sin 'Analytical Theory of Heat' 1822. För att lösa värmeledningsekvationen gjorde han ett uppseendeväckande påstående: vilken funktion som helst, kontinuerlig eller hoppig, kan skrivas som en summa av rena sinus- och cosinusfunktioner. Hans tids matematiker trodde honom inte. Det krävdes ett halvt århundrade av förfining (Dirichlet, Riemann, Lebesgue) innan påståendet stabiliserades till en sats.",
        },
        {
          pretitle: "Steg två · Receptet",
          title: "Summa av rena toner",
          body: "För en periodisk funktion: en Fourierserie — en summa över diskreta frekvenser. För en godtycklig integrerbar funktion: en Fouriertransform f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — ett kontinuerligt spektrum. Båda säger samma sak på olika sätt: en signal i tid, hur komplicerad som helst, sönderfaller i rena svängningar. Ett ackord blir sina toner. Ett fotografi blir sina ränder.",
        },
        {
          pretitle: "Steg tre · Varför din telefon fungerar",
          title: "Gömd inuti MP3, JPEG, MRT, Wi-Fi",
          body: "Identifiera vilka frekvenser som är viktiga; kasta resten; komprimera. MP3 behåller de hörbara banden och kastar det örat inte kan höra. JPEG delar en bild i 8×8-block och behåller de dominerande rumsliga frekvenserna. MRT-skannrar mäter fysiskt sampel i frekvensrum och invers-Fouriertransformerar tillbaka till anatomi. Wi-Fi och 5G använder OFDM och packar data på tusentals bärfrekvenser parallellt. Cooley–Tukey-FFT:n (1965) gjorde allt detta tillräckligt snabbt för att vara praktiskt.",
        },
        {
          pretitle: "Steg fyra · Osäkerhetsavvägningen",
          title: "Skarpare i tid, suddigare i frekvens",
          body: "Klämma in en signal i ett smalt tidsfönster och dess Fouriertransform smetar nödvändigtvis ut sig över många frekvenser — och vice versa. Detta är inte teknik; det är matematik. Gaussfunktionen sitter vid avvägningens optimum: den är sin egen Fouriertransform. Samma olikhet blir, inom fysiken, Heisenbergs osäkerhetsprincip. Tid och frekvens är duala koordinater; du kan inte skärpa båda samtidigt.",
        },
      ],
    },
    euler: {
      pretitle: "Tema · Analys",
      title: "Eulers identitet",
      tagline: "Fem tal, en rad.",
      intro:
        "e^(iπ) + 1 = 0 — fem konstanter från fem olika hörn av matematiken, låsta in i en enda likhet. Utforskaren bredvid låter dig se e^(iθ) svepa runt enhetscirkeln i realtid, så att du kan se, med dina egna ögon, ögonblicket vid θ = π när identiteten faktiskt inträffar.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · De fem konstanterna",
          title: "0, 1, e, i, π — fem främlingar i ett rum",
          body: "Var och en av de fem talen kommer från ett annat land. 0 är den additiva identiteten — ingenting. 1 är den multiplikativa identiteten — enhet. e ≈ 2.71828 är den naturliga räntefoten av sammansatt tillväxt, född i analysen. i är den imaginära enheten, definierad av i² = −1, född i algebran då man försökte lösa kubiska ekvationer. π ≈ 3.14159 är förhållandet mellan en cirkels omkrets och dess diameter, fött i geometrin. Normalt möts de aldrig — och ändå binder en enda ekvation, sex symboler lång, alla fem samman med inget annat än +, ·, = och exponentiering.",
        },
        {
          pretitle: "Steg två · Eulers formel",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "Identiteten är vad Eulers formel ger tillbaka vid en enda vald vinkel, publicerad i hans Introductio in analysin infinitorum från 1748. För varje reellt tal θ säger formeln att e^(iθ) — en exponentialfunktion med en imaginär exponent — är lika med cos θ + i sin θ. Geometriskt: när θ växer vandrar punkten e^(iθ) moturs runt enhetscirkeln i det komplexa planet. Att multiplicera med e^(iθ) är rotation med vinkeln θ. Tillväxt och rotation, de två saker e och i hemligen gör, visar sig vara samma operation sedd från två sidor.",
        },
        {
          pretitle: "Steg tre · Sätt θ = π",
          title: "Beviset på en rad",
          body: "Sätt θ = π i Eulers formel. Högerledet blir cos π + i sin π = −1 + i·0 = −1. Vänsterledet är e^(iπ). Så e^(iπ) = −1, och om vi adderar 1 till båda sidorna får vi e^(iπ) + 1 = 0. Geometriskt är detta ett halvt varv: att starta vid punkten 1 på enhetscirkeln och rotera med π radianer — 180° — landar exakt vid −1. Identiteten är det algebraiska uttrycket för det enda, perfekta halvvarvet.",
        },
        {
          pretitle: "Steg fyra · Den vackraste ekvationen",
          title: "Varför matematiker röstar på den",
          body: 'Richard Feynman, fjorton år gammal, kallade Eulers formel "den mest anmärkningsvärda formeln i matematiken" — "vår juvel" — i sina Lectures on Physics. En undersökning i Mathematical Intelligencer 1990 utsåg identiteten till den vackraste satsen i matematiken; en läsarundersökning i Physics World 2004 rankade den jämsides med Maxwells ekvationer som den största ekvationen någonsin. Tjusningen är att den använder var och en av de grundläggande aritmetiska operationerna exakt en gång (addition, multiplikation, exponentiering), var och en av de grundläggande konstanterna exakt en gång (0, 1, e, i, π), och inte innehåller något extra skräp. Få ekvationer är så korta, och ingen så ofta citerad som bevis på att matematik är vacker.',
        },
      ],
    },
    banach: {
      pretitle: "Tema · Paradox",
      title: "Banach–Tarski-paradoxen",
      tagline: "Skär ett klot, sluta med två.",
      intro:
        "Ett massivt klot, uppdelat i en handfull bitar, kan återsammansättas till två massiva klot som vart och ett är identiskt med originalet — ingen sträckning, inget extra material. Utforskaren ritar maskineriet bakom tricket: den fria gruppen F₂ av två rotationer, vars självlika Cayleyträd innehåller fyra förskjutna kopior av sig själv. Den förgreningsstrukturen är, nästan bokstavligen, varifrån det andra klotet kommer.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Påståendet",
          title: "Ett klot in, två klot ut",
          body: "Ta ett massivt klot B³ i tredimensionellt rum. Banach–Tarski-satsen (1924) säger att du kan dela upp det i ändligt många disjunkta bitar — fem räcker, och fem är minimum — tillämpa stela rörelser (rotationer och translationer) på dessa bitar, och sluta med två disjunkta massiva klot, vart och ett kongruent med originalet. Ingenting sträcks, deformeras eller dupliceras; bitarna arrangeras bara om. Slutsatsen är, som ett stycke ren matematik, fullständigt rigorös: B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Steg två · Urvalsaxiomet",
          title: "Där underligheten kommer in",
          body: "Konstruktionen är omöjlig enbart i ZF-mängdteori. Banach och Tarskis bevis behöver urvalsaxiomet för att välja en representant från var och en av oräkneligt många banor av en rotationsverkan på sfären. Den enda användningen av urval tvingar bitarna att vara icke-mätbara: de har ingen väldefinierad volym i Lebesgue-mening, så ekvationen 'volymen av ett klot = volymen av två klot' skrivs aldrig ner. Bitarna är inga regioner du någonsin skulle kunna fysiskt skära — de är täta, icke-mätbara punktmoln som endast existerar som logiska objekt.",
        },
        {
          pretitle: "Steg tre · Den fria rotationsgruppen",
          title: "F₂, genererad av två rotationer",
          body: "Hjärtat i beviset är rent gruppteoretiskt. Två lämpligt valda rotationer a och b av enhetssfären S² uppfyller ingen relation annan än de triviala: de genererar en fri grupp F₂ av rang 2 — varje reducerat ord i a, a⁻¹, b, b⁻¹ verkar som en annan rotation. F₂ medger en paradoxal uppdelning: den delas i fyra mängder W(a), W(a⁻¹), W(b), W(b⁻¹) (ord som börjar med varje generator) plus identiteten, och varje förskjuten mängd täcker resten av gruppen. Driv detta genom Hausdorffs sfärparadox från 1914, lyft från S² till det massiva klotet, och dupliceringen i gruppen blir en duplicering av B³.",
        },
        {
          pretitle: "Steg fyra · Varför det inte spräcker världen",
          title: "Icke-mätbara bitar, verkliga atomer",
          body: "Lebesgue-måttet är räkneligt additivt på mätbara mängder; om bitarna var mätbara skulle volymen av de två utgångskloten vara tvungen att vara lika med volymen av ingångsklotet, vilket motsäger sig självt. Så satsen talar artigt om för dig att bitarna inte kan vara mätbara — och det är de inte heller. Den verkliga världen bryr sig inte: fysisk materia består av ändligt många atomer, inte godtyckliga delmängder av ℝ³, och du kan inte göra ett snitt längs en icke-mätbar gräns. Paradoxen lever helt inom kontinuumet, där oändligheten har mer manöverutrymme än intuitionen tillåter.",
        },
      ],
    },
    lsystem: {
      pretitle: "Tema · Geometri",
      title: "L-system",
      tagline: "Omskrivningar bokstav för bokstav som växer till växter.",
      intro:
        "Ett L-system är en liten grammatik: en startsträng, några omskrivningsregler och en sköldpadda som förvandlar bokstäver till linjer. I Utforskaren redigerar du axiomet och reglerna, drar i iterationsdjupet och ser sköldpaddan rita den resulterande fraktalen — Kochflingor, drakar, ormbunkar, Hilbertkurvor — från en handfull tecken.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · En sträng och tre regler",
          title: "Axiom, alfabet, omskrivning",
          body: "Ett L-system har tre delar. Ett alfabet av symboler. Ett axiom — en startsträng. En uppsättning produktionsregler, en per symbol, som säger vad varje symbol blir i nästa generation. Det avgörande tricket är parallellitet: vid varje steg skrivs varje symbol om samtidigt, på samma sätt som varje cell i en kropp delas på en gång. Aristid Lindenmayer, en ungersk biolog i Utrecht, introducerade formalismen 1968 för att modellera den cell-för-cell-tillväxt av alger och växter. I den enklaste (kontextfria, deterministiska) varianten tittar reglerna på en symbol i taget; kontextkänsliga versioner tittar på grannar; stokastiska versioner väljer regler slumpmässigt.",
        },
        {
          pretitle: "Steg två · Sköldpaddstolkningen",
          title: "En virtuell penna som odlar fraktalen",
          body: "Symboler ensamma är bara text. Geometrin uppstår när du matar strängen till en sköldpadda: F betyder rita framåt en enhet, G betyder också rita framåt, + svänger riktningen åt vänster med en fast vinkel, − svänger åt höger. Två symboler till lagrar och hämtar tillståndet: [ trycker in den nuvarande positionen och riktningen på en stack, ] hämtar tillbaka dem. Med bara push och pop förgrenas plötsligt en endimensionell sträng — parentesparen blir kvistar och sidoskott. Symboler utanför ritalfabetet (X, Y, A, B …) är tysta variabler: de bär information framåt genom omskrivningar men sköldpaddan ignorerar dem.",
        },
        {
          pretitle: "Steg tre · Klassiska exempel",
          title: "Fyra regler, fyra fraktaler",
          body: "Kochs snöflinga: axiom F++F++F, regel F → F−F++F−F, vinkel 60°. Fyra iterationer och triangeln har krusat sig till en snöflinga. Drakkurvan: axiom FX, regler X → X+YF+, Y → −FX−Y, vinkel 90°; efter ett dussin omskrivningar viker den sig till Heighways drake. Sierpińskis pilspets: A → B−A−B, B → A+B+A, vinkel 60°, alternerar paritet för att svepa ut Sierpiński-triangeln. Fraktalväxt: X → F+[[X]−X]−F[−FX]+X, F → FF, vinkel 25° — Lindenmayers och Prusinkiewiczs kanoniska ormbunke, grenar och allt. Samma maskineri, vilt olika organismer.",
        },
        {
          pretitle: "Steg fyra · Varför botaniker älskar dem",
          title: "Från en artikel 1968 till varje skog i ett TV-spel",
          body: 'Lindenmayer var ingen matematiker som jagade vackra bilder — han var en biolog som försökte fånga hur en flercellig organism utvecklas från en enda spets. L-system gav botaniken dess första formella grammatik för tillväxt: förgreningstopologi, internodlängder, bladplacering, allt från några omskrivningsregler. Przemyslaw Prusinkiewiczs bok från 1990, "The Algorithmic Beauty of Plants", förvandlade idén till en fungerande pipeline, och därifrån läckte den in i datorgrafiken. De flesta procedurella träden i spel och filmer, ormbunkarna i Speedtree, vegetationen i Pixar-kortfilmer, rörstäderna i demoscenen — alla härstammar från Lindenmayers parallella omskrivning. En grammatik för celler blev en grammatik för världar.',
        },
      ],
    },
    wang: {
      pretitle: "Tema · Beräkning",
      title: "Wang-plattor",
      tagline: "Kvadrater med färgade kanter som kan koda varje beräkning.",
      intro:
        "Hao Wangs pussel från 1961 — kvadrater vars fyra färgade kanter måste matcha sina grannar — visade sig dölja stopproblemet inuti ett barns matchningsspel. Utforskaren låter dig välja en plattuppsättning och se planet fyllas i, cell för cell, med backtracking när ingen platta passar.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Reglerna",
          title: "Kvadratiska plattor, fyra färgade kanter, ingen rotation",
          body: "En Wang-platta är en enhetskvadrat vars fyra kanter bär färger. Du får placera en platta endast när var och en av dess kanter matchar färgen på den kant den möter hos grannplattan — nord mot syd, öst mot väst. Plattor får inte roteras eller speglas; färgtilldelningen är fast. Givet en ändlig uppsättning sådana plattor är frågan om du kan använda kopior av dem för att täcka hela det oändliga planet.",
        },
        {
          pretitle: "Steg två · Wangs förmodan och dess motbevis",
          title: "Från en algoritm som borde finnas till en som inte kan finnas",
          body: "Hao Wang förmodade 1961 att varje ändlig uppsättning plattor som kan täcka planet måste medge en periodisk täckning — och därifrån skulle han ha härlett en algoritm för att avgöra Dominoproblemet (täcker en given uppsättning planet överhuvudtaget?). År 1966 motbevisade hans student Robert Berger båda på samma gång: han konstruerade en aperiodisk uppsättning av 20 426 Wang-plattor och bevisade att Dominoproblemet är oavgörbart. Det finns ingen algoritm som, givet en plattuppsättning, alltid kan avgöra om den täcker planet.",
        },
        {
          pretitle: "Steg tre · Beräkning i täckningen",
          title: "Att koda en Turingmaskin som en plattuppsättning",
          body: "Bergers knep var att översätta en Turingmaskins konfigurationer till Wang-plattor, så att varje giltig rad av plattor kodar ett steg av maskinen och varje giltig kolumn kodar tidens gång. En täckning av övre halvplanet existerar då om och endast om maskinen aldrig stannar på sin tomma indata — vilket är stopproblemet, det kanoniska oavgörbara problemet. Samma konstruktion krympte över decennierna: Berger reducerade sin uppsättning till 104, Robinson till 56, och 1996 publicerade Karel Culik II det länge stående rekordet på 13 aperiodiska Wang-plattor. Jeandel och Rao bevisade senare att det verkliga minimumet är 11.",
        },
        {
          pretitle: "Steg fyra · Var de hamnar i det vilda",
          title: "Från oavgörbarhet till procedurell textur",
          body: "Bortom det grundläggande dramat fann Wang-plattor ett stilla andra liv i datorgrafiken. En liten noggrant vald uppsättning låter en renderare täcka en vägg, en skogsbotten eller en terrängens höjdkarta utan synliga upprepningar — matchningsvillkoren syr ihop bitar utan sömmar, mycket billigare än att generera en gigantisk unik textur. De är nära kusiner till Penrose-täckningar och de kvasikristaller som Dan Shechtman upptäckte 1982 (Nobelpriset 2011): alla tre är sätt att tvinga fram ett oändligt mönster som aldrig riktigt upprepar sig.",
        },
      ],
    },
    collatz: {
      pretitle: "Tema · Kaos",
      title: "Collatz-förmodan",
      tagline: "Om jämn, halvera. Om udda, tredubbla och addera ett.",
      intro:
        "Ett av de enklaste olösta problemen i matematiken: en fyraordsregel som ingen kan bevisa alltid terminerar. Utforskaren nedan ritar haglbanan för vilket startnummer som helst och växer omvänd korall — det bakåtriktade trädet av alla heltal, rotat vid 1.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Regeln",
          title: "Två fall, en instruktion",
          body: "Välj vilket positivt heltal n som helst. Om n är jämnt, ersätt det med n/2. Om n är udda, ersätt det med 3n + 1. Upprepa. Det är hela regeln. Pröva n = 7: det går 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, och sedan loopar 1 → 4 → 2 → 1 för evigt. Varje startpunkt vi någonsin testat slutar i samma lilla loop.",
        },
        {
          pretitle: "Steg två · Förmodan",
          title: "Varje väg leder till 1",
          body: "Lothar Collatz föreslog förmodan 1937, två år efter sin doktorsexamen. Påståendet är hisnande enkelt: för varje positivt heltal n når iterationen så småningom 1. Den är också känd som Syracuse-problemet, Kakutanis problem och Ulams förmodan — flera matematiker snubblade oberoende av varandra över samma bestia. Från och med 2025 har den verifierats med dator för varje positivt heltal upp till ungefär 2.36 × 10²¹. Ingen vet varför.",
        },
        {
          pretitle: "Steg tre · Rekord och överraskningar",
          title: "Hagel över Syracuse",
          body: "Banorna kallas haglsekvenser eftersom de, likt hagel i ett åskmoln, stiger och faller oregelbundet innan de slutligen träffar marken. Det mest kända lilla fallet är n = 27: det tar 111 steg att nå 1 och längs vägen toppar det vid 9232 — ungefär 340 gånger sitt startvärde. Andra anmärkningsvärda frön: n = 97 tar 118 steg; n = 871 tar 178 steg; n = 6171 tar 261 steg. Små indata, vilt oproportionerliga banor.",
        },
        {
          pretitle: "Steg fyra · Varför den motstår",
          title: "En korall ingen kan beskära",
          body: "Paul Erdős, som tittade på det, ryckte på axlarna: 'Matematiken är kanske inte redo för sådana problem.' Han erbjöd $500 för en lösning och priset är fortfarande inte krävt. Det djupaste framsteget är Terence Taos artikel från 2019 som visar att nästan alla Collatz-banor uppnår nästan begränsade värden — en sannolikhetsteoretisk nära miss, inte ett bevis. Kör regeln baklänges i stället för framlänges och heltalen självsammansätts till ett enda oändligt träd rotat vid 1, förgrenande sig utåt som korall. Utforskaren intill växer den korallen och låter dig släppa vilket frö som helst in i haglstormen.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Tema · Kaos",
      title: "Dubbelpendeln",
      tagline: "Två pendlar i kedja, totalt kaos.",
      intro:
        "Ett mekaniskt system enkelt nog att ritas på en servett och kaotiskt nog att överlista varje prognos. Utforskaren integrerar rörelseekvationerna i realtid och låter dig kappköra två nästan identiska starter så att du själv kan se dem divergera.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Uppställningen",
          title: "Två pendlar, en vikt hängande från en annan",
          body: "Ta en enkel pendel — en stel masslös stång med längd L₁ med en vikt av massa m₁ i änden, svängande under gravitation. Fäst nu en andra stång med längd L₂ med massa m₂ vid den första pendelns vikt. Konfigurationen beskrivs av bara två vinklar, θ₁ och θ₂, mätta från vertikalen. Tillsammans med vinkelhastigheterna ω₁ = θ̇₁ och ω₂ = θ̇₂ är det hela tillståndet: en punkt i ett fyrdimensionellt fasrum som utvecklas deterministiskt enligt Newton.",
        },
        {
          pretitle: "Steg två · Lagrangianen",
          title: "Kinetisk minus potentiell, sedan kör Euler-Lagrange",
          body: "Skriv den kinetiska energin T för båda vikterna och den potentiella energin V från gravitationen. Lagrangianen L = T − V kommer ut rent, men rörelseekvationerna ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 producerar två kopplade, ickelinjära andra ordningens ODE:er för θ̈₁ och θ̈₂. Kopplingen sker genom termer sin(θ₁−θ₂) och cos(θ₁−θ₂); ickelinjäriteten är oundviklig. Ingen sluten lösning existerar. För att se systemet röra sig måste du integrera numeriskt — och det är precis vad Utforskaren gör, steg för steg, med RK4.",
        },
        {
          pretitle: "Steg tre · Kaos",
          title: "Liten energi: vacker. Stor energi: oförutsägbar.",
          body: "Vid låg energi svänger vikterna mjukt och rörelsen är kvasiperiodisk — banan slingrar sig kring en invariant torus i fasrummet och upprepar sig aldrig riktigt men förblir begränsad och ordnad. Pressa upp energin och systemet korsar in i kaos: den största Lyapunov-exponenten blir positiv, och två starter som skiljer sig med en del på en miljon separerar fullständigt inom några sekunder. Dubbelpendeln är läroboksexemplet för en fysisk demonstration av deterministiskt kaos — deterministisk i ekvationerna, oförutsägbar i praktiken.",
        },
        {
          pretitle: "Steg fyra · Var den dyker upp",
          title: "Robotar, gång, reglerteknik, museer",
          body: "Samma kopplade rotor-ekvationer beskriver tvålänkade robotarmar (där kaos är något att undertrycka, inte fira), biomekaniken hos ett svängande ben i mänsklig gång och många sammansatta oscillatorer inom teknik. Reglertekniker använder dubbelpendeln som ett riktmärke för att stabilisera instabila ickelinjära system — att balansera den upprätt är ett klassiskt svårt problem. Och varje gott vetenskapsmuseum har en svängande i en glasmonter som ritar ett spår besökarna aldrig riktigt kan förutsäga.",
        },
      ],
    },
    bzr: {
      pretitle: "Tema · Kaos",
      title: "Belousov–Zhabotinsky-reaktionen",
      tagline: "En kemisk klocka som ritar spiraler.",
      intro:
        "En verklig kemisk blandning som vägrar stabilisera sig: den pulserar genom färger i en bägare och odlar roterande spiraler i en petriskål. Utforskaren simulerar ett reaktion-diffusionsrutnät i Oregonatorstil med 3 variabler så att du kan se samma instabilitet självorganisera sig till vågor.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Den oavsiktliga upptäckten",
          title: "En reaktion som borde varit omöjlig",
          body: "I början av 1950-talet blandade den sovjetiske kemisten Boris Belousov, som sökte en oorganisk analog till Krebs-cykeln, bromat, citronsyra och en ceriumkatalysator — och såg lösningen byta färg rytmiskt, om och om igen. Granskare avvisade hans artikel: en kemisk reaktion som synbart oscillerar i tiden såg ut som en överträdelse av termodynamikens andra huvudsats. Belousov gav upp att publicera den. Ett decennium senare, 1961, plockade doktoranden Anatol Zhabotinsky upp receptet, bytte citron- mot malonsyra och demonstrerade oscillationerna tillräckligt rent för att resultatet inte längre kunde förnekas.",
        },
        {
          pretitle: "Steg två · Hur det ser ut",
          title: "En klocka i en bägare, spiraler i en skål",
          body: "Det moderna receptet är bromat (BrO₃⁻) plus bromid, malonsyra som bränsle och en redoxkatalysator — cerium, eller mer synligt ferroin, i ett svavelsyrabad. Omrört i en bägare byter lösningen färg med regelbundna intervall (blå ↔ röd med ferroin) som en kemisk metronom. Hälld i en tunn petriskål så att diffusion spelar roll odlar samma recept spontant roterande spiralvågor och koncentriska målmönster under några minuters lopp. Rör om och mönstret raderas; lämna det ifred och ett nytt ritas.",
        },
        {
          pretitle: "Steg tre · Oregonatorn",
          title: "Tre variabler, en oscillation",
          body: "År 1972 destillerade Richard Field, Endre Körös och Richard Noyes — verksamma vid University of Oregon — kemin till Oregonatorn: ett ickelinjärt ODE-system med 3 variabler som spårar de viktigaste mellanprodukterna (HBrO₂, Br⁻ och den oxiderade katalysatorn). Det oscillerar av exakt de skäl bägaren gör. Lägg till diffusionstermer och ODE:erna blir reaktion-diffusions-PDE:er; i Tyson–Fife-reduktionen reproducerar samma modell spiralvågorna på en 2D-yta. Utforskaren intill kör en kusin med diskreta celler till denna PDE som är billig nog för en webbläsare men trogen nog att forma spiraler.",
        },
        {
          pretitle: "Steg fyra · Varför det spelar roll",
          title: "Kemi som organiserar sig själv",
          body: "BZR var den experimentella rykande pistolen som tryckte bort kemin från jämviktstänkande. Långt från jämvikt skingrar materia inte bara — den kan spontant organisera sig till strukturerade mönster i rum och tid. Ilya Prigogine byggde teorin för dessa dissipativa strukturer och fick Nobelpriset i kemi 1977 för det. Idag är BZR läroboksexemplet på icke-jämviktig självorganisation, en syskon till Turings morfogenmönster och en förfader till varje reaktion-diffusionsmodell inom biologi, neurovetenskap och kemiteknik.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Tema · Analys",
      title: "Turingmönster",
      tagline: "Hur leoparder får sina fläckar.",
      intro:
        "Utforskaren simulerar ett Gray-Scott reaktion-diffusionsrutnät i realtid: två virtuella kemikalier som konkurrerar på ett 200×200 gitter. Vrid reglagen för matnings- och dödandetakt och fältet morfar kontinuerligt mellan fläckar, ränder, labyrinter och självreplikerande korall.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Turings fråga",
          title: "Varifrån kommer mönstren på ett djur?",
          body: "Ett leopardembryo börjar som en nästan likformig bollformad samling celler. Någonstans längs vägen dyker regelbundna fläckar upp på dess päls — samma avstånd, samma storlek, på rätt platser. Samma problem uppstår för sebraränder, kejsarfiskars band och ringarna på ett snäckskal. År 1952 publicerade Alan Turing 'The Chemical Basis of Morphogenesis' och föreslog ett uppseendeväckande svar: mönstren är ren kemi. Två diffunderande ämnen med mycket olika räckvidd, som reagerar med varandra, kan spontant bryta symmetrin och lägga ner en stabil design ovanpå en likformig bakgrund.",
        },
        {
          pretitle: "Steg två · Receptet",
          title: "Kortdistansaktivering, långdistansinhibition",
          body: "Turings mekanism tar två kemikalier: en AKTIVATOR a som katalyserar sin egen produktion och produktionen av en INHIBITOR b, plus själva inhibitorn, som förstör aktivatorn. Den avgörande extra ingrediensen är diffusion: inhibitorn måste sprida sig mycket snabbare än aktivatorn. En liten fluktuation som höjer a på en plats utlöser ett okontrollerat lokalt utbrott av aktivator — men producerar också inhibitor, som rusar utåt och dämpar aktivatorn i en bred ring runt om. Den dämpningsringen håller nästa utbrott på armlängds avstånd, och utbrott-och-ring-rytmen kaklar planet med regelbundna fläckar, ränder eller labyrinter.",
        },
        {
          pretitle: "Steg tre · En ekvation, många mönster",
          title: "Gray-Scotts fasdiagram",
          body: "Standardformen att leka med är Gray-Scott-modellen: ∂a/∂t = D_a∇²a − ab² + F(1 − a) och ∂b/∂t = D_b∇²b + ab² − (F + k)b. Bara två reglage gör tungarbetet — F, matningstakten med vilken färsk aktivator tillförs, och k, dödningstakten med vilken inhibitorn sönderfaller. Pearsons artikel från 1993 kartlade (F, k)-planet till en numera berömd atlas av namngivna regioner: hål, fläckar, ränder, mitosliknande självreplikerande prickar, den instabila U-skate-världen, labyrinter, solitoner och fullt kaos. Samma två differentialekvationer innehåller dem alla; du flyttar bara markören.",
        },
        {
          pretitle: "Steg fyra · Mönstren är verkliga",
          title: "Från provröret till blåsfisken",
          body: "I årtionden var Turings mekanism en vacker idé utan experiment. Sedan, 1990, producerade CIMA-reaktorn (klorit-jodid-malonsyra i en gel) det första laboratorie-Turingmönstret i ren kemi, med stärkelse som inhibitorns broms. Sedan dess har biologer fångat samma mekanism på bar gärning i levande vävnad: Akiyama och Tanaka läste 2014 av aktivator- och inhibitorsignalerna direkt från den afrikanska blåsfisken; Sheth och kollegor visade Turingdynamik som styr musens fingerspridning; samma kemi styr hårfollikelavstånd, fjäderknoppar och snäckskals-pigmentering. Pälsar, fingeravtryck, åsar — Turings skiss från 1952, uppmätt.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Tema · Geometri",
      title: "Sierpiński-triangeln",
      tagline: "En fraktal, fyra vägar in.",
      intro:
        "Wacław Sierpiński beskrev den 1915, men samma mönster med triangulära hål-i-hål hade redan ristats in i golven på 1200-talets cosmateska kyrkor. Det häpnadsväckande är att formen anländer via minst fyra helt olika vägar — rekursion, slumpmässighet, aritmetik, en cellulär automat på en rad — och Utforskaren låter dig se alla fyra sida vid sida.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Rekursiv uppdelning",
          title: "Skär ut mitten och rekursera",
          body: "Ta en liksidig triangel. Förbind mittpunkterna på dess tre sidor; detta delar den i fyra kongruenta mindre trianglar. Ta bort den centrala och behåll de tre hörnen. Tillämpa nu samma operation på vart och ett av dessa hörn — och igen, och igen. Efter oändligt många steg har du Sierpiński-triangeln: en självlik mängd vars totala area är noll och vars rand har oändlig längd. Varje runda behåller tre fjärdedelar av föregående area, så gränsen är oundviklig.",
        },
        {
          pretitle: "Steg två · Kaosspelets väg",
          title: "Halvvägs, om och om igen",
          body: "Placera tre hörn i en triangel. Släpp en punkt var som helst; sedan, upprepade gånger, välj ett av de tre hörnen likformigt slumpmässigt och hoppa halvvägs mot det. Rita varje steg. Inom några tusen hopp har punktmolnet löst sig till Sierpiński-triangeln — exakt, i gränsen. Rent slumpmässigt spel, inga instruktioner om geometri, inget minne: bara ett halveringssteg och tre mål. Fraktalen är vad slumpvandringen oundvikligen ritar.",
        },
        {
          pretitle: "Steg tre · Pascals triangel mod 2",
          title: "Udda värden ritar den åt dig",
          body: "Skriv ut Pascals triangel och färga varje udda värde svart, varje jämnt värde vitt. Resultatet är, rad för rad, Sierpiński-triangeln. Anledningen är Lucas sats: en binomialkoefficient C(n, k) är udda exakt när de binära siffrorna i k är en delmängd av de binära siffrorna i n. Så de svarta cellerna bor där bitarna i k ryms inom bitarna i n — och det villkoret, ritat i en triangel, är Sierpińskis mönster. Kombinatorik och geometri landar på samma plats.",
        },
        {
          pretitle: "Steg fyra · Regel 90 och IFS:en",
          title: "En cell, en regel, samma form",
          body: "Wolframs elementära cellulära automat Regel 90 säger: en cells nästa tillstånd är XOR av dess två grannar. Starta med en enda svart cell i en annars vit rad och stega framåt. Varje ny generation som ritas under den föregående återger exakt Sierpińskis triangel. Den djupaste läsningen är att alla fyra vägarna beskriver samma attraktor: ett itererat funktionssystem av tre kontraktionsavbildningar, var och en med förhållande 1/2, fixerade vid de tre hörnen. Vilket recept du än följer konvergerar du mot samma fasta mängd — Hausdorff-dimension log 3 / log 2 ≈ 1.585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Tema · Geometri",
      title: "Kaosspelet",
      tagline: "Rulla en tärning, rita en fraktal.",
      intro:
        "Placera några punkter, välj en slumpmässigt om och om igen, och vandra halvvägs mot den — en regel som låter som brus men kondenseras till en perfekt fraktal efter några tusen steg. Utforskaren animerar förfarandet i realtid och låter dig ställa in antalet hörn, hoppförhållandet och reglerna för vilket hörn du får välja härnäst.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Regeln",
          title: "Tre punkter, en tärning och ett kort steg",
          body: "Placera hörnen i en polygon. Välj vilken startpunkt som helst — på, utanför, eller inuti polygonen spelar ingen roll. Rulla nu en tärning för att välja ett hörn slumpmässigt, vandra en fast bråkdel av vägen från din nuvarande position mot det, och markera den nya platsen med en prick. Behandla den pricken som din nya position och upprepa. Regeln har bara två ingredienser: en lista av hörn och ett hoppförhållande r. Det är hela kaosspelet, formaliserat av Michael Barnsley i hans arbete från 1988 om itererade funktionssystem.",
        },
        {
          pretitle: "Steg två · Ur slumpmässighet, Sierpiński-triangeln",
          title: "Rätt förhållande för varje polygon",
          body: "På en liksidig triangel med hoppförhållande r = 1/2 kondenseras prickarna till Sierpiński-triangeln — efter en kort uppvärmning kan ingen punkt någonsin landa i de centrala hålen. För en regelbunden n-hörning finns ett magiskt förhållande rₙ = 1 / (1 + 2·cos(π/n)) som ger en ren självlik fraktal. Tabellen nedan samlar värdena för n = 3 till 8: lägg märke till att triangelns 1/2 och femhörningens 1/(1 + φ) = 1/φ² ≈ 0.382 faller direkt ut ur samma formel. Använd ett annat förhållande och bilden antingen överlappar eller underlappar tills fraktalen suddas ut.",
        },
        {
          pretitle: "Steg tre · Andra former från andra regler",
          title: "Kvadrater, restriktioner och Barnsleys ormbunke",
          body: "På en kvadrat med r = 1/2 misslyckas regeln: prickarna fyller interiören likformigt och ingen fraktal uppstår. Lösningen är en restriktionsregel — förbjud till exempel samma hörn två gånger i rad, eller förbjud hörnet ett steg bort från det föregående — och en delikat fraktal återvänder. Driv idén längre och hörnen försvinner helt: Barnsleys ormbunke är kaosspelet med fyra affina transformationer valda med viktade tärningar (sannolikheter 0.01, 0.85, 0.07, 0.07), och ur den slumpmässigheten växer ett botaniskt övertygande blad.",
        },
        {
          pretitle: "Steg fyra · Varför det fungerar",
          title: "Attraktorer av itererade funktionssystem",
          body: 'Varje tillgängligt drag — "hoppa halvvägs till hörn i" — är en kontraktionsavbildning på planet. En ändlig uppsättning sådana kontraktioner är ett Itererat Funktionssystem (IFS), och Barnsleys sats garanterar en unik kompakt attraktor: hela systemets fixpunkt. Kaosspelet samplar den attraktorn genom att välja avbildningar slumpmässigt, och Hutchinsons sats säger att de samplade prickarna, med sannolikhet ett, blir täta i den. Du kunde rita samma bild deterministiskt genom att tillämpa varje avbildning på varje form — slumpvandringen är bara det billiga, vackra sättet in.',
        },
      ],
    },
    penrose: {
      pretitle: "Tema · Geometri",
      title: "Penrose-täckningar",
      tagline: "Plattor som täcker planet och aldrig upprepas.",
      intro:
        "Två plattformer räcker för att täcka ett oändligt plan med ett mönster som aldrig riktigt upprepar sig. Utforskaren odlar P3 (två romber) eller P2 (drake + pil) -täckningar genom inflation; du ställer in djupet, frörotationen och ser en perfekt aperiodisk geometri sätta samman sig själv.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Två plattor, aldrig upprepande",
          title: "Penrose, 1974",
          body: "Roger Penrose introducerade sin första aperiodiska täckning (P1) 1974 med sex prototyper byggda kring femhörningen. Han trimmade snabbt ner uppsättningen till två: drake + pil-paret (P2) och två-romb-paret (P3) — en tunn romb med vinklarna 36°/144° och en tjock romb med vinklarna 72°/108°. Varje platta bär Conways matchningsregler — färgade pilar eller skåror på kanterna som bestämmer vilka plattor som får ligga bredvid varandra. Utan dem skulle du kunna täcka periodiskt med drakar och pilar; med dem tvingas varje laglig täckning att vara aperiodisk.",
        },
        {
          pretitle: "Steg två · Femfaldig symmetri",
          title: "En förbjuden symmetri",
          body: "Varje vinkel i täckningen är en multipel av 36° — den inre vinkeln av en regelbunden femhörning. Kring speciella hörn har mönstret perfekt femfaldig rotationssymmetri, samma sort som en femhörning har. Klassisk kristallografi bevisar att ingen periodisk täckning av planet kan ha femfaldig symmetri: endast 2-, 3-, 4- och 6-faldiga rotationer är kompatibla med ett gitter. Penroses täckningar går runt satsen genom att vägra vara periodiska från första början. Överraskningen är att du fortfarande kan ha lokal femfaldig ordning utan att någonsin sluta dig till en upprepande cell.",
        },
        {
          pretitle: "Steg tre · Det gyllene snittet är inbyggt",
          title: "φ = (1 + √5) / 2",
          body: "Räkna plattorna i vilken stor lapp som helst och du finner det gyllene snittet vänta. Antalet drakar dividerat med antalet pilar konvergerar mot φ = (1+√5)/2 ≈ 1.618; samma för tjocka romber dividerade med tunna romber. Sidolängdsförhållandena inuti Robinson-trianglarna som bygger varje romb är 1 : φ, och inflationsregeln som odlar täckningen skalar längder med φ vid varje steg. Täckningen är, i en precis mening, det gyllene snittet återgivet som ett mönster i planet.",
        },
        {
          pretitle: "Steg fyra · Kvasikristaller",
          title: "Shechtman, 1982",
          body: 'I april 1982 sköt Dan Shechtman en elektronstråle mot en snabbt kyld aluminium-mangan-legering och såg ett diffraktionsmönster med skarp femfaldig symmetri — något varje lärobok sa inte kunde existera. Linus Pauling förlöjligade honom berömt i åratal ("det finns inga kvasikristaller, bara kvasi-vetenskapsmän"). Penrose-täckningen var det befintliga stycket pappersmatematik som bevisade att det kunde: ett långdistansordnat, femfaldigt symmetriskt, aperiodiskt mönster. Shechtman fick upprättelse med Nobelpriset i kemi 2011, och Penrose-täckningar blev den kanoniska tvådimensionella modellen för det vi nu kallar kvasikristaller.',
        },
      ],
    },
    apollonian: {
      pretitle: "Tema · Geometri",
      title: "Apollonisk cirkelpackning",
      tagline: "Cirklar inuti cirklar inuti cirklar.",
      intro:
        "Börja med tre ömsesidigt tangenta cirklar och en regel för vad som räknas som tangent. Utforskaren fyller rekursivt varje krökt triangulärt mellanrum med en ny cirkel och fyller sedan de mindre mellanrummen i tur och ordning — välj de inledande krökningarna och se en packning framträda som är fraktal för evigt.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Startpositionen",
          title: "Tre cirklar som rör vid varandra",
          body: "Rita tre cirklar i planet, var och en tangent till de andra två — de möts i tre punkter och omsluter ett krökt triangulärt mellanrum. Omkring 200 f.Kr. ställde Apollonius av Perga den naturliga följdfrågan: vilka cirklar är tangenta till alla tre givna cirklar samtidigt? För en trippel av ömsesidigt tangenta cirklar finns det exakt två svar — en liten cirkel inskriven i det krökta mellanrummet, och en stor cirkel som omskriver alla tre. Båda dessa nya cirklar ansluter sig till de ursprungliga tre för att bilda en kvadrupel av ömsesidigt tangenta cirklar. Den kvadrupeln är fröet till allt som följer.",
        },
        {
          pretitle: "Steg två · Descartes sats",
          title: "Krökningar, låsta i algebra",
          body: "Skriv varje cirkels krökning som k = 1/r, med en konvention: om en cirkel omsluter de andra (den yttre), ta dess krökning negativ. I sin korrespondens 1643 med prinsessan Elisabeth av Böhmen visade Descartes att för fyra ömsesidigt tangenta cirklar uppfyller krökningarna (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Att lösa andragradsekvationen för den fjärde krökningen ger k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). De två tecknen är precis Apollonius två svar: +-tecknet ger den lilla inskrivna cirkeln, −-tecknet ger den andra tangenta cirkeln på motsatt sida.",
        },
        {
          pretitle: "Steg tre · Rekursiv fyllning",
          title: "Varje mellanrum är ett nytt frö",
          body: "När frökvadrupeln väl är på plats är varje krökt triangulärt mellanrum självt begränsat av tre ömsesidigt tangenta cirklar — exakt den konfiguration vi började med. Släpp den inskrivna cirkeln i varje mellanrum med +-tecknet i Descartes formel. Den cirkeln delar sitt gamla mellanrum i tre nya, mindre krökta trianglar, och processen rekurserar. Fortsätt för evigt och unionen av alla cirklar du har ritat är den apolloniska packningen. Det överblivna stoftet har Lebesgue-mått noll, men Hausdorff-dimension cirka 1.3056867 — en sann fraktal, mellan en kurva och en yta.",
        },
        {
          pretitle: "Steg fyra · Heltalsöverraskningen",
          title: "När varje krökning är ett helt tal",
          body: "Välj de fyra frökrökningarna (k₁, k₂, k₃, k₄) att vara heltal. Då tvingar Descartes formel k₄ = k₁+k₂+k₃ ± 2√(…) varje efterföljande krökning att också vara ett heltal — kvadratroten kollapsar tack vare (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), och varje ny cirkel ärver heltaligheten från sina föräldrar. Packningen (−1, 2, 2, 3) fylls med krökningar 6, 11, 14, 15, 18, 23, … och varje annan heltals-apollonisk packning — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — gör samma sak. Vilka heltal som dyker upp och vilka som aldrig gör det är en öppen fråga inom aritmetisk geometri: ett dolt talteoretiskt skelett sittande inuti en bild av cirklar.",
        },
      ],
    },
    phi: {
      pretitle: "Tema · Geometri",
      title: "Gyllene snittet och Fibonacci",
      tagline: "En enkel rekursion. Förhållandet som gömmer sig överallt.",
      intro:
        "Utforskaren följer Fibonacci-sekvensen när dess konsekutiva förhållanden närmar sig φ, ritar den gyllene spiralen byggd av nästlade Fibonacci-kvadrater och låter dig luta solrosfyllotaxis-mönstret med den gyllene vinkeln. Tre vyer, ett tal — och skillnaden mellan var φ verkligen dyker upp och var infografiken översäljer det.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Den definierande ekvationen",
          title: "Ett tal lika med sin egen kvadrat minus ett",
          body: "Lös φ² = φ + 1. Den positiva roten är φ = (1 + √5) / 2 ≈ 1.6180339887. Den enda ekvationen innehåller nästan allt: dividera båda sidorna med φ och du får φ = 1 + 1/φ, så 1/φ = φ − 1 ≈ 0.6180339887. Reciproken är originalet minus ett — en egenskap inget annat positivt tal har. Den negativa roten är ψ = (1 − √5)/2 ≈ −0.6180, och paret (φ, ψ) är motorn bakom varje Fibonacci-identitet nedan.",
        },
        {
          pretitle: "Steg två · Fibonacci",
          title: "Addera de senaste två, för evigt",
          body: "Börja med F₀ = 0, F₁ = 1, itererera sedan Fₙ₊₁ = Fₙ + Fₙ₋₁: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Ta förhållandet mellan konsekutiva termer — 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619 — och det zoomar in på φ. Binets slutna form gör den gränsen exakt: Fₙ = (φⁿ − ψⁿ)/√5. Eftersom |ψ| < 1 förfaller ψⁿ-termen och Fₙ hamnar avrundningsnära φⁿ/√5 för varje n.",
        },
        {
          pretitle: "Steg tre · Den gyllene vinkeln och solrosor",
          title: "Varför en solros vrider sig 137.508° per frö",
          body: "Ta en skiva, placera frön ett efter ett och rotera med en fast vinkel mellan varje. Vogels modell sätter frö n vid radien rₙ = c√n (så arean per frö är konstant) och vinkeln θₙ = n · α. Välj α = 360°/φ² ≈ 137.508° — den gyllene vinkeln — och fröna packas tätt utan luckor och utan föredragen riktning. Vilken rationell bråkdel av ett varv som helst skulle ställa upp efter några rotationer och lämna radiella luckor; φ är det sämst approximerbara irrationella talet, så mönstret upprepas aldrig. Solrosor, tallkottar, romanescobroccoli och bladen på många växter använder exakt detta knep.",
        },
        {
          pretitle: "Steg fyra · Hälsosam skepsis",
          title: "Var φ verkligen finns — och var den inte finns",
          body: "φ styr inte Parthenon, Mona Lisa eller Nautilusskalet, trots otaliga infografiker; dessa anpassningar är tveksamma i bästa fall och bekräftelsebias i värsta. Där φ ärligt dyker upp är i tillväxt och optimering: fyllotaxis (ovan), kedjebråksteori (φ = [1; 1, 1, 1, …] gör den till det långsammast konvergerande — det 'mest irrationella' — talet), och geometrin hos Penrose-täckningar och kvasikristaller, vars långdistansordning är byggd från φ. Verklig, vacker och snävare än affischerna antyder.",
        },
      ],
    },
    buffon: {
      pretitle: "Tema · Analys",
      title: "Buffons nål",
      tagline: "Släpp pinnar på randigt papper. π faller ut.",
      intro:
        "Georges-Louis Leclerc, greve av Buffon, ställde frågan 1733 och publicerade den 1777: släpp en nål på ett golv av parallella linjer och räkna korsningarna. Förhållandet ger tillbaka π — en konstant från cirklar som framträder ur raka nålar på rakt trä. Utforskaren simulerar släppen i realtid och låter dig se uppskattningen krypa mot π = 3.14159…",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Uppställningen",
          title: "Parallella linjer och en nål",
          body: "Dra parallella linjer på ett golv med avståndet d emellan. Ta en nål med längden ℓ, där ℓ ≤ d, och släpp den uppifrån så att dess mitt landar på en likformigt slumpmässig position och dess vinkel är likformig på [0, π]. Nålen korsar antingen en av linjerna eller inte. Det är hela uppställningen — två parametrar, en ja/nej-fråga, upprepad ett stort antal gånger.",
        },
        {
          pretitle: "Steg två · Sannolikheten",
          title: "Varför π dyker upp",
          body: "Integrera över mittpunktens vertikala förskjutning och vinkeln θ, och sannolikheten att nålen korsar en linje blir exakt P = 2ℓ / (πd). Skriv om: π = 2ℓn / (d·k), där n är det totala antalet släppta nålar och k är antalet som korsade en linje. π framträder ur raka nålar som faller på raka linjer eftersom vinkeln θ medelvärdesbildar en sinus — och en sinus, integrerad över en halvcirkel, bär hemligen π.",
        },
        {
          pretitle: "Steg tre · Långsam konvergens",
          title: "Lazzarinis misstänkta sex siffror",
          body: "Monte Carlo-felet avtar som 1/√n. För att fastställa tre decimaler av π behöver du i storleksordningen 10⁵ nålar, och även tio miljoner räcker långt ifrån för hög precision. År 1901 rapporterade den italienske matematikern Mario Lazzarini π ≈ 3.1415929 från endast 3408 kast — sex korrekta siffror, misstänkt nära den välkända approximationen 355/113. Han stannade nästan säkert i det lyckliga ögonblicket eller arrangerade experimentet för att landa där. Konvergensen är genuint långsam; Lazzarinis tal är för vackert för att vara ärligt.",
        },
        {
          pretitle: "Steg fyra · Buffons nudel",
          title: "Längden är allt som spelar roll",
          body: "Samma beräkning fungerar för ℓ > d, där flera korsningar per kast blir möjliga och den slutna formen är mer utarbetad. Mer slående är Buffons nudel: ta vilken plan kurva C med längd L som helst, hur tvinnad eller knäckt som helst, och släpp den på samma randiga golv. Det förväntade antalet korsningar är 2L / (πd), oavsett formen. Rak nål eller vridande nudel: bara längden räknas. Samma π, gömt i vilken kurva som helst.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Tema · Paradox",
      title: "Hilberts hotell",
      tagline: "Alltid plats för en till — även när fullt.",
      intro:
        "David Hilbert skisserade hotellet i en föreläsning 1924 och George Gamow förde det till allmänheten i sin bok från 1947, One, Two, Three… Infinity. Utforskaren animerar de fyra klassiska scenarierna — en gäst, k gäster, ℵ₀ gäster och ℵ₀ bussar med ℵ₀ gäster — och visar att ett redan fullbokat oändligt hotell kan absorbera dem alla.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Föreställ dig hotellet",
          title: "Oändligt många rum, vart och ett upptaget",
          body: "Hotellet har ett rum för varje räknetal: 1, 2, 3 och vidare för evigt. I natt är varje enskilt rum upptaget — en gäst i 1, en gäst i 2, en gäst i 17, en gäst i 10¹⁰⁰. Sunda förnuftet kallar detta 'fullt': det finns inget rum utan en gäst. Matematiken håller inte med, eftersom 'fullt' är en ändlig idé och rumsmängden här är räkneligt oändlig. Gästernas kardinalitet är ℵ₀, och ℵ₀ är inget tal — det är storleken på de naturliga talen.",
        },
        {
          pretitle: "Steg två · En ny gäst",
          title: "Skift n → n+1 och rum 1 blir ledigt",
          body: "En resenär knackar. Receptionisten meddelar en enda instruktion: varje gäst, flytta från rum n till rum n+1. Gästen i 1 går till 2, gästen i 2 går till 3 och så vidare; ingen blir förskjuten eftersom det alltid finns ett högre numrerat rum som väntar. Efter skiftet är rum 1 tomt och nykomlingen checkar in. Det 'fulla' hotellet var aldrig fullt i ändlig mening — det hade ℵ₀ + 1 = ℵ₀ hela tiden.",
        },
        {
          pretitle: "Steg tre · Oändligt många nya gäster",
          title: "Skicka gäst n till rum 2n; varje udda rum blir ledigt",
          body: "Nu kommer en räkneligt oändlig kö. Receptionisten ber varje befintlig gäst i rum n att flytta till rum 2n. Gäst 1 går till rum 2, gäst 2 till rum 4, gäst 3 till rum 6 — varje jämnt rum förblir upptaget och varje udda rum blir ledigt. Nykomlingarna fyller 1, 3, 5, 7, … i ordning, och alla har en nyckel. Detta är likheten ℵ₀ + ℵ₀ = ℵ₀: två kopior av de naturliga talen ryms inuti en kopia utan förlust.",
        },
        {
          pretitle: "Steg fyra · Oändliga bussar, oändligt många passagerare i varje",
          title: "Primtalspotenser absorberar ℵ₀ × ℵ₀",
          body: "En flotta av räkneligt oändligt många bussar rullar fram, var och en bärande räkneligt oändligt många passagerare. Skicka varje befintlig gäst från rum n till rum 2ⁿ — de upptar tvåpotenserna. För buss k (k = 1, 2, 3, …), låt pₖ vara det k-te udda primtalet (3, 5, 7, 11, 13, …) och skicka passagerare m till rum pₖᵐ. Buss 1 landar på 3, 9, 27, 81, …; buss 2 på 5, 25, 125, …; buss 3 på 7, 49, …. Enligt aritmetikens fundamentalsats är varje primtalspotens unik, så inga två gäster kolliderar. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Tema · Paradox",
      title: "Gabriels horn",
      tagline: "Ändlig volym, oändlig yta.",
      intro:
        "En form från 1641 som svalde varje intuition matematiker hade om oändligheten. Utforskaren kapar hornet vid ett variabelt x, ritar sidovyn och beräknar volymen och ytan i realtid — se en förbli tam och den andra springa iväg.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Formen",
          title: "Rotera y = 1/x runt axeln",
          body: "Ta kurvan y = 1/x för x ≥ 1 och snurra den runt x-axeln. Resultatet är ett smalt horn som flammar ut nära x = 1 och avsmalnar för evigt mot noll radie när x växer. Varje tvärsnitt vinkelrätt mot axeln är en skiva med radien 1/x. Hornet sträcker sig oändligt långt till höger, men vid varje punkt krymper dess bredd. Evangelista Torricelli beskrev figuren 1641 — tre decennier innan Newton och Leibniz hade analysen att luta sig mot.",
        },
        {
          pretitle: "Steg två · Beräkna volymen",
          title: "V = π — exakt",
          body: "Skär hornet i skivor med tjockleken dx och radien 1/x. Volymen av varje skiva är π · (1/x)² · dx. Lägg ihop dem alla från 1 till oändligheten: V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Ändlig. Hela det oändliga hornet skulle kunna fyllas till bredden med exakt π kubikenheter färg. Den konvergenta integralen ∫ 1/x² dx är vad som håller den begränsad — kvadraterna försvinner snabbt nog för att summan ska stabiliseras.",
        },
        {
          pretitle: "Steg tre · Beräkna ytan",
          title: "A = ∞ — exakt",
          body: "Den laterala ytarean är A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. Kvadratrotsfaktorn är alltid minst 1, så A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. Det är den harmoniska integralen, och den divergerar. Hur långt du än vandrar längs hornet fortsätter du lägga till lateral area, och totalsumman slutar aldrig växa. Ytan är oändlig — ingen ändlig mängd färg kommer att täcka den.",
        },
        {
          pretitle: "Steg fyra · Målarens paradox",
          title: "Fyll det; måla det aldrig",
          body: "Så här är gåtan: häll i π enheter färg och hornet är fullt — inklusive dess innervägg. Ändå skulle du behöva oändligt mycket för att täcka utsidan. Torricelli fann resultatet kontraintuitivt redan innan analysen existerade för att namnge tricket. Den moderna lösningen är att 'målning' antar ett lager med en tjocklek ε ≠ 0, vilket över en oändlig yta kräver oändlig volym. Släpp det antagandet och paradoxen löses upp: den matematiska 'färgen' inuti har tjockleken noll på väggen, och innerväggen är samma oändliga yta som utsidan. Namnet kommer senare — ärkeängeln Gabriels horn, blåst för att tillkännage domedagen.",
        },
      ],
    },
    cantor: {
      pretitle: "Tema · Paradox",
      title: "Cantors diagonalargument",
      tagline: "Oändligheten kommer i storlekar.",
      intro:
        "Georg Cantors diagonalargument från 1891 är det renaste beviset i matematiken för att vissa oändligheter är större än andra. Utforskaren animerar konstruktionen i realtid: välj vilken som helst listning av decimaler i [0,1] och se ett nytt reellt tal kliva ut ur diagonalen — ett som inte kan stå på din lista, oavsett hur smart du ordnade den.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Att sätta upp det omöjliga",
          title: "Anta att de reella kan listas",
          body: "Cantors bevis sker genom motsägelse. Anta att de reella talen mellan 0 och 1 är räkneliga — det vill säga att de kan ordnas i en oändlig sekvens r₁, r₂, r₃, …, där varje reellt tal förekommer någonstans på listan. Lägg märke till att vi aldrig säger i vilken ordning: argumentet måste fungera för varje ordning du möjligen kan hitta på. Om vi kan hitta ett enda reellt tal som listningen missade är antagandet att någon sådan fullständig listning existerar dött.",
        },
        {
          pretitle: "Steg två · Att läsa diagonalen",
          title: "En siffra i taget, nerför trappan",
          body: "Skriv varje rₙ som en decimalutveckling 0.d_{n,1} d_{n,2} d_{n,3} …, så att d_{n,k} är den k-te siffran i det n-te reella talet. Läs nu rakt ner längs diagonalen: d_{1,1}, sedan d_{2,2}, sedan d_{3,3} och så vidare. Bygg ett nytt tal s = 0.s₁ s₂ s₃ … genom att välja varje siffra sₙ så att den skiljer sig från d_{n,n}. Ett säkert recept är att byta 5 ↔ 6 (varje regel som undviker 0 och 9 går runt 0.999… = 1.000…-tvetydigheten).",
        },
        {
          pretitle: "Steg tre · Varför s saknas",
          title: "Annorlunda i den n-te siffran, varje gång",
          body: "Genom konstruktion skiljer sig s från r₁ i första decimalen, från r₂ i andra, från r₃ i tredje — från rₙ i den n-te, för varje n. Så s kan inte vara lika med något rₙ på listan. Ändå är s ett fullt godtagbart reellt tal i [0, 1]. Listan skulle innehålla varje sådant reellt tal, och här är ett som missades. Antagandet kollapsar: ingen listning av de reella kan vara fullständig. De reella mellan 0 och 1 är oräkneliga.",
        },
        {
          pretitle: "Steg fyra · En ny sorts oändlighet",
          title: "Kontinuum, stopp, Gödel — samma diagonal",
          body: "De reella har kardinalitet strikt större än de naturliga: |ℝ| = 2^ℵ₀ = c > ℵ₀. Samma diagonaltrick driver Turings bevis att stopproblemet är oavgörbart och Gödels första ofullständighetssats — båda bygger en sats som motsäger varje post på en lista av kandidater. Cantor frågade sedan om någon kardinalitet bor strikt mellan ℵ₀ och c. Detta är kontinuumhypotesen. Gödel (1940) och Cohen (1963) visade tillsammans att den är oberoende av ZFC: anta den sann och axiomen förblir konsistenta; anta den falsk och axiomen förblir konsistenta. Matematiken lämnar, i denna fråga, dörren öppen.",
        },
      ],
    },
    boids: {
      pretitle: "Tema · Beräkning",
      title: "Boids",
      tagline: "Tre lokala regler. En hel flock.",
      intro:
        "Craig Reynolds gav varje simulerad fågel tre små instinkter 1986 och släppte dem lösa — ingen ledare, ingen global plan, ingen delad karta. Ur dessa tre lokala drifter uppstod en flock. Utforskaren låter dig finjustera de tre reglerna i realtid och se hela koreografin ringla utåt.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Agenten",
          title: "En prick med en riktning",
          body: "Varje boid är en liten rörlig punkt: den har en position och en hastighet. Det är hela minnet varje agent bär. Den kan inte se hela flocken — bara den handfull grannar inom en liten uppfattningsradie. Det finns ingen karta, ingen ledare att följa, ingen meddelandeöverföring mellan agenter. Bara en position, en hastighet och det som är inom synhåll.",
        },
        {
          pretitle: "Steg två · De tre reglerna",
          title: "Separation, anpassning, sammanhållning",
          body: "Varje bildruta beräknar varje boid tre små styrvektorer från grannarna inom dess uppfattningsradie. SEPARATION: styr bort från varje boid som har kommit för nära, viktat efter hur nära. ANPASSNING: knuffa din hastighet mot grannarnas medelhastighet. SAMMANHÅLLNING: styr mot masscentrum för de grannar du kan se. De tre vektorerna summeras med vikter och adderas till hastigheten varje bildruta. Det är hela algoritmen.",
        },
        {
          pretitle: "Steg tre · Framväxt",
          title: "Ingen ledare, ingen plan, inget skvaller",
          body: "Med start från slumpmässiga positioner och slumpmässiga riktningar organiserar boidsen sig själva i täta flockar inom några sekunder. Strömmar bildas, delas runt hinder och förenas igen — exakt koreografin för verkliga stararmurmurationer, sardinbetbollar och fladdermussvärmar. Inget i programmet vet något om flockar. Flocken är vad de tre reglerna ser ut som från utsidan. Det är en av de renaste demonstrationerna av framväxt i hela datavetenskapen.",
        },
        {
          pretitle: "Steg fyra · Var det hamnar",
          title: "Från SIGGRAPH 1987 till natthimlen",
          body: "Reynolds kallade agenterna boids — kort för bird-oid object — och presenterade artikeln 'Flocks, Herds, and Schools: A Distributed Behavioral Model' vid SIGGRAPH 1987. Inom fem år animerade hans algoritm fladdermussvärmen i Batman Returns (1992) och gnu-stampeden i Lejonkungen (1994). Idag driver samma tre regler evakueringssimuleringar, forskning om robotsvärmar och koreografin för Intels ljusshower med 1000 drönare. Flockmodellen är ett syskon till partikelsvärmsoptimering — samma insikt, omfunktionerad för sökning.",
        },
      ],
    },
    aizawa: {
      pretitle: "Tema · Kaos",
      title: "Aizawa-attraktorn",
      tagline: "Lorenz märkligare, konstigare kusin.",
      intro:
        "Tre kopplade differentialekvationer drar en enda punkt genom 3D-rymden. Till skillnad från Lorenz fjäril viker sig banan här till en knuten, korghängslad torus med en lodrät tagg genom sitt hjärta — en av de visuellt mest distinkta sällsamma attraktorerna i kaosteorin.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Ekvationerna",
          title: "Tre ekvationer, sju parametrar",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Välj vilken startpunkt som helst. Integrera framåt i tiden med ett litet steg (Eulers metod fungerar; Runge–Kutta är bättre). Punkten ritar en kurva i rymden. Kör i tusentals steg och kurvan slingrar sig tillbaka till inom en armlängd från sig själv, sedan vrider den sig undan — upprepar sig aldrig exakt, stannar alltid inom en begränsad region. Det är den sällsamma attraktorn.",
        },
        {
          pretitle: "Steg två · Standardgeometrin",
          title: "Vas, korg, tagg",
          body: "Med Aizawas klassiska parametrar (a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1) slingrar sig banan kring en torus i nedre halvan av figuren, sedan loopar den upp genom en tunn lodrät hals och tillbaka ner i torusen på motsatt sida. Resultatet ser ut som en räfflad vas med en tråd som löper igenom. Från rätt vinkel ser den ut som en korg. Från en annan ser den ut som ett hjärta med en tagg. Det visuella är en del av varför Aizawa-attraktorn flydde läroböckerna: den fotograferar bättre än någon av de andra.",
        },
        {
          pretitle: "Steg tre · Att vrida reglagen",
          title: "Känslig geometri",
          body: "Aizawa är mer parameterrik än Lorenz, vilket ger den större känslighet för justering. Minska parametern c med 0.1 och taggen dras in i korgen. Öka d och looparna nedanför blir hårdare, tätare, som en tätare väv. Vissa parameterkombinationer kollapsar till en gränscykel (inget kaos längre); andra blåser upp till oändligheten. Den kaotiska regimen är ett smalt band av parameterrymden, och geometrin inom det bandet morfar kontinuerligt när du skjuter på reglagen.",
        },
        {
          pretitle: "Steg fyra · En liten familj",
          title: "Rössler, Thomas och vänner",
          body: "Aizawa är en post i en liten familj av sällsamma attraktorer med tre ekvationer som upptäcktes genom 1970- och 1980-talen. Rössler (1976) är ännu enklare — bara en enda ickelinjär term, och banan är en platt spiral med en vikande vridning, som en Möbius-rosett. Thomas cykliskt symmetriska attraktor använder bara sinusfunktioner och producerar en härva av kuber kopplade med kaotiska trådar. Alla tre lever i 3D med kontinuerliga banor — inget tidssteg, inget rutnät, ingen diskretisering, bara matematik som drar en punkt med sig.",
        },
      ],
    },
    dla: {
      pretitle: "Tema · Kaos",
      title: "Diffusionsbegränsad aggregation",
      tagline: "Slumpvandrare fryser vid beröring — och odlar koraller.",
      intro:
        "En fröpixel. En svärm partiklar, var och en på sin egen slumpvandring. I det ögonblick en vandrande partikel stöter på klustret fastnar den för alltid. Upprepa tio tusen gånger och en förgrenad dendrit blommar ur tomma intet — samma form som koppar tar när det elektroplateras, som lav tar på en vägg, som blixt lämnar på bar hud.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Uppställningen",
          title: "Ett frö och en dimma av vandrare",
          body: "Pixel-rutnätet är lekplatsen. Placera en enda svart pixel i mitten: fröet. Släpp nu en partikel på en slumpmässig plats långt från fröet. Partikeln utför en slumpvandring — varje steg väljer en av fyra riktningar likformigt — och fortsätter tills den antingen landar bredvid klustret (och blir en del av det) eller vandrar för långt bort (och glöms). Släpp nästa partikel. Och nästa. Tio tusen partiklar in och du har en bild.",
        },
        {
          pretitle: "Steg två · Fastsittningsregeln",
          title: "Beröring = frys, för evigt",
          body: "Det finns en regel. En vandrande partikel som blir granne med någon pixel i klustret förvandlas själv till en klusterpixel och slutar röra sig. Det är hela fysiken. Anledningen till att strukturen är grenig och inte klumpig är geometrisk: en vandrande vandrare är mycket mer sannolikt att fångas upp av en exponerad spets på klustret än att tråda sig ner i en djup fjord. Spetsar växer snabbare än dalar. Grenar bildas. Det inre svälter på nya ankomster.",
        },
        {
          pretitle: "Steg tre · Den fraktala dimensionen",
          title: "1.71 — oberoende av fröet",
          body: "Witten och Sander publicerade modellen 1981 och visade numeriskt att på ett 2D-gitter har det resulterande klustret fraktal dimension ≈ 1.71. Det är strikt mellan en kurva (dimension 1) och en fylld region (dimension 2), och — avgörande — beror inte på fröets form, gittertypen eller spawnradien. Olika fysiska processer som ytligt sett ser helt olika ut ger exakt samma dimension. Talet är universellt i samma mening som π är.",
        },
        {
          pretitle: "Steg fyra · Var det dyker upp",
          title: "Koppar, blixt, lav, nervceller",
          body: "Byt ut de abstrakta vandrarna mot kopparjoner i en sulfatlösning och slå på en ström; metallen avsätts på katoden i samma dendritiska mönster. Byt ut dem mot elektroner som läcker genom en dielektrisk och du får en Lichtenberg-figur — det blixtformade ärr som högspänning lämnar på trä, på akryl eller på en träffad människokropp. Byt ut dem mot luftburna sporer som landar på ett träd och du får silhuetten av en lavkoloni. Närhelst diffusion stöter på något oåterkalleligt klibbigt kan du förutsäga bilden från en regel.",
        },
      ],
    },
    langton: {
      pretitle: "Tema · Beräkning",
      title: "Langtons myra",
      tagline: "Två regler · tio tusen steg · en motorväg.",
      intro:
        "Placera en enda myra på ett oändligt rutnät av vita rutor. Två regler talar om för henne vad hon ska göra. Under de första tio tusen stegen ser spåret ut som kaos. Sedan — utan förvarning — växlar hon till ett perfekt periodiskt 104-stegsmönster som vandrar iväg mot oändligheten. Två regler, ett oförklarat framväxande mirakel.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Reglerna",
          title: "Två rader är hela programmet",
          body: "Det finns en myra vänd åt en av fyra riktningar, på ett oändligt kvadratiskt rutnät där varje cell är antingen vit eller svart. Varje tick: titta på cellen du står på. Om den är VIT: vänd den till svart, sväng 90° medurs, kliv ett steg framåt. Om den är SVART: vänd den till vit, sväng 90° moturs, kliv ett steg framåt. Det är hela specifikationen — Christopher Langton skrev ner den 1986. Det finns inget slumpmässigt tal, ingen grannskapsuppslagning, inga parametrar. Två rader.",
        },
        {
          pretitle: "Steg två · Tre regimer",
          title: "Enkel symmetri, sedan kaos, sedan…",
          body: "Kör myran från ett tomt rutnät och se. Under cirka 100 steg är spåret litet och bilateralt symmetriskt — reglerna är deterministiska, starten är tom, mönstret måste respektera båda axlarna. Kring steg 500 splittras symmetrin och spåret ser i princip slumpmässigt ut: en härva av svarta rutor utan synlig struktur på någon skala. Den fasen varar grovt tio tusen steg och frustrerade forskare i nästan ett decennium. Sedan börjar den tredje regimen.",
        },
        {
          pretitle: "Steg tre · Motorvägen",
          title: "En 104-stegs loop som driver för evigt",
          body: "Någonstans kring steg 10 000 — det exakta ögonblicket beror på det inledande bitmönstret men det är alltid nära där — låser myran sig i en upprepande 104-stegscykel som förflyttar henne två celler diagonalt varje loop. Utifrån sett ser det ut som om hon lägger ut en prydlig randig 'motorväg' bort mot hörnet. Hon kommer att följa den, ostörd, för evigt. Bunimovich och Troubetzkoy bevisade 1992 att oavsett vilken ändlig anordning av svarta celler du startar med är myrans bana alltid obegränsad — hon kan inte fångas. Om motorvägen alltid dyker upp är fortfarande en öppen förmodan. Den har alltid gjort det hittills.",
        },
        {
          pretitle: "Steg fyra · Varför det spelar roll",
          title: "Universalitet, gömd i två rader",
          body: "Ta myran och ersätt 'två färger' med 'n färger' och en annan svängregel per färg. Några av dessa generaliserade myror är Turing-fullständiga — Gajardo, Moreira och Goles bevisade det: du kan koda vilket datorprogram som helst i det inledande bitmönstret, och myrans bana är körningen av det programmet. Så ett system enkelt nog att rymmas på en servett är, i förklädnad, varje möjlig dator som någonsin kommer att byggas. Det är gåtan med cellulär framväxt i sin renaste form.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Tema · Geometri",
      title: "Pascals triangel (mod n)",
      tagline: "Färga efter delbarhet — en fraktal faller ut.",
      intro:
        "Pascals triangel är uppslagstabellen för binomialkoefficienterna C(n, k). Varje tal är bara summan av de två ovanför. Reducera varje post modulo ett primtal och det resulterande färgmönstret är en perfekt, oändlig fraktal. Varför? På grund av när minnessiffror inträffar i bas-p-addition.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Triangeln",
          title: "Tal från den enklaste regeln på jorden",
          body: "Skriv en 1 vid toppen. Under den är varje post summan av de två ovanför (behandla tomma positioner som noll). De första sex raderna: 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. Talen är binomialkoefficienterna C(n, k) — de räknar antalet sätt att välja k objekt från n. De dyker upp i sannolikhet, i algebra (utvecklingen av (a + b)ⁿ), i kombinatorik. De är också den enda ingrediens som behövs för att se en fraktal.",
        },
        {
          pretitle: "Steg två · Färga efter rest",
          title: "Mod 2: udda celler fyllda, jämna celler tomma",
          body: "Ersätt nu varje post med dess rest modulo 2 (dess paritet). Fyll i ettorna, lämna nollorna tomma och kliv tillbaka. Vad du ser är Sierpiński-triangeln — exakt, oändlig, genererad enbart genom att räkna. Ta vilket block som helst med 2^k rader och bilden är tre kopior av samma block med storlek 2^(k-1) arrangerade i en triangel, med ett hål i mitten. Samma självlika struktur går hela vägen ned.",
        },
        {
          pretitle: "Steg tre · Kummers sats",
          title: "Den gömda lagen: räkna minnessiffrorna",
          body: "Varför faktorerar Pascal mod p sig själv så rent? År 1852 bevisade Kummer ett uppseendeväckande faktum. Den högsta potensen av ett primtal p som delar C(n, k) är lika med antalet minnessiffror som inträffar när du adderar k och (n − k) i bas p. Så C(n, k) är delbart med p (mod 0) exakt när det finns minst en minnessiffra; det är icke-noll mod p exakt när k kan adderas till (n − k) i bas p utan minnessiffra — dvs. när varje bas-p-siffra i k är högst motsvarande bas-p-siffra i n. Fraktalen är, i hemlighet, en bild av när bas-p-addition är ren.",
        },
        {
          pretitle: "Steg fyra · Andra primtal",
          title: "Olika p, olika packning",
          body: "För p = 3 får du en triangulär packning med tre färger och en 3-faldig självlik struktur. För p = 5 är perioden 5; för p = 7 är packningen ännu tätare. När p växer närmar sig den fraktala Hausdorff-dimensionen 2 — bilden fylls upp. För icke-prima moduli existerar strukturen men blir oregelbunden (Kummers rena minnessiffraräkning fungerar bara för primtal). En enkel kombinatorisk tabell, en oändlig familj av fraktaler.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Tema · Analys",
      title: "Stern–Brocot-trädet",
      tagline: "Varje bråk, exakt en gång — byggt genom att addera dåligt.",
      intro:
        "Börja med 0/1 och 1/0 — de två omöjligheterna. Skjut in ett nytt bråk emellan genom att addera täljarna och nämnarna separat, så som ett barn skulle göra. Upprepa för evigt. Det oändliga träd du bygger innehåller varje positivt bråk en gång, i sin lägsta form — och vägen till varje är exakt dess kedjebråksutveckling.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Medianten",
          title: "Addera delarna separat, få något nytt",
          body: "Ta två bråk, a/b och c/d. Deras mediant är (a + c) / (b + d). Detta är, naturligtvis, fel sätt att addera bråk. Men det producerar något intressant: ett bråk strikt mellan a/b och c/d. Börja med 0/1 och 1/0 (behandla 1/0 som +∞). Deras mediant är 1/1. Skjut in 1/1 mellan dem. Ta nu de nya paren: (0/1, 1/1) ger 1/2; (1/1, 1/0) ger 2/1. Skjut in båda. Upprepa. Bråken marscherar över talraden, var och en redan i sin lägsta form.",
        },
        {
          pretitle: "Steg två · Varje bråk, en gång",
          title: "Inget missas, inget upprepas",
          body: "Det är en sats — bevisbar på några rader — att Stern–Brocot-trädets grenar räknar upp de positiva rationella talen utan utelämnanden och utan upprepningar: varje förkortat bråk p/q landar på en och endast en nod, med täljare och nämnare redan relativt prima. Så trädet är samtidigt en fullständig katalog över de positiva rationella talen, ett vittnesbörd om att det bara finns räkneligt många, och ett strukturellt rättvist sätt att bygga dem. Stern (1858) och Brocot (1861) upptäckte samma träd oberoende av varandra — Stern som ett stycke talteori, Brocot som en urmakares verktyg för att välja kuggförhållanden.",
        },
        {
          pretitle: "Steg tre · Kedjebråksvägen",
          title: "Vänster och höger kodar utvecklingen",
          body: "Välj vilket positivt tal som helst — rationellt eller irrationellt. Vandra ner i trädet med start vid 1/1. Vid varje steg gå VÄNSTER om ditt mål är mindre än det nuvarande bråket, HÖGER om större. Skriv ner sekvensen av drag som en löplängdslista. Den listan är exakt kedjebråksutvecklingen av ditt mål. Till exempel: det gyllene snittet φ = (1+√5)/2 ≈ 1.618 producerar vägen H, V, H, V, H, V, … — alternerande en-och-en — som kodar kedjebråket [1; 1, 1, 1, 1, …]. φ är, i denna mening, det irrationella tal som är 'svårast' att approximera med rationella.",
        },
        {
          pretitle: "Steg fyra · Bästa approximationer",
          title: "Att stanna tidigt ger konvergenterna",
          body: "Stanna vandringen efter vilket ändligt antal steg som helst. Bråket du står på är en bästa rationell approximation av ditt mål — bättre än vilket rationellt tal som helst med mindre nämnare. Så sekvensen av bråk du besöker på väg till π ger dig 3, 22/7, 333/106, 355/113, 103993/33102 — de berömda konvergenterna som mänskliga kulturer fortsatte att återupptäcka genom århundradena. Samma konstruktion som räknar upp de rationella plockar också ut just de allra bästa.",
        },
      ],
    },
    ulam: {
      pretitle: "Tema · Analys",
      title: "Ulam-spiralen",
      tagline: "Primtal som ställer upp på diagonaler ingen helt kan förklara.",
      intro:
        "Stanisław Ulam, uttråkad under en föreläsning 1963, klottrade heltalen i en kvadratisk spiral och ringade in primtalen. Primtalen spreds inte. De trängdes längs synliga diagonaler. Varför primtal föredrar vissa kvadratiska former framför andra är ett av de djupaste olösta problemen inom talteorin — Ulam såg det på en servett.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Spiralen",
          title: "1 i mitten, sedan vandra i kvadrater",
          body: "Skriv 1 i centrum. Kliv åt höger för att skriva 2. Kliv uppåt för att skriva 3. Kliv åt vänster för 4 och 5. Kliv nedåt för 6, 7 och 8. Fortsätt i en utåtväxande kvadratisk spiral. När du har placerat hundra tal har du ett 10 × 10-rutnät där varje cell håller ett positivt heltal och heltal bredvid varandra på sidan inte längre är bredvid varandra på talraden. Det är hela konstruktionen.",
        },
        {
          pretitle: "Steg två · Färga primtalen",
          title: "Ett mönster som inte borde finnas där",
          body: "Fyll nu bara i de celler vars tal är primtal — lämna resten tomma. Om primtalen vore verkligen slumpmässiga bland heltalen skulle rutnätet se ut som likformigt skvätt, som statisk. I stället dras ögat längs tydliga diagonala linjer som strömmar tvärs över bilden. Mönstret är inte subtilt: även en trettio-gånger-trettio-lapp visar det redan. Ulam, Myron Stein och Mark Wells publicerade observationen 1964 med ett 65 000-talsrutnät tryckt över flera sidor i Scientific American.",
        },
        {
          pretitle: "Steg tre · Varför diagonaler",
          title: "Varje diagonal är ett polynom 4n² + bn + c",
          body: "Talen längs vilken diagonal som helst av Ulam-spiralen uppfyller en kvadratisk formel på formen 4n² + bn + c. En diagonal full av primtal betyder därför att polynomet är ovanligt primtalsrikt. Vissa är spektakulära. Eulers polynom n² − n + 41 — upptäckt 1772 — producerar primtal för varje n från 0 till 40, och motsvarar en synlig diagonalstrimma. Huruvida oändligt många primtal ligger på en sådan diagonal är, för någon specifik diagonal, obevisat. Bunyakovskys förmodan säger ja; ingen har visat det.",
        },
        {
          pretitle: "Steg fyra · Det djupare problemet",
          title: "En öppen fråga iklädd smink",
          body: "Ulam-spiralen är en kosmetisk omarrangering av heltalen, men de synliga diagonalerna kodar en djup öppen fråga: vilka kvadratiska polynom i ℤ[x] producerar oändligt många primtal? Flera Hardy–Littlewood- och Bateman–Horn-förmodanden förutsäger exakta densiteter för dessa primtal — de matchar bilden spektakulärt väl — men varje förutsägelse är villkorlig. Ulams klotter är ett fönster mot den envisaste delen av analytisk talteori, av en slump synlig för vem som helst med rutigt papper.",
        },
      ],
    },
    cardioid: {
      pretitle: "Tema · Geometri",
      title: "Kaffekoppens kardioid",
      tagline: "Ljuskurvan i din kopp är Mandelbrots hjärta.",
      intro:
        "Lys parallellt solljus på en cylindrisk kaffekopp. Reflektionerna från innerväggen fokuseras inte i en punkt — de omsluter en hjärtformad kurva som driver på kaffets yta. Den kurvan är kardioiden r = 2a(1 − cos θ). Exakt samma ekvation beskriver huvudlöken i Mandelbrotmängden. Varje morgon ritas den mest berömda formen inom dynamiken i ljus.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Optiken",
          title: "Varför ljus samlas i en kopp",
          body: "En cirkel reflekterar en horisontell stråle i två gånger vinkeln som ytan bildar med strålen — reflektionslagen. Så en bunt horisontella strålar som träffar insidan av en cylindrisk kopp solfjädras utåt med två gånger den lokala vinkeln. De konvergerar inte mot en enda fokalpunkt, eftersom krökningen varierar; i stället omsluter familjen av reflekterade strålar en jämn kurva. Matematikernas ord för detta hölje är en katakaustik. Katakaustiken hos en cirkel, belyst av parallella strålar, är exakt en kardioid.",
        },
        {
          pretitle: "Steg två · Ekvationen",
          title: "r = 2a (1 − cos θ)",
          body: "I polära koordinater centrerade vid ett valt hörn är kardioiden r(θ) = 2a(1 − cos θ). När θ = 0 är radien 0 (spetsen). När θ = π är radien 4a (den bortre spetsen). Kurvan spåras av en punkt på kanten av en cirkel med radien a som rullar runt utsidan av en fast cirkel med samma radie — det är därifrån ordet kommer: cardia betyder hjärta. Det är en av de mest studerade algebraiska kurvorna inom klassisk analys.",
        },
        {
          pretitle: "Steg tre · Mandelbrots huvudlök",
          title: "Samma ekvation, ett helt annat universum",
          body: "Lämna nu optiken. Zooma in i Mandelbrotmängden z ↦ z² + c. Den stora hjärtformade klumpen i mitten — den största komponenten — är en kardioid. Exakt. Dess rand parametriseras av c(t) = (1/2)·e^(it) − (1/4)·e^(2it), och den ekvationen är algebraiskt en kardioid (i variabeln c). c-värdena inuti den löken motsvarar dynamik med en enda attraherande fixpunkt. Formen som dyker upp i en kopp och formen som dyker upp i iterationsteori är samma form — och det finns ingen enkel anledning till varför.",
        },
        {
          pretitle: "Steg fyra · Och de mindre lökarna",
          title: "En oändlig stege av påklistrade cirklar",
          body: "Huvudkardioiden i Mandelbrotmängden har mindre cirkulära skivor hängande på sig vid varje rationellt bråktal p/q. Varje skiva motsvarar dynamik där den attraherande cykeln har period q. Den största skivan, till vänster, har period 2; de två nästa har period 3; sedan fyra skivor med period 4; och så vidare. Fraktalen vid Mandelbrotmängdens rand är precis randen mellan dessa stabila regioner och kaos. Kaffe, optik, komplex iteration, de djupaste objekten inom dynamiken — alla iklädda samma form.",
        },
      ],
    },
    galton: {
      pretitle: "Tema · Analys",
      title: "Galton-brädet",
      tagline: "Studsande bollar ritar alltid samma klocka.",
      intro:
        "Francis Galtons quincunx är en triangel av tappar. Släpp en kula från toppen: vid varje tapp avgör ett femtio-femtio myntkast om den viker av åt vänster eller höger, tills tyngdkraften släpper ner den i en av uppsamlingslådorna längs golvet. Släpp tio tusen kulor och lådorna fylls — alltid — i formen av normalfördelningen. Klockan är ingen tillfällighet. Det är centrala gränsvärdessatsen gjord taktil.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Apparaten",
          title: "En trappa av rättvisa myntkast",
          body: "Ett bräde med N rader av tappar förskjutna med en halv tapp. Släpp en kula in i toppen. Vid varje tapp den träffar studsar den vänster eller höger med lika sannolikhet — ett oberoende myntkast. Efter N tappar har kulan fallit i en av N + 1 uppsamlingslådor, där lådindexet är antalet höger-studsar minus antalet vänster-studsar, skiftat till att vara icke-negativt. En kula lär dig ingenting. Formen uppstår bara i gränsen.",
        },
        {
          pretitle: "Steg två · Pascal-landningen",
          title: "Lådantalen är binomiala",
          body: "Efter N rader är sannolikheten att kulan landar i låda k (numrerad 0 till N) C(N, k) / 2^N. Täljarna är posterna i rad N av Pascals triangel. Så ett Galton-bräde är, i hemlighet, en fysisk uppslagning av binomialkoefficienter. Med N = 10 får de centrala lådorna värdena 252, 210, 210 — och de yttersta lådorna får värdet 1 (endast en väg av alla 1024). Formen är redan en diskret klocka.",
        },
        {
          pretitle: "Steg tre · Centrala gränsvärdessatsen",
          title: "Klockan är oundviklig",
          body: "När N växer konvergerar den binomiala sannolikhetsmassafunktionen mot den gaussiska tätheten (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). Detta är de Moivre–Laplace-satsen (1733), det historiska första fallet av centrala gränsvärdessatsen. Den allmänna CLT säger mycket mer: ta VILKEN stokastisk variabel som helst med ändlig varians — bias, skevhet, fördelning åt sidan — och summera N oberoende kopior. Efter omskalning konvergerar summan mot en Gauss. Klockan är vad medelvärden alltid blir.",
        },
        {
          pretitle: "Steg fyra · Varför den dyker upp överallt",
          title: "Vilken summa som helst av många små knuffar",
          body: "Längder är gjorda av tusentals oberoende små bidrag. Det är även testresultat, IQ-poäng, mätfel, finansiella dagsavkastningar (under restriktiva antaganden). Var och en är en summa av många små oberoende stokastiska variabler, så var och en är ungefär gaussisk. Det är därför klockkurvor styr statistiken och varför standardavvikelsen har ett namn. Galton-brädet är det mest fysiska sättet att se satsen i arbete — vid 1000 kulor är klockan redan jämn, även om ingen kula individuellt vet något om den.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Tema · Kaos",
      title: "Den magnetiska pendeln",
      tagline: "Färga varje start efter dess vinnare — och en fraktal framträder.",
      intro:
        "Häng en järnpendel över tre magneter arrangerade i en triangel. Newtons lagar, magnetisk attraktion, en gnutta friktion — deterministiskt, allt av det. Och ändå har frågan 'vilken magnet hamnar den över?' inget jämnt svar. Färga varje startpunkt efter sin slutliga vinnare: röda, gröna och blå avrinningsområden, sammanflätade på varje skala.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Fysiken",
          title: "Tre dragningar, en dämpning, gravitation mot mitten",
          body: "Montera en liten järnvikt på en flexibel snöre ovanför en platta. Placera tre identiska magneter på plattan i en liksidig triangel. Pendeln dras mot varje magnet med en kraft proportionell mot 1/r² (eller 1/r³ för en invers-kubmodell — båda används i litteraturen; den kvalitativa fraktalen dyker upp för båda). En svag fjäder drar också pendeln tillbaka mot triangelns mitt. Luftmotstånd tappar stadigt energi. Rörelseekvationerna är deterministiska; det enda okända är startpositionen.",
        },
        {
          pretitle: "Steg två · Avrinningsområdena",
          title: "Tre regioner i startpunktsrymden",
          body: "Släpp pendeln från en startpunkt över plattan och integrera ekvationerna. Så småningom förfaller pendelns amplitud och den stabiliserar sig direkt över en av de tre magneterna — vinnaren. Upprepa för varje startpunkt i ett fint rutnät, färga varje efter sin vinnare: röd för magnet 1, grön för magnet 2, blå för magnet 3. Plattan är nu färgad i tre avrinningsområden. Varje avrinningsområdes inre är en prydlig färgad region. Randen är dock inte en kurva — den är en fraktal.",
        },
        {
          pretitle: "Steg tre · Den fraktala gränsen",
          title: "Varje randpunkt gränsar till alla tre färgerna",
          body: "Zooma in på randen mellan vilka två färger som helst och du finner den tredje färgen inflätad där. Zooma igen och du finner alla tre färgerna godtyckligt nära vilken randpunkt som helst. Detta är den definierande egenskapen hos ett Wada-bassäng — en topologisk monstrositet upptäckt av Yoneyama 1917 och sedan vapenformad av kaosteoretiker på 1990-talet. Determinismen förblir intakt: samma start → samma utfall. Men den minsta förändringen i startposition kan vända svaret till vilken av de tre magneterna som helst. Förutsägbarheten är borta.",
        },
        {
          pretitle: "Steg fyra · Varför detta spelar roll",
          title: "Kaos har en färg",
          body: "Den magnetiska pendeln är den renaste visualiseringen av känsligt beroende av begynnelsevillkoren i något klassiskt mekaniskt system. Samma sorts fraktala avrinningsområde dyker upp i lösare av Newtons metod (zooma in på randen av Newton-bassängerna för en kubik och du får samma bild), i modeller av det långsiktiga solsystemet, i kaotiska biljarder, i Lorenz-attraktorns stabila-fixpunkts-regimer. Varhelst konkurrerande attraktorer samexisterar tenderar deras avrinningsområdesränder att vara fraktala. Världen är full av dessa gömda gränser; den magnetiska pendeln låter dig bara se en.",
        },
      ],
    },
    godel: {
      pretitle: "Ämne · Paradox",
      title: "Gödels ofullständighet",
      tagline: "Matematiken kommer aldrig att bli fullständig.",
      intro:
        "Kurt Gödel, Wien, 1931. I varje konsistent formellt system rikt nog att uttrycka aritmetik finns det sanna utsagor som systemet självt inte kan bevisa. Utforskaren guidar dig genom Gödel-numrering och konstruktionen av den självrefererande satsen G som, i aritmetik, säger «jag är inte bevisbar».",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Hilberts dröm",
          title: "Mekanisera all matematik",
          body: "Tidigt 1900-tal. Whitehead och Russells Principia Mathematica (1910–1913) försökte härleda varje aritmetisk sats från ett enda torn av logiska axiom. David Hilbert begärde, i sitt Parisprogram 1900 och sedan i sin formalistiska offensiv på 1920-talet, ett ändligt, mekaniskt system där varje sann utsaga kunde bevisas och vars konsistens kunde bevisas inifrån. En fullständig, konsistent, avgörbar formell matematik. Vem som helst med papper och tålamod kunde, i princip, avgöra varje matematisk fråga. Det var drömmen.",
        },
        {
          pretitle: "Steg två · Gödel-numrering",
          title: "Aritmetik som talar om sig själv",
          body: "Gödels första drag var ett kodningstrick. Tilldela varje symbol i det formella språket ett nummer — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, parenteser, variabler och så vidare. Koda sedan en hel formel (s₁, s₂, …, sₖ) som det enda naturliga talet 2^s₁ · 3^s₂ · 5^s₃ · … med på varandra följande primtal. Genom primfaktoriseringens entydighet är kodningen reversibel. Bevis — sekvenser av formler — får också nummer. Plötsligt blir egenskaper som «x är ett bevis för y» aritmetiska predikat Prov(x, y) som det formella systemet kan uttrycka om sina egna utsagor.",
        },
        {
          pretitle: "Steg tre · Diagonaltricket",
          title: "G säger: «G är inte bevisbar»",
          body: "Med hjälp av diagonallemmat — direkt nedärvt från Cantors diagonalargument 1891 — konstruerade Gödel en sats G vars Gödel-nummer är ⌜G⌝, och som är aritmetiskt ekvivalent med ¬∃x Prov(x, ⌜G⌝): «inget tal x är ett bevis för formeln med Gödel-nummer ⌜G⌝». På klarspråk: G säger «jag är inte bevisbar i detta system». Nu kommer kniven. Om G är bevisbar, så bevisar systemet en falsk utsaga och är inkonsistent. Om G är obevisbar, så är det G påstår exakt sant — men systemet kan inte bevisa det. Hur som helst kollapsar Hilberts dröm om en fullständig konsistent aritmetik. Den andra ofullständighetssatsen följer nästan omedelbart: ett sådant system kan inte bevisa sin egen konsistens, för om det kunde, skulle det också bevisa G, vilket motsäger den första.",
        },
        {
          pretitle: "Steg fyra · Vart det spred sig",
          title: "Tarski, Turing, Church och varje bevisassistent sedan dess",
          body: "Samma diagonaltrick fortsätter att dyka upp. Alfred Tarski (1933) bevisade att sanning i aritmetik inte är definierbar inom aritmetik — sanningens odefinierbarhet. Alan Turing (1936) visade att stoppproblemet är oavgörbart genom att diagonalisera över Turingmaskiner. Alonzo Church (1936) bevisade att första ordningens logik själv är oavgörbar. Varje resultat är, strukturellt, en kusin till Gödels: ett system rikt nog att beskriva sig själv innehåller en fråga som det inte kan besvara om sig själv. Moderna bevisassistenter — Coq, Lean, Isabelle, HOL — verkar under Gödels gränser: de kan mekanisera enorma mängder matematik, men kan inte bevisa sin egen konsistens, och det finns konkreta talteoretiska utsagor (Goodsteins sats, Paris–Harrington) som är sanna och bevisligen obevisbara i Peano-aritmetik. Drömmen är borta; byggnaden är större än någonsin.",
        },
      ],
    },
    halting: {
      pretitle: "Ämne · Beräkning",
      title: "Stoppproblemet",
      tagline: "Inget program kan förutsäga varje annat program.",
      intro:
        "Alan Turing, 1936. Givet ett program P och en indata x, kan vi alltid avgöra om P stannar på x? Turing sade nej — och bevisade det med ett självrefererande diagonaltrick som ingen maskin kan undvika. Utforskaren kör en handfull leksaksprogram på ett litet band så att du kan se några avslutas, andra köra för evigt, och ett program — diagonalen D — vrida sig till den motsägelse som Turing skrev ned.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Frågan",
          title: "Stannar P på x?",
          body: "Givet källkoden för ett program P och en indata x, avgör om P till slut avslutas eller om det kör för evigt. Det låter som något en tillräckligt klyftig analysator alltid borde kunna avgöra — program är trots allt ändliga teckensträngar, och en dator kan simulera dem. David Hilbert frågade, i sitt Entscheidungsproblem 1928, efter exakt en sådan universell beslutsprocedur. I mitten av 1930-talet närmade sig Alonzo Church (via λ-kalkylen) och Alan Turing (via det vi nu kallar Turingmaskiner) samma svar från motsatta håll.",
        },
        {
          pretitle: "Steg två · Turings motsägelse",
          title: "Antag halts(P, x), bygg sedan D",
          body: "Antag, för motsägelse, att det existerar en total beräkningsbar funktion halts(P, x) som returnerar ⊤ när P stannar på indata x och ⊥ annars. Då kan vi skriva ett nytt program D(P): beräkna halts(P, P); om det returnerar ⊤, loopa för evigt; om det returnerar ⊥, stanna omedelbart. D är tillåtet — varje steg är beräkningsbart enligt antagandet. Fråga nu: vad returnerar halts(D, D)? Om halts(D, D) = ⊤, så loopar D enligt sin definition på indata D — alltså stannar D inte på D, vilket motsäger ⊤. Om halts(D, D) = ⊥, så stannar D på D — vilket motsäger ⊥. Vilket svar som helst bryter definitionen, så inget sådant halts kan existera. (Turing 1936, ‘On Computable Numbers, with an Application to the Entscheidungsproblem’.)",
        },
        {
          pretitle: "Steg tre · Diagonalisering i förklädnad",
          title: "Cantor, Gödel, Turing — samma drag",
          body: "Samma trick driver Cantors diagonal (bygg ett reellt tal som skiljer sig från det n-te listade reella talet i den n-te siffran), Gödels första ofullständighetssats (bygg en sats som säger ‘jag är inte bevisbar’) och Turings stoppargument (bygg ett program som gör motsatsen av vad avgöraren säger). Varje konstruktion lägger kandidaterna i en lista och läser nerför diagonalen för att smida ett objekt listan inte kan innehålla. Stoppproblemet var det första konkreta beslutsproblemet som bevisades vara oavgörbart — ögonblicket då beräkningens gränser blev en sats.",
        },
        {
          pretitle: "Steg fyra · Varför det spelar roll idag",
          title: "Rices sats och de praktiska följderna",
          body: "Rices sats (Henry Gordon Rice, 1953) generaliserar Turing: varje icke-trivial semantisk egenskap hos program — ‘returnerar det någonsin noll?’, ‘läcker det minne?’, ‘är det skadligt?’ — är oavgörbar. Statiska analysatorer måste därför approximera: de överrapporterar (falska positiva) eller underrapporterar (missade buggar), aldrig både rena och kompletta. Kompilatorer slår av med timeout vid optimering och vägrar inlina bortom en heuristik. Antivirusmotorer kan aldrig fånga all skadlig kod i allmänhet. Molnets autoskalare kan inte lova att ett inlämnat jobb stannar; de sätter ett tak på CPU-tid istället. Stoppproblemet är ingen kuriositet — det är väggen som varje program-om-program till slut springer in i.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Ämne · Beräkning",
      title: "P kontra NP",
      tagline: "Datavetenskapens största öppna fråga.",
      intro:
        "Vissa problem är lätta att lösa. Andra är lätta att kontrollera när någon räcker dig svaret. P kontra NP frågar om dessa två klasser i hemlighet är desamma — och ett ja skulle krossa modern kryptografi. Utforskaren är en liten 3-SAT-lösare som låter dig se varför verifiering är trivial men sökning brutal: släpp in en formel, följ sedan DPLL nerför backtracking-trädet medan den prövar tilldelningar och beskär hela grenar med en enda motsägelse.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Två klasser av problem",
          title: "Snabbt lösbara mot snabbt verifierbara",
          body: "P är klassen av beslutsproblem som en deterministisk maskin kan lösa i polynomiell tid — multiplicera två tal, sortera en lista, kontrollera om en graf är sammanhängande. NP är klassen där en polynomiell-tidsmaskin, givet en kandidatlösning, kan verifiera att svaret är korrekt. De två är inte uppenbart desamma. Sudoku är skolboksexemplet: att fylla i ett 9×9-rutnät är genuint svårt, men om en vän räcker dig ett färdigt rutnät kan du bekräfta varje rad, kolumn och box med ett enda linjärt svep. Det svåra är att hitta lösningen; det lätta är att kontrollera den.",
        },
        {
          pretitle: "Steg två · NP-fullständighet",
          title: "Cook 1971, Karp 1972, Levin oberoende",
          body: "År 1971 bevisade Stephen Cook Cook-Levins sats: varje problem i NP reduceras i polynomiell tid till boolesk satisfierbarhet (SAT). Leonid Levin publicerade samma resultat oberoende i Sovjetunionen. Ett år senare visade Richard Karp att 21 klassiska problem — 3-SAT, Hamiltonsk väg, klick, delmängdssumma, beslutsversionen av handelsresande — alla är polynomiellt-tids ömsesidigt reducerbara. Idag löper listan ut i tusental: N×N-sudoku, Tetris, generaliserad minröjare, även gittermodeller för proteinveckning tillhör samma ekvivalensklass. Lös ett effektivt och du har löst dem alla. Cook-Karp-Levin-reduktioner förvandlade en fråga om ett problem till en fråga om varje intressant sökproblem på en gång.",
        },
        {
          pretitle: "Steg tre · Tänk om P = NP?",
          title: "Kryptografin faller, biologin böjer sig, universum blir tråkigt",
          body: "En polynomiell-tidsalgoritm för 3-SAT skulle, sammansatt med Karp-reduktioner, knäcka RSA (faktorisering blir görbar), bryta elliptisk-kurv-kryptografi, dekryptera varje TLS-session som någonsin spelats in, och förfalska varje digital signatur. Proteinveckning skulle kollapsa till en polynomiell-tidsuppslagning. Optimal schemaläggning, optimal kompilatorregistertilldelning, optimal ruttplanering — alla NP-svåra problem som ingenjörer för närvarande approximerar — skulle ha exakta polynomiella lösningar. De flesta datavetare satsar emot: Scott Aaronsons enkät i fältet ger >80 % på P ≠ NP. Men varken ett bevis eller en motbevisning finns. Klassinnehållet vi känner till är P ⊆ NP ⊆ PSPACE ⊆ EXP, med P ⊊ EXP bevisat av tidshierarkisatsen — så minst en av dessa inklusioner är strikt, men ingen vet vilken.",
        },
        {
          pretitle: "Steg fyra · Miljondollarpriset",
          title: "Clays millennieproblem, 2000",
          body: "Clay Mathematics Institute utsåg P kontra NP till ett av de sju millennieprisproblemen i maj 2000, med en belöning på 1 000 000 dollar för en korrekt lösning åt vilket håll som helst. Det är det enda av de sju som direkt berör vardagsteknik. Dussintals falska bevis cirkulerar varje år — Vinay Deolalikars tillkännagivande 2010 var det mest framträdande färska försöket och föll samman inom veckor. Den gemensamma förväntan är att svaret är P ≠ NP. Den olösta frågan är inte vad svaret är, utan varför — och vilket fragment av matematiken som visar sig innehålla den rätta nedre-gränstekniken. Fyrtio plus år av barriärer (relativisering, naturliga bevis, algebrisering) säger att det inte kommer från någon metod vi för närvarande känner.",
        },
      ],
    },
    rsa: {
      pretitle: "Ämne · Beräkning",
      title: "RSA och envägsfunktioner",
      tagline: "Att multiplicera är lätt. Att faktorisera är omöjligt.",
      intro:
        "Rivest, Shamir och Adleman, 1977 — det första publicerade publika nyckelkryptosystemet och, nästan ett halvt sekel senare, fortfarande det som säkrar större delen av det fungerande internet. Utforskaren går igenom en komplett RSA-nyckelgenerering, kryptering och dekryptering på små tal så att du kan se varje steg: välj primtal, härled de publika och privata exponenterna, kryptera sedan ett meddelande och se hur samma matematik skalar av det igen.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Asymmetrin",
          title: "Envägsfunktioner: lätt framåt, svår bakåt",
          body: "Att multiplicera två enorma primtal p och q är snabbt — några millisekunder på en telefon. Att återvinna p och q ur deras produkt n = p · q är det inte: den bästa kända klassiska algoritmen (det allmänna talkroppssållet) körs i subexponentiell men superpolynomiell tid, och ett 2048-bitars n ligger bekvämt utom räckhåll för varje maskin som någonsin byggts. Denna envägsegenskap — billig framåt, ruinerande dyr bakåt — är grunden för publik-nyckelkryptografi. RSA klär upp asymmetrin så att en publik nyckel kan delas ut till vem som helst och endast innehavaren av den matchande privata nyckeln kan läsa vad som skrevs tillbaka.",
        },
        {
          pretitle: "Steg två · Nyckelgenerering",
          title: "Välj e, härled d via utökade Euklides",
          body: "Beräkna φ(n) = (p − 1)(q − 1), Eulers totientfunktion — antalet heltal i [1, n] som är relativt prima med n. Välj en liten publik exponent e relativt prim med φ(n); 65537 är det kanoniska valet eftersom det är prim, har endast två bitar satta och överlever varje känd lågexponentattack. Beräkna sedan den privata exponenten d = e⁻¹ mod φ(n) med den utökade Euklidiska algoritmen: den returnerar Bézout-koefficienter (x, y) med e·x + φ(n)·y = 1, och reducering av x mod φ(n) ger d. Den publika nyckeln är paret (n, e); den privata nyckeln är (n, d). Kasta bort p och q när d är i hand.",
        },
        {
          pretitle: "Steg tre · Kryptera och dekryptera",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Behandla klartexten m som ett heltal i [0, n). Chiffertexten är c = m^e mod n; dekryptering är m = c^d mod n. Anledningen till att det fungerar kommer direkt från Euler och Fermat: eftersom ed ≡ 1 mod φ(n) har vi m^(ed) = m^(1 + kφ(n)) ≡ m mod n för varje m relativt prim med n (Eulers sats), och ett kort argument med kinesiska restsatsen utökar identiteten till varje m i [0, n). Kvadrera-och-multiplicera förvandlar de enorma exponenterna till några tusen modulära multiplikationer — snabbt i praktiken, matematiskt exakt.",
        },
        {
          pretitle: "Steg fyra · Var det står idag",
          title: "Från TLS till postkvantmigrationen",
          body: "RSA är matematiken under varje TLS-handslag din webbläsare fortfarande förhandlar med ett RSA-certifikat, under SSH-värdnycklar, under kodsigneringskedjorna som autentiserar appar från Apple och Google, under elektroniska pass och de tidiga generationerna av blockkedjor. Men 1994 skrev Peter Shor ner en kvantalgoritm som faktoriserar heltal i polynomiell tid — givet en tillräckligt stor feltolerant kvantdator bryts RSA. Ingen sådan finns ännu, men tidslinjen är osäker nog att NIST har standardiserat postkvant-ersättningar (CRYSTALS-Kyber för nyckelutbyte 2024, CRYSTALS-Dilithium för signaturer) och den globala migrationen är redan i gång.",
        },
      ],
    },
    mobius: {
      pretitle: "Ämne · Geometri",
      title: "Möbiusband och Kleinflaska",
      tagline: "Ytor med bara en sida.",
      intro:
        "Ta en pappersremsa, ge den en halv vridning, limma ihop ändarna — och du har en yta med en sida och en kant. Utforskaren renderar ett roterande 3-D Möbiusband som du kan skära längs olika förhållanden för att se vad som faller ut: skär längs mitten och det förblir i ett stycke; skär längs tredjedelen och du får två ihopflätade ringar. En knapp växlar till Kleinflaskan, den slutna analogen som behöver fyra dimensioner för att leva utan att korsa sig själv.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Halvvridningen",
          title: "Limma ändarna med en vändning",
          body: "Ta en rektangulär pappersremsa. Ge den ena änden en halv vridning (180°) innan du limmar fast den i den andra. Resultatet har en kant och en sida. Vandra längs den med en penna och du täcker vad som ser ut som båda 'sidorna' utan att någonsin korsa randen; spåra kanten och du återvänder dit du började efter att ha gått runt två varv. Upptäckt oberoende av August Ferdinand Möbius och Johann Benedict Listing 1858 — den första icke-orienterbara ytan som någonsin explicit skrevs ned. Dess Euler-karakteristik är χ = 0.",
        },
        {
          pretitle: "Steg två · Saxöverraskningar",
          title: "Vad saxen avslöjar om topologin",
          body: "Skär Möbiusbandet längs mitten. Det faller inte isär — du får ett längre band med två fulla vridningar (fyra halvvridningar), och avgörande nog är det bandet tvåsidigt igen. Skär ett Möbiusband en tredjedel in från ena kanten, och håll snittet parallellt med kanten hela vägen runt, och saxen färdas två varv innan slingan sluts: ut kommer två sammanflätade ringar — ett smalare, färskt Möbiusband (fortfarande med en halv vridning) och en längre tvåsidig ring med två halva vridningar (inte längre ett Möbiusband), länkade genom varandra. Topologin är full av sådana överraskningar — den globala vridningen gömd av lokal planhet.",
        },
        {
          pretitle: "Steg tre · Kleinflaskan",
          title: "Felix Klein, 1882",
          body: "Ta nu ett rör och limma ena änden mot den andra efter att ha trätt den genom rörets vägg — så att cirklarna matchas med motsatt orientering. I fyrdimensionellt rum är detta en helt slät, sluten, icke-orienterbar yta: ingen rand, ingen insida, ingen utsida. Felix Klein beskrev den 1882. I tre dimensioner tvingar trädningen röret att passera genom sig självt, så varje glas-Kleinflaska du någonsin sett är en immersion, inte en äkta inbäddning. Limma ihop två Möbiusband längs deras enda kanter och resultatet är exakt en Kleinflaska.",
        },
        {
          pretitle: "Steg fyra · Var de lever",
          title: "Från remdrifter till kemi",
          body: "Möbiusband dyker upp som transportband och skrivarremmar (slitaget fördelas över hela ytan, dubbel livslängd), som Max Bills Endless Ribbon-skulpturer, som Möbiusmotstånd som upphäver sin egen självinduktans, som supraledande mikrovågs-Möbiusvågledare — och, sedan 2003, som Möbius-aromatiska molekyler syntetiserade av Rainer Herges. Den välbekanta återvinningstriangeln är, strängt taget, ett Möbiusband med tre halva vridningar — fortfarande ensidigt, men mer vridet än det klassiska bandet med en halv vridning. Framför allt är Möbiusbandet och Kleinflaskan ingångarna till klassificeringen av ytor — satsen att varje sluten yta är bestämd upp till homeomorfi av kön, orienterbarhet och ett enda heltal χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Ämne · Geometri",
      title: "Eulers karakteristik",
      tagline: "V − E + F = 2, oavsett form.",
      intro:
        "Descartes skrev ned det 1639 och Euler återupptäckte det ett sekel senare: räkna hörnen, kanterna och sidorna på vilken konvex polyeder som helst och V − E + F är alltid 2. Utforskaren bläddrar genom de platonska och arkimediska kropparna och räknar V, E, F i realtid — du ser formeln hålla över kub, dodekaeder och fotboll. Böj sedan ytan runt en munk och se konstanten ändras.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Räkna hörn, kanter, sidor",
          title: "Konstanten som vägrar röra sig",
          body: "Ta en kub: 8 hörn, 12 kanter, 6 sidor. Subtrahera och addera: 8 − 12 + 6 = 2. Pröva en tetraeder: 4 − 6 + 4 = 2. Fotbollen — en stympad ikosaeder, tolv femhörningar och tjugo sexhörningar sydda längs sina kanter — har 60 hörn, 90 kanter, 32 sidor, och 60 − 90 + 32 = 2 igen. Bläddra genom varje platonsk och arkimedisk kropp grekerna någonsin ritade, och svaret är detsamma. Konstanten är inget sammanträffande.",
        },
        {
          pretitle: "Steg två · Topologi, inte geometri",
          title: "Pressa ihop kuben till en sfär",
          body: "Blås upp kuben tills den buktar ut till en perfekt sfär. Hörnen rundas av, de raka kanterna kröks, de plana sidorna puffar utåt — V − E + F är fortfarande 2. Detsamma gäller om du kramar den till en pannkaka, vrider den till ett ägg eller drar den till vilken form du vill, så länge du inte river, limmar eller slår ett hål. Talet beror endast på topologin. χ = 2 för varje form som topologiskt är ekvivalent med en sfär — för ytan av varje konvex polyeder, varje slät ovoid, varje potatis.",
        },
        {
          pretitle: "Steg tre · Hål sänker det",
          title: "Varje handtag kostar dig två",
          body: "Vira nu ytan runt en munk. Triangulera torusen hur du vill — V − E + F sjunker till 0. En dubbel torus, två munkar limmade sida vid sida, ger χ = −2. Regeln är χ = 2 − 2g, där g är antalet hål (könet). Varje handtag du syr på kostar dig 2. Eulers karakteristik mäter topologin i ett enda heltal: den talar om hur många hål en sluten yta har, oavsett hur den ritas eller sträcks.",
        },
        {
          pretitle: "Steg fyra · Varför det spelar roll",
          title: "Från fotbollar till Fieldsmedaljen",
          body: "Buckybollkemin tvingas av χ: varje fullerenbur byggd av femhörningar och sexhörningar måste innehålla exakt 12 femhörningar, eftersom sfärens Euler-karakteristik är 2. Buckminster Fullers geodetiska kupoler följer samma regel. 3D-utskriftens slicers använder V − E + F för att validera att ett nät är slutet och utskrivbart. Gauss-Bonnet relaterar den totala krökningen av en slät yta till 2π·χ, vilket binder samman geometri och topologi i en enda ekvation. Atiyah-Singers indexsats (Fieldsmedaljen 1966) är den moderna ättlingen till samma idé — och Lakatos Proofs and Refutations spårar de två sekel av specialfall som nästan bröt V − E + F = 2 och sedan stärkte den.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Ämne · Analys",
      title: "Königsbergs broar",
      tagline: "Sju broar, en omöjlig promenad.",
      intro:
        "Kunde du gå genom Königsberg, korsa varje bro exakt en gång och hamna där du började? Utforskaren låter dig pröva promenaden själv, se paritetsargumentet leva när du korsar varje bro, och lägga till eller ta bort broar för att göra promenaden möjlig.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Pusslet",
          title: "En promenad ingen kunde hitta",
          body: "Königsberg sträckte sig över floden Pregel med två öar och två flodbanker — fyra landmassor totalt — förbundna med sju broar. Stadsborna ställde en söndagspromenadfråga: kunde man ta en promenad genom staden som korsade varje bro exakt en gång och slutade där den började? Alla försökte. Alla misslyckades. Ingen kunde bevisa att det var omöjligt.",
        },
        {
          pretitle: "Steg två · Eulers reduktion",
          title: "Geometri blir topologi",
          body: "År 1736 gjorde Leonhard Euler något ingen hade gjort förut. Han ignorerade avstånd. Han ignorerade vinklar. Han ignorerade vilken bro som låg uppströms vilken. Han ritade de fyra landmassorna som fyra prickar och de sju broarna som sju kanter. Kartan blev en graf. Lägets problem — geometria situs — föddes, och med det både grafteorin och topologin.",
        },
        {
          pretitle: "Steg tre · Paritetsargumentet",
          title: "Varje landmassa behöver ett jämnt antal",
          body: "Varje gång du går in på en landmassa använder du en bro; när du går ut använder du en annan. Så varje landmassa behöver ett jämnt antal broar incident till sig — utom möjligen promenadens början och slut. Königsberg hade fyra landmassor, alla med ett udda antal broar. Fyra hörn av udda grad är två för många. Omöjligt.",
        },
        {
          pretitle: "Steg fyra · Grafteorins födelse",
          title: "Från en söndagspromenad till den moderna världen",
          body: "Samma paritetsargument driver nu GPS-routing, det kinesiska brevbärarproblemet (används för att optimera rutter för snöplogar, sopbilar och brevbärare) och DNA-assemblering — varje modern genomassembler vandrar en Eulersk väg genom en de Bruijn-graf. Andra världskriget förstörde två av Königsbergs broar; endast fem av de ursprungliga sju återstår. Den nuvarande grafen har exakt två hörn av udda grad, så idag är promenaden äntligen möjlig — men Euler är inte längre där för att ta den.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Ämne · Analys",
      title: "Fyrfärgssatsen",
      tagline: "Varje plan karta behöver högst fyra färger.",
      intro:
        "Varje karta ritad i planet kan färgläggas med högst fyra färger så att inga två regioner som delar en gräns får samma färg. Utforskaren låter dig bygga kartor och se en backtracking-färgläggningsalgoritm tilldela högst fyra färger — region för region, med det minsta giltiga valet varje gång.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Förmodan",
          title: "Francis Guthrie, 1852",
          body: "När han färglade en karta över Englands grevskap märkte den unge Francis Guthrie att fyra färger alltid tycktes räcka. Han frågade sin bror Frederick, som frågade deras lärare Augustus De Morgan, som frågade alla. Förmodan såg harmlös ut — och tröttade ut matematiker i 124 år. Flera publicerade bevis (Kempe 1879, Tait 1880) visade sig innehålla subtila luckor som ingen upptäckte på över ett decennium.",
        },
        {
          pretitle: "Steg två · Varför tre inte räcker, fem är för många",
          title: "Fyra är den skarpa gränsen",
          body: "Tre färger räcker bevisligen inte — fyra ömsesidigt angränsande regioner kan redan ritas i planet (tänk på tre länder som möts vid ett hörn med ett fjärde som omringar dem). Femfärgssatsen, av Heawood 1890, är bevisbar på en sida med Eulers formel V − E + F = 2 och ett noggrant gradargument. Att stänga gapet från fem ner till fyra är vad som tog ytterligare åttiosex år.",
        },
        {
          pretitle: "Steg tre · Appel-Hakens bevis, 1976",
          title: "Den första satsen bevisad av dator",
          body: 'Kenneth Appel och Wolfgang Haken vid University of Illinois reducerade problemet till en ändlig lista av 1834 "oundvikliga konfigurationer" — och visade sedan att var och en är reducibel. Deras bevis kördes på en IBM 370 i cirka 1200 timmar. Många matematiker vägrade godta det: ett bevis som en människa inte kan läsa i sin helhet, argumenterade de, är inget bevis. University of Illinois matematikinstitutions utgående post frankerades med "Four Colors Suffice" i åratal.',
        },
        {
          pretitle: "Steg fyra · Var det står",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier och därbortom",
          body: "År 1996 förenklade Robertson, Sanders, Seymour och Thomas beviset till 633 konfigurationer och ett renare urladdningsargument. År 2005 mekaniserade Georges Gonthier hela beviset inuti bevisassistenten Coq — varje logiskt steg, inklusive fallanalysen, maskinverifierat från början till slut. Satsen driver nu frekvenstilldelning i mobilnät, registertilldelning i kompilatorer, och schemaläggnings- och tidtabellsproblem varhelst konflikter bildar en plan graf.",
        },
      ],
    },
    smallworld: {
      pretitle: "Ämne · Analys",
      title: "Sex grader och små världar",
      tagline: "Vilka två människor som helst, sex handskakningar isär.",
      intro:
        "Stanley Milgram skickade brev till främlingar och fann att, i genomsnitt, sex vidarebefordringar fick dem tvärs över Amerika. Fyrtio år senare visade Watts och Strogatz varför: ett stänk slumpmässiga genvägar på ett annars regelbundet nätverk kollapsar den genomsnittliga väglängden utan att röra lokal klustring. Utforskaren låter dig ställa in Watts-Strogatz omkopplingssannolikhet p och se den genomsnittliga väglängden L kollapsa i realtid.",
      ctaInteractive: "→ Öppna Utforskaren",
      sections: [
        {
          pretitle: "Steg ett · Brevexperimentet",
          title: "Milgram, 1967",
          body: "Stanley Milgram, då vid Harvard, skickade brev till slumpmässiga människor i Omaha och Wichita och bad dem att vidarebefordra brevet, hand till hand, till en målbörsmäklare i Boston — men endast via någon de personligen kände på förnamn. De flesta breven kom aldrig fram. De som gjorde det hade i snitt ungefär sex länkar från avsändare till mål. Popkulturfrasen «sex grader av separation» föddes. Genvägen: samhället har nav, och naven sköter större delen av rutningen.",
        },
        {
          pretitle: "Steg två · Watts och Strogatz, 1998",
          title: "Omkoppling med sannolikhet p",
          body: "Börja med ett ringgitter: N noder på en cirkel, var och en kopplad till sina k närmaste grannar på vardera sida. Grafen har hög klustring C — dina vänner är varandras vänner — men en lång genomsnittlig väglängd L av storleken N/k. Koppla nu om varje kant med sannolikhet p till en slumpmässig destination. När p stiger från 0 kollapsar L logaritmiskt medan C knappt rör sig. Några få slumpmässiga genvägar krymper världen. Sweet spot, runt p ≈ 0,01 till 0,1, är smal-världs-regimen: hög C som ett gitter, låg L som en slumpgraf.",
        },
        {
          pretitle: "Steg tre · Var världen verkligen är liten",
          title: "Filmer, hjärnor, elnät, webben",
          body: "Akademiska samarbetsgrafer gav oss Erdős-talet; Hollywood gav oss Bacon-talet (spelet «Six Degrees of Kevin Bacon»). Masken C. elegans har en perfekt kartlagd 302-neuron-hjärna med smal-världs-konnektivitet; mänskliga konnektom uppvisar samma signatur i mycket större skala. Elnät, Internet, citeringsnätverk, Wikipedias länkgraf, proteininteraktionsnätverk — smal-världs-regimen dyker ständigt upp varhelst någon bryr sig om att mäta L och C. Världen är liten, strukturellt, nästan överallt.",
        },
        {
          pretitle: "Steg fyra · Konsekvenser",
          title: "Snabb spridning, smart sökning, sjuka hjärnor",
          body: "I smal-världs-nätverk når virus, rykten och idéer alla snabbt — underbart för innovationsdiffusion, fruktansvärt under en pandemi. Kleinberg (2000) bevisade att decentraliserad girig sökning lyckas på små världar endast när genvägsfördelningen har rätt exponent, vilket förklarar varför Milgrams brevvidarebefordrare faktiskt kunde hitta målet. Och klinisk neurovetenskap använder nu smal-världs-koefficienter (σ, ω) som biomarkörer: Alzheimers och schizofreni uppvisar båda mätbara avvikelser från den friska smal-världs-signaturen.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Prova nu.",
    readyToFly: "Redo att flyga?",
    yourTurn: "Din tur.",
    stepIntoIt: "Stig in.",
    buildWithOne: "Bygg med en enda sten.",
  },
};
