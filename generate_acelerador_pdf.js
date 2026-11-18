const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const WORK_DIR = 'C:\\Users\\buggu\\.gemini\\antigravity\\scratch\\Protocolo da Calistenia';
const NETLIFY_DIR = path.join(WORK_DIR, 'site_para_netlify');

const coverFile = path.join(WORK_DIR, 'cover_acelerador_metabolico_600x600.jpg');
let coverBase64 = '';
if (fs.existsSync(coverFile)) {
  coverBase64 = `data:image/jpeg;base64,${fs.readFileSync(coverFile).toString('base64')}`;
}

const htmlContent = `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Acelerador Metabólico 2X - Protocolo Quema Grasa Táctico</title>
  <style>
    @page {
      size: A4 portrait;
      margin: 0;
    }
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      background-color: #060907;
      color: #e5e7eb;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', Helvetica, Arial, sans-serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page {
      width: 210mm;
      height: 297mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      padding: 14mm 16mm 12mm 16mm;
      background: radial-gradient(circle at 50% 10%, #0d1a11 0%, #060907 80%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page-border {
      position: absolute;
      top: 7mm;
      left: 7mm;
      right: 7mm;
      bottom: 7mm;
      border: 1px solid rgba(16, 185, 129, 0.35);
      pointer-events: none;
    }
    .corner {
      position: absolute;
      width: 12mm;
      height: 12mm;
      border: 2px solid #10b981;
      pointer-events: none;
    }
    .c-tl { top: 5mm; left: 5mm; border-right: none; border-bottom: none; }
    .c-tr { top: 5mm; right: 5mm; border-left: none; border-bottom: none; }
    .c-bl { bottom: 5mm; left: 5mm; border-right: none; border-top: none; }
    .c-br { bottom: 5mm; right: 5mm; border-left: none; border-top: none; }

    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(16, 185, 129, 0.4);
      padding-bottom: 6px;
      margin-bottom: 8px;
    }
    .header-tag {
      font-size: 8.5px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #10b981;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .header-tag::before {
      content: '';
      display: inline-block;
      width: 6px;
      height: 6px;
      background-color: #10b981;
      border-radius: 50%;
      box-shadow: 0 0 6px #10b981;
    }
    .header-badge {
      font-size: 8px;
      font-weight: 900;
      letter-spacing: 1.5px;
      padding: 3px 8px;
      background: rgba(245, 158, 11, 0.15);
      border: 1px solid #f59e0b;
      color: #fbbf24;
      border-radius: 4px;
      text-transform: uppercase;
    }
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.1);
      padding-top: 6px;
      font-size: 8px;
      color: #9ca3af;
    }
    .footer-bar span.accent {
      color: #10b981;
      font-weight: 700;
    }

    .title-doc {
      font-size: 24px;
      font-weight: 900;
      line-height: 1.15;
      text-transform: uppercase;
      color: #ffffff;
      text-align: center;
      margin: 4px 0 2px 0;
    }
    .title-doc span.neon { color: #10b981; text-shadow: 0 0 12px rgba(16,185,129,0.5); }
    .title-doc span.gold { color: #f59e0b; }
    .subtitle-doc {
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 10px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 8px 0 5px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .card-box {
      background: rgba(13, 22, 16, 0.8);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 6px;
      padding: 9px 12px;
      margin-bottom: 8px;
    }
    .card-box.highlight {
      border: 1.5px solid #10b981;
      background: rgba(16, 32, 22, 0.85);
      box-shadow: 0 0 14px rgba(16, 185, 129, 0.15);
    }

    .grid-2 {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin-bottom: 8px;
    }

    .tactical-table {
      width: 100%;
      border-collapse: collapse;
      margin: 6px 0;
      font-size: 8px;
    }
    .tactical-table th {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      font-weight: 800;
      text-align: left;
      padding: 5px 7px;
      border-bottom: 1px solid #10b981;
      text-transform: uppercase;
    }
    .tactical-table td {
      padding: 5px 7px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      color: #d1d5db;
    }
    .tactical-table tr:nth-child(even) {
      background: rgba(13, 20, 15, 0.45);
    }

    .cta-btn {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #03140a !important;
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 12px 30px;
      border-radius: 50px;
      text-decoration: none;
      box-shadow: 0 0 20px rgba(16, 185, 129, 0.6);
      border: 1.5px solid #6ee7b7;
      cursor: pointer;
    }
  </style>
</head>
<body>

  <!-- ==================================================================== -->
  <!-- PÁGINA 1: CAPA OFICIAL & BIENVENIDA AL ACELERADOR                    -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">UPGRADE EXCLUSIVO • HOTMART 2026</div>
      <div class="header-badge">ORDEN DESBLOQUEADA</div>
    </div>

    <div style="text-align: center; margin: 4px 0;">
      <h1 class="title-doc">ACELERADOR <span class="neon">METABÓLICO 2X</span></h1>
      <p class="subtitle-doc">PROTOCOLO TÁCTICO DE TERMOGÉNESIS & QUEMA DE GRASA RÁPIDA</p>
    </div>

    <!-- Product Cover Display -->
    <div style="text-align: center; margin: 6px 0;">
      ${coverBase64 ? `<img src="${coverBase64}" style="width: 72mm; height: 72mm; border-radius: 8px; border: 2px solid #10b981; box-shadow: 0 0 24px rgba(16,185,129,0.4); object-fit: cover;">` : ''}
    </div>

    <div class="card-box highlight">
      <div style="font-size: 11px; font-weight: 800; color: #ffffff; margin-bottom: 4px;">
        ⚡ ¡FELICITACIONES, SOLDADO! HAS DESBLOQUEADO EL TURBO METABÓLICO
      </div>
      <p style="font-size: 9px; line-height: 1.5; color: #d1d5db; margin-bottom: 4px;">
        Acabas de adquirir la herramienta complementaria más poderosa del <strong>Protocolo de Calistenia Militar</strong>. El <strong>Acelerador Metabólico 2X</strong> fue diseñado para aquellos alumnos que no quieren esperar semanas para notar cambios: su objetivo es <strong>romper cualquier estancamiento metabólico</strong> y forzar al cuerpo a quemar reservas de grasa profunda de manera continua, incluso durante las horas de sueño.
      </p>
      <p style="font-size: 8.5px; line-height: 1.4; color: #10b981; font-weight: 700;">
        ✓ Activa la biogénesis mitocondrial &bull; ✓ Dispara el efecto térmico EPOC &bull; ✓ Cero horas de cardio aburrido
      </p>
    </div>

    <div class="grid-2">
      <div class="card-box" style="margin-bottom: 0;">
        <div style="font-size: 9px; font-weight: 800; color: #f59e0b; margin-bottom: 3px;">🔥 EFECTO TERMOGÉNICO EPOC</div>
        <div style="font-size: 8px; color: #9ca3af; line-height: 1.4;">
          Tras aplicar los micro-estímulos biomecánicos de 3 a 5 minutos, el consumo de oxígeno post-entrenamiento se mantiene elevado hasta 24 horas, consumiendo ácidos grasos en reposo.
        </div>
      </div>
      <div class="card-box" style="margin-bottom: 0;">
        <div style="font-size: 9px; font-weight: 800; color: #10b981; margin-bottom: 3px;">🛡️ BLINDAJE DE MASA MAGRA</div>
        <div style="font-size: 8px; color: #9ca3af; line-height: 1.4;">
          A diferencia del cardio tradicional que cataboliza el músculo, este protocolo protege las fibras musculares mientras drena la retención hídrica y la grasa rebelde.
        </div>
      </div>
    </div>

    <div class="footer-bar">
      <div>ACELERADOR METABÓLICO 2X &bull; LICENCIA HOTMART</div>
      <div>PÁGINA <span class="accent">1 DE 3</span></div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PÁGINA 2: EL PROTOCOLO DIARIO EN 3 FASES                             -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">METODOLOGÍA DE APLICACIÓN DIARIA</div>
      <div class="header-badge">GUÍA OPERATIVA</div>
    </div>

    <div>
      <h2 class="title-doc" style="font-size: 20px;">LAS 3 FASES DE <span class="neon">ACTIVACIÓN DIARIA</span></h2>
      <p class="subtitle-doc">CÓMO INTEGRAR EL ACELERADOR EN TU JORNADA DE 21 DÍAS</p>
    </div>

    <!-- FASE 1 -->
    <div class="card-box">
      <div style="font-size: 10px; font-weight: 800; color: #10b981; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;">
        <span style="background: #10b981; color: #060907; padding: 1px 6px; border-radius: 3px; font-size: 8px;">FASE 1</span>
        EL DESPERTADOR TÉRMICO MATUTINO (3 MINUTOS AL DESPERTAR)
      </div>
      <p style="font-size: 8.5px; color: #d1d5db; line-height: 1.4; margin-bottom: 5px;">
        Realízalo en ayunas, inmediatamente después de salir de la cama, para elevar la temperatura corporal central y reactivar la sensibilidad insulínica:
      </p>
      <div style="background: rgba(0,0,0,0.4); border-left: 2px solid #10b981; padding: 6px 10px; font-size: 8px; color: #e5e7eb; line-height: 1.4;">
        <strong>1. Shot Termogênico Militar:</strong> 250ml de agua tibia + jugo de 1/2 limón + 1/2 cucharadita de canela en polvo + una pizca microscópica de pimienta cayena o jengibre rallado.<br>
        <strong>2. Secuencia de Respiración Bio-Oxigenante:</strong> 30 inhalaciones profundas por la nariz y exhalaciones rápidas para alcalinizar la sangre.<br>
        <strong>3. Circuito de 180 Segundos:</strong> 60s jumping jacks suaves + 60s sentadilla estática en pared + 60s plancha abdominal con respiración controlada.
      </div>
    </div>

    <!-- FASE 2 -->
    <div class="card-box">
      <div style="font-size: 10px; font-weight: 800; color: #f59e0b; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;">
        <span style="background: #f59e0b; color: #060907; padding: 1px 6px; border-radius: 3px; font-size: 8px;">FASE 2</span>
        EL SINCRONIZADOR PRE-ENTRENAMIENTO (CALISTENIA TURBO)
      </div>
      <p style="font-size: 8.5px; color: #d1d5db; line-height: 1.4; margin-bottom: 5px;">
        Aplica esto 20 minutos antes de comenzar tu sesión del Protocolo de Calistenia:
      </p>
      <div style="background: rgba(0,0,0,0.4); border-left: 2px solid #f59e0b; padding: 6px 10px; font-size: 8px; color: #e5e7eb; line-height: 1.4;">
        <strong>• Hidratación Hipertónica:</strong> 400ml de agua fría con una pizca de sal rosa del Himalaya (aporta electrolitos de sodio y magnesio para evitar calambres y aumentar la fuerza contráctil).<br>
        <strong>• Café Táctico Negro (Opcional):</strong> 1 taza sin azúcar para movilizar ácidos grasos libres hacia el torrente sanguíneo justo antes de la primera serie de flexiones.
      </div>
    </div>

    <!-- FASE 3 -->
    <div class="card-box">
      <div style="font-size: 10px; font-weight: 800; color: #38bdf8; margin-bottom: 3px; display: flex; align-items: center; gap: 6px;">
        <span style="background: #38bdf8; color: #060907; padding: 1px 6px; border-radius: 3px; font-size: 8px;">FASE 3</span>
        EL VACÍO ABDOMINAL & DESCOMPRESIÓN NOCTURNA
      </div>
      <p style="font-size: 8.5px; color: #d1d5db; line-height: 1.4; margin-bottom: 5px;">
        Antes de dormir, reduce el cortisol (la hormona que retiene grasa abdominal) con esta técnica táctica:
      </p>
      <div style="background: rgba(0,0,0,0.4); border-left: 2px solid #38bdf8; padding: 6px 10px; font-size: 8px; color: #e5e7eb; line-height: 1.4;">
        <strong>• 3 Series de Vacío Abdominal (Stomach Vacuum):</strong> Exhala todo el aire de los pulmones, mete el ombligo hacia adentro como si tocara la columna y sostén 15 segundos sin aire. Esto compacta el músculo transverso abdominal y reduce cintura mientras duermes.
      </div>
    </div>

    <div class="footer-bar">
      <div>ACELERADOR METABÓLICO 2X &bull; PROTOCOLO DE CALISTENIA MILITAR</div>
      <div>PÁGINA <span class="accent">2 DE 3</span></div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PÁGINA 3: ALIMENTOS TERMOGÉNICOS & ACCESO A LA APP                   -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">TABLA TÁCTICA DE COMBUSTIBLES</div>
      <div class="header-badge">GUÍA NUTRICIONAL</div>
    </div>

    <div>
      <h2 class="title-doc" style="font-size: 20px;">ARSENAL DE ALIMENTOS <span class="gold">TERMOGÉNICOS</span></h2>
      <p class="subtitle-doc">ALIMENTOS CON MÁXIMO EFECTO TÉRMICO (TEF) PARA ACELERAR LA QUEMA</p>
    </div>

    <table class="tactical-table">
      <thead>
        <tr>
          <th>ALIMENTO TÁCTICO</th>
          <th>COMPONENTE ACTIVO</th>
          <th>IMPACTO METABÓLICO</th>
          <th>CÓMO CONSUMIRLO</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td><strong style="color: #ffffff;">Pimienta Cayena / Chile</strong></td>
          <td>Capsaicina</td>
          <td>Aumenta el gasto calórico basal un 8% tras su ingesta</td>
          <td>Una pizca en el shot matutino o en las carnes magras</td>
        </tr>
        <tr>
          <td><strong style="color: #ffffff;">Té Verde / Matcha</strong></td>
          <td>EGCG + Cafeína</td>
          <td>Estimula la lipólisis e inhibe el almacenamiento graso</td>
          <td>1 taza a media mañana (10:00 AM) sin endulzantes</td>
        </tr>
        <tr>
          <td><strong style="color: #ffffff;">Gengibre Fresco</strong></td>
          <td>Gingerol</td>
          <td>Reduce la inflamación celular y la distensión estomacal</td>
          <td>Rallado en agua caliente con limón antes del almuerzo</td>
        </tr>
        <tr>
          <td><strong style="color: #ffffff;">Canela de Ceilán</strong></td>
          <td>Cinamaldehído</td>
          <td>Estabiliza la glucosa y bloquea picos de insulina</td>
          <td>1/2 cucharadita en el café o en batidos de avena</td>
        </tr>
        <tr>
          <td><strong style="color: #ffffff;">Pechuga de Pollo / Atún</strong></td>
          <td>Proteína Completa</td>
          <td>Gasta hasta 30 kcal de cada 100 solo para digerirse</td>
          <td>Comidas principales como fuente primaria proteica</td>
        </tr>
      </tbody>
    </table>

    <div class="card-box" style="margin-top: 8px; text-align: center;">
      <div style="font-size: 11px; font-weight: 800; color: #10b981; margin-bottom: 4px; text-transform: uppercase;">
        📲 SINCRONIZA ESTE PROTOCOLO CON TU APLICACIÓN OFICIAL
      </div>
      <p style="font-size: 8.5px; color: #d1d5db; line-height: 1.4; margin-bottom: 10px;">
        Recuerda que este Acelerador se complementa al 100% con tu entrenamiento principal. Ingresa a la plataforma digital con el correo de tu compra para sincronizar tus progresos:
      </p>
      <a href="https://protocolo-calistenia-pi.vercel.app/app/onboarding.html" target="_blank" class="cta-btn">
        🪖 ACCEDER A MI PLATAFORMA DIGITAL
      </a>
      <div style="font-size: 8px; color: #10b981; margin-top: 6px;">
        https://protocolo-calistenia-pi.vercel.app/app/onboarding.html
      </div>
    </div>

    <!-- Final Military Motto -->
    <div style="background: rgba(16, 185, 129, 0.08); border: 1px dashed rgba(16, 185, 129, 0.4); border-radius: 6px; padding: 8px 12px; text-align: center; margin-top: 6px;">
      <div style="font-size: 8.5px; font-weight: 800; color: #10b981; letter-spacing: 1px; text-transform: uppercase;">ORDEN DEL DÍA</div>
      <div style="font-size: 8px; color: #e5e7eb; font-style: italic;">
        &ldquo;El éxito no es un evento; es la suma de micro-disciplinas repetidas todos los días. ¡Activa tu metabolismo y conquista tu transformación!&rdquo;
      </div>
    </div>

    <div class="footer-bar">
      <div>ACELERADOR METABÓLICO 2X &bull; GUÍA OFICIAL HOTMART</div>
      <div>PÁGINA <span class="accent">3 DE 3</span> &bull; FIN DEL DOCUMENTO</div>
    </div>
  </div>

</body>
</html>`;

const tmpHtml = path.join(WORK_DIR, 'tmp_acelerador.html');
const outPdf = path.join(WORK_DIR, 'Acelerador_Metabolico_2X.pdf');
const netlifyPdf = path.join(NETLIFY_DIR, 'Acelerador_Metabolico_2X.pdf');

fs.writeFileSync(tmpHtml, htmlContent, 'utf8');

console.log('Rendering Acelerador_Metabolico_2X.pdf via Chrome headless...');
try {
  execFileSync(CHROME_PATH, [
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    '--no-pdf-header-footer',
    `--print-to-pdf=${outPdf}`,
    `file:///${tmpHtml.replace(/\\/g, '/')}`
  ]);

  if (fs.existsSync(outPdf)) {
    const size = fs.statSync(outPdf).size;
    console.log(`✅ SUCCESS: Acelerador_Metabolico_2X.pdf created (${size} bytes)`);
    if (fs.existsSync(NETLIFY_DIR)) {
      fs.copyFileSync(outPdf, netlifyPdf);
      console.log(`   Copied to Netlify folder: ${netlifyPdf}`);
    }
  }
} catch (err) {
  console.error('Error rendering PDF:', err.message);
}
