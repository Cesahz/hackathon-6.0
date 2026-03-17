import json
import os

#variables globales de memoria
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
#en este van las stats
estado_jugador = {}
CARTAS = {}


def cargar_cartas():
    
    #para modificar la variable global
    global CARTAS
    
    #para crear la ruta (dirección) completa del archivo cartas.json
    ruta= os.path.join(os.path.dirname(__file__), "data", "cartas.json")
    
    #para abrir el archivo cartas.json para leerlo y guardarlo en la variable f
    with open(ruta, 'r', encoding='utf-8') as f:
        CARTAS = json.load(f)

    #para devolver la lista de las cartas que se cargaron desde el archivo cartas.json
    return CARTAS

def inicializar_clase(clase):
    pass

def obtener_estado_actual(): # analizar en la plantilla_de_trabajo como funciona e implementar
    pass

def procesar_turno(eleccion):
    global estado_jugador, CARTAS

    #  obtener la carta actual usando el ID en lugar del índice numérico
    id_actual = estado_jugador["carta_actual_id"]
    carta = CARTAS[id_actual]
    
    #  identificar la opción (izq o der) y sus efectos
    nombre_opcion = "opcion_" + eleccion
    efectos = carta[nombre_opcion]["efectos"]

    # aplicar los efectos (tu motor matemático intacto)
    for stat, valor in efectos.items():
        estado_jugador[stat] += valor
        # limitar a 0-100 las stats que no son dinero
        if stat != "dinero":
            estado_jugador[stat] = max(0, min(100, estado_jugador[stat]))

    # verificar derrota  ANTES de avanzar
    if estado_jugador["salud"] <= 0:
        return {"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: colapso por burnout clínico.", "stat_fatal": "salud", "efectos": efectos}
    if estado_jugador["dinero"] < 0:
        return {"stats": estado_jugador, "fin": True, "mensaje": "GAME OVER: bancarrota. el sistema te devoró.", "stat_fatal": "dinero", "efectos": efectos}

    # avanzar a la siguiente carta usando el grafo
    siguiente_id = carta[nombre_opcion].get("siguiente_id")
    estado_jugador["carta_actual_id"] = siguiente_id
    
    # retornar el nuevo estado (con una copia segura de la carta)
    if siguiente_id in CARTAS:
        nueva_carta = CARTAS[siguiente_id].copy()
        nueva_carta["id"] = siguiente_id
        return {"stats": estado_jugador, "carta": nueva_carta, "fin": False, "efectos": efectos}
    else:
        return {"stats": estado_jugador, "fin": True, "mensaje": "Lograste sobrevivir esta etapa.", "efectos": efectos}