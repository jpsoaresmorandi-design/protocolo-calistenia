const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

const outputPath = path.join(__dirname, '12_Batidos_Anabolicos_Militares.pdf');
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
  doc.rect(40, 24, doc.page.width - 80, 2).fill(C_GREEN);
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GRAY).text('12 BATIDOS ANABÓLICOS MILITARES • RECETARIO TÁCTICO DE 3 MINUTOS', 40, 14, {
    width: doc.page.width - 80,
    align: 'left',
    lineBreak: false
  });
  doc.font('Helvetica-Bold').fontSize(7.5).fillColor(C_GREEN).text('HOTMART ORDER BUMP OFICIAL', 40, 14, {
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
// PÁGINA 1: PORTADA & MANUAL DE NUTRICIÓN LÍQUIDA MILITAR
// ========================================================
doc.rect(40, 35, doc.page.width - 80, 100).fill('#0f1710');

if (fs.existsSync(logoPath)) {
  try {
    doc.image(logoPath, 52, 45, { width: 78, height: 78 });
  } catch(e) {}
}

doc.font('Helvetica-Bold').fontSize(8.5).fillColor(C_GREEN_LIGHT).text('RECETARIO PROTEICO TÁCTICO • HOTMART VERIFIED', 145, 48);
doc.font('Helvetica-Bold').fontSize(16).fillColor('#ffffff').text('12 BATIDOS ANABÓLICOS MILITARES', 145, 62);
doc.font('Helvetica-Bold').fontSize(11).fillColor(C_GOLD).text('FÓRMULAS DE ABSORCIÓN RÁPIDA EN 3 MINUTOS', 145, 82);
doc.font('Helvetica').fontSize(8.5).fillColor('#9ca3af').text('Proteína pura, recuperación de fibra muscular y saciedad sin gastar en suplementos caros.', 145, 98, { width: 380 });

doc.y = 145;

doc.rect(40, doc.y, doc.page.width - 80, 52).fillAndStroke(C_BG_BOX, C_BORDER_BOX);
const boxY = doc.y + 8;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GREEN).text('FICHA TÉCNICA DEL RECETARIO', 50, boxY);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Contenido: 12 fórmulas completas con ingredientes comunes de cualquier supermercado.', 50, boxY + 14);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Rango Proteico: Entre 25g y 52g de proteína de alto valor biológico por toma.', 50, boxY + 26);
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text('• Tiempo de Preparación: Máximo 3 minutos (apto para licuadora o shaker manual).', 50, boxY + 38);

doc.y = 208;
doc.font('Helvetica-Bold').fontSize(12).fillColor(C_DARK).text('1. El Poder de la Nutrición Líquida en la Calistenia');
doc.rect(40, doc.y + 2, 260, 1.5).fill(C_GREEN);
doc.y += 8;

doc.font('Helvetica').fontSize(9).fillColor(C_GRAY).text(
  'Tras una sesión intensa de calistenia (flexiones, fondos, planchas y dominadas), el flujo sanguíneo del cuerpo se concentra en los músculos entrenados, reduciendo temporalmente la capacidad digestiva gástrica. Consumir una comida sólida pesada inmediatamente puede causar letargo e hinchazón.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 3 }
);

doc.y += 6;
doc.font('Helvetica').fontSize(9).fillColor(C_GRAY).text(
  'Los batidos anabólicos tácticos resuelven este problema al entregar nutrientes predigeridos en forma líquida con 3 ventajas contundentes:',
  { width: doc.page.width - 80 }
);

doc.y += 4;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GOLD).text('1. Absorción en Menos de 30 Minutos:');
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Los aminoácidos y glucógeno llegan rápidamente a las micro-roturas musculares, frenando el catabolismo e iniciando la síntesis de colágeno y miofibrillas.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2 }
);

doc.y += 4;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GOLD).text('2. Cero Dependencia de Proteína en Polvo Ultraprocesada:');
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'Todas las recetas utilizan fuentes reales como queso batido 0%, requesón, avena, claras pasteurizadas, mantequilla de maní y semillas de chía. Si tienes proteína en polvo puedes usarla, pero no es obligatoria.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2 }
);

doc.y += 4;
doc.font('Helvetica-Bold').fontSize(9).fillColor(C_GOLD).text('3. Control del Apetito y Deseos Nocturnos de Azúcar:');
doc.font('Helvetica').fontSize(8.5).fillColor(C_GRAY).text(
  'La densidad y fibra soluble de la avena y frutos rojos envían señales de saciedad al cerebro (leptina), evitando atracones nocturnos que arruinan la definición.',
  { width: doc.page.width - 80, align: 'justify', lineGap: 2 }
);

addHeaderFooter(1, 'Portada y Fundamentos');

// ========================================================
// PÁGINA 2: FÓRMULAS 1 A 6 (FUERZA, ENERGÍA Y VOLUMEN)
// ========================================================
doc.addPage();

