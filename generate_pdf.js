const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'Manual_Oficial_Protocolo_Calistenia.pdf');
const logoPath = path.join(__dirname, 'assets', 'logo_hotmart_600x600.jpg');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 40, right: 40 },
  bufferPages: true
});

let pCount = 1;
doc.on('pageAdded', () => {
  pCount++;
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

// Cores táticas
const C_DARK = '#0a0d0a';
const C_GREEN = '#15803d';
const C_GREEN_LIGHT = '#22c55e';
const C_GOLD = '#d97706';
const C_GRAY = '#374151';
const C_LIGHT_GRAY = '#6b7280';
const C_BG_BOX = '#f0fdf4';
const C_BORDER_BOX = '#86efac';

// Helper: cabeçalho e rodapé em páginas internas
function addPageDecoration(pageNum, pageTitle) {
  const savedY = doc.y;
  const savedBottom = doc.page.margins.bottom;
  const savedTop = doc.page.margins.top;
  doc.page.margins.bottom = 0;
  doc.page.margins.top = 0;

  // Barra superior
  doc.rect(40, 24, doc.page.width - 80, 2).fill(C_GREEN);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GRAY).text('PROTOCOLO DE CALISTENIA MILITAR • MANUAL OPERATIVO & AUTORÍA', 40, 14, {
    width: doc.page.width - 80,
    align: 'left',
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GREEN).text('HOTMART OFICIAL', 40, 14, {
    width: doc.page.width - 80,
    align: 'right',
    lineBreak: false
  });

  // Linha inferior
  const footerY = doc.page.height - 24;
  doc.rect(40, footerY - 4, doc.page.width - 80, 0.8).fill('#e5e7eb');
  doc.font('Helvetica').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Documento Oficial de Entrega • ${pageTitle}`, 40, footerY, {
    width: doc.page.width - 80,
    align: 'left',
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Página ${pageNum} de 6`, 40, footerY, {
    width: doc.page.width - 80,
    align: 'right',
    lineBreak: false
  });

  doc.page.margins.bottom = savedBottom;
  doc.page.margins.top = savedTop;
  doc.y = savedY;
}

// ==========================================
// PÁGINA 1: CAPA OFICIAL
// ==========================================
doc.rect(0, 0, doc.page.width, doc.page.height).fill('#050705');
doc.rect(20, 20, doc.page.width - 40, doc.page.height - 40).lineWidth(1.2).strokeColor(C_GREEN).stroke();

if (fs.existsSync(logoPath)) {
  doc.image(logoPath, (doc.page.width - 140) / 2, 90, { width: 140 });
}

doc.y = 250;
doc.font('Helvetica-Bold').fontSize(24).fillColor('#ffffff').text('PROTOCOLO DE', { align: 'center' });
doc.fontSize(28).fillColor(C_GREEN_LIGHT).text('CALISTENIA MILITAR', { align: 'center' });
doc.moveDown(0.3);
doc.font('Helvetica').fontSize(13).fillColor('#d1d5db').text('PROGRAMA DE 21 DÍAS DE TRANSFORMACIÓN FÍSICA', { align: 'center' });

doc.moveDown(1);
doc.fontSize(10).fillColor('#9ca3af').text('MANUAL OPERATIVO DE ACCESO, METODOLOGÍA Y AUTORÍA', { align: 'center' });
doc.fontSize(9.5).fillColor(C_GOLD).text('LICENCIA DE SOFTWARE • TECNOLOGÍA PWA • HOTMART 2026', { align: 'center' });

const boxY = doc.page.height - 160;
doc.roundedRect(50, boxY, doc.page.width - 100, 85, 6)
   .lineWidth(1)
   .fillAndStroke('#0d110d', '#1f2937');

doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#ffffff').text('CENTRO DE MANDO TÁCTICO & COMUNIDAD HERMANDAD', 50, boxY + 14, {
  width: doc.page.width - 100,
  align: 'center'
});
doc.font('Helvetica').fontSize(8.5).fillColor('#9ca3af').text('Acceso Oficial Web / PWA: https://protocolo-calistenia.netlify.app/app/', 50, boxY + 32, {
  width: doc.page.width - 100,
  align: 'center'
});
doc.font('Helvetica-Bold').fontSize(8).fillColor(C_GREEN_LIGHT).text('Válido para Android, iOS (iPhone/iPad) y Ordenador • Garantía 7 Días', 50, boxY + 48, {
  width: doc.page.width - 100,
  align: 'center'
});
doc.font('Helvetica').fontSize(7.5).fillColor('#6b7280').text('Hotmart Product ID: T108488175Q • Todos los derechos reservados', 50, boxY + 64, {
  width: doc.page.width - 100,
  align: 'center'
});

