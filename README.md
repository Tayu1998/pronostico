# ⚽ P+P Analyzer — Pronósticos Deportivos

> **Probabilidad + Probable** — Sistema de análisis deportivo con estadísticas históricas, H2H, forma reciente y fórmula P+P para maximizar la precisión en tus pronósticos.

[![Version](https://img.shields.io/badge/version-2.0-blue)]()
[![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)]()
[![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)]()
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)]()

---

## 📁 Estructura del proyecto

```
pronosticos-pp/
├── index.html              # Interfaz principal (app completa)
├── app.js                  # Lógica de la fórmula P+P
├── styles.css              # Estilos de la aplicación
├── data/
│   └── partidos.json       # Base de datos de equipos y partidos
├── utils/
│   └── calculos.js         # Funciones de cálculo estadístico
└── README.md               # Este archivo
```

---

## 🚀 Inicio rápido

### Opción 1 — Abrir directo en el navegador
Simplemente haz doble clic en `index.html`. No requiere servidor ni instalación.

### Opción 2 — VS Code con Live Server (recomendado)
```bash
# 1. Abre la carpeta en VS Code
code pronosticos-pp/

# 2. Instala la extensión Live Server (si no la tienes)
#    Busca "Live Server" de Ritwick Dey en Extensiones

# 3. Clic derecho en index.html → "Open with Live Server"
#    O usa el atajo:  Alt+L, Alt+O
```

### Opción 3 — Publicar en GitHub Pages
```bash
git init
git add .
git commit -m "P+P Analyzer v2.0"
git branch -M main
git remote add origin https://github.com/TU_USUARIO/pronostico.git
git push -u origin main
```
Luego en GitHub: **Settings → Pages → Source: main / root → Save**

Tu app estará en: `https://TU_USUARIO.github.io/pronostico/`

---

## ⚡ Cómo usar la aplicación

### 1. Configurar el partido
- Ingresa el **equipo local** y **visitante**
- Selecciona la **liga** y la **fecha**
- Elige el **mercado** que quieres analizar

### 2. Ajustar los sliders
**P1 — Probabilidad estadística:**
| Slider | Descripción | Peso |
|--------|-------------|------|
| Forma reciente (local) | Últimos 5 partidos en casa | 35% |
| Forma reciente (visitante) | Últimos 5 partidos fuera | 25% |
| H2H historial directo | Últimos 10 enfrentamientos | 20% |
| Posición en tabla | Diferencia de puntos | 20% |

**P2 — Factor probable:**
| Slider | Descripción | Peso |
|--------|-------------|------|
| Ventaja de local | Estadio, afición, distancia viaje | 20% |
| Lesiones equipo local | Disponibilidad titulares | 25% |
| Lesiones equipo visitante | Disponibilidad titulares | 15% |
| Motivación | Importancia real del partido | 40% |

### 3. Presionar el botón ⚡
El botón **"ANALIZAR CON FÓRMULA P+P"** ejecuta el análisis completo y genera:
- Score P+P final con nivel de confianza
- 3 mejores mercados recomendados
- Comparativa de estadísticas local vs visitante
- Historial H2H últimos 10 partidos
- Forma reciente con dots W/D/L
- Tabla de últimos 5 partidos por equipo
- Gráficos de rendimiento y goles

---

## 🧮 La fórmula P+P

```
Score P+P = (P1 × 0.5) + (P2 × 0.5)
```

### P1 — Probabilidad estadística (50%)
```
P1 = (Forma_Local × 0.35) + (Forma_Visitante × 0.25) + (H2H × 0.20) + (Tabla × 0.20)
```

### P2 — Factor probable (50%)
```
P2 = (Ventaja_Local × 0.20) + (Lesiones × 0.40) + (Motivación × 0.40)
```

### Escala de confianza

| Score P+P | Nivel | Recomendación |
|-----------|-------|---------------|
| 80–100% | 🟢 Alta | Apuesta recomendada |
| 60–79%  | 🟡 Media | Apuesta con precaución |
| 40–59%  | 🔴 Baja | Evitar o mínimo |
| 0–39%   | ⚫ Muy Baja | No apostar |

---

## 📂 Descripción de archivos

### `index.html`
Interfaz completa de la aplicación. Contiene todo el HTML, referencias a los estilos y scripts, y la lógica de renderizado dinámico de resultados.

### `app.js`
Módulo principal con:
- Configuración global de pesos (`CONFIG`)
- Funciones `calcularP1()`, `calcularP2()`, `calcularPP()`
- Función `getNivel()` para interpretar el score
- Función `generarMercados()` para recomendaciones
- Módulo `Historial` con persistencia en localStorage

### `styles.css`
Estilos completos con:
- Variables CSS (colores, fuentes, radios)
- Diseño oscuro (dark theme)
- Componentes: cards, badges, sliders, barras, tablas
- Botón animado con efecto glow
- Overlay de carga con spinner
- Responsive para móvil

### `data/partidos.json`
Base de datos con:
- Estadísticas de +12 equipos (La Liga, Premier, Serie A, Bundesliga, Ligue 1)
- Historial H2H entre equipos principales
- Cuotas de referencia por mercado
- Rivales y competiciones para generar partidos históricos

### `utils/calculos.js`
Funciones estadísticas avanzadas:
- `formaAScore()` — convierte W/D/L a score 0–100
- `rachaActual()` — detecta rachas positivas/negativas
- `analizarH2H()` — estadísticas completas de enfrentamientos
- `posicionAScore()` — normaliza diferencia de tabla
- `cuotaAProb()` — convierte cuotas a probabilidad implícita
- `detectarValor()` — detecta apuestas con valor real
- `kelly()` — criterio de Kelly para tamaño de apuesta
- `simularTendencia()` — datos para gráficos de rendimiento

---

## 🔧 Personalizar los pesos

Edita el objeto `CONFIG` en `app.js`:

```javascript
const CONFIG = {
  pesos: {
    probabilidad: 0.5,   // Peso de P1 (cambiar entre 0 y 1)
    probable:     0.5,   // Peso de P2 (debe sumar 1 con el anterior)
  },
  pesosP1: {
    formaLocal:   0.35,  // Ajustar según criterio propio
    formaVisita:  0.25,
    h2h:          0.20,
    tabla:        0.20,
  },
  umbrales: {
    alta:  80,           // % mínimo para nivel "Alta"
    media: 60,
    baja:  40,
  }
};
```

---

## 📊 Agregar equipos a la base de datos

Edita `data/partidos.json` y agrega un nuevo equipo:

```json
"liga de quito": {
  "nombre": "LDU Quito",
  "liga": "Liga Pro Ecuador",
  "pts": 55,
  "pos": 2,
  "golesF": 48,
  "golesC": 32,
  "posesion": 52,
  "tiros": 13,
  "corners": 5,
  "forma": ["W","W","D","W","L"],
  "color": "#003087"
}
```

---

## 💡 Consejos para mejores resultados

- Usa datos de al menos **10 partidos recientes** para calibrar la forma
- Las **lesiones de figuras clave** pueden mover el P2 hasta ±20 puntos
- Combina P+P ≥ 80% con **cuota ≥ 1.80** para máximo valor
- **Bankroll**: nunca más del 5% del capital por apuesta
- Revisa tu **tasa de acierto** en el historial cada mes

---

## ⚠️ Aviso

Esta herramienta es exclusivamente para **análisis estadístico personal**. Las probabilidades generadas son estimaciones basadas en los datos ingresados. Apuesta siempre de forma responsable.

---

## 📄 Licencia

MIT © 2026 — Libre para uso personal y educativo.
