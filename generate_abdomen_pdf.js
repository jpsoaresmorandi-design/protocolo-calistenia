const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, 'Finisher_Abdomen_7Minutos.pdf');
const logoPath = path.join(__dirname, 'assets', 'logo_hotmart_600x600.jpg');

const doc = new PDFDocument({
  size: 'A4',
  margins: { top: 35, bottom: 35, left: 40, right: 40 },
  bufferPages: true
});

const stream = fs.createWriteStream(outputPath);
doc.pipe(stream);

const C_DARK = '#0a0d0a';
const C_GREEN = '#15803d';
const C_GREEN_LIGHT = '#22c55e';
const C_GOLD = '#d97706';
const C_GRAY = '#374151';
const C_LIGHT_GRAY = '#6b7280';
const C_BG_BOX = '#f0fdf4';
const C_BORDER_BOX = '#86efac';

function addHeaderFooter(pageNum, pageTitle) {
  const savedBottom = doc.page.margins.bottom;
  const savedTop = doc.page.margins.top;
  doc.page.margins.bottom = 0;
  doc.page.margins.top = 0;

  // Barra superior
  doc.rect(40, 24, doc.page.width - 80, 2).fill(C_GOLD);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GRAY).text('FINISHER ABDOMEN DE ACERO (7 MIN) • MÓDULO ESPECIAL DE DEFINICIÓN', 40, 14, {
    width: doc.page.width - 80,
    align: 'left',
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GOLD).text('HOTMART ORDER BUMP OFICIAL', 40, 14, {
    width: doc.page.width - 80,
    align: 'right',
    lineBreak: false
  });

  // Linha inferior
  const footerY = doc.page.height - 24;
  doc.rect(40, footerY - 4, doc.page.width - 80, 0.8).fill('#e5e7eb');
  doc.font('Helvetica').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Módulo Adicional Autorizado • ${pageTitle}`, 40, footerY, {
    width: doc.page.width - 80,
    align: 'left',
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_DARK).text(`Página ${pageNum} de 3`, 40, footerY, {
    width: doc.page.width - 80,
    align: 'right',
    lineBreak: false
  });

  doc.page.margins.bottom = savedBottom;
  doc.page.margins.top = savedTop;
}

// ========================================================
// PÁGINA 1: PORTADA & FUNDAMENTOS DE FISIOLOGÍA MILITAR
// ========================================================
doc.rect(40, 35, doc.page.width - 80, 100).fill('#0f1710');

if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 52, 45, { width: 78, height: 78 });
  } catch(e) {}
}

doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_GOLD).text('MÓDULO DE ACELERACIÓN TÁCTICA • HOTMART VERIFIED', 145, 48);
doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text('FINISHER ABDOMEN DE ACERO', 145, 62);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_GREEN_LIGHT).text('RUTINA DE ALTA TENSIÓN ISOMÉTRICA EN 7 MINUTOS', 145, 82);
doc.font('Helvetica').fontSize(8.5).fillColor('#9ca3af').text('Protocolo de activación de core profundo para quemar grasa rebelde y compactar la faja abdominal.', 145, 98, { width: 380 });

doc.y = 145;

doc.rect(40, doc.y, doc.page.width - 80, 52).fillAndStroke(C_BG_BOX, C_BORDER_BOX);
const boxY = doc.y + 8;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GREEN).text('FICHA TÉCNICA DEL MÓDULO', 50, boxY);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Enfoque: Transverso abdominal, recto mayor y oblicuos internos/externos.', 50, boxY + 14);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Duración: 7 minutos exactos (6 ejercicios • 45s trabajo / 15s pausa activa).', 50, boxY + 26);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Frecuencia: 4 a 5 veces por semana al terminar tu sesión diaria de calistenia.', 50, boxY + 38);

doc.y = 208;
doc.font('Helvetica-Bold').fontSize(12).fillColor(C_DARK).text('1. La Ciencia del Core Militar: ¿Por Qué los Abdominales Comunes Fallan?');
doc.rect(40, doc.y + 2, 280, 1.5).fill(C_GOLD);
doc.y += 8;

doc.font('Helvetica').fontSize(9).fillColor(C_GRAY).text(
  'El 90% de las personas cometen el error de hacer cientos de "crunches" o abdominales tradicionales en el piso. Ese movimiento repetitivo comprime los discos intervertebrales lumbares y apenas activa las fibras musculares profundas, creando una ilusión de cansancio sin verdadera definición.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 3 }
);

doc.y += 6;
doc.font('Helvetica').fontSize(9).fillColor(C_GRAY).text(
  'El método militar se basa en dos pilares biomecánicos fundamentales:',
  { width: doc.page.width - 80 }
);

doc.y += 4;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GREEN).text('A) Tensión Isométrica Prolongada (Efecto Corsé):');
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Al mantener el transverso abdominal bajo contracción constante (como en la postura Hollow Body), la faja abdominal se aplana de forma natural hacia la columna, reduciendo el perímetro de la cintura incluso en reposo.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2 }
);

doc.y += 4;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GREEN).text('B) Estabilidad Anti-Rotación y Anti-Extensión:');
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'El abdomen no fue diseñado evolutivamente para doblarse, sino para resistir fuerzas externas y transferir energía entre el tren inferior y superior. Los ejercicios anti-rotación activan el triple de unidades motoras con cero impacto lumbar.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2 }
);

doc.y += 8;
doc.rect(40, doc.y, doc.page.width - 80, 50).fillAndStroke('#fffbeb', '#fde68a');
const warnY = doc.y + 6;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GOLD).text('⚠️ REGLA DE ORO DE RESPIRACIÓN MILITAR:', 50, warnY);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Durante los 45 segundos de cada ejercicio, jamás aguantes la respiración (evita la maniobra de Valsalva). Exhala lentamente por la boca apretando el ombligo hacia adentro e inhala corto por la nariz. Esto multiplica la quema energética.',
  50, warnY + 14, { width: doc.page.width - 100, align: 'justify', lineGap: 2 }
);

addHeaderFooter(1, 'Portada y Fundamentos');

// ========================================================
// PÁGINA 2: LOS 6 EJERCICIOS TÁCTICOS DEL FINISHER
// ========================================================
doc.addPage();

doc.font('Helvetica-Bold').fontSize(13).fillColor(C_DARK).text('2. Desglose Táctico de los 6 Ejercicios (45s Trabajo / 15s Pausa)');
doc.rect(40, doc.y + 2, 340, 1.5).fill(C_GOLD);
doc.y += 10;

const exercises = [
  {
    num: '1',
    name: 'HOLLOW BODY ROCK (CANOA MILITAR)',
    focus: 'Recto abdominal superior e inferior y transverso profundo.',
    tech: 'Boca arriba, despega omóplatos y talones del suelo formando una curva cóncava. Balancéate suavemente manteniendo la tensión rígida como una tabla.',
    dur: '45 seg trabajo • 15 seg descanso'
  },
  {
    num: '2',
    name: 'ELEVACIONES DE PIERNAS TÁCTICAS A 90°',
    focus: 'Abdomen bajo y flexores de cadera con descompresión.',
    tech: 'Manos a los costados o bajo el coxis. Eleva las piernas juntas hasta la vertical sin impulso lumbar. Baja en 3 segundos controlados sin que los talones toquen el suelo.',
    dur: '45 seg trabajo • 15 seg descanso'
  },
  {
    num: '3',
    name: 'PLANCHA ALTA CON TOQUE DE HOMBRO (ANTI-ROTACIÓN)',
    focus: 'Oblicuos internos y estabilizadores profundos del core.',
    tech: 'Posición de flexión con pies al ancho de hombros. Toca el hombro izquierdo con la mano derecha lentamente. Clave: la cadera debe permanecer paralela al suelo sin balancearse.',
    dur: '45 seg trabajo • 15 seg descanso'
  },
  {
    num: '4',
    name: 'CRUNCH TÁCTICO EN "V" COMBINADO',
    focus: 'Compresión concéntrica máxima de la pared abdominal.',
    tech: 'Flexiona el torso al mismo tiempo que llevas las rodillas hacia el pecho. Exhala con fuerza en el punto de máxima compresión y extiende sin arquear la espalda baja.',
    dur: '45 seg trabajo • 15 seg descanso'
  },
  {
    num: '5',
    name: 'MOUNTAIN CLIMBERS DE CONTROL TÁCTICO',
    focus: 'Definición de serratos, oblicuos y resistencia láctica.',
    tech: 'A diferencia de los escaladores rápidos de cardio, ejecuta cada repetición con pausa de 1 segundo con la rodilla pegada al codo. Tensión pura sin rebotes.',
    dur: '45 seg trabajo • 15 seg descanso'
  },
  {
    num: '6',
    name: 'HOLLOW HOLD ISOMÉTRICO FINAL (AL FALLO POSITIVO)',
    focus: 'Sello final de agotamiento de fibras de contracción rápida.',
    tech: 'Adopta la postura del ejercicio 1 pero completamente inmóvil. Presiona las lumbares contra el suelo. Mantén la posición hasta que el cronómetro marque 60s.',
    dur: '60 seg continuos • Fin del Finisher'
  }
];

let curY = doc.y;
exercises.forEach((ex) => {
  doc.rect(40, curY, doc.page.width - 80, 52).fillAndStroke('#ffffff', '#e5e7eb');
  
  // Tag número
  doc.rect(46, curY + 6, 20, 20).fill(C_GOLD);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff').text(ex.num, 46, curY + 11, { width: 20, align: 'center' });

  // Título e foco
  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_DARK).text(ex.name, 74, curY + 7);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_GREEN).text(`[ ${ex.dur} ]`, doc.page.width - 190, curY + 7, { width: 145, align: 'right' });

  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Foco: ${ex.focus}`, 74, curY + 19);
  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(ex.tech, 74, curY + 29, { width: doc.page.width - 125, lineGap: 1.5 });

  curY += 58;
});

