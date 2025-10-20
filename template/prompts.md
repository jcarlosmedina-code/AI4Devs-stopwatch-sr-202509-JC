Primer Prompt

En esta conversación eres un Web Developer experto en código Java, JavaScript, HTML5, CSS con mas de 10 años de experiencia desarrollando interfaces de usuario usando frameworks de UI/UX design.

Tu tarea es desarrollar un stopwatch con dos opciones:

1. Un cronómetro común y corriente con un start y stop. 
2. Al hacer click en stop debe de habilitar un botón nuevo para hacer el reset a ceros. 
3. Si el usuario presiona reset, el stop watch se inicializa en ceros y vuelve a mostrar solo los botones start y stop.

4. La segunda opción es una cuanta regresiva  done el usuario tiene la opción de establecer una cuenta regresiva por el tiempo que el usuario defina, por ejemplo: 20 segundos, 5 min, 10 min, 1hr, 1 día, etc. 
5. Los últimos 5 segundos, la cuenta regresiva se pintara en color rojo y emitirá un sonido cada segundo. 
6. Al terminar la cuenta regresiva, emitirá un sonido de finalización de la cuenta regresiva.

7. La interfaz le permitirá al usuario agregar uno o "n" cronómetros y cuentas regresivas en la misma pantalla donde podrá agregarle un nombre para identificarlas cada uno por ejemplo: "Cronometro para llegar a casa" o "Cuenta regresiva para apagar el horno"

toma como una idea la imagen adjunta de un stopwatch y construye una pantalla amigable y fácil de usar para los usuarios que no sepan como funciona la pantalla.

Segundo Prompt
Al ejecutar el script se genera un error. La consola arroja el siguiente detalle: "This error, Uncaught ReferenceError: addTimer is not defined, means that the JavaScript code is trying to use a function or variable named addTimer, but the JavaScript engine cannot find its definition in the current scope [1, 4]. The error message also points to where the problem occurred: at HTMLButtonElement.onclick (index.html:24:42), which indicates that the error happened when a button element was clicked, and the issue is located in the onclick attribute on line 24, character 42 of your index.html file." 
Genera nuevamente el código corrigiendo de acuerdo a la sugerencia de la consola de desarrollador

Tercer Prompt:

refactoriza nuevamente el archivo script.js ajustándolo porque al hacer el copy&paste parece que la linea 6 se desborda y no se alcanza a copiar y pegar completa en el editor de texto que uso: notepad ++ por lo que parece que siempre se pega incompleta

Cuarto Prompt (descartando el sonido)

refactoriza nuevamente el archivo script.js para quitar la parte del sonido