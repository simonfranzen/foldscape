import type { StoriesDict } from "./stories";

export const fr: StoriesDict = {
  sectionLabels: {
    cathedral: "Cathédrale",
    atelier: "Atelier",
    resonance: "Résonance",
    story: "Histoire",
    explorer: "Explorateur",
    sandbox: "Bac à sable",
    sound: "Son",
  },
  pages: {
    mandelbrot: {
      pretitle: "Sujet II · Chaos",
      title: "L'ensemble de Mandelbrot",
      tagline: "Élever au carré et ajouter. Indéfiniment.",
      intro:
        "L'un des objets les plus photographiés des mathématiques est la visualisation d'une règle absurdement simple. Ci-dessous : ce qu'est la règle, ce que nous regardons réellement, et un bouton qui mène droit à l'Explorateur quand tu as envie de t'envoler.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La règle",
          title: "Choisis un nombre complexe, puis itère",
          body: "Choisis n'importe quel nombre complexe c. Démarre une suite avec z₀ = 0 et applique sans relâche zₙ₊₁ = zₙ² + c. C'est toute la règle. On pose alors une seule question oui/non : la suite reste-t-elle bornée, ou finit-elle par s'enfuir à l'infini ? L'ensemble des valeurs de c pour lesquelles la suite reste bornée — voilà l'ensemble de Mandelbrot. Tout le reste, y compris la fameuse image, n'est qu'une réponse colorée à cette question.",
        },
        {
          pretitle: "Étape deux · Observer l'orbite",
          title: "Trois points, trois destins",
          body: "Il est utile de voir vraiment la suite évoluer. Pour un c bien à l'intérieur de l'ensemble, l'orbite se resserre autour d'une petite boucle et ne la quitte jamais. Pour un c juste à l'extérieur, l'orbite dérive vers l'extérieur et explose en quelques étapes. Pour un c pile sur la frontière, l'orbite danse à jamais, sans jamais se calmer ni s'échapper. Les trois panneaux animés ci-dessous montrent ces trois régimes côte à côte.",
        },
        {
          pretitle: "Étape trois · Pourquoi l'image est infinie",
          title: "La frontière ne se simplifie jamais",
          body: "Une fois que tu colores chaque c selon la vitesse à laquelle son orbite s'échappe, la frontière s'illumine. Le fait stupéfiant, prouvé entre autres par Tan Lei, est que la frontière est autosimilaire dans un sens profond — où que tu zoomes, tu trouves de nouvelles minuscules copies de la forme entière, entourées d'un filigrane qui ne se répète jamais. C'est pour cela que l'Explorateur descend jusqu'à un zoom de 10¹⁰ : à chaque échelle, il y a véritablement quelque chose de neuf.",
        },
        {
          pretitle: "Étape quatre · Les points fixes",
          title: "Où se cache la mathématique",
          body: "À l'intérieur de la grande cardioïde centrale, l'itération converge vers un unique point fixe. À l'intérieur de chaque disque rond qui y est attaché, l'itération converge vers un 2-cycle, puis un 4-cycle, puis 8 — la même cascade de doublement de période que la suite logistique. L'ensemble de Mandelbrot est, en un sens précis, une carte des endroits où l'histoire logistique est paisible et de ceux où elle bascule dans le chaos. Deux systèmes chaotiques célèbres, une seule image.",
        },
      ],
    },
    life: {
      pretitle: "Sujet III · Computation",
      title: "Le Jeu de la vie de Conway",
      tagline: "Quatre règles. Des univers en découlent.",
      intro:
        "Conway a publié les règles en 1970 dans une chronique de Scientific American. Deux pages de magazine, quatre lignes de règles — et une communauté de mathématiciens passe depuis cinquante ans à découvrir ce qu'elles contenaient déjà. Le Bac à sable te permet de dessiner et de lancer n'importe quel motif — mais d'abord, les quatre règles en action.",
      ctaInteractive: "→ Ouvrir le Bac à sable",
      sections: [
        {
          pretitle: "Étape un · Les règles",
          title: "Naissance, survie, mort — et rien d'autre",
          body: "La grille est infinie, chaque cellule est vivante ou morte, et chaque cellule regarde ses huit voisines. Si une cellule morte se trouve entourée d'exactement trois voisines vivantes, elle s'allume ; si une cellule vivante en a déjà deux ou trois autour d'elle, elle passe entière à l'étape suivante. Tout autre cas — trop peu de voisines, trop de voisines, aucune voisine — tue la cellule. Les quatre démos animées ci-dessous montrent chaque règle s'activer sur une grille de cinq par cinq.",
        },
        {
          pretitle: "Étape deux · Des règles au mouvement",
          title: "Le Planeur avance",
          body: "Un motif de cinq cellules, le Planeur, est la plus petite chose mobile dans le Jeu de la vie. Regarde-le avancer. Après quatre générations, il a retrouvé sa forme initiale, mais décalé d'une cellule en diagonale. Voilà comment fonctionne le mouvement dans un monde qui n'a pas de notion de mouvement : une forme qui, après quelques applications des règles, est identique à elle-même ailleurs.",
        },
        {
          pretitle: "Étape trois · Du mouvement à la computation",
          title: "Les planeurs transportent de l'information",
          body: "Si un planeur se déplace, on peut le viser. Si on peut le viser, il peut entrer en collision avec d'autres planeurs. À partir de collisions, on peut construire ET, OU, NON — et de là, n'importe quel circuit booléen. Des gens ont construit des machines de Turing, des simulateurs de Jeu de la vie, et des ordinateurs entièrement programmables uniquement avec des planeurs soigneusement disposés. Le Bac à sable contient le préréglage du canon à planeurs de Gosper : un motif qui tire un planeur toutes les trente générations, pour toujours.",
        },
        {
          pretitle: "Étape quatre · Ce que cela nous apprend",
          title: "La complexité n'a pas besoin de règles complexes",
          body: "La leçon plus profonde est philosophique. Le Jeu de la vie montre qu'une structure élaborée — mouvement, réplication, computation, voire conscience, si l'on adhère aux versions fortes — peut tenir dans une règle assez petite pour être écrite sur une carte postale. C'est la même leçon qu'EML offre à l'analyse, NAND à la logique, et la Règle 110 aux automates cellulaires. Une petite primitive, appliquée avec discipline, suffit.",
        },
      ],
    },
    nand: {
      pretitle: "Sujet · Logique",
      title: "La barre de Sheffer",
      tagline: "Une seule porte suffit pour toute la logique numérique.",
      intro:
        "La porte NAND est le matériel informatique le plus simple qu'on puisse tenir en tête. Le Builder te permet de basculer entre les portes et de voir leur squelette NAND se mettre à jour en temps réel.",
      ctaInteractive: "→ Ouvrir le Builder",
      sections: [
        {
          pretitle: "Étape un · La porte",
          title: "Quatre lignes, fixées en 1913",
          body: "La barre de Henry Sheffer (a ↑ b) est la négation du ET. Elle renvoie 1 sauf quand les deux entrées valent 1. L'article de Sheffer de 1913 a montré que cet unique opérateur — avec des constantes et des variables — peut exprimer toute proposition de la logique booléenne classique. Charles Sanders Peirce avait discrètement noté la même chose dans un manuscrit non publié trente ans plus tôt ; tous deux y sont parvenus de manière indépendante.",
        },
        {
          pretitle: "Étape deux · Construire tout le reste",
          title: "Même pierre, plusieurs formes",
          body: "L'astuce est la composition. Renvoie la sortie d'un NAND dans un autre NAND, parfois en câblant une copie d'une entrée sur elle-même, et les quatre portes classiques tombent presque immédiatement. NON, c'est un NAND. ET, c'est deux. OU, c'est trois. XOR, c'est quatre. Toute autre expression booléenne peut alors être assemblée à partir de celles-ci.",
        },
        {
          pretitle: "Étape trois · Pourquoi les puces s'en soucient",
          title: "Une mer de NAND dans le silicium",
          body: "Les transistors CMOS réalisent un NAND avec quatre transistors — moins que ET ou OU. Comme toute expression booléenne se réduit à des NAND, les concepteurs de puces synthétisent souvent un circuit entier sans rien d'autre : une rangée de cellules NAND identiques, câblées en additionneurs, multiplexeurs, mémoire, puis finalement un processeur. Tout ordinateur moderne est, physiquement, la barre de Sheffer itérée quelques milliards de fois.",
        },
        {
          pretitle: "Étape quatre · L'autre versant",
          title: "NAND a gagné la puce, NOR a gagné la Lune",
          body: "NOR (¬(a ∨ b)) est l'autre porte unique fonctionnellement complète. L'Apollo Guidance Computer, qui a posé des humains sur la Lune, était entièrement bâti à partir de portes NOR. NAND a remporté la course des puces grand public ; NOR a remporté la Lune. Deux façons de bâtir un univers — choisis ton camp.",
        },
      ],
    },
    iota: {
      pretitle: "Sujet · Computation",
      title: "Le combinateur Iota",
      tagline: "Un seul symbole, Turing-complet.",
      intro:
        "Iota est la plus simple base à un combinateur connue : une unique règle de réécriture d'où découle toute fonction calculable. Le Reducer lit n'importe quelle expression SKI ou Iota et la réécrit, étape par étape, jusqu'à sa forme normale.",
      ctaInteractive: "→ Ouvrir le Reducer",
      sections: [
        {
          pretitle: "Étape un · Logique combinatoire",
          title: "Deux lettres qui calculent tout",
          body: "Dans les années 1920, Moses Schönfinkel et Haskell Curry ont montré que toute la computation pouvait être bâtie à partir de deux toutes petites règles. Appelons-les S et K. Elles prennent d'autres choses en entrée et les réarrangent — aucune variable nécessaire. Ensemble, elles forment le calcul des combinateurs SKI, dont on peut prouver qu'il est aussi puissant que n'importe quel lambda-calcul, n'importe quel langage de programmation, n'importe quelle machine de Turing.",
        },
        {
          pretitle: "Étape deux · Un seul symbole",
          title: "L'Iota de Chris Barker",
          body: "En 2001, Chris Barker a trouvé un unique combinateur qui contient à la fois S et K. Il l'a nommé Iota (ι, ℩) et défini par ι x = x S K. À partir de cette seule ligne, S et K peuvent tous deux être redérivés. Applique Iota à Iota selon un motif précis, et S sort. Un autre motif donne K. Avec rien d'autre que le symbole ι et des parenthèses, toute fonction calculable peut être exprimée.",
        },
        {
          pretitle: "Étape trois · La forme d'une preuve",
          title: "Universalité dans un unique symbole",
          body: "L'argument est court. La définition d'Iota donne x S K appliquée à x. Choisis x astucieusement — Iota encore, appliqué à Iota, appliqué à Iota — et le dépliage retire les couches jusqu'à ce qu'il ne reste que K. Choisis un autre motif, et il ne reste que S. Puisque S et K ensemble sont Turing-complets (Schönfinkel, 1924) et qu'Iota produit les deux, Iota seul l'est aussi.",
        },
        {
          pretitle: "Étape quatre · Pourquoi cela compte",
          title: "Un reçu philosophique",
          body: "Iota ne produit pas de programmes rapides ou lisibles — il produit des preuves d'existence. Tout algorithme exprimable dans n'importe quel langage peut être encodé comme une expression Iota. Le Reducer dans la pièce d'à côté te permet de taper une expression et de la regarder se réécrire, étape par étape, jusqu'à sa forme normale (quand elle existe). C'est la computation dans sa version la plus dépouillée : un seul symbole, une seule règle, toute la mathématique.",
        },
      ],
    },
    rule110: {
      pretitle: "Sujet · Computation",
      title: "La règle 110",
      tagline: "Une règle de huit bits, prouvée universelle.",
      intro:
        "Un octet de règle, appliqué à une rangée de bits, suffit pour encoder n'importe quel calcul. Le Simulateur te permet de changer règle, graine et vitesse en direct.",
      ctaInteractive: "→ Ouvrir le Simulateur",
      sections: [
        {
          pretitle: "Étape un · Le dispositif",
          title: "Une rangée de cellules, une règle, on recommence",
          body: "Un automate cellulaire élémentaire fonctionne sur une rangée de cellules, chacune noire ou blanche. La génération suivante est dessinée en dessous : chaque cellule se regarde et regarde ses deux voisines immédiates — trois cellules — et décide de sa couleur selon une règle fixée. Huit motifs de voisinage possibles ; pour chacun, une réponse d'un bit. Huit bits = un octet = une des 256 règles possibles. Stephen Wolfram les a numérotées de 0 à 255 en binaire.",
        },
        {
          pretitle: "Étape deux · Lire la règle 110",
          title: "Huit motifs, un octet",
          body: "Écris les huit motifs de trois cellules dans l'ordre binaire décroissant : 111, 110, 101, …, 000. Sous chaque motif, écris la valeur de la cellule centrale à la génération suivante. Lis la rangée de réponses comme un seul nombre binaire — pour la règle 110, cela donne 01101110, soit 110 en décimal. La règle, c'est exactement cet octet.",
        },
        {
          pretitle: "Étape trois · Un pixel fait pousser un univers",
          title: "Pars d'un seul point",
          body: "Initialise la rangée du haut avec une seule cellule noire, tout le reste en blanc. Applique la règle ; dessine la génération suivante en dessous. Répète pendant quelques centaines de rangées. Avec la règle 110, le résultat n'est ni le tout-noir/tout-blanc ennuyeux des règles 0 ou 255, ni le simple Sierpiński de la règle 90 — c'est un trafic permanent et mobile de planeurs triangulaires sur fond rayé, superposé en quelque chose qui ne se stabilise véritablement jamais.",
        },
        {
          pretitle: "Étape quatre · La preuve de Cook",
          title: "C'est, démontré, un ordinateur",
          body: "À la fin des années 1990, Matthew Cook a montré comment disposer des motifs de planeurs précis dans la règle 110 pour que leurs collisions agissent comme des portes logiques — puis comment assembler un système de tags cycliques fonctionnel, qui est lui-même Turing-complet. La preuve est délicate, mais la conséquence est nette : cette règle de huit bits, appliquée à une rangée de bits, est universelle. Tout calcul que tu peux faire, tu peux le faire dans la règle 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Sujet · Chaos",
      title: "La suite logistique",
      tagline: "Une formule innocente où l'ordre bascule dans le chaos.",
      intro:
        "Un modèle de poche pour la population de l'an prochain qui, d'un tour de bouton, devient le morceau de chaos le plus étudié en mathématiques. L'Explorateur te laisse tourner ce bouton en temps réel.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La formule",
          title: "Une formule pour la population de demain",
          body: "L'équation logistique de 1845 de Pierre-François Verhulst, échantillonnée en temps discret, donne la suite xₙ₊₁ = r · xₙ · (1 − xₙ). Lis x comme une fraction de la capacité de charge entre 0 et 1 ; r comme le taux de croissance. Le terme (1 − x) est le frein — trop d'individus affament la génération suivante. Avec 0 ≤ r ≤ 4, l'itération reste bornée.",
        },
        {
          pretitle: "Étape deux · De la paix au chaos",
          title: "Doubler, doubler, disparaître",
          body: "Pour r en dessous de 1, toute population s'éteint. De 1 à 3, elle se stabilise sur un point fixe unique — une population stable. À r = 3, le point fixe perd sa stabilité et se scinde en un 2-cycle : cette année en haut, l'année prochaine en bas. À r ≈ 3,449 le 2-cycle devient un 4-cycle, à r ≈ 3,544 un 8-cycle, et les doublements s'accumulent de plus en plus vite jusqu'à r ≈ 3,56995, où le système bascule enfin dans le chaos.",
        },
        {
          pretitle: "Étape trois · La constante universelle de Feigenbaum",
          title: "Un nombre qui voyage entre les systèmes",
          body: "Mesure le rapport entre les longueurs de deux intervalles de doublement successifs. Le nombre qui sort est δ ≈ 4,66920… — la constante de Mitchell Feigenbaum. Le fait stupéfiant est que la même constante apparaît dans des systèmes totalement étrangers les uns aux autres : la suite de Hénon, l'oscillateur de Duffing, jusqu'à des expériences de convection en fluide. Le doublement de période est une route universelle vers le chaos, et δ en est l'empreinte digitale.",
        },
        {
          pretitle: "Étape quatre · Îlots d'ordre",
          title: "Où le calme se cache dans le chaos",
          body: "Au cœur du régime chaotique, le système se rétablit soudain en un 3-cycle stable à r ≈ 1 + √8 ≈ 3,8284. De là, il double à nouveau — période 6, 12, 24 — et replonge dans le chaos. Le théorème de Li-Yorke rend la chute rigoureuse : « période trois implique chaos ». L'article de Robert May en 1976, « Simple mathematical models with very complicated dynamics », a posé toute l'histoire sous les yeux des biologistes. Elle n'en est plus repartie depuis.",
        },
      ],
    },
    lorenz: {
      pretitle: "Sujet · Chaos",
      title: "L'attracteur de Lorenz",
      tagline: "Trois lignes de code, un papillon.",
      intro:
        "Un modèle jouet de l'atmosphère qui a accidentellement inventé la théorie du chaos. L'Explorateur intègre les équations en direct et te laisse regarder la trajectoire refuser de se répéter.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Une atmosphère jouet",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, météorologue au MIT, cherchait à simuler la convection — de l'air chauffé par le bas, refroidi par le haut. Avec Ellen Fetter aux calculs numériques et Margaret Hamilton aux calculs préparatoires, il a ramené le problème à trois variables et trois équations. L'article de 1963, « Deterministic Nonperiodic Flow », soutenait que même cette simplification drastique pouvait se comporter de manière imprévisible. L'article est resté largement ignoré pendant une décennie.",
        },
        {
          pretitle: "Étape deux · Les trois équations",
          title: "Trois lignes couplées",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ est le nombre de Prandtl, ρ le nombre de Rayleigh, β le rapport géométrique. Les valeurs chaotiques célèbres sont σ = 10, ρ = 28, β = 8/3, fixées par Lorenz lui-même. Change ρ et le système parcourt un long catalogue de comportements — points fixes, orbites périodiques, chaos transitoire — avant d'atteindre le papillon canonique.",
        },
        {
          pretitle: "Étape trois · Le papillon",
          title: "Un attracteur en 3D",
          body: "Intègre dans le temps et la trajectoire boucle autour de deux équilibres instables, sautant de l'un à l'autre dans une séquence qui ne se répète jamais. La forme, en trois dimensions, ressemble à des ailes de papillon — d'où le nom. L'attracteur n'est ni une courbe ni une surface ; sa dimension de Hausdorff est d'environ 2,06. C'est un attracteur étrange : dense en lui-même, jamais fermé, fractal à toutes les échelles.",
        },
        {
          pretitle: "Étape quatre · Dépendance sensible",
          title: "Pourquoi les prévisions météo ont un horizon",
          body: "Prends deux points de départ qui diffèrent d'une part sur cent mille. Après un court instant, les deux trajectoires sont totalement décorrélées. Lorenz a formalisé cela comme la dépendance sensible aux conditions initiales ; l'exposant de Lyapunov dominant est positif. Dans une conférence de 1972, il s'est demandé si « un battement d'ailes de papillon au Brésil pouvait déclencher une tornade au Texas » — et a offert à la discipline la métaphore qui la définit. La raison pour laquelle les prévisions météo s'effondrent au bout d'environ deux semaines est ce même exposant, dans l'atmosphère réelle.",
        },
      ],
    },
    fourier: {
      pretitle: "Sujet · Analyse",
      title: "La transformée de Fourier",
      tagline: "Tout signal est une somme d'ondes sinusoïdales.",
      intro:
        "L'un des faits les plus profonds des mathématiques — et le moteur silencieux du MP3, du JPEG, du Wi-Fi et de l'IRM. L'Explorateur te permet d'ajouter les harmoniques une à une et de regarder une onde carrée naître de pures sinusoïdes.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'affirmation de Fourier",
          title: "Conduction de la chaleur, 1822",
          body: "Joseph Fourier publie sa « Théorie analytique de la chaleur » en 1822. Pour résoudre l'équation de la chaleur, il avance une affirmation à l'allure scandaleuse : toute fonction, continue ou en escaliers, peut s'écrire comme somme de pures sinus et cosinus. Les mathématiciens de son temps ne l'ont pas cru. Il a fallu un demi-siècle de raffinements (Dirichlet, Riemann, Lebesgue) pour que l'affirmation se transforme en théorème.",
        },
        {
          pretitle: "Étape deux · La recette",
          title: "Somme de tons purs",
          body: "Pour une fonction périodique : une série de Fourier — une somme sur des fréquences discrètes. Pour une fonction intégrable quelconque : une transformée de Fourier f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — un spectre continu. Les deux disent la même chose autrement : un signal dans le temps, aussi compliqué soit-il, se décompose en oscillations pures. Un accord devient ses notes. Une photographie devient ses rayures.",
        },
        {
          pretitle: "Étape trois · Pourquoi ton téléphone fonctionne",
          title: "Caché dans le MP3, le JPEG, l'IRM, le Wi-Fi",
          body: "Identifie les fréquences qui comptent ; jette les autres ; comprime. Le MP3 garde les bandes audibles et jette ce que l'oreille n'entend pas. Le JPEG découpe une image en blocs 8×8 et conserve les fréquences spatiales dominantes. Les IRM mesurent physiquement des échantillons de l'espace de fréquences et reviennent à l'anatomie par transformation de Fourier inverse. Le Wi-Fi et la 5G utilisent l'OFDM, en empilant des données sur des milliers de fréquences porteuses en parallèle. La FFT de Cooley-Tukey (1965) a rendu tout cela assez rapide pour devenir praticable.",
        },
        {
          pretitle: "Étape quatre · Le compromis d'incertitude",
          title: "Plus net dans le temps, plus flou en fréquence",
          body: "Comprime un signal dans une fenêtre temporelle étroite et sa transformée de Fourier s'étale nécessairement sur beaucoup de fréquences — et inversement. Ce n'est pas de l'ingénierie ; c'est de la mathématique. La fonction gaussienne se tient à l'optimum du compromis : elle est sa propre transformée de Fourier. La même inégalité, en physique, devient le principe d'incertitude de Heisenberg. Temps et fréquence sont des coordonnées duales ; tu ne peux pas affûter les deux à la fois.",
        },
      ],
    },
    euler: {
      pretitle: "Sujet · Analyse",
      title: "L'identité d'Euler",
      tagline: "Cinq nombres, une ligne.",
      intro:
        "e^(iπ) + 1 = 0 — cinq constantes venues de cinq coins différents des mathématiques, scellées dans une seule égalité. L'Explorateur d'à côté te laisse regarder e^(iθ) balayer le cercle unité en temps réel, pour que tu puisses voir, de tes propres yeux, le moment à θ = π où l'identité se produit vraiment.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Les cinq constantes",
          title: "0, 1, e, i, π — cinq étrangers dans une seule pièce",
          body: "Chacun des cinq nombres arrive d'un pays différent. 0 est l'élément neutre de l'addition — le rien. 1 est l'élément neutre de la multiplication — l'unité. e ≈ 2,71828 est le taux naturel de la croissance composée, né du calcul différentiel. i est l'unité imaginaire, définie par i² = −1, née de l'algèbre cherchant à résoudre les équations cubiques. π ≈ 3,14159 est le rapport entre la circonférence d'un cercle et son diamètre, né de la géométrie. Ils ne se croisent normalement jamais — et pourtant une seule équation, longue de six symboles, lie les cinq avec rien d'autre que +, ·, =, et l'exponentiation.",
        },
        {
          pretitle: "Étape deux · La formule d'Euler",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "L'identité, c'est ce que rend la formule d'Euler pour un angle bien précis, publiée dans son Introductio in analysin infinitorum de 1748. Pour tout nombre réel θ, la formule dit que e^(iθ) — une exponentielle à exposant imaginaire — égale cos θ + i sin θ. Géométriquement : à mesure que θ croît, le point e^(iθ) parcourt le cercle unité dans le sens trigonométrique du plan complexe. Multiplier par e^(iθ) est une rotation d'angle θ. La croissance et la rotation, les deux choses que e et i font secrètement, se révèlent être la même opération vue sous deux angles.",
        },
        {
          pretitle: "Étape trois · Substituer θ = π",
          title: "La preuve d'une ligne",
          body: "Pose θ = π dans la formule d'Euler. Le membre de droite devient cos π + i sin π = −1 + i·0 = −1. Le membre de gauche est e^(iπ). Donc e^(iπ) = −1, et ajouter 1 des deux côtés donne e^(iπ) + 1 = 0. Géométriquement, c'est un demi-tour : partir du point 1 sur le cercle unité et tourner de π radians — 180° — aboutit exactement à −1. L'identité est l'expression algébrique de cet unique et parfait demi-tour.",
        },
        {
          pretitle: "Étape quatre · La plus belle équation",
          title: "Pourquoi les mathématiciens votent pour elle",
          body: "Richard Feynman, à quatorze ans, a appelé la formule d'Euler « la formule la plus remarquable de la mathématique » — « notre joyau » — dans ses Cours de physique. Un sondage du Mathematical Intelligencer en 1990 a élu l'identité comme le plus beau théorème de la mathématique ; un sondage des lecteurs de Physics World en 2004 l'a classée aux côtés des équations de Maxwell comme la plus grande équation jamais écrite. L'attrait tient au fait qu'elle utilise chacune des opérations arithmétiques de base exactement une fois (addition, multiplication, exponentiation), chacune des constantes de base exactement une fois (0, 1, e, i, π), et qu'elle ne contient aucun fioritu en surplus. Peu d'équations sont aussi courtes, et aucune n'est aussi souvent citée comme preuve que la mathématique est belle.",
        },
      ],
    },
    banach: {
      pretitle: "Sujet · Paradoxe",
      title: "Le paradoxe de Banach-Tarski",
      tagline: "Coupe une boule, finis avec deux.",
      intro:
        "Une boule pleine, découpée en quelques morceaux, peut être réassemblée en deux boules pleines identiques à l'originale — sans étirement, sans matière ajoutée. L'Explorateur dessine le moteur derrière ce tour : le groupe libre F₂ engendré par deux rotations, dont l'arbre de Cayley autosimilaire contient quatre copies décalées de lui-même. Cette structure de branchement est, presque littéralement, l'endroit d'où vient la seconde boule.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'énoncé",
          title: "Une boule en entrée, deux en sortie",
          body: "Prends une boule pleine B³ dans l'espace à trois dimensions. Le théorème de Banach-Tarski (1924) dit qu'on peut la partitionner en un nombre fini de morceaux disjoints — cinq suffisent, et cinq est le minimum — appliquer des isométries (rotations et translations) à ces morceaux, et obtenir deux boules pleines disjointes, chacune congrue à l'originale. Rien n'est étiré, déformé ni dupliqué ; les morceaux sont simplement réarrangés. La conclusion, en tant que mathématique pure, est tout à fait rigoureuse : B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Étape deux · L'axiome du choix",
          title: "Là où l'étrangeté entre en scène",
          body: "La construction est impossible dans ZF seul. La preuve de Banach et Tarski a besoin de l'axiome du choix pour sélectionner un représentant dans chacune d'innombrables orbites d'une action rotationnelle sur la sphère. Cet unique recours au Choix force les morceaux à être non mesurables : ils n'ont pas de volume bien défini au sens de Lebesgue, de sorte que l'équation « volume d'une boule = volume de deux boules » n'est jamais écrite. Les morceaux ne sont pas des régions qu'on pourrait physiquement découper — ce sont des nuages de points denses et non mesurables, n'existant que comme objets logiques.",
        },
        {
          pretitle: "Étape trois · Le groupe libre de rotations",
          title: "F₂, engendré par deux rotations",
          body: "Le cœur de la preuve est purement théorique des groupes. Deux rotations a et b de la sphère unité S² convenablement choisies ne satisfont aucune relation autre que les triviales : elles engendrent un groupe libre F₂ de rang 2 — chaque mot réduit en a, a⁻¹, b, b⁻¹ agit comme une rotation différente. F₂ admet une décomposition paradoxale : il se scinde en quatre ensembles W(a), W(a⁻¹), W(b), W(b⁻¹) (mots commençant par chaque générateur), plus l'identité, et chaque ensemble décalé recouvre le reste du groupe. Passe cela par le paradoxe de la sphère de Hausdorff (1914), relève de S² à la boule pleine, et la duplication sur le groupe devient une duplication de B³.",
        },
        {
          pretitle: "Étape quatre · Pourquoi cela ne casse pas le monde",
          title: "Morceaux non mesurables, atomes du monde réel",
          body: "La mesure de Lebesgue est dénombrablement additive sur les ensembles mesurables ; si les morceaux étaient mesurables, le volume des deux boules de sortie devrait être égal au volume de la boule d'entrée, ce qui se contredirait. Le théorème te dit donc poliment que les morceaux ne peuvent pas être mesurables — et en effet, ils ne le sont pas. Le monde réel s'en moque : la matière physique est faite d'un nombre fini d'atomes, pas de sous-ensembles arbitraires de ℝ³, et tu ne peux pas effectuer une coupe le long d'une frontière non mesurable. Le paradoxe vit entièrement à l'intérieur du continu, où l'infini a plus de place pour manœuvrer que l'intuition ne le permet.",
        },
      ],
    },
    lsystem: {
      pretitle: "Sujet · Géométrie",
      title: "Les L-systèmes",
      tagline: "Des réécritures lettre par lettre qui poussent en plantes.",
      intro:
        "Un L-système est une minuscule grammaire : une chaîne de départ, quelques règles de réécriture, et une tortue qui transforme les lettres en lignes. Dans l'Explorateur, tu modifies l'axiome et les règles, glisses la profondeur d'itération, et regardes la tortue dessiner la fractale obtenue — flocons de Koch, dragons, fougères, courbes de Hilbert — à partir d'une poignée de caractères.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Une chaîne et trois règles",
          title: "Axiome, alphabet, réécriture",
          body: "Un L-système se compose de trois pièces. Un alphabet de symboles. Un axiome — une chaîne de départ. Un ensemble de règles de production, une par symbole, qui disent ce que chaque symbole devient à la génération suivante. L'astuce qui le définit, c'est le parallélisme : à chaque étape, tous les symboles sont réécrits simultanément, à la manière dont chaque cellule d'un corps se divise en même temps. Aristid Lindenmayer, biologiste hongrois à Utrecht, a introduit le formalisme en 1968 pour modéliser la croissance cellule par cellule des algues et des plantes. Dans la variante la plus simple (sans contexte, déterministe), les règles regardent un symbole à la fois ; les versions sensibles au contexte regardent les voisins ; les versions stochastiques tirent les règles au hasard.",
        },
        {
          pretitle: "Étape deux · L'interprétation tortue",
          title: "Un stylo virtuel qui fait pousser la fractale",
          body: "Les symboles seuls ne sont que du texte. La géométrie apparaît quand on donne la chaîne à manger à une tortue : F signifie avancer en traçant d'une unité, G signifie avancer en traçant aussi, + tourne le cap vers la gauche d'un angle fixé, − tourne vers la droite. Deux symboles supplémentaires empilent et dépilent l'état : [ pousse la position et le cap actuels sur une pile, ] les dépile. Avec un simple empiler-dépiler, une chaîne 1D se met soudain à se ramifier — les paires de crochets deviennent des brindilles et des tiges latérales. Les symboles hors de l'alphabet de dessin (X, Y, A, B …) sont des variables muettes : elles transportent l'information à travers les réécritures, mais la tortue les ignore.",
        },
        {
          pretitle: "Étape trois · Exemples classiques",
          title: "Quatre règles, quatre fractales",
          body: "Flocon de Koch : axiome F++F++F, règle F → F−F++F−F, angle 60°. Quatre itérations et le triangle s'est fripé en flocon. Courbe du dragon : axiome FX, règles X → X+YF+, Y → −FX−Y, angle 90° ; au bout d'une douzaine de réécritures, elle se plie en dragon de Heighway. Pointe de flèche de Sierpiński : A → B−A−B, B → A+B+A, angle 60°, alterne la parité pour balayer le triangle de Sierpiński. Plante fractale : X → F+[[X]−X]−F[−FX]+X, F → FF, angle 25° — la fougère canonique de Lindenmayer et Prusinkiewicz, branches comprises. Même machinerie, organismes radicalement différents.",
        },
        {
          pretitle: "Étape quatre · Pourquoi les botanistes les adorent",
          title: "D'un article de 1968 à toutes les forêts de jeux vidéo",
          body: "Lindenmayer n'était pas un mathématicien à la recherche de jolies images — c'était un biologiste cherchant à capturer la manière dont un organisme multicellulaire se développe depuis une extrémité. Les L-systèmes ont donné à la botanique sa première grammaire formelle pour la croissance : topologie de branchement, longueurs d'entre-nœuds, placement des feuilles, tout à partir de quelques règles de réécriture. Le livre de Przemyslaw Prusinkiewicz en 1990, « The Algorithmic Beauty of Plants », a transformé l'idée en pipeline opérationnel, et de là elle s'est diffusée en infographie. La plupart des arbres procéduraux dans les jeux et les films, les fougères de Speedtree, la végétation dans les courts-métrages Pixar, les villes de tuyaux des productions de la démoscène — tous descendent de la réécriture parallèle de Lindenmayer. Une grammaire pour les cellules est devenue une grammaire pour des mondes.",
        },
      ],
    },
    wang: {
      pretitle: "Sujet · Computation",
      title: "Les tuiles de Wang",
      tagline: "Des carrés aux bords colorés qui peuvent encoder n'importe quel calcul.",
      intro:
        "Le casse-tête de Hao Wang de 1961 — des carrés dont les quatre bords colorés doivent s'accorder avec leurs voisins — a fini par cacher le problème de l'arrêt dans un jeu d'appariement pour enfants. L'Explorateur te permet de choisir un jeu de tuiles et de regarder le plan se remplir, cellule après cellule, avec retour arrière quand aucune tuile ne convient.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Les règles",
          title: "Tuiles carrées, quatre bords colorés, aucune rotation",
          body: "Une tuile de Wang est un carré unité dont les quatre bords portent des couleurs. Tu ne peux poser une tuile que si chacun de ses bords a la même couleur que celui de la tuile voisine qu'il touche — nord contre sud, est contre ouest. Les tuiles ne peuvent être ni tournées ni réfléchies ; l'attribution des couleurs est fixée. Étant donné un ensemble fini de telles tuiles, la question est de savoir si on peut, à l'aide de copies de celles-ci, paver le plan infini tout entier.",
        },
        {
          pretitle: "Étape deux · La conjecture de Wang et sa réfutation",
          title: "D'un algorithme qui devrait exister à un qui ne peut pas",
          body: "Hao Wang a conjecturé en 1961 que tout ensemble fini de tuiles capable de paver le plan devait admettre un pavage périodique — et il en aurait dérivé un algorithme pour décider du problème du domino (un jeu donné pave-t-il le plan ?). En 1966, son élève Robert Berger a réfuté les deux d'un coup : il a construit un ensemble apériodique de 20 426 tuiles de Wang, et a prouvé que le problème du domino est indécidable. Il n'existe aucun algorithme qui, étant donné un jeu de tuiles, puisse toujours décider s'il pave le plan.",
        },
        {
          pretitle: "Étape trois · Le calcul dans le pavage",
          title: "Encoder une machine de Turing en un jeu de tuiles",
          body: "L'astuce de Berger était de traduire les configurations d'une machine de Turing en tuiles de Wang, de sorte que chaque rangée valide de tuiles encode une étape de la machine et chaque colonne valide encode l'écoulement du temps. Un pavage du demi-plan supérieur existe alors si et seulement si la machine ne s'arrête jamais sur son entrée vide — ce qui est le problème de l'arrêt, le problème indécidable canonique. La même construction a fondu au fil des décennies : Berger a réduit son jeu à 104, Robinson à 56, et en 1996 Karel Culik II a publié le record longtemps détenu de 13 tuiles de Wang apériodiques. Jeandel et Rao ont prouvé plus tard que le vrai minimum est 11.",
        },
        {
          pretitle: "Étape quatre · Où elles atterrissent dans la nature",
          title: "De l'indécidabilité à la texture procédurale",
          body: "Au-delà du drame fondationnel, les tuiles de Wang ont trouvé une seconde vie discrète en infographie. Un petit jeu soigneusement choisi permet à un moteur de rendu de paver un mur, un sol de forêt ou une carte d'élévation sans répétitions visibles — les contraintes d'appariement assemblent les morceaux sans coutures, à bien moindre coût qu'engendrer une immense texture unique. Elles sont cousines des pavages de Penrose et des quasicristaux découverts par Dan Shechtman en 1982 (prix Nobel 2011) : tous trois sont des manières d'imposer un motif infini qui ne se répète jamais tout à fait.",
        },
      ],
    },
    collatz: {
      pretitle: "Sujet · Chaos",
      title: "La conjecture de Collatz",
      tagline: "Pair, divise par deux. Impair, triple et ajoute un.",
      intro:
        "L'un des problèmes ouverts les plus simples des mathématiques : une règle de quatre mots dont personne ne sait prouver qu'elle se termine toujours. L'Explorateur ci-dessous trace la trajectoire en grêlons de n'importe quel nombre de départ et fait pousser le corail inverse — l'arbre à rebours de tous les entiers, enraciné en 1.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La règle",
          title: "Deux cas, une instruction",
          body: "Prends n'importe quel entier positif n. Si n est pair, remplace-le par n/2. Si n est impair, remplace-le par 3n + 1. Recommence. C'est toute la règle. Essaie n = 7 : ça donne 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, puis boucle 1 → 4 → 2 → 1 pour toujours. Tous les points de départ que nous avons jamais testés finissent dans cette même petite boucle.",
        },
        {
          pretitle: "Étape deux · La conjecture",
          title: "Tous les chemins mènent à 1",
          body: "Lothar Collatz a proposé la conjecture en 1937, deux ans après son doctorat. L'affirmation est d'une simplicité à couper le souffle : pour tout entier positif n, l'itération finit par atteindre 1. On la connaît aussi sous les noms de problème de Syracuse, problème de Kakutani et conjecture d'Ulam — plusieurs mathématiciens sont indépendamment tombés sur la même bête. En 2025, elle a été vérifiée par ordinateur pour tout entier positif jusqu'à environ 2,36 × 10²¹. Personne ne sait pourquoi.",
        },
        {
          pretitle: "Étape trois · Records et surprises",
          title: "Grêlons sur Syracuse",
          body: "On surnomme les trajectoires « suites de grêlons » parce que, comme la grêle dans un cumulonimbus, elles montent et descendent erratiquement avant de finalement toucher le sol. Le plus célèbre petit cas est n = 27 : il faut 111 étapes pour atteindre 1 et en chemin on culmine à 9232 — environ 340 fois la valeur de départ. Autres graines notables : n = 97 prend 118 étapes ; n = 871 prend 178 étapes ; n = 6171 prend 261 étapes. De toutes petites entrées, des orbites follement disproportionnées.",
        },
        {
          pretitle: "Étape quatre · Pourquoi elle résiste",
          title: "Un corail que personne ne peut tailler",
          body: "Paul Erdős, devant le problème, haussait les épaules : « Les mathématiques ne sont peut-être pas prêtes pour de tels problèmes. » Il a offert 500 $ pour une solution, prix encore non réclamé. L'avancée la plus profonde est l'article de Terence Tao en 2019, qui montre que presque toutes les orbites de Collatz atteignent des valeurs presque bornées — un quasi-résultat probabiliste, pas une preuve. Inverse le sens de la règle au lieu de la dérouler en avant, et les entiers s'auto-assemblent en un unique arbre infini enraciné en 1, ramifié vers l'extérieur comme du corail. L'Explorateur d'à côté fait pousser ce corail et te permet de jeter n'importe quelle graine dans l'orage de grêle.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Sujet · Chaos",
      title: "Le double pendule",
      tagline: "Deux pendules enchaînés, chaos total.",
      intro:
        "Un système mécanique assez simple pour être croqué sur une serviette de table, et assez chaotique pour devancer toute prévision. L'Explorateur intègre les équations du mouvement en temps réel et te laisse mettre en course deux départs presque identiques, afin que tu puisses voir par toi-même leur divergence.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le dispositif",
          title: "Deux pendules, un poids accroché à un autre",
          body: "Prends un pendule simple — une tige rigide sans masse de longueur L₁ avec un poids de masse m₁ au bout, pivotant sous la gravité. Maintenant, attache une seconde tige de longueur L₂ avec une masse m₂ au poids du premier. La configuration se décrit par seulement deux angles, θ₁ et θ₂, mesurés depuis la verticale. Avec les vitesses angulaires ω₁ = θ̇₁ et ω₂ = θ̇₂, voilà tout l'état : un point dans un espace de phases à quatre dimensions, évoluant de manière déterministe sous les lois de Newton.",
        },
        {
          pretitle: "Étape deux · Le lagrangien",
          title: "Cinétique moins potentielle, puis on tourne la manivelle d'Euler-Lagrange",
          body: "Écris l'énergie cinétique T des deux poids et l'énergie potentielle V due à la gravité. Le lagrangien L = T − V s'obtient proprement, mais les équations du mouvement ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 produisent deux EDO du second ordre couplées et non linéaires pour θ̈₁ et θ̈₂. Le couplage passe par des termes en sin(θ₁−θ₂) et cos(θ₁−θ₂) ; la non-linéarité est inévitable. Aucune solution explicite n'existe. Pour regarder le système bouger, il faut intégrer numériquement — et c'est exactement ce que fait l'Explorateur, pas à pas, avec RK4.",
        },
        {
          pretitle: "Étape trois · Chaos",
          title: "Faible énergie : joli. Grande énergie : imprévisible.",
          body: "À faible énergie, les poids oscillent doucement et le mouvement est quasi périodique — la trajectoire s'enroule autour d'un tore invariant dans l'espace des phases et ne se répète jamais tout à fait, mais reste bornée et ordonnée. Pousse l'énergie plus haut et le système bascule dans le chaos : le plus grand exposant de Lyapunov devient positif, et deux départs qui diffèrent d'une part par million se séparent complètement en quelques secondes. Le double pendule est la démonstration physique de manuel du chaos déterministe — déterministe dans les équations, imprévisible en pratique.",
        },
        {
          pretitle: "Étape quatre · Où on le retrouve",
          title: "Robots, marche, théorie du contrôle, musées",
          body: "Les mêmes équations à rotors couplés décrivent les bras robotiques à deux liaisons (où le chaos est plutôt à supprimer qu'à célébrer), la biomécanique d'une jambe oscillante dans la marche humaine, et de nombreux oscillateurs composés en ingénierie. Les théoriciens du contrôle utilisent le double pendule comme banc d'essai pour stabiliser des systèmes non linéaires instables — le maintenir droit est un problème difficile classique. Et tout bon musée scientifique en a un qui oscille dans une vitrine, traçant une courbe que les visiteurs ne savent jamais tout à fait prévoir.",
        },
      ],
    },
    bzr: {
      pretitle: "Sujet · Chaos",
      title: "La réaction de Belousov-Zhabotinsky",
      tagline: "Une horloge chimique qui dessine des spirales.",
      intro:
        "Un véritable mélange chimique qui refuse de s'apaiser : il pulse en changeant de couleur dans un bécher et fait croître des spirales tournantes dans une boîte de Petri. L'Explorateur simule une grille de réaction-diffusion à 3 variables de type Oregonator pour que tu puisses voir la même instabilité s'auto-organiser en vagues.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La découverte accidentelle",
          title: "Une réaction qui aurait dû être impossible",
          body: "Au début des années 1950, le chimiste soviétique Boris Belousov, en quête d'un analogue inorganique du cycle de Krebs, mélange du bromate, de l'acide citrique et un catalyseur au cérium — et regarde la solution changer de couleur rythmiquement, sans fin. Les relecteurs ont rejeté son article : une réaction chimique oscillant visiblement dans le temps ressemblait à une violation du second principe de la thermodynamique. Belousov a renoncé à le publier. Une décennie plus tard, en 1961, l'étudiant Anatol Zhabotinsky a repris la recette, troqué l'acide citrique pour de l'acide malonique, et démontré les oscillations assez proprement pour que le résultat ne puisse plus être nié.",
        },
        {
          pretitle: "Étape deux · À quoi cela ressemble",
          title: "Une horloge dans un bécher, des spirales dans une boîte",
          body: "La recette moderne est bromate (BrO₃⁻) plus bromure, acide malonique comme carburant, et un catalyseur redox — cérium, ou plus visuellement la ferroïne, dans un bain d'acide sulfurique. Remuée dans un bécher, la solution change de couleur à intervalles réguliers (bleu ↔ rouge avec la ferroïne), comme un métronome chimique. Versée dans une boîte de Petri mince où la diffusion compte, la même recette fait spontanément pousser des spirales tournantes et des motifs en cibles concentriques en quelques minutes. Remue-la et le motif s'efface ; laisse-la tranquille et un nouveau se dessine.",
        },
        {
          pretitle: "Étape trois · L'Oregonator",
          title: "Trois variables, une oscillation",
          body: "En 1972, Richard Field, Endre Körös et Richard Noyes — travaillant à l'Université de l'Oregon — ont distillé la chimie en l'Oregonator : un système d'EDO non linéaire à 3 variables suivant les intermédiaires clés (HBrO₂, Br⁻, et le catalyseur oxydé). Il oscille pour exactement les mêmes raisons que le bécher. Ajoute des termes de diffusion et les EDO deviennent des EDP de réaction-diffusion ; dans la réduction Tyson-Fife, le même modèle reproduit les spirales sur une nappe 2D. L'Explorateur d'à côté fait tourner un cousin à cellules discrètes de cette EDP, assez léger pour un navigateur tout en restant fidèle pour spiraler.",
        },
        {
          pretitle: "Étape quatre · Pourquoi cela compte",
          title: "Une chimie qui s'organise toute seule",
          body: "La BZR a été le pistolet fumant expérimental qui a éloigné la chimie de la pensée d'équilibre. Loin de l'équilibre, la matière ne se contente pas de se dissiper — elle peut spontanément s'organiser en motifs structurés dans l'espace et le temps. Ilya Prigogine a bâti la théorie de ces structures dissipatives et a reçu pour cela le prix Nobel de chimie en 1977. Aujourd'hui, la BZR est l'exemple canonique de l'auto-organisation hors équilibre, une sœur des motifs morphogénétiques de Turing, et l'ancêtre de tout modèle de réaction-diffusion en biologie, neurosciences et génie chimique.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Sujet · Analyse",
      title: "Les motifs de Turing",
      tagline: "Comment les léopards obtiennent leurs taches.",
      intro:
        "L'Explorateur simule une grille de réaction-diffusion Gray-Scott en temps réel : deux substances chimiques virtuelles en compétition sur un treillis de 200×200. Tourne les boutons du taux d'alimentation et du taux de destruction, et le champ se métamorphose continûment entre taches, rayures, labyrinthes et coraux autoreproducteurs.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La question de Turing",
          title: "D'où viennent les motifs sur un animal ?",
          body: "L'embryon d'un léopard commence comme une boule de cellules presque uniforme. Quelque part en chemin, des taches régulières apparaissent sur son pelage — même espacement, même taille, aux bons endroits. Le même problème se pose pour les zébrures, les bandes des poissons-anges et les anneaux d'un coquillage. En 1952, Alan Turing publie « The Chemical Basis of Morphogenesis » et propose une réponse stupéfiante : les motifs sont pure chimie. Deux substances diffusant à des portées très différentes, réagissant entre elles, peuvent spontanément briser la symétrie et déposer un dessin stable par-dessus un fond uniforme.",
        },
        {
          pretitle: "Étape deux · La recette",
          title: "Activation à courte portée, inhibition à longue portée",
          body: "Le mécanisme de Turing prend deux substances chimiques : un ACTIVATEUR a qui catalyse sa propre production et celle d'un INHIBITEUR b, plus l'inhibiteur lui-même, qui détruit l'activateur. L'ingrédient crucial supplémentaire est la diffusion : l'inhibiteur doit se propager beaucoup plus vite que l'activateur. Une petite fluctuation qui élève a en un point déclenche une explosion locale fulgurante de l'activateur — mais produit aussi de l'inhibiteur, qui file vers l'extérieur et étouffe l'activateur dans un large anneau. Cet anneau de répression maintient la prochaine explosion à distance, et le rythme explosion-anneau pave le plan de taches, rayures ou labyrinthes réguliers.",
        },
        {
          pretitle: "Étape trois · Une équation, beaucoup de motifs",
          title: "Le diagramme de phases de Gray-Scott",
          body: "La forme standard jouable est le modèle de Gray-Scott : ∂a/∂t = D_a∇²a − ab² + F(1 − a) et ∂b/∂t = D_b∇²b + ab² − (F + k)b. Seuls deux boutons font le gros du travail — F, le taux d'alimentation auquel on apporte de l'activateur frais, et k, le taux de destruction auquel l'inhibiteur se désintègre. L'article de Pearson en 1993 a cartographié le plan (F, k) en un atlas désormais célèbre de régions nommées : trous, taches, rayures, points autoreproducteurs façon mitose, le monde instable U-skate, labyrinthes, solitons et chaos pur. Les mêmes deux équations différentielles contiennent tout cela ; tu déplaces juste le curseur.",
        },
        {
          pretitle: "Étape quatre · Les motifs sont réels",
          title: "Du tube à essai au poisson-globe",
          body: "Pendant des décennies, le mécanisme de Turing fut une belle idée sans expérience. Puis en 1990, le réacteur CIMA (chlorite-iodure-acide malonique en gel) a produit le premier motif de Turing en laboratoire dans une chimie pure, l'amidon agissant comme frein de l'inhibiteur. Depuis, les biologistes ont attrapé le même mécanisme en flagrant délit dans des tissus vivants : Akiyama et Tanaka en 2014 ont lu les signaux d'activateur et d'inhibiteur directement sur le poisson-globe africain ; Sheth et ses collègues ont montré une dynamique de Turing fixant l'espacement des doigts chez la souris ; la même chimie gouverne l'espacement des follicules pileux, les bourgeons de plumes et la pigmentation des coquillages. Pelages, empreintes digitales, crêtes — l'esquisse de Turing de 1952, mesurée.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Sujet · Géométrie",
      title: "Le triangle de Sierpiński",
      tagline: "Une fractale, quatre chemins pour y entrer.",
      intro:
        "Wacław Sierpiński l'a décrit en 1915, mais le même motif de trou-dans-le-trou triangulaire avait déjà été gravé dans les sols des églises cosmatesques du XIIIe siècle. Le fait stupéfiant est que la forme arrive par au moins quatre voies totalement différentes — récursion, hasard, arithmétique, un automate cellulaire d'une ligne — et l'Explorateur te laisse les regarder toutes les quatre côte à côte.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Subdivision récursive",
          title: "Découpe le centre, puis recommence",
          body: "Prends un triangle équilatéral. Joins les milieux de ses trois côtés ; cela le divise en quatre petits triangles congrus. Enlève celui du centre et garde les trois coins. Maintenant applique la même opération à chacun de ces coins — et encore, et encore. Après une infinité d'étapes, tu obtiens le triangle de Sierpiński : un ensemble autosimilaire d'aire totale nulle et de bord de longueur infinie. Chaque tour conserve les trois quarts de l'aire précédente, donc la limite est inévitable.",
        },
        {
          pretitle: "Étape deux · La voie du jeu du chaos",
          title: "À mi-chemin, encore et encore",
          body: "Place trois sommets en triangle. Pose un point n'importe où ; puis, de manière répétée, choisis au hasard l'un des trois sommets uniformément et saute à mi-chemin vers lui. Trace chaque pas. En quelques milliers de sauts, le nuage de points s'est résolu en triangle de Sierpiński — exactement, à la limite. Pur jeu aléatoire, aucune instruction géométrique, aucune mémoire : juste une étape de division par deux et trois cibles. La fractale est ce que la marche aléatoire ne peut s'empêcher de tracer.",
        },
        {
          pretitle: "Étape trois · Le triangle de Pascal mod 2",
          title: "Les entrées impaires le dessinent pour toi",
          body: "Écris le triangle de Pascal et colore chaque entrée impaire en noir, chaque entrée paire en blanc. Le résultat, ligne après ligne, est le triangle de Sierpiński. La raison en est le théorème de Lucas : un coefficient binomial C(n, k) est impair exactement quand les chiffres binaires de k sont un sous-ensemble des chiffres binaires de n. Les cellules noires vivent donc là où les bits de k s'inscrivent dans les bits de n — et cette condition, dessinée en triangle, c'est le motif de Sierpiński. La combinatoire et la géométrie atterrissent au même endroit.",
        },
        {
          pretitle: "Étape quatre · Règle 90 et l'IFS",
          title: "Une cellule, une règle, la même forme",
          body: "L'automate cellulaire élémentaire de Wolfram Règle 90 dit : l'état suivant d'une cellule est le XOR de ses deux voisines. Démarre une seule cellule noire dans une rangée par ailleurs blanche et avance. Chaque nouvelle génération tracée sous la précédente reproduit exactement le triangle de Sierpiński. La lecture la plus profonde est que les quatre voies décrivent le même attracteur : un système de fonctions itérées de trois contractions, chacune de rapport 1/2, fixées aux trois sommets. Quelle que soit la recette suivie, tu converges vers le même ensemble fixe — de dimension de Hausdorff log 3 / log 2 ≈ 1,585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Sujet · Géométrie",
      title: "Le jeu du chaos",
      tagline: "Lance un dé, dessine une fractale.",
      intro:
        "Place quelques points, choisis-en un au hasard, encore et encore, et avance à mi-chemin vers lui — une règle qui sonne comme du bruit, mais qui se condense en fractale parfaite après quelques milliers d'étapes. L'Explorateur anime la procédure en direct et te laisse régler le nombre de sommets, le rapport de saut et les règles qui gouvernent quel sommet tu peux choisir ensuite.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La règle",
          title: "Trois points, un dé, un court pas",
          body: "Place les sommets d'un polygone. Choisis n'importe quel point de départ — peu importe qu'il soit sur, hors ou à l'intérieur du polygone. Lance maintenant un dé pour choisir un sommet au hasard, avance d'une fraction fixée du chemin de ta position actuelle vers lui, et marque le nouvel endroit d'un point. Considère ce point comme ta nouvelle position et recommence. La règle n'a que deux ingrédients : une liste de sommets et un rapport de saut r. C'est tout le jeu du chaos, formalisé par Michael Barnsley dans ses travaux de 1988 sur les systèmes de fonctions itérées.",
        },
        {
          pretitle: "Étape deux · Du hasard, le triangle de Sierpiński",
          title: "Le bon rapport pour chaque polygone",
          body: "Sur un triangle équilatéral avec un rapport de saut r = 1/2, les points se condensent en triangle de Sierpiński — après une courte mise en route, aucun point ne peut plus tomber dans les trous centraux. Pour un n-gone régulier, il existe un rapport magique rₙ = 1 / (1 + 2·cos(π/n)) qui donne une fractale autosimilaire propre. Le tableau ci-dessous rassemble les valeurs pour n = 3 à 8 : remarque que le 1/2 du triangle et le 1/(1 + φ) = 1/φ² ≈ 0,382 du pentagone sortent directement de la même formule. Utilise un autre rapport et l'image se chevauche ou se sous-recouvre jusqu'à ce que la fractale se brouille.",
        },
        {
          pretitle: "Étape trois · D'autres formes pour d'autres règles",
          title: "Carrés, restrictions, et la fougère de Barnsley",
          body: "Sur un carré avec r = 1/2, la règle échoue : les points remplissent uniformément l'intérieur et aucune fractale n'apparaît. La solution est une règle de restriction — par exemple, interdire le même sommet deux fois de suite, ou interdire le sommet situé un cran après le précédent — et une fractale délicate revient. Pousse l'idée plus loin et les sommets s'évanouissent : la fougère de Barnsley est le jeu du chaos avec quatre transformations affines choisies par des dés pondérés (probabilités 0,01, 0,85, 0,07, 0,07), et de ce hasard pousse une feuille botaniquement convaincante.",
        },
        {
          pretitle: "Étape quatre · Pourquoi ça marche",
          title: "Attracteurs des systèmes de fonctions itérées",
          body: "Chaque coup disponible — « saute à mi-chemin du sommet i » — est une application contractante du plan. Un ensemble fini de telles contractions est un Système de Fonctions Itérées (IFS), et le théorème de Barnsley garantit un unique attracteur compact : le point fixe du système entier. Le jeu du chaos échantillonne cet attracteur en tirant les applications au hasard, et le théorème de Hutchinson dit que les points échantillonnés, avec probabilité un, deviennent denses dedans. Tu pourrais dessiner la même image de manière déterministe en appliquant chaque application à chaque forme — la marche aléatoire est juste la voie d'entrée bon marché et belle.",
        },
      ],
    },
    penrose: {
      pretitle: "Sujet · Géométrie",
      title: "Les pavages de Penrose",
      tagline: "Des tuiles qui couvrent le plan et ne se répètent jamais.",
      intro:
        "Deux formes de tuiles suffisent à couvrir un plan infini d'un motif qui ne se répète jamais tout à fait. L'Explorateur fait pousser les pavages P3 (deux losanges) ou P2 (cerf-volant + fléchette) par inflation ; tu règles la profondeur, la rotation de départ, et regardes une géométrie parfaitement apériodique s'assembler toute seule.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Deux tuiles, jamais répétées",
          title: "Penrose, 1974",
          body: "Roger Penrose a introduit son premier pavage apériodique (P1) en 1974, en utilisant six prototuiles construites autour du pentagone. Il a vite ramené le jeu à deux : la paire cerf-volant + fléchette (P2) et la paire à deux losanges (P3) — un losange mince aux angles 36°/144° et un losange épais aux angles 72°/108°. Chaque tuile porte les règles d'appariement de Conway — des flèches ou encoches colorées sur les arêtes qui fixent quelles tuiles peuvent côtoyer lesquelles. Sans elles, on pourrait paver périodiquement avec cerfs-volants et fléchettes ; avec elles, tout pavage légal est forcé d'être apériodique.",
        },
        {
          pretitle: "Étape deux · Symétrie d'ordre cinq",
          title: "Une symétrie interdite",
          body: "Chaque angle du pavage est un multiple de 36° — l'angle interne d'un pentagone régulier. Autour de sommets particuliers, le motif a une symétrie rotationnelle d'ordre cinq parfaite, du même type qu'un pentagone. La cristallographie classique prouve qu'aucun pavage périodique du plan ne peut avoir de symétrie d'ordre cinq : seules les rotations d'ordre 2, 3, 4 et 6 sont compatibles avec un réseau. Les pavages de Penrose contournent le théorème en refusant d'être périodiques. La surprise est qu'on peut quand même avoir un ordre local d'ordre cinq sans jamais se boucler en cellule répétitive.",
        },
        {
          pretitle: "Étape trois · Le nombre d'or est intégré",
          title: "φ = (1 + √5) / 2",
          body: "Compte les tuiles dans n'importe quel grand morceau et tu trouves le nombre d'or qui t'attend. Le nombre de cerfs-volants divisé par celui de fléchettes converge vers φ = (1+√5)/2 ≈ 1,618 ; idem pour les losanges épais divisés par les minces. Les rapports de longueurs de côtés à l'intérieur des triangles de Robinson qui bâtissent chaque losange sont 1 : φ, et la règle d'inflation qui fait pousser le pavage met les longueurs à l'échelle de φ à chaque étape. Le pavage est, en un sens précis, le nombre d'or rendu en motif sur le plan.",
        },
        {
          pretitle: "Étape quatre · Quasicristaux",
          title: "Shechtman, 1982",
          body: "En avril 1982, Dan Shechtman a tiré un faisceau d'électrons sur un alliage d'aluminium-manganèse refroidi rapidement et a vu un diagramme de diffraction à symétrie d'ordre cinq nette — une chose que tout manuel disait impossible. Linus Pauling l'a publiquement ridiculisé pendant des années (« il n'existe pas de quasicristaux, seulement des quasi-scientifiques »). Le pavage de Penrose était la pièce mathématique sur papier existante qui prouvait que c'était possible : un motif à ordre à longue portée, à symétrie d'ordre cinq, apériodique. Shechtman a été lavé par le prix Nobel de chimie en 2011, et les pavages de Penrose sont devenus le modèle bidimensionnel canonique de ce qu'on appelle aujourd'hui les quasicristaux.",
        },
      ],
    },
    apollonian: {
      pretitle: "Sujet · Géométrie",
      title: "L'empilement apollonien de cercles",
      tagline: "Des cercles dans des cercles dans des cercles.",
      intro:
        "Commence avec trois cercles mutuellement tangents et une règle pour ce qui compte comme tangent. L'Explorateur remplit récursivement chaque interstice triangulaire courbe d'un nouveau cercle, puis remplit à son tour les interstices plus petits — choisis les courbures de départ et regarde émerger un joint qui est fractal pour toujours.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La position de départ",
          title: "Trois cercles qui se touchent",
          body: "Dessine trois cercles dans le plan, chacun tangent aux deux autres — ils se touchent en trois points et enferment un interstice triangulaire courbe. Vers 200 av. J.-C., Apollonius de Perge a posé la suite naturelle : quels cercles sont tangents simultanément aux trois cercles donnés ? Pour un triplet de cercles mutuellement tangents, il y a exactement deux réponses — un petit cercle inscrit dans l'interstice courbe, et un grand cercle qui circonscrit les trois. Ces deux nouveaux cercles rejoignent les trois originaux pour former un quadruplet de cercles mutuellement tangents. Ce quadruplet est la graine de tout ce qui suit.",
        },
        {
          pretitle: "Étape deux · Le théorème de Descartes",
          title: "Courbures, verrouillées par l'algèbre",
          body: "Écris la courbure de chaque cercle comme k = 1/r, avec une convention : si un cercle enferme les autres (le grand extérieur), prends sa courbure négative. Dans sa correspondance de 1643 avec la princesse Élisabeth de Bohême, Descartes a prouvé que pour quatre cercles mutuellement tangents quelconques, les courbures satisfont (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Résoudre la quadratique pour la quatrième courbure donne k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Les deux signes sont exactement les deux réponses d'Apollonius : le signe + donne le petit cercle inscrit, le signe − donne l'autre cercle tangent de l'autre côté.",
        },
        {
          pretitle: "Étape trois · Remplissage récursif",
          title: "Chaque interstice est une nouvelle graine",
          body: "Une fois le quadruplet de départ en place, chaque interstice triangulaire courbe est lui-même bordé par trois cercles mutuellement tangents — exactement la configuration de départ. Dépose le cercle inscrit dans chaque interstice en utilisant le signe + de la formule de Descartes. Ce cercle divise son ancien interstice en trois nouveaux triangles courbes plus petits, et le procédé récursive. Continue indéfiniment et l'union de tous les cercles que tu as dessinés est le joint apollonien. La poussière restante a une mesure de Lebesgue nulle, mais une dimension de Hausdorff d'environ 1,3056867 — une vraie fractale, entre une courbe et une surface.",
        },
        {
          pretitle: "Étape quatre · La surprise des entiers",
          title: "Quand chaque courbure est un nombre entier",
          body: "Choisis les quatre courbures de départ (k₁, k₂, k₃, k₄) comme entiers. Alors la formule de Descartes k₄ = k₁+k₂+k₃ ± 2√(…) force toute courbure suivante à être également entière — la racine carrée s'effondre grâce à (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), et chaque nouveau cercle hérite de l'entièreté de ses parents. L'empilement (−1, 2, 2, 3) se remplit de courbures 6, 11, 14, 15, 18, 23, … et tout autre empilement apollonien entier — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — fait de même. Quels entiers apparaissent, et lesquels n'apparaissent jamais, est une question ouverte en géométrie arithmétique : un squelette caché de théorie des nombres, niché dans une image de cercles.",
        },
      ],
    },
    phi: {
      pretitle: "Sujet · Géométrie",
      title: "Nombre d'or & Fibonacci",
      tagline: "Une simple récurrence. Le rapport qui se cache partout.",
      intro:
        "L'Explorateur suit la suite de Fibonacci à mesure que ses rapports consécutifs convergent vers φ, dessine la spirale dorée bâtie à partir de carrés de Fibonacci imbriqués, et te laisse incliner le motif de phyllotaxie du tournesol par l'angle d'or. Trois vues, un seul nombre — et la distinction entre les endroits où φ apparaît vraiment et ceux où les infographies en font trop.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'équation de définition",
          title: "Un nombre égal à son propre carré moins un",
          body: "Résous φ² = φ + 1. La racine positive est φ = (1 + √5) / 2 ≈ 1,6180339887. Cette unique équation contient presque tout : divise les deux côtés par φ et tu obtiens φ = 1 + 1/φ, donc 1/φ = φ − 1 ≈ 0,6180339887. L'inverse, c'est l'original moins un — une propriété qu'aucun autre nombre positif n'a. La racine négative est ψ = (1 − √5)/2 ≈ −0,6180, et la paire (φ, ψ) est le moteur derrière chaque identité de Fibonacci ci-dessous.",
        },
        {
          pretitle: "Étape deux · Fibonacci",
          title: "Ajoute les deux derniers, pour toujours",
          body: "Pars de F₀ = 0, F₁ = 1, puis itère Fₙ₊₁ = Fₙ + Fₙ₋₁ : 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Prends le rapport de termes consécutifs — 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619 — et il se referme sur φ. La formule fermée de Binet rend cette limite exacte : Fₙ = (φⁿ − ψⁿ)/√5. Comme |ψ| < 1, le terme en ψⁿ s'évanouit et Fₙ finit par arrondir-coller à φⁿ/√5 pour tout n.",
        },
        {
          pretitle: "Étape trois · L'angle d'or et les tournesols",
          title: "Pourquoi un tournesol tourne de 137,508° par graine",
          body: "Prends un disque, place les graines l'une après l'autre, et tourne d'un angle fixe entre chacune. Le modèle de Vogel place la graine n au rayon rₙ = c√n (pour que l'aire par graine soit constante) et à l'angle θₙ = n · α. Choisis α = 360°/φ² ≈ 137,508° — l'angle d'or — et les graines se tassent densément, sans interstices ni direction privilégiée. Toute fraction rationnelle de tour s'alignerait après quelques rotations et laisserait des interstices radiaux ; φ est l'irrationnel le pire à approcher, donc le motif ne se répète jamais. Les tournesols, les pommes de pin, le chou romanesco et les feuilles de bien des plantes utilisent exactement cette astuce.",
        },
        {
          pretitle: "Étape quatre · Un scepticisme sain",
          title: "Où φ se trouve vraiment — et où il n'est pas",
          body: "φ ne gouverne ni le Parthénon, ni la Joconde, ni le coquillage de nautile, malgré d'innombrables infographies ; ces ajustements sont au mieux douteux et au pire biais de confirmation. Là où φ apparaît honnêtement, c'est dans la croissance et l'optimisation : la phyllotaxie (ci-dessus), la théorie des fractions continues (φ = [1; 1, 1, 1, …] en fait le nombre à convergence la plus lente — le « plus irrationnel »), et la géométrie des pavages de Penrose et des quasicristaux, dont l'ordre à longue portée est bâti à partir de φ. Réel, beau, et plus étroit que les affiches ne le laissent croire.",
        },
      ],
    },
    buffon: {
      pretitle: "Sujet · Analyse",
      title: "L'aiguille de Buffon",
      tagline: "Laisse tomber des bâtonnets sur du papier ligné. π en tombe.",
      intro:
        "Georges-Louis Leclerc, comte de Buffon, a posé la question en 1733 et l'a publiée en 1777 : laisse tomber une aiguille sur un sol de lignes parallèles et compte les croisements. Le rapport renvoie π — une constante issue de cercles, surgissant d'aiguilles droites sur du bois droit. L'Explorateur simule les chutes en direct et te laisse regarder l'estimation se rapprocher de π = 3,14159…",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le dispositif",
          title: "Lignes parallèles et une aiguille",
          body: "Trace sur un sol des lignes parallèles distantes de d. Prends une aiguille de longueur ℓ, avec ℓ ≤ d, et laisse-la tomber pour que son centre se pose à une position aléatoire uniforme et son angle soit uniforme sur [0, π]. L'aiguille croise une des lignes ou non. Voilà tout le dispositif — deux paramètres, une question oui/non, répétée un très grand nombre de fois.",
        },
        {
          pretitle: "Étape deux · La probabilité",
          title: "Pourquoi π apparaît",
          body: "Intègre sur le décalage vertical du centre et l'angle θ, et la probabilité que l'aiguille croise une ligne vaut exactement P = 2ℓ / (πd). Réarrange : π = 2ℓn / (d·k), où n est le nombre total d'aiguilles lâchées et k celui de celles qui ont croisé une ligne. π émerge d'aiguilles droites tombant sur des lignes droites parce que l'angle θ moyenne un sinus — et un sinus, intégré sur un demi-cercle, transporte secrètement π.",
        },
        {
          pretitle: "Étape trois · Convergence lente",
          title: "Les six chiffres suspects de Lazzarini",
          body: "L'erreur Monte Carlo décroît en 1/√n. Pour fixer trois décimales de π, il en faut de l'ordre de 10⁵ aiguilles, et même dix millions sont loin d'être assez pour une haute précision. En 1901, le mathématicien italien Mario Lazzarini a rapporté π ≈ 3,1415929 à partir de seulement 3408 jets — six chiffres exacts, suspectement proches de l'approximation bien connue 355/113. Il s'est presque certainement arrêté au moment chanceux, ou a arrangé l'expérience pour y atterrir. La convergence est véritablement lente ; le nombre de Lazzarini est trop joli pour être honnête.",
        },
        {
          pretitle: "Étape quatre · La nouille de Buffon",
          title: "Seule la longueur compte",
          body: "Le même calcul fonctionne pour ℓ > d, où plusieurs croisements par jet deviennent possibles et la forme fermée est plus élaborée. Plus frappante encore est la nouille de Buffon : prends n'importe quelle courbe plane C de longueur L, aussi tordue ou coudée soit-elle, et laisse-la tomber sur le même sol ligné. Le nombre attendu de croisements est 2L / (πd), peu importe la forme. Aiguille droite ou nouille frétillante : seule la longueur compte. Le même π, caché dans n'importe quelle courbe.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Sujet · Paradoxe",
      title: "L'hôtel de Hilbert",
      tagline: "Toujours de la place pour un de plus — même quand c'est plein.",
      intro:
        "David Hilbert a esquissé l'hôtel dans une conférence de 1924 et George Gamow l'a porté au grand public dans son livre de 1947 One, Two, Three… Infinity. L'Explorateur anime les quatre scénarios classiques — un client, k clients, ℵ₀ clients, et ℵ₀ bus de ℵ₀ clients — et montre qu'un hôtel infini déjà plein peut tous les absorber.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Imagine l'hôtel",
          title: "Une infinité de chambres, toutes occupées",
          body: "L'hôtel a une chambre pour chaque entier de comptage : 1, 2, 3, et ainsi pour toujours. Ce soir, chaque chambre est prise — un client en 1, un client en 2, un client en 17, un client en 10¹⁰⁰. Le bon sens dit que c'est « plein » : aucune chambre sans client. La mathématique n'est pas d'accord, car « plein » est une idée finie et l'ensemble des chambres ici est dénombrablement infini. Le cardinal des clients est ℵ₀, et ℵ₀ n'est pas un nombre — c'est la taille de l'ensemble des entiers naturels.",
        },
        {
          pretitle: "Étape deux · Un nouveau client",
          title: "Décale n → n+1 et la chambre 1 se libère",
          body: "Un voyageur frappe. Le directeur diffuse une seule consigne : chaque client passe de la chambre n à la chambre n+1. Le client de 1 va en 2, celui de 2 va en 3, et ainsi de suite ; personne n'est délogé, car une chambre de numéro supérieur attend toujours. Après le décalage, la chambre 1 est vide et le nouvel arrivant s'enregistre. L'hôtel « plein » ne l'a jamais été au sens fini — il faisait ℵ₀ + 1 = ℵ₀ depuis toujours.",
        },
        {
          pretitle: "Étape trois · Une infinité de nouveaux clients",
          title: "Envoie le client n en chambre 2n ; toutes les chambres impaires se libèrent",
          body: "Maintenant une file dénombrablement infinie arrive. Le directeur demande à chaque client existant de la chambre n de passer en chambre 2n. Le client 1 va en chambre 2, le client 2 en chambre 4, le client 3 en chambre 6 — chaque chambre paire reste occupée et chaque chambre impaire se libère. Les nouveaux arrivants remplissent 1, 3, 5, 7, … dans l'ordre, et tout le monde a une clé. C'est l'égalité ℵ₀ + ℵ₀ = ℵ₀ : deux copies des entiers tiennent dans une seule copie sans perte.",
        },
        {
          pretitle: "Étape quatre · Bus infinis, infinité de passagers chacun",
          title: "Les puissances de premiers absorbent ℵ₀ × ℵ₀",
          body: "Une flotte dénombrablement infinie de bus se présente, chacun transportant une infinité dénombrable de passagers. Envoie chaque client existant de la chambre n vers la chambre 2ⁿ — ils occupent les puissances de deux. Pour le bus k (k = 1, 2, 3, …), soit pₖ le k-ième nombre premier impair (3, 5, 7, 11, 13, …) et envoie le passager m en chambre pₖᵐ. Le bus 1 se pose sur 3, 9, 27, 81, … ; le bus 2 sur 5, 25, 125, … ; le bus 3 sur 7, 49, …. Par le théorème fondamental de l'arithmétique, toute puissance de premier est unique, donc aucun client ne se rencontre. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Sujet · Paradoxe",
      title: "La corne de Gabriel",
      tagline: "Volume fini, surface infinie.",
      intro:
        "Une forme de 1641 qui a englouti toutes les intuitions des mathématiciens sur l'infini. L'Explorateur coupe la corne à un x variable, dessine la vue de côté, et calcule le volume et l'aire surfacique en direct — regarde l'un rester sage et l'autre s'enfuir.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La forme",
          title: "Fais tourner y = 1/x autour de l'axe",
          body: "Prends la courbe y = 1/x pour x ≥ 1 et fais-la tourner autour de l'axe des x. Le résultat est une corne élancée qui s'évase près de x = 1 et s'effile à jamais vers un rayon nul à mesure que x croît. Chaque coupe perpendiculaire à l'axe est un disque de rayon 1/x. La corne s'étend infiniment vers la droite, et pourtant à chaque point sa largeur diminue. Evangelista Torricelli a décrit la figure en 1641 — trois décennies avant que Newton et Leibniz n'aient le calcul différentiel pour s'appuyer.",
        },
        {
          pretitle: "Étape deux · Calcule le volume",
          title: "V = π — exactement",
          body: "Découpe la corne en disques d'épaisseur dx et de rayon 1/x. Le volume de chaque disque est π · (1/x)² · dx. Additionne-les tous de 1 à l'infini : V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Fini. Toute la corne infinie pourrait être remplie à ras bord avec exactement π unités cubiques de peinture. L'intégrale convergente ∫ 1/x² dx est ce qui la maintient bornée — les carrés s'évanouissent assez vite pour que la somme se stabilise.",
        },
        {
          pretitle: "Étape trois · Calcule la surface",
          title: "A = ∞ — exactement",
          body: "L'aire latérale est A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. Le facteur racine carrée est toujours au moins 1, donc A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. C'est l'intégrale harmonique, et elle diverge. Aussi loin que tu marches le long de la corne, tu continues d'ajouter de l'aire latérale, et le total ne cesse jamais de croître. La surface est infinie — aucune quantité finie de peinture ne la couvrira.",
        },
        {
          pretitle: "Étape quatre · Le paradoxe du peintre",
          title: "Remplis-la ; sans jamais la peindre",
          body: "Voici donc l'énigme : verse-y π unités de peinture et la corne est pleine — y compris sa paroi intérieure. Pourtant pour en revêtir l'extérieur, il en faudrait une infinité. Torricelli trouvait le résultat contre-intuitif même avant que le calcul différentiel ne soit là pour nommer l'astuce. La résolution moderne est que « peindre » suppose une couche d'épaisseur non nulle ε, ce qui sur une surface infinie demande un volume infini. Lâche cette hypothèse et le paradoxe se dissout : la « peinture » mathématique intérieure a une épaisseur nulle sur la paroi, et la paroi intérieure est la même surface infinie que l'extérieure. Le nom vient plus tard — la corne de l'archange Gabriel, sonnée pour annoncer le jour du jugement.",
        },
      ],
    },
    cantor: {
      pretitle: "Sujet · Paradoxe",
      title: "L'argument diagonal de Cantor",
      tagline: "L'infini a des tailles.",
      intro:
        "L'argument diagonal de Georg Cantor de 1891 est la preuve la plus nette en mathématiques que certaines infinités sont plus grandes que d'autres. L'Explorateur anime la construction en direct : choisis n'importe quelle énumération de décimaux dans [0,1] et regarde un nouveau réel sortir de la diagonale — un nombre qui ne peut pas figurer sur ta liste, peu importe la manière dont tu l'ordonnes.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Mettre en place l'impossible",
          title: "Suppose qu'on puisse énumérer les réels",
          body: "La preuve de Cantor procède par contradiction. Suppose que les réels entre 0 et 1 sont dénombrables — c'est-à-dire qu'on peut les ranger en une suite infinie r₁, r₂, r₃, …, avec tout réel apparaissant quelque part sur la liste. Note qu'on ne dit jamais dans quel ordre : l'argument doit fonctionner pour tout ordre qu'on puisse inventer. Si on peut trouver un réel que l'énumération a manqué, l'hypothèse que toute énumération complète existe est morte.",
        },
        {
          pretitle: "Étape deux · Lire la diagonale",
          title: "Un chiffre à la fois, le long de l'escalier",
          body: "Écris chaque rₙ comme un développement décimal 0,d_{n,1} d_{n,2} d_{n,3} …, donc d_{n,k} est le k-ième chiffre du n-ième réel. Lis maintenant le long de la diagonale : d_{1,1}, puis d_{2,2}, puis d_{3,3}, et ainsi de suite. Construis un nouveau nombre s = 0,s₁ s₂ s₃ … en choisissant chaque chiffre sₙ différent de d_{n,n}. Une recette sûre est d'échanger 5 ↔ 6 (toute règle qui évite 0 et 9 contourne l'ambiguïté 0,999… = 1,000…).",
        },
        {
          pretitle: "Étape trois · Pourquoi s manque",
          title: "Différent au n-ième chiffre, à chaque fois",
          body: "Par construction, s diffère de r₁ à la première décimale, de r₂ à la deuxième, de r₃ à la troisième — de rₙ à la n-ième, pour tout n. Donc s ne peut être égal à aucun rₙ de la liste. Pourtant s est un nombre réel parfaitement légitime dans [0, 1]. La liste était censée contenir tous les tels réels, et en voici un qu'elle a manqué. L'hypothèse s'effondre : aucune énumération des réels ne peut être complète. Les réels entre 0 et 1 sont indénombrables.",
        },
        {
          pretitle: "Étape quatre · Un nouveau type d'infini",
          title: "Continu, arrêt, Gödel — même diagonale",
          body: "Les réels ont une cardinalité strictement supérieure à celle des entiers : |ℝ| = 2^ℵ₀ = c > ℵ₀. La même astuce diagonale alimente la preuve de Turing que le problème de l'arrêt est indécidable, et le premier théorème d'incomplétude de Gödel — tous deux construisent un énoncé qui désaccorde avec chaque candidat d'une liste. Cantor a alors demandé si une cardinalité vit strictement entre ℵ₀ et c. C'est l'hypothèse du continu. Gödel (1940) et Cohen (1963) ont ensemble montré qu'elle est indépendante de ZFC : suppose-la vraie et les axiomes restent cohérents ; suppose-la fausse et les axiomes restent cohérents. La mathématique, sur ce point, laisse la porte ouverte.",
        },
      ],
    },
    boids: {
      pretitle: "Sujet · Computation",
      title: "Boids",
      tagline: "Trois règles locales. Tout un vol.",
      intro:
        "Craig Reynolds a donné à chaque oiseau simulé trois petits instincts en 1986 et les a lâchés — pas de meneur, pas de plan global, pas de carte partagée. De ces trois pulsions locales, un vol a émergé. L'Explorateur te permet de régler les trois règles en temps réel et de voir toute la chorégraphie se répandre.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'agent",
          title: "Un point avec un cap",
          body: "Chaque boid est un minuscule point en mouvement : il a une position et une vitesse. C'est toute la mémoire que chaque agent transporte. Il ne peut pas voir tout le vol — seulement la poignée de voisins dans un petit rayon de perception. Il n'y a pas de carte, pas de meneur à suivre, pas de message entre agents. Juste une position, une vitesse, et ce qui est en vue.",
        },
        {
          pretitle: "Étape deux · Les trois règles",
          title: "Séparation, alignement, cohésion",
          body: "À chaque image, chaque boid calcule trois petits vecteurs de direction à partir des voisins dans son rayon de perception. SÉPARATION : s'écarter de tout boid devenu trop proche, pondéré selon la proximité. ALIGNEMENT : pousser ta vitesse vers la vitesse moyenne de tes voisins. COHÉSION : se diriger vers le centre de masse des voisins en vue. Les trois vecteurs sont sommés avec des poids et ajoutés à la vitesse à chaque image. C'est tout l'algorithme.",
        },
        {
          pretitle: "Étape trois · Émergence",
          title: "Pas de chef, pas de plan, pas de papote",
          body: "Partant de positions et de caps aléatoires, les boids s'organisent en vols serrés en quelques secondes. Des flots se forment, contournent les obstacles, et fusionnent à nouveau — exactement la chorégraphie des véritables murmurations d'étourneaux, des bancs-leurres de sardines et des essaims de chauves-souris. Rien dans le programme ne connaît la notion de vol. Le vol, c'est ce à quoi les trois règles ressemblent vues du dehors. C'est l'une des démonstrations les plus nettes d'émergence en toute informatique.",
        },
        {
          pretitle: "Étape quatre · Où cela finit",
          title: "De SIGGRAPH 1987 au ciel nocturne",
          body: "Reynolds a appelé les agents boids — abréviation de bird-oid object — et a présenté l'article « Flocks, Herds, and Schools: A Distributed Behavioral Model » à SIGGRAPH 1987. En cinq ans, son algorithme animait l'essaim de chauves-souris de Batman Returns (1992) et la ruée des gnous du Roi Lion (1994). Aujourd'hui, les mêmes trois règles pilotent les simulations d'évacuation, la recherche en essaims robotiques, et la chorégraphie des spectacles à 1000 drones lumineux d'Intel. Le modèle de vol est un frère de l'optimisation par essaim de particules — la même intuition, recyclée pour la recherche.",
        },
      ],
    },
    aizawa: {
      pretitle: "Sujet · Chaos",
      title: "L'attracteur d'Aizawa",
      tagline: "Le cousin plus étrange, plus bizarre, de Lorenz.",
      intro:
        "Trois équations différentielles couplées traînent un seul point à travers l'espace 3D. Contrairement au papillon de Lorenz, la trajectoire ici se replie en un tore noué à anse de panier, traversé par un pic vertical au cœur — l'un des attracteurs étranges les plus visuellement distinctifs de la théorie du chaos.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Les équations",
          title: "Trois équations, sept paramètres",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Choisis un point de départ quelconque. Intègre dans le temps avec un petit pas (la méthode d'Euler fonctionne ; Runge-Kutta est mieux). Le point trace une courbe dans l'espace. Fais tourner pendant des milliers d'étapes et la courbe revient à portée de soi, puis s'écarte — sans jamais se répéter exactement, restant toujours dans une région bornée. Voilà l'attracteur étrange.",
        },
        {
          pretitle: "Étape deux · La géométrie par défaut",
          title: "Vase, panier, pic",
          body: "Avec les paramètres classiques d'Aizawa (a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25, f = 0,1), la trajectoire s'enroule autour d'un tore dans la moitié inférieure de la figure, puis boucle vers le haut à travers un mince col vertical et redescend dans le tore de l'autre côté. Le résultat ressemble à un vase cannelé avec un fil qui le traverse. Sous le bon angle, il ressemble à un panier. Sous un autre, à un cœur traversé d'un pic. Le visuel fait partie de la raison pour laquelle l'attracteur d'Aizawa a quitté les manuels : il se photographie mieux que tous les autres.",
        },
        {
          pretitle: "Étape trois · Tourner les boutons",
          title: "Géométrie sensible",
          body: "Aizawa est plus riche en paramètres que Lorenz, ce qui lui donne plus de sensibilité au réglage. Diminue le paramètre c de 0,1 et le pic se rétracte dans le panier. Augmente d et les boucles du dessous deviennent plus serrées, plus denses, comme un tissage plus dense. Certaines combinaisons de paramètres s'effondrent sur un cycle limite (plus de chaos) ; d'autres explosent à l'infini. Le régime chaotique est une bande étroite de l'espace des paramètres, et la géométrie à l'intérieur de cette bande se métamorphose continûment quand tu glisses les boutons.",
        },
        {
          pretitle: "Étape quatre · Une petite famille",
          title: "Rössler, Thomas et leurs amis",
          body: "Aizawa est une entrée dans une petite famille d'attracteurs étranges à trois équations découverts à travers les années 1970 et 1980. Rössler (1976) est encore plus simple — un seul terme non linéaire, et la trajectoire est une spirale plate avec une torsion repliée, comme une rosette de Möbius. L'attracteur cycliquement symétrique de Thomas n'utilise que des fonctions sinus et produit un enchevêtrement de cubes reliés par des fils chaotiques. Tous trois vivent en 3D avec des trajectoires continues — pas de pas de temps, pas de grille, pas de discrétisation, juste la mathématique traînant un point.",
        },
      ],
    },
    dla: {
      pretitle: "Sujet · Chaos",
      title: "Agrégation limitée par diffusion",
      tagline: "Des marcheurs aléatoires gèlent au contact — et font pousser des coraux.",
      intro:
        "Un pixel-graine. Un essaim de particules, chacune sur sa propre marche aléatoire. Au moment où une particule errante heurte l'agrégat, elle y colle à jamais. Répète dix mille fois et un dendrite ramifié éclôt à partir de rien — la même forme que prend le cuivre lorsqu'il est électrodéposé, que prend le lichen sur un mur, que la foudre laisse sur la peau nue.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le dispositif",
          title: "Une graine et un brouillard de marcheurs",
          body: "Aire de jeu sur grille de pixels. Place un seul pixel noir au centre : la graine. Libère maintenant une particule en un endroit aléatoire loin de la graine. La particule effectue une marche aléatoire — chaque pas choisit uniformément l'une des quatre directions — et continue jusqu'à ce qu'elle atterrisse à côté de l'agrégat (et en devienne partie) ou s'éloigne trop (et soit oubliée). Libère la suivante. Et la suivante. Dix mille particules plus tard, tu as une image.",
        },
        {
          pretitle: "Étape deux · La règle de collage",
          title: "Toucher = geler, pour toujours",
          body: "Il y a une seule règle. Une particule en marche qui devient adjacente à n'importe quel pixel de l'agrégat se transforme elle-même en pixel d'agrégat, et cesse de bouger. C'est toute la physique. La raison pour laquelle la structure est ramifiée et non en blob est géométrique : un marcheur errant est beaucoup plus susceptible d'être intercepté par une pointe exposée de l'agrégat que de se frayer un chemin dans un fjord profond. Les pointes croissent plus vite que les vallées. Des branches se forment. L'intérieur est affamé de nouveaux arrivants.",
        },
        {
          pretitle: "Étape trois · La dimension fractale",
          title: "1,71 — indépendante de la graine",
          body: "Witten et Sander ont publié le modèle en 1981 et montré numériquement que sur un réseau 2D, l'agrégat résultant a une dimension fractale ≈ 1,71. C'est strictement entre une courbe (dimension 1) et une région pleine (dimension 2), et — crucialement — cela ne dépend ni de la forme de la graine, ni du type de réseau, ni du rayon de spawn. Différents processus physiques qui semblent superficiellement n'avoir rien à voir produisent exactement la même dimension. Le nombre est universel au même sens que π.",
        },
        {
          pretitle: "Étape quatre · Où elle apparaît",
          title: "Cuivre, foudre, lichen, neurones",
          body: "Remplace les marcheurs abstraits par des ions de cuivre dans une solution de sulfate et active un courant ; le métal se dépose sur la cathode selon le même motif dendritique. Remplace-les par des électrons fuyant à travers un diélectrique et tu obtiens une figure de Lichtenberg — la cicatrice en forme d'éclair que la haute tension laisse sur le bois, sur l'acrylique, ou sur un corps humain foudroyé. Remplace-les par des spores aériennes se posant sur un arbre et tu obtiens la silhouette d'une colonie de lichen. Chaque fois que la diffusion heurte quelque chose d'irréversiblement collant, tu peux prédire l'image à partir d'une seule règle.",
        },
      ],
    },
    langton: {
      pretitle: "Sujet · Computation",
      title: "La fourmi de Langton",
      tagline: "Deux règles · dix mille pas · une autoroute.",
      intro:
        "Place une seule fourmi sur une grille infinie de cases blanches. Deux règles lui disent quoi faire. Pendant les dix mille premiers pas, la trace ressemble au chaos. Puis — sans prévenir — elle bascule dans un motif parfaitement périodique de 104 pas qui s'en va vers l'infini. Deux règles, un miracle émergent inexpliqué.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Les règles",
          title: "Deux lignes, c'est tout le programme",
          body: "Il y a une fourmi face à l'une des quatre directions, sur une grille carrée infinie où chaque case est blanche ou noire. À chaque tic : regarde la case sur laquelle tu te tiens. Si elle est BLANCHE : retourne-la en noire, tourne de 90° dans le sens horaire, avance d'une case. Si elle est NOIRE : retourne-la en blanche, tourne de 90° dans le sens antihoraire, avance d'une case. C'est la spécification complète — Christopher Langton l'a notée en 1986. Pas de nombre aléatoire, pas de regard sur le voisinage, pas de paramètres. Deux lignes.",
        },
        {
          pretitle: "Étape deux · Trois régimes",
          title: "Symétrie simple, puis chaos, puis…",
          body: "Lance la fourmi depuis une grille vide et observe. Pendant environ 100 pas, la trace est petite et bilatéralement symétrique — les règles sont déterministes, le départ est vide, le motif doit respecter les deux axes. Vers le pas 500, la symétrie éclate et la trace paraît essentiellement aléatoire : un fouillis de cases noires sans structure visible à aucune échelle. Cette phase dure environ dix mille pas et a frustré les chercheurs pendant près d'une décennie. Puis commence le troisième régime.",
        },
        {
          pretitle: "Étape trois · L'autoroute",
          title: "Une boucle de 104 pas, dérivant à jamais",
          body: "Quelque part autour du pas 10 000 — le moment exact dépend du motif de bits initial mais c'est toujours dans cette zone — la fourmi se verrouille dans un cycle répétitif de 104 pas qui la translate de deux cases en diagonale à chaque boucle. De l'extérieur, on dirait qu'elle dépose une « autoroute » rayée bien ordonnée s'en allant vers le coin. Elle la suivra, imperturbable, à jamais. Bunimovich et Troubetzkoy ont prouvé en 1992 que peu importe l'arrangement fini de cases noires depuis lequel tu pars, la trajectoire de la fourmi est toujours non bornée — elle ne peut pas être piégée. Que l'autoroute apparaisse toujours est encore une conjecture ouverte. Jusqu'ici, c'est toujours arrivé.",
        },
        {
          pretitle: "Étape quatre · Pourquoi cela compte",
          title: "Universalité cachée dans deux lignes",
          body: "Prends la fourmi et remplace « deux couleurs » par « n couleurs » et une règle de virage différente par couleur. Certaines de ces fourmis généralisées sont Turing-complètes — Gajardo, Moreira et Goles l'ont prouvé : tu peux encoder n'importe quel programme informatique dans le motif de bits initial, et la trajectoire de la fourmi est l'exécution de ce programme. Donc un système assez simple pour tenir sur une serviette de table est, déguisé, tout ordinateur possible jamais construit. Voilà le casse-tête de l'émergence cellulaire dans sa forme la plus pure.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Sujet · Géométrie",
      title: "Le triangle de Pascal (mod n)",
      tagline: "Colore par divisibilité — une fractale en tombe.",
      intro:
        "Le triangle de Pascal est la table de consultation des coefficients binomiaux C(n, k). Chaque nombre est juste la somme des deux au-dessus de lui. Réduis chaque entrée modulo un nombre premier et le motif coloré résultant est une fractale parfaite et infinie. Pourquoi ? À cause du moment où les retenues se produisent en addition de base p.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le triangle",
          title: "Des nombres issus de la plus simple règle de la Terre",
          body: "Écris un 1 au sommet. En dessous, chaque entrée est la somme des deux au-dessus (traite les positions vides comme zéro). Les six premières lignes : 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. Les nombres sont les coefficients binomiaux C(n, k) — ils comptent le nombre de façons de choisir k éléments parmi n. Ils apparaissent en probabilité, en algèbre (le développement de (a + b)ⁿ), en combinatoire. Ils sont aussi le seul ingrédient nécessaire pour voir une fractale.",
        },
        {
          pretitle: "Étape deux · Colore par reste",
          title: "Mod 2 : cellules impaires remplies, cellules paires vides",
          body: "Remplace maintenant chaque entrée par son reste modulo 2 (sa parité). Remplis les 1, laisse les 0 vides, et recule d'un pas. Ce que tu vois est le triangle de Sierpiński — exact, infini, généré purement par comptage. Prends n'importe quel bloc de 2^k lignes et l'image est trois copies du même bloc de taille 2^(k-1) disposées en triangle, avec un trou au milieu. La même structure autosimilaire descend tout le long.",
        },
        {
          pretitle: "Étape trois · Le théorème de Kummer",
          title: "La loi cachée : compte les retenues",
          body: "Pourquoi Pascal mod p se factorise-t-il aussi proprement ? En 1852, Kummer a prouvé un fait stupéfiant. La plus haute puissance d'un premier p qui divise C(n, k) égale le nombre de retenues qui se produisent quand tu additionnes k et (n − k) en base p. Donc C(n, k) est divisible par p (mod 0) exactement quand il y a au moins une retenue ; il est non nul mod p exactement quand k peut être additionné à (n − k) en base p sans retenue — c'est-à-dire quand chaque chiffre de base p de k est au plus celui correspondant de n. La fractale est, secrètement, une image des moments où l'addition en base p est propre.",
        },
        {
          pretitle: "Étape quatre · Autres premiers",
          title: "p différent, joint différent",
          body: "Pour p = 3, tu obtiens un joint triangulaire à trois couleurs avec une structure autosimilaire d'ordre 3. Pour p = 5, la période est 5 ; pour p = 7, le joint est encore plus dense. À mesure que p grandit, la dimension de Hausdorff fractale approche 2 — l'image se remplit. Pour les modules non premiers, la structure existe mais devient irrégulière (le comptage propre des retenues de Kummer ne fonctionne que pour les premiers). Une table combinatoire simple, une famille infinie de fractales.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Sujet · Analyse",
      title: "L'arbre de Stern-Brocot",
      tagline: "Chaque fraction, exactement une fois — construite en additionnant mal.",
      intro:
        "Pars de 0/1 et 1/0 — les deux impossibilités. Glisse une nouvelle fraction entre elles en additionnant numérateurs et dénominateurs séparément, comme le ferait un enfant. Recommence indéfiniment. L'arbre infini que tu construis contient toute fraction positive une fois, sous forme irréductible — et le chemin vers chacune est exactement son développement en fraction continue.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le médiant",
          title: "Additionne les morceaux séparément, obtiens du neuf",
          body: "Prends deux fractions, a/b et c/d. Leur médiant est (a + c) / (b + d). C'est, bien sûr, la mauvaise façon d'additionner des fractions. Mais cela produit quelque chose d'intéressant : une fraction strictement entre a/b et c/d. Pars de 0/1 et 1/0 (traite 1/0 comme +∞). Leur médiant est 1/1. Glisse 1/1 entre elles. Prends maintenant les nouvelles paires : (0/1, 1/1) donne 1/2 ; (1/1, 1/0) donne 2/1. Glisse-les toutes les deux. Recommence. Les fractions défilent sur la droite numérique, chacune déjà sous forme irréductible.",
        },
        {
          pretitle: "Étape deux · Chaque fraction, une fois",
          title: "Rien n'est manqué, rien n'est répété",
          body: "C'est un théorème — démontrable en quelques lignes — que l'arbre de Stern-Brocot contient chaque nombre rationnel positif exactement une fois, avec numérateur et dénominateur déjà premiers entre eux. L'arbre est donc, simultanément, une énumération des rationnels positifs, une preuve qu'il n'y en a qu'un nombre dénombrable, et une manière structurellement équitable de les construire. Stern (1858) et Brocot (1861) ont découvert le même arbre indépendamment — Stern en théorie des nombres, Brocot en tant qu'outil d'horloger pour choisir des rapports d'engrenages.",
        },
        {
          pretitle: "Étape trois · Le chemin en fraction continue",
          title: "Gauche et droite encodent le développement",
          body: "Choisis n'importe quel nombre positif — rationnel ou irrationnel. Descends dans l'arbre en partant de 1/1. À chaque étape, va à GAUCHE si ta cible est plus petite que la fraction actuelle, à DROITE si plus grande. Note la séquence des mouvements en liste d'occurrences successives. Cette liste est exactement le développement en fraction continue de ta cible. Par exemple : le nombre d'or φ = (1+√5)/2 ≈ 1,618 produit le chemin R, L, R, L, R, L, … — alternant un par un — qui encode la fraction continue [1; 1, 1, 1, 1, …]. φ est, en ce sens, le nombre irrationnel « le plus dur » à approcher par des rationnels.",
        },
        {
          pretitle: "Étape quatre · Meilleures approximations",
          title: "S'arrêter tôt donne les convergents",
          body: "Arrête la marche après n'importe quel nombre fini d'étapes. La fraction où tu te trouves est une meilleure approximation rationnelle de ta cible — meilleure que toute rationnelle à dénominateur plus petit. La suite des fractions visitées en route vers π te donne donc 3, 22/7, 333/106, 355/113, 103993/33102 — les fameux convergents que les cultures humaines n'ont cessé de redécouvrir au fil des siècles. La même construction qui énumère les rationnels choisit aussi les meilleurs.",
        },
      ],
    },
    ulam: {
      pretitle: "Sujet · Analyse",
      title: "La spirale d'Ulam",
      tagline:
        "Des nombres premiers s'alignant sur des diagonales que personne ne peut entièrement expliquer.",
      intro:
        "Stanisław Ulam, qui s'ennuyait pendant une conférence en 1963, a griffonné les entiers en spirale carrée et entouré les premiers. Les premiers ne se sont pas dispersés. Ils se sont massés le long de diagonales visibles. Pourquoi les premiers préfèrent certaines formes quadratiques à d'autres est l'un des problèmes ouverts les plus profonds en théorie des nombres — Ulam l'a vu sur une serviette.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La spirale",
          title: "1 au milieu, puis marche en carrés",
          body: "Écris 1 au centre. Avance d'un pas à droite pour écrire 2. Vers le haut pour écrire 3. À gauche pour 4 et 5. Vers le bas pour 6, 7 et 8. Continue en spirale carrée qui grandit vers l'extérieur. Le temps d'avoir placé une centaine de nombres, tu as une grille 10 × 10 où chaque cellule contient un entier positif et où des entiers voisins sur la page ne sont plus voisins sur la droite numérique. Voilà toute la construction.",
        },
        {
          pretitle: "Étape deux · Colore les premiers",
          title: "Un motif qui ne devrait pas être là",
          body: "Remplis maintenant seulement les cellules dont le nombre est premier — laisse les autres vides. Si les premiers étaient vraiment aléatoires parmi les entiers, la grille ressemblerait à un mouchetage uniforme, comme la neige télé. Au lieu de cela, l'œil est tiré le long de claires lignes diagonales traversant l'image. Le motif n'est pas subtil : même un carré trente par trente le montre déjà. Ulam, Myron Stein et Mark Wells ont publié l'observation en 1964 avec une grille de 65 000 nombres imprimée sur plusieurs pages de Scientific American.",
        },
        {
          pretitle: "Étape trois · Pourquoi des diagonales",
          title: "Chaque diagonale est un polynôme 4n² + bn + c",
          body: "Les nombres le long de toute diagonale de la spirale d'Ulam satisfont une formule quadratique de la forme 4n² + bn + c. Une diagonale pleine de premiers signifie donc que le polynôme est exceptionnellement riche en premiers. Certaines sont spectaculaires. Le polynôme d'Euler n² − n + 41 — découvert en 1772 — produit des premiers pour tout n de 0 à 39, et correspond à une bande diagonale visible. Qu'une infinité de premiers se trouvent sur une telle diagonale est, pour toute diagonale particulière, non prouvé. La conjecture de Bouniakovski dit oui ; personne ne l'a montré.",
        },
        {
          pretitle: "Étape quatre · Le problème plus profond",
          title: "Une question ouverte avec du maquillage",
          body: "La spirale d'Ulam est un réarrangement cosmétique des entiers, mais les diagonales visibles encodent une profonde question ouverte : quels polynômes quadratiques dans ℤ[x] produisent une infinité de premiers ? Plusieurs conjectures de Hardy-Littlewood et de Bateman-Horn prédisent des densités exactes pour ces premiers — elles collent spectaculairement bien à l'image — mais chaque prédiction est conditionnelle. Le griffonnage d'Ulam est une fenêtre sur la partie la plus tenace de la théorie analytique des nombres, accidentellement visible à quiconque dispose de papier quadrillé.",
        },
      ],
    },
    cardioid: {
      pretitle: "Sujet · Géométrie",
      title: "La cardioïde de la tasse à café",
      tagline: "La courbe lumineuse dans ta tasse est le cœur de Mandelbrot.",
      intro:
        "Fais briller la lumière solaire parallèle sur une tasse à café cylindrique. Les reflets de la paroi intérieure ne convergent pas en un point — ils enveloppent une courbe en forme de cœur qui dérive à la surface du café. Cette courbe est la cardioïde r = 2a(1 − cos θ). La même équation décrit le bulbe principal de l'ensemble de Mandelbrot. Chaque matin, la forme la plus célèbre de la dynamique est dessinée par la lumière.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'optique",
          title: "Pourquoi la lumière se regroupe dans une tasse",
          body: "Un cercle réfléchit un rayon horizontal selon deux fois l'angle que fait la surface avec ce rayon — la loi de la réflexion. Un faisceau de rayons horizontaux frappant l'intérieur d'une tasse cylindrique est donc éventé vers l'extérieur par deux fois l'angle local. Ils ne convergent pas en un point focal unique, car la courbure varie ; au lieu de cela, la famille de rayons réfléchis enveloppe une courbe lisse. Le mot des mathématiciens pour cette enveloppe est une catacaustique. La catacaustique d'un cercle, éclairé par des rayons parallèles, est exactement une cardioïde.",
        },
        {
          pretitle: "Étape deux · L'équation",
          title: "r = 2a (1 − cos θ)",
          body: "En coordonnées polaires centrées sur un sommet choisi, la cardioïde est r(θ) = 2a(1 − cos θ). Quand θ = 0, le rayon vaut 0 (le rebroussement). Quand θ = π, le rayon vaut 4a (la pointe lointaine). La courbe est tracée par un point sur le bord d'un cercle de rayon a roulant autour de l'extérieur d'un cercle fixe du même rayon — d'où le nom : cardia veut dire cœur. C'est l'une des courbes algébriques les plus étudiées de l'analyse classique.",
        },
        {
          pretitle: "Étape trois · Le bulbe principal de Mandelbrot",
          title: "Même équation, univers totalement différent",
          body: "Laisse maintenant l'optique de côté. Zoome dans l'ensemble de Mandelbrot z ↦ z² + c. Le gros bulbe en forme de cœur au centre — la plus grande composante — est une cardioïde. Exactement. Sa frontière est paramétrée par c(t) = (1/2)·e^(it) − (1/4)·e^(2it), et cette équation est algébriquement une cardioïde (en la variable c). Les valeurs de c à l'intérieur de ce bulbe correspondent à des dynamiques avec un unique point fixe attractif. La forme qui apparaît dans une tasse et la forme qui apparaît en théorie de l'itération sont la même forme — et il n'y a pas de raison simple pour cela.",
        },
        {
          pretitle: "Étape quatre · Et les bulbes plus petits",
          title: "Une échelle infinie de disques attachés",
          body: "La cardioïde principale dans l'ensemble de Mandelbrot a des disques circulaires plus petits qui y pendent à chaque fraction rationnelle p/q. Chaque disque correspond à une dynamique où le cycle attractif est de période q. Le plus grand disque, à gauche, est de période 2 ; les deux suivants sont de période 3 ; puis quatre disques de période 4 ; et ainsi de suite. La fractale au bord de l'ensemble de Mandelbrot est précisément la frontière entre ces régions stables et le chaos. Le café, l'optique, l'itération complexe, les objets les plus profonds de la dynamique — tous portant la même forme.",
        },
      ],
    },
    galton: {
      pretitle: "Sujet · Analyse",
      title: "La planche de Galton",
      tagline: "Des billes qui rebondissent dessinent toujours la même cloche.",
      intro:
        "Le quincunx de Francis Galton est un triangle de chevilles. Une bille lâchée du haut rebondit à gauche ou à droite à chaque cheville, à 50-50, et atterrit dans l'un des bacs en bas. Lâche dix mille billes et les bacs se remplissent — toujours — selon la forme de la distribution normale. La cloche n'est pas un hasard. C'est le théorème central limite rendu tactile.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le dispositif",
          title: "Un escalier de pile-ou-face équitables",
          body: "Une planche avec N rangées de chevilles décalées d'une demi-cheville. Lâche une bille en haut. À chaque cheville qu'elle heurte, elle rebondit à gauche ou à droite avec égale probabilité — un pile-ou-face indépendant. Après N chevilles, la bille est tombée dans l'un des N + 1 bacs de collecte, où l'indice du bac est le nombre de rebonds à droite moins celui à gauche, décalé pour être non négatif. Une bille ne t'apprend rien. La forme n'apparaît qu'à la limite.",
        },
        {
          pretitle: "Étape deux · L'atterrissage façon Pascal",
          title: "Les comptes des bacs sont binomiaux",
          body: "Après N rangées, la probabilité que la bille atterrisse dans le bac k (numéroté 0 à N) est C(N, k) / 2^N. Les numérateurs sont les entrées de la ligne N du triangle de Pascal. Une planche de Galton est donc, secrètement, une consultation physique des coefficients binomiaux. Avec N = 10, les bacs centraux reçoivent les entrées 252, 210, 210 — et les bacs les plus extérieurs reçoivent l'entrée 1 (un seul chemin sur les 1024). La forme est déjà une cloche discrète.",
        },
        {
          pretitle: "Étape trois · Le théorème central limite",
          title: "La cloche est inévitable",
          body: "À mesure que N grandit, la fonction de masse de la binomiale converge vers la densité gaussienne (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). C'est le théorème de De Moivre-Laplace (1733), le premier cas historique du théorème central limite. Le TCL général dit bien plus : prends N'IMPORTE QUELLE variable aléatoire de variance finie — biais, asymétrie, distribution au diable — et somme N copies indépendantes. Après remise à l'échelle, la somme converge vers une gaussienne. La cloche, c'est ce que deviennent toujours les moyennes.",
        },
        {
          pretitle: "Étape quatre · Pourquoi elle apparaît partout",
          title: "Toute somme de nombreux petits coups",
          body: "Les tailles sont faites de milliers de petites contributions indépendantes. De même pour les scores aux tests, les scores de QI, les erreurs de mesure, les rendements financiers quotidiens (sous des hypothèses restrictives). Chacun est une somme de nombreuses petites variables aléatoires indépendantes, donc chacun est approximativement gaussien. C'est pour cela que les courbes en cloche règnent en statistiques et pourquoi l'écart-type a un nom. La planche de Galton est la manière la plus physique de voir le théorème à l'œuvre — à 1000 billes, la cloche est déjà lisse, même si aucune bille individuellement n'en sait rien.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Sujet · Chaos",
      title: "Le pendule magnétique",
      tagline: "Colore chaque départ par son vainqueur — et une fractale apparaît.",
      intro:
        "Suspends un pendule en fer au-dessus de trois aimants disposés en triangle. Lois de Newton, attraction magnétique, un soupçon de frottement — tout est déterministe. Et pourtant la question « au-dessus de quel aimant va-t-il atterrir ? » n'a pas de réponse lisse. Colore chaque point de départ par son vainqueur final : bassins rouge, vert et bleu, imbriqués à toutes les échelles.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La physique",
          title: "Trois tractions, un amortissement, la gravité vers le centre",
          body: "Monte un petit poids en fer sur un fil souple au-dessus d'une plaque. Place trois aimants identiques sur la plaque en triangle équilatéral. Le pendule est tiré vers chaque aimant avec une force proportionnelle à 1/r² (ou 1/r³ pour un modèle en cube inverse — les deux sont utilisés dans la littérature ; la fractale qualitative apparaît pour l'un comme l'autre). Un ressort faible rappelle aussi le pendule vers le centre du triangle. La résistance de l'air draine régulièrement l'énergie. Les équations du mouvement sont déterministes ; la seule inconnue est la position de départ.",
        },
        {
          pretitle: "Étape deux · Les bassins d'attraction",
          title: "Trois régions dans l'espace des points de départ",
          body: "Lâche le pendule depuis un point de départ au-dessus de la plaque et intègre les équations. L'amplitude du pendule finit par décroître et il se pose directement au-dessus de l'un des trois aimants — le vainqueur. Répète pour chaque point de départ d'une grille fine, colore chacun par son vainqueur : rouge pour l'aimant 1, vert pour l'aimant 2, bleu pour l'aimant 3. La plaque est maintenant coloriée en trois bassins d'attraction. L'intérieur de chaque bassin est une région colorée bien nette. La frontière, en revanche, n'est pas une courbe — c'est une fractale.",
        },
        {
          pretitle: "Étape trois · La frontière fractale",
          title: "Tout point frontalier borde les trois couleurs",
          body: "Zoome sur la frontière entre deux couleurs quelconques et tu y trouves la troisième couleur entremêlée. Zoome encore et tu trouves les trois couleurs arbitrairement près de tout point frontalier. C'est la propriété qui définit un bassin de Wada — une monstruosité topologique découverte par Yoneyama en 1917, puis utilisée comme arme par les théoriciens du chaos dans les années 1990. Le déterminisme reste intact : même départ → même résultat. Mais le plus infime changement dans la position de départ peut basculer la réponse vers n'importe lequel des trois aimants. La prédictibilité est perdue.",
        },
        {
          pretitle: "Étape quatre · Pourquoi cela compte",
          title: "Le chaos a une couleur",
          body: "Le pendule magnétique est la visualisation la plus nette de la dépendance sensible aux conditions initiales dans tout système mécanique classique. Le même type de bassin fractal apparaît dans les solveurs de la méthode de Newton (zoome sur la frontière des bassins de Newton pour un cubique et tu obtiens la même image), dans les modèles à long terme du système solaire, dans les billards chaotiques, dans les régimes à point fixe stable de l'attracteur de Lorenz. Partout où des attracteurs concurrents coexistent, les frontières de leurs bassins ont tendance à être fractales. Le monde regorge de ces frontières cachées ; le pendule magnétique te laisse simplement en voir une.",
        },
      ],
    },
    godel: {
      pretitle: "Sujet · Paradoxe",
      title: "L'incomplétude de Gödel",
      tagline: "Les mathématiques ne seront jamais complètes.",
      intro:
        "Kurt Gödel, Vienne, 1931. Dans tout système formel cohérent assez riche pour exprimer l'arithmétique, il existe des énoncés vrais que le système lui-même ne peut pas prouver. L'Explorateur te conduit pas à pas à travers la numérotation de Gödel et la construction de la proposition autoréférentielle G qui dit, en arithmétique, « je ne suis pas démontrable ».",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le rêve de Hilbert",
          title: "Mécaniser toutes les mathématiques",
          body: "Début du vingtième siècle. Les Principia Mathematica (1910–1913) de Whitehead et Russell tentaient de dériver chaque théorème de l'arithmétique d'une unique tour d'axiomes logiques. David Hilbert, dans son programme de Paris de 1900 puis sa poussée formaliste des années 1920, réclamait un système fini et mécanique d'où toute affirmation vraie pouvait être prouvée, et dont la cohérence pouvait être prouvée de l'intérieur. Une mathématique formelle complète, cohérente, décidable. Quiconque aurait du papier et de la patience pourrait, en principe, trancher chaque question mathématique. Tel était le rêve.",
        },
        {
          pretitle: "Étape deux · La numérotation de Gödel",
          title: "Une arithmétique qui parle d'elle-même",
          body: "Le premier coup de Gödel fut une astuce de codage. Attribue un nombre à chaque symbole du langage formel — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, parenthèses, variables, et ainsi de suite. Puis encode une formule entière (s₁, s₂, …, sₖ) sous la forme du seul entier naturel 2^s₁ · 3^s₂ · 5^s₃ · … en utilisant les nombres premiers consécutifs. Par l'unicité de la décomposition en facteurs premiers, l'encodage est réversible. Les preuves — suites de formules — reçoivent elles aussi des numéros. Soudain, des propriétés comme « x est une preuve de y » deviennent des prédicats arithmétiques Prov(x, y) que le système formel peut exprimer à propos de ses propres énoncés.",
        },
        {
          pretitle: "Étape trois · L'astuce diagonale",
          title: "G dit : « G n'est pas démontrable »",
          body: "Avec le lemme de diagonalisation — descendant direct de l'argument diagonal de Cantor de 1891 — Gödel construisit une proposition G dont le numéro de Gödel est ⌜G⌝, et qui est arithmétiquement équivalente à ¬∃x Prov(x, ⌜G⌝) : « aucun nombre x n'est une preuve de la formule de numéro de Gödel ⌜G⌝ ». En clair : G dit « je ne suis pas démontrable dans ce système ». Vient alors l'étau. Si G est démontrable, le système prouve une affirmation fausse et est incohérent. Si G n'est pas démontrable, alors ce que G affirme est exactement vrai — mais le système ne peut pas le prouver. D'une manière ou d'une autre, le rêve de Hilbert d'une arithmétique complète et cohérente s'effondre. Le second théorème d'incomplétude suit presque immédiatement : un tel système ne peut prouver sa propre cohérence, car s'il le pouvait, il prouverait aussi G, contredisant le premier.",
        },
        {
          pretitle: "Étape quatre · Où l'idée s'est répandue",
          title: "Tarski, Turing, Church, et tous les assistants de preuve depuis",
          body: "La même astuce diagonale ne cesse de réapparaître. Alfred Tarski (1933) a prouvé que la vérité en arithmétique n'est pas définissable à l'intérieur de l'arithmétique — l'indéfinissabilité de la vérité. Alan Turing (1936) a montré que le problème de l'arrêt est indécidable en diagonalisant sur les machines de Turing. Alonzo Church (1936) a prouvé que la logique du premier ordre elle-même est indécidable. Chaque résultat est, structurellement, un cousin de celui de Gödel : un système assez riche pour se décrire lui-même contient une question à laquelle il ne peut répondre sur lui-même. Les assistants de preuve modernes — Coq, Lean, Isabelle, HOL — opèrent sous les bornes de Gödel : ils peuvent mécaniser une quantité énorme de mathématiques, mais ils ne peuvent pas prouver leur propre cohérence, et il existe des énoncés concrets de théorie des nombres (le théorème de Goodstein, Paris–Harrington) qui sont vrais et démontrablement non démontrables dans l'arithmétique de Peano. Le rêve est mort ; l'édifice est plus grand que jamais.",
        },
      ],
    },
    halting: {
      pretitle: "Sujet · Calcul",
      title: "Le problème de l'arrêt",
      tagline: "Aucun programme ne peut prédire tous les autres.",
      intro:
        "Alan Turing, 1936. Étant donné un programme P et une entrée x, peut-on toujours décider si P s'arrête sur x ? Turing a répondu non — et l'a prouvé par une astuce diagonale autoréférentielle qu'aucune machine ne peut esquiver. L'Explorateur fait tourner une poignée de programmes-jouets sur un petit ruban : tu en vois certains se terminer, d'autres tourner à jamais, et un programme — le diagonal D — se replier sur lui-même pour produire la contradiction que Turing a couchée sur le papier.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La question",
          title: "Est-ce que P s'arrête sur x ?",
          body: "Étant donné le code source d'un programme P et une entrée x, décide si P finit par se terminer ou s'il tourne pour toujours. On dirait quelque chose qu'un analyseur assez malin devrait toujours pouvoir déterminer — les programmes ne sont, après tout, que des chaînes finies de symboles, et un ordinateur peut les simuler. David Hilbert, dans son Entscheidungsproblem de 1928, a réclamé exactement une telle procédure de décision universelle. Au milieu des années 1930, Alonzo Church (via le λ-calcul) et Alan Turing (via ce qu'on appelle aujourd'hui les machines de Turing) convergeaient vers la même réponse depuis des directions opposées.",
        },
        {
          pretitle: "Étape deux · La contradiction de Turing",
          title: "Suppose halts(P, x), puis construis D",
          body: "Supposons, par l'absurde, qu'il existe une fonction totale calculable halts(P, x) renvoyant ⊤ quand P s'arrête sur l'entrée x et ⊥ sinon. On peut alors écrire un nouveau programme D(P) : calcule halts(P, P) ; s'il renvoie ⊤, boucle pour toujours ; s'il renvoie ⊥, arrête-toi aussitôt. D est admissible — chacune de ses étapes est calculable par hypothèse. Maintenant la question : que renvoie halts(D, D) ? Si halts(D, D) = ⊤, alors par la définition de D le programme D boucle sur l'entrée D — donc D ne s'arrête pas sur D, ce qui contredit ⊤. Si halts(D, D) = ⊥, alors D s'arrête sur D — ce qui contredit ⊥. Aucune réponse ne tient, donc une telle fonction halts ne peut exister. (Turing 1936, « On Computable Numbers, with an Application to the Entscheidungsproblem ».)",
        },
        {
          pretitle: "Étape trois · La diagonalisation déguisée",
          title: "Cantor, Gödel, Turing — le même coup",
          body: "La même astuce alimente la diagonale de Cantor (construire un réel qui diffère du n-ième réel listé en son n-ième chiffre), le premier théorème d'incomplétude de Gödel (construire une proposition qui dit « je ne suis pas démontrable »), et l'argument de l'arrêt de Turing (construire un programme qui fait le contraire de ce que dit le décideur). Chaque construction aligne les candidats en une liste et lit le long de la diagonale pour forger un objet que la liste ne peut contenir. Le problème de l'arrêt fut le premier problème de décision concret à être prouvé indécidable — le moment où les limites du calcul sont devenues un théorème.",
        },
        {
          pretitle: "Étape quatre · Pourquoi c'est encore important",
          title: "Le théorème de Rice et ses retombées pratiques",
          body: "Le théorème de Rice (Henry Gordon Rice, 1953) généralise Turing : toute propriété sémantique non triviale des programmes — « renvoie-t-il jamais zéro ? », « fuit-il de la mémoire ? », « est-il malveillant ? » — est indécidable. Les analyseurs statiques doivent donc approcher : ils sur-signalent (faux positifs) ou sous-signalent (bugs manqués), jamais à la fois propres et complets. Les compilateurs expirent en optimisant, refusant d'inliner au-delà d'une heuristique. Les antivirus ne peuvent jamais attraper tous les malwares en général. Les autoscalers du cloud ne peuvent promettre qu'un job soumis s'arrêtera ; ils plafonnent le temps CPU à la place. Le problème de l'arrêt n'est pas une curiosité — c'est le mur sur lequel tout programme-sur-les-programmes finit par buter.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Sujet · Calcul",
      title: "P contre NP",
      tagline: "La plus grande question ouverte de l'informatique.",
      intro:
        "Certains problèmes sont faciles à résoudre. D'autres sont faciles à vérifier une fois qu'on te tend la réponse. P contre NP demande si ces deux classes sont en secret la même — et un oui ferait voler en éclats la cryptographie moderne. L'Explorateur est un petit solveur 3-SAT qui te laisse voir pourquoi la vérification est triviale mais la recherche, brutale : dépose une formule, puis suis DPLL le long de l'arbre de retour arrière à mesure qu'il essaie des affectations et élague des branches entières d'une seule contradiction.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Deux classes de problèmes",
          title: "Solubles vite contre vérifiables vite",
          body: "P est la classe des problèmes de décision qu'une machine déterministe peut résoudre en temps polynomial — multiplier deux nombres, trier une liste, vérifier si un graphe est connexe. NP est la classe pour laquelle, étant donné une solution candidate, une machine polynomiale peut vérifier que la réponse est correcte. Les deux ne sont pas évidemment identiques. Le Sudoku est l'exemple canonique : remplir une grille 9×9 est véritablement difficile, mais si un ami te tend une grille complétée, tu peux confirmer chaque ligne, chaque colonne et chaque case en un seul balayage linéaire. La partie difficile, c'est trouver la solution ; la partie facile, c'est la vérifier.",
        },
        {
          pretitle: "Étape deux · La NP-complétude",
          title: "Cook 1971, Karp 1972, Levin indépendamment",
          body: "En 1971, Stephen Cook a prouvé le théorème de Cook-Levin : tout problème dans NP se réduit en temps polynomial à la satisfiabilité booléenne (SAT). Leonid Levin a publié le même résultat indépendamment en Union soviétique. Un an plus tard, Richard Karp a montré que 21 problèmes classiques — 3-SAT, le chemin hamiltonien, la clique, la somme de sous-ensembles, la version décisionnelle du voyageur de commerce — sont tous interréductibles en temps polynomial. Aujourd'hui, la liste se compte en milliers : Sudoku N×N, Tetris, le démineur généralisé, et même les modèles en treillis du repliement des protéines appartiennent tous à la même classe d'équivalence. Résous-en un efficacement et tu les as tous résolus. Les réductions de Cook-Karp-Levin ont transformé une question sur un problème en une question sur tous les problèmes de recherche intéressants à la fois.",
        },
        {
          pretitle: "Étape trois · Et si P = NP ?",
          title: "La cryptographie tombe, la biologie plie, l'univers devient ennuyeux",
          body: "Un algorithme polynomial pour 3-SAT se composerait avec les réductions de Karp pour briser RSA (la factorisation devient faisable), casser la cryptographie sur courbes elliptiques, déchiffrer toutes les sessions TLS jamais enregistrées, et forger toute signature numérique. Le repliement des protéines se réduirait à une consultation polynomiale. L'ordonnancement optimal, l'allocation optimale de registres dans les compilateurs, la planification d'itinéraires optimale — tous les problèmes NP-difficiles que les ingénieurs approchent aujourd'hui — auraient des solutions polynomiales exactes. La plupart des informaticiens parient contre : le sondage de Scott Aaronson dans la discipline donne >80 % à P ≠ NP. Mais ni preuve ni réfutation n'existe. L'inclusion que l'on connaît est P ⊆ NP ⊆ PSPACE ⊆ EXP, avec P ⊊ EXP prouvée par le théorème de hiérarchie temporelle — donc au moins une de ces inclusions est stricte, mais personne ne sait laquelle.",
        },
        {
          pretitle: "Étape quatre · Le prix d'un million de dollars",
          title: "Problème du millénaire de Clay, 2000",
          body: "Le Clay Mathematics Institute a nommé P contre NP l'un des sept Problèmes du Prix du Millénaire en mai 2000, avec une récompense de 1 000 000 $ pour une résolution correcte dans un sens ou l'autre. C'est le seul des sept qui touche directement la technologie quotidienne. Des dizaines de fausses preuves circulent chaque année — l'annonce de Vinay Deolalikar en 2010 fut la tentative récente la plus médiatique et s'est défaite en quelques semaines. L'attente partagée dans la communauté est que la réponse soit P ≠ NP. La question non résolue n'est pas quelle est la réponse, mais pourquoi — et quel fragment des mathématiques contiendra la bonne technique de borne inférieure. Plus de quarante ans de barrières (relativisation, preuves naturelles, algébrisation) disent qu'elle ne viendra d'aucune méthode que nous connaissons aujourd'hui.",
        },
      ],
    },
    rsa: {
      pretitle: "Sujet · Calcul",
      title: "RSA et fonctions à sens unique",
      tagline: "Multiplier est facile. Factoriser est impossible.",
      intro:
        "Rivest, Shamir et Adleman, 1977 — le premier cryptosystème à clé publique publié et encore, près d'un demi-siècle plus tard, celui qui sécurise l'essentiel de l'internet en marche. L'Explorateur déroule une génération de clés, un chiffrement et un déchiffrement RSA complets sur de petits nombres pour que tu voies chaque étape : choisis des premiers, dérive les exposants public et privé, puis chiffre un message et regarde la même mathématique le rouvrir.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'asymétrie",
          title: "Fonctions à sens unique : faciles en avant, dures en arrière",
          body: "Multiplier deux grands premiers p et q est rapide — quelques millisecondes sur un téléphone. Récupérer p et q à partir de leur produit n = p · q ne l'est pas : le meilleur algorithme classique connu (le crible général de corps de nombres) s'exécute en temps sous-exponentiel mais super-polynomial, et un n de 2048 bits est confortablement hors d'atteinte de toute machine jamais construite. Cette propriété à sens unique — bon marché en avant, ruineusement chère en arrière — est le fondement de la cryptographie à clé publique. RSA habille cette asymétrie pour qu'une clé publique puisse être tendue à n'importe qui et que seul le détenteur de la clé privée correspondante puisse lire ce qu'on lui a écrit en retour.",
        },
        {
          pretitle: "Étape deux · Génération des clés",
          title: "Choisis e, dérive d par l'algorithme d'Euclide étendu",
          body: "Calcule φ(n) = (p − 1)(q − 1), l'indicatrice d'Euler — le nombre d'entiers de [1, n] premiers avec n. Choisis un petit exposant public e premier avec φ(n) ; 65537 est le choix canonique parce qu'il est premier, n'a que deux bits à 1, et survit à toutes les attaques connues à petit exposant. Calcule ensuite l'exposant privé d = e⁻¹ mod φ(n) à l'aide de l'algorithme d'Euclide étendu : il renvoie les coefficients de Bézout (x, y) avec e·x + φ(n)·y = 1, et réduire x mod φ(n) donne d. La clé publique est le couple (n, e) ; la clé privée est (n, d). Une fois d en main, jette p et q.",
        },
        {
          pretitle: "Étape trois · Chiffrer et déchiffrer",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Considère le texte clair m comme un entier dans [0, n). Le chiffré est c = m^e mod n ; le déchiffrement est m = c^d mod n. La raison pour laquelle cela marche vient directement d'Euler et de Fermat : parce que ed ≡ 1 mod φ(n), on a m^(ed) = m^(1 + kφ(n)) ≡ m mod n pour tout m premier avec n (théorème d'Euler), et un court argument à l'aide du théorème des restes chinois étend l'identité à tout m dans [0, n). L'élévation au carré et la multiplication ramènent les exposants gigantesques à quelques milliers de multiplications modulaires — rapide en pratique, mathématiquement exact.",
        },
        {
          pretitle: "Étape quatre · Où en est-on aujourd'hui",
          title: "De TLS à la migration post-quantique",
          body: "RSA, c'est la mathématique sous chaque poignée de main TLS que ton navigateur négocie encore avec un certificat RSA, sous les clés d'hôte SSH, sous les chaînes de signature de code qui authentifient les apps d'Apple et de Google, sous les passeports électroniques et les premières générations de blockchain. Mais en 1994, Peter Shor a écrit un algorithme quantique qui factorise les entiers en temps polynomial — étant donné un ordinateur quantique tolérant aux fautes suffisamment grand, RSA se brise. Aucun n'existe encore, mais le calendrier est assez incertain pour que le NIST ait normalisé des remplaçants post-quantiques (CRYSTALS-Kyber pour l'échange de clés en 2024, CRYSTALS-Dilithium pour les signatures) et la migration mondiale est déjà en cours.",
        },
      ],
    },
    mobius: {
      pretitle: "Sujet · Géométrie",
      title: "Ruban de Möbius et bouteille de Klein",
      tagline: "Des surfaces à un seul côté.",
      intro:
        "Prends une bande de papier, donne-lui un demi-tour, recolle les extrémités — et tu obtiens une surface à un seul côté et à un seul bord. L'Explorateur affiche un ruban de Möbius 3D en rotation que tu peux découper selon différents ratios pour voir ce qu'il en sort : coupe-le par le milieu et il reste d'un seul tenant ; coupe-le au tiers et tu obtiens deux anneaux entrelacés. Un bouton bascule vers la bouteille de Klein, l'analogue fermé qui a besoin de quatre dimensions pour vivre sans se croiser.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Le demi-tour",
          title: "Recoller les extrémités avec un retournement",
          body: "Prends une bande de papier rectangulaire. Donne à une extrémité un demi-tour (180°) avant de la coller à l'autre. Le résultat a un seul bord et un seul côté. Promène un stylo le long de la bande et tu couvres ce qui ressemble aux deux « faces » sans jamais traverser la frontière ; trace le pourtour et tu reviens à ton point de départ après avoir fait deux fois le tour. Découvert indépendamment par August Ferdinand Möbius et Johann Benedict Listing en 1858 — la première surface non orientable jamais explicitement décrite. Sa caractéristique d'Euler est χ = 0.",
        },
        {
          pretitle: "Étape deux · Les surprises du ciseau",
          title: "Ce que les ciseaux révèlent sur la topologie",
          body: "Coupe le ruban de Möbius par le milieu. Il ne tombe pas en morceaux — tu obtiens une bande plus longue avec deux tours complets (quatre demi-tours), et surtout cette bande est de nouveau à deux côtés. Coupe un ruban de Möbius à un tiers de la distance d'un bord, en gardant la coupe parallèle au bord tout du long, et les ciseaux font deux fois le tour avant de refermer la boucle : il en sort deux anneaux entrelacés, l'un un nouveau ruban de Möbius, l'autre un ruban plus long de style Möbius avec des torsions supplémentaires, enlacés l'un dans l'autre. La topologie regorge de ces surprises — la torsion globale cachée par la planéité locale.",
        },
        {
          pretitle: "Étape trois · La bouteille de Klein",
          title: "Felix Klein, 1882",
          body: "Prends maintenant un tube et recolle une extrémité à l'autre après l'avoir fait passer à travers la paroi du tube — en faisant correspondre les cercles avec des orientations opposées. Dans l'espace à quatre dimensions, c'est une surface fermée, non orientable, parfaitement lisse : pas de bord, pas d'intérieur, pas d'extérieur. Felix Klein l'a décrite en 1882. En trois dimensions, le passage force le tube à se traverser lui-même, de sorte que toute bouteille de Klein en verre que tu as jamais vue est une immersion, pas un vrai plongement. Recolle deux rubans de Möbius le long de leur unique bord, et le résultat est exactement une bouteille de Klein.",
        },
        {
          pretitle: "Étape quatre · Où elles vivent",
          title: "Des courroies de transmission à la chimie",
          body: "Les rubans de Möbius apparaissent comme courroies de transport et d'imprimante (l'usure se répartit sur toute la surface, doublant la durée de vie), comme les sculptures Endless Ribbon de Max Bill, comme des résistances de Möbius qui annulent leur propre auto-inductance, comme des guides d'ondes micro-ondes de Möbius supraconducteurs — et, depuis 2003, comme des molécules aromatiques de Möbius synthétisées par Rainer Herges. Le triangle familier du recyclage est, à strictement parler, un nœud de trèfle plutôt qu'un ruban de Möbius, mais le public le lit comme tel. Surtout, le ruban de Möbius et la bouteille de Klein sont les portes d'entrée vers la classification des surfaces — le théorème selon lequel toute surface fermée est déterminée à homéomorphisme près par son genre, son orientabilité et un seul entier χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Sujet · Géométrie",
      title: "Caractéristique d'Euler",
      tagline: "V − E + F = 2, quelle que soit la forme.",
      intro:
        "Descartes l'a écrite en 1639 et Euler l'a redécouverte un siècle plus tard : compte les sommets, les arêtes et les faces de n'importe quel polyèdre convexe et V − E + F vaut toujours 2. L'Explorateur parcourt les solides platoniciens et archimédiens et fait le compte V, E, F en direct — tu vois la formule tenir, du cube au dodécaèdre au ballon de football. Puis cintre la surface autour d'un beignet et regarde la constante changer.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · Compter sommets, arêtes, faces",
          title: "La constante qui refuse de bouger",
          body: "Prends un cube : 8 sommets, 12 arêtes, 6 faces. Soustrais et ajoute : 8 − 12 + 6 = 2. Essaie un tétraèdre : 4 − 6 + 4 = 2. Le ballon de football — un icosaèdre tronqué, douze pentagones et vingt hexagones cousus le long de leurs arêtes — a 60 sommets, 90 arêtes, 32 faces, et 60 − 90 + 32 = 2, une fois encore. Parcours tous les solides platoniciens et archimédiens que les Grecs ont jamais dessinés, et la réponse est la même. La constante n'est pas une coïncidence.",
        },
        {
          pretitle: "Étape deux · Topologie, pas géométrie",
          title: "Presse le cube jusqu'à en faire une sphère",
          body: "Gonfle le cube jusqu'à ce qu'il s'arrondisse en une sphère parfaite. Les coins s'adoucissent, les arêtes droites se courbent, les faces planes se bombent — V − E + F vaut toujours 2. Il en va de même si tu l'écrases en crêpe, le tords en œuf, ou le tires en n'importe quelle forme, tant que tu ne déchires, ne recolles ni ne perces de trou. Le nombre ne dépend que de la topologie. χ = 2 pour toute forme topologiquement équivalente à une sphère — pour la surface de tout polyèdre convexe, de tout ovoïde lisse, de toute pomme de terre.",
        },
        {
          pretitle: "Étape trois · Les trous la font chuter",
          title: "Chaque anse te coûte deux",
          body: "Enveloppe maintenant la surface autour d'un beignet. Triangule le tore comme tu veux — V − E + F tombe à 0. Un double tore, deux beignets recollés côte à côte, donne χ = −2. La règle est χ = 2 − 2g, où g est le nombre de trous (le genre). Chaque anse que tu couds te coûte 2. La caractéristique d'Euler mesure la topologie en un seul entier : elle te dit combien de trous a une surface fermée, peu importe comment elle est dessinée ou étirée.",
        },
        {
          pretitle: "Étape quatre · Pourquoi c'est important",
          title: "Du ballon de football à la médaille Fields",
          body: "La chimie des fullerènes est imposée par χ : toute cage de fullerène bâtie à partir de pentagones et d'hexagones doit contenir exactement 12 pentagones, parce que la caractéristique d'Euler d'une sphère est 2. Les dômes géodésiques de Buckminster Fuller suivent la même règle. Les slicers d'impression 3D utilisent V − E + F pour vérifier qu'un maillage est fermé et imprimable. Gauss-Bonnet relie la courbure totale d'une surface lisse à 2π·χ, liant la géométrie à la topologie en une seule équation. Le théorème d'indice d'Atiyah-Singer (médaille Fields 1966) est le descendant moderne de la même idée — et Preuves et réfutations de Lakatos retrace les deux siècles de cas limites qui ont failli briser V − E + F = 2 avant de la renforcer.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Sujet · Analyse",
      title: "Les ponts de Königsberg",
      tagline: "Sept ponts, une promenade impossible.",
      intro:
        "Pourrais-tu traverser Königsberg, franchir chaque pont exactement une fois et revenir à ton point de départ ? L'Explorateur te laisse tenter la promenade toi-même, voir l'argument de parité en direct à chaque pont traversé, et ajouter ou retirer des ponts pour rendre la promenade possible.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'énigme",
          title: "Une promenade que personne ne trouvait",
          body: "Königsberg enjambait la Pregel avec deux îles et deux rives — quatre masses de terre au total — reliées par sept ponts. Les habitants posaient une question de promenade dominicale : pourrais-tu faire une promenade à travers la ville qui franchisse chaque pont exactement une fois et qui se termine là où elle a commencé ? Tout le monde a essayé. Tout le monde a échoué. Personne ne pouvait prouver que c'était impossible.",
        },
        {
          pretitle: "Étape deux · La réduction d'Euler",
          title: "La géométrie devient topologie",
          body: "En 1736, Leonhard Euler a fait ce que personne n'avait fait avant lui. Il a ignoré les distances. Il a ignoré les angles. Il a ignoré quel pont était en amont de quel autre. Il a dessiné les quatre masses de terre comme quatre points et les sept ponts comme sept arêtes. La carte est devenue un graphe. Le problème de position — geometria situs — venait de naître, et avec lui la théorie des graphes et la topologie.",
        },
        {
          pretitle: "Étape trois · L'argument de parité",
          title: "Chaque masse de terre a besoin d'un compte pair",
          body: "Chaque fois que tu entres sur une masse de terre, tu empruntes un pont ; quand tu en sors, tu en empruntes un autre. Chaque masse de terre a donc besoin d'un nombre pair de ponts incidents — sauf, éventuellement, le départ et l'arrivée de la promenade. Königsberg avait quatre masses de terre, toutes dotées d'un nombre impair de ponts. Quatre sommets de degré impair, c'est deux de trop. Impossible.",
        },
        {
          pretitle: "Étape quatre · La naissance de la théorie des graphes",
          title: "D'une promenade dominicale au monde moderne",
          body: "Le même argument de parité alimente aujourd'hui le routage GPS, le problème du postier chinois (utilisé pour optimiser les tournées des chasse-neige, des camions à ordures et des facteurs) et l'assemblage de l'ADN — tout assembleur de génome moderne parcourt un chemin eulérien à travers un graphe de de Bruijn. La Seconde Guerre mondiale a détruit deux des ponts de Königsberg ; seuls cinq des sept d'origine subsistent. Le graphe actuel a exactement deux sommets de degré impair, si bien qu'aujourd'hui la promenade est enfin possible — sauf qu'Euler n'est plus là pour la faire.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Sujet · Analyse",
      title: "Le théorème des quatre couleurs",
      tagline: "Toute carte plane se contente de quatre couleurs.",
      intro:
        "Toute carte tracée sur le plan peut être coloriée avec au plus quatre couleurs de sorte que deux régions partageant une frontière n'aient jamais la même couleur. L'Explorateur te laisse construire des cartes et regarder un algorithme de coloriage avec retour arrière attribuer au plus quatre couleurs — région après région, en choisissant à chaque fois la plus petite valeur valable.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · La conjecture",
          title: "Francis Guthrie, 1852",
          body: "En coloriant une carte des comtés d'Angleterre, le jeune Francis Guthrie remarqua que quatre couleurs semblaient toujours suffire. Il en parla à son frère Frederick, qui en parla à leur professeur Augustus De Morgan, qui en parla à tout le monde. La conjecture avait l'air inoffensive — et elle a tenu les mathématiciens en échec pendant 124 ans. Plusieurs preuves publiées (Kempe 1879, Tait 1880) se sont révélées contenir des lacunes subtiles que personne n'a repérées avant plus d'une décennie.",
        },
        {
          pretitle: "Étape deux · Pourquoi trois ne suffisent pas, cinq sont de trop",
          title: "Quatre est la borne exacte",
          body: "Trois couleurs ne suffisent manifestement pas — quatre régions mutuellement adjacentes peuvent déjà être tracées dans le plan (pense à trois pays se rejoignant en un coin avec un quatrième les entourant). Le théorème des cinq couleurs, dû à Heawood en 1890, se démontre en une page avec la formule d'Euler V − E + F = 2 et un argument soigné sur les degrés. Combler l'écart de cinq à quatre, c'est ce qui a pris encore quatre-vingt-six ans.",
        },
        {
          pretitle: "Étape trois · La preuve d'Appel et Haken, 1976",
          title: "Le premier théorème prouvé par ordinateur",
          body: "Kenneth Appel et Wolfgang Haken, à l'université de l'Illinois, ont réduit le problème à une liste finie de 1834 « configurations inévitables » — puis ont montré que chacune est réductible. Leur preuve a tourné sur un IBM 360 pendant environ 1200 heures. De nombreux mathématiciens ont refusé de l'accepter : une preuve qu'un humain ne peut lire dans son intégralité, soutenaient-ils, n'est pas une preuve. Le courrier sortant du département de mathématiques de l'université de l'Illinois fut affranchi de « Four Colors Suffice » pendant des années.",
        },
        {
          pretitle: "Étape quatre · Où en est-on",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier, et au-delà",
          body: "En 1996, Robertson, Sanders, Seymour et Thomas ont simplifié la preuve à 633 configurations et un argument de décharge plus propre. En 2005, Georges Gonthier a mécanisé l'intégralité de la preuve dans l'assistant de preuve Coq — chaque étape logique, analyse de cas comprise, vérifiée par la machine de bout en bout. Le théorème alimente aujourd'hui l'attribution de fréquences dans les réseaux cellulaires, l'allocation des registres dans les compilateurs, et les problèmes d'ordonnancement et d'emplois du temps partout où les conflits forment un graphe planaire.",
        },
      ],
    },
    smallworld: {
      pretitle: "Sujet · Analyse",
      title: "Six degrés et petits mondes",
      tagline: "Deux personnes, séparées par six poignées de main.",
      intro:
        "Stanley Milgram a envoyé des lettres à des inconnus et a découvert qu'en moyenne, six transferts suffisaient pour les faire traverser l'Amérique. Quarante ans plus tard, Watts et Strogatz ont montré pourquoi : une pincée de raccourcis aléatoires sur un réseau par ailleurs régulier fait s'effondrer la longueur de chemin moyenne sans toucher au regroupement local. L'Explorateur te permet d'ajuster la probabilité de recâblage de Watts-Strogatz p et de regarder la longueur de chemin moyenne L s'effondrer en temps réel.",
      ctaInteractive: "→ Ouvrir l'Explorateur",
      sections: [
        {
          pretitle: "Étape un · L'expérience des lettres",
          title: "Milgram, 1967",
          body: "Stanley Milgram, alors à Harvard, a envoyé des lettres à des gens au hasard à Omaha et Wichita en leur demandant de la faire suivre, de la main à la main, jusqu'à un agent de change cible à Boston — mais uniquement par l'intermédiaire d'une personne qu'ils connaissaient personnellement par son prénom. La plupart des lettres ne sont jamais arrivées. Celles qui y sont parvenues comptaient en moyenne environ six maillons de l'expéditeur à la cible. La formule devenue de pop-culture « six degrés de séparation » était née. Le raccourci : la société a des plaques tournantes, et ce sont elles qui font l'essentiel du routage.",
        },
        {
          pretitle: "Étape deux · Watts et Strogatz, 1998",
          title: "Recâbler avec probabilité p",
          body: "Pars d'un anneau en treillis : N nœuds sur un cercle, chacun relié à ses k plus proches voisins de chaque côté. Le graphe a un fort regroupement C — tes amis sont amis entre eux — mais une longue longueur de chemin moyenne L de l'ordre de N/k. Recâble maintenant chaque arête avec probabilité p vers une destination aléatoire. À mesure que p grimpe à partir de 0, L s'effondre logarithmiquement tandis que C bouge à peine. Quelques raccourcis aléatoires rétrécissent le monde. Le point idéal, autour de p ≈ 0,01 à 0,1, est le régime du petit monde : C élevé comme un treillis, L bas comme un graphe aléatoire.",
        },
        {
          pretitle: "Étape trois · Où le monde est vraiment petit",
          title: "Films, cerveaux, réseaux électriques, le web",
          body: "Les graphes de collaboration académique nous ont donné le nombre d'Erdős ; Hollywood nous a donné le nombre de Bacon (le jeu des « Six degrés de Kevin Bacon »). Le ver C. elegans a un cerveau de 302 neurones parfaitement cartographié avec une connectivité de petit monde ; les connectomes humains montrent la même signature à une échelle bien plus grande. Réseaux électriques, Internet, réseaux de citations, graphe des liens de Wikipédia, réseaux d'interactions protéiques — le régime du petit monde réapparaît partout où l'on prend la peine de mesurer L et C. Le monde est petit, structurellement, presque partout.",
        },
        {
          pretitle: "Étape quatre · Conséquences",
          title: "Diffusion rapide, recherche maligne, cerveaux malades",
          body: "Sur les réseaux à petit monde, virus, rumeurs et idées atteignent tout le monde rapidement — magnifique pour la diffusion de l'innovation, terrible en pandémie. Kleinberg (2000) a prouvé que la recherche gloutonne décentralisée ne réussit dans les petits mondes que lorsque la distribution des raccourcis a le bon exposant, ce qui explique pourquoi les transmetteurs de lettres de Milgram parvenaient effectivement à trouver la cible. Et la neurologie clinique utilise aujourd'hui les coefficients de petit monde (σ, ω) comme biomarqueurs : Alzheimer et schizophrénie montrent toutes deux des écarts mesurables par rapport à la signature saine du petit monde.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Essaie maintenant.",
    readyToFly: "Prêt à t'envoler ?",
    yourTurn: "À toi.",
    stepIntoIt: "Entres-y.",
    buildWithOne: "Construis avec une seule pierre.",
  },
};
