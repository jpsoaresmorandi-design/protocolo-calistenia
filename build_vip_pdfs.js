const fs = require('fs');
const path = require('path');
const { execFileSync } = require('child_process');

const CHROME_PATH = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const WORK_DIR = 'C:\\Users\\buggu\\.gemini\\antigravity\\scratch\\Protocolo da Calistenia';
const NETLIFY_DIR = path.join(WORK_DIR, 'site_para_netlify');

function getBase64DataUrl(filename) {
  const filePath = path.join(WORK_DIR, filename);
  if (fs.existsSync(filePath)) {
    const ext = path.extname(filename).toLowerCase().replace('.', '');
    const mime = ext === 'jpg' || ext === 'jpeg' ? 'image/jpeg' : ext === 'png' ? 'image/png' : 'image/webp';
    const data = fs.readFileSync(filePath).toString('base64');
    return `data:${mime};base64,${data}`;
  }
  return '';
}

// Convert common images to base64
const imgBundle = getBase64DataUrl('bundle_protocolo_completo.jpg');
const imgVipCard = getBase64DataUrl('mockup_plan_completo_vip_card.jpg');
const imgBono1 = getBase64DataUrl('bono_1_nutricion_tactica_acelerada.jpg');
const imgBono2 = getBase64DataUrl('bono_2_movilidad_blindaje_articular.jpg');
const imgBono3 = getBase64DataUrl('bono_3_comunidad_reclutas_soporte.jpg');
const imgAbdomen = getBase64DataUrl('cover_finisher_abdomen.jpg');
const imgBatidos = getBase64DataUrl('cover_batidos_anabolicos.jpg');
const imgScanner = getBase64DataUrl('app_ui_biometrics_scanner.jpg');

// Shared SVG icons
const chevronSvg = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10b981" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>`;
const militaryBadgeSvg = `<svg width="54" height="54" viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg">
  <polygon points="50,4 92,25 92,75 50,96 8,75 8,25" stroke="#10b981" stroke-width="4" fill="#0c1710"/>
  <polygon points="50,14 82,30 82,70 50,86 18,70 18,30" stroke="#f59e0b" stroke-width="2" fill="#080e0a"/>
  <path d="M50 24 L56 38 L71 39 L60 50 L63 65 L50 56 L37 65 L40 50 L29 39 L44 38 Z" fill="#10b981"/>
  <path d="M30 74 L50 84 L70 74" stroke="#f59e0b" stroke-width="3" stroke-linecap="round"/>
</svg>`;

const goldSealSvg = `<svg width="84" height="84" viewBox="0 0 120 120" fill="none" xmlns="http://www.w3.org/2000/svg">
  <circle cx="60" cy="60" r="54" stroke="#f59e0b" stroke-width="3" stroke-dasharray="4 3" fill="#141a12"/>
  <circle cx="60" cy="60" r="48" stroke="#d97706" stroke-width="2" fill="#0d140e"/>
  <polygon points="60,24 67,40 84,40 71,52 76,68 60,58 44,68 49,52 36,40 53,40" fill="#f59e0b"/>
  <text x="60" y="86" text-anchor="middle" fill="#10b981" font-size="9" font-weight="900" font-family="sans-serif" letter-spacing="1.5">VERIFICADO</text>
  <text x="60" y="96" text-anchor="middle" fill="#d1d5db" font-size="7" font-weight="700" font-family="sans-serif" letter-spacing="1">HOTMART VIP</text>
</svg>`;