addHeaderFooter(2, 'Los 6 Ejercicios Tácticos');

// ========================================================
// PÁGINA 3: CRONOGRAMA DE 21 DÍAS & ACCESO AL WEB APP
// ========================================================
doc.addPage();

doc.font('Helvetica-Bold').fontSize(13).fillColor(C_DARK).text('3. Cronograma Semanal y Sincronización en la Aplicación');
doc.rect(40, doc.y + 2, 330, 1.5).fill(C_GOLD);
doc.y += 10;

doc.font('Helvetica').fontSize(9).fillColor(C_GRAY).text(
  'Para maximizar la pérdida de grasa y evitar el sobreentrenamiento del core, sigue esta distribución recomendada a lo largo de las 3 semanas de tu Protocolo:',
  { width: doc.page.width - 80, align: 'justify', lineGap: 3 }
);

doc.y += 8;

// Tabela Semanal
const schedule = [
  { day: 'LUNES', status: 'ACTIVO', act: 'Misión Diaria de Calistenia + Finisher Abdomen 7 Min (Post-entreno)' },
  { day: 'MARTES', status: 'ACTIVO', act: 'Misión Diaria de Calistenia + Finisher Abdomen 7 Min (Post-entreno)' },
  { day: 'MIÉRCOLES', status: 'DESCANSO', act: 'Pausa activa de core. Solo caminata y rutina de Blindaje Articular.' },
  { day: 'JUEVES', status: 'ACTIVO', act: 'Misión Diaria de Calistenia + Finisher Abdomen 7 Min (Post-entreno)' },
  { day: 'VIERNES', status: 'ACTIVO', act: 'Misión Diaria de Calistenia + Finisher Abdomen 7 Min (Post-entreno)' },
  { day: 'SÁBADO', status: 'OPCIONAL', act: 'Finisher Abdomen 7 Min en ayunas por la mañana (Acelerador de fin de semana).' },
  { day: 'DOMINGO', status: 'REPOSO', act: 'Descanso total. Regeneración celular y recarga glucogénica.' }
];

