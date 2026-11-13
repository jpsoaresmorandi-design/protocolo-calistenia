/**
 * Protocolo de Calistenia Militar - Base de Datos Táctica (Días 1 a 60)
 * FASE 1: Misión 21 Días (Activación, Progresión y Consolidación)
 * FASE 2: Consolidación & Fuerza Estructural (Días 22 a 42)
 * FASE 3: Élite & Máximo Rendimiento Operativo (Días 43 a 60)
 * Soporte Nativo para Modo Articulación Segura, Variantes de Bajo Impacto y Demostraciones en Video/Poster
 */
(function() {
  'use strict';

  // --- Catálogo de Ejercicios Tácticos con Variantes Seguras y Videos ---
  const EXERCISES_LIBRARY = {
    pushups_tactical: {
      id: 'pushups_tactical',
      name: 'Flexiones Tácticas de Pecho',
      focus: 'Pectoral, Tríceps, Deltoides',
      workSec: 40,
      restSec: 20,
      targetReps: '10 a 14 reps',
      video: 'assets/videos/flexao-padrao.mp4',
      poster: 'assets/lg-ZE8vL-cru.webp',
      image: 'assets/lg-ZE8vL-cru.webp',
      cues: [
        'Manos al ancho de los hombros, codos apuntando en 45 grados hacia atrás.',
        'Aprieta glúteos y abdomen durante todo el rango de movimiento.',
        'Baja hasta que el pecho quede a un puño del suelo sin arquear la espalda.'
      ],
      safeVariant: {
        id: 'pushups_incline_safe',
        name: 'Flexiones Inclinadas de Bajo Impacto',
        focus: 'Pectoral y Tríceps (Cero tensión en muñecas y hombros)',
        workSec: 35,
        restSec: 30,
        targetReps: '8 a 12 reps controladas',
        video: 'assets/videos/flexao-inclinada.mp4',
        poster: 'assets/lg-ZE8vL-cru.webp',
        image: 'assets/lg-ZE8vL-cru.webp',
        jointType: 'munecas_hombros',
        cues: [
          'Manos apoyadas sobre un banco, mesa firme o pared.',
          'Ángulo de 45° que reduce la carga articular en un 50%.',
          'Descenso lento en 3 segundos sintiendo la activación del pecho.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 18h16M3 14l6-4 4 2 8-5M6 14v4M18 7v11"/></svg>'
    },

    diamond_pushups: {
      id: 'diamond_pushups',
      name: 'Flexiones Diamante (Enfoque Tríceps)',
      focus: 'Tríceps, Pectoral Interno, Core',
      workSec: 35,
      restSec: 25,
      targetReps: '8 a 12 reps',
      video: 'assets/videos/flexao-diamante.mp4',
      poster: 'assets/male-goal-shredded.jpg',
      image: 'assets/male-goal-shredded.jpg',
      cues: [
        'Une los dedos índices y pulgares formando un diamante bajo el centro del pecho.',
        'Codos pegados a las costillas en el descenso.',
        'Empuja con fuerza explosiva y bloquea tríceps arriba.'
      ],
      safeVariant: {
        id: 'triceps_floor_dips_safe',
        name: 'Fondos de Tríceps Asistidos en Suelo',
        focus: 'Tríceps (Sin forzar codos ni muñecas)',
        workSec: 30,
        restSec: 30,
        targetReps: '10 a 14 reps',
        video: 'assets/videos/triceps-suave.mp4',
        poster: 'assets/male-goal-shredded.jpg',
        image: 'assets/male-goal-shredded.jpg',
        jointType: 'munecas',
        cues: [
          'Sentado en el suelo con rodillas flectadas y manos detrás de la cadera.',
          'Flexiona y extiende los codos en un rango corto y cómodo.',
          'Cero sobrecarga articular en muñecas.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polygon points="12 2 2 12 12 22 22 12 12 2"/></svg>'
    },

    pike_pushups: {
      id: 'pike_pushups',
      name: 'Pike Push-ups (Enfoque Hombros Militares)',
      focus: 'Deltoides Anterior/Lateral, Trapecios, Tríceps',
      workSec: 35,
      restSec: 25,
      targetReps: '6 a 10 reps',
      video: 'assets/videos/pike-pushup.mp4',
      poster: 'assets/male-goal-strong.jpg',
      image: 'assets/male-goal-strong.jpg',
      cues: [
        'Forma una V invertida con tu cuerpo, caderas altas en el aire.',
        'Baja la cabeza hacia el suelo por delante de tus manos (triángulo imaginario).',
        'Empuja hacia atrás y arriba hasta volver a la V invertida.'
      ],
      safeVariant: {
        id: 'scapular_push_safe',
        name: 'Empuje Escapular en Plancha Alta',
        focus: 'Deltoides y Estabilidad Escapular (Sin Carga Vertical)',
        workSec: 35,
        restSec: 30,
        targetReps: '8 a 10 reps controladas',
        video: 'assets/videos/escapula-push.mp4',
        poster: 'assets/male-goal-strong.jpg',
        image: 'assets/male-goal-strong.jpg',
        jointType: 'hombros',
        cues: [
          'Sin flexionar los codos, junta las escápulas y luego empuja el suelo separándolas.',
          'Elimina todo el estrés vertical en el manguito rotador.',
          'Fortalece los estabilizadores escapulares.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2l4 7-4 3-4-3 4-7zM2 17l10 5 10-5"/></svg>'
    },

    squats_tempo: {
      id: 'squats_tempo',
      name: 'Sentadilla con Tempo Táctico (Pausa 2s)',
      focus: 'Cuádriceps, Glúteos, Aductores, Core',
      workSec: 45,
      restSec: 20,
      targetReps: '12 a 16 reps (3s bajada / 1s pausa)',
      video: 'assets/videos/sentadilla-tempo.mp4',
      poster: 'assets/fem-goal-toned.jpg',
      image: 'assets/fem-goal-toned.jpg',
      cues: [
        'Pies al ancho de hombros, puntas levemente abiertas hacia afuera.',
        'Desciende durante 3 segundos empujando las rodillas hacia afuera en línea con los pies.',
        'Pausa de 2 segundos en el punto paralelo y sube sin bloquear rodillas con violencia.'
      ],
      safeVariant: {
        id: 'chair_squat_safe',
        name: 'Sentadilla a la Silla con Apoyo Suave',
        focus: 'Cuádriceps y Glúteos (Protección Absoluta de Rodillas)',
        workSec: 40,
        restSec: 30,
        targetReps: '10 a 12 reps suaves',
        video: 'assets/videos/sentadilla-silla.mp4',
        poster: 'assets/fem-goal-toned.jpg',
        image: 'assets/fem-goal-toned.jpg',
        jointType: 'rodillas',
        cues: [
          'Toca el asiento de una silla firme con los glúteos sin dejar caer el peso bruscamente.',
          'El peso se mantiene en los talones eliminando tensión en tendón rotuliano.',
          'Movimiento asistido 100% seguro.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 3v18M18 3v18M6 12h12"/></svg>'
    },

    bulgarian_split: {
      id: 'bulgarian_split',
      name: 'Sentadilla Búlgara Táctica (Unilateral)',
      focus: 'Glúteo Mayor, Isquiosurales, Estabilidad de Cadera',
      workSec: 40,
      restSec: 20,
      targetReps: '8 a 10 reps por pierna',
      video: 'assets/videos/sentadilla-bulgara.mp4',
      poster: 'assets/fem-athlete-side.jpg',
      image: 'assets/fem-athlete-side.jpg',
      cues: [
        'Empeine trasero apoyado en un sofá o silla firme a la altura de la rodilla.',
        'Desciende verticalmente como un ascensor, rodilla delantera sobre el tobillo.',
        'Empuja desde el talón delantero para activar el glúteo.'
      ],
      safeVariant: {
        id: 'assisted_lunge_safe',
        name: 'Zancada Estática Asistida con Apoyo en Pared',
        focus: 'Glúteos y Piernas (Estabilidad y Cero Torsión de Rodilla)',
        workSec: 35,
        restSec: 30,
        targetReps: '8 reps por pierna',
        video: 'assets/videos/zancada-asistida.mp4',
        poster: 'assets/fem-athlete-side.jpg',
        image: 'assets/fem-athlete-side.jpg',
        jointType: 'rodillas',
        cues: [
          'Ambos pies apoyados en el suelo, mano apoyada en la pared.',
          'Rango de flexión corto sin balanceos laterales.',
          'Seguridad articular garantizada.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M4 21v-7a4 4 0 0 1 4-4h8a4 4 0 0 1 4 4v7"/></svg>'
    },

    sumo_pulses: {
      id: 'sumo_pulses',
      name: 'Sentadilla Sumo con Pulsos Tácticos',
      focus: 'Aductores, Glúteo Medio, Cuádriceps',
      workSec: 40,
      restSec: 20,
      targetReps: '10 reps + 2 pulsos en cada rep',
      video: 'assets/videos/sentadilla-sumo.mp4',
      poster: 'assets/fem-body-slim.jpg',
      image: 'assets/fem-body-slim.jpg',
      cues: [
        'Pies más anchos que los hombros, puntas a 45 grados.',
        'Mantén el pecho erguido y desciende hasta que los muslos queden paralelos.',
        'Realiza 2 rebotes cortos y controlados en el fondo antes de subir.'
      ],
      safeVariant: {
        id: 'sumo_isohold_safe',
        name: 'Sentadilla Sumo Iso-Hold Corto (Sin Rebotes)',
        focus: 'Aductores y Glúteos (Sin Estrés Articular)',
        workSec: 30,
        restSec: 30,
        targetReps: '20s sostenidos continuos',
        video: 'assets/videos/sumo-isohold.mp4',
        poster: 'assets/fem-body-slim.jpg',
        image: 'assets/fem-body-slim.jpg',
        jointType: 'rodillas',
        cues: [
          'Posición sumo a media profundidad sin descender al límite.',
          'Sostén isométrico estático; cero rebotes para proteger meniscos.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><path d="M8 12h8"/></svg>'
    },

    glute_bridge_hold: {
      id: 'glute_bridge_hold',
      name: 'Puente Glúteo Militar con Isometría',
      focus: 'Glúteo Mayor, Cadena Posterior, Suelo Pélvico',
      workSec: 45,
      restSec: 15,
      targetReps: '12 reps + 10s isometría final',
      video: 'assets/videos/puente-gluteo.mp4',
      poster: 'assets/fem-elite-woman.jpg',
      image: 'assets/fem-elite-woman.jpg',
      cues: [
        'Acostado boca arriba, talones a un palmo de los glúteos.',
        'Eleva la cadera empujando desde los talones hasta alinear rodillas y hombros.',
        'Aprieta glúteos con fuerza en la cima 2 segundos antes de bajar.'
      ],
      safeVariant: {
        id: 'bridge_neutral_safe',
        name: 'Puente Glúteo en Rango Neutro',
        focus: 'Cadena Posterior y Suelo Pélvico (Sin Hiperextensión)',
        workSec: 40,
        restSec: 25,
        targetReps: '10 a 12 reps suaves',
        video: 'assets/videos/puente-gluteo-suave.mp4',
        poster: 'assets/fem-elite-woman.jpg',
        image: 'assets/fem-elite-woman.jpg',
        jointType: 'lumbar',
        cues: [
          'Sube solo hasta formar línea recta entre muslos y torso.',
          'Pausa de 1 segundo en el suelo entre repeticiones para descargar la espalda baja.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 17l6-6 4 4 8-8"/></svg>'
    },

    plank_military: {
      id: 'plank_military',
      name: 'Plancha Militar con Bloqueo Pélvico',
      focus: 'Transverso Abdominal, Recto Abdominal, Escápulas',
      workSec: 45,
      restSec: 15,
      targetReps: 'Isometría continua',
      video: 'assets/videos/plancha-militar.mp4',
      poster: 'assets/male-goal-athletic.jpg',
      image: 'assets/male-goal-athletic.jpg',
      cues: [
        'Antebrazos en el suelo paralelos, codos bajo los hombros.',
        'Empuja el suelo con los codos separando las escápulas (protracción).',
        'Glúteos apretados, retroversión pélvica para proteger la columna.'
      ],
      safeVariant: {
        id: 'plank_incline_safe',
        name: 'Plancha sobre Antebrazos Elevados',
        focus: 'Core Profundo (Sin Impacto en Muñecas ni Espalda)',
        workSec: 35,
        restSec: 25,
        targetReps: '30s continuos sostenidos',
        video: 'assets/videos/plancha-elevada.mp4',
        poster: 'assets/male-goal-athletic.jpg',
        image: 'assets/male-goal-athletic.jpg',
        jointType: 'munecas_lumbar',
        cues: [
          'Apoya los antebrazos sobre una mesa o sofá firme.',
          'Reduce el peso corporal sobre la columna manteniendo la activación abdominal.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="6" rx="2"/></svg>'
    },

    hollow_body_hold: {
      id: 'hollow_body_hold',
      name: 'Hollow Body Táctico (La Barca Militar)',
      focus: 'Pared Abdominal Profunda, Flexores de Cadera',
      workSec: 35,
      restSec: 25,
      targetReps: '35s en tensión',
      video: 'assets/videos/hollow-body.mp4',
      poster: 'assets/fem-50k-mujeres.jpg',
      image: 'assets/fem-50k-mujeres.jpg',
      cues: [
        'Espalda baja 100% pegada al suelo, sin espacio para pasar una mano.',
        'Brazos estirados junto a las orejas y piernas a 30 grados del suelo.',
        'Cuerpo en forma de plátano con tensión total en el centro.'
      ],
      safeVariant: {
        id: 'deadbug_safe',
        name: 'Deadbug Táctico Alterno (Bicho Muerto)',
        focus: 'Pared Abdominal Profunda (Protección Lumbar Absoluta)',
        workSec: 35,
        restSec: 25,
        targetReps: '8 repeticiones lentas por lado',
        video: 'assets/videos/deadbug-suave.mp4',
        poster: 'assets/fem-50k-mujeres.jpg',
        image: 'assets/fem-50k-mujeres.jpg',
        jointType: 'lumbar',
        cues: [
          'Acostado boca arriba, extiende brazo y pierna opuesta mientras la lumbar se mantiene plana.',
          'Activa el core profundo sin doblar la columna.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12c3-5 7-7 10-7s7 2 10 7c-3 5-7 7-10 7s-7-2-10-7z"/></svg>'
    },

    mountain_climbers: {
      id: 'mountain_climbers',
      name: 'Escaladores Tácticos a Ritmo Constante',
      focus: 'Cardio Militar, Core Dinámico, Estabilidad',
      workSec: 40,
      restSec: 20,
      targetReps: 'Ritmo continuo y respiración nasal',
      video: 'assets/videos/escaladores.mp4',
      poster: 'assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp',
      image: 'assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp',
      cues: [
        'Posición de flexión alta con manos bajo los hombros.',
        'Lleva las rodillas alternadamente hacia el pecho sin rebotar la cadera.',
        'Mantén un ritmo militar fluido durante todo el intervalo.'
      ],
      safeVariant: {
        id: 'standing_march_safe',
        name: 'Marcha Militar en Bipedestación (Sin Salto)',
        focus: 'Cardio de Bajo Impacto y Flexores de Cadera',
        workSec: 35,
        restSec: 25,
        targetReps: '30s a ritmo suave y constante',
        video: 'assets/videos/marcha-militar.mp4',
        poster: 'assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp',
        image: 'assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp',
        jointType: 'rodillas_munecas',
        cues: [
          'De pie, marcha en el lugar levantando las rodillas a 90 grados con braceo militar.',
          'Cero impacto en articulaciones ni muñecas.',
          'Excelente estimulación aeróbica.'
        ]
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>'
    },

    // --- Movilidad y Recuperación Articular ---
    mobility_lumbar_flow: {
      id: 'mobility_lumbar_flow',
      name: 'Descompresión Lumbar y Gato-Camello Táctico',
      focus: 'Columna Torácica, Descompresión Discal',
      workSec: 50,
      restSec: 10,
      targetReps: '10 transiciones lentas',
      video: 'assets/videos/descompresion-lumbar.mp4',
      poster: 'assets/fem-age-30-39.jpg',
      image: 'assets/fem-age-30-39.jpg',
      cues: [
        'En cuadrupedia, arquea suavemente la columna hacia el techo soltando el aire.',
        'Luego desciende el abdomen hacia el suelo abriendo el pecho al inhalar.',
        'Movimiento fluido sin tirones bruscos.'
      ],
      safeVariant: {
        id: 'chair_lumbar_safe',
        name: 'Descompresión Lumbar Asistida en Silla',
        focus: 'Columna y Espalda',
        workSec: 45,
        restSec: 15,
        targetReps: '8 respiraciones profundas',
        video: 'assets/videos/lumbar-silla.mp4',
        poster: 'assets/fem-age-30-39.jpg',
        image: 'assets/fem-age-30-39.jpg',
        jointType: 'lumbar',
        cues: ['Sentado en la silla, inclínate suavemente hacia adelante apoyando codos en muslos.']
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z"/></svg>'
    },

    hip_opener_ninety: {
      id: 'hip_opener_ninety',
      name: 'Apertura de Cadera 90/90 Táctica',
      focus: 'Rotadores Internos y Externos de Cadera',
      workSec: 45,
      restSec: 15,
      targetReps: '45s por lado',
      video: 'assets/videos/apertura-cadera-90-90.mp4',
      poster: 'assets/fem-age-40-49.jpg',
      image: 'assets/fem-age-40-49.jpg',
      cues: [
        'Sentado en el suelo, ambas piernas en ángulo de 90 grados.',
        'Mantén el pecho erguido e inclínate suavemente sobre la pierna delantera.',
        'Respira profundo sintiendo la liberación de tensión pélvica.'
      ],
      safeVariant: {
        id: 'supine_hip_safe',
        name: 'Movilidad de Cadera en Decúbito Supino',
        focus: 'Cápsula de Cadera Suave',
        workSec: 40,
        restSec: 20,
        targetReps: '30s por pierna',
        video: 'assets/videos/cadera-suave.mp4',
        poster: 'assets/fem-age-40-49.jpg',
        image: 'assets/fem-age-40-49.jpg',
        jointType: 'cadera',
        cues: ['Acostado boca arriba, cruza un tobillo sobre el muslo opuesto y abraza la rodilla hacia el pecho.']
      },
      badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/></svg>'
    },
    decline_pushups: {
      id: 'decline_pushups',
      name: 'Flexiones Declinadas con Pies Elevados',
      target: 'Pectoral Superior, Deltoides Anterior y Tríceps',
      reps: '8-12 reps',
      cadence: 'Tempo 3-0-1 (3s bajada, subida explosiva)',
      tempo: '3-0-1-0',
      difficulty: 'Avanzado',
      video: 'assets/videos/flexao-declinada.mp4',
      poster: 'assets/male-goal-shredded.jpg',
      cues: [
        'Coloca los pies sobre una silla o banco firme y las manos en el suelo al ancho de los hombros.',
        'Mantén el abdomen contraído para no quebrar la zona lumbar en ningún punto.',
        'Desciende lentamente en 3 segundos hasta rozar el suelo con el pecho y empuja con potencia.'
      ],
      safeVariant: {
        id: 'decline_pushups_safe',
        name: 'Flexiones Estándar con Pausa Isométrica de 2s',
        reps: '6-8 reps',
        cadence: 'Bajada controlada, pausa 2s abajo sin tocar el suelo',
        tempo: '2-2-1-0',
        video: 'assets/videos/flexao-pausa.mp4',
        poster: 'assets/male-body-medium.jpg',
        cues: [
          'En el suelo, desciende hasta quedar a 3 cm y mantén la posición 2 segundos.',
          'Elimina el rebote y genera tensión pura en pectoral sin forzar el manguito rotador.'
        ]
      }
    },

    archer_pushups: {
      id: 'archer_pushups',
      name: 'Flexiones Arqueras Militares (Carga Unilateral)',
      target: 'Pectoral Mayor, Estabilidad Escapular y Tríceps',
      reps: '6 reps por lado',
      cadence: 'Descenso en 3s hacia un brazo, el otro extendido de apoyo',
      tempo: '3-1-1-0',
      difficulty: 'Élite',
      video: 'assets/videos/flexao-arquera.mp4',
      poster: 'assets/male-goal-strong.jpg',
      cues: [
        'Manos colocadas al doble del ancho de hombros.',
        'Desciende el cuerpo hacia la mano izquierda mientras el brazo derecho se mantiene recto.',
        'Empuja fuerte con el brazo flexionado y alterna de lado.'
      ],
      safeVariant: {
        id: 'archer_pushups_safe',
        name: 'Flexiones Diamante Inclinadas en Pared/Mesa',
        reps: '8-10 reps',
        cadence: 'Tempo suave 2-1-1',
        video: 'assets/videos/diamante-inclinada.mp4',
        poster: 'assets/male-body-medium.jpg',
        cues: [
          'Coloca las manos en forma de diamante apoyadas en una mesa o pared.',
          'Trabaja la fuerza del tríceps y centro del pecho sin impacto en muñecas.'
        ]
      }
    },

    superman_hold: {
      id: 'superman_hold',
      name: 'Isometría Superman Táctica con Retracción Escapular',
      target: 'Cadena Posterior, Erectores Espinales y Glúteos',
      reps: '30s - 45s isometría',
      cadence: 'Tensión isométrica continua con respiración nasal',
      tempo: 'Hold',
      difficulty: 'Intermedio',
      video: 'assets/videos/superman-hold.mp4',
      poster: 'assets/male-goal-athletic.jpg',
      cues: [
        'Tumbado boca abajo, despega simultáneamente pecho y muslos del suelo.',
        'Junta las escápulas atrás y mantén la mirada en el suelo para proteger las cervicales.',
        'Aprieta glúteos intensamente durante todo el intervalo.'
      ],
      safeVariant: {
        id: 'superman_safe',
        name: 'Bird-Dog Táctico Cruzado (Cuadrupedia)',
        reps: '10 reps alternadas',
        cadence: 'Pausa de 2s en extensión máxima',
        tempo: '2-2-2-0',
        video: 'assets/videos/bird-dog.mp4',
        poster: 'assets/fem-body-medium.jpg',
        cues: [
          'En cuatro apoyos, extiende brazo derecho y pierna izquierda en línea recta.',
          'Cero presión sobre las lumbares, fortaleciendo el core profundo y la estabilidad.'
        ]
      }
    },

    pistol_assisted: {
      id: 'pistol_assisted',
      name: 'Sentadilla Pistola Asistida (Pata de Palo Militar)',
      target: 'Cuádriceps, Glúteo Mayor y Estabilidad de Tobillo',
      reps: '5-8 reps por pierna',
      cadence: 'Bajada en 3s, subida en 1s con apoyo ligero en poste o pared',
      tempo: '3-0-1-0',
      difficulty: 'Élite',
      video: 'assets/videos/pistol-asistido.mp4',
      poster: 'assets/male-goal-shredded.jpg',
      cues: [
        'Apóyate con una mano en una pared o marco de puerta para equilibrio.',
        'Eleva una pierna hacia el frente y desciende con la pierna de apoyo manteniendo el talón clavado.',
        'No permitas que la rodilla colapse hacia adentro.'
      ],
      safeVariant: {
        id: 'pistol_safe',
        name: 'Sentadilla Búlgara con Pausa Isométrica de 3s',
        reps: '8 reps por pierna',
        cadence: 'Pausa profunda de 3s en el punto más bajo',
        tempo: '2-3-1-0',
        video: 'assets/videos/bulgara-pausa.mp4',
        poster: 'assets/fem-goal-toned.jpg',
        cues: [
          'Pie trasero elevado, desciende hasta casi rozar el suelo con la rodilla trasera.',
          'Pausa isométrica de 3s para estimular el cuádriceps y glúteo sin impacto articular.'
        ]
      }
    },

    rkc_plank: {
      id: 'rkc_plank',
      name: 'Plancha RKC Militar (Tensión Neural Máxima)',
      target: 'Pared Abdominal Completa, Transverso y Serratos',
      reps: '20s - 30s de contracción máxima',
      cadence: 'Contracción isométrica activa al 100% de esfuerzo',
      tempo: 'Max Contraction',
      difficulty: 'Avanzado',
      video: 'assets/videos/plancha-rkc.mp4',
      poster: 'assets/male-goal-athletic.jpg',
      cues: [
        'En posición de plancha sobre antebrazos, aprieta los puños fuertemente.',
        'Tira activamente los codos hacia los dedos de los pies y los pies hacia los codos.',
        'Aprieta glúteos y muslos como si fueras de acero. 20 segundos equivalen a 2 minutos de plancha normal.'
      ],
      safeVariant: {
        id: 'rkc_plank_safe',
        name: 'Plancha sobre Antebrazos con Respiración Diafragmática',
        reps: '30s',
        cadence: 'Respiración rítmica nasal profunda',
        tempo: 'Hold',
        video: 'assets/videos/plancha-diafragma.mp4',
        poster: 'assets/fem-body-slim.jpg',
        cues: [
          'Mantén alineación perfecta de cadera y hombros.',
          'Inhala hinchando el abdomen y exhala vaciándolo sin perder la tensión de la pelvis.'
        ]
      }
    },

  };

  // --- Generador Personalizado de la Misión (Días 1 a 60) ---
  function getDayPlan(dayNumber, genderOrProfile, optProfile) {
    let profile = (window.ProtocoloStore ? window.ProtocoloStore.getState().profile : {}) || {};
    let isFem = false;

    if (typeof genderOrProfile === 'object' && genderOrProfile !== null) {
      profile = Object.assign({}, profile, genderOrProfile);
      isFem = (profile.gender === 'mujer');
    } else if (typeof genderOrProfile === 'string') {
      isFem = (genderOrProfile === 'mujer');
      if (optProfile && typeof optProfile === 'object') {
        profile = Object.assign({}, profile, optProfile);
      }
    } else {
      isFem = (profile.gender === 'mujer');
    }

    const expLevel = profile.experienceLevel || 'principiante';
    const timeAvail = profile.timeAvailability || 'estandar';
    const isJointProtActive = !!profile.jointProtection;
    const jointRegions = profile.jointRegions || { rodillas: true, munecas: true, hombros: true };

    // Determinación de la Fase y Plan
    let phase = 1;
    let phaseName = 'Fase 1: Misión 21 Días (Transformación Activa)';
    if (dayNumber >= 22 && dayNumber <= 42) {
      phase = 2;
      phaseName = 'Fase 2: Consolidación & Fuerza Estructural (Días 22-42)';
    } else if (dayNumber >= 43) {
      phase = 3;
      phaseName = 'Fase 3: Élite & Maestría Calisténica (Días 43-60)';
    }

    // Días de Recuperación Táctica / Blindaje Articular
    const isRecoveryDay = (dayNumber % 7 === 4);

    if (isRecoveryDay) {
      return {
        day: dayNumber,
        phase,
        phaseName,
        isRecovery: true,
        title: 'Día ' + dayNumber + ': Blindaje Articular y Descompresión',
        subtitle: 'Recuperación estratégica del sistema neuromuscular y regeneración articular.',
        estTime: '12 min',
        calories: '~90 kcal',
        rounds: 3,
        jointProtected: isJointProtActive,
        exercises: [
          EXERCISES_LIBRARY.mobility_lumbar_flow,
          EXERCISES_LIBRARY.hip_opener_ninety,
          EXERCISES_LIBRARY.glute_bridge_hold
        ]
      };
    }

    // Configuración Base de Rondas
    let rounds = 3;
    let estTime = '16 min';
    let calories = '~180 kcal';

    if (phase === 1) {
      rounds = (timeAvail === 'express') ? 2 : (timeAvail === 'intensivo' ? 4 : 3);
      estTime = (timeAvail === 'express') ? '12 min' : (timeAvail === 'intensivo' ? '22 min' : '16 min');
      calories = (timeAvail === 'express') ? '~120 kcal' : (timeAvail === 'intensivo' ? '~210 kcal' : '~160 kcal');
    } else if (phase === 2) {
      rounds = (timeAvail === 'express') ? 3 : (timeAvail === 'intensivo' ? 5 : 4);
      estTime = (timeAvail === 'express') ? '15 min' : (timeAvail === 'intensivo' ? '25 min' : '20 min');
      calories = (timeAvail === 'express') ? '~160 kcal' : (timeAvail === 'intensivo' ? '~260 kcal' : '~210 kcal');
    } else {
      rounds = (timeAvail === 'express') ? 3 : (timeAvail === 'intensivo' ? 5 : 4);
      estTime = (timeAvail === 'express') ? '16 min' : (timeAvail === 'intensivo' ? '28 min' : '22 min');
      calories = (timeAvail === 'express') ? '~180 kcal' : (timeAvail === 'intensivo' ? '~300 kcal' : '~240 kcal');
    }

    // Ajuste de volumen se Modo Articulación Segura estiver ativado (-20% de rondas, mínimo 1)
    if (isJointProtActive) {
      rounds = Math.max(1, Math.floor(rounds * 0.8));
    }

    // Selección de Ejercicios por Género y Fase
    let rawExercises = [];
    let title = '';

    if (phase === 1) {
      if (isFem) {
        title = 'Día ' + dayNumber + ': Activación Glúteos y Abdomen Firme';
        rawExercises = [
          EXERCISES_LIBRARY.glute_bridge_hold,
          EXERCISES_LIBRARY.squats_tempo,
          EXERCISES_LIBRARY.plank_military,
          EXERCISES_LIBRARY.sumo_pulses
        ];
      } else {
        title = 'Día ' + dayNumber + ': Activación Pectoral y Core Militar';
        rawExercises = [
          EXERCISES_LIBRARY.pushups_tactical,
          EXERCISES_LIBRARY.squats_tempo,
          EXERCISES_LIBRARY.plank_military,
          EXERCISES_LIBRARY.mountain_climbers
        ];
      }
    } else if (phase === 2) {
      if (isFem) {
        title = 'Día ' + dayNumber + ': Consolidación Glúteos, Piernas y Cintura';
        rawExercises = [
          EXERCISES_LIBRARY.bulgarian_split,
          EXERCISES_LIBRARY.sumo_pulses,
          EXERCISES_LIBRARY.hollow_body_hold,
          EXERCISES_LIBRARY.mountain_climbers
        ];
      } else {
        title = 'Día ' + dayNumber + ': Consolidación Pectoral, Hombros y Core';
        rawExercises = [
          EXERCISES_LIBRARY.pushups_tactical,
          EXERCISES_LIBRARY.pike_pushups,
          EXERCISES_LIBRARY.hollow_body_hold,
          EXERCISES_LIBRARY.mountain_climbers
        ];
      }
    } else {
      if (isFem) {
        title = 'Día ' + dayNumber + ': Choque Élite de Definición y Potencia';
        rawExercises = [
          EXERCISES_LIBRARY.bulgarian_split,
          EXERCISES_LIBRARY.sumo_pulses,
          EXERCISES_LIBRARY.glute_bridge_hold,
          EXERCISES_LIBRARY.hollow_body_hold,
          EXERCISES_LIBRARY.plank_military
        ];
      } else {
        title = 'Día ' + dayNumber + ': Protocolo Élite de Fuerza y Resistencia Máxima';
        rawExercises = [
          EXERCISES_LIBRARY.pushups_tactical,
          EXERCISES_LIBRARY.diamond_pushups,
          EXERCISES_LIBRARY.pike_pushups,
          EXERCISES_LIBRARY.hollow_body_hold,
          EXERCISES_LIBRARY.squats_tempo
        ];
      }
    }

    // Se Modo Articulación Segura estiver ativado, insere aquecimento articular pré-missão
    let finalExerciseList = [];
    if (isJointProtActive) {
      finalExerciseList.push({
        id: 'warmup_joint_prep',
        name: 'Lubricación Articular de Pulsos, Hombros y Cadera',
        focus: 'Protección Pre-Misión (Líquido Sinovial)',
        workSec: 45,
        restSec: 15,
        targetReps: 'Movimiento fluido continuo',
        video: 'assets/videos/descompresion-lumbar.mp4',
        poster: 'assets/fem-age-30-39.jpg',
        image: 'assets/fem-age-30-39.jpg',
        isWarmup: true,
        cues: [
          'Círculos lentos de muñecas en ambos sentidos.',
          'Rotación escapular hacia adelante y atrás.',
          'Movilidad suave de cadera para proteger rodillas.'
        ],
        badgeSvg: '<svg viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>'
      });
    }

    // Mapeamento e Calibração dos Exercícios
    const calibratedExercises = rawExercises.map(ex => {
      let activeEx = ex;
      let usedSafe = false;

      // Substituição pela Variante Segura se Modo Articulação Segura estiver ativo
      if (isJointProtActive && ex.safeVariant) {
        // Verifica se a região específica do exercício está marcada nas preferências
        const affectsKnees = ex.id.includes('squat') || ex.id.includes('split') || ex.id.includes('sumo');
        const affectsWrists = ex.id.includes('pushup') || ex.id.includes('plank') || ex.id.includes('climber');
        const affectsShoulders = ex.id.includes('pike') || ex.id.includes('pushup');

        let shouldReplace = true;
        if (jointRegions) {
          shouldReplace = (affectsKnees && jointRegions.rodillas) ||
                          (affectsWrists && jointRegions.munecas) ||
                          (affectsShoulders && jointRegions.hombros) ||
                          (!affectsKnees && !affectsWrists && !affectsShoulders);
        }

        if (shouldReplace) {
          activeEx = Object.assign({}, ex.safeVariant, {
            id: ex.id,
            badgeSvg: ex.badgeSvg,
            originalName: ex.name
          });
          usedSafe = true;
        }
      }

      const cloned = Object.assign({}, activeEx);
      cloned.cues = [...activeEx.cues];
      cloned.isSafeVariantActive = usedSafe;
      cloned.video = activeEx.video || ex.video;
      cloned.poster = activeEx.poster || ex.poster || activeEx.image || ex.image;

      // Aumento de tempo de descanso (+15s) se modo seguro estiver ativo
      if (isJointProtActive) {
        cloned.restSec = (cloned.restSec || 20) + 15;
      }

      // Calibração por nível de experiência
      if (expLevel === 'principiante') {
        cloned.workSec = Math.max(25, cloned.workSec - 5);
        cloned.restSec = Math.max(25, cloned.restSec);
      } else if (expLevel === 'avanzado') {
        cloned.workSec = Math.min(50, cloned.workSec + 5);
      }

      return cloned;
    });

    finalExerciseList = finalExerciseList.concat(calibratedExercises);

    return {
      day: dayNumber,
      phase,
      phaseName,
      isRecovery: false,
      title,
      subtitle: (phase === 1 ? 'Misión de los 21 Días' : (phase === 2 ? 'Consolidación Táctica' : 'Fase de Élite')) + ' • ' + rounds + ' rondas (' + expLevel.toUpperCase() + ')',
      estTime,
      calories,
      rounds,
      jointProtected: isJointProtActive,
      exercises: finalExerciseList,
      experienceLevel: expLevel,
      timeAvailability: timeAvail
    };
  }

  window.ExercisesDB = {
    getDayPlan,
    library: EXERCISES_LIBRARY
  };

})();
