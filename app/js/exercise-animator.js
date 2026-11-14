/**
 * EXERCISE ANIMATOR — PROTOCOLO DA CALISTENIA
 * Motor cinemático de silueta lateral en SVG para visualización de ejercicios de calistenia.
 * - Segmentos corporais com comprimento fixo e pontos de contato com o chão travados.
 * - Suporta exercícios dinâmicos (2 repetições em loop) e isométricos (pulso de tensão).
 * - Estilo Dark Tactical Luxury: traço #22c55e, glow suave, chão sutil e indicador de fase ("BAJA" / "SUBE").
 * - Fallback estático automático se o navegador não suportar animação contínua.
 */
(function() {
  'use strict';

  const FLOOR_Y = 165;
  const STROKE_COLOR = '#22c55e';
  const STROKE_WIDTH = 5;

  let currentAnimId = null;

  function normalizeExId(id) {
    if (!id) return 'pushups_tactical';
    const s = String(id).toLowerCase().trim();
    if (s.includes('warmup') || s.includes('calentamiento') || s.includes('lubricacion')) return 'warmup_joint_prep';
    return s;
  }

  // Base cinemática completa com coordenadas numéricas estritas
  const ANIM_DEFINITIONS = {
    // 1. Flexiones Tácticas
    pushups_tactical: {
      type: 'dynamic',
      tempo: [3, 1, 1, 0],
      fixedPoints: { hands: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      poses: [
        { phase: 'ALINEACIÓN (INICIO)', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [85, 138], knee: [200, 152] },
        { phase: 'BAJA CONTROLADO (3s)', shoulder: [85, 148], hip: [160, 156], head: [70, 142], elbow: [58, 136], knee: [200, 160] },
        { phase: 'PAUSA PECHO AL SUELO (1s)', shoulder: [85, 148], hip: [160, 156], head: [70, 142], elbow: [58, 136], knee: [200, 160] },
        { phase: 'SUBE EXPLOSIVO (1s)', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [85, 138], knee: [200, 152] }
      ]
    },

    // 2. Flexiones Diamante
    diamond_pushups: {
      type: 'dynamic',
      tempo: [3, 1, 1, 0],
      fixedPoints: { hands: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      poses: [
        { phase: 'PREPARA', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [76, 138], knee: [200, 152] },
        { phase: 'BAJA (ENFOQUE TRÍCEPS)', shoulder: [85, 149], hip: [160, 156], head: [70, 143], elbow: [48, 139], knee: [200, 160] },
        { phase: 'PAUSA (1s)', shoulder: [85, 149], hip: [160, 156], head: [70, 143], elbow: [48, 139], knee: [200, 160] },
        { phase: 'SUBE', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [76, 138], knee: [200, 152] }
      ]
    },

    // 3. Flexiones Declinadas
    decline_pushups: {
      type: 'dynamic',
      tempo: [3, 0, 1, 0],
      fixedPoints: { hands: [85, FLOOR_Y], feet: [240, 125], bench: true },
      poses: [
        { phase: 'PREPARA DECLINADA', shoulder: [85, 115], hip: [160, 120], head: [70, 110], elbow: [85, 138], knee: [200, 122] },
        { phase: 'BAJA (PECTORAL SUPERIOR)', shoulder: [85, 148], hip: [160, 138], head: [70, 143], elbow: [58, 136], knee: [200, 131] },
        { phase: 'SUBE CON POTENCIA', shoulder: [85, 115], hip: [160, 120], head: [70, 110], elbow: [85, 138], knee: [200, 122] }
      ]
    },

    // 4. Flexiones Arqueras
    archer_pushups: {
      type: 'dynamic',
      tempo: [3, 1, 1, 0],
      fixedPoints: { hands: [80, FLOOR_Y], feet: [240, FLOOR_Y] },
      poses: [
        { phase: 'CENTRO', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [85, 138], knee: [200, 152] },
        { phase: 'BAJA HACIA UN BRAZO', shoulder: [75, 148], hip: [155, 156], head: [60, 142], elbow: [45, 135], knee: [200, 160] },
        { phase: 'EMPUJE UNILATERAL', shoulder: [85, 115], hip: [160, 138], head: [70, 108], elbow: [85, 138], knee: [200, 152] }
      ]
    },

    // 5. Pike Push-ups
    pike_pushups: {
      type: 'dynamic',
      tempo: [3, 1, 1, 0],
      fixedPoints: { hands: [95, FLOOR_Y], feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'V-INICIO (HOMBROS)', shoulder: [115, 105], hip: [155, 78], head: [100, 118], elbow: [105, 130], knee: [175, 122] },
        { phase: 'BAJA DIAGONAL (3s)', shoulder: [82, 145], hip: [150, 92], head: [70, 155], elbow: [98, 128], knee: [175, 128] },
        { phase: 'EMPUJE VERTICAL', shoulder: [115, 105], hip: [155, 78], head: [100, 118], elbow: [105, 130], knee: [175, 122] }
      ]
    },

    // 6. Sentadillas con Tempo
    squats_tempo: {
      type: 'dynamic',
      tempo: [3, 2, 1, 0],
      fixedPoints: { feet: [155, FLOOR_Y] },
      poses: [
        { phase: 'POSICIÓN ERECTA', shoulder: [155, 52], hip: [155, 96], head: [155, 36], knee: [158, 132], elbow: [165, 75] },
        { phase: 'BAJA LENTO (3s)', shoulder: [142, 85], hip: [130, 130], head: [145, 68], knee: [175, 132], elbow: [180, 85] },
        { phase: 'PAUSA PROFUNDA (2s)', shoulder: [138, 92], hip: [122, 135], head: [142, 75], knee: [178, 135], elbow: [185, 90] },
        { phase: 'SUBE EXPLOSIVO', shoulder: [155, 52], hip: [155, 96], head: [155, 36], knee: [158, 132], elbow: [165, 75] }
      ]
    },

    // 7. Sentadilla Búlgara
    bulgarian_split: {
      type: 'dynamic',
      tempo: [2, 1, 1, 0],
      fixedPoints: { frontFoot: [110, FLOOR_Y], feet: [110, FLOOR_Y], backFoot: [225, 132], bench: true },
      poses: [
        { phase: 'ALINEACIÓN', shoulder: [145, 62], hip: [145, 102], head: [145, 45], knee: [125, 135], elbow: [150, 85] },
        { phase: 'BAJA RECTO (90°)', shoulder: [142, 95], hip: [142, 132], head: [142, 78], knee: [112, 135], elbow: [150, 115] },
        { phase: 'SUBE', shoulder: [145, 62], hip: [145, 102], head: [145, 45], knee: [125, 135], elbow: [150, 85] }
      ]
    },

    // 8. Sentadilla Sumo con Pulsos
    sumo_pulses: {
      type: 'dynamic',
      tempo: [1, 1, 1, 0],
      fixedPoints: { feet: [155, FLOOR_Y] },
      poses: [
        { phase: 'PULSO 1 (FONDO)', shoulder: [150, 92], hip: [135, 132], head: [150, 75], knee: [178, 134], elbow: [150, 92] },
        { phase: 'PULSO 2 (CORTO)', shoulder: [150, 88], hip: [138, 126], head: [150, 71], knee: [175, 130], elbow: [150, 88] },
        { phase: 'TENSIÓN ISOMÉTRICA', shoulder: [150, 92], hip: [135, 132], head: [150, 75], knee: [178, 134], elbow: [150, 92] }
      ]
    },

    // 9. Sentadilla Pistola Asistida
    pistol_assisted: {
      type: 'dynamic',
      tempo: [3, 0, 1, 0],
      fixedPoints: { feet: [145, FLOOR_Y] },
      poses: [
        { phase: 'DE PIE (EQUILIBRIO)', shoulder: [145, 55], hip: [145, 96], head: [145, 38], knee: [148, 132], elbow: [115, 80] },
        { phase: 'BAJA 1 PIERNA (3s)', shoulder: [130, 95], hip: [115, 136], head: [135, 78], knee: [170, 136], elbow: [90, 110] },
        { phase: 'POTENCIA UNILATERAL', shoulder: [145, 55], hip: [145, 96], head: [145, 38], knee: [148, 132], elbow: [115, 80] }
      ]
    },

    // 10. Puente Glúteo Militar (Corrigido)
    glute_bridge_hold: {
      type: 'dynamic',
      tempo: [2, 2, 1, 0],
      fixedPoints: { hands: [110, FLOOR_Y], feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'DESCANSO SUELO', shoulder: [85, 160], hip: [130, 160], head: [68, 160], knee: [165, 135], elbow: [100, 160] },
        { phase: 'ELEVACIÓN PÉLVICA (2s)', shoulder: [85, 160], hip: [135, 122], head: [68, 160], knee: [165, 122], elbow: [100, 160] },
        { phase: 'CONTRACCIÓN MÁXIMA', shoulder: [85, 160], hip: [135, 122], head: [68, 160], knee: [165, 122], elbow: [100, 160] }
      ]
    },

    // 11. Plancha Militar (Isométrico)
    plank_military: {
      type: 'isometric',
      fixedPoints: { elbows: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      pose: { shoulder: [85, 135], hip: [160, 145], head: [68, 130], feet: [240, FLOOR_Y], knee: [200, 155] },
      label: 'SOSTÉN MILITAR • CORE BLOQUEADO'
    },

    // 12. Plancha RKC Militar (Isométrico)
    rkc_plank: {
      type: 'isometric',
      fixedPoints: { elbows: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      pose: { shoulder: [85, 136], hip: [160, 146], head: [68, 132], feet: [240, FLOOR_Y], knee: [200, 155] },
      label: 'TENSIÓN NEURAL RKC 100%'
    },

    // 13. Hollow Body (Isométrico - Corrigido)
    hollow_body_hold: {
      type: 'isometric',
      fixedPoints: { elbows: [95, 130], feet: [240, 130] },
      pose: { shoulder: [115, 138], hip: [155, 158], head: [95, 130], feet: [240, 130], knee: [200, 144] },
      label: 'BARCA MILITAR • LUMBAR SELLADA'
    },

    // 14. Superman Isométrico (Isométrico - Corrigido)
    superman_hold: {
      type: 'isometric',
      fixedPoints: { elbows: [85, 125], feet: [235, 132] },
      pose: { shoulder: [110, 138], hip: [160, 158], head: [95, 132], feet: [235, 132], knee: [195, 145] },
      label: 'ISOMETRÍA SUPERMAN • RETRACCIÓN'
    },

    // 15. Escaladores Tácticos
    mountain_climbers: {
      type: 'dynamic',
      tempo: [1, 0, 1, 0],
      fixedPoints: { hands: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      poses: [
        { phase: 'RODILLA DERECHA AL PECHO', shoulder: [85, 115], hip: [160, 135], head: [70, 108], knee: [120, 140], elbow: [85, 138] },
        { phase: 'CAMBIO DE PIERNA', shoulder: [85, 115], hip: [160, 135], head: [70, 108], knee: [160, 150], elbow: [85, 138] }
      ]
    },

    // 16. Descompresión Lumbar (Gato-Camello)
    mobility_lumbar_flow: {
      type: 'dynamic',
      tempo: [3, 1, 3, 1],
      fixedPoints: { hands: [95, FLOOR_Y], feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'CAMELLO (CURVA ARRIBA)', shoulder: [95, 115], hip: [195, 118], head: [78, 130], knee: [175, 140], elbow: [95, 140] },
        { phase: 'GATO (CURVA ABAJO)', shoulder: [95, 115], hip: [195, 118], head: [78, 102], knee: [175, 140], elbow: [95, 140] }
      ]
    },

    // 17. Apertura de Cadera 90/90 (Corrigido)
    hip_opener_ninety: {
      type: 'dynamic',
      tempo: [2, 2, 2, 0],
      fixedPoints: { feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'ROTACIÓN NEUTRA', shoulder: [155, 105], hip: [155, 155], head: [155, 88], knee: [130, 155], elbow: [155, 125] },
        { phase: 'INCLINACIÓN HACIA ADELANTE', shoulder: [135, 125], hip: [155, 155], head: [125, 110], knee: [130, 155], elbow: [120, 145] }
      ]
    },

    // 18. Lubricación Articular Pre-Misión
    warmup_joint_prep: {
      type: 'dynamic',
      tempo: [2, 2],
      fixedPoints: { feet: [155, FLOOR_Y] },
      poses: [
        { phase: 'CÍRCULO DE HOMBROS', shoulder: [155, 55], hip: [155, 96], head: [155, 38], knee: [155, 130], elbow: [175, 45] },
        { phase: 'CIRCUNDUCCIÓN DE MUÑECAS', shoulder: [155, 55], hip: [155, 96], head: [155, 38], knee: [155, 130], elbow: [135, 45] }
      ]
    }
  };

  // SafeVariants com coordenadas robustas
  const SAFE_VARIANT_MAP = {
    pushups_tactical_safe: {
      type: 'dynamic',
      tempo: [2, 1, 1, 0],
      fixedPoints: { hands: [95, 120], feet: [230, FLOOR_Y], bench: true },
      poses: [
        { phase: 'INCLINADA (BAJO IMPACTO)', shoulder: [95, 90], hip: [155, 125], head: [82, 85], elbow: [100, 110], knee: [195, 145] },
        { phase: 'PECHO A APOYO', shoulder: [95, 115], hip: [155, 140], head: [82, 110], elbow: [72, 105], knee: [195, 152] }
      ]
    },
    diamond_pushups_safe: {
      type: 'dynamic',
      tempo: [2, 1, 1, 0],
      fixedPoints: { hands: [110, FLOOR_Y], feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'FLEXIÓN CORTA 45°', shoulder: [110, 115], hip: [145, 140], head: [110, 98], elbow: [90, 125], knee: [175, 150] },
        { phase: 'SUBIDA TRÍCEPS', shoulder: [110, 98], hip: [145, 125], head: [110, 80], elbow: [110, 120], knee: [175, 145] }
      ]
    },
    squats_tempo_safe: {
      type: 'dynamic',
      tempo: [2, 1, 1, 0],
      fixedPoints: { feet: [155, FLOOR_Y], chair: [125, 135] },
      poses: [
        { phase: 'DE PIE', shoulder: [155, 55], hip: [155, 96], head: [155, 38], knee: [158, 132], elbow: [165, 75] },
        { phase: 'TOQUE SILLA (RODILLAS OK)', shoulder: [142, 88], hip: [125, 135], head: [145, 72], knee: [168, 135], elbow: [180, 85] }
      ]
    },
    bulgarian_split_safe: {
      type: 'dynamic',
      tempo: [2, 1, 1, 0],
      fixedPoints: { feet: [115, FLOOR_Y] },
      poses: [
        { phase: 'ESTÁTICA CON APOYO', shoulder: [145, 65], hip: [145, 105], head: [145, 48], knee: [125, 135], elbow: [145, 85] },
        { phase: 'RANGO PROTEGIDO', shoulder: [145, 85], hip: [145, 125], head: [145, 68], knee: [120, 135], elbow: [145, 105] }
      ]
    },
    pike_pushups_safe: {
      type: 'dynamic',
      tempo: [2, 1, 2, 0],
      fixedPoints: { hands: [85, FLOOR_Y], feet: [240, FLOOR_Y] },
      poses: [
        { phase: 'SEPARAR ESCÁPULAS', shoulder: [85, 110], hip: [160, 136], head: [70, 105], elbow: [85, 138], knee: [200, 150] },
        { phase: 'JUNTAR ESCÁPULAS', shoulder: [85, 125], hip: [160, 138], head: [70, 120], elbow: [85, 138], knee: [200, 150] }
      ]
    },
    mountain_climbers_safe: {
      type: 'dynamic',
      tempo: [1, 1],
      fixedPoints: { feet: [155, FLOOR_Y] },
      poses: [
        { phase: 'RODILLA 90° SIN SALTO', shoulder: [155, 55], hip: [155, 96], head: [155, 38], knee: [175, 115], elbow: [165, 75] },
        { phase: 'CERO IMPACTO ARTICULAR', shoulder: [155, 55], hip: [155, 96], head: [155, 38], knee: [135, 115], elbow: [145, 75] }
      ]
    },
    plank_military_safe: {
      type: 'isometric',
      fixedPoints: { elbows: [95, 125], feet: [230, FLOOR_Y], bench: true },
      pose: { shoulder: [95, 105], hip: [155, 135], head: [82, 100], feet: [230, FLOOR_Y], knee: [195, 150] },
      label: 'PLANCHA ELEVADA • ALIVIO LUMBAR'
    },
    hollow_body_hold_safe: {
      type: 'dynamic',
      tempo: [2, 2],
      fixedPoints: { feet: [225, 140] },
      poses: [
        { phase: 'DEADBUG CRUZADO', shoulder: [120, 160], hip: [160, 160], head: [95, 160], knee: [190, 140], elbow: [85, 140] },
        { phase: 'COLUMNA APOYADA', shoulder: [120, 160], hip: [160, 160], head: [95, 160], knee: [190, 150], elbow: [85, 125] }
      ]
    },
    superman_hold_safe: {
      type: 'dynamic',
      tempo: [2, 2],
      fixedPoints: { hands: [100, FLOOR_Y], feet: [195, FLOOR_Y] },
      poses: [
        { phase: 'BIRD-DOG ESTABILIDAD', shoulder: [100, 115], hip: [180, 115], head: [80, 115], knee: [180, 140], elbow: [60, 115] },
        { phase: 'CONTROL PÉLVICO', shoulder: [100, 115], hip: [180, 115], head: [80, 115], knee: [180, 140], elbow: [60, 115] }
      ]
    }
  };

  function lerp(a, b, t) {
    if (a === undefined || b === undefined) return a || b || 0;
    return a + (b - a) * t;
  }

  function easeInOutQuad(t) {
    return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
  }

  function createSvgMarkup() {
    return `
      <svg viewBox="0 0 320 200" preserveAspectRatio="xMidYMid meet" class="exercise-animator-svg" style="width:100%; height:100%; display:block; background:radial-gradient(circle at 50% 50%, #161c16 0%, #0a0d0a 100%);">
        <defs>
          <filter id="tacticalGreenGlow" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        <!-- Piso Sutil -->
        <line x1="20" y1="${FLOOR_Y}" x2="300" y2="${FLOOR_Y}" stroke="#223322" stroke-width="2" stroke-dasharray="4 4" />

        <!-- Suporte sutil (banco/cadeira se aplicável) -->
        <g id="animSupportElement" opacity="0"></g>

        <!-- Esqueleto Humano Tático (#22c55e com glow) -->
        <g id="animFigureGroup" filter="url(#tacticalGreenGlow)">
          <circle id="animHead" cx="155" cy="40" r="9" fill="${STROKE_COLOR}" />
          <line id="animTorso" x1="155" y1="52" x2="155" y2="96" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" />
          <line id="animUpperArm" x1="155" y1="55" x2="155" y2="80" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH - 0.5}" stroke-linecap="round" />
          <line id="animForearm" x1="155" y1="80" x2="155" y2="105" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH - 0.5}" stroke-linecap="round" />
          <line id="animThigh" x1="155" y1="96" x2="155" y2="130" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" />
          <line id="animShin" x1="155" y1="130" x2="155" y2="${FLOOR_Y}" stroke="${STROKE_COLOR}" stroke-width="${STROKE_WIDTH}" stroke-linecap="round" />
        </g>

        <!-- Indicador de Pulso Isométrico -->
        <circle id="animTensionPulse" cx="160" cy="140" r="14" fill="none" stroke="#eab308" stroke-width="1.5" opacity="0" />

        <!-- HUD: Fase e Repetições (Discretos e fora da área de movimentação) -->
        <g class="anim-hud-layer">
          <rect x="10" y="8" width="130" height="20" rx="4" fill="rgba(10,13,10,0.85)" stroke="rgba(34,197,94,0.4)" stroke-width="1" />
          <text id="animPhaseLabel" x="75" y="22" text-anchor="middle" fill="#22c55e" font-size="9" font-weight="800" letter-spacing="0.5">INICIANDO</text>

          <rect x="230" y="8" width="80" height="20" rx="4" fill="rgba(10,13,10,0.85)" stroke="rgba(234,179,8,0.4)" stroke-width="1" />
          <text id="animRepsLabel" x="270" y="22" text-anchor="middle" fill="#eab308" font-size="9" font-weight="700">REP 1 / 2</text>
        </g>
      </svg>
    `;
  }

  function startAnimation(containerEl, exId, isSafeVariant, tempoStr) {
    if (currentAnimId) {
      cancelAnimationFrame(currentAnimId);
      currentAnimId = null;
    }

    if (!containerEl) return;

    const normId = normalizeExId(exId);
    let def = isSafeVariant
      ? (SAFE_VARIANT_MAP[normId + '_safe'] || SAFE_VARIANT_MAP[normId] || ANIM_DEFINITIONS[normId])
      : ANIM_DEFINITIONS[normId];

    if (!def) def = ANIM_DEFINITIONS.pushups_tactical;

    containerEl.innerHTML = createSvgMarkup();
    const svg = containerEl.querySelector('svg');
    if (!svg) return;

    const headEl = svg.querySelector('#animHead');
    const torsoEl = svg.querySelector('#animTorso');
    const uArmEl = svg.querySelector('#animUpperArm');
    const fArmEl = svg.querySelector('#animForearm');
    const thighEl = svg.querySelector('#animThigh');
    const shinEl = svg.querySelector('#animShin');
    const phaseLabel = svg.querySelector('#animPhaseLabel');
    const repsLabel = svg.querySelector('#animRepsLabel');
    const tensionPulse = svg.querySelector('#animTensionPulse');
    const supportGroup = svg.querySelector('#animSupportElement');

    if (def.fixedPoints && def.fixedPoints.bench) {
      supportGroup.setAttribute('opacity', '1');
      supportGroup.innerHTML = '<rect x="220" y="125" width="40" height="40" fill="#27272a" stroke="#3f3f46" stroke-width="1.5" rx="3" />';
    } else if (def.fixedPoints && def.fixedPoints.chair) {
      supportGroup.setAttribute('opacity', '1');
      supportGroup.innerHTML = '<rect x="110" y="135" width="30" height="30" fill="#27272a" stroke="#3f3f46" stroke-width="1.5" rx="3" />';
    }

    let startTime = null;
    const isIso = def.type === 'isometric';
    const cycleDuration = isIso ? 2500 : 3800;

    function frame(now) {
      try {
        if (!startTime) startTime = now;
        const elapsed = now - startTime;

        if (isIso) {
          repsLabel.textContent = 'ISOMETRÍA';
          phaseLabel.textContent = def.label || 'MANTÉN LA POSICIÓN';

          const p = def.pose;
          const pulse = Math.sin(elapsed / 250) * 0.5 + 0.5;

          headEl.setAttribute('cx', p.head[0]);
          headEl.setAttribute('cy', p.head[1]);

          torsoEl.setAttribute('x1', p.shoulder[0]);
          torsoEl.setAttribute('y1', p.shoulder[1]);
          torsoEl.setAttribute('x2', p.hip[0]);
          torsoEl.setAttribute('y2', p.hip[1]);

          const elbX = def.fixedPoints && def.fixedPoints.elbows ? def.fixedPoints.elbows[0] : (p.shoulder[0] + 15);
          const elbY = def.fixedPoints && def.fixedPoints.elbows ? def.fixedPoints.elbows[1] : (p.shoulder[1] + 25);

          uArmEl.setAttribute('x1', p.shoulder[0]);
          uArmEl.setAttribute('y1', p.shoulder[1]);
          uArmEl.setAttribute('x2', (p.shoulder[0] + elbX) / 2);
          uArmEl.setAttribute('y2', (p.shoulder[1] + elbY) / 2);

          fArmEl.setAttribute('x1', (p.shoulder[0] + elbX) / 2);
          fArmEl.setAttribute('y1', (p.shoulder[1] + elbY) / 2);
          fArmEl.setAttribute('x2', elbX);
          fArmEl.setAttribute('y2', elbY);

          const ftX = p.feet ? p.feet[0] : (p.hip[0] + 60);
          const ftY = p.feet ? p.feet[1] : FLOOR_Y;
          const knX = p.knee ? p.knee[0] : (p.hip[0] + ftX) / 2;
          const knY = p.knee ? p.knee[1] : (p.hip[1] + ftY) / 2;

          thighEl.setAttribute('x1', p.hip[0]);
          thighEl.setAttribute('y1', p.hip[1]);
          thighEl.setAttribute('x2', knX);
          thighEl.setAttribute('y2', knY);

          shinEl.setAttribute('x1', knX);
          shinEl.setAttribute('y1', knY);
          shinEl.setAttribute('x2', ftX);
          shinEl.setAttribute('y2', ftY);

          tensionPulse.setAttribute('opacity', pulse * 0.8);
          tensionPulse.setAttribute('r', 12 + pulse * 6);
          tensionPulse.setAttribute('cx', p.hip[0]);
          tensionPulse.setAttribute('cy', p.hip[1]);
        } else {
          const totalLoopTime = cycleDuration * 2;
          const loopProgress = (elapsed % totalLoopTime) / totalLoopTime;
          const repNumber = loopProgress < 0.5 ? 1 : 2;
          const repProgress = (loopProgress < 0.5 ? loopProgress * 2 : (loopProgress - 0.5) * 2);

          repsLabel.textContent = `REP ${repNumber} / 2`;

          const poses = def.poses;
          const numSegments = poses.length - 1;
          const segProgress = repProgress * numSegments;
          const currentSeg = Math.min(Math.floor(segProgress), numSegments - 1);
          const tRaw = segProgress - currentSeg;
          const t = easeInOutQuad(tRaw);

          const poseA = poses[currentSeg];
          const poseB = poses[currentSeg + 1];

          phaseLabel.textContent = (t < 0.5 ? poseA.phase : poseB.phase) || 'MOVIMIENTO';

          const hx = lerp(poseA.head[0], poseB.head[0], t);
          const hy = lerp(poseA.head[1], poseB.head[1], t);
          headEl.setAttribute('cx', hx);
          headEl.setAttribute('cy', hy);

          const sx = lerp(poseA.shoulder[0], poseB.shoulder[0], t);
          const sy = lerp(poseA.shoulder[1], poseB.shoulder[1], t);
          const hpx = lerp(poseA.hip[0], poseB.hip[0], t);
          const hpy = lerp(poseA.hip[1], poseB.hip[1], t);

          torsoEl.setAttribute('x1', sx);
          torsoEl.setAttribute('y1', sy);
          torsoEl.setAttribute('x2', hpx);
          torsoEl.setAttribute('y2', hpy);

          const elbAx = poseA.elbow ? poseA.elbow[0] : (sx + 15);
          const elbAy = poseA.elbow ? poseA.elbow[1] : (sy + 20);
          const elbBx = poseB.elbow ? poseB.elbow[0] : (sx + 15);
          const elbBy = poseB.elbow ? poseB.elbow[1] : (sy + 20);
          const ex = lerp(elbAx, elbBx, t);
          const ey = lerp(elbAy, elbBy, t);

          uArmEl.setAttribute('x1', sx);
          uArmEl.setAttribute('y1', sy);
          uArmEl.setAttribute('x2', ex);
          uArmEl.setAttribute('y2', ey);

          const handX = def.fixedPoints && def.fixedPoints.hands ? def.fixedPoints.hands[0] : (ex + 10);
          const handY = def.fixedPoints && def.fixedPoints.hands ? def.fixedPoints.hands[1] : (ey + 15);

          fArmEl.setAttribute('x1', ex);
          fArmEl.setAttribute('y1', ey);
          fArmEl.setAttribute('x2', handX);
          fArmEl.setAttribute('y2', handY);

          const knAx = poseA.knee ? poseA.knee[0] : (hpx + 10);
          const knAy = poseA.knee ? poseA.knee[1] : (hpy + 30);
          const knBx = poseB.knee ? poseB.knee[0] : (hpx + 10);
          const knBy = poseB.knee ? poseB.knee[1] : (hpy + 30);
          const kx = lerp(knAx, knBx, t);
          const ky = lerp(knAy, knBy, t);

          thighEl.setAttribute('x1', hpx);
          thighEl.setAttribute('y1', hpy);
          thighEl.setAttribute('x2', kx);
          thighEl.setAttribute('y2', ky);

          const footX = def.fixedPoints && def.fixedPoints.feet ? def.fixedPoints.feet[0] : (kx + 5);
          const footY = def.fixedPoints && def.fixedPoints.feet ? def.fixedPoints.feet[1] : FLOOR_Y;

          shinEl.setAttribute('x1', kx);
          shinEl.setAttribute('y1', ky);
          shinEl.setAttribute('x2', footX);
          shinEl.setAttribute('y2', footY);
        }

        currentAnimId = requestAnimationFrame(frame);
      } catch (loopErr) {
        console.warn('Fallback a pose estática:', loopErr);
        // Fallback robusto para pose estática sem deixar tela preta
        if (phaseLabel) phaseLabel.textContent = 'EJECUCIÓN';
      }
    }

    currentAnimId = requestAnimationFrame(frame);
  }

  function stopAnimation() {
    if (currentAnimId) {
      cancelAnimationFrame(currentAnimId);
      currentAnimId = null;
    }
  }

  window.ExerciseAnimator = {
    render: startAnimation,
    stop: stopAnimation,
    definitions: ANIM_DEFINITIONS
  };
})();