let tabY = doc.y;
schedule.forEach((item, idx) => {
  const bg = idx % 2 === 0 ? '#f9fafb' : '#ffffff';
  doc.rect(40, tabY, doc.page.width - 80, 22).fillAndStroke(bg, '#e5e7eb');
  
  doc.font('Helvetica-Bold').fontSize(8).fillColor(item.status === 'ACTIVO' ? C_GREEN : (item.status === 'OPCIONAL' ? C_GOLD : C_LIGHT_GRAY))
     .text(item.day, 48, tabY + 6, { width: 80 });

  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY)
     .text(item.act, 135, tabY + 6, { width: doc.page.width - 185 });

  tabY += 24;
});

doc.y = tabY + 12;

doc.font('Helvetica-Bold').fontSize(11).fillColor(C_DARK).text('Integración con tu Aplicación Web PWA:');
doc.rect(40, doc.y + 2, 220, 1.2).fill(C_GREEN);
doc.y += 8;

doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Recuerda que no necesitas memorizar los tiempos. En tu aplicación oficial, dentro de la sección "Arsenal Tático", dispones del botón "Iniciar Rutina Guiada (7 Min)" que activa el cronómetro militar automático con señales sonoras de cambio de ejercicio.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2.5 }
);

doc.y += 14;

// Caja final de felicitación
doc.rect(40, doc.y, doc.page.width - 80, 65).fillAndStroke('#0f1710', C_GOLD);
const endY = doc.y + 10;
doc.font('Helvetica-Bold').fontSize(10).fillColor(C_GOLD).text('¡ORDEN CUMPLIDA, SOLDADO!', 52, endY);
doc.font('Helvetica').fontSize(8.5).fillColor('#ffffff').text(
  'La constancia en estos 7 minutos diarios marcará la diferencia entre un cuerpo promedio y un físico táctico esculpido. Sé disciplinado, no te rindas en el Hollow Hold final y celebra cada día conquistado.',
  52, endY + 15, { width: doc.page.width - 105, lineGap: 2.5 }
);
doc.font('Helvetica-Bold').fontSize(8).fillColor(C_GREEN_LIGHT).text(
  'Protocolo de Calistenia Militar Oficial • Acceso Permanente Garantizado',
  52, endY + 44
);

addHeaderFooter(3, 'Cronograma y Aplicación');

doc.end();
console.log('PDF Finisher Abdomen generado exitosamente en:', outputPath);

