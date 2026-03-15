# Pathraguay - Documentación del Chasis Base

Este documento explica como funciona el flujo y las posibles expansiones que podemos hacer y nos permite trabajar con esta plantilla como referencia. Trabajar con una plantilla ejemplo nos permite a todos poder investigar para trabajar por separado tanto los del backend como los del frontend.

# Asignaciones Generalizadas (a discutir)

Nuestra tarea a partir de esto es tomar esta plantilla y agregarle nuestro toque, es simplemente un cascaron vacio en el que podemos trabajar con algunos ejemplos simples.

## Nota para los de frontend

- Para que el diseno tenga nuestra personalidad, le pedi a la IA que haga algo generico para que puedan darse una idea de como funcionan las piezas ensambladas, la tarea de los del frontend es basicamente darle una identidad al diseno, consultar con nosotros del backend si agregar x boton tiene sentido (porque no pueden poner botones funcionales si no tiene una logica prevista por los del back)

## El Flujo del Sistema (Cómo se conectan las piezas)

- El juego funciona separando estrictamente el "cerebro" de la "cara": - El Cerebro (Python/Flask): Es el motor del juego. Vive en el servidor y es el único que hace matemáticas. Sabe cuánta salud tienes, cuánto dinero te queda y qué carta sigue. No sabe nada de colores, animaciones ni botones.

- La Historia (Archivo JSON): Es nuestra base de datos narrativa. Aquí escribimos los eventos, los diálogos y las consecuencias. Python lee este archivo para saber qué está pasando en la vida del personaje.

- La Cara (HTML/CSS): Es lo que ve el jugador. Muestra las tarjetas y los números, pero es completamente "ciega". No hace cálculos ni toma decisiones.

- El Mensajero (JavaScript): Es el puente invisible. Cuando el jugador desliza una tarjeta hacia la derecha, JavaScript atrapa ese movimiento y le manda un mensaje silencioso a Python diciendo: "El jugador aceptó". Python hace las restas y sumas, y le devuelve los nuevos números a JavaScript, quien actualiza la pantalla sin que la página parpadee o se recargue.

# Escalabilidad:

## Creación de Personaje (Stats Iniciales) ---MVP

Actualmente, La plantilla inicia con stats fijas (porque es ejemplo jeje). Para implementar la idea de que cada jugador simule su propia vida inicial:

- Cómo lo haremos: El equipo de Frontend creará una pantalla previa al juego con un formulario para repartir puntos (salud, dinero, etc.).
- La conexión: Al darle a "Comenzar", JavaScript enviará esos números a Python. Python los guardará como la base de esa partida y luego enviará la primera tarjeta. El motor central no necesita modificaciones drásticas para soportar esto.

## Rutas Alternativas y Consecuencias ---MVP

El juego no será una línea recta. Queremos que ir a la universidad abra un camino y trabajar en una obra abra otro completamente distinrta (es un ejemplo, los encargados de la trama tankean esta parte y el resto aporta cuando termina su respectiva parte)

- Cómo lo haremos: En lugar de que Python saque las cartas en orden (1, 2, 3...), el equipo de datos le pondrá un "ID" único a cada carta en el archivo JSON (Nota: se me ocurren ciertas etiquetas para poder armar un buen arbol de grafos y que sea ordenado, pero les confio a los guinistas en organizar bien esta parte).

- La conexión: Cada opción ya sea izquierda o derecha tendrá anotado hacia qué carta te envía. Por ejemplo si elegimos aceptar la propuesta de tal persona o tal acontecimiento, la siguiente carta tiene que estar directamente relacionada y compatible con esa eleccion, sin tocar el codigo central

## Minijuegos, Préstamos e Inversiones (extras)

Queremos que el dinero tenga un uso real y que haya eventos críticos mi propuesta es poder implementar una interfaz que nos permita usar el dinero de forma estrategica durante el juego, pero es un extra realmente, se hace despues de tener el MVP.
NOTA: Una vez tengamos el MVP cualquier cosa que quieran agregar y sea coherente es bienvenido, sin miedo pueden mandar la idea en el grupo o en persona si estamos reunidos cuando eso.

Ahora bien:

- Cómo lo haremos: El equipo de Frontend puede crear "ventanas flotantes" que normalmente están invisibles o fuera de escena (nos toca investigar)
- La conexión: Si Python detecta que es el turno de pagar una deuda, le avisa a JavaScript. El motor de deslizar cartas se pausa, y aparece una pantalla de "Banco" sobre el juego. El jugador interactúa ahí, y cuando termina, el resultado se envía de vuelta a Python. Luego, la ventana del Banco desaparece y el jugador sigue deslizando cartas normalmente.

# Próximos Pasos para el Equipo

## Backend

Entender cómo Python procesa la decisión y devuelve el resultado. Empezar a adaptar el código para leer un archivo JSON real en lugar de datos de prueba, e implementar el sistema de ramificación (rutas alternativas).

### Notas del Team Lead (Cezah):

- Sobre JavaScript: como separamos bien las cosas, los del backend no tocan JS (app.js). Uno del frontend debe de mantener funcionando constantemente este archivo (o puedo hacerlo yo), esto debido a que es el mesero entre el front y el back, entonces tiene un rol importante aunque no parezca.

- Tema IA: No tengan miedo de usar IA, es mucha informacion en poco tiempo y la hackaton no busca que aprendamos cada linea de codigo sino de representar nuestra creatividad y fomentar el trabajo en equipo, ahora mismo es nuestra herramienta mas util. No hay grupo en la hackathon que utilice IA, negar su uso es como intentar talar un arbol con una cuchara, pero quiero que usen de una forma especifica que les voy a detallar a continuacion jeje.

## Criterios para la IA:

- 1. No pueden desarrollar grandes bloques sin hacer una documentacion de su idea, esta prohibido copiar grandes lineas de codigo.
- 2. Es una mala practica que se la pasen cambiando el script entero de mil formas sin sentido, si van a hacer modificaciones no tienen que ser muy bruscas anocer que haya un cambio directo y avisado previamente en el apartado Issues de Github. La idea es que hagan modificaciones simples, para agregar cosas y no cambiar la arquitectura del codigo base bruscamente.
- 3. No tengan miedo a probar cosas nuevas, recuerden que para eso van a tener su rama de github.

# Roles en el proyecto:

## Backend:

- 1. Team lead: Supervisor del repositorio, revision de pull request, mantenimiento de enrutado de flask, asignacion de issues en github y apoyo general en problamas tecnicos
- 2. Persona 2: Modificar el motor de python para que soporte todo lo necesario del MVP. Programar los multiplicadores de stats y asegurar el calculo matematico para game over (quiebra, poca salud, etc)
- 3. Persona 3: Dueno del archivo cartas.json. Su mision es estructurar el arbol de de decisiones, debe redactar los eventos de la base de la vida adulta y pedir apoyo constantemente para ideas o nuevas implementaciones. Es la parte mas importante del juego ya que literalmente dependemos de la trama.
- 4. Persona 4: Programar un sistema en Python que guarde el historial de decisiones del jugador (logs). Investigar y preparar la logica del lado del servidor para soportar las tiendas, préstamos o minijuegos (PRIORIDAD EL MVP)

## Frontend:

- 5. Persona 5: Diseno absoluto de la experiencia, maquetar la pantalla inicial de Creacion de stats del personaje, disenar las ventanas modales flotantes (como el apartado de estadisticas o minijuegos) priorizando el mvp. Mantener constante comunicacion con el resto del equipo
- 6. Persona 6: Control total del archivo app.js. Su unica mision es que el frontend se comunique perfectamente con el backend.
