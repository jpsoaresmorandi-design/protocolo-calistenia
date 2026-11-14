/**
 * Main Application Controller, Router & PWA Service Worker Registration
 * Protocolo de Calistenia Militar - Centro de Comando Táctico
 */
(function() {
  'use strict';

  let deferredInstallPrompt = null;

  // Registrar Service Worker para PWA com auto-recarregamento na nova versão
  if ('serviceWorker' in navigator) {
    let refreshing = false;
    if (typeof navigator.serviceWorker.addEventListener === 'function') {
      navigator.serviceWorker.addEventListener('controllerchange', () => {
        if (!refreshing) {
          refreshing = true;
          window.location.reload();
        }
      });
    }

    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js')
        .then((reg) => {
          console.log('Protocolo PWA Service Worker registrado:', reg.scope);
          if (reg && typeof reg.update === 'function') reg.update();
        })
        .catch((err) => {
          console.warn('Fallo al registrar SW:', err);
        });
    });
  }

  // Capturar evento de instalação PWA
  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredInstallPrompt = e;
    renderPwaBanner();
  });

  // --- DRAFT GLOBAL PARA EL ASISTENTE DE ONBOARDING ---
  function initOnboardingDraft() {
    const s = ProtocoloStore.getState();
    window.OnboardingDraft = {
      name: s.profile.name || 'Recluta Carlos',
      nickname: s.profile.nickname || 'Vanguardia-01',
      gender: s.profile.gender || 'hombre',
      avatar: s.profile.avatar || 'tactical-helmet',
      age: s.profile.age || 28,
      height: s.profile.height || 175,
      currentWeight: s.profile.currentWeight || s.profile.startWeight || 78,
      targetWeight: s.profile.targetWeight || 70,
      goal: s.profile.goal || 'perder-peso',
      experienceLevel: s.profile.experienceLevel || 'principiante',
      timeAvailability: s.profile.timeAvailability || 'estandar',
      jointRestrictions: s.profile.jointRestrictions ? [...s.profile.jointRestrictions] : []
    };
  }

  window.AppOnboarding = {
    setGender(g) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      window.OnboardingDraft.gender = g;
      if (g === 'mujer' && window.OnboardingDraft.name.includes('Carlos')) {
        window.OnboardingDraft.name = 'Recluta Elena';
        window.OnboardingDraft.nickname = 'Valquiria-01';
      } else if (g === 'hombre' && window.OnboardingDraft.name.includes('Elena')) {
        window.OnboardingDraft.name = 'Recluta Carlos';
        window.OnboardingDraft.nickname = 'Vanguardia-01';
      }
      renderApp(ProtocoloStore.getState());
    },

    setAvatar(avId) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      window.OnboardingDraft.avatar = avId;
      renderApp(ProtocoloStore.getState());
    },

    setExperience(exp) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      window.OnboardingDraft.experienceLevel = exp;
      renderApp(ProtocoloStore.getState());
    },

    setTime(time) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      window.OnboardingDraft.timeAvailability = time;
      renderApp(ProtocoloStore.getState());
    },

    setGoal(g) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      window.OnboardingDraft.goal = g;
      renderApp(ProtocoloStore.getState());
    },

    toggleJoint(jointKey) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      let list = window.OnboardingDraft.jointRestrictions || [];
      if (jointKey === 'ninguna') {
        window.OnboardingDraft.jointRestrictions = [];
      } else {
        const idx = list.indexOf(jointKey);
        if (idx > -1) {
          list.splice(idx, 1);
        } else {
          list.push(jointKey);
        }
        window.OnboardingDraft.jointRestrictions = list;
      }
      renderApp(ProtocoloStore.getState());
    },

    nextStep(step) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      // Coleta dados dos inputs do passo antes de avançar
      if (step === 2) {
        const nameInp = document.getElementById('onbName');
        const nickInp = document.getElementById('onbNickname');
        if (nameInp && nameInp.value) window.OnboardingDraft.name = nameInp.value.trim();
        if (nickInp && nickInp.value) window.OnboardingDraft.nickname = nickInp.value.trim();
      } else if (step === 3) {
        const ageInp = document.getElementById('onbAge');
        const heightInp = document.getElementById('onbHeight');
        const currentWInp = document.getElementById('onbCurrentWeight');
        const targetWInp = document.getElementById('onbTargetWeight');
        if (ageInp && ageInp.value) window.OnboardingDraft.age = parseInt(ageInp.value) || 28;
        if (heightInp && heightInp.value) window.OnboardingDraft.height = parseInt(heightInp.value) || 175;
        if (currentWInp && currentWInp.value) window.OnboardingDraft.currentWeight = parseFloat(currentWInp.value) || 75;
        if (targetWInp && targetWInp.value) window.OnboardingDraft.targetWeight = parseFloat(targetWInp.value) || 70;
      }
      ProtocoloStore.actions.setOnboardingStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    prevStep(step) {
      ProtocoloStore.actions.setOnboardingStep(step);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },

    finish() {
      if (!window.OnboardingDraft) initOnboardingDraft();
      ProtocoloStore.actions.completeOnboarding({
        name: window.OnboardingDraft.name,
        nickname: window.OnboardingDraft.nickname,
        gender: window.OnboardingDraft.gender,
        avatar: window.OnboardingDraft.avatar,
        age: window.OnboardingDraft.age,
        height: window.OnboardingDraft.height,
        startWeight: window.OnboardingDraft.currentWeight,
        currentWeight: window.OnboardingDraft.currentWeight,
        targetWeight: window.OnboardingDraft.targetWeight,
        goal: window.OnboardingDraft.goal,
        experienceLevel: window.OnboardingDraft.experienceLevel,
        timeAvailability: window.OnboardingDraft.timeAvailability,
        jointRestrictions: window.OnboardingDraft.jointRestrictions
      });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  function checkHotmartRedirect() {
    try {
      const params = new URLSearchParams(window.location.search);
      const isHotmart = params.get('origem') === 'hotmart' || params.has('transaction') || params.has('hottok');
      const email = params.get('email') || params.get('buyer_email');
      const currentUser = localStorage.getItem('protocolo_current_user');
      
      // Se veio de compra na Hotmart e ainda não ativou a senha, redireciona para onboarding
      if ((isHotmart || email) && !currentUser) {
        window.location.replace('./onboarding.html' + window.location.search);
        return true;
      }
    } catch (e) {}
    return false;
  }

  function initApp() {
    try {
      if (checkHotmartRedirect()) return;
      initOnboardingDraft();
      ProtocoloStore.subscribe(renderApp);
      renderApp(ProtocoloStore.getState());
      renderPwaBanner();
    } catch (err) {
      console.error('Error durante la inicialización de Protocolo:', err);
      try {
        const root = document.getElementById('appRoot');
        if (root && (!root.innerHTML || root.innerHTML.trim() === '')) {
          root.innerHTML = Views.renderMisiones(ProtocoloStore.getState());
        }
      } catch (fallbackErr) {
        console.error('Error en fallback:', fallbackErr);
      }
    }
  }

  function renderApp(state) {
    const root = document.getElementById('appRoot');
    if (!root) return;

    // CASO 1: Si el usuario aún no completó la configuración inicial, renderiza el ONBOARDING TÁCTICO
    if (!state.onboarding || !state.onboarding.completed) {
      if (!window.OnboardingDraft) initOnboardingDraft();
      root.innerHTML = Views.renderOnboarding(state);
      return;
    }

    // CASO 2: Usuario ya completó la configuración -> Renderiza el Centro de Mando Normal
    const rankInfo = ProtocoloStore.getRank(state.progress.points);
    const avatarDisplay = Views.getAvatarDisplay ? Views.getAvatarDisplay(state.profile.avatar) : '🪖';

    const headerHtml = `
      <header class="app-header">
        <div class="header-user" onclick="App.setTab('perfil')" style="cursor:pointer;" title="Abrir Ficha de Perfil">
          <div class="header-avatar-circle">
            ${avatarDisplay}
          </div>
          <div class="user-meta">
            <span class="user-rank-name">${rankInfo.current.icon} ${rankInfo.current.name}</span>
            <span class="user-name" title="${state.profile.name}">${state.profile.name}</span>
          </div>
        </div>

        <div class="header-stats">
          <div class="stat-pill points" title="Puntos Tácticos XP">
            <span style="display:inline-flex; align-items:center; gap:2px; white-space:nowrap;">⚡ ${state.progress.points}</span>
          </div>
          <div class="stat-pill" title="Racha de Días Consecutivos">
            <span style="display:inline-flex; align-items:center; gap:2px; white-space:nowrap;">🔥 ${state.progress.streak}</span>
          </div>
          <button class="btn-icon-header" onclick="App.setTab('perfil')" title="Mi Perfil">👤</button>
        </div>
      </header>
    `;

    // 2. Body View conforme Tab ativa
    let bodyHtml = '';
    if (state.activeTab === 'nutricion') {
      bodyHtml = Views.renderNutricion(state);
    } else if (state.activeTab === 'blindaje') {
      bodyHtml = Views.renderBlindaje(state);
    } else if (state.activeTab === 'evolucion') {
      bodyHtml = Views.renderEvolucion(state);
    } else if (state.activeTab === 'perfil') {
      bodyHtml = Views.renderPerfil(state);
    } else if (state.activeTab === 'comunidad') {
      bodyHtml = Views.renderComunidad(state);
    } else {
      bodyHtml = Views.renderMisiones(state);
    }

    // 3. Modal de Receita Ativa (se aberto)
    let recipeModalHtml = '';
    if (state.activeRecipeModalId) {
      recipeModalHtml = Views.renderRecipeModal(state.activeRecipeModalId);
    }

    // 4. Bottom Navigation (5 abas táticas mobile)
    const navHtml = `
      <nav class="bottom-nav">
        <!-- 1. Misiones -->
        <button class="nav-tab-btn ${state.activeTab === 'misiones' ? 'active' : ''}" onclick="App.setTab('misiones')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
          <span>Misiones</span>
        </button>

        <!-- 2. Nutrición -->
        <button class="nav-tab-btn ${state.activeTab === 'nutricion' ? 'active' : ''}" onclick="App.setTab('nutricion')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M18 8h1a4 4 0 0 1 0 8h-1M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          <span>Nutrición</span>
        </button>

        <!-- 3. COMUNIDAD VIP (ELEMENTO CENTRAL DESTACADO) -->
        <button class="nav-tab-btn nav-tab-center-vip ${state.activeTab === 'comunidad' ? 'active' : ''}" onclick="App.setTab('comunidad')">
          <div class="center-vip-button">
            <span class="center-vip-badge" style="background:#22c55e; color:#000; font-weight:900;">LIVE</span>
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </div>
          <span class="center-vip-label">Comunidad</span>
        </button>

        <!-- 4. Blindaje -->
        <button class="nav-tab-btn ${state.activeTab === 'blindaje' ? 'active' : ''}" onclick="App.setTab('blindaje')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
          <span>Blindaje</span>
        </button>

        <!-- 5. Evolución -->
        <button class="nav-tab-btn ${state.activeTab === 'evolucion' ? 'active' : ''}" onclick="App.setTab('evolucion')">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          <span>Evolución</span>
        </button>
      </nav>
    `;

    root.innerHTML = `
      <div class="app-container">
        ${headerHtml}
        <main class="app-content">
          ${bodyHtml}
        </main>
        ${navHtml}
        ${recipeModalHtml}
      </div>
    `;

    renderPwaBanner();
  }

  function renderPwaBanner() {
    try {
      const container = document.getElementById('pwaBannerContainer');
      if (!container) return;

      const isStandalone = (typeof window.matchMedia === 'function' && window.matchMedia('(display-mode: standalone)').matches) || (window.navigator && window.navigator.standalone);
      if (isStandalone) {
        container.innerHTML = '';
        return;
      }

      container.innerHTML = `
        <div class="pwa-banner">
          <div class="pwa-banner-txt">
            <strong>📲 Instalar Protocolo en tu Celular</strong>
            <span>Acceso rápido a tus 21 días desde tu pantalla de inicio</span>
          </div>
          <button class="pwa-banner-btn" onclick="App.installPwa()">
            INSTALAR
          </button>
        </div>
      `;
    } catch (e) {
      console.warn('PWA banner check warning:', e);
    }
  }

  function installPwa() {
    if (deferredInstallPrompt) {
      deferredInstallPrompt.prompt();
      deferredInstallPrompt.userChoice.then((choice) => {
        if (choice.outcome === 'accepted') {
          console.log('PWA instalada por el usuario');
        }
        deferredInstallPrompt = null;
        renderPwaBanner();
      });
    } else {
      alert("Para instalar en iPhone/iPad:\n1. Toca el botón 'Compartir' (el icono con la flecha hacia arriba en Safari).\n2. Selecciona 'Añadir a pantalla de inicio'.");
    }
  }

  // --- MODAL DE EDICIÓN DE PERFIL ---
  function openEditProfileModal() {
    const state = ProtocoloStore.getState();
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderEditProfileModal(state);
    modal.classList.add('show');
  }

  function closeEditProfileModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('show');
  }

  // --- MODAL: ARSENAL TÁCTICO & MÓDULOS DE ORDER BUMP ---
  function openArsenalModal() {
    const state = ProtocoloStore.getState();
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderArsenalModal(state);
    modal.classList.add('show');
  }

  function closeArsenalModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('show');
  }

  function openBatidosModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderBatidosModal();
    modal.classList.add('show');
  }

  function openAbdomenWorkoutModal() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderAbdomenWorkoutModal();
    modal.classList.add('show');
  }

  let selectedAvatarId = null;
  function selectAvatarPreset(avId) {
    selectedAvatarId = avId;
    document.querySelectorAll('.avatar-preset-opt').forEach(el => el.classList.remove('selected'));
    const clicked = event && event.currentTarget;
    if (clicked) clicked.classList.add('selected');
    ProtocoloStore.actions.setAvatar(avId);
  }

  function saveProfileChanges(e) {
    if (e && e.preventDefault) e.preventDefault();

    const name = document.getElementById('editName') ? document.getElementById('editName').value.trim() : '';
    const nickname = document.getElementById('editNickname') ? document.getElementById('editNickname').value.trim() : '';
    const age = document.getElementById('editAge') ? parseInt(document.getElementById('editAge').value) : 28;
    const height = document.getElementById('editHeight') ? parseInt(document.getElementById('editHeight').value) : 175;
    const startWeight = document.getElementById('editStartWeight') ? parseFloat(document.getElementById('editStartWeight').value) : 75;
    const targetWeight = document.getElementById('editTargetWeight') ? parseFloat(document.getElementById('editTargetWeight').value) : 70;
    const goal = document.getElementById('editGoal') ? document.getElementById('editGoal').value : 'perder-peso';
    const bio = document.getElementById('editBio') ? document.getElementById('editBio').value.trim() : '';
    const jointProtection = document.getElementById('editJointProtection') ? document.getElementById('editJointProtection').checked : false;

    ProtocoloStore.actions.updateProfile({
      name: name || 'Recluta',
      nickname: nickname || 'Alfa-01',
      age: isNaN(age) ? 28 : age,
      height: isNaN(height) ? 175 : height,
      startWeight: isNaN(startWeight) ? 75 : startWeight,
      targetWeight: isNaN(targetWeight) ? 70 : targetWeight,
      goal,
      bio,
      jointProtection
    });

    closeEditProfileModal();
  }

  function startOnboardingAgain() {
    initOnboardingDraft();
    ProtocoloStore.actions.restartOnboarding();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function confirmResetProgress() {
    if (confirm('⚠️ ¿Estás seguro de reiniciar todo el progreso de tus 21 días?\n\nTus marcas y desbloqueos volverán al Día 1.')) {
      ProtocoloStore.actions.resetAllProgress();
      closeEditProfileModal();
      setTab('misiones');
    }
  }

  let activePreferredMealType = 'almuerzo';
  let attachedCommunityPhotoDataUrl = null;

  // --- RECONOCIMIENTO NUTRICIONAL (SCANNER TÁCTICO) ---
  function handleScannerAction(source, mealType) {
    if (!window.ProtocoloStore || !window.ProtocoloStore.isVip()) {
      openVipScannerOfferModal();
      return;
    }
    if (source === 'camera') {
      openNutriCamera(mealType);
    } else {
      openNutriGallery(mealType);
    }
  }

  function openVipScannerOfferModal() {
    const s = ProtocoloStore.getState();
    s.activeVipScannerModal = true;
    renderApp();
  }

  function closeVipScannerOfferModal(event) {
    if (event && event.target && event.target !== event.currentTarget) return;
    const s = ProtocoloStore.getState();
    s.activeVipScannerModal = false;
    renderApp();
  }

  function openNutriCamera(mealType) {
    if (!window.ProtocoloStore || !window.ProtocoloStore.isVip()) {
      openVipScannerOfferModal();
      return;
    }
    activePreferredMealType = mealType || 'almuerzo';
    const inp = document.getElementById('nutriCameraInput');
    if (inp) {
      inp.value = '';
      inp.click();
    }
  }

  function openNutriGallery(mealType) {
    if (!window.ProtocoloStore || !window.ProtocoloStore.isVip()) {
      openVipScannerOfferModal();
      return;
    }
    activePreferredMealType = mealType || 'almuerzo';
    const inp = document.getElementById('nutriGalleryInput');
    if (inp) {
      inp.value = '';
      inp.click();
    }
  }

  async function handleNutriFileSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona un archivo de imagen válido.');
      return;
    }

    if (window.GeminiNutrition) {
      await window.GeminiNutrition.analyzeFoodPhoto(file, activePreferredMealType);
    }
  }

  function showAnalysisLoading(show) {
    let loader = document.getElementById('tacticalAiLoadingOverlay');
    if (show) {
      if (!loader) {
        loader = document.createElement('div');
        loader.id = 'tacticalAiLoadingOverlay';
        loader.className = 'tactical-ai-loading-overlay';
        loader.innerHTML = `
          <div class="ai-loading-card">
            <div class="ai-spinner-ring"></div>
            <div class="gemini-ai-pill" style="margin-top:16px;">
              <span class="gemini-sparkle">✦</span>
              <span>SCANNER TÁCTICO</span>
            </div>
            <h3 style="color:#fff; font-size:16px; font-weight:800; margin:10px 0 4px 0;">Analizando Plato Militar</h3>
            <p style="color:#a1a1aa; font-size:12.5px; line-height:1.4; margin:0;">
              Segmentando alimentos, estimando porciones en gramos y cruzando con la base TACO/USDA...
            </p>
          </div>
        `;
        document.body.appendChild(loader);
      }
      loader.classList.add('active');
    } else if (loader) {
      loader.classList.remove('active');
    }
  }

  function showAnalysisModal(analysis) {
    renderApp(ProtocoloStore.getState());
  }

  function closeAnalysisModal(e) {
    if (e.target.classList.contains('recipe-modal-backdrop')) {
      dismissAnalysis();
    }
  }

  function dismissAnalysis() {
    if (window.GeminiNutrition) {
      // Limpia análisis activo
      const a = window.GeminiNutrition.getCurrentAnalysis();
      if (a) {
        Object.keys(a).forEach(k => delete a[k]);
      }
    }
    renderApp(ProtocoloStore.getState());
  }

  function setAnalysisMealType(type) {
    const analysis = window.GeminiNutrition ? window.GeminiNutrition.getCurrentAnalysis() : null;
    if (analysis) {
      analysis.mealType = type;
      renderApp(ProtocoloStore.getState());
    }
  }

  function stepItemGrams(idx, delta) {
    const analysis = window.GeminiNutrition ? window.GeminiNutrition.getCurrentAnalysis() : null;
    if (!analysis || !analysis.items[idx]) return;
    const curGrams = analysis.items[idx].grams || 100;
    window.GeminiNutrition.updateItemGrams(idx, curGrams + delta);
    renderApp(ProtocoloStore.getState());
  }

  function handleItemGramsChange(idx, val) {
    if (window.GeminiNutrition) {
      window.GeminiNutrition.updateItemGrams(idx, val);
      renderApp(ProtocoloStore.getState());
    }
  }

  function removeAnalysisItem(idx) {
    if (window.GeminiNutrition) {
      window.GeminiNutrition.removeItem(idx);
      renderApp(ProtocoloStore.getState());
    }
  }

  function openAddFoodPicker() {
    openManualMealModal(activePreferredMealType, true);
  }

  async function confirmAnalysisAndSave() {
    if (!window.GeminiNutrition) return;
    const success = await window.GeminiNutrition.confirmAndSaveCurrentMeal();
    if (success) {
      showToast('¡Comida registrada con éxito en tu Diario Nutricional! (+40 XP)', 'success');
      renderApp(ProtocoloStore.getState());
    }
  }

  // --- DIARIO NUTRICIONAL: NAVEGACIÓN Y CRUD ---
  function changeDiaryDate(deltaDays) {
    const state = ProtocoloStore.getState();
    const cur = state.nutrition.selectedDate || new Date().toISOString().split('T')[0];
    const d = new Date(cur + 'T12:00:00');
    d.setDate(d.getDate() + deltaDays);
    const newDateStr = d.toISOString().split('T')[0];
    ProtocoloStore.actions.setDiaryDate(newDateStr);
  }

  function setDiaryToday() {
    const todayStr = new Date().toISOString().split('T')[0];
    ProtocoloStore.actions.setDiaryDate(todayStr);
  }

  function deleteDiaryMeal(mealId) {
    if (confirm('¿Deseas eliminar este registro de comida del diario?')) {
      ProtocoloStore.actions.deleteDiaryMeal(mealId);
      showToast('Registro de comida eliminado.', 'info');
    }
  }

  // --- GESTIÓN DE RECETAS PRIVADAS & BÚSQUEDA ---
  function handleRecipeSearch(query) {
    ProtocoloStore.actions.setRecipeSearchQuery(query);
  }

  function openCustomRecipeModal(recipeToEdit = null) {
    const state = ProtocoloStore.getState();
    state.activeCustomRecipeModal = {
      isEditing: Boolean(recipeToEdit),
      recipe: recipeToEdit ? JSON.parse(JSON.stringify(recipeToEdit)) : null
    };
    renderApp(state);
  }

  function closeCustomRecipeModal(e) {
    if (!e || e.target.classList.contains('recipe-modal-backdrop') || e.target.classList.contains('recipe-modal-close') || e.target.classList.contains('btn-cancel-analysis')) {
      const state = ProtocoloStore.getState();
      state.activeCustomRecipeModal = null;
      renderApp(state);
    }
  }

  function editCustomRecipe(recipeId, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    const state = ProtocoloStore.getState();
    const customList = state.nutrition.customRecipes || [];
    const r = customList.find(item => item.id === recipeId);
    if (!r) return;
    ProtocoloStore.actions.closeRecipeModal();
    openCustomRecipeModal(r);
  }

  function deleteCustomRecipe(recipeId, event) {
    if (event && event.stopPropagation) event.stopPropagation();
    if (confirm('¿Estás seguro de eliminar esta receta privada?\nEsta acción es irreversible y tu receta se borrará permanentemente.')) {
      ProtocoloStore.actions.deleteCustomRecipe(recipeId);
      ProtocoloStore.actions.closeRecipeModal();
      showToast('Receta privada eliminada.', 'info');
    }
  }

  function saveCustomRecipeForm(e) {
    if (e && e.preventDefault) e.preventDefault();
    const state = ProtocoloStore.getState();
    const isEdit = state.activeCustomRecipeModal && state.activeCustomRecipeModal.isEditing;
    const editingId = isEdit ? state.activeCustomRecipeModal.recipe.id : null;

    const title = document.getElementById('crTitle').value.trim();
    const category = document.getElementById('crCategory').value;
    const time = document.getElementById('crTime').value.trim() || '15 min';
    const servings = document.getElementById('crServings').value.trim() || '1 porción';
    const calories = parseInt(document.getElementById('crCalories').value, 10) || 300;
    const protein = parseFloat(document.getElementById('crProtein').value) || 20;
    const carbs = parseFloat(document.getElementById('crCarbs').value) || 30;
    const fats = parseFloat(document.getElementById('crFats').value) || 10;
    const desc = document.getElementById('crDesc').value.trim();
    const ingredients = document.getElementById('crIngredients').value.split('\n').map(s => s.trim()).filter(Boolean);
    const steps = document.getElementById('crSteps').value.split('\n').map(s => s.trim()).filter(Boolean);
    const img = document.getElementById('crImg').value.trim() || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=600&auto=format&fit=crop&q=80';

    const recipeData = {
      title,
      category,
      time,
      servings,
      calories,
      protein,
      carbs,
      fats,
      desc,
      ingredients,
      steps,
      img
    };

    if (isEdit && editingId) {
      ProtocoloStore.actions.updateCustomRecipe(editingId, recipeData);
      showToast('¡Receta privada actualizada con éxito!', 'success');
    } else {
      ProtocoloStore.actions.addCustomRecipe(recipeData);
      showToast('¡Nueva receta privada creada con éxito! (+35 XP)', 'success');
    }

    state.activeCustomRecipeModal = null;
    renderApp(state);
  }

  function autoCalcMacrosFromIngredients() {
    const ingEl = document.getElementById('crIngredients');
    if (!ingEl) return;
    const text = ingEl.value;
    const lines = text.split('\n').map(s => s.trim()).filter(Boolean);
    if (lines.length === 0) {
      alert('Escribe algunos ingredientes primero (ej. 150g pechuga de pollo, 100g arroz blanco)...');
      return;
    }

    let totalCals = 0;
    let totalProt = 0;
    let totalCarbs = 0;
    let totalFats = 0;
    let recognizedCount = 0;

    lines.forEach(line => {
      const gramMatch = line.match(/(\d+)\s*(?:g|gr|gramos|ml)/i);
      const grams = gramMatch ? parseInt(gramMatch[1], 10) : 100;
      const matched = window.NutriDB ? window.NutriDB.matchGeminiItem(line) : null;
      if (matched) {
        const m = window.NutriDB.calculateMacros(matched.id, grams);
        totalCals += m.calories;
        totalProt += m.protein;
        totalCarbs += m.carbs;
        totalFats += m.fats;
        recognizedCount++;
      }
    });

    if (recognizedCount === 0) {
      alert('No se reconocieron ingredientes automáticos en la tabla TACO/USDA. Puedes ingresar los macros manualmente.');
      return;
    }

    document.getElementById('crCalories').value = Math.round(totalCals);
    document.getElementById('crProtein').value = Math.round(totalProt * 10) / 10;
    document.getElementById('crCarbs').value = Math.round(totalCarbs * 10) / 10;
    document.getElementById('crFats').value = Math.round(totalFats * 10) / 10;
    showToast(`Macros calculados automáticamente a partir de ${recognizedCount} ingredientes reconocidos.`, 'success');
  }

  // --- REGISTRO MANUAL DE ALIMENTO ---
  function openManualMealModal(mealType, addToAnalysisOnly = false) {
    const state = ProtocoloStore.getState();
    state.activeManualMealModal = {
      mealType: mealType || 'almuerzo',
      query: '',
      addToAnalysisOnly: Boolean(addToAnalysisOnly)
    };
    renderApp(state);
  }

  function closeManualMealModal(e) {
    if (!e || e.target.classList.contains('recipe-modal-backdrop') || e.target.classList.contains('recipe-modal-close')) {
      const state = ProtocoloStore.getState();
      state.activeManualMealModal = null;
      renderApp(state);
    }
  }

  function handleManualFoodSearch(query) {
    const state = ProtocoloStore.getState();
    if (state.activeManualMealModal) {
      state.activeManualMealModal.query = query;
      renderApp(state);
    }
  }

  function selectManualFood(foodId) {
    const state = ProtocoloStore.getState();
    const modalData = state.activeManualMealModal;
    if (!modalData) return;

    const gramsPrompt = prompt('Ingresa la cantidad en gramos consumida:', '120');
    const grams = parseInt(gramsPrompt, 10);
    if (isNaN(grams) || grams <= 0) return;

    if (modalData.addToAnalysisOnly && window.GeminiNutrition) {
      window.GeminiNutrition.addItem(foodId, grams);
      state.activeManualMealModal = null;
      renderApp(state);
      return;
    }

    const food = window.NutriDB ? window.NutriDB.getById(foodId) : null;
    if (!food) return;

    const macros = window.NutriDB.calculateMacros(food.id, grams);
    const todayStr = state.nutrition.selectedDate || new Date().toISOString().split('T')[0];

    const newMeal = {
      id: 'meal_manual_' + Date.now(),
      date: todayStr,
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      type: modalData.mealType,
      title: food.name,
      photoUrl: null,
      confidence: 1.0,
      calories: macros.calories,
      protein: macros.protein,
      carbs: macros.carbs,
      fats: macros.fats,
      items: [
        {
          id: 'it_m_' + Date.now(),
          name: food.name,
          foodId: food.id,
          grams: grams,
          calories: macros.calories,
          protein: macros.protein,
          carbs: macros.carbs,
          fats: macros.fats
        }
      ],
      notes: 'Registro manual directo desde tabla TACO/USDA'
    };

    ProtocoloStore.actions.addDiaryMeal(newMeal);
    state.activeManualMealModal = null;
    showToast(`"${food.name}" agregado a tu diario (+40 XP).`, 'success');
  }

  // --- ADJUNTAR FOTO EN COMUNIDAD VIP ---
  function triggerCommunityPhotoUpload() {
    const inp = document.getElementById('commPhotoInput');
    if (inp) {
      inp.value = '';
      inp.click();
    }
  }

  function handleCommunityPhotoSelect(event) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
      attachedCommunityPhotoDataUrl = e.target.result;
      const preview = document.getElementById('commAttachedPhotoPreview');
      const img = document.getElementById('commAttachedPhotoImg');
      if (preview && img) {
        img.src = attachedCommunityPhotoDataUrl;
        preview.style.display = 'block';
      }
    };
    reader.readAsDataURL(file);
  }

  function removeAttachedCommunityPhoto() {
    attachedCommunityPhotoDataUrl = null;
    const preview = document.getElementById('commAttachedPhotoPreview');
    const inp = document.getElementById('commPhotoInput');
    if (preview) preview.style.display = 'none';
    if (inp) inp.value = '';
  }

  function deleteCommunityPost(postId) {
    if (confirm('¿Deseas eliminar esta publicación de la hermandad?')) {
      ProtocoloStore.actions.deleteCommunityPost(postId);
      showToast('Publicación eliminada.', 'info');
    }
  }

  // --- TOAST NOTIFICATIONS & FEEDBACK TÁCTICO ---
  function showToast(msg, type = 'info') {
    let container = document.getElementById('appToastContainer');
    if (!container) {
      container = document.createElement('div');
      container.id = 'appToastContainer';
      container.className = 'app-toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = `tactical-toast ${type}`;
    toast.innerHTML = `
      <span class="toast-dot ${type}"></span>
      <span class="toast-text">${msg}</span>
    `;
    container.appendChild(toast);

    if (navigator.vibrate) {
      try { navigator.vibrate(type === 'error' ? [80, 50, 80] : 40); } catch(e) {}
    }

    setTimeout(() => {
      toast.classList.add('hide');
      setTimeout(() => toast.remove(), 400);
    }, 3500);
  }

  // --- COMUNIDAD TÁCTICA VIP ---
  function toggleCommunityDemo(forceVal) {
    ProtocoloStore.actions.toggleCommunityVip(forceVal);
  }

  function setCommunityFilter(filterId) {
    ProtocoloStore.actions.setCommunityFilter(filterId);
  }

  async function syncCommunityFeed() {
    if (typeof window !== 'undefined' && window.SupabaseClient && window.SupabaseClient.isConfigured()) {
      try {
        const res = await window.SupabaseClient.fetchCommunityPosts();
        if (res && res.success && Array.isArray(res.data) && res.data.length > 0) {
          const mapped = res.data.map(p => ({
            id: p.id,
            author: p.author_name || 'Recluta',
            nickname: p.author_nickname || 'Alfa-01',
            rankBadge: p.author_rank || 'R-1',
            rankIcon: '🎖️',
            avatar: p.avatar_id || 'tactical-helmet',
            date: new Date(p.created_at).toLocaleDateString(),
            tag: p.tag || 'misiones',
            tagLabel: p.tag_label || 'MISIÓN',
            text: p.content_text,
            image: p.image_url,
            likes: p.likes_count || 0,
            likedByMe: false,
            comments: (p.community_comments || []).map(c => ({
              id: c.id,
              author: c.author_name,
              nickname: c.author_nickname,
              text: c.content_text,
              date: new Date(c.created_at).toLocaleDateString()
            }))
          }));
          ProtocoloStore.actions.setCommunityPosts(mapped);
        }
      } catch (err) {
        console.warn('Sync feed warning:', err);
      }
    }
  }

  async function submitCommunityPost() {
    const textEl = document.getElementById('commPostInput');
    const tagEl = document.getElementById('commPostTag');
    if (!textEl) return;

    const text = textEl.value.trim();
    if (!text && !attachedCommunityPhotoDataUrl) {
      alert('Por favor escribe tu reporte o adjunta una fotografía antes de publicar.');
      return;
    }

    const tag = tagEl ? tagEl.value : 'misiones';
    const postPayload = {
      text: text || 'Reporte con fotografía a la hermandad.',
      tag,
      image: attachedCommunityPhotoDataUrl || null
    };
    ProtocoloStore.actions.addCommunityPost(postPayload);

    // Persistência em banco de dados Supabase
    if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
      try {
        const res = await window.SupabaseClient.createCommunityPost(postPayload);
        if (res && res.success) {
          syncCommunityFeed();
        }
      } catch (err) {
        console.warn('Persistência remota de post:', err);
      }
    }

    textEl.value = '';
    removeAttachedCommunityPhoto();
    showToast('¡Reporte publicado con éxito en la Hermandad! (+30 XP)', 'success');
  }

  function likeCommunityPost(postId) {
    ProtocoloStore.actions.likeCommunityPost(postId);
    if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
      window.SupabaseClient.likeCommunityPost(postId);
    }
  }

  function toggleComments(postId) {
    const section = document.getElementById('comments_' + postId);
    if (!section) return;
    const isHidden = (section.style.display === 'none' || window.getComputedStyle(section).display === 'none');
    if (isHidden) {
      section.style.display = 'block';
      const input = document.getElementById('input_comment_' + postId);
      if (input) input.focus();
    } else {
      section.style.display = 'none';
    }
  }

  const focusCommentInput = toggleComments;

  async function submitComment(postId) {
    const input = document.getElementById('input_comment_' + postId);
    if (!input) return;
    const text = input.value.trim();
    if (!text) return;
    ProtocoloStore.actions.addCommunityComment(postId, text);
    if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
      const p = ProtocoloStore.getState().profile;
      try {
        await window.SupabaseClient.createCommunityComment(postId, text, p.name, p.nickname);
        syncCommunityFeed();
      } catch (err) {
        console.warn('Persistência remota de comentário:', err);
      }
    }
    input.value = '';
    showToast('Comentario enviado a la hermandad.', 'success');
  }

  function openHotmartCheckout(type = 'vip') {
    const hotmartCfg = (window.PROTOCOLO_CONFIG && window.PROTOCOLO_CONFIG.hotmart) || {};
    let baseCheckoutUrl = hotmartCfg.vipCheckoutUrl;
    if (type === 'entry') {
      baseCheckoutUrl = hotmartCfg.entryCheckoutUrl;
    } else if (type === 'bump_abdomen') {
      baseCheckoutUrl = hotmartCfg.bumpAbdomenUrl || hotmartCfg.entryCheckoutUrl;
    } else if (type === 'bump_batidos') {
      baseCheckoutUrl = hotmartCfg.bumpBatidosUrl || hotmartCfg.entryCheckoutUrl;
    }

    let finalUrl = baseCheckoutUrl || 'https://pay.hotmart.com';
    const user = (window.SupabaseClient && window.SupabaseClient.getUser()) || {};
    const state = ProtocoloStore.getState();
    const emailToUse = user.email || (state && state.profile && state.profile.email);
    const nameToUse = (user.user_metadata && user.user_metadata.full_name) || (state && state.profile && state.profile.name);

    const params = new URLSearchParams();
    if (emailToUse) params.set('email', emailToUse);
    if (nameToUse) params.set('name', nameToUse);
    params.set('checkoutMode', '10');

    const queryString = params.toString();
    if (queryString) {
      finalUrl += (finalUrl.includes('?') ? '&' : '?') + queryString;
    }

    window.open(finalUrl, '_blank');
  }

  function toggleEntitlement(key) {
    ProtocoloStore.actions.toggleEntitlement(key);
    const modal = document.getElementById('settingsModal');
    if (modal && modal.classList.contains('show')) {
      if (modal.innerHTML.includes('Finisher Abdomen')) {
        modal.innerHTML = Views.renderAbdomenWorkoutModal();
      } else if (modal.innerHTML.includes('Batidos Anab')) {
        modal.innerHTML = Views.renderBatidosModal();
      } else if (modal.innerHTML.includes('Arsenal de Documentos')) {
        modal.innerHTML = Views.renderArsenalModal();
      }
    }
  }

  function handleCommunityCheckout() {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    const cfg = (window.PROTOCOLO_CONFIG && window.PROTOCOLO_CONFIG.pricing) || {};

    modal.innerHTML = `
      <div class="app-modal-card">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:14px;">
          <h3 style="font-size:17px; font-weight:800; color:#fff;">Scanner Nutricional por Foto (IA)</h3>
          <button class="player-close-btn" style="width:44px; height:44px;" onclick="App.closeEditProfileModal()">&times;</button>
        </div>

        <div style="text-align:center; padding:10px 0 16px;">
          <div style="font-size:40px; margin-bottom:8px;">📸</div>
          <h4 style="color:#fff; font-size:16px; font-weight:800; margin-bottom:6px;">Módulo VIP IA: ${cfg.formattedMonthly || '$4.90 USD / mes'}</h4>
          <p style="color:#a1a1aa; font-size:12.5px; line-height:1.4;">
            No calcules tus macros a mano. Apunta la cámara de tu celular a tu plato y la Inteligencia Artificial segmentará los gramos, calorías y nutrientes de tu comida al instante.
          </p>
        </div>

        <div style="background:rgba(34, 197, 94, 0.08); border:1px solid rgba(34, 197, 94, 0.25); border-radius:10px; padding:12px; margin-bottom:16px; font-size:12px; color:#d4d4d8; line-height:1.4;">
          🔒 <strong>Pago Seguro Internacional via Hotmart:</strong><br>
          Acceso instantáneo con cancelación en 1 clic. Acepta tarjetas, OXXO, PSE y PayPal.
        </div>

        <div style="display:flex; flex-direction:column; gap:10px;">
          <button class="btn-checkout-community" style="width:100%; justify-content:center;" onclick="App.openHotmartCheckout('vip')">
            DESBLOQUEAR SCANNER IA (${cfg.formattedMonthlyShort || '$4.90/MES'})
          </button>
          <button class="btn-action-full" style="background:#18201a; border-color:rgba(234,179,8,0.3); color:#fef08a;" onclick="App.toggleCommunityDemo(true); App.closeEditProfileModal();">
            ▶ ACTIVAR MODO PRUEBA / DEMOSTRACIÓN
          </button>
          <button class="btn-secondary-full" onclick="App.closeEditProfileModal()">
            Continuar con Registro Manual Gratuito
          </button>
        </div>
      </div>
    `;
    modal.classList.add('show');
  }

  // Compatibilidade com ações já existentes
  function setTab(t) {
    ProtocoloStore.actions.setTab(t);
    window.scrollTo({ top: 0, behavior: 'smooth' });
    if (t === 'comunidad') {
      syncCommunityFeed();
    }
  }

  function saveWeight() {
    const inp = document.getElementById('inputNewWeight');
    if (inp && inp.value) {
      ProtocoloStore.actions.logWeight(inp.value);
      inp.value = '';
    }
  }

  function saveProfileWeight() {
    const inp = document.getElementById('inputProfileNewWeight');
    if (inp && inp.value) {
      ProtocoloStore.actions.logWeight(inp.value);
      inp.value = '';
    }
  }

  function toggleJointProtection() {
    ProtocoloStore.actions.toggleJointProtection();
    renderApp(ProtocoloStore.getState());
  }

  function toggleJointRegion(regKey) {
    ProtocoloStore.actions.toggleJointRegion(regKey);
    renderApp(ProtocoloStore.getState());
  }

  function selectDay(d) {
    ProtocoloStore.getState().progress.currentDay = d;
    renderApp(ProtocoloStore.getState());
  }

  function selectPhaseTab(phaseNum) {
    ProtocoloStore.getState().progress.selectedPhaseTab = phaseNum;
    renderApp(ProtocoloStore.getState());
  }

  function alertLocked(d) {
    alert('🔒 Misión Bloqueada\n\nEl Día ' + d + ' aún no está disponible. Para mantener la progresión táctica, primero debes completar la misión del Día ' + (d - 1) + '.');
  }

  function closeRecipeModal(e) {
    if (e.target.classList.contains('recipe-modal-backdrop')) {
      ProtocoloStore.actions.closeRecipeModal();
    }
  }

  function handlePhotoUpload(event, type) {
    const file = event.target.files && event.target.files[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      alert('Por favor selecciona una imagen válida.');
      return;
    }

    const reader = new FileReader();
    reader.onload = function(e) {
      ProtocoloStore.actions.saveEvolutionPhoto(type, e.target.result);
    };
    reader.readAsDataURL(file);
  }

  
  // --- GUÍA PWA & ALERTAS TÁCTICAS ---
  function showInstallTab(platform) {
    const tabIos = document.getElementById('tabGuideIos');
    const tabAndroid = document.getElementById('tabGuideAndroid');
    const stepsIos = document.getElementById('pwaStepsIos');
    const stepsAndroid = document.getElementById('pwaStepsAndroid');

    if (platform === 'ios') {
      if (tabIos) tabIos.classList.add('active');
      if (tabAndroid) tabAndroid.classList.remove('active');
      if (stepsIos) stepsIos.style.display = 'block';
      if (stepsAndroid) stepsAndroid.style.display = 'none';
    } else {
      if (tabIos) tabIos.classList.remove('active');
      if (tabAndroid) tabAndroid.classList.add('active');
      if (stepsIos) stepsIos.style.display = 'none';
      if (stepsAndroid) stepsAndroid.style.display = 'block';
    }
  }

  function setReminderHour(hour) {
    try {
      localStorage.setItem('protocolo_reminder_hour', hour);
      ProtocoloStore.actions.toast('⏰ Horario táctico fijado a las ' + hour, 'success');
    } catch (e) {}
  }

  
  // --- CLIENTE WEB PUSH REAL (VAPID + PUSH MANAGER) ---
  function isIosDevice() {
    return typeof navigator !== 'undefined' && /iPad|iPhone|iPod/.test(navigator.userAgent) && !window.MSStream;
  }

  function isStandaloneMode() {
    return (typeof window !== 'undefined') && (
      window.navigator.standalone === true ||
      window.matchMedia('(display-mode: standalone)').matches
    );
  }

  function urlB64ToUint8Array(base64String) {
    const padding = '='.repeat((4 - base64String.length % 4) % 4);
    const base64 = (base64String + padding).replace(/\-/g, '+').replace(/_/g, '/');
    const rawData = window.atob(base64);
    const outputArray = new Uint8Array(rawData.length);
    for (let i = 0; i < rawData.length; ++i) {
      outputArray[i] = rawData.charCodeAt(i);
    }
    return outputArray;
  }

  // Chave VAPID pública padrão (pode ser sobrescrita nas configurações do Supabase)
  const DEFAULT_VAPID_PUBLIC_KEY = 'BEl62iUYgUivxIkv69yViEuiBIa-Ib9-SkvMeAtA3LFgDzkrxZJjSgSnfckjBJuBkr3qBUYIHBQFLXYp5Nksh8U';

  async function subscribeWebPush(btn) {
    // 1. Verificação crítica de iOS Standalone (Requisito da Apple)
    if (isIosDevice() && !isStandaloneMode()) {
      alert('📱 REQUISITO EN IPHONE (iOS):\n\nPara recibir alertas con el celular bloqueado o el app cerrado, Apple exige que agregues el Protocolo a tu pantalla de inicio.\n\n1. Toca el botón Compartir (icono de cuadrado con flecha hacia arriba).\n2. Selecciona "Agregar a pantalla de inicio".\n3. Abre la app desde tu pantalla para activar los recordatorios.');
      showInstallTab('ios');
      return;
    }

    if (!('serviceWorker' in navigator) || !('PushManager' in window)) {
      alert('Tu navegador no es compatible con notificaciones Web Push automáticas.');
      return;
    }

    try {
      if (btn) {
        btn.innerText = 'CONECTANDO...';
        btn.disabled = true;
      }

      // 2. Solicita permissão do sistema
      const permission = await Notification.requestPermission();
      if (permission !== 'granted') {
        alert('Permiso de notificaciones denegado. Puedes activarlo en los ajustes del navegador.');
        if (btn) {
          btn.innerText = '🔔 ACTIVAR RECORDATORIOS WEB PUSH';
          btn.disabled = false;
        }
        return;
      }

      // 3. Obtém o Service Worker ativo e assina no PushManager
      const reg = await navigator.serviceWorker.ready;
      const vapidKey = DEFAULT_VAPID_PUBLIC_KEY;
      const convertedVapidKey = urlB64ToUint8Array(vapidKey);

      let sub = await reg.pushManager.getSubscription();
      if (!sub) {
        sub = await reg.pushManager.subscribe({
          userVisibleOnly: true,
          applicationServerKey: convertedVapidKey
        });
      }

      const subJson = sub.toJSON();
      const p256dh = subJson.keys && subJson.keys.p256dh;
      const authKey = subJson.keys && subJson.keys.auth;
      const endpoint = sub.endpoint;
      const hourSelect = document.getElementById('onbReminderSelect');
      const preferredHour = hourSelect ? hourSelect.value : (localStorage.getItem('protocolo_reminder_hour') || '18:30');
      const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone || 'America/Sao_Paulo';

      // 4. Salva a assinatura na tabela push_subscriptions do Supabase
      if (window.SupabaseClient && window.SupabaseClient.isConfigured()) {
        const config = window.SupabaseClient.getConfig();
        const user = window.SupabaseClient.getUser();
        await fetch(`${config.url}/rest/v1/push_subscriptions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'apikey': config.anonKey,
            'Authorization': `Bearer ${config.token || config.anonKey}`,
            'Prefer': 'resolution=merge-duplicates'
          },
          body: JSON.stringify({
            endpoint,
            p256dh,
            auth: authKey,
            preferred_hour: preferredHour,
            timezone,
            user_id: user ? user.id : null,
            user_agent: navigator.userAgent
          })
        });
      }

      localStorage.setItem('protocolo_push_subscribed', 'true');
      localStorage.setItem('protocolo_reminder_hour', preferredHour);

      if (btn) {
        btn.innerText = '✓ AVISOS WEB PUSH ACTIVADOS (' + preferredHour + ')';
        btn.style.background = '#22c55e';
      }

      ProtocoloStore.actions.toast('🔔 ¡Recordatorios militares activos a las ' + preferredHour + '! Recibirás tu aviso diario.', 'success');
    } catch (err) {
      console.warn('Error al suscribir Web Push:', err);
      if (btn) {
        btn.innerText = '🔔 ACTIVAR RECORDATORIOS WEB PUSH';
        btn.disabled = false;
      }
      alert('Aviso: ' + err.message);
    }
  }


  
  // --- EXPEDIENTE DE MEDALLAS & CONDECORACIONES ---
  function inspectMedal(medalId) {
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    const state = ProtocoloStore.getState();
    modal.innerHTML = Views.renderBadgeInspectModal(medalId, state);
    modal.classList.add('show');
  }

  // --- SUPABASE AUTH & CLOUD BACKUP ---
  let currentAuthMode = 'login';

  function openAuthModal(mode = 'login') {
    currentAuthMode = mode;
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderAuthModal(mode);
    modal.classList.add('show');
  }

  function setAuthModalMode(mode) {
    currentAuthMode = mode;
    const modal = document.getElementById('settingsModal');
    if (!modal) return;
    modal.innerHTML = Views.renderAuthModal(mode);
  }

  function closeAuthModal() {
    const modal = document.getElementById('settingsModal');
    if (modal) modal.classList.remove('show');
  }

  async function handlePasswordRecoverySubmit(e) {
    if (e && e.preventDefault) e.preventDefault();
    const emailEl = document.getElementById('authEmailInput');
    const submitBtn = document.getElementById('btnRecoverSubmit');
    if (!emailEl) return;

    const email = emailEl.value.trim();
    if (!email) {
      alert('Ingresa el correo electrónico utilizado en tu compra.');
      return;
    }

    if (submitBtn) {
      submitBtn.innerText = 'ENVIANDO ENLACE...';
      submitBtn.disabled = true;
    }

    const res = await window.SupabaseClient.resetPassword(email);
    if (res.success) {
      alert('¡Enlace táctico enviado! Revisa tu bandeja de entrada o spam para restablecer tu contraseña.');
      setAuthModalMode('login');
    } else {
      if (submitBtn) {
        submitBtn.innerText = 'ENVIAR ENLACE DE RECUPERACIÓN';
        submitBtn.disabled = false;
      }
      alert('Aviso: ' + (res.error || 'Verifica que el correo esté registrado o que las claves de Supabase estén activas.'));
    }
  }

  async function handleAuthSubmit(e, mode = 'login') {
    if (e && e.preventDefault) e.preventDefault();
    const emailEl = document.getElementById('authEmailInput');
    const passEl = document.getElementById('authPasswordInput');
    const nameEl = document.getElementById('authNameInput');
    const submitBtn = document.getElementById('btnAuthSubmit');
    if (!emailEl || !passEl) return;

    const email = emailEl.value.trim();
    const pass = passEl.value.trim();
    const name = nameEl ? nameEl.value.trim() : ProtocoloStore.getState().profile.name;

    if (!email || pass.length < 6) {
      alert('Ingresa un correo válido y una contraseña de al menos 6 caracteres.');
      return;
    }

    if (submitBtn) {
      submitBtn.innerText = 'VERIFICANDO CREDENCIALES...';
      submitBtn.disabled = true;
    }

    let res;
    if (mode === 'register') {
      res = await window.SupabaseClient.signUp(email, pass, { name });
    } else {
      res = await window.SupabaseClient.signIn(email, pass);
      // Fallback amigável se a conta não existia ainda e foi criada na compra
      if (!res.success && (res.error && res.error.includes('Invalid login credentials'))) {
        res = await window.SupabaseClient.signUp(email, pass, { name });
      }
    }

    if (res && res.success) {
      closeAuthModal();
      showToast('☁️ ¡Sesión militar iniciada con éxito!', 'success');
      // Sincronizar dados atuais
      await syncProfileCloud();
      renderApp(ProtocoloStore.getState());
    } else {
      if (submitBtn) {
        submitBtn.innerText = mode === 'register' ? 'ACTIVAR MI CUENTA MILITAR' : 'INICIAR SESIÓN EN EL CUARTEL';
        submitBtn.disabled = false;
      }
      alert('Aviso de conexión: ' + (res.error || 'Verifica que las credenciales de Supabase estén activas en supabase-client.js.'));
    }
  }

  async function syncProfileCloud() {
    if (!window.SupabaseClient || !window.SupabaseClient.isAuthenticated()) {
      showToast('Inicia sesión para sincronizar tu perfil.', 'info');
      return;
    }
    const state = ProtocoloStore.getState();
    const res = await window.SupabaseClient.syncProfile(state.profile, state.progress, state.weightLog);
    if (res && res.success) {
      showToast('☁️ Progreso y peso respaldados en la nube.', 'success');
    } else {
      showToast('No se pudo respaldar en la nube (Modo offline).', 'warning');
    }
  }

  function signOutCloud() {
    if (window.SupabaseClient) {
      window.SupabaseClient.signOut();
      showToast('Sesión en la nube cerrada.', 'info');
      renderApp(ProtocoloStore.getState());
    }
  }

  window.App = {
    init: initApp,
    setTab,
    installPwa,
    openArsenalModal,
    closeArsenalModal,
    openBatidosModal,
    openAbdomenWorkoutModal,
    openEditProfileModal,
    closeEditProfileModal,
    openSettings: openEditProfileModal,
    closeSettings: closeEditProfileModal,
    selectAvatarPreset,
    saveProfileChanges,
    startOnboardingAgain,
    confirmResetProgress,
    confirmReset: confirmResetProgress,
    toggleCommunityDemo,
    setCommunityFilter,
    submitCommunityPost,
    likeCommunityPost,
    toggleComments,
    focusCommentInput,
    submitComment,
    deleteCommunityPost,
    triggerCommunityPhotoUpload,
    handleCommunityPhotoSelect,
    removeAttachedCommunityPhoto,
    handleCommunityCheckout,
    saveWeight,
    saveProfileWeight,
    toggleJointProtection,
    toggleJointRegion,
    selectDay,
    selectPhaseTab,
    alertLocked,
    closeRecipeModal,
    handlePhotoUpload,
    openNutriCamera,
    openNutriGallery,
    handleScannerAction,
    openVipScannerOfferModal,
    closeVipScannerOfferModal,
    handleNutriFileSelect,
    showAnalysisLoading,
    showAnalysisModal,
    closeAnalysisModal,
    dismissAnalysis,
    setAnalysisMealType,
    stepItemGrams,
    handleItemGramsChange,
    removeAnalysisItem,
    openAddFoodPicker,
    confirmAnalysisAndSave,
    changeDiaryDate,
    setDiaryToday,
    deleteDiaryMeal,
    handleRecipeSearch,
    openCustomRecipeModal,
    closeCustomRecipeModal,
    editCustomRecipe,
    deleteCustomRecipe,
    saveCustomRecipeForm,
    autoCalcMacrosFromIngredients,
    openManualMealModal,
    closeManualMealModal,
    handleManualFoodSearch,
    selectManualFood,
    showToast,
    showInstallTab,
    setReminderHour,
    subscribeWebPush,
    requestPushPermission: subscribeWebPush,
    openAuthModal,
    closeAuthModal,
    setAuthModalMode,
    handleAuthSubmit,
    handlePasswordRecoverySubmit,
    inspectMedal,
    openHotmartCheckout,
    toggleEntitlement,
    syncProfileCloud,
    signOutCloud,
    reRender: () => renderApp(ProtocoloStore.getState())
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initApp);
  } else {
    // Si el DOM ya fue cargado o está en estado interactivo (ej. cache SW / recarga rápida), inicializa de inmediato
    initApp();
  }

})();
