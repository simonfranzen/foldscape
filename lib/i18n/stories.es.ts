import type { StoriesDict } from "./stories";

export const es: StoriesDict = {
  sectionLabels: {
    cathedral: "Catedral",
    atelier: "Taller",
    resonance: "Resonancia",
    story: "Historia",
    explorer: "Explorador",
    sandbox: "Espacio de pruebas",
    sound: "Sonido",
  },
  pages: {
    mandelbrot: {
      pretitle: "Tema II · Caos",
      title: "El conjunto de Mandelbrot",
      tagline: "Eleva al cuadrado y suma. Para siempre.",
      intro:
        "Uno de los objetos más fotografiados de la matemática es la visualización de una regla absurdamente simple. Abajo: cuál es la regla, qué estamos mirando en realidad y un botón directo al Explorador para cuando quieras volar.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La regla",
          title: "Elige un número complejo y, luego, itera",
          body: "Elige cualquier número complejo c. Empieza una sucesión en z₀ = 0 y aplica una y otra vez zₙ₊₁ = zₙ² + c. Esa es toda la regla. Después hacemos una única pregunta de sí o no: ¿la sucesión permanece acotada, o termina escapando al infinito? El conjunto de valores de c para los que la sucesión permanece acotada es el conjunto de Mandelbrot. Todo lo demás, incluida la famosa imagen, no es más que una respuesta colorida a esa pregunta.",
        },
        {
          pretitle: "Paso dos · Observar la órbita",
          title: "Tres puntos, tres destinos",
          body: "Ayuda ver la sucesión en acción. Para un c en lo profundo del conjunto, la órbita se cierra sobre un pequeño bucle y no lo abandona nunca. Para un c justo fuera, la órbita se aleja y explota en unos pocos pasos. Para un c sobre la frontera, la órbita baila eternamente, sin asentarse y sin escapar. Los tres paneles animados de abajo muestran esos tres regímenes en paralelo.",
        },
        {
          pretitle: "Paso tres · Por qué la imagen es infinita",
          title: "La frontera nunca se simplifica",
          body: "En cuanto coloreas cada c según la rapidez con que su órbita escapa, la frontera se enciende. Lo asombroso, demostrado por Tan Lei y otros, es que la frontera es autosemejante en un sentido profundo: dondequiera que hagas zoom encontrarás nuevas copias minúsculas de la forma entera, rodeadas de filigrana que nunca se repite. Por eso el Explorador llega hasta un zoom de 10¹⁰: realmente hay algo nuevo a cada escala.",
        },
        {
          pretitle: "Paso cuatro · Los puntos fijos",
          title: "Donde se esconde la matemática",
          body: "Dentro de la gran cardioide central, la iteración converge a un único punto fijo. Dentro de cada disco redondo pegado a ella converge a un 2-ciclo, luego a un 4-ciclo, luego a 8: la misma cascada de duplicación de período que la del mapa logístico. El conjunto de Mandelbrot es, en un sentido preciso, un mapa de dónde la historia logística es tranquila y dónde se vuelve caótica. Dos famosos sistemas caóticos, una sola imagen.",
        },
      ],
    },
    life: {
      pretitle: "Tema III · Computación",
      title: "El Juego de la Vida de Conway",
      tagline: "Cuatro reglas. Y siguen universos.",
      intro:
        "Conway publicó las reglas en 1970 en una columna de Scientific American. Dos páginas de revista, cuatro líneas de regla, y una comunidad de matemáticos ha pasado cincuenta años descubriendo lo que ya estaba dentro. El Espacio de pruebas te deja dibujar y ejecutar cualquier patrón, pero primero: las cuatro reglas en acción.",
      ctaInteractive: "→ Abrir el Espacio de pruebas",
      sections: [
        {
          pretitle: "Paso uno · Las reglas",
          title: "Nacimiento, supervivencia, muerte — y nada más",
          body: "La cuadrícula es infinita, cada célula está viva o muerta, y cada una observa a sus ocho vecinas. Si una célula muerta se encuentra rodeada por exactamente tres vecinas vivas, se enciende; si una célula viva ya cuenta con dos o tres vecinas vivas, pasa entera al siguiente paso. Cualquier otro caso —muy pocas vecinas, demasiadas, ninguna— la mata. Las cuatro demos animadas de abajo muestran cómo cada regla se dispara en una cuadrícula de cinco por cinco.",
        },
        {
          pretitle: "Paso dos · De las reglas al movimiento",
          title: "El Planeador camina",
          body: "Un patrón de cinco células, el Planeador, es el objeto en movimiento más pequeño de Life. Mira cómo avanza. Tras cuatro generaciones ha vuelto a su forma original, pero desplazado una célula en diagonal. Así funciona el movimiento en un mundo que no tiene noción de movimiento: una forma que, tras unas cuantas aplicaciones de las reglas, se iguala a sí misma en otro sitio.",
        },
        {
          pretitle: "Paso tres · Del movimiento a la computación",
          title: "Los planeadores transportan información",
          body: "Si un planeador se mueve, puede apuntarse. Si puede apuntarse, puede colisionar con otros planeadores. A partir de las colisiones se construyen Y, O, NO — y de ahí, cualquier circuito booleano. Se han construido máquinas de Turing, simuladores del propio Game of Life e incluso computadoras programables completas únicamente a base de planeadores cuidadosamente dispuestos. El Espacio de pruebas incluye el preajuste del Cañón de Planeadores de Gosper: un patrón que dispara un planeador cada treinta generaciones, para siempre.",
        },
        {
          pretitle: "Paso cuatro · Lo que esto nos enseña",
          title: "La complejidad no necesita reglas complejas",
          body: "La afirmación más profunda es filosófica. Life muestra que una estructura sofisticada — movimiento, replicación, computación, incluso conciencia, si crees las versiones fuertes — puede caber en una regla lo bastante pequeña para escribirla en una postal. Es la misma lección que ofrece eml para el análisis, NAND para la lógica y la Regla 110 para los autómatas celulares. Un primitivo pequeño, aplicado con disciplina, basta.",
        },
      ],
    },
    nand: {
      pretitle: "Tema · Lógica",
      title: "La barra de Sheffer",
      tagline: "Una sola puerta basta para toda la lógica digital.",
      intro:
        "La puerta NAND es el hardware más simple que puedes tener en la cabeza. El Constructor te deja alternar entre puertas y ver cómo su esqueleto de NAND se actualiza en tiempo real.",
      ctaInteractive: "→ Abrir el Constructor",
      sections: [
        {
          pretitle: "Paso uno · La puerta",
          title: "Cuatro líneas, fijadas en 1913",
          body: "La barra de Henry Sheffer (a ↑ b) es la negación del AND. Devuelve 1 salvo cuando ambas entradas son 1. El artículo de Sheffer de 1913 demostró que este único operador — junto con constantes y variables — puede expresar cualquier proposición de la lógica booleana clásica. Charles Sanders Peirce había anotado discretamente el mismo hecho en un manuscrito inédito treinta años antes; ambos llegaron al resultado de forma independiente.",
        },
        {
          pretitle: "Paso dos · Construir todo lo demás",
          title: "La misma piedra, muchas formas",
          body: "El truco es la composición. Realimenta la salida de un NAND a otro NAND, conectando a veces una copia de una entrada consigo misma, y las cuatro puertas clásicas aparecen casi enseguida. NOT es un NAND. AND son dos. OR son tres. XOR son cuatro. Cualquier otra expresión booleana puede ensamblarse a partir de esas.",
        },
        {
          pretitle: "Paso tres · Por qué los chips lo aprovechan",
          title: "Un mar de NAND en el silicio",
          body: "Los transistores CMOS implementan NAND con cuatro transistores — menos que AND u OR. Como toda expresión booleana se reduce a NANDs, los diseñadores de chips suelen sintetizar circuitos enteros con nada más: una fila de celdas NAND idénticas, conectadas en sumadores, multiplexores, memoria y, al final, una CPU. Cualquier computador moderno es, físicamente, la barra de Sheffer iterada unos cuantos miles de millones de veces.",
        },
        {
          pretitle: "Paso cuatro · El otro lado",
          title: "NAND ganó el chip, NOR ganó la Luna",
          body: "NOR (¬(a ∨ b)) es la otra puerta única funcionalmente completa. El Apollo Guidance Computer que llevó humanos a la Luna estaba construido íntegramente con puertas NOR. NAND ganó la carrera del chip de consumo; NOR ganó la Luna. Dos maneras de construir un universo — elige tu bando.",
        },
      ],
    },
    iota: {
      pretitle: "Tema · Computación",
      title: "El combinador Iota",
      tagline: "Un símbolo, Turing-completo.",
      intro:
        "Iota es la base de un solo combinador más simple que se conoce: una única regla de reescritura de la que se sigue toda función computable. El Reductor lee cualquier expresión SKI o Iota y la reescribe, paso a paso, hasta su forma normal.",
      ctaInteractive: "→ Abrir el Reductor",
      sections: [
        {
          pretitle: "Paso uno · Lógica combinatoria",
          title: "Dos letras que lo computan todo",
          body: "En la década de 1920 Moses Schönfinkel y Haskell Curry demostraron que toda la computación podía construirse con dos reglas minúsculas. Llámalas S y K. Toman otras cosas como entrada y las reordenan — sin variables. Juntas forman el cálculo combinatorio SKI, que es demostrablemente tan potente como cualquier cálculo lambda, cualquier lenguaje de programación, cualquier máquina de Turing.",
        },
        {
          pretitle: "Paso dos · Un solo símbolo",
          title: "El Iota de Chris Barker",
          body: "En 2001, Chris Barker encontró un único combinador que contiene tanto S como K. Lo llamó Iota (ι, ℩) y lo definió como ι x = x S K. A partir de esa única línea, S y K pueden re-derivarse. Aplica Iota a Iota en un patrón concreto y sale S. Otro patrón da K. Con nada más que el símbolo ι y paréntesis, cualquier función computable puede expresarse.",
        },
        {
          pretitle: "Paso tres · La forma de una demostración",
          title: "Universalidad en un único símbolo",
          body: "El argumento es breve. La definición de Iota da x S K cuando se aplica a x. Elige x con astucia — Iota de nuevo, aplicado a Iota, aplicado a Iota — y el desarrollo va pelando capas hasta dejar solo K. Otro patrón distinto deja solo S. Como S y K juntos son Turing-completos (Schönfinkel, 1924) e Iota produce ambos, Iota por sí solo también debe serlo.",
        },
        {
          pretitle: "Paso cuatro · Por qué importa",
          title: "Un recibo filosófico",
          body: "Iota no produce programas rápidos ni legibles — produce demostraciones de existencia. Cualquier algoritmo que pueda escribirse en cualquier lenguaje puede codificarse como una expresión Iota. El Reductor de la sala de al lado te permite teclear una expresión y verla reescribirse, paso a paso, hasta su forma normal (cuando existe). Es la computación en su forma más pelada: un único símbolo, una única regla, toda la matemática.",
        },
      ],
    },
    rule110: {
      pretitle: "Tema · Computación",
      title: "Regla 110",
      tagline: "Una regla de ocho bits, demostrablemente universal.",
      intro:
        "Un byte de regla, aplicado a una fila de bits, basta para codificar cualquier computación. El Simulador te deja cambiar la regla, la semilla y la velocidad en vivo.",
      ctaInteractive: "→ Abrir el Simulador",
      sections: [
        {
          pretitle: "Paso uno · El planteamiento",
          title: "Una fila de células, una regla, repetir",
          body: "Un autómata celular elemental corre sobre una fila de células, cada una negra o blanca. La siguiente generación se dibuja debajo: cada célula se mira a sí misma y a sus dos vecinas inmediatas — tres células — y decide su color según una regla fija. Ocho patrones posibles de vecindad; para cada uno, una respuesta de un solo bit. Ocho bits = un byte = una de 256 reglas posibles. Stephen Wolfram las numeró del 0 al 255 en binario.",
        },
        {
          pretitle: "Paso dos · Leer la regla 110",
          title: "Ocho patrones, un byte",
          body: "Escribe los ocho patrones de tres células en orden binario descendente: 111, 110, 101, …, 000. Debajo de cada patrón anota el valor de la siguiente generación para la célula central. Lee la fila de respuestas como un solo número binario — para la regla 110 sale 01101110, que es 110 en decimal. La regla es justamente ese byte.",
        },
        {
          pretitle: "Paso tres · Un píxel hace nacer un universo",
          title: "Empieza con un único punto",
          body: "Siembra la fila superior con una sola célula negra, todo lo demás blanco. Aplica la regla; dibuja la siguiente generación debajo. Repite durante unos cientos de filas. Con la regla 110 el resultado no es ni el aburrido todo-negro/todo-blanco de reglas como la 0 o la 255, ni el simple Sierpiński de la regla 90 — es un tráfico permanente y en movimiento de planeadores triangulares sobre un fondo rayado, apilado en algo que de verdad nunca se asienta.",
        },
        {
          pretitle: "Paso cuatro · La demostración de Cook",
          title: "Es, demostrablemente, una computadora",
          body: "A finales de los noventa, Matthew Cook mostró cómo disponer patrones de planeadores concretos en la regla 110 para que sus colisiones funcionaran como puertas lógicas — y luego cómo ensamblar un sistema de etiquetas cíclico, que ya es Turing-completo. La demostración es intrincada, pero la consecuencia es limpia: esta regla de ocho bits, aplicada a una fila de bits, es universal. Cualquier cómputo que puedas hacer, puedes hacerlo con la regla 110.",
        },
      ],
    },
    logistic: {
      pretitle: "Tema · Caos",
      title: "El mapa logístico",
      tagline: "Una fórmula inocente donde el orden cae al caos.",
      intro:
        "Un modelo de bolsillo para la población del año que viene que, con girar un solo dial, se convierte en el trozo de caos más estudiado de la matemática. El Explorador te deja girar ese dial en tiempo real.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La fórmula",
          title: "Una fórmula para la población de mañana",
          body: "La ecuación logística de 1845 de Pierre-François Verhulst, muestreada en tiempo discreto, da el mapa xₙ₊₁ = r · xₙ · (1 − xₙ). Lee x como una fracción de la capacidad de carga, entre 0 y 1; r como la tasa de crecimiento. El término (1 − x) es el freno — demasiados individuos hacen pasar hambre a la siguiente generación. Con 0 ≤ r ≤ 4, la iteración permanece acotada.",
        },
        {
          pretitle: "Paso dos · De la paz al caos",
          title: "Duplicar, duplicar, desaparecer",
          body: "Para r por debajo de 1 toda población se extingue. De 1 a 3 se asienta en un único punto fijo — una población estable. En r = 3 el punto fijo pierde la estabilidad y se desdobla en un 2-ciclo: este año arriba, el próximo abajo. En r ≈ 3,449 el 2-ciclo pasa a 4-ciclo, en r ≈ 3,544 a 8-ciclo, y las duplicaciones se acumulan cada vez más rápido hasta que, en r ≈ 3,56995, el sistema cae por fin al caos.",
        },
        {
          pretitle: "Paso tres · La constante universal de Feigenbaum",
          title: "Un número que viaja entre sistemas",
          body: "Mide la razón entre las longitudes de dos intervalos sucesivos de duplicación. El número que sale es δ ≈ 4,66920… — la constante de Mitchell Feigenbaum. Lo asombroso es que la misma constante aparece en sistemas totalmente sin relación: el mapa de Hénon, el oscilador de Duffing, incluso experimentos de convección de fluidos. La duplicación de período es una ruta universal al caos, y δ es su huella dactilar.",
        },
        {
          pretitle: "Paso cuatro · Islas de orden",
          title: "Dónde se esconde la calma dentro del caos",
          body: "Dentro del régimen caótico, el sistema vuelve de pronto a un 3-ciclo estable en r ≈ 1 + √8 ≈ 3,8284. Desde allí vuelve a duplicarse — periodo 6, 12, 24 — y reentra en el caos. El teorema de Li-Yorke deja la moraleja en términos rigurosos: 'periodo tres implica caos'. El artículo de Robert May de 1976, 'Simple mathematical models with very complicated dynamics', puso la historia entera delante de los biólogos. No se ha ido desde entonces.",
        },
      ],
    },
    lorenz: {
      pretitle: "Tema · Caos",
      title: "El atractor de Lorenz",
      tagline: "Tres líneas de código, una mariposa.",
      intro:
        "Un modelo de juguete de la atmósfera que inventó por accidente la teoría del caos. El Explorador integra las ecuaciones en vivo y te deja mirar cómo la trayectoria se niega a repetirse.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Una atmósfera de juguete",
          title: "Lorenz, 1963",
          body: "Edward Lorenz, meteorólogo del MIT, intentaba simular la convección — aire calentado por abajo y enfriado por arriba. Con Ellen Fetter ocupándose de las corridas numéricas y Margaret Hamilton de los cálculos, redujo el problema a tres variables y tres ecuaciones. El artículo de 1963, 'Deterministic Nonperiodic Flow', argumentaba que incluso esta simplificación drástica podía comportarse de forma imprevisible. El artículo quedó prácticamente sin leer durante una década.",
        },
        {
          pretitle: "Paso dos · Las tres ecuaciones",
          title: "Tres líneas acopladas",
          body: "dx/dt = σ(y − x). dy/dt = x(ρ − z) − y. dz/dt = xy − βz. σ es el número de Prandtl, ρ el número de Rayleigh, β la razón de aspecto geométrica. Los valores caóticos famosos son σ = 10, ρ = 28, β = 8/3, fijados por el propio Lorenz. Cambia ρ y el sistema recorre un largo catálogo de comportamientos — puntos fijos, órbitas periódicas, caos transitorio — antes de llegar a la mariposa canónica.",
        },
        {
          pretitle: "Paso tres · La mariposa",
          title: "Un atractor en 3D",
          body: "Integra hacia delante en el tiempo y la trayectoria gira alrededor de dos equilibrios inestables, saltando entre ellos en una secuencia que nunca se repite. La forma, en tres dimensiones, se parece a las alas de una mariposa — de ahí el nombre. El atractor no es una curva ni una superficie; su dimensión de Hausdorff ronda 2,06. Es un atractor extraño: denso en sí mismo, nunca cerrado, fractal a cualquier escala.",
        },
        {
          pretitle: "Paso cuatro · Dependencia sensible",
          title: "Por qué las previsiones del tiempo tienen un horizonte",
          body: "Toma dos puntos de partida que difieren en una parte por cien mil. Tras un breve lapso, las dos trayectorias están totalmente descorrelacionadas. Lorenz formalizó esto como la dependencia sensible a las condiciones iniciales; el exponente de Lyapunov dominante es positivo. En una conferencia de 1972 preguntó si 'el aleteo de una mariposa en Brasil podría desencadenar un tornado en Texas' — y entregó la metáfora que definió el campo. El motivo por el que las previsiones del tiempo decaen tras unas dos semanas es ese mismo exponente, en la atmósfera real.",
        },
      ],
    },
    fourier: {
      pretitle: "Tema · Análisis",
      title: "La transformada de Fourier",
      tagline: "Toda señal es una suma de ondas sinusoidales.",
      intro:
        "Uno de los hechos individuales más profundos de la matemática — y el motor silencioso de MP3, JPEG, Wi-Fi y RMN. El Explorador te deja añadir armónicos uno a uno y ver cómo una onda cuadrada aparece a partir de senos puros.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La afirmación de Fourier",
          title: "Conducción del calor, 1822",
          body: "Joseph Fourier publicó su 'Teoría Analítica del Calor' en 1822. Para resolver la ecuación del calor lanzó una afirmación que sonaba escandalosa: cualquier función, continua o con saltos, puede escribirse como una suma de senos y cosenos puros. Los matemáticos de su tiempo no le creyeron. Hizo falta medio siglo de refinamientos (Dirichlet, Riemann, Lebesgue) para que la afirmación se asentara como teorema.",
        },
        {
          pretitle: "Paso dos · La receta",
          title: "Suma de tonos puros",
          body: "Para una función periódica: una serie de Fourier — una suma sobre frecuencias discretas. Para una función integrable cualquiera: una transformada de Fourier f̂(ξ) = ∫ f(t) e^(−2πi ξ t) dt — un espectro continuo. Ambas dicen lo mismo de modos distintos: una señal en el tiempo, por complicada que sea, se descompone en oscilaciones puras. Un acorde se vuelve sus notas. Una fotografía se vuelve sus rayas.",
        },
        {
          pretitle: "Paso tres · Por qué funciona tu móvil",
          title: "Escondida dentro de MP3, JPEG, RMN, Wi-Fi",
          body: "Identifica qué frecuencias importan; tira el resto; comprime. MP3 conserva las bandas audibles y descarta lo que el oído no oye. JPEG divide una imagen en bloques de 8×8 y conserva las frecuencias espaciales dominantes. Las máquinas de RMN miden físicamente muestras en el espacio de frecuencias y aplican la transformada de Fourier inversa para volver a la anatomía. El Wi-Fi y el 5G usan OFDM, repartiendo datos en paralelo sobre miles de portadoras. La FFT de Cooley-Tukey (1965) hizo todo esto lo bastante rápido para ser práctico.",
        },
        {
          pretitle: "Paso cuatro · El compromiso de la incertidumbre",
          title: "Más nítido en el tiempo, más borroso en la frecuencia",
          body: "Aprieta una señal en una ventana temporal estrecha y su transformada de Fourier se esparcirá por fuerza sobre muchas frecuencias — y al revés. Esto no es ingeniería; es matemática. La función gaussiana se sienta en el óptimo de ese compromiso: es su propia transformada de Fourier. La misma desigualdad, en física, se convierte en el principio de incertidumbre de Heisenberg. Tiempo y frecuencia son coordenadas duales; no puedes afinar las dos a la vez.",
        },
      ],
    },
    euler: {
      pretitle: "Tema · Análisis",
      title: "La identidad de Euler",
      tagline: "Cinco números, una sola línea.",
      intro:
        "e^(iπ) + 1 = 0 — cinco constantes de cinco rincones distintos de la matemática, encerradas en una sola igualdad. El Explorador de al lado te deja ver cómo e^(iθ) barre la circunferencia unidad en tiempo real, para que veas, con tus propios ojos, el momento en θ = π en que la identidad ocurre de verdad.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Las cinco constantes",
          title: "0, 1, e, i, π — cinco extraños en una sala",
          body: "Cada uno de los cinco números viene de un país distinto. 0 es la identidad aditiva — la nada. 1 es la identidad multiplicativa — la unidad. e ≈ 2,71828 es la tasa natural de crecimiento compuesto, nacida en el cálculo. i es la unidad imaginaria, definida por i² = −1, nacida en el álgebra al intentar resolver ecuaciones cúbicas. π ≈ 3,14159 es la razón entre la circunferencia y el diámetro de un círculo, nacida en la geometría. Normalmente no se encuentran nunca — y, sin embargo, una sola ecuación de seis símbolos los ata a los cinco con nada más que +, ·, = y la exponenciación.",
        },
        {
          pretitle: "Paso dos · La fórmula de Euler",
          title: "e^(iθ) = cos θ + i sin θ",
          body: "La identidad es lo que la fórmula de Euler devuelve para un ángulo concreto, publicada en su Introductio in analysin infinitorum de 1748. Para cualquier número real θ, la fórmula dice que e^(iθ) — una exponencial con exponente imaginario — es igual a cos θ + i sin θ. Geométricamente: a medida que θ crece, el punto e^(iθ) recorre en sentido antihorario la circunferencia unidad del plano complejo. Multiplicar por e^(iθ) es rotar un ángulo θ. Crecimiento y rotación, las dos cosas que e e i hacen en secreto, resultan ser la misma operación vista por dos lados.",
        },
        {
          pretitle: "Paso tres · Sustituye θ = π",
          title: "La demostración de una línea",
          body: "Pon θ = π en la fórmula de Euler. El lado derecho se vuelve cos π + i sin π = −1 + i·0 = −1. El lado izquierdo es e^(iπ). Así que e^(iπ) = −1, y sumando 1 a ambos lados queda e^(iπ) + 1 = 0. Geométricamente, eso es media vuelta: partiendo del punto 1 sobre la circunferencia unidad y rotando π radianes — 180° — caes exactamente en −1. La identidad es el enunciado algebraico de esa única media vuelta perfecta.",
        },
        {
          pretitle: "Paso cuatro · La ecuación más bella",
          title: "Por qué los matemáticos votan por ella",
          body: 'Richard Feynman, a los catorce años, llamó a la fórmula de Euler "la fórmula más notable de la matemática" — "nuestra joya" — en sus Lectures on Physics. Una encuesta del Mathematical Intelligencer en 1990 nombró a la identidad el teorema más bello de la matemática; una encuesta de lectores de Physics World en 2004 la clasificó junto a las ecuaciones de Maxwell como la mejor ecuación de la historia. El encanto está en que usa cada una de las operaciones aritméticas básicas exactamente una vez (suma, multiplicación, exponenciación), cada una de las constantes básicas exactamente una vez (0, 1, e, i, π) y no contiene nada de relleno. Pocas ecuaciones son tan breves, y ninguna se cita tantas veces como prueba de que la matemática es bella.',
        },
      ],
    },
    banach: {
      pretitle: "Tema · Paradoja",
      title: "La paradoja de Banach-Tarski",
      tagline: "Corta una bola, acaba con dos.",
      intro:
        "Una bola sólida, partida en un puñado de trozos, puede recomponerse en dos bolas sólidas idénticas a la original — sin estirar nada, sin materia extra. El Explorador dibuja el motor que hay detrás del truco: el grupo libre F₂ de dos rotaciones, cuyo árbol de Cayley autosemejante contiene cuatro copias desplazadas de sí mismo. Esa estructura ramificada es, casi literalmente, de donde sale la segunda bola.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El enunciado",
          title: "Entra una bola, salen dos",
          body: "Toma una bola sólida B³ en el espacio tridimensional. El teorema de Banach-Tarski (1924) dice que puedes particionarla en un número finito de piezas disjuntas — cinco bastan, y cinco es el mínimo —, aplicarles movimientos rígidos (rotaciones y traslaciones) y terminar con dos bolas sólidas disjuntas, cada una congruente con la original. Nada se estira, se deforma o se duplica; las piezas simplemente se reordenan. La conclusión, como matemática pura, es completamente rigurosa: B³ = B³ ⊔ B³.",
        },
        {
          pretitle: "Paso dos · El axioma de elección",
          title: "Por dónde entra la rareza",
          body: "La construcción es imposible dentro solo de ZF. La prueba de Banach y Tarski necesita el axioma de elección para escoger un representante de cada una de incontables órbitas de una acción rotacional sobre la esfera. Ese único uso de elección obliga a que las piezas sean no medibles: no tienen volumen bien definido en sentido de Lebesgue, así que la ecuación 'volumen de una bola = volumen de dos bolas' nunca llega a escribirse. Las piezas no son regiones que se puedan cortar físicamente — son nubes de puntos densas y no medibles que existen solo como objetos lógicos.",
        },
        {
          pretitle: "Paso tres · El grupo libre de rotaciones",
          title: "F₂, generado por dos rotaciones",
          body: "El corazón de la prueba es puramente teórico-grupal. Dos rotaciones a y b adecuadamente elegidas de la esfera unidad S² no satisfacen ninguna relación más allá de las triviales: generan un grupo libre F₂ de rango 2 — cada palabra reducida en a, a⁻¹, b, b⁻¹ actúa como una rotación distinta. F₂ admite una descomposición paradójica: se parte en cuatro conjuntos W(a), W(a⁻¹), W(b), W(b⁻¹) (palabras que empiezan por cada generador) más la identidad, y cada conjunto desplazado cubre el resto del grupo. Pasa esto por la paradoja esférica de Hausdorff de 1914, levántalo de S² a la bola sólida, y la duplicación en el grupo se convierte en una duplicación de B³.",
        },
        {
          pretitle: "Paso cuatro · Por qué no rompe el mundo",
          title: "Piezas no medibles, átomos del mundo real",
          body: "La medida de Lebesgue es contable-aditiva sobre conjuntos medibles; si las piezas fueran medibles, el volumen de las dos bolas resultantes tendría que igualar el de la bola de entrada, contradiciéndose. Así que el teorema te dice cortésmente que las piezas no pueden ser medibles — y en efecto no lo son. Al mundo real no le importa: la materia física son un número finito de átomos, no subconjuntos arbitrarios de ℝ³, y no puedes cortar a lo largo de una frontera no medible. La paradoja vive enteramente dentro del continuo, donde el infinito tiene más espacio de maniobra del que permite la intuición.",
        },
      ],
    },
    lsystem: {
      pretitle: "Tema · Geometría",
      title: "Sistemas L",
      tagline: "Reescrituras letra a letra que crecen como plantas.",
      intro:
        "Un sistema L es una gramática diminuta: una cadena inicial, unas pocas reglas de reescritura y una tortuga que convierte letras en líneas. En el Explorador editas el axioma y las reglas, deslizas la profundidad de iteración y ves a la tortuga dibujar el fractal resultante — copos de Koch, dragones, helechos, curvas de Hilbert — a partir de un puñado de caracteres.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Una cadena y tres reglas",
          title: "Axioma, alfabeto, reescritura",
          body: "Un sistema L tiene tres piezas. Un alfabeto de símbolos. Un axioma — una cadena inicial. Un conjunto de reglas de producción, una por símbolo, que dicen en qué se convierte cada símbolo en la siguiente generación. El truco característico es el paralelismo: en cada paso, todos los símbolos se reescriben simultáneamente, igual que en un organismo todas las células se dividen a la vez. Aristid Lindenmayer, biólogo húngaro en Utrecht, introdujo el formalismo en 1968 para modelar el crecimiento célula a célula de algas y plantas. En la variante más simple (libre de contexto y determinista) las reglas miran un símbolo cada vez; las versiones contexto-sensibles miran a los vecinos; las estocásticas eligen reglas al azar.",
        },
        {
          pretitle: "Paso dos · La interpretación de la tortuga",
          title: "Un lápiz virtual que hace crecer el fractal",
          body: "Los símbolos por sí solos son solo texto. La geometría aparece cuando alimentas la cadena a una tortuga: F significa avanzar dibujando una unidad, G también dibuja al avanzar, + gira a la izquierda un ángulo fijo, − gira a la derecha. Otros dos símbolos apilan y desapilan estado: [ mete la posición y la dirección actuales en una pila, ] las saca. Con solo apilar y desapilar, una sola cadena unidimensional empieza de pronto a ramificarse — los pares de corchetes se vuelven ramillas y tallos laterales. Los símbolos fuera del alfabeto de dibujo (X, Y, A, B …) son variables silenciosas: arrastran información a través de las reescrituras, pero la tortuga las ignora.",
        },
        {
          pretitle: "Paso tres · Ejemplos clásicos",
          title: "Cuatro reglas, cuatro fractales",
          body: "Copo de nieve de Koch: axioma F++F++F, regla F → F−F++F−F, ángulo 60°. Cuatro iteraciones y el triángulo se arruga hasta convertirse en copo de nieve. Curva del dragón: axioma FX, reglas X → X+YF+, Y → −FX−Y, ángulo 90°; tras una docena de reescrituras se pliega en el dragón de Heighway. Punta de flecha de Sierpiński: A → B−A−B, B → A+B+A, ángulo 60°, alterna la paridad para barrer el triángulo de Sierpiński. Planta fractal: X → F+[[X]−X]−F[−FX]+X, F → FF, ángulo 25° — el helecho canónico de Lindenmayer y Prusinkiewicz, con ramas y todo. La misma maquinaria, organismos radicalmente distintos.",
        },
        {
          pretitle: "Paso cuatro · Por qué los aman los botánicos",
          title: "De un artículo de 1968 a cada bosque de videojuego",
          body: 'Lindenmayer no era un matemático persiguiendo imágenes bonitas — era un biólogo intentando capturar cómo un organismo pluricelular se desarrolla a partir de una sola punta. Los sistemas L dieron a la botánica su primera gramática formal del crecimiento: topología de ramificación, longitudes de entrenudos, posición de las hojas, todo a partir de unas pocas reglas de reescritura. El libro de 1990 de Przemyslaw Prusinkiewicz, "The Algorithmic Beauty of Plants", convirtió la idea en un canal de producción y de ahí se filtró a la infografía. La mayoría de los árboles procedurales de juegos y películas, los helechos de SpeedTree, la vegetación de los cortos de Pixar, las ciudades-de-tuberías de la demoscene — todos descienden de la reescritura paralela de Lindenmayer. Una gramática de células se convirtió en una gramática de mundos.',
        },
      ],
    },
    wang: {
      pretitle: "Tema · Computación",
      title: "Mosaicos de Wang",
      tagline: "Cuadrados de aristas coloreadas capaces de codificar cualquier cómputo.",
      intro:
        "El rompecabezas de Hao Wang de 1961 — cuadrados cuyas cuatro aristas coloreadas deben coincidir con las de sus vecinos — resultó esconder el problema de la parada dentro de un juego de emparejar para niños. El Explorador te deja elegir un conjunto de baldosas y ver el plano rellenarse, celda a celda, retrocediendo cuando no encaja ninguna.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Las reglas",
          title: "Baldosas cuadradas, cuatro aristas de color, sin rotación",
          body: "Una baldosa de Wang es un cuadrado unidad cuyas cuatro aristas llevan colores. Solo puedes colocar una baldosa cuando cada una de sus aristas coincide en color con la arista que toca de la baldosa vecina — norte contra sur, este contra oeste. Las baldosas no pueden rotarse ni reflejarse; la asignación de colores es fija. Dado un conjunto finito de tales baldosas, la pregunta es si puedes usar copias suyas para teselar todo el plano infinito.",
        },
        {
          pretitle: "Paso dos · La conjetura de Wang y su refutación",
          title: "De un algoritmo que debería existir a uno que no puede",
          body: "Hao Wang conjeturó en 1961 que todo conjunto finito de baldosas capaz de teselar el plano debía admitir una teselación periódica — y de ahí habría derivado un algoritmo para decidir el Problema del Dominó (¿este conjunto tesela el plano?). En 1966, su estudiante Robert Berger refutó ambas cosas a la vez: construyó un conjunto aperiódico de 20.426 baldosas de Wang y demostró que el Problema del Dominó es indecidible. No existe ningún algoritmo que, dado un conjunto de baldosas, decida siempre si tesela el plano.",
        },
        {
          pretitle: "Paso tres · Computación en la teselación",
          title: "Codificar una máquina de Turing como conjunto de baldosas",
          body: "El truco de Berger consistió en traducir las configuraciones de una máquina de Turing en baldosas de Wang, de modo que cada fila válida de baldosas codificara un paso de la máquina y cada columna válida codificara el paso del tiempo. Una teselación del semiplano superior existe entonces si y solo si la máquina nunca se detiene con su entrada en blanco — que es justamente el problema de la parada, el problema indecidible canónico. La misma construcción se fue encogiendo con los años: Berger redujo su conjunto a 104, Robinson a 56, y en 1996 Karel Culik II publicó el récord, largo tiempo vigente, de 13 baldosas de Wang aperiódicas. Jeandel y Rao probaron luego que el mínimo verdadero es 11.",
        },
        {
          pretitle: "Paso cuatro · Dónde acaban en la vida real",
          title: "De la indecidibilidad a la textura procedural",
          body: "Más allá del drama fundacional, las baldosas de Wang encontraron una segunda vida discreta en infografía. Un pequeño conjunto cuidadosamente elegido permite a un renderizador teselar un muro, el suelo de un bosque o un mapa de alturas sin repeticiones visibles — las restricciones de coincidencia cosen los fragmentos sin costuras, mucho más barato que generar una textura única gigante. Son primas cercanas de las teselaciones de Penrose y de los cuasicristales que Dan Shechtman descubrió en 1982 (Nobel 2011): las tres son maneras de forzar un patrón infinito que nunca llega a repetirse.",
        },
      ],
    },
    collatz: {
      pretitle: "Tema · Caos",
      title: "La conjetura de Collatz",
      tagline: "Si es par, divide entre dos. Si es impar, triplica y suma uno.",
      intro:
        "Uno de los problemas no resueltos más simples de la matemática: una regla de cuatro palabras que nadie es capaz de probar que siempre termina. El Explorador de abajo dibuja la trayectoria granizada de cualquier número de partida y hace crecer el coral inverso — el árbol al revés de todos los enteros, con raíz en 1.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La regla",
          title: "Dos casos, una instrucción",
          body: "Toma cualquier entero positivo n. Si n es par, sustitúyelo por n/2. Si n es impar, sustitúyelo por 3n + 1. Repite. Esa es toda la regla. Prueba con n = 7: va 7 → 22 → 11 → 34 → 17 → 52 → 26 → 13 → 40 → 20 → 10 → 5 → 16 → 8 → 4 → 2 → 1, y luego entra para siempre en el bucle 1 → 4 → 2 → 1. Cada punto de partida que se ha probado acaba en ese mismo pequeño bucle.",
        },
        {
          pretitle: "Paso dos · La conjetura",
          title: "Todos los caminos llevan a 1",
          body: "Lothar Collatz propuso la conjetura en 1937, dos años después de doctorarse. La afirmación es de una simplicidad asombrosa: para todo entero positivo n, la iteración acaba alcanzando 1. Se conoce también como problema de Syracuse, problema de Kakutani y conjetura de Ulam — varios matemáticos tropezaron con la misma bestia independientemente. A fecha de 2025 se ha verificado por ordenador para todo entero positivo hasta aproximadamente 2,36 × 10²¹. Nadie sabe por qué.",
        },
        {
          pretitle: "Paso tres · Récords y sorpresas",
          title: "Granizos sobre Syracuse",
          body: "Las trayectorias se apodan secuencias granizadas porque, como el granizo en una nube de tormenta, suben y bajan de manera errática antes de tocar tierra. El caso pequeño más famoso es n = 27: tarda 111 pasos en llegar a 1 y por el camino llega a un máximo de 9232 — unas 340 veces su valor inicial. Otras semillas notables: n = 97 tarda 118 pasos; n = 871, 178; n = 6171, 261. Entradas minúsculas, órbitas salvajemente desproporcionadas.",
        },
        {
          pretitle: "Paso cuatro · Por qué se resiste",
          title: "Un coral que nadie puede podar",
          body: "Paul Erdős, mirándolo, se encogió de hombros: 'Quizá la matemática aún no está lista para estos problemas'. Ofreció 500 dólares por una solución y el premio sigue sin reclamar. El avance más profundo es el artículo de Terence Tao de 2019 que muestra que casi todas las órbitas de Collatz alcanzan valores casi acotados — un casi-acierto probabilístico, no una demostración. Corre la regla al revés en lugar de hacia delante y los enteros se autoensamblan en un único árbol infinito con raíz en 1, ramificándose como un coral. El Explorador de al lado hace crecer ese coral y te deja soltar cualquier semilla en la tormenta de granizo.",
        },
      ],
    },
    doublependulum: {
      pretitle: "Tema · Caos",
      title: "El doble péndulo",
      tagline: "Dos péndulos encadenados, caos total.",
      intro:
        "Un sistema mecánico lo bastante simple para dibujarlo en una servilleta y lo bastante caótico para esquivar cualquier pronóstico. El Explorador integra las ecuaciones de movimiento en tiempo real y te deja correr dos arranques casi idénticos para que veas tú mismo cómo divergen.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El planteamiento",
          title: "Dos péndulos, una pesa colgada de la otra",
          body: "Toma un péndulo simple — una varilla rígida sin masa de longitud L₁ con una pesa de masa m₁ en su extremo, oscilando bajo la gravedad. Ahora ata una segunda varilla de longitud L₂ con masa m₂ a la pesa del primero. La configuración se describe con solo dos ángulos, θ₁ y θ₂, medidos desde la vertical. Junto con las velocidades angulares ω₁ = θ̇₁ y ω₂ = θ̇₂, ese es el estado entero: un punto en un espacio de fase tetradimensional, evolucionando deterministamente bajo Newton.",
        },
        {
          pretitle: "Paso dos · El lagrangiano",
          title: "Cinética menos potencial, luego acciona Euler-Lagrange",
          body: "Escribe la energía cinética T de ambas pesas y la energía potencial V de la gravedad. El lagrangiano L = T − V sale limpio, pero las ecuaciones de movimiento ∂L/∂θᵢ − d/dt(∂L/∂θ̇ᵢ) = 0 producen dos EDOs acopladas, no lineales y de segundo orden para θ̈₁ y θ̈₂. El acoplamiento es por términos en sin(θ₁−θ₂) y cos(θ₁−θ₂); la no linealidad es inevitable. No existe solución cerrada. Para ver moverse al sistema hay que integrar numéricamente — y eso es exactamente lo que hace el Explorador, paso a paso, con RK4.",
        },
        {
          pretitle: "Paso tres · Caos",
          title: "Energía baja: precioso. Energía alta: imprevisible.",
          body: "A baja energía las pesas oscilan suavemente y el movimiento es cuasiperiódico — la trayectoria envuelve un toro invariante en el espacio de fase y no se repite del todo, pero permanece acotada y ordenada. Sube la energía y el sistema cruza al caos: el mayor exponente de Lyapunov se vuelve positivo, y dos arranques que difieren en una parte por millón se separan por completo en pocos segundos. El doble péndulo es la demostración física de manual del caos determinista — determinista en las ecuaciones, imprevisible en la práctica.",
        },
        {
          pretitle: "Paso cuatro · Dónde aparece",
          title: "Robots, marcha, teoría de control, museos",
          body: "Las mismas ecuaciones de rotores acoplados describen brazos robóticos de dos eslabones (donde el caos es algo que conviene suprimir, no celebrar), la biomecánica de una pierna oscilando en la marcha humana y muchos osciladores compuestos en ingeniería. Los teóricos de control utilizan el doble péndulo como banco de pruebas para estabilizar sistemas no lineales inestables — equilibrarlo cabeza arriba es un problema duro clásico. Y cualquier buen museo de ciencia tiene uno oscilando en una vitrina, trazando una huella que los visitantes nunca acaban de predecir.",
        },
      ],
    },
    bzr: {
      pretitle: "Tema · Caos",
      title: "La reacción de Belousov-Zhabotinsky",
      tagline: "Un reloj químico que dibuja espirales.",
      intro:
        "Una mezcla química real que se niega a estabilizarse: pulsa entre colores en un vaso y hace crecer espirales rotatorias en una placa de Petri. El Explorador simula una red de reacción-difusión tipo Oregonator de 3 variables para que veas cómo la misma inestabilidad se autoorganiza en ondas.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El descubrimiento accidental",
          title: "Una reacción que debería haber sido imposible",
          body: "A principios de los años cincuenta, el químico soviético Boris Belousov, buscando un análogo inorgánico del ciclo de Krebs, mezcló bromato, ácido cítrico y un catalizador de cerio — y vio cómo la disolución cambiaba de color rítmicamente, una y otra vez. Los revisores rechazaron su artículo: una reacción química oscilando visiblemente en el tiempo parecía una violación de la segunda ley de la termodinámica. Belousov dejó de intentar publicarlo. Una década después, en 1961, el estudiante de doctorado Anatol Zhabotinsky retomó la receta, cambió el ácido cítrico por malónico y demostró las oscilaciones con la suficiente claridad como para que el resultado ya no se pudiera negar.",
        },
        {
          pretitle: "Paso dos · Cómo se ve",
          title: "Un reloj en un vaso, espirales en una placa",
          body: "La receta moderna es bromato (BrO₃⁻) más bromuro, ácido malónico como combustible y un catalizador redox — cerio o, más visible, ferroína en un baño de ácido sulfúrico. Agitada en un vaso, la disolución cambia de color a intervalos regulares (azul ↔ rojo con ferroína) como un metrónomo químico. Vertida en una placa de Petri fina donde la difusión importa, la misma receta hace crecer espontáneamente ondas espirales rotatorias y patrones concéntricos en cuestión de minutos. Agítala y el patrón se borra; déjala en paz y se dibuja uno nuevo.",
        },
        {
          pretitle: "Paso tres · El Oregonator",
          title: "Tres variables, una oscilación",
          body: "En 1972, Richard Field, Endre Körös y Richard Noyes — trabajando en la Universidad de Oregón — destilaron la química en el Oregonator: un sistema EDO no lineal de 3 variables que sigue los intermediarios clave (HBrO₂, Br⁻ y el catalizador oxidado). Oscila exactamente por las mismas razones que el vaso. Añade términos de difusión y las EDO se vuelven EDP de reacción-difusión; en la reducción de Tyson-Fife, el mismo modelo reproduce las ondas espirales en una lámina 2D. El Explorador de al lado corre un primo discreto-celular de esta EDP, lo bastante barato para un navegador y lo bastante fiel para hacer espirales.",
        },
        {
          pretitle: "Paso cuatro · Por qué importa",
          title: "Química que se organiza sola",
          body: "La BZR fue el arma del crimen experimental que sacó a la química del pensamiento de equilibrio. Lejos del equilibrio, la materia no se limita a disiparse — puede organizarse espontáneamente en patrones estructurados en el espacio y el tiempo. Ilya Prigogine construyó la teoría de estas estructuras disipativas y recibió por ello el Nobel de Química en 1977. Hoy la BZR es el ejemplo de manual de autoorganización fuera del equilibrio, hermana de los patrones de morfógenos de Turing y antecesora de cada modelo de reacción-difusión en biología, neurociencia e ingeniería química.",
        },
      ],
    },
    turingpattern: {
      pretitle: "Tema · Análisis",
      title: "Patrones de Turing",
      tagline: "Por qué los leopardos tienen manchas.",
      intro:
        "El Explorador simula en tiempo real una red de reacción-difusión de Gray-Scott: dos sustancias químicas virtuales compitiendo en una malla de 200×200. Gira los diales de feed y kill y el campo se transforma de manera continua entre manchas, rayas, laberintos y coral autorreplicante.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La pregunta de Turing",
          title: "¿De dónde vienen los patrones de un animal?",
          body: "Un embrión de leopardo empieza como una bola casi uniforme de células. En algún momento aparecen en su pelaje manchas regulares — mismo espaciado, mismo tamaño, en los lugares adecuados. El mismo problema surge con las rayas de la cebra, las bandas del pez ángel y los anillos de una caracola. En 1952, Alan Turing publicó 'The Chemical Basis of Morphogenesis' y propuso una respuesta sorprendente: los patrones son pura química. Dos sustancias que difunden con alcances muy distintos, reaccionando entre sí, pueden romper espontáneamente la simetría y trazar un diseño estable sobre un fondo uniforme.",
        },
        {
          pretitle: "Paso dos · La receta",
          title: "Activación de corto alcance, inhibición de largo alcance",
          body: "El mecanismo de Turing toma dos sustancias: un ACTIVADOR a que cataliza su propia producción y la del INHIBIDOR b, más el propio inhibidor, que destruye al activador. El ingrediente crucial añadido es la difusión: el inhibidor debe difundir mucho más rápido que el activador. Una pequeña fluctuación que eleva a en un punto desencadena un estallido local desbocado de activador — pero también produce inhibidor, que se va lanzando hacia fuera y suprime al activador en un amplio anillo alrededor. Ese anillo de supresión mantiene el siguiente estallido a distancia, y el ritmo estallido-y-anillo tesela el plano con manchas, rayas o laberintos regulares.",
        },
        {
          pretitle: "Paso tres · Una ecuación, muchos patrones",
          title: "El diagrama de fases de Gray-Scott",
          body: "La forma jugable estándar es el modelo de Gray-Scott: ∂a/∂t = D_a∇²a − ab² + F(1 − a) y ∂b/∂t = D_b∇²b + ab² − (F + k)b. Solo dos diales hacen el trabajo pesado — F, la tasa de alimentación a la que se suministra activador fresco, y k, la tasa de muerte a la que decae el inhibidor. El artículo de Pearson de 1993 cartografió el plano (F, k) en un atlas hoy famoso de regiones con nombre: agujeros, manchas, rayas, puntos autorreplicantes tipo mitosis, el mundo inestable U-skate, laberintos, solitones y caos pleno. Las mismas dos ecuaciones diferenciales contienen todos esos; basta con mover el cursor.",
        },
        {
          pretitle: "Paso cuatro · Los patrones son reales",
          title: "Del tubo de ensayo al pez globo",
          body: "Durante décadas el mecanismo de Turing fue una idea hermosa sin experimento. Después, en 1990, el reactor CIMA (clorito-yoduro-ácido malónico en gel) produjo el primer patrón de Turing de laboratorio en pura química, con el almidón haciendo de freno al inhibidor. Desde entonces, los biólogos han pillado al mismo mecanismo en plena faena en tejido vivo: Akiyama y Tanaka en 2014 leyeron las señales de activador e inhibidor directamente del pez globo africano; Sheth y sus colegas mostraron dinámicas de Turing fijando el espaciado de los dedos del ratón; la misma química gobierna el espaciado de los folículos pilosos, los brotes de pluma y la pigmentación de las caracolas. Pelajes, huellas digitales, crestas — el boceto de Turing de 1952, medido.",
        },
      ],
    },
    sierpinski: {
      pretitle: "Tema · Geometría",
      title: "El triángulo de Sierpiński",
      tagline: "Un fractal, cuatro caminos hacia él.",
      intro:
        "Wacław Sierpiński lo describió en 1915, pero el mismo patrón de agujero-dentro-de-agujero triangular ya estaba grabado en los suelos de iglesias cosmatescas del siglo XIII. Lo asombroso es que la forma llega por al menos cuatro rutas completamente distintas — recursión, azar, aritmética, un autómata celular de una sola línea — y el Explorador te deja verlas las cuatro a la vez.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Subdivisión recursiva",
          title: "Recorta el centro y recursea",
          body: "Toma un triángulo equilátero. Une los puntos medios de sus tres lados; esto lo divide en cuatro triángulos congruentes más pequeños. Quita el central y deja las tres esquinas. Ahora aplica la misma operación a cada una de esas esquinas — y otra vez, y otra. Tras infinitos pasos tienes el triángulo de Sierpiński: un conjunto autosemejante cuya área total es cero y cuyo borde tiene longitud infinita. Cada ronda conserva tres cuartos del área anterior, así que el límite es inevitable.",
        },
        {
          pretitle: "Paso dos · La ruta del juego del caos",
          title: "A medio camino, una y otra vez",
          body: "Coloca tres vértices en triángulo. Suelta un punto donde sea; luego, una y otra vez, elige uno de los tres vértices uniformemente al azar y salta a medio camino hacia él. Dibuja cada paso. En unos pocos miles de saltos la nube de puntos se ha resuelto en el triángulo de Sierpiński — exactamente, en el límite. Pura jugada aleatoria, sin instrucciones sobre geometría, sin memoria: solo un paso a la mitad y tres dianas. El fractal es lo que la marcha aleatoria no puede evitar dibujar.",
        },
        {
          pretitle: "Paso tres · El triángulo de Pascal mod 2",
          title: "Las entradas impares lo dibujan por ti",
          body: "Escribe el triángulo de Pascal y colorea de negro cada entrada impar y de blanco cada par. El resultado, fila a fila, es el triángulo de Sierpiński. La razón es el teorema de Lucas: un coeficiente binomial C(n, k) es impar exactamente cuando los dígitos binarios de k son un subconjunto de los de n. Así que las celdas negras viven donde los bits de k caben dentro de los bits de n — y esa condición, dibujada en un triángulo, es el patrón de Sierpiński. Combinatoria y geometría aterrizan en el mismo sitio.",
        },
        {
          pretitle: "Paso cuatro · Regla 90 y el IFS",
          title: "Una célula, una regla, la misma forma",
          body: "El autómata celular elemental Regla 90 de Wolfram dice: el siguiente estado de una célula es el XOR de sus dos vecinas. Empieza con una sola célula negra en una fila por lo demás blanca y avanza. Cada nueva generación dibujada debajo de la anterior reproduce exactamente el triángulo de Sierpiński. La lectura más profunda es que las cuatro rutas describen el mismo atractor: un sistema de funciones iteradas de tres contracciones, cada una con razón 1/2, fijadas en los tres vértices. Sigas la receta que sigas, convergerás al mismo conjunto fijo — dimensión de Hausdorff log 3 / log 2 ≈ 1,585.",
        },
      ],
    },
    chaosgame: {
      pretitle: "Tema · Geometría",
      title: "El juego del caos",
      tagline: "Lanza un dado, dibuja un fractal.",
      intro:
        "Coloca unos pocos puntos, elige uno al azar una y otra vez y camina hasta la mitad del trayecto hasta él — una regla que suena a ruido, pero que se condensa en un fractal perfecto al cabo de unos miles de pasos. El Explorador anima el procedimiento en vivo y te deja ajustar el número de vértices, la razón de salto y las reglas que gobiernan qué vértice puedes escoger a continuación.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La regla",
          title: "Tres puntos, un dado y un paso corto",
          body: "Coloca los vértices de un polígono. Elige cualquier punto de partida — encima, fuera o dentro del polígono, da igual. Ahora lanza un dado para escoger un vértice al azar, recorre una fracción fija del camino entre tu posición actual y él y marca el nuevo punto. Trata ese punto como tu nueva posición y repite. La regla tiene solo dos ingredientes: una lista de vértices y una razón de salto r. Ese es todo el juego del caos, formalizado por Michael Barnsley en su trabajo de 1988 sobre sistemas de funciones iteradas.",
        },
        {
          pretitle: "Paso dos · De la aleatoriedad, el triángulo de Sierpiński",
          title: "La razón adecuada para cada polígono",
          body: "En un triángulo equilátero con razón de salto r = 1/2 los puntos se condensan en el triángulo de Sierpiński — tras un breve calentamiento, ningún punto puede caer ya en los agujeros centrales. Para un n-gono regular existe una razón mágica rₙ = 1 / (1 + 2·cos(π/n)) que da un fractal autosemejante limpio. La tabla de abajo reúne los valores para n = 3 a 8: nota que el 1/2 del triángulo y el 1/(1 + φ) = 1/φ² ≈ 0,382 del pentágono salen directamente de la misma fórmula. Usa otra razón y la imagen se solapa o se hueca hasta que el fractal se borra.",
        },
        {
          pretitle: "Paso tres · Otras formas con otras reglas",
          title: "Cuadrados, restricciones y el helecho de Barnsley",
          body: "En un cuadrado con r = 1/2 la regla falla: los puntos rellenan el interior uniformemente y no aparece fractal. El arreglo es una regla de restricción — por ejemplo, prohibir el mismo vértice dos veces seguidas, o prohibir el vértice contiguo al anterior — y vuelve un fractal delicado. Empuja más la idea y los vértices desaparecen por completo: el helecho de Barnsley es el juego del caos con cuatro transformaciones afines elegidas con dados sesgados (probabilidades 0,01, 0,85, 0,07, 0,07), y de esa aleatoriedad crece una hoja botánicamente convincente.",
        },
        {
          pretitle: "Paso cuatro · Por qué funciona",
          title: "Atractores de sistemas de funciones iteradas",
          body: 'Cada movimiento disponible — "salta a medio camino al vértice i" — es una contracción del plano. Un conjunto finito de tales contracciones es un Sistema de Funciones Iteradas (IFS), y el teorema de Barnsley garantiza un único atractor compacto: el punto fijo del sistema entero. El juego del caos muestrea ese atractor escogiendo aplicaciones al azar, y el teorema de Hutchinson dice que los puntos muestreados, con probabilidad uno, se vuelven densos en él. Podrías dibujar la misma imagen deterministamente aplicando todas las aplicaciones a todas las formas — la marcha aleatoria no es más que la entrada barata y bonita.',
        },
      ],
    },
    penrose: {
      pretitle: "Tema · Geometría",
      title: "Teselaciones de Penrose",
      tagline: "Baldosas que cubren el plano sin repetirse nunca.",
      intro:
        "Dos formas de baldosa bastan para cubrir un plano infinito con un patrón que no se repite jamás. El Explorador hace crecer teselaciones P3 (dos rombos) o P2 (cometa + dardo) por inflación; tú fijas la profundidad, la rotación inicial y observas cómo una geometría perfectamente aperiódica se ensambla sola.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Dos baldosas, sin repetición",
          title: "Penrose, 1974",
          body: "Roger Penrose presentó su primera teselación aperiódica (P1) en 1974, usando seis prototeselas construidas alrededor del pentágono. Pronto recortó el conjunto a dos: la pareja cometa + dardo (P2) y la pareja de dos rombos (P3) — un rombo delgado con ángulos 36°/144° y otro grueso con ángulos 72°/108°. Cada baldosa lleva las reglas de coincidencia de Conway — flechas o muescas de color en los bordes que fijan qué baldosa puede ir junto a cuál. Sin ellas podrías teselar periódicamente con cometas y dardos; con ellas, cada teselación legal se ve forzada a ser aperiódica.",
        },
        {
          pretitle: "Paso dos · Simetría de orden cinco",
          title: "Una simetría prohibida",
          body: "Cada ángulo de la teselación es múltiplo de 36° — el ángulo interior de un pentágono regular. Alrededor de vértices especiales el patrón tiene simetría rotacional perfecta de orden cinco, del mismo tipo que un pentágono. La cristalografía clásica demuestra que ninguna teselación periódica del plano puede tener simetría de orden cinco: solo las rotaciones de orden 2, 3, 4 y 6 son compatibles con una red. Las teselaciones de Penrose esquivan el teorema negándose a ser periódicas en primer lugar. La sorpresa es que aún puedes tener orden local de orden cinco sin cerrar nunca en una celda repetida.",
        },
        {
          pretitle: "Paso tres · La razón áurea está integrada",
          title: "φ = (1 + √5) / 2",
          body: "Cuenta las baldosas en cualquier parche grande y encontrarás la razón áurea esperándote. El número de cometas dividido por el de dardos converge a φ = (1+√5)/2 ≈ 1,618; lo mismo con rombos gruesos divididos entre los delgados. Las razones de longitud de lado dentro de los triángulos de Robinson que construyen cada rombo son 1 : φ, y la regla de inflación que hace crecer la teselación escala las longitudes por φ en cada paso. La teselación es, en sentido preciso, la razón áurea hecha patrón en el plano.",
        },
        {
          pretitle: "Paso cuatro · Cuasicristales",
          title: "Shechtman, 1982",
          body: 'En abril de 1982, Dan Shechtman disparó un haz de electrones contra una aleación de aluminio-manganeso enfriada rápidamente y vio un patrón de difracción con nítida simetría de orden cinco — algo que todos los libros de texto decían que no podía existir. Linus Pauling se burló de él durante años ("no hay tal cosa como cuasicristales, solo cuasicientíficos"). La teselación de Penrose era la pieza de matemática de papel que ya existía y demostraba que sí podía: un patrón aperiódico, con orden de largo alcance y simetría de orden cinco. Shechtman fue reivindicado con el Premio Nobel de Química en 2011, y las teselaciones de Penrose se convirtieron en el modelo bidimensional canónico de lo que hoy llamamos cuasicristales.',
        },
      ],
    },
    apollonian: {
      pretitle: "Tema · Geometría",
      title: "Empaquetamiento apoloniano de círculos",
      tagline: "Círculos dentro de círculos dentro de círculos.",
      intro:
        "Empieza con tres círculos mutuamente tangentes y una regla para qué cuenta como tangente. El Explorador rellena recursivamente cada hueco triangular curvo con un nuevo círculo y, después, llena los huecos más pequeños a su vez — elige las curvaturas iniciales y mira surgir una junta que es fractal para siempre.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La posición inicial",
          title: "Tres círculos tocándose",
          body: "Dibuja tres círculos en el plano, cada uno tangente a los otros dos — se tocan en tres puntos y encierran un hueco triangular curvo. Hacia el 200 a. C., Apolonio de Perga planteó la pregunta natural: ¿qué círculos son tangentes a los tres dados a la vez? Para una terna de círculos mutuamente tangentes hay exactamente dos respuestas — un pequeño círculo inscrito en el hueco curvo, y un gran círculo que circunscribe a los tres. Esos dos nuevos círculos se suman a los tres originales para formar una cuádrupla de círculos mutuamente tangentes. Esa cuádrupla es la semilla de todo lo que sigue.",
        },
        {
          pretitle: "Paso dos · El teorema de Descartes",
          title: "Curvaturas encerradas en álgebra",
          body: "Escribe la curvatura de cada círculo como k = 1/r, con una convención: si un círculo encierra a los demás (el exterior), toma su curvatura como negativa. En su correspondencia de 1643 con la princesa Isabel de Bohemia, Descartes demostró que para cualesquiera cuatro círculos mutuamente tangentes las curvaturas satisfacen (k₁+k₂+k₃+k₄)² = 2(k₁²+k₂²+k₃²+k₄²). Resolviendo la cuadrática para la cuarta curvatura se obtiene k₄ = k₁+k₂+k₃ ± 2√(k₁k₂ + k₂k₃ + k₃k₁). Los dos signos son exactamente las dos respuestas de Apolonio: el signo + da el pequeño círculo inscrito, el signo − da el otro círculo tangente al lado opuesto.",
        },
        {
          pretitle: "Paso tres · Relleno recursivo",
          title: "Cada hueco es una nueva semilla",
          body: "Una vez colocada la cuádrupla semilla, cada hueco triangular curvo queda él mismo limitado por tres círculos mutuamente tangentes — exactamente la configuración de la que partimos. Suelta el círculo inscrito en cada hueco usando el signo + de la fórmula de Descartes. Ese círculo parte su antiguo hueco en tres nuevos triángulos curvos más pequeños, y el proceso recursea. Continúa indefinidamente y la unión de todos los círculos dibujados es la junta apoloniana. El polvo restante tiene medida de Lebesgue cero, pero dimensión de Hausdorff alrededor de 1,3056867 — un fractal de verdad, entre curva y superficie.",
        },
        {
          pretitle: "Paso cuatro · La sorpresa entera",
          title: "Cuando todas las curvaturas son enteras",
          body: "Elige las cuatro curvaturas semilla (k₁, k₂, k₃, k₄) como enteros. Entonces la fórmula de Descartes k₄ = k₁+k₂+k₃ ± 2√(…) obliga a que cada curvatura siguiente sea también entera — la raíz cuadrada se cancela gracias a (k₁+k₂+k₃+k₄)² = 2(k₁²+…+k₄²), y cada círculo nuevo hereda la integridad de sus padres. El empaquetamiento (−1, 2, 2, 3) se llena con curvaturas 6, 11, 14, 15, 18, 23, … y cualquier otro empaquetamiento apoloniano entero — (−2, 3, 6, 7), (−3, 5, 8, 8), (−4, 8, 9, 9), (−6, 11, 14, 15) — hace lo mismo. Qué enteros aparecen y cuáles nunca es una pregunta abierta de geometría aritmética: un esqueleto teórico-numérico oculto dentro de una imagen de círculos.",
        },
      ],
    },
    phi: {
      pretitle: "Tema · Geometría",
      title: "Razón áurea y Fibonacci",
      tagline: "Una recurrencia simple. La razón que se esconde en todas partes.",
      intro:
        "El Explorador sigue la sucesión de Fibonacci mientras los cocientes consecutivos se acercan a φ, dibuja la espiral áurea construida con cuadrados de Fibonacci anidados y te deja inclinar el patrón de filotaxis de un girasol según el ángulo áureo. Tres vistas, un número — y la diferencia entre dónde aparece φ de verdad y dónde la sobrevende la infografía.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La ecuación definitoria",
          title: "Un número igual a su propio cuadrado menos uno",
          body: "Resuelve φ² = φ + 1. La raíz positiva es φ = (1 + √5) / 2 ≈ 1,6180339887. Esa única ecuación contiene casi todo: divide ambos lados por φ y obtienes φ = 1 + 1/φ, así que 1/φ = φ − 1 ≈ 0,6180339887. El recíproco es el original menos uno — una propiedad que ningún otro número positivo tiene. La raíz negativa es ψ = (1 − √5)/2 ≈ −0,6180, y la pareja (φ, ψ) es el motor de cada identidad de Fibonacci de abajo.",
        },
        {
          pretitle: "Paso dos · Fibonacci",
          title: "Suma los dos últimos, para siempre",
          body: "Empieza con F₀ = 0, F₁ = 1, y luego itera Fₙ₊₁ = Fₙ + Fₙ₋₁: 0, 1, 1, 2, 3, 5, 8, 13, 21, 34, 55, 89, 144, … . Toma el cociente de términos consecutivos — 1, 2, 1,5, 1,667, 1,6, 1,625, 1,615, 1,619 — y se aproxima a φ. La fórmula cerrada de Binet hace ese límite exacto: Fₙ = (φⁿ − ψⁿ)/√5. Como |ψ| < 1, el término ψⁿ se desvanece y Fₙ acaba quedando, por redondeo, muy cerca de φⁿ/√5 para todo n.",
        },
        {
          pretitle: "Paso tres · El ángulo áureo y los girasoles",
          title: "Por qué un girasol gira 137,508° por semilla",
          body: "Toma un disco, coloca las semillas una tras otra y rota un ángulo fijo entre cada una. El modelo de Vogel coloca la semilla n a radio rₙ = c√n (para que el área por semilla sea constante) y a ángulo θₙ = n · α. Elige α = 360°/φ² ≈ 137,508° — el ángulo áureo — y las semillas se empacan densamente sin huecos ni dirección preferida. Cualquier fracción racional de una vuelta encajaría tras unas pocas rotaciones y dejaría huecos radiales; φ es el irracional peor aproximable por racionales, así que el patrón no se repite. Girasoles, piñas, romanesco y las hojas de muchas plantas usan exactamente este truco.",
        },
        {
          pretitle: "Paso cuatro · Escepticismo sano",
          title: "Dónde está φ de verdad — y dónde no",
          body: 'φ no gobierna el Partenón, ni la Mona Lisa, ni la concha del nautilo, pese a incontables infografías; esos ajustes son dudosos en el mejor de los casos y sesgo de confirmación en el peor. Donde φ aparece honestamente es en crecimiento y optimización: la filotaxis (arriba), la teoría de fracciones continuas (φ = [1; 1, 1, 1, …], lo que lo hace el de convergencia más lenta — el "más irracional" — de todos), y la geometría de las teselaciones de Penrose y los cuasicristales, cuyo orden de largo alcance se construye a partir de φ. Real, hermoso y más estrecho de lo que sugieren los pósters.',
        },
      ],
    },
    buffon: {
      pretitle: "Tema · Análisis",
      title: "La aguja de Buffon",
      tagline: "Suelta palitos en papel rayado. Sale π.",
      intro:
        "Georges-Louis Leclerc, conde de Buffon, planteó la pregunta en 1733 y la publicó en 1777: deja caer una aguja sobre un suelo de líneas paralelas y cuenta los cruces. El cociente devuelve π — una constante de los círculos saliendo de agujas rectas sobre madera recta. El Explorador simula los lanzamientos en vivo y te deja ver cómo la estimación se acerca a π = 3,14159…",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El planteamiento",
          title: "Líneas paralelas y una aguja",
          body: "Reglea un suelo con líneas paralelas a distancia d entre sí. Toma una aguja de longitud ℓ, con ℓ ≤ d, y déjala caer de modo que su centro aterrice en una posición uniformemente aleatoria y su ángulo sea uniforme en [0, π]. La aguja cruza alguna línea o no. Ese es todo el planteamiento — dos parámetros, una pregunta de sí o no, repetida muchísimas veces.",
        },
        {
          pretitle: "Paso dos · La probabilidad",
          title: "Por qué aparece π",
          body: "Integra sobre la altura del centro y el ángulo θ, y la probabilidad de que la aguja cruce una línea sale exactamente P = 2ℓ / (πd). Reordena: π = 2ℓn / (d·k), donde n es el total de agujas soltadas y k el número que cruzó una línea. π emerge de agujas rectas cayendo sobre líneas rectas porque el ángulo θ promedia un seno — y un seno, integrado sobre un semicírculo, lleva en secreto a π.",
        },
        {
          pretitle: "Paso tres · Convergencia lenta",
          title: "Los sospechosos seis dígitos de Lazzarini",
          body: "El error de Monte Carlo decae como 1/√n. Para fijar tres decimales de π hacen falta del orden de 10⁵ agujas, y ni siquiera diez millones bastan para alta precisión. En 1901, el matemático italiano Mario Lazzarini reportó π ≈ 3,1415929 a partir de solo 3408 lanzamientos — seis dígitos correctos, sospechosamente cerca de la conocida aproximación 355/113. Es casi seguro que paró en el momento afortunado o arregló el experimento para que cayera allí. La convergencia es genuinamente lenta; el número de Lazzarini es demasiado bonito para ser honesto.",
        },
        {
          pretitle: "Paso cuatro · Los fideos de Buffon",
          title: "Solo importa la longitud",
          body: "El mismo cálculo funciona para ℓ > d, donde son posibles varios cruces por lanzamiento y la fórmula cerrada es más elaborada. Más sorprendente es el fideo de Buffon: toma cualquier curva plana C de longitud L, por torcida o quebrada que sea, y déjala caer sobre el mismo suelo rayado. El número esperado de cruces es 2L / (πd), sea cual sea la forma. Aguja recta o fideo retorcido: solo cuenta la longitud. El mismo π, escondido en cualquier curva.",
        },
      ],
    },
    hilberthotel: {
      pretitle: "Tema · Paradoja",
      title: "El hotel de Hilbert",
      tagline: "Siempre hay sitio para uno más — incluso lleno.",
      intro:
        "David Hilbert esbozó el hotel en una conferencia de 1924, y George Gamow lo llevó al gran público en su libro de 1947 Uno, dos, tres… infinito. El Explorador anima los cuatro escenarios clásicos — un huésped, k huéspedes, ℵ₀ huéspedes y ℵ₀ autobuses con ℵ₀ huéspedes cada uno — y muestra que un hotel infinito ya lleno puede absorberlos a todos.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Imagina el hotel",
          title: "Infinitas habitaciones, todas ocupadas",
          body: "El hotel tiene una habitación por cada número natural: 1, 2, 3, y así para siempre. Esta noche todas y cada una de las habitaciones están ocupadas — un huésped en la 1, otro en la 2, otro en la 17, otro en la 10¹⁰⁰. El sentido común llama a esto 'lleno': no hay habitación sin huésped. Las matemáticas discrepan, porque 'lleno' es una idea finita y el conjunto de habitaciones aquí es contablemente infinito. La cardinalidad de los huéspedes es ℵ₀, y ℵ₀ no es un número — es el tamaño de los naturales.",
        },
        {
          pretitle: "Paso dos · Un huésped nuevo",
          title: "Desplaza n → n+1 y la habitación 1 queda libre",
          body: "Un viajero llama a la puerta. El gerente difunde una única instrucción: cada huésped, muévete de la habitación n a la n+1. El de la 1 va a la 2, el de la 2 a la 3, y así; nadie queda desplazado porque siempre hay una habitación de número más alto esperando. Tras el desplazamiento, la habitación 1 está vacía y el recién llegado se registra. El hotel 'lleno' no lo estaba nunca en sentido finito — tenía ℵ₀ + 1 = ℵ₀ todo el rato.",
        },
        {
          pretitle: "Paso tres · Infinitos nuevos huéspedes",
          title: "Envía al huésped n a la habitación 2n; toda habitación impar se abre",
          body: "Ahora llega una cola contablemente infinita. El gerente pide a cada huésped existente de la habitación n que se mude a la 2n. El huésped 1 va a la 2, el 2 a la 4, el 3 a la 6 — todas las habitaciones pares siguen ocupadas y todas las impares quedan libres. Los recién llegados ocupan la 1, 3, 5, 7, … en orden y todos tienen llave. Esto es la igualdad ℵ₀ + ℵ₀ = ℵ₀: dos copias de los naturales caben en una sola sin pérdida.",
        },
        {
          pretitle: "Paso cuatro · Infinitos autobuses con infinitos pasajeros cada uno",
          title: "Potencias de primos absorben ℵ₀ × ℵ₀",
          body: "Una flota de infinitos autobuses contables se detiene, cada uno con infinitos pasajeros contables. Envía a cada huésped existente desde la habitación n a la 2ⁿ — ocupan las potencias de dos. Para el autobús k (k = 1, 2, 3, …), sea pₖ el k-ésimo primo impar (3, 5, 7, 11, 13, …) y envía al pasajero m a la habitación pₖᵐ. El autobús 1 cae en 3, 9, 27, 81, …; el 2 en 5, 25, 125, …; el 3 en 7, 49, …. Por el teorema fundamental de la aritmética, cada potencia de primo es única, así que no chocan dos huéspedes. ℵ₀ × ℵ₀ = ℵ₀.",
        },
      ],
    },
    gabrielshorn: {
      pretitle: "Tema · Paradoja",
      title: "El cuerno de Gabriel",
      tagline: "Volumen finito, superficie infinita.",
      intro:
        "Una figura de 1641 que tragó toda la intuición que los matemáticos tenían sobre el infinito. El Explorador corta el cuerno en una x variable, dibuja la vista lateral y calcula el volumen y la superficie en vivo — observa cómo uno permanece manso y el otro se desboca.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La figura",
          title: "Gira y = 1/x alrededor del eje",
          body: "Toma la curva y = 1/x para x ≥ 1 y gírala alrededor del eje x. El resultado es un cuerno esbelto que se abre cerca de x = 1 y se afina eternamente hacia radio cero a medida que x crece. Cada sección transversal perpendicular al eje es un disco de radio 1/x. El cuerno se extiende infinitamente lejos a la derecha y, sin embargo, en cada punto su anchura está disminuyendo. Evangelista Torricelli describió la figura en 1641 — tres décadas antes de que Newton y Leibniz tuvieran el cálculo donde apoyarse.",
        },
        {
          pretitle: "Paso dos · Calcula el volumen",
          title: "V = π — exactamente",
          body: "Corta el cuerno en discos de grosor dx y radio 1/x. El volumen de cada disco es π · (1/x)² · dx. Súmalos todos de 1 a infinito: V = π ∫₁^∞ (1/x)² dx = π · [−1/x]₁^∞ = π. Finito. Todo el cuerno infinito podría llenarse hasta el borde con exactamente π unidades cúbicas de pintura. La integral convergente ∫ 1/x² dx es la que lo mantiene acotado — los cuadrados se desvanecen lo bastante rápido para que la suma se asiente.",
        },
        {
          pretitle: "Paso tres · Calcula la superficie",
          title: "A = ∞ — exactamente",
          body: "El área lateral es A = 2π ∫₁^∞ (1/x) · √(1 + 1/x⁴) dx. El factor con raíz cuadrada es siempre al menos 1, así que A ≥ 2π ∫₁^∞ (1/x) dx = 2π · [ln x]₁^∞. Esa es la integral armónica, y diverge. Por mucho que camines por el cuerno sigues añadiendo área lateral, y el total no deja de crecer. La superficie es infinita — ninguna cantidad finita de pintura la cubrirá.",
        },
        {
          pretitle: "Paso cuatro · La paradoja del pintor",
          title: "Llénalo; nunca lo pintes",
          body: "Aquí está el acertijo: vierte π unidades de pintura y el cuerno está lleno — incluida su pared interior. Y, sin embargo, para cubrir el exterior necesitarías infinita. Torricelli halló el resultado contraintuitivo incluso antes de que existiera el cálculo para nombrar el truco. La resolución moderna es que 'pintar' supone una capa de grosor no nulo ε, que sobre una superficie infinita necesita volumen infinito. Quita esa suposición y la paradoja se disuelve: la 'pintura' matemática de dentro tiene grosor cero sobre la pared, y la pared interior es la misma superficie infinita que la exterior. El nombre viene después — el cuerno del arcángel Gabriel, que se hace sonar para anunciar el día del juicio.",
        },
      ],
    },
    cantor: {
      pretitle: "Tema · Paradoja",
      title: "El argumento diagonal de Cantor",
      tagline: "El infinito tiene tallas.",
      intro:
        "El argumento diagonal de Georg Cantor de 1891 es la prueba más limpia en matemáticas de que algunos infinitos son mayores que otros. El Explorador anima la construcción en vivo: elige cualquier listado de decimales en [0,1] y observa cómo un nuevo número real sale de la diagonal — uno que no puede estar en tu lista, por muy ingeniosamente que la hayas ordenado.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Plantear lo imposible",
          title: "Supón que los reales pueden listarse",
          body: "La prueba de Cantor es por contradicción. Supón que los números reales entre 0 y 1 son contables — es decir, que pueden ordenarse en una sucesión infinita r₁, r₂, r₃, …, con cada real apareciendo en algún sitio de la lista. Ojo, nunca decimos en qué orden: el argumento debe funcionar para cualquier orden que se te pueda ocurrir. Si podemos encontrar un solo real que el listado se haya saltado, la suposición de que tal listado completo existe queda muerta.",
        },
        {
          pretitle: "Paso dos · Leer la diagonal",
          title: "Un dígito tras otro, bajando la escalera",
          body: "Escribe cada rₙ como una expansión decimal 0,d_{n,1} d_{n,2} d_{n,3} …, de modo que d_{n,k} sea el k-ésimo dígito del n-ésimo real. Ahora lee directamente por la diagonal: d_{1,1}, luego d_{2,2}, luego d_{3,3}, y así. Construye un nuevo número s = 0,s₁ s₂ s₃ … eligiendo cada dígito sₙ distinto de d_{n,n}. Una receta segura es intercambiar 5 ↔ 6 (cualquier regla que evite 0 y 9 esquiva la ambigüedad 0,999… = 1,000…).",
        },
        {
          pretitle: "Paso tres · Por qué s falta",
          title: "Diferente en el n-ésimo dígito, cada vez",
          body: "Por construcción, s difiere de r₁ en el primer decimal, de r₂ en el segundo, de r₃ en el tercero — de rₙ en el n-ésimo, para todo n. Así que s no puede ser igual a ningún rₙ de la lista. Y, sin embargo, s es un número real perfectamente válido en [0, 1]. Se suponía que la lista contenía todos esos reales, y aquí hay uno que se le ha escapado. La suposición se derrumba: ningún listado de los reales puede ser completo. Los reales entre 0 y 1 son incontables.",
        },
        {
          pretitle: "Paso cuatro · Un nuevo tipo de infinito",
          title: "Continuo, halting, Gödel — la misma diagonal",
          body: "Los reales tienen cardinalidad estrictamente mayor que los naturales: |ℝ| = 2^ℵ₀ = c > ℵ₀. El mismo truco diagonal alimenta la demostración de Turing de que el problema de la parada es indecidible, y el primer teorema de incompletitud de Gödel — ambos construyen una sentencia que discrepa con cada entrada de una lista de candidatos. Cantor preguntó después si existe alguna cardinalidad estrictamente entre ℵ₀ y c. Esta es la hipótesis del continuo. Gödel (1940) y Cohen (1963) mostraron juntos que es independiente de ZFC: asúmela cierta y los axiomas siguen siendo consistentes; asúmela falsa y los axiomas siguen siendo consistentes. La matemática, en este punto, deja la puerta abierta.",
        },
      ],
    },
    boids: {
      pretitle: "Tema · Computación",
      title: "Boids",
      tagline: "Tres reglas locales. Una bandada entera.",
      intro:
        "Craig Reynolds dio a cada ave simulada tres pequeños instintos en 1986 y los soltó — sin líder, sin plan global, sin mapa compartido. De esos tres impulsos locales emergió una bandada. El Explorador te deja ajustar las tres reglas en tiempo real y ver cómo se propaga la coreografía entera.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El agente",
          title: "Un punto con rumbo",
          body: "Cada boid es un puntito en movimiento: tiene una posición y una velocidad. Esa es toda la memoria que cada agente lleva. No puede ver la bandada entera — solo el puñado de vecinos dentro de un pequeño radio de percepción. No hay mapa, ni líder a seguir, ni mensajes entre agentes. Solo una posición, una velocidad y lo que está a la vista.",
        },
        {
          pretitle: "Paso dos · Las tres reglas",
          title: "Separación, alineación, cohesión",
          body: "Cada fotograma, cada boid calcula tres pequeños vectores de dirección a partir de los vecinos dentro de su radio de percepción. SEPARACIÓN: gira para alejarte de cualquier boid que se haya acercado demasiado, ponderado por cuánto. ALINEACIÓN: empuja tu velocidad hacia la velocidad media de tus vecinos. COHESIÓN: gira hacia el centro de masas de los vecinos que ves. Los tres vectores se suman con pesos y se añaden a la velocidad en cada fotograma. Ese es todo el algoritmo.",
        },
        {
          pretitle: "Paso tres · Emergencia",
          title: "Ni líder, ni plan, ni charla",
          body: "Partiendo de posiciones aleatorias y rumbos aleatorios, los boids se organizan en bandadas apretadas en cuestión de segundos. Se forman corrientes, se parten alrededor de obstáculos y se vuelven a unir — exactamente la coreografía de los murmullos reales de estorninos, de las bolas de cebo de sardinas y de los enjambres de murciélagos. Nada en el programa sabe nada de bandadas. La bandada es como se ven las tres reglas desde fuera. Es una de las demostraciones más limpias de emergencia en toda la informática.",
        },
        {
          pretitle: "Paso cuatro · Adónde llega",
          title: "De SIGGRAPH 1987 al cielo nocturno",
          body: "Reynolds llamó a los agentes boids — corto de bird-oid object — y presentó el artículo 'Flocks, Herds, and Schools: A Distributed Behavioral Model' en SIGGRAPH 1987. En cinco años su algoritmo animaba el enjambre de murciélagos en Batman Returns (1992) y la estampida de ñus en El Rey León (1994). Hoy las mismas tres reglas mueven simulaciones de evacuación, investigación de enjambres robóticos y la coreografía de los espectáculos de 1000 drones de Intel. El modelo de bandada es hermano de la optimización por enjambre de partículas — el mismo descubrimiento, repurposado para la búsqueda.",
        },
      ],
    },
    aizawa: {
      pretitle: "Tema · Caos",
      title: "El atractor de Aizawa",
      tagline: "El primo más raro y extraño de Lorenz.",
      intro:
        "Tres ecuaciones diferenciales acopladas arrastran un único punto por el espacio 3D. A diferencia de la mariposa de Lorenz, aquí la trayectoria se pliega en un toro anudado con asas de cesta y una espiga vertical que le atraviesa el corazón — uno de los atractores extraños visualmente más distintivos de la teoría del caos.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Las ecuaciones",
          title: "Tres ecuaciones, siete parámetros",
          body: "ẋ = (z − b)·x − d·y · ẏ = d·x + (z − b)·y · ż = c + a·z − z³/3 − (x² + y²)·(1 + e·z) + f·z·x³. Elige cualquier punto inicial. Integra hacia delante en el tiempo con un paso pequeño (vale el método de Euler; Runge-Kutta es mejor). El punto traza una curva en el espacio. Córrelo durante miles de pasos y la curva vuelve a quedar a un brazo de sí misma y, después, se aparta — sin repetirse exactamente nunca, manteniéndose siempre en una región acotada. Eso es el atractor extraño.",
        },
        {
          pretitle: "Paso dos · La geometría por defecto",
          title: "Jarrón, cesta, espiga",
          body: "Con los parámetros clásicos de Aizawa (a = 0,95, b = 0,7, c = 0,6, d = 3,5, e = 0,25, f = 0,1), la trayectoria envuelve un toro en la mitad inferior de la figura, luego sube por un cuello fino vertical y baja al toro por el lado opuesto. El resultado parece un jarrón acanalado con un hilo atravesado. Desde el ángulo correcto parece una cesta. Desde otro parece un corazón con una espiga. Lo visual es parte de por qué el atractor de Aizawa se escapó de los libros de texto: fotografía mejor que cualquiera de los demás.",
        },
        {
          pretitle: "Paso tres · Ajustar los diales",
          title: "Geometría sensible",
          body: "Aizawa es más rico en parámetros que Lorenz, lo que lo hace más sensible al ajuste. Disminuye el parámetro c en 0,1 y la espiga se retrae en la cesta. Aumenta d y los bucles de abajo se vuelven más apretados, más densos, como un tejido más cerrado. Algunas combinaciones de parámetros colapsan en un ciclo límite (ya no hay caos); otras se disparan al infinito. El régimen caótico es una banda estrecha del espacio de parámetros y la geometría dentro de esa banda se transforma de modo continuo a medida que mueves los diales.",
        },
        {
          pretitle: "Paso cuatro · Una pequeña familia",
          title: "Rössler, Thomas y compañía",
          body: "Aizawa es una entrada de una pequeña familia de atractores extraños de tres ecuaciones descubiertos a lo largo de los años setenta y ochenta. Rössler (1976) es aún más simple — un solo término no lineal, y la trayectoria es una espiral plana con un pliegue, como una roseta de Möbius. El atractor cíclicamente simétrico de Thomas usa solo funciones seno y produce una maraña de cubos conectados por hilos caóticos. Los tres viven en 3D con trayectorias continuas — sin paso de tiempo, sin retícula, sin discretización, solo la matemática arrastrando un punto.",
        },
      ],
    },
    dla: {
      pretitle: "Tema · Caos",
      title: "Agregación limitada por difusión",
      tagline: "Caminantes aleatorios que se congelan al tocar — y hacen crecer corales.",
      intro:
        "Un píxel semilla. Un enjambre de partículas, cada una en su propia caminata aleatoria. En cuanto una partícula errante choca con el agregado, se pega para siempre. Repítelo diez mil veces y de la nada florece una dendrita ramificada — la misma forma que toma el cobre cuando se electrodeposita, que toma el liquen sobre una pared, que el rayo deja sobre la piel desnuda.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El planteamiento",
          title: "Una semilla y una niebla de caminantes",
          body: "Patio de juegos con cuadrícula de píxeles. Coloca un único píxel negro en el centro: la semilla. Ahora libera una partícula en un punto al azar lejos de la semilla. La partícula realiza una caminata aleatoria — cada paso elige una de cuatro direcciones uniformemente — y continúa hasta que aterriza junto al agregado (y pasa a formar parte de él) o se aleja demasiado (y se olvida). Libera la siguiente partícula. Y la siguiente. Diez mil partículas después, tienes una imagen.",
        },
        {
          pretitle: "Paso dos · La regla de pegado",
          title: "Tocar = congelarse, para siempre",
          body: "Hay una regla. Una partícula que camina y queda adyacente a cualquier píxel del agregado se convierte en píxel del agregado y deja de moverse. Esa es toda la física. La razón por la que la estructura es ramificada y no informe es geométrica: es mucho más probable que un caminante errante sea interceptado por una punta expuesta del agregado a que se cuele por un fiordo profundo. Las puntas crecen más rápido que los valles. Aparecen ramas. El interior se queda sin recién llegados.",
        },
        {
          pretitle: "Paso tres · La dimensión fractal",
          title: "1,71 — independiente de la semilla",
          body: "Witten y Sander publicaron el modelo en 1981 y mostraron numéricamente que en una red 2D el agregado resultante tiene dimensión fractal ≈ 1,71. Eso está estrictamente entre una curva (dimensión 1) y una región rellena (dimensión 2) y — crucialmente — no depende de la forma de la semilla, ni del tipo de red, ni del radio de aparición. Procesos físicos que parecen, en superficie, no tener nada que ver dan exactamente la misma dimensión. El número es universal en el mismo sentido en que π lo es.",
        },
        {
          pretitle: "Paso cuatro · Dónde aparece",
          title: "Cobre, rayo, liquen, neuronas",
          body: "Reemplaza los caminantes abstractos por iones de cobre en una disolución de sulfato y activa una corriente; el metal se deposita sobre el cátodo con el mismo patrón dendrítico. Reemplázalos por electrones filtrándose por un dieléctrico y obtienes una figura de Lichtenberg — la cicatriz con forma de rayo que el alto voltaje deja en la madera, en el acrílico o en un cuerpo humano alcanzado por un rayo. Reemplázalos por esporas aerotransportadas aterrizando en un árbol y obtienes la silueta de una colonia de liquen. Siempre que la difusión choca con algo pegajoso irreversiblemente, puedes predecir la imagen a partir de una sola regla.",
        },
      ],
    },
    langton: {
      pretitle: "Tema · Computación",
      title: "La hormiga de Langton",
      tagline: "Dos reglas · diez mil pasos · una autopista.",
      intro:
        "Coloca una sola hormiga sobre una cuadrícula infinita de casillas blancas. Dos reglas le dicen qué hacer. Durante los primeros diez mil pasos el rastro parece caos. Entonces — sin previo aviso — entra en un patrón perfectamente periódico de 104 pasos que se aleja al infinito. Dos reglas, un milagro emergente sin explicación.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Las reglas",
          title: "Dos líneas son el programa entero",
          body: "Hay una hormiga mirando hacia una de cuatro direcciones, sobre una cuadrícula cuadrada infinita en la que cada casilla es blanca o negra. En cada tic: mira la casilla en la que estás. Si es BLANCA: cámbiala a negra, gira 90° en sentido horario y avanza una casilla. Si es NEGRA: cámbiala a blanca, gira 90° en sentido antihorario y avanza una casilla. Esa es la especificación completa — Christopher Langton la escribió en 1986. No hay número aleatorio, ni consulta de vecindario, ni parámetros. Dos líneas.",
        },
        {
          pretitle: "Paso dos · Tres regímenes",
          title: "Simetría simple, luego caos, luego…",
          body: "Corre la hormiga sobre una cuadrícula en blanco y observa. Durante unos 100 pasos el rastro es pequeño y bilateralmente simétrico — las reglas son deterministas, el inicio está vacío, el patrón tiene que respetar ambos ejes. Hacia el paso 500 la simetría se hace añicos y el rastro parece esencialmente aleatorio: una maraña de casillas negras sin estructura visible a ninguna escala. Esa fase dura unos diez mil pasos y frustró a los investigadores durante casi una década. Entonces empieza el tercer régimen.",
        },
        {
          pretitle: "Paso tres · La autopista",
          title: "Un bucle de 104 pasos, a la deriva eternamente",
          body: "En algún punto cerca del paso 10.000 — el momento exacto depende del patrón inicial, pero siempre está por ahí — la hormiga se traba en un ciclo repetitivo de 104 pasos que la traslada dos casillas en diagonal por vuelta. Desde fuera parece que está dejando una pulcra 'autopista' a rayas hacia la esquina. La seguirá, sin perturbarla, para siempre. Bunimovich y Troubetzkoy probaron en 1992 que, sea cual sea la disposición finita de casillas negras con la que empieces, la trayectoria de la hormiga es siempre no acotada — no puede quedar atrapada. Si la autopista aparece siempre es una conjetura abierta. Hasta ahora, siempre lo ha hecho.",
        },
        {
          pretitle: "Paso cuatro · Por qué importa",
          title: "Universalidad oculta en dos líneas",
          body: "Toma la hormiga y cambia 'dos colores' por 'n colores' y una regla de giro distinta por color. Algunas de esas hormigas generalizadas son Turing-completas — Gajardo, Moreira y Goles lo demostraron: puedes codificar cualquier programa informático en el patrón inicial, y la trayectoria de la hormiga es la ejecución de ese programa. Así que un sistema lo bastante simple para caber en una servilleta es, disfrazado, cualquier computadora que pueda construirse jamás. Ese es el rompecabezas de la emergencia celular en su forma más pura.",
        },
      ],
    },
    pascalmod: {
      pretitle: "Tema · Geometría",
      title: "El triángulo de Pascal (mod n)",
      tagline: "Colorea por divisibilidad — sale un fractal.",
      intro:
        "El triángulo de Pascal es la tabla de consulta de los coeficientes binomiales C(n, k). Cada número es la suma de los dos de arriba. Reduce cada entrada módulo un primo y el patrón de colores resultante es un fractal perfecto e infinito. ¿Por qué? Por cuándo ocurren los acarreos en la suma en base p.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El triángulo",
          title: "Números a partir de la regla más simple de la Tierra",
          body: "Escribe un 1 en la cima. Debajo, cada entrada es la suma de las dos de arriba (trata las posiciones vacías como cero). Las primeras seis filas: 1 · 1 1 · 1 2 1 · 1 3 3 1 · 1 4 6 4 1 · 1 5 10 10 5 1. Los números son los coeficientes binomiales C(n, k) — cuentan el número de formas de elegir k objetos de entre n. Aparecen en probabilidad, en álgebra (la expansión de (a + b)ⁿ), en combinatoria. También son el único ingrediente necesario para ver un fractal.",
        },
        {
          pretitle: "Paso dos · Colorea por resto",
          title: "Mod 2: casillas impares llenas, pares en blanco",
          body: "Ahora sustituye cada entrada por su resto módulo 2 (su paridad). Rellena los 1, deja los 0 en blanco y da un paso atrás. Lo que ves es el triángulo de Sierpiński — exacto, infinito, generado únicamente por contar. Toma cualquier bloque de 2^k filas y la imagen son tres copias del mismo bloque de tamaño 2^(k-1) dispuestas en triángulo, con un agujero en el centro. La misma estructura autosemejante baja hasta el fondo.",
        },
        {
          pretitle: "Paso tres · El teorema de Kummer",
          title: "La ley oculta: cuenta los acarreos",
          body: "¿Por qué el Pascal mod p se factoriza tan limpiamente? En 1852, Kummer probó un hecho asombroso. La mayor potencia de un primo p que divide a C(n, k) es igual al número de acarreos que ocurren al sumar k y (n − k) en base p. Así que C(n, k) es divisible por p (mod 0) exactamente cuando hay al menos un acarreo; es no nulo mod p exactamente cuando k puede sumarse a (n − k) en base p sin acarreo — es decir, cuando cada dígito en base p de k es a lo sumo el correspondiente dígito de n. El fractal es, en secreto, una imagen de cuándo la suma en base p es limpia.",
        },
        {
          pretitle: "Paso cuatro · Otros primos",
          title: "Distinto p, distinta junta",
          body: "Para p = 3 obtienes una junta triangular con tres colores y estructura autosemejante de orden 3. Para p = 5 el periodo es 5; para p = 7 la junta es aún más densa. A medida que p crece, la dimensión de Hausdorff del fractal se acerca a 2 — la imagen se llena. Para módulos no primos la estructura existe pero se vuelve irregular (el limpio recuento de acarreos de Kummer solo funciona para primos). Una sola tabla combinatoria sencilla, una familia infinita de fractales.",
        },
      ],
    },
    sternbrocot: {
      pretitle: "Tema · Análisis",
      title: "El árbol de Stern-Brocot",
      tagline: "Cada fracción, exactamente una vez — construido sumando mal.",
      intro:
        "Empieza con 0/1 y 1/0 — las dos imposibilidades. Mete una fracción nueva entre ellas sumando numeradores y denominadores por separado, como lo haría un niño. Repite indefinidamente. El árbol infinito que construyes contiene cada fracción positiva una sola vez, en términos mínimos — y el camino hasta cada una es exactamente su expansión en fracción continua.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La mediante",
          title: "Suma los trozos por separado, obtienes algo nuevo",
          body: "Toma dos fracciones, a/b y c/d. Su mediante es (a + c) / (b + d). Esa es, por supuesto, la forma equivocada de sumar fracciones. Pero produce algo interesante: una fracción estrictamente entre a/b y c/d. Empieza con 0/1 y 1/0 (trata 1/0 como +∞). Su mediante es 1/1. Mete 1/1 entre ellas. Ahora toma los nuevos pares: (0/1, 1/1) da 1/2; (1/1, 1/0) da 2/1. Mete ambas. Repite. Las fracciones avanzan por la recta numérica, todas ya en términos mínimos.",
        },
        {
          pretitle: "Paso dos · Cada fracción, una vez",
          title: "Nada se omite, nada se repite",
          body: "Es un teorema — demostrable en unas pocas líneas — que las ramas del árbol de Stern-Brocot enumeran los racionales positivos sin omisión y sin repetición: cada fracción reducida p/q aterriza en un único nodo, con p y q ya coprimos. Así que el árbol es, a la vez, un listado completo de los racionales positivos, un testimonio de que solo hay un número contable de ellos y una manera estructuralmente justa de construirlos. Stern (1858) y Brocot (1861) descubrieron el mismo árbol de manera independiente — Stern como teoría de números, Brocot como herramienta de relojero para elegir relaciones de engranajes.",
        },
        {
          pretitle: "Paso tres · El camino de la fracción continua",
          title: "Izquierda y derecha codifican la expansión",
          body: "Elige cualquier número positivo — racional o irracional. Baja por el árbol empezando en 1/1. En cada paso ve a la IZQUIERDA si tu objetivo es menor que la fracción actual, a la DERECHA si es mayor. Anota la secuencia de movimientos como una lista de longitudes de ráfaga. Esa lista es exactamente la expansión en fracción continua de tu objetivo. Por ejemplo: la razón áurea φ = (1+√5)/2 ≈ 1,618 produce el camino R, L, R, L, R, L, … — alternando uno a uno — que codifica la fracción continua [1; 1, 1, 1, 1, …]. φ es, en este sentido, el número irracional 'más difícil' de aproximar por racionales.",
        },
        {
          pretitle: "Paso cuatro · Mejores aproximaciones",
          title: "Detenerse pronto da los convergentes",
          body: "Detén la marcha tras cualquier número finito de pasos. La fracción en la que te encuentras es una mejor aproximación racional de tu objetivo — mejor que cualquier racional con denominador más pequeño. Así que la sucesión de fracciones que visitas en el camino hacia π te da 3, 22/7, 333/106, 355/113, 103993/33102 — los famosos convergentes que las culturas humanas redescubrieron una y otra vez durante siglos. La misma construcción que enumera los racionales también escoge los mejores.",
        },
      ],
    },
    ulam: {
      pretitle: "Tema · Análisis",
      title: "La espiral de Ulam",
      tagline: "Primos alineados en diagonales que nadie explica del todo.",
      intro:
        "Stanisław Ulam, aburrido en una conferencia de 1963, dibujó garabateando los enteros en una espiral cuadrada y rodeó los primos. Los primos no se dispersaron. Se apiñaron a lo largo de diagonales visibles. Por qué los primos prefieren ciertas formas cuadráticas a otras es uno de los problemas no resueltos más profundos de la teoría de números — Ulam lo vio en una servilleta.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La espiral",
          title: "1 en el centro, después camina en cuadrados",
          body: "Escribe 1 en el centro. Da un paso a la derecha para escribir 2. Un paso arriba para 3. Pasos a la izquierda para 4 y 5. Pasos abajo para 6, 7 y 8. Continúa en una espiral cuadrada que crece hacia fuera. Cuando hayas colocado un centenar de números tendrás una rejilla de 10 × 10 donde cada celda guarda un entero positivo, y enteros que están uno al lado del otro en el papel ya no lo están en la recta numérica. Esa es toda la construcción.",
        },
        {
          pretitle: "Paso dos · Colorea los primos",
          title: "Un patrón que no debería estar ahí",
          body: "Ahora rellena solo las celdas cuyo número es primo — deja el resto en blanco. Si los primos fueran verdaderamente aleatorios entre los enteros, la rejilla parecería un moteado uniforme, como estática. En cambio, el ojo es atraído por líneas diagonales claras que cruzan la imagen. El patrón no es sutil: incluso un parche de treinta por treinta ya lo muestra. Ulam, Myron Stein y Mark Wells publicaron la observación en 1964 con una rejilla de 65 000 números impresa a varias páginas en Scientific American.",
        },
        {
          pretitle: "Paso tres · Por qué diagonales",
          title: "Cada diagonal es un polinomio 4n² + bn + c",
          body: "Los números a lo largo de cualquier diagonal de la espiral de Ulam satisfacen una fórmula cuadrática de la forma 4n² + bn + c. Una diagonal llena de primos significa, por tanto, que el polinomio es inusualmente rico en primos. Algunas son espectaculares. El polinomio de Euler n² − n + 41 — descubierto en 1772 — produce primos para todo n de 0 a 39, y corresponde a una racha diagonal visible. Si en una diagonal específica hay infinitos primos sigue sin demostrarse. La conjetura de Bunyakovsky dice que sí; nadie lo ha probado.",
        },
        {
          pretitle: "Paso cuatro · El problema más profundo",
          title: "Una pregunta abierta con maquillaje",
          body: "La espiral de Ulam es un reordenamiento cosmético de los enteros, pero las diagonales visibles codifican una pregunta abierta y profunda: ¿qué polinomios cuadráticos en ℤ[x] producen infinitos primos? Varias conjeturas de Hardy-Littlewood y de Bateman-Horn predicen densidades exactas para esos primos — concuerdan espectacularmente con la imagen — pero cada predicción es condicional. El garabato de Ulam es una ventana a la parte más obstinada de la teoría analítica de números, accidentalmente visible para cualquiera con papel cuadriculado.",
        },
      ],
    },
    cardioid: {
      pretitle: "Tema · Geometría",
      title: "La cardioide de la taza de café",
      tagline: "La curva de luz de tu taza es el corazón de Mandelbrot.",
      intro:
        "Ilumina con luz solar paralela una taza de café cilíndrica. Los reflejos de la pared interior no enfocan en un punto — envuelven una curva en forma de corazón que flota sobre la superficie del café. Esa curva es la cardioide r = 2a(1 − cos θ). La misma ecuación describe el bulbo principal del conjunto de Mandelbrot. Cada mañana se dibuja con luz la forma más famosa de la dinámica.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La óptica",
          title: "Por qué la luz se apelmaza en una taza",
          body: "Un círculo refleja un rayo horizontal con el doble del ángulo que la superficie forma con ese rayo — la ley de la reflexión. Así que un haz de rayos horizontales que choca con el interior de una taza cilíndrica se abre hacia fuera con el doble del ángulo local. No convergen en un único punto focal porque la curvatura varía; en cambio, la familia de rayos reflejados envuelve una curva suave. La palabra de los matemáticos para esa envolvente es cataáustica. La cataáustica de un círculo, iluminada por rayos paralelos, es exactamente una cardioide.",
        },
        {
          pretitle: "Paso dos · La ecuación",
          title: "r = 2a (1 − cos θ)",
          body: "En coordenadas polares centradas en un vértice elegido, la cardioide es r(θ) = 2a(1 − cos θ). Cuando θ = 0 el radio es 0 (la cúspide). Cuando θ = π el radio es 4a (la punta lejana). La curva se traza con un punto del borde de un círculo de radio a que rueda por fuera de un círculo fijo del mismo radio — de ahí viene la palabra: cardia significa corazón. Es una de las curvas algebraicas más estudiadas del análisis clásico.",
        },
        {
          pretitle: "Paso tres · El bulbo principal de Mandelbrot",
          title: "La misma ecuación, un universo completamente distinto",
          body: "Ahora deja atrás la óptica. Acércate al conjunto de Mandelbrot z ↦ z² + c. La gran mancha con forma de corazón en el centro — el mayor componente — es una cardioide. Exactamente. Su frontera está parametrizada por c(t) = (1/2)·e^(it) − (1/4)·e^(2it), y esa ecuación es algebraicamente una cardioide (en la variable c). Los valores de c dentro de ese bulbo corresponden a dinámicas con un único punto fijo atractor. La forma que aparece en una taza y la que aparece en la teoría de la iteración son la misma forma — y no hay una razón sencilla del porqué.",
        },
        {
          pretitle: "Paso cuatro · Y los bulbos más pequeños",
          title: "Una escalera infinita de discos adheridos",
          body: "La cardioide principal del conjunto de Mandelbrot tiene discos circulares más pequeños colgando de ella en cada fracción racional p/q. Cada disco corresponde a una dinámica en la que el ciclo atractor tiene periodo q. El mayor disco, a la izquierda, tiene periodo 2; los dos siguientes, periodo 3; luego cuatro discos de periodo 4; y así sucesivamente. El fractal en la frontera del conjunto de Mandelbrot es precisamente la frontera entre estas regiones estables y el caos. Café, óptica, iteración compleja, los objetos más profundos de la dinámica — todos vistiendo la misma forma.",
        },
      ],
    },
    galton: {
      pretitle: "Tema · Análisis",
      title: "La tabla de Galton",
      tagline: "Bolas que rebotan dibujan siempre la misma campana.",
      intro:
        "La quincunx de Francis Galton es un triángulo de clavos. Suelta una canica en lo alto: en cada clavo un cara-o-cruz a mitad y mitad la desvía a izquierda o derecha, hasta que la gravedad la deposita en una de las bandejas del suelo. Lanza diez mil canicas y las bandejas se llenan — siempre — con la forma de la distribución normal. La campana no es casualidad. Es el Teorema Central del Límite hecho tangible.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El artefacto",
          title: "Una escalera de monedas justas",
          body: "Una tabla con N filas de clavos desplazados medio clavo. Suelta una canica arriba. En cada clavo que toca, rebota a la izquierda o a la derecha con igual probabilidad — una moneda independiente. Tras N clavos, la canica ha caído en una de N + 1 bandejas, donde el índice de la bandeja es el número de rebotes a la derecha menos el de rebotes a la izquierda, trasladado para que no sea negativo. Una canica no te enseña nada. La forma solo aparece en el límite.",
        },
        {
          pretitle: "Paso dos · El aterrizaje de Pascal",
          title: "Los conteos de bandeja son binomiales",
          body: "Tras N filas, la probabilidad de que la canica caiga en la bandeja k (numerada de 0 a N) es C(N, k) / 2^N. Los numeradores son las entradas de la fila N del triángulo de Pascal. Así que una tabla de Galton es, en secreto, una búsqueda física de coeficientes binomiales. Con N = 10, las bandejas centrales reciben entradas 252, 210, 210 — y las bandejas más externas reciben la entrada 1 (un solo camino de los 1024). La forma ya es una campana discreta.",
        },
        {
          pretitle: "Paso tres · El Teorema Central del Límite",
          title: "La campana es inevitable",
          body: "Cuando N crece, la función de masa binomial converge a la densidad gaussiana (1/√(2πNpq)) · exp(−(k − Np)² / (2Npq)). Este es el teorema de De Moivre-Laplace (1733), el primer caso histórico del Teorema Central del Límite. El TCL general dice mucho más: toma CUALQUIER variable aleatoria con varianza finita — sesgada o no, distribuida como sea — y suma N copias independientes. Tras reescalar, la suma converge a una gaussiana. La campana es en lo que siempre se convierten los promedios.",
        },
        {
          pretitle: "Paso cuatro · Por qué aparece en todas partes",
          title: "Cualquier suma de muchas pequeñas patadas",
          body: "Las estaturas son la suma de miles de pequeñas contribuciones independientes. También lo son las puntuaciones de los tests, los CI, los errores de medición y los rendimientos diarios financieros (bajo supuestos restrictivos). Cada uno es una suma de muchas pequeñas variables aleatorias independientes, así que cada uno es aproximadamente gaussiano. Por eso las curvas en campana dominan la estadística y por eso la desviación típica tiene nombre. La tabla de Galton es la forma más física de ver el teorema en acción — con 1000 canicas la campana ya es suave, aunque ninguna canica sepa nada de ella individualmente.",
        },
      ],
    },
    magpendulum: {
      pretitle: "Tema · Caos",
      title: "El péndulo magnético",
      tagline: "Colorea cada arranque por su ganador — y aparece un fractal.",
      intro:
        "Suspende un péndulo de hierro sobre tres imanes dispuestos en triángulo. Las leyes de Newton, atracción magnética, un poco de fricción — todo determinista. Y, sin embargo, la pregunta '¿sobre qué imán acaba?' no tiene respuesta suave. Colorea cada punto de partida por su ganador final: cuencas roja, verde y azul, entrelazadas a todas las escalas.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La física",
          title: "Tres tirones, un amortiguamiento, gravedad al centro",
          body: "Monta un peso de hierro pequeño sobre una cuerda flexible encima de una placa. Coloca tres imanes idénticos en la placa formando un triángulo equilátero. El péndulo es atraído hacia cada imán con una fuerza proporcional a 1/r² (o 1/r³ para un modelo de cubo inverso — los dos se usan en la literatura; el fractal cualitativo aparece para cualquiera de ellos). Un muelle débil también tira del péndulo hacia el centro del triángulo. La resistencia del aire drena energía de modo estable. Las ecuaciones de movimiento son deterministas; lo único desconocido es la posición inicial.",
        },
        {
          pretitle: "Paso dos · Las cuencas de atracción",
          title: "Tres regiones en el espacio del punto de partida",
          body: "Libera el péndulo desde un punto de partida sobre la placa e integra las ecuaciones. Eventualmente, la amplitud del péndulo decae y se asienta justo encima de uno de los tres imanes — el ganador. Repite para cada punto de partida en una rejilla fina, colorea cada uno por su ganador: rojo para el imán 1, verde para el 2, azul para el 3. La placa queda ahora coloreada en tres cuencas de atracción. El interior de cada cuenca es una región coloreada pulcra. La frontera, en cambio, no es una curva — es un fractal.",
        },
        {
          pretitle: "Paso tres · La frontera fractal",
          title: "Cada punto frontera linda con los tres colores",
          body: "Acércate a la frontera entre dos colores cualesquiera y encontrarás el tercero entrelazado allí. Acércate más y encontrarás los tres colores arbitrariamente cerca de cualquier punto frontera. Esta es la propiedad característica de una cuenca de Wada — un monstruo topológico descubierto por Yoneyama en 1917, luego armado por los teóricos del caos en los noventa. El determinismo permanece intacto: mismo inicio → mismo resultado. Pero el más leve cambio en la posición inicial puede dar la vuelta a la respuesta a cualquiera de los tres imanes. La predictibilidad se ha ido.",
        },
        {
          pretitle: "Paso cuatro · Por qué esto importa",
          title: "El caos tiene color",
          body: "El péndulo magnético es la visualización más limpia de la dependencia sensible a las condiciones iniciales en cualquier sistema mecánico clásico. El mismo tipo de cuenca fractal aparece en los solucionadores del método de Newton (acércate a la frontera de las cuencas de Newton para una cúbica y obtienes la misma imagen), en modelos a largo plazo del sistema solar, en billares caóticos, en los regímenes de punto fijo estable del atractor de Lorenz. Donde quiera que coexistan atractores en competencia, sus fronteras de cuenca tienden a ser fractales. El mundo está lleno de estas fronteras ocultas; el péndulo magnético solo te deja ver una.",
        },
      ],
    },
    godel: {
      pretitle: "Tema · Paradoja",
      title: "La incompletitud de Gödel",
      tagline: "Las matemáticas nunca estarán completas.",
      intro:
        "Kurt Gödel, Viena, 1931. En cualquier sistema formal consistente lo bastante rico como para expresar la aritmética existen enunciados verdaderos que el sistema mismo no puede demostrar. El Explorador te guía por la numeración de Gödel y por la construcción de la frase autorreferencial G que dice, en aritmética, «no soy demostrable».",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El sueño de Hilbert",
          title: "Mecanizar todas las matemáticas",
          body: "Principios del siglo XX. Los Principia Mathematica de Whitehead y Russell (1910–1913) intentaron derivar cada teorema de la aritmética desde una sola torre de axiomas lógicos. David Hilbert, primero en su programa de París de 1900 y luego en su empuje formalista de los años veinte, pidió un sistema finito y mecánico desde el cual pudiera demostrarse todo enunciado verdadero y cuya consistencia pudiera demostrarse desde dentro. Una matemática formal completa, consistente y decidible. Cualquiera con papel y paciencia podría, en principio, zanjar cualquier cuestión matemática. Ese era el sueño.",
        },
        {
          pretitle: "Paso dos · Numeración de Gödel",
          title: "Una aritmética que habla de sí misma",
          body: "El primer movimiento de Gödel fue un truco de codificación. Asigna a cada símbolo del lenguaje formal un número — ¬ → 1, ∨ → 2, ∀ → 3, =, +, ·, paréntesis, variables, etcétera. Después codifica una fórmula entera (s₁, s₂, …, sₖ) como el único número natural 2^s₁ · 3^s₂ · 5^s₃ · … usando primos consecutivos. Por la unicidad de la factorización en primos, la codificación es reversible. Las demostraciones — sucesiones de fórmulas — también reciben número. De repente propiedades como «x es una demostración de y» se vuelven predicados aritméticos Prov(x, y) que el sistema formal puede expresar sobre sus propios enunciados.",
        },
        {
          pretitle: "Paso tres · El truco de la diagonal",
          title: "G dice: «G no es demostrable»",
          body: "Usando el lema diagonal — descendiente directo del argumento diagonal de Cantor de 1891 — Gödel construyó una sentencia G cuyo número de Gödel es ⌜G⌝ y que es aritméticamente equivalente a ¬∃x Prov(x, ⌜G⌝): «ningún número x es una demostración de la fórmula con número de Gödel ⌜G⌝». En lenguaje llano: G dice «no soy demostrable en este sistema». Ahora la encerrona. Si G es demostrable, el sistema demuestra un enunciado falso y es inconsistente. Si G no es demostrable, entonces lo que G afirma es exactamente cierto — pero el sistema no puede demostrarlo. En ambos casos el sueño de Hilbert de una aritmética completa y consistente se derrumba. El segundo teorema de incompletitud se sigue casi de inmediato: tal sistema no puede demostrar su propia consistencia, porque si pudiera también demostraría G, contradiciendo el primero.",
        },
        {
          pretitle: "Paso cuatro · Hasta dónde llegó",
          title: "Tarski, Turing, Church y todo asistente de demostración posterior",
          body: "El mismo truco diagonal reaparece una y otra vez. Alfred Tarski (1933) demostró que la verdad en aritmética no es definible dentro de la aritmética — indefinibilidad de la verdad. Alan Turing (1936) mostró que el problema de la parada es indecidible diagonalizando sobre las máquinas de Turing. Alonzo Church (1936) demostró que la propia lógica de primer orden es indecidible. Cada resultado es, estructuralmente, un primo del de Gödel: un sistema lo bastante rico como para describirse a sí mismo contiene una pregunta sobre sí mismo que no puede responder. Los asistentes de demostración modernos — Coq, Lean, Isabelle, HOL — operan bajo los límites de Gödel: pueden mecanizar una cantidad enorme de matemáticas, pero no pueden demostrar su propia consistencia, y existen enunciados concretos de teoría de números (el teorema de Goodstein, Paris–Harrington) que son verdaderos y demostrablemente indemostrables en la aritmética de Peano. El sueño se ha ido; el edificio es más grande que nunca.",
        },
      ],
    },
    halting: {
      pretitle: "Tema · Computación",
      title: "El problema de la parada",
      tagline: "Ningún programa puede predecir a todos los demás programas.",
      intro:
        "Alan Turing, 1936. Dado un programa P y una entrada x, ¿podemos siempre decidir si P se detiene con x? Turing dijo que no — y lo demostró con un truco diagonal autorreferencial que ninguna máquina puede esquivar. El Explorador ejecuta unos cuantos programas de juguete sobre una cinta pequeña para que veas cómo algunos terminan, otros corren para siempre y uno — el diagonal D — se retuerce hasta caer en la contradicción que Turing puso por escrito.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La pregunta",
          title: "¿Se detiene P con x?",
          body: "Dado el código fuente de un programa P y una entrada x, decide si P termina alguna vez o si corre para siempre. Suena a algo que un analizador suficientemente listo debería siempre poder determinar — al fin y al cabo, los programas son cadenas finitas de símbolos, y una computadora puede simularlos. David Hilbert, en su Entscheidungsproblem de 1928, pedía exactamente ese procedimiento de decisión universal. Hacia mediados de los años treinta, Alonzo Church (vía el λ-cálculo) y Alan Turing (vía lo que hoy llamamos máquinas de Turing) se acercaban a la misma respuesta desde direcciones opuestas.",
        },
        {
          pretitle: "Paso dos · La contradicción de Turing",
          title: "Supón halts(P, x), luego construye D",
          body: "Supón, por contradicción, que existe una función computable total halts(P, x) que devuelve ⊤ cuando P se detiene con la entrada x y ⊥ en caso contrario. Entonces podemos escribir un nuevo programa D(P): calcula halts(P, P); si devuelve ⊤, entra en un bucle infinito; si devuelve ⊥, se detiene inmediatamente. D está permitido — por hipótesis cada uno de sus pasos es computable. Ahora pregunta: ¿qué devuelve halts(D, D)? Si halts(D, D) = ⊤, entonces por la definición de D el programa D entra en bucle con la entrada D — así que D no se detiene con D, contradiciendo ⊤. Si halts(D, D) = ⊥, entonces D se detiene con D — contradiciendo ⊥. Cualquier respuesta rompe la definición, así que no existe tal halts. (Turing 1936, «On Computable Numbers, with an Application to the Entscheidungsproblem».)",
        },
        {
          pretitle: "Paso tres · Diagonalización disfrazada",
          title: "Cantor, Gödel, Turing — el mismo movimiento",
          body: "El mismo truco impulsa la diagonal de Cantor (construir un real que difiera del n-ésimo real listado en el n-ésimo dígito), el primer teorema de incompletitud de Gödel (construir una sentencia que diga «no soy demostrable») y el argumento de la parada de Turing (construir un programa que haga lo contrario de lo que dice el decisor). Cada construcción dispone los candidatos en una lista y lee por la diagonal para forjar un objeto que la lista no puede contener. El problema de la parada fue el primer problema de decisión concreto que se demostró indecidible — el momento en que los límites de la computación se volvieron un teorema.",
        },
        {
          pretitle: "Paso cuatro · Por qué importa hoy",
          title: "El teorema de Rice y las consecuencias prácticas",
          body: "El teorema de Rice (Henry Gordon Rice, 1953) generaliza a Turing: cualquier propiedad semántica no trivial de los programas — «¿devuelve alguna vez cero?», «¿tiene fugas de memoria?», «¿es malicioso?» — es indecidible. Los analizadores estáticos, por tanto, deben aproximar: o sobre-reportan (falsos positivos) o sub-reportan (errores no detectados), nunca limpios y completos a la vez. Los compiladores tienen tiempos límite al optimizar, negándose a hacer inlining más allá de una heurística. Los motores antivirus no pueden, en general, atrapar todo el malware. Los autoescaladores en la nube no pueden prometer que un trabajo enviado se detendrá; en su lugar limitan el tiempo de CPU. El problema de la parada no es una curiosidad — es el muro contra el que choca, tarde o temprano, todo programa que habla de programas.",
        },
      ],
    },
    pvsnp: {
      pretitle: "Tema · Computación",
      title: "P frente a NP",
      tagline: "La mayor pregunta abierta de las ciencias de la computación.",
      intro:
        "Algunos problemas son fáciles de resolver. Otros son fáciles de comprobar una vez que alguien te da la respuesta. P frente a NP pregunta si esas dos clases son, en secreto, la misma — y un sí haría añicos la criptografía moderna. El Explorador es un pequeño solucionador de 3-SAT que te deja ver por qué la verificación es trivial pero la búsqueda es brutal: introduce una fórmula y sigue al algoritmo DPLL bajando por el árbol de backtracking mientras prueba asignaciones y poda ramas enteras con una sola contradicción.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Dos clases de problemas",
          title: "Resolver rápido frente a verificar rápido",
          body: "P es la clase de problemas de decisión que una máquina determinista puede resolver en tiempo polinómico — multiplicar dos números, ordenar una lista, comprobar si un grafo está conectado. NP es la clase en la que, dada una solución candidata, una máquina en tiempo polinómico puede verificar que la respuesta es correcta. No es evidente que sean la misma. El sudoku es el ejemplo de libro: rellenar una cuadrícula 9×9 es genuinamente difícil, pero si un amigo te da una cuadrícula completa puedes confirmar cada fila, columna y caja en un único barrido lineal. La parte difícil es encontrar la solución; la fácil es comprobarla.",
        },
        {
          pretitle: "Paso dos · NP-completitud",
          title: "Cook 1971, Karp 1972, Levin de forma independiente",
          body: "En 1971 Stephen Cook demostró el teorema de Cook-Levin: todo problema en NP se reduce en tiempo polinómico a la satisfacibilidad booleana (SAT). Leonid Levin publicó el mismo resultado de forma independiente en la Unión Soviética. Un año después Richard Karp demostró que 21 problemas clásicos — 3-SAT, camino hamiltoniano, clique, suma de subconjuntos, la versión de decisión del problema del viajante — son todos interreducibles en tiempo polinómico. Hoy la lista llega a los miles: sudoku N×N, Tetris, el buscaminas generalizado e incluso modelos reticulares del plegamiento de proteínas pertenecen todos a la misma clase de equivalencia. Resuelve uno eficientemente y los habrás resuelto todos. Las reducciones de Cook-Karp-Levin convirtieron una pregunta sobre un problema en una pregunta sobre todo problema de búsqueda interesante a la vez.",
        },
        {
          pretitle: "Paso tres · ¿Y si P = NP?",
          title: "Cae la criptografía, se dobla la biología, el universo se vuelve aburrido",
          body: "Un algoritmo en tiempo polinómico para 3-SAT, compuesto con las reducciones de Karp, romperia RSA (factorizar se vuelve factible), quebraría la criptografía de curva elíptica, descifraría cada sesión TLS jamás grabada y falsificaría cualquier firma digital. El plegamiento de proteínas se colapsaría en una búsqueda polinómica. La planificación óptima, la asignación óptima de registros en el compilador, la planificación óptima de rutas — todos los problemas NP-duros que los ingenieros aproximan hoy — tendrían soluciones polinómicas exactas. La mayoría de los informáticos apuestan en contra: una encuesta de Scott Aaronson al campo sitúa más del 80 % en P ≠ NP. Pero no existe ni demostración ni refutación. Las inclusiones de clases que conocemos son P ⊆ NP ⊆ PSPACE ⊆ EXP, con P ⊊ EXP demostrado por el teorema de jerarquía en tiempo — así que al menos una de esas inclusiones es estricta, pero nadie sabe cuál.",
        },
        {
          pretitle: "Paso cuatro · El premio de un millón de dólares",
          title: "Problema del Milenio de Clay, 2000",
          body: "El Clay Mathematics Institute nombró P frente a NP uno de los siete Problemas del Premio del Milenio en mayo de 2000, con una recompensa de 1 000 000 $ por una resolución correcta en cualquier sentido. Es el único de los siete que afecta directamente a la tecnología cotidiana. Cada año circulan decenas de demostraciones falsas — el anuncio de Vinay Deolalikar en 2010 fue el intento reciente más prominente y se desmoronó en semanas. La expectativa generalizada en la comunidad es que la respuesta es P ≠ NP. La pregunta no resuelta no es cuál es la respuesta, sino por qué — y qué fragmento de las matemáticas contendrá la técnica correcta de cota inferior. Más de cuarenta años de barreras (relativización, demostraciones naturales, algebrización) dicen que no llegará por ningún método que conozcamos hoy.",
        },
      ],
    },
    rsa: {
      pretitle: "Tema · Computación",
      title: "RSA y funciones unidireccionales",
      tagline: "Multiplicar es fácil. Factorizar es imposible.",
      intro:
        "Rivest, Shamir y Adleman, 1977 — el primer criptosistema de clave pública publicado y, casi medio siglo después, el que aún protege la mayor parte de internet en funcionamiento. El Explorador recorre una generación de claves RSA completa, con cifrado y descifrado sobre números pequeños, para que veas cada paso: elige los primos, deriva los exponentes público y privado, luego cifra un mensaje y observa cómo la misma matemática lo vuelve a abrir.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La asimetría",
          title: "Funciones unidireccionales: fáciles hacia adelante, duras hacia atrás",
          body: "Multiplicar dos primos enormes p y q es rápido — unos milisegundos en un teléfono. Recuperar p y q a partir de su producto n = p · q no lo es: el mejor algoritmo clásico conocido (la criba general del cuerpo de números) corre en tiempo subexponencial pero superpolinómico, y un n de 2048 bits queda cómodamente fuera del alcance de cualquier máquina jamás construida. Esta propiedad unidireccional — barata hacia adelante, ruinosamente cara hacia atrás — es el cimiento de la criptografía de clave pública. RSA viste esa asimetría de modo que una clave pública se puede entregar a cualquiera y solo quien tenga la clave privada correspondiente puede leer lo que se escribió de vuelta.",
        },
        {
          pretitle: "Paso dos · Generación de claves",
          title: "Elige e, deriva d con Euclides extendido",
          body: "Calcula φ(n) = (p − 1)(q − 1), el totiente de Euler — el número de enteros en [1, n] coprimos con n. Elige un exponente público pequeño e coprimo con φ(n); 65537 es la opción canónica porque es primo, tiene solo dos bits a 1 y sobrevive a todo ataque de exponente bajo conocido. Después calcula el exponente privado d = e⁻¹ mod φ(n) usando el algoritmo extendido de Euclides: devuelve coeficientes de Bézout (x, y) con e·x + φ(n)·y = 1, y reduciendo x mod φ(n) se obtiene d. La clave pública es el par (n, e); la privada es (n, d). Una vez que tienes d, tira p y q.",
        },
        {
          pretitle: "Paso tres · Cifrar y descifrar",
          title: "c = m^e mod n,   m = c^d mod n",
          body: "Trata el texto claro m como un entero en [0, n). El texto cifrado es c = m^e mod n; el descifrado, m = c^d mod n. La razón de que funcione viene directamente de Euler y Fermat: como ed ≡ 1 mod φ(n), tenemos m^(ed) = m^(1 + kφ(n)) ≡ m mod n para todo m coprimo con n (teorema de Euler), y un breve argumento con el teorema chino del resto extiende la identidad a todo m en [0, n). El método de cuadrado y multiplicación convierte esos exponentes gigantescos en unos pocos miles de multiplicaciones modulares — rápido en la práctica, matemáticamente exacto.",
        },
        {
          pretitle: "Paso cuatro · Dónde está hoy",
          title: "De TLS a la migración poscuántica",
          body: "RSA es la matemática bajo cada handshake de TLS que tu navegador aún negocia con un certificado RSA, bajo las claves de host SSH, bajo las cadenas de firma de código que autentican las aplicaciones de Apple y Google, bajo los pasaportes electrónicos y las primeras generaciones de blockchain. Pero en 1994 Peter Shor escribió un algoritmo cuántico que factoriza enteros en tiempo polinómico — dada una computadora cuántica tolerante a fallos lo bastante grande, RSA se rompe. Aún no existe, pero el plazo es lo bastante incierto como para que el NIST haya estandarizado reemplazos poscuánticos (CRYSTALS-Kyber para intercambio de claves en 2024, CRYSTALS-Dilithium para firmas) y la migración global ya esté en marcha.",
        },
      ],
    },
    mobius: {
      pretitle: "Tema · Geometría",
      title: "Cinta de Möbius y botella de Klein",
      tagline: "Superficies con una sola cara.",
      intro:
        "Toma una tira de papel, dale media vuelta, pega los extremos — y tendrás una superficie con una sola cara y un solo borde. El Explorador dibuja una cinta de Möbius en 3D que gira y que puedes cortar por distintas proporciones para ver qué sale: corta por el medio y se mantiene en una pieza; corta por el tercio y obtienes dos anillos entrelazados. Un botón cambia a la botella de Klein, el análogo cerrado que necesita cuatro dimensiones para vivir sin cruzarse consigo misma.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La media vuelta",
          title: "Pega los extremos con un giro",
          body: "Toma una tira rectangular de papel. Da a uno de sus extremos media vuelta (180°) antes de pegarlo al otro. El resultado tiene un solo borde y una sola cara. Recórrela con un bolígrafo y cubrirás lo que parecen ser ambas «caras» sin cruzar nunca la frontera; sigue el borde y volverás al punto de partida tras dar dos vueltas. Descubierta de forma independiente por August Ferdinand Möbius y Johann Benedict Listing en 1858 — la primera superficie no orientable jamás escrita explícitamente. Su característica de Euler es χ = 0.",
        },
        {
          pretitle: "Paso dos · Sorpresas con las tijeras",
          title: "Lo que las tijeras revelan sobre la topología",
          body: "Corta la cinta de Möbius por el medio. No se cae a pedazos — obtienes una tira más larga con dos vueltas completas (cuatro medias vueltas) y, lo crucial, esa tira vuelve a tener dos caras. Corta una cinta de Möbius a un tercio de uno de sus bordes, manteniendo el corte paralelo al borde a lo largo de toda la vuelta, y las tijeras recorren dos vueltas antes de cerrar el lazo: salen dos anillos entrelazados, uno una nueva cinta de Möbius y otro una cinta más larga al estilo Möbius con torsiones extra, enlazados entre sí. La topología está llena de estas sorpresas — la torsión global oculta tras la planitud local.",
        },
        {
          pretitle: "Paso tres · La botella de Klein",
          title: "Felix Klein, 1882",
          body: "Ahora toma un tubo y pega uno de sus extremos al otro tras pasarlo a través de la pared del tubo — haciendo coincidir los círculos con orientaciones opuestas. En el espacio de cuatro dimensiones esto es una superficie perfectamente lisa, cerrada y no orientable: sin frontera, sin interior, sin exterior. Felix Klein la describió en 1882. En tres dimensiones el cruce obliga al tubo a atravesarse a sí mismo, así que toda botella de Klein de vidrio que hayas visto es una inmersión, no un encaje verdadero. Pega dos cintas de Möbius por sus únicos bordes y el resultado es exactamente una botella de Klein.",
        },
        {
          pretitle: "Paso cuatro · Dónde viven",
          title: "De las correas de transmisión a la química",
          body: "Las cintas de Möbius aparecen como correas transportadoras y cintas de impresora (el desgaste se reparte por toda la superficie y duplica la vida útil), como las esculturas Endless Ribbon de Max Bill, como resistencias de Möbius que cancelan su propia autoinducción, como guías de onda Möbius superconductoras para microondas — y, desde 2003, como moléculas aromáticas de Möbius sintetizadas por Rainer Herges. El famoso triángulo del reciclaje es, en rigor, un nudo de trébol más que una cinta de Möbius, pero el público lo lee como tal. Sobre todo, la cinta de Möbius y la botella de Klein son las puertas de entrada a la clasificación de superficies — el teorema que afirma que toda superficie cerrada queda determinada, salvo homeomorfismo, por el género, la orientabilidad y un único entero χ.",
        },
      ],
    },
    eulerchar: {
      pretitle: "Tema · Geometría",
      title: "Característica de Euler",
      tagline: "V − E + F = 2, sea cual sea la forma.",
      intro:
        "Descartes la escribió en 1639 y Euler la redescubrió un siglo después: cuenta los vértices, las aristas y las caras de cualquier poliedro convexo y V − E + F vale siempre 2. El Explorador recorre los sólidos platónicos y arquimedianos contando V, E, F en directo — ves la fórmula sostenerse en el cubo, en el dodecaedro y en el balón de fútbol. Después curva la superficie alrededor de una rosquilla y observa cómo cambia la constante.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · Cuenta vértices, aristas, caras",
          title: "La constante que no se mueve",
          body: "Toma un cubo: 8 vértices, 12 aristas, 6 caras. Resta y suma: 8 − 12 + 6 = 2. Prueba un tetraedro: 4 − 6 + 4 = 2. El balón de fútbol — un icosaedro truncado, doce pentágonos y veinte hexágonos cosidos por sus aristas — tiene 60 vértices, 90 aristas y 32 caras, y 60 − 90 + 32 = 2 de nuevo. Recorre todos los sólidos platónicos y arquimedianos que dibujaron los griegos y la respuesta es la misma. La constante no es una coincidencia.",
        },
        {
          pretitle: "Paso dos · Topología, no geometría",
          title: "Aplasta el cubo hasta volverlo una esfera",
          body: "Infla el cubo hasta que se abombe en una esfera perfecta. Las esquinas se redondean, las aristas rectas se curvan, las caras planas se hinchan hacia afuera — V − E + F sigue siendo 2. Lo mismo ocurre si lo aplastas hasta volverlo una tortita, lo retuerces hasta darle forma de huevo o lo estiras en cualquier forma que quieras, siempre que no lo rompas, no lo pegues ni le abras un agujero. El número depende solo de la topología. χ = 2 para cualquier forma topológicamente equivalente a una esfera — para la superficie de todo poliedro convexo, todo ovoide liso, toda patata.",
        },
        {
          pretitle: "Paso tres · Los agujeros la bajan",
          title: "Cada asa te cuesta dos",
          body: "Ahora envuelve la superficie alrededor de una rosquilla. Triangula el toro como quieras — V − E + F cae a 0. Un doble toro, dos rosquillas pegadas lado a lado, da χ = −2. La regla es χ = 2 − 2g, donde g es el número de agujeros (el género). Cada asa que coses te cuesta 2. La característica de Euler mide la topología en un único entero: te dice cuántos agujeros tiene una superficie cerrada, sin importar cómo se dibuje o se estire.",
        },
        {
          pretitle: "Paso cuatro · Por qué importa",
          title: "De los balones de fútbol a la Medalla Fields",
          body: "La química de los buckybolas está forzada por χ: toda jaula de fullereno construida con pentágonos y hexágonos debe contener exactamente 12 pentágonos, porque la característica de Euler de una esfera es 2. Las cúpulas geodésicas de Buckminster Fuller siguen la misma regla. Los slicers de impresión 3D usan V − E + F para validar que una malla es cerrada e imprimible. Gauss-Bonnet relaciona la curvatura total de una superficie lisa con 2π·χ, atando geometría y topología en una sola ecuación. El teorema del índice de Atiyah-Singer (Medalla Fields 1966) es el descendiente moderno de la misma idea — y Pruebas y refutaciones de Lakatos recorre los dos siglos de casos límite que casi rompen V − E + F = 2 y luego la refuerzan.",
        },
      ],
    },
    konigsberg: {
      pretitle: "Tema · Análisis",
      title: "Los puentes de Königsberg",
      tagline: "Siete puentes, un paseo imposible.",
      intro:
        "¿Podrías recorrer Königsberg, cruzar cada puente exactamente una vez y acabar donde empezaste? El Explorador te deja intentar el paseo, ver el argumento de paridad en vivo según cruzas cada puente y añadir o quitar puentes para hacer posible el recorrido.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El acertijo",
          title: "Un paseo que nadie encontraba",
          body: "Königsberg se asentaba sobre el río Pregel con dos islas y dos orillas — cuatro masas de tierra en total — unidas por siete puentes. Los vecinos planteaban una pregunta de paseo dominical: ¿podías hacer una ruta por la ciudad que cruzara cada puente exactamente una vez y acabara donde habías empezado? Todo el mundo lo intentó. Todo el mundo fracasó. Nadie sabía demostrar que fuera imposible.",
        },
        {
          pretitle: "Paso dos · La reducción de Euler",
          title: "La geometría se vuelve topología",
          body: "En 1736 Leonhard Euler hizo algo que nadie había hecho antes. Ignoró las distancias. Ignoró los ángulos. Ignoró qué puente estaba aguas arriba de cuál. Dibujó las cuatro masas de tierra como cuatro puntos y los siete puentes como siete aristas. El mapa se convirtió en un grafo. Nació el problema de la posición — geometria situs — y, con él, tanto la teoría de grafos como la topología.",
        },
        {
          pretitle: "Paso tres · El argumento de paridad",
          title: "Cada masa de tierra necesita una cuenta par",
          body: "Cada vez que entras en una masa de tierra usas un puente; cuando te vas, usas otro. Así que cada masa necesita un número par de puentes incidentes — salvo, quizás, el inicio y el final del paseo. Königsberg tenía cuatro masas de tierra, todas con un número impar de puentes. Cuatro vértices de grado impar son dos de más. Imposible.",
        },
        {
          pretitle: "Paso cuatro · El nacimiento de la teoría de grafos",
          title: "De un paseo dominical al mundo moderno",
          body: "El mismo argumento de paridad alimenta hoy el enrutamiento por GPS, el problema del cartero chino (usado para optimizar rutas de quitanieves, camiones de basura y carteros) y el ensamblaje de ADN — todo ensamblador moderno de genomas recorre un camino euleriano en un grafo de de Bruijn. La Segunda Guerra Mundial destruyó dos de los puentes de Königsberg; solo quedan cinco de los siete originales. El grafo actual tiene exactamente dos vértices de grado impar, así que hoy el paseo es por fin posible — aunque Euler ya no está para hacerlo.",
        },
      ],
    },
    fourcolor: {
      pretitle: "Tema · Análisis",
      title: "El teorema de los cuatro colores",
      tagline: "Todo mapa plano necesita como mucho cuatro colores.",
      intro:
        "Cualquier mapa dibujado en el plano se puede colorear con a lo sumo cuatro colores de modo que dos regiones que comparten frontera nunca reciban el mismo color. El Explorador te deja construir mapas y observar a un algoritmo de coloreado con retroceso asignar como mucho cuatro colores — región a región, eligiendo siempre la opción válida más pequeña.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · La conjetura",
          title: "Francis Guthrie, 1852",
          body: "Mientras coloreaba un mapa de los condados de Inglaterra, el joven Francis Guthrie notó que cuatro colores siempre parecían bastar. Se lo preguntó a su hermano Frederick, quien se lo preguntó a su maestro Augustus De Morgan, quien se lo preguntó a todo el mundo. La conjetura parecía inofensiva — y dejó perplejos a los matemáticos durante 124 años. Varias demostraciones publicadas (Kempe 1879, Tait 1880) resultaron contener huecos sutiles que nadie detectó durante más de una década.",
        },
        {
          pretitle: "Paso dos · Por qué tres no bastan y cinco sobran",
          title: "Cuatro es la cota exacta",
          body: "Tres colores claramente no bastan — ya se pueden dibujar cuatro regiones mutuamente adyacentes en el plano (piensa en tres países que se tocan en una esquina con un cuarto rodeándolos). El teorema de los cinco colores, debido a Heawood en 1890, se demuestra en una página usando la fórmula de Euler V − E + F = 2 y un argumento cuidadoso de grados. Cerrar el hueco de cinco a cuatro fue lo que requirió otros ochenta y seis años.",
        },
        {
          pretitle: "Paso tres · La demostración de Appel-Haken, 1976",
          title: "El primer teorema demostrado por computadora",
          body: "Kenneth Appel y Wolfgang Haken, en la Universidad de Illinois, redujeron el problema a una lista finita de 1834 «configuraciones inevitables» — y luego mostraron que cada una de ellas es reducible. Su demostración corrió en una IBM 360 durante unas 1200 horas. Muchos matemáticos se negaron a aceptarla: una demostración que un humano no puede leer en su totalidad, argumentaban, no es una demostración. Durante años, el correo saliente del departamento de matemáticas de la Universidad de Illinois llevaba el sello «Four Colors Suffice».",
        },
        {
          pretitle: "Paso cuatro · Dónde está hoy",
          title: "Robertson-Sanders-Seymour-Thomas, Gonthier y más allá",
          body: "En 1996 Robertson, Sanders, Seymour y Thomas simplificaron la demostración a 633 configuraciones y un argumento de descarga más limpio. En 2005 Georges Gonthier mecanizó la demostración entera dentro del asistente de demostración Coq — cada paso lógico, incluido el análisis de casos, verificado por máquina de extremo a extremo. El teorema alimenta hoy la asignación de frecuencias en redes celulares, la asignación de registros en compiladores y los problemas de planificación y horarios siempre que los conflictos forman un grafo planar.",
        },
      ],
    },
    smallworld: {
      pretitle: "Tema · Análisis",
      title: "Seis grados y mundos pequeños",
      tagline: "Dos personas cualesquiera, a seis apretones de manos.",
      intro:
        "Stanley Milgram envió cartas a desconocidos y descubrió que, en promedio, bastaban seis reenvíos para cruzarlas de un extremo a otro de Estados Unidos. Cuarenta años después Watts y Strogatz mostraron por qué: una pizca de atajos aleatorios en una red por lo demás regular colapsa la longitud media de camino sin tocar el agrupamiento local. El Explorador te deja ajustar la probabilidad de recableado p de Watts-Strogatz y ver cómo se hunde la longitud media de camino L en tiempo real.",
      ctaInteractive: "→ Abrir el Explorador",
      sections: [
        {
          pretitle: "Paso uno · El experimento de las cartas",
          title: "Milgram, 1967",
          body: "Stanley Milgram, entonces en Harvard, envió cartas a personas al azar en Omaha y Wichita y les pidió que reenviaran la carta, mano a mano, a un agente de bolsa objetivo en Boston — pero solo a través de alguien a quien conocieran personalmente, por su nombre de pila. La mayoría de las cartas no llegaron nunca. Las que sí lo hicieron promediaron unos seis eslabones entre remitente y destinatario. Nació la frase de cultura popular «seis grados de separación». El atajo: la sociedad tiene nodos centrales, y son los nodos centrales los que hacen la mayor parte del enrutamiento.",
        },
        {
          pretitle: "Paso dos · Watts y Strogatz, 1998",
          title: "Recablear con probabilidad p",
          body: "Empieza con una red anular: N nodos en un círculo, cada uno conectado a sus k vecinos más cercanos a ambos lados. El grafo tiene un alto agrupamiento C — tus amigos son amigos entre sí — pero una larga longitud media de camino L del orden de N/k. Ahora recablea cada arista con probabilidad p hacia un destino aleatorio. Al subir p desde 0, L se desploma logarítmicamente mientras que C apenas se mueve. Unos pocos atajos aleatorios encogen el mundo. El punto dulce, en torno a p ≈ 0,01 a 0,1, es el régimen de mundo pequeño: C alto como en una red, L bajo como en un grafo aleatorio.",
        },
        {
          pretitle: "Paso tres · Dónde el mundo es realmente pequeño",
          title: "Películas, cerebros, redes eléctricas, la web",
          body: "Los grafos de colaboración académica nos dieron el número de Erdős; Hollywood nos dio el número de Bacon (el juego de los «seis grados de Kevin Bacon»). El gusano C. elegans tiene un cerebro de 302 neuronas perfectamente mapeado con conectividad de mundo pequeño; los conectomas humanos muestran la misma firma a escala mucho mayor. Redes eléctricas, internet, redes de citaciones, el grafo de enlaces de Wikipedia, redes de interacción de proteínas — el régimen de mundo pequeño aparece allí donde alguien se molesta en medir L y C. El mundo es pequeño, estructuralmente, en casi todas partes.",
        },
        {
          pretitle: "Paso cuatro · Consecuencias",
          title: "Difusión rápida, búsqueda inteligente, cerebros enfermos",
          body: "En las redes de mundo pequeño, los virus, los rumores y las ideas llegan a todos rápidamente — maravilloso para la difusión de la innovación, terrible durante una pandemia. Kleinberg (2000) demostró que la búsqueda voraz descentralizada solo tiene éxito en mundos pequeños cuando la distribución de los atajos tiene el exponente correcto, lo que explica por qué los reenviadores de cartas de Milgram podían realmente encontrar al destinatario. Y la neurociencia clínica usa hoy los coeficientes de mundo pequeño (σ, ω) como biomarcadores: el Alzheimer y la esquizofrenia muestran ambos desviaciones medibles respecto a la firma sana de mundo pequeño.",
        },
      ],
    },
  },
  storyLabels: {
    nowTryIt: "Ahora pruébalo.",
    readyToFly: "¿Listo para volar?",
    yourTurn: "Te toca.",
    stepIntoIt: "Entra.",
    buildWithOne: "Construye con una sola piedra.",
  },
};
