const LOGO = 'assets/md-glUlk-imgi-12-md-kxvow-imgi-1-md-rr5mw-logo-calistenia-militar.webp';
const TOTAL = 19; // progress denominator
const VSL_URL = 'vsl.html';

const state = { step: 0, answers: {}, ruler: {}, lastStep: -1 };

const IMG_DIMS = {
  "assets/male-body-slim.jpg":[800,800],
  "assets/male-body-medium.jpg":[800,800],
  "assets/male-body-overweight.jpg":[800,800],
  "assets/male-goal-athletic.jpg":[800,800],
  "assets/male-goal-shredded.jpg":[800,800],
  "assets/male-goal-strong.jpg":[800,800],
  "assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp":[800,800],
  "assets/lg-ZE8vL-cru.webp":[800,800],
  "assets/md-02sSQ-imgi-3-md-rcdr6-xs-i4c0k-2.webp":[50,50],
  "assets/md-6Yuer-image-fx-5.webp":[997,768],
  "assets/md-6rUSA-imgi-15-md-gmhpz-imgi-4-md-y5bsw-backgroundremover-18.webp":[400,311],
  "assets/md-8Q6ps-imgi-2-xs-d0oac-upper-back-pain-aec635d3dd.webp":[96,96],
  "assets/md-8xMjX-imgi-5-xs-oh43h-cali-bodybuilder-man-54e5b933ee.webp":[96,96],
  "assets/md-9Rrsc-image-fx-4.webp":[1135,768],
  "assets/md-EL5Az-imgi-6-md-cpi7z-xs-51yqm-xs-lomib-i2qupjinzdxf3c4qvxei-1webp.webp":[50,50],
  "assets/md-GpfeT-imgi-14-md-trbm3-imgi-3-md-veznq-backgroundremover-17.webp":[400,311],
  "assets/md-L5Fw5-imgi-5-xs-hxdcp-cali-obese-man-45a30e9960.webp":[96,96],
  "assets/md-L7u7l-imgi-5-md-bnizl-xs-2yjeg-4.webp":[50,50],
  "assets/md-LNzgM-imgi-2-md-a6td6-xs-dz9ma-xs-2hobn-t7huvnw5sqip6tp6ayuhwebp.webp":[50,50],
  "assets/md-OXN2t-imgi-2-md-5i4g5-xs-hpgnk-1.webp":[50,50],
  "assets/md-SMtJw-imgi-3-md-tw59y-xs-qew9h-xs-tcbu3-avumsltp3wvrtlunx5uuwebp.webp":[50,50],
  "assets/md-TcoEN-imgi-3-xs-yfmvl-lower-back-pain-6ce968c0b1.webp":[96,96],
  "assets/md-WHBj5-imgi-5-xs-ml3aw-cali-overall-fitness-4f46ab64e3.webp":[96,96],
  "assets/md-XOUDN-imgi-6-md-poffq-xs-on71a-5.webp":[50,50],
  "assets/md-XwTeN-imgi-4-xs-tgjhj-knee-pain-b98cef734e.webp":[96,96],
  "assets/md-aecjF-imgi-16-md-yjxtg-imgi-5-md-jw5pr-backgroundremover-19.webp":[400,311],
  "assets/md-fiJ0u-imgi-4-xs-vmi7i-cali-shredded-man1-575d735850.webp":[96,96],
  "assets/md-glUlk-imgi-12-md-kxvow-imgi-1-md-rr5mw-logo-calistenia-militar.webp":[400,62],
  "assets/md-iRDal-imgi-13-md-qmvu5-imgi-2-md-fv9lo-backgroundremover-16.webp":[400,311],
  "assets/md-kKbBE-imgi-4-md-ujyvv-xs-eapyx-xs-vz7e9-ljnupzfynlnhugbpum7awebp.webp":[50,50],
  "assets/md-nsF8q-fisico.webp":[1024,559],
  "assets/md-nsIwX-imgi-3-xs-9jzcs-cali-slim-man-14e2cc4e10.webp":[96,96],
  "assets/md-pPwUG-imgi-2-xs-ei17n-cali-overweight-man-d222a19857.webp":[96,96],
  "assets/md-rQj8h-imgi-4-md-zryal-xs-gmpyz-3.webp":[50,50],
  "assets/md-s0CBM-imgi-5-md-aufue-xs-shv12-xs-3zfn5-iqjownudurymg1fyx4l2webp.webp":[50,50],
  "assets/md-uWAUl-fisico1111111.webp":[1024,1024],
  "assets/md-ubF9F-imgi-5-xs-39ycy-joints-pain-8eec0eebca.webp":[96,96],
  "assets/md-vC8R0-imgi-4-xs-3iwwa-cali-shredded-man-7df7bef067.webp":[96,96],
  "assets/sm-O7YyD-imgi-13-sm-yf9zm-imgi-2-md-qprfb-443535635.webp":[200,493],
  "assets/xs-8EdtE-imgi-3-xs-hczu6-219656347-4211384335623426-2101641038971319311-n.jpg":[100,100],
  "assets/fem-age-18-29.jpg":[800,800],
  "assets/fem-age-30-39.jpg":[800,800],
  "assets/fem-age-40-49.jpg":[800,800],
  "assets/fem-age-50-plus.jpg":[800,800],
  "assets/fem-50k-mujeres.jpg":[800,800],
  "assets/fem-elite-woman.jpg":[800,800],
  "assets/fem-athlete-side.jpg":[500,800],
  "assets/fem-body-slim.jpg":[800,800],
  "assets/fem-body-medium.jpg":[800,800],
  "assets/fem-body-overweight.jpg":[800,800],
  "assets/fem-goal-toned.jpg":[800,800],
  "assets/fem-goal-strong.jpg":[800,800]
};
function imgDim(src){ const d=IMG_DIMS[src]; return d?` width="${d[0]}" height="${d[1]}"`:""; }

function isFemale(){
  return state.answers[0] === 'mujer';
}