doc.font('Helvetica-Bold').fontSize(13).fillColor(C_DARK).text('2. Fórmulas Tácticas #1 a #6 (Desarrollo y Fuerza)');
doc.rect(40, doc.y + 2, 280, 1.5).fill(C_GREEN);
doc.y += 10;

const batch1 = [
  {
    num: '1',
    name: 'FUERZA TITÁN (CHOCOLATE Y AVENA)',
    prot: '38g Proteína', cal: '420 kcal', time: '3 min',
    ing: '250ml leche de vaca o bebida vegetal, 40g avena molida, 1 plátano maduro, 1 cucharada colmada de mantequilla de maní, 1 cucharada cacao desgrasado puro, canela.',
    prep: 'Colocar todo en la licuadora con 3 cubos de hielo y batir a máxima potencia 45 segundos. Ideal inmediatamente después de la misión diaria.'
  },
  {
    num: '2',
    name: 'TERMOGÉNICO CAFÉ MILITAR (QUEMA-GRASA)',
    prot: '32g Proteína', cal: '230 kcal', time: '2 min',
    ing: '1 taza de café expreso frío, 200ml leche vegetal sin azúcar, 3 claras pasteurizadas (o 1 scoop proteína), hielo picado y canela en polvo.',
    prep: 'Agitar con fuerza en shaker o licuar 20s. Tomar 30-40 minutos antes del entrenamiento para multiplicar la lipólisis durante el esfuerzo.'
  },
  {
    num: '3',
    name: 'RECONSTRUCTOR NOCTURNO CASEÍNA Y CHÍA',
    prot: '36g Proteína', cal: '340 kcal', time: '3 min',
    ing: '200g queso batido 0% o yogur griego natural, 150ml leche, 1 cucharada semillas de chía, 50g fresas o arándanos, edulcorante o stevia al gusto.',
    prep: 'Licuar y dejar reposar 5 minutos para que la chía gelifique. La caseína del queso alimenta tus músculos gota a gota durante las 8 horas de sueño.'
  },
  {
    num: '4',
    name: 'OPERADOR VERDE ALCALINO Y DIGESTIVO',
    prot: '28g Proteína', cal: '210 kcal', time: '3 min',
    ing: '1 puñado grande de espinacas tiernas, 1/2 manzana verde con piel, zumo de 1/2 limón, 250ml agua de coco natural, 30g proteína aislada o claras.',
    prep: 'Licuar hasta lograr una emulsión 100% homogénea y beber de inmediato. Desinflama la pared abdominal y regula el pH gástrico.'
  },
  {
    num: '5',
    name: 'BOMBA CALÓRICA MILITAR (VOLUMEN LIMPIO)',
    prot: '52g Proteína', cal: '660 kcal', time: '3 min',
    ing: '300ml leche entera, 60g copos de avena, 2 cucharadas mantequilla de maní, 1 plátano, 1 cucharada miel pura de abejas, 30g proteína/claras.',
    prep: 'Licuar 1 minuto continuo. Diseñado exclusivamente para fases de ganancia de masa magra o personas a las que les cuesta subir de peso.'
  },
  {
    num: '6',
    name: 'PECTORAL DE HIERRO Y PLÁTANO MADURO',
    prot: '31g Proteína', cal: '320 kcal', time: '2 min',
    ing: '250ml leche desnatada, 1 plátano maduro, 1 cucharada cacao puro, 30g proteína o huevos pasteurizados, pizca de nuez moscada.',
    prep: 'Batir bien frío. Su alta concentración de magnesio y potasio relaja el sistema neuromuscular evitando calambres nocturnos.'
  }
];

