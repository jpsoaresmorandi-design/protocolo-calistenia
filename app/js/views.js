/**
 * View Templates for Protocolo PWA:
 * Misiones (con bloqueo progresivo)
 * Nutrición (Libro de recetas completas por objetivos + macros + modal)
 * Blindaje (Módulo guiado de longevidad articular)
 * Evolución (Gráfico SVG de peso + Fotos Antes/Después + Patentes)
 */
(function() {
  'use strict';

  // ==========================================
  // 1. VISTA: MISIONES (Bloqueo Progresivo)
  // ==========================================
  function renderMisiones(state) {
    const dayNum = state.progress.currentDay || 1;
    const plan = ExercisesDB.getDayPlan(dayNum, state.profile);
    const isCompleted = state.progress.completedDays.includes(dayNum);
    const isUnlocked = ProtocoloStore.isDayUnlocked(dayNum);

    // Gestão de Fases de Retenção
    const isPhase2Unlocked = state.progress.completedDays.includes(21);
    const isPhase3Unlocked = state.progress.completedDays.includes(42);
    
    // Determinar fase selecionada para exibição no calendário
    let selectedPhase = state.progress.selectedPhaseTab;
    if (!selectedPhase) {
      selectedPhase = (dayNum > 42 ? 3 : (dayNum > 21 ? 2 : 1));
    }

    let startDay = 1;
    let endDay = 21;
    if (selectedPhase === 2) {
      startDay = 22;
      endDay = 42;
    } else if (selectedPhase === 3) {
      startDay = 43;
      endDay = 60;
    }

    // Grid dos dias da fase selecionada
    let daysHtml = '';
    for (let d = startDay; d <= endDay; d++) {
      const done = state.progress.completedDays.includes(d);
      const unlocked = ProtocoloStore.isDayUnlocked(d);
      const isCur = d === dayNum;
      const isRec = (d % 7 === 4);
      const cls = ['day-cell'];

      if (done) cls.push('completed');
      if (isCur) cls.push('current');
      if (isRec) cls.push('recovery');
      if (!unlocked) cls.push('locked');

      let icon = '';
      if (!unlocked) {
        icon = '🔒';
      } else if (done) {
        icon = '✓';
      } else if (isRec) {
        icon = '🛡️';
      } else {
        icon = '•';
      }

      daysHtml += `
        <div class="${cls.join(' ')}" onclick="App.selectDay(${d})" title="${unlocked ? `Día ${d}` : `Bloqueado - Completa el Día ${d-1}`}">
          <span class="num">${d}</span>
          <span class="status-icon">${icon}</span>
        </div>
      `;
    }

    // Métricas para o Card Resumo de Peso
    const p = state.profile;
    const wLogs = state.weightLog || [];
    const curW = wLogs.length ? (wLogs[wLogs.length - 1].kg || wLogs[wLogs.length - 1].weight) : p.startWeight;
    const dW = (curW - p.startWeight).toFixed(1);
    const dSign = dW > 0 ? ('+' + dW) : dW;

    // Meta Semanal (5 misiones por semana)
    const completedThisWeek = state.progress.completedDays.length % 7;
    const weeklyTarget = 5;
    const weeklyPct = Math.min(100, Math.round((completedThisWeek / weeklyTarget) * 100));

    return `
      <!-- Banner PWA se aplicável -->
      <div id="pwaBannerContainer"></div>

      <!-- Card Resumen de Peso Táctico en la Home -->
      <div class="home-weight-summary-card" onclick="App.setTab('evolucion')" style="background:var(--bg-surface); border:1px solid rgba(34,197,94,0.25); border-radius:var(--radius-md); padding:10px 14px; margin-bottom:12px; cursor:pointer; display:flex; justify-content:space-between; align-items:center;">
        <div style="display:flex; align-items:center; gap:10px;">
          <span style="font-size:22px;">⚖️</span>
          <div>
            <div style="display:flex; align-items:center; gap:6px;">
              <strong style="color:#fff; font-size:13px;">Evolución de Peso:</strong>
              <span style="color:#22c55e; font-weight:800; font-size:13px;">${curW} kg</span>
              <span style="font-size:11px; color:#a1a1aa;">(${dSign} kg)</span>
            </div>
            <div style="color:#71717a; font-size:11px;">Meta fijada: ${p.targetWeight} kg • Toca para ver curva gráfica</div>
          </div>
        </div>
        <span style="color:var(--primary-green); font-size:11px; font-weight:800; background:rgba(34,197,94,0.12); padding:4px 8px; border-radius:4px;">VER GRÁFICO ›</span>
      </div>

      <!-- Meta Semanal de Consistencia -->
      <div class="home-weekly-goal-card" style="background:rgba(0,0,0,0.35); border:1px solid rgba(255,255,255,0.08); border-radius:var(--radius-sm); padding:10px 14px; margin-bottom:14px;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:6px;">
          <span style="font-size:11.5px; font-weight:800; color:#fff; display:flex; align-items:center; gap:5px;">
            <span>🎯</span> META SEMANAL: ${completedThisWeek}/${weeklyTarget} MISIONES
          </span>
          <span style="font-size:11px; font-weight:800; color:var(--tactical-gold);">${weeklyPct}%</span>
        </div>
        <div class="kpi-bar-bg" style="height:5px;"><div class="kpi-bar-fill" style="width:${weeklyPct}%; background:var(--primary-green);"></div></div>
      </div>

      <!-- Hero Card de la Misión Seleccionada con Imagen de Atleta Real -->
      <div class="mission-hero-card ${!isUnlocked ? 'is-locked-card' : ''}" style="background: linear-gradient(180deg, rgba(10, 12, 10, 0.78) 0%, rgba(10, 12, 10, 0.96) 100%), url('${(state.profile.gender === 'mujer') ? 'assets/fem-elite-woman.jpg' : 'assets/male-goal-athletic.jpg'}') center/cover no-repeat; box-shadow: 0 8px 30px rgba(0,0,0,0.8), inset 0 1px 0 rgba(255,255,255,0.08);">
        <div style="display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:6px; margin-bottom:6px;">
          <div class="mission-phase-badge" style="margin:0;">
            <span>${isUnlocked ? '⚡' : '🔒'}</span> ${isUnlocked ? plan.phaseName : 'MISIÓN BLOQUEADA'}
          </div>
          ${(state.profile.jointProtection || plan.jointProtected) ? `
            <span style="font-size:9.5px; font-weight:800; color:#22c55e; background:rgba(34,197,94,0.15); border:1px solid rgba(34,197,94,0.3); padding:2px 8px; border-radius:4px;">
              🛡️ ARTICULACIÓN SEGURA ACTIVA
            </span>
          ` : ''}
        </div>

        <h2 class="mission-hero-title">${plan.title}</h2>
        <p class="mission-hero-sub">${isUnlocked ? plan.subtitle : `Para desbloquear esta misión, primero debes completar con éxito el Día ${dayNum - 1}.`}</p>

        <div class="mission-meta-strip">
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
            <span>${plan.estTime}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none"><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>
            <span>${plan.calories}</span>
          </div>
          <div class="meta-item">
            <svg viewBox="0 0 24 24" fill="none"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            <span>${plan.rounds} Rondas</span>
          </div>
        </div>

        ${isUnlocked ? `
          <button class="btn-start-mission" onclick="WorkoutPlayer.start(${dayNum})">
            ${isCompleted ? 'REPETIR MISIÓN DEL DÍA' : 'COMENZAR MISIÓN AHORA'} ›
          </button>
        ` : `
          <button class="btn-start-mission locked-btn" onclick="App.alertLocked(${dayNum})">
            🔒 BLOQUEADO • COMPLETA EL DÍA ${dayNum - 1}
          </button>
        `}
      </div>

      <!-- Seletor de Fases Tácticas (Fase 1: 21 Dias, Fase 2: 22-42, Fase 3: 43-60) -->
      <div class="phase-selector-tabs" style="display:flex; gap:6px; margin: 18px 0 10px 0; overflow-x:auto; scrollbar-width:none;">
        <button class="recipe-goal-chip ${selectedPhase === 1 ? 'active' : ''}" onclick="App.selectPhaseTab(1)">
          ⚡ Fase 1: Misión 21 Días
        </button>
        <button class="recipe-goal-chip ${selectedPhase === 2 ? 'active' : ''}" onclick="App.selectPhaseTab(2)">
          ${isPhase2Unlocked ? '🛡️ Fase 2: Consolidación' : '🔒 Fase 2: Consolidación'}
        </button>
        <button class="recipe-goal-chip ${selectedPhase === 3 ? 'active' : ''}" onclick="App.selectPhaseTab(3)">
          ${isPhase3Unlocked ? '⚡ Fase 3: Élite' : '🔒 Fase 3: Élite'}
        </button>
      </div>

      <!-- Calendario de Desbloqueo Táctico -->
      <div class="section-header">
        <div>
          <div class="section-title">
            ${selectedPhase === 1 ? 'Misión Fundamental (Días 1 a 21)' : (selectedPhase === 2 ? 'Consolidación (Días 22 a 42)' : 'Maestría Élite (Días 43 a 60)')}
          </div>
          <div class="section-desc">
            ${selectedPhase === 1 ? 'Desbloqueo progresivo • Completa cada día para avanzar' : (selectedPhase === 2 ? 'Ahora mantienes y evolucionas lo que conquistaste' : 'Fase avanzada de acondicionamiento militar')}
          </div>
        </div>
        <div style="font-size:12px; font-weight:800; color:var(--primary-green);">
          ${state.progress.completedDays.filter(d => d >= startDay && d <= endDay).length}/${endDay - startDay + 1} HECHOS
        </div>
      </div>

      ${(selectedPhase === 2 && !isPhase2Unlocked) ? `
        <div style="background:rgba(0,0,0,0.35); border:1px dashed rgba(234,179,8,0.4); border-radius:10px; padding:16px; text-align:center; margin-bottom:14px;">
          <div style="font-size:20px; margin-bottom:6px;">🔒</div>
          <strong style="color:#fff; font-size:13.5px; display:block;">Fase 2: Consolidación Táctica (Días 22 a 42)</strong>
          <p style="color:#a1a1aa; font-size:12px; max-width:340px; margin:6px auto 0 auto;">
            Esta fase se desbloquea automáticamente al culminar con éxito los 21 días de la misión principal.
          </p>
        </div>
      ` : (selectedPhase === 3 && !isPhase3Unlocked) ? `
        <div style="background:rgba(0,0,0,0.35); border:1px dashed rgba(234,179,8,0.4); border-radius:10px; padding:16px; text-align:center; margin-bottom:14px;">
          <div style="font-size:20px; margin-bottom:6px;">🔒</div>
          <strong style="color:#fff; font-size:13.5px; display:block;">Fase 3: Élite Militar (Días 43 a 60)</strong>
          <p style="color:#a1a1aa; font-size:12px; max-width:340px; margin:6px auto 0 auto;">
            Esta fase avanzada opcional se activa al finalizar la Fase 2 (Día 42).
          </p>
        </div>
      ` : `
        <div class="days-grid">
          ${daysHtml}
        </div>
      `}

      <!-- Ejercicios de la Misión Actual (Preview permitido) -->
      <div class="section-header">
        <div class="section-title">Ejercicios de la Misión (${plan.exercises.length})</div>
        <div class="section-desc">${isUnlocked ? (state.profile.jointProtection ? '🛡️ Protección Activa' : 'Nivel Estándar') : '🔒 Vista Previa'}</div>
      </div>

      <div class="exercise-list">
        ${plan.exercises.map((ex, idx) => `
          <div class="exercise-item-card ${!isUnlocked ? 'dimmed-preview' : ''}">
            <div class="ex-thumb-box">
              <img src="${ex.image || (state.profile.gender === 'mujer' ? 'assets/fem-goal-toned.jpg' : 'assets/male-goal-shredded.jpg')}" alt="${ex.name}" class="ex-thumb-img" loading="lazy">
              <span class="ex-thumb-tag">#${idx + 1}</span>
            </div>
            <div class="ex-info">
              <div class="ex-name">${state.profile.jointProtection && ex.beginnerMod ? ex.beginnerMod.name : ex.name}</div>
              <div class="ex-muscle">${ex.focus}</div>
              ${ex.jointProtected ? '<span class="joint-warning-pill">🛡️ Articulación Protegida</span>' : ''}
            </div>
            <div class="ex-target">${ex.targetReps}</div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // ==========================================
  // 2. VISTA: NUTRICIÓN INTEGRAL (Diario, IA Gemini, Recetas e Hidratación)
  // ==========================================
  function renderNutricion(state) {
    const subTab = state.nutrition.subTab || 'diario';
    const targets = ProtocoloStore.calculateDailyTargets(state.profile);

    return `
      <!-- Subnavegación Táctica de Nutrición -->
      <div class="nutri-subnav-strip">
        <button class="nutri-subnav-btn ${subTab === 'diario' ? 'active' : ''}" onclick="ProtocoloStore.actions.setNutritionSubTab('diario')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
          <span>Diario Nutricional</span>
        </button>
        <button class="nutri-subnav-btn ${subTab === 'recetas' ? 'active' : ''}" onclick="ProtocoloStore.actions.setNutritionSubTab('recetas')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M18 8h1a4 4 0 0 1 0 8h-1"/><path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"/><line x1="6" y1="1" x2="6" y2="4"/><line x1="10" y1="1" x2="10" y2="4"/><line x1="14" y1="1" x2="14" y2="4"/></svg>
          <span>Recetas Militares</span>
        </button>
        <button class="nutri-subnav-btn ${subTab === 'hidratacion' ? 'active' : ''}" onclick="ProtocoloStore.actions.setNutritionSubTab('hidratacion')">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/></svg>
          <span>Hidratación</span>
        </button>
      </div>

      <!-- Inputs Ocultos para Carga de Imagen (Cámara Táctica y Galería) -->
      <input type="file" id="nutriCameraInput" accept="image/*" capture="environment" style="display:none;" onchange="App.handleNutriFileSelect(event)">
      <input type="file" id="nutriGalleryInput" accept="image/*" style="display:none;" onchange="App.handleNutriFileSelect(event)">

      ${subTab === 'diario' ? renderNutricionDiario(state, targets) : ''}
      ${subTab === 'recetas' ? renderNutricionRecetas(state) : ''}
      ${subTab === 'hidratacion' ? renderNutricionHidratacion(state) : ''}

      <!-- Modales de Nutrición: Detalle de Receta, Análisis IA, Registro Manual, Creación de Receta y Oferta VIP -->
      ${renderRecipeModal(state.activeRecipeModalId, state)}
      ${renderFoodAnalysisModal()}
      ${renderManualMealModal(state)}
      ${renderCustomRecipeModal(state)}
      ${renderVipScannerOfferModal(state)}
    `;
  }

  // --- SUBVISTA 1: DIARIO NUTRICIONAL TÁCTICO CON SCANNER TÁCTICO ---
  function renderNutricionDiario(state, targets) {
    const todayStr = new Date().toISOString().split('T')[0];
    const selectedDate = state.nutrition.selectedDate || todayStr;
    const isToday = selectedDate === todayStr;
    const isVip = (window.ProtocoloStore && window.ProtocoloStore.isVip)
      ? window.ProtocoloStore.isVip()
      : Boolean(state.community && state.community.isVipMember);

    // Filtra las comidas del día seleccionado
    const dayMeals = (state.nutrition.meals || []).filter(m => m.date === selectedDate);

    let consumedCals = 0;
    let consumedProt = 0;
    let consumedCarbs = 0;
    let consumedFats = 0;

    dayMeals.forEach(m => {
      consumedCals += m.calories || 0;
      consumedProt += m.protein || 0;
      consumedCarbs += m.carbs || 0;
      consumedFats += m.fats || 0;
    });

    const calPercent = Math.min(100, Math.round((consumedCals / targets.calories) * 100));
    const protPercent = Math.min(100, Math.round((consumedProt / targets.protein) * 100));
    const carbsPercent = Math.min(100, Math.round((consumedCarbs / targets.carbs) * 100));
    const fatsPercent = Math.min(100, Math.round((consumedFats / targets.fats) * 100));

    // Formateo de fecha
    const dateObj = new Date(selectedDate + 'T12:00:00');
    const dateLabel = isToday
      ? 'HOY • ' + dateObj.toLocaleDateString('es-ES', { day: 'numeric', month: 'short' })
      : dateObj.toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric', month: 'short' });

    // Definición de las 4 ranuras de comidas tácticas
    const mealSlots = [
      { id: 'desayuno', title: 'Desayuno', icon: '☀️', subtitle: 'Reactivación metabólica & energía limpia' },
      { id: 'almuerzo', title: 'Almuerzo', icon: '⚡', subtitle: 'Reconstrucción muscular & combustible' },
      { id: 'cena', title: 'Cena', icon: '🌙', subtitle: 'Recuperación nocturna liviana' },
      { id: 'snack', title: 'Snacks & Pre-Entreno', icon: '🍎', subtitle: 'Aporte de nutrientes puntual' }
    ];

    return `
      <!-- Selector Táctico de Fecha -->
      <div class="diary-date-bar">
        <button class="diary-date-nav-btn" onclick="App.changeDiaryDate(-1)" title="Día Anterior">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="15 18 9 12 15 6"/></svg>
        </button>
        <div class="diary-date-current ${isToday ? 'is-today' : ''}" onclick="App.setDiaryToday()">
          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          <span>${dateLabel}</span>
        </div>
        <button class="diary-date-nav-btn" onclick="App.changeDiaryDate(1)" title="Día Siguiente">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="9 18 15 12 9 6"/></svg>
        </button>
      </div>

      <!-- Tarjeta Maestra de Macros & Balance Energético -->
      <div class="diary-macros-dashboard">
        <div class="diary-cals-header">
          <div>
            <span class="macro-dash-label">BALANCE ENERGÉTICO DIARIO</span>
            <div class="macro-dash-cals">
              <strong>${consumedCals}</strong>
              <span class="macro-dash-target">/ ${targets.calories} kcal</span>
            </div>
          </div>
          <div class="macro-dash-ring">
            <span class="ring-num">${calPercent}%</span>
            <span class="ring-sub">de la meta</span>
          </div>
        </div>

        <div class="progress-bar-tactical" style="height:6px; margin: 12px 0 16px 0;">
          <div class="progress-bar-fill" style="width: ${calPercent}%; background: linear-gradient(90deg, #10b981, #d4af37);"></div>
        </div>

        <!-- 3 Pilares de Macronutrientes -->
        <div class="macro-pillars-grid">
          <div class="macro-pillar-item prot">
            <div class="pillar-label">PROTEÍNA</div>
            <div class="pillar-vals"><strong>${Math.round(consumedProt)}g</strong> / ${targets.protein}g</div>
            <div class="pillar-bar"><div class="pillar-bar-fill" style="width:${protPercent}%;"></div></div>
          </div>
          <div class="macro-pillar-item carb">
            <div class="pillar-label">CARBOHIDRATOS</div>
            <div class="pillar-vals"><strong>${Math.round(consumedCarbs)}g</strong> / ${targets.carbs}g</div>
            <div class="pillar-bar"><div class="pillar-bar-fill" style="width:${carbsPercent}%;"></div></div>
          </div>
          <div class="macro-pillar-item fat">
            <div class="pillar-label">GRASAS</div>
            <div class="pillar-vals"><strong>${Math.round(consumedFats)}g</strong> / ${targets.fats}g</div>
            <div class="pillar-bar"><div class="pillar-bar-fill" style="width:${fatsPercent}%;"></div></div>
          </div>
        </div>
      </div>

      <!-- Barra de Acciones Rápidas con Inteligencia Artificial (Scanner Táctico) -->
      <div class="diary-actions-banner">
        <div class="diary-actions-text">
          <div class="gemini-ai-pill">
            <span class="gemini-sparkle">✦</span>
            <span>SCANNER TÁCTICO POR IA</span>
          </div>
          <strong style="color:#fff; font-size:14px; display:block; margin-top:4px;">Reconocimiento de Platos por Foto</strong>
          <span style="font-size:12px; color:#a1a1aa;">Captura tu comida y la IA calculará porciones en gramos, calorías y macros exactos.</span>
        </div>

        <div class="diary-action-btns-row">
          <button class="btn-scan-camera ${!isVip ? 'locked-vip-btn' : ''}" onclick="App.handleScannerAction('camera', 'almuerzo')">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
            <span>FOTO CON CÁMARA ${!isVip ? '🔒 VIP' : ''}</span>
          </button>
          <button class="btn-scan-gallery ${!isVip ? 'locked-vip-btn' : ''}" onclick="App.handleScannerAction('gallery', 'almuerzo')" title="Elegir foto de la galería">
            <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
            <span>GALERÍA ${!isVip ? '🔒 VIP' : ''}</span>
          </button>
        </div>
      </div>

      <!-- Ranuras de Comidas del Día -->
      <div class="diary-slots-container">
        ${mealSlots.map(slot => {
          const slotMeals = dayMeals.filter(m => m.type === slot.id);
          const slotCals = slotMeals.reduce((acc, cur) => acc + (cur.calories || 0), 0);
          const slotProt = slotMeals.reduce((acc, cur) => acc + (cur.protein || 0), 0);

          return `
            <div class="diary-slot-card">
              <div class="diary-slot-header">
                <div class="diary-slot-title-block">
                  <span class="diary-slot-icon">${slot.icon}</span>
                  <div>
                    <h3 class="diary-slot-title">${slot.title}</h3>
                    <span class="diary-slot-sub">${slot.subtitle}</span>
                  </div>
                </div>

                <div class="diary-slot-totals">
                  ${slotMeals.length > 0 ? `
                    <span class="slot-kcal-badge">${slotCals} kcal</span>
                    <span class="slot-prot-badge">${Math.round(slotProt)}g prot</span>
                  ` : `
                    <span class="slot-empty-badge">Sin registrar</span>
                  `}
                </div>
              </div>

              <!-- Listado de Alimentos Registrados en la Ranura -->
              ${slotMeals.length > 0 ? `
                <div class="diary-slot-meals-list">
                  ${slotMeals.map(meal => `
                    <div class="diary-meal-item">
                      ${meal.photoUrl ? `
                        <div class="diary-meal-thumb" onclick="App.viewMealPhoto('${meal.id}')">
                          <img src="${meal.photoUrl}" alt="${meal.title}">
                          ${meal.confidence ? `<span class="thumb-conf-badge">✦ ${Math.round(meal.confidence * 100)}%</span>` : ''}
                        </div>
                      ` : `
                        <div class="diary-meal-thumb placeholder">
                          <span>${slot.icon}</span>
                        </div>
                      `}
                      <div class="diary-meal-info">
                        <div class="meal-title-row">
                          <strong class="meal-title">${meal.title}</strong>
                          <span class="meal-time">${meal.time || ''}</span>
                        </div>
                        <div class="meal-macros-chips">
                          <span class="chip-m cal">${meal.calories} kcal</span>
                          <span class="chip-m prot">🥩 ${meal.protein}g</span>
                          <span class="chip-m carb">🌾 ${meal.carbs}g</span>
                          <span class="chip-m fat">🥑 ${meal.fats}g</span>
                        </div>

                        ${meal.items && meal.items.length > 0 ? `
                          <div class="meal-items-preview">
                            ${meal.items.map(it => `<span>• ${it.name} (${it.grams}g)</span>`).join(' ')}
                          </div>
                        ` : ''}
                      </div>

                      <div class="diary-meal-actions">
                        <button class="btn-meal-delete" onclick="App.deleteDiaryMeal('${meal.id}')" title="Eliminar registro">
                          <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                        </button>
                      </div>
                    </div>
                  `).join('')}
                </div>
              ` : `
                <div class="diary-slot-empty">
                  <span>No has registrado ${slot.title.toLowerCase()} para este día.</span>
                </div>
              `}

              <!-- Botones de Acción de la Ranura -->
              <div class="diary-slot-footer-btns">
                <button class="btn-slot-add-photo ${!isVip ? 'locked-vip-slot' : ''}" onclick="App.handleScannerAction('camera', '${slot.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/><circle cx="12" cy="13" r="4"/></svg>
                  <span>Escanear con IA ${!isVip ? '🔒 VIP' : ''}</span>
                </button>
                <button class="btn-slot-add-manual" onclick="App.openManualMealModal('${slot.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                  <span>Registro Manual</span>
                </button>
              </div>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }

  // --- SUBVISTA 2: BIBLIOTECA TÁCTICA DE RECETAS & RECETAS PRIVADAS ---
  function renderNutricionRecetas(state) {
    const selectedGoal = state.nutrition.selectedGoal || 'todos';
    const searchQuery = state.nutrition.recipeSearchQuery || '';
    const customRecipes = state.nutrition.customRecipes || [];
    const categories = RecipesDB.getCategories();
    const recipes = RecipesDB.getAll(selectedGoal, searchQuery, customRecipes);
    const customCount = customRecipes.length;

    return `
      <div class="section-header">
        <div>
          <div class="section-title">Biblioteca Táctica de Nutrición</div>
          <div class="section-desc">Recetas completas de alto valor biológico + Tus recetas privadas</div>
        </div>
        <div class="mission-phase-badge" style="margin:0;">NUTRICIÓN DE ÉLITE</div>
      </div>

      <!-- Barra de Búsqueda y Botón de Creación de Receta Privada -->
      <div class="recipes-top-toolbar">
        <div class="recipe-search-box">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>
          <input type="text" class="recipe-search-input" placeholder="Buscar por receta o ingrediente (ej. pollo, avena, atún)..." value="${searchQuery}" oninput="App.handleRecipeSearch(this.value)">
          ${searchQuery ? `<button class="btn-clear-search" onclick="App.handleRecipeSearch('')">&times;</button>` : ''}
        </div>

        <button class="btn-create-custom-recipe" onclick="App.openCustomRecipeModal()">
          <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
          <span>CREAR RECETA PRIVADA</span>
        </button>
      </div>

      <!-- Filtro por Categorías y Recetas Privadas -->
      <div class="recipe-goals-strip">
        ${categories.map(cat => {
          const isPriv = cat.id === 'mis_recetas';
          const badge = isPriv ? ` (${customCount})` : '';
          return `
            <button class="recipe-goal-chip ${selectedGoal === cat.id ? 'active' : ''} ${isPriv ? 'is-private-chip' : ''}" onclick="ProtocoloStore.actions.setRecipeGoal('${cat.id}')">
              ${cat.label}${badge}
            </button>
          `;
        }).join('')}
      </div>

      <!-- Grid de Recetas -->
      <div class="recipe-cards-grid">
        ${recipes.length === 0 ? `
          <div class="recipes-empty-state">
            <div class="empty-recipe-icon">${selectedGoal === 'mis_recetas' ? '🔒' : '🥗'}</div>
            <strong style="color:#fff; font-size:16px;">
              ${selectedGoal === 'mis_recetas' ? 'Aún no tienes recetas privadas creadas.' : 'No se encontraron recetas con ese criterio.'}
            </strong>
            <p style="color:#a1a1aa; font-size:13px; max-width:360px; margin: 8px auto 16px auto; line-height:1.4;">
              ${selectedGoal === 'mis_recetas'
                ? 'Crea tus propias recetas y combinaciones de ingredientes. Son 100% privadas y quedan guardadas exclusivamente en tu perfil.'
                : 'Intenta buscar con otra palabra clave o explora todas las categorías del menú.'}
            </p>
            <button class="btn-action-full" style="max-width:240px; margin:0 auto;" onclick="App.openCustomRecipeModal()">
              ➕ Crear mi primera receta
            </button>
          </div>
        ` : recipes.map(r => `
          <div class="recipe-card ${r.isPrivate ? 'is-private-recipe-card' : ''}" onclick="ProtocoloStore.actions.openRecipeModal('${r.id}')">
            <div class="recipe-img-box">
              <img src="${r.img}" alt="${r.title}" loading="lazy">
              <span class="recipe-badge-time">⏱️ ${r.time}</span>
              ${r.isPrivate ? `
                <span class="recipe-badge-private">🔒 PRIVADA</span>
              ` : `
                <span class="recipe-badge-goal">${r.categoryLabel || 'Receta'}</span>
              `}
            </div>
            <div class="recipe-content">
              <div class="recipe-title-row">
                <h3 class="recipe-title" title="${r.title}">${r.title}</h3>
                ${r.isPrivate ? `
                  <div class="recipe-card-private-actions" onclick="event.stopPropagation()">
                    <button class="btn-card-edit" onclick="App.editCustomRecipe('${r.id}', event)" title="Editar">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                    </button>
                    <button class="btn-card-del" onclick="App.deleteCustomRecipe('${r.id}', event)" title="Eliminar">
                      <svg viewBox="0 0 24 24" width="12" height="12" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                    </button>
                  </div>
                ` : ''}
              </div>
              
              <div class="recipe-card-macros-compact">
                <span class="kcal">${r.calories} kcal</span>
                <span class="prot">🥩 ${r.protein}g</span>
              </div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  // --- SUBVISTA 3: HIDRATACIÓN TÁCTICA ---
  function renderNutricionHidratacion(state) {
    const glasses = state.nutrition.waterGlasses || 0;
    const waterTargetMl = Math.round((state.profile.currentWeight || 75) * 35);
    const targetGlasses = Math.max(6, Math.round(waterTargetMl / 250));

    let glassesHtml = '';
    for (let i = 1; i <= targetGlasses; i++) {
      const filled = i <= glasses;
      glassesHtml += `
        <div class="glass-pill ${filled ? 'filled' : ''}" onclick="ProtocoloStore.actions.addWaterGlass()">
          ${filled ? '💧' : '🥛'}
        </div>
      `;
    }

    return `
      <div class="card-tactical highlight" style="margin-top:10px;">
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong style="font-size:16px; color:#fff;">Hidratación Celular Militar</strong>
            <div style="font-size:12px; color:#a1a1aa; margin-top:2px;">
              Meta calculada: <strong>${waterTargetMl} ml</strong> (${targetGlasses} vasos de 250ml)
            </div>
          </div>
          <div style="font-size:18px; font-weight:800; color:#38bdf8;">${glasses} / ${targetGlasses}</div>
        </div>

        <div class="water-tracker-box">
          <div class="water-glasses">
            ${glassesHtml}
          </div>
          <button class="btn-icon-header" onclick="ProtocoloStore.actions.resetWater()" title="Reiniciar">↺</button>
        </div>
        <div style="font-size:11px; color:#71717a; margin-top:8px;">
          Toca cada vaso conforme bebas agua (+10 XP). Una hidratación deficiente reduce la fuerza calisténica hasta un 18%.
        </div>
      </div>
    `;
  }

  // --- MODAL INTERACTIVO: ANÁLISIS NUTRICIONAL CON GOOGLE GEMINI 2.0 FLASH ---
  function renderFoodAnalysisModal() {
    const analysis = window.GeminiNutrition ? window.GeminiNutrition.getCurrentAnalysis() : null;
    if (!analysis) return '';

    return `
      <div class="recipe-modal-backdrop" onclick="App.closeAnalysisModal(event)">
        <div class="recipe-modal-card analysis-card">
          <button class="recipe-modal-close" onclick="App.dismissAnalysis()">&times;</button>

          <!-- Cabecera del Análisis -->
          <div class="analysis-header-strip">
            <div class="gemini-live-badge">
              <span class="gemini-sparkle">✦</span>
              <span>SCANNER TÁCTICO • ANÁLISIS POR IA</span>
            </div>
            <h2 class="analysis-modal-title">${analysis.mealName}</h2>
            <div class="analysis-conf-row">
              <span class="conf-badge">Confianza Visual: ${Math.round((analysis.confidenceScore || 0.9) * 100)}%</span>
              <span class="conf-note">• Validación contra Base TACO/USDA</span>
            </div>
          </div>

          <div class="analysis-modal-body">
            <!-- Thumbnail y Selector de Tipo de Comida -->
            <div class="analysis-photo-row">
              <div class="analysis-photo-frame">
                <img src="${analysis.photoDataUrl}" alt="Plato de comida">
              </div>
              <div class="analysis-type-select-box">
                <label style="font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase;">Tipo de Comida</label>
                <select id="analysisMealTypeSelect" class="composer-select" onchange="App.setAnalysisMealType(this.value)">
                  <option value="desayuno" ${analysis.mealType === 'desayuno' ? 'selected' : ''}>☀️ Desayuno</option>
                  <option value="almuerzo" ${analysis.mealType === 'almuerzo' ? 'selected' : ''}>⚡ Almuerzo</option>
                  <option value="cena" ${analysis.mealType === 'cena' ? 'selected' : ''}>🌙 Cena</option>
                  <option value="snack" ${analysis.mealType === 'snack' ? 'selected' : ''}>🍎 Snack / Pre-Entreno</option>
                </select>

                <div class="analysis-totals-quick">
                  <div><span class="q-label">Total:</span> <strong>${analysis.totalCalories} kcal</strong></div>
                  <div><span class="q-label">Proteína:</span> <strong style="color:#d4af37;">${analysis.totalProtein}g</strong></div>
                </div>
              </div>
            </div>

            <!-- Resumen de Macros Totales -->
            <div class="analysis-macros-summary-bar">
              <div class="sum-macro-cell"><span class="sm-num">${analysis.totalCalories}</span> <span class="sm-lbl">Kcal</span></div>
              <div class="sum-macro-cell prot"><span class="sm-num">${analysis.totalProtein}g</span> <span class="sm-lbl">Proteína</span></div>
              <div class="sum-macro-cell carb"><span class="sm-num">${analysis.totalCarbs}g</span> <span class="sm-lbl">Carbohidratos</span></div>
              <div class="sum-macro-cell fat"><span class="sm-num">${analysis.totalFats}g</span> <span class="sm-lbl">Grasas</span></div>
            </div>

            <!-- Lista de Alimentos Reconocidos y Editables -->
            <div class="analysis-items-section">
              <div class="analysis-section-subhead">
                <span>ALIMENTOS IDENTIFICADOS EN EL PLATO (EDITABLE)</span>
                <span style="font-size:11px; color:#71717a;">Ajusta los gramos si es necesario</span>
              </div>

              <div class="analysis-items-list">
                ${analysis.items.map((item, idx) => `
                  <div class="analysis-item-row">
                    <div class="item-name-block">
                      <strong class="item-food-name">${item.name}</strong>
                      <div class="item-micro-macros">
                        <span>${item.calories} kcal</span> • 
                        <span style="color:#d4af37;">${item.protein}g P</span> • 
                        <span style="color:#38bdf8;">${item.carbs}g C</span> • 
                        <span style="color:#f59e0b;">${item.fats}g G</span>
                      </div>
                    </div>

                    <div class="item-grams-stepper">
                      <button class="step-btn" onclick="App.stepItemGrams(${idx}, -10)">-</button>
                      <input type="number" class="step-input" value="${item.grams}" min="5" max="1000" step="5" onchange="App.handleItemGramsChange(${idx}, this.value)">
                      <span class="step-unit">g</span>
                      <button class="step-btn" onclick="App.stepItemGrams(${idx}, 10)">+</button>
                      <button class="btn-item-remove" onclick="App.removeAnalysisItem(${idx})" title="Eliminar alimento">&times;</button>
                    </div>
                  </div>
                `).join('')}
              </div>

              <!-- Botón para Agregar Otro Alimento -->
              <button class="btn-add-food-item" onclick="App.openAddFoodPicker()">
                <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
                <span>AGREGAR OTRO ALIMENTO AL PLATO</span>
              </button>
            </div>

            <!-- Diagnóstico del Scanner Táctico -->
            ${analysis.tacticalFeedback ? `
              <div class="analysis-tactical-note">
                <span class="note-icon">🛡️</span>
                <div class="note-text">
                  <strong>Evaluación Táctica:</strong> ${analysis.tacticalFeedback}
                </div>
              </div>
            ` : ''}

            <!-- Botones de Confirmación Final -->
            <div class="analysis-footer-actions">
              <button class="btn-confirm-save-meal" onclick="App.confirmAnalysisAndSave()">
                <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>
                <span>CONFIRMAR Y GUARDAR EN EL DIARIO (+40 XP)</span>
              </button>
              <button class="btn-cancel-analysis" onclick="App.dismissAnalysis()">
                Descartar Análisis
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- MODAL DE OFERTA EXCLUSIVA: SCANNER TÁCTICO VIP ---
  function renderVipScannerOfferModal(state) {
    if (!state.activeVipScannerModal) return '';
    const cfg = (window.PROTOCOLO_CONFIG && window.PROTOCOLO_CONFIG.pricing) || {
      amount: '4.90',
      currencySymbol: '$',
      currencyCode: 'USD',
      periodText: 'mes',
      formattedPrice: '$4.90',
      formattedMonthly: '$4.90 USD / mes',
      formattedMonthlyShort: '$4.90/mes',
      approxDaily: '$0.16 USD / día'
    };

    return `
      <div class="recipe-modal-backdrop" onclick="App.closeVipScannerOfferModal(event)">
        <div class="recipe-modal-card vip-scanner-offer-card" onclick="event.stopPropagation()">
          <button class="recipe-modal-close" onclick="App.closeVipScannerOfferModal()">&times;</button>

          <div class="vip-scanner-modal-header">
            <span class="vip-exclusive-pill">🔒 EXCLUSIVO MIEMBROS VIP</span>
            <h2 class="vip-scanner-modal-title">Scanner Táctico de Alimentos</h2>
            <p class="vip-scanner-modal-sub">
              Captura una foto de tu plato con la cámara o selecciona una imagen de tu galería. El Scanner Táctico segmenta los ingredientes, calcula el peso estimado en gramos y computa tus calorías y macronutrientes en segundos.
            </p>
          </div>

          <div class="vip-features-grid">
            <div class="vip-feature-item">
              <div class="vip-feat-icon">📸</div>
              <div class="vip-feat-text">
                <strong>Reconocimiento por Foto Instantáneo</strong>
                <span>Cámara o galería: detecta pollo, arroz, pastas, vegetales y combinaciones al instante.</span>
              </div>
            </div>
            <div class="vip-feature-item">
              <div class="vip-feat-icon">⚖️</div>
              <div class="vip-feat-text">
                <strong>Estimación en Gramos & Macros TACO/USDA</strong>
                <span>Validación rigurosa de proteína, carbohidratos y grasas por porción militar.</span>
              </div>
            </div>
            <div class="vip-feature-item">
              <div class="vip-feat-icon">⚡</div>
              <div class="vip-feat-text">
                <strong>Registro en 1 Clic en tu Diario</strong>
                <span>Tus objetivos nutricionales diarios se actualizan en tiempo real sin tipeo manual.</span>
              </div>
            </div>
          </div>

          <div class="vip-price-box">
            <div class="vip-price-badge">PROPUESTA DE LANZAMIENTO EXCLUSIVA</div>
            <div class="vip-price-main">${cfg.formattedMonthly}</div>
            <div class="vip-price-sub">Aproximadamente solo ${cfg.approxDaily} • Cancela cuando quieras</div>

            <button class="btn-unlock-vip-scanner" onclick="App.handleCommunityCheckout()">
              DESBLOQUEAR SCANNER TÁCTICO (${cfg.formattedMonthlyShort})
            </button>
            <div class="vip-guarantee-note">🔒 Acceso Inmediato • Compra 100% Segura</div>
          </div>

          <div class="vip-free-fallback-note">
            <button class="btn-continue-manual-free" onclick="App.closeVipScannerOfferModal()">
              Continuar con Registro Manual Gratuito
            </button>
          </div>
        </div>
      </div>
    `;
  }

  // --- MODAL DE REGISTRO MANUAL DE ALIMENTO ---
  function renderManualMealModal(state) {
    if (!state.activeManualMealModal) return '';
    const mealType = state.activeManualMealModal.mealType || 'almuerzo';
    const query = state.activeManualMealModal.query || '';
    const foods = window.NutriDB ? window.NutriDB.searchFoods(query) : [];

    return `
      <div class="recipe-modal-backdrop" onclick="App.closeManualMealModal(event)">
        <div class="recipe-modal-card" style="max-height:85vh; overflow-y:auto;">
          <button class="recipe-modal-close" onclick="App.closeManualMealModal()">&times;</button>

          <div style="margin-bottom:16px;">
            <span class="gemini-ai-pill">REGISTRO MANUAL</span>
            <h2 style="font-size:18px; font-weight:800; color:#fff; margin-top:6px;">Agregar Alimento</h2>
            <p style="font-size:12px; color:#a1a1aa;">Busca en la tabla nutricional de referencia TACO & USDA</p>
          </div>

          <!-- Buscador de Alimentos -->
          <div style="margin-bottom:14px;">
            <input type="text" id="manualFoodSearchInput" class="comment-input" placeholder="Escribe el nombre del alimento (ej. Pollo, Arroz, Avena, Huevo)..." value="${query}" oninput="App.handleManualFoodSearch(this.value)" style="width:100%; box-sizing:border-box;">
          </div>

          <!-- Lista de Alimentos Encontrados -->
          <div class="manual-food-results-list">
            ${foods.map(f => `
              <div class="manual-food-item" onclick="App.selectManualFood('${f.id}')">
                <div>
                  <strong style="font-size:13px; color:#fff; display:block;">${f.name}</strong>
                  <span style="font-size:11px; color:#a1a1aa;">Por 100g: ${f.calories} kcal • P: ${f.protein}g • C: ${f.carbs}g • G: ${f.fats}g</span>
                </div>
                <button class="btn-select-food-add">Seleccionar</button>
              </div>
            `).join('')}
          </div>
        </div>
      </div>
    `;
  }

  function renderRecipeModal(recipeId, state) {
    if (!recipeId) return '';
    const customList = (state && state.nutrition && state.nutrition.customRecipes) || [];
    const r = RecipesDB.getById(recipeId, customList);
    if (!r) return '';

    return `
      <div class="recipe-modal-backdrop" onclick="App.closeRecipeModal(event)">
        <div class="recipe-modal-card">
          <button class="recipe-modal-close" onclick="ProtocoloStore.actions.closeRecipeModal()">&times;</button>
          
          <div class="recipe-modal-cover">
            <img src="${r.img}" alt="${r.title}">
            <div class="recipe-modal-cover-overlay">
              ${r.isPrivate ? `
                <span class="recipe-badge-private">🔒 RECETA PRIVADA DEL RECLUTA</span>
              ` : `
                <span class="recipe-badge-goal">${r.categoryLabel || r.goalLabel || 'Receta'}</span>
              `}
              <h2 style="font-size:20px; font-weight:900; color:#fff; line-height:1.2; margin-top:6px;">${r.title}</h2>
            </div>
          </div>

          <div class="recipe-modal-body">
            <!-- Acciones de Receta Privada (si aplica) -->
            ${r.isPrivate ? `
              <div class="recipe-private-modal-actions">
                <button class="btn-rec-action edit" onclick="App.editCustomRecipe('${r.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                  <span>Editar mi receta</span>
                </button>
                <button class="btn-rec-action del" onclick="App.deleteCustomRecipe('${r.id}')">
                  <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  <span>Eliminar</span>
                </button>
              </div>
            ` : ''}

            <!-- Macros Detallados -->
            <div class="recipe-detail-macros">
              <div class="macro-box">
                <span class="m-val text-green">${r.calories}</span>
                <span class="m-lbl">Calorías</span>
              </div>
              <div class="macro-box">
                <span class="m-val" style="color:#d4af37;">${r.protein}g</span>
                <span class="m-lbl">Proteína</span>
              </div>
              <div class="macro-box">
                <span class="m-val" style="color:#38bdf8;">${r.carbs}g</span>
                <span class="m-lbl">Carbohidratos</span>
              </div>
              <div class="macro-box">
                <span class="m-val" style="color:#f59e0b;">${r.fats}g</span>
                <span class="m-lbl">Grasas</span>
              </div>
            </div>

            <div style="display:flex; gap:16px; font-size:12px; color:#a1a1aa; margin-bottom:18px;">
              <span>⏱️ Tiempo: <strong>${r.time}</strong></span>
              <span>🍽️ Rinde: <strong>${r.servings}</strong></span>
            </div>

            <!-- Ingredientes con cantidades exactas -->
            <h4 style="font-size:15px; font-weight:800; color:#fff; margin-bottom:10px;">📋 Ingredientes Requeridos:</h4>
            <div class="recipe-ing-list">
              ${(r.ingredients || []).map(ing => `
                <div class="recipe-ing-item">
                  <span class="bullet">✓</span>
                  <span>${ing}</span>
                </div>
              `).join('')}
            </div>

            <!-- Preparación Paso a Paso -->
            <h4 style="font-size:15px; font-weight:800; color:#fff; margin:18px 0 10px;">👨‍🍳 Preparación Paso a Paso:</h4>
            <div class="recipe-steps-list">
              ${(r.steps || []).map((st, i) => `
                <div class="recipe-step-item">
                  <span class="step-badge">${i + 1}</span>
                  <p>${st}</p>
                </div>
              `).join('')}
            </div>
          </div>
        </div>
      </div>
    `;
  }

  // --- MODAL PARA CREAR Y EDITAR RECETAS PRIVADAS DEL USUARIO ---
  function renderCustomRecipeModal(state) {
    if (!state.activeCustomRecipeModal) return '';
    const modal = state.activeCustomRecipeModal;
    const isEdit = modal.isEditing && modal.recipe;
    const rec = modal.recipe || {};

    const categories = [
      { id: 'desayuno', label: '☀️ Desayuno' },
      { id: 'almuerzo', label: '⚡ Almuerzo' },
      { id: 'cena', label: '🌙 Cena' },
      { id: 'pre_post', label: '🔥 Pre/Post Entreno' },
      { id: 'altas_proteinas', label: '🥩 Altas Proteínas' },
      { id: 'bajas_calorias', label: '🥗 Bajas Calorías' },
      { id: 'rapidas', label: '⏱️ Rápida (<15 min)' },
      { id: 'postres', label: '🥑 Postres & Snacks' }
    ];

    const currentCat = rec.category || 'almuerzo';
    const ingText = Array.isArray(rec.ingredients) ? rec.ingredients.join('\n') : (rec.ingredients || '');
    const stepsText = Array.isArray(rec.steps) ? rec.steps.join('\n') : (rec.steps || '');

    return `
      <div class="recipe-modal-backdrop" onclick="App.closeCustomRecipeModal(event)">
        <div class="recipe-modal-card custom-recipe-modal-card">
          <button class="recipe-modal-close" onclick="App.closeCustomRecipeModal()">&times;</button>

          <div class="custom-recipe-modal-header">
            <span class="gemini-ai-pill">🔒 RECETA PRIVADA</span>
            <h2 style="font-size:18px; font-weight:800; color:#fff; margin: 6px 0 2px 0;">
              ${isEdit ? 'Editar Receta Privada' : 'Crear Nueva Receta Privada'}
            </h2>
            <p style="font-size:12px; color:#a1a1aa; margin:0;">
              Esta receta es exclusiva para ti. Quedará guardada bajo tu perfil y nadie más podrá verla.
            </p>
          </div>

          <form onsubmit="App.saveCustomRecipeForm(event)" class="custom-recipe-form">
            <div class="form-group-tactical">
              <label>Nombre de la Receta *</label>
              <input type="text" id="crTitle" class="comment-input" required placeholder="Ej: Pollo Crujiente con Batata y Romero" value="${rec.title || ''}">
            </div>

            <div class="form-row-tactical">
              <div class="form-group-tactical flex-1">
                <label>Categoría *</label>
                <select id="crCategory" class="composer-select" style="width:100%;">
                  ${categories.map(c => `
                    <option value="${c.id}" ${currentCat === c.id ? 'selected' : ''}>${c.label}</option>
                  `).join('')}
                </select>
              </div>

              <div class="form-group-tactical flex-1">
                <label>Tiempo de Preparación</label>
                <input type="text" id="crTime" class="comment-input" style="width:100%;" placeholder="Ej: 15 min" value="${rec.time || '15 min'}">
              </div>

              <div class="form-group-tactical flex-1">
                <label>Porciones</label>
                <input type="text" id="crServings" class="comment-input" style="width:100%;" placeholder="Ej: 1 porción" value="${rec.servings || '1 porción'}">
              </div>
            </div>

            <!-- Macros Nutricionales de la Receta -->
            <div class="form-group-tactical">
              <div class="macros-header-row">
                <label style="margin:0;">Macronutrientes por Porción *</label>
                <button type="button" class="btn-auto-calc-macros" onclick="App.autoCalcMacrosFromIngredients()" title="Estimar macros automáticamente desde los ingredientes">
                  ✦ Auto-calcular
                </button>
              </div>

              <div class="macros-inputs-grid">
                <div class="macro-inp-box">
                  <span class="m-lbl">Calorías</span>
                  <input type="number" id="crCalories" class="comment-input text-center" required min="10" max="3000" placeholder="kcal" value="${rec.calories || ''}">
                </div>
                <div class="macro-inp-box">
                  <span class="m-lbl">Proteína (g)</span>
                  <input type="number" id="crProtein" class="comment-input text-center" step="0.1" required min="0" max="300" placeholder="g" value="${rec.protein || ''}">
                </div>
                <div class="macro-inp-box">
                  <span class="m-lbl">Carbohidratos (g)</span>
                  <input type="number" id="crCarbs" class="comment-input text-center" step="0.1" required min="0" max="500" placeholder="g" value="${rec.carbs || ''}">
                </div>
                <div class="macro-inp-box">
                  <span class="m-lbl">Grasas (g)</span>
                  <input type="number" id="crFats" class="comment-input text-center" step="0.1" required min="0" max="300" placeholder="g" value="${rec.fats || ''}">
                </div>
              </div>
            </div>

            <div class="form-group-tactical">
              <label>Descripción Breve</label>
              <input type="text" id="crDesc" class="comment-input" placeholder="Ej: Almuerzo rápido con alta proteína y carbohidratos limpios." value="${rec.desc || ''}">
            </div>

            <div class="form-group-tactical">
              <label>Ingredientes y Cantidades (uno por línea) *</label>
              <textarea id="crIngredients" class="composer-textarea" rows="4" required placeholder="180g pechuga de pollo cortada en cubos&#10;1 taza de arroz blanco cocido (140g)&#10;1 taza de brócoli al vapor&#10;1 cdta de aceite de oliva">${ingText}</textarea>
            </div>

            <div class="form-group-tactical">
              <label>Modo de Preparación Paso a Paso (uno por línea) *</label>
              <textarea id="crSteps" class="composer-textarea" rows="4" required placeholder="1. Sazona el pollo con ajo y sal marina.&#10;2. Cocina en la sartén a fuego medio-alto por 6 minutos.&#10;3. Cocina el brócoli al vapor por 4 minutos.&#10;4. Sirve todo junto con el arroz caliente.">${stepsText}</textarea>
            </div>

            <div class="form-group-tactical">
              <label>URL de Imagen Ilustrativa (Opcional)</label>
              <input type="url" id="crImg" class="comment-input" placeholder="https://..." value="${rec.img || ''}">
            </div>

            <div class="custom-recipe-privacy-alert">
              <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="#d4af37" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span><strong>Privacidad Militar:</strong> Esta receta no será pública ni visible en la comunidad. Está guardada en tu perfil privado.</span>
            </div>

            <div class="form-actions-row">
              <button type="submit" class="btn-confirm-save-meal">
                ✓ ${isEdit ? 'GUARDAR CAMBIOS' : 'CREAR RECETA PRIVADA'}
              </button>
              <button type="button" class="btn-cancel-analysis" onclick="App.closeCustomRecipeModal()">
                Cancelar
              </button>
            </div>
          </form>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 3. VISTA: BLINDAJE (Movilidad y Articulaciones)
  // ==========================================
  function renderBlindaje(state) {
    const routinePre = {
      title: 'Calentamiento y Lubricación Pre-Misión',
      calories: '~50 kcal',
      exercises: [
        ExercisesDB.library.mobility_lumbar_flow,
        ExercisesDB.library.hip_opener_ninety,
        ExercisesDB.library.squats_tempo
      ]
    };

    const routineLumbar = {
      title: 'Descompresión Táctica de Espalda Baja',
      calories: '~45 kcal',
      exercises: [
        ExercisesDB.library.mobility_lumbar_flow,
        ExercisesDB.library.glute_bridge_hold,
        ExercisesDB.library.hollow_body_hold
      ]
    };

    const routineRodillas = {
      title: 'Blindaje de Rodilla y Tendón Rotuliano',
      calories: '~55 kcal',
      exercises: [
        ExercisesDB.library.squats_tempo,
        ExercisesDB.library.hip_opener_ninety,
        ExercisesDB.library.glute_bridge_hold
      ]
    };

    return `
      <div class="section-header">
        <div>
          <div class="section-title">Centro de Blindaje y Longevidad</div>
          <div class="section-desc">Protege tus ligamentos, elimina dolores y asegura tu llegada al Día 21</div>
        </div>
        <div class="mission-phase-badge" style="margin:0;">SALUD TÁCTICA</div>
      </div>

      <!-- Guía Explicativa: Para qué sirve y cuándo hacerlo -->
      <div class="card-tactical highlight">
        <h3 style="font-size:15px; font-weight:800; color:#fff; margin-bottom:8px;">
          🛡️ ¿Cómo funciona el Módulo de Blindaje?
        </h3>
        <div style="font-size:13px; color:#d1d5db; line-height:1.5;">
          <p style="margin-bottom:6px;"><strong>• ¿Para qué sirve?</strong> La calistenia militar exige tendones y articulaciones fuertes. Este módulo lubrica el líquido sinovial, previene lesiones por sobreuso y alivia contracturas.</p>
          <p><strong>• ¿Cuándo realizarlo?</strong> Tienes 3 opciones: <em>antes de entrenar</em> (pre-calentamiento), <em>al terminar</em> (descompresión), o en los <em>días de descanso 4, 11 y 18</em>.</p>
        </div>
      </div>

      <!-- Interruptor de Modo Bajo Impacto con Selección de Zonas -->
      <div class="card-tactical" style="margin-bottom:20px;">
        <div style="display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;">
          <div>
            <strong style="font-size:14px; color:#fff; display:block;">🛡️ Modo Articulación Segura</strong>
            <div style="font-size:11.5px; color:#a1a1aa;">Adapta todos los ejercicios a bajo impacto, descansos +15s y calentamiento articular</div>
          </div>
          <button class="player-mod-toggle ${state.profile.jointProtection ? 'active' : ''}" style="margin:0;" onclick="App.toggleJointProtection()">
            ${state.profile.jointProtection ? 'ACTIVADO' : 'DESACTIVADO'}
          </button>
        </div>

        ${state.profile.jointProtection ? `
          <div class="joint-regions-picker" style="border-top:1px solid rgba(255,255,255,0.08); padding-top:10px; margin-top:6px;">
            <span style="font-size:10px; font-weight:700; color:#a1a1aa; text-transform:uppercase; display:block; margin-bottom:6px;">
              Zonas Protegidas Específicas:
            </span>
            <div style="display:flex; gap:6px; flex-wrap:wrap;">
              <button class="joint-region-chip ${(state.profile.jointRegions && state.profile.jointRegions.rodillas) ? 'active' : ''}" onclick="App.toggleJointRegion('rodillas')">
                🦵 Rodillas ${(state.profile.jointRegions && state.profile.jointRegions.rodillas) ? '✓' : ''}
              </button>
              <button class="joint-region-chip ${(state.profile.jointRegions && state.profile.jointRegions.munecas) ? 'active' : ''}" onclick="App.toggleJointRegion('munecas')">
                🖐️ Muñecas ${(state.profile.jointRegions && state.profile.jointRegions.munecas) ? '✓' : ''}
              </button>
              <button class="joint-region-chip ${(state.profile.jointRegions && state.profile.jointRegions.hombros) ? 'active' : ''}" onclick="App.toggleJointRegion('hombros')">
                💪 Hombros ${(state.profile.jointRegions && state.profile.jointRegions.hombros) ? '✓' : ''}
              </button>
            </div>
          </div>
        ` : ''}
      </div>

      <div class="section-title" style="margin-bottom:12px;">Rutinas Guiadas de Blindaje (Con Temporizador):</div>

      <!-- Rutina 1: Pre-Misión -->
      <div class="blindaje-card">
        <div class="blindaje-header">
          <div class="blindaje-ico-box">🔥</div>
          <div>
            <h4 class="blindaje-title">1. Calentamiento Pre-Misión</h4>
            <div class="blindaje-sub">Cuándo: 5 minutos antes de iniciar tu sesión diaria</div>
          </div>
          <span class="blindaje-time">5 MIN</span>
        </div>
        <p class="blindaje-desc">Lubricación articular de muñecas, hombros y apertura de cadera. Eleva la temperatura interna y prepara el sistema neuromuscular.</p>
        <button class="btn-start-mission" style="font-size:13px; padding:12px;" onclick='WorkoutPlayer.startBlindaje(${JSON.stringify(routinePre)})'>
          INICIAR CALENTAMIENTO GUIADO ›
        </button>
      </div>

      <!-- Rutina 2: Descompresión Lumbar -->
      <div class="blindaje-card">
        <div class="blindaje-header">
          <div class="blindaje-ico-box">🧘</div>
          <div>
            <h4 class="blindaje-title">2. Descompresión Lumbar y Ciática</h4>
            <div class="blindaje-sub">Cuándo: Después de entrenar o si pasas mucho tiempo sentado</div>
          </div>
          <span class="blindaje-time">6 MIN</span>
        </div>
        <p class="blindaje-desc">Secuencia de descompresión para vértebras lumbares, liberación del psoas y puente pélvico estabilizador.</p>
        <button class="btn-start-mission" style="font-size:13px; padding:12px;" onclick='WorkoutPlayer.startBlindaje(${JSON.stringify(routineLumbar)})'>
          INICIAR DESCOMPRESIÓN GUIADA ›
        </button>
      </div>

      <!-- Rutina 3: Blindaje de Rodilla -->
      <div class="blindaje-card">
        <div class="blindaje-header">
          <div class="blindaje-ico-box">🦵</div>
          <div>
            <h4 class="blindaje-title">3. Blindaje de Rodillas y Ligamentos</h4>
            <div class="blindaje-sub">Cuándo: Días de descanso o antes de hacer sentadillas</div>
          </div>
          <span class="blindaje-time">5 MIN</span>
        </div>
        <p class="blindaje-desc">Fortalecimiento del vasto interno mediante isometría controlada y movilidad de tobillos para reducir el estrés en la rótula.</p>
        <button class="btn-start-mission" style="font-size:13px; padding:12px;" onclick='WorkoutPlayer.startBlindaje(${JSON.stringify(routineRodillas)})'>
          INICIAR BLINDAJE DE RODILLAS ›
        </button>
      </div>
    `;
  }

  // ==========================================
  // 4. VISTA: EVOLUCIÓN (Panel Moderno & Métricas)
  // ==========================================
  function renderEvolucion(state) {
    const rankInfo = ProtocoloStore.getRank(state.progress.points);
    const weightLogs = state.weightLog || [];
    const latestWeight = weightLogs.length ? weightLogs[weightLogs.length - 1].weight : state.profile.startWeight;
    const startWeight = state.profile.startWeight;
    const targetWeight = state.profile.targetWeight;
    
    // Cálculo de progreso de peso
    const totalToLose = (startWeight - targetWeight);
    const currentLost = (startWeight - latestWeight);
    let weightPct = 0;
    if (Math.abs(totalToLose) > 0) {
      weightPct = Math.max(0, Math.min(100, Math.round((currentLost / totalToLose) * 100)));
    }

    const completedCount = state.progress.completedDays.length;
    const daysPct = Math.round((completedCount / 21) * 100);

    const photos = state.evolutionPhotos || {};

    return `
      <div class="section-header">
        <div>
          <div class="section-title">Centro de Control de Evolución</div>
          <div class="section-desc">Métricas reales, transformación física e historial de progreso</div>
        </div>
        <button class="btn-icon-header" onclick="App.openSettings()" title="Ajustes">⚙️</button>
      </div>

      <!-- Card de Rango / Patente Militar -->
      <div class="card-tactical highlight">
        <div style="display:flex; align-items:center; gap:14px; margin-bottom:12px;">
          <div style="font-size:42px;">${rankInfo.current.icon}</div>
          <div>
            <div class="user-rank-name" style="font-size:14px;">${rankInfo.current.name}</div>
            <div style="font-size:12px; color:#a1a1aa;">Patente Militar Nivel ${rankInfo.current.id} de 5</div>
          </div>
          <div style="margin-left:auto; text-align:right;">
            <div style="font-size:22px; font-weight:900; color:var(--tactical-gold);">${state.progress.points}</div>
            <div style="font-size:10px; color:#71717a;">PUNTOS TÁCTICOS</div>
          </div>
        </div>

        ${rankInfo.next ? `
          <div style="display:flex; justify-content:space-between; font-size:11px; color:#a1a1aa; margin-bottom:4px;">
            <span>Próximo Rango: <strong>${rankInfo.next.name}</strong></span>
            <span>Faltan ${rankInfo.pointsToNext} pts</span>
          </div>
          <div class="player-progress-bar" style="margin-bottom:0;">
            <div class="player-progress-fill" style="width:${rankInfo.progressPct}%;"></div>
          </div>
        ` : `
          <div style="font-size:12px; color:var(--primary-green); font-weight:700;">¡Has alcanzado el Máximo Rango de Élite Militar!</div>
        `}
      </div>

      <!-- Panel de Métricas de Peso -->
      <div class="card-tactical">
        <div style="display:flex; justify-content:space-between; align-items:flex-start; margin-bottom:16px;">
          <div>
            <h3 style="font-size:15px; font-weight:800; color:#fff;">Evolución de Peso Corporal</h3>
            <div style="font-size:12px; color:#a1a1aa;">Meta Establecida: ${targetWeight} kg</div>
          </div>
          <div style="text-align:right;">
            <div style="font-size:24px; font-weight:900; color:#fff;">${latestWeight} <span style="font-size:14px; font-weight:400; color:#a1a1aa;">kg</span></div>
            <div style="font-size:11px; color:var(--primary-green); font-weight:700;">
              ${(startWeight - latestWeight).toFixed(1)} kg cambiados
            </div>
          </div>
        </div>

        <!-- Gráfico SVG Dinâmico de Peso -->
        <div class="weight-chart-container">
          ${renderWeightChart(weightLogs, startWeight, targetWeight)}
        </div>

        <!-- Input para Registrar Novo Peso -->
        <div style="display:flex; gap:8px; margin-top:14px;">
          <input type="number" id="inputNewWeight" placeholder="Peso de hoy (ej: ${latestWeight})" step="0.1" style="flex:1; background:#000; border:1px solid var(--border-subtle); border-radius:var(--radius-sm); padding:10px 14px; color:#fff; font-size:14px;">
          <button class="btn-start-mission" style="font-size:13px; padding:10px 18px; width:auto;" onclick="App.saveWeight()">
            REGISTRAR
          </button>
        </div>
      </div>

      <!-- Progreso de los 21 Días y Racha -->
      <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:14px;">
        <div class="card-tactical" style="margin:0; text-align:center;">
          <div style="font-size:26px; font-weight:900; color:var(--primary-green);">${completedCount} / 21</div>
          <div style="font-size:11px; color:#a1a1aa; text-transform:uppercase; font-weight:700; margin-top:2px;">Misiones Hechas (${daysPct}%)</div>
        </div>
        <div class="card-tactical" style="margin:0; text-align:center;">
          <div style="font-size:26px; font-weight:900; color:#f97316;">🔥 ${state.progress.streak}</div>
          <div style="font-size:11px; color:#a1a1aa; text-transform:uppercase; font-weight:700; margin-top:2px;">Días Consecutivos</div>
        </div>
      </div>

      <!-- Fotos de Antes y Después (Registro Visual) -->
      <div class="card-tactical">
        <h3 style="font-size:15px; font-weight:800; color:#fff; margin-bottom:6px;">📸 Comparativa de Transformación Visual</h3>
        <p style="font-size:12px; color:#a1a1aa; margin-bottom:14px;">Guarda tus fotos de progreso de forma 100% privada en tu dispositivo.</p>
        
        <div class="photo-compare-grid">
          <!-- Foto Día 1 -->
          <div class="photo-box" onclick="document.getElementById('inputPhotoDay1').click()">
            ${photos.day1 ? `
              <img src="${photos.day1}" alt="Día 1" class="photo-preview">
            ` : `
              <div class="photo-placeholder">
                <span style="font-size:28px;">📷</span>
                <span>Subir Foto Día 1</span>
              </div>
            `}
            <span class="photo-badge">DÍA 1 (INICIO)</span>
            <input type="file" id="inputPhotoDay1" accept="image/*" style="display:none;" onchange="App.handlePhotoUpload(event, 'day1')">
          </div>

          <!-- Foto Actual -->
          <div class="photo-box" onclick="document.getElementById('inputPhotoCurrent').click()">
            ${photos.dayCurrent ? `
              <img src="${photos.dayCurrent}" alt="Día Actual" class="photo-preview">
            ` : `
              <div class="photo-placeholder">
                <span style="font-size:28px;">🔥</span>
                <span>Subir Foto Actual</span>
              </div>
            `}
            <span class="photo-badge">ACTUAL</span>
            <input type="file" id="inputPhotoCurrent" accept="image/*" style="display:none;" onchange="App.handlePhotoUpload(event, 'dayCurrent')">
          </div>
        </div>
      </div>
    `;
  }

  // --- Função Auxiliar: Gera Gráfico SVG Dinâmico ---
  function renderWeightChart(logs, startWeight, targetWeight, profileGoal = 'perder-peso') {
    const cleanLogs = (Array.isArray(logs) ? logs : []).map(l => {
      const kgVal = Number(l.kg !== undefined ? l.kg : (l.weight !== undefined ? l.weight : 70));
      return {
        date: l.date || '',
        kg: isNaN(kgVal) ? 70 : Math.round(kgVal * 10) / 10
      };
    }).filter(l => l.date && !isNaN(l.kg));

    cleanLogs.sort((a, b) => a.date.localeCompare(b.date));

    const initialW = Number(startWeight || (cleanLogs.length ? cleanLogs[0].kg : 75));
    const currentW = cleanLogs.length ? cleanLogs[cleanLogs.length - 1].kg : initialW;
    const targetW = Number(targetWeight || 70);

    const delta = currentW - initialW;
    const deltaSign = delta > 0 ? ('+' + delta.toFixed(1)) : delta.toFixed(1);
    const isLosing = profileGoal === 'perder-peso';
    const isProgressGood = isLosing ? (delta <= 0) : (delta >= 0);
    const deltaColor = (delta === 0) ? '#a1a1aa' : (isProgressGood ? '#22c55e' : '#f59e0b');
    const toTarget = Math.abs(currentW - targetW).toFixed(1);

    const metricsHeaderHtml = `
      <div class="weight-metrics-header" style="display:grid; grid-template-columns: repeat(4, 1fr); gap:6px; background:rgba(0,0,0,0.5); border:1px solid rgba(255,255,255,0.08); border-radius:8px; padding:10px 6px; margin-bottom:12px; text-align:center;">
        <div>
          <div style="font-size:9.5px; color:#a1a1aa; text-transform:uppercase; font-weight:700;">Inicial</div>
          <div style="font-size:13.5px; font-weight:800; color:#fff;">${initialW} <span style="font-size:9.5px; font-weight:400; color:#71717a;">kg</span></div>
        </div>
        <div>
          <div style="font-size:9.5px; color:#a1a1aa; text-transform:uppercase; font-weight:700;">Actual</div>
          <div style="font-size:13.5px; font-weight:800; color:#22c55e;">${currentW} <span style="font-size:9.5px; font-weight:400; color:#71717a;">kg</span></div>
        </div>
        <div>
          <div style="font-size:9.5px; color:#a1a1aa; text-transform:uppercase; font-weight:700;">Cambio</div>
          <div style="font-size:13.5px; font-weight:800; color:${deltaColor};">${deltaSign} <span style="font-size:9.5px; font-weight:400;">kg</span></div>
        </div>
        <div>
          <div style="font-size:9.5px; color:#a1a1aa; text-transform:uppercase; font-weight:700;">A Meta</div>
          <div style="font-size:13.5px; font-weight:800; color:#eab308;">${toTarget} <span style="font-size:9.5px; font-weight:400; color:#71717a;">kg</span></div>
        </div>
      </div>
    `;

    if (cleanLogs.length === 0) {
      return `
        ${metricsHeaderHtml}
        <div style="padding:24px 12px; text-align:center; color:#a1a1aa; font-size:12px; background:rgba(0,0,0,0.25); border-radius:8px; border:1px dashed rgba(255,255,255,0.1);">
          ⚖️ Registra tu peso actual para iniciar el seguimiento visual de tu evolución.
        </div>
      `;
    }

    if (cleanLogs.length === 1) {
      const pt = cleanLogs[0];
      return `
        ${metricsHeaderHtml}
        <div class="weight-single-point-box" style="background:#070907; border:1px solid rgba(255,255,255,0.08); border-radius:10px; padding:16px 12px; text-align:center;">
          <svg viewBox="0 0 340 85" style="width:100%; height:85px; overflow:visible;">
            <line x1="20" y1="42" x2="320" y2="42" stroke="rgba(255,255,255,0.08)" stroke-width="1.5" stroke-dasharray="4 4"/>
            <circle cx="170" cy="42" r="6" fill="#22c55e" stroke="#050705" stroke-width="2.5" style="filter: drop-shadow(0 0 6px rgba(34,197,94,0.6));" />
            <text x="170" y="26" fill="#fff" font-size="11" font-weight="800" text-anchor="middle">${pt.kg} kg</text>
            <text x="170" y="68" fill="#a1a1aa" font-size="9" text-anchor="middle">Primer pesaje: ${pt.date}</text>
          </svg>
          <div style="font-size:11.5px; color:#22c55e; font-weight:700; margin-top:4px;">
            📍 Registra más un pesaje para ver tu curva gráfica de evolución.
          </div>
        </div>
      `;
    }

    const weights = cleanLogs.map(l => l.kg);
    const minW = Math.min(...weights, targetW) - 1.5;
    const maxW = Math.max(...weights, initialW, targetW) + 1.5;
    const rangeW = (maxW - minW) || 1;

    const width = 340;
    const height = 130;
    const padL = 36;
    const padR = 16;
    const padT = 20;
    const padB = 25;

    const plotWidth = width - padL - padR;
    const plotHeight = height - padT - padB;

    const coordPoints = cleanLogs.map((l, idx) => {
      const x = padL + (idx / (cleanLogs.length - 1)) * plotWidth;
      const y = padT + (1 - (l.kg - minW) / rangeW) * plotHeight;
      return { x, y, kg: l.kg, date: l.date };
    });

    const pointsAttr = coordPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaPoints = `${coordPoints[0].x.toFixed(1)},${padT + plotHeight} ` + pointsAttr + ` ${coordPoints[coordPoints.length - 1].x.toFixed(1)},${padT + plotHeight}`;

    const targetY = (padT + (1 - (targetW - minW) / rangeW) * plotHeight).toFixed(1);
    const gradId = 'grad_weight_' + Math.floor(Math.random() * 100000);

    return `
      ${metricsHeaderHtml}
      <div class="weight-chart-wrapper" style="position:relative; width:100%; overflow:hidden; background:#070907; border:1px solid rgba(255,255,255,0.06); border-radius:10px; padding:6px 0;">
        <svg viewBox="0 0 ${width} ${height}" style="width:100%; height:auto; display:block;" class="weight-svg-chart">
          <defs>
            <linearGradient id="${gradId}" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stop-color="#22c55e" stop-opacity="0.32" />
              <stop offset="100%" stop-color="#22c55e" stop-opacity="0.0" />
            </linearGradient>
          </defs>

          <!-- Línea de Meta Tracejada -->
          <line x1="${padL}" y1="${targetY}" x2="${width - padR}" y2="${targetY}" stroke="#eab308" stroke-dasharray="3 3" stroke-width="1.2" opacity="0.65" />
          <text x="${width - padR}" y="${targetY - 3}" fill="#eab308" font-size="8.5" font-weight="700" text-anchor="end">Meta: ${targetW} kg</text>

          <!-- Área bajo la curva -->
          <polygon points="${areaPoints}" fill="url(#${gradId})" />

          <!-- Línea Verde de Evolución -->
          <polyline fill="none" stroke="#22c55e" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" points="${pointsAttr}" />

          <!-- Eje Vertical (Valores Mín / Máx) -->
          <text x="${padL - 6}" y="${padT + 4}" fill="#71717a" font-size="8.5" font-weight="600" text-anchor="end">${maxW.toFixed(0)}</text>
          <text x="${padL - 6}" y="${padT + plotHeight}" fill="#71717a" font-size="8.5" font-weight="600" text-anchor="end">${minW.toFixed(0)}</text>

          <!-- Puntos con Tooltip al tocar -->
          ${coordPoints.map((pt, i) => `
            <g class="weight-point-group" tabindex="0">
              <circle cx="${pt.x.toFixed(1)}" cy="${pt.y.toFixed(1)}" r="4" fill="#22c55e" stroke="#050705" stroke-width="2" style="cursor:pointer;" />
              <text x="${pt.x.toFixed(1)}" y="${height - 6}" fill="#71717a" font-size="7.5" text-anchor="middle">${pt.date.substring(5)}</text>
              <title>${pt.date}: ${pt.kg} kg</title>
            </g>
          `).join('')}
        </svg>
      </div>
    `;
  }


  // --- AVATARES TÁCTICOS PREESTABLECIDOS ---
  const AVATAR_PRESETS = [
    { id: 'tactical-helmet', name: 'Casco NVG', icon: '🪖' },
    { id: 'recon-goggles', name: 'Visor Asalto', icon: '🥽' },
    { id: 'beret-commando', name: 'Boina Élite', icon: '🎖️' },
    { id: 'female-commando', name: 'Operadora', icon: '👩‍✈️' },
    { id: 'eagle-commander', name: 'Águila Mando', icon: '🦅' },
    { id: 'stealth-mask', name: 'Máscara Negra', icon: '🥷' }
  ];

  function getAvatarDisplay(avatarKey) {
    if (!avatarKey) return '🪖';
    if (typeof avatarKey === 'string' && avatarKey.startsWith('data:image/')) {
      return '<img src="' + avatarKey + '" style="width:100%; height:100%; object-fit:cover; border-radius:50%; display:block;" />';
    }
    const found = AVATAR_PRESETS.find(p => p.id === avatarKey);
    return found ? found.icon : '🪖';
  }

  // ==========================================
  // 5. VISTA: PERFIL DEL USUARIO / DOSSIER TÁCTICO
  // ==========================================
  function renderPerfil(state) {
    const p = state.profile;
    const rankInfo = ProtocoloStore.getRank(state.progress.points);
    const completedCount = state.progress.completedDays.length;
    const pctCompleted = Math.round((completedCount / 21) * 100);
    const deltaWeight = (p.currentWeight - p.startWeight).toFixed(1);
    const deltaSign = deltaWeight > 0 ? ('+' + deltaWeight) : deltaWeight;

    const goalNames = {
      'perder-peso': '🔥 Perder Grasa & Definición',
      'ganar-musculo': '🥩 Ganar Masa Magra',
      'ganar-peso': '⚡ Volumen Muscular Limpio',
      'mantener-peso': '🥗 Mantenimiento & Salud'
    };

    return `
      <div class="view-perfil">
        <!-- Tarjeta de Identidad Militar / Dossier Holográfico -->
        <div class="profile-dossier-card">
          <div class="dossier-header-bar">
            <span class="dossier-badge-pill">FICHA MILITAR OFICIAL</span>
            <span class="dossier-code">COD: CAL-21-${p.gender === 'mujer' ? 'F' : 'M'}</span>
          </div>

          <div class="profile-hero-row">
            <div class="profile-avatar-frame" onclick="App.openEditProfileModal()" title="Cambiar Avatar">
              <div class="profile-avatar-inner">
                ${getAvatarDisplay(p.avatar)}
              </div>
              <div class="profile-avatar-edit-tag">✎</div>
              <div class="status-indicator-live" title="Operativo Activo"></div>
            </div>

            <div class="profile-hero-info">
              <div class="profile-hero-rank">
                <span class="rank-tag-badge">${rankInfo.current.badge}</span>
                <span class="rank-title-text">${rankInfo.current.icon} ${rankInfo.current.name}</span>
              </div>
              <h2 class="profile-user-name">${p.name}</h2>
              <div class="profile-user-nickname">Indicativo: <strong>"${p.nickname}"</strong></div>
              <div class="profile-enlist-date">Alistado: ${p.joinedDate || 'Noviembre 2026'}</div>
            </div>
          </div>

          <!-- Lema / Bio Táctica -->
          <div class="profile-bio-box">
            <span class="bio-quote-ico">“</span>
            <span>${p.bio || 'Comprometido al 100% con los 21 días del Protocolo.'}</span>
          </div>
        </div>

        <!-- Matriz de Rendimiento Táctico (4 KPIs) -->
        <div class="profile-kpi-grid">
          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-icon">🎯</span>
              <span class="kpi-title">MISIONES</span>
            </div>
            <div class="kpi-val">${completedCount} <span class="kpi-val-dim">/ 21</span></div>
            <div class="kpi-bar-bg"><div class="kpi-bar-fill" style="width:${pctCompleted}%;"></div></div>
            <div class="kpi-foot">${pctCompleted}% Completado</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-icon">⚡</span>
              <span class="kpi-title">PUNTOS XP</span>
            </div>
            <div class="kpi-val">${state.progress.points} <span class="kpi-val-dim">XP</span></div>
            <div class="kpi-bar-bg"><div class="kpi-bar-fill" style="width:${rankInfo.progressPct}%; background:#eab308;"></div></div>
            <div class="kpi-foot">${rankInfo.next ? (rankInfo.pointsToNext + ' XP al próx. rango') : 'Rango Máximo'}</div>
          </div>

          <div class="kpi-card">
            <div class="kpi-top">
              <span class="kpi-icon">🔥</span>
              <span class="kpi-title">RACHA ACTIVA</span>
            </div>
            <div class="kpi-val">${state.progress.streak} <span class="kpi-val-dim">días</span></div>
            <div class="kpi-bar-bg"><div class="kpi-bar-fill" style="width:${Math.min(100, state.progress.streak * 10)}%; background:#ef4444;"></div></div>
            <div class="kpi-foot">Disciplina Operativa</div>
          </div>

          <div class="kpi-card" onclick="App.setTab('evolucion')" style="cursor:pointer;" title="Ver gráfico completo">
            <div class="kpi-top">
              <span class="kpi-icon">⚖️</span>
              <span class="kpi-title">PESO ACTUAL</span>
            </div>
            <div class="kpi-val">${p.currentWeight || p.startWeight} <span class="kpi-val-dim">kg</span></div>
            <div class="kpi-bar-bg"><div class="kpi-bar-fill" style="width:85%;"></div></div>
            <div class="kpi-foot">Meta: ${p.targetWeight} kg (${deltaSign} kg)</div>
          </div>
        </div>

        <!-- Gráfico SVG de Evolución de Peso en el Perfil -->
        <div class="profile-section-card">
          <div class="profile-section-header">
            <h3>📈 Curva Gráfica de Evolución de Peso</h3>
            <span style="font-size:11px; color:var(--primary-green); font-weight:700;">Actualizado</span>
          </div>

          ${renderWeightChart(state.weightLog || [], p.startWeight, p.targetWeight, p.goal)}

          <div class="weight-input-bar" style="display:flex; gap:8px; margin-top:10px;">
            <input type="number" step="0.1" id="inputProfileNewWeight" placeholder="Registrar peso de hoy (ej: ${p.currentWeight || 75})" class="comment-input" style="flex:1;">
            <button class="btn-start-mission" style="font-size:12px; padding:8px 16px; width:auto;" onclick="App.saveProfileWeight()">
              GUARDAR
            </button>
          </div>
        </div>

        <!-- Ficha de Datos Biométricos -->
        <div class="profile-section-card">
          <div class="profile-section-header">
            <h3>📋 Datos Biométricos & Configuración</h3>
            <button class="btn-edit-profile-mini" onclick="App.openEditProfileModal()">✏️ Editar</button>
          </div>

          <div class="bio-spec-list">
            <div class="bio-spec-row">
              <span class="bio-spec-label">Género del Protocolo</span>
              <span class="bio-spec-val">${p.gender === 'mujer' ? '👩 Mujer (Enfoque Glúteos & Núcleo)' : '👨 Hombre (Enfoque Tren Superior & V-Taper)'}</span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Edad del Recluta</span>
              <span class="bio-spec-val">${p.age} años</span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Estatura</span>
              <span class="bio-spec-val">${p.height || 175} cm</span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Objetivo Principal</span>
              <span class="bio-spec-val">${goalNames[p.goal] || p.goal}</span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Nivel en Calistenia</span>
              <span class="bio-spec-val" style="color:var(--primary-green);">
                ${p.experienceLevel === 'principiante' ? '🟢 Principiante (Descansos 30s)' : (p.experienceLevel === 'avanzado' ? '🔴 Avanzado (Descansos 15s)' : '🟡 Intermedio (Estándar Militar)')}
              </span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Disponibilidad Diaria</span>
              <span class="bio-spec-val">
                ${p.timeAvailability === 'express' ? '⚡ 15-20 min (Express)' : (p.timeAvailability === 'intensivo' ? '🔥 40+ min (Intensivo)' : '⏱️ 25-35 min (Estándar)')}
              </span>
            </div>
            <div class="bio-spec-row">
              <span class="bio-spec-label">Blindaje Articular</span>
              <span class="bio-spec-val ${p.jointProtection ? 'active-green' : ''}">
                ${(p.jointRestrictions && p.jointRestrictions.length > 0) ? ('🛡️ ' + p.jointRestrictions.join(', ').toUpperCase() + ' PROTEGIDAS') : (p.jointProtection ? '🛡️ Modo Suave Activo' : '⚡ 100% Operativo')}
              </span>
            </div>
          </div>
        </div>

        <!-- Escalafón de Rangos Militares -->
        <div class="profile-section-card">
          <div class="profile-section-header">
            <h3>🎖️ Escalafón de Patentes Militares</h3>
          </div>
          <div class="ranks-timeline">
            ${ProtocoloStore.RANKS.map(r => {
              const isCurrent = r.id === rankInfo.current.id;
              const isUnlocked = state.progress.points >= r.minPoints;
              return `
                <div class="rank-item-row ${isCurrent ? 'current-rank' : ''} ${isUnlocked ? 'unlocked' : 'locked'}">
                  <div class="rank-ico-col">${r.icon}</div>
                  <div class="rank-info-col">
                    <div class="rank-name-row">
                      <span class="rank-tag-pill">${r.badge}</span>
                      <strong>${r.name}</strong>
                      ${isCurrent ? '<span class="current-tag">ACTUAL</span>' : ''}
                    </div>
                    <span class="rank-desc-sub">${r.desc} (${r.minPoints} XP)</span>
                  </div>
                  <div class="rank-status-col">
                    ${isUnlocked ? '<span style="color:#22c55e;">✓</span>' : '<span style="color:#71717a;">🔒</span>'}
                  </div>
                </div>
              `;
            }).join('')}
          </div>
        </div>

        <!-- Condecoraciones & Medallas Tácticas (Rediseño de Élite Militar) -->
        ${(() => {
          const medals = getMedalsList(state);
          const unlockedCount = medals.filter(m => m.unlocked).length;
          const totalCount = medals.length;
          const pct = Math.round((unlockedCount / totalCount) * 100);

          return `
            <div class="medals-prestige-card">
              <div class="medals-prestige-header">
                <div class="prestige-title-group">
                  <div class="prestige-badge-icon">🎖️</div>
                  <div>
                    <h3 class="prestige-title">Condecoraciones & Medallas</h3>
                    <span class="prestige-sub">Mérito militar acumulado en tu servicio</span>
                  </div>
                </div>
                <div class="prestige-counter">
                  <span class="counter-number">${unlockedCount} / ${totalCount}</span>
                  <span class="counter-label">DESBLOQUEADAS</span>
                </div>
              </div>

              <!-- Barra de Progreso de Honor -->
              <div class="prestige-progress-wrap">
                <div class="prestige-progress-fill" style="width: ${pct}%;"></div>
              </div>
              <div class="prestige-progress-meta">
                <span>Progreso de condecoración militar</span>
                <strong>${pct}% Desbloqueado</strong>
              </div>

              <!-- Grid de Medallas Tácticas -->
              <div class="medals-tactical-grid">
                ${medals.map(m => `
                  <div class="tactical-medal-card ${m.unlocked ? 'unlocked' : 'locked'} tier-${m.tier}" 
                       onclick="App.inspectMedal('${m.id}')"
                       title="Toca para inspeccionar">
                    <div class="medal-card-glow"></div>
                    <div class="medal-top-row">
                      <span class="medal-tier-chip ${m.tier}">${m.tierName}</span>
                      <span class="medal-xp-chip">+${m.xpReward} XP</span>
                    </div>

                    <div class="medal-crest-circle ${m.unlocked ? 'active' : ''}">
                      <span class="medal-emoji">${m.icon}</span>
                      ${!m.unlocked ? '<span class="medal-lock-overlay">🔒</span>' : ''}
                    </div>

                    <div class="medal-title-tactical">${m.title}</div>
                    <div class="medal-desc-tactical">${m.desc}</div>

                    <div class="medal-footer-state">
                      <span class="medal-state-badge ${m.unlocked ? 'won' : 'locked'}">
                        ${m.unlocked ? '✓ OTORGADA' : '🔒 ' + m.progressText}
                      </span>
                    </div>
                  </div>
                `).join('')}
              </div>
            </div>
          `;
        })()}

        <!-- Respaldo y Sincronización en la Nube -->
        <div class="profile-section-card">
          <div class="profile-section-header">
            <h3>☁️ Respaldo en la Nube & Cuenta Militar</h3>
            <span style="font-size:11px; color:${typeof window !== 'undefined' && window.SupabaseClient && window.SupabaseClient.isAuthenticated() ? 'var(--primary-green)' : '#a1a1aa'}; font-weight:700;">
              ${typeof window !== 'undefined' && window.SupabaseClient && window.SupabaseClient.isAuthenticated() ? '🟢 Sincronizado' : '⚪ Almacenamiento Local'}
            </span>
          </div>
          <div style="font-size:11.5px; color:#d4d4d8; line-height:1.5; margin-bottom:10px;">
            ${typeof window !== 'undefined' && window.SupabaseClient && window.SupabaseClient.isAuthenticated() 
              ? `Sesión activa como <strong>${(window.SupabaseClient.getUser() && window.SupabaseClient.getUser().email) || 'Soldado'}</strong>. Tu progreso de 21 días, peso y recetas privadas se sincronizan automáticamente.`
              : `Actualmente tus misiones, evolución y recetas están guardadas únicamente en este dispositivo. Conecta tu cuenta para no perder nada al cambiar de celular.`
            }
          </div>
          <div style="display:flex; gap:8px;">
            ${typeof window !== 'undefined' && window.SupabaseClient && window.SupabaseClient.isAuthenticated()
              ? `
                <button class="btn-start-mission" style="font-size:11px; padding:8px 12px; flex:1;" onclick="App.syncProfileCloud()">
                  🔄 SINCRONIZAR AHORA
                </button>
                <button class="btn-secondary-full" style="font-size:11px; padding:8px 12px; width:auto; border-color:rgba(239,68,68,0.4); color:#ef4444;" onclick="App.signOutCloud()">
                  Cerrar Sesión
                </button>
              `
              : `
                <button class="btn-start-mission" style="font-size:11px; padding:8px 12px; flex:1;" onclick="App.openAuthModal()">
                  ☁️ CREAR CUENTA O INICIAR SESIÓN
                </button>
              `
            }
          </div>
        </div>

        <!-- Estado de Membresías y Accesos -->
        <div class="profile-section-card">
          <div class="profile-section-header">
            <h3>🔐 Estado de Accesos & Membresías</h3>
          </div>
          <div class="membership-list">
            <div class="membership-item active">
              <div class="memb-ico">🎯</div>
              <div class="memb-details">
                <strong>Protocolo de 21 Días de Calistenia</strong>
                <span>Acceso Completo • 21 Días de Misiones & Nutrición</span>
              </div>
              <span class="memb-status-badge active">ACTIVO</span>
            </div>

            <div class="membership-item active">
              <div class="memb-ico">💬</div>
              <div class="memb-details">
                <strong>Hermandad Táctica (Comunidad)</strong>
                <span>Canal oficial de apoyo mutuo y reportes diarios</span>
              </div>
              <span class="memb-status-badge active">INCLUIDO</span>
            </div>

            <div class="membership-item ${state.community.isVipMember ? 'active' : 'inactive'}">
              <div class="memb-ico">📸</div>
              <div class="memb-details">
                <strong>Scanner Nutricional por Foto (IA)</strong>
                <span>Reconocimiento fotográfico de calorías y macros con IA (${(window.PROTOCOLO_CONFIG && window.PROTOCOLO_CONFIG.pricing) ? window.PROTOCOLO_CONFIG.pricing.formattedMonthlyShort : '$4.90/mes'})</span>
              </div>
              ${state.community.isVipMember
                ? '<span class="memb-status-badge active">VIP ACTIVO</span>'
                : `<button class="memb-upgrade-btn" onclick="App.openVipScannerOfferModal()">DESBLOQUEAR (${(window.PROTOCOLO_CONFIG && window.PROTOCOLO_CONFIG.pricing) ? window.PROTOCOLO_CONFIG.pricing.formattedPrice : '$4.90'})</button>`
              }
            </div>
          </div>
        </div>

        <!-- Botón de Edição Geral -->
        <button class="btn-action-full" onclick="App.openEditProfileModal()" style="margin-top:16px;">
          ⚙️ EDITAR DATOS DEL PERFIL TÁCTICO
        </button>
        <button class="btn-secondary-full" onclick="App.startOnboardingAgain()" style="margin-top:10px; border-color:rgba(34,197,94,0.3); color:var(--primary-green); font-weight:800;">
          🔄 RECALIBRAR PROTOCOLO (REPETIR ONBOARDING)
        </button>

        <div style="text-align:center; margin-top:20px; padding-bottom:30px;">
          <button class="btn-danger-outline" onclick="App.confirmResetProgress()">
            ⚠️ Reiniciar Todo el Progreso del Protocolo
          </button>
        </div>
      </div>
    `;
  }

  // ==========================================
  // 6. VISTA: COMUNIDAD TÁCTICA PREMIUM (HERMANDAD)
  // ==========================================
  // 6. VISTA: COMUNIDAD TÁCTICA (HERMANDAD) - 100% LIBERADA E INCLUÍDA
  // ==========================================
  function renderComunidad(state) {
    const filter = (state.community && state.community.filter) || 'todos';
    let filteredPosts = (state.community && state.community.posts) || [];

    if (filter === 'misiones') {
      filteredPosts = filteredPosts.filter(p => p.tag === 'misiones');
    } else if (filter === 'nutricion') {
      filteredPosts = filteredPosts.filter(p => p.tag === 'nutricion');
    } else if (filter === 'motivacion') {
      filteredPosts = filteredPosts.filter(p => p.tag === 'motivacion');
    } else if (filter === 'mis_reportes') {
      filteredPosts = filteredPosts.filter(p => p.isMyPost || p.author === (state.profile && state.profile.name));
    }

    return `
      <div class="view-comunidad-feed">
        <!-- Top Banner de la Hermandad -->
        <div class="comm-feed-topbar">
          <div class="comm-feed-title-block">
            <div class="comm-feed-title">
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="#22c55e" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              <span>HERMANDAD TÁCTICA</span>
              <span class="comm-vip-badge" style="background:rgba(34,197,94,0.18); color:#4ade80; border-color:rgba(34,197,94,0.4);">COMUNIDAD INCLUIDA</span>
            </div>
            <div class="comm-feed-subtitle">Canal oficial de la unidad militar para compartir avances, dudas y disciplina</div>
          </div>
        </div>

        <!-- Ticker de Actividad de la Unidad (Ejemplos) -->
        <div class="comm-hall-fame-strip">
          <div class="hall-fame-header" style="display:flex; justify-content:space-between; align-items:center; margin-bottom:8px;">
            <div class="hall-fame-title" style="margin:0; display:flex; align-items:center; gap:6px;">
              <span class="pulse-green-dot" style="display:inline-block; width:7px; height:7px;"></span>
              <span>Ejemplos de actividad</span>
              <span class="badge-ejemplo" style="font-size:8.5px; padding:1px 5px;">EJEMPLO</span>
            </div>
            <span style="font-size:9.5px; font-weight:800; color:#22c55e; letter-spacing:0.5px; background:rgba(34,197,94,0.12); padding:2px 6px; border-radius:4px;">CANAL OPERATIVO</span>
          </div>
          <div class="hall-fame-scroll">
            <div class="soldier-pill"><span class="pill-dot green"></span><strong>Sgto. Mateo</strong> <span style="color:#a1a1aa;">Día 14 listo 🔥</span></div>
            <div class="soldier-pill"><span class="pill-dot green"></span><strong>Cabo Valentina</strong> <span style="color:#a1a1aa;">-3.4kg Racha 12d ⚡</span></div>
            <div class="soldier-pill"><span class="pill-dot green"></span><strong>Tte. Marcos</strong> <span style="color:#a1a1aa;">Comida registrada 🥗</span></div>
            <div class="soldier-pill"><span class="pill-dot green"></span><strong>Soldado Javier</strong> <span style="color:#a1a1aa;">Día 6 completado ⚔️</span></div>
            <div class="soldier-pill"><span class="pill-dot green"></span><strong>Recluta Sofía</strong> <span style="color:#a1a1aa;">Día 1 completado 🎯</span></div>
          </div>
        </div>

        <!-- Inputs ocultos para adjuntar foto en publicación -->
        <input type="file" id="commPhotoInput" accept="image/*" style="display:none;" onchange="App.handleCommunityPhotoSelect(event)">

        <!-- Caixa de Novo Relatório ("Reportar a la Base") -->
        <div class="comm-composer-card">
          <div class="composer-header">
            <div class="composer-avatar">${getAvatarDisplay(state.profile.avatar)}</div>
            <div class="composer-meta">
              <strong>${state.profile.name}</strong>
              <span class="composer-tag">${state.profile.nickname} • Publicando en la Hermandad</span>
            </div>
          </div>

          <textarea id="commPostInput" class="composer-textarea" placeholder="Comparte tu entrenamiento de hoy, tus dudas, tu plato de comida o una victoria personal..." spellcheck="false" autocomplete="off" autocapitalize="sentences"></textarea>

          <!-- Previsualización de Foto Adjunta (si seleccionada) -->
          <div id="commAttachedPhotoPreview" style="display:none; margin: 10px 0; position:relative;">
            <img id="commAttachedPhotoImg" src="" style="width:100%; max-height:220px; object-fit:cover; border-radius:10px; border:1px solid rgba(255,255,255,0.12);">
            <button onclick="App.removeAttachedCommunityPhoto()" style="position:absolute; top:8px; right:8px; background:rgba(0,0,0,0.75); color:#fff; border:none; border-radius:50%; width:28px; height:28px; font-weight:bold; cursor:pointer;">&times;</button>
          </div>

          <div class="composer-actions">
            <div class="composer-left-tools">
              <select id="commPostTag" class="composer-select">
                <option value="misiones">🎯 Misión Cumplida</option>
                <option value="nutricion">🥗 Nutrición / Receta</option>
                <option value="motivacion">🔥 Evolución & Victoria</option>
                <option value="blindaje">🛡️ Movilidad & Salud</option>
              </select>

              <button class="btn-attach-photo" type="button" onclick="App.triggerCommunityPhotoUpload()" title="Adjuntar foto a tu publicación">
                <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="2" ry="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>
                <span>FOTO</span>
              </button>
            </div>

            <button class="btn-publish-post" onclick="App.submitCommunityPost()">
              <span>PUBLICAR</span>
              <span class="post-xp-pill">+30 XP</span>
            </button>
          </div>
        </div>

        <!-- Filtros do Feed em Chips Arredondados com Scroll Snap -->
        <div class="comm-filters-scroll">
          <button class="filter-chip ${filter === 'todos' ? 'active' : ''}" onclick="App.setCommunityFilter('todos')">
            Todos (${(state.community.posts || []).length})
          </button>
          <button class="filter-chip ${filter === 'misiones' ? 'active' : ''}" onclick="App.setCommunityFilter('misiones')">
            🎯 Misiones
          </button>
          <button class="filter-chip ${filter === 'nutricion' ? 'active' : ''}" onclick="App.setCommunityFilter('nutricion')">
            🥗 Nutrición
          </button>
          <button class="filter-chip ${filter === 'motivacion' ? 'active' : ''}" onclick="App.setCommunityFilter('motivacion')">
            🔥 Evolución
          </button>
          <button class="filter-chip ${filter === 'mis_reportes' ? 'active' : ''}" onclick="App.setCommunityFilter('mis_reportes')">
            👤 Mis Reportes
          </button>
        </div>

        <!-- Lista de Posts do Feed -->
        <div class="comm-posts-feed">
          ${filteredPosts.length === 0 ? `
            <div class="comm-empty-feed">
              <div class="empty-icon-shield">
                <svg viewBox="0 0 24 24" width="36" height="36" fill="none" stroke="#d4af37" stroke-width="1.8"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
              </div>
              <strong style="color:#fff; font-size:15px; margin-top:8px; display:block;">Aún no hay publicaciones en esta sección.</strong>
              <p style="color:#a1a1aa; font-size:13px; max-width:340px; margin: 6px auto 14px auto;">
                Comparte tus entrenamientos, resuelve dudas y apoya a tus compañeros.
              </p>
              <button class="btn-first-post" onclick="document.getElementById('commPostInput').focus()">
                Escribir la primera publicación
              </button>
            </div>
          ` : filteredPosts.map(post => `
            <div class="comm-post-card" id="${post.id}">
              <!-- Cabeçalho do Post -->
              <div class="post-header-row">
                <div class="post-author-avatar">
                  ${getAvatarDisplay(post.avatar)}
                </div>
                <div class="post-author-info">
                  <div class="author-name-line">
                    <strong>${post.author}</strong>
                    <span class="post-rank-badge">${post.rankBadge || 'R-1'} ${post.rankIcon || '🎖️'}</span>
                  </div>
                  <div class="author-sub-line">
                    <span class="post-nickname">"${post.nickname}"</span> • 
                    <span class="post-time">${post.date}</span>
                  </div>
                </div>

                <div style="display:flex; align-items:center; gap:6px;">
                  <div class="post-tag-badge ${post.tag}">
                    ${post.tagLabel || 'MISIÓN'}
                  </div>
                  ${post.isExample ? '<span class="badge-ejemplo">EJEMPLO</span>' : ''}
                </div>
              </div>

              <!-- Conteúdo de Texto -->
              <div class="post-body-text">
                ${post.text}
              </div>

              ${post.image ? `
                <div class="post-image-container">
                  <img src="${post.image}" alt="Reporte" class="post-image-fluid" loading="lazy">
                </div>
              ` : ''}

              <!-- Barra de Ações (Likes, Comentários e Exclusão) -->
              <div class="post-footer-actions">
                <button class="btn-like-tactical ${post.likedByMe ? 'liked' : ''}" onclick="App.likeCommunityPost('${post.id}')">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="${post.likedByMe ? '#ef4444' : 'none'}" stroke="${post.likedByMe ? '#ef4444' : 'currentColor'}" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>
                  <span class="like-label">${post.likedByMe ? 'Apoyo' : 'Apoyar'}</span>
                  <span class="like-count">(${post.likes})</span>
                </button>

                <button class="btn-comment-tactical" onclick="App.focusCommentInput('${post.id}')">
                  <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
                  <span>Comentarios (${post.comments ? post.comments.length : 0})</span>
                </button>

                ${(post.isMyPost || post.author === state.profile.name) ? `
                  <button class="btn-post-delete" onclick="App.deleteCommunityPost('${post.id}')" title="Eliminar mi publicación">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                  </button>
                ` : ''}
              </div>

              <!-- Seção de Comentários -->
              <div class="post-comments-section" id="comments_${post.id}">
                ${(post.comments && post.comments.length > 0) ? `
                  <div class="comments-list">
                    ${post.comments.map(c => `
                      <div class="comment-item">
                        <div class="comment-author-line">
                          <strong>${c.author}</strong>
                          <span class="comment-time">${c.date}</span>
                        </div>
                        <div class="comment-text">${c.text}</div>
                      </div>
                    `).join('')}
                  </div>
                ` : ''}

                <!-- Campo para Adicionar Comentário -->
                <div class="comment-input-row">
                  <input type="text" id="input_comment_${post.id}" class="comment-input" placeholder="Escribe un mensaje de apoyo o consejo..." onkeydown="if(event.key === 'Enter') App.submitComment('${post.id}')">
                  <button class="btn-send-comment" onclick="App.submitComment('${post.id}')">
                    <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/></svg>
                  </button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  }

  // ==========================================
  // MODAL: EDITAR PERFIL TÁCTICO
  // ==========================================
  function renderEditProfileModal(state) {
    const p = state.profile;
    return `
      <div class="app-modal-card" style="max-height:85vh; overflow-y:auto;">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3 style="font-size:17px; font-weight:800; color:#fff;">Editar Ficha de Servicio</h3>
          <button class="player-close-btn" style="width:32px; height:32px;" onclick="App.closeEditProfileModal()">&times;</button>
        </div>

        <form onsubmit="App.saveProfileChanges(event)">
          <!-- Selección de Avatar Táctico -->
          <div style="margin-bottom:16px;">
            <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:8px;">Avatar Militar</label>
            <div class="avatar-preset-picker">
              ${AVATAR_PRESETS.map(av => `
                <div class="avatar-preset-opt ${p.avatar === av.id ? 'selected' : ''}" onclick="App.selectAvatarPreset('${av.id}')">
                  <span class="opt-icon">${av.icon}</span>
                  <span class="opt-name">${av.name}</span>
                </div>
              `).join('')}
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Nombre del Recluta</label>
            <input type="text" id="editName" class="comment-input" value="${p.name || ''}" required style="width:100%; box-sizing:border-box;">
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Apodo / Indicativo Táctico</label>
            <input type="text" id="editNickname" class="comment-input" value="${p.nickname || ''}" required style="width:100%; box-sizing:border-box;">
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Edad</label>
              <input type="number" id="editAge" class="comment-input" value="${p.age || 28}" min="15" max="90" style="width:100%; box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Estatura (cm)</label>
              <input type="number" id="editHeight" class="comment-input" value="${p.height || 175}" min="100" max="230" style="width:100%; box-sizing:border-box;">
            </div>
          </div>

          <div style="display:grid; grid-template-columns:1fr 1fr; gap:10px; margin-bottom:12px;">
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Peso Inicial (kg)</label>
              <input type="number" step="0.1" id="editStartWeight" class="comment-input" value="${p.startWeight || 75}" style="width:100%; box-sizing:border-box;">
            </div>
            <div>
              <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Meta de Peso (kg)</label>
              <input type="number" step="0.1" id="editTargetWeight" class="comment-input" value="${p.targetWeight || 70}" style="width:100%; box-sizing:border-box;">
            </div>
          </div>

          <div style="margin-bottom:12px;">
            <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Objetivo del Protocolo</label>
            <select id="editGoal" class="composer-select" style="width:100%; box-sizing:border-box;">
              <option value="perder-peso" ${p.goal === 'perder-peso' ? 'selected' : ''}>🔥 Perder Grasa & Definición</option>
              <option value="ganar-musculo" ${p.goal === 'ganar-musculo' ? 'selected' : ''}>🥩 Ganar Masa Magra</option>
              <option value="ganar-peso" ${p.goal === 'ganar-peso' ? 'selected' : ''}>⚡ Volumen Muscular Limpio</option>
              <option value="mantener-peso" ${p.goal === 'mantener-peso' ? 'selected' : ''}>🥗 Mantenimiento & Salud</option>
            </select>
          </div>

          <div style="margin-bottom:14px;">
            <label style="display:block; font-size:11px; font-weight:700; color:#a1a1aa; text-transform:uppercase; margin-bottom:4px;">Lema / Bio Personal</label>
            <textarea id="editBio" class="comment-input" style="width:100%; height:60px; box-sizing:border-box; resize:none;">${p.bio || ''}</textarea>
          </div>

          <div style="margin-bottom:16px;">
            <label style="display:flex; align-items:center; gap:8px; font-size:12px; color:#d1d5db; cursor:pointer;">
              <input type="checkbox" id="editJointProtection" ${p.jointProtection ? 'checked' : ''} style="accent-color:var(--primary-green); width:16px; height:16px;">
              <span>Activar Modo Suave / Protección Articular en rodillas y muñecas</span>
            </label>
          </div>

          <div style="display:flex; gap:10px;">
            <button type="submit" class="btn-action-full" style="flex:1;">GUARDAR CAMBIOS</button>
            <button type="button" class="btn-secondary-full" style="flex:1;" onclick="App.closeEditProfileModal()">CANCELAR</button>
          </div>
        </form>
      </div>
    `;
  }


  // ==========================================
  // 7. VISTA: ONBOARDING / CONFIGURACIÓN INICIAL DEL RECLUTA
  // ==========================================
  function renderOnboarding(state) {
    const draft = window.OnboardingDraft || {
      name: state.profile.name || 'Recluta Carlos',
      nickname: state.profile.nickname || 'Vanguardia-01',
      gender: state.profile.gender || 'hombre',
      avatar: state.profile.avatar || 'tactical-helmet',
      age: state.profile.age || 28,
      height: state.profile.height || 175,
      currentWeight: state.profile.currentWeight || 78,
      targetWeight: state.profile.targetWeight || 70,
      goal: state.profile.goal || 'perder-peso',
      experienceLevel: state.profile.experienceLevel || 'principiante',
      timeAvailability: state.profile.timeAvailability || 'estandar',
      jointRestrictions: state.profile.jointRestrictions || []
    };

    const step = (state.onboarding && state.onboarding.step) ? state.onboarding.step : 1;
    const progressPct = step * 20;

    // Métricas calculadas para o Step 2
    const heightM = (draft.height || 175) / 100;
    const bmi = ((draft.currentWeight || 78) / (heightM * heightM)).toFixed(1);
    const deltaW = ((draft.currentWeight || 78) - (draft.targetWeight || 70)).toFixed(1);

    // Hidratação diária estimada para o Step 5
    const dailyWaterMl = Math.round((draft.currentWeight || 78) * 35);

    return `
      <div class="onboarding-container">
        <!-- Barra de Progresso Tática do Onboarding -->
        <div class="onb-progress-box">
          <div class="onb-steps-header">
            <span class="onb-step-tag">FASE ${step} DE 5</span>
            <span class="onb-step-pct">${progressPct}% CALIBRADO</span>
          </div>
          <div class="onb-progress-track">
            <div class="onb-progress-fill" style="width: ${progressPct}%;"></div>
          </div>
          <div class="onb-steps-labels">
            <span class="${step >= 1 ? 'active' : ''}">1. Identidad</span>
            <span class="${step >= 2 ? 'active' : ''}">2. Biometría</span>
            <span class="${step >= 3 ? 'active' : ''}">3. Nivel</span>
            <span class="${step >= 4 ? 'active' : ''}">4. Blindaje</span>
            <span class="${step >= 5 ? 'active' : ''}">5. Activación</span>
          </div>
        </div>

        <div class="onb-card-body">
          ${step === 1 ? `
            <!-- PASO 1: IDENTIDAD TÁCTICA & AVATAR -->
            <div class="onb-step-content">
              <div class="onb-header-title">
                <span class="onb-badge-tactical">CENTRO DE RECLUTAMIENTO</span>
                <h2>Crea tu Identidad Militar</h2>
                <p>Configura tu ficha de operador para alistarte en el Protocolo de 21 Días.</p>
              </div>

              <!-- Género de Entrenamiento -->
              <div class="onb-form-group">
                <label class="onb-label">Selecciona tu Enfoque Físico:</label>
                <div class="onb-gender-grid">
                  <div class="onb-gender-card ${draft.gender === 'hombre' ? 'selected' : ''}" onclick="AppOnboarding.setGender('hombre')">
                    <div class="onb-gender-ico">👨</div>
                    <strong>Hombre</strong>
                    <span>Pecho, Espalda en V, Hombros y Fuerza Pura</span>
                  </div>

                  <div class="onb-gender-card ${draft.gender === 'mujer' ? 'selected' : ''}" onclick="AppOnboarding.setGender('mujer')">
                    <div class="onb-gender-ico">👩</div>
                    <strong>Mujer</strong>
                    <span>Glúteos Firmes, Abdomen Plano y Cintura</span>
                  </div>
                </div>
              </div>

              <!-- Nombre y Apodo -->
              <div class="onb-form-group">
                <label class="onb-label">Nombre del Recluta:</label>
                <input type="text" id="onbName" class="onb-input" value="${draft.name}" placeholder="Ej. Carlos o Elena">
              </div>

              <div class="onb-form-group">
                <label class="onb-label">Indicativo Táctico / Apodo:</label>
                <input type="text" id="onbNickname" class="onb-input" value="${draft.nickname}" placeholder="Ej. Vanguardia-01, Halcón, Alfa">
              </div>

              <!-- Selección de Avatar Táctico -->
              <div class="onb-form-group">
                <label class="onb-label">Selecciona tu Avatar Táctico:</label>
                <div class="onb-avatar-grid">
                  ${AVATAR_PRESETS.map(av => `
                    <div class="onb-avatar-item ${draft.avatar === av.id ? 'selected' : ''}" onclick="AppOnboarding.setAvatar('${av.id}')">
                      <span class="onb-av-icon">${av.icon}</span>
                      <span class="onb-av-name">${av.name}</span>
                    </div>
                  `).join('')}
                </div>
              </div>

              <button class="onb-btn-primary" onclick="AppOnboarding.nextStep(2)">
                CONTINUAR A BIOMETRÍA →
              </button>
            </div>
          ` : ''}

          ${step === 2 ? `
            <!-- PASO 2: BIOMETRÍA & METAS DE PESO -->
            <div class="onb-step-content">
              <div class="onb-header-title">
                <span class="onb-badge-tactical">MEDICIÓN CORPORAL</span>
                <h2>Biometría y Metas Físicas</h2>
                <p>Establece tu punto de partida para calibrar el volumen del protocolo.</p>
              </div>

              <div class="onb-grid-two">
                <div class="onb-form-group">
                  <label class="onb-label">Edad (Años):</label>
                  <input type="number" id="onbAge" class="onb-input" value="${draft.age}" min="15" max="85">
                </div>

                <div class="onb-form-group">
                  <label class="onb-label">Estatura (cm):</label>
                  <input type="number" id="onbHeight" class="onb-input" value="${draft.height}" min="120" max="230">
                </div>
              </div>

              <div class="onb-grid-two">
                <div class="onb-form-group">
                  <label class="onb-label">Peso Actual (kg):</label>
                  <input type="number" step="0.5" id="onbCurrentWeight" class="onb-input" value="${draft.currentWeight}" min="35" max="250">
                </div>

                <div class="onb-form-group">
                  <label class="onb-label">Meta Deseada (kg):</label>
                  <input type="number" step="0.5" id="onbTargetWeight" class="onb-input" value="${draft.targetWeight}" min="35" max="250">
                </div>
              </div>

              <!-- Live Feedback Card de IMC y Objetivo -->
              <div class="onb-calc-card">
                <div class="onb-calc-row">
                  <span>Índice IMC Estimado:</span>
                  <strong>${bmi} kg/m²</strong>
                </div>
                <div class="onb-calc-row">
                  <span>Ajuste de Peso Proyectado:</span>
                  <strong style="color:var(--primary-green);">
                    ${deltaW > 0 ? ('Reducción de ' + deltaW + ' kg de grasa') : (deltaW < 0 ? ('Ganancia de ' + Math.abs(deltaW) + ' kg de músculo') : 'Mantenimiento & Recomposición')}
                  </strong>
                </div>
              </div>

              <div class="onb-btns-row">
                <button class="onb-btn-secondary" onclick="AppOnboarding.prevStep(1)">← ATRÁS</button>
                <button class="onb-btn-primary" onclick="AppOnboarding.nextStep(3)">CONTINUAR A NIVEL →</button>
              </div>
            </div>
          ` : ''}

          ${step === 3 ? `
            <!-- PASO 3: NIVEL DE EXPERIENCIA Y TIEMPO -->
            <div class="onb-step-content">
              <div class="onb-header-title">
                <span class="onb-badge-tactical">CAPACIDAD OPERATIVA</span>
                <h2>Experiencia y Disponibilidad</h2>
                <p>Ajusta el volumen y descansos para entrenar de forma segura sin frustración.</p>
              </div>

              <!-- Nivel de Experiencia -->
              <div class="onb-form-group">
                <label class="onb-label">Nivel Actual en Calistenia:</label>
                <div class="onb-select-stack">
                  <div class="onb-stack-card ${draft.experienceLevel === 'principiante' ? 'selected' : ''}" onclick="AppOnboarding.setExperience('principiante')">
                    <div class="onb-stack-top">
                      <span class="badge-exp green">RECLUTA / INICIANTE</span>
                      <span class="exp-check">${draft.experienceLevel === 'principiante' ? '✓' : ''}</span>
                    </div>
                    <strong>Menos de 6 flexiones seguidas</strong>
                    <p>Descansos más amplios (30s), repeticiones suaves y versiones con rodillas apoyadas.</p>
                  </div>

                  <div class="onb-stack-card ${draft.experienceLevel === 'intermedio' ? 'selected' : ''}" onclick="AppOnboarding.setExperience('intermedio')">
                    <div class="onb-stack-top">
                      <span class="badge-exp yellow">SOLDADO / INTERMEDIO</span>
                      <span class="exp-check">${draft.experienceLevel === 'intermedio' ? '✓' : ''}</span>
                    </div>
                    <strong>Entre 8 y 20 flexiones continuas</strong>
                    <p>Ritmo militar balanceado, descansos estándar (20s) y series de alta intensidad.</p>
                  </div>

                  <div class="onb-stack-card ${draft.experienceLevel === 'avanzado' ? 'selected' : ''}" onclick="AppOnboarding.setExperience('avanzado')">
                    <div class="onb-stack-top">
                      <span class="badge-exp red">FUERZAS ESPECIALES / AVANZADO</span>
                      <span class="exp-check">${draft.experienceLevel === 'avanzado' ? '✓' : ''}</span>
                    </div>
                    <strong>Más de 20 flexiones estrictas y dominadas</strong>
                    <p>Máxima densidad, descansos ultracortos (15s) y variantes explosivas.</p>
                  </div>
                </div>
              </div>

              <!-- Tiempo Disponible -->
              <div class="onb-form-group">
                <label class="onb-label">Disponibilidad Diaria para la Misión:</label>
                <div class="onb-time-grid">
                  <div class="onb-time-chip ${draft.timeAvailability === 'express' ? 'selected' : ''}" onclick="AppOnboarding.setTime('express')">
                    <strong>⚡ 15-20 min</strong>
                    <span>Protocolo Express</span>
                  </div>

                  <div class="onb-time-chip ${draft.timeAvailability === 'estandar' ? 'selected' : ''}" onclick="AppOnboarding.setTime('estandar')">
                    <strong>⏱️ 25-35 min</strong>
                    <span>Estándar Militar</span>
                  </div>

                  <div class="onb-time-chip ${draft.timeAvailability === 'intensivo' ? 'selected' : ''}" onclick="AppOnboarding.setTime('intensivo')">
                    <strong>🔥 40+ min</strong>
                    <span>Intensivo Élite</span>
                  </div>
                </div>
              </div>

              <!-- Objetivo Principal -->
              <div class="onb-form-group">
                <label class="onb-label">Objetivo Principal del Entrenamiento:</label>
                <div class="onb-goal-grid">
                  <div class="onb-goal-pill ${draft.goal === 'perder-peso' ? 'selected' : ''}" onclick="AppOnboarding.setGoal('perder-peso')">
                    🔥 Perder Grasa & Definir
                  </div>
                  <div class="onb-goal-pill ${draft.goal === 'ganar-musculo' ? 'selected' : ''}" onclick="AppOnboarding.setGoal('ganar-musculo')">
                    🥩 Ganar Masa Magra
                  </div>
                  <div class="onb-goal-pill ${draft.goal === 'ganar-peso' ? 'selected' : ''}" onclick="AppOnboarding.setGoal('ganar-peso')">
                    ⚡ Ganar Peso & Volumen
                  </div>
                  <div class="onb-goal-pill ${draft.goal === 'mantener-peso' ? 'selected' : ''}" onclick="AppOnboarding.setGoal('mantener-peso')">
                    🥗 Salud & Condición
                  </div>
                </div>
              </div>

              <div class="onb-btns-row">
                <button class="onb-btn-secondary" onclick="AppOnboarding.prevStep(2)">← ATRÁS</button>
                <button class="onb-btn-primary" onclick="AppOnboarding.nextStep(4)">CONTINUAR A BLINDAJE →</button>
              </div>
            </div>
          ` : ''}

          ${step === 4 ? `
            <!-- PASO 4: BLINDAJE ARTICULAR & CUIDADOS FÍSICOS -->
            <div class="onb-step-content">
              <div class="onb-header-title">
                <span class="onb-badge-tactical">PREVENCIÓN DE LESIONES</span>
                <h2>Blindaje Articular Personalizado</h2>
                <p>Selecciona si tienes zonas con molestias previas para activar adaptaciones biomecánicas seguras.</p>
              </div>

              <div class="onb-joints-list">
                <div class="onb-joint-card ${draft.jointRestrictions.length === 0 ? 'selected' : ''}" onclick="AppOnboarding.toggleJoint('ninguna')">
                  <div class="joint-check">${draft.jointRestrictions.length === 0 ? '✓' : '○'}</div>
                  <div class="joint-info">
                    <strong>🛡️ 100% Operativo (Sin molestias articulares)</strong>
                    <span>Ejecutarás los ejercicios en su estándar militar completo.</span>
                  </div>
                </div>

                <div class="onb-joint-card ${draft.jointRestrictions.includes('munecas') ? 'selected' : ''}" onclick="AppOnboarding.toggleJoint('munecas')">
                  <div class="joint-check">${draft.jointRestrictions.includes('munecas') ? '✓' : '○'}</div>
                  <div class="joint-info">
                    <strong>✋ Muñecas Sensibles o Molestias</strong>
                    <span>El app indicará apoyo en nudillos neutros y antebrazos en flexiones y planchas.</span>
                  </div>
                </div>

                <div class="onb-joint-card ${draft.jointRestrictions.includes('rodillas') ? 'selected' : ''}" onclick="AppOnboarding.toggleJoint('rodillas')">
                  <div class="joint-check">${draft.jointRestrictions.includes('rodillas') ? '✓' : '○'}</div>
                  <div class="joint-info">
                    <strong>🦵 Rodillas Sensibles o Crujidos</strong>
                    <span>Sentadillas limitadas a 90° con tempo controlado y cero rebotes de impacto.</span>
                  </div>
                </div>

                <div class="onb-joint-card ${draft.jointRestrictions.includes('lumbar') ? 'selected' : ''}" onclick="AppOnboarding.toggleJoint('lumbar')">
                  <div class="joint-check">${draft.jointRestrictions.includes('lumbar') ? '✓' : '○'}</div>
                  <div class="joint-info">
                    <strong>🪵 Zona Lumbar / Espalda Baja</strong>
                    <span>Retroversión pélvica de protección en ejercicios de core y descompresión guiada.</span>
                  </div>
                </div>

                <div class="onb-joint-card ${draft.jointRestrictions.includes('hombros') ? 'selected' : ''}" onclick="AppOnboarding.toggleJoint('hombros')">
                  <div class="joint-check">${draft.jointRestrictions.includes('hombros') ? '✓' : '○'}</div>
                  <div class="joint-info">
                    <strong>🦾 Hombros o Manguito Rotador</strong>
                    <span>Activación escapular obligatoria en Pike Push-ups y fondos.</span>
                  </div>
                </div>
              </div>

              <div class="onb-security-note">
                🔒 <strong>Garantía de Seguridad:</strong> El Protocolo no promete milagros ni te pondrá en riesgo. Cada movimiento cuenta con su alternativa suave para cuidar tu salud articular.
              </div>

              <div class="onb-btns-row">
                <button class="onb-btn-secondary" onclick="AppOnboarding.prevStep(3)">← ATRÁS</button>
                <button class="onb-btn-primary" onclick="AppOnboarding.nextStep(5)">GENERAR DIAGNÓSTICO →</button>
              </div>
            </div>
          ` : ''}

          ${step === 5 ? `
            <!-- PASO 5: DIAGNÓSTICO TÁCTICO & ACTIVACIÓN -->
            <div class="onb-step-content">
              <div class="onb-header-title">
                <span class="onb-badge-tactical">PROTOCOLO CALIBRADO</span>
                <h2>Tu Centro de Mando está Listo</h2>
                <p>Hemos adaptado la programación de los 21 días exclusivamente a tu perfil biométrico.</p>
              </div>

              <!-- Resumen Táctico -->
              <div class="onb-summary-card">
                <div class="summary-hero-row">
                  <div class="summary-av-frame">${getAvatarDisplay(draft.avatar)}</div>
                  <div>
                    <span class="summary-badge-rank">R-1 RECLUTA EN SERVICIO</span>
                    <h3 class="summary-name">${draft.name}</h3>
                    <div class="summary-nickname">Indicativo: "${draft.nickname}"</div>
                  </div>
                </div>

                <div class="summary-specs-grid">
                  <div class="summary-spec-cell">
                    <span class="spec-cell-label">Enfoque Físico</span>
                    <strong class="spec-cell-val">${draft.gender === 'mujer' ? '👩 Tren Inferior & Cintura' : '👨 Tren Superior & Fuerza'}</strong>
                  </div>

                  <div class="summary-spec-cell">
                    <span class="spec-cell-label">Nivel Calibrado</span>
                    <strong class="spec-cell-val">${draft.experienceLevel.toUpperCase()}</strong>
                  </div>

                  <div class="summary-spec-cell">
                    <span class="spec-cell-label">Disponibilidad</span>
                    <strong class="spec-cell-val">${draft.timeAvailability === 'express' ? '15-20 min/día' : (draft.timeAvailability === 'intensivo' ? '40+ min/día' : '25-35 min/día')}</strong>
                  </div>

                  <div class="summary-spec-cell">
                    <span class="spec-cell-label">Agua Diaria</span>
                    <strong class="spec-cell-val" style="color:var(--primary-green);">${dailyWaterMl} ml</strong>
                  </div>

                  <div class="summary-spec-cell" style="grid-column: span 2;">
                    <span class="spec-cell-label">Blindaje Activo</span>
                    <strong class="spec-cell-val">
                      ${draft.jointRestrictions.length > 0 ? (draft.jointRestrictions.join(', ').toUpperCase() + ' PROTEGIDAS') : '100% OPERATIVO SIN RESTRICCIONES'}
                    </strong>
                  </div>
                </div>
              </div>

              <!-- GUÍA DE INSTALACIÓN PWA & ALERTAS TÁCTICAS -->
              <div class="pwa-guide-box">
                <div class="pwa-guide-header">
                  <div class="pwa-guide-title">
                    <span class="pwa-guide-ico">📲</span>
                    <div>
                      <strong>Instalar en Pantalla de Inicio</strong>
                      <span>Acceso directo rápido • Modo pantalla completa</span>
                    </div>
                  </div>
                  <span class="pwa-guide-tag">RECOMENDADO</span>
                </div>

                <div class="pwa-guide-tabs">
                  <button type="button" class="pwa-guide-tab-btn active" id="tabGuideIos" onclick="App.showInstallTab('ios')">
                    <span>🍏</span> iPhone (iOS Safari)
                  </button>
                  <button type="button" class="pwa-guide-tab-btn" id="tabGuideAndroid" onclick="App.showInstallTab('android')">
                    <span>🤖</span> Android (Chrome)
                  </button>
                </div>

                <div class="pwa-guide-steps" id="pwaStepsIos">
                  <div class="pwa-step-row">
                    <span class="step-num">1</span>
                    <span>Toca el botón <strong>Compartir</strong> (icono de cuadrado con flecha <span class="kbd-badge">⎙</span>) en la barra de Safari.</span>
                  </div>
                  <div class="pwa-step-row">
                    <span class="step-num">2</span>
                    <span>Desplázate hacia abajo y pulsa <strong>"Agregar a pantalla de inicio"</strong> (<span class="kbd-badge">➕</span>).</span>
                  </div>
                  <div class="pwa-step-row">
                    <span class="step-num">3</span>
                    <span>Toca <strong>"Agregar"</strong> en la esquina superior derecha. ¡Listo!</span>
                  </div>
                </div>

                <div class="pwa-guide-steps" id="pwaStepsAndroid" style="display:none;">
                  <div class="pwa-step-row">
                    <span class="step-num">1</span>
                    <span>Toca los <strong>tres puntos</strong> (<span class="kbd-badge">⋮</span>) en la esquina superior de Chrome.</span>
                  </div>
                  <div class="pwa-step-row">
                    <span class="step-num">2</span>
                    <span>Selecciona <strong>"Instalar aplicación"</strong> o "Añadir a pantalla principal".</span>
                  </div>
                  <div class="pwa-step-row">
                    <span class="step-num">3</span>
                    <span>Confirma y ábrela como app nativa directamente desde tu pantalla.</span>
                  </div>
                </div>

                <!-- ALERTA TÁCTICA / PUSH NOTIFICATIONS -->
                <div class="notif-optin-box">
                  <div class="notif-optin-header">
                    <span style="font-size:16px;">🔔</span>
                    <div>
                      <strong>Recordatorio Diario de Entrenamiento</strong>
                      <span>Alerta táctica en tu celular para no perder la racha</span>
                    </div>
                  </div>
                  <div class="notif-optin-controls">
                    <select id="onbReminderSelect" class="notif-time-select" onchange="App.setReminderHour(this.value)">
                      <option value="07:00">🌅 07:00 - Amanecer Táctico</option>
                      <option value="12:30">☀️ 12:30 - Pausa Operativa</option>
                      <option value="18:30" selected>⚡ 18:30 - Tarde de Acero (Recomendado)</option>
                      <option value="20:30">🌙 20:30 - Misión Nocturna</option>
                    </select>
                    <button type="button" class="btn-activate-notifs" id="btnSubscribePush" onclick="App.subscribeWebPush(this)">
                      <span>🔔 ACTIVAR RECORDATORIO</span>
                    </button>
                  </div>
                  <div class="notif-optin-footer">
                    ℹ️ Recibirás tu aviso diario en segundo plano para cumplir los 21 días.
                  </div>
                </div>
              </div>

              <!-- Botón de Activación Final -->
              <button class="onb-btn-activate-main" onclick="AppOnboarding.finish()">
                🚀 ACTIVAR MI CENTRO DE COMANDO TÁCTICO
              </button>

              <div style="text-align:center; margin-top:12px;">
                <button class="btn-link-edit" onclick="AppOnboarding.prevStep(1)">
                  Editar información de calibración
                </button>
              </div>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  }


  
  function renderAuthModal(mode = 'login') {
    return `
      <div class="edit-profile-modal-box auth-modal-tactical" style="max-width:400px;">
        <div class="edit-modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:18px;">🪖</span>
            <span style="font-size:13px; font-weight:800; color:#fff; text-transform:uppercase;">Cuenta Militar & Respaldo</span>
          </div>
          <button class="btn-close-modal" onclick="App.closeAuthModal()">✕</button>
        </div>

        <!-- Tabs de Alternância Tática -->
        <div class="auth-tabs-nav">
          <button type="button" class="auth-tab-pill ${mode === 'login' ? 'active' : ''}" onclick="App.setAuthModalMode('login')">
            INGRESAR
          </button>
          <button type="button" class="auth-tab-pill ${mode === 'register' ? 'active' : ''}" onclick="App.setAuthModalMode('register')">
            ACTIVAR CUENTA
          </button>
          <button type="button" class="auth-tab-pill ${mode === 'recover' ? 'active' : ''}" onclick="App.setAuthModalMode('recover')">
            RECUPERAR
          </button>
        </div>

        ${mode === 'recover' ? `
          <div style="font-size:12px; color:#a1a1aa; margin-bottom:14px; line-height:1.5;">
            Ingresa el correo electrónico utilizado en tu compra del Protocolo. Te enviaremos un enlace de acceso para restablecer tu contraseña.
          </div>
          <form onsubmit="App.handlePasswordRecoverySubmit(event)">
            <div class="form-group" style="margin-bottom:14px;">
              <label style="font-size:11px; color:#fff; font-weight:700;">Correo Electrónico de Compra:</label>
              <input type="email" id="authEmailInput" required placeholder="tu@correo.com" class="comment-input" style="width:100%; margin-top:4px;">
            </div>
            <button type="submit" class="btn-start-mission" style="width:100%;" id="btnRecoverSubmit">
              ENVIAR ENLACE DE RECUPERACIÓN
            </button>
          </form>
        ` : `
          <div style="font-size:12px; color:#a1a1aa; margin-bottom:14px; line-height:1.5;">
            ${mode === 'register' 
              ? 'Activa tu acceso con el mismo correo registrado en tu compra para sincronizar tus 21 días y membresías.'
              : 'Ingresa a tu Centro de Mando para sincronizar tu progreso de 21 días, recetas y rango militar.'}
          </div>
          <form onsubmit="App.handleAuthSubmit(event, '${mode}')">
            ${mode === 'register' ? `
              <div class="form-group" style="margin-bottom:10px;">
                <label style="font-size:11px; color:#fff; font-weight:700;">Nombre del Soldado:</label>
                <input type="text" id="authNameInput" required placeholder="Tu nombre o apodo militar" class="comment-input" style="width:100%; margin-top:4px;">
              </div>
            ` : ''}
            <div class="form-group" style="margin-bottom:10px;">
              <label style="font-size:11px; color:#fff; font-weight:700;">Correo Electrónico:</label>
              <input type="email" id="authEmailInput" required placeholder="tu@correo.com" class="comment-input" style="width:100%; margin-top:4px;">
            </div>
            <div class="form-group" style="margin-bottom:14px;">
              <div style="display:flex; justify-content:space-between; align-items:center;">
                <label style="font-size:11px; color:#fff; font-weight:700;">Contraseña:</label>
                ${mode === 'login' ? `
                  <a href="javascript:void(0)" onclick="App.setAuthModalMode('recover')" style="font-size:10.5px; color:#22c55e; text-decoration:none;">¿Olvidaste tu contraseña?</a>
                ` : ''}
              </div>
              <input type="password" id="authPasswordInput" required minlength="6" placeholder="Mínimo 6 caracteres" class="comment-input" style="width:100%; margin-top:4px;">
            </div>
            <button type="submit" class="btn-start-mission" style="width:100%;" id="btnAuthSubmit">
              ${mode === 'register' ? 'ACTIVAR MI CUENTA MILITAR' : 'INICIAR SESIÓN EN EL CUARTEL'}
            </button>
          </form>
        `}
      </div>
    `;
  }

  function getMedalsList(state) {
    const p = (state && state.profile) || {};
    const completedCount = (state && state.progress && state.progress.completedDays) ? state.progress.completedDays.length : 0;
    const streak = (state && state.progress && state.progress.streak) ? state.progress.streak : 0;
    const weightCount = (state && state.weightLog) ? state.weightLog.length : 0;
    const mealsCount = (state && state.nutrition && state.nutrition.meals) ? state.nutrition.meals.length : 0;
    const waterGlasses = (state && state.nutrition && state.nutrition.waterGlasses) ? state.nutrition.waterGlasses : 0;

    return [
      {
        id: 'first_mission',
        icon: '🎖️',
        title: 'Bautismo de Fuego',
        desc: 'Completar Día 1 de combate',
        category: 'combate',
        categoryName: 'Operaciones',
        tier: 'bronce',
        tierName: 'Bronce',
        xpReward: 50,
        requirement: 'Concluye con éxito la primera sesión de entrenamiento del Protocolo.',
        lore: 'El primer paso separa la intención de la acción. Marca el ingreso oficial a la disciplina militar.',
        unlocked: completedCount >= 1,
        progressPct: Math.min(100, Math.round((completedCount / 1) * 100)),
        progressText: completedCount >= 1 ? '1/1 Misión cumplida' : '0/1 Misión cumplida'
      },
      {
        id: 'streak_3',
        icon: '⚡',
        title: 'Disciplina Táctica',
        desc: 'Racha de 3 días consecutivos',
        category: 'constancia',
        categoryName: 'Constancia',
        tier: 'bronce',
        tierName: 'Bronce',
        xpReward: 100,
        requirement: 'Mantén el hábito activo sin interrupciones durante 3 jornadas consecutivas.',
        lore: 'La motivación inicial se evapora. La constancia militar toma el control del cuerpo.',
        unlocked: streak >= 3,
        progressPct: Math.min(100, Math.round((streak / 3) * 100)),
        progressText: `${Math.min(streak, 3)}/3 Días activos`
      },
      {
        id: 'streak_7',
        icon: '🔥',
        title: 'Semana de Acero',
        desc: 'Racha ininterrumpida de 7 días',
        category: 'constancia',
        categoryName: 'Constancia',
        tier: 'plata',
        tierName: 'Plata',
        xpReward: 200,
        requirement: 'Supera los primeros 7 días sin fallar ninguna sesión de entrenamiento.',
        lore: 'La mayoría se rinde antes del día 7. Tú estás forjando una armadura corporal resistente.',
        unlocked: streak >= 7,
        progressPct: Math.min(100, Math.round((streak / 7) * 100)),
        progressText: `${Math.min(streak, 7)}/7 Días activos`
      },
      {
        id: 'weight_calibrated',
        icon: '⚖️',
        title: 'Control Biométrico',
        desc: '2+ registros en el historial de peso',
        category: 'biometria',
        categoryName: 'Evolución',
        tier: 'bronce',
        tierName: 'Bronce',
        xpReward: 75,
        requirement: 'Anota al menos 2 pesajes en la pestaña Evolución para generar tu gráfica de tendencia.',
        lore: 'El radar de pesaje permite calibrar las calorías y confirmar la recomposición corporal.',
        unlocked: weightCount >= 2,
        progressPct: Math.min(100, Math.round((weightCount / 2) * 100)),
        progressText: `${Math.min(weightCount, 2)}/2 Pesajes registrados`
      },
      {
        id: 'joint_shield',
        icon: '🛡️',
        title: 'Blindaje Activo',
        desc: 'Protección articular configurada',
        category: 'blindaje',
        categoryName: 'Blindaje',
        tier: 'plata',
        tierName: 'Plata',
        xpReward: 100,
        requirement: 'Activa tu blindaje para muñecas, rodillas o lumbares en la pestaña Blindaje.',
        lore: 'Un soldado lesionado queda inoperativo. El blindaje garantiza longevidad biomecánica.',
        unlocked: Boolean(p.jointProtection),
        progressPct: p.jointProtection ? 100 : 0,
        progressText: p.jointProtection ? 'Blindaje calibrado' : 'Pendiente activar'
      },
      {
        id: 'nutrition_scout',
        icon: '🥩',
        title: 'Munición Nutricional',
        desc: '2+ comidas registradas en el diario',
        category: 'nutricion',
        categoryName: 'Nutrición',
        tier: 'bronce',
        tierName: 'Bronce',
        xpReward: 75,
        requirement: 'Registra al menos 2 comidas en tu diario para auditar proteínas y energía.',
        lore: 'No se puede vencer una mala alimentación con puro entrenamiento. La cocina es el cuartel.',
        unlocked: mealsCount >= 2,
        progressPct: Math.min(100, Math.round((mealsCount / 2) * 100)),
        progressText: `${Math.min(mealsCount, 2)}/2 Comidas guardadas`
      },
      {
        id: 'hydration_master',
        icon: '💧',
        title: 'Hidratación Táctica',
        desc: '8+ vasos de agua en un día',
        category: 'nutricion',
        categoryName: 'Nutrición',
        tier: 'bronce',
        tierName: 'Bronce',
        xpReward: 50,
        requirement: 'Cumple la meta táctica diaria de al menos 8 vasos de agua potable.',
        lore: 'El músculo es 75% agua. La hidratación adecuada optimiza la recuperación y la fuerza.',
        unlocked: waterGlasses >= 8,
        progressPct: Math.min(100, Math.round((waterGlasses / 8) * 100)),
        progressText: `${Math.min(waterGlasses, 8)}/8 Vasos de agua`
      },
      {
        id: 'graduated_21',
        icon: '🥇',
        title: 'Veterano 21 Días',
        desc: 'Completar las 21 Misiones de Fase 1',
        category: 'combate',
        categoryName: 'Élite',
        tier: 'oro',
        tierName: 'Oro',
        xpReward: 500,
        requirement: 'Supera el Día 21 del Protocolo y conquista tu transformación física.',
        lore: 'La máxima condecoración del ciclo inicial. Has ingresado formalmente a la tropa veterana.',
        unlocked: completedCount >= 21,
        progressPct: Math.min(100, Math.round((completedCount / 21) * 100)),
        progressText: `${Math.min(completedCount, 21)}/21 Días concluidos`
      }
    ];
  }

  function renderBadgeInspectModal(medalId, state) {
    const medals = getMedalsList(state);
    const m = medals.find(x => x.id === medalId) || medals[0];

    return `
      <div class="edit-profile-modal-box badge-inspect-box">
        <div class="edit-modal-header">
          <div style="display:flex; align-items:center; gap:8px;">
            <span style="font-size:16px;">🎖️</span>
            <span style="font-size:13px; font-weight:800; color:#fff; text-transform:uppercase; letter-spacing:0.5px;">Expediente de Condecoración</span>
          </div>
          <button class="btn-close-modal" onclick="App.closeEditProfileModal()">✕</button>
        </div>

        <div class="badge-inspect-crest-wrap ${m.unlocked ? 'unlocked' : 'locked'} tier-${m.tier}">
          <div class="badge-inspect-emoji">${m.icon}</div>
          <span class="badge-inspect-tier-pill ${m.tier}">NIVEL ${m.tierName.toUpperCase()}</span>
        </div>

        <h3 class="badge-inspect-title">${m.title}</h3>
        <div class="badge-inspect-category">${m.categoryName.toUpperCase()} • +${m.xpReward} XP TÁCTICOS</div>

        <div class="badge-inspect-lore-card">
          <p class="badge-lore-quote">"${m.lore}"</p>
        </div>

        <div class="badge-inspect-req-box">
          <div class="req-box-header">
            <strong>REQUISITO OPERATIVO:</strong>
            <span class="req-status-pill ${m.unlocked ? 'done' : 'pending'}">
              ${m.unlocked ? '✓ CUMPLIDO' : '🔒 EN CURSO'}
            </span>
          </div>
          <p class="req-box-text">${m.requirement}</p>
          <div class="badge-progress-wrap">
            <div class="badge-progress-fill" style="width: ${m.progressPct}%;"></div>
          </div>
          <div class="badge-progress-label">Progreso actual: <strong>${m.progressText} (${m.progressPct}%)</strong></div>
        </div>

        <button class="btn-start-mission" style="width:100%; margin-top:14px;" onclick="App.closeEditProfileModal()">
          ENTENDIDO, VOLVER AL PERFIL
        </button>
      </div>
    `;
  }

  window.Views = {
    renderAuthModal,
    renderBadgeInspectModal,
    getMedalsList,
    renderOnboarding,
    renderMisiones,
    renderNutricion,
    renderBlindaje,
    renderEvolucion,
    renderPerfil,
    renderComunidad,
    renderEditProfileModal,
    renderVipScannerOfferModal,
    getAvatarDisplay,
    AVATAR_PRESETS
  };

})();