// ==========================================
// PÁGINA 2: DECLARACIÓN FORMAL DE AUTORÍA
// ==========================================
doc.addPage();
addPageDecoration(2, 'Declaración de Autoría y Licencia');

doc.y = 42;
doc.font('Helvetica-Bold').fontSize(15).fillColor(C_DARK).text('1. Declaración Formal de Autoría y Propiedad Intelectual');
doc.moveDown(0.3);

// Caixa Jurídica
doc.roundedRect(40, doc.y, doc.page.width - 80, 70, 5).fillAndStroke('#f8fafc', '#cbd5e1');
doc.font('Helvetica-Bold').fontSize(9).fillColor('#0f172a').text('CERTIFICACIÓN DE TITULARIDAD EXCLUSIVA PARA HOTMART:', 52, doc.y + 10);
doc.font('Helvetica').fontSize(8).fillColor('#334155').text(
  'Por medio del presente documento se certifica ante Hotmart BV y el público que el producto "Protocolo de Calistenia Militar", compuesto por su software interactivo (Progressive Web Application), rutinas de entrenamiento, algoritmos de cálculo nutricional, material audiovisual y diseño gráfico, es una obra de creación original y legítima.',
  52, doc.y + 24, { width: doc.page.width - 104, lineGap: 1.5 }
);

doc.y = 150;
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_GREEN).text('Términos de Licencia y Protección Legal:');
doc.moveDown(0.3);

const legalPoints = [
  {
    t: 'Licencia de Uso Personal e Intransferible:',
    d: 'Al adquirir este producto a través de la plataforma Hotmart, el comprador recibe una licencia individual de software y contenido para uso personal exclusivo en su entrenamiento diario.'
  },
  {
    t: 'Prohibición Expresa de Piratería y Distribución:',
    d: 'Queda estrictamente prohibida la redistribución, reventa, copia total o parcial del software, ingeniería inversa del código fuente o comercialización en plataformas no autorizadas.'
  },
  {
    t: 'Arquitectura Tecnológica del Software:',
    d: 'El aplicativo funciona bajo tecnología Progressive Web App (PWA) de última generación, permitiendo acceso nativo tanto en navegadores móviles (Chrome/Safari) como instalación de pantalla completa sin necesidad de descarga forzosa en tiendas de terceros.'
  },
  {
    t: 'Seguridad y Privacidad de Datos:',
    d: 'Los datos biométricos, progreso diario y registros fotográficos de los usuarios están protegidos bajo protocolos de cifrado y aislamiento estricto de base de datos PostgreSQL con Row Level Security (RLS).'
  }
];

legalPoints.forEach(p => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#1e293b').text(`• ${p.t}`);
  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(p.d, { indent: 10, lineGap: 1 });
  doc.moveDown(0.25);
});

doc.moveDown(0.4);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_GREEN).text('Identificación del Producto en Hotmart:');
doc.moveDown(0.3);

