// Variable global para almacenar todas las instancias de timers
const timers = {};
let timerIdCounter = 0;

/**
 * Clase principal para manejar tanto Cronómetros (Stopwatch) como Cuentas Regresivas (Countdown).
 * Utiliza programación orientada a objetos para mantener cada timer independiente.
 */
class Timer {
    /**
     * @param {string} id - ID único del timer.
     * @param {string} name - Nombre asignado por el usuario.
     * @param {string} type - 'stopwatch' o 'countdown'.
     * @param {number} initialTimeInSeconds - Tiempo inicial en segundos (solo para countdown).
     */
    constructor(id, name, type, initialTimeInSeconds = 0) {
        this.id = id;
        this.name = name;
        this.type = type;
        this.totalSeconds = initialTimeInSeconds;
        this.isRunning = false;
        this.interval = null;
        this.initialSeconds = initialTimeInSeconds; // Para el reset de countdown
        this.elements = {}; // Almacena referencias al DOM
        this.render(); // Dibuja el timer en la pantalla
    }

    /**
     * Convierte segundos totales a formato HH:MM:SS.mmm
     * @param {number} totalSeconds - Segundos, incluyendo milisegundos.
     * @returns {string} - Cadena de tiempo formateada.
     */
    formatTime(totalSeconds) {
        const ms = Math.floor((totalSeconds % 1) * 1000);
        const totalSec = Math.floor(totalSeconds);
        const hours = Math.floor(totalSec / 3600);
        const minutes = Math.floor((totalSec % 3600) / 60);
        const seconds = totalSec % 60;

        const pad = (num, length = 2) => String(num).padStart(length, '0');

        return `${pad(hours)}:${pad(minutes)}:${pad(seconds)}.${pad(ms, 3)}`;
    }

    /**
     * Dibuja la interfaz del timer en el DOM.
     */
    render() {
        const timersList = document.getElementById('timers-list');
        
        // Crear el contenedor principal
        const card = document.createElement('div');
        card.className = 'timer-card';
        card.id = `timer-${this.id}`;
        
        // Nombre
        const nameEl = document.createElement('div');
        nameEl.className = 'timer-name';
        nameEl.textContent = `${this.type === 'stopwatch' ? 'Cronómetro' : 'Cuenta Regresiva'} - ${this.name}`;
        card.appendChild(nameEl);

        // Display del tiempo
        const display = document.createElement('div');
        display.className = 'display';
        display.textContent = this.formatTime(this.totalSeconds);
        card.appendChild(display);
        this.elements.display = display;

        // Contenedor de botones
        const buttonsContainer = document.createElement('div');
        buttonsContainer.className = 'buttons-container';
        card.appendChild(buttonsContainer);
        this.elements.buttonsContainer = buttonsContainer;

        // Botón Quitar
        const removeBtn = document.createElement('button');
        removeBtn.textContent = 'Quitar';
        removeBtn.className = 'remove-btn';
        removeBtn.onclick = () => this.remove();
        card.appendChild(removeBtn);
        
        timersList.appendChild(card);
        
        this.updateButtons('initial'); // Mostrar solo Start/Stop
    }

    /**
     * Actualiza la visibilidad de los botones (Start, Stop, Reset).
     * @param {string} state - 'initial', 'running', 'stopped', 'finished'.
     */
    updateButtons(state) {
        const container = this.elements.buttonsContainer;
        container.innerHTML = ''; // Limpiar botones anteriores

        const startBtn = document.createElement('button');
        startBtn.textContent = 'Start';
        startBtn.className = 'start-btn';
        startBtn.onclick = () => this.start();

        const stopBtn = document.createElement('button');
        stopBtn.textContent = 'Stop';
        stopBtn.className = 'stop-btn';
        stopBtn.onclick = () => this.stop();

        // Botón Reset (solo visible en estado 'stopped' o 'finished')
        const resetBtn = document.createElement('button');
        resetBtn.textContent = 'Reset';
        resetBtn.className = 'reset-btn';
        resetBtn.onclick = () => this.reset();

        if (state === 'initial' || state === 'stopped' || state === 'finished') {
            container.appendChild(startBtn);
        }
        
        if (state === 'running') {
            container.appendChild(stopBtn);
        }

        // Requerimiento 2 & 3: Botón Reset habilitado al hacer click en Stop
        if (state === 'stopped' && (this.type === 'stopwatch' || this.totalSeconds !== this.initialSeconds)) {
            container.appendChild(resetBtn);
        }
        
        // Estado final de la cuenta regresiva
        if (state === 'finished') {
             container.appendChild(resetBtn);
        }
    }

    /**
     * Inicia o reanuda el timer.
     */
    start() {
        if (this.isRunning) return;
        this.isRunning = true;
        this.updateButtons('running');
        this.elements.display.classList.remove('warning-red', 'finished-state');

        // Tasa de actualización de 100 milisegundos (10 FPS) para mejor precisión y visualización.
        this.interval = setInterval(() => {
            this.updateTime();
        }, 100);
    }

    /**
     * Detiene el timer.
     */
    stop() {
        if (!this.isRunning) return;
        this.isRunning = false;
        clearInterval(this.interval);
        this.updateButtons('stopped'); // Habilita el botón Reset
    }

