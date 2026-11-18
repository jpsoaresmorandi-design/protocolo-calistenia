const fs = require('fs');
const path = require('path');

console.log('==================================================================');
console.log('AUDITORIA 360° - PROTOCOLO CALISTENIA');
console.log('==================================================================\n');

const appJs = fs.readFileSync('app/js/app.js', 'utf8');
const viewsJs = fs.readFileSync('app/js/views.js', 'utf8');
const stateJs = fs.readFileSync('app/js/state.js', 'utf8');
const appCss = fs.readFileSync('app/css/app.css', 'utf8');
const indexHtml = fs.readFileSync('index.html', 'utf8');
const vslHtml = fs.readFileSync('vsl.html', 'utf8');
const appHtml = fs.readFileSync('app/index.html', 'utf8');
const onboardingHtml = fs.readFileSync('app/onboarding.html', 'utf8');

// 1. ANALISAR TODOS OS HANDLERS ONCLICK
console.log('--- 1. VERIFICAÇÃO DE MÉTODOS E EVENTOS NA UI ---');
const onclickRegex = /onclick\s*=\s*["']([^"']+)["']/g;
const allHtml = viewsJs + '\n' + appHtml + '\n' + onboardingHtml;
let m;
const handlers = new Set();
while ((m = onclickRegex.exec(allHtml)) !== null) {
  handlers.add(m[1].trim());
}

const missingFns = [];
handlers.forEach(h => {
  const match = h.match(/^App\.([a-zA-Z0-9_]+)\s*\(/);
  if (match) {
    const fn = match[1];
    const isPresent = appJs.includes(fn + ':') || 
                      appJs.includes(fn + ' =') || 
                      appJs.includes('function ' + fn) ||
                      appJs.includes(fn + ',');
    if (!isPresent) {
      missingFns.push(fn);
    }
  }
});
console.log(`Total de handlers onclick encontrados: ${handlers.size}`);
console.log(`Métodos App não encontrados em app.js: ${JSON.stringify(missingFns)}`);

// 2. AUDITORIA DE CSS E RESPONSIVIDADE
console.log('\n--- 2. VERIFICAÇÃO DE CSS E RESPONSIVIDADE ---');
const issues = [];

// A. Verificar barras de rolagem horizontais (overflow-x)
if (!appCss.includes('overflow-x: hidden') && !appCss.includes('overflow-x:hidden')) {
  issues.push('CSS global não possui overflow-x: hidden no body/html para evitar scroll lateral acidental');
}

// B. Verificar meta viewport em todos os HTMLs
const htmlFiles = [
  { name: 'index.html', content: indexHtml },
  { name: 'vsl.html', content: vslHtml },
  { name: 'app/index.html', content: appHtml },
  { name: 'app/onboarding.html', content: onboardingHtml }
];

htmlFiles.forEach(h => {
  if (!h.content.includes('viewport-fit=cover')) {
    issues.push(`${h.name} não possui viewport-fit=cover para notch/safe-areas de iPhone modernos`);
  }
  if (!h.content.includes('width=device-width')) {
    issues.push(`${h.name} não possui tag viewport responsiva adequada`);
  }
});

// C. Verificar tamanhos de touch target (WCAG 2.2 exige mínimo 44px)
const touchTargetCheck = appCss.includes('min-height: 44px') || appCss.includes('min-height:44px');
console.log(`Touch targets com min-height 44px presentes no CSS: ${touchTargetCheck}`);

// D. Verificar breakpoints de mídia no CSS
const mediaQueries = appCss.match(/@media[^{]+/g) || [];
console.log(`Total de Media Queries encontradas no app.css: ${mediaQueries.length}`);
mediaQueries.forEach(mq => {
  console.log('   Breakpoint: ' + mq.trim());
});

// 3. AUDITORIA DE PERSISTÊNCIA E STORAGE
console.log('\n--- 3. VERIFICAÇÃO DE STORAGE E PERSISTÊNCIA ---');
const storageKeys = [];
const storageRegex = /localStorage\.(getItem|setItem)\(["']([^"']+)["']/g;
let sm;
while ((sm = storageRegex.exec(appJs + stateJs + viewsJs)) !== null) {
  storageKeys.push(sm[2]);
}
console.log('Chaves de localStorage gerenciadas:', Array.from(new Set(storageKeys)));

// 4. VERIFICAÇÃO DE CONTRASTE E ACESSIBILIDADE
console.log('\n--- 4. ACESSIBILIDADE E ELEMENTOS DE INTERFACE ---');
if (!appCss.includes(':focus-visible')) {
  issues.push('CSS não define regras explícitas de :focus-visible para navegação por teclado acessível');
}

console.log('\n--- RESUMO DE PROBLEMAS ENCONTRADOS ---');
issues.forEach((iss, idx) => console.log(`${idx + 1}. ${iss}`));