function getStep(stepIdx){
  const fem = isFemale();

  switch(stepIdx){
    // 0 — GÉNERO (com apresentação inicial na landing)
    case 0:
      return {
        type: 'grid-img',
        layout: 'grid-square',
        autoAdvance: true,
        progress: 5.26316,
        title: [
          '<strong style="background-color: inherit; color: rgb(255, 255, 255);">Consigue un </strong><strong style="background-color: inherit; color: rgb(22, 163, 74);">físico</strong><strong style="background-color: inherit; color: rgb(255, 255, 255);"> marcado en </strong><strong style="background-color: inherit; color: rgb(22, 163, 74);">solo 21</strong><strong style="background-color: inherit; color: rgb(255, 255, 255);"> días con el</strong>',
          '<strong style="background-color: inherit; color: rgb(22, 163, 74);">Desafío de Calistenia Militar</strong>',
          '<strong style="background-color: inherit; color: rgb(255, 255, 255);">sin salir de casa.</strong>'
        ],
        body: [
          '<span style="color: rgb(255, 255, 255);">Identifica tu nivel actual y descubre  exactamente qué hacer para</span>',
          '<span style="background-color: rgb(15, 17, 15); color: rgb(255, 255, 255);"> </span><strong style="background-color: rgb(15, 17, 15); color: rgb(92, 122, 92);">secar, definir y evolucionar en casa</strong><span style="background-color: rgb(15, 17, 15); color: rgb(255, 255, 255);">.</span>'
        ],
        prompt: '¿Cuál es tu género?',
        options: [
          { label: 'HOMBRE', value: 'hombre', img: 'assets/md-9Rrsc-image-fx-4.webp' },
          { label: 'MUJER', value: 'mujer', img: 'assets/md-6Yuer-image-fx-5.webp' }
        ]
      };

    // 1 — EDAD
    case 1:
      return {
        type: 'grid-img',
        layout: 'grid-square',
        autoAdvance: true,
        progress: 10.5263,
        title: ['¿Cuál es tu edad?'],
        options: fem ? [
          { label: 'Edad:18 - 29', value: 'edad-18-29', img: 'assets/fem-age-18-29.jpg' },
          { label: 'Edad:30 - 39', value: 'edad-30-39', img: 'assets/fem-age-30-39.jpg' },
          { label: 'Edad:40 - 49', value: 'edad-40-49', img: 'assets/fem-age-40-49.jpg' },
          { label: 'Edad: 50+', value: 'edad-50-plus', img: 'assets/fem-age-50-plus.jpg' }
        ] : [
          { label: 'Edad:18 - 29', value: 'edad-18-29', img: 'assets/md-iRDal-imgi-13-md-qmvu5-imgi-2-md-fv9lo-backgroundremover-16.webp' },
          { label: 'Edad:30 - 39', value: 'edad-30-39', img: 'assets/md-GpfeT-imgi-14-md-trbm3-imgi-3-md-veznq-backgroundremover-17.webp' },
          { label: 'Edad:40 - 49', value: 'edad-40-49', img: 'assets/md-6rUSA-imgi-15-md-gmhpz-imgi-4-md-y5bsw-backgroundremover-18.webp' },
          { label: 'Edad: 50+', value: 'edad-50-plus', img: 'assets/md-aecjF-imgi-16-md-yjxtg-imgi-5-md-jw5pr-backgroundremover-19.webp' }
        ]
      };

    // 2 — OBJETIVO
    case 2:
      return {
        type: 'grid-img',
        autoAdvance: true,
        progress: 15.7895,
        title: ['¿Cuál es tu objetivo?'],
        subtitle: 'Tu respuesta nos permite <span class="q-hl-yellow">personalizar</span> el plan.',
        options: fem ? [
          { label: 'Perder peso', sub: 'reducir grasa y tonificar el cuerpo', value: 'perder-peso', img: 'assets/fem-body-slim.jpg' },
          { label: 'Tonificar y definir', sub: 'esculpir glúteos, abdomen y piernas', value: 'ganar-musculo', img: 'assets/fem-goal-toned.jpg' },
          { label: 'Fuerza y firmeza', sub: 'más firmeza, resistencia y postura elegante', value: 'forca-y-volumen-muscular', img: 'assets/fem-goal-strong.jpg' },
          { label: 'Mejorar la condición física general', sub: 'resistencia, vitalidad y disciplina', value: 'mejorar-la-condicion-fisica-general', img: 'assets/fem-body-medium.jpg' }
        ] : [
          { label: 'Perder peso', sub: 'reducir grasa y marcar el cuerpo', value: 'perder-peso', img: 'assets/male-body-slim.jpg' },
          { label: 'Ganar músculo', sub: 'aumentar masa muscular con tu propio peso', value: 'ganar-musculo', img: 'assets/male-goal-athletic.jpg' },
          { label: 'Fuerza y volumen muscular', sub: 'más tamaño, potencia y presencia física', value: 'forca-y-volumen-muscular', img: 'assets/male-goal-strong.jpg' },
          { label: 'Mejorar la condición física general', sub: 'resistencia, fuerza y disciplina', value: 'mejorar-la-condicion-fisica-general', img: 'assets/male-goal-shredded.jpg' }
        ]
      };

    // 3 — MOTIVACIÓN
    case 3:
      return {
        type: 'grid-multi',
        autoAdvance: false,
        progress: 21.0526,
        title: ['¿Cuál es tu motivación para ponerte en forma?'],
        subtitle: 'Selecciona todas las opciones que apliquen.',
        options: fem ? [
          { label: 'Verse más atractiva', value: 'verse-mas-atractivo', img: 'assets/icons/ico-sparkle-user.svg' },
          { label: 'Volverse más fuerte y segura', value: 'volverse-mas-fuerte', img: 'assets/icons/ico-bicep-strong.svg' },
          { label: 'Sentirse más saludable y con más energía', value: 'sentirse-mas-saludable-y-con-mas-energia', img: 'assets/icons/ico-health-energy.svg' },
          { label: 'Disfrutar más tiempo con quienes amas', value: 'disfrutar-mas-tiempo-con-quienes-amas', img: 'assets/icons/ico-heart-family.svg' },
          { label: 'Otro', value: 'otro', img: 'assets/icons/ico-trophy-target.svg' }
        ] : [
          { label: 'Verse más atractivo', value: 'verse-mas-atractivo', img: 'assets/icons/ico-sparkle-user.svg' },
          { label: 'Volverse más fuerte', value: 'volverse-mas-fuerte', img: 'assets/icons/ico-bicep-strong.svg' },
          { label: 'Sentirse más saludable y con más energía', value: 'sentirse-mas-saludable-y-con-mas-energia', img: 'assets/icons/ico-health-energy.svg' },
          { label: 'Disfrutar más tiempo con quienes amas', value: 'disfrutar-mas-tiempo-con-quienes-amas', img: 'assets/icons/ico-heart-family.svg' },
          { label: 'Otro', value: 'otro', img: 'assets/icons/ico-trophy-target.svg' }
        ]
      };

    // 4 — SOCIAL PROOF 50.000
    case 4:
      return {
        type: 'content',
        autoAdvance: false,
        progress: 26.3158,
        titleTag: 'h1+h2',
        title: fem ? [
          '50.000 mujeres',
          'ya transformaron su',
          'cuerpo con',
          '<strong style="color:rgb(21,128,61)">Calistenia Militar Femenina</strong>'
        ] : [
          '50.000 hombres',
          'ya transformaron su',
          'cuerpo con',
          '<strong style="color:rgb(21,128,61)">Calistenia Militar</strong>'
        ],
        image: fem ? 'assets/fem-50k-mujeres.jpg' : 'assets/lg-ZE8vL-cru.webp'
      };

    // 5 — FUERZAS DE ÉLITE
    case 5:
      return {
        type: 'content',
        autoAdvance: false,
        progress: 31.5789,
        imageFirst: true,
        title: ['Entrena como las fuerzas de élite'],
        body: fem ? [
          'El <strong style="color:rgb(22,163,74)">Plan de Calistenia Militar</strong> sigue un protocolo adaptado a la fisiología femenina — un sistema comprobado para forjar cuerpo, mente y disciplina de acero.',
          'Vas a desarrollar:',
          '<br>',
          '<strong style="color:rgb(22,163,74)">Fuerza funcional</strong> — firmeza, postura y tonificación real sin depender del gimnasio.',
          '<strong style="color:rgb(22,163,74)">Resistencia y vitalidad</strong> — energía constante ante cualquier desafío.',
          '<strong style="color:rgb(22,163,74)">Resiliencia mental</strong> — enfoque, autoconfianza y control bajo presión.',
          'No es un entrenamiento.',
          'Es una misión.',
          '<br>',
          '<span class="q-c">Creado para mujeres que quieren dominar su cuerpo y convertirse en su versión más fuerte.</span>'
        ] : [
          'El <strong style="color:rgb(22,163,74)">Plan de Calistenia Militar</strong> sigue un protocolo utilizado por soldados reales — un sistema comprobado para forjar cuerpo, mente y disciplina de acero.',
          'Vas a desarrollar:',
          '<br>',
          '<strong style="color:rgb(22,163,74)">Fuerza funcional</strong> — potencia real sin depender del gimnasio.',
          '<strong style="color:rgb(22,163,74)">Resistencia de combate</strong> — energía constante ante cualquier desafío.',
          '<strong style="color:rgb(22,163,74)">Resiliencia mental</strong> — enfoque y control bajo presión.',
          'No es un entrenamiento.',
          'Es una misión.',
          '<br>',
          '<span class="q-c">Creado para hombres que quieren dominar su cuerpo y convertirse en su versión más fuerte.</span>'
        ],
        image: fem ? 'assets/fem-elite-woman.jpg' : 'assets/lg-PkZ1i-imgi-13-lg-wup9i-imgi-2-lg-h3mzm-lucia-fatima-gere-uma-imagem-semelhante-com-um-cara-mais-moreno-e-outro-ambien-f36b3658.webp'
      };

    // 6 — TIPO FÍSICO
    case 6:
      return {
        type: 'grid-img',
        autoAdvance: true,
        progress: 36.8421,
        title: ['¿Cómo describirías tu tipo físico?'],
        options: fem ? [
          { label: 'Delgada', value: 'delgado', img: 'assets/fem-body-slim.jpg' },
          { label: 'Media', value: 'medio', img: 'assets/fem-body-medium.jpg' },
          { label: 'Con curvas / Cuerpo grande', value: 'cuerpo-grande', img: 'assets/fem-body-overweight.jpg' },
          { label: 'Con sobrepeso', value: 'con-sobrepeso', img: 'assets/fem-body-overweight.jpg' }
        ] : [
          { label: 'Delgado', value: 'delgado', img: 'assets/md-nsIwX-imgi-3-xs-9jzcs-cali-slim-man-14e2cc4e10.webp' },
          { label: 'Médio', value: 'medio', img: 'assets/md-WHBj5-imgi-5-xs-ml3aw-cali-overall-fitness-4f46ab64e3.webp' },
          { label: 'Cuerpo grande', value: 'cuerpo-grande', img: 'assets/md-pPwUG-imgi-2-xs-ei17n-cali-overweight-man-d222a19857.webp' },
          { label: 'Con sobrepeso', value: 'con-sobrepeso', img: 'assets/md-L5Fw5-imgi-5-xs-hxdcp-cali-obese-man-45a30e9960.webp' }
        ]
      };

    // 7 — OBJETIVO CORPORAL
    case 7:
      return {
        type: 'grid-img',
        autoAdvance: true,
        progress: 42.1053,
        title: ['¿Cuál es tu objetivo corporal?'],
        options: fem ? [
          { label: 'Delgada', value: 'delgado', img: 'assets/fem-body-slim.jpg' },
          { label: 'Atlética', value: 'atletico', img: 'assets/fem-goal-toned.jpg' },
          { label: 'Marcada y Firme', value: 'marcado', img: 'assets/fem-goal-strong.jpg' },
          { label: 'Fuerte y Tonificada', value: 'fuerte', img: 'assets/fem-goal-strong.jpg' }
        ] : [
          { label: 'Delgado', value: 'delgado', img: 'assets/md-nsIwX-imgi-3-xs-9jzcs-cali-slim-man-14e2cc4e10.webp' },
          { label: 'Atlético', value: 'atletico', img: 'assets/md-fiJ0u-imgi-4-xs-vmi7i-cali-shredded-man1-575d735850.webp' },
          { label: 'Marcado', value: 'marcado', img: 'assets/md-vC8R0-imgi-4-xs-3iwwa-cali-shredded-man-7df7bef067.webp' },
          { label: 'Fuerte', value: 'fuerte', img: 'assets/md-8xMjX-imgi-5-xs-oh43h-cali-bodybuilder-man-54e5b933ee.webp' }
        ]
      };

    // 8 — IMPEDIMENTO
    case 8:
      return {
        type: 'grid-multi',
        autoAdvance: false,
        progress: 47.3684,
        title: ['¿Qué te impidió ponerte en forma antes?'],
        subtitle: 'Elige todas las opciones que apliquen.',
        options: [
          { label: 'Falta de motivación', value: 'falta-de-motivacion', img: 'assets/md-OXN2t-imgi-2-md-5i4g5-xs-hpgnk-1.webp' },
          { label: 'No tenía un plan correcto', value: 'no-tenia-un-plan-correcto', img: 'assets/md-02sSQ-imgi-3-md-rcdr6-xs-i4c0k-2.webp' },
          { label: 'Falta de tiempo', value: 'falta-de-tiempo', img: 'assets/md-rQj8h-imgi-4-md-zryal-xs-gmpyz-3.webp' },
          { label: 'Lesiones o dolores', value: 'lesiones-o-dolores', img: 'assets/md-L7u7l-imgi-5-md-bnizl-xs-2yjeg-4.webp' },
          { label: 'Ninguna de las opciones anteriores', value: 'ninguna-de-las-opciones-anteriores', img: 'assets/md-XOUDN-imgi-6-md-poffq-xs-on71a-5.webp' }
        ]
      };

    // 9 — FRECUENCIA
    case 9:
      return {
        type: 'green-list',
        autoAdvance: true,
        progress: 52.6316,
        title: ['Con qué frecuencia entrenaste en los últimos 3 meses?'],
        image: fem ? 'assets/fem-athlete-side.jpg' : 'assets/sm-O7YyD-imgi-13-sm-yf9zm-imgi-2-md-qprfb-443535635.webp',
        options: [
          { label: 'Casi todos los días', value: 'casi-todos-los-dias' },
          { label: 'Varias veces por semana', value: 'varias-veces-por-semana' },
          { label: 'Varias veces por mes', value: 'varias-veces-por-mes' },
          { label: 'No entrené', value: 'no-entrene' }
        ]
      };

    // 10 — DIFICULTAD
    case 10:
      return {
        type: 'list-img',
        autoAdvance: true,
        progress: 57.8947,
        title: ['Tienes dificultad con alguna de las siguientes áreas?'],
        
        options: [
          { label: 'Tensión o lesión en la parte superior de la espalda', value: 'tension-o-lesion-en-la-parte-superior-de-la-espalda', img: 'assets/md-8Q6ps-imgi-2-xs-d0oac-upper-back-pain-aec635d3dd.webp' },
          { label: 'Molestia en la zona lumba', value: 'molestia-en-la-zona-lumba', img: 'assets/md-TcoEN-imgi-3-xs-yfmvl-lower-back-pain-6ce968c0b1.webp' },
          { label: 'Dolor o sensibilidad en la rodilla', value: 'dolor-o-sensibilidad-en-la-rodilla', img: 'assets/md-XwTeN-imgi-4-xs-tgjhj-knee-pain-b98cef734e.webp' },
          { label: 'Problemas articulares en general', value: 'problemas-articulares-en-general', img: 'assets/md-ubF9F-imgi-5-xs-39ycy-joints-pain-8eec0eebca.webp' },
          { label: 'Otras o ninguna opción', value: 'otras-o-ninguna-opcion' }
        ]
      };

    // 11 — ALTURA
    case 11:
      return {
        type: 'ruler',
        autoAdvance: false,
        progress: 63.1579,
        title: ['CUÁL ES TU ALTURA?'],
        unit: ['cm', 'pol'],
        min: 140,
        max: 220,
        default: fem ? 165 : 180,
        hint: 'Desliza para ajustar'
      };

    // 12 — PESO ACTUAL
    case 12:
      return {
        type: 'ruler',
        autoAdvance: false,
        progress: 68.4211,
        title: ['Cuál es tu peso actual?'],
        unit: ['kg', 'lb'],
        min: 40,
        max: 250,
        default: fem ? 60 : 70,
        hint: 'Desliza para ajustar'
      };

    // 13 — PESO OBJETIVO
    case 13:
      return {
        type: 'ruler',
        autoAdvance: false,
        progress: 73.6842,
        title: ['Cuál es el peso que quieres alcanzar?'],
        unit: ['kg', 'lb'],
        min: 40,
        max: 250,
        default: fem ? 55 : 70,
        hint: 'Desliza para ajustar'
      };

    // 14 — CONTENT: VAMOS CREAR UN PLAN
    case 14:
      return {
        type: 'content',
        autoAdvance: false,
        progress: 78.9474,
        titleTag: 'h2',
        title: [
          'Con base en tu información, vamos crear un plan a tu medida para que alcances los <strong class="q-hl-box">{target}</strong> kg,',
          'en el menor tiempo posible.'
        ],
        subtitle: 'Enfoque, resultados y transformación – todo personalizado para que finalmente lo logres.'
      };

    // 15 — CHART
    case 15:
      return {
        type: 'chart',
        autoAdvance: false,
        progress: 84.2105,
        title: ['¡El único plan que necesitas para ponerte en forma en 21 días!'],
        subtitle: 'De acuerdo con tu información, estarás con {target} kg en 21 días.'
      };

    // 16 — PROCESSING
    case 16:
      return {
        type: 'processing',
        autoAdvance: false,
        progress: 89.4737,
        headline: 'PROCESANDO RECLUTAMIENTO',
        subtitle: 'Verificando compatibilidad para nueva operación...',
        bars: [
          { label: 'ANALISANDO PERFIL TÁCTICO', state: 'estado: Analizando' },
          { label: fem ? 'GENERANDO PROTOCOLO FEMENINO' : 'GENERANDO PROTOCOLO MILITAR' },
          { label: 'PREPARANDO TU MISIÓN DE 21 DIAS' },
          { label: 'FINALIZANDO TU RECLUTAMIENTO' }
        ],
        finalText: fem
          ? '<span style="color:rgb(5,150,105)">ya eligieron el</span> <span style="color:rgb(255,255,255)">Desafío de Calistenia Militar Femenina</span> <span style="color:rgb(5,150,105)">para transformar sus cuerpos.</span>'
          : '<span style="color:rgb(5,150,105)">ya eligieron el</span> <span style="color:rgb(255,255,255)">Desafío de Calistenia Militar</span> <span style="color:rgb(5,150,105)">para transformar sus cuerpos.</span>',
        finalBlockTitle: fem ? '50.000 MUJERES' : '50.000 HOMBRES',
        testimonials: [
          { title: '¡Me sorprendió muchísimo!', body: 'Siempre tuve miedo de los entrenamientos muy intensos, pero la Calistenia Militar respeta el cuerpo y al mismo tiempo te desafía.', avatar: 'assets/xs-8EdtE-imgi-3-xs-hczu6-219656347-4211384335623426-2101641038971319311-n.jpg' },
          { title: '¡Me encantó!', body: 'Siempre fui de hacer musculación, pero después de conocer la Calistenia Militar me di cuenta de que se puede entrenar en casa y a mi propio ritmo. Me siento más ligera, más activa y estoy viendo cómo mi cuerpo realmente cambia — sin necesidad de ningún aparato.' },
          { title: '¡Totalmente recomendable!', body: 'Nunca pensé que podía obtener resultados tan rápido entrenando en casa. La Calistenia Militar me dio disciplina, energía y una motivación que nunca tuve en el gimnasio. Ahora me siento más fuerte, más segura y cada día veo mejoras sin usar máquinas ni pesas.' }
        ]
      };

    // 17 — APPROVAL
    case 17:
      return {
        type: 'approval',
        autoAdvance: false,
        progress: 94.7368,
        headline: fem ? 'RECLUTA APROBADA' : 'RECLUTA APROBADO',
        subtitle: fem
          ? 'Tu perfil cumple con los requisitos para el Protocolo de Fuerzas Especiales Femeninas.'
          : 'Tu perfil cumple con los requisitos para el Protocolo de Fuerzas Especiales.',
        items: [
          { icon: '📋', title: 'Protocolo Generado', desc: 'Plan de entrenamiento adaptado a tu biotipo y objetivos actuales.' },
          { icon: '🎥', title: 'Acceso a Videos', desc: 'Biblioteca técnica con ejecución correcta de cada movimiento.' },
          { icon: '🔥', title: 'Garantía de Resultados', desc: 'Método probado en campo con tasa de éxito del 98%.' }
        ],
        buttonText: 'ACCEDER AL PROTOCOLO 🔓'
      };

    // 18 — VSL
    case 18:
      return {
        type: 'vsl',
        autoAdvance: false,
        progress: 100
      };

    default:
      return null;
  }
}

