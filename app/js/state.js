/**
 * State Management & Persistent Store for Protocolo PWA
 * Includes:
 * - Interactive Tactical Onboarding Wizard (Initial Setup)
 * - Deep Profile Personalization (Experience, Time, Joint restrictions, Biometrics)
 * - Progressive Day Unlocking Logic (Day 1 -> Day 2 -> Day 21)
 * - Nutritional Goal Filters & Dynamic Water Hydration Formula
 * - Evolution Before/After Photos Persistence
 * - User Profile & Tactical Dossier (Avatar, Apodo, Rango, Estadísticas)
 * - Comunidad Táctica Premium (Feed de Hermanos de Armas, Posts, Likes, Comentarios, Paywall VIP)
 * - Cloud Database Sync Adapter Interface (Supabase/Firebase ready)
 */
(function() {
  'use strict';

  const STORAGE_KEY = 'protocolo_calistenia_state_v1';

  function getUserScopedStorageKey() {
    try {
      const rawUser = localStorage.getItem('protocolo_supabase_user') || localStorage.getItem('protocolo_current_user');
      if (rawUser) {
        const u = JSON.parse(rawUser);
        const uid = u.id || u.email;
        if (uid) {
          return 'protocolo_state_' + String(uid).toLowerCase().replace(/[^a-z0-9_-]/g, '_');
        }
      }
    } catch (e) {}
    return STORAGE_KEY;
  }

  // ============================================================
  // CONFIGURAÇÃO CENTRAL DE PREÇO, MOEDA E RECURSOS VIP
  // Altere aqui para trocar a moeda ou valor em todo o aplicativo
  // ============================================================
  const PROTOCOLO_CONFIG = {
    pricing: {
      // Produto de Entrada: Protocolo de 21 Días (Pago Único)
      entryProduct: {
        amount: '9.90',
        currencySymbol: '$',
        currencyCode: 'USD',
        formattedPrice: '$9.90',
        formattedFull: '$9.90 USD (Pago Único)'
      },
      // Assinatura VIP Recorrente: Scanner IA + Comunidade VIP ($4.90/mês)
      vipSubscription: {
        amount: '4.90',
        currencySymbol: '$',
        currencyCode: 'USD',
        periodText: 'mes',
        formattedPrice: '$4.90',
        formattedMonthly: '$4.90 USD / mes',
        formattedMonthlyShort: '$4.90/mes',
        approxDaily: '$0.16 USD / día'
      },
      // Compatibilidade retroativa
      amount: '4.90',
      currencySymbol: '$',
      currencyCode: 'USD',
      periodText: 'mes',
      formattedPrice: '$4.90',
      formattedMonthly: '$4.90 USD / mes',
      formattedMonthlyShort: '$4.90/mes',
      approxDaily: '$0.16 USD / día'
    },
    hotmart: {
      // Links configuráveis de checkout da Hotmart
      // O modo checkoutMode=10 permite abrir como pop-up / modal embutido na tela
      entryCheckoutUrl: 'https://pay.hotmart.com/T108488175Q?checkoutMode=10',
      vipCheckoutUrl: 'https://pay.hotmart.com/K108494815B?checkoutMode=10',
      useEmbeddedWidget: true
    },
    scanner: {
      // Flag de teste local: quando true, permite usar o scanner localmente sem exigir Supabase VIP
      // DESLIGADO POR PADRÃO (false) para ambiente de produção
      localTestMode: false
    },
    auth: {
      // Controle central de login obrigatório
      // false: permite modo convidado/demonstração
      // true: exige login para acessar as áreas protegidas
      requireAuth: true
    },
    features: {
      // Funcionalidades Base (Incluídas no Protocolo de 21 Dias)
      misiones: { tier: 'base', name: 'Protocolo de 21 Días', desc: 'Entrenamientos progresivos, tempos y player interactivo' },
      blindaje: { tier: 'base', name: 'Blindaje Articular', desc: 'Protocolos de calentamiento y descompresión' },
      nutri_base: { tier: 'base', name: 'Base de Alimentos Militar', desc: 'Buscador manual de comidas, diario y cálculo de macros' },
      hidratacion: { tier: 'base', name: 'Fórmula de Hidratación Dinámica', desc: 'Meta de agua adaptada al peso' },
      recetas: { tier: 'base', name: 'Recetario Militar', desc: '40+ preparaciones tácticas y creación de recetas privadas' },
      evolucion: { tier: 'base', name: 'Registro de Peso & Fotos', desc: 'Gráficos de evolución y archivo antes/después' },
      medallas: { tier: 'base', name: 'Ficha de Servicio & Medallas', desc: 'Condecoraciones y ascensos de rango' },

      // Funcionalidades Exclusivas VIP ($4.99/mes)
      scanner_ia: { tier: 'vip', name: 'Escáner Nutricional por Foto (IA)', desc: 'Reconocimiento fotográfico automático con estimación de macros' },
      comunidad_vip: { tier: 'vip', name: 'Hermandad Táctica VIP', desc: 'Feed social militar, interacción, likes y comentarios' },
      nube_vip: { tier: 'vip', name: 'Respaldo Prioritario en la Nube', desc: 'Sincronización multi-dispositivo en tiempo real' }
    }
  };
  window.PROTOCOLO_CONFIG = PROTOCOLO_CONFIG;

  // Sincroniza dados do funil se disponíveis
  let initialGender = 'hombre';
  let initialTargetWeight = 70;
  let initialStartWeight = 78;
  let initialGoal = 'perder-peso';
  let initialAge = 28;
  let initialName = 'Recluta';
  let initialNickname = 'Operador-01';

  try {
    const funnelQuiz = JSON.parse(localStorage.getItem('calistenia_state') || '{}');
    if (funnelQuiz.answers) {
      if (funnelQuiz.answers[0] === 'mujer') {
        initialGender = 'mujer';
        initialTargetWeight = 55;
        initialStartWeight = 62;
        initialName = 'Recluta Elena';
        initialNickname = 'Valquiria-01';
      }
      if (funnelQuiz.answers[1]) {
        const ageMap = { '18-29': 25, '30-39': 34, '40-49': 44, '50+': 52 };
        if (ageMap[funnelQuiz.answers[1]]) initialAge = ageMap[funnelQuiz.answers[1]];
      }
      if (funnelQuiz.answers[2] === 'ganar-musculo') initialGoal = 'ganar-musculo';
      if (funnelQuiz.answers[2] === 'forca-y-volumen-muscular') initialGoal = 'ganar-peso';
    }
  } catch (e) {}

  function calculateDailyTargets(profile) {
    const p = profile || (state && state.profile) || {};
    const weight = p.currentWeight || p.startWeight || 75;
    let mult = 28;
    let protMult = 1.8;
    const goal = p.goal || 'perder-peso';

    if (goal === 'perder-peso') {
      mult = 24;
      protMult = 2.0;
    } else if (goal === 'ganar-musculo') {
      mult = 32;
      protMult = 2.2;
    } else if (goal === 'ganar-peso') {
      mult = 35;
      protMult = 2.0;
    }

    const cals = Math.round(weight * mult);
    const prot = Math.round(weight * protMult);
    const fats = Math.round((cals * 0.25) / 9);
    const carbs = Math.max(50, Math.round((cals - (prot * 4) - (fats * 9)) / 4));

    return {
      calories: cals,
      protein: prot,
      carbs: carbs,
      fats: fats
    };
  }

  const defaultCommunityPosts = [
    {
      id: 'post_1',
      author: 'Sargento Mateo',
      nickname: 'Halcón-04',
      rankBadge: 'R-4',
      rankIcon: '🦅',
      avatar: 'eagle-commander',
      date: 'Hace 45 min',
      tag: 'misiones',
      tagLabel: 'MISIÓN DÍA 14',
      isExample: true,
      text: '¡Día 14 superado! Para los reclutas que recién inician en los Días 1 a 3: la mente intentará convencerlos de aflojar antes de que los músculos se fatiguen. La disciplina militar es no negociar con la pereza. ¡Mantengan la línea!',
      image: null,
      likes: 38,
      likedByMe: false,
      comments: [
        { id: 'c1_1', author: 'Soldado Javier', nickname: 'Bravo-99', text: '¡Excelente recordatorio Sargento! Hoy liquidé el Día 6 y me dio un impulso tremendo.', date: 'Hace 20 min' },
        { id: 'c1_2', author: 'Recluta Sofía', nickname: 'Centinela-12', text: 'Anotado. Cero excusas.', date: 'Hace 10 min' }
      ]
    },
    {
      id: 'post_2',
      author: 'Cabo Valentina',
      nickname: 'Valquiria-07',
      rankBadge: 'R-3',
      rankIcon: '🛡️',
      avatar: 'female-commando',
      date: 'Hace 2 horas',
      tag: 'motivacion',
      tagLabel: 'EVOLUCIÓN & NUTRICIÓN',
      isExample: true,
      text: '3.4 kg menos en 12 días sin pasar hambre. Hago el entrenamiento a primera hora de la mañana y me preparo el Revuelto Energético de Avena de la pestaña Nutrición. La energía se mantiene alta todo el día.',
      image: null,
      likes: 54,
      likedByMe: true,
      comments: [
        { id: 'c2_1', author: 'Recluta Carlos', nickname: 'Vanguardia-01', text: '¡Gran avance Cabo! Esa receta es excelente.', date: 'Hace 1 hora' }
      ]
    },
    {
      id: 'post_3',
      author: 'Soldado Javier',
      nickname: 'Bravo-99',
      rankBadge: 'R-2',
      rankIcon: '⚔️',
      avatar: 'beret-commando',
      date: 'Hace 4 horas',
      tag: 'misiones',
      tagLabel: 'BLINDAJE ARTICULAR',
      isExample: true,
      text: 'Antes me dolían las muñecas al hacer flexiones de pecho. Empecé a hacer religiosamente los 5 minutos del Blindaje Pre-Misión antes de empezar la sesión y el dolor desapareció. ¡No se salten la movilidad!',
      image: null,
      likes: 29,
      likedByMe: false,
      comments: []
    },
    {
      id: 'post_4',
      author: 'Recluta Sofía',
      nickname: 'Centinela-12',
      rankBadge: 'R-1',
      rankIcon: '🎖️',
      avatar: 'stealth-mask',
      date: 'Hace 6 horas',
      tag: 'misiones',
      tagLabel: 'DÍA 1 COMPLETADO',
      isExample: true,
      text: '¡Misión del Día 1 completada con éxito! Pensé que no iba a lograr las 4 rondas, pero activé la Modificación Suave en las flexiones y pude terminar todo con orgullo. ¡Mañana vamos por el Día 2!',
      image: null,
      likes: 61,
      likedByMe: false,
      comments: [
        { id: 'c4_1', author: 'Sargento Mateo', nickname: 'Halcón-04', text: '¡Así se habla recluta! El primer paso es el más valioso.', date: 'Hace 5 horas' }
      ]
    },
    {
      id: 'post_5',
      author: 'Teniente Marcos',
      nickname: 'Titan-02',
      rankBadge: 'R-4',
      rankIcon: '⚡',
      avatar: 'recon-goggles',
      date: 'Hace 3 horas',
      tag: 'nutricion',
      tagLabel: 'NUTRICIÓN / COMIDA',
      isExample: true,
      text: 'Almuerzo de recuperación post Día 9: 250g de pechuga a la plancha con puré de boniato y espinacas al vapor. 52g de proteína limpia. Registrado al instante con el analizador de alimentos. ¡La nutrición es munición táctica para el músculo!',
      image: null,
      likes: 42,
      likedByMe: false,
      comments: [
        { id: 'c5_1', author: 'Recluta Sofía', nickname: 'Centinela-12', text: '¡Excelente combinación! La acabo de replicar.', date: 'Hace 1 hora' }
      ]
    }
  ];

  const defaultState = {
    onboarding: {
      completed: false, // Inicia em false para passar pelo fluxo de configuração inicial
      step: 1
    },
    profile: {
      name: initialName,
      nickname: initialNickname,
      avatar: 'tactical-helmet', // tactical-helmet, recon-goggles, beret-commando, female-commando, eagle-commander, stealth-mask, o base64
      gender: initialGender,
      age: initialAge,
      height: 175,
      goal: initialGoal, // perder-peso, ganar-musculo, ganar-peso, mantener-peso
      experienceLevel: 'principiante', // principiante, intermedio, avanzado
      timeAvailability: 'estandar', // express (15-20m), estandar (25-35m), intensivo (40m+)
      jointRestrictions: [], // 'munecas', 'rodillas', 'hombros', 'lumbar'
      jointProtection: false,
      jointRegions: { rodillas: true, munecas: true, hombros: true },
      startWeight: initialStartWeight,
      targetWeight: initialTargetWeight,
      currentWeight: initialStartWeight,
      joinedDate: '12/11/2026',
      bio: 'Enfocado en completar los 21 días de Calistenia Militar.'
    },
    progress: {
      currentDay: 1,
      completedDays: [],
      points: 0,
      streak: 0,
      lastActiveDate: new Date().toISOString().split('T')[0],
      currentPhase: 1,
      achievements: [],
      weeklyGoal: { targetDays: 5, currentDays: 0, weekNumber: 1 },
      weeklyCheckins: []
    },
    community: {
      isVipMember: false, // VIP: controla acesso ao Scanner Nutricional por Foto (IA); Comunidade é 100% gratuita e incluída para todos
      filter: 'todos', // 'todos' | 'misiones' | 'motivacion' | 'mis_reportes'
      posts: defaultCommunityPosts
    },
    nutrition: {
      subTab: 'diario', // 'diario' | 'recetas' | 'hidratacion'
      selectedDate: new Date().toISOString().split('T')[0],
      selectedGoal: 'todos',
      recipeSearchQuery: '',
      customRecipes: [],
      waterGlasses: 0,
      lastWaterDate: new Date().toISOString().split('T')[0],
      shoppingChecked: [],
      meals: []
    },
    evolutionPhotos: {
      day1: null, // base64 string
      dayCurrent: null // base64 string
    },
    weightLog: [
      { date: new Date().toISOString().split('T')[0], kg: initialStartWeight, weight: initialStartWeight }
    ],
    entitlements: {
      hasAbdomenWorkout: false, // Order Bump #1: Finisher Abdomen de Acero (7 Min)
      hasBatidosAnabolicos: false // Order Bump #2: 12 Batidos Anabólicos Militares (3 Min)
    },
    settings: {
      soundEnabled: true,
      audioBeeps: true
    },
    activeTab: 'misiones',
    activeRecipeModalId: null,
    activeBlindajeRoutineId: null,
    editingProfile: false
  };

  function loadState() {
    try {
      const scopedKey = getUserScopedStorageKey();
      let saved = localStorage.getItem(scopedKey);
      if (!saved && scopedKey !== STORAGE_KEY) {
        saved = localStorage.getItem(STORAGE_KEY);
      }
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...defaultState,
          ...parsed,
          onboarding: {
            ...defaultState.onboarding,
            ...(parsed.onboarding || {})
          },
          profile: {
            ...defaultState.profile,
            ...(parsed.profile || {})
          },
          progress: {
            ...defaultState.progress,
            ...(parsed.progress || {})
          },
          community: {
            ...defaultState.community,
            ...(parsed.community || {}),
            posts: ((parsed.community && parsed.community.posts && parsed.community.posts.length > 0)
              ? parsed.community.posts
              : defaultCommunityPosts).map(p => {
                if (p.id && (p.id.startsWith('post_') || p.id === 'sample_1' || p.isExample)) {
                  return { ...p, image: null, isExample: true };
                }
                return p;
              })
          },
          nutrition: {
            ...defaultState.nutrition,
            ...(parsed.nutrition || {}),
            subTab: (parsed.nutrition && parsed.nutrition.subTab) || defaultState.nutrition.subTab,
            selectedDate: (parsed.nutrition && parsed.nutrition.selectedDate) || defaultState.nutrition.selectedDate,
            selectedGoal: (parsed.nutrition && parsed.nutrition.selectedGoal) || 'todos',
            recipeSearchQuery: '',
            customRecipes: (parsed.nutrition && Array.isArray(parsed.nutrition.customRecipes)) ? parsed.nutrition.customRecipes : [],
            meals: (parsed.nutrition && Array.isArray(parsed.nutrition.meals)) ? parsed.nutrition.meals : defaultState.nutrition.meals
          },
          evolutionPhotos: {
            ...defaultState.evolutionPhotos,
            ...(parsed.evolutionPhotos || {})
          },
          weightLog: (() => {
            if (parsed.weightLog && Array.isArray(parsed.weightLog) && parsed.weightLog.length > 0) {
              const migrated = parsed.weightLog.map(item => {
                const kgVal = Number(item.kg !== undefined ? item.kg : (item.weight !== undefined ? item.weight : 70));
                return {
                  date: item.date || new Date().toISOString().split('T')[0],
                  kg: isNaN(kgVal) ? 70 : Math.round(kgVal * 10) / 10,
                  weight: isNaN(kgVal) ? 70 : Math.round(kgVal * 10) / 10
                };
              }).filter(item => item.date && !isNaN(item.kg));
              migrated.sort((a, b) => a.date.localeCompare(b.date));
              return migrated.length > 0 ? migrated : defaultState.weightLog;
            }
            return [{ date: new Date().toISOString().split('T')[0], kg: Number(parsed.profile?.startWeight || initialStartWeight), weight: Number(parsed.profile?.startWeight || initialStartWeight) }];
          })(),
          profile: {
            ...defaultState.profile,
            ...(parsed.profile || {}),
            jointRegions: (parsed.profile && parsed.profile.jointRegions) ? parsed.profile.jointRegions : { rodillas: true, munecas: true, hombros: true }
          },
          progress: {
            ...defaultState.progress,
            ...(parsed.progress || {}),
            currentPhase: (parsed.progress && parsed.progress.currentPhase) ? parsed.progress.currentPhase : (parsed.progress?.currentDay > 42 ? 3 : (parsed.progress?.currentDay > 21 ? 2 : 1)),
            achievements: (parsed.progress && Array.isArray(parsed.progress.achievements)) ? parsed.progress.achievements : ['first_day_ready'],
            weeklyGoal: (parsed.progress && parsed.progress.weeklyGoal) ? parsed.progress.weeklyGoal : { targetDays: 5, currentDays: 0, weekNumber: 1 },
            weeklyCheckins: (parsed.progress && Array.isArray(parsed.progress.weeklyCheckins)) ? parsed.progress.weeklyCheckins : []
          },
          entitlements: {
            ...defaultState.entitlements,
            ...(parsed.entitlements || {})
          }
        };
      }
    } catch (e) {
      console.warn('Erro ao carregar state:', e);
    }
    return JSON.parse(JSON.stringify(defaultState));
  }

  let state = loadState();
  const listeners = [];

  function saveState() {
    try {
      const scopedKey = getUserScopedStorageKey();
      localStorage.setItem(scopedKey, JSON.stringify(state));
    } catch (e) {
      console.warn('Erro ao salvar state:', e);
    }
    // Dispara sincronização em nuvem se configurada
    CloudSync.dispatch(state);
    notify();
  }

  function subscribe(fn) {
    listeners.push(fn);
    return () => {
      const idx = listeners.indexOf(fn);
      if (idx !== -1) listeners.splice(idx, 1);
    };
  }

  function notify() {
    listeners.forEach(fn => {
      try { fn(state); } catch(err) { console.error('Listener error:', err); }
    });
  }

  // --- LÓGICA DE DESBLOQUEIO PROGRESSIVO ---
  function isDayUnlocked(dayNum) {
    if (dayNum <= 1) return true;
    return state.progress.completedDays.includes(dayNum - 1);
  }

  function canStartDay(dayNum) {
    return isDayUnlocked(dayNum);
  }

  // --- Patentes Militares ---
  const RANKS = [
    { id: 1, name: 'Recluta', minPoints: 0, icon: '🎖️', badge: 'R-1', desc: 'Alistado en servicio activo' },
    { id: 2, name: 'Soldado Táctico', minPoints: 300, icon: '⚔️', badge: 'R-2', desc: 'Dominio de movimientos fundamentales' },
    { id: 3, name: 'Cabo de Fuerzas', minPoints: 700, icon: '🛡️', badge: 'R-3', desc: 'Resistencia y disciplina demostrada' },
    { id: 4, name: 'Sargento Calisténico', minPoints: 1200, icon: '🦅', badge: 'R-4', desc: 'Fuerza relativa y liderazgo táctico' },
    { id: 5, name: 'Comandante de Élite', minPoints: 1800, icon: '⚡', badge: 'R-5', desc: 'Maestría corporal y protocolo finalizado' }
  ];

  function getRank(points) {
    let current = RANKS[0];
    for (let i = 0; i < RANKS.length; i++) {
      if (points >= RANKS[i].minPoints) {
        current = RANKS[i];
      }
    }
    const next = RANKS.find(r => r.minPoints > points) || null;
    return {
      current,
      next,
      pointsToNext: next ? (next.minPoints - points) : 0,
      progressPct: next ? Math.round(((points - current.minPoints) / (next.minPoints - current.minPoints)) * 100) : 100
    };
  }

  // --- Sintetizador de Áudio Tático (Web Audio API) ---
  let audioCtx = null;
  function getAudioCtx() {
    if (!audioCtx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) audioCtx = new AudioContext();
    }
    if (audioCtx && audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    return audioCtx;
  }

  function playTone(freq, type, duration, gainVal) {
    if (!state.settings.soundEnabled) return;
    try {
      const ctx = getAudioCtx();
      if (!ctx) return;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = type || 'sine';
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(gainVal || 0.15, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + duration);
    } catch (e) {}
  }

  const audioBeep = {
    tick: () => playTone(600, 'sine', 0.08, 0.1),
    warning: () => playTone(880, 'sine', 0.12, 0.18),
    go: () => {
      playTone(1050, 'triangle', 0.25, 0.25);
      setTimeout(() => playTone(1400, 'sine', 0.35, 0.2), 80);
    },
    rest: () => playTone(440, 'sine', 0.2, 0.15),
    complete: () => {
      playTone(523.25, 'triangle', 0.15, 0.2);
      setTimeout(() => playTone(659.25, 'triangle', 0.18, 0.2), 140);
      setTimeout(() => playTone(783.99, 'triangle', 0.22, 0.22), 280);
      setTimeout(() => playTone(1046.50, 'sine', 0.5, 0.25), 440);
    }
  };

  // --- CLOUD SYNC ADAPTER (Preparado para Banco de Dados Online) ---
  const CloudSync = {
    endpoint: null,
    authToken: null,
    configure(endpoint, token) {
      this.endpoint = endpoint;
      this.authToken = token;
      console.log('CloudSync configurado para:', endpoint);
    },
    async dispatch(currentState) {
      if (!this.endpoint || !this.authToken) return;
      try {
        await fetch(this.endpoint, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': 'Bearer ' + this.authToken
          },
          body: JSON.stringify(currentState)
        });
        console.log('Progresso sincronizado com o servidor remoto.');
      } catch (err) {
        console.warn('Sync offline: mantendo dados em localStorage.', err.message);
      }
    }
  };

  // --- Operações de Ação do Usuário ---
  const actions = {
    // --- ONBOARDING & CONFIGURAÇÃO INICIAL ---
    setOnboardingStep(step) {
      state.onboarding.step = step;
      audioBeep.tick();
      saveState();
    },

    completeOnboarding(data) {
      Object.assign(state.profile, data);
      state.profile.currentWeight = data.currentWeight || data.startWeight;
      
      // Auto-ativa proteção articular se tiver alguma restrição selecionada
      if (data.jointRestrictions && data.jointRestrictions.length > 0) {
        state.profile.jointProtection = true;
      }

      // Sincroniza a nutrição com o objetivo do onboarding
      if (data.goal) {
        state.nutrition.selectedGoal = data.goal;
      }

      // Registra a primeira pesagem oficial
      const today = new Date().toISOString().split('T')[0];
      const existing = state.weightLog.find(item => item.date === today);
      if (existing) {
        existing.weight = state.profile.currentWeight;
      } else {
        state.weightLog.push({ date: today, weight: state.profile.currentWeight });
      }

      state.onboarding.completed = true;
      state.activeTab = 'misiones';
      state.progress.points += 50; // Bônus de alistamento inicial
      
      saveState();
      audioBeep.complete();
    },

    restartOnboarding() {
      state.onboarding.completed = false;
      state.onboarding.step = 1;
      saveState();
    },

    setTab(tab) {
      state.activeTab = tab;
      saveState();
    },

    setGender(gender) {
      state.profile.gender = gender;
      saveState();
    },

    toggleJointProtection() {
      state.profile.jointProtection = !state.profile.jointProtection;
      saveState();
    },

    completeMission(dayNum, earnedPoints = 150) {
      if (!state.progress.completedDays.includes(dayNum)) {
        state.progress.completedDays.push(dayNum);
      }
      state.progress.points += earnedPoints;

      // Desbloqueia o próximo dia automaticamente
      if (dayNum >= state.progress.currentDay && state.progress.currentDay < 21) {
        state.progress.currentDay = dayNum + 1;
      }

      const today = new Date().toISOString().split('T')[0];
      if (state.progress.lastActiveDate !== today) {
        state.progress.streak += 1;
        state.progress.lastActiveDate = today;
      }

      // Se for membro VIP da comunidade, registra automaticamente um post de conquista
      if (state.community.isVipMember) {
        actions.addCommunityPost({
          text: '¡Misión del Día ' + dayNum + ' completada con éxito! Seguimos sumando en la hermandad.',
          tag: 'misiones',
          tagLabel: 'MISIÓN DÍA ' + dayNum,
          silent: true
        });
      }

      saveState();
      audioBeep.complete();
    },

    // --- Nutrição & Diário Nutricional Táctico ---
    setNutritionSubTab(subTab) {
      state.nutrition.subTab = subTab;
      saveState();
    },

    setDiaryDate(dateStr) {
      state.nutrition.selectedDate = dateStr;
      saveState();
    },

    addDiaryMeal(meal) {
      if (!state.nutrition.meals) state.nutrition.meals = [];
      state.nutrition.meals.unshift(meal);
      state.progress.points += 40; // Pontos por disciplina alimentar
      audioBeep.complete();
      saveState();
    },

    updateDiaryMeal(id, updatedMeal) {
      if (!state.nutrition.meals) return;
      const idx = state.nutrition.meals.findIndex(m => m.id === id);
      if (idx !== -1) {
        state.nutrition.meals[idx] = { ...state.nutrition.meals[idx], ...updatedMeal };
        audioBeep.tick();
        saveState();
      }
    },

    deleteDiaryMeal(id) {
      if (!state.nutrition.meals) return;
      state.nutrition.meals = state.nutrition.meals.filter(m => m.id !== id);
      saveState();
    },

    setRecipeGoal(goalId) {
      state.nutrition.selectedGoal = goalId;
      saveState();
    },

    setRecipeSearchQuery(query) {
      state.nutrition.recipeSearchQuery = query || '';
      saveState();
    },

    addCustomRecipe(data) {
      if (!state.nutrition.customRecipes) state.nutrition.customRecipes = [];
      const newRec = {
        id: 'cust_rec_' + Date.now(),
        title: data.title || 'Mi Receta Personalizada',
        category: data.category || 'almuerzo',
        categoryLabel: data.categoryLabel || 'Personalizada',
        time: data.time || '15 min',
        servings: data.servings || '1 porción',
        calories: parseInt(data.calories, 10) || 300,
        protein: parseFloat(data.protein) || 25,
        carbs: parseFloat(data.carbs) || 30,
        fats: parseFloat(data.fats) || 10,
        desc: data.desc || 'Receta propia del usuario.',
        ingredients: Array.isArray(data.ingredients) ? data.ingredients : (data.ingredients ? data.ingredients.split('\n').filter(Boolean) : []),
        steps: Array.isArray(data.steps) ? data.steps : (data.steps ? data.steps.split('\n').filter(Boolean) : []),
        img: data.img || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80',
        isPrivate: true,
        isCustom: true,
        createdAt: new Date().toISOString()
      };
      state.nutrition.customRecipes.unshift(newRec);
      state.progress.points += 35;
      audioBeep.complete();
      saveState();
      return newRec;
    },

    updateCustomRecipe(id, data) {
      if (!state.nutrition.customRecipes) return;
      const idx = state.nutrition.customRecipes.findIndex(r => r.id === id);
      if (idx !== -1) {
        state.nutrition.customRecipes[idx] = {
          ...state.nutrition.customRecipes[idx],
          ...data,
          ingredients: Array.isArray(data.ingredients) ? data.ingredients : (data.ingredients ? data.ingredients.split('\n').filter(Boolean) : state.nutrition.customRecipes[idx].ingredients),
          steps: Array.isArray(data.steps) ? data.steps : (data.steps ? data.steps.split('\n').filter(Boolean) : state.nutrition.customRecipes[idx].steps)
        };
        audioBeep.tick();
        saveState();
      }
    },

    deleteCustomRecipe(id) {
      if (!state.nutrition.customRecipes) return;
      state.nutrition.customRecipes = state.nutrition.customRecipes.filter(r => r.id !== id);
      saveState();
    },

    openRecipeModal(recipeId) {
      state.activeRecipeModalId = recipeId;
      notify();
    },

    closeRecipeModal() {
      state.activeRecipeModalId = null;
      notify();
    },

    addWaterGlass() {
      const today = new Date().toISOString().split('T')[0];
      if (state.nutrition.lastWaterDate !== today) {
        state.nutrition.waterGlasses = 0;
        state.nutrition.lastWaterDate = today;
      }
      // Meta calculada com base no peso real do usuário (peso * 35ml / 250ml por copo)
      const targetGlasses = Math.max(6, Math.round((state.profile.currentWeight * 35) / 250));
      if (state.nutrition.waterGlasses < targetGlasses + 4) {
        state.nutrition.waterGlasses += 1;
        state.progress.points += 10;
        audioBeep.tick();
        saveState();
      }
    },

    resetWater() {
      state.nutrition.waterGlasses = 0;
      saveState();
    },

    toggleShoppingItem(itemId) {
      const arr = state.nutrition.shoppingChecked || [];
      const idx = arr.indexOf(itemId);
      if (idx > -1) arr.splice(idx, 1);
      else arr.push(itemId);
      state.nutrition.shoppingChecked = arr;
      saveState();
    },

    // --- Evolução e Peso ---
    logWeight(val) {
      const w = parseFloat(val);
      if (isNaN(w) || w <= 20 || w >= 300) return;
      const rounded = Math.round(w * 10) / 10;
      const today = new Date().toISOString().split('T')[0];
      if (!Array.isArray(state.weightLog)) state.weightLog = [];
      const timeStr = new Date().toLocaleTimeString().slice(0, 5);
      
      const lastEntry = state.weightLog[state.weightLog.length - 1];
      if (lastEntry && lastEntry.date === today && lastEntry.kg === rounded) {
        // Já possui essa exata medição
      } else {
        state.weightLog.push({ date: today, time: timeStr, kg: rounded, weight: rounded });
      }
      state.profile.currentWeight = rounded;
      state.progress.points += 25;
      
      // Conquista de primeiro registro de peso
      if (!state.progress.achievements) state.progress.achievements = [];
      if (!state.progress.achievements.includes('weight_logged')) {
        state.progress.achievements.push('weight_logged');
        state.progress.points += 50;
      }
      
      saveState();
      audioBeep.complete();
      if (window.App && window.App.showToast) {
        window.App.showToast('Peso de hoy (' + rounded + ' kg) registrado con éxito. (+25 XP)', 'success');
      }
    },

    toggleJointProtection() {
      state.profile.jointProtection = !state.profile.jointProtection;
      saveState();
      audioBeep.tick();
      const isAct = state.profile.jointProtection;
      if (window.App && window.App.showToast) {
        window.App.showToast(
          isAct 
            ? '🛡️ Modo Articulación Segura ACTIVADO: variaciones suaves, descansos +15s y calentamiento articular incluido.'
            : '⚡ Modo Estándar Militar ACTIVADO: máxima intensidad operativa.',
          isAct ? 'success' : 'info'
        );
      }
      return isAct;
    },

    toggleJointRegion(regionKey) {
      if (!state.profile.jointRegions) {
        state.profile.jointRegions = { rodillas: true, munecas: true, hombros: true };
      }
      state.profile.jointRegions[regionKey] = !state.profile.jointRegions[regionKey];
      saveState();
      audioBeep.tick();
    },

    saveEvolutionPhoto(type, base64) {
      if (type === 'day1') state.evolutionPhotos.day1 = base64;
      if (type === 'dayCurrent') state.evolutionPhotos.dayCurrent = base64;
      state.progress.points += 50;
      saveState();
    },

    // --- Perfil do Usuário ---
    updateProfile(data) {
      Object.assign(state.profile, data);
      if (data.goal) {
        state.nutrition.selectedGoal = data.goal;
      }
      saveState();
    },

    setAvatar(avatarIdOrData) {
      state.profile.avatar = avatarIdOrData;
      saveState();
    },

    // --- Comunidade Táctica VIP ---
    toggleCommunityVip(forcedVal) {
      if (typeof forcedVal === 'boolean') {
        state.community.isVipMember = forcedVal;
      } else {
        state.community.isVipMember = !state.community.isVipMember;
      }
      saveState();
    },

    // --- Order Bumps (Finisher Abdomen & 12 Batidos) ---
    setEntitlement(key, val) {
      if (!state.entitlements) state.entitlements = {};
      state.entitlements[key] = Boolean(val);
      saveState();
    },

    toggleEntitlement(key) {
      if (!state.entitlements) state.entitlements = {};
      state.entitlements[key] = !state.entitlements[key];
      saveState();
    },

    setCommunityFilter(filterId) {
      state.community.filter = filterId;
      saveState();
    },

    setCommunityPosts(posts) {
      if (Array.isArray(posts) && posts.length > 0) {
        state.community.posts = posts;
        saveState(state);
        notify();
      }
    },

    addCommunityPost(data) {
      const rankInfo = getRank(state.progress.points);
      const newPost = {
        id: 'post_' + Date.now(),
        author: state.profile.name || 'Recluta',
        nickname: state.profile.nickname || 'Operador-01',
        rankBadge: rankInfo.current.badge,
        rankIcon: rankInfo.current.icon,
        avatar: state.profile.avatar || 'tactical-helmet',
        date: 'Ahora mismo',
        tag: data.tag || 'misiones',
        tagLabel: data.tagLabel || (data.tag === 'motivacion' ? '🔥 MOTIVACIÓN' : (data.tag === 'nutricion' ? '🥗 NUTRICIÓN' : (data.tag === 'blindaje' ? '🛡️ BLINDAJE' : '🎯 MISIÓN'))),
        text: data.text || '',
        image: data.image || null,
        likes: 1,
        likedByMe: true,
        comments: [],
        isMyPost: true
      };

      state.community.posts.unshift(newPost);
      if (!data.silent) {
        state.progress.points += 30;
        audioBeep.complete();
      }
      saveState();
    },

    likeCommunityPost(postId) {
      const post = state.community.posts.find(p => p.id === postId);
      if (!post) return;
      if (post.likedByMe) {
        post.likedByMe = false;
        post.likes = Math.max(0, post.likes - 1);
      } else {
        post.likedByMe = true;
        post.likes += 1;
        audioBeep.tick();
      }
      saveState();
    },

    addCommunityComment(postId, commentText) {
      if (!commentText || !commentText.trim()) return;
      const post = state.community.posts.find(p => p.id === postId);
      if (!post) return;
      if (!post.comments) post.comments = [];
      post.comments.push({
        id: 'c_' + Date.now(),
        author: state.profile.name || 'Recluta',
        nickname: state.profile.nickname || 'Operador',
        text: commentText.trim(),
        date: 'Ahora mismo'
      });
      state.progress.points += 10;
      audioBeep.tick();
      saveState();
    },

    deleteCommunityPost(postId) {
      if (!state.community.posts) return;
      state.community.posts = state.community.posts.filter(p => p.id !== postId);
      saveState();
    },

    resetAllProgress() {
      state = JSON.parse(JSON.stringify(defaultState));
      saveState();
    }
  };

  window.ProtocoloStore = {
    config: PROTOCOLO_CONFIG,
    isVip: () => {
      return Boolean(state && ((state.entitlements && state.entitlements.isVip) || (state.community && state.community.isVipMember)));
    },
    hasFeatureAccess: (featureKey) => {
      const feat = PROTOCOLO_CONFIG.features[featureKey];
      if (!feat || feat.tier !== 'vip') return true;
      return Boolean(state && ((state.entitlements && state.entitlements.isVip) || (state.community && state.community.isVipMember)));
    },
    setVipStatus: (val) => {
      if (state && state.community) {
        state.community.isVipMember = Boolean(val);
        saveState();
      }
    },
    setOrderBumpStatus: (abdomen, batidos) => {
      if (typeof abdomen === 'boolean') state.hasAbdomenWorkout = abdomen;
      if (typeof batidos === 'boolean') state.hasBatidosAnabolicos = batidos;
      saveState();
    },
    reloadUserState: () => {
      state = loadState();
      notify();
    },
    resetToGuest: () => {
      state = JSON.parse(JSON.stringify(defaultState));
      notify();
    },
    hydrateFromCloud: (p) => {
      if (!p) return;
      if (p.full_name) state.profile.name = p.full_name;
      if (p.nickname) state.profile.nickname = p.nickname;
      if (p.avatar_id) state.profile.avatar = p.avatar_id;
      if (p.gender) state.profile.gender = p.gender;
      if (p.age) state.profile.age = Number(p.age);
      if (p.height_cm) state.profile.height = Number(p.height_cm);
      if (p.start_weight) state.profile.startWeight = Number(p.start_weight);
      if (p.target_weight) state.profile.targetWeight = Number(p.target_weight);
      if (p.current_weight) state.profile.currentWeight = Number(p.current_weight);
      if (p.fitness_goal) state.profile.goal = p.fitness_goal;
      if (p.experience_level) state.profile.experienceLevel = p.experience_level;
      if (p.time_availability) state.profile.timeAvailability = p.time_availability;
      if (p.joint_protection_active !== undefined) state.profile.jointProtection = Boolean(p.joint_protection_active);
      if (p.joint_regions) state.profile.jointRegions = p.joint_regions;

      if (p.current_day) state.progress.currentDay = Number(p.current_day);
      if (Array.isArray(p.completed_days)) state.progress.completedDays = p.completed_days;
      if (p.points_xp !== undefined) state.progress.points = Number(p.points_xp);
      if (p.streak_days !== undefined) state.progress.streak = Number(p.streak_days);

      if (Array.isArray(p.weight_history) && p.weight_history.length > 0) {
        state.weightLog = p.weight_history;
      }

      if (p.is_vip !== undefined) {
        state.community.isVipMember = Boolean(p.is_vip);
        state.entitlements.isVip = Boolean(p.is_vip);
      }
      if (p.has_orderbump_abdomen !== undefined) state.hasAbdomenWorkout = Boolean(p.has_orderbump_abdomen);
      if (p.has_orderbump_batidos !== undefined) state.hasBatidosAnabolicos = Boolean(p.has_orderbump_batidos);

      saveState();
    },
    getState: () => state,
    actions,
    subscribe,
    getRank,
    audioBeep,
    isDayUnlocked,
    canStartDay,
    RANKS,
    CloudSync,
    calculateDailyTargets
  };

})();