const specs = [
  ['Nombre Comercial:', 'Protocolo de Calistenia Militar: 21 Días de Transformación'],
  ['Código de Checkout Hotmart:', 'T108488175Q'],
  ['Formato Técnico:', 'Aplicativo Móvil / Progressive Web App (PWA) + Guía PDF'],
  ['Garantía Oficial:', '7 Días Incondicionales respaldados por Hotmart'],
  ['Soporte Autorizado:', 'soporte@protocolocalistenia.com']
];

specs.forEach(([k, v]) => {
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#374151').text(k, 50, doc.y, { continued: true });
  doc.font('Helvetica').fillColor('#111827').text(`  ${v}`);
  doc.y += 2;
});

// ==========================================
// PÁGINA 3: ACCESO AL APP Y CENTRO DE MANDO
// ==========================================
doc.addPage();
addPageDecoration(3, 'Instrucciones de Acceso al Software');

doc.y = 42;
doc.font('Helvetica-Bold').fontSize(15).fillColor(C_DARK).text('2. Centro de Mando Táctico: Instrucciones de Acceso');
doc.moveDown(0.3);

doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Tu entrenamiento interactivo está disponible en tiempo real en la plataforma digital. Puedes acceder desde cualquier smartphone, tableta o computadora con conexión a Internet:',
  { lineGap: 1.5 }
);

doc.moveDown(0.5);

// Caixa Verde do Link de Acesso
doc.roundedRect(40, doc.y, doc.page.width - 80, 52, 6).fillAndStroke(C_BG_BOX, C_BORDER_BOX);
const linkBoxY = doc.y;
doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_GREEN).text('ENLACE DIRECTO DE ACCESO OFICIAL:', 52, linkBoxY + 11);
doc.font('Helvetica-Bold').fontSize(11).fillColor('#0f172a').text('https://protocolo-calistenia.netlify.app/app/', 52, linkBoxY + 26);

doc.y = linkBoxY + 68;

doc.font('Helvetica-Bold').fontSize(11.5).fillColor(C_DARK).text('Cómo Instalar el App en la Pantalla de tu Celular (PWA)');
doc.moveDown(0.4);

// Coluna Android vs iPhone
const colWidth = (doc.page.width - 95) / 2;
const col1X = 40;
const col2X = col1X + colWidth + 15;
const stepsTopY = doc.y;

// Box Android
doc.roundedRect(col1X, stepsTopY, colWidth, 160, 5).fillAndStroke('#f8fafc', '#e2e8f0');
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#15803d').text('En Android (Google Chrome):', col1X + 10, stepsTopY + 10);
const androidSteps = [
  '1. Abre Chrome y entra al enlace oficial.',
  '2. Pulsa en los tres puntos verticales (esquina superior derecha).',
  '3. Selecciona "Instalar aplicación" o "Añadir a la pantalla principal".',
  '4. Pulsa "Instalar" para confirmar.',
  '5. El ícono aparecerá junto a tus otras aplicaciones como app nativa.'
];
let aY = stepsTopY + 28;
androidSteps.forEach(s => {
  doc.font('Helvetica').fontSize(7.5).fillColor('#334155').text(s, col1X + 10, aY, { width: colWidth - 20, lineGap: 1.2 });
  aY += 25;
});

// Box iOS
doc.roundedRect(col2X, stepsTopY, colWidth, 160, 5).fillAndStroke('#f8fafc', '#e2e8f0');
doc.font('Helvetica-Bold').fontSize(9.5).fillColor('#15803d').text('En iPhone / iPad (Safari):', col2X + 10, stepsTopY + 10);
const iosSteps = [
  '1. Abre Safari y accede al enlace oficial.',
  '2. Toca el botón central de Compartir (icono de cuadrado con flecha).',
  '3. Desplázate hacia abajo y selecciona "Agregar al inicio" (+).',
  '4. Toca "Agregar" en la esquina superior derecha.',
  '5. La app se abrirá en pantalla completa sin barras de navegador.'
];
let iY = stepsTopY + 28;
iosSteps.forEach(s => {
  doc.font('Helvetica').fontSize(7.5).fillColor('#334155').text(s, col2X + 10, iY, { width: colWidth - 20, lineGap: 1.2 });
  iY += 25;
});