let curY1 = doc.y;
batch1.forEach(b => {
  doc.rect(40, curY1, doc.page.width - 80, 56).fillAndStroke('#ffffff', '#e5e7eb');
  
  doc.rect(46, curY1 + 6, 20, 20).fill(C_GREEN);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff').text(b.num, 46, curY1 + 11, { width: 20, align: 'center' });

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_DARK).text(b.name, 74, curY1 + 7);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_GOLD).text(`${b.prot} • ${b.cal} • ${b.time}`, doc.page.width - 200, curY1 + 7, { width: 155, align: 'right' });

  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(`Ingredientes: ${b.ing}`, 74, curY1 + 20, { width: doc.page.width - 125, lineGap: 1 });
  doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Preparación: ${b.prep}`, 74, curY1 + 38, { width: doc.page.width - 125, lineGap: 1 });

  curY1 += 62;
});

addHeaderFooter(2, 'Fórmulas #1 a #6');

// ========================================================
// PÁGINA 3: FÓRMULAS 7 A 12 (DEFINICIÓN, ARTICULACIONES & RAPIDEZ)
// ========================================================
doc.addPage();

doc.font('Helvetica-Bold').fontSize(13).fillColor(C_DARK).text('3. Fórmulas Tácticas #7 a #12 (Definición y Rendimiento)');
doc.rect(40, doc.y + 2, 320, 1.5).fill(C_GREEN);
doc.y += 10;

const batch2 = [
  {
    num: '7',
    name: 'BLINDAJE ARTICULAR CÚRCUMA Y NARANJA',
    prot: '26g Proteína', cal: '210 kcal', time: '2 min',
    ing: 'Zumo recién exprimido de 2 naranjas, 1/2 cdta cúrcuma en polvo, pizca pimienta negra (activa curcumina), 200ml agua, 30g colágeno o proteína.',
    prep: 'Agitar enérgicamente. Potente cóctel antiinflamatorio para proteger codos y hombros del impacto de flexiones intensas.'
  },
  {
    num: '8',
    name: 'DEFINICIÓN MÁXIMA FRUTOS DEL BOSQUE',
    prot: '33g Proteína', cal: '240 kcal', time: '2 min',
    ing: '100g arándanos y fresas congeladas, 200ml agua fría, 30g proteína vainilla o yogur desnatado, 1 cucharadita semillas de lino trituradas.',
    prep: 'Licuar hasta lograr textura granizada tipo sorbete. Menos de 8g de carbohidratos netos para acelerar quema de grasa abdominal.'
  },
  {
    num: '9',
    name: 'DESPERTAR GUERRERO TÉ MATCHA',
    prot: '27g Proteína', cal: '220 kcal', time: '3 min',
    ing: '1 cucharadita té matcha ceremonial japonés, 250ml leche de almendras, 1/2 plátano, 25g proteína vainilla o claras pasteurizadas.',
    prep: 'Disolver el matcha en 50ml de agua tibia y licuar con los demás ingredientes y hielo. Aporta 6 horas de concentración sin bajón de energía.'
  },
  {
    num: '10',
    name: 'ANTI-FATIGA REMOLACHA Y BAYAS',
    prot: '29g Proteína', cal: '260 kcal', time: '3 min',
    ing: '1/2 remolacha cocida pequeña, 100g fresas, 200ml agua fría o leche vegetal, 30g proteína neutra o vainilla.',
    prep: 'Licuar muy bien. Los nitratos naturales de la remolacha aumentan la vasodilatación y el bombeo muscular en sesiones de resistencia.'
  },
  {
    num: '11',
    name: 'HIDRATANTE ELECTROLÍTICO AGUA DE COCO',
    prot: '25g Proteína', cal: '180 kcal', time: '2 min',
    ing: '300ml agua de coco natural 100%, zumo de 1 limón verde, pizca de sal marina o del Himalaya, 25g proteína aislada o claras.',
    prep: 'Agitar en botella fría. Repone potasio, magnesio y sodio tras sudar intensamente en entrenamientos de alta temperatura.'
  },
  {
    num: '12',
    name: 'ÉLITE RÁPIDO 60 SEGUNDOS (EN SHAKER)',
    prot: '32g Proteína', cal: '280 kcal', time: '1 min',
    ing: '250ml agua o leche, 40g harina de avena instantánea, 1 cucharada miel pura, 30g proteína de suero o claras pasteurizadas.',
    prep: 'No necesitas licuadora. Introduce todo en tu shaker manual, agita enérgicamente 30 segundos y bebe. Solución de combate cuando no tienes tiempo.'
  }
];

let curY2 = doc.y;
batch2.forEach(b => {
  doc.rect(40, curY2, doc.page.width - 80, 56).fillAndStroke('#ffffff', '#e5e7eb');
  
  doc.rect(46, curY2 + 6, 20, 20).fill(C_GREEN);
  doc.font('Helvetica-Bold').fontSize(11).fillColor('#ffffff').text(b.num, 46, curY2 + 11, { width: 20, align: 'center' });

  doc.font('Helvetica-Bold').fontSize(9.5).fillColor(C_DARK).text(b.name, 74, curY2 + 7);
  doc.font('Helvetica-Bold').fontSize(8).fillColor(C_GOLD).text(`${b.prot} • ${b.cal} • ${b.time}`, doc.page.width - 200, curY2 + 7, { width: 155, align: 'right' });

  doc.font('Helvetica').fontSize(8).fillColor(C_GRAY).text(`Ingredientes: ${b.ing}`, 74, curY2 + 20, { width: doc.page.width - 125, lineGap: 1 });
  doc.font('Helvetica-Oblique').fontSize(7.5).fillColor(C_LIGHT_GRAY).text(`Preparación: ${b.prep}`, 74, curY2 + 38, { width: doc.page.width - 125, lineGap: 1 });

  curY2 += 62;
});

addHeaderFooter(3, 'Fórmulas #7 a #12');

doc.end();
console.log('PDF 12 Batidos generado exitosamente en:', outputPath);