function progressPct(i){ return ((i+1)/TOTAL*100); }

function shellHeader(i){
  const step = getStep(i);
  const pct = Math.round(step && step.progress != null ? step.progress : progressPct(i));
  return `<div class="w-full mb-4">
    <div class="shell-logo"><img src="${LOGO}" alt="Calistenia Militar"${imgDim(LOGO)} decoding="async" fetchpriority="high"></div>
    <div class="progress-wrap">
      <div class="progress-info">
        <span class="step-num">PASO ${i+1} DE ${TOTAL}</span>
        <span class="step-pct">${pct}%</span>
      </div>
      <div class="progress-track" style="width:100%">
        <div class="bg"></div><div class="fill" style="width:${pct}%"></div>
      </div>
    </div>
  </div>`;
}

function renderStep(){
  const step = getStep(state.step);
  const app = document.getElementById('app');

  if (app.hasAttribute('data-prerendered')){
    app.removeAttribute('data-prerendered');
    state.lastStep = state.step;
    afterRender(step);
    return;
  }
  const isNew = state.step !== state.lastStep;
  state.lastStep = state.step;

  const isVsl = step && step.type === 'vsl';
  let html = `<div class="main-content"><div class="shell ${isNew?'fade-in':''}">`;
  if (isVsl && state.step > 0)
    html += `<button class="btn-back-tl" onclick="prevStep()" aria-label="Volver">‹</button>`;
  html += shellHeader(state.step);
  html += `<div class="shell-body">` + renderBody(step) + `</div>`;
  html += `<div class="shell-foot">`
    + (state.step > 0 && !isVsl ? `<button class="btn-back" onclick="prevStep()">‹ ANTERIOR</button>` : '')
    + `</div>`;
  html += `</div></div>`;
  app.innerHTML = html;
  afterRender(step);
}

function titleBlock(step){
  let h = '';
  const tag = step.titleTag || (step.prompt ? 'h2' : 'h1');
  if (step.title){
    const lines = [].concat(step.title);
    if (tag === 'h1+h2'){
      h += `<div class="q-h1"><div>${lines[0]}</div></div>`;
      if (lines.length>1) h += `<div class="q-h2">`
        + lines.slice(1).map(l=>`<div>${l}</div>`).join('') + `</div>`;
    } else {
      h += `<div class="${tag==='h2'?'q-h2':'q-h1'}">`
        + lines.map(l=>`<div>${l}</div>`).join('') + `</div>`;
    }
  }
  if (step.body){
    if (step.type === 'content'){
      h += `<div class="q-body3">`
        + [].concat(step.body).map(l=>`<h3>${l}</h3>`).join('') + `</div>`;
    } else {
      h += `<div class="q-body-lines">`
        + [].concat(step.body).map(l=>`<p>${l}</p>`).join('') + `</div>`;
    }
  }
  if (step.subtitle) h += `<p class="q-body${step.type==='grid-multi'?' q-body-green':''}">${step.subtitle}</p>`;
  if (step.prompt) h += `<div class="q-h1">${step.prompt}</div>`;
  return `<div class="content text break-words py-2">${h}</div>`;
}