doc.y = stepsTopY + 175;
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C_DARK).text('Ventajas del Centro de Mando Táctico:');
doc.moveDown(0.25);

const pwaPerks = [
  '• Cronómetro Táctico y Audio Militar: Sincronización exacta de tempos de contracción muscular.',
  '• Animaciones Biomecánicas: Muestran la postura exacta para evitar lesiones articulares.',
  '• Medallas de Prestigio y Rangos: Oro, Plata y Bronce conforme completas tus sesiones.',
  '• Calculadora Táctica de Macronutrientes: Adapta tus gramos de proteína según tu peso y objetivo.'
];

pwaPerks.forEach(pk => {
  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(pk, { lineGap: 1.2 });
});

// ==========================================
// PÁGINA 4: METODOLOGÍA DEL PROGRAMA 21 DÍAS
// ==========================================
doc.addPage();
addPageDecoration(4, 'Estructura de las 3 Fases de Entrenamiento');

doc.y = 42;
doc.font('Helvetica-Bold').fontSize(15).fillColor(C_DARK).text('3. Estructura Táctica del Programa (21 Días)');
doc.moveDown(0.3);

doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'El protocolo no requiere gimnasio ni pesas. Emplea la cadencia de esfuerzo militar (3-1-2: 3 segundos excéntricos, 1 segundo isométrico de tensión máxima y 2 segundos concéntricos explosivos) para reclutar fibras musculares tipo II sin desgaste articular.',
  { lineGap: 1.5 }
);

doc.moveDown(0.6);

const phases = [
  {
    num: 'FASE 1: RECLUTAMIENTO & DESCOMPRESIÓN ARTICULAR (DÍAS 1 AL 7)',
    focus: 'Objetivo: Despertar neuromuscular y blindaje de articulaciones.',
    desc: 'Sesiones enfocadas en reeducar la postura, eliminar rigidez en hombros y espalda baja, y sentar las bases de la fuerza isométrica. Los ejercicios activan el abdomen profundo (transverso abdominal) y el serrato anterior.',
    rutina: 'Rutina Base: Sentadillas tácticas con pausa isométrica, flexiones de rodillas controladas, puente de glúteo militar y plancha hueca (Hollow Body). 3 series de 10-12 repeticiones.'
  },
  {
    num: 'FASE 2: SOBRECARGA PROGRESIVA ISOMÉTRICA (DÍAS 8 AL 14)',
    focus: 'Objetivo: Hipertrofia funcional y densidad muscular.',
    desc: 'Aumento deliberado del Tiempo Bajo Tensión (TUT). Se introducen variaciones en ángulos cerrados (flexiones diamante, estocadas militares y fondos en superficie rígida). El metabolismo se acelera quemando glucógeno y reservas lipídicas.',
    rutina: 'Rutina Base: Flexiones tempo 3-1-2, sentadillas profundas sin bloqueo articular, remos invertidos caseros y escaladores militares lentos. 4 series de 12-15 repeticiones.'
  },
  {
    num: 'FASE 3: DEFINICIÓN EXTREMA & CAPACIDAD TÁCTICA (DÍAS 15 AL 21)',
    focus: 'Objetivo: Secado de grasa subcutánea y resistencia de élite.',
    desc: 'Circuitos militares de alta densidad metabólica. Intervalos de trabajo de 45 segundos con 15 segundos de descanso activo. Se consolida el relieve muscular en pectorales, brazos y core abdominal.',
    rutina: 'Rutina Base: Burpees tácticos sin impacto, flexiones arqueras/declinadas, zancadas explosivas y retención de plancha militar de 60 segundos. 4 rondas continuas.'
  }
];

