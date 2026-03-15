from flask import Flask, render_template, request, jsonify
import json
import os

app = Flask(__name__)

# estado inicial del jugador mvp.
# evaluar migracion a sesiones flask en futuras iteraciones.
estado_jugador = {
    "salud": 80,
    "social": 50,
    "intelecto": 30,
    "laboral": 20,
    "dinero": 500000,
    "indice_carta": 0  # indice de seguimiento de carta actual
}

def cargar_cartas():
    ruta = os.path.join(os.path.dirname(__name__), 'data', 'cartas.json')
    with open(ruta, 'r', encoding='utf-8') as archivo:
        return json.load(archivo)

CARTAS = cargar_cartas()

@app.route('/')
def index():
    # renderizar plantilla html base.
    return render_template('index.html')

@app.route('/api/estado', methods=['GET'])
def obtener_estado():
    # retornar estado inicial y primera carta.
    if estado_jugador["indice_carta"] < len(CARTAS):
        carta_actual = CARTAS[estado_jugador["indice_carta"]]
        return jsonify({"stats": estado_jugador, "carta": carta_actual, "fin": False})
    else:
        return jsonify({"stats": estado_jugador, "carta": None, "fin": True, "mensaje": "Sobreviviste al MVP."})

@app.route('/api/decision', methods=['POST'])
def procesar_decision():
    datos = request.json
    eleccion = datos.get('eleccion') # valores esperados: 'izq' o 'der'
    
    carta_actual = CARTAS[estado_jugador["indice_carta"]]
    
    # 1. procesar multiplicadores y efectos en estadisticas.
    efectos = carta_actual["opcion_" + eleccion]["efectos"]
    for stat, valor in efectos.items():
        estado_jugador[stat] += valor
        
        # aplicar limites de 0 a 100 a variables no financieras.
        if stat != "dinero":
            estado_jugador[stat] = max(0, min(100, estado_jugador[stat]))

    # 2. evaluar condiciones de victoria/derrota.
    if estado_jugador["salud"] <= 0:
        return jsonify({"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: Colapso por Burnout clínico."})
    if estado_jugador["dinero"] < 0:
        return jsonify({"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: Bancarrota. El sistema te devoró."})

    # 3. avanzar indice de turno.
    estado_jugador["indice_carta"] += 1
    
    if estado_jugador["indice_carta"] < len(CARTAS):
        nueva_carta = CARTAS[estado_jugador["indice_carta"]]
        return jsonify({"stats": estado_jugador, "carta": nueva_carta, "fin": False})
    else:
        return jsonify({"stats": estado_jugador, "fin": True, "mensaje": "FIN DEL JUEGO: Lograste el equilibrio temporal."})

if __name__ == '__main__':
    # inicializar servidor web.
    app.run(debug=True)