// ============================================================
//  P+P ANALYZER — app.js
//  Lógica principal de la fórmula Probabilidad + Probable
// ============================================================

// ── CONFIGURACIÓN GLOBAL ──────────────────────────────────
const CONFIG = {
  pesos: {
    probabilidad: 0.5,   // Peso de P1 en el score final
    probable:     0.5,   // Peso de P2 en el score final
  },
  pesosP1: {
    formaLocal:    0.35,
    formaVisita:   0.25,
    h2h:           0.20,
    tabla:         0.20,
  },
  pesosP2: {
    ventajaLocal:  0.20,
    lesiones:      0.40,
    motivacion:    0.40,
  },
  umbrales: {
    alta:   80,
    media:  60,
    baja:   40,
  }
};

// ── FÓRMULA P+P ───────────────────────────────────────────

/**
 * Calcula P1 (Probabilidad estadística)
 * @param {number} formaLocal    0–100
 * @param {number} formaVisita   0–100
 * @param {number} h2h           0–100
 * @param {number} tabla         0–100
 * @returns {number} P1 redondeado
 */
function calcularP1(formaLocal, formaVisita, h2h, tabla) {
  const p = CONFIG.pesosP1;
  return Math.round(
    formaLocal  * p.formaLocal  +
    formaVisita * p.formaVisita +
    h2h         * p.h2h         +
    tabla       * p.tabla
  );
}

/**
 * Calcula P2 (Factor probable / cualitativo)
 * @param {number} ventajaLocal  0–100
 * @param {number} lesiones      0–100 (100 = sin lesiones)
 * @param {number} motivacion    0–100
 * @returns {number} P2 redondeado
 */
function calcularP2(ventajaLocal, lesiones, motivacion) {
  const p = CONFIG.pesosP2;
  return Math.round(
    ventajaLocal * p.ventajaLocal +
    lesiones     * p.lesiones     +
    motivacion   * p.motivacion
  );
}

/**
 * Calcula el Score P+P final
 * @param {number} P1
 * @param {number} P2
 * @returns {number} Score final 0–100
 */
function calcularPP(P1, P2) {
  return Math.round(
    P1 * CONFIG.pesos.probabilidad +
    P2 * CONFIG.pesos.probable
  );
}

/**
 * Obtiene nivel de confianza y recomendación según score
 * @param {number} pp
 * @returns {{ nivel: string, color: string, recomendacion: string, badge: string }}
 */
function getNivel(pp) {
  if (pp >= CONFIG.umbrales.alta) {
    return {
      nivel: 'Alta',
      color: '#23d18b',
      recomendacion: 'PRONÓSTICO RECOMENDADO ✓',
      badge: 'bg2'
    };
  } else if (pp >= CONFIG.umbrales.media) {
    return {
      nivel: 'Media',
      color: '#fbbf24',
      recomendacion: 'APUESTA CON PRECAUCIÓN',
      badge: 'ba2'
    };
  } else if (pp >= CONFIG.umbrales.baja) {
    return {
      nivel: 'Baja',
      color: '#f87171',
      recomendacion: 'CONFIANZA BAJA — EVITAR',
      badge: 'br2'
    };
  } else {
    return {
      nivel: 'Muy Baja',
      color: '#3a4460',
      recomendacion: 'MUY BAJA — NO APOSTAR',
      badge: 'bgr2'
    };
  }
}

// ── MERCADOS ──────────────────────────────────────────────

/**
 * Genera lista de mercados recomendados ordenados por confianza
 * @param {number} PP
 * @param {number} P1
 * @param {number} P2
 * @param {string} local
 * @param {string} visitante
 * @returns {Array}
 */
function generarMercados(PP, P1, P2, local, visitante) {
  const mercados = [
    { nombre: `1X2 — ${local} gana`,       conf: Math.min(99, Math.round(PP + 2)),                    cuota: '1.75' },
    { nombre: 'Ambos anotan — Sí',          conf: Math.min(99, Math.round(P2 * 0.88 + 4)),             cuota: '1.90' },
    { nombre: 'Más de 2.5 goles',           conf: Math.min(99, Math.round((P1 + P2) / 2 * 0.88 + 5)), cuota: '1.80' },
    { nombre: `${local} +1.5 goles`,        conf: Math.min(99, Math.round(PP * 0.95 + 4)),             cuota: '1.60' },
    { nombre: '1X2 — Empate',               conf: Math.min(99, Math.round((100 - PP) * 0.55 + 12)),    cuota: '3.40' },
    { nombre: `${visitante} gana`,          conf: Math.min(99, Math.round((100 - PP) * 0.65 + 6)),     cuota: '4.20' },
  ];
  return mercados.sort((a, b) => b.conf - a.conf);
}

// ── HISTORIAL ─────────────────────────────────────────────
const Historial = {
  datos: [],

  agregar(entry) {
    this.datos.unshift(entry);
    if (this.datos.length > 50) this.datos.pop();
    this.guardarLocal();
  },

  limpiar() {
    this.datos = [];
    this.guardarLocal();
  },

  guardarLocal() {
    try {
      localStorage.setItem('pp_historial', JSON.stringify(this.datos));
    } catch(e) {}
  },

  cargarLocal() {
    try {
      const saved = localStorage.getItem('pp_historial');
      if (saved) this.datos = JSON.parse(saved);
    } catch(e) {}
  }
};

// ── EXPORTAR ─────────────────────────────────────────────
// Hace disponibles las funciones globalmente para index.html
window.PP_App = {
  calcularP1,
  calcularP2,
  calcularPP,
  getNivel,
  generarMercados,
  Historial,
  CONFIG
};
