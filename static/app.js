/* controlador central del frontend (reactivo al backend) */
const ControladorVisual = {
    busy: false,
    cartaActual: null,
    
    /* diccionario narrativo para condiciones de colapso */
    mensajesDerrota: {
        salud:     { icon: '🏥', title: 'Internado en el IPS',  msg: 'Tu cuerpo aguantó todo lo que le pediste. Un día simplemente no pudo más.' },
        intelecto: { icon: '📋', title: 'Perdiste la beca',      msg: 'Las materias se acumularon hasta que ya no hubo vuelta atrás.' },
        laboral:   { icon: '📦', title: 'Te despidieron',        msg: 'Te llamaron a una reunión corta. Te dieron un sobre.' },
        social:    { icon: '🪟', title: 'Depresión',             msg: 'Hace semanas que no contestás mensajes. La gente dejó de enviarlos.' },
        dinero:    { icon: '🪙', title: 'Te quedaste sin nada',  msg: 'La cuenta llegó a cero y los compromisos siguieron llegando.' }
    },

    /* formateador de moneda local */
    fmt: function(n) { return '₲ ' + Math.abs(n).toLocaleString('es-PY'); },

    /* actualiza el dom con los textos de la carta actual */
    renderizarCarta: function(carta) {
        document.getElementById('npc-name').textContent = 'Carta';
        document.getElementById('situation-text').textContent = carta.texto;
        document.getElementById('btn-izq').textContent = '← ' + carta.opcion_izq.texto;
        document.getElementById('btn-der').textContent = carta.opcion_der.texto + ' →';
        document.getElementById('log').textContent = '';
    },

    /* actualiza anchos de barra y valores numericos del hud */
    renderizarStats: function(stats) {
        document.getElementById('ui-salud').style.width = stats.salud + '%';
        document.getElementById('ui-intelecto').style.width = stats.intelecto + '%';
        document.getElementById('ui-laboral').style.width = stats.laboral + '%';
        document.getElementById('ui-social').style.width = stats.social + '%';
        
        document.getElementById('val-salud').textContent = stats.salud + '%';
        document.getElementById('val-intelecto').textContent = stats.intelecto + '%';
        document.getElementById('val-laboral').textContent = stats.laboral + '%';
        document.getElementById('val-social').textContent = stats.social + '%';
        document.getElementById('ui-dinero').textContent = this.fmt(stats.dinero);
    },
    /* inyecta y anima los numeros de impacto (verdes/rojos) post-decision */
    mostrarDeltas: function(efectos) {
        if (!efectos) return;
        ['salud', 'intelecto', 'laboral', 'social'].forEach(k => {
            const v = efectos[k] || 0;
            const b = document.getElementById('d-' + k);
            if (!b) return;
            b.classList.remove('show', 'up', 'down');
            if (v === 0) return;
            b.textContent = (v > 0 ? '+' : '') + v + '%';
            b.classList.add(v > 0 ? 'up' : 'down');
            requestAnimationFrame(() => requestAnimationFrame(() => b.classList.add('show')));
        });
        const db = document.getElementById('d-dinero');
        if (db && efectos.dinero && efectos.dinero !== 0) {
            db.classList.remove('show', 'up', 'down');
            db.textContent = (efectos.dinero > 0 ? '+' : '-') + this.fmt(efectos.dinero);
            db.classList.add(efectos.dinero > 0 ? 'up' : 'down');
            requestAnimationFrame(() => requestAnimationFrame(() => db.classList.add('show')));
        }
    },

    /* resetea los numeros de impacto */
    ocultarDeltas: function() {
        ['salud', 'intelecto', 'laboral', 'social', 'dinero'].forEach(k => {
            const b = document.getElementById('d-' + k);
            if (b) b.classList.remove('show', 'up', 'down');
        });
    },
    /* despliega la capa oscura de fin de juego con resolucion narrativa */
    ejecutarGameOver: function(statFatal, mensajeServidor) {
        this.ocultarDeltas();
        
        // asignacion dinamica de textos dependiendo si es muerte o victoria
        const title = statFatal ? this.mensajesDerrota[statFatal].title : 'Fin del Trayecto';
        const msg = statFatal ? this.mensajesDerrota[statFatal].msg : mensajeServidor;
        const icon = statFatal ? this.mensajesDerrota[statFatal].icon : '⏳';

        document.getElementById('go-icon').textContent = icon;
        document.getElementById('go-title').textContent = title;
        document.getElementById('go-msg').textContent = msg;
        
        if (statFatal) {
            const labels = { salud: 'Salud · 0%', intelecto: 'Intelecto · 0%', laboral: 'Laboral · 0%', social: 'Social · 0%', dinero: 'Dinero · ₲ 0' };
            document.getElementById('go-stat-label').textContent = labels[statFatal];
            document.getElementById('row-' + statFatal).classList.add('bar-critical');
        } else {
            document.getElementById('go-stat-label').textContent = "Equilibrio Temporal";
        }
        
        setTimeout(() => document.getElementById('gameover-overlay').classList.add('active'), 500);
    },
    /* solicita el estado inicial a python e inyecta la primera interfaz */
    inicializar: function() {
        fetch('/api/estado')
            .then(res => res.json())
            .then(datos => {
                this.renderizarStats(datos.stats);
                if (!datos.fin) {
                    this.cartaActual = datos.carta;
                    this.renderizarCarta(this.cartaActual);
                }
                this.asignarEventos();
            });
    },

    /* procesa el gesto del usuario, anima la carta y delega el calculo a python */
    ejecutarSwipe: function(dir) {
        if (this.busy || !this.cartaActual) return;
        this.busy = true;
        
        const ci = document.getElementById('card-inner');
        const opcion = dir === 'izq' ? this.cartaActual.opcion_izq : this.cartaActual.opcion_der;

        document.getElementById('log').textContent = '› ' + opcion.texto;
        ci.classList.add(dir === 'izq' ? 'fly-l' : 'fly-r');

        // delegacion de matematicas a servidor (motor de grafos)
        fetch('/api/decision', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ eleccion: dir })
        })
        .then(res => res.json())
        .then(resultadoBackend => {
            setTimeout(() => {
                this.renderizarStats(resultadoBackend.stats);
                this.mostrarDeltas(resultadoBackend.efectos); 

                // animacion de pulso para barras alteradas
                ['salud', 'intelecto', 'laboral', 'social'].forEach(k => {
                    if (!resultadoBackend.efectos || !resultadoBackend.efectos[k]) return;
                    const r = document.getElementById('row-' + k);
                    r.classList.remove('bar-changing');
                    void r.offsetWidth;
                    r.classList.add('bar-changing');
                    setTimeout(() => r.classList.remove('bar-changing'), 600);
                });

                // intercepcion de colapso dictado por servidor
                if (resultadoBackend.fin) {
                    setTimeout(() => { this.ejecutarGameOver(resultadoBackend.stat_fatal, resultadoBackend.mensaje); this.busy = false; }, 700);
                    return;
                }

                // carga e inyeccion del siguiente nodo del grafo
                setTimeout(() => {
                    this.ocultarDeltas();
                    this.cartaActual = resultadoBackend.carta;
                    this.renderizarCarta(this.cartaActual);
                    ci.classList.remove('fly-l', 'fly-r', 'tilt-l', 'tilt-r');
                    void ci.offsetWidth;
                    ci.classList.add('entering');
                    setTimeout(() => { ci.classList.remove('entering'); this.busy = false; }, 350);
                }, 600);

            }, 880);
        });
    },

    /* asignacion de escuchadores de eventos para interaccion manual o tactil */
    asignarEventos: function() {
        let drag = false, sx = 0, cx = 0;
        const ci = document.getElementById('card-inner');

        const ds = (x) => { if (!this.busy) { drag = true; sx = x; } };
        const dm = (x) => {
            if (!drag) return;
            cx = x - sx;
            ci.classList.remove('tilt-l', 'tilt-r');
            if (cx < -30) ci.classList.add('tilt-l');
            else if (cx > 30) ci.classList.add('tilt-r');
        };
        const de = () => {
            if (!drag) return;
            drag = false;
            if (cx < -60) this.ejecutarSwipe('izq');
            else if (cx > 60) this.ejecutarSwipe('der');
            else ci.classList.remove('tilt-l', 'tilt-r');
            cx = 0;
        };

        ci.addEventListener('mousedown', e => ds(e.clientX));
        window.addEventListener('mousemove', e => dm(e.clientX));
        window.addEventListener('mouseup', de);
        ci.addEventListener('touchstart', e => ds(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchmove', e => dm(e.touches[0].clientX), { passive: true });
        window.addEventListener('touchend', de);

        document.getElementById('btn-izq').addEventListener('click', () => this.ejecutarSwipe('izq'));
        document.getElementById('btn-der').addEventListener('click', () => this.ejecutarSwipe('der'));
        
        // reinicio forzando recarga de la aplicacion al cliente
        document.getElementById('go-restart').addEventListener('click', () => {
            location.reload(); 
        });
    }
};

/* arranque autonomo del menu al cargar documento */
document.addEventListener('DOMContentLoaded', () => {
    // 1. solicitar diccionario de clases a servidor
    fetch('/api/clases')
        .then(res => res.json())
        .then(clases => {
            const container = document.getElementById('clases-container');
            container.innerHTML = ''; 
            
            // 2. renderizado dinamico (data-driven) de botones de seleccion
            for (const [nombre, datos] of Object.entries(clases)) {
                const btn = document.createElement('button');
                btn.className = 'btn-clase';
                btn.onclick = () => elegirClase(nombre);
                
                btn.innerHTML = `
                    <span style="font-weight: bold; font-size: 22px; color: #c8cad4;">${nombre}</span>
                    <span class="clase-desc">${datos.descripcion}</span>
                `;
                container.appendChild(btn);
            }
        });
});

/* puente comunicacional de inicializacion con servidor */
function elegirClase(nombreClase) {
    fetch('/api/iniciar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ clase: nombreClase })
    })
    .then(res => res.json())
    .then(data => {
        if(data.status === 'ok') {
            // eliminacion de capa de seleccion y activacion de hud
            document.getElementById('start-screen').style.display = 'none';
            ControladorVisual.inicializar();
        }
    });
}