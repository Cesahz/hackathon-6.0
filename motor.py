import json
import os

# Variables globales de memoria
CLASES_DISPONIBLES = {
    #ejemplo temporal para que entiendan como se crea un preset
    "Heredero": {
        "descripcion": "hijo de empresario. dinero de sobra, poca resistencia al estres.",
        "stats": {"salud": 60, "social": 80, "intelecto": 40, "laboral": 30, "dinero": 5000000}
    },
    "Pobre pero Honrado": {
        "descripcion": "acostumbrado a la presion. poco dinero, alta resistencia.",
        "stats": {"salud": 90, "social": 40, "intelecto": 50, "laboral": 70, "dinero": 100000}
    },
    "Inteligente asocial": {
        "descripcion": "inteligencia pura, cero habilidades sociales.",
        "stats": {"salud": 50, "social": 10, "intelecto": 95, "laboral": 20, "dinero": 250000}
    }
}

estado_jugador = {
    "salud": 0,
    "social": 0,
    "intelecto": 0,
    "laboral": 0,
    "dinero": 0,
    "indice_carta": 0  # Rastreador de en qué carta vamos
}
CARTAS = []

def cargar_cartas():
    """Carga el archivo JSON de cartas en la lista global CARTAS."""
    global CARTAS
    # Buscamos el archivo en la carpeta 'data' según vimos en tu main.py
    ruta = os.path.join(os.path.dirname(__file__), 'data', 'cartas.json')
    try:
        with open(ruta, "r", encoding="utf-8") as archivo:
            CARTAS = json.load(archivo)
    except FileNotFoundError:
        print("Error: No se encontró el archivo cartas.json en la carpeta data.")

def inicializar_clase(nombre_clase):
    """Configura las stats iniciales según la clase elegida."""
    global estado_jugador
    if nombre_clase in CLASES_DISPONIBLES:
        # Copiamos las stats del preset al estado actual del jugador
        stats_preset = CLASES_DISPONIBLES[nombre_clase]["stats"]
        for stat, valor in stats_preset.items():
            estado_jugador[stat] = valor
        estado_jugador["indice_carta"] = 0

def obtener_estado_actual():
    """Devuelve las stats y la carta actual para el frontend."""
    global estado_jugador, CARTAS
    
    # Si terminamos las cartas
    if estado_jugador["indice_carta"] >= len(CARTAS):
        return {"stats": estado_jugador, "fin": True, "mensaje": "Sobreviviste al MVP."}

    carta_actual = CARTAS[estado_jugador["indice_carta"]]
    return {
        "stats": estado_jugador,
        "carta": carta_actual,
        "fin": False
    }

def procesar_turno(eleccion):
    """
    Misión de Carlos: Procesa la elección, aplica efectos y avanza la carta.
    """
    global estado_jugador, CARTAS

    # 1. Obtener la carta actual
    indice = estado_jugador["indice_carta"]
    carta = CARTAS[indice]
    
    # 2. Identificar la opción (izq o der) y sus efectos
    nombre_opcion = "opcion_" + eleccion
    efectos = carta[nombre_opcion]["efectos"]

    # 3. Aplicar los efectos (Motor matemático)
    for stat, valor in efectos.items():
        if stat in estado_jugador:
            estado_jugador[stat] += valor
            # Limitar a 0-100 las stats que no son dinero
            if stat != "dinero":
                estado_jugador[stat] = max(0, min(100, estado_jugador[stat]))

    # 4. Avanzar a la siguiente carta
    estado_jugador["indice_carta"] += 1

    # 5. Verificar derrota
    if estado_jugador["salud"] <= 0:
        return {"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: Burnout clínico."}
    
    if estado_jugador["dinero"] < 0:
        return {"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: Bancarrota."}

    # Retornar el nuevo estado
    return obtener_estado_actual()