phases.forEach(ph => {
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_GREEN).text(ph.num);
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#0f172a').text(ph.focus);
  doc.font('Helvetica').fontSize(7.5).fillColor(C_GRAY).text(ph.desc, { lineGap: 1.2 });
  doc.moveDown(0.15);
  doc.font('Helvetica-Oblique').fontSize(7.5).fillColor('#1e3a1e').text(ph.rutina, { lineGap: 1.2 });
  doc.moveDown(0.5);
});

// ==========================================
// PÁGINA 5: NUTRICIÓN TÁCTICA Y DIETA
// ==========================================
doc.addPage();
addPageDecoration(5, 'Guía de Nutrición Táctica y Macronutrientes');

doc.y = 42;
doc.font('Helvetica-Bold').fontSize(15).fillColor(C_DARK).text('4. Protocolo Nutricional: Recomposición Rápida');
doc.moveDown(0.3);

doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'El 70% de la definición física se decide en la cocina. El protocolo descarta dietas extremas que destruyen masa muscular y utiliza el principio militar de sincronización proteica.',
  { lineGap: 1.5 }
);

doc.moveDown(0.5);

// Tabela de Macros
doc.roundedRect(40, doc.y, doc.page.width - 80, 95, 5).fillAndStroke('#f8fafc', '#cbd5e1');
const tableTop = doc.y;

doc.font('Helvetica-Bold').fontSize(9).fillColor(C_DARK).text('REGLAS FUNDAMENTALES DE MACRONUTRIENTES:', 52, tableTop + 8);

const macroRows = [
  ['Proteína Táctica (2.0g a 2.2g por kg):', 'Huevos enteros, pechuga de pollo, atún, carne magra y legumbres. Repartir en 3-4 comidas para mantener síntesis de masa limpia.'],
  ['Carbohidratos Complejos Estratégicos:', 'Avena, arroz, papas y boniato. Consumir el 60% de tus carbohidratos en la ventana de 3 horas previas y posteriores al entrenamiento.'],
  ['Grasas Esenciales Reguladoras:', 'Aceite de oliva virgen, aguacate y frutos secos para producción óptima de testosterona y recuperación articular.'],
  ['Regla de Hidratación Militar:', '35ml a 40ml de agua pura por kilogramo de peso corporal al día. Añadir una pizca de sal marina al agua matutina para reponer electrolitos.']
];

let mY = tableTop + 22;
macroRows.forEach(([k, v]) => {
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GREEN).text(k, 52, mY);
  doc.font('Helvetica').fontSize(7.5).fillColor(C_GRAY).text(v, 52, mY + 9, { width: doc.page.width - 104, lineGap: 1 });
  mY += 17;
});

doc.y = tableTop + 108;
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C_DARK).text('Scanner Nutricional por Foto (IA) - Módulo VIP');
doc.moveDown(0.25);

doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(
  'Si activaste el acceso al Scanner Nutricional Táctico con Inteligencia Artificial, no necesitas pesar la comida en báscula. Abre el Centro de Mando Táctico, apunta la cámara de tu celular a tu plato y la red neuronal segmentará las porciones de macronutrientes al instante.',
  { lineGap: 1.3 }
);

doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(10.5).fillColor(C_DARK).text('Ejemplo de Menú Militar de 1 Día:');
doc.moveDown(0.25);

const mealPlan = [
  '• Desayuno (08:00): 3 huevos revueltos con espinacas + 1 taza de avena con canela y agua.',
  '• Almuerzo (13:00): 180g de pechuga de pollo a la plancha + 1 taza de arroz blanco + ensalada verde con aceite de oliva.',
  '• Merienda Pre-Entreno (17:00): 1 manzana verde o plátano + 20g de frutos secos (almendras o nueces).',
  '• Cena Post-Entreno (20:30): 180g de pescado o carne magra + batata al horno con verduras al vapor.'
];

