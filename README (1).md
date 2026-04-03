# ⚽ Analizador de Pronósticos Deportivos — Fórmula P+P

> **Probabilidad + Probable** — Un sistema de análisis para maximizar la precisión en tus pronósticos deportivos.

---

## ¿Qué es la fórmula P+P?

La fórmula **P+P (Probabilidad + Probable)** combina dos dimensiones de análisis para determinar la confianza en un pronóstico deportivo:

```
CONFIANZA_TOTAL = (Probabilidad_Estadística × 0.5) + (Índice_Probable × 0.5)
```

| Componente | Descripción | Peso |
|---|---|---|
| **Probabilidad (P1)** | Basada en estadísticas históricas, forma reciente, H2H | 50% |
| **Probable (P2)** | Factores cualitativos: lesiones, motivación, condiciones | 50% |
| **P+P Final** | Score combinado de confianza (0–100%) | 100% |

### Escala de confianza P+P

| Score P+P | Nivel | Recomendación |
|---|---|---|
| 80–100% | ⭐⭐⭐ Alta | Apuesta recomendada |
| 60–79%  | ⭐⭐ Media | Apuesta con precaución |
| 40–59%  | ⭐ Baja | Evitar o reducir monto |
| 0–39%   | ❌ Muy baja | No apostar |

---

## Instalación

### Prerrequisitos

- [Node.js](https://nodejs.org/) v18 o superior
- [Visual Studio Code](https://code.visualstudio.com/)

### Pasos

```bash
# 1. Clonar el repositorio
git clone https://github.com/tu-usuario/pronosticos-pp.git
cd pronosticos-pp

# 2. Instalar dependencias
npm install

# 3. Iniciar la aplicación
npm start
```

Abre `http://localhost:3000` en tu navegador.

---

## Estructura del proyecto

```
pronosticos-pp/
├── index.html          # Interfaz principal
├── app.js              # Lógica de la fórmula P+P
├── styles.css          # Estilos
├── data/
│   └── partidos.json   # Base de datos de partidos
├── utils/
│   └── calculos.js     # Funciones de cálculo estadístico
└── README.md           # Este archivo
```

---

## Uso rápido

1. **Agrega un partido**: ingresa equipos, liga y fecha
2. **Calcula P1 (Probabilidad)**: ingresa estadísticas de forma, H2H y posición en tabla
3. **Calcula P2 (Probable)**: evalúa lesiones clave, motivación y condiciones del campo
4. **Obtén el score P+P**: la app calcula automáticamente la confianza total
5. **Decide**: el sistema te recomienda si apostar o no basado en el umbral configurado

---

## Fórmula detallada

### P1 — Probabilidad Estadística

```
P1 = (Forma_Local × 0.35) + (Forma_Visitante × 0.25) + (H2H × 0.20) + (Posición_Tabla × 0.20)
```

- **Forma reciente**: últimos 5 partidos (W=3pts, D=1pt, L=0pts), normalizado 0–100
- **H2H**: historial directo últimos 10 enfrentamientos
- **Posición en tabla**: diferencia de puntos normalizada

### P2 — Factor Probable

```
P2 = 100 - (Penalización_Lesiones) - (Penalización_Motivación) + (Bonus_Local)
```

- **Lesiones**: -10 por jugador clave ausente (máx -30)
- **Motivación**: -15 si el equipo ya está clasificado/descendido
- **Ventaja local**: +5 si juega en casa

### Score Final P+P

```
PP_Score = (P1 × 0.5) + (P2 × 0.5)
```

---

## Configuración avanzada

Edita `app.js` para personalizar los pesos:

```javascript
const CONFIG = {
  pesos: {
    probabilidad: 0.5,   // Peso de P1
    probable: 0.5,        // Peso de P2
  },
  umbrales: {
    alta: 80,             // % mínimo para recomendación alta
    media: 60,            // % mínimo para recomendación media
    baja: 40,             // % mínimo para recomendación baja
  }
};
```

---

## Licencia

MIT © 2026 — Uso libre para análisis personal.

---

> **Aviso**: Esta herramienta es solo para análisis estadístico. Apuesta siempre de forma responsable.
