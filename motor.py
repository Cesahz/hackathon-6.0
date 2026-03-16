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
    pass

def inicializar_clase(clase):
    pass

def obtener_estado_actual(): # analizar en la plantilla_de_trabajo como funciona e implementar
    #.get(clave, valor_por_defecto): busca la clave en el dicc, si no existe devuelve el valor_por_defecto en vez de explotar
    indice = estado_jugador.get("indice_carta", 0)
    # verificar si todavia quedan cartas por jugar
    if indice < len(CARTAS):
        # se guarda la carta correspondiente al estado actual, si quedan cartas
        carta_actual = CARTAS[indice]
        # devolver estado del jugador, carta actual y bandera de juego "fin" = False, el juego continua
        return ({"stats": estado_jugador, "carta": carta_actual, "fin": False})
    else:
        # en caso contrario no quedan cartas, devolver estado del jugador, carta actual y bandera de juego "fin" = True, el juego termina 
        return ({"stats": estado_jugador, "carta": None, "fin": True, "mensaje": "Sobreviviste al MVP."})


def procesar_turno(eleccion):
    pass

