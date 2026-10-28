"""
ELYSIUM | ES — escena 3D de la portada, construida por código en Blender.

Se renderiza con Cycles (CPU) usando el módulo oficial de Blender para
Python (`pip install bpy`). No usa modelos, texturas ni recursos de
terceros: geometría y materiales se generan acá. No es IA.

Uso:
    python escena_hero.py <carpeta_salida> <ancho> <alto> <muestras>
Genera fondo.png (ciudad y cielo) y frente.png (terraza con transparencia).
"""
import math
import random
import sys

import bpy
from mathutils import Vector

SALIDA, ANCHO, ALTO, MUESTRAS = sys.argv[-4], int(sys.argv[-3]), int(sys.argv[-2]), int(sys.argv[-1])
random.seed(7)
bpy.ops.wm.read_factory_settings(use_empty=True)
escena = bpy.context.scene


# ── Materiales ──────────────────────────────────────────────
def nodos(mat):
    try:
        mat.use_nodes = True
    except Exception:
        pass
    nt = mat.node_tree
    nt.nodes.clear()
    return nt.nodes, nt.links


def mate(nodos_, links, salida_shader, niebla=(0.66, 0.43, 0.24), lejos=(260, 2700), maximo=0.9):
    """Bruma por distancia a la cámara: mezcla el sombreado con el color del aire."""
    cam = nodos_.new("ShaderNodeCameraData")
    rango = nodos_.new("ShaderNodeMapRange")
    rango.inputs["From Min"].default_value, rango.inputs["From Max"].default_value = lejos
    rango.inputs["To Min"].default_value, rango.inputs["To Max"].default_value = 0.0, maximo
    links.new(cam.outputs["View Distance"], rango.inputs["Value"])
    aire = nodos_.new("ShaderNodeEmission")
    aire.inputs["Color"].default_value = (*niebla, 1)
    aire.inputs["Strength"].default_value = 1.0
    mezcla = nodos_.new("ShaderNodeMixShader")
    links.new(rango.outputs["Result"], mezcla.inputs[0])
    links.new(salida_shader, mezcla.inputs[1])
    links.new(aire.outputs[0], mezcla.inputs[2])
    out = nodos_.new("ShaderNodeOutputMaterial")
    links.new(mezcla.outputs[0], out.inputs["Surface"])


def principled(nodos_, color, rugosidad, metal=0.0):
    p = nodos_.new("ShaderNodeBsdfPrincipled")
    p.inputs["Base Color"].default_value = (*color, 1)
    p.inputs["Roughness"].default_value = rugosidad
    p.inputs["Metallic"].default_value = metal
    return p


def matematica(nodos_, links, op, a, b=None, valor=None):
    m = nodos_.new("ShaderNodeMath")
    m.operation = op
    for i, x in enumerate((a, b)):
        if x is None:
            if valor is not None and i == 1:
                m.inputs[1].default_value = valor
            continue
        if isinstance(x, (int, float)):
            m.inputs[i].default_value = x
        else:
            links.new(x, m.inputs[i])
    return m.outputs[0]


def material_edificio():
    mat = bpy.data.materials.new("edificio")
    n, l = nodos(mat)
    fachada = principled(n, (0.028, 0.03, 0.034), 0.45, 0.35)
    geo = n.new("ShaderNodeNewGeometry")
    xyz = n.new("ShaderNodeSeparateXYZ")
    l.new(geo.outputs["Position"], xyz.inputs[0])
    h = matematica(n, l, "ADD", xyz.outputs[0], xyz.outputs[1])
    cx = matematica(n, l, "DIVIDE", h, valor=3.1)
    cz = matematica(n, l, "DIVIDE", xyz.outputs[2], valor=3.7)
    fx, fz = matematica(n, l, "FRACT", cx), matematica(n, l, "FRACT", cz)
    gx, gz = matematica(n, l, "FLOOR", cx), matematica(n, l, "FLOOR", cz)
    vx = matematica(n, l, "MULTIPLY", matematica(n, l, "GREATER_THAN", fx, valor=0.24), matematica(n, l, "LESS_THAN", fx, valor=0.76))
    vz = matematica(n, l, "MULTIPLY", matematica(n, l, "GREATER_THAN", fz, valor=0.30), matematica(n, l, "LESS_THAN", fz, valor=0.78))
    ventana = matematica(n, l, "MULTIPLY", vx, vz)
    info = n.new("ShaderNodeObjectInfo")
    celda = n.new("ShaderNodeCombineXYZ")
    l.new(gx, celda.inputs[0]); l.new(gz, celda.inputs[1])
    l.new(matematica(n, l, "MULTIPLY", info.outputs["Random"], valor=97.0), celda.inputs[2])
    azar = n.new("ShaderNodeTexWhiteNoise")
    azar.noise_dimensions = "3D"
    l.new(celda.outputs[0], azar.inputs["Vector"])
    umbral = matematica(n, l, "ADD", matematica(n, l, "MULTIPLY", info.outputs["Random"], valor=0.35), valor=0.52)
    encendida = matematica(n, l, "GREATER_THAN", azar.outputs["Value"], umbral)
    fuerza = matematica(n, l, "MULTIPLY", matematica(n, l, "MULTIPLY", ventana, encendida), valor=7.0)
    tono = n.new("ShaderNodeValToRGB")
    tono.color_ramp.elements[0].position, tono.color_ramp.elements[0].color = 0.0, (1.0, 0.62, 0.30, 1)
    tono.color_ramp.elements[1].position, tono.color_ramp.elements[1].color = 1.0, (1.0, 0.80, 0.52, 1)
    frio = tono.color_ramp.elements.new(0.93)
    frio.color = (0.62, 0.78, 1.0, 1)
    l.new(azar.outputs["Color"], tono.inputs["Fac"])
    luz = n.new("ShaderNodeEmission")
    l.new(tono.outputs["Color"], luz.inputs["Color"])
    l.new(fuerza, luz.inputs["Strength"])
    suma = n.new("ShaderNodeAddShader")
    l.new(fachada.outputs[0], suma.inputs[0]); l.new(luz.outputs[0], suma.inputs[1])
    mate(n, l, suma.outputs[0])
    return mat


def material_simple(nombre, color, rug, emision=None, fuerza=0.0, niebla=True, metal=0.0):
    mat = bpy.data.materials.new(nombre)
    n, l = nodos(mat)
    if emision:
        s = n.new("ShaderNodeEmission")
        s.inputs["Color"].default_value = (*emision, 1)
        s.inputs["Strength"].default_value = fuerza
    else:
        s = principled(n, color, rug, metal)
    if niebla:
        mate(n, l, s.outputs[0])
    else:
        out = n.new("ShaderNodeOutputMaterial")
        l.new(s.outputs[0], out.inputs["Surface"])
    return mat


# ── Geometría ───────────────────────────────────────────────
coleccion = escena.collection
cubo = bpy.data.meshes.new("cubo")
cubo.from_pydata([(-.5, -.5, 0), (.5, -.5, 0), (.5, .5, 0), (-.5, .5, 0), (-.5, -.5, 1), (.5, -.5, 1), (.5, .5, 1), (-.5, .5, 1)], [],
                 [(0, 1, 2, 3), (4, 7, 6, 5), (0, 4, 5, 1), (1, 5, 6, 2), (2, 6, 7, 3), (3, 7, 4, 0)])


cubo.materials.append(None)
edificio = material_edificio()
fondo, frente = [], []
# Ciudad: más alta hacia el centro, como un distrito céntrico
BAJO = -55.0   # la ciudad queda por debajo de la terraza
for i in range(720):
    y = random.uniform(240, 2700)
    x = random.uniform(-1.05, 1.05) * (180 + y * 0.9)
    centro = math.exp(-((x - 120) / (260 + y * 0.25)) ** 2) * math.exp(-((y - 1150) / 900) ** 2)
    alto = random.lognormvariate(3.0, 0.45) * (0.6 + 2.6 * centro)
    ancho = random.uniform(14, 42)
    o = bpy.data.objects.new(f"ed{i}", cubo)
    o.location, o.scale = (x, y, BAJO), (ancho, random.uniform(14, 40), alto)
    coleccion.objects.link(o)
    o.material_slots[0].link = "OBJECT"
    o.material_slots[0].material = edificio
    fondo.append(o)
    if random.random() < 0.12:   # antena o remate
        a = bpy.data.objects.new(f"an{i}", cubo)
        a.location, a.scale = (x, y, BAJO + alto), (ancho * 0.25, 4, alto * random.uniform(0.15, 0.4))
        coleccion.objects.link(a)
        a.material_slots[0].link = "OBJECT"
        a.material_slots[0].material = edificio
        fondo.append(a)
suelo = bpy.data.objects.new("suelo", cubo)
suelo.location, suelo.scale = (0, 1200, BAJO - 1), (6000, 4000, 1)
coleccion.objects.link(suelo)
suelo.material_slots[0].link = "OBJECT"
suelo.material_slots[0].material = material_simple("suelo", (0.02, 0.02, 0.02), 0.3, metal=0.2)
fondo.append(suelo)
# Sol: disco luminoso lejano (el resplandor se agrega después del render)
bpy.ops.mesh.primitive_uv_sphere_add(radius=52, location=(760, 3300, 150), segments=32, ring_count=16)
sol = bpy.context.active_object
sol.data.materials.append(material_simple("sol", None, 0, emision=(1.0, 0.72, 0.42), fuerza=60, niebla=False))
fondo.append(sol)

# Terraza en primer plano
piedra = material_simple("piedra", (0.2, 0.175, 0.15), 0.38, niebla=False)


def bloque(nombre, x, y, z, sx, sy, sz):
    o = bpy.data.objects.new(nombre, cubo)
    o.location, o.scale = (x, y, z), (sx, sy, sz)
    coleccion.objects.link(o)
    o.material_slots[0].link = "OBJECT"
    o.material_slots[0].material = piedra
    frente.append(o)
    return o


def columna(x, y, alto, radio=0.85):
    bloque("basa", x, y, 10, radio * 2.6, radio * 2.6, 0.6)
    bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=radio, depth=alto, location=(x, y, 10.6 + alto / 2))
    c = bpy.context.active_object
    c.data.materials.append(piedra)
    bpy.ops.object.shade_smooth()
    frente.append(c)
    bloque("capitel", x, y, 10.6 + alto, radio * 2.8, radio * 2.8, 0.75)


bloque("piso", 0, -14, 9, 90, 46, 1)
for x in (-14.5, -10.2, -5.9):
    columna(x, 3.0, 10.5)
bloque("entablamento", -10.2, 3.0, 21.85, 13.5, 2.8, 1.5)
bloque("cornisa", -10.2, 3.0, 23.35, 14.5, 3.2, 0.6)
# Columna quebrada y fragmentos a la derecha
bpy.ops.mesh.primitive_cylinder_add(vertices=24, radius=0.9, depth=5.2, location=(10.5, 5.0, 12.9))
q = bpy.context.active_object
q.data.materials.append(piedra)
bpy.ops.object.shade_smooth()
frente.append(q)
bloque("basa2", 10.5, 5.0, 10, 2.4, 2.4, 0.6)
fr = bloque("fragmento", 7.5, 6.0, 10, 2.2, 1.4, 0.8)
fr.rotation_euler = (0, 0, 0.5)
# Balaustrada sobre el borde de la terraza
bloque("baranda", 4.5, 9.0, 11.05, 30, 0.5, 0.18)
bloque("zocalo", 4.5, 9.0, 10, 30, 0.6, 0.18)
for k in range(46):
    bpy.ops.mesh.primitive_cylinder_add(vertices=12, radius=0.14, depth=0.88, location=(-10.0 + k * 0.64, 9.0, 10.62))
    b = bpy.context.active_object
    b.data.materials.append(piedra)
    frente.append(b)

# ── Luz, cielo y cámara ─────────────────────────────────────
mundo = bpy.data.worlds.new("cielo")
escena.world = mundo
n, l = nodos(mundo)
coord = n.new("ShaderNodeTexCoord")
sep = n.new("ShaderNodeSeparateXYZ")
l.new(coord.outputs["Generated"], sep.inputs[0])
rampa = n.new("ShaderNodeValToRGB")
els = rampa.color_ramp.elements
els[0].position, els[0].color = 0.0, (1.0, 0.52, 0.22, 1)
els[1].position, els[1].color = 1.0, (0.008, 0.012, 0.018, 1)
for pos, col in ((0.07, (0.78, 0.38, 0.16, 1)), (0.2, (0.2, 0.14, 0.11, 1)), (0.42, (0.03, 0.045, 0.055, 1))):
    e = els.new(pos)
    e.color = col
rango = n.new("ShaderNodeMapRange")
rango.inputs["From Min"].default_value, rango.inputs["From Max"].default_value = -0.02, 0.7
l.new(sep.outputs[2], rango.inputs["Value"])
l.new(rango.outputs["Result"], rampa.inputs["Fac"])
cielo = n.new("ShaderNodeBackground")
cielo.inputs["Strength"].default_value = 1.0
l.new(rampa.outputs["Color"], cielo.inputs["Color"])
salida = n.new("ShaderNodeOutputWorld")
l.new(cielo.outputs[0], salida.inputs["Surface"])

luz = bpy.data.objects.new("sol_luz", bpy.data.lights.new("sol_luz", type="SUN"))
luz.data.energy, luz.data.color, luz.data.angle = 2.4, (1.0, 0.66, 0.4), math.radians(2.5)
luz.rotation_euler = (Vector((-0.22, -1, -0.05))).to_track_quat("-Z", "Y").to_euler()
coleccion.objects.link(luz)
relleno = bpy.data.objects.new("relleno", bpy.data.lights.new("relleno", type="SUN"))
relleno.data.energy, relleno.data.color = 0.25, (0.45, 0.6, 0.8)
relleno.rotation_euler = (Vector((0.4, 1, -0.6))).to_track_quat("-Z", "Y").to_euler()
coleccion.objects.link(relleno)

camara = bpy.data.objects.new("camara", bpy.data.cameras.new("camara"))
camara.data.lens = 28
camara.data.clip_end = 12000   # sin esto se corta todo lo que está a más de 1 km, incluido el sol
camara.location = (1.5, -12.0, 13.2)
camara.rotation_euler = (Vector((40, 700, -14.0)) - camara.location).to_track_quat("-Z", "Y").to_euler()
coleccion.objects.link(camara)
escena.camera = camara

r = escena.render
r.engine = "CYCLES"
escena.cycles.device = "CPU"
escena.cycles.samples = MUESTRAS
try:
    escena.cycles.use_denoising = True
    escena.cycles.denoiser = "OPENIMAGEDENOISE"
except Exception:
    pass
r.resolution_x, r.resolution_y, r.resolution_percentage = ANCHO, ALTO, 100
r.image_settings.file_format = "PNG"
r.image_settings.color_depth = "16"
try:
    escena.view_settings.view_transform = "AgX"
except Exception:
    pass


def render(nombre, visibles, transparente):
    for o in fondo + frente:
        o.hide_render = o not in visibles
    sol.hide_render = sol not in visibles
    r.film_transparent = transparente
    r.filepath = f"{SALIDA}/{nombre}.png"
    bpy.ops.render.render(write_still=True)


render("fondo", set(fondo), False)
render("frente", set(frente), True)
print("listo")