// ============================================================================
// 1. BIENVENIDO AL PLAN COMPLETO VIP (3 PAGES)
// ============================================================================
function generateBienvenidoHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Bienvenido al Plan Completo VIP - Protocolo de Calistenia Militar</title>
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
      background-color: #070a08;
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
      padding: 16mm 18mm 14mm 18mm;
      background: radial-gradient(circle at 50% 10%, #0d1a11 0%, #060907 80%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    /* Tactical borders & corners */
    .page-border {
      position: absolute;
      top: 8mm;
      left: 8mm;
      right: 8mm;
      bottom: 8mm;
      border: 1px solid rgba(16, 185, 129, 0.35);
      pointer-events: none;
    }
    .corner {
      position: absolute;
      width: 14mm;
      height: 14mm;
      border: 2px solid #10b981;
      pointer-events: none;
    }
    .c-tl { top: 6mm; left: 6mm; border-right: none; border-bottom: none; }
    .c-tr { top: 6mm; right: 6mm; border-left: none; border-bottom: none; }
    .c-bl { bottom: 6mm; left: 6mm; border-right: none; border-top: none; }
    .c-br { bottom: 6mm; right: 6mm; border-left: none; border-top: none; }

    /* Header & Footer */
    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(16, 185, 129, 0.4);
      padding-bottom: 8px;
      margin-bottom: 12px;
    }
    .header-tag {
      font-size: 9px;
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
      width: 7px;
      height: 7px;
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
      padding-top: 8px;
      font-size: 8px;
      color: #9ca3af;
      letter-spacing: 0.5px;
    }
    .footer-bar span.accent {
      color: #10b981;
      font-weight: 700;
    }

    /* Titles */
    .title-vip {
      font-size: 26px;
      font-weight: 900;
      line-height: 1.15;
      text-transform: uppercase;
      letter-spacing: 0.5px;
      color: #ffffff;
      text-align: center;
      margin: 10px 0 6px 0;
    }
    .title-vip span.neon {
      color: #10b981;
      text-shadow: 0 0 14px rgba(16, 185, 129, 0.5);
    }
    .title-vip span.gold {
      color: #f59e0b;
    }
    .subtitle-vip {
      font-size: 11px;
      font-weight: 600;
      color: #9ca3af;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 16px;
    }

    /* Boxes & Cards */
    .card-box {
      background: rgba(13, 22, 16, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.3);
      border-radius: 8px;
      padding: 14px 16px;
      position: relative;
    }
    .card-box.highlight {
      border: 1.5px solid #10b981;
      box-shadow: 0 0 16px rgba(16, 185, 129, 0.18);
      background: rgba(16, 30, 20, 0.9);
    }

    /* Page 1 Hero Specifics */
    .hero-center {
      display: flex;
      flex-direction: column;
      align-items: center;
      text-align: center;
      margin: 10px 0;
    }
    .hero-badge-wrap {
      margin-bottom: 8px;
    }
    .p-text {
      font-size: 11px;
      line-height: 1.6;
      color: #d1d5db;
      margin-bottom: 10px;
    }
    .p-text strong {
      color: #ffffff;
    }
    .p-text span.green {
      color: #34d399;
      font-weight: 700;
    }
    .p-text span.gold {
      color: #fbbf24;
      font-weight: 700;
    }
    .notice-app-box {
      background: rgba(245, 158, 11, 0.08);
      border-left: 4px solid #f59e0b;
      padding: 10px 14px;
      border-radius: 0 6px 6px 0;
      margin: 12px 0;
      text-align: left;
    }
    .notice-app-box h4 {
      font-size: 10.5px;
      color: #f59e0b;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin-bottom: 4px;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .notice-app-box p {
      font-size: 9.5px;
      line-height: 1.5;
      color: #d1d5db;
    }

    /* Page 2 Steps */
    .step-list {
      display: flex;
      flex-direction: column;
      gap: 10px;
      margin: 12px 0;
    }
    .step-item {
      display: flex;
      align-items: flex-start;
      gap: 12px;
      background: rgba(12, 19, 14, 0.7);
      border: 1px solid rgba(255, 255, 255, 0.07);
      border-radius: 6px;
      padding: 10px 14px;
    }
    .step-num {
      width: 28px;
      height: 28px;
      border-radius: 50%;
      background: #10b981;
      color: #050805;
      font-size: 13px;
      font-weight: 900;
      display: flex;
      align-items: center;
      justify-content: center;
      flex-shrink: 0;
      box-shadow: 0 0 10px rgba(16, 185, 129, 0.6);
    }
    .step-content {
      flex: 1;
    }
    .step-title {
      font-size: 11px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 2px;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .step-desc {
      font-size: 9.5px;
      color: #9ca3af;
      line-height: 1.45;
    }

    /* Big Action Button */
    .cta-btn-wrap {
      text-align: center;
      margin: 14px 0 10px 0;
    }
    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #03140a !important;
      font-size: 14px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 14px 34px;
      border-radius: 50px;
      text-decoration: none;
      box-shadow: 0 0 24px rgba(16, 185, 129, 0.7), 0 4px 12px rgba(0, 0, 0, 0.6);
      border: 2px solid #6ee7b7;
      cursor: pointer;
    }
    .cta-sublink {
      font-size: 8.5px;
      color: #10b981;
      margin-top: 6px;
      word-break: break-all;
      text-decoration: underline;
    }

    /* Page 3 Arsenal Grid */
    .arsenal-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 10px 0;
    }
    .arsenal-item {
      background: rgba(14, 23, 17, 0.7);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 6px;
      padding: 8px 10px;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .arsenal-item.full-span {
      grid-column: span 2;
      background: rgba(16, 35, 23, 0.85);
      border: 1.5px solid #10b981;
    }
    .arsenal-tag {
      font-size: 7.5px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1px;
      color: #10b981;
      margin-bottom: 2px;
    }
    .arsenal-tag.gold {
      color: #f59e0b;
    }
    .arsenal-name {
      font-size: 10px;
      font-weight: 800;
      color: #ffffff;
      line-height: 1.25;
      margin-bottom: 3px;
    }
    .arsenal-desc {
      font-size: 8px;
      color: #9ca3af;
      line-height: 1.35;
    }

    /* Motivational box */
    .motto-box {
      background: linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(245, 158, 11, 0.08) 100%);
      border: 1px dashed rgba(16, 185, 129, 0.5);
      border-radius: 6px;
      padding: 10px 14px;
      text-align: center;
      margin-top: 8px;
    }
    .motto-title {
      font-size: 10px;
      font-weight: 900;
      color: #10b981;
      letter-spacing: 1.5px;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .motto-text {
      font-size: 9.5px;
      color: #e5e7eb;
      font-style: italic;
      line-height: 1.45;
    }
  </style>
</head>
<body>

  <!-- ==================================================================== -->
  <!-- PÁGINA 1: BOAS-VINDAS OFICIAIS & AGRADECIMENTO VIP                    -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">DOCUMENTO OFICIAL DE BIENVENIDA • HOTMART 2026</div>
      <div class="header-badge">RANGO VIP OFICIAL</div>
    </div>

    <div class="hero-center">
      <div class="hero-badge-wrap">${militaryBadgeSvg}</div>
      <h1 class="title-vip">¡BIENVENIDO AL <span class="neon">PLAN COMPLETO</span> <span class="gold">VIP!</span></h1>
      <p class="subtitle-vip">PROTOCOLO DE CALISTENIA MILITAR • SISTEMA TÁCTICO DE 21 DÍAS</p>
    </div>

    <div class="card-box highlight" style="margin-bottom: 10px;">
      <p class="p-text" style="font-size: 12px; margin-bottom: 6px;">
        <strong>¡Felicidades, Soldado! Has tomado la decisión definitiva.</strong>
      </p>
      <p class="p-text">
        Al asegurar tu acceso al <span class="gold">Plan Completo VIP</span> del <strong>Protocolo de Calistenia Militar</strong>, dejas atrás las rutinas genéricas, el estancamiento y las dietas restrictivas para unirte a un sistema de élite diseñado con <strong>progresiones biomecánicas de alta densidad</strong> para quemar grasa profunda, construir masa muscular funcional y forjar disciplina blindada en 21 días.
      </p>
      <p class="p-text" style="margin-bottom: 0;">
        Hoy desbloqueas el arsenal más avanzado jamás reunido para transformar tu cuerpo desde casa, sin necesidad de gimnasio ni equipamiento costoso.
      </p>
    </div>

    <div class="notice-app-box">
      <h4>⚡ INFORMACIÓN CRÍTICA SOBRE TU ACCESO</h4>
      <p>
        <strong>El Protocolo de Calistenia Militar NO es un simple libro PDF estático ni un video grabado en un drive.</strong> Es un <strong>sistema táctico interactivo alojado en nuestra Aplicación Oficial Web & PWA</strong>. Este documento en PDF es tu credencial de bienvenida, confirmación de membresía y guía operativa para sincronizar tu cuenta en la plataforma digital.
      </p>
    </div>

    <div class="card-box" style="display: flex; align-items: center; justify-content: space-between; padding: 10px 14px;">
      <div>
        <div style="font-size: 8px; color: #10b981; font-weight: 800; letter-spacing: 1px; text-transform: uppercase;">Estado de la Membresía</div>
        <div style="font-size: 12px; font-weight: 900; color: #ffffff;">ACTIVA • PLAN COMPLETO VIP (ACCESO ILIMITADO)</div>
      </div>
      <div>
        ${goldSealSvg}
      </div>
    </div>

    <div class="footer-bar">
      <div>PROTOCOLO DE CALISTENIA MILITAR &copy; 2026</div>
      <div>HOTMART MIEMBRO VIP &bull; PÁGINA <span class="accent">1 DE 3</span></div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PÁGINA 2: ACTIVACIÓN Y ACCESO AL APLICATIVO                           -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">INSTRUCCIONES OPERATIVAS DE ENTRADA</div>
      <div class="header-badge">PASO A PASO</div>
    </div>

    <div>
      <h2 class="title-vip" style="font-size: 22px;">ACTIVA TU ACCESO Y COMIENZA TU <span class="neon">TRANSFORMACIÓN</span></h2>
      <p class="subtitle-vip">SIGUE ESTOS 5 PASOS PARA INGRESAR AL SISTEMA DIGITAL OFICIAL</p>
    </div>

    <!-- Big clickable Button -->
    <div class="cta-btn-wrap">
      <a href="https://protocolo-calistenia-pi.vercel.app/app/onboarding.html" target="_blank" class="cta-button">
        🪖 ACCEDER A MI ENTRENAMIENTO
      </a>
      <div class="cta-sublink">
        https://protocolo-calistenia-pi.vercel.app/app/onboarding.html
      </div>
    </div>

    <div class="step-list">
      <div class="step-item">
        <div class="step-num">1</div>
        <div class="step-content">
          <div class="step-title">HAZ CLIC EN EL BOTÓN SUPERIOR</div>
          <div class="step-desc">Abre el portal táctico oficial desde cualquier dispositivo (smartphone iPhone/Android, tablet o computador). No requieres descargar nada de tiendas lentas.</div>
        </div>
      </div>

      <div class="step-item">
        <div class="step-num">2</div>
        <div class="step-content">
          <div class="step-title">INGRESA EL CORREO ELECTRÓNICO DE TU COMPRA</div>
          <div class="step-desc">Introduce exactamente el mismo correo que registraste al realizar el pago en Hotmart. El sistema verificará tu orden de forma segura en tiempo real.</div>
        </div>
      </div>

      <div class="step-item">
        <div class="step-num">3</div>
        <div class="step-content">
          <div class="step-title">CREA TU CONTRASEÑA O INICIA SESIÓN</div>
          <div class="step-desc">Si eres nuevo recluta, establece tu contraseña militar personal. Si ya tenías una cuenta previa, inicia sesión y tus privilegios VIP se sumarán sin duplicar tu perfil.</div>
        </div>
      </div>

      <div class="step-item">
        <div class="step-num">4</div>
        <div class="step-content">
          <div class="step-title">COMPLETA EL ONBOARDING BIOMECÁNICO</div>
          <div class="step-desc">Ingresa tu peso, edad, estatura y nivel actual de fuerza para que el algoritmo calibre automáticamente tus series, descansos y macronutrientes.</div>
        </div>
      </div>

      <div class="step-item">
        <div class="step-num">5</div>
        <div class="step-content">
          <div class="step-title">INICIA TU DÍA 1 & INSTALA LA APP (PWA)</div>
          <div class="step-desc">Guarda el acceso directo en tu pantalla de inicio con un clic para tener la aplicación disponible las 24 horas, incluso sin conexión a internet rápida.</div>
        </div>
      </div>
    </div>

    <div class="card-box" style="background: rgba(16, 185, 129, 0.08); border-color: rgba(16, 185, 129, 0.4); padding: 8px 12px;">
      <div style="font-size: 8.5px; color: #10b981; font-weight: 800; text-transform: uppercase; margin-bottom: 2px;">
        🛡️ SEGURIDAD DE AUTENTICACIÓN MILITAR
      </div>
      <div style="font-size: 8px; color: #d1d5db; line-height: 1.4;">
        Por estrictas políticas de protección antifraude, el estatus VIP se habilita únicamente a correos electrónicos con compras confirmadas y validadas por el servidor. Conserva tu comprobante de Hotmart para cualquier consulta técnica.
      </div>
    </div>

    <div class="footer-bar">
      <div>SOPORTE TÁCTICO: soporte@protocolocalistenia.com</div>
      <div>HOTMART MIEMBRO VIP &bull; PÁGINA <span class="accent">2 DE 3</span></div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PÁGINA 3: ARSENAL COMPLETO VIP & MENSAJE MOTIVACIONAL                 -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">ARSENAL TÁCTICO COMPLETO</div>
      <div class="header-badge">9 ENTREGABLES VIP</div>
    </div>

    <div>
      <h2 class="title-vip" style="font-size: 20px;">TODO LO QUE INCLUYE TU <span class="gold">PLAN COMPLETO VIP</span></h2>
      <p class="subtitle-vip">HERRAMIENTAS DESBLOQUEADAS DE FORMA ILIMITADA EN TU CUENTA</p>
    </div>

    <div class="arsenal-grid">
      <div class="arsenal-item full-span">
        <div class="arsenal-tag">SISTEMA PRINCIPAL</div>
        <div class="arsenal-name">1. Protocolo Central de 21 Días de Calistenia Militar</div>
        <div class="arsenal-desc">Guía táctica paso a paso con progresiones biomecánicas de nivel cero a avanzado para quemar grasa profunda y tonificar en casa sin comprar equipo.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag">TECNOLOGÍA OFICIAL</div>
        <div class="arsenal-name">2. App Móvil & Web 24/7</div>
        <div class="arsenal-desc">Instalable en 1 clic (iOS/Android/PC). Cronómetro inteligente, misiones diarias y sincronización cloud.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag">BONO #1 &bull; 100% GRATIS</div>
        <div class="arsenal-name">3. Nutrición Táctica Acelerada</div>
        <div class="arsenal-desc">Aprende a comer para definir masa muscular sin pasar hambre. Cálculo de macros y déficit calórico preciso.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag">BONO #2 &bull; 100% GRATIS</div>
        <div class="arsenal-name">4. Blindaje Articular & Movilidad</div>
        <div class="arsenal-desc">Calentamiento y descompresión táctica para proteger rodillas, hombros y columna baja mientras ganas elasticidad.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag">BONO #3 &bull; 100% GRATIS</div>
        <div class="arsenal-name">5. Comunidad de Reclutas & Soporte</div>
        <div class="arsenal-desc">Acceso al escuadrón táctico privado con más de 2,400 reclutas activos. Resolución de dudas y motivación diaria.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag gold">UPGRADE VIP #1</div>
        <div class="arsenal-name">6. Finisher Abdomen de Acero (5 Min)</div>
        <div class="arsenal-desc">Circuitos de alta intensidad para compactar la faja abdominal y eliminar la grasa rebelde del abdomen bajo.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag gold">UPGRADE VIP #2</div>
        <div class="arsenal-name">7. 12 Batidos Anabólicos Militares</div>
        <div class="arsenal-desc">Fórmulas naturales de rápida asimilación para acelerar la síntesis proteica, recuperación y volumen magro.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag gold">EXCLUSIVO VIP #1</div>
        <div class="arsenal-name">8. Certificado Oficial Táctico Militar</div>
        <div class="arsenal-desc">Acreditación con código único que certifica tu graduación tras superar con disciplina los 21 días de entrenamiento.</div>
      </div>

      <div class="arsenal-item">
        <div class="arsenal-tag gold">EXCLUSIVO VIP #2</div>
        <div class="arsenal-name">9. Calculadora Biomecánica & Escáner</div>
        <div class="arsenal-desc">Diagnóstico preciso de porcentaje graso, gasto calórico y calibración semanal de cargas por peso corporal.</div>
      </div>
    </div>

    <!-- Motivational closing box -->
    <div class="motto-box">
      <div class="motto-title">MENSAJE DEL COMANDO TÁCTICO</div>
      <div class="motto-text">
        &ldquo;La motivación te hace empezar, pero solo la disciplina te mantiene de pie cuando el cuerpo quiere renunciar. Tienes en tus manos el mapa exacto hacia la mejor versión física de tu vida. No des un paso atrás. ¡Tu escuadrón te espera en el Día 1!&rdquo;
      </div>
    </div>

    <div class="footer-bar">
      <div>LICENCIA OFICIAL PLAN COMPLETO VIP &bull; HOTMART</div>
      <div>PÁGINA <span class="accent">3 DE 3</span> &bull; FIN DEL DOCUMENTO</div>
    </div>
  </div>

</body>
</html>`;
}

// ============================================================================
// 2. CERTIFICADO OFICIAL TÁCTICO MILITAR (1 PAGE LANDSCAPE)
// ============================================================================
function generateCertificadoHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Certificado Oficial Táctico Militar - Protocolo de Calistenia</title>
  <style>
    @page {
      size: A4 landscape;
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
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Inter', 'Cinzel', Georgia, serif;
      -webkit-print-color-adjust: exact;
      print-color-adjust: exact;
    }
    .page-landscape {
      width: 297mm;
      height: 210mm;
      position: relative;
      overflow: hidden;
      page-break-after: always;
      break-after: page;
      padding: 12mm 16mm;
      background: radial-gradient(circle at 50% 50%, #0d1a10 0%, #050806 80%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }

    /* Double Ornate Border */
    .outer-border {
      position: absolute;
      top: 6mm;
      left: 6mm;
      right: 6mm;
      bottom: 6mm;
      border: 2px solid #d4af37;
      pointer-events: none;
    }
    .inner-border {
      position: absolute;
      top: 9mm;
      left: 9mm;
      right: 9mm;
      bottom: 9mm;
      border: 1px solid rgba(16, 185, 129, 0.5);
      pointer-events: none;
    }
    .dashed-border {
      position: absolute;
      top: 11mm;
      left: 11mm;
      right: 11mm;
      bottom: 11mm;
      border: 0.5px dashed rgba(212, 175, 55, 0.4);
      pointer-events: none;
    }

    /* Corner embellishments */
    .corner-emb {
      position: absolute;
      width: 18mm;
      height: 18mm;
      border: 3px solid #f59e0b;
      pointer-events: none;
    }
    .emb-tl { top: 4.5mm; left: 4.5mm; border-right: none; border-bottom: none; }
    .emb-tr { top: 4.5mm; right: 4.5mm; border-left: none; border-bottom: none; }
    .emb-bl { bottom: 4.5mm; left: 4.5mm; border-right: none; border-top: none; }
    .emb-br { bottom: 4.5mm; right: 4.5mm; border-left: none; border-top: none; }

    /* Watermark */
    .watermark {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      opacity: 0.04;
      pointer-events: none;
      width: 140mm;
      height: 140mm;
    }

    /* Certificate Content */
    .cert-header {
      text-align: center;
      margin-top: 4mm;
    }
    .cert-subtop {
      font-size: 9.5px;
      font-weight: 800;
      letter-spacing: 4px;
      color: #10b981;
      text-transform: uppercase;
      margin-bottom: 3px;
    }
    .cert-main-title {
      font-size: 32px;
      font-weight: 900;
      color: #f59e0b;
      letter-spacing: 3px;
      text-transform: uppercase;
      text-shadow: 0 0 16px rgba(245, 158, 11, 0.35);
      margin-bottom: 2px;
    }
    .cert-subtitle {
      font-size: 11px;
      font-weight: 600;
      letter-spacing: 2.5px;
      color: #9ca3af;
      text-transform: uppercase;
    }

    .cert-body {
      text-align: center;
      margin: 4mm 20mm;
    }
    .cert-preamble {
      font-size: 11px;
      color: #d1d5db;
      font-style: italic;
      letter-spacing: 1px;
      margin-bottom: 6mm;
    }

    .student-name-box {
      border-bottom: 2px solid #10b981;
      padding-bottom: 4px;
      margin: 0 auto 6mm auto;
      max-width: 190mm;
    }
    .student-name-text {
      font-size: 24px;
      font-weight: 900;
      color: #ffffff;
      letter-spacing: 2px;
      text-transform: uppercase;
      text-shadow: 0 0 12px rgba(255, 255, 255, 0.2);
    }

    .cert-statement {
      font-size: 11.5px;
      line-height: 1.6;
      color: #e5e7eb;
      max-width: 210mm;
      margin: 0 auto;
    }
    .cert-statement strong {
      color: #10b981;
      font-weight: 800;
    }
    .cert-statement span.gold {
      color: #f59e0b;
      font-weight: 700;
    }

    /* Footer Signatures & Seal */
    .cert-footer {
      display: flex;
      align-items: flex-end;
      justify-content: space-between;
      margin: 0 16mm 4mm 16mm;
    }
    .sig-block {
      text-align: center;
      width: 65mm;
    }
    .sig-line {
      border-top: 1.5px solid #6b7280;
      margin-bottom: 4px;
      padding-top: 4px;
    }
    .sig-name {
      font-size: 9.5px;
      font-weight: 800;
      color: #ffffff;
      letter-spacing: 1px;
      text-transform: uppercase;
    }
    .sig-title {
      font-size: 7.5px;
      color: #9ca3af;
      letter-spacing: 0.5px;
      text-transform: uppercase;
    }
    .sig-draw {
      font-family: 'Brush Script MT', cursive, sans-serif;
      font-size: 20px;
      color: #10b981;
      line-height: 1;
      margin-bottom: 2px;
    }

    .seal-center {
      text-align: center;
      display: flex;
      flex-direction: column;
      align-items: center;
    }
    .cert-code-tag {
      font-size: 8px;
      font-family: monospace;
      color: #f59e0b;
      letter-spacing: 1.5px;
      margin-top: 3px;
    }
    .date-block {
      font-size: 8.5px;
      color: #9ca3af;
      letter-spacing: 1px;
      margin-top: 2px;
    }
  </style>
</head>
<body>

  <div class="page-landscape">
    <div class="outer-border"></div>
    <div class="inner-border"></div>
    <div class="dashed-border"></div>
    <div class="corner-emb emb-tl"></div>
    <div class="corner-emb emb-tr"></div>
    <div class="corner-emb emb-bl"></div>
    <div class="corner-emb emb-br"></div>

    <svg class="watermark" viewBox="0 0 100 100" fill="none">
      <polygon points="50,4 92,25 92,75 50,96 8,75 8,25" stroke="#ffffff" stroke-width="2"/>
      <path d="M50 24 L56 38 L71 39 L60 50 L63 65 L50 56 L37 65 L40 50 L29 39 L44 38 Z" fill="#ffffff"/>
    </svg>

    <div class="cert-header">
      <div class="cert-subtop">REPÚBLICA DE ATLETAS TÁCTICOS &bull; CUERPO DE INSTRUCCIÓN MILITAR</div>
      <h1 class="cert-main-title">CERTIFICADO DE FINALIZACIÓN</h1>
      <p class="cert-subtitle">PROTOCOLO CENTRAL DE 21 DÍAS DE CALISTENIA MILITAR</p>
    </div>

    <div class="cert-body">
      <p class="cert-preamble">Por cuanto ha demostrado máxima disciplina, tenacidad física y superación táctica inquebrantable, se certifica formalmente que:</p>
      
      <div class="student-name-box">
        <div class="student-name-text">[ NOMBRE DEL GRADUADO ]</div>
      </div>

      <p class="cert-statement">
        Ha completado satisfactoriamente el ciclo intensivo de <strong>21 Días del Protocolo de Calistenia Militar</strong>, dominando las progresiones biomecánicas de peso corporal, reacondicionamiento articular y nutrición táctica, alcanzando el grado de <span class="gold">SOLDADO DE ÉLITE OPERATIVO</span>.
      </p>
    </div>

    <div class="cert-footer">
      <!-- Signature Left -->
      <div class="sig-block">
        <div class="sig-draw">Alexander Miller</div>
        <div class="sig-line"></div>
        <div class="sig-name">Alexander Miller</div>
        <div class="sig-title">Comandante & Instructor Jefe Biomecánico</div>
      </div>

      <!-- Seal Center -->
      <div class="seal-center">
        ${goldSealSvg}
        <div class="cert-code-tag">ID: TAC-21D-MIL-XXXXXX</div>
        <div class="date-block">FECHA DE EMISIÓN: ____ / ____ / 2026</div>
      </div>

      <!-- Signature Right -->
      <div class="sig-block">
        <div class="sig-draw">Dr. Héctor V. Táctico</div>
        <div class="sig-line"></div>
        <div class="sig-name">Consejo Evaluador Táctico</div>
        <div class="sig-title">Dirección Metodológica & Certificaciones</div>
      </div>
    </div>
  </div>

</body>
</html>`;
}

