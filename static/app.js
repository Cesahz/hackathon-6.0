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