function continueBtn(step){
  return `<div class="mt-5"><button class="btn-continue" onclick="nextStep()">Continuar</button></div>`;
}

function esc(s){ return String(s).replace(/"/g,'&quot;'); }

function gridSquare(step, multi){
  const chosen = multi ? (state.answers[state.step]||[]) : null;
  const eagerImg = state.step === 0;
  let g = `<div class="grid grid-cols-2 gap-2 mt-3">`;
  step.options.forEach(o=>{
    const sel = multi ? (chosen.includes(o.value)?'selected':'')
                      : (state.answers[state.step]===o.value?'selected':'');
    const sub = o.sub ? `<div class="opt-sub">${o.sub}</div>` : '';
    g += `<button type="button" class="opt-card sq ${sel}" data-value="${o.value}"
      onclick="selectOption('${o.value}'${multi?',true':''})">
      <div class="imgwrap"><img src="${o.img}" alt="${esc(o.label)}"${imgDim(o.img)} decoding="async" ${eagerImg?'loading="eager" fetchpriority="high"':'loading="lazy"'}></div>
      <div class="label"><div><div class="opt-label">${o.label}</div>${sub}</div></div>
    </button>`;
  });
  return g + `</div>`;
}

function listHoriz(step, multi){
  const chosen = multi ? (state.answers[state.step]||[]) : null;
  const dir = (step.type === 'grid-img') ? 'row-reverse' : 'row';
  let g = `<div class="flex flex-col gap-2 mt-3 opt-list-container">`;
  step.options.forEach(o=>{
    const sel = multi ? (chosen.includes(o.value)?'selected':'')
                      : (state.answers[state.step]===o.value?'selected':'');
    const labelHtml = `<p class="opt-p"><strong class="opt-strong">${o.label}</strong></p>`;
    const subHtml = o.sub ? `<p class="opt-p opt-p-sub"><em class="opt-sub-em">${o.sub}</em></p>` : '';
    const isSvg = o.img && o.img.endsWith('.svg');
    const img = o.img
      ? (isSvg
          ? `<div class="opt-iconbadge"><img src="${o.img}" alt="${esc(o.label)}" class="opt-svg-ico"></div>`
          : `<div class="opt-imgbox"><div class="opt-imgsq"><img src="${o.img}" alt="${esc(o.label)}"${imgDim(o.img)} decoding="async" loading="lazy"></div></div>`
        )
      : '';
    const check = multi
      ? `<span class="opt-check" aria-hidden="true">${sel?'<svg viewBox="0 0 24 24" fill="none"><path d="M5 12.5l4.5 4.5L19 7.5" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/></svg>':''}</span>`
      : '';
    const chev = (!multi && step.type === 'list-img')
      ? `<span class="opt-chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>`
      : '';
    g += `<button type="button" class="opt-card lh ${isSvg?'is-svg-card':''} ${o.sub?'has-sub':''} ${sel}" data-value="${o.value}"
      onclick="selectOption('${o.value}'${multi?',true':''})">
      <div class="opt-wrap" style="flex-direction:${dir}">
        ${img}
        <div class="opt-txt"><div class="opt-txt-inner">${labelHtml}${subHtml}</div>${check}${chev}</div>
      </div>
    </button>`;
  });
  return g + `</div>`;
}

function greenList(step){
  let b = `<div class="green-list mt-3"><div class="gl-col">`;
  step.options.forEach(o=>{
    const sel = state.answers[state.step]===o.value ? 'selected' : '';
    b += `<button type="button" class="gl-btn ${sel}" data-value="${o.value}"
      onclick="selectOption('${o.value}')">
      <span class="gl-lbl">${o.label}</span>
      <span class="gl-chev" aria-hidden="true"><svg viewBox="0 0 24 24" fill="none"><path d="M9 6l6 6-6 6" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/></svg></span>
    </button>`;
  });
  b += `</div>`;
  if (step.image) b += `<div class="gl-img"><img src="${step.image}" alt=""${imgDim(step.image)} decoding="async" loading="lazy"></div>`;
  return b + `</div>`;
}

function renderBody(step){
  if (!step) return '<div>[undefined]</div>';
  if (step.type === 'green-list'){
    return titleBlock(step) + greenList(step);
  }
  if (step.type === 'grid-multi'){
    return titleBlock(step) + listHoriz(step, true) + continueBtn(step);
  }
  if (step.type === 'grid-img'){
    const useGrid = step.layout === 'grid-square';
    return titleBlock(step) + (useGrid ? gridSquare(step,false) : listHoriz(step,false));
  }
  if (step.type === 'list-img'){
    return titleBlock(step) + listHoriz(step, false);
  }
  if (step.type === 'content'){
    const imgHtml = step.image
      ? `<div class="content-img"><img src="${step.image}" alt=""${imgDim(step.image)} decoding="async" loading="lazy"></div>` : '';
    let c = '';
    if (step.imageFirst && imgHtml) c += imgHtml;
    c += titleBlock(step);
    if (!step.imageFirst && imgHtml) c += imgHtml;
    const target = (state.answers[13] != null ? state.answers[13] : (isFemale() ? 55 : 70));
    return (c + continueBtn(step)).split('{target}').join(target);
  }
  if (step.type === 'ruler'){
    if (state.ruler[state.step] == null) state.ruler[state.step] = step.default;
    const ui = state.answers['unit_'+state.step] || 0;
    let b = titleBlock(step);
    b += `<div class="ruler-units">` + step.unit.map((un,idx)=>
      `<button type="button" class="ruler-unit ${idx===ui?'active':''}"
        onclick="setUnit(${idx})">${un}</button>`).join('') + `</div>`;
    b += `<div class="ruler-wrap">
      <div class="ruler-track" id="ruler-track"></div>
      <span class="ruler-value" id="ruler-val">${rulerDisplayText(step)}</span>
      <svg class="ruler-caret" viewBox="0 0 28 100" fill="none" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" clip-rule="evenodd" d="M16 2C16 0.89543 15.1046 0 14 0C12.8954 0 12 0.895431 12 2L12 85.4286L0 100H13.9944C13.9963 100 13.9981 100 14 100C14.0019 100 14.0037 100 14.0056 100H28L16 85.4286L16 2Z" fill="currentColor"></path></svg>
      </div>
      <p class="ruler-hint">${step.hint||'Desliza para ajustar'}</p>`;
    return b + continueBtn(step);
  }
  if (step.type === 'chart'){
    const current = (state.answers[12] != null ? state.answers[12] : (isFemale() ? 60 : 70));
    const target = (state.answers[13] != null ? state.answers[13] : (isFemale() ? 55 : 70));
    let b = `<div class="content text break-words py-2"><div class="q-h1">`
      + [].concat(step.title).map(l=>`<div>${l}</div>`).join('') + `</div>`;
    const sub = (step.subtitle || '').replace('{target}', target);
    const m = sub.match(/^(.*?d+)s*(kg.*)$/);
    const subHtml = m
      ? `<span class="chart-sub-a">${m[1]}</span><span class="chart-sub-b"> ${m[2]}</span>`
      : `<span class="chart-sub-a">${sub}</span>`;
    b += `<p class="q-body chart-sub">${subHtml}</p></div>`;
    b += progressChartSVG(current, target);
    return b + continueBtn(step);
  }
  if (step.type === 'processing'){
    return processingScreen(step);
  }
  if (step.type === 'approval'){
    let b = `<div class="content text break-words py-2">`;
    b += `<div class="q-h1"><div>🎖️</div></div>`;
    const heading = isFemale() ? '<div><strong>RECLUTA </strong><strong style="color:rgb(92,122,92)">APROBADA</strong></div>'
                               : '<div><strong>RECLUTA </strong><strong style="color:rgb(92,122,92)">APROBADO</strong></div>';
    b += `<div class="q-h1 appr-title">${heading}</div>`;
    if (step.subtitle) b += `<p class="q-body">${step.subtitle}</p>`;
    b += `</div><div class="flex flex-col gap-3 mt-4">`;
    (step.items||[]).forEach(it=>{
      b += `<div class="appr-item">
        <div class="appr-ico">${it.icon}</div>
        <div><div class="appr-it-title">${it.title}</div>
        <div class="appr-it-desc">${it.desc}</div></div></div>`;
    });
    b += `</div><div class="mt-5"><button class="btn-continue"
      onclick="nextStep(true)">${step.buttonText}</button></div>`;
    return b;
  }
  if (step.type === 'vsl'){
    return `<div class="opacity-40 text-center py-10">Cargando...</div>`;
  }
  return `<div class="opacity-40 text-center py-10">[${step.type}]</div>`;
}

function progressChartSVG(current, target){
  return `<div class="chart-shell">
    <svg width="448" height="252" viewBox="0 0 448 252" class="chart-svg recharts-surface">
      <defs>
        <clipPath id="recharts1-clip"><rect x="32" y="8" height="206" width="408"></rect></clipPath>
        <linearGradient id="gradient-0" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stop-color="#dc2626" stop-opacity="1"></stop>
          <stop offset="50%" stop-color="#fbbf24" stop-opacity="1"></stop>
          <stop offset="100%" stop-color="#22c55e" stop-opacity="1"></stop>
        </linearGradient>
      </defs>
      <g class="recharts-cartesian-grid">
        <g class="recharts-cartesian-grid-horizontal">
          <line x1="32" y1="12" x2="440" y2="12"></line>
          <line x1="32" y1="59.5" x2="440" y2="59.5"></line>
          <line x1="32" y1="111" x2="440" y2="111"></line>
          <line x1="32" y1="162.5" x2="440" y2="162.5"></line>
          <line x1="32" y1="214" x2="440" y2="214"></line>
        </g>
        <g class="recharts-cartesian-grid-vertical">
          <line x1="32" y1="8" x2="32" y2="214"></line>
          <line x1="236" y1="8" x2="236" y2="214"></line>
          <line x1="440" y1="8" x2="440" y2="214"></line>
        </g>
      </g>
      <g class="recharts-yaxis">
        <text x="18" y="214" text-anchor="end" class="chart-axis-txt">0</text>
        <text x="18" y="162.5" text-anchor="end" class="chart-axis-txt">25</text>
        <text x="18" y="111" text-anchor="end" class="chart-axis-txt">50</text>
        <text x="18" y="59.5" text-anchor="end" class="chart-axis-txt">75</text>
        <text x="18" y="12" text-anchor="end" class="chart-axis-txt">100</text>
      </g>
      <g class="recharts-xaxis">
        <text x="32" y="228" text-anchor="middle" class="chart-axis-txt">${current}</text>
        <text x="236" y="228" text-anchor="middle" class="chart-axis-txt"></text>
        <text x="440" y="228" text-anchor="middle" class="chart-axis-txt">${target}</text>
      </g>
      <path d="M32,193.4C100,186.533,168,179.667,236,152.2C304,124.733,372,76.667,440,28.6L440,214C372,214,304,214,236,214C168,214,100,214,32,214Z" fill="url(#gradient-0)" stroke="none" stroke-width="0" opacity="1"></path>
      <path d="M32,193.4C100,186.533,168,179.667,236,152.2C304,124.733,372,76.667,440,28.6" fill="none" stroke="#3182bd" stroke-width="0" opacity="1"></path>
      <path d="M32,193.4C100,186.533,168,179.667,236,152.2C304,124.733,372,76.667,440,28.6" fill="none" stroke="url(#gradient-0)" stroke-width="4"></path>
      <circle cx="32" cy="193.4" r="6" fill="#dc2626" stroke="#000" stroke-width="16" stroke-opacity="0.1"></circle>
      <circle cx="236" cy="152.2" r="8" fill="#fbbf24" stroke="#000" stroke-width="16" stroke-opacity="0.1"></circle>
      <circle cx="440" cy="28.6" r="6" fill="#22c55e" stroke="#000" stroke-width="16" stroke-opacity="0.1"></circle>
      <g><rect x="13" y="145.4" width="38" height="28" fill="#fff" stroke="#333333" stroke-width="1" rx="6" ry="6" opacity="1"></rect><text x="32" y="160.95555555555555" fill="#000" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="600">Tú</text></g>
      <g><rect x="389.5" y="-19.400000000000006" width="101" height="28" fill="#fff" stroke="#333333" stroke-width="1" rx="6" ry="6" opacity="1"></rect><text x="440" y="-3.8444444444444503" fill="#000" text-anchor="middle" dominant-baseline="middle" font-size="14" font-weight="600">Tu objetivo</text></g>
    </svg>
  </div>`;
}

function processingScreen(step){
  let b = `<div class="content text break-words py-2">`;
  b += `<div class="q-h1"><div>${step.headline}</div></div>`;
  b += `<p class="q-body">${step.subtitle}</p></div>`;
  b += `<div class="proc-bars">`;
  step.bars.forEach((bar,i)=>{
    b += `<div class="proc-row">
      <div class="proc-row-head"><span class="proc-label">${bar.label}</span>
        ${bar.state?`<span class="proc-state">${bar.state}</span>`:''}
        <span class="proc-pct" id="proc-pct-${i}">0%</span></div>
      <div class="proc-track"><div class="proc-fill" id="proc-fill-${i}"></div></div>
    </div>`;
  });
  b += `</div>`;
  b += `<div class="proc-final"><div class="q-h1"><div>${step.finalBlockTitle || '50.000 HOMBRES'}</div></div>
    <p class="q-body">${step.finalText}</p></div>`;
  b += `<div class="proc-testis" id="proc-testis">`;
  step.testimonials.forEach(t=>{
    const av = t.avatar
      ? `<img class="proc-testi-av" src="${t.avatar}" alt=""${imgDim(t.avatar)} decoding="async" loading="lazy">` : '';
    b += `<div class="proc-testi">
      <div class="proc-testi-head">
        ${av}
        <div class="proc-testi-meta">
          <div class="proc-stars">★★★★★</div>
          <div class="proc-testi-title">${t.title}</div>
        </div>
      </div>
      <div class="proc-testi-body">${t.body}</div></div>`;
  });
  b += `</div>`;
  return b;
}

function initTestiDrag(){
  const trk = document.getElementById('proc-testis');
  if (!trk) return;
  let down=false, sx=0, sl=0;
  trk.style.cursor='grab';
  trk.addEventListener('pointerdown', e=>{
    if(e.pointerType && e.pointerType!=='mouse') return;
    down=true; sx=e.clientX; sl=trk.scrollLeft; trk.style.cursor='grabbing';
    try{ trk.setPointerCapture(e.pointerId); }catch(_){}
  });
  trk.addEventListener('pointermove', e=>{ if(down) trk.scrollLeft = sl - (e.clientX - sx); });
  const end=e=>{ if(!down) return; down=false; trk.style.cursor='grab';
    try{ trk.releasePointerCapture(e.pointerId); }catch(_){} };
  trk.addEventListener('pointerup', end);
  trk.addEventListener('pointercancel', end);
  trk.addEventListener('pointerleave', end);
}

function isImperial(step){ return (state.answers['unit_'+state.step]||0) === 1; }
function rulerIsHeight(step){ return step.unit[1] === 'pol'; }

function feetInches(totalInches){
  const ft = Math.floor(totalInches/12), inch = Math.round(totalInches - ft*12);
  if (inch === 12) return (ft+1) + "'0\"";
  return ft + "'" + inch + '"';
}
function rulerDisplayText(step){
  const base = state.ruler[state.step];
  if (!isImperial(step)) return base + `<small>${step.unit[0]}</small>`;
  if (rulerIsHeight(step)) return feetInches(Math.round(base/2.54));
  return Math.round(base*2.20462) + `<small>${step.unit[1]}</small>`;
}
function rulerTickLabel(step, v){
  if (isImperial(step)){
    if (rulerIsHeight(step)) return feetInches(Math.round(v/2.54));
    return String(Math.round(v*2.20462));
  }
  return String(v);
}
window.setUnit = function(i){ state.answers['unit_'+state.step] = i; renderStep(); };

function initRuler(step){
  const track = document.getElementById('ruler-track');
  if (!track) return;
  const W = 15;
  const min = step.min, max = step.max;
  let h = '';
  for (let v=min; v<=max; v++){
    const off = v - min;
    const t = off%10===0 ? 'major' : (off%10===5 ? 'middle' : 'minor');
    h += `<div class="ruler-mark"><div class="line ${t}"></div>${t==='major'?`<div class="lbl">${rulerTickLabel(step,v)}</div>`:''}</div>`;
  }
  track.innerHTML = `<div class="ruler-pad"></div>` + h + `<div class="ruler-pad"></div>`;
  track.scrollLeft = (state.ruler[state.step] - min) * W;
  const upd = () => {
    const v = Math.max(min, Math.min(max, Math.round(min + track.scrollLeft / W)));
    state.ruler[state.step] = v;
    state.answers[state.step] = v;
    const el = document.getElementById('ruler-val');
    if (el) el.innerHTML = rulerDisplayText(step);
  };
  track.addEventListener('scroll', upd, { passive:true });

  let dragging=false, startX=0, startScroll=0;
  track.style.cursor='grab';
  track.addEventListener('pointerdown', e=>{
    if(e.pointerType && e.pointerType!=='mouse') return;
    dragging=true; startX=e.clientX; startScroll=track.scrollLeft;
    track.style.cursor='grabbing';
    try{ track.setPointerCapture(e.pointerId); }catch(_){}
  });
  track.addEventListener('pointermove', e=>{
    if(!dragging) return;
    track.scrollLeft = startScroll - (e.clientX - startX);
  });
  const end = e=>{ if(!dragging) return; dragging=false; track.style.cursor='grab';
    try{ track.releasePointerCapture(e.pointerId); }catch(_){}
    const v = Math.max(min, Math.min(max, Math.round(min + track.scrollLeft / W)));
    track.scrollTo({ left:(v-min)*W, behavior:'smooth' });
  };
  track.addEventListener('pointerup', end);
  track.addEventListener('pointercancel', end);
  track.addEventListener('pointerleave', end);
  upd();
}

function initCardTouch(step){
  const cards = [...document.querySelectorAll('.opt-card[data-value]')];
  if (!cards.length) return;
  const multi = step.type === 'grid-multi';
  const at = (x,y)=>{ const el=document.elementFromPoint(x,y); return el?el.closest('.opt-card[data-value]'):null; };
  const hov = c => { cards.forEach(k=>k.classList.toggle('touch-hover', k===c)); };
  const clr = () => cards.forEach(k=>k.classList.remove('touch-hover'));

  let active=false,start=null,startCard=null,moved=false;
  const grid = cards[0].parentElement;
  grid.addEventListener('touchstart',e=>{active=true;moved=false;const t=e.touches[0];
    start={x:t.clientX,y:t.clientY};startCard=at(t.clientX,t.clientY);hov(startCard);},{passive:true});
  grid.addEventListener('touchmove',e=>{if(!active)return;const t=e.touches[0];
    if(Math.abs(t.clientX-start.x)>10||Math.abs(t.clientY-start.y)>10)moved=true;
    hov(at(t.clientX,t.clientY));},{passive:true});
  grid.addEventListener('touchend',e=>{active=false;const t=e.changedTouches[0];const c=at(t.clientX,t.clientY);clr();
    if(moved&&c&&c!==startCard&&c.dataset.value){ selectOption(c.dataset.value, multi); }},{passive:true});
  grid.addEventListener('touchcancel',()=>{active=false;clr();},{passive:true});
}

// Rastreamento de passos personalizados do Quiz no Meta Pixel
var firedQuizEvents = {};

function trackQuizStep(stepIdx) {
  var quizNum = stepIdx + 1;
  var eventName = 'Quiz_' + quizNum;
  if (!firedQuizEvents[quizNum]) {
    firedQuizEvents[quizNum] = true;
    if (window.fbq) {
      try {
        fbq('trackCustom', eventName, {
          step: quizNum,
          step_index: stepIdx
        });
        console.log('[Meta Pixel] Disparado evento personalizado: ' + eventName);
      } catch(err) {}
    }
  }
}

function afterRender(step){
  trackQuizStep(state.step);
  if (step && step.type === 'ruler') initRuler(step);
  if (step && (step.type === 'grid-img' || step.type === 'grid-multi')) initCardTouch(step);
  if (step && step.type === 'processing') initProcessing(step);
  if (step && step.type === 'vsl') gotoVsl();
}

function gotoVsl(){
  if (window.fbq) {
    try {
      fbq('trackCustom', 'Quiz_Concluido', { total_steps: TOTAL });
      fbq('track', 'Lead');
    } catch(err) {}
  }
  const qs = (window.__funnelQSString && window.__funnelQSString()) || '';
  const currentParams = new URLSearchParams(window.location.search);
  const targetPage = currentParams.get('dest') === 'vsl' ? 'vsl' : 'tsl';
  window.location.href = targetPage + (qs ? '?' + qs : '');
}

function initProcessing(step){
  const myStep = state.step;
  initTestiDrag();
  const n = step.bars.length;
  const durs = [2300, 4600, 6800, 9000];
  let done = 0;
  step.bars.forEach((bar,i)=>{
    const fill = document.getElementById('proc-fill-'+i);
    const pct = document.getElementById('proc-pct-'+i);
    if (!fill) return;
    const dur = durs[i] || 2800; const t0 = Date.now();
    const id = setInterval(()=>{
      if (state.step !== myStep){ clearInterval(id); return; }
      const p = Math.min(1, (Date.now() - t0) / dur);
      const v = Math.round(p*100);
      fill.style.width = v + '%';
      if (pct) pct.textContent = v + '%';
      if (p >= 1){
        clearInterval(id);
        done++;
        if (done === n) setTimeout(()=>{ if (state.step === myStep) nextStep(true); }, 750);
      }
    }, 60);
  });
}

let lastStepChangeAt = 0;
const NAV_GUARD_MS = 400;
const justNavigated = () => Date.now() - lastStepChangeAt < NAV_GUARD_MS;

window.selectOption = function(val, multi=false){
  if (justNavigated()) return;
  const step = getStep(state.step);
  if (multi){
    const cur = state.answers[state.step] || [];
    const k = cur.indexOf(val);
    if (k>-1) cur.splice(k,1); else cur.push(val);
    state.answers[state.step] = cur; renderStep();
  } else {
    state.answers[state.step] = val;
    if (step.autoAdvance) nextStep(); else renderStep();
  }
};

window.nextStep = function(force){
  const step = getStep(state.step);
  if (step && !force){
    if (justNavigated()) return;
    if (step.type === 'grid-multi' && !((state.answers[state.step]||[]).length)) return;
    if ((step.type === 'grid-img' || step.type === 'list-text' || step.type === 'list-img')
        && !state.answers[state.step]) return;
  }
  if(state.step < TOTAL - 1){
    state.step++;
    lastStepChangeAt = Date.now();
    scrollTo(0,0);
    renderStep();
  }
};

window.prevStep = function(){
  if (justNavigated()) return;
  if(state.step > 0){
    state.step--;
    lastStepChangeAt = Date.now();
    scrollTo(0,0);
    renderStep();
  }
};

renderStep();
