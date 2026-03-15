# Pathraguay - Motor de Decisiones Finito

Pathraguay es un simulador narrativo de toma de decisiones que modela los conflictos de la vida adulta mediante un sistema de eventos y atributos dinámicos.

El proyecto utiliza una arquitectura Cliente-Servidor (Flask + HTML/JS) para separar estrictamente la lógica del juego de la interfaz gráfica.

---

## Estructura del Repositorio (Zonas de Trabajo)

⚙️ **`main.py` (Backend)**  
Motor principal del sistema. Gestiona el estado del jugador, cálculos de atributos, dinero y progresión del juego.

📝 **`data/cartas.json` (Narrativa)**  
Base de datos de eventos del juego. Contiene diálogos, decisiones posibles y consecuencias.

🎨 **`templates/index.html` (Frontend UI)**  
Estructura visual principal del juego. Define HUD, botones y contenedor de eventos.

💅 **`static/style.css` (Frontend Estética)**  
Controla el diseño visual: colores, animaciones y estilo general.

🔌 **`static/app.js` (Frontend Lógica)**  
Conector entre frontend y backend. Envía decisiones al servidor y actualiza la interfaz.

---

## Flujo del Sistema

Jugador  
↓  
Frontend (`app.js`) envía decisión  
↓  
Backend (`main.py`) procesa lógica  
↓  
Se consulta evento en `cartas.json`  
↓  
Se actualizan atributos del jugador  
↓  
Se devuelve nuevo estado al frontend

---

## Ejecutar el Proyecto

1. Clonar el repositorio

```
   git clone https://github.com/Cesahz/hackathon-6.0.git
```

2. Instalar dependencias

```
    pip install -r requirements.txt
```

3. Ejecutar el servidor

```
    python main.py
```

4. Abrir en navegador

```
    http://127.0.0.1:5000
```

---

## Reglas del Repositorio

Nadie hace push directo a `main`.

Todo el desarrollo se realiza en ramas separadas:

Las integraciones se realizan únicamente mediante **Pull Requests**.