mealPlan.forEach(mp => {
  doc.font('Helvetica').fontSize(7.8).fillColor('#334155').text(mp, { lineGap: 1.5 });
});

// ==========================================
// PÁGINA 6: SOPORTE Y GARANTÍA HOTMART
// ==========================================
doc.addPage();
addPageDecoration(6, 'Atención al Cliente, Soporte y Garantía');

doc.y = 42;
doc.font('Helvetica-Bold').fontSize(15).fillColor(C_DARK).text('5. Soporte Técnico, Dudas y Garantía');
doc.moveDown(0.3);

// Box Garantia 7 Dias
doc.roundedRect(40, doc.y, doc.page.width - 80, 75, 6).fillAndStroke('#eff6ff', '#bfdbfe');
const guarBoxY = doc.y;
doc.font('Helvetica-Bold').fontSize(10.5).fillColor('#1e40af').text('GARANTÍA INCONDICIONAL DE SATISFACCIÓN (7 DÍAS)', 52, guarBoxY + 10);
doc.font('Helvetica').fontSize(8).fillColor('#1e3a8a').text(
  'De acuerdo con las políticas internacionales de protección al comprador de Hotmart y las leyes de comercio electrónico, dispones de 7 días naturales a partir del momento de tu compra para probar el Protocolo de Calistenia Militar. Si por cualquier motivo no estás 100% satisfecho con los entrenamientos o el software, puedes solicitar el reembolso completo sin preguntas.',
  52, guarBoxY + 25, { width: doc.page.width - 104, lineGap: 1.5 }
);

doc.y = guarBoxY + 88;
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_DARK).text('Canales Oficiales de Atención:');
doc.moveDown(0.3);

const supportChannels = [
  ['Correo Electrónico de Soporte:', 'soporte@protocolocalistenia.com'],
  ['Horario de Atención:', 'Lunes a Viernes de 09:00 a 18:00 (Tiempo de respuesta < 24h)'],
  ['Portal de Solicitudes Hotmart:', 'https://help.hotmart.com/'],
  ['Comunidad de Reclutas:', 'Acceso disponible dentro del Centro de Mando Táctico']
];

supportChannels.forEach(([label, val]) => {
  doc.font('Helvetica-Bold').fontSize(8).fillColor('#1f2937').text(label, 45, doc.y, { continued: true });
  doc.font('Helvetica').fillColor('#15803d').text(`  ${val}`);
  doc.y += 2.5;
});

doc.moveDown(0.5);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_DARK).text('Preguntas Frecuentes (FAQ):');
doc.moveDown(0.3);

const faqs = [
  {
    q: '¿Qué pasa si tengo sobrepeso o nunca he hecho ejercicio?',
    a: 'El aplicativo adapta cada ejercicio con variaciones para principiantes desde nivel cero para proteger tus rodillas y columna.'
  },
  {
    q: '¿Tengo que pagar suscripciones mensuales obligatorias?',
    a: 'No. Tu acceso al Protocolo de 21 Días es de pago único y vitalicio. Solo pagarás mensualidad si decidiste contratar opcionalmente la Hermandad VIP.'
  },
  {
    q: '¿Puedo usar el protocolo sin conexión a internet?',
    a: 'Sí. Al instalar la aplicación como PWA en tu teléfono, las rutinas quedan almacenadas en la memoria local de tu dispositivo.'
  }
];

faqs.forEach(f => {
  doc.font('Helvetica-Bold').fontSize(8.5).fillColor('#1e293b').text(`P: ${f.q}`);
  doc.font('Helvetica').fontSize(7.5).fillColor(C_GRAY).text(`R: ${f.a}`, { lineGap: 1.2 });
  doc.moveDown(0.25);
});

// Finalização
doc.end();

stream.on('finish', () => {
  console.log(`[SUCESSO] PDF gerado perfeitamente! Total exato de páginas: ${pCount}`);
});
