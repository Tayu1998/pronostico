// ============================================================
//  P+P ANALYZER — utils/calculos.js
//  Funciones de cálculo estadístico avanzado
// ============================================================

const Calculos = {

  // ── FORMA ───────────────────────────────────────────────

  /**
   * Convierte array de resultados a score de forma (0–100)
   * W=3pts, D=1pt, L=0pts → normalizado sobre max posible
   * @param {string[]} resultados  ej: ['W','W','D','L','W']
   * @returns {number} 0–100
   */
  formaAScore(resultados) {
    const puntos = { W: 3, D: 1, L: 0 };
    const total = resultados.reduce((sum, r) => sum + (puntos[r] || 0), 0);
    const maxPosible = resultados.length * 3;
    return Math.round((total / maxPosible) * 100);
  },

  /**
   * Calcula racha actual (ej: 3 victorias seguidas → +3)
   * @param {string[]} resultados
   * @returns {number} positivo=victorias, negativo=derrotas
   */
  rachaActual(resultados) {
    if (!resultados.length) return 0;
    const ultimo = resultados[resultados.length - 1];
    let racha = 0;
    for (let i = resultados.length - 1; i >= 0; i--) {
      if (resultados[i] === ultimo) racha++;
      else break;
    }
    return ultimo === 'W' ? racha : ultimo === 'L' ? -racha : 0;
  },

  // ── H2H ─────────────────────────────────────────────────

  /**
   * Analiza historial H2H y retorna estadísticas
   * @param {Array} partidos  array de {golesL, golesV}
   * @returns {{ victorias: number, empates: number, derrotas: number, golesF: number, golesC: number, score: number }}
   */
  analizarH2H(partidos) {
    let victorias = 0, empates = 0, derrotas = 0;
    let golesF = 0, golesC = 0;

    partidos.forEach(p => {
      golesF += p.golesL || p.lg || 0;
      golesC += p.golesV || p.vg || 0;
      const gl = p.golesL || p.lg || 0;
      const gv = p.golesV || p.vg || 0;
      if (gl > gv) victorias++;
      else if (gl === gv) empates++;
      else derrotas++;
    });

    const total = partidos.length || 1;
    const score = Math.round(((victorias * 3 + empates) / (total * 3)) * 100);

    return { victorias, empates, derrotas, golesF, golesC, score, total };
  },

  // ── POSICIÓN EN TABLA ────────────────────────────────────

  /**
   * Convierte diferencia de posición a score (0–100)
   * @param {number} posLocal     posición del local (1=primero)
   * @param {number} posVisita    posición del visitante
   * @param {number} totalEquipos total de equipos en liga (def: 20)
   * @returns {number} 0–100 (100 = local muy por encima)
   */
  posicionAScore(posLocal, posVisita, totalEquipos = 20) {
    const diff = posVisita - posLocal; // positivo si local está arriba
    const normalizado = (diff + totalEquipos) / (totalEquipos * 2);
    return Math.round(normalizado * 100);
  },

  // ── GOLES ────────────────────────────────────────────────

  /**
   * Promedio de goles por partido
   * @param {number} totalGoles
   * @param {number} partidos
   * @returns {string} con 2 decimales
   */
  promGoles(totalGoles, partidos) {
    if (!partidos) return '0.00';
    return (totalGoles / partidos).toFixed(2);
  },

  /**
   * Probabilidad de que ambos equipos marquen
   * basada en % de partidos donde marcaron en temporada
   * @param {number} ppLocal    % partidos donde local marcó
   * @param {number} ppVisita   % partidos donde visitante marcó
   * @returns {number} probabilidad combinada 0–100
   */
  probAmbosMarcen(ppLocal, ppVisita) {
    return Math.round((ppLocal / 100) * (ppVisita / 100) * 100);
  },

  // ── CONFIANZA DE CUOTA ───────────────────────────────────

  /**
   * Convierte cuota decimal a probabilidad implícita
   * @param {number} cuota  ej: 1.75
   * @returns {number} 0–100
   */
  cuotaAProb(cuota) {
    if (cuota <= 0) return 0;
    return Math.round((1 / cuota) * 100);
  },

  /**
   * Detecta si existe valor (P+P supera la prob. implícita)
   * @param {number} ppScore   score P+P 0–100
   * @param {number} cuota     cuota decimal
   * @returns {{ hayValor: boolean, margen: number }}
   */
  detectarValor(ppScore, cuota) {
    const probImplicita = this.cuotaAProb(cuota);
    const margen = ppScore - probImplicita;
    return { hayValor: margen > 5, margen };
  },

  // ── KELLY ────────────────────────────────────────────────

  /**
   * Criterio de Kelly para tamaño de apuesta óptimo
   * @param {number} prob    probabilidad estimada 0–1
   * @param {number} cuota   cuota decimal
   * @returns {number} % del bankroll recomendado (0–25%)
   */
  kelly(prob, cuota) {
    const b = cuota - 1;
    const q = 1 - prob;
    const k = (b * prob - q) / b;
    return Math.max(0, Math.min(25, Math.round(k * 100)));
  },

  // ── TENDENCIAS ───────────────────────────────────────────

  /**
   * Simula datos de rendimiento de últimas N jornadas
   * @param {number} scoreBase  score P+P actual
   * @param {number} jornadas   número de jornadas a simular
   * @returns {number[]}
   */
  simularTendencia(scoreBase, jornadas = 8) {
    const datos = [];
    for (let i = 0; i < jornadas - 1; i++) {
      const variacion = (Math.random() - 0.5) * 30;
      datos.push(Math.max(10, Math.min(99, Math.round(scoreBase + variacion))));
    }
    datos.push(scoreBase); // último dato = score actual real
    return datos;
  },

  /**
   * Genera datos de goles para últimos N partidos
   * @param {string[]} forma  array de resultados W/D/L
   * @returns {{ marcados: number[], recibidos: number[] }}
   */
  simularGoles(forma) {
    const marcados  = forma.map(f => f === 'W' ? Math.floor(Math.random() * 2) + 1 : f === 'D' ? 1 : 0);
    const recibidos = forma.map(f => f === 'L' ? Math.floor(Math.random() * 2) + 1 : f === 'D' ? 1 : 0);
    return { marcados, recibidos };
  },

  // ── RESUMEN PARTIDO ──────────────────────────────────────

  /**
   * Genera resumen estadístico completo de un partido
   * @param {Object} teamL  datos equipo local
   * @param {Object} teamV  datos equipo visitante
   * @param {number} P1
   * @param {number} P2
   * @param {number} PP
   * @returns {Object}
   */
  resumenPartido(teamL, teamV, P1, P2, PP) {
    const h2hStats = this.analizarH2H(
      Array(10).fill(null).map(() => ({
        golesL: Math.floor(Math.random() * 3),
        golesV: Math.floor(Math.random() * 3)
      }))
    );

    return {
      scoreTotal: PP,
      scoreP1: P1,
      scoreP2: P2,
      nivel: PP >= 80 ? 'Alta' : PP >= 60 ? 'Media' : PP >= 40 ? 'Baja' : 'Muy Baja',
      promGolesLocal:  this.promGoles(teamL.golesF, 34),
      promGolesVisita: this.promGoles(teamV.golesF, 34),
      ventajaLocal: teamL.pos < teamV.pos,
      h2h: h2hStats,
      kellyRecomendado: this.kelly(PP / 100, 1.75),
    };
  }
};

// Disponible globalmente
window.Calculos = Calculos;
