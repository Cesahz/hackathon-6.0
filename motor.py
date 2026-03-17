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

def inicializar_clase(clase_nombre="Pobre pero Honrado"):
    """
    inyecta las estadisticas base segun la clase elegida y resetea el grafo.
    """
    global estado_jugador
    # si la clase no existe, usa una por defecto por seguridad
    clase = CLASES_DISPONIBLES.get(clase_nombre, CLASES_DISPONIBLES["Pobre pero Honrado"])
    
    estado_jugador = {
        "salud": clase["stats"]["salud"],
        "social": clase["stats"]["social"],
        "intelecto": clase["stats"]["intelecto"],
        "laboral": clase["stats"]["laboral"],
        "dinero": clase["stats"]["dinero"],
        "carta_actual_id": "inicio"
    }

def obtener_estado_actual():
    # extraer id con fallback seguro ante memoria vacia
    indice = estado_jugador.get("carta_actual_id", "")
    
    # validar existencia del nodo.
    if indice in CARTAS:
        # clonar nodo para evitar mutacion de la base de datos global
        carta_actual = CARTAS[indice].copy()
        carta_actual["id"] = indice
        
        return {"stats": estado_jugador, "carta": carta_actual, "fin": False}
    else:
        # resolucion segura por fin de grafo o estado vacio
        return {"stats": estado_jugador, "carta": None, "fin": True, "mensaje": "Sobreviviste al MVP."}
    
def procesar_turno(eleccion):
    pass

