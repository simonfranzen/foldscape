import type { StoriesDict } from "./stories";

export const it: StoriesDict = {
  sectionLabels: {
    cathedral: "Cattedrale",
    atelier: "Atelier",
    resonance: "Risonanza",
    story: "Storia",
    explorer: "Esploratore",
    sandbox: "Sandbox",
    sound: "Suono",
  },
  pages: {
    mandelbrot: {
      pretitle: "Tema II · Caos",
      title: "L'insieme di Mandelbrot",
      tagline: "Eleva al quadrato e somma. Per sempre.",
      intro:
        "Uno degli oggetti più fotografati della matematica è la visualizzazione di una regola assurdamente semplice. Qui sotto: qual è la regola, cosa stiamo davvero guardando e un pulsante diretto verso l'Esploratore per quando vuoi volare.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La regola",
          title: "Scegli un numero complesso, poi itera",
          body: "Scegli un numero complesso qualsiasi c. Avvia una successione a z₀ = 0 e continua ad applicare zₙ₊₁ = zₙ² + c. Questa è l'intera regola. Poi facciamo una sola domanda sì/no: la successione resta limitata o finisce per fuggire all'infinito? L'insieme dei valori di c per cui la successione resta limitata — quello è l'insieme di Mandelbrot. Tutto il resto, immagine famosa inclusa, è solo una risposta colorata a quella domanda.",
        },
        {
          pretitle: "Passo due · Osservare l'orbita",
          title: "Tre punti, tre destini",
          body: "Aiuta vedere davvero la successione. Per un c profondo dentro l'insieme, l'orbita si stringe attorno a un piccolo anello e non lo lascia mai. Per un c appena fuori, l'orbita deriva verso l'esterno e poi esplode in una manciata di passi. Per un c proprio sul confine, l'orbita danza per sempre, senza mai stabilizzarsi né fuggire. I tre pannelli animati qui sotto mostrano questi tre regimi fianco a fianco.",
        },
        {
          pretitle: "Passo tre · Perché l'immagine è infinita",
          title: "Il confine non si semplifica mai",
          body: "Quando colori ogni c in base a quanto rapidamente la sua orbita fugge, il confine si accende. Il fatto sorprendente, dimostrato da Tan Lei e altri, è che il confine è autosimile in senso profondo — ovunque tu zoomi, trovi nuove minuscole copie dell'intera forma, circondate da filigrane che non si ripetono mai. Per questo l'Esploratore scende fino a uno zoom di 10¹⁰: c'è genuinamente qualcosa di nuovo a ogni scala.",
        },
        {
          pretitle: "Passo quattro · I punti fissi",
          title: "Dove si nasconde la matematica",
          body: "All'interno della grande cardioide centrale, l'iterazione converge a un singolo punto fisso. All'interno di ogni disco rotondo attaccato ad essa, l'iterazione converge a un 2-ciclo, poi a un 4-ciclo, poi a 8 — la stessa cascata di raddoppi di periodo della mappa logistica. L'insieme di Mandelbrot è, in senso preciso, una mappa di dove la storia della logistica è calma e dove diventa caotica. Due famosi sistemi caotici, un'unica immagine.",
        },
      ],
    },
    life: {
      pretitle: "Tema III · Computazione",
      title: "Il Gioco della Vita di Conway",
      tagline: "Quattro regole. Ne seguono universi.",
      intro:
        "Martin Gardner presentò le regole di Conway nella sua rubrica di Scientific American dell'ottobre 1970. Due pagine di rivista, quattro righe di regole, e una comunità di matematici ha passato cinquant'anni a scoprire ciò che già vi era contenuto. La Sandbox ti consente di disegnare ed eseguire qualsiasi schema — ma prima, le quattro regole in azione.",
      ctaInteractive: "→ Apri la Sandbox",
      sections: [
        {
          pretitle: "Passo uno · Le regole",
          title: "Nascita, sopravvivenza, morte — e nient'altro",
          body: "La griglia è infinita, ogni cella è viva o morta, e ogni cella guarda i suoi otto vicini. Se una cella morta si trova circondata da esattamente tre vicini vivi, si accende; se una cella viva ne ha già due o tre attorno, passa intera al passo successivo. Ogni altro caso — troppo pochi vicini, troppi vicini, nessun vicino — uccide la cella. Le quattro demo animate qui sotto mostrano ciascuna regola in azione su una griglia cinque per cinque.",
        },
        {
          pretitle: "Passo due · Dalle regole al movimento",
          title: "L'Aliante cammina",
          body: "Uno schema di cinque celle, l'Aliante, è la cosa mobile più piccola in Life. Osservalo avanzare. Dopo quattro generazioni è tornato alla forma originaria, ma spostato di una cella in diagonale. Così funziona il movimento in un mondo che non ha il concetto di movimento: una forma che, dopo qualche applicazione delle regole, si ritrova uguale a se stessa altrove.",
        },
        {
          pretitle: "Passo tre · Dal movimento alla computazione",
          title: "Gli alianti trasportano informazione",
          body: "Se un aliante si muove, può essere indirizzato. Se può essere indirizzato, può collidere con altri alianti. Dalle collisioni si possono costruire AND, OR, NOT — e da quelli, ogni circuito booleano. Sono state costruite macchine di Turing, simulatori di Game of Life e interi calcolatori programmabili interamente da alianti accuratamente disposti. La Sandbox contiene il preset della Pistola di Alianti di Gosper: uno schema che spara un aliante ogni trenta generazioni, per sempre.",
        },
        {
          pretitle: "Passo quattro · Cosa ci dice questo",
          title: "La complessità non richiede regole complesse",
          body: "L'affermazione più profonda è filosofica. Life mostra che una struttura elaborata — movimento, replicazione, computazione, persino coscienza, se credi alle versioni forti — può risiedere dentro una regola abbastanza piccola da scrivere su una cartolina. È la stessa lezione che NAND offre alla logica e la Regola 110 agli automi cellulari. Una piccola primitiva, applicata con disciplina, basta.",
        },
      ],
    },
    nand: {
      pretitle: "Tema · Logica",
      title: "La barra di Sheffer",
      tagline: "Una sola porta basta per tutta la logica digitale.",
      intro:
        "La porta NAND è l'hardware di calcolatore più semplice che si possa tenere in mente. Il Costruttore ti consente di passare da una porta all'altra e di vedere il loro scheletro NAND aggiornarsi in tempo reale.",
      ctaInteractive: "→ Apri il Costruttore",
      sections: [
        {
          pretitle: "Passo uno · La porta",
          title: "Quattro righe, fissate nel 1913",
          body: "La barra di Henry Sheffer (a ↑ b) è la negazione dell'AND. Restituisce 1 a meno che entrambi gli ingressi siano 1. L'articolo di Sheffer del 1913 mostrò che questo unico operatore — insieme a costanti e variabili — può esprimere qualunque proposizione della logica booleana classica. Charles Sanders Peirce aveva silenziosamente annotato lo stesso fatto in un manoscritto inedito trent'anni prima; entrambi sono giunti al risultato indipendentemente.",
        },
        {
          pretitle: "Passo due · Costruire tutto il resto",
          title: "Stessa pietra, molte forme",
          body: "Il trucco è la composizione. Riporta l'uscita del NAND in un altro NAND, talvolta collegando una copia di un ingresso a se stesso, e le quattro porte classiche emergono quasi subito. NOT è un solo NAND. AND ne richiede due. OR tre. XOR quattro. Qualunque altra espressione booleana si può poi assemblare a partire da queste.",
        },
        {
          pretitle: "Passo tre · Perché ai chip importa",
          title: "Un mare di NAND nel silicio",
          body: "I transistor CMOS realizzano il NAND con quattro transistor — meno di quanti ne servano per AND o OR. Poiché ogni espressione booleana si riduce a NAND, i progettisti di chip spesso sintetizzano un intero circuito con nient'altro: una fila di celle NAND identiche, cablate in sommatori, multiplexer, memorie, fino a una CPU. Ogni calcolatore moderno è, fisicamente, la barra di Sheffer iterata qualche miliardo di volte.",
        },
        {
          pretitle: "Passo quattro · L'altro lato",
          title: "NAND ha vinto il chip, NOR ha vinto la Luna",
          body: "NOR (¬(a ∨ b)) è l'altra singola porta funzionalmente completa. L'Apollo Guidance Computer che portò gli umani sulla Luna fu costruito interamente con porte NOR. NAND vinse la corsa dei chip di consumo; NOR vinse la Luna. Due modi per costruire un universo — scegli una parte.",
        },
      ],
    },
    iota: {
      pretitle: "Tema · Computazione",
      title: "Il combinatore Iota",
      tagline: "Un solo simbolo, Turing-completo.",
      intro:
        "Iota è la più semplice base nota a un solo combinatore: una singola regola di riscrittura da cui discende ogni funzione calcolabile. Il Riduttore legge qualunque espressione SKI o Iota e la riscrive, passo dopo passo, fino alla sua forma normale.",
      ctaInteractive: "→ Apri il Riduttore",
      sections: [
        {
          pretitle: "Passo uno · Logica combinatoria",
          title: "Due lettere che calcolano tutto",
          body: "Negli anni Venti Moses Schönfinkel e Haskell Curry mostrarono che tutta la computazione poteva essere costruita a partire da due piccole regole. Chiamiamole S e K. Prendono altre cose come ingresso e le riarrangiano — nessuna variabile necessaria. Insieme formano il calcolo dei combinatori SKI, dimostrabilmente potente quanto qualunque lambda calcolo, qualunque linguaggio di programmazione, qualunque macchina di Turing.",
        },
        {
          pretitle: "Passo due · Un solo simbolo",
          title: "Iota di Chris Barker",
          body: "Nel 2001 Chris Barker trovò un singolo combinatore che contiene sia S sia K. Lo chiamò Iota (ι, ℩) e lo definì come ι x = x S K. Da quella singola riga, sia S sia K possono essere riderivati. Applica Iota a Iota in uno schema specifico, e ne esce S. Uno schema diverso restituisce K. Con nient'altro che il simbolo ι e parentesi, ogni funzione calcolabile può essere espressa.",
        },
        {
          pretitle: "Passo tre · La forma di una dimostrazione",
          title: "Universalità in un solo simbolo",
          body: "L'argomento è breve. La definizione di Iota dà x S K quando viene applicata a x. Scegli x con astuzia — Iota di nuovo, applicato a Iota, applicato a Iota — e lo srotolamento toglie strati finché resta solo K. Scegli un altro schema, e resta solo S. Poiché S e K insieme sono Turing-completi (Schönfinkel, 1924), e Iota produce entrambi, anche Iota da sola deve esserlo.",
        },
        {
          pretitle: "Passo quattro · Perché è importante",
          title: "Una ricevuta filosofica",
          body: "Iota non produce programmi veloci o leggibili — produce dimostrazioni di esistenza. Qualunque algoritmo scrivibile in qualunque linguaggio può essere codificato come espressione Iota. Il Riduttore nella stanza accanto ti consente di digitare un'espressione e di guardarla riscriversi, passo dopo passo, fino alla sua forma normale (quando ne esiste una). È la computazione nella sua forma più essenziale: un solo simbolo, una sola regola, l'intera matematica.",
        },
      ],
    },
    rule110: {
      pretitle: "Tema · Computazione",
      title: "Regola 110",
      tagline: "Una regola di otto bit, dimostrabilmente universale.",
      intro:
        "Un byte di regola, applicato a una fila di bit, basta a codificare qualunque computazione. Il Simulatore ti consente di cambiare regola, seme e velocità dal vivo.",
      ctaInteractive: "→ Apri il Simulatore",
      sections: [
        {
          pretitle: "Passo uno · L'impostazione",
          title: "Una fila di celle, una regola, ripeti",
          body: "Un automa cellulare elementare gira su una fila di celle, ciascuna delle quali è nera o bianca. La generazione successiva si disegna sotto: ogni cella guarda sé stessa e i suoi due vicini immediati — tre celle — e decide il proprio colore secondo una regola fissa. Otto possibili configurazioni di vicinato; per ciascuna, una risposta di un singolo bit. Otto bit = un byte = una delle 256 regole possibili. Stephen Wolfram le ha numerate da 0 a 255 in binario.",
        },
        {
          pretitle: "Passo due · Leggere la regola 110",
          title: "Otto schemi, un byte",
          body: "Scrivi gli otto schemi di tre celle in ordine binario decrescente: 111, 110, 101, …, 000. Sotto ciascuno scrivi il valore della cella centrale nella generazione successiva. Leggi la riga delle risposte come un singolo numero binario — per la regola 110 dà 01101110, cioè 110 in decimale. La regola è proprio quel byte.",
        },
        {
          pretitle: "Passo tre · Un solo pixel genera un universo",
          title: "Parti da un singolo punto",
          body: "Innesca la riga superiore con una singola cella nera, tutto il resto bianco. Applica la regola; disegna la generazione successiva sotto. Ripeti per qualche centinaio di righe. Con la regola 110 il risultato non è né il noioso tutto-nero/tutto-bianco di regole come la 0 o la 255, né il semplice Sierpiński della regola 90 — è un traffico permanente e mobile di alianti triangolari su uno sfondo a strisce, stratificato in qualcosa che genuinamente non si stabilizza mai.",
        },
        {
          pretitle: "Passo quattro · La dimostrazione di Cook",
          title: "È, dimostrabilmente, un calcolatore",
          body: "Alla fine degli anni Novanta Matthew Cook mostrò come disporre schemi di alianti specifici nella regola 110 in modo che le loro collisioni agissero come porte logiche — e poi come assemblare un sistema a tag ciclico funzionante, che è esso stesso Turing-completo. La dimostrazione è intricata, ma la conseguenza è limpida: questa regola di otto bit, applicata a una fila di bit, è universale. Qualsiasi calcolo tu possa fare, lo puoi fare nella regola 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Tema · Caos",
      title: "La mappa logistica",
      tagline: "Una formula innocente in cui l'ordine scivola nel caos.",
      intro:
        "Un modello tascabile per la popolazione del prossimo anno che, con una sola manopola ruotata, diventa il pezzo di caos più studiato della matematica. L'Esploratore ti consente di ruotare quella manopola in tempo reale.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La formula",
          title: "Una formula per la popolazione di domani",
          body: "L'equazione logistica del 1845 di Pierre-François Verhulst, campionata in tempo discreto, dà la mappa xₙ₊₁ = r · xₙ · (1 − xₙ). Leggi x come una frazione della capacità portante tra 0 e 1; r come il tasso di crescita. Il termine (1 − x) è il freno — troppi individui affamano la generazione successiva. Con 0 ≤ r ≤ 4 l'iterazione resta limitata.",
        },
        {
          pretitle: "Passo due · Dalla pace al caos",
          title: "Raddoppi, raddoppi, addio",
          body: "Per r sotto 1 ogni popolazione si estingue. Da 1 fino a 3 si assesta su un singolo punto fisso — una popolazione stabile. A r = 3 il punto fisso perde stabilità e si scinde in un 2-ciclo: quest'anno su, l'anno prossimo giù. A r ≈ 3.449 il 2-ciclo diventa un 4-ciclo, a r ≈ 3.544 un 8-ciclo, e i raddoppi si accumulano sempre più rapidamente fino a r ≈ 3.56995, dove il sistema cade infine nel caos.",
        },
        {
          pretitle: "Passo tre · La costante universale di Feigenbaum",
          title: "Un numero che viaggia tra sistemi",
          body: "Misura il rapporto tra le lunghezze di due intervalli di raddoppio successivi. Il numero che esce è δ ≈ 4.66920… — la costante di Mitchell Feigenbaum. Il fatto sorprendente è che la stessa costante compare in sistemi del tutto scorrelati: la mappa di Hénon, l'oscillatore di Duffing, persino nella convezione fluida sperimentale. Il raddoppio di periodo è una via universale al caos, e δ è la sua impronta digitale.",
        },
        {
          pretitle: "Passo quattro · Isole di ordine",
          title: "Dove la calma si nasconde dentro il caos",
          body: "All'interno del regime caotico il sistema improvvisamente torna a stabilizzarsi su un 3-ciclo stabile a r ≈ 1 + √8 ≈ 3.8284. Da lì raddoppia di nuovo — periodo 6, 12, 24 — e rientra nel caos. Il teorema di Li-Yorke rende rigoroso il finale: «periodo tre implica caos». L'articolo di Robert May del 1976, «Simple mathematical models with very complicated dynamics», ha messo l'intera storia davanti ai biologi. Da allora non se n'è più andata.",
        },
      ],
    },
    lorenz: {
      pretitle: "Tema · Caos",
      title: "L'attrattore di Lorenz",
      tagline: "Tre righe di codice, una farfalla.",
      intro:
        "Un modello giocattolo dell'atmosfera che ha accidentalmente inventato la teoria del caos. L'Esploratore integra le equazioni dal vivo e ti consente di guardare la traiettoria rifiutarsi di ripetersi.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Un'atmosfera giocattolo",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, meteorologo del MIT, stava cercando di simulare la convezione — aria scaldata dal basso, raffreddata dall'alto. Margaret Hamilton aveva programmato le precedenti simulazioni meteorologiche; Ellen Fetter eseguì i calcoli dietro il modello a tre equazioni. Ridusse il problema a tre variabili e tre equazioni. L'articolo del 1963, «Deterministic Nonperiodic Flow», sosteneva che anche questa drastica semplificazione potesse comportarsi in modo imprevedibile. L'articolo restò in larga parte non letto per un decennio.",
        },
        {
          pretitle: "Passo due · Le tre equazioni",
          title: "Tre righe accoppiate",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ è il numero di Prandtl, ρ il numero di Rayleigh, β il rapporto di forma geometrica. I famosi valori caotici sono σ = 10, ρ = 28, β = 8/3, fissati dallo stesso Lorenz. Cambia ρ e il sistema percorre un lungo catalogo di comportamenti — punti fissi, orbite periodiche, caos transitorio — prima di raggiungere la farfalla canonica.",
        },
        {
          pretitle: "Passo tre · La farfalla",
          title: "Un attrattore in 3D",
          body: "Integra in avanti nel tempo e la traiettoria gira attorno a due equilibri instabili, saltando tra essi in una sequenza che non si ripete mai. La forma, in tre dimensioni, sembra le ali di una farfalla — da qui il nome. L'attrattore non è una curva né una superficie; la sua dimensione di Hausdorff è circa 2.06. È un attrattore strano: denso in sé stesso, mai chiuso, frattale a ogni scala.",
        },
        {
          pretitle: "Passo quattro · Dipendenza sensibile",
          title: "Perché le previsioni del tempo hanno un orizzonte",
          body: "Prendi due punti iniziali che differiscono di una parte su centomila. Dopo poco tempo le due traiettorie sono completamente scorrelate. Lorenz formalizzò ciò come dipendenza sensibile dalle condizioni iniziali; l'esponente di Lyapunov dominante è positivo. In una conferenza del 1972 si chiese se «una farfalla che batte le ali in Brasile possa scatenare un tornado in Texas» — e diede la metafora che ha definito il campo. Il motivo per cui le previsioni meteorologiche decadono dopo circa due settimane è lo stesso esponente, nell'atmosfera reale.",
        },
      ],
    },
    fourier: {
      pretitle: "Tema · Analisi",
      title: "La trasformata di Fourier",
      tagline: "Ogni segnale è una somma di onde sinusoidali.",
      intro:
        "Uno dei fatti singoli più profondi della matematica — e il motore silenzioso di MP3, JPEG, Wi-Fi e MRI. L'Esploratore ti consente di aggiungere armoniche una alla volta e di vedere comparire un'onda quadra a partire da pure sinusoidi.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La pretesa di Fourier",
          title: "Conduzione del calore, 1822",
          body: "Joseph Fourier pubblicò la sua «Théorie analytique de la chaleur» nel 1822. Per risolvere l'equazione del calore avanzò una pretesa dal suono oltraggioso: qualunque funzione, continua o a salti, può essere scritta come somma di pure sinusoidi e coseni. I matematici del suo tempo non gli credettero. Ci volle mezzo secolo di raffinamento (Dirichlet, Riemann, Lebesgue) perché la pretesa si depositasse come teorema.",
        },
        {
          pretitle: "Passo due · La ricetta",
          title: "Somma di toni puri",
          body: "Per una funzione periodica: una serie di Fourier — una somma su frequenze discrete. Per una funzione integrabile arbitraria: una trasformata di Fourier f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — uno spettro continuo. Entrambe dicono la stessa cosa in modi diversi: un segnale nel tempo, per quanto complicato, si decompone in pure oscillazioni. Un accordo diventa le sue note. Una fotografia diventa le sue strisce.",
        },
        {
          pretitle: "Passo tre · Perché il tuo telefono funziona",
          title: "Nascosta dentro MP3, JPEG, MRI, Wi-Fi",
          body: "Identifica quali frequenze contano; butta via le altre; comprimi. MP3 conserva le bande udibili e scarta ciò che l'orecchio non può sentire. JPEG divide un'immagine in blocchi 8×8 e conserva le frequenze spaziali dominanti. Gli scanner MRI misurano fisicamente campioni nello spazio delle frequenze e antitrasformano via Fourier verso l'anatomia. Wi-Fi e 5G usano OFDM, impacchettando dati in parallelo su migliaia di frequenze portanti. La FFT di Cooley–Tukey (1965) ha reso tutto ciò abbastanza veloce da essere pratico.",
        },
        {
          pretitle: "Passo quattro · Lo scambio di incertezza",
          title: "Più nitido nel tempo, più sfocato in frequenza",
          body: "Schiaccia un segnale in una stretta finestra temporale e la sua trasformata di Fourier necessariamente si spalma su molte frequenze — e viceversa. Questo non è ingegneria; è matematica. La funzione gaussiana sta nell'ottimo dello scambio: è trasformata di Fourier di se stessa. La stessa disuguaglianza, in fisica, diventa il principio di indeterminazione di Heisenberg. Tempo e frequenza sono coordinate duali; non puoi rendere nitide entrambe nello stesso istante.",
        },
      ],
    },
    euler: {
      pretitle: "Tema · Analisi",
      title: "L'identità di Eulero",
      tagline: "Cinque numeri, una sola riga.",
      intro:
        "e^(iπ) + 1 = 0 — cinque costanti da cinque angoli diversi della matematica, serrate in un'unica uguaglianza. L'Esploratore della stanza accanto ti consente di vedere e^(iθ) percorrere il cerchio unitario in tempo reale, così puoi vedere, con i tuoi occhi, il momento in θ = π in cui l'identità accade davvero.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Le cinque costanti",
          title: "0, 1, e, i, π — cinque sconosciuti in una stanza",
          body: "Ciascuno dei cinque numeri arriva da un paese diverso. 0 è l'identità additiva — il nulla. 1 è l'identità moltiplicativa — l'unità. e ≈ 2.71828 è il tasso naturale della crescita composta, nato nell'analisi. i è l'unità immaginaria, definita da i² = −1, nata nell'algebra che cercava di risolvere equazioni cubiche. π ≈ 3.14159 è il rapporto fra la circonferenza di un cerchio e il suo diametro, nato nella geometria. Normalmente non si incontrano mai — eppure una sola equazione, lunga sei simboli, lega tutti e cinque con nient'altro che +, ·, = ed elevazione a potenza.",
        },
        {
          pretitle: "Passo due · La formula di Eulero",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "L'identità è ciò che la formula di Eulero restituisce per un singolo angolo scelto, pubblicata nella sua Introductio in analysin infinitorum del 1748. Per ogni numero reale θ, la formula dice che e^(iθ) — un esponenziale con esponente immaginario — è uguale a cos θ + i sin θ. Geometricamente: al crescere di θ, il punto e^(iθ) cammina in senso antiorario lungo il cerchio unitario nel piano complesso. Moltiplicare per e^(iθ) è una rotazione di angolo θ. Crescita e rotazione, le due cose che e e i fanno segretamente, risultano essere la stessa operazione vista da due lati.",
        },
        {
          pretitle: "Passo tre · Sostituisci θ = π",
          title: "La dimostrazione in una riga",
          body: "Poni θ = π nella formula di Eulero. Il membro destro diventa cos π + i sin π = −1 + i·0 = −1. Il membro sinistro è e^(iπ). Quindi e^(iπ) = −1, e sommando 1 a entrambi i lati si ottiene e^(iπ) + 1 = 0. Geometricamente, è un mezzo giro: partendo dal punto 1 sul cerchio unitario e ruotando di π radianti — 180° — si arriva esattamente a −1. L'identità è l'enunciato algebrico di quel singolo, perfetto mezzo giro.",
        },
        {
          pretitle: "Passo quattro · L'equazione più bella",
          title: "Perché i matematici la votano",
          body: "Richard Feynman, a quattordici anni, definì la formula di Eulero «la formula più notevole della matematica» — «il nostro gioiello» — nelle sue Lectures on Physics. Un sondaggio del Mathematical Intelligencer del 1990 nominò l'identità il teorema più bello della matematica; un sondaggio dei lettori di Physics World del 2004 la classificò accanto alle equazioni di Maxwell come la più grande equazione mai scritta. Il fascino è che usa ciascuna delle operazioni aritmetiche di base esattamente una volta (addizione, moltiplicazione, elevazione a potenza), ciascuna delle costanti di base esattamente una volta (0, 1, e, i, π), e non contiene nessun ingombro aggiuntivo. Poche equazioni sono così brevi, e nessuna è così spesso citata come prova che la matematica sia bella.",
        },
      ],
    },
    banach: {
      pretitle: "Tema · Paradosso",
      title: "Il paradosso di Banach–Tarski",
      tagline: "Taglia una palla, ne ottieni due.",
      intro:
        "Una palla solida, divisa in una manciata di pezzi, può essere riassemblata in due palle solide ciascuna identica all'originale — niente allungamenti, niente materia in più. L'Esploratore disegna il motore dietro il trucco: il gruppo libero F₂ di due rotazioni, il cui albero di Cayley autosimile contiene quattro copie spostate di sé stesso. Quella struttura ramificata è, quasi alla lettera, da dove esce la seconda palla.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'enunciato",
          title: "Una palla in entrata, due in uscita",
          body: "Prendi una palla solida B³ nello spazio tridimensionale. Il teorema di Banach–Tarski (1924) dice che puoi partizionarla in un numero finito di pezzi disgiunti — ne bastano cinque, e cinque è il minimo — applicare movimenti rigidi (rotazioni e traslazioni) a quei pezzi, e ritrovarti con due palle solide disgiunte, ciascuna congruente all'originale. Nulla viene stirato, deformato o duplicato; i pezzi sono semplicemente riarrangiati. La conclusione è, come pezzo di matematica pura, completamente rigorosa: B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Passo due · L'assioma della scelta",
          title: "Da dove entra la stranezza",
          body: "La costruzione è impossibile nella sola teoria degli insiemi ZF. La dimostrazione di Banach e Tarski richiede l'assioma della scelta per prelevare un rappresentante da ciascuna delle non numerabili orbite di un'azione rotazionale sulla sfera. Quell'unico uso della Scelta forza i pezzi a essere non misurabili: non hanno volume ben definito nel senso di Lebesgue, perciò l'equazione «volume di una palla = volume di due palle» non viene mai scritta. I pezzi non sono regioni che potresti mai ritagliare fisicamente — sono dense nuvole di punti non misurabili, esistenti solo come oggetti logici.",
        },
        {
          pretitle: "Passo tre · Il gruppo libero delle rotazioni",
          title: "F₂, generato da due rotazioni",
          body: "Il cuore della dimostrazione è puramente di teoria dei gruppi. Due rotazioni opportunamente scelte a e b della sfera unitaria S² non soddisfano alcuna relazione oltre a quelle banali: generano un gruppo libero F₂ di rango 2 — ogni parola ridotta in a, a⁻¹, b, b⁻¹ agisce come una rotazione diversa. F₂ ammette una decomposizione paradossale: si scinde in quattro insiemi W(a), W(a⁻¹), W(b), W(b⁻¹) (parole che iniziano con ciascun generatore) più l'identità, e ciascun insieme spostato copre il resto del gruppo. Spingi questo attraverso il paradosso della sfera di Hausdorff del 1914, solleva da S² alla palla solida, e la duplicazione sul gruppo diventa una duplicazione di B³.",
        },
        {
          pretitle: "Passo quattro · Perché non rompe il mondo",
          title: "Pezzi non misurabili, atomi del mondo reale",
          body: "La misura di Lebesgue è numerabilmente additiva sugli insiemi misurabili; se i pezzi fossero misurabili, il volume delle due palle in uscita dovrebbe essere uguale al volume della palla in entrata, contraddicendosi. Quindi il teorema ti dice cortesemente che i pezzi non possono essere misurabili — e in effetti non lo sono. Al mondo reale non importa: la materia fisica è un numero finito di atomi, non sottoinsiemi arbitrari di ℝ³, e non puoi effettuare un taglio lungo un confine non misurabile. Il paradosso vive interamente all'interno del continuo, dove l'infinito ha più spazio di manovra di quanto l'intuito consenta.",
        },
      ],
    },
    lsystem: {
      pretitle: "Tema · Geometria",
      title: "L-System",
      tagline: "Riscritture lettera per lettera che crescono in piante.",
      intro:
        "Un L-system è una piccola grammatica: una stringa iniziale, qualche regola di riscrittura e una tartaruga che trasforma lettere in linee. Nell'Esploratore modifichi l'assioma e le regole, fai scorrere la profondità di iterazione e guardi la tartaruga disegnare il frattale risultante — fiocchi di Koch, draghi, felci, curve di Hilbert — partendo da una manciata di caratteri.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Una stringa e tre regole",
          title: "Assioma, alfabeto, riscrittura",
          body: "Un L-system ha tre pezzi. Un alfabeto di simboli. Un assioma — una stringa iniziale. Un insieme di regole di produzione, una per simbolo, che dicono in cosa diventa ciascun simbolo nella generazione successiva. Il trucco fondante è il parallelismo: a ogni passo ogni simbolo viene riscritto simultaneamente, come ogni cellula in un corpo si divide tutta insieme. Aristid Lindenmayer, biologo ungherese a Utrecht, introdusse il formalismo nel 1968 per modellare la crescita cellula per cellula di alghe e piante. Nella variante più semplice (deterministica, libera dal contesto) le regole guardano un simbolo alla volta; le versioni sensibili al contesto guardano i vicini; le versioni stocastiche scelgono le regole a caso.",
        },
        {
          pretitle: "Passo due · L'interpretazione della tartaruga",
          title: "Una penna virtuale che fa crescere il frattale",
          body: "I simboli da soli sono solo testo. La geometria appare quando dai in pasto la stringa a una tartaruga: F significa avanza disegnando di un'unità, G significa anch'esso avanza disegnando, + ruota la direzione a sinistra di un angolo fisso, − ruota a destra. Altri due simboli impilano e ripristinano lo stato: [ inserisce la posizione e la direzione correnti su uno stack, ] le ripristina. Con solo push e pop, una singola stringa monodimensionale d'un tratto si ramifica — le coppie di parentesi diventano ramoscelli e steli laterali. I simboli fuori dall'alfabeto di disegno (X, Y, A, B …) sono variabili silenziose: portano avanti informazione attraverso le riscritture ma la tartaruga li ignora.",
        },
        {
          pretitle: "Passo tre · Esempi classici",
          title: "Quattro regole, quattro frattali",
          body: "Fiocco di neve di Koch: assioma F++F++F, regola F → F−F++F−F, angolo 60°. Quattro iterazioni e il triangolo si è increspato in un fiocco di neve. Curva del drago: assioma FX, regole X → X+YF+, Y → −FX−Y, angolo 90°; dopo una dozzina di riscritture si ripiega nel drago di Heighway. Punta di freccia di Sierpiński: A → B−A−B, B → A+B+A, angolo 60°, alterna la parità per spazzare il triangolo di Sierpiński. Pianta frattale: X → F+[[X]−X]−F[−FX]+X, F → FF, angolo 25° — la felce canonica di Lindenmayer e Prusinkiewicz, rami inclusi. Stessa meccanica, organismi selvaggiamente diversi.",
        },
        {
          pretitle: "Passo quattro · Perché i botanici li amano",
          title: "Da un articolo del 1968 a ogni foresta di videogioco",
          body: "Lindenmayer non era un matematico a caccia di belle immagini — era un biologo che cercava di catturare come un organismo multicellulare si sviluppa da una punta. Gli L-system diedero alla botanica la sua prima grammatica formale per la crescita: topologia di ramificazione, lunghezze degli internodi, posizione delle foglie, tutto da poche regole di riscrittura. Il libro del 1990 di Przemyslaw Prusinkiewicz, «The Algorithmic Beauty of Plants», trasformò l'idea in una pipeline funzionante, e da lì colò nella grafica computerizzata. La maggior parte degli alberi procedurali nei giochi e nei film, le felci di Speedtree, la vegetazione nei corti Pixar, le città di tubi nelle produzioni demoscene — tutti discendono dalla riscrittura parallela di Lindenmayer. Una grammatica per cellule è diventata una grammatica per mondi.",
        },
      ],
    },
    wang: {
      pretitle: "Tema · Computazione",
      title: "Tessere di Wang",
      tagline: "Quadrati con bordi colorati che possono codificare qualunque computazione.",
      intro:
        "Il rompicapo di Hao Wang del 1961 — quadrati i cui quattro bordi colorati devono combaciare con i vicini — è risultato nascondere il problema della fermata dentro un gioco di abbinamento per bambini. L'Esploratore ti consente di scegliere un insieme di tessere e di guardare il piano riempirsi, cella dopo cella, tornando indietro quando nessuna tessera si adatta.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Le regole",
          title: "Tessere quadrate, quattro bordi colorati, niente rotazione",
          body: "Una tessera di Wang è un quadrato unitario i cui quattro bordi portano colori. Puoi posare una tessera solo quando ciascuno dei suoi bordi combacia con il colore del bordo che tocca sulla tessera vicina — nord contro sud, est contro ovest. Le tessere non possono essere ruotate o riflesse; l'assegnazione dei colori è fissa. Dato un insieme finito di tali tessere, la domanda è se puoi usarne copie per piastrellare l'intero piano infinito.",
        },
        {
          pretitle: "Passo due · La congettura di Wang e la sua confutazione",
          title: "Da un algoritmo che dovrebbe esistere a uno che non può",
          body: "Nel 1961 Hao Wang congetturò che ogni insieme finito di tessere capace di piastrellare il piano dovesse ammettere una piastrellatura periodica — e da ciò avrebbe derivato un algoritmo per decidere il Problema del Domino (un dato insieme può piastrellare il piano?). Nel 1966 il suo studente Robert Berger confutò entrambe le cose in una volta: costruì un insieme aperiodico di 20.426 tessere di Wang e dimostrò che il Problema del Domino è indecidibile. Non esiste algoritmo che, dato un insieme di tessere, possa sempre decidere se queste piastrellano il piano.",
        },
        {
          pretitle: "Passo tre · Computazione nella piastrellatura",
          title: "Codificare una macchina di Turing come insieme di tessere",
          body: "Il trucco di Berger fu tradurre le configurazioni di una macchina di Turing in tessere di Wang, in modo che ogni riga valida di tessere codificasse un passo della macchina e ogni colonna valida codificasse il passaggio del tempo. Una piastrellatura del semipiano superiore esiste allora se e solo se la macchina non si ferma mai sul suo ingresso vuoto — che è il problema della fermata, il canonico problema indecidibile. La stessa costruzione si rimpicciolì nei decenni: Berger ridusse il suo insieme a 104, Robinson a 56, e nel 1996 Karel Culik II pubblicò il record di lunga durata di 13 tessere di Wang aperiodiche. Jeandel e Rao dimostrarono in seguito che il vero minimo è 11.",
        },
        {
          pretitle: "Passo quattro · Dove finiscono in natura",
          title: "Dall'indecidibilità alla texture procedurale",
          body: "Oltre al dramma fondazionale, le tessere di Wang trovarono una tranquilla seconda vita nella grafica computerizzata. Un piccolo insieme scelto con cura consente a un renderer di piastrellare un muro, un sottobosco o una heightmap di terreno senza ripetizioni visibili — i vincoli di abbinamento cuciono insieme i pezzi senza giunture, molto più a buon mercato che generare un'enorme texture unica. Sono cugine strette delle piastrellature di Penrose e dei quasicristalli che Dan Shechtman scoprì nel 1982 (Premio Nobel 2011): tutte e tre sono modi per forzare uno schema infinito che non si ripete mai del tutto.",
        },
      ],
    },
    collatz: {
      pretitle: "Tema · Caos",
      title: "La congettura di Collatz",
      tagline: "Se pari, dimezza. Se dispari, triplica e aggiungi uno.",
      intro:
        "Uno dei più semplici problemi irrisolti della matematica: una regola di quattro parole che nessuno riesce a dimostrare terminare sempre. L'Esploratore qui sotto traccia la traiettoria a grandine di qualunque numero iniziale e fa crescere il corallo inverso — l'albero a ritroso di tutti gli interi, radicato in 1.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La regola",
          title: "Due casi, una sola istruzione",
          body: "Scegli un qualsiasi intero positivo n. Se n è pari, sostituiscilo con n/2. Se n è dispari, sostituiscilo con 3n + 1. Ripeti. Questa è l'intera regola. Prova n = 7: va 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, e poi entra in loop 1 → 4 → 2 → 1 per sempre. Ogni punto di partenza che abbiamo mai testato finisce nello stesso piccolo ciclo.",
        },
        {
          pretitle: "Passo due · La congettura",
          title: "Ogni strada porta a 1",
          body: "Lothar Collatz propose la congettura nel 1937, due anni dopo il dottorato. L'affermazione è di una semplicità sbalorditiva: per ogni intero positivo n, l'iterazione raggiunge infine 1. È nota anche come problema di Siracusa, problema di Kakutani e congettura di Ulam — più matematici si sono imbattuti indipendentemente nella stessa bestia. Al 2025 è stata verificata via computer per ogni intero positivo fino a circa 2.36 × 10²¹. Nessuno sa perché.",
        },
        {
          pretitle: "Passo tre · Record e sorprese",
          title: "Grandine sopra Siracusa",
          body: "Le traiettorie sono soprannominate successioni di grandine perché, come la grandine in un cumulonembo, salgono e scendono in modo erratico prima di toccare finalmente terra. Il piccolo caso più famoso è n = 27: ci vogliono 111 passi per raggiungere 1 e lungo la strada raggiunge il picco a 9232 — circa 340 volte il suo valore iniziale. Altri semi notevoli: n = 97 richiede 118 passi; n = 871 richiede 178 passi; n = 6171 richiede 261 passi. Ingressi minuscoli, orbite selvaggiamente sproporzionate.",
        },
        {
          pretitle: "Passo quattro · Perché resiste",
          title: "Un corallo che nessuno sa potare",
          body: "Paul Erdős, guardandolo, scrollò le spalle: «La matematica potrebbe non essere pronta per problemi simili». Offrì 500 $ per una soluzione e il premio non è ancora stato riscosso. Il progresso più profondo è l'articolo di Terence Tao del 2019 che mostra che quasi tutte le orbite di Collatz raggiungono valori quasi limitati — un quasi-colpo probabilistico, non una dimostrazione. Esegui la regola al contrario invece che in avanti e gli interi si autoassemblano in un singolo albero infinito radicato in 1, ramificandosi verso l'esterno come un corallo. L'Esploratore della stanza accanto fa crescere quel corallo e ti consente di gettare qualunque seme nella tempesta di grandine.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Tema · Caos",
      title: "Il pendolo doppio",
      tagline: "Due pendoli incatenati, caos totale.",
      intro:
        "Un sistema meccanico abbastanza semplice da disegnare su un tovagliolo e abbastanza caotico da superare qualunque previsione. L'Esploratore integra le equazioni del moto in tempo reale e ti consente di mettere in gara due partenze quasi identiche per poter vedere tu stesso come divergono.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'impostazione",
          title: "Due pendoli, una massa appesa a un'altra",
          body: "Prendi un pendolo semplice — un'asta rigida senza massa di lunghezza L₁ con una massa m₁ all'estremità, che ruota sotto gravità. Ora attacca una seconda asta di lunghezza L₂ con massa m₂ alla massa del primo. La configurazione è descritta da due soli angoli, θ₁ e θ₂, misurati dalla verticale. Insieme alle velocità angolari ω₁ = θ̇₁ e ω₂ = θ̇₂, questo è l'intero stato: un punto in uno spazio delle fasi quadridimensionale, che evolve deterministicamente sotto Newton.",
        },
        {
          pretitle: "Passo due · La lagrangiana",
          title: "Cinetica meno potenziale, poi aziona Eulero-Lagrange",
          body: "Scrivi l'energia cinetica T di entrambe le masse e l'energia potenziale V dovuta alla gravità. La lagrangiana L = T − V viene fuori pulita, ma le equazioni del moto ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 producono due ODE accoppiate, non lineari, del secondo ordine per θ̈₁ e θ̈₂. L'accoppiamento avviene tramite termini sin(θ₁−θ₂) e cos(θ₁−θ₂); la non linearità è inevitabile. Non esiste forma chiusa per la soluzione. Per vedere il sistema muoversi devi integrare numericamente — ed è esattamente ciò che fa l'Esploratore, passo dopo passo, con RK4.",
        },
        {
          pretitle: "Passo tre · Caos",
          title: "Energia bassa: graziosa. Energia alta: imprevedibile.",
          body: "A bassa energia le masse oscillano dolcemente e il moto è quasiperiodico — la traiettoria si avvolge attorno a un toro invariante nello spazio delle fasi e non si ripete mai del tutto, ma resta limitata e ordinata. Spingi più in alto l'energia e il sistema attraversa la soglia del caos: il maggiore esponente di Lyapunov diventa positivo, e due partenze che differiscono di una parte su un milione si separano completamente in pochi secondi. Il pendolo doppio è la dimostrazione fisica da manuale del caos deterministico — deterministico nelle equazioni, imprevedibile in pratica.",
        },
        {
          pretitle: "Passo quattro · Dove compare",
          title: "Robot, camminata, teoria del controllo, musei",
          body: "Le stesse equazioni a doppio rotore descrivono i bracci robotici a due segmenti (dove il caos va soppresso, non celebrato), la biomeccanica della gamba che oscilla nella camminata umana e molti oscillatori composti in ingegneria. I teorici del controllo usano il pendolo doppio come riferimento per stabilizzare sistemi non lineari instabili — bilanciarlo in posizione verticale è un classico problema difficile. E ogni buon museo della scienza ne ha uno che oscilla in una teca di vetro, tracciando un percorso che i visitatori non riescono mai a prevedere del tutto.",
        },
      ],
    },
    bzr: {
      pretitle: "Tema · Caos",
      title: "La reazione di Belousov–Zhabotinsky",
      tagline: "Un orologio chimico che disegna spirali.",
      intro:
        "Una vera miscela chimica che si rifiuta di stabilizzarsi: pulsa attraverso colori in un becher e fa crescere spirali rotanti in una capsula di Petri. L'Esploratore simula una griglia di reazione-diffusione di stile Oregonator a 3 variabili, così puoi guardare la stessa instabilità auto-organizzarsi in onde.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La scoperta accidentale",
          title: "Una reazione che avrebbe dovuto essere impossibile",
          body: "All'inizio degli anni Cinquanta il chimico sovietico Boris Belousov, cercando un analogo inorganico del ciclo di Krebs, mescolò bromato, acido citrico e un catalizzatore al cerio — e guardò la soluzione cambiare colore ritmicamente, all'infinito. I revisori respinsero il suo articolo: una reazione chimica visibilmente oscillante nel tempo sembrava una violazione del secondo principio della termodinamica. Belousov rinunciò a pubblicarla. Un decennio dopo, nel 1961, lo studente di dottorato Anatol Zhabotinsky riprese la ricetta, sostituì l'acido citrico con l'acido malonico e dimostrò le oscillazioni così chiaramente che il risultato non poté più essere negato.",
        },
        {
          pretitle: "Passo due · Come appare",
          title: "Un orologio in un becher, spirali in una capsula",
          body: "La ricetta moderna è bromato (BrO₃⁻) più bromuro, acido malonico come combustibile e un catalizzatore redox — cerio, o più visibilmente ferroina, in un bagno di acido solforico. Mescolata in un becher, la soluzione cambia colore a intervalli regolari (blu ↔ rosso con la ferroina) come un metronomo chimico. Versata in una capsula di Petri sottile in modo che la diffusione conti, la stessa ricetta fa spontaneamente crescere onde a spirale rotanti e schemi concentrici a bersaglio nel corso di minuti. Mescolala e il pattern si cancella; lasciala stare e ne viene tracciato uno nuovo.",
        },
        {
          pretitle: "Passo tre · L'Oregonator",
          title: "Tre variabili, una sola oscillazione",
          body: "Nel 1972 Richard Field, Endre Körös e Richard Noyes — che lavoravano all'Università dell'Oregon — distillarono la chimica nell'Oregonator: un sistema di ODE non lineari a 3 variabili che tracciano gli intermedi chiave (HBrO₂, Br⁻ e il catalizzatore ossidato). Oscilla esattamente per gli stessi motivi per cui lo fa il becher. Aggiungi termini di diffusione e le ODE diventano PDE di reazione-diffusione; nella riduzione di Tyson–Fife lo stesso modello riproduce le onde a spirale su un foglio 2D. L'Esploratore della stanza accanto esegue un cugino a celle discrete di questa PDE che è abbastanza economico per un browser ma abbastanza fedele da fare spirali.",
        },
        {
          pretitle: "Passo quattro · Perché è importante",
          title: "Chimica che si auto-organizza",
          body: "La BZR fu la pistola fumante sperimentale che spinse la chimica via dal pensiero d'equilibrio. Lontano dall'equilibrio, la materia non si limita a dissiparsi — può spontaneamente organizzarsi in schemi strutturati nello spazio e nel tempo. Ilya Prigogine costruì la teoria di queste strutture dissipative e per questo fu insignito del Premio Nobel per la Chimica nel 1977. Oggi la BZR è l'esempio da manuale di auto-organizzazione lontano dall'equilibrio, fratello dei pattern di morfogeno di Turing, e antenato di ogni modello di reazione-diffusione in biologia, neuroscienze e ingegneria chimica.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Tema · Analisi",
      title: "Pattern di Turing",
      tagline: "Come ottengono le loro macchie i leopardi.",
      intro:
        "L'Esploratore simula in tempo reale una griglia di reazione-diffusione di Gray-Scott: due sostanze chimiche virtuali in competizione su un reticolo 200×200. Ruota le manopole del tasso di alimentazione e di uccisione e il campo si trasforma con continuità tra macchie, strisce, labirinti e coralli autoreplicanti.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La domanda di Turing",
          title: "Da dove vengono i pattern su un animale?",
          body: "Un embrione di leopardo inizia come una palla di cellule pressoché uniforme. A un certo punto del percorso compaiono sul mantello macchie regolari — stessa spaziatura, stesso formato, nei posti giusti. Lo stesso problema appare per le strisce delle zebre, le bande dei pesci angelo e gli anelli su una conchiglia. Nel 1952 Alan Turing pubblicò «The Chemical Basis of Morphogenesis» e propose una risposta sorprendente: i pattern sono pura chimica. Due sostanze in diffusione con portate molto diverse, in reazione tra loro, possono spontaneamente rompere la simmetria e deporre un disegno stabile sopra uno sfondo uniforme.",
        },
        {
          pretitle: "Passo due · La ricetta",
          title: "Attivazione a corto raggio, inibizione a lungo raggio",
          body: "Il meccanismo di Turing prende due sostanze: un ATTIVATORE a che catalizza la propria produzione e la produzione di un INIBITORE b, più l'inibitore stesso, che distrugge l'attivatore. L'ingrediente extra cruciale è la diffusione: l'inibitore deve diffondersi molto più velocemente dell'attivatore. Una piccola fluttuazione che alza a in un punto innesca uno scoppio locale incontrollato di attivatore — ma produce anche inibitore, che corre verso l'esterno e sopprime l'attivatore in un ampio anello tutt'attorno. Quell'anello di soppressione tiene lo scoppio successivo a distanza, e il ritmo scoppio-e-anello piastrella il piano con macchie regolari, strisce o labirinti.",
        },
        {
          pretitle: "Passo tre · Un'equazione, molti pattern",
          title: "Il diagramma di fase di Gray-Scott",
          body: "La forma giocabile standard è il modello di Gray-Scott: ∂a/∂t = D_a∇²a − ab² + F(1 − a) e ∂b/∂t = D_b∇²b + ab² − (F + k)b. Solo due manopole fanno il lavoro pesante — F, il tasso di alimentazione con cui viene fornito attivatore fresco, e k, il tasso di uccisione con cui decade l'inibitore. L'articolo di Pearson del 1993 mappò il piano (F, k) in un atlante ormai famoso di regioni con nome: buchi, macchie, strisce, punti autoreplicanti tipo mitosi, il mondo instabile U-skate, labirinti, solitoni e caos completo. Le stesse due equazioni differenziali li contengono tutti; basta che muova il cursore.",
        },
        {
          pretitle: "Passo quattro · I pattern sono reali",
          title: "Dalla provetta al pesce palla",
          body: "Per decenni il meccanismo di Turing fu una bellissima idea senza esperimento. Poi nel 1990 il reattore CIMA (clorito-iodato-acido malonico in un gel) produsse il primo pattern di Turing di laboratorio in pura chimica, con l'amido che faceva da freno all'inibitore. Da allora i biologi hanno colto lo stesso meccanismo con le mani nel sacco in tessuto vivente: Akiyama e Tanaka nel 2014 lessero i segnali di attivatore e inibitore direttamente sul pesce palla africano; Sheth e colleghi mostrarono dinamiche di Turing che fissano la spaziatura delle dita del topo; la stessa chimica governa la spaziatura dei follicoli piliferi, le gemme delle piume e la pigmentazione delle conchiglie. Mantelli, impronte digitali, creste — lo schizzo di Turing del 1952, misurato.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Tema · Geometria",
      title: "Il triangolo di Sierpiński",
      tagline: "Un frattale, quattro vie d'accesso.",
      intro:
        "Wacław Sierpiński lo descrisse nel 1915, ma lo stesso pattern di buco-dentro-buco triangolare era già stato intagliato nei pavimenti delle chiese cosmatesche del XIII secolo. Il fatto sorprendente è che la forma arriva da almeno quattro vie completamente diverse — ricorsione, casualità, aritmetica, un automa cellulare di una sola riga — e l'Esploratore ti consente di guardarle tutte e quattro affiancate.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Suddivisione ricorsiva",
          title: "Taglia il centro, poi ricorri",
          body: "Prendi un triangolo equilatero. Unisci i punti medi dei suoi tre lati; questo lo divide in quattro triangoli congruenti più piccoli. Rimuovi quello centrale e mantieni i tre angoli. Ora applica la stessa operazione a ciascuno di quegli angoli — e ancora, e ancora. Dopo infiniti passi hai il triangolo di Sierpiński: un insieme autosimile la cui area totale è zero e il cui confine ha lunghezza infinita. Ogni passaggio conserva tre quarti dell'area precedente, quindi il limite è inevitabile.",
        },
        {
          pretitle: "Passo due · La via del gioco del caos",
          title: "A metà strada, ancora e ancora",
          body: "Disponi tre vertici in un triangolo. Lascia cadere un punto qualunque; poi, ripetutamente, scegli uniformemente a caso uno dei tre vertici e salta a metà strada verso di esso. Traccia ogni passo. Entro poche migliaia di salti la nuvola di punti si è risolta nel triangolo di Sierpiński — esattamente, al limite. Pura casualità, nessuna istruzione sulla geometria, nessuna memoria: solo un passo a metà e tre bersagli. Il frattale è ciò che la passeggiata casuale non può fare a meno di tracciare.",
        },
        {
          pretitle: "Passo tre · Il triangolo di Pascal mod 2",
          title: "Le voci dispari lo disegnano per te",
          body: "Scrivi il triangolo di Pascal e colora di nero ogni voce dispari, di bianco ogni voce pari. Il risultato, riga per riga, è il triangolo di Sierpiński. Il motivo è il teorema di Lucas: un coefficiente binomiale C(n, k) è dispari esattamente quando le cifre binarie di k sono un sottoinsieme delle cifre binarie di n. Quindi le celle nere vivono dove i bit di k stanno dentro i bit di n — e quella condizione, disegnata in un triangolo, è il pattern di Sierpiński. Combinatoria e geometria atterrano nello stesso posto.",
        },
        {
          pretitle: "Passo quattro · Regola 90 e l'IFS",
          title: "Una cella, una regola, la stessa forma",
          body: "L'automa cellulare elementare di Wolfram Regola 90 dice: lo stato successivo di una cella è lo XOR dei suoi due vicini. Avvia una singola cella nera in una riga altrimenti bianca e fai un passo avanti. Ogni nuova generazione disegnata sotto la precedente riproduce esattamente il triangolo di Sierpiński. La lettura più profonda è che tutte e quattro le vie descrivono lo stesso attrattore: un sistema di funzioni iterate di tre mappe di contrazione, ciascuna con rapporto 1/2, fissate ai tre vertici. Qualunque ricetta tu segua, converge sullo stesso insieme fisso — dimensione di Hausdorff log 3 / log 2 ≈ 1.585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Tema · Geometria",
      title: "Il gioco del caos",
      tagline: "Lancia un dado, disegna un frattale.",
      intro:
        "Disponi qualche punto, scegline uno a caso più e più volte e cammina a metà strada verso di esso — una regola che suona come rumore, ma che si condensa in un frattale perfetto dopo qualche migliaio di passi. L'Esploratore anima la procedura dal vivo e ti consente di regolare il numero di vertici, il rapporto di salto e le regole che governano quale vertice puoi scegliere dopo.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La regola",
          title: "Tre punti, un dado e un breve passo",
          body: "Disponi i vertici di un poligono. Scegli un punto di partenza qualsiasi — sopra, fuori, dentro al poligono non importa. Ora lancia un dado per scegliere un vertice a caso, cammina di una frazione fissa del tragitto dalla tua posizione corrente verso di esso e contrassegna il nuovo punto con un puntino. Considera quel puntino come la tua nuova posizione e ripeti. La regola ha solo due ingredienti: una lista di vertici e un rapporto di salto r. Questo è l'intero gioco del caos, formalizzato da Michael Barnsley nel suo lavoro del 1988 sui sistemi di funzioni iterate.",
        },
        {
          pretitle: "Passo due · Dalla casualità, il triangolo di Sierpiński",
          title: "Il rapporto giusto per ogni poligono",
          body: "Su un triangolo equilatero con rapporto di salto r = 1/2 i puntini si condensano nel triangolo di Sierpiński — dopo un breve riscaldamento nessun punto può mai atterrare nei buchi centrali. Per un n-gono regolare c'è un rapporto magico rₙ = 1 / (1 + 2·cos(π/n)) che dà un frattale autosimile pulito. La tabella sotto raccoglie i valori per n = da 3 a 8: nota che 1/2 del triangolo e 1/(1 + φ) = 1/φ² ≈ 0.382 del pentagono saltano fuori dalla stessa formula. Usa un rapporto diverso e l'immagine o sovrappone o sottosovrappone finché il frattale si spalma via.",
        },
        {
          pretitle: "Passo tre · Altre forme da altre regole",
          title: "Quadrati, restrizioni e la felce di Barnsley",
          body: "Su un quadrato con r = 1/2 la regola fallisce: i puntini riempiono uniformemente l'interno e non compare alcun frattale. La soluzione è una regola di restrizione — ad esempio, vieta lo stesso vertice due volte di seguito, o vieta il vertice un passo lungo dal precedente — e un delicato frattale ritorna. Spingi ulteriormente l'idea e i vertici svaniscono del tutto: la felce di Barnsley è il gioco del caos con quattro trasformazioni affini scelte da dadi pesati (probabilità 0.01, 0.85, 0.07, 0.07), e da quella casualità cresce una foglia botanicamente convincente.",
        },
        {
          pretitle: "Passo quattro · Perché funziona",
          title: "Attrattori di sistemi di funzioni iterate",
          body: "Ogni mossa disponibile — «salta a metà strada verso il vertice i» — è una mappa di contrazione sul piano. Un insieme finito di tali contrazioni è un Sistema di Funzioni Iterate (IFS), e il teorema di Barnsley garantisce un unico attrattore compatto: il punto fisso dell'intero sistema. Il gioco del caos campiona quell'attrattore scegliendo mappe a caso, e il teorema di Hutchinson dice che i puntini campionati, con probabilità uno, diventano densi in esso. Potresti disegnare la stessa immagine in modo deterministico applicando ogni mappa a ogni forma — la passeggiata casuale è solo la via economica e bella per arrivarci.",
        },
      ],
    },
    penrose: {
      pretitle: "Tema · Geometria",
      title: "Tassellature di Penrose",
      tagline: "Tessere che coprono il piano e non si ripetono mai.",
      intro:
        "Due forme di tessera bastano a coprire un piano infinito con un pattern che non si ripete mai del tutto. L'Esploratore fa crescere le tassellature P3 (due rombi) o P2 (aquilone + dardo) per inflazione; imposti la profondità, la rotazione del seme, e guardi una geometria perfettamente aperiodica assemblarsi da sola.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Due tessere, mai ripetenti",
          title: "Penrose, 1974",
          body: "Roger Penrose introdusse la sua prima tassellatura aperiodica (P1) nel 1974, usando sei prototessere costruite attorno al pentagono. Ridusse rapidamente l'insieme a due: la coppia aquilone + dardo (P2) e la coppia a due rombi (P3) — un rombo sottile con angoli 36°/144° e un rombo spesso con angoli 72°/108°. Ogni tessera porta le regole di abbinamento di Conway — frecce o tacche colorate sui bordi che fissano quali tessere possono stare accanto a quali. Senza di esse potresti tassellare periodicamente con aquiloni e dardi; con esse, ogni tassellatura legale è costretta a essere aperiodica.",
        },
        {
          pretitle: "Passo due · Simmetria a cinque facce",
          title: "Una simmetria proibita",
          body: "Ogni angolo nella tassellatura è multiplo di 36° — l'angolo interno di un pentagono regolare. Attorno a vertici speciali il pattern ha perfetta simmetria rotazionale a cinque facce, lo stesso tipo che ha un pentagono. La cristallografia classica dimostra che nessuna tassellatura periodica del piano può avere simmetria a cinque facce: solo rotazioni di ordine 2, 3, 4 e 6 sono compatibili con un reticolo. Le tassellature di Penrose aggirano il teorema rifiutando di essere periodiche in primo luogo. La sorpresa è che puoi ancora avere ordine locale a cinque facce senza mai chiudersi in una cella ripetuta.",
        },
        {
          pretitle: "Passo tre · La sezione aurea è incorporata",
          title: "φ = (1 + √5) / 2",
          body: "Conta le tessere in qualunque grande regione e troverai la sezione aurea in attesa. Il numero di aquiloni diviso per il numero di dardi converge a φ = (1+√5)/2 ≈ 1.618; lo stesso vale per i rombi spessi divisi per i rombi sottili. I rapporti delle lunghezze dei lati nei triangoli di Robinson che costruiscono ogni rombo sono 1 : φ, e la regola di inflazione che fa crescere la tassellatura scala le lunghezze di un fattore φ a ogni passo. La tassellatura è, in senso preciso, la sezione aurea resa come pattern nel piano.",
        },
        {
          pretitle: "Passo quattro · Quasicristalli",
          title: "Shechtman, 1982",
          body: "Nell'aprile 1982 Dan Shechtman sparò un fascio di elettroni su una lega alluminio-manganese raffreddata rapidamente e vide un pattern di diffrazione con netta simmetria a cinque facce — una cosa che ogni manuale diceva non potesse esistere. Linus Pauling lo derise notoriamente per anni («non esiste una cosa come i quasicristalli, solo gli pseudo-scienziati»). La tassellatura di Penrose era il pezzo esistente di matematica cartacea che dimostrava che ciò era possibile: un pattern ad ordine a lungo raggio, simmetrico a cinque facce, aperiodico. Shechtman fu riabilitato con il Premio Nobel per la Chimica nel 2011, e le tassellature di Penrose divennero il modello canonico bidimensionale per ciò che oggi chiamiamo quasicristalli.",
        },
      ],
    },
    apollonian: {
      pretitle: "Tema · Geometria",
      title: "Impacchettamento di cerchi apolloniano",
      tagline: "Cerchi dentro cerchi dentro cerchi.",
      intro:
        "Parti da tre cerchi mutuamente tangenti e una regola per ciò che conta come tangente. L'Esploratore riempie ricorsivamente ogni interstizio triangolare curvo con un nuovo cerchio, poi riempie a turno gli interstizi più piccoli — scegli le curvature iniziali e guarda emergere una guarnizione che è frattale per sempre.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La posizione iniziale",
          title: "Tre cerchi che si toccano",
          body: "Disegna tre cerchi sul piano, ciascuno tangente agli altri due — si toccano in tre punti e racchiudono un interstizio triangolare curvo. Attorno al 200 a.C., Apollonio di Perga pose il naturale seguito: quali cerchi sono tangenti a tutti e tre i cerchi dati contemporaneamente? Per una terna di cerchi mutuamente tangenti ci sono esattamente due risposte — un piccolo cerchio inscritto dentro l'interstizio curvo, e un grande cerchio che circoscrive tutti e tre. Entrambi quei nuovi cerchi si uniscono ai tre originali per formare una quaterna di cerchi mutuamente tangenti. Quella quaterna è il seme di tutto ciò che segue.",
        },
        {
          pretitle: "Passo due · Il teorema di Cartesio",
          title: "Curvature, fissate nell'algebra",
          body: "Scrivi la curvatura di ogni cerchio come k = 1/r, con una sola convenzione: se un cerchio racchiude gli altri (quello esterno), prendi la sua curvatura negativa. Nella sua corrispondenza del 1643 con la Principessa Elisabetta di Boemia, Cartesio dimostrò che per quattro cerchi mutuamente tangenti qualsiasi le curvature soddisfano (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Risolvere la quadratica per la quarta curvatura dà k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). I due segni sono esattamente le due risposte di Apollonio: il segno + restituisce il piccolo cerchio inscritto, il segno − restituisce l'altro cerchio tangente sul lato opposto.",
        },
        {
          pretitle: "Passo tre · Riempimento ricorsivo",
          title: "Ogni interstizio è un nuovo seme",
          body: "Una volta in posizione la quaterna seme, ogni interstizio triangolare curvo è esso stesso bordato da tre cerchi mutuamente tangenti — esattamente la configurazione da cui siamo partiti. Lascia cadere il cerchio inscritto in ciascun interstizio usando il segno + della formula di Cartesio. Quel cerchio divide il suo vecchio interstizio in tre nuovi triangoli curvi più piccoli, e il processo ricorre. Continua per sempre e l'unione di tutti i cerchi che hai disegnato è la guarnizione apolloniana. La polvere residua ha misura di Lebesgue zero, ma dimensione di Hausdorff di circa 1.3056867 — un vero frattale, tra una curva e una superficie.",
        },
        {
          pretitle: "Passo quattro · La sorpresa degli interi",
          title: "Quando ogni curvatura è un numero intero",
          body: "Scegli le quattro curvature seme (k₁, k₂, k₃, k₄) come interi. Allora la formula di Cartesio k₄ = k₁+k₂+k₃ ± 2√(…) forza ogni curvatura successiva a essere anch'essa un intero — la radice quadrata collassa grazie a (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), e ogni nuovo cerchio eredita l'integralità dei suoi genitori. L'impacchettamento (−1, 2, 2, 3) si riempie con curvature 6, 11, 14, 15, 18, 23, … e ogni altro impacchettamento apolloniano intero — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — fa lo stesso. Quali interi compaiano, e quali no, è una questione aperta in geometria aritmetica: uno scheletro numerico-teorico nascosto, all'interno di un disegno di cerchi.",
        },
      ],
    },
    phi: {
      pretitle: "Tema · Geometria",
      title: "Sezione aurea e Fibonacci",
      tagline: "Una semplice ricorrenza. Il rapporto che si nasconde ovunque.",
      intro:
        "L'Esploratore segue la successione di Fibonacci mentre i suoi rapporti consecutivi si avvicinano a φ, disegna la spirale aurea costruita da quadrati di Fibonacci annidati e ti consente di inclinare il pattern di fillotassi del girasole secondo l'angolo aureo. Tre viste, un solo numero — e la differenza tra dove φ compare davvero e dove le infografiche esagerano.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'equazione definitoria",
          title: "Un numero uguale al proprio quadrato meno uno",
          body: "Risolvi φ² = φ + 1. La radice positiva è φ = (1 + √5) / 2 ≈ 1.6180339887. Quella singola equazione contiene quasi tutto: dividi entrambi i lati per φ e ottieni φ = 1 + 1/φ, quindi 1/φ = φ − 1 ≈ 0.6180339887. Il reciproco è l'originale meno uno — una proprietà che nessun altro numero positivo ha. La radice negativa è ψ = (1 − √5)/2 ≈ −0.6180, e la coppia (φ, ψ) è il motore dietro ogni identità di Fibonacci qui sotto.",
        },
        {
          pretitle: "Passo due · Fibonacci",
          title: "Somma gli ultimi due, per sempre",
          body: "Parti con F₀ = 0, F₁ = 1, poi itera Fₙ₊₁ = Fₙ + Fₙ₋₁: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Prendi il rapporto dei termini consecutivi — 1, 2, 1.5, 1.667, 1.6, 1.625, 1.615, 1.619 — e tende a φ. La forma chiusa di Binet rende esatto quel limite: Fₙ = (φⁿ − ψⁿ)/√5. Poiché |ψ| < 1, il termine ψⁿ decade e Fₙ finisce per essere quasi pari, per ogni n, a φⁿ/√5.",
        },
        {
          pretitle: "Passo tre · L'angolo aureo e i girasoli",
          title: "Perché un girasole gira di 137.508° per seme",
          body: "Prendi un disco, disponi semi uno dopo l'altro e ruota di un angolo fisso tra ciascuno. Il modello di Vogel pone il seme n a raggio rₙ = c√n (così l'area per seme è costante) e angolo θₙ = n · α. Scegli α = 360°/φ² ≈ 137.508° — l'angolo aureo — e i semi si impacchettano densamente senza interstizi e senza direzione preferita. Qualunque frazione razionale di un giro si allineerebbe dopo poche rotazioni lasciando interstizi radiali; φ è l'irrazionale peggiormente approssimabile, quindi il pattern non si ripete mai. I girasoli, le pigne, il broccolo Romanesco e le foglie di molte piante usano esattamente questo trucco.",
        },
        {
          pretitle: "Passo quattro · Sano scetticismo",
          title: "Dove φ è davvero — e dove non lo è",
          body: "φ non governa il Partenone, la Gioconda o la conchiglia del Nautilus, nonostante infinite infografiche; quegli adattamenti sono dubbi nel migliore dei casi e bias di conferma nel peggiore. Dove φ appare onestamente è nella crescita e nell'ottimizzazione: fillotassi (sopra), teoria delle frazioni continue (φ = [1; 1, 1, 1, …] lo rende il più lentamente convergente — il «più irrazionale» — dei numeri) e la geometria delle tassellature di Penrose e dei quasicristalli, il cui ordine a lungo raggio è costruito da φ. Reale, bello e più ristretto di quanto suggeriscano i poster.",
        },
      ],
    },
    buffon: {
      pretitle: "Tema · Analisi",
      title: "L'ago di Buffon",
      tagline: "Lascia cadere bastoncini su carta rigata. π viene fuori.",
      intro:
        "Georges-Louis Leclerc, conte di Buffon, pose la domanda nel 1733 e la pubblicò nel 1777: lascia cadere un ago su un pavimento di linee parallele e conta gli incroci. Il rapporto restituisce π — una costante dai cerchi che emerge da aghi dritti su legno dritto. L'Esploratore simula i lanci dal vivo e ti consente di vedere la stima avvicinarsi a π = 3.14159…",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'impostazione",
          title: "Linee parallele e un ago",
          body: "Riga un pavimento con linee parallele a distanza d l'una dall'altra. Prendi un ago di lunghezza ℓ, con ℓ ≤ d, e lascialo cadere dall'alto in modo che il suo centro atterri in una posizione casuale uniforme e il suo angolo sia uniforme su [0, π]. L'ago o incrocia una delle linee o no. Questa è l'intera impostazione — due parametri, una domanda sì/no, ripetuta moltissime volte.",
        },
        {
          pretitle: "Passo due · La probabilità",
          title: "Perché compare π",
          body: "Integra sul disallineamento verticale del centro e sull'angolo θ, e la probabilità che l'ago incroci una linea risulta esattamente P = 2ℓ / (πd). Riorganizza: π = 2ℓn / (d·k), dove n è il numero totale di aghi lasciati cadere e k è il numero di quelli che hanno incrociato una linea. π emerge da aghi dritti che cadono su linee dritte perché l'angolo θ media un seno — e un seno, integrato su un semicerchio, segretamente porta π.",
        },
        {
          pretitle: "Passo tre · Convergenza lenta",
          title: "Le sospette sei cifre di Lazzarini",
          body: "L'errore Monte Carlo decade come 1/√n. Per fissare tre decimali di π servono dell'ordine di 10⁵ aghi, e anche dieci milioni sono ben lungi dall'essere abbastanza per alta precisione. Nel 1901 il matematico italiano Mario Lazzarini riportò π ≈ 3.1415929 da appena 3408 lanci — sei cifre corrette, sospettosamente vicine alla ben nota approssimazione 355/113. Quasi certamente si fermò al momento fortunato, o organizzò l'esperimento per atterrare lì. La convergenza è genuinamente lenta; il numero di Lazzarini è troppo carino per essere onesto.",
        },
        {
          pretitle: "Passo quattro · Il noodle di Buffon",
          title: "Conta solo la lunghezza",
          body: "Lo stesso calcolo funziona per ℓ > d, dove diventano possibili più incroci per lancio e la forma chiusa è più elaborata. Più sorprendente è il noodle di Buffon: prendi una curva planare qualunque C di lunghezza L, comunque attorcigliata o piegata, e lasciala cadere sullo stesso pavimento rigato. Il numero atteso di incroci è 2L / (πd), indipendentemente dalla forma. Ago dritto o noodle che si dimena: conta solo la lunghezza. Lo stesso π, nascosto in qualunque curva.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Tema · Paradosso",
      title: "L'Hotel di Hilbert",
      tagline: "Sempre posto per uno in più — anche quando è pieno.",
      intro:
        "David Hilbert delineò l'hotel in una conferenza del 1924 e George Gamow lo portò al pubblico nel suo libro del 1947 «Uno, due, tre… infinito». L'Esploratore anima i quattro scenari classici — un ospite, k ospiti, ℵ₀ ospiti e ℵ₀ autobus da ℵ₀ ospiti — e mostra che un hotel infinito già pieno può assorbirli tutti.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Immagina l'hotel",
          title: "Infinite stanze, ciascuna occupata",
          body: "L'hotel ha una stanza per ogni numero naturale: 1, 2, 3, e così via per sempre. Stasera ogni singola stanza è presa — un ospite nella 1, un ospite nella 2, un ospite nella 17, un ospite nella 10¹⁰⁰. Il senso comune chiama tutto questo «pieno»: non c'è stanza senza un ospite. La matematica dissente, perché «pieno» è un'idea finita e l'insieme delle stanze qui è numerabilmente infinito. La cardinalità degli ospiti è ℵ₀, e ℵ₀ non è un numero — è la dimensione dei numeri naturali.",
        },
        {
          pretitle: "Passo due · Un nuovo ospite",
          title: "Sposta n → n+1 e la stanza 1 si libera",
          body: "Un viaggiatore bussa. Il direttore trasmette una sola istruzione: ogni ospite, sposta dalla stanza n alla stanza n+1. L'ospite nella 1 va alla 2, quello nella 2 alla 3, e così via; nessuno viene sfollato perché c'è sempre una stanza con numero più alto in attesa. Dopo lo spostamento, la stanza 1 è vuota e il nuovo arrivato fa il check-in. L'hotel «pieno» non era mai stato pieno nel senso finito — aveva ℵ₀ + 1 = ℵ₀ per tutto il tempo.",
        },
        {
          pretitle: "Passo tre · Infiniti nuovi ospiti",
          title: "Manda l'ospite n alla stanza 2n; ogni stanza dispari si apre",
          body: "Ora arriva una coda numerabilmente infinita. Il direttore chiede a ogni ospite esistente nella stanza n di spostarsi nella stanza 2n. L'ospite 1 cammina verso la stanza 2, l'ospite 2 verso la 4, l'ospite 3 verso la 6 — ogni stanza pari resta occupata e ogni stanza dispari diventa libera. I nuovi arrivati riempiono 1, 3, 5, 7, … in ordine, e tutti hanno una chiave. Questa è l'uguaglianza ℵ₀ + ℵ₀ = ℵ₀: due copie dei naturali entrano dentro una copia senza perdite.",
        },
        {
          pretitle: "Passo quattro · Infiniti autobus, infiniti passeggeri ciascuno",
          title: "Le potenze dei primi assorbono ℵ₀ × ℵ₀",
          body: "Una flotta di numerabilmente infiniti autobus accosta, ciascuno con numerabilmente infiniti passeggeri. Manda ogni ospite esistente dalla stanza n alla stanza 2ⁿ — occupano le potenze di due. Per l'autobus k (k = 1, 2, 3, …), sia pₖ il k-esimo primo dispari (3, 5, 7, 11, 13, …) e manda il passeggero m alla stanza pₖᵐ. L'autobus 1 atterra su 3, 9, 27, 81, …; l'autobus 2 su 5, 25, 125, …; l'autobus 3 su 7, 49, … Per il teorema fondamentale dell'aritmetica ogni potenza di un primo è unica, quindi nessun ospite collide. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Tema · Paradosso",
      title: "Il corno di Gabriele",
      tagline: "Volume finito, superficie infinita.",
      intro:
        "Una forma del 1641 che divorò ogni intuizione che i matematici avessero sull'infinito. L'Esploratore taglia il corno a una x variabile, disegna la vista laterale e calcola dal vivo il volume e l'area di superficie — guarda una restare mansueta e l'altra fuggire via.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La forma",
          title: "Ruota y = 1/x attorno all'asse",
          body: "Prendi la curva y = 1/x per x ≥ 1 e falla ruotare attorno all'asse x. Il risultato è un corno snello che si allarga vicino a x = 1 e si assottiglia per sempre verso raggio zero al crescere di x. Ogni sezione trasversale perpendicolare all'asse è un disco di raggio 1/x. Il corno si estende infinitamente lontano verso destra, eppure in ogni punto la sua larghezza si sta restringendo. Evangelista Torricelli descrisse la figura nel 1641 — tre decenni prima che Newton e Leibniz avessero il calcolo infinitesimale a cui appoggiarsi.",
        },
        {
          pretitle: "Passo due · Calcola il volume",
          title: "V = π — esattamente",
          body: "Affetta il corno in dischi di spessore dx e raggio 1/x. Il volume di ogni disco è π · (1/x)² · dx. Sommali tutti da 1 all'infinito: V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Finito. L'intero corno infinito potrebbe essere riempito fino all'orlo con esattamente π unità cubiche di vernice. L'integrale convergente ∫ 1/x² dx è ciò che lo mantiene limitato — i quadrati svaniscono abbastanza velocemente perché la somma si assesti.",
        },
        {
          pretitle: "Passo tre · Calcola la superficie",
          title: "A = ∞ — esattamente",
          body: "L'area di superficie laterale è A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. Il fattore con la radice quadrata è sempre almeno 1, quindi A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. Quello è l'integrale armonico, e diverge. Per quanto cammini lungo il corno continui ad aggiungere area laterale, e il totale non smette mai di crescere. La superficie è infinita — nessuna quantità finita di vernice la coprirà.",
        },
        {
          pretitle: "Passo quattro · Il paradosso del pittore",
          title: "Riempilo; non dipingerlo mai",
          body: "Ecco quindi l'enigma: versa π unità di vernice e il corno è pieno — incluso il muro interno. Eppure per rivestire l'esterno ne serviranbbe infinita. Torricelli trovò il risultato controintuitivo anche prima che il calcolo esistesse per nominare il trucco. La risoluzione moderna è che «dipingere» presuppone uno strato di spessore non nullo ε, che su una superficie infinita richiede volume infinito. Abbandona quell'assunzione e il paradosso si dissolve: la «vernice» matematica all'interno ha spessore zero sul muro, e il muro interno è la stessa superficie infinita di quello esterno. Il nome viene dopo — il corno dell'arcangelo Gabriele, suonato per annunciare il giorno del giudizio.",
        },
      ],
    },
    cantor: {
      pretitle: "Tema · Paradosso",
      title: "L'argomento diagonale di Cantor",
      tagline: "L'infinito viene in formati.",
      intro:
        "L'argomento diagonale di Georg Cantor del 1891 è la dimostrazione più pulita in matematica del fatto che alcuni infiniti sono più grandi di altri. L'Esploratore anima la costruzione dal vivo: scegli un qualunque elenco di decimali in [0,1] e guarda uscire dalla diagonale un nuovo numero reale — uno che non può essere nel tuo elenco, comunque tu lo ordini astutamente.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Impostare l'impossibile",
          title: "Supponi che i reali possano essere elencati",
          body: "La dimostrazione di Cantor è per contraddizione. Supponi che i numeri reali tra 0 e 1 siano numerabili — cioè, possano essere disposti in una successione infinita r₁, r₂, r₃, …, con ogni reale che appare da qualche parte nell'elenco. Nota che non diciamo mai in quale ordine: l'argomento deve funzionare per qualunque ordinamento tu possa inventare. Se troviamo un reale che l'elenco ha saltato, l'assunzione che un tale elenco completo esista è morta.",
        },
        {
          pretitle: "Passo due · Leggere la diagonale",
          title: "Una cifra alla volta, giù per la scala",
          body: "Scrivi ogni rₙ come espansione decimale 0.d_{n,1} d_{n,2} d_{n,3} …, cosicché d_{n,k} sia la k-esima cifra dell'n-esimo reale. Ora leggi dritto giù lungo la diagonale: d_{1,1}, poi d_{2,2}, poi d_{3,3}, e così via. Costruisci un nuovo numero s = 0.s₁ s₂ s₃ … scegliendo ogni cifra sₙ in modo che differisca da d_{n,n}. Una ricetta sicura è scambiare 5 ↔ 6 (qualunque regola che eviti 0 e 9 aggira l'ambiguità 0.999… = 1.000…).",
        },
        {
          pretitle: "Passo tre · Perché s manca",
          title: "Diverso nell'n-esima cifra, ogni volta",
          body: "Per costruzione s differisce da r₁ nella prima cifra decimale, da r₂ nella seconda, da r₃ nella terza — da rₙ nell'n-esima, per ogni n. Quindi s non può essere uguale a nessun rₙ dell'elenco. Eppure s è un numero reale perfettamente buono in [0, 1]. L'elenco doveva contenere ogni tale reale, ed eccone uno che ha saltato. L'assunzione collassa: nessun elenco dei reali può essere completo. I reali tra 0 e 1 sono non numerabili.",
        },
        {
          pretitle: "Passo quattro · Un nuovo tipo di infinito",
          title: "Continuo, fermata, Gödel — stessa diagonale",
          body: "I reali hanno cardinalità strettamente maggiore dei naturali: |ℝ| = 2^ℵ₀ = c > ℵ₀. Lo stesso trucco diagonale alimenta la dimostrazione di Turing che il problema della fermata è indecidibile, e il primo teorema di incompletezza di Gödel — entrambi costruiscono una proposizione in disaccordo con ogni voce di un elenco di candidati. Cantor chiese poi se esistesse una qualche cardinalità che vivesse strettamente tra ℵ₀ e c. Questa è l'ipotesi del continuo. Gödel (1940) e Cohen (1963) mostrarono insieme che essa è indipendente da ZFC: supponila vera e gli assiomi restano coerenti; supponila falsa e gli assiomi restano coerenti. La matematica, su questo punto, lascia la porta aperta.",
        },
      ],
    },
    boids: {
      pretitle: "Tema · Computazione",
      title: "Boid",
      tagline: "Tre regole locali. Un intero stormo.",
      intro:
        "Craig Reynolds diede a ogni uccello simulato tre piccoli istinti nel 1986 e li liberò — nessun capo, nessun piano globale, nessuna mappa condivisa. Da quei tre impulsi locali emerse uno stormo. L'Esploratore ti consente di regolare le tre regole in tempo reale e di guardare l'intera coreografia diffondersi.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'agente",
          title: "Un punto con una direzione",
          body: "Ogni boid è un piccolo punto in movimento: ha una posizione e una velocità. Questa è l'intera memoria che ogni agente porta con sé. Non può vedere l'intero stormo — solo la manciata di vicini entro un piccolo raggio di percezione. Non c'è mappa, nessun capo da seguire, nessun passaggio di messaggi tra agenti. Solo una posizione, una velocità e ciò che è in vista.",
        },
        {
          pretitle: "Passo due · Le tre regole",
          title: "Separazione, allineamento, coesione",
          body: "A ogni fotogramma, ogni boid calcola tre piccoli vettori di sterzo dai vicini all'interno del suo raggio di percezione. SEPARAZIONE: allontanati da qualunque boid che si sia avvicinato troppo, pesato dalla vicinanza. ALLINEAMENTO: spingi la tua velocità verso la velocità media dei tuoi vicini. COESIONE: dirigiti verso il centro di massa dei vicini che vedi. I tre vettori vengono sommati con pesi e aggiunti alla velocità a ogni fotogramma. Questo è l'intero algoritmo.",
        },
        {
          pretitle: "Passo tre · Emergenza",
          title: "Nessun capo, nessun piano, nessuna chiacchiera",
          body: "Partendo da posizioni casuali e direzioni casuali, i boid si organizzano in stormi compatti in pochi secondi. Si formano flussi, si dividono attorno agli ostacoli e si rifondono — esattamente la coreografia delle reali murmurazioni di storni, delle palle-esca di sardine e degli sciami di pipistrelli. Nulla nel programma sa degli stormi. Lo stormo è ciò che le tre regole sembrano dall'esterno. È una delle dimostrazioni più pulite di emergenza in tutta l'informatica.",
        },
        {
          pretitle: "Passo quattro · Dove finisce",
          title: "Da SIGGRAPH 1987 al cielo notturno",
          body: "Reynolds chiamò gli agenti boid — abbreviazione per bird-oid object — e presentò l'articolo «Flocks, Herds, and Schools: A Distributed Behavioral Model» al SIGGRAPH 1987. Entro cinque anni il suo algoritmo animava lo sciame di pipistrelli in Batman - Il ritorno (1992) e la fuga precipitosa degli gnu ne Il Re Leone (1994). Oggi le stesse tre regole guidano simulazioni di evacuazione, ricerca sugli sciami robotici e la coreografia degli spettacoli di 1000 droni di Intel. Il modello a stormo è fratello dell'ottimizzazione a sciame di particelle — la stessa intuizione, riproposta per la ricerca.",
        },
      ],
    },
    aizawa: {
      pretitle: "Tema · Caos",
      title: "L'attrattore di Aizawa",
      tagline: "Il cugino più strano e bizzarro di Lorenz.",
      intro:
        "Tre equazioni differenziali accoppiate trascinano un singolo punto attraverso lo spazio 3D. Diversamente dalla farfalla di Lorenz, la traiettoria qui si ripiega in un toro annodato e con manico a cestino con un picco verticale che lo attraversa nel cuore — uno degli attrattori strani visivamente più distintivi della teoria del caos.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Le equazioni",
          title: "Tre equazioni, sette parametri",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Scegli un punto di partenza qualunque. Integra in avanti nel tempo usando un piccolo passo (il metodo di Eulero funziona; Runge–Kutta è meglio). Il punto traccia una curva nello spazio. Esegui per migliaia di passi e la curva torna a ridosso di sé stessa, poi se ne distacca — non si ripete mai esattamente, restando sempre dentro una regione limitata. Questo è l'attrattore strano.",
        },
        {
          pretitle: "Passo due · La geometria predefinita",
          title: "Vaso, cestino, picco",
          body: "Con i parametri classici di Aizawa (a = 0.95, b = 0.7, c = 0.6, d = 3.5, e = 0.25, f = 0.1), la traiettoria si avvolge attorno a un toro nella metà inferiore della figura, poi sale attraverso un sottile collo verticale e torna giù nel toro sul lato opposto. Il risultato somiglia a un vaso scanalato con un filo che lo attraversa. Da un certo angolo sembra un cestino. Da un altro sembra un cuore con un picco. La componente visiva è parte del motivo per cui l'attrattore di Aizawa è sfuggito ai manuali: fotografa meglio di tutti gli altri.",
        },
        {
          pretitle: "Passo tre · Regolare le manopole",
          title: "Geometria sensibile",
          body: "Aizawa è più ricco di parametri di Lorenz, il che gli dà maggiore sensibilità alla regolazione. Diminuisci il parametro c di 0.1 e il picco si ritrae nel cestino. Aumenta d e i giri sottostanti diventano più stretti, più densi, come una tessitura più stretta. Alcune combinazioni di parametri collassano in un ciclo limite (non più caos); altre esplodono all'infinito. Il regime caotico è una stretta banda dello spazio dei parametri, e la geometria al suo interno si trasforma con continuità mentre fai scorrere le manopole.",
        },
        {
          pretitle: "Passo quattro · Una piccola famiglia",
          title: "Rössler, Thomas e amici",
          body: "Aizawa è una voce in una piccola famiglia di attrattori strani a tre equazioni scoperti negli anni Settanta e Ottanta. Rössler (1976) è ancora più semplice — un solo termine non lineare, e la traiettoria è una spirale piatta con una torsione ripiegata, come una rosetta di Möbius. L'attrattore ciclicamente simmetrico di Thomas usa solo funzioni seno e produce un groviglio di cubi connessi da fili caotici. Tutti e tre vivono in 3D con traiettorie continue — niente passo temporale, niente griglia, niente discretizzazione, solo matematica che trascina un punto.",
        },
      ],
    },
    dla: {
      pretitle: "Tema · Caos",
      title: "Aggregazione limitata dalla diffusione",
      tagline: "Camminatori casuali si congelano al tocco — e fanno crescere coralli.",
      intro:
        "Un pixel seme. Uno sciame di particelle, ciascuna sulla propria passeggiata casuale. Nell'istante in cui una particella errante urta l'aggregato, vi resta attaccata per sempre. Ripeti diecimila volte e una dendrite ramificata sboccia dal nulla — la stessa forma che assume il rame quando elettrodepositato, che assume il lichene su un muro, che il fulmine lascia sulla pelle nuda.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'impostazione",
          title: "Un seme e una nebbia di camminatori",
          body: "Parco giochi a griglia di pixel. Disponi un singolo pixel nero al centro: il seme. Ora rilascia una particella in un punto casuale lontano dal seme. La particella effettua una passeggiata casuale — ogni passo sceglie uniformemente una delle quattro direzioni — e continua finché o atterra accanto all'aggregato (e ne diventa parte) o si allontana troppo (e viene dimenticata). Rilascia la particella successiva. E la successiva. Diecimila particelle dopo, hai un'immagine.",
        },
        {
          pretitle: "Passo due · La regola dell'attaccamento",
          title: "Tocco = congelamento, per sempre",
          body: "C'è una sola regola. Una particella che cammina e diventa adiacente a un qualunque pixel dell'aggregato diventa essa stessa pixel dell'aggregato, e smette di muoversi. È tutta la fisica. Il motivo per cui la struttura è ramificata e non a macchia è geometrico: un camminatore errante ha molta più probabilità di essere intercettato da una punta esposta dell'aggregato che di farsi strada giù in un fiordo profondo. Le punte crescono più velocemente delle valli. Si formano i rami. L'interno è affamato di nuovi arrivi.",
        },
        {
          pretitle: "Passo tre · La dimensione frattale",
          title: "1.71 — indipendente dal seme",
          body: "Witten e Sander pubblicarono il modello nel 1981 e mostrarono numericamente che su un reticolo 2D l'aggregato risultante ha dimensione frattale ≈ 1.71. Quello è strettamente tra una curva (dimensione 1) e una regione piena (dimensione 2), e — crucialmente — non dipende dalla forma del seme, dal tipo di reticolo o dal raggio di spawn. Processi fisici differenti che apparentemente sembrano del tutto diversi danno esattamente la stessa dimensione. Il numero è universale nello stesso senso in cui lo è π.",
        },
        {
          pretitle: "Passo quattro · Dove compare",
          title: "Rame, fulmini, licheni, neuroni",
          body: "Sostituisci i camminatori astratti con ioni di rame in una soluzione di solfato e accendi una corrente; il metallo si deposita sul catodo nello stesso pattern dendritico. Sostituiscili con elettroni che filtrano attraverso un dielettrico e ottieni una figura di Lichtenberg — la cicatrice a forma di fulmine che l'alta tensione lascia sul legno, sull'acrilico o su un corpo umano colpito. Sostituiscili con spore aeree che atterrano su un albero e ottieni la silhouette di una colonia di lichene. Ogni volta che la diffusione si imbatte in qualcosa di irreversibilmente appiccicoso, puoi prevedere l'immagine da una sola regola.",
        },
      ],
    },
    langton: {
      pretitle: "Tema · Computazione",
      title: "La formica di Langton",
      tagline: "Due regole · diecimila passi · un'autostrada.",
      intro:
        "Disponi una singola formica su una griglia infinita di caselle bianche. Due regole le dicono cosa fare. Per i primi diecimila passi la traccia sembra caos. Poi — senza preavviso — passa a un pattern periodico perfetto di 104 passi che si dirige verso l'infinito. Due regole, un miracolo emergente inspiegato.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Le regole",
          title: "Due righe sono l'intero programma",
          body: "C'è una formica rivolta verso una delle quattro direzioni, su una griglia quadrata infinita dove ogni cella è bianca o nera. A ogni tick: guarda la cella su cui stai. Se è BIANCA: capovolgila a nera, gira di 90° in senso orario, avanza di una cella. Se è NERA: capovolgila a bianca, gira di 90° in senso antiorario, avanza di una cella. Questa è la specifica completa — Christopher Langton la scrisse nel 1986. Non c'è numero casuale, nessuna consultazione del vicinato, nessun parametro. Due righe.",
        },
        {
          pretitle: "Passo due · Tre regimi",
          title: "Simmetria semplice, poi caos, poi…",
          body: "Esegui la formica da una griglia vuota e osserva. Per circa 100 passi la traccia è piccola e bilateralmente simmetrica — le regole sono deterministiche, l'avvio è vuoto, il pattern deve rispettare entrambi gli assi. Attorno al passo 500 la simmetria si frantuma e la traccia sembra essenzialmente casuale: un groviglio di quadrati neri senza struttura visibile a nessuna scala. Quella fase dura grossomodo diecimila passi e frustrò i ricercatori per quasi un decennio. Poi inizia il terzo regime.",
        },
        {
          pretitle: "Passo tre · L'autostrada",
          title: "Un ciclo di 104 passi, alla deriva per sempre",
          body: "Da qualche parte attorno al passo 10.000 — il momento esatto dipende dal pattern di bit iniziale ma è sempre lì attorno — la formica si blocca in un ciclo ripetuto di 104 passi che la trasla di due celle in diagonale a ogni giro. Dall'esterno sembra che stia stendendo una ordinata «autostrada» a strisce verso l'angolo. La seguirà, indisturbata, per sempre. Bunimovich e Troubetzkoy dimostrarono nel 1992 che, qualunque sia la configurazione finita di celle nere con cui parti, la traiettoria della formica è sempre illimitata — non può essere intrappolata. Se l'autostrada compaia sempre è ancora una congettura aperta. Finora lo ha sempre fatto.",
        },
        {
          pretitle: "Passo quattro · Perché è importante",
          title: "Universalità, nascosta in due righe",
          body: "Prendi la formica e sostituisci «due colori» con «n colori» e una regola di svolta diversa per colore. Alcune di quelle formiche generalizzate sono Turing-complete — Gajardo, Moreira e Goles lo dimostrarono: puoi codificare qualunque programma per calcolatore nel pattern di bit iniziale, e la traiettoria della formica è l'esecuzione di quel programma. Quindi un sistema abbastanza semplice da stare su un tovagliolo è, sotto mentite spoglie, ogni possibile calcolatore che sarà mai costruito. Quello è l'enigma dell'emergenza cellulare nella sua forma più pura.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Tema · Geometria",
      title: "Il triangolo di Pascal (mod n)",
      tagline: "Colora per divisibilità — esce un frattale.",
      intro:
        "Il triangolo di Pascal è la tabella di consultazione dei coefficienti binomiali C(n, k). Ogni numero è semplicemente la somma dei due sopra di esso. Riduci ogni voce modulo un primo e il pattern di colori risultante è un frattale perfetto e infinito. Perché? A causa di quando avvengono i riporti nell'addizione in base p.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Il triangolo",
          title: "Numeri dalla regola più semplice della Terra",
          body: "Scrivi 1 al vertice. Sotto, ogni voce è la somma delle due sopra di essa (tratta le posizioni vuote come zero). Le prime sei righe: 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. I numeri sono i coefficienti binomiali C(n, k) — contano i modi di scegliere k elementi da n. Compaiono in probabilità, in algebra (l'espansione di (a + b)ⁿ), in combinatoria. Sono anche l'unico ingrediente necessario per vedere un frattale.",
        },
        {
          pretitle: "Passo due · Colora per resto",
          title: "Mod 2: celle dispari riempite, celle pari vuote",
          body: "Ora sostituisci ogni voce con il suo resto modulo 2 (la sua parità). Riempi gli 1, lascia gli 0 vuoti e fai un passo indietro. Ciò che vedi è il triangolo di Sierpiński — esatto, infinito, generato puramente contando. Prendi un blocco qualunque di 2^k righe e l'immagine è tre copie dello stesso blocco di dimensione 2^(k-1) disposte in triangolo, con un buco in mezzo. La stessa struttura autosimile va fino in fondo.",
        },
        {
          pretitle: "Passo tre · Il teorema di Kummer",
          title: "La legge nascosta: conta i riporti",
          body: "Perché Pascal mod p si fattorizza così pulitamente? Nel 1852, Kummer dimostrò un fatto sorprendente. La potenza massima di un primo p che divide C(n, k) è uguale al numero di riporti che avvengono quando sommi k e (n − k) in base p. Quindi C(n, k) è divisibile per p (mod 0) esattamente quando c'è almeno un riporto; è non zero mod p esattamente quando k può essere sommato a (n − k) in base p senza riporti — cioè quando ogni cifra in base p di k è al più la corrispondente cifra in base p di n. Il frattale è, segretamente, un'immagine di quando l'addizione in base p è pulita.",
        },
        {
          pretitle: "Passo quattro · Altri primi",
          title: "p diverso, guarnizione diversa",
          body: "Per p = 3 ottieni una guarnizione triangolare con tre colori e una struttura autosimile a 3 facce. Per p = 5 il periodo è 5; per p = 7 la guarnizione è ancora più densa. Al crescere di p, la dimensione di Hausdorff del frattale si avvicina a 2 — l'immagine si riempie. Per moduli non primi la struttura esiste ma diventa irregolare (il pulito conteggio dei riporti di Kummer funziona solo per i primi). Una sola tabella combinatoria semplice, una famiglia infinita di frattali.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Tema · Analisi",
      title: "L'albero di Stern–Brocot",
      tagline: "Ogni frazione, esattamente una volta — costruita sommando male.",
      intro:
        "Parti da 0/1 e 1/0 — le due impossibilità. Inserisci tra esse una nuova frazione sommando separatamente numeratori e denominatori, come farebbe un bambino. Ripeti per sempre. L'albero infinito che costruisci contiene ogni frazione positiva una volta, ridotta ai minimi termini — e il percorso fino a ciascuna è esattamente la sua espansione in frazione continua.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La mediante",
          title: "Somma i pezzi separatamente, ottieni qualcosa di nuovo",
          body: "Prendi due frazioni, a/b e c/d. La loro mediante è (a + c) / (b + d). Questo è, naturalmente, il modo sbagliato di sommare frazioni. Ma produce qualcosa di interessante: una frazione strettamente compresa tra a/b e c/d. Inizia con 0/1 e 1/0 (tratta 1/0 come +∞). La loro mediante è 1/1. Inserisci 1/1 tra di esse. Ora prendi le nuove coppie: (0/1, 1/1) dà 1/2; (1/1, 1/0) dà 2/1. Inserisci entrambe. Ripeti. Le frazioni marciano lungo la retta numerica, ognuna già nei minimi termini.",
        },
        {
          pretitle: "Passo due · Ogni frazione, una volta",
          title: "Nulla viene mancato, nulla viene ripetuto",
          body: "È un teorema — dimostrabile in poche righe — che i rami dell'albero di Stern–Brocot elencano i razionali positivi senza omissioni né ripetizioni: ogni frazione ridotta p/q si posa su uno e un solo nodo, con p e q già coprimi. Quindi l'albero è, simultaneamente, un catalogo completo dei razionali positivi, un testimone che ce ne sono solo numerabilmente tanti e un modo strutturalmente equo di costruirli. Stern (1858) e Brocot (1861) scoprirono lo stesso albero indipendentemente — Stern come pezzo di teoria dei numeri, Brocot come strumento di orologiaio per scegliere rapporti di ingranaggi.",
        },
        {
          pretitle: "Passo tre · Il percorso a frazione continua",
          title: "Sinistra e destra codificano l'espansione",
          body: "Scegli un numero positivo qualsiasi — razionale o irrazionale. Cammina giù per l'albero partendo da 1/1. A ogni passo vai a SINISTRA se il tuo obiettivo è più piccolo della frazione attuale, a DESTRA se più grande. Annota la sequenza di mosse come una lista di lunghezze di esecuzione. Quella lista è esattamente l'espansione in frazione continua del tuo obiettivo. Per esempio: la sezione aurea φ = (1+√5)/2 ≈ 1.618 produce il percorso R, L, R, L, R, L, … — alternato uno per uno — che codifica la frazione continua [1; 1, 1, 1, 1, …]. φ è, in questo senso, il numero irrazionale «più difficile» da approssimare con razionali.",
        },
        {
          pretitle: "Passo quattro · Approssimazioni migliori",
          title: "Fermarsi presto dà i convergenti",
          body: "Ferma la camminata dopo un qualunque numero finito di passi. La frazione su cui stai è una migliore approssimazione razionale del tuo obiettivo — migliore di qualunque razionale con denominatore più piccolo. Quindi la successione di frazioni che visiti sulla strada verso π ti dà 3, 22/7, 333/106, 355/113, 103993/33102 — i famosi convergenti che le culture umane hanno continuato a riscoprire nei secoli. La stessa costruzione che enumera i razionali sceglie anche i migliori in assoluto.",
        },
      ],
    },
    ulam: {
      pretitle: "Tema · Analisi",
      title: "La spirale di Ulam",
      tagline: "Numeri primi allineati lungo diagonali che nessuno sa spiegare del tutto.",
      intro:
        "Stanisław Ulam, annoiato durante una conferenza del 1963, scarabocchiò gli interi in una spirale quadrata e cerchiò i primi. I primi non si sparpagliarono. Si affollarono lungo diagonali visibili. Perché i primi preferiscano certe forme quadratiche rispetto ad altre è uno dei più profondi problemi irrisolti della teoria dei numeri — Ulam lo vide su un tovagliolo.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La spirale",
          title: "1 al centro, poi cammina in quadrati",
          body: "Scrivi 1 al centro. Fai un passo a destra per scrivere 2. Fai un passo in alto per scrivere 3. Fai un passo a sinistra per 4 e 5. Fai un passo in basso per 6, 7 e 8. Continua in una spirale quadrata che cresce verso l'esterno. Quando hai disposto cento numeri hai una griglia 10 × 10 in cui ogni cella contiene un intero positivo e gli interi adiacenti sulla pagina non sono più adiacenti sulla retta numerica. Quella è l'intera costruzione.",
        },
        {
          pretitle: "Passo due · Colora i primi",
          title: "Un pattern che non dovrebbe essere lì",
          body: "Ora riempi solo le celle il cui numero è primo — lascia il resto vuoto. Se i primi fossero davvero casuali tra gli interi, la griglia somiglierebbe a puntini uniformi, a statica. Invece, l'occhio è attirato lungo chiare linee diagonali che scorrono attraverso l'immagine. Il pattern non è sottile: anche una patch di trenta per trenta lo mostra già. Ulam, Myron Stein e Mark Wells pubblicarono l'osservazione nel 1964 con una griglia di 65.000 numeri stampata su più pagine di Scientific American.",
        },
        {
          pretitle: "Passo tre · Perché le diagonali",
          title: "Ogni diagonale è un polinomio 4n² + bn + c",
          body: "I numeri lungo qualunque diagonale della spirale di Ulam soddisfano una formula quadratica della forma 4n² + bn + c. Una diagonale piena di primi significa quindi che il polinomio è insolitamente ricco di primi. Alcuni sono spettacolari. Il polinomio di Eulero n² − n + 41 — scoperto nel 1772 — produce primi per ogni n da 0 a 40, e corrisponde a una striscia diagonale visibile. Se ci siano infiniti primi su tale diagonale è, per qualunque specifica diagonale, non dimostrato. La congettura di Bunyakovsky dice di sì; nessuno l'ha mostrato.",
        },
        {
          pretitle: "Passo quattro · Il problema più profondo",
          title: "Una questione aperta truccata",
          body: "La spirale di Ulam è un riarrangiamento cosmetico degli interi, ma le diagonali visibili codificano una profonda questione aperta: quali polinomi quadratici in ℤ[x] producono infiniti primi? Diverse congetture di Hardy–Littlewood e Bateman–Horn predicono densità esatte per questi primi — corrispondono spettacolarmente bene all'immagine — ma ogni previsione è condizionale. Lo scarabocchio di Ulam è una finestra sulla parte più ostinata della teoria analitica dei numeri, accidentalmente visibile a chiunque abbia carta a quadretti.",
        },
      ],
    },
    cardioid: {
      pretitle: "Tema · Geometria",
      title: "La cardioide della tazza di caffè",
      tagline: "La curva di luce nella tua tazza è il cuore di Mandelbrot.",
      intro:
        "Fai brillare la luce solare parallela su una tazza di caffè cilindrica. Le riflessioni dalla parete interna non convergono in un punto — avvolgono una curva a forma di cuore che fluttua sulla superficie del caffè. Quella curva è la cardioide r = 2a(1 − cos θ). La stessa equazione descrive il bulbo principale dell'insieme di Mandelbrot. Ogni mattina, la forma più famosa della dinamica viene disegnata nella luce.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'ottica",
          title: "Perché la luce si raggruppa in una tazza",
          body: "Un cerchio riflette un raggio orizzontale al doppio dell'angolo che la superficie forma con quel raggio — la legge della riflessione. Quindi un fascio di raggi orizzontali che colpisce l'interno di una tazza cilindrica viene aperto a ventaglio verso l'esterno del doppio dell'angolo locale. Non convergono in un singolo punto focale, perché la curvatura varia; invece, la famiglia di raggi riflessi avvolge una curva liscia. La parola dei matematici per questo inviluppo è caustica per riflessione. La caustica per riflessione di un cerchio, illuminato da raggi paralleli, è esattamente una cardioide.",
        },
        {
          pretitle: "Passo due · L'equazione",
          title: "r = 2a (1 − cos θ)",
          body: "In coordinate polari centrate in un vertice scelto, la cardioide è r(θ) = 2a(1 − cos θ). Quando θ = 0 il raggio è 0 (la cuspide). Quando θ = π il raggio è 4a (la punta lontana). La curva è tracciata da un punto sul bordo di un cerchio di raggio a che rotola attorno all'esterno di un cerchio fisso dello stesso raggio — da lì viene la parola: cardia significa cuore. È una delle curve algebriche più studiate dell'analisi classica.",
        },
        {
          pretitle: "Passo tre · Il bulbo principale di Mandelbrot",
          title: "Stessa equazione, un universo completamente diverso",
          body: "Ora lascia l'ottica. Zoom dentro l'insieme di Mandelbrot z ↦ z² + c. Il grande blob a forma di cuore al centro — la componente più grande — è una cardioide. Esattamente. Il suo confine è parametrizzato da c(t) = (1/2)·e^(it) − (1/4)·e^(2it), e quell'equazione è algebricamente una cardioide (nella variabile c). I valori di c all'interno di quel bulbo corrispondono a dinamiche con un singolo punto fisso attrattivo. La forma che appare in una tazza e la forma che appare nella teoria dell'iterazione sono la stessa forma — e non c'è ragione semplice per cui.",
        },
        {
          pretitle: "Passo quattro · E i bulbi più piccoli",
          title: "Una scala infinita di cerchi attaccati",
          body: "La cardioide principale dell'insieme di Mandelbrot ha dischi circolari più piccoli che pendono da essa a ogni frazione razionale p/q. Ogni disco corrisponde a dinamiche in cui il ciclo attrattivo ha periodo q. Il disco più grande, a sinistra, ha periodo 2; i due successivi hanno periodo 3; poi quattro dischi di periodo 4; e così via. Il frattale al confine dell'insieme di Mandelbrot è precisamente il confine tra queste regioni stabili e il caos. Caffè, ottica, iterazione complessa, gli oggetti più profondi della dinamica — tutti che indossano la stessa forma.",
        },
      ],
    },
    galton: {
      pretitle: "Tema · Analisi",
      title: "La tavola di Galton",
      tagline: "Le palline rimbalzanti disegnano sempre la stessa campana.",
      intro:
        "Il quincunx di Francis Galton è un triangolo di pioli. Lascia cadere una pallina dalla cima: a ogni piolo un testa-o-croce cinquanta e cinquanta la devia a sinistra o a destra, finché la gravità non la deposita in uno dei cestini di raccolta sul fondo. Lascia cadere diecimila palline e i cestini si riempiono — sempre — nella forma della distribuzione normale. La campana non è una coincidenza. È il Teorema del Limite Centrale reso tattile.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Il marchingegno",
          title: "Una scala di lanci di moneta equa",
          body: "Una tavola con N file di pioli sfalsati di mezzo piolo. Lascia cadere una pallina in cima. A ogni piolo che colpisce, rimbalza a sinistra o a destra con uguale probabilità — un lancio di moneta indipendente. Dopo N pioli la pallina è caduta in uno degli N + 1 cestini di raccolta, dove l'indice del cestino è il numero di rimbalzi a destra meno il numero di rimbalzi a sinistra, traslato per essere non negativo. Una pallina non ti insegna nulla. La forma appare solo al limite.",
        },
        {
          pretitle: "Passo due · L'atterraggio di Pascal",
          title: "I conteggi dei cestini sono binomiali",
          body: "Dopo N file, la probabilità che la pallina atterri nel cestino k (numerato da 0 a N) è C(N, k) / 2^N. I numeratori sono le voci della riga N del triangolo di Pascal. Quindi una tavola di Galton è, segretamente, una consultazione fisica dei coefficienti binomiali. Con N = 10 i cestini centrali ricevono le voci 252, 210, 210 — e i cestini più esterni ricevono la voce 1 (solo un percorso su tutti i 1024). La forma è già una campana discreta.",
        },
        {
          pretitle: "Passo tre · Il Teorema del Limite Centrale",
          title: "La campana è inevitabile",
          body: "Al crescere di N, la funzione di massa di probabilità binomiale converge alla densità gaussiana (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). Questo è il teorema di De Moivre–Laplace (1733), il primo caso storico del Teorema del Limite Centrale. Il CLT generale dice molto di più: prendi QUALUNQUE variabile aleatoria con varianza finita — bias, asimmetria, distribuzione che siano dannate — e somma N copie indipendenti. Dopo riscalamento, la somma converge a una gaussiana. La campana è ciò che le medie diventano sempre.",
        },
        {
          pretitle: "Passo quattro · Perché compare ovunque",
          title: "Qualunque somma di molti piccoli colpi",
          body: "Le altezze sono fatte di migliaia di piccoli contributi indipendenti. Lo sono anche i punteggi dei test, i punteggi del QI, gli errori di misura, i rendimenti giornalieri finanziari (sotto ipotesi restrittive). Ciascuno è una somma di molte piccole variabili aleatorie indipendenti, quindi ciascuno è approssimativamente gaussiano. È per questo che le curve a campana dominano la statistica e perché la deviazione standard ha un nome. La tavola di Galton è il modo più fisico di vedere il teorema all'opera — a 1000 palline la campana è già liscia, anche se nessuna pallina individualmente sa nulla di essa.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Tema · Caos",
      title: "Il pendolo magnetico",
      tagline: "Colora ogni partenza per il suo vincitore — e compare un frattale.",
      intro:
        "Sospendi un pendolo di ferro sopra tre magneti disposti a triangolo. Le leggi di Newton, l'attrazione magnetica, un tocco di attrito — tutto deterministico. Eppure la domanda «su quale magnete finisce?» non ha una risposta liscia. Colora ogni punto iniziale per il suo eventuale vincitore: bacini rosso, verde e blu, intrecciati a ogni scala.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La fisica",
          title: "Tre attrazioni, uno smorzamento, gravità verso il centro",
          body: "Monta un piccolo peso di ferro su uno spago flessibile sopra una piastra. Disponi tre magneti identici sulla piastra in un triangolo equilatero. Il pendolo è attratto verso ciascun magnete con una forza proporzionale a 1/r² (o 1/r³ per un modello a cubo inverso — entrambi sono usati in letteratura; il frattale qualitativo compare per entrambi). Una debole molla tira anche il pendolo verso il centro del triangolo. La resistenza dell'aria drena costantemente energia. Le equazioni del moto sono deterministiche; l'unica incognita è la posizione di partenza.",
        },
        {
          pretitle: "Passo due · I bacini di attrazione",
          title: "Tre regioni nello spazio dei punti iniziali",
          body: "Rilascia il pendolo da un punto iniziale sopra la piastra e integra le equazioni. Alla fine l'ampiezza del pendolo decade e si stabilizza direttamente sopra uno dei tre magneti — il vincitore. Ripeti per ogni punto iniziale in una griglia fine, colora ciascuno per il suo vincitore: rosso per il magnete 1, verde per il magnete 2, blu per il magnete 3. La piastra è ora colorata in tre bacini di attrazione. L'interno di ogni bacino è una regione colorata pulita. Il confine, tuttavia, non è una curva — è un frattale.",
        },
        {
          pretitle: "Passo tre · La frontiera frattale",
          title: "Ogni punto al confine confina con tutti e tre i colori",
          body: "Zoom dentro il confine tra due colori qualsiasi e ci trovi il terzo colore intercalato. Zoom di nuovo e trovi tutti e tre i colori arbitrariamente vicini a qualunque punto di confine. Questa è la proprietà definitoria di un bacino di Wada — una mostruosità topologica scoperta da Yoneyama nel 1917, poi utilizzata come arma dai teorici del caos negli anni Novanta. Il determinismo resta intatto: stessa partenza → stesso esito. Ma il più piccolo cambiamento nella posizione iniziale può capovolgere la risposta a uno qualsiasi dei tre magneti. La prevedibilità è scomparsa.",
        },
        {
          pretitle: "Passo quattro · Perché tutto ciò è importante",
          title: "Il caos ha un colore",
          body: "Il pendolo magnetico è la più pulita visualizzazione della dipendenza sensibile dalle condizioni iniziali in qualunque sistema meccanico classico. Lo stesso tipo di bacino frattale compare nei solutori del metodo di Newton (zoom dentro il confine dei bacini di Newton per una cubica e ottieni la stessa immagine), in modelli del sistema solare a lungo termine, nei biliardi caotici, nei regimi a punto fisso stabile dell'attrattore di Lorenz. Ovunque attrattori in competizione coesistano, i confini dei loro bacini tendono a essere frattali. Il mondo è pieno di queste frontiere nascoste; il pendolo magnetico ti consente solo di vederne una.",
        },
      ],
    },
    godel: {
      pretitle: "Argomento · Paradosso",
      title: "L'incompletezza di Gödel",
      tagline: "La matematica non sarà mai completa.",
      intro:
        "Kurt Gödel, Vienna, 1931. In ogni sistema formale coerente abbastanza ricco da esprimere l'aritmetica esistono enunciati veri che il sistema stesso non può dimostrare. L'Esploratore ti guida attraverso la numerazione di Gödel e la costruzione della frase autoreferenziale G che dice, in aritmetica, «io non sono dimostrabile».",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Il sogno di Hilbert",
          title: "Meccanizzare tutta la matematica",
          body: "Inizio del Novecento. I Principia Mathematica di Whitehead e Russell (1910–1913) tentavano di derivare ogni teorema dell'aritmetica da un'unica torre di assiomi logici. David Hilbert, nel suo programma di Parigi del 1900 e poi nella spinta formalista degli anni Venti, chiedeva un sistema finito e meccanico dal quale si potesse dimostrare ogni enunciato vero e la cui coerenza potesse essere dimostrata dall'interno. Una matematica formale completa, coerente, decidibile. Chiunque, con carta e pazienza, avrebbe potuto in linea di principio risolvere ogni questione matematica. Questo era il sogno.",
        },
        {
          pretitle: "Passo due · La numerazione di Gödel",
          title: "Aritmetica che parla di sé stessa",
          body: "La prima mossa di Gödel fu un trucco di codifica. Assegna a ciascun simbolo del linguaggio formale un numero — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, parentesi, variabili, e così via. Poi codifica un'intera formula (s₁, s₂, …, sₖ) come il singolo numero naturale 2^s₁ · 3^s₂ · 5^s₃ · … usando primi consecutivi. Per l'unicità della fattorizzazione in primi la codifica è invertibile. Anche le dimostrazioni — successioni di formule — ricevono dei numeri. D'un tratto proprietà come «x è una dimostrazione di y» diventano predicati aritmetici Prov(x, y) che il sistema formale può esprimere sui propri stessi enunciati.",
        },
        {
          pretitle: "Passo tre · Il trucco diagonale",
          title: "G dice: «G non è dimostrabile»",
          body: "Usando il lemma diagonale — discendente diretto dell'argomento diagonale di Cantor del 1891 — Gödel costruì una frase G il cui numero di Gödel è ⌜G⌝, e che è aritmeticamente equivalente a ¬∃x Prov(x, ⌜G⌝): «nessun numero x è una dimostrazione della formula di numero di Gödel ⌜G⌝». In linguaggio comune: G dice «io non sono dimostrabile in questo sistema». Ora la stretta. Se G è dimostrabile, il sistema dimostra un enunciato falso ed è incoerente. Se G è indimostrabile, allora ciò che G afferma è esattamente vero — ma il sistema non può dimostrarlo. In entrambi i casi il sogno di Hilbert di un'aritmetica completa e coerente crolla. Il Secondo Teorema di Incompletezza segue quasi subito: un tale sistema non può dimostrare la propria coerenza, perché se potesse dimostrerebbe anche G, contraddicendo il Primo.",
        },
        {
          pretitle: "Passo quattro · Dove si è diffuso",
          title: "Tarski, Turing, Church, e ogni proof assistant da allora",
          body: "Lo stesso trucco diagonale continua a ripresentarsi. Alfred Tarski (1933) dimostrò che la verità nell'aritmetica non è definibile all'interno dell'aritmetica — indefinibilità della verità. Alan Turing (1936) mostrò che il problema dell'arresto è indecidibile diagonalizzando sulle macchine di Turing. Alonzo Church (1936) dimostrò che la logica del primo ordine stessa è indecidibile. Ogni risultato è, strutturalmente, un cugino di quello di Gödel: un sistema abbastanza ricco da descrivere sé stesso contiene una domanda su sé stesso a cui non sa rispondere. I moderni proof assistant — Coq, Lean, Isabelle, HOL — operano sotto i limiti di Gödel: possono meccanizzare un'enorme quantità di matematica, ma non possono dimostrare la propria coerenza, ed esistono enunciati concreti di teoria dei numeri (teorema di Goodstein, Paris–Harrington) che sono veri e dimostrabilmente indimostrabili nell'aritmetica di Peano. Il sogno è finito; l'edificio è più grande che mai.",
        },
      ],
    },
    halting: {
      pretitle: "Argomento · Calcolo",
      title: "Il problema dell'arresto",
      tagline: "Nessun programma può predire ogni altro programma.",
      intro:
        "Alan Turing, 1936. Dato un programma P e un input x, possiamo sempre decidere se P si ferma su x? Turing disse di no — e lo dimostrò con un trucco diagonale autoreferenziale che nessuna macchina può schivare. L'Esploratore esegue una manciata di programmi giocattolo su un piccolo nastro così puoi vederne alcuni terminare, altri andare avanti per sempre, e un programma — il diagonale D — contorcersi nella contraddizione che Turing mise per iscritto.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La domanda",
          title: "P si ferma su x?",
          body: "Dato il codice sorgente di un programma P e un input x, decidi se P prima o poi termina oppure se gira per sempre. Sembra qualcosa che un analizzatore sufficientemente astuto dovrebbe sempre poter determinare — i programmi sono stringhe finite di simboli, in fondo, e un computer può simularli. David Hilbert, nel suo Entscheidungsproblem del 1928, chiedeva esattamente una tale procedura universale di decisione. A metà degli anni Trenta Alonzo Church (tramite il λ-calcolo) e Alan Turing (tramite ciò che oggi chiamiamo macchine di Turing) si stavano avvicinando alla stessa risposta da direzioni opposte.",
        },
        {
          pretitle: "Passo due · La contraddizione di Turing",
          title: "Assumi halts(P, x), poi costruisci D",
          body: "Supponi, per assurdo, che esista una funzione totale calcolabile halts(P, x) che restituisce ⊤ quando P si ferma sull'input x e ⊥ altrimenti. Possiamo allora scrivere un nuovo programma D(P): calcola halts(P, P); se restituisce ⊤, gira in loop per sempre; se restituisce ⊥, fermati subito. D è lecito — ogni suo passo è calcolabile per ipotesi. Ora chiediti: cosa restituisce halts(D, D)? Se halts(D, D) = ⊤, allora per definizione di D il programma D va in loop sull'input D — quindi D non si ferma su D, contraddicendo ⊤. Se halts(D, D) = ⊥, allora D si ferma su D — contraddicendo ⊥. In entrambi i casi la definizione si rompe, quindi non può esistere alcun halts del genere. (Turing 1936, ‘On Computable Numbers, with an Application to the Entscheidungsproblem’.)",
        },
        {
          pretitle: "Passo tre · Diagonalizzazione mascherata",
          title: "Cantor, Gödel, Turing — la stessa mossa",
          body: "Lo stesso trucco alimenta la diagonale di Cantor (costruisci un reale che differisce dall'n-esimo reale elencato nell'n-esima cifra), il primo teorema di incompletezza di Gödel (costruisci una frase che dice ‘io non sono dimostrabile’) e l'argomento dell'arresto di Turing (costruisci un programma che fa l'opposto di quanto dice il decisore). Ogni costruzione dispone i candidati in una lista e legge lungo la diagonale per forgiare un oggetto che la lista non può contenere. Il problema dell'arresto fu il primo problema di decisione concreto a essere dimostrato indecidibile — il momento in cui i limiti del calcolo divennero un teorema.",
        },
        {
          pretitle: "Passo quattro · Perché conta oggi",
          title: "Il teorema di Rice e le ricadute pratiche",
          body: "Il teorema di Rice (Henry Gordon Rice, 1953) generalizza Turing: qualunque proprietà semantica non banale dei programmi — ‘restituisce mai zero?’, ‘perde memoria?’, ‘è malevolo?’ — è indecidibile. Gli analizzatori statici devono quindi approssimare: o sovrasegnalano (falsi positivi) o sottosegnalano (bug mancati), mai contemporaneamente puliti e completi. I compilatori vanno in timeout quando ottimizzano, rifiutandosi di inlineare oltre un'euristica. Gli antivirus non possono in generale catturare tutto il malware. Gli autoscaler in cloud non possono garantire che un job inviato si fermi; mettono invece un tetto al tempo CPU. Il problema dell'arresto non è una curiosità — è il muro contro cui ogni programma-su-programmi finisce per sbattere.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Argomento · Calcolo",
      title: "P contro NP",
      tagline: "La più grande domanda aperta dell'informatica.",
      intro:
        "Alcuni problemi sono facili da risolvere. Altri sono facili da verificare una volta che qualcuno ti porge la risposta. P contro NP chiede se queste due classi siano segretamente la stessa cosa — e un sì manderebbe in frantumi la crittografia moderna. L'Esploratore è un piccolo risolutore 3-SAT che ti consente di vedere perché la verifica è banale ma la ricerca è brutale: inserisci una formula, poi segui DPLL lungo l'albero di backtracking mentre prova assegnazioni e pota interi rami con una singola contraddizione.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Due classi di problemi",
          title: "Risolvibile in fretta vs verificabile in fretta",
          body: "P è la classe dei problemi di decisione che una macchina deterministica può risolvere in tempo polinomiale — moltiplicare due numeri, ordinare una lista, controllare se un grafo è connesso. NP è la classe in cui, data una soluzione candidata, una macchina in tempo polinomiale può verificare che la risposta sia corretta. Le due cose non sono ovviamente uguali. Il Sudoku è l'esempio da manuale: riempire una griglia 9×9 è davvero difficile, ma se un amico ti porge una griglia completata puoi confermare ogni riga, colonna e blocco con una singola passata lineare. La parte difficile è trovare la soluzione; quella facile è verificarla.",
        },
        {
          pretitle: "Passo due · NP-completezza",
          title: "Cook 1971, Karp 1972, Levin indipendentemente",
          body: "Nel 1971 Stephen Cook dimostrò il teorema di Cook-Levin: ogni problema in NP si riduce in tempo polinomiale alla soddisfacibilità booleana (SAT). Leonid Levin pubblicò lo stesso risultato indipendentemente in Unione Sovietica. Un anno dopo Richard Karp mostrò che 21 problemi classici — 3-SAT, Cammino Hamiltoniano, Cricca, Somma di Sottoinsieme, la versione decisionale del commesso viaggiatore — sono tutti mutuamente riducibili in tempo polinomiale. Oggi la lista arriva a migliaia: Sudoku N×N, Tetris, Campo Minato generalizzato, persino modelli reticolari di folding proteico appartengono tutti alla stessa classe di equivalenza. Risolvine uno in modo efficiente e li hai risolti tutti. Le riduzioni di Cook-Karp-Levin trasformarono una domanda su un singolo problema in una domanda su ogni problema di ricerca interessante in un colpo solo.",
        },
        {
          pretitle: "Passo tre · E se P = NP?",
          title: "La crittografia cade, la biologia si piega, l'universo diventa noioso",
          body: "Un algoritmo polinomiale per 3-SAT, composto con le riduzioni di Karp, romperebbe RSA (la fattorizzazione diventerebbe fattibile), spezzerebbe la crittografia a curve ellittiche, decifrerebbe ogni sessione TLS mai registrata e falsificherebbe ogni firma digitale. Il folding proteico collasserebbe in una consultazione polinomiale. Lo scheduling ottimo, l'allocazione ottima dei registri nei compilatori, la pianificazione ottima dei percorsi — tutti i problemi NP-difficili che gli ingegneri oggi approssimano — avrebbero soluzioni polinomiali esatte. La maggior parte degli informatici scommette contro: il sondaggio di Scott Aaronson nel campo mette >80% su P ≠ NP. Ma non esiste né una dimostrazione né una confutazione. L'inclusione di classi che sappiamo è P ⊆ NP ⊆ PSPACE ⊆ EXP, con P ⊊ EXP dimostrata dal teorema di gerarchia temporale — quindi almeno una di quelle inclusioni è stretta, ma nessuno sa quale.",
        },
        {
          pretitle: "Passo quattro · Il premio da 1 milione di dollari",
          title: "Problema del Millennio Clay, 2000",
          body: "Il Clay Mathematics Institute nominò P contro NP uno dei sette Problemi del Millennio nel maggio 2000, con un premio di 1 000 000 di dollari per una risoluzione corretta in un senso o nell'altro. È l'unico dei sette che tocca direttamente la tecnologia quotidiana. Decine di false dimostrazioni circolano ogni anno — l'annuncio di Vinay Deolalikar del 2010 è stato il tentativo recente più prominente e si sgretolò in poche settimane. L'attesa diffusa nella comunità è che la risposta sia P ≠ NP. La questione aperta non è quale sia la risposta, ma perché — e quale frammento di matematica conterrà la tecnica di limite inferiore giusta. Oltre quarant'anni di barriere (relativizzazione, dimostrazioni naturali, algebrizzazione) dicono che non verrà da alcun metodo che oggi conosciamo.",
        },
      ],
    },
    rsa: {
      pretitle: "Argomento · Calcolo",
      title: "RSA e funzioni unidirezionali",
      tagline: "Moltiplicare è facile. Fattorizzare è impossibile.",
      intro:
        "Rivest, Shamir e Adleman, 1977 — il primo crittosistema a chiave pubblica pubblicato e tuttora, quasi mezzo secolo dopo, quello che protegge la maggior parte di internet funzionante. L'Esploratore ti accompagna attraverso una generazione di chiavi, cifratura e decifratura RSA complete su numeri piccoli per farti vedere ogni passo: scegli i primi, ricava gli esponenti pubblico e privato, poi cifra un messaggio e guarda la stessa matematica riaprirlo.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'asimmetria",
          title: "Funzioni unidirezionali: facili in avanti, dure all'indietro",
          body: "Moltiplicare due primi enormi p e q è veloce — pochi millisecondi su un telefono. Recuperare p e q dal loro prodotto n = p · q non lo è: il miglior algoritmo classico noto (il setaccio del campo numerico generale) gira in tempo sub-esponenziale ma super-polinomiale, e un n a 2048 bit è comodamente fuori portata per ogni macchina mai costruita. Questa proprietà unidirezionale — economica in avanti, rovinosamente costosa all'indietro — è la fondazione della crittografia a chiave pubblica. RSA veste l'asimmetria in modo che una chiave pubblica possa essere consegnata a chiunque e solo chi possiede la chiave privata corrispondente possa leggere ciò che è stato scritto in risposta.",
        },
        {
          pretitle: "Passo due · Generazione delle chiavi",
          title: "Scegli e, ricava d con l'algoritmo di Euclide esteso",
          body: "Calcola φ(n) = (p − 1)(q − 1), la funzione totiente di Eulero — il numero di interi in [1, n] coprimi con n. Scegli un piccolo esponente pubblico e coprimo con φ(n); 65537 è la scelta canonica perché è primo, ha solo due bit settati e sopravvive a ogni attacco noto a esponente basso. Poi calcola l'esponente privato d = e⁻¹ mod φ(n) usando l'algoritmo di Euclide esteso: restituisce i coefficienti di Bézout (x, y) con e·x + φ(n)·y = 1, e ridurre x mod φ(n) dà d. La chiave pubblica è la coppia (n, e); la chiave privata è (n, d). Butta via p e q una volta che hai d in mano.",
        },
        {
          pretitle: "Passo tre · Cifrare e decifrare",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Tratta il testo in chiaro m come un intero in [0, n). Il testo cifrato è c = m^e mod n; la decifratura è m = c^d mod n. Il motivo per cui funziona viene dritto da Eulero e Fermat: poiché ed ≡ 1 mod φ(n), abbiamo m^(ed) = m^(1 + kφ(n)) ≡ m mod n per ogni m coprimo con n (teorema di Eulero), e un breve argomento con il teorema cinese del resto estende l'identità a ogni m in [0, n). L'esponenziazione binaria (square-and-multiply) trasforma gli esponenti giganti in qualche migliaio di moltiplicazioni modulari — veloce in pratica, matematicamente esatta.",
        },
        {
          pretitle: "Passo quattro · Dove sta oggi",
          title: "Da TLS alla migrazione post-quantistica",
          body: "RSA è la matematica sotto ogni handshake TLS che il tuo browser ancora negozia con un certificato RSA, sotto le chiavi host SSH, sotto le catene di firma del codice che autenticano le app di Apple e Google, sotto i passaporti elettronici e le prime generazioni di blockchain. Ma nel 1994 Peter Shor scrisse un algoritmo quantistico che fattorizza gli interi in tempo polinomiale — dato un computer quantistico fault-tolerant sufficientemente grande, RSA si rompe. Non ne esiste ancora uno, ma la tempistica è incerta abbastanza che il NIST ha standardizzato i sostituti post-quantistici (CRYSTALS-Kyber per lo scambio di chiavi nel 2024, CRYSTALS-Dilithium per le firme) e la migrazione globale è già in corso.",
        },
      ],
    },
    mobius: {
      pretitle: "Argomento · Geometria",
      title: "Nastro di Möbius e bottiglia di Klein",
      tagline: "Superfici con un solo lato.",
      intro:
        "Prendi una striscia di carta, dalle mezzo giro di torsione, incolla gli estremi — e hai una superficie con un solo lato e un solo bordo. L'Esploratore mostra un nastro di Möbius 3D rotante che puoi tagliare lungo rapporti diversi per vedere cosa ne esce: taglialo a metà e resta in un solo pezzo; taglialo a un terzo e ottieni due anelli concatenati. Un pulsante passa alla bottiglia di Klein, l'analogo chiuso che ha bisogno di quattro dimensioni per vivere senza intersecarsi.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Il mezzo giro",
          title: "Incolla gli estremi con un capovolgimento",
          body: "Prendi una striscia di carta rettangolare. Dai a un estremo un mezzo giro (180°) prima di incollarlo all'altro. Il risultato ha un solo bordo e un solo lato. Percorrila con una penna e coprirai ciò che sembrano entrambi i ‘lati’ senza mai attraversare il confine; segui il bordo e tornerai al punto di partenza dopo averlo percorso due volte. Scoperto indipendentemente da August Ferdinand Möbius e Johann Benedict Listing nel 1858 — la prima superficie non orientabile mai scritta esplicitamente. La sua caratteristica di Eulero è χ = 0.",
        },
        {
          pretitle: "Passo due · Sorprese al taglio",
          title: "Quello che le forbici rivelano sulla topologia",
          body: "Taglia il nastro di Möbius lungo la metà. Non si spezza — ottieni una striscia più lunga con due torsioni complete (quattro mezzi giri), e crucialmente quella striscia è di nuovo a due lati. Taglia un nastro di Möbius a un terzo da un bordo, mantenendo il taglio parallelo al bordo per tutto il giro, e le forbici percorrono due volte l'anello prima di chiudere il loop: ne escono due anelli concatenati — un nuovo nastro di Möbius più stretto (ancora con un solo mezzo giro) e un anello più lungo a due lati con due mezzi giri (che non è più un nastro di Möbius), intrecciati l'uno con l'altro. La topologia è piena di queste sorprese — la torsione globale nascosta dietro la planarità locale.",
        },
        {
          pretitle: "Passo tre · La bottiglia di Klein",
          title: "Felix Klein, 1882",
          body: "Ora prendi un tubo e incolla un'estremità all'altra dopo averla fatta passare attraverso la parete del tubo — facendo combaciare i cerchi con orientamento opposto. Nello spazio quadridimensionale questa è una superficie perfettamente liscia, chiusa, non orientabile: senza bordo, senza interno, senza esterno. Felix Klein la descrisse nel 1882. In tre dimensioni il passaggio costringe il tubo ad attraversare sé stesso, quindi ogni bottiglia di Klein di vetro che hai mai visto è un'immersione, non un vero embedding. Incolla due nastri di Möbius lungo i loro unici bordi e il risultato è esattamente una bottiglia di Klein.",
        },
        {
          pretitle: "Passo quattro · Dove vivono",
          title: "Dalle cinghie di trasmissione alla chimica",
          body: "I nastri di Möbius compaiono come cinghie di trasporto e di stampante (l'usura si distribuisce sull'intera superficie, raddoppiando la durata), come le sculture Endless Ribbon di Max Bill, come resistori di Möbius che cancellano la propria autoinduttanza, come guide d'onda a microonde superconduttrici di Möbius — e, dal 2003, come molecole aromatiche di Möbius sintetizzate da Rainer Herges. Il familiare triangolo del riciclo è, a rigore, un nastro di Möbius con tre mezzi giri — ancora a un solo lato, ma più ritorto del classico nastro a un solo mezzo giro. Soprattutto, il nastro di Möbius e la bottiglia di Klein sono le porte d'accesso alla classificazione delle superfici — il teorema secondo cui ogni superficie chiusa è determinata a meno di omeomorfismo dal genere, dall'orientabilità e da un singolo intero χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Argomento · Geometria",
      title: "La caratteristica di Eulero",
      tagline: "V − E + F = 2, qualunque sia la forma.",
      intro:
        "Descartes la scrisse nel 1639 ed Eulero la riscoprì un secolo dopo: conta i vertici, gli spigoli e le facce di qualsiasi poliedro convesso e V − E + F è sempre uguale a 2. L'Esploratore passa in rassegna i solidi platonici e archimedei e conteggia V, E, F dal vivo — vedi la formula reggere per cubo, dodecaedro e pallone da calcio. Poi piega la superficie attorno a una ciambella e guarda la costante cambiare.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · Conta vertici, spigoli, facce",
          title: "La costante che rifiuta di muoversi",
          body: "Prendi un cubo: 8 vertici, 12 spigoli, 6 facce. Sottrai e somma: 8 − 12 + 6 = 2. Prova un tetraedro: 4 − 6 + 4 = 2. Il pallone da calcio — un icosaedro troncato, dodici pentagoni e venti esagoni cuciti lungo i loro spigoli — ha 60 vertici, 90 spigoli, 32 facce, e 60 − 90 + 32 = 2 di nuovo. Passa in rassegna ogni solido platonico e archimedeo che i Greci abbiano mai disegnato, e la risposta è la stessa. La costante non è una coincidenza.",
        },
        {
          pretitle: "Passo due · Topologia, non geometria",
          title: "Schiaccia il cubo in una sfera",
          body: "Gonfia il cubo finché si gonfia in una sfera perfetta. Gli angoli si arrotondano, gli spigoli dritti si curvano, le facce piatte si gonfiano verso l'esterno — V − E + F resta 2. Lo stesso vale se lo schiacci in un pancake, lo torci in un uovo o lo tiri in qualunque forma tu voglia, purché tu non strappi, incolli o pratichi un foro. Il numero dipende solo dalla topologia. χ = 2 per qualsiasi forma topologicamente equivalente a una sfera — per la superficie di ogni poliedro convesso, di ogni ovoide liscio, di ogni patata.",
        },
        {
          pretitle: "Passo tre · I buchi la abbassano",
          title: "Ogni manico ti costa due",
          body: "Ora avvolgi la superficie attorno a una ciambella. Triangola il toro come vuoi — V − E + F scende a 0. Un doppio toro, due ciambelle incollate fianco a fianco, dà χ = −2. La regola è χ = 2 − 2g, dove g è il numero di buchi (il genere). Ogni manico che cuci ti costa 2. La caratteristica di Eulero misura la topologia in un singolo intero: ti dice quanti buchi ha una superficie chiusa, indipendentemente da come è disegnata o stirata.",
        },
        {
          pretitle: "Passo quattro · Perché conta",
          title: "Dai palloni da calcio alla medaglia Fields",
          body: "La chimica dei buckyball è imposta da χ: ogni gabbia di fullerene costruita con pentagoni ed esagoni deve contenere esattamente 12 pentagoni, perché la caratteristica di Eulero di una sfera è 2. Le cupole geodetiche di Buckminster Fuller seguono la stessa regola. Gli slicer per stampa 3D usano V − E + F per validare che una mesh sia chiusa e stampabile. Gauss-Bonnet lega la curvatura totale di una superficie liscia a 2π·χ, intrecciando geometria e topologia in una sola equazione. Il teorema dell'indice di Atiyah-Singer (medaglia Fields 1966) è il discendente moderno della stessa idea — e Dimostrazioni e confutazioni di Lakatos traccia i due secoli di casi limite che hanno quasi rotto V − E + F = 2 per poi rafforzarla.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Argomento · Analisi",
      title: "I ponti di Königsberg",
      tagline: "Sette ponti, una passeggiata impossibile.",
      intro:
        "Si poteva attraversare Königsberg, percorrere ogni ponte esattamente una volta e tornare al punto di partenza? L'Esploratore ti consente di provare la passeggiata da solo, vedere dal vivo l'argomento di parità mentre attraversi ogni ponte, e aggiungere o togliere ponti per rendere la passeggiata possibile.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'enigma",
          title: "Una passeggiata che nessuno trovava",
          body: "Königsberg si estendeva a cavallo del fiume Pregel con due isole e due sponde — quattro masse di terra in totale — collegate da sette ponti. I cittadini si ponevano una domanda da passeggiata domenicale: si poteva fare una camminata per la città che attraversasse ogni ponte esattamente una volta e terminasse al punto di partenza? Tutti ci provavano. Tutti fallivano. Nessuno riusciva a dimostrare che fosse impossibile.",
        },
        {
          pretitle: "Passo due · La riduzione di Eulero",
          title: "La geometria diventa topologia",
          body: "Nel 1736 Leonhard Euler fece qualcosa che nessuno aveva fatto prima. Ignorò le distanze. Ignorò gli angoli. Ignorò quale ponte fosse a monte di quale. Disegnò le quattro masse di terra come quattro punti e i sette ponti come sette spigoli. La mappa divenne un grafo. Il problema della posizione — geometria situs — era nato, e con esso sia la teoria dei grafi sia la topologia.",
        },
        {
          pretitle: "Passo tre · L'argomento di parità",
          title: "Ogni massa di terra ha bisogno di un conteggio pari",
          body: "Ogni volta che entri in una massa di terra usi un ponte; quando esci ne usi un altro. Quindi ogni massa di terra ha bisogno di un numero pari di ponti incidenti — tranne, eventualmente, l'inizio e la fine della passeggiata. Königsberg aveva quattro masse di terra, tutte con un numero dispari di ponti. Quattro vertici di grado dispari sono due di troppo. Impossibile.",
        },
        {
          pretitle: "Passo quattro · La nascita della teoria dei grafi",
          title: "Da una passeggiata domenicale al mondo moderno",
          body: "Lo stesso argomento di parità oggi alimenta il routing GPS, il Problema del Postino Cinese (usato per ottimizzare i percorsi di spazzaneve, camion della spazzatura e postini) e l'assemblaggio del DNA — ogni assemblatore moderno di genoma percorre un cammino euleriano in un grafo di de Bruijn. La seconda guerra mondiale distrusse due dei ponti di Königsberg; solo cinque dei sette originali restano. Il grafo attuale ha esattamente due vertici di grado dispari, quindi oggi la passeggiata è finalmente possibile — anche se Eulero non è più qui per farla.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Argomento · Analisi",
      title: "Il teorema dei quattro colori",
      tagline: "Ogni mappa piana basta colorarla con quattro colori.",
      intro:
        "Qualunque mappa disegnata sul piano può essere colorata con al più quattro colori in modo che due regioni che condividono un confine non ricevano lo stesso colore. L'Esploratore ti consente di costruire mappe e vedere un algoritmo di colorazione con backtracking assegnare al più quattro colori — regione per regione, scegliendo ogni volta la più piccola scelta valida.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · La congettura",
          title: "Francis Guthrie, 1852",
          body: "Mentre colorava una mappa delle contee d'Inghilterra, il giovane Francis Guthrie notò che quattro colori sembravano sempre bastare. Lo chiese al fratello Frederick, che lo chiese al loro insegnante Augustus De Morgan, che lo chiese a chiunque. La congettura sembrava innocua — e mise in scacco i matematici per 124 anni. Diverse dimostrazioni pubblicate (Kempe 1879, Tait 1880) si rivelarono contenere lacune sottili che nessuno individuò per oltre un decennio.",
        },
        {
          pretitle: "Passo due · Perché tre non bastano, cinque sono troppi",
          title: "Quattro è il limite preciso",
          body: "Tre colori non bastano dimostrabilmente — quattro regioni mutuamente adiacenti possono già essere disegnate nel piano (pensa a tre paesi che si incontrano in un angolo con un quarto che li circonda). Il teorema dei cinque colori, dovuto a Heawood nel 1890, è dimostrabile in una pagina usando la formula di Eulero V − E + F = 2 e un attento argomento sui gradi. Chiudere il divario da cinque a quattro è ciò che ha richiesto altri ottantasei anni.",
        },
        {
          pretitle: "Passo tre · La dimostrazione di Appel-Haken, 1976",
          title: "Il primo teorema dimostrato al computer",
          body: "Kenneth Appel e Wolfgang Haken all'Università dell'Illinois ridussero il problema a una lista finita di 1834 \"configurazioni inevitabili\" — e poi mostrarono che ciascuna è riducibile. La loro dimostrazione girò su un IBM 370 per circa 1200 ore. Molti matematici rifiutarono di accettarla: una dimostrazione che un umano non può leggere per intero, sostenevano, non è una dimostrazione. La posta in uscita del dipartimento di matematica dell'Università dell'Illinois venne affrancata con \"Four Colors Suffice\" per anni.",
        },
        {
          pretitle: "Passo quattro · Dove sta",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier, e oltre",
          body: "Nel 1996 Robertson, Sanders, Seymour e Thomas semplificarono la dimostrazione a 633 configurazioni e a un argomento di discharging più pulito. Nel 2005 Georges Gonthier meccanizzò l'intera dimostrazione dentro il proof assistant Coq — ogni passo logico, inclusa l'analisi per casi, verificato dalla macchina da cima a fondo. Il teorema oggi alimenta l'assegnazione delle frequenze nelle reti cellulari, l'allocazione dei registri nei compilatori e problemi di scheduling e timetabling ovunque i conflitti formino un grafo planare.",
        },
      ],
    },
    smallworld: {
      pretitle: "Argomento · Analisi",
      title: "Sei gradi e piccoli mondi",
      tagline: "Due persone qualsiasi, a sei strette di mano di distanza.",
      intro:
        "Stanley Milgram inviò lettere a sconconosciuti e scoprì che, in media, sei inoltri le portavano attraverso l'America. Quarant'anni dopo Watts e Strogatz mostrarono perché: un pizzico di scorciatoie casuali in una rete altrimenti regolare fa collassare la lunghezza media dei cammini senza toccare il clustering locale. L'Esploratore ti consente di regolare la probabilità di ricablaggio p di Watts-Strogatz e guardare la lunghezza media dei cammini L crollare in tempo reale.",
      ctaInteractive: "→ Apri l'Esploratore",
      sections: [
        {
          pretitle: "Passo uno · L'esperimento delle lettere",
          title: "Milgram, 1967",
          body: "Stanley Milgram, allora a Harvard, spedì lettere a persone scelte a caso a Omaha e Wichita chiedendo loro di inoltrare la lettera, di mano in mano, a un agente di borsa bersaglio a Boston — ma solo tramite qualcuno che conoscessero personalmente, a nome di battesimo. La maggior parte delle lettere non arrivò mai. Quelle che arrivarono richiesero in media circa sei passaggi dal mittente al bersaglio. Nacque la frase da cultura pop «sei gradi di separazione». La scorciatoia: la società ha hub, e gli hub fanno la maggior parte dello smistamento.",
        },
        {
          pretitle: "Passo due · Watts e Strogatz, 1998",
          title: "Ricablare con probabilità p",
          body: "Parti da un reticolo ad anello: N nodi su un cerchio, ciascuno connesso ai suoi k vicini più prossimi su entrambi i lati. Il grafo ha alto clustering C — i tuoi amici sono amici tra loro — ma una lunga lunghezza media dei cammini L dell'ordine di N/k. Ora ricabla ciascuno spigolo con probabilità p verso una destinazione casuale. Man mano che p sale da 0, L collassa logaritmicamente mentre C si muove appena. Poche scorciatoie casuali rimpiccioliscono il mondo. La zona ideale, attorno a p ≈ 0.01 fino a 0.1, è il regime small-world: alto C come in un reticolo, basso L come in un grafo casuale.",
        },
        {
          pretitle: "Passo tre · Dove il mondo è davvero piccolo",
          title: "Film, cervelli, reti elettriche, il web",
          body: "I grafi di collaborazione accademica ci hanno dato il numero di Erdős; Hollywood ci ha dato il numero di Bacon (il gioco «Sei gradi di Kevin Bacon»). Il verme C. elegans ha un cervello da 302 neuroni perfettamente mappato con connettività small-world; i connettomi umani mostrano la stessa firma a scala molto maggiore. Reti elettriche, Internet, reti di citazioni, il grafo dei link di Wikipedia, le reti di interazione tra proteine — il regime small-world continua a spuntare ovunque qualcuno si prenda la briga di misurare L e C. Il mondo è piccolo, strutturalmente, quasi ovunque.",
        },
        {
          pretitle: "Passo quattro · Conseguenze",
          title: "Diffusione veloce, ricerca intelligente, cervelli malati",
          body: "Sulle reti small-world, virus, voci e idee raggiungono tutti in fretta — meraviglioso per la diffusione delle innovazioni, terribile durante una pandemia. Kleinberg (2000) dimostrò che la ricerca greedy decentralizzata riesce sui piccoli mondi solo quando la distribuzione delle scorciatoie ha l'esponente giusto, spiegando perché gli inoltratori di lettere di Milgram potevano effettivamente trovare il bersaglio. E la neuroscienza clinica oggi usa i coefficienti small-world (σ, ω) come biomarcatori: Alzheimer e schizofrenia mostrano entrambi scostamenti misurabili dalla firma small-world sana.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Provalo ora.",
    readyToFly: "Pronto a volare?",
    yourTurn: "Tocca a te.",
    stepIntoIt: "Entra.",
    buildWithOne: "Costruisci con una sola pietra.",
  },
};