    /**
     * Reinicia el timer a su valor inicial.
     */
    reset() {
        this.stop();
        this.totalSeconds = (this.type === 'countdown') ? this.initialSeconds : 0;
        this.elements.display.textContent = this.formatTime(this.totalSeconds);
        this.elements.display.classList.remove('warning-red', 'finished-state');
        this.updateButtons('initial'); // Vuelve a mostrar solo Start/Stop
    }

    /**
     * Lógica de actualización de tiempo, separada por tipo de timer.
     */
    updateTime() {
        if (this.type === 'stopwatch') {
            this.totalSeconds += 0.1; // Suma 0.1 segundos (100ms)
        } else { // countdown
            this.totalSeconds -= 0.1;
            this.handleCountdown();
        }
        this.elements.display.textContent = this.formatTime(this.totalSeconds);
    }

    /**
     * Lógica específica para la cuenta regresiva.
     * Controla la alerta visual y la finalización.
     */
    handleCountdown() {
        const remainingSeconds = Math.round(this.totalSeconds);

        if (remainingSeconds <= 5 && remainingSeconds > 0) {
            // Requerimiento 5: Los últimos 5 segundos se pintan en rojo
            this.elements.display.classList.add('warning-red');
            // Nota: La emisión de sonido se ha ELIMINADO para cumplir el requerimiento
        } else if (remainingSeconds > 5) {
            this.elements.display.classList.remove('warning-red');
        }

        if (this.totalSeconds <= 0) {
            this.stop();
            this.totalSeconds = 0; // Asegurar que sea 00:00:00.000
            this.elements.display.textContent = this.formatTime(0);
            
            // Requerimiento 6: Emitirá un sonido de finalización (LÓGICA ELIMINADA)
            this.elements.display.classList.add('finished-state');
            this.elements.display.classList.remove('warning-red');
            this.updateButtons('finished');
        }
    }

    /**
     * Elimina el timer de la pantalla y de la lista global.
     */
    remove() {
        this.stop(); // Detener si está corriendo
        const card = document.getElementById(`timer-${this.id}`);
        if (card) {
            card.remove();
        }
        delete timers[this.id];
    }
}

// ====================================================================
// FUNCIONES GLOBALES DE INICIALIZACIÓN Y MANEJO DE LA INTERFAZ
// ====================================================================

/**
 * Parsea una cadena de tiempo (ej: "1h 5m 30s") a segundos totales.
 * @param {string} timeStr - Cadena de tiempo.
 * @returns {number} - Segundos totales.
 */
function parseTime(timeStr) {
    let totalSeconds = 0;
    const parts = timeStr.match(/(\d+)\s*(h|m|s|d)/g);
    
    if (!parts) return 0;

    parts.forEach(part => {
        const value = parseInt(part.match(/\d+/)[0]);
        const unit = part.match(/(h|m|s|d)/)[0];

        switch (unit) {
            case 'd': // Días
                totalSeconds += value * 86400;
                break;
            case 'h': // Horas
                totalSeconds += value * 3600;
                break;
            case 'm': // Minutos
                totalSeconds += value * 60;
                break;
            case 's': // Segundos
                totalSeconds += value;
                break;
        }
    });

    return totalSeconds;
}

/**
 * Crea una nueva instancia de Timer (Cronómetro o Cuenta Regresiva).
 */
function addTimer() {
    const nameInput = document.getElementById('timer-name-input');
    const typeSelect = document.getElementById('timer-type-select');
    const timeInput = document.getElementById('initial-time-input');

    const name = nameInput.value.trim() || `Timer #${timerIdCounter + 1}`;
    const type = typeSelect.value;
    let initialSeconds = 0;

    if (type === 'countdown') {
        initialSeconds = parseTime(timeInput.value);
        if (initialSeconds <= 0) {
            alert('Por favor, ingresa un tiempo inicial válido para la cuenta regresiva (ej: 5m 30s).');
            return;
        }
    }

    timerIdCounter++;
    const newId = timerIdCounter;
    
    // Crear y almacenar el nuevo timer
    const newTimer = new Timer(newId, name, type, initialSeconds);
    timers[newId] = newTimer;

    // Limpiar campos después de agregar
    nameInput.value = 'Mi Timer';
    timeInput.value = '';
    
    // Deshabilitar campo de tiempo inicial por defecto (cronómetro)
    timeInput.disabled = true; 
}

// ====================================================================
// INICIALIZACIÓN DEL EVENTO DOMContentLoaded
// ====================================================================

document.addEventListener('DOMContentLoaded', () => {
    const typeSelect = document.getElementById('timer-type-select');
    const initialTimeInput = document.getElementById('initial-time-input');
    const addTimerBtn = document.getElementById('add-timer-btn');
    
    // Event listener para habilitar/deshabilitar el campo de tiempo inicial
    typeSelect.addEventListener('change', () => {
        initialTimeInput.disabled = (typeSelect.value === 'stopwatch');
        if (typeSelect.value === 'stopwatch') {
            initialTimeInput.value = '';
        }
    });

    // Adjuntar la función addTimer al botón (CORRECCIÓN DEL ERROR)
    // Esto asegura que la función esté definida antes de ser llamada.
    addTimerBtn.addEventListener('click', addTimer);
});