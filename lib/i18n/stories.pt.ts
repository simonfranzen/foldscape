import type { StoriesDict } from "./stories";

export const pt: StoriesDict = {
  sectionLabels: {
    cathedral: "Catedral",
    atelier: "Atelier",
    resonance: "Ressonância",
    story: "História",
    explorer: "Explorador",
    sandbox: "Sandbox",
    sound: "Som",
  },
  pages: {
    mandelbrot: {
      pretitle: "Tópico II · Caos",
      title: "O Conjunto de Mandelbrot",
      tagline: "Eleva ao quadrado e soma. Para sempre.",
      intro:
        "Um dos objetos mais fotografados da matemática é a visualização de uma regra absurdamente simples. Em baixo: qual é a regra, o que estamos realmente a ver, e um botão direto para o Explorador para quando quiseres voar.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A regra",
          title: "Escolhe um número complexo, depois itera",
          body: "Escolhe qualquer número complexo c. Começa uma sequência em z₀ = 0 e continua a aplicar zₙ₊₁ = zₙ² + c. Esta é a regra inteira. Depois fazemos uma única pergunta de sim/não: a sequência mantém-se limitada, ou acaba por escapar para o infinito? O conjunto dos valores de c para os quais a sequência se mantém limitada — esse é o conjunto de Mandelbrot. Tudo o resto, incluindo a imagem famosa, é apenas uma resposta colorida a essa pergunta.",
        },
        {
          pretitle: "Passo dois · Observar a órbita",
          title: "Três pontos, três destinos",
          body: "Ajuda ver realmente a sequência a evoluir. Para um c bem dentro do conjunto, a órbita aperta-se em torno de um pequeno laço e nunca sai dele. Para um c logo a seguir ao limite, a órbita afasta-se e explode em poucos passos. Para um c mesmo sobre a fronteira, a órbita dança eternamente, sem nunca assentar nem escapar. Os três painéis animados em baixo mostram esses três regimes lado a lado.",
        },
        {
          pretitle: "Passo três · Porque a imagem é infinita",
          title: "A fronteira nunca se simplifica",
          body: "Quando coloras cada c segundo a rapidez com que a sua órbita escapa, a fronteira ilumina-se. O facto espantoso, demonstrado por Tan Lei e outros, é que a fronteira é autossemelhante num sentido profundo — onde quer que faças zoom, encontras novas cópias minúsculas da forma inteira, rodeadas por filigranas que nunca se repetem. É por isso que o Explorador desce até 10¹⁰ de zoom: há genuinamente algo novo em cada escala.",
        },
        {
          pretitle: "Passo quatro · Os pontos fixos",
          title: "Onde a matemática se esconde",
          body: "Dentro da grande cardioide central, a iteração converge para um único ponto fixo. Dentro de cada disco redondo agarrado a ela, a iteração converge para um 2-ciclo, depois um 4-ciclo, depois um de 8 — a mesma cascata de duplicação de período que a aplicação logística. O conjunto de Mandelbrot é, num sentido preciso, um mapa de onde a história logística está calma e de onde mergulha no caos. Dois sistemas caóticos célebres, uma só imagem.",
        },
      ],
    },
    life: {
      pretitle: "Tópico III · Computação",
      title: "O Jogo da Vida de Conway",
      tagline: "Quatro regras. Universos seguem.",
      intro:
        "Conway publicou as regras em 1970 numa coluna da Scientific American. Duas páginas de revista, quatro linhas de regra, e uma comunidade de matemáticos passou cinquenta anos a descobrir o que já estava lá dentro. A Sandbox permite-te desenhar e correr qualquer padrão — mas primeiro, as quatro regras em ação.",
      ctaInteractive: "→ Abrir a Sandbox",
      sections: [
        {
          pretitle: "Passo um · As regras",
          title: "Nascimento, sobrevivência, morte — e mais nada",
          body: "A grelha é infinita, cada célula está viva ou morta, e cada célula olha para os seus oito vizinhos. Se uma célula morta estiver rodeada por exatamente três vizinhos vivos, acende-se; se uma célula viva já tiver dois ou três à volta, transita inteira para o passo seguinte. Qualquer outro caso — vizinhos a menos, vizinhos a mais, vizinhos nenhuns — mata a célula. As quatro demonstrações animadas em baixo mostram cada regra a disparar numa grelha cinco por cinco.",
        },
        {
          pretitle: "Passo dois · Das regras ao movimento",
          title: "O Planador caminha",
          body: "Um padrão de cinco células, o Planador, é a coisa móvel mais pequena em Life. Observa-o avançar. Após quatro gerações regressou à sua forma original, mas deslocado uma célula na diagonal. É assim que o movimento funciona num mundo sem conceito de movimento: uma forma que, após algumas aplicações das regras, é igual a si própria noutro sítio.",
        },
        {
          pretitle: "Passo três · Do movimento à computação",
          title: "Planadores transportam informação",
          body: "Se um planador se move, pode ser apontado. Se pode ser apontado, pode colidir com outros planadores. A partir de colisões podes construir AND, OR, NOT — e a partir desses, qualquer circuito booleano. Foram construídas máquinas de Turing, simuladores do próprio Game of Life e computadores programáveis inteiros, apenas com planadores cuidadosamente arranjados. A Sandbox traz o preset Gosper Glider Gun: um padrão que dispara um planador a cada trinta gerações, para sempre.",
        },
        {
          pretitle: "Passo quatro · O que isto nos diz",
          title: "Complexidade não exige regras complexas",
          body: "A afirmação mais profunda é filosófica. Life mostra que estrutura elaborada — movimento, replicação, computação, até consciência, se acreditares nas versões fortes — pode caber dentro de uma regra suficientemente pequena para se escrever num postal. É a mesma lição que EML oferece à análise, que NAND oferece à lógica e que a Regra 110 oferece aos autómatos celulares. Uma primitiva pequena, aplicada com disciplina, é suficiente.",
        },
      ],
    },
    nand: {
      pretitle: "Tópico · Lógica",
      title: "O Traço de Sheffer",
      tagline: "Uma porta basta para toda a lógica digital.",
      intro:
        "A porta NAND é o hardware de computador mais simples que cabe na tua cabeça. O Construtor permite-te alternar entre portas e ver o seu esqueleto em NAND atualizar em tempo real.",
      ctaInteractive: "→ Abrir o Construtor",
      sections: [
        {
          pretitle: "Passo um · A porta",
          title: "Quatro linhas, assentes em 1913",
          body: "O traço de Henry Sheffer (a ↑ b) é a negação do AND. Devolve 1 a menos que ambas as entradas sejam 1. O artigo de Sheffer de 1913 mostrou que este único operador — em conjunto com constantes e variáveis — consegue exprimir qualquer proposição da lógica booleana clássica. Charles Sanders Peirce já tinha notado discretamente o mesmo facto num manuscrito não publicado trinta anos antes; ambos chegaram ao resultado independentemente.",
        },
        {
          pretitle: "Passo dois · Construir tudo o resto",
          title: "A mesma pedra, muitas formas",
          body: "O truque é a composição. Alimenta a saída de um NAND para outro NAND, por vezes ligando uma cópia de uma entrada a si mesma, e as quatro portas clássicas caem quase imediatamente. NOT é um NAND. AND são dois. OR são três. XOR são quatro. Qualquer outra expressão booleana pode então ser montada a partir destas.",
        },
        {
          pretitle: "Passo três · Porque os chips se importam",
          title: "Um mar de NANDs em silício",
          body: "Os transístores CMOS implementam NAND com quatro transístores — menos do que AND ou OR. Como qualquer expressão booleana se reduz a NANDs, os projetistas de chips sintetizam frequentemente um circuito inteiro só com isto: uma fila de células NAND idênticas, ligadas em somadores, multiplexadores, memória, e por fim numa CPU. Todo o computador moderno é, fisicamente, o traço de Sheffer iterado uns biliões de vezes.",
        },
        {
          pretitle: "Passo quatro · O outro lado",
          title: "NAND ganhou o chip, NOR ganhou a Lua",
          body: "NOR (¬(a ∨ b)) é a outra porta única funcionalmente completa. O Apollo Guidance Computer que levou humanos à Lua foi construído inteiramente com portas NOR. NAND ganhou a corrida dos chips de consumo; NOR ganhou a Lua. Duas maneiras de construir um universo — escolhe um lado.",
        },
      ],
    },
    iota: {
      pretitle: "Tópico · Computação",
      title: "O Combinador Iota",
      tagline: "Um símbolo, Turing-completo.",
      intro:
        "Iota é a base de combinador único mais simples conhecida: uma única regra de reescrita a partir da qual toda função computável segue. O Redutor lê qualquer expressão SKI ou Iota e reescreve-a, passo a passo, até à sua forma normal.",
      ctaInteractive: "→ Abrir o Redutor",
      sections: [
        {
          pretitle: "Passo um · Lógica combinatória",
          title: "Duas letras que computam tudo",
          body: "Na década de 1920, Moses Schönfinkel e Haskell Curry mostraram que toda a computação podia ser construída a partir de duas pequenas regras. Chama-lhes S e K. Recebem outras coisas como entrada e rearranjam-nas — sem necessidade de variáveis. Em conjunto formam o cálculo combinatório SKI, demonstravelmente tão poderoso quanto qualquer cálculo lambda, qualquer linguagem de programação, qualquer máquina de Turing.",
        },
        {
          pretitle: "Passo dois · Um símbolo",
          title: "O Iota de Chris Barker",
          body: "Em 2001, Chris Barker descobriu um único combinador que contém tanto S como K. Chamou-lhe Iota (ι, ℩) e definiu-o como ι x = x S K. A partir dessa única linha, S e K podem ser ambos rederivados. Aplica Iota a Iota num padrão específico e S cai. Um padrão diferente dá K. Sem mais nada além do símbolo ι e parênteses, qualquer função computável pode ser expressa.",
        },
        {
          pretitle: "Passo três · A forma de uma demonstração",
          title: "Universalidade num único símbolo",
          body: "O argumento é curto. A definição de Iota dá x S K quando aplicada a x. Escolhe x com astúcia — Iota outra vez, aplicado a Iota, aplicado a Iota — e o desenrolar retira camadas até restar apenas K. Outro padrão, e resta apenas S. Como S e K em conjunto são Turing-completos (Schönfinkel, 1924), e Iota produz ambos, Iota sozinho também tem de ser.",
        },
        {
          pretitle: "Passo quatro · Porque importa",
          title: "Um recibo filosófico",
          body: "Iota não produz programas rápidos nem legíveis — produz provas de existência. Qualquer algoritmo que possa ser escrito em qualquer linguagem pode ser codificado como expressão Iota. O Redutor na sala ao lado deixa-te escrever uma expressão e ver-la reescrever, passo a passo, até à sua forma normal (quando existe). É a computação na sua forma mais despida: um único símbolo, uma única regra, toda a matemática.",
        },
      ],
    },
    rule110: {
      pretitle: "Tópico · Computação",
      title: "Regra 110",
      tagline: "Uma regra de oito bits, demonstravelmente universal.",
      intro:
        "Um byte de regra, aplicado a uma fila de bits, basta para codificar qualquer computação. O Simulador permite-te alterar a regra, a semente e a velocidade em tempo real.",
      ctaInteractive: "→ Abrir o Simulador",
      sections: [
        {
          pretitle: "Passo um · O cenário",
          title: "Uma fila de células, uma regra, repetir",
          body: "Um autómato celular elementar corre numa fila de células, cada uma preta ou branca. A geração seguinte é desenhada por baixo: cada célula olha para si própria e para os seus dois vizinhos imediatos — três células — e decide a sua cor segundo uma regra fixa. Oito padrões possíveis de vizinhança; para cada um, uma resposta de um bit. Oito bits = um byte = uma de 256 regras possíveis. Stephen Wolfram numerou-as de 0 a 255 em binário.",
        },
        {
          pretitle: "Passo dois · Ler a regra 110",
          title: "Oito padrões, um byte",
          body: "Escreve os oito padrões de três células em ordem binária decrescente: 111, 110, 101, …, 000. Por baixo de cada padrão, escreve o valor da geração seguinte para a célula do meio. Lê a fila de respostas como um único número binário — para a regra 110 dá 01101110, que é 110 em decimal. A regra é precisamente esse byte.",
        },
        {
          pretitle: "Passo três · Um pixel cria um universo",
          title: "Começa com um único ponto",
          body: "Inicia a linha de topo com uma única célula preta, e tudo o resto branco. Aplica a regra; desenha a geração seguinte por baixo. Repete por algumas centenas de linhas. Com a regra 110 o resultado não é o aborrecido tudo-preto/tudo-branco de regras como 0 ou 255, nem o Sierpiński simples da regra 90 — é um tráfego permanente de planadores triangulares contra um fundo às riscas, estratificado em algo que genuinamente nunca assenta.",
        },
        {
          pretitle: "Passo quatro · A prova de Cook",
          title: "É, demonstravelmente, um computador",
          body: "No final da década de 1990, Matthew Cook mostrou como organizar padrões específicos de planadores na regra 110 para que as suas colisões funcionem como portas lógicas — e depois como montar um sistema de tag cíclico funcional, que é por si só Turing-completo. A prova é intrincada, mas a consequência é limpa: esta regra de oito bits, aplicada a uma fila de bits, é universal. Qualquer computação que possas fazer, podes fazê-la na regra 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Tópico · Caos",
      title: "A Aplicação Logística",
      tagline: "Uma fórmula inocente onde a ordem tomba no caos.",
      intro:
        "Um modelo de bolso para a população do próximo ano que, com um único botão a rodar, se torna na peça de caos mais estudada da matemática. O Explorador deixa-te rodar esse botão em tempo real.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A fórmula",
          title: "Uma fórmula para a população de amanhã",
          body: "A equação logística de 1845 de Pierre-François Verhulst, amostrada em tempo discreto, dá a aplicação xₙ₊₁ = r · xₙ · (1 − xₙ). Lê x como uma fração da capacidade de suporte entre 0 e 1; r como a taxa de crescimento. O termo (1 − x) é o travão — demasiados indivíduos fazem a geração seguinte passar fome. Com 0 ≤ r ≤ 4 a iteração permanece limitada.",
        },
        {
          pretitle: "Passo dois · Da paz ao caos",
          title: "Duplicar, duplicar, sumir",
          body: "Para r abaixo de 1, toda a população se extingue. De 1 até 3 assenta num único ponto fixo — uma população estável. Em r = 3, o ponto fixo perde estabilidade e divide-se num 2-ciclo: este ano para cima, próximo para baixo. Em r ≈ 3,449 o 2-ciclo torna-se um 4-ciclo, em r ≈ 3,544 um 8-ciclo, e as duplicações empilham-se cada vez mais depressa até que em r ≈ 3,56995 o sistema cai finalmente no caos.",
        },
        {
          pretitle: "Passo três · A constante universal de Feigenbaum",
          title: "Um número que viaja entre sistemas",
          body: "Mede a razão entre os comprimentos de dois intervalos sucessivos de duplicação. O número que sai é δ ≈ 4,66920… — a constante de Mitchell Feigenbaum. O facto espantoso é que a mesma constante aparece em sistemas completamente alheios: a aplicação de Hénon, o oscilador de Duffing, até em convecção fluida experimental. A duplicação de período é um caminho universal para o caos, e δ é a sua impressão digital.",
        },
        {
          pretitle: "Passo quatro · Ilhas de ordem",
          title: "Onde a calma se esconde dentro do caos",
          body: "Dentro do regime caótico, o sistema assenta subitamente num 3-ciclo estável em r ≈ 1 + √8 ≈ 3,8284. A partir daí duplica de novo — período 6, 12, 24 — e volta a entrar no caos. O teorema de Li-Yorke torna o desfecho rigoroso: 'período três implica caos.' O artigo de Robert May de 1976, 'Simple mathematical models with very complicated dynamics', pôs toda a história à frente dos biólogos. Não os largou desde então.",
        },
      ],
    },
    lorenz: {
      pretitle: "Tópico · Caos",
      title: "O Atrator de Lorenz",
      tagline: "Três linhas de código, uma borboleta.",
      intro:
        "Um modelo de brincar da atmosfera que acidentalmente inventou a teoria do caos. O Explorador integra as equações em tempo real e deixa-te ver a trajetória recusar-se a repetir.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Uma atmosfera de brincar",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, meteorologista do MIT, tentava simular convecção — ar aquecido por baixo, arrefecido por cima. Com Ellen Fetter a fazer as corridas numéricas e Margaret Hamilton a tratar dos cálculos, reduziu o problema a três variáveis e três equações. O artigo de 1963, 'Deterministic Nonperiodic Flow', defendia que mesmo esta simplificação drástica podia comportar-se de forma imprevisível. O artigo passou em grande parte despercebido durante uma década.",
        },
        {
          pretitle: "Passo dois · As três equações",
          title: "Três linhas acopladas",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ é o número de Prandtl, ρ o número de Rayleigh, β a razão geométrica de aspeto. Os valores caóticos célebres são σ = 10, ρ = 28, β = 8/3, fixados pelo próprio Lorenz. Muda ρ e o sistema percorre um longo catálogo de comportamentos — pontos fixos, órbitas periódicas, caos transitório — antes de atingir a borboleta canónica.",
        },
        {
          pretitle: "Passo três · A borboleta",
          title: "Um atrator em 3D",
          body: "Integra para a frente no tempo e a trajetória dá voltas em torno de dois equilíbrios instáveis, saltando entre eles numa sequência que nunca se repete. A forma, em três dimensões, parece as asas de uma borboleta — daí o nome. O atrator não é uma curva nem uma superfície; a sua dimensão de Hausdorff é cerca de 2,06. É um atrator estranho: denso em si próprio, nunca fechado, fractal em qualquer escala.",
        },
        {
          pretitle: "Passo quatro · Dependência sensível",
          title: "Porque as previsões do tempo têm um horizonte",
          body: "Toma dois pontos de partida que diferem numa parte em cem mil. Após pouco tempo, as duas trajetórias estão completamente descorrelacionadas. Lorenz formalizou isto como dependência sensível das condições iniciais; o expoente de Lyapunov principal é positivo. Numa palestra de 1972 perguntou se 'uma borboleta a bater as asas no Brasil poderia desencadear um tornado no Texas' — e deu a metáfora que definiu a área. A razão por que as previsões do tempo se desfazem ao fim de cerca de duas semanas é o mesmo expoente, na atmosfera real.",
        },
      ],
    },
    fourier: {
      pretitle: "Tópico · Análise",
      title: "A Transformada de Fourier",
      tagline: "Todo sinal é uma soma de ondas sinusoidais.",
      intro:
        "Um dos factos isolados mais profundos da matemática — e o motor silencioso de MP3, JPEG, Wi-Fi e RMN. O Explorador deixa-te somar harmónicas uma a uma e ver uma onda quadrada surgir de senos puros.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A afirmação de Fourier",
          title: "Condução do calor, 1822",
          body: "Joseph Fourier publicou a sua 'Teoria Analítica do Calor' em 1822. Para resolver a equação do calor fez uma afirmação que soava ultrajante: qualquer função, contínua ou aos saltos, pode ser escrita como soma de senos e cossenos puros. Os matemáticos do seu tempo não acreditaram. Foi precisa meio século de afinação (Dirichlet, Riemann, Lebesgue) para a afirmação se firmar como teorema.",
        },
        {
          pretitle: "Passo dois · A receita",
          title: "Soma de tons puros",
          body: "Para uma função periódica: uma série de Fourier — uma soma sobre frequências discretas. Para uma função integrável arbitrária: uma transformada de Fourier f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — um espectro contínuo. Ambas dizem o mesmo de maneiras diferentes: um sinal no tempo, por mais complicado que seja, decompõe-se em oscilações puras. Um acorde torna-se as suas notas. Uma fotografia torna-se as suas riscas.",
        },
        {
          pretitle: "Passo três · Porque o teu telemóvel funciona",
          title: "Escondido em MP3, JPEG, RMN, Wi-Fi",
          body: "Identifica que frequências importam; deita fora as outras; comprime. O MP3 guarda as bandas audíveis e descarta o que o ouvido não consegue ouvir. O JPEG divide uma imagem em blocos 8×8 e guarda as frequências espaciais dominantes. Os aparelhos de RMN medem fisicamente amostras no espaço das frequências e fazem a transformada inversa de Fourier de volta à anatomia. Wi-Fi e 5G usam OFDM, empacotando dados em milhares de frequências portadoras em paralelo. A FFT de Cooley-Tukey (1965) tornou tudo isto rápido o suficiente para ser prático.",
        },
        {
          pretitle: "Passo quatro · O compromisso da incerteza",
          title: "Mais nítido no tempo, mais turvo na frequência",
          body: "Aperta um sinal numa janela temporal estreita e a sua transformada de Fourier necessariamente se espalha por muitas frequências — e vice-versa. Isto não é engenharia; é matemática. A função Gaussiana fica no ótimo deste compromisso: é a sua própria transformada de Fourier. A mesma desigualdade, na física, torna-se o princípio da incerteza de Heisenberg. Tempo e frequência são coordenadas duais; não se podem aguçar as duas ao mesmo tempo.",
        },
      ],
    },
    euler: {
      pretitle: "Tópico · Análise",
      title: "Identidade de Euler",
      tagline: "Cinco números, uma linha.",
      intro:
        "e^(iπ) + 1 = 0 — cinco constantes vindas de cinco cantos diferentes da matemática, trancadas numa só igualdade. O Explorador ao lado deixa-te ver e^(iθ) varrer o círculo unitário em tempo real, para que vejas, com os teus próprios olhos, o momento em θ = π em que a identidade efetivamente acontece.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · As cinco constantes",
          title: "0, 1, e, i, π — cinco estranhos numa sala",
          body: "Cada um dos cinco números chega de um país diferente. 0 é a identidade aditiva — o nada. 1 é a identidade multiplicativa — a unidade. e ≈ 2,71828 é a taxa natural do crescimento composto, nascida no cálculo. i é a unidade imaginária, definida por i² = −1, nascida na álgebra ao tentar resolver equações cúbicas. π ≈ 3,14159 é a razão entre o perímetro de uma circunferência e o seu diâmetro, nascida na geometria. Normalmente nunca se encontram — e no entanto uma só equação, com seis símbolos, ata os cinco com nada mais do que +, ·, = e exponenciação.",
        },
        {
          pretitle: "Passo dois · A fórmula de Euler",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "A identidade é o que a fórmula de Euler devolve para um ângulo escolhido, publicada na sua Introductio in analysin infinitorum de 1748. Para qualquer número real θ, a fórmula diz que e^(iθ) — uma exponencial com expoente imaginário — é igual a cos θ + i sin θ. Geometricamente: à medida que θ cresce, o ponto e^(iθ) caminha no sentido anti-horário em torno do círculo unitário no plano complexo. Multiplicar por e^(iθ) é rodar pelo ângulo θ. Crescimento e rotação, as duas coisas que e e i secretamente fazem, afinal são a mesma operação vista de dois lados.",
        },
        {
          pretitle: "Passo três · Substitui θ = π",
          title: "A prova de uma só linha",
          body: "Põe θ = π na fórmula de Euler. O lado direito torna-se cos π + i sin π = −1 + i·0 = −1. O lado esquerdo é e^(iπ). Logo e^(iπ) = −1, e somando 1 a ambos os lados dá e^(iπ) + 1 = 0. Geometricamente, é uma meia-volta: partindo do ponto 1 no círculo unitário e rodando π radianos — 180° — pousa exatamente em −1. A identidade é a afirmação algébrica dessa única meia-volta perfeita.",
        },
        {
          pretitle: "Passo quatro · A equação mais bela",
          title: "Porque os matemáticos votam nela",
          body: 'Richard Feynman, aos catorze anos, chamou à fórmula de Euler "a fórmula mais notável da matemática" — "a nossa joia" — nas suas Lectures on Physics. Uma sondagem da Mathematical Intelligencer em 1990 elegeu a identidade o teorema mais belo da matemática; uma sondagem aos leitores da Physics World em 2004 colocou-a a par das equações de Maxwell como a maior equação de sempre. O encanto está em que usa cada uma das operações aritméticas básicas exatamente uma vez (adição, multiplicação, exponenciação), cada uma das constantes básicas exatamente uma vez (0, 1, e, i, π), e não contém ruído extra. Poucas equações são tão curtas, e nenhuma é tão citada como prova de que a matemática é bela.',
        },
      ],
    },
    banach: {
      pretitle: "Tópico · Paradoxo",
      title: "O Paradoxo de Banach-Tarski",
      tagline: "Corta uma bola, fica com duas.",
      intro:
        "Uma bola sólida, dividida em algumas peças, pode ser reconstituída em duas bolas sólidas idênticas à original — sem esticar, sem matéria adicional. O Explorador desenha o motor por detrás do truque: o grupo livre F₂ de duas rotações, cuja árvore de Cayley autossemelhante contém quatro cópias deslocadas de si mesma. Essa estrutura ramificada é, quase literalmente, de onde vem a segunda bola.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O enunciado",
          title: "Uma bola entra, duas bolas saem",
          body: "Toma uma bola sólida B³ no espaço tridimensional. O teorema de Banach-Tarski (1924) diz que podes parti-la num número finito de peças disjuntas — cinco bastam, e cinco é o mínimo — aplicar movimentos rígidos (rotações e translações) a essas peças, e acabar com duas bolas sólidas disjuntas, cada uma congruente com a original. Nada é esticado, deformado ou duplicado; as peças são apenas rearrumadas. A conclusão é, como pedaço de matemática pura, completamente rigorosa: B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Passo dois · O Axioma da Escolha",
          title: "Onde entra a estranheza",
          body: "A construção é impossível só na teoria de conjuntos ZF. A prova de Banach e Tarski precisa do Axioma da Escolha para selecionar um representante de cada uma de uma quantidade não-numerável de órbitas de uma ação de rotação sobre a esfera. Esse único uso da Escolha força as peças a serem não-mensuráveis: não têm volume bem definido no sentido de Lebesgue, pelo que a equação 'volume de uma bola = volume de duas bolas' nunca chega a ser escrita. As peças não são regiões que pudesses jamais cortar fisicamente — são nuvens densas de pontos não-mensuráveis, existindo apenas como objetos lógicos.",
        },
        {
          pretitle: "Passo três · O grupo livre de rotações",
          title: "F₂, gerado por duas rotações",
          body: "O coração da prova é puramente da teoria dos grupos. Duas rotações a e b da esfera unitária S², adequadamente escolhidas, não satisfazem qualquer relação não trivial: geram um grupo livre F₂ de posto 2 — cada palavra reduzida em a, a⁻¹, b, b⁻¹ atua como uma rotação distinta. F₂ admite uma decomposição paradoxal: divide-se em quatro conjuntos W(a), W(a⁻¹), W(b), W(b⁻¹) (palavras que começam por cada gerador) mais a identidade, e cada conjunto deslocado cobre o resto do grupo. Empurra isto pelo paradoxo da esfera de Hausdorff (1914), eleva de S² até à bola sólida, e a duplicação no grupo torna-se uma duplicação de B³.",
        },
        {
          pretitle: "Passo quatro · Porque não parte o mundo",
          title: "Peças não-mensuráveis, átomos do mundo real",
          body: "A medida de Lebesgue é numeravelmente aditiva em conjuntos mensuráveis; se as peças fossem mensuráveis, o volume das duas bolas de saída teria de ser igual ao volume da bola de entrada, contradizendo-se. Portanto o teorema diz-te delicadamente que as peças não podem ser mensuráveis — e, de facto, não são. O mundo real não se importa: a matéria física são finitos átomos, não subconjuntos arbitrários de ℝ³, e não podes executar um corte ao longo de uma fronteira não-mensurável. O paradoxo vive inteiramente dentro do contínuo, onde o infinito tem mais espaço de manobra do que a intuição permite.",
        },
      ],
    },
    lsystem: {
      pretitle: "Tópico · Geometria",
      title: "Sistemas-L",
      tagline: "Reescritas letra a letra que crescem até virarem plantas.",
      intro:
        "Um sistema-L é uma pequena gramática: uma string inicial, algumas regras de reescrita e uma tartaruga que transforma letras em linhas. No Explorador editas o axioma e as regras, deslizas a profundidade da iteração e vês a tartaruga desenhar o fractal resultante — flocos de Koch, dragões, fetos, curvas de Hilbert — a partir de um punhado de caracteres.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Uma string e três regras",
          title: "Axioma, alfabeto, reescrita",
          body: "Um sistema-L tem três peças. Um alfabeto de símbolos. Um axioma — uma string inicial. Um conjunto de regras de produção, uma por símbolo, que dizem em que cada símbolo se transforma na geração seguinte. O truque que o define é o paralelismo: em cada passo, todos os símbolos são reescritos em simultâneo, tal como todas as células de um corpo se dividem ao mesmo tempo. Aristid Lindenmayer, biólogo húngaro em Utrecht, introduziu o formalismo em 1968 para modelar o crescimento célula a célula de algas e plantas. Na variante mais simples (independente do contexto, determinística) as regras olham para um símbolo de cada vez; as versões sensíveis ao contexto olham para os vizinhos; as estocásticas escolhem regras ao acaso.",
        },
        {
          pretitle: "Passo dois · A interpretação da tartaruga",
          title: "Uma caneta virtual que faz crescer o fractal",
          body: "Por si só, os símbolos são apenas texto. A geometria aparece quando alimentas a string a uma tartaruga: F significa avançar uma unidade desenhando, G significa avançar também desenhando, + roda o rumo para a esquerda por um ângulo fixo, − roda para a direita. Mais dois símbolos empilham e desempilham estado: [ empurra a posição e o rumo atuais para uma pilha, ] desempilha-os de volta. Com apenas empilhar e desempilhar, uma única string a 1D ramifica-se de repente — os pares de parênteses tornam-se ramos e ramos laterais. Símbolos fora do alfabeto de desenho (X, Y, A, B …) são variáveis silenciosas: transportam informação pelas reescritas mas a tartaruga ignora-as.",
        },
        {
          pretitle: "Passo três · Exemplos clássicos",
          title: "Quatro regras, quatro fractais",
          body: "Floco de neve de Koch: axioma F++F++F, regra F → F−F++F−F, ângulo 60°. Quatro iterações e o triângulo enrugou-se até virar floco. Curva do dragão: axioma FX, regras X → X+YF+, Y → −FX−Y, ângulo 90°; após uma dúzia de reescritas dobra-se no dragão de Heighway. Ponta de seta de Sierpiński: A → B−A−B, B → A+B+A, ângulo 60°, alterna paridade para varrer o triângulo de Sierpiński. Planta fractal: X → F+[[X]−X]−F[−FX]+X, F → FF, ângulo 25° — o feto canónico de Lindenmayer e Prusinkiewicz, ramos e tudo. A mesma maquinaria, organismos selvagemente diferentes.",
        },
        {
          pretitle: "Passo quatro · Porque os botânicos os adoram",
          title: "De um artigo de 1968 a cada floresta de videojogos",
          body: 'Lindenmayer não era um matemático à caça de imagens bonitas — era um biólogo a tentar captar como um organismo multicelular se desenvolve a partir de uma ponta. Os sistemas-L deram à botânica a sua primeira gramática formal de crescimento: topologia de ramificação, comprimentos de entrenós, posição das folhas, tudo a partir de algumas regras de reescrita. O livro de 1990 de Przemyslaw Prusinkiewicz, "The Algorithmic Beauty of Plants", transformou a ideia num pipeline funcional, e a partir daí escorreu para a computação gráfica. A maior parte das árvores procedimentais em jogos e filmes, os fetos do Speedtree, a vegetação dos shorts da Pixar, as cidades-de-tubos das produções demoscene — descendem todas da reescrita paralela de Lindenmayer. Uma gramática para células tornou-se uma gramática para mundos.',
        },
      ],
    },
    wang: {
      pretitle: "Tópico · Computação",
      title: "Azulejos de Wang",
      tagline: "Quadrados com arestas coloridas que podem codificar qualquer computação.",
      intro:
        "O puzzle de Hao Wang, de 1961 — quadrados cujas quatro arestas coloridas têm de corresponder às dos vizinhos — acabou por esconder o problema da paragem dentro de um jogo infantil de correspondência. O Explorador deixa-te escolher um conjunto de azulejos e ver o plano preencher-se, célula a célula, com backtracking quando nenhum azulejo encaixa.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · As regras",
          title: "Azulejos quadrados, quatro arestas coloridas, sem rotação",
          body: "Um azulejo de Wang é um quadrado unitário cujas quatro arestas têm cores. Só podes colocar um azulejo se cada uma das suas arestas corresponder à cor da aresta com que toca no azulejo vizinho — norte contra sul, este contra oeste. Os azulejos não podem ser rodados nem refletidos; a atribuição de cores é fixa. Dado um conjunto finito desses azulejos, a pergunta é se podes usar cópias deles para azulejar o plano infinito inteiro.",
        },
        {
          pretitle: "Passo dois · A conjetura de Wang e a sua refutação",
          title: "De um algoritmo que devia existir a um que não pode",
          body: "Hao Wang conjeturou em 1961 que qualquer conjunto finito de azulejos que possa azulejar o plano tem de admitir um azulejamento periódico — e daí derivaria um algoritmo para decidir o Problema do Dominó (será que um dado conjunto azuleja o plano?). Em 1966 o seu aluno Robert Berger refutou ambos ao mesmo tempo: construiu um conjunto aperiódico de 20 426 azulejos de Wang e provou que o Problema do Dominó é indecidível. Não há algoritmo que, dado um conjunto de azulejos, consiga decidir sempre se ele azuleja o plano.",
        },
        {
          pretitle: "Passo três · Computação no azulejamento",
          title: "Codificar uma máquina de Turing como conjunto de azulejos",
          body: "O truque de Berger foi traduzir as configurações de uma máquina de Turing em azulejos de Wang, de modo a que cada fila válida de azulejos codifique um passo da máquina e cada coluna válida codifique a passagem do tempo. Existe então um azulejamento do semiplano superior se e só se a máquina nunca parar com entrada em branco — que é o problema da paragem, o problema indecidível canónico. A mesma construção encolheu ao longo das décadas: Berger reduziu o seu conjunto a 104, Robinson a 56, e em 1996 Karel Culik II publicou o recorde duradouro de 13 azulejos de Wang aperiódicos. Jeandel e Rao provaram mais tarde que o verdadeiro mínimo é 11.",
        },
        {
          pretitle: "Passo quatro · Onde acabam por aparecer",
          title: "Da indecidibilidade à textura procedimental",
          body: "Para além do drama fundacional, os azulejos de Wang encontraram uma segunda vida discreta na computação gráfica. Um pequeno conjunto cuidadosamente escolhido permite a um renderizador azulejar uma parede, um chão de floresta ou um mapa de alturas de terreno sem repetições visíveis — as restrições de correspondência cosem os pedaços sem costuras, muito mais barato do que gerar uma textura única e gigantesca. São primos próximos das pavimentações de Penrose e dos quasicristais que Dan Shechtman descobriu em 1982 (Prémio Nobel em 2011): os três são formas de forçar um padrão infinito que nunca se repete completamente.",
        },
      ],
    },
    collatz: {
      pretitle: "Tópico · Caos",
      title: "A Conjetura de Collatz",
      tagline: "Se par, divide por dois. Se ímpar, triplica e soma um.",
      intro:
        "Um dos problemas em aberto mais simples da matemática: uma regra de quatro palavras que ninguém consegue provar que termina sempre. O Explorador em baixo traça a trajetória de granizo de qualquer número inicial e faz crescer o coral inverso — a árvore para trás de todos os inteiros, com raiz em 1.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A regra",
          title: "Dois casos, uma instrução",
          body: "Escolhe qualquer inteiro positivo n. Se n é par, substitui-o por n/2. Se n é ímpar, substitui-o por 3n + 1. Repete. É a regra inteira. Tenta n = 7: vai 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, e depois entra no laço 1 → 4 → 2 → 1 para sempre. Todo ponto de partida que alguma vez testámos acaba nesse mesmo pequeno laço.",
        },
        {
          pretitle: "Passo dois · A conjetura",
          title: "Todos os caminhos vão dar a 1",
          body: "Lothar Collatz propôs a conjetura em 1937, dois anos após o doutoramento. A afirmação é arrebatadoramente simples: para todo inteiro positivo n, a iteração acaba por chegar a 1. É também conhecida como problema de Syracuse, problema de Kakutani e conjetura de Ulam — vários matemáticos tropeçaram no mesmo bicho independentemente. Em 2025 estava verificada por computador para todo inteiro positivo até cerca de 2,36 × 10²¹. Ninguém sabe porquê.",
        },
        {
          pretitle: "Passo três · Recordes e surpresas",
          title: "Granizo sobre Syracuse",
          body: "As trajetórias são apelidadas de sequências de granizo porque, como granizo numa nuvem de trovoada, sobem e descem erraticamente antes de finalmente baterem no chão. O pequeno caso mais famoso é n = 27: leva 111 passos a chegar a 1 e pelo caminho chega ao pico de 9232 — cerca de 340 vezes o seu valor inicial. Outras sementes notáveis: n = 97 leva 118 passos; n = 871 leva 178; n = 6171 leva 261. Entradas minúsculas, órbitas selvagemente desproporcionadas.",
        },
        {
          pretitle: "Passo quatro · Porque resiste",
          title: "Um coral que ninguém consegue podar",
          body: "Paul Erdős, olhando para isto, encolheu os ombros: 'A matemática pode não estar pronta para tais problemas.' Ofereceu 500 dólares por uma solução e o prémio continua por reclamar. O progresso mais profundo é o artigo de Terence Tao em 2019, mostrando que quase todas as órbitas de Collatz atingem valores quase limitados — um quase-acerto probabilístico, não uma prova. Corre a regra para trás em vez de para a frente, e os inteiros auto-montam-se numa única árvore infinita com raiz em 1, a ramificar como coral. O Explorador ao lado faz crescer esse coral e deixa-te lançar qualquer semente na tempestade de granizo.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Tópico · Caos",
      title: "O Pêndulo Duplo",
      tagline: "Dois pêndulos acorrentados, caos total.",
      intro:
        "Um sistema mecânico simples o suficiente para desenhar num guardanapo e caótico o suficiente para fugir a qualquer previsão. O Explorador integra as equações do movimento em tempo real e deixa-te pôr a competir duas partidas quase idênticas para veres por ti próprio como divergem.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O cenário",
          title: "Dois pêndulos, uma massa pendurada noutra",
          body: "Toma um pêndulo simples — uma haste rígida e sem massa de comprimento L₁ com uma massa m₁ na extremidade, a pivotar sob a gravidade. Agora acopla uma segunda haste de comprimento L₂ com massa m₂ à massa do primeiro. A configuração é descrita apenas por dois ângulos, θ₁ e θ₂, medidos a partir da vertical. Junto com as velocidades angulares ω₁ = θ̇₁ e ω₂ = θ̇₂, é esse o estado inteiro: um ponto num espaço de fase quadridimensional, a evoluir deterministicamente sob Newton.",
        },
        {
          pretitle: "Passo dois · O Lagrangiano",
          title: "Cinética menos potencial, depois põe a girar Euler-Lagrange",
          body: "Escreve a energia cinética T de ambas as massas e a energia potencial V da gravidade. O Lagrangiano L = T − V sai limpo, mas as equações do movimento ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 produzem duas EDOs acopladas, não-lineares, de segunda ordem para θ̈₁ e θ̈₂. O acoplamento é através de termos em sin(θ₁−θ₂) e cos(θ₁−θ₂); a não-linearidade é inevitável. Não existe solução em forma fechada. Para ver o sistema mover-se tens de integrar numericamente — e é exatamente isso que o Explorador faz, passo a passo, com RK4.",
        },
        {
          pretitle: "Passo três · Caos",
          title: "Pouca energia: bonito. Muita energia: imprevisível.",
          body: "Com pouca energia, as massas oscilam suavemente e o movimento é quase-periódico — a trajetória enrola-se em torno de um toro invariante no espaço de fase e nunca se repete inteiramente, mas mantém-se limitada e ordeira. Sobe a energia e o sistema atravessa para o caos: o maior expoente de Lyapunov torna-se positivo, e dois pontos de partida que diferem em uma parte em milhão separam-se completamente em poucos segundos. O pêndulo duplo é a demonstração física canónica do caos determinístico — determinístico nas equações, imprevisível na prática.",
        },
        {
          pretitle: "Passo quatro · Onde aparece",
          title: "Robôs, marcha, teoria de controlo, museus",
          body: "As mesmas equações de rotores acoplados descrevem braços robóticos de dois elos (onde o caos é algo a suprimir, não a celebrar), a biomecânica de uma perna em balanço na marcha humana, e muitos osciladores compostos em engenharia. Os teóricos do controlo usam o pêndulo duplo como referência para estabilizar sistemas não-lineares instáveis — equilibrá-lo na vertical é um problema duro clássico. E todo bom museu de ciência tem um a baloiçar dentro de uma vitrina, traçando um rasto que os visitantes nunca conseguem prever.",
        },
      ],
    },
    bzr: {
      pretitle: "Tópico · Caos",
      title: "A Reação de Belousov-Zhabotinsky",
      tagline: "Um relógio químico que desenha espirais.",
      intro:
        "Uma mistura química real que se recusa a estabilizar: pulsa por entre cores num copo e faz crescer espirais a rodar numa placa de Petri. O Explorador simula uma grelha de reação-difusão estilo Oregonator com 3 variáveis para que possas ver a mesma instabilidade auto-organizar-se em ondas.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A descoberta acidental",
          title: "Uma reação que devia ter sido impossível",
          body: "No início dos anos 1950, o químico soviético Boris Belousov, à procura de um análogo inorgânico do ciclo de Krebs, misturou bromato, ácido cítrico e um catalisador de cério — e viu a solução mudar de cor ritmicamente, vezes sem conta. Os revisores rejeitaram o seu artigo: uma reação química visivelmente a oscilar no tempo parecia uma violação da segunda lei da termodinâmica. Belousov desistiu de publicar. Uma década depois, em 1961, o aluno de pós-graduação Anatol Zhabotinsky pegou na receita, trocou o ácido cítrico pelo ácido malónico, e demonstrou as oscilações de forma suficientemente limpa para o resultado já não poder ser negado.",
        },
        {
          pretitle: "Passo dois · Como se vê",
          title: "Um relógio num copo, espirais num prato",
          body: "A receita moderna é bromato (BrO₃⁻) mais brometo, ácido malónico como combustível, e um catalisador redox — cério, ou, mais visivelmente, ferroína — num banho de ácido sulfúrico. Mexida num copo, a solução muda de cor a intervalos regulares (azul ↔ vermelho com ferroína) como um metrónomo químico. Vertida numa placa de Petri fina, onde a difusão importa, a mesma receita faz crescer espontaneamente espirais a rodar e padrões em alvo concêntricos ao longo de minutos. Mexe-a e o padrão é apagado; deixa-a quieta e um novo é desenhado.",
        },
        {
          pretitle: "Passo três · O Oregonator",
          title: "Três variáveis, uma oscilação",
          body: "Em 1972, Richard Field, Endre Körös e Richard Noyes — a trabalhar na Universidade do Oregon — destilaram a química no Oregonator: um sistema não-linear de EDOs com 3 variáveis que segue os intermediários chave (HBrO₂, Br⁻, e o catalisador oxidado). Oscila exatamente pelas mesmas razões que o copo. Acrescenta termos de difusão e as EDOs tornam-se EDPs de reação-difusão; na redução de Tyson-Fife, o mesmo modelo reproduz as ondas espirais numa folha 2D. O Explorador ao lado corre um primo discreto, célula a célula, desta EDP, que é barato o suficiente para um browser mas fiel o suficiente para espiralar.",
        },
        {
          pretitle: "Passo quatro · Porque importa",
          title: "Química que se organiza a si própria",
          body: "A BZR foi a arma fumegante experimental que empurrou a química para longe do pensamento de equilíbrio. Longe do equilíbrio, a matéria não se limita a dissipar — pode organizar-se espontaneamente em padrões estruturados no espaço e no tempo. Ilya Prigogine construiu a teoria destas estruturas dissipativas e recebeu o Prémio Nobel da Química em 1977 por ela. Hoje a BZR é o exemplo canónico de auto-organização longe do equilíbrio, irmã dos padrões de morfógenos de Turing, e antepassada de todo modelo de reação-difusão em biologia, neurociência e engenharia química.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Tópico · Análise",
      title: "Padrões de Turing",
      tagline: "Como os leopardos arranjam as suas pintas.",
      intro:
        "O Explorador simula uma grelha de reação-difusão Gray-Scott em tempo real: duas substâncias químicas virtuais a competir numa rede 200×200. Roda os botões de alimentação e morte e o campo metamorfoseia-se continuamente entre pintas, riscas, labirintos e coral autorreplicante.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A pergunta de Turing",
          title: "De onde vêm os padrões num animal?",
          body: "Um embrião de leopardo começa como uma bola quase uniforme de células. A certa altura, surgem pintas regulares no seu pelo — mesmo espaçamento, mesmo tamanho, nos lugares certos. O mesmo problema aparece para as riscas das zebras, as bandas dos peixes-anjo e os anéis numa concha. Em 1952, Alan Turing publicou 'The Chemical Basis of Morphogenesis' e propôs uma resposta surpreendente: os padrões são pura química. Duas substâncias em difusão com alcances muito diferentes, a reagir uma com a outra, podem quebrar espontaneamente a simetria e desenhar um padrão estável por cima de um fundo uniforme.",
        },
        {
          pretitle: "Passo dois · A receita",
          title: "Ativação de curto alcance, inibição de longo alcance",
          body: "O mecanismo de Turing requer duas substâncias químicas: um ATIVADOR a que catalisa a sua própria produção e a produção de um INIBIDOR b, mais o próprio inibidor, que destrói o ativador. O ingrediente extra crucial é a difusão: o inibidor tem de espalhar-se muito mais depressa do que o ativador. Uma pequena flutuação que sobe a num ponto desencadeia um surto local descontrolado de ativador — mas também produz inibidor, que corre para fora e suprime o ativador num anel largo em volta. Esse anel de supressão mantém o próximo surto à distância de um braço, e o ritmo de surto-e-anel pavimenta o plano com pintas, riscas ou labirintos regulares.",
        },
        {
          pretitle: "Passo três · Uma equação, muitos padrões",
          title: "O diagrama de fases de Gray-Scott",
          body: "A forma jogável padrão é o modelo Gray-Scott: ∂a/∂t = D_a∇²a − ab² + F(1 − a) e ∂b/∂t = D_b∇²b + ab² − (F + k)b. Apenas dois botões fazem o trabalho pesado — F, a taxa de alimentação a que ativador fresco é fornecido, e k, a taxa de matança a que o inibidor decai. O artigo de Pearson de 1993 mapeou o plano (F, k) num atlas hoje famoso de regiões nomeadas: buracos, pintas, riscas, pontos autorreplicantes tipo mitose, o mundo instável U-skate, labirintos, solitões e caos pleno. As mesmas duas equações diferenciais contêm-nos a todos; basta mover o cursor.",
        },
        {
          pretitle: "Passo quatro · Os padrões são reais",
          title: "Do tubo de ensaio ao peixe-balão",
          body: "Durante décadas, o mecanismo de Turing foi uma bela ideia sem experiência. Depois, em 1990, o reator CIMA (clorito-iodeto-ácido malónico em gel) produziu o primeiro padrão de Turing laboratorial em química pura, com amido a fazer de travão do inibidor. Desde aí, os biólogos apanharam o mesmo mecanismo em flagrante em tecido vivo: Akiyama e Tanaka em 2014 leram os sinais de ativador e inibidor diretamente do peixe-balão africano; Sheth e colegas mostraram a dinâmica de Turing a definir o espaçamento dos dedos do rato; a mesma química rege o espaçamento dos folículos pilosos, os botões das penas e a pigmentação das conchas. Pelagens, impressões digitais, cristas — o esboço de Turing de 1952, medido.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Tópico · Geometria",
      title: "O Triângulo de Sierpiński",
      tagline: "Um fractal, quatro caminhos para lá chegar.",
      intro:
        "Wacław Sierpiński descreveu-o em 1915, mas o mesmo padrão triangular de buracos-dentro-de-buracos já tinha sido esculpido nos chãos de igrejas cosmáticas do século XIII. O facto espantoso é que a forma chega por pelo menos quatro caminhos completamente diferentes — recursão, aleatoriedade, aritmética, um autómato celular de uma linha — e o Explorador deixa-te ver os quatro lado a lado.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Subdivisão recursiva",
          title: "Corta o centro, depois recursa",
          body: "Toma um triângulo equilátero. Une os pontos médios dos três lados; isso divide-o em quatro triângulos congruentes mais pequenos. Remove o central e fica com os três cantos. Aplica agora a mesma operação a cada um desses cantos — e outra vez, e outra vez. Após infinitos passos tens o triângulo de Sierpiński: um conjunto autossemelhante cuja área total é zero e cuja fronteira tem comprimento infinito. Cada ronda guarda três quartos da área anterior, pelo que o limite é inevitável.",
        },
        {
          pretitle: "Passo dois · A via do jogo do caos",
          title: "A meio caminho, outra vez e outra vez",
          body: "Coloca três vértices num triângulo. Larga um ponto em qualquer lado; depois, repetidamente, escolhe um dos três vértices uniformemente ao acaso e salta a meio caminho até ele. Marca cada passo. Em poucos milhares de saltos, a nuvem de pontos resolveu-se no triângulo de Sierpiński — exatamente, no limite. Pura brincadeira aleatória, sem instruções sobre geometria, sem memória: apenas um passo de metade e três alvos. O fractal é o que o passeio aleatório não consegue evitar traçar.",
        },
        {
          pretitle: "Passo três · O triângulo de Pascal mod 2",
          title: "As entradas ímpares desenham-no por ti",
          body: "Escreve o triângulo de Pascal e pinta de preto todas as entradas ímpares, de branco todas as pares. O resultado, linha a linha, é o triângulo de Sierpiński. A razão é o teorema de Lucas: um coeficiente binomial C(n, k) é ímpar exatamente quando os dígitos binários de k são um subconjunto dos dígitos binários de n. Por isso, as células pretas vivem onde os bits de k cabem dentro dos bits de n — e essa condição, desenhada num triângulo, é o padrão de Sierpiński. Combinatória e geometria caem no mesmo sítio.",
        },
        {
          pretitle: "Passo quatro · Regra 90 e o IFS",
          title: "Uma célula, uma regra, a mesma forma",
          body: "O autómato celular elementar Regra 90 de Wolfram diz: o próximo estado de uma célula é o XOR dos seus dois vizinhos. Começa com uma única célula preta numa linha aliás branca e avança. Cada nova geração desenhada por baixo da anterior reproduz exatamente o triângulo de Sierpiński. A leitura mais profunda é que as quatro vias descrevem o mesmo atrator: um sistema de funções iteradas de três aplicações de contração, cada uma com razão 1/2, fixas nos três vértices. Qualquer que seja a receita seguida, convergimos para o mesmo conjunto fixo — dimensão de Hausdorff log 3 / log 2 ≈ 1,585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Tópico · Geometria",
      title: "O Jogo do Caos",
      tagline: "Lança um dado, desenha um fractal.",
      intro:
        "Coloca uns pontos, escolhe um ao acaso vezes e vezes e caminha até meio em direção a ele — uma regra que soa a ruído, mas que se condensa num fractal perfeito após alguns milhares de passos. O Explorador anima o procedimento em direto e deixa-te ajustar o número de vértices, o rácio do salto e as regras que governam qual o próximo vértice que podes escolher.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A regra",
          title: "Três pontos, um dado, e um passo curto",
          body: "Coloca os vértices de um polígono. Escolhe qualquer ponto de partida — sobre, fora, dentro do polígono, não importa. Agora lança um dado para escolher um vértice ao acaso, caminha uma fração fixa do caminho da tua posição atual até esse vértice, e marca o novo sítio com um ponto. Trata esse ponto como a tua nova posição e repete. A regra só tem dois ingredientes: uma lista de vértices e um rácio de salto r. É esse o jogo do caos inteiro, formalizado por Michael Barnsley no seu trabalho de 1988 sobre sistemas de funções iteradas.",
        },
        {
          pretitle: "Passo dois · Da aleatoriedade, o triângulo de Sierpiński",
          title: "O rácio certo para cada polígono",
          body: "Num triângulo equilátero com rácio de salto r = 1/2, os pontos condensam-se no triângulo de Sierpiński — após um curto aquecimento, nenhum ponto pode jamais aterrar nos buracos centrais. Para um n-ágono regular existe um rácio mágico rₙ = 1 / (1 + 2·cos(π/n)) que dá um fractal autossemelhante limpo. A tabela abaixo reúne os valores para n = 3 a 8: repara que o 1/2 do triângulo e o 1/(1 + φ) = 1/φ² ≈ 0,382 do pentágono saem diretamente da mesma fórmula. Usa outro rácio e a imagem sobrepõe-se em demasia ou em menos do que o necessário, até o fractal se esborratar.",
        },
        {
          pretitle: "Passo três · Outras formas a partir de outras regras",
          title: "Quadrados, restrições e o feto de Barnsley",
          body: "Num quadrado com r = 1/2 a regra falha: os pontos enchem o interior uniformemente e não aparece nenhum fractal. A solução é uma regra de restrição — por exemplo, proibir o mesmo vértice duas vezes seguidas, ou proibir o vértice imediatamente a seguir ao anterior — e um fractal delicado regressa. Empurra a ideia mais longe e os vértices desaparecem por completo: o feto de Barnsley é o jogo do caos com quatro transformações afins escolhidas por dados enviesados (probabilidades 0,01, 0,85, 0,07, 0,07), e dessa aleatoriedade cresce uma folha botanicamente convincente.",
        },
        {
          pretitle: "Passo quatro · Porque funciona",
          title: "Atratores de sistemas de funções iteradas",
          body: 'Cada movimento disponível — "salta a meio caminho até ao vértice i" — é uma aplicação de contração no plano. Um conjunto finito dessas contrações é um Sistema de Funções Iteradas (IFS), e o teorema de Barnsley garante um atrator compacto único: o ponto fixo do sistema inteiro. O jogo do caos amostra esse atrator ao escolher aplicações ao acaso, e o teorema de Hutchinson diz que os pontos amostrados, com probabilidade um, tornam-se densos nele. Podias desenhar a mesma imagem deterministicamente, aplicando cada mapa a cada forma — o passeio aleatório é apenas a entrada barata e bela.',
        },
      ],
    },
    penrose: {
      pretitle: "Tópico · Geometria",
      title: "Pavimentações de Penrose",
      tagline: "Azulejos que cobrem o plano e nunca se repetem.",
      intro:
        "Duas formas de azulejo bastam para cobrir um plano infinito com um padrão que nunca se repete inteiramente. O Explorador faz crescer pavimentações P3 (dois losangos) ou P2 (papagaio + flecha) por inflação; defines a profundidade, a rotação inicial e vês uma geometria perfeitamente aperiódica a montar-se sozinha.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Dois azulejos, nunca a repetir",
          title: "Penrose, 1974",
          body: "Roger Penrose introduziu a sua primeira pavimentação aperiódica (P1) em 1974, usando seis protótipos construídos em torno do pentágono. Rapidamente reduziu o conjunto a dois: o par papagaio + flecha (P2), e o par de dois losangos (P3) — um losango fino com ângulos 36°/144° e um losango grosso com ângulos 72°/108°. Cada azulejo carrega as regras de correspondência de Conway — setas ou entalhes coloridos nas arestas que fixam que azulejos podem estar ao lado de quais. Sem elas, podias pavimentar periodicamente com papagaios e flechas; com elas, toda pavimentação legítima é forçada a ser aperiódica.",
        },
        {
          pretitle: "Passo dois · Simetria de ordem cinco",
          title: "Uma simetria proibida",
          body: "Todo ângulo na pavimentação é múltiplo de 36° — o ângulo interno de um pentágono regular. Em vértices especiais, o padrão tem simetria rotacional perfeita de ordem cinco, do mesmo tipo que um pentágono tem. A cristalografia clássica prova que nenhuma pavimentação periódica do plano pode ter simetria de ordem cinco: apenas rotações de ordem 2, 3, 4 e 6 são compatíveis com uma rede. As pavimentações de Penrose contornam o teorema recusando-se a ser periódicas, à partida. A surpresa é que ainda podes ter ordem local de cinco sem nunca fechar numa célula que se repete.",
        },
        {
          pretitle: "Passo três · O número de ouro está incorporado",
          title: "φ = (1 + √5) / 2",
          body: "Conta os azulejos em qualquer mancha grande e encontras o número de ouro à espera. O número de papagaios dividido pelo número de flechas converge para φ = (1+√5)/2 ≈ 1,618; o mesmo para losangos grossos divididos por losangos finos. As razões de comprimento dos lados dentro dos triângulos de Robinson que constroem cada losango são 1 : φ, e a regra de inflação que faz crescer a pavimentação escala comprimentos por φ a cada passo. A pavimentação é, num sentido preciso, o número de ouro renderizado como padrão no plano.",
        },
        {
          pretitle: "Passo quatro · Quasicristais",
          title: "Shechtman, 1982",
          body: 'Em abril de 1982, Dan Shechtman disparou um feixe de eletrões a uma liga de alumínio-manganês arrefecida rapidamente e viu um padrão de difração com simetria nítida de ordem cinco — uma coisa que todos os manuais diziam não poder existir. Linus Pauling ridicularizou-o famosamente durante anos ("não existem quasicristais, só quasi-cientistas"). A pavimentação de Penrose era o pedaço de matemática já existente no papel que provava que podia: um padrão aperiódico com ordem de longo alcance e simetria de ordem cinco. Shechtman foi vindicado com o Prémio Nobel da Química em 2011, e as pavimentações de Penrose tornaram-se o modelo bidimensional canónico daquilo a que hoje chamamos quasicristais.',
        },
      ],
    },
    apollonian: {
      pretitle: "Tópico · Geometria",
      title: "Empacotamento Apoloniano de Círculos",
      tagline: "Círculos dentro de círculos dentro de círculos.",
      intro:
        "Começa com três círculos mutuamente tangentes e uma regra para o que conta como tangente. O Explorador preenche recursivamente todos os intervalos triangulares curvos com um novo círculo, e depois preenche os intervalos mais pequenos por sua vez — escolhe as curvaturas iniciais e vê emergir uma cinta que é fractal para sempre.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A posição inicial",
          title: "Três círculos a tocar-se",
          body: "Desenha três círculos no plano, cada um tangente aos outros dois — tocam-se em três pontos e fecham um intervalo triangular curvo. Por volta de 200 a.C., Apolónio de Perga colocou o seguimento natural: que círculos são tangentes aos três círculos dados de uma só vez? Para um trio de círculos mutuamente tangentes há exatamente duas respostas — um pequeno círculo inscrito dentro do intervalo curvo, e um grande círculo que circunscreve os três. Esses dois novos círculos juntam-se aos três originais para formar um quádruplo de círculos mutuamente tangentes. Esse quádruplo é a semente de tudo o que se segue.",
        },
        {
          pretitle: "Passo dois · O teorema de Descartes",
          title: "Curvaturas, presas em álgebra",
          body: "Escreve a curvatura de cada círculo como k = 1/r, com uma convenção: se um círculo encerra os outros (o exterior), toma a sua curvatura como negativa. Na sua correspondência de 1643 com a Princesa Isabel da Boémia, Descartes provou que para quaisquer quatro círculos mutuamente tangentes as curvaturas satisfazem (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Resolver a quadrática para a quarta curvatura dá k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Os dois sinais são exatamente as duas respostas de Apolónio: o sinal + dá o pequeno círculo inscrito, o sinal − dá o outro círculo tangente no lado oposto.",
        },
        {
          pretitle: "Passo três · Preenchimento recursivo",
          title: "Cada intervalo é uma nova semente",
          body: "Uma vez colocado o quádruplo semente, cada intervalo triangular curvo é, ele próprio, delimitado por três círculos mutuamente tangentes — exatamente a configuração com que começámos. Deita o círculo inscrito em cada intervalo usando o sinal + da fórmula de Descartes. Esse círculo divide o antigo intervalo em três novos triângulos curvos mais pequenos, e o processo recursa. Continua para sempre e a união de todos os círculos que desenhaste é a cinta apoloniana. A poeira que sobra tem medida de Lebesgue zero, mas dimensão de Hausdorff cerca de 1,3056867 — um verdadeiro fractal, entre uma curva e uma superfície.",
        },
        {
          pretitle: "Passo quatro · A surpresa inteira",
          title: "Quando toda curvatura é um número inteiro",
          body: "Escolhe as quatro curvaturas semente (k₁, k₂, k₃, k₄) como inteiros. Então a fórmula de Descartes k₄ = k₁+k₂+k₃ ± 2√(…) força todas as curvaturas subsequentes a serem também inteiros — a raiz quadrada colapsa graças a (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), e cada novo círculo herda a integralidade dos seus progenitores. O empacotamento (−1, 2, 2, 3) preenche-se com curvaturas 6, 11, 14, 15, 18, 23, … e qualquer outro empacotamento apoloniano inteiro — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — faz o mesmo. Quais inteiros aparecem, e quais nunca aparecem, é uma questão em aberto na geometria aritmética: um esqueleto secreto da teoria de números, sentado dentro de uma imagem de círculos.",
        },
      ],
    },
    phi: {
      pretitle: "Tópico · Geometria",
      title: "Número de Ouro & Fibonacci",
      tagline: "Uma recorrência simples. A razão que se esconde em todo o lado.",
      intro:
        "O Explorador segue a sequência de Fibonacci à medida que as suas razões consecutivas se aproximam de φ, desenha a espiral dourada construída a partir de quadrados de Fibonacci aninhados, e deixa-te inclinar o padrão de filotaxia do girassol pelo ângulo dourado. Três vistas, um número — e a diferença entre onde φ realmente aparece e onde os infográficos se excedem na venda.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A equação que o define",
          title: "Um número igual ao seu próprio quadrado menos um",
          body: "Resolve φ² = φ + 1. A raiz positiva é φ = (1 + √5) / 2 ≈ 1,6180339887. Essa única equação contém quase tudo: divide ambos os lados por φ e tens φ = 1 + 1/φ, pelo que 1/φ = φ − 1 ≈ 0,6180339887. O recíproco é o original menos um — propriedade que nenhum outro número positivo tem. A raiz negativa é ψ = (1 − √5)/2 ≈ −0,6180, e o par (φ, ψ) é o motor por detrás de todas as identidades de Fibonacci abaixo.",
        },
        {
          pretitle: "Passo dois · Fibonacci",
          title: "Soma os dois últimos, para sempre",
          body: "Começa com F₀ = 0, F₁ = 1, depois itera Fₙ₊₁ = Fₙ + Fₙ₋₁: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Toma a razão de termos consecutivos — 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619 — e aproxima-se de φ. A forma fechada de Binet torna esse limite exato: Fₙ = (φⁿ − ψⁿ)/√5. Como |ψ| < 1, o termo ψⁿ decai e Fₙ acaba por estar à distância de arredondamento de φⁿ/√5 para todo n.",
        },
        {
          pretitle: "Passo três · O ângulo dourado e os girassóis",
          title: "Porque um girassol roda 137,508° por semente",
          body: "Toma um disco, coloca sementes uma após outra e roda por um ângulo fixo entre cada. O modelo de Vogel coloca a semente n no raio rₙ = c√n (para que a área por semente seja constante) e ângulo θₙ = n · α. Escolhe α = 360°/φ² ≈ 137,508° — o ângulo dourado — e as sementes empacotam-se densamente sem espaços e sem direção preferida. Qualquer fração racional de uma volta alinhar-se-ia após algumas rotações e deixaria espaços radiais; φ é o irracional pior aproximável, pelo que o padrão nunca se repete. Os girassóis, as pinhas, os brócolos romanescos e as folhas de muitas plantas usam exatamente este truque.",
        },
        {
          pretitle: "Passo quatro · Ceticismo saudável",
          title: "Onde φ realmente está — e onde não está",
          body: 'φ não governa o Pártenon, a Mona Lisa, nem a concha do Nautilus, apesar dos incontáveis infográficos; esses ajustes são dúbios, na melhor das hipóteses, e viés de confirmação na pior. Onde φ aparece honestamente é no crescimento e na otimização: filotaxia (acima), teoria das frações contínuas (φ = [1; 1, 1, 1, …] torna-o no número de convergência mais lenta — o "mais irracional"), e a geometria das pavimentações de Penrose e dos quasicristais, cuja ordem de longo alcance é construída a partir de φ. Real, belo, e mais estreito do que os cartazes sugerem.',
        },
      ],
    },
    buffon: {
      pretitle: "Tópico · Análise",
      title: "A Agulha de Buffon",
      tagline: "Larga paus em papel pautado. π cai.",
      intro:
        "Georges-Louis Leclerc, Conde de Buffon, colocou a pergunta em 1733 e publicou-a em 1777: deita uma agulha num chão de linhas paralelas e conta os cruzamentos. A razão devolve π — uma constante dos círculos a emergir de agulhas direitas sobre madeira direita. O Explorador simula as quedas em direto e deixa-te ver a estimativa rastejar até π = 3,14159…",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O cenário",
          title: "Linhas paralelas e uma agulha",
          body: "Pauta um chão com linhas paralelas a uma distância d. Toma uma agulha de comprimento ℓ, com ℓ ≤ d, e deita-a de cima de modo a que o seu centro caia numa posição aleatória uniforme e o seu ângulo seja uniforme em [0, π]. A agulha ou cruza uma das linhas ou não. É esse o cenário inteiro — dois parâmetros, uma pergunta sim/não, repetida muitas vezes.",
        },
        {
          pretitle: "Passo dois · A probabilidade",
          title: "Porque π aparece",
          body: "Integra sobre o desvio vertical do centro e o ângulo θ, e a probabilidade de a agulha cruzar uma linha dá exatamente P = 2ℓ / (πd). Reorganiza: π = 2ℓn / (d·k), onde n é o número total de agulhas lançadas e k é o número das que cruzaram uma linha. π emerge de agulhas direitas a cair sobre linhas direitas porque o ângulo θ tem uma média que envolve um seno — e um seno, integrado num semicírculo, transporta secretamente π.",
        },
        {
          pretitle: "Passo três · Convergência lenta",
          title: "Os seis dígitos suspeitos de Lazzarini",
          body: "O erro de Monte Carlo decai como 1/√n. Para fixar três casas decimais de π precisas da ordem de 10⁵ agulhas, e até dez milhões está muito longe de ser suficiente para alta precisão. Em 1901, o matemático italiano Mario Lazzarini reportou π ≈ 3,1415929 a partir de apenas 3408 lançamentos — seis dígitos corretos, suspeitamente próximos da bem conhecida aproximação 355/113. Quase de certeza parou no momento de sorte, ou arranjou a experiência para aterrar lá. A convergência é genuinamente lenta; o número de Lazzarini é bonito demais para ser honesto.",
        },
        {
          pretitle: "Passo quatro · A esparguete de Buffon",
          title: "Só o comprimento conta",
          body: "O mesmo cálculo funciona para ℓ > d, onde se tornam possíveis múltiplos cruzamentos por lançamento e a forma fechada é mais elaborada. Mais marcante é o esparguete de Buffon: toma qualquer curva plana C de comprimento L, por mais torcida ou dobrada que seja, e deita-a no mesmo chão pautado. O número esperado de cruzamentos é 2L / (πd), independentemente da forma. Agulha direita ou esparguete torto: só o comprimento conta. O mesmo π, escondido em qualquer curva.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Tópico · Paradoxo",
      title: "O Hotel de Hilbert",
      tagline: "Há sempre lugar para mais um — mesmo cheio.",
      intro:
        "David Hilbert esboçou o hotel numa palestra de 1924 e George Gamow levou-o ao público no seu livro de 1947 One, Two, Three… Infinity. O Explorador anima os quatro cenários clássicos — um hóspede, k hóspedes, ℵ₀ hóspedes, e ℵ₀ autocarros de ℵ₀ hóspedes — e mostra que um hotel infinito já cheio pode absorvê-los a todos.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Imagina o hotel",
          title: "Infinitos quartos, todos ocupados",
          body: "O hotel tem um quarto para cada número natural: 1, 2, 3, e para sempre. Esta noite, cada quarto está tomado — um hóspede no 1, um no 2, um no 17, um no 10¹⁰⁰. O senso comum chama a isto 'cheio': não há quarto sem hóspede. A matemática discorda, porque 'cheio' é uma ideia finita e o conjunto de quartos aqui é numeravelmente infinito. A cardinalidade dos hóspedes é ℵ₀, e ℵ₀ não é um número — é o tamanho dos números naturais.",
        },
        {
          pretitle: "Passo dois · Um novo hóspede",
          title: "Desloca n → n+1 e o quarto 1 fica livre",
          body: "Um viajante bate à porta. O gerente difunde uma única instrução: cada hóspede passa do quarto n para o quarto n+1. O hóspede do 1 vai para o 2, o do 2 vai para o 3, e assim por diante; ninguém é deslocado porque há sempre um quarto com número mais alto à espera. Após a deslocação, o quarto 1 está vazio e o recém-chegado faz check-in. O hotel 'cheio' nunca esteve cheio no sentido finito — tinha ℵ₀ + 1 = ℵ₀ desde sempre.",
        },
        {
          pretitle: "Passo três · Infinitos novos hóspedes",
          title: "Manda o hóspede n para o quarto 2n; cada quarto ímpar abre",
          body: "Agora chega uma fila numeravelmente infinita. O gerente pede a cada hóspede atual no quarto n que se mude para o quarto 2n. O hóspede 1 vai para o quarto 2, o hóspede 2 para o 4, o 3 para o 6 — cada quarto par fica ocupado e cada quarto ímpar fica livre. Os recém-chegados enchem 1, 3, 5, 7, … por ordem, e toda a gente tem uma chave. Esta é a igualdade ℵ₀ + ℵ₀ = ℵ₀: duas cópias dos naturais cabem dentro de uma sem perda.",
        },
        {
          pretitle: "Passo quatro · Infinitos autocarros, infinitos passageiros cada",
          title: "Potências de primos absorvem ℵ₀ × ℵ₀",
          body: "Chega uma frota de numeravelmente infinitos autocarros, cada um a transportar numeravelmente infinitos passageiros. Manda cada hóspede atual do quarto n para o quarto 2ⁿ — ocupam as potências de dois. Para o autocarro k (k = 1, 2, 3, …), seja pₖ o k-ésimo primo ímpar (3, 5, 7, 11, 13, …) e manda o passageiro m para o quarto pₖᵐ. O autocarro 1 aterra em 3, 9, 27, 81, …; o autocarro 2 em 5, 25, 125, …; o autocarro 3 em 7, 49, …. Pelo teorema fundamental da aritmética, toda potência de primo é única, pelo que dois hóspedes nunca colidem. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Tópico · Paradoxo",
      title: "A Trombeta de Gabriel",
      tagline: "Volume finito, superfície infinita.",
      intro:
        "Uma forma de 1641 que engoliu todas as intuições que os matemáticos tinham sobre o infinito. O Explorador corta a trombeta num x variável, desenha a vista lateral e calcula o volume e a área de superfície em direto — vê uma manter-se mansa e a outra fugir.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A forma",
          title: "Roda y = 1/x em torno do eixo",
          body: "Toma a curva y = 1/x para x ≥ 1 e fá-la rodar em torno do eixo dos x. O resultado é uma trombeta esguia que se alarga perto de x = 1 e se afunila para sempre para raio zero à medida que x cresce. Cada secção transversal perpendicular ao eixo é um disco de raio 1/x. A trombeta estende-se infinitamente para a direita, mas em cada ponto a sua largura está a encolher. Evangelista Torricelli descreveu a figura em 1641 — três décadas antes de Newton e Leibniz terem cálculo em que se apoiar.",
        },
        {
          pretitle: "Passo dois · Calcula o volume",
          title: "V = π — exatamente",
          body: "Corta a trombeta em discos de espessura dx e raio 1/x. O volume de cada disco é π · (1/x)² · dx. Soma-os todos de 1 até infinito: V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Finito. A trombeta infinita inteira podia ser cheia até à borda com exatamente π unidades cúbicas de tinta. O integral convergente ∫ 1/x² dx é o que a mantém limitada — os quadrados desaparecem suficientemente depressa para a soma assentar.",
        },
        {
          pretitle: "Passo três · Calcula a superfície",
          title: "A = ∞ — exatamente",
          body: "A área lateral da superfície é A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. O fator da raiz quadrada é sempre pelo menos 1, pelo que A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. Esse é o integral harmónico, e diverge. Por mais longe que caminhes ao longo da trombeta, continuas a somar área lateral, e o total nunca para de crescer. A superfície é infinita — nenhuma quantidade finita de tinta a cobrirá.",
        },
        {
          pretitle: "Passo quatro · O paradoxo do pintor",
          title: "Enche-a; nunca a pintes",
          body: "Aqui está pois o enigma: derrama π unidades de tinta e a trombeta está cheia — incluindo a sua parede interior. No entanto, para cobrir o exterior precisarias de infinita. Torricelli achou o resultado contraintuitivo mesmo antes de o cálculo existir para nomear o truque. A resolução moderna é que 'pintar' assume uma camada de espessura não nula ε, que sobre uma superfície infinita necessita de volume infinito. Larga essa suposição e o paradoxo dissolve-se: a 'tinta' matemática lá dentro tem espessura zero na parede, e a parede interior é a mesma superfície infinita que a exterior. O nome vem mais tarde — a trombeta do arcanjo Gabriel, tocada para anunciar o dia do juízo.",
        },
      ],
    },
    cantor: {
      pretitle: "Tópico · Paradoxo",
      title: "O Argumento Diagonal de Cantor",
      tagline: "O infinito vem em tamanhos.",
      intro:
        "O argumento diagonal de 1891 de Georg Cantor é a prova mais limpa em matemática de que alguns infinitos são maiores que outros. O Explorador anima a construção em direto: escolhe qualquer listagem de decimais em [0,1] e vê sair um novo número real da diagonal — um que não pode estar na tua lista, não importa quão astutamente a tenhas ordenado.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A preparar o impossível",
          title: "Assume que os reais podem ser listados",
          body: "A prova de Cantor é por contradição. Assume que os números reais entre 0 e 1 são numeráveis — isto é, podem ser organizados numa sequência infinita r₁, r₂, r₃, …, com todo real a aparecer algures na lista. Repara que nunca dizemos em que ordem: o argumento tem de funcionar para qualquer ordenação que consigas inventar. Se conseguirmos encontrar um real que a listagem deixou de fora, a hipótese de existir tal lista completa cai.",
        },
        {
          pretitle: "Passo dois · A ler a diagonal",
          title: "Um dígito de cada vez, escada abaixo",
          body: "Escreve cada rₙ como expansão decimal 0.d_{n,1} d_{n,2} d_{n,3} …, de modo que d_{n,k} seja o k-ésimo dígito do n-ésimo real. Agora lê na diagonal: d_{1,1}, depois d_{2,2}, depois d_{3,3}, e assim por diante. Constrói um novo número s = 0.s₁ s₂ s₃ … escolhendo cada dígito sₙ para diferir de d_{n,n}. Uma receita segura é trocar 5 ↔ 6 (qualquer regra que evite 0 e 9 contorna a ambiguidade 0,999… = 1,000…).",
        },
        {
          pretitle: "Passo três · Porque s está em falta",
          title: "Diferente no n-ésimo dígito, sempre",
          body: "Por construção, s difere de r₁ na primeira casa decimal, de r₂ na segunda, de r₃ na terceira — de rₙ na n-ésima, para todo n. Portanto, s não pode ser igual a nenhum rₙ da lista. Ainda assim, s é um número real perfeitamente legítimo em [0, 1]. Era suposto a lista conter todo tal real, e eis aqui um que perdeu. A hipótese colapsa: nenhuma listagem dos reais pode ser completa. Os reais entre 0 e 1 são não-numeráveis.",
        },
        {
          pretitle: "Passo quatro · Uma nova espécie de infinito",
          title: "Contínuo, paragem, Gödel — a mesma diagonal",
          body: "Os reais têm cardinalidade estritamente maior do que os naturais: |ℝ| = 2^ℵ₀ = c > ℵ₀. O mesmo truque diagonal alimenta a prova de Turing de que o problema da paragem é indecidível, e o primeiro teorema da incompletude de Gödel — ambos constroem uma frase que discorda de todas as entradas numa lista de candidatos. Cantor perguntou então se haveria alguma cardinalidade estritamente entre ℵ₀ e c. Esta é a hipótese do contínuo. Gödel (1940) e Cohen (1963) mostraram em conjunto que é independente de ZFC: assume-a verdadeira e os axiomas mantêm-se consistentes; assume-a falsa e os axiomas mantêm-se consistentes. A matemática, neste ponto, deixa a porta aberta.",
        },
      ],
    },
    boids: {
      pretitle: "Tópico · Computação",
      title: "Boids",
      tagline: "Três regras locais. Um bando inteiro.",
      intro:
        "Craig Reynolds deu a cada ave simulada três pequenos instintos em 1986 e largou-as — sem líder, sem plano global, sem mapa partilhado. A partir desses três impulsos locais, emergiu um bando. O Explorador deixa-te afinar as três regras em tempo real e ver a coreografia inteira a ondular.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O agente",
          title: "Um ponto com um rumo",
          body: "Cada boid é um pequeno ponto em movimento: tem uma posição e uma velocidade. Essa é a memória inteira que cada agente carrega. Não vê o bando inteiro — apenas o punhado de vizinhos dentro de um pequeno raio de perceção. Não há mapa, nem líder a seguir, nem troca de mensagens entre agentes. Só uma posição, uma velocidade e aquilo que está à vista.",
        },
        {
          pretitle: "Passo dois · As três regras",
          title: "Separação, alinhamento, coesão",
          body: "A cada frame, cada boid calcula três pequenos vetores de direção a partir dos vizinhos dentro do seu raio de perceção. SEPARAÇÃO: afasta-te de qualquer boid que se aproximou demais, ponderado pelo quão perto. ALINHAMENTO: empurra a tua velocidade para a velocidade média dos teus vizinhos. COESÃO: dirige-te para o centro de massa dos vizinhos que consegues ver. Os três vetores são somados com pesos e adicionados à velocidade a cada frame. É esse o algoritmo inteiro.",
        },
        {
          pretitle: "Passo três · Emergência",
          title: "Sem líder, sem plano, sem conversa",
          body: "Partindo de posições e rumos aleatórios, os boids organizam-se em bandos cerrados em poucos segundos. Formam-se correntes, dividem-se em torno de obstáculos e voltam a fundir-se — exatamente a coreografia das murmurações reais de estorninhos, das bolas-isca de sardinha e dos enxames de morcegos. Nada no programa sabe o que é um bando. O bando é o que as três regras parecem vistas de fora. É uma das demonstrações mais limpas de emergência em toda a informática.",
        },
        {
          pretitle: "Passo quatro · Onde acaba por chegar",
          title: "Do SIGGRAPH 1987 ao céu noturno",
          body: "Reynolds chamou aos agentes boids — abreviatura de bird-oid object — e apresentou o artigo 'Flocks, Herds, and Schools: A Distributed Behavioral Model' no SIGGRAPH 1987. Em cinco anos o seu algoritmo animava o enxame de morcegos em Batman Returns (1992) e a debandada de gnus em O Rei Leão (1994). Hoje, as mesmas três regras conduzem simulações de evacuação, investigação em enxames robóticos, e as coreografias dos espetáculos de luz da Intel com 1000 drones. O modelo de bando é irmão da otimização por enxame de partículas — a mesma intuição, reaproveitada para a procura.",
        },
      ],
    },
    aizawa: {
      pretitle: "Tópico · Caos",
      title: "O Atrator de Aizawa",
      tagline: "O primo mais estranho e bizarro de Lorenz.",
      intro:
        "Três equações diferenciais acopladas arrastam um único ponto pelo espaço 3D. Ao contrário da borboleta de Lorenz, aqui a trajetória dobra-se sobre si própria num toro com alça em forma de cesto e um pico vertical no seu coração — um dos atratores estranhos mais visualmente distintivos da teoria do caos.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · As equações",
          title: "Três equações, sete parâmetros",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Escolhe qualquer ponto inicial. Integra para a frente no tempo com um passo pequeno (o método de Euler funciona; Runge-Kutta é melhor). O ponto traça uma curva no espaço. Corre durante milhares de passos e a curva volta para perto de si mesma, depois afasta-se — nunca repetindo exatamente, sempre dentro de uma região limitada. Esse é o atrator estranho.",
        },
        {
          pretitle: "Passo dois · A geometria padrão",
          title: "Jarra, cesto, pico",
          body: "Com os parâmetros clássicos de Aizawa (a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25, f = 0,1), a trajetória enrola-se em torno de um toro na metade inferior da figura, depois sobe por um fino pescoço vertical e volta a descer no toro do lado oposto. O resultado parece uma jarra estriada com um fio a atravessá-la. Do ângulo certo parece um cesto. De outro, um coração com um espigão. O visual é parte da razão pela qual o atrator de Aizawa escapou dos manuais: fotografa melhor do que qualquer outro.",
        },
        {
          pretitle: "Passo três · Afinar os botões",
          title: "Geometria sensível",
          body: "Aizawa é mais rico em parâmetros do que Lorenz, o que o torna mais sensível à afinação. Diminui o parâmetro c em 0,1 e o espigão retrai-se para dentro do cesto. Aumenta d e os laços de baixo ficam mais apertados, mais densos, como uma trança mais cerrada. Algumas combinações de parâmetros colapsam num ciclo-limite (deixa de haver caos); outras explodem para infinito. O regime caótico é uma faixa estreita do espaço de parâmetros, e a geometria dentro dessa faixa transforma-se continuamente à medida que deslizas os botões.",
        },
        {
          pretitle: "Passo quatro · Uma pequena família",
          title: "Rössler, Thomas, e amigos",
          body: "Aizawa é uma entrada de uma pequena família de atratores estranhos de três equações descobertos ao longo dos anos 1970 e 1980. Rössler (1976) é ainda mais simples — apenas um termo não-linear, e a trajetória é uma espiral plana com uma torção de dobra, tipo rosácea de Möbius. O atrator ciclicamente simétrico de Thomas usa apenas funções seno e produz um emaranhado de cubos ligados por fios caóticos. Os três vivem em 3D com trajetórias contínuas — sem passo temporal, sem grelha, sem discretização, apenas a matemática a arrastar um ponto.",
        },
      ],
    },
    dla: {
      pretitle: "Tópico · Caos",
      title: "Agregação Limitada por Difusão",
      tagline: "Caminhantes aleatórios congelam ao toque — e fazem crescer corais.",
      intro:
        "Um pixel-semente. Um enxame de partículas, cada uma num passeio aleatório. No momento em que uma partícula errante esbarra no aglomerado, fica colada para sempre. Repete dez mil vezes e uma dendrite ramificada floresce do nada — a mesma forma que o cobre toma quando é electrodepositado, que o líquen toma numa parede, que o relâmpago deixa na pele nua.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O cenário",
          title: "Uma semente e uma névoa de caminhantes",
          body: "Parque de brincadeira em grelha de pixéis. Coloca um único pixel preto no meio: a semente. Agora liberta uma partícula num local aleatório longe da semente. A partícula faz um passeio aleatório — cada passo escolhe uma de quatro direções uniformemente — e continua até aterrar ao lado do aglomerado (e tornar-se parte dele) ou até vaguear demasiado longe (e ser esquecida). Liberta a próxima partícula. E a seguinte. Dez mil partículas depois, tens uma imagem.",
        },
        {
          pretitle: "Passo dois · A regra da colagem",
          title: "Tocar = congelar, para sempre",
          body: "Há uma regra. Uma partícula que ande e se torne adjacente a qualquer pixel do aglomerado transforma-se ela própria num pixel do aglomerado, e para. É essa a física inteira. A razão pela qual a estrutura é ramificada e não bolha é geométrica: um caminhante errante tem muito mais probabilidade de ser intercetado por uma ponta exposta do aglomerado do que de se enfiar por um fiorde profundo. As pontas crescem mais depressa do que os vales. Formam-se ramos. O interior fica esfomeado por falta de novas chegadas.",
        },
        {
          pretitle: "Passo três · A dimensão fractal",
          title: "1,71 — independente da semente",
          body: "Witten e Sander publicaram o modelo em 1981 e mostraram numericamente que numa rede 2D o aglomerado resultante tem dimensão fractal ≈ 1,71. Isso está estritamente entre uma curva (dimensão 1) e uma região preenchida (dimensão 2), e — crucialmente — não depende da forma da semente, do tipo de rede ou do raio de geração. Processos físicos diferentes, que à superfície nada têm em comum, produzem exatamente a mesma dimensão. O número é universal no mesmo sentido em que π é.",
        },
        {
          pretitle: "Passo quatro · Onde aparece",
          title: "Cobre, relâmpago, líquen, neurónios",
          body: "Substitui os caminhantes abstratos por iões de cobre numa solução de sulfato e liga uma corrente; o metal deposita-se no cátodo no mesmo padrão dendrítico. Substitui-os por eletrões a fugir através de um dielétrico e tens uma figura de Lichtenberg — a cicatriz em forma de relâmpago que a alta tensão deixa em madeira, acrílico ou num corpo humano atingido. Substitui-os por esporos transportados pelo ar a pousar numa árvore e tens a silhueta de uma colónia de líquenes. Sempre que a difusão se topa com algo irreversivelmente pegajoso, podes prever a imagem a partir de uma regra.",
        },
      ],
    },
    langton: {
      pretitle: "Tópico · Computação",
      title: "A Formiga de Langton",
      tagline: "Duas regras · dez mil passos · uma autoestrada.",
      intro:
        "Coloca uma única formiga numa grelha infinita de quadrados brancos. Duas regras dizem-lhe o que fazer. Nos primeiros dez mil passos, o rasto parece caos. Depois — sem aviso — comuta para um padrão perfeitamente periódico de 104 passos que caminha para o infinito. Duas regras, um milagre emergente inexplicado.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · As regras",
          title: "Duas linhas são o programa inteiro",
          body: "Há uma formiga virada para uma das quatro direções, numa grelha quadrada infinita onde cada célula é branca ou preta. Em cada tique: olha para a célula em que estás. Se for BRANCA: inverte para preta, vira 90° para a direita, avança uma célula. Se for PRETA: inverte para branca, vira 90° para a esquerda, avança uma célula. Essa é a especificação completa — Christopher Langton escreveu-a em 1986. Não há número aleatório, nem consulta de vizinhança, nem parâmetros. Duas linhas.",
        },
        {
          pretitle: "Passo dois · Três regimes",
          title: "Simetria simples, depois caos, depois…",
          body: "Põe a formiga a correr a partir de uma grelha em branco e observa. Durante cerca de 100 passos, o rasto é pequeno e bilateralmente simétrico — as regras são determinísticas, o início está vazio, o padrão tem de respeitar ambos os eixos. Por volta do passo 500, a simetria estilhaça-se e o rasto parece essencialmente aleatório: um emaranhado de quadrados pretos sem qualquer estrutura visível a qualquer escala. Essa fase dura aproximadamente dez mil passos e frustrou os investigadores durante quase uma década. Depois começa o terceiro regime.",
        },
        {
          pretitle: "Passo três · A autoestrada",
          title: "Um ciclo de 104 passos, a derivar para sempre",
          body: "Algures à volta do passo 10 000 — o momento exato depende do padrão inicial de bits, mas é sempre por aí — a formiga prende-se num ciclo repetitivo de 104 passos que a faz transladar duas células na diagonal por ciclo. De fora parece que está a assentar uma 'autoestrada' às riscas, organizada, em direção ao canto. Segui-la-á, imperturbável, para sempre. Bunimovich e Troubetzkoy provaram em 1992 que, qualquer que seja o arranjo finito de células pretas com que comeces, a trajetória da formiga é sempre não-limitada — não pode ser presa. Se a autoestrada aparece sempre é ainda uma conjetura aberta. Até agora apareceu sempre.",
        },
        {
          pretitle: "Passo quatro · Porque importa",
          title: "Universalidade, escondida em duas linhas",
          body: "Toma a formiga e substitui 'duas cores' por 'n cores' e uma regra de viragem diferente por cor. Algumas dessas formigas generalizadas são Turing-completas — Gajardo, Moreira e Goles provaram-no: podes codificar qualquer programa de computador no padrão inicial de bits, e a trajetória da formiga é a execução desse programa. Por isso um sistema simples o suficiente para caber num guardanapo é, disfarçadamente, todo computador possível que alguma vez será construído. É o enigma da emergência celular na sua forma mais pura.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Tópico · Geometria",
      title: "Triângulo de Pascal (mod n)",
      tagline: "Colorir por divisibilidade — sai um fractal.",
      intro:
        "O triângulo de Pascal é a tabela de consulta dos coeficientes binomiais C(n, k). Cada número é apenas a soma dos dois acima dele. Reduz cada entrada módulo um primo e o padrão de cores resultante é um fractal perfeito e infinito. Porquê? Por causa de quando acontecem os transportes na adição em base p.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O triângulo",
          title: "Números a partir da regra mais simples na Terra",
          body: "Escreve um 1 no ápice. Por baixo, cada entrada é a soma das duas acima dela (trata as posições vazias como zero). As primeiras seis filas: 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. Os números são os coeficientes binomiais C(n, k) — contam o número de formas de escolher k itens entre n. Aparecem na probabilidade, na álgebra (expansão de (a + b)ⁿ), na combinatória. São também o único ingrediente necessário para ver um fractal.",
        },
        {
          pretitle: "Passo dois · Colorir pelo resto",
          title: "Mod 2: células ímpares preenchidas, células pares em branco",
          body: "Agora substitui cada entrada pelo seu resto módulo 2 (a sua paridade). Preenche os 1, deixa os 0 em branco, e afasta-te. O que vês é o triângulo de Sierpiński — exato, infinito, gerado puramente por contagem. Toma qualquer bloco de 2^k filas e a imagem são três cópias do mesmo bloco de tamanho 2^(k-1) dispostas em triângulo, com um buraco no meio. A mesma estrutura autossemelhante desce até ao fim.",
        },
        {
          pretitle: "Passo três · O teorema de Kummer",
          title: "A lei oculta: conta os transportes",
          body: "Porque é que Pascal mod p se fatoriza tão limpamente? Em 1852, Kummer provou um facto surpreendente. A maior potência de um primo p que divide C(n, k) é igual ao número de transportes que acontecem quando somas k e (n − k) em base p. Portanto, C(n, k) é divisível por p (mod 0) exatamente quando há pelo menos um transporte; é não-nulo mod p exatamente quando k pode ser somado a (n − k) em base p sem transporte — isto é, quando cada dígito em base p de k é no máximo o correspondente dígito em base p de n. O fractal é, secretamente, uma imagem de quando a adição em base p é limpa.",
        },
        {
          pretitle: "Passo quatro · Outros primos",
          title: "Diferente p, diferente cinta",
          body: "Para p = 3 obténs uma cinta triangular com três cores e estrutura autossemelhante de ordem 3. Para p = 5 o período é 5; para p = 7 a cinta é ainda mais densa. À medida que p cresce, a dimensão fractal de Hausdorff aproxima-se de 2 — a imagem enche-se. Para módulos não primos, a estrutura existe mas torna-se irregular (a contagem limpa de transportes de Kummer só funciona para primos). Uma tabela combinatória simples, uma família infinita de fractais.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Tópico · Análise",
      title: "A Árvore de Stern-Brocot",
      tagline: "Cada fração, exatamente uma vez — construída a somar mal.",
      intro:
        "Começa com 0/1 e 1/0 — as duas impossibilidades. Desliza uma nova fração entre elas somando separadamente numeradores e denominadores, como uma criança faria. Repete para sempre. A árvore infinita que constróis contém todas as frações positivas uma vez, na forma reduzida — e o caminho até cada uma é exatamente a sua expansão em fração contínua.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A mediante",
          title: "Soma os pedaços separadamente, obténs algo novo",
          body: "Toma duas frações, a/b e c/d. A sua mediante é (a + c) / (b + d). Esta é, claro, a forma errada de somar frações. Mas produz algo interessante: uma fração estritamente entre a/b e c/d. Começa com 0/1 e 1/0 (trata 1/0 como +∞). A sua mediante é 1/1. Desliza 1/1 entre elas. Agora toma os novos pares: (0/1, 1/1) dá 1/2; (1/1, 1/0) dá 2/1. Desliza ambos. Repete. As frações marcham pela reta numérica, todas já na forma reduzida.",
        },
        {
          pretitle: "Passo dois · Cada fração, uma vez",
          title: "Nada falta, nada se repete",
          body: "É um teorema — demonstrável em poucas linhas — que a árvore de Stern-Brocot contém todo número racional positivo exatamente uma vez, com numerador e denominador já coprimos. Portanto, a árvore é, simultaneamente, uma enumeração dos racionais positivos, uma prova de que só existem numeráveis, e uma forma estruturalmente justa de os construir. Stern (1858) e Brocot (1861) descobriram a mesma árvore independentemente — Stern como peça de teoria de números, Brocot como ferramenta de relojoeiro para escolher rácios de engrenagens.",
        },
        {
          pretitle: "Passo três · O caminho da fração contínua",
          title: "Esquerda e direita codificam a expansão",
          body: "Escolhe qualquer número positivo — racional ou irracional. Caminha pela árvore começando em 1/1. A cada passo vai para a ESQUERDA se o teu alvo for menor que a fração atual, para a DIREITA se maior. Anota a sequência de movimentos como lista de run-length. Essa lista é exatamente a expansão em fração contínua do teu alvo. Por exemplo: o número de ouro φ = (1+√5)/2 ≈ 1,618 produz o caminho D, E, D, E, D, E, … — a alternar um por um — que codifica a fração contínua [1; 1, 1, 1, 1, …]. φ é, neste sentido, o número irracional 'mais difícil' de aproximar por racionais.",
        },
        {
          pretitle: "Passo quatro · Melhores aproximações",
          title: "Parar cedo dá os convergentes",
          body: "Pára o caminho ao fim de qualquer número finito de passos. A fração em que estás é uma melhor aproximação racional do teu alvo — melhor do que qualquer racional com denominador menor. Por isso, a sequência de frações que visitas a caminho de π dá-te 3, 22/7, 333/106, 355/113, 103993/33102 — os famosos convergentes que culturas humanas redescobriram ao longo dos séculos. A mesma construção que enumera os racionais também isola os melhores deles.",
        },
      ],
    },
    ulam: {
      pretitle: "Tópico · Análise",
      title: "A Espiral de Ulam",
      tagline: "Primos a alinharem-se em diagonais que ninguém consegue explicar plenamente.",
      intro:
        "Stanisław Ulam, entediado numa palestra de 1963, rabiscou os inteiros numa espiral quadrada e circulou os primos. Os primos não se dispersaram. Aglomeraram-se ao longo de diagonais visíveis. Porque é que os primos preferem certas formas quadráticas em vez de outras é um dos problemas em aberto mais profundos da teoria de números — Ulam viu-o num guardanapo.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A espiral",
          title: "1 no meio, depois caminha em quadrados",
          body: "Escreve 1 no centro. Avança para a direita para escrever 2. Sobe para escrever 3. Vai para a esquerda para 4 e 5. Desce para 6, 7 e 8. Continua numa espiral quadrada a crescer para fora. Quando colocaste cem números, tens uma grelha 10 × 10 onde cada célula contém um inteiro positivo e os inteiros vizinhos na página já não são vizinhos na reta numérica. Essa é a construção inteira.",
        },
        {
          pretitle: "Passo dois · Pinta os primos",
          title: "Um padrão que não devia estar ali",
          body: "Agora preenche apenas as células cujo número é primo — deixa as restantes em branco. Se os primos fossem verdadeiramente aleatórios entre os inteiros, a grelha pareceria um chuvisco uniforme, estática. Em vez disso, o olho é puxado por linhas diagonais claras a percorrer a imagem. O padrão não é subtil: até um pedaço de trinta por trinta já o mostra. Ulam, Myron Stein e Mark Wells publicaram a observação em 1964 com uma grelha de 65 000 números impressa em várias páginas da Scientific American.",
        },
        {
          pretitle: "Passo três · Porquê diagonais",
          title: "Cada diagonal é um polinómio 4n² + bn + c",
          body: "Os números ao longo de qualquer diagonal da espiral de Ulam satisfazem uma fórmula quadrática da forma 4n² + bn + c. Uma diagonal cheia de primos significa portanto que o polinómio é invulgarmente rico em primos. Alguns são espetaculares. O polinómio de Euler n² − n + 41 — descoberto em 1772 — produz primos para todo n de 0 a 39, e corresponde a uma faixa diagonal visível. Saber se há infinitos primos em tal diagonal é, para uma diagonal específica, indemonstrado. A conjetura de Bunyakovsky diz que sim; ninguém o mostrou.",
        },
        {
          pretitle: "Passo quatro · O problema mais profundo",
          title: "Uma questão em aberto a usar maquilhagem",
          body: "A espiral de Ulam é um rearranjo cosmético dos inteiros, mas as diagonais visíveis codificam uma questão em aberto profunda: que polinómios quadráticos em ℤ[x] produzem infinitos primos? Várias conjeturas de Hardy-Littlewood e Bateman-Horn preveem densidades exatas para esses primos — coincidem espetacularmente bem com a imagem — mas cada previsão é condicional. O rabisco de Ulam é uma janela para a parte mais teimosa da teoria analítica dos números, acidentalmente visível para qualquer um com papel quadriculado.",
        },
      ],
    },
    cardioid: {
      pretitle: "Tópico · Geometria",
      title: "A Cardioide da Chávena de Café",
      tagline: "A curva de luz na tua chávena é o coração de Mandelbrot.",
      intro:
        "Aponta luz solar paralela a uma chávena de café cilíndrica. As reflexões da parede interior não focam num ponto — envolvem uma curva em forma de coração a flutuar na superfície do café. Essa curva é a cardioide r = 2a(1 − cos θ). A mesma equação descreve o bolbo principal do conjunto de Mandelbrot. Todas as manhãs, a forma mais famosa da dinâmica está a ser desenhada com luz.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A ótica",
          title: "Porque a luz se aglomera numa chávena",
          body: "Um círculo reflete um raio horizontal com o dobro do ângulo que a superfície faz com esse raio — a lei da reflexão. Por isso, um feixe de raios horizontais que bata no interior de uma chávena cilíndrica é abanado para fora pelo dobro do ângulo local. Não convergem para um único ponto focal, porque a curvatura varia; em vez disso, a família dos raios refletidos envolve uma curva suave. A palavra dos matemáticos para esta envolvente é catacaústica. A catacaústica de um círculo, iluminada por raios paralelos, é exatamente uma cardioide.",
        },
        {
          pretitle: "Passo dois · A equação",
          title: "r = 2a (1 − cos θ)",
          body: "Em coordenadas polares centradas num vértice escolhido, a cardioide é r(θ) = 2a(1 − cos θ). Quando θ = 0 o raio é 0 (a cúspide). Quando θ = π o raio é 4a (a ponta longínqua). A curva é traçada por um ponto no rebordo de um círculo de raio a a rolar pelo exterior de um círculo fixo do mesmo raio — daí vem a palavra: cardia significa coração. É uma das curvas algébricas mais estudadas da análise clássica.",
        },
        {
          pretitle: "Passo três · O bolbo principal de Mandelbrot",
          title: "Mesma equação, universo completamente diferente",
          body: "Agora deixa a ótica para trás. Faz zoom no conjunto de Mandelbrot z ↦ z² + c. O grande borrão em forma de coração no centro — a maior componente — é uma cardioide. Exatamente. A sua fronteira é parametrizada por c(t) = (1/2)·e^(it) − (1/4)·e^(2it), e essa equação é algebricamente uma cardioide (na variável c). Os valores de c dentro desse bolbo correspondem a dinâmica com um único ponto fixo atrativo. A forma que aparece numa chávena e a forma que aparece na teoria da iteração são a mesma forma — e não há razão simples para isso.",
        },
        {
          pretitle: "Passo quatro · E os bolbos mais pequenos",
          title: "Uma escada infinita de círculos agarrados",
          body: "A cardioide principal do conjunto de Mandelbrot tem discos circulares mais pequenos pendurados em cada fração racional p/q. Cada disco corresponde a uma dinâmica em que o ciclo atrativo tem período q. O maior disco, à esquerda, tem período 2; os dois seguintes têm período 3; depois quatro discos de período 4; e assim por diante. O fractal na fronteira do conjunto de Mandelbrot é precisamente a fronteira entre estas regiões estáveis e o caos. Café, ótica, iteração complexa, os objetos mais profundos da dinâmica — todos a vestir a mesma forma.",
        },
      ],
    },
    galton: {
      pretitle: "Tópico · Análise",
      title: "A Tábua de Galton",
      tagline: "Bolas a saltar desenham sempre o mesmo sino.",
      intro:
        "O quincunce de Francis Galton é um triângulo de pinos. Uma bola deixada cair do topo salta para a esquerda ou para a direita em cada pino, cinquenta-cinquenta, e aterra num dos compartimentos no fundo. Deixa cair dez mil bolas e os compartimentos enchem-se — sempre — na forma da distribuição normal. O sino não é uma coincidência. É o Teorema do Limite Central tornado tangível.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O engenho",
          title: "Uma escadaria de lançamentos justos de moeda",
          body: "Uma tábua com N filas de pinos desfasados por meio pino. Deita-se um berlinde no topo. Em cada pino que atinge, salta para a esquerda ou para a direita com igual probabilidade — um lançamento independente de moeda. Após N pinos, o berlinde caiu num de N + 1 compartimentos de recolha, onde o índice do compartimento é o número de saltos à direita menos o número de saltos à esquerda, deslocado para ser não-negativo. Um berlinde não te ensina nada. A forma só aparece no limite.",
        },
        {
          pretitle: "Passo dois · A aterragem de Pascal",
          title: "As contagens dos compartimentos são binomiais",
          body: "Após N filas, a probabilidade de o berlinde aterrar no compartimento k (numerado 0 a N) é C(N, k) / 2^N. Os numeradores são as entradas da fila N do triângulo de Pascal. Por isso, uma tábua de Galton é, secretamente, uma consulta física dos coeficientes binomiais. Com N = 10, os compartimentos centrais recebem as entradas 252, 210, 210 — e os compartimentos mais exteriores recebem a entrada 1 (apenas um caminho em 1024). A forma já é um sino discreto.",
        },
        {
          pretitle: "Passo três · O Teorema do Limite Central",
          title: "O sino é inevitável",
          body: "À medida que N cresce, a função de massa de probabilidade binomial converge para a densidade gaussiana (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). Este é o teorema de De Moivre-Laplace (1733), o primeiro caso histórico do Teorema do Limite Central. O TLC geral diz muito mais: toma QUALQUER variável aleatória com variância finita — viés, assimetria, distribuição que se danem — e soma N cópias independentes. Após reescalar, a soma converge para uma gaussiana. O sino é aquilo em que as médias sempre se tornam.",
        },
        {
          pretitle: "Passo quatro · Porque aparece em todo o lado",
          title: "Qualquer soma de muitos pequenos empurrões",
          body: "As alturas são feitas de milhares de pequenas contribuições independentes. Tal como os resultados de testes, as pontuações de QI, os erros de medição, as rentabilidades diárias financeiras (sob hipóteses restritivas). Cada uma é uma soma de muitas pequenas variáveis aleatórias independentes, pelo que cada uma é aproximadamente gaussiana. É por isso que as curvas de sino reinam na estatística e porque o desvio-padrão tem nome. A tábua de Galton é a forma mais física de ver o teorema em ação — com 1000 berlindes o sino já é suave, embora nenhum berlinde individualmente saiba o que quer que seja sobre isso.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Tópico · Caos",
      title: "O Pêndulo Magnético",
      tagline: "Pinta cada ponto inicial pelo seu vencedor — e aparece um fractal.",
      intro:
        "Suspende um pêndulo de ferro por cima de três ímanes dispostos em triângulo. Leis de Newton, atração magnética, um toque de fricção — tudo determinístico. E no entanto, a pergunta 'sobre que íman aterra?' não tem resposta suave. Pinta cada ponto inicial pelo seu eventual vencedor: bacias vermelha, verde e azul, entrelaçadas a cada escala.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A física",
          title: "Três puxões, um amortecimento, gravidade para o centro",
          body: "Monta um pequeno peso de ferro num fio flexível sobre uma placa. Coloca três ímanes idênticos na placa num triângulo equilátero. O pêndulo é atraído por cada íman com uma força proporcional a 1/r² (ou 1/r³ para um modelo de cubo inverso — ambos são usados na literatura; o fractal qualitativo aparece em qualquer dos casos). Uma mola fraca também puxa o pêndulo de volta para o centro do triângulo. A resistência do ar drena energia continuamente. As equações do movimento são determinísticas; a única incógnita é a posição inicial.",
        },
        {
          pretitle: "Passo dois · As bacias de atração",
          title: "Três regiões no espaço de pontos iniciais",
          body: "Liberta o pêndulo de um ponto inicial acima da placa e integra as equações. Por fim, a amplitude do pêndulo decai e ele assenta diretamente sobre um dos três ímanes — o vencedor. Repete para cada ponto inicial numa grelha fina, pinta cada um pelo seu vencedor: vermelho para o íman 1, verde para o 2, azul para o 3. A placa fica agora colorida em três bacias de atração. O interior de cada bacia é uma região colorida arrumada. A fronteira, porém, não é uma curva — é um fractal.",
        },
        {
          pretitle: "Passo três · A fronteira fractal",
          title: "Todo ponto fronteiriço faz fronteira com as três cores",
          body: "Faz zoom na fronteira entre quaisquer duas cores e encontras a terceira cor entrelaçada lá dentro. Faz zoom outra vez e encontras as três cores arbitrariamente perto de qualquer ponto da fronteira. Esta é a propriedade que define uma bacia de Wada — uma monstruosidade topológica descoberta por Yoneyama em 1917, depois transformada em arma pelos teóricos do caos nos anos 1990. O determinismo permanece intacto: mesmo início → mesmo resultado. Mas a mais ligeira mudança na posição inicial pode mudar a resposta para qualquer um dos três ímanes. A previsibilidade desapareceu.",
        },
        {
          pretitle: "Passo quatro · Porque isto importa",
          title: "O caos tem cor",
          body: "O pêndulo magnético é a visualização mais limpa da dependência sensível das condições iniciais em qualquer sistema mecânico clássico. O mesmo tipo de bacia fractal aparece em solucionadores do método de Newton (faz zoom na fronteira das bacias de Newton para uma cúbica e obténs a mesma imagem), em modelos do sistema solar a longo prazo, em bilhares caóticos, nos regimes de ponto fixo estável do atrator de Lorenz. Onde quer que coexistam atratores em competição, as fronteiras das suas bacias tendem a ser fractais. O mundo está cheio destas fronteiras ocultas; o pêndulo magnético apenas te deixa ver uma.",
        },
      ],
    },
    godel: {
      pretitle: "Tema · Paradoxo",
      title: "A incompletude de Gödel",
      tagline: "A matemática nunca será completa.",
      intro:
        "Kurt Gödel, Viena, 1931. Em qualquer sistema formal consistente suficientemente rico para exprimir a aritmética, há afirmações verdadeiras que o próprio sistema não consegue demonstrar. O Explorador guia-te pela numeração de Gödel e pela construção da frase autorreferencial G que diz, em aritmética, «não sou demonstrável».",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O sonho de Hilbert",
          title: "Mecanizar toda a matemática",
          body: "Início do século XX. A Principia Mathematica de Whitehead e Russell (1910–1913) tentou derivar todos os teoremas da aritmética a partir de uma única torre de axiomas lógicos. David Hilbert, no seu programa de Paris de 1900 e depois no impulso formalista dos anos 20, pediu um sistema finito e mecânico a partir do qual qualquer afirmação verdadeira pudesse ser demonstrada, e cuja consistência pudesse ser demonstrada por dentro. Uma matemática formal completa, consistente e decidível. Qualquer pessoa, com papel e paciência, poderia, em princípio, resolver qualquer questão matemática. Esse era o sonho.",
        },
        {
          pretitle: "Passo dois · Numeração de Gödel",
          title: "Aritmética que fala de si própria",
          body: "A primeira jogada de Gödel foi um truque de codificação. Atribuir a cada símbolo da linguagem formal um número — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, parênteses, variáveis, e por aí adiante. Depois codificar uma fórmula inteira (s₁, s₂, …, sₖ) como o único número natural 2^s₁ · 3^s₂ · 5^s₃ · … usando primos consecutivos. Pela unicidade da factorização em primos, a codificação é reversível. As demonstrações — sequências de fórmulas — também recebem números. De repente, propriedades como «x é uma demonstração de y» tornam-se predicados aritméticos Prov(x, y) que o próprio sistema formal consegue exprimir sobre as suas próprias afirmações.",
        },
        {
          pretitle: "Passo três · O truque diagonal",
          title: "G diz: «G não é demonstrável»",
          body: "Usando o lema diagonal — descendente directo do argumento diagonal de Cantor de 1891 — Gödel construiu uma frase G cujo número de Gödel é ⌜G⌝, e que é aritmeticamente equivalente a ¬∃x Prov(x, ⌜G⌝): «nenhum número x é uma demonstração da fórmula com número de Gödel ⌜G⌝». Em linguagem comum: G diz «não sou demonstrável neste sistema». E agora o aperto. Se G for demonstrável, o sistema demonstra uma afirmação falsa e é inconsistente. Se G for indemonstrável, então o que G afirma é exactamente verdadeiro — mas o sistema não o consegue demonstrar. De qualquer maneira, o sonho de Hilbert de uma aritmética completa e consistente desaba. O Segundo Teorema da Incompletude segue-se quase imediatamente: um tal sistema não consegue demonstrar a sua própria consistência, pois se conseguisse, demonstraria também G, contradizendo o Primeiro.",
        },
        {
          pretitle: "Passo quatro · Onde se espalhou",
          title: "Tarski, Turing, Church e todos os assistentes de prova desde então",
          body: "O mesmo truque diagonal volta a aparecer sem parar. Alfred Tarski (1933) provou que a verdade na aritmética não é definível dentro da aritmética — a indefinibilidade da verdade. Alan Turing (1936) mostrou que o problema da paragem é indecidível diagonalizando sobre máquinas de Turing. Alonzo Church (1936) provou que a própria lógica de primeira ordem é indecidível. Cada resultado é, estruturalmente, um primo do de Gödel: um sistema suficientemente rico para se descrever a si mesmo contém uma questão que não consegue responder sobre si próprio. Os assistentes de prova modernos — Coq, Lean, Isabelle, HOL — operam dentro dos limites de Gödel: conseguem mecanizar uma quantidade enorme de matemática, mas não conseguem demonstrar a sua própria consistência, e há afirmações concretas da teoria dos números (o teorema de Goodstein, Paris–Harrington) que são verdadeiras e demonstravelmente indemonstráveis na aritmética de Peano. O sonho desapareceu; o edifício é maior do que nunca.",
        },
      ],
    },
    halting: {
      pretitle: "Tema · Computação",
      title: "O problema da paragem",
      tagline: "Nenhum programa consegue prever todos os outros programas.",
      intro:
        "Alan Turing, 1936. Dado um programa P e uma entrada x, podemos sempre decidir se P pára em x? Turing disse que não — e provou-o com um truque diagonal autorreferencial que nenhuma máquina consegue esquivar. O Explorador corre alguns programas-brinquedo numa fita pequena para veres alguns a terminar, outros a correr para sempre, e um programa — o diagonal D — a torcer-se na contradição que Turing escreveu.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A pergunta",
          title: "P pára em x?",
          body: "Dado o código-fonte de um programa P e uma entrada x, decide se P acaba por terminar ou se corre para sempre. Soa a algo que um analisador suficientemente esperto devia sempre conseguir determinar — afinal, os programas são cadeias finitas de símbolos, e um computador consegue simulá-los. David Hilbert, no seu Entscheidungsproblem de 1928, pediu exactamente um procedimento universal de decisão deste tipo. Em meados da década de 1930, Alonzo Church (via o λ-cálculo) e Alan Turing (via aquilo a que hoje chamamos máquinas de Turing) estavam a aproximar-se da mesma resposta por direcções opostas.",
        },
        {
          pretitle: "Passo dois · A contradição de Turing",
          title: "Assume halts(P, x), depois constrói D",
          body: "Suponha-se, por contradição, que existe uma função computável total halts(P, x) que devolve ⊤ quando P pára na entrada x e ⊥ caso contrário. Então podemos escrever um novo programa D(P): calcula halts(P, P); se devolver ⊤, faz um ciclo infinito; se devolver ⊥, pára imediatamente. D é permitido — por hipótese, cada passo seu é computável. Pergunta agora: o que devolve halts(D, D)? Se halts(D, D) = ⊤, então, pela definição de D, o programa D entra em ciclo na entrada D — logo D não pára em D, contradizendo ⊤. Se halts(D, D) = ⊥, então D pára em D — contradizendo ⊥. Qualquer das respostas quebra a definição, portanto não pode existir tal halts. (Turing 1936, ‘On Computable Numbers, with an Application to the Entscheidungsproblem’.)",
        },
        {
          pretitle: "Passo três · Diagonalização disfarçada",
          title: "Cantor, Gödel, Turing — o mesmo movimento",
          body: "O mesmo truque alimenta a diagonal de Cantor (construir um real que difere do n-ésimo real listado no n-ésimo dígito), o primeiro teorema da incompletude de Gödel (construir uma frase que diz ‘não sou demonstrável’) e o argumento da paragem de Turing (construir um programa que faz o oposto do que o decisor diz). Cada construção alinha os candidatos numa lista e lê pela diagonal para forjar um objecto que a lista não pode conter. O problema da paragem foi o primeiro problema concreto de decisão a ser provado indecidível — o momento em que os limites da computação se tornaram um teorema.",
        },
        {
          pretitle: "Passo quatro · Porque importa hoje",
          title: "O teorema de Rice e as consequências práticas",
          body: "O teorema de Rice (Henry Gordon Rice, 1953) generaliza Turing: qualquer propriedade semântica não trivial dos programas — ‘alguma vez devolve zero?’, ‘tem fugas de memória?’, ‘é malicioso?’ — é indecidível. Os analisadores estáticos têm portanto de aproximar: reportam a mais (falsos positivos) ou a menos (bugs perdidos), nunca limpos e completos ao mesmo tempo. Os compiladores esgotam o tempo ao optimizar, recusando-se a fazer inline para lá de uma heurística. Os motores de antivírus nunca conseguem apanhar todo o malware no caso geral. Os autoscalers da cloud não podem prometer que um trabalho submetido vai parar; limitam o tempo de CPU em vez disso. O problema da paragem não é uma curiosidade — é o muro contra o qual todo o programa-sobre-programas acaba por embater.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Tema · Computação",
      title: "P vs NP",
      tagline: "A maior questão em aberto da ciência da computação.",
      intro:
        "Alguns problemas são fáceis de resolver. Outros são fáceis de verificar depois de alguém te entregar a resposta. P vs NP pergunta se essas duas classes são, no fundo, a mesma — e um sim faria estilhaçar a criptografia moderna. O Explorador é um pequeno solucionador de 3-SAT que te deixa ver porque é que a verificação é trivial mas a procura é brutal: largas uma fórmula e segues o DPLL pela árvore de backtracking enquanto este tenta atribuições e poda ramos inteiros com uma única contradição.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Duas classes de problemas",
          title: "Rapidamente resolúvel vs rapidamente verificável",
          body: "P é a classe dos problemas de decisão que uma máquina determinística consegue resolver em tempo polinomial — multiplicar dois números, ordenar uma lista, verificar se um grafo é conexo. NP é a classe em que, dada uma solução candidata, uma máquina em tempo polinomial consegue verificar se a resposta está correcta. As duas não são obviamente iguais. O Sudoku é o exemplo de manual: preencher uma grelha 9×9 é genuinamente difícil, mas se um amigo te entregar uma grelha completa consegues confirmar cada linha, coluna e caixa numa única passagem linear. A parte difícil é encontrar a solução; a parte fácil é verificá-la.",
        },
        {
          pretitle: "Passo dois · NP-completude",
          title: "Cook 1971, Karp 1972, Levin independentemente",
          body: "Em 1971 Stephen Cook provou o teorema de Cook-Levin: qualquer problema em NP reduz-se em tempo polinomial à satisfazibilidade booleana (SAT). Leonid Levin publicou o mesmo resultado independentemente na União Soviética. Um ano depois, Richard Karp mostrou que 21 problemas clássicos — 3-SAT, Caminho Hamiltoniano, Clique, Subset Sum, a versão de decisão do Caixeiro-Viajante — são todos inter-redutíveis em tempo polinomial. Hoje a lista vai aos milhares: Sudoku N×N, Tetris, Campo Minado generalizado, até modelos reticulares de dobramento de proteínas pertencem todos à mesma classe de equivalência. Resolve um eficientemente e resolveste-os todos. As reduções de Cook-Karp-Levin transformaram uma questão sobre um problema numa questão sobre todos os problemas de procura interessantes de uma vez.",
        },
        {
          pretitle: "Passo três · E se P = NP?",
          title: "A criptografia cai, a biologia verga-se, o universo torna-se aborrecido",
          body: "Um algoritmo em tempo polinomial para 3-SAT, composto com as reduções de Karp, partiria o RSA (a factorização torna-se viável), quebraria a criptografia de curva elíptica, decifraria todas as sessões TLS alguma vez registadas, e forjaria todas as assinaturas digitais. O dobramento de proteínas colapsaria numa consulta em tempo polinomial. Escalonamento óptimo, alocação óptima de registos em compiladores, planeamento óptimo de rotas — todos os problemas NP-difíceis que os engenheiros hoje aproximam — teriam soluções polinomiais exactas. A maioria dos cientistas da computação aposta contra: o inquérito ao campo feito por Scott Aaronson coloca >80% em P ≠ NP. Mas nem prova nem refutação existem. As inclusões de classes que conhecemos são P ⊆ NP ⊆ PSPACE ⊆ EXP, com P ⊊ EXP provado pelo teorema da hierarquia de tempo — pelo que pelo menos uma destas inclusões é estrita, mas ninguém sabe qual.",
        },
        {
          pretitle: "Passo quatro · O prémio de 1 milhão de dólares",
          title: "Problema do Milénio do Clay, 2000",
          body: "O Clay Mathematics Institute nomeou P vs NP como um dos sete Problemas do Prémio do Milénio em Maio de 2000, com um prémio de 1 000 000 de dólares para uma resolução correcta em qualquer dos sentidos. É o único dos sete que toca directamente na tecnologia do dia-a-dia. Dezenas de demonstrações falsas circulam todos os anos — o anúncio de Vinay Deolalikar em 2010 foi a tentativa recente mais notada e desfez-se em semanas. A expectativa da comunidade é de que a resposta seja P ≠ NP. A questão por resolver não é qual é a resposta, mas porquê — e qual o fragmento da matemática que conterá a técnica certa de minoração. Mais de quarenta anos de barreiras (relativização, provas naturais, algebrização) dizem que não virá de nenhum método que conheçamos hoje.",
        },
      ],
    },
    rsa: {
      pretitle: "Tema · Computação",
      title: "RSA e funções de mão única",
      tagline: "Multiplicar é fácil. Factorizar é impossível.",
      intro:
        "Rivest, Shamir e Adleman, 1977 — o primeiro criptossistema de chave pública publicado e ainda, quase meio século depois, aquele que protege a maior parte da internet em funcionamento. O Explorador percorre uma geração de chaves RSA completa, cifra e decifra com números pequenos para veres cada passo: escolher primos, derivar os expoentes público e privado, depois cifrar uma mensagem e ver a mesma matemática a abri-la de novo.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A assimetria",
          title: "Funções de mão única: fáceis para a frente, difíceis para trás",
          body: "Multiplicar dois primos enormes p e q é rápido — uns milissegundos num telemóvel. Recuperar p e q a partir do seu produto n = p · q não é: o melhor algoritmo clássico conhecido (o crivo geral do corpo de números) corre em tempo sub-exponencial mas super-polinomial, e um n de 2048 bits está confortavelmente fora do alcance de qualquer máquina alguma vez construída. Esta propriedade de mão única — barata para a frente, ruinosamente cara para trás — é o fundamento da criptografia de chave pública. O RSA veste esta assimetria de modo a que uma chave pública possa ser entregue a qualquer pessoa e só o detentor da chave privada correspondente consiga ler o que foi escrito de volta.",
        },
        {
          pretitle: "Passo dois · Geração de chaves",
          title: "Escolhe e, deriva d pelo Euclides estendido",
          body: "Calcula φ(n) = (p − 1)(q − 1), a totiente de Euler — o número de inteiros em [1, n] coprimos com n. Escolhe um pequeno expoente público e coprimo com φ(n); 65537 é a escolha canónica porque é primo, tem apenas dois bits a 1, e resiste a todos os ataques conhecidos de expoente baixo. Calcula depois o expoente privado d = e⁻¹ mod φ(n) usando o algoritmo de Euclides estendido: ele devolve coeficientes de Bézout (x, y) com e·x + φ(n)·y = 1, e reduzir x mod φ(n) dá d. A chave pública é o par (n, e); a chave privada é (n, d). Deita fora p e q assim que tiveres d na mão.",
        },
        {
          pretitle: "Passo três · Cifrar e decifrar",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Trata o texto-claro m como um inteiro em [0, n). O criptograma é c = m^e mod n; a decifração é m = c^d mod n. A razão por que funciona vem directamente de Euler e Fermat: como ed ≡ 1 mod φ(n), temos m^(ed) = m^(1 + kφ(n)) ≡ m mod n para todo o m coprimo com n (teorema de Euler), e um pequeno argumento com o teorema chinês dos restos estende a identidade a todo o m em [0, n). Square-and-multiply transforma os expoentes gigantescos em alguns milhares de multiplicações modulares — rápido na prática, matematicamente exacto.",
        },
        {
          pretitle: "Passo quatro · Onde está hoje",
          title: "Do TLS à migração pós-quântica",
          body: "O RSA é a matemática por baixo de cada aperto de mão TLS que o teu browser ainda negoceia com um certificado RSA, por baixo das chaves de host SSH, por baixo das cadeias de assinatura de código que autenticam apps da Apple e da Google, por baixo dos passaportes electrónicos e das primeiras gerações de blockchain. Mas em 1994 Peter Shor escreveu um algoritmo quântico que factoriza inteiros em tempo polinomial — dado um computador quântico tolerante a falhas suficientemente grande, o RSA quebra. Ainda não existe nenhum, mas o calendário é incerto o bastante para que o NIST tenha padronizado substituições pós-quânticas (CRYSTALS-Kyber para troca de chaves em 2024, CRYSTALS-Dilithium para assinaturas) e a migração global já esteja em curso.",
        },
      ],
    },
    mobius: {
      pretitle: "Tema · Geometria",
      title: "Fita de Möbius e garrafa de Klein",
      tagline: "Superfícies com um único lado.",
      intro:
        "Pega numa tira de papel, dá-lhe meia volta, cola as pontas — e tens uma superfície com um lado e uma aresta. O Explorador desenha uma fita de Möbius em 3D a rodar que podes cortar em diferentes proporções para ver o que cai: corta a meio e fica numa peça só; corta a um terço e ficas com dois anéis entrelaçados. Um botão alterna para a garrafa de Klein, o análogo fechado que precisa de quatro dimensões para viver sem se cruzar a si mesmo.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A meia volta",
          title: "Cola as pontas com um giro",
          body: "Pega numa tira de papel rectangular. Dá meia volta (180°) a uma das pontas antes de a colar à outra. O resultado tem uma aresta e um lado. Anda ao longo dela com uma caneta e cobres aquilo que parecem ‘os dois lados’ sem nunca cruzar a fronteira; segue o bordo e voltas ao ponto de partida depois de ir à volta duas vezes. Descoberta independentemente por August Ferdinand Möbius e Johann Benedict Listing em 1858 — a primeira superfície não-orientável alguma vez escrita explicitamente. A sua característica de Euler é χ = 0.",
        },
        {
          pretitle: "Passo dois · Surpresas com tesoura",
          title: "O que as tesouras revelam sobre topologia",
          body: "Corta a fita de Möbius a meio. Não se parte — obténs uma fita mais comprida com duas voltas completas (quatro meias voltas), e crucialmente essa fita volta a ter dois lados. Corta uma fita de Möbius a um terço da distância a uma das arestas, mantendo o corte paralelo à aresta ao longo de toda a volta, e a tesoura percorre o caminho duas vezes antes de fechar o ciclo: saem dois anéis entrelaçados, um uma nova fita de Möbius e outro uma fita estilo-Möbius mais comprida com voltas extra, enlaçados um no outro. A topologia está cheia destas surpresas — o giro global escondido pela planura local.",
        },
        {
          pretitle: "Passo três · A garrafa de Klein",
          title: "Felix Klein, 1882",
          body: "Agora pega num tubo e cola uma extremidade à outra depois de o passar através da parede do tubo — fazendo coincidir os círculos com orientações opostas. Num espaço a quatro dimensões isto é uma superfície perfeitamente lisa, fechada e não-orientável: sem fronteira, sem interior, sem exterior. Felix Klein descreveu-a em 1882. Em três dimensões a passagem pela parede obriga o tubo a atravessar-se a si mesmo, pelo que toda a garrafa de Klein em vidro que alguma vez viste é uma imersão, não um verdadeiro mergulho. Cola duas fitas de Möbius pelas suas únicas arestas e o resultado é exactamente uma garrafa de Klein.",
        },
        {
          pretitle: "Passo quatro · Onde vivem",
          title: "Das correias de transmissão à química",
          body: "As fitas de Möbius aparecem como correias transportadoras e correias de impressoras (o desgaste distribui-se por toda a superfície, duplicando a vida útil), como as esculturas Endless Ribbon de Max Bill, como resistências de Möbius que cancelam a sua própria auto-indutância, como guias de onda supercondutores de micro-ondas em forma de Möbius — e, desde 2003, como moléculas aromáticas de Möbius sintetizadas por Rainer Herges. O familiar triângulo da reciclagem é, em rigor, um nó trefólio e não uma fita de Möbius, mas o público lê-o como uma. Acima de tudo, a fita de Möbius e a garrafa de Klein são as portas de entrada para a classificação das superfícies — o teorema que diz que toda a superfície fechada está determinada, a menos de homeomorfismo, pelo género, pela orientabilidade e por um único inteiro χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Tema · Geometria",
      title: "Característica de Euler",
      tagline: "V − E + F = 2, seja qual for a forma.",
      intro:
        "Descartes escreveu-a em 1639 e Euler redescobriu-a um século mais tarde: conta os vértices, arestas e faces de qualquer poliedro convexo e V − E + F dá sempre 2. O Explorador percorre os sólidos platónicos e arquimedianos e contabiliza V, E, F ao vivo — vês a fórmula a manter-se no cubo, no dodecaedro e na bola de futebol. Depois dobra a superfície à volta de um donut e vê a constante mudar.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · Conta vértices, arestas, faces",
          title: "A constante que se recusa a mexer",
          body: "Pega num cubo: 8 vértices, 12 arestas, 6 faces. Subtrai e soma: 8 − 12 + 6 = 2. Tenta um tetraedro: 4 − 6 + 4 = 2. A bola de futebol — um icosaedro truncado, doze pentágonos e vinte hexágonos cosidos pelas arestas — tem 60 vértices, 90 arestas, 32 faces, e 60 − 90 + 32 = 2 outra vez. Percorre todos os sólidos platónicos e arquimedianos que os gregos alguma vez desenharam, e a resposta é a mesma. A constante não é coincidência.",
        },
        {
          pretitle: "Passo dois · Topologia, não geometria",
          title: "Aperta o cubo para dentro de uma esfera",
          body: "Insufla o cubo até inchar numa esfera perfeita. Os cantos arredondam-se, as arestas direitas curvam, as faces planas estufam para fora — V − E + F continua a ser 2. O mesmo é verdade se o esmagares em panqueca, o torceres em ovo, ou o esticares para qualquer forma que quiseres, desde que não rasgues, coles ou abras um buraco. O número depende apenas da topologia. χ = 2 para qualquer forma topologicamente equivalente a uma esfera — para a superfície de qualquer poliedro convexo, qualquer ovóide liso, qualquer batata.",
        },
        {
          pretitle: "Passo três · Os buracos fazem-na baixar",
          title: "Cada alça custa-te dois",
          body: "Agora envolve a superfície à volta de um donut. Triangula o toro como quiseres — V − E + F cai para 0. Um toro duplo, dois donuts colados lado a lado, dá χ = −2. A regra é χ = 2 − 2g, em que g é o número de buracos (o género). Cada alça que coses custa-te 2. A característica de Euler mede a topologia num único inteiro: diz-te quantos buracos tem uma superfície fechada, independentemente de como esteja desenhada ou esticada.",
        },
        {
          pretitle: "Passo quatro · Porque importa",
          title: "Das bolas de futebol à Medalha Fields",
          body: "A química dos buckyballs é forçada por χ: cada gaiola de fulereno construída a partir de pentágonos e hexágonos tem de conter exactamente 12 pentágonos, porque a característica de Euler de uma esfera é 2. As cúpulas geodésicas de Buckminster Fuller seguem a mesma regra. Os fatiadores de impressão 3D usam V − E + F para validar que uma malha é fechada e imprimível. Gauss-Bonnet relaciona a curvatura total de uma superfície lisa com 2π·χ, ligando geometria a topologia numa única equação. O teorema do índice de Atiyah-Singer (Medalha Fields 1966) é o descendente moderno da mesma ideia — e Proofs and Refutations de Lakatos traça os dois séculos de casos-limite que quase partiram V − E + F = 2 e depois o reforçaram.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Tema · Análise",
      title: "As pontes de Königsberg",
      tagline: "Sete pontes, um passeio impossível.",
      intro:
        "Conseguirias atravessar Königsberg, cruzar cada ponte exactamente uma vez, e voltar ao ponto de partida? O Explorador deixa-te tentar o passeio, ver o argumento de paridade ao vivo à medida que atravessas cada ponte, e adicionar ou remover pontes para tornar o passeio possível.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · O enigma",
          title: "Um passeio que ninguém conseguia encontrar",
          body: "Königsberg atravessava o rio Pregel com duas ilhas e duas margens — quatro massas de terra ao todo — ligadas por sete pontes. Os habitantes faziam uma pergunta de passeio de domingo: conseguirias dar uma volta pela cidade que cruzasse cada ponte exactamente uma vez e terminasse onde tinhas começado? Toda a gente tentou. Toda a gente falhou. Ninguém conseguia provar que era impossível.",
        },
        {
          pretitle: "Passo dois · A redução de Euler",
          title: "A geometria torna-se topologia",
          body: "Em 1736 Leonhard Euler fez algo que ninguém tinha feito antes. Ignorou distâncias. Ignorou ângulos. Ignorou qual ponte estava a montante de qual. Desenhou as quatro massas de terra como quatro pontos e as sete pontes como sete arestas. O mapa tornou-se um grafo. O problema da posição — geometria situs — nasceu, e com ele a teoria dos grafos e a topologia.",
        },
        {
          pretitle: "Passo três · O argumento de paridade",
          title: "Cada massa de terra precisa de uma contagem par",
          body: "Cada vez que entras numa massa de terra, usas uma ponte; quando sais, usas outra. Logo, cada massa de terra precisa de um número par de pontes incidentes — excepto, possivelmente, o início e o fim do passeio. Königsberg tinha quatro massas de terra, todas com um número ímpar de pontes. Quatro vértices de grau ímpar são dois a mais. Impossível.",
        },
        {
          pretitle: "Passo quatro · O nascimento da teoria dos grafos",
          title: "De um passeio de domingo ao mundo moderno",
          body: "O mesmo argumento de paridade alimenta hoje o encaminhamento por GPS, o Problema do Carteiro Chinês (usado para optimizar rotas de limpa-neves, camiões do lixo e carteiros), e a montagem de ADN — todo o moderno montador de genomas percorre um caminho euleriano num grafo de de Bruijn. A Segunda Guerra Mundial destruiu duas das pontes de Königsberg; apenas cinco das sete originais restam. O grafo actual tem exactamente dois vértices de grau ímpar, pelo que hoje o passeio é finalmente possível — embora Euler já cá não esteja para o fazer.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Tema · Análise",
      title: "O teorema das quatro cores",
      tagline: "Qualquer mapa plano precisa, no máximo, de quatro cores.",
      intro:
        "Qualquer mapa desenhado no plano pode ser colorido com, no máximo, quatro cores, de tal forma que duas regiões que partilham fronteira nunca recebem a mesma cor. O Explorador deixa-te construir mapas e ver um algoritmo de coloração com backtracking atribuir no máximo quatro cores — região a região, sempre com a menor escolha válida.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A conjectura",
          title: "Francis Guthrie, 1852",
          body: "Enquanto coloria um mapa dos condados de Inglaterra, o jovem Francis Guthrie reparou que quatro cores pareciam chegar sempre. Perguntou ao seu irmão Frederick, que perguntou ao seu professor Augustus De Morgan, que perguntou a toda a gente. A conjectura parecia inofensiva — e atrapalhou os matemáticos durante 124 anos. Várias demonstrações publicadas (Kempe 1879, Tait 1880) revelaram-se conter falhas subtis que ninguém detectou durante mais de uma década.",
        },
        {
          pretitle: "Passo dois · Porque é que três não chegam e cinco são demais",
          title: "Quatro é o limite exacto",
          body: "Três cores demonstravelmente não chegam — quatro regiões mutuamente adjacentes já podem ser desenhadas no plano (pensa em três países a encontrarem-se num canto com um quarto a envolvê-los). O teorema das cinco cores, devido a Heawood em 1890, demonstra-se numa página usando a fórmula de Euler V − E + F = 2 e um cuidadoso argumento de graus. Fechar a lacuna de cinco para quatro foi o que demorou mais oitenta e seis anos.",
        },
        {
          pretitle: "Passo três · A demonstração de Appel-Haken, 1976",
          title: "O primeiro teorema demonstrado por computador",
          body: 'Kenneth Appel e Wolfgang Haken, na Universidade do Illinois, reduziram o problema a uma lista finita de 1834 "configurações inevitáveis" — e mostraram depois que cada uma é redutível. A sua demonstração correu num IBM 360 durante cerca de 1200 horas. Muitos matemáticos recusaram-se a aceitá-la: uma demonstração que um humano não consegue ler na íntegra, argumentaram, não é uma demonstração. A correspondência de saída do departamento de matemática da Universidade do Illinois levou durante anos o carimbo "Four Colors Suffice".',
        },
        {
          pretitle: "Passo quatro · Onde está hoje",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier, e mais além",
          body: "Em 1996 Robertson, Sanders, Seymour e Thomas simplificaram a demonstração para 633 configurações e um argumento de descarga mais limpo. Em 2005 Georges Gonthier mecanizou a demonstração inteira dentro do assistente de prova Coq — todo o passo lógico, incluindo a análise de casos, verificado pela máquina de ponta a ponta. O teorema alimenta hoje a atribuição de frequências em redes celulares, a alocação de registos em compiladores, e problemas de escalonamento e de horários sempre que os conflitos formam um grafo planar.",
        },
      ],
    },
    smallworld: {
      pretitle: "Tema · Análise",
      title: "Seis graus e mundos pequenos",
      tagline: "Duas pessoas quaisquer, a seis apertos de mão de distância.",
      intro:
        "Stanley Milgram enviou cartas a desconhecidos e descobriu que, em média, seis reenvios as faziam atravessar a América. Quarenta anos depois, Watts e Strogatz mostraram porquê: uma pitada de atalhos aleatórios numa rede de resto regular colapsa o comprimento médio dos caminhos sem tocar no clustering local. O Explorador deixa-te ajustar a probabilidade de re-ligação de Watts-Strogatz p e ver o comprimento médio dos caminhos L colapsar em tempo real.",
      ctaInteractive: "→ Abrir o Explorador",
      sections: [
        {
          pretitle: "Passo um · A experiência das cartas",
          title: "Milgram, 1967",
          body: "Stanley Milgram, então em Harvard, enviou cartas a pessoas aleatórias em Omaha e em Wichita e pediu-lhes que reencaminhassem a carta, mão a mão, para um corretor da bolsa em Boston — mas apenas através de alguém que conhecessem pessoalmente, em termos de primeiro nome. A maioria das cartas nunca chegou. As que chegaram precisaram, em média, de cerca de seis elos entre remetente e destino. Nasceu a expressão da cultura pop «seis graus de separação». O atalho: a sociedade tem hubs, e os hubs fazem a maior parte do encaminhamento.",
        },
        {
          pretitle: "Passo dois · Watts e Strogatz, 1998",
          title: "Re-ligar com probabilidade p",
          body: "Começa por uma rede em anel: N nós num círculo, cada um ligado aos seus k vizinhos mais próximos de cada lado. O grafo tem clustering C alto — os teus amigos são amigos uns dos outros — mas um comprimento médio de caminho L longo, da ordem de N/k. Agora re-liga cada aresta com probabilidade p a um destino aleatório. À medida que p sobe a partir de 0, L colapsa logaritmicamente enquanto C mal se mexe. Uns quantos atalhos aleatórios encolhem o mundo. O ponto certo, à volta de p ≈ 0,01 a 0,1, é o regime de mundo pequeno: C alto como uma rede regular, L baixo como um grafo aleatório.",
        },
        {
          pretitle: "Passo três · Onde o mundo é mesmo pequeno",
          title: "Filmes, cérebros, redes, a web",
          body: "Os grafos de colaboração académica deram-nos o número de Erdős; Hollywood deu-nos o número de Bacon (o jogo «Seis Graus de Kevin Bacon»). O verme C. elegans tem um cérebro de 302 neurónios perfeitamente mapeado com conectividade de mundo pequeno; os conectomas humanos mostram a mesma assinatura a uma escala muito maior. Redes eléctricas, a Internet, redes de citações, o grafo de ligações da Wikipédia, redes de interacção de proteínas — o regime de mundo pequeno continua a aparecer onde quer que alguém se dê ao trabalho de medir L e C. O mundo é pequeno, estruturalmente, em quase todo o lado.",
        },
        {
          pretitle: "Passo quatro · Consequências",
          title: "Propagação rápida, procura inteligente, cérebros doentes",
          body: "Em redes de mundo pequeno, vírus, rumores e ideias chegam a toda a gente depressa — maravilhoso para a difusão de inovação, terrível durante uma pandemia. Kleinberg (2000) provou que a procura gulosa descentralizada só tem sucesso em mundos pequenos quando a distribuição dos atalhos tem o expoente certo, explicando porque é que os reenviadores de Milgram conseguiam efectivamente encontrar o destinatário. E a neurociência clínica usa hoje coeficientes de mundo pequeno (σ, ω) como biomarcadores: tanto a doença de Alzheimer como a esquizofrenia mostram desvios mensuráveis face à assinatura saudável de mundo pequeno.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Agora experimenta.",
    readyToFly: "Pronto para voar?",
    yourTurn: "É a tua vez.",
    stepIntoIt: "Entra.",
    buildWithOne: "Constrói com uma só pedra.",
  },
};
