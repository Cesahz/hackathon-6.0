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