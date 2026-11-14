/**
 * TEST SUITE: 4 PROBLEMAS CRÍTICOS DO APLICATIVO
 * Validação automatizada de segurança, lógica de autenticação,
 * proteção da câmera VIP e integridade da interface do exercício.
 */

const fs = require('fs');
const path = require('path');

const results = [];

function test(name, fn) {
  try {
    fn();
    results.push({ name, status: 'PASS' });
    console.log(`[PASS] ${name}`);
  } catch (err) {
    results.push({ name, status: 'FAIL', error: err.message });
    console.error(`[FAIL] ${name}: ${err.message}`);
  }
}

console.log('=== INICIANDO AUDITORIA DOS 4 PROBLEMAS CRÍTICOS ===\n');

// 1. SEGURANÇA: Verificar se valores padrão do banco bloqueiam novos usuários
test('1.1 Supabase Migration define is_vip = false e has_base_access = false por padrão', () => {
  const sql = fs.readFileSync('supabase/migrations/20261114_strict_security_defaults_and_access_lock.sql', 'utf8');
  if (!sql.includes('ALTER COLUMN is_vip SET DEFAULT false')) {
    throw new Error('Migration não altera is_vip para DEFAULT false');
  }
  if (!sql.includes('ALTER COLUMN has_base_access SET DEFAULT false')) {
    throw new Error('Migration não altera has_base_access para DEFAULT false');
  }
  if (!sql.includes('false, -- Apenas pagamento aprovado pode liberar VIP')) {
    throw new Error('handle_new_user não define is_vip como false');
  }
});

// 2. SEGURANÇA: Verificar se auto-signup no login foi removido
test('1.2 app.js não auto-cadastra usuários que falham no login', () => {
  const appJs = fs.readFileSync('app/js/app.js', 'utf8');
  // Procura se existe fallback que chamava signUp dentro do bloco else (login)
  const loginSection = appJs.substring(appJs.indexOf('handleAuthSubmit'), appJs.indexOf('syncProfileCloud'));
  if (loginSection.includes("res.error.includes('Invalid login credentials')") && loginSection.includes('signUp(email, pass')) {
    throw new Error('Fallback perigoso de auto-cadastro ainda presente no login!');
  }
});

// 3. SEGURANÇA: Bloqueio estrito no onboarding.html
test('1.3 onboarding.html não libera acesso sem comprovação de compra no Supabase', () => {
  const onbHtml = fs.readFileSync('app/onboarding.html', 'utf8');
  if (!onbHtml.includes('p.has_base_access !== true')) {
    throw new Error('onboarding.html não valida se has_base_access !== true');
  }
  if (!onbHtml.includes('Acceso Denegado: No encontramos ninguna compra aprobada')) {
    throw new Error('onboarding.html não exibe bloqueio de compra ausente');
  }
});

// 4. SEGURANÇA: defaultState limpo (sem "Carlos" ou refeições pré-cadastradas)
test('1.4 defaultState do state.js inicia limpo e sem resíduos de terceiros', () => {
  const stateJs = fs.readFileSync('app/js/state.js', 'utf8');
  if (stateJs.includes("initialName = 'Recluta Carlos'")) {
    throw new Error("state.js ainda possui initialName = 'Recluta Carlos'");
  }
  if (stateJs.includes("id: 'meal_demo_1'")) {
    throw new Error("state.js ainda possui refeição mock meal_demo_1 no defaultState");
  }
  if (stateJs.includes("initialNickname = 'Vanguardia-01'")) {
    throw new Error("state.js ainda possui initialNickname = 'Vanguardia-01'");
  }
});

// 5. CÂMERA VIP: Bloqueio client-side e server-side
test('2.1 gemini-nutrition.js bloqueia análise sem VIP e não faz bypass local', () => {
  const nutriJs = fs.readFileSync('app/js/gemini-nutrition.js', 'utf8');
  if (!nutriJs.includes('if (!window.ProtocoloStore || !window.ProtocoloStore.isVip())')) {
    throw new Error('Falta checagem de isVip() no início de analyzeFoodPhoto');
  }
  if (nutriJs.includes('aiResult = generateIntelligentEstimation(preferredMealType)')) {
    throw new Error('Bypass de estimativa local para não-VIPs ainda presente!');
  }
});

test('2.2 Edge Function analyze-food rejeita não-VIPs com 403 Forbidden', () => {
  const edgeFunc = fs.readFileSync('supabase/functions/analyze-food/index.ts', 'utf8');
  if (!edgeFunc.includes('isVipActive = Boolean(')) {
    throw new Error('Edge Function não valida is_vip');
  }
  if (!edgeFunc.includes('status: 403')) {
    throw new Error('Edge function não retorna 403');
  }
});

// 6. POP-UP DE ASSINATURA: Resiliência e não-travamento
test('3.1 renderApp possui valor padrão para state e não quebra com undefined', () => {
  const appJs = fs.readFileSync('app/js/app.js', 'utf8');
  if (!appJs.includes('function renderApp(state =')) {
    throw new Error('renderApp não possui parâmetro padrão para state');
  }
});

test('3.2 openVipScannerOfferModal abre modal sem quebrar e close fecha de forma limpa', () => {
  const appJs = fs.readFileSync('app/js/app.js', 'utf8');
  if (!appJs.includes('modal.classList.add(\'show\')')) {
    throw new Error('openVipScannerOfferModal não adiciona classe show ao modal');
  }
  if (!appJs.includes('modal.classList.remove(\'show\')')) {
    throw new Error('closeVipScannerOfferModal não remove classe show do modal');
  }
});

// 7. TELA DE EXERCÍCIOS: Interface e remoção de sobreposição
test('4.1 workout-player.js não sobrepõe badge de repetições em cima do boneco', () => {
  const playerJs = fs.readFileSync('app/js/workout-player.js', 'utf8');
  if (playerJs.includes('player-athlete-overlay')) {
    throw new Error('Badge sobreposto player-athlete-overlay ainda presente dentro do frame');
  }
  if (!playerJs.includes('class="player-meta-badges"')) {
    throw new Error('Badges organizados ausentes no cabeçalho do player');
  }
});

test('4.2 CSS do workout player esconde o bottom-nav e possui z-index superior', () => {
  const css = fs.readFileSync('app/css/app.css', 'utf8');
  if (!css.includes('body.workout-player-active .bottom-nav')) {
    throw new Error('Falta regra body.workout-player-active .bottom-nav');
  }
  if (!css.includes('.workout-player-overlay {') || !css.includes('z-index: 100005 !important')) {
    throw new Error('workout-player-overlay não possui z-index 100005');
  }
});

test('4.3 Quebra de palavras segura (word-break e overflow-wrap) nas instruções do exercício', () => {
  const css = fs.readFileSync('app/css/app.css', 'utf8');
  if (!css.includes('overflow-wrap: break-word !important;') || !css.includes('word-break: break-word !important;')) {
    throw new Error('Instruções não contêm overflow-wrap e word-break');
  }
});

console.log('\n=== RESULTADO FINAL DOS TESTES ===');
const failed = results.filter(r => r.status === 'FAIL');
console.log(`Total: ${results.length} | Aprovados: ${results.length - failed.length} | Falhas: ${failed.length}`);
if (failed.length > 0) {
  process.exit(1);
} else {
  console.log('✓ TODOS OS TESTES PASSARAM COM SUCESSO!');
}