// ============================================================================
// 3. CALCULADORA BIOMECÁNICA & ESCÁNER VIP (2 PAGES PORTRAIT)
// ============================================================================
function generateCalculadoraHtml() {
  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <title>Calculadora Biomecánica & Escáner VIP - Protocolo de Calistenia</title>
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
      background-color: #070a08;
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
      padding: 16mm 18mm 14mm 18mm;
      background: radial-gradient(circle at 50% 10%, #0d1a11 0%, #060907 80%);
      display: flex;
      flex-direction: column;
      justify-content: space-between;
    }
    .page-border {
      position: absolute;
      top: 8mm;
      left: 8mm;
      right: 8mm;
      bottom: 8mm;
      border: 1px solid rgba(16, 185, 129, 0.35);
      pointer-events: none;
    }
    .corner {
      position: absolute;
      width: 14mm;
      height: 14mm;
      border: 2px solid #10b981;
      pointer-events: none;
    }
    .c-tl { top: 6mm; left: 6mm; border-right: none; border-bottom: none; }
    .c-tr { top: 6mm; right: 6mm; border-left: none; border-bottom: none; }
    .c-bl { bottom: 6mm; left: 6mm; border-right: none; border-top: none; }
    .c-br { bottom: 6mm; right: 6mm; border-left: none; border-top: none; }

    .header-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid rgba(16, 185, 129, 0.4);
      padding-bottom: 8px;
      margin-bottom: 10px;
    }
    .header-tag {
      font-size: 9px;
      font-weight: 800;
      letter-spacing: 2px;
      color: #10b981;
      text-transform: uppercase;
      display: flex;
      align-items: center;
      gap: 6px;
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
      padding-top: 8px;
      font-size: 8px;
      color: #9ca3af;
    }
    .footer-bar span.accent {
      color: #10b981;
      font-weight: 700;
    }

    .title-doc {
      font-size: 22px;
      font-weight: 900;
      line-height: 1.2;
      text-transform: uppercase;
      color: #ffffff;
      text-align: center;
      margin: 6px 0 4px 0;
    }
    .title-doc span.neon { color: #10b981; }
    .title-doc span.gold { color: #f59e0b; }
    .subtitle-doc {
      font-size: 10px;
      font-weight: 600;
      color: #9ca3af;
      text-align: center;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      margin-bottom: 12px;
    }

    .section-title {
      font-size: 11px;
      font-weight: 800;
      color: #10b981;
      text-transform: uppercase;
      letter-spacing: 1px;
      margin: 10px 0 6px 0;
      display: flex;
      align-items: center;
      gap: 6px;
    }

    .metric-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 8px;
      margin: 8px 0;
    }
    .metric-card {
      background: rgba(13, 22, 16, 0.85);
      border: 1px solid rgba(16, 185, 129, 0.25);
      border-radius: 6px;
      padding: 9px 11px;
    }
    .metric-name {
      font-size: 10px;
      font-weight: 800;
      color: #ffffff;
      margin-bottom: 3px;
      display: flex;
      align-items: center;
      gap: 5px;
    }
    .metric-name span.tag {
      font-size: 7.5px;
      background: #10b981;
      color: #060907;
      padding: 1px 4px;
      border-radius: 3px;
      font-weight: 900;
    }
    .metric-desc {
      font-size: 8.5px;
      color: #9ca3af;
      line-height: 1.4;
    }

    /* Table styles */
    .tactical-table {
      width: 100%;
      border-collapse: collapse;
      margin: 8px 0;
      font-size: 8.5px;
    }
    .tactical-table th {
      background: rgba(16, 185, 129, 0.2);
      color: #10b981;
      font-weight: 800;
      text-align: left;
      padding: 6px 8px;
      border-bottom: 1px solid #10b981;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .tactical-table td {
      padding: 6px 8px;
      border-bottom: 1px solid rgba(255, 255, 255, 0.07);
      color: #d1d5db;
    }
    .tactical-table tr:nth-child(even) {
      background: rgba(13, 20, 15, 0.5);
    }

    .cta-button {
      display: inline-block;
      background: linear-gradient(135deg, #10b981 0%, #059669 100%);
      color: #03140a !important;
      font-size: 13px;
      font-weight: 900;
      text-transform: uppercase;
      letter-spacing: 1.5px;
      padding: 12px 28px;
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
  <!-- PÁGINA 1: FUNDAMENTOS Y MÉTRICAS EVALUADAS                           -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">MANUAL OPERATIVO DE BIOINGENIERÍA &bull; VIP EXCLUSIVO</div>
      <div class="header-badge">HERRAMIENTA TÁCTICA</div>
    </div>

    <div>
      <h1 class="title-doc">CALCULADORA BIOMECÁNICA & <span class="neon">ESCÁNER TÁCTICO</span></h1>
      <p class="subtitle-doc">SISTEMA DE PRECISIÓN DE MÉTRICAS FÍSICAS • PLAN COMPLETO VIP</p>
    </div>

    <div>
      <div class="section-title">⚡ 1. ¿QUÉ ES EL ESCÁNER BIOMECÁNICO?</div>
      <div style="background: rgba(13, 22, 16, 0.7); border: 1px solid rgba(16, 185, 129, 0.25); border-radius: 6px; padding: 10px 12px; font-size: 9.5px; line-height: 1.5; color: #d1d5db;">
        La <strong>Calculadora Biomecánica & Escáner Táctico</strong> es la herramienta de bioingeniería corporal integrada en el Plan Completo VIP. Su función es <strong>eliminar las conjeturas</strong>: traduce tus dimensiones físicas, peso, circunferencia y nivel de actividad en parámetros numéricos exactos para optimizar tu quema de grasa sin degradar músculo.
      </div>
    </div>

    <div>
      <div class="section-title">🎯 2. MÉTRICAS CLAVE EVALUADAS POR EL ALGORITMO</div>
      <div class="metric-grid">
        <div class="metric-card">
          <div class="metric-name"><span>% GRASA CORPORAL ESTIMADA</span> <span class="tag">BF%</span></div>
          <div class="metric-desc">Estima tu índice de adiposidad total y grasa visceral abdominal para establecer tu zona de déficit táctico seguro sin perder masa magra.</div>
        </div>

        <div class="metric-card">
          <div class="metric-name"><span>TASA METABÓLICA BASAL</span> <span class="tag">TMB</span></div>
          <div class="metric-desc">Calcula las calorías mínimas que tu organismo quema en reposo para mantener tus órganos, sistema nervioso y masa muscular activos.</div>
        </div>

        <div class="metric-card">
          <div class="metric-name"><span>GASTO TOTAL DIARIO</span> <span class="tag">TDEE</span></div>
          <div class="metric-desc">Tu consumo energético total sumando los entrenamientos de calistenia militar y tu movimiento cotidiano (NEAT).</div>
        </div>

        <div class="metric-card">
          <div class="metric-name"><span>DÉFICIT CALÓRICO TÁCTICO</span> <span class="tag">TARGET</span></div>
          <div class="metric-desc">Fija la reducción exacta de 300 a 500 kcal diarias requerida para forzar al cuerpo a quemar reservas lipídicas como combustible primario.</div>
        </div>

        <div class="metric-card">
          <div class="metric-name"><span>DIANA PROTEICA DIARIA</span> <span class="tag">MACROS</span></div>
          <div class="metric-desc">Garantiza entre 1.8g y 2.2g de proteína por kg de peso magro para blindar los músculos durante los 21 días de entrenamiento.</div>
        </div>

        <div class="metric-card">
          <div class="metric-name"><span>RATIO FUERZA / PESO</span> <span class="tag">PWR</span></div>
          <div class="metric-desc">Mide tu palanca biomecánica en flexiones y dominadas, indicando cuándo estás listo para progresar al siguiente escalón técnico.</div>
        </div>
      </div>
    </div>

    <div>
      <div class="section-title">📊 3. MATRIZ DE RANGOS DE RENDIMIENTO</div>
      <table class="tactical-table">
        <thead>
          <tr>
            <th>RANGO MILITAR</th>
            <th>% GRASA ESTIMADO</th>
            <th>NIVEL CALISTÉNICO</th>
            <th>ESTRATEGIA NUTRICIONAL</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td><strong style="color: #60a5fa;">RECLUTA (INICIACIÓN)</strong></td>
            <td>Hombre: &gt;22% &bull; Mujer: &gt;30%</td>
            <td>Adaptación / Flexiones inclinadas</td>
            <td>Déficit táctico moderado (400 kcal)</td>
          </tr>
          <tr>
            <td><strong style="color: #10b981;">OPERATIVO (INTERMEDIO)</strong></td>
            <td>Hombre: 14% - 20% &bull; Mujer: 22% - 28%</td>
            <td>Flexiones militares completas + series</td>
            <td>Recomposición muscular / Proteína alta</td>
          </tr>
          <tr>
            <td><strong style="color: #f59e0b;">ÉLITE TÁCTICO (AVANZADO)</strong></td>
            <td>Hombre: 9% - 13% &bull; Mujer: 16% - 21%</td>
            <td>Flexiones diamante + finishers 5 min</td>
            <td>Mantenimiento / Cargas de batidos anabólicos</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="footer-bar">
      <div>CALCULADORA BIOMECÁNICA VIP &bull; GUÍA OFICIAL</div>
      <div>HOTMART VIP &bull; PÁGINA <span class="accent">1 DE 2</span></div>
    </div>
  </div>

  <!-- ==================================================================== -->
  <!-- PÁGINA 2: PROTOCOLO DE USO Y ACCESO A LA HERRAMIENTA                 -->
  <!-- ==================================================================== -->
  <div class="page">
    <div class="page-border"></div>
    <div class="corner c-tl"></div>
    <div class="corner c-tr"></div>
    <div class="corner c-bl"></div>
    <div class="corner c-br"></div>

    <div class="header-bar">
      <div class="header-tag">PROTOCOLO DE MEDICIÓN SEMANAL</div>
      <div class="header-badge">PLAN OPERATIVO</div>
    </div>

    <div>
      <h2 class="title-doc" style="font-size: 20px;">CÓMO USAR LA CALCULADORA EN LA <span class="neon">APLICACIÓN</span></h2>
      <p class="subtitle-doc">CALENDARIO DE RECALIBRACIÓN TÁCTICA PARA MÁXIMOS RESULTADOS</p>
    </div>

    <div class="cta-btn-wrap" style="text-align: center; margin: 10px 0;">
      <a href="https://protocolo-calistenia-pi.vercel.app/app/onboarding.html" target="_blank" class="cta-button">
        ⚡ ABRIR CALCULADORA & ESCÁNER EN LA APP
      </a>
      <div style="font-size: 8.5px; color: #10b981; margin-top: 6px;">
        Acceso directo disponible en la sección de Nutrición y Perfil de tu App VIP
      </div>
    </div>

    <div>
      <div class="section-title">📅 4. PROTOCOLO DE RECALIBRACIÓN SEMANAL (21 DÍAS)</div>
      <div style="display: flex; flex-direction: column; gap: 8px; margin: 8px 0;">
        <div style="background: rgba(13, 22, 16, 0.8); border-left: 3px solid #10b981; padding: 8px 12px; border-radius: 0 6px 6px 0;">
          <div style="font-size: 10px; font-weight: 800; color: #ffffff;">DÍA 1 — ESCANEO BASE & CONFIGURACIÓN INICIAL</div>
          <div style="font-size: 8.5px; color: #9ca3af; line-height: 1.4;">Toma tus medidas en ayunas (peso y cintura a la altura del ombligo). Introduce los datos en la App para recibir tus calorías exactas de la Semana 1.</div>
        </div>

        <div style="background: rgba(13, 22, 16, 0.8); border-left: 3px solid #10b981; padding: 8px 12px; border-radius: 0 6px 6px 0;">
          <div style="font-size: 10px; font-weight: 800; color: #ffffff;">DÍA 7 — PRIMER AJUSTE METABÓLICO</div>
          <div style="font-size: 8.5px; color: #9ca3af; line-height: 1.4;">Evalúa tu primera bajada de grasa e hinchazón. Si has perdido más de 1.5 kg, ajusta tu ingesta proteica para proteger el tono muscular.</div>
        </div>

        <div style="background: rgba(13, 22, 16, 0.8); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 0 6px 6px 0;">
          <div style="font-size: 10px; font-weight: 800; color: #ffffff;">DÍA 14 — FASE DE DEFINICIÓN PROFUNDA</div>
          <div style="font-size: 8.5px; color: #9ca3af; line-height: 1.4;">Momento en que el abdomen comienza a marcarse. Se activan los finishers de 5 minutos y se recalibra la ventana de carbohidratos anabólicos.</div>
        </div>

        <div style="background: rgba(13, 22, 16, 0.8); border-left: 3px solid #f59e0b; padding: 8px 12px; border-radius: 0 6px 6px 0;">
          <div style="font-size: 10px; font-weight: 800; color: #ffffff;">DÍA 21 — EVALUACIÓN FINAL & GRADUACIÓN</div>
          <div style="font-size: 8.5px; color: #9ca3af; line-height: 1.4;">Escaneo comparativo final: reducción total de cm de cintura, incremento en ratio de fuerza relativa y desbloqueo del Certificado Oficial Militar.</div>
        </div>
      </div>
    </div>

    <div>
      <div class="section-title">📋 5. REGLAS DE ORO PARA UNA MEDICIÓN EXACTA</div>
      <div style="background: rgba(12, 18, 14, 0.9); border: 1px solid rgba(255, 255, 255, 0.1); border-radius: 6px; padding: 10px 14px;">
        <ul style="font-size: 8.5px; color: #d1d5db; line-height: 1.6; padding-left: 16px;">
          <li><strong>Mide siempre a la misma hora:</strong> Preferiblemente por la mañana, en ayunas y después de ir al baño.</li>
          <li><strong>No te obsesiones con el peso bruto de la báscula:</strong> La calistenia construye músculo denso mientras quema grasa. El espejo y los centímetros de cintura son tu verdadero indicador.</li>
          <li><strong>Mantén la hidratación táctica:</strong> Bebe entre 35ml y 45ml de agua por kg de peso al día para que el escáner registre balances hídricos óptimos.</li>
        </ul>
      </div>
    </div>

    <div class="footer-bar">
      <div>CALCULADORA BIOMECÁNICA VIP &bull; PROTOCOLO DE CALISTENIA MILITAR</div>
      <div>PÁGINA <span class="accent">2 DE 2</span> &bull; FIN DE LA GUÍA</div>
    </div>
  </div>

</body>
</html>`;
}

// ============================================================================
// MAIN GENERATOR
// ============================================================================
async function run() {
  const filesToBuild = [
    {
      name: 'Bienvenido_Plan_Completo_VIP.pdf',
      htmlFile: path.join(WORK_DIR, 'tmp_bienvenido.html'),
      pdfFile: path.join(WORK_DIR, 'Bienvenido_Plan_Completo_VIP.pdf'),
      netlifyPdf: path.join(NETLIFY_DIR, 'Bienvenido_Plan_Completo_VIP.pdf'),
      generator: generateBienvenidoHtml,
      landscape: false
    },
    {
      name: 'Certificado_Oficial_Tactico_Militar.pdf',
      htmlFile: path.join(WORK_DIR, 'tmp_certificado.html'),
      pdfFile: path.join(WORK_DIR, 'Certificado_Oficial_Tactico_Militar.pdf'),
      netlifyPdf: path.join(NETLIFY_DIR, 'Certificado_Oficial_Tactico_Militar.pdf'),
      generator: generateCertificadoHtml,
      landscape: true
    },
    {
      name: 'Calculadora_Biomecanica_Escaner_VIP.pdf',
      htmlFile: path.join(WORK_DIR, 'tmp_calculadora.html'),
      pdfFile: path.join(WORK_DIR, 'Calculadora_Biomecanica_Escaner_VIP.pdf'),
      netlifyPdf: path.join(NETLIFY_DIR, 'Calculadora_Biomecanica_Escaner_VIP.pdf'),
      generator: generateCalculadoraHtml,
      landscape: false
    }
  ];

  for (const item of filesToBuild) {
    console.log(`\n--- Generating ${item.name} ---`);
    const htmlContent = item.generator();
    fs.writeFileSync(item.htmlFile, htmlContent, 'utf8');

    const args = [
      '--headless=new',
      '--disable-gpu',
      '--no-sandbox',
      '--no-pdf-header-footer',
      `--print-to-pdf=${item.pdfFile}`,
      `file:///${item.htmlFile.replace(/\\/g, '/')}`
    ];

    try {
      execFileSync(CHROME_PATH, args);
      if (fs.existsSync(item.pdfFile)) {
        const stats = fs.statSync(item.pdfFile);
        console.log(`✅ SUCCESS: ${item.name} created (${stats.size} bytes)`);

        // Copy to Netlify distribution folder as well
        if (fs.existsSync(NETLIFY_DIR)) {
          fs.copyFileSync(item.pdfFile, item.netlifyPdf);
          console.log(`   Copied to: ${item.netlifyPdf}`);
        }
      } else {
        console.error(`❌ FAILED: File ${item.name} was not created.`);
      }
    } catch (err) {
      console.error(`❌ ERROR rendering ${item.name}:`, err.message);
    }
  }

  console.log('\nAll PDF tasks completed!');
}

run();
