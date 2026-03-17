from flask import Flask, render_template, request, jsonify
import motor 

app = Flask(__name__)

# cargar base de datos en memoria al iniciar servidor
motor.cargar_cartas()

@app.route('/')
def index():
    return render_template('index.html')


@app.route('/api/clases', methods=['GET'])
def get_clases():
    # devuelve el catálogo de clases al frontend
    return jsonify(motor.obtener_clases())

@app.route('/api/iniciar', methods=['POST'])
def iniciar_partida():
    datos = request.json
    clase_elegida = datos.get('clase')
    # inyectar la clase al motor
    motor.inicializar_clase(clase_elegida)
    return jsonify({"status": "ok"})

@app.route('/api/estado', methods=['GET'])
def obtener_estado():
    # delegar al motor
    resultado = motor.obtener_estado_actual()
    return jsonify(resultado)

@app.route('/api/decision', methods=['POST'])
def procesar_decision():
    datos = request.json
    eleccion = datos.get('eleccion') # 'izq' o 'der'
    
    # delegar al motor
    resultado = motor.procesar_turno(eleccion)
    return jsonify(resultado)

if __name__ == '__main__':
    app.run(debug=True)