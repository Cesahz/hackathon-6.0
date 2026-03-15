// 1. comunicacion asincrona con backend
document.addEventListener('DOMContentLoaded', iniciarJuego);

function iniciarJuego() {
    fetch('/api/estado')
        .then(res => res.json())
        .then(datos => actualizarInterfaz(datos));
}

function enviarDecision(eleccion) {
    // bloquear interaccion para prevenir peticiones duplicadas.
    tarjeta.style.pointerEvents = 'none'; 
    
    fetch('/api/decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ eleccion: eleccion })
    })
    .then(res => res.json())
    .then(datos => {
        // restaurar estado visual y liberar interaccion.
        resetearTarjeta();
        actualizarInterfaz(datos);
        tarjeta.style.pointerEvents = 'auto';
    });
}

function actualizarInterfaz(datos) {
    // parsear estadisticas al dom.
    document.getElementById('ui-salud').innerText = datos.stats.salud;
    document.getElementById('ui-social').innerText = datos.stats.social;
    document.getElementById('ui-intelecto').innerText = datos.stats.intelecto;
    document.getElementById('ui-laboral').innerText = datos.stats.laboral;
    document.getElementById('ui-dinero').innerText = datos.stats.dinero;

    if (datos.fin) {
        document.getElementById('ui-texto-carta').innerText = datos.mensaje;
        document.querySelector('.controles-auxiliares').classList.add('oculto');
        // anular manipulacion tras finalizacion.
        tarjeta.style.pointerEvents = 'none';
    } else {
        document.getElementById('ui-texto-carta').innerText = datos.carta.texto;
        document.getElementById('btn-izq').innerText = datos.carta.opcion_izq.texto;
        document.getElementById('btn-der').innerText = datos.carta.opcion_der.texto;
    }
}

// 2. controlador de interfaz fisica (swiping)
const tarjeta = document.getElementById('tarjeta-activa');
const indIzq = document.getElementById('ind-izq');
const indDer = document.getElementById('ind-der');

let isDragging = false;
let startX = 0;
let currentTranslate = 0;
// distancia minima requerida para procesar solicitud.
const umbralSwipe = 100; 

// asignacion de eventos puntero.
tarjeta.addEventListener('mousedown', iniciarArrastre);
document.addEventListener('mousemove', arrastrar);
document.addEventListener('mouseup', soltarTarjeta);

// asignacion de eventos tactiles.
tarjeta.addEventListener('touchstart', (e) => iniciarArrastre(e.touches[0]));
document.addEventListener('touchmove', (e) => arrastrar(e.touches[0]));
document.addEventListener('touchend', soltarTarjeta);

function iniciarArrastre(e) {
    if (tarjeta.style.pointerEvents === 'none') return;
    isDragging = true;
    startX = e.clientX;
    tarjeta.classList.add('dragging');
}

function arrastrar(e) {
    if (!isDragging) return;
    
    const currentX = e.clientX;
    currentTranslate = currentX - startX;
    
    // aplicar translacion y rotacion al nodo.
    const rotacion = currentTranslate * 0.1;
    tarjeta.style.transform = `translateX(${currentTranslate}px) rotate(${rotacion}deg)`;
    
    // calibrar opacidad de indicadores en base a posicion.
    if (currentTranslate > 20) {
        indDer.style.opacity = Math.min(currentTranslate / umbralSwipe, 1);
        indIzq.style.opacity = 0;
    } else if (currentTranslate < -20) {
        indIzq.style.opacity = Math.min(Math.abs(currentTranslate) / umbralSwipe, 1);
        indDer.style.opacity = 0;
    }
}

function soltarTarjeta() {
    if (!isDragging) return;
    isDragging = false;
    tarjeta.classList.remove('dragging');
    
    // procesar desplazamiento final.
    if (currentTranslate > umbralSwipe) {
        // resolucion derecha.
        animarSalida(window.innerWidth);
        enviarDecision('der');
    } else if (currentTranslate < -umbralSwipe) {
        // resolucion izquierda.
        animarSalida(-window.innerWidth);
        enviarDecision('izq');
    } else {
        // cancelacion de accion.
        resetearTarjeta();
    }
}

function animarSalida(destinoX) {
    tarjeta.style.transition = 'transform 0.4s ease-out';
    tarjeta.style.transform = `translateX(${destinoX}px) rotate(${destinoX * 0.1}deg)`;
}

function resetearTarjeta() {
    tarjeta.style.transition = 'transform 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
    tarjeta.style.transform = 'translateX(0px) rotate(0deg)';
    currentTranslate = 0;
    indIzq.style.opacity = 0;
    indDer.style.opacity = 0;
}