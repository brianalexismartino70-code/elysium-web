#!/usr/bin/env python3
"""
ELYSIUM | ES — busca credenciales y direcciones en TODO el historial de Git.

Revisa cada versión de cada archivo de texto de todas las ramas, no solo la
copia actual. Muestra los hallazgos enmascarados: nunca imprime un secreto
completo.

Uso, desde la raíz del repositorio (con el historial completo):
    git fetch --unshallow        # solo si el clon es parcial
    python3 tools/escanear_secretos.py

Sale con código 1 si encuentra algo que parezca una credencial.
"""
import collections
import re
import subprocess
import sys

PATRONES = {
    "webhook de Discord": r"discord(?:app)?\.com/api/webhooks/\d+/[\w-]+",
    "token de bot de Discord": r"\b[MN][A-Za-z\d]{23,25}\.[\w-]{6}\.[\w-]{27,}\b",
    "token de GitHub": r"\b(?:ghp|gho|ghu|ghs|ghr)_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,}",
    "clave de AWS": r"\bAKIA[0-9A-Z]{16}\b",
    "clave de Google": r"\bAIza[0-9A-Za-z_-]{35}\b",
    "clave privada": r"-----BEGIN [A-Z ]*PRIVATE KEY-----",
    "licencia de Cfx.re": r"\bcfxk_[A-Za-z0-9_]{10,}",
    "token de Slack": r"\bxox[baprs]-[A-Za-z0-9-]{10,}",
    "clave secreta (sk_)": r"\bsk[-_](?:live|test|proj)?[-_]?[A-Za-z0-9]{20,}",
    "conexión a MySQL": r"mysql://[^\s\"']+|mysql_connection_string",
    "secreto de Tebex": r"(?i)tebex[^\n]{0,40}(?:secret|private)[^\n]{0,40}",
    "asignación de secreto": r"(?i)\b(?:password|passwd|api[_-]?key|secret|token|contraseña)\b\s*[:=]\s*[\"'][^\"']{6,}[\"']",
    "dirección IPv4": r"\b(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)(?::\d{2,5})?\b",
}
# Lo que se informa pero no cuenta como credencial
SOLO_AVISO = {"dirección IPv4"}
# Direcciones locales, privadas y de GitHub Pages
IP_IGNORADAS = re.compile(r"^(127\.|0\.|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.|185\.199\.1(0[89]|1[01])\.)")
BINARIOS = re.compile(r"\.(png|jpe?g|webp|avif|gif|ico|mp3|mp4|webm|woff2?|ttf|otf|pdf|zip)$", re.I)


def git(*args, entrada=None):
    return subprocess.run(["git", *args], input=entrada, capture_output=True, text=True, check=True).stdout


def enmascarar(tipo, valor):
    if tipo == "dirección IPv4":
        ip, _, puerto = valor.partition(":")
        a = ip.split(".")
        return f"{a[0]}.{a[1]}.x.x" + (f":{puerto}" if puerto else "")
    if tipo in ("asignación de secreto", "secreto de Tebex", "conexión a MySQL"):
        return valor[:24] + "…"
    return valor[:12] + "…(oculto)"


def main():
    if git("rev-parse", "--is-shallow-repository").strip() == "true":
        print("Aviso: el clon es parcial. Corré `git fetch --unshallow` para revisar todo el historial.\n")

    rutas = {}
    for linea in git("rev-list", "--all", "--objects").splitlines():
        sha, _, ruta = linea.partition(" ")
        if ruta:
            rutas.setdefault(sha, ruta)
    info = git("cat-file", "--batch-check", entrada="\n".join(rutas)).splitlines()
    blobs = [l.split()[0] for l in info
             if len(l.split()) >= 3 and l.split()[1] == "blob" and int(l.split()[2]) < 5_000_000
             and not BINARIOS.search(rutas[l.split()[0]])]

    hallazgos = collections.defaultdict(set)
    lector = subprocess.Popen(["git", "cat-file", "--batch"], stdin=subprocess.PIPE, stdout=subprocess.PIPE)
    for sha in blobs:
        lector.stdin.write((sha + "\n").encode())
        lector.stdin.flush()
        tam = int(lector.stdout.readline().split()[2])
        texto = lector.stdout.read(tam).decode("utf-8", "replace")
        lector.stdout.read(1)
        for tipo, patron in PATRONES.items():
            for m in re.finditer(patron, texto):
                valor = m.group(0)
                if tipo == "dirección IPv4":
                    ip = valor.split(":")[0]
                    if IP_IGNORADAS.match(ip) or all(int(x) < 20 for x in ip.split(".")):
                        continue
                hallazgos[(tipo, valor)].add(rutas[sha])
    lector.stdin.close()

    commits = git("rev-list", "--all", "--count").strip()
    print(f"Revisados {len(blobs)} contenidos de texto en {commits} commits.\n")
    credenciales = 0
    for (tipo, valor), archivos in sorted(hallazgos.items()):
        marca = "AVISO " if tipo in SOLO_AVISO else "ALERTA"
        credenciales += tipo not in SOLO_AVISO
        print(f"{marca} {tipo}: {enmascarar(tipo, valor)}  →  {', '.join(sorted(archivos))}")
    if not hallazgos:
        print("Sin hallazgos.")
    sys.exit(1 if credenciales else 0)


if __name__ == "__main__":
    main()
