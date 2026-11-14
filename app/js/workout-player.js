/**
 * Interactive Workout Player with Timers, Web Audio Beeps, and Exercise Loops
 * Includes:
 * - Anti-cheat progressive lock verification
 * - Dedicated support for Blindaje & Mobility guided routines
 */
(function() {
  'use strict';

  function triggerVibrate(pattern) {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try { navigator.vibrate(pattern); } catch(e) {}
    }
  }

  let currentWorkout = null;
  let currentRound = 1;
  let currentExerciseIdx = 0;
  let playerState = 'idle'; // 'countdown' | 'work' | 'rest' | 'paused' | 'completed'
  let secondsRemaining = 0;
  let timerInterval = null;
  let isModifiedVersion = false;
  let isBlindajeRoutine = false;

  const playerContainerId = 'workoutPlayerContainer';

  function startWorkout(dayNumber) {
    // Verificação estrita de bloqueio progressivo
    if (!ProtocoloStore.canStartDay(dayNumber)) {
      alert(`🔒 Misión Bloqueada\n\nPara desbloquear el Día ${dayNumber}, primero debes completar la misión del Día ${dayNumber - 1}. ¡Disciplina militar!`);
      return;
    }

    const state = ProtocoloStore.getState();
    const dayPlan = ExercisesDB.getDayPlan(dayNumber, state.profile);

    currentWorkout = dayPlan;
    currentRound = 1;
    currentExerciseIdx = 0;
    isModifiedVersion = !!state.profile.jointProtection;
    isBlindajeRoutine = false;

    renderPlayerShell();
    startCountdown(() => {
      startExercise();
    });
  }

  function startBlindajeRoutine(routine) {
    currentWorkout = {
      day: null,
      title: routine.title,
      rounds: 1,
      calories: routine.calories || '~60 kcal',
      exercises: routine.exercises
    };
    currentRound = 1;
    currentExerciseIdx = 0;
    isModifiedVersion = false;
    isBlindajeRoutine = true;

    renderPlayerShell();
    startCountdown(() => {
      startExercise();
    });
  }

  function renderPlayerShell() {
    let overlay = document.getElementById(playerContainerId);
    if (!overlay) {
      overlay = document.createElement('div');
      overlay.id = playerContainerId;
      overlay.className = 'workout-player-overlay';
      document.body.appendChild(overlay);
    }
    overlay.style.display = 'flex';
    document.body.classList.add('workout-player-active');
  }

  function closePlayer() {
    clearInterval(timerInterval);
    if (typeof window !== 'undefined' && window.ExerciseAnimator) window.ExerciseAnimator.stop();
    const overlay = document.getElementById(playerContainerId);
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
    document.body.classList.remove('workout-player-active');
    currentWorkout = null;
    playerState = 'idle';
  }

  function startCountdown(onComplete) {
    playerState = 'countdown';
    let count = 3;
    ProtocoloStore.audioBeep.tick();

    updateCountdownUI(count);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      count--;
      if (count > 0) {
        ProtocoloStore.audioBeep.tick();
        updateCountdownUI(count);
      } else {
        clearInterval(timerInterval);
        ProtocoloStore.audioBeep.go();
        if (onComplete) onComplete();
      }
    }, 1000);
  }

  function updateCountdownUI(count) {
    const overlay = document.getElementById(playerContainerId);
    if (!overlay || !currentWorkout) return;
    const ex = currentWorkout.exercises[currentExerciseIdx];

    overlay.innerHTML = `
      <div class="player-top-bar">
        <span class="user-rank-name">${currentWorkout.title}</span>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()">&times;</button>
      </div>
      <div class="player-center-stage">
        <div class="player-phase-title">PREPÁRATE • ${isBlindajeRoutine ? 'RUTINA DE BLINDAJE' : `RONDA ${currentRound} DE ${currentWorkout.rounds}`}</div>
        <div class="player-ex-name">${isModifiedVersion && ex.beginnerMod ? ex.beginnerMod.name : ex.name}</div>
        <div class="player-timer-circle">
          <div class="player-timer-digits text-green">${count}</div>
          <div class="player-timer-label">LISTO</div>
        </div>
        <p class="text-dim" style="font-size:13px;">Respira profundo y toma la posición</p>
      </div>
    `;
  }

  function startExercise() {
    playerState = 'work';
    const ex = currentWorkout.exercises[currentExerciseIdx];
    secondsRemaining = ex.workSec || 40;

    triggerVibrate([80, 40, 80]);
    renderActiveWorkoutUI();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 3 && secondsRemaining > 0) {
        ProtocoloStore.audioBeep.warning();
        triggerVibrate(50);
      }
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        ProtocoloStore.audioBeep.rest();
        triggerVibrate(120);
        startRest();
      } else {
        updateTimerDigits();
      }
    }, 1000);
  }

  function startRest() {
    playerState = 'rest';
    const ex = currentWorkout.exercises[currentExerciseIdx];
    secondsRemaining = ex.restSec || 15;

    let nextExName = '';
    let nextRound = currentRound;
    if (currentExerciseIdx + 1 < currentWorkout.exercises.length) {
      nextExName = currentWorkout.exercises[currentExerciseIdx + 1].name;
    } else if (currentRound < currentWorkout.rounds) {
      nextRound = currentRound + 1;
      nextExName = currentWorkout.exercises[0].name + ` (Ronda ${nextRound})`;
    } else {
      nextExName = '¡Fin de la Sesión!';
    }

    renderRestUI(nextExName);
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 3 && secondsRemaining > 0) {
        ProtocoloStore.audioBeep.warning();
      }
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        advanceToNextExercise();
      } else {
        updateTimerDigits();
      }
    }, 1000);
  }

  function advanceToNextExercise() {
    if (currentExerciseIdx + 1 < currentWorkout.exercises.length) {
      currentExerciseIdx++;
    } else if (currentRound < currentWorkout.rounds) {
      currentRound++;
      currentExerciseIdx = 0;
    } else {
      completeWorkout();
      return;
    }
    ProtocoloStore.audioBeep.go();
    startExercise();
  }

  function completeWorkout() {
    playerState = 'completed';
    clearInterval(timerInterval);
    document.body.classList.remove('workout-player-active');
    triggerVibrate([100, 60, 100, 60, 250]);

    if (currentWorkout.day) {
      // Treino principal dos 21 dias
      ProtocoloStore.actions.completeMission(currentWorkout.day, 150);
    } else {
      // Rotina de Blindagem
      ProtocoloStore.getState().progress.points += 50;
      ProtocoloStore.audioBeep.complete();
    }

    const overlay = document.getElementById(playerContainerId);
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="player-top-bar">
        <span></span>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()">&times;</button>
      </div>
      <div class="player-center-stage celebration-view">
        <div class="celebration-icon">🎖️</div>
        <div class="user-rank-name">${isBlindajeRoutine ? 'BLINDAJE COMPLETADO' : 'MISIÓN CUMPLIDA'}</div>
        <div class="celebration-title">${currentWorkout.day ? `¡Día ${currentWorkout.day} Finalizado!` : currentWorkout.title}</div>
        <div class="celebration-points">+${currentWorkout.day ? '150' : '50'} PUNTOS TÁCTICOS GANADOS</div>
        
        <div class="card-tactical highlight" style="width:100%; max-width:360px; margin-bottom:24px; text-align:left;">
          <div style="font-size:13px; color:#fff; font-weight:700; margin-bottom:6px;">Registro Táctico:</div>
          <div style="font-size:12px; color:#a1a1aa; line-height:1.5;">
            ✓ ${currentWorkout.rounds} ${currentWorkout.rounds > 1 ? 'rondas completadas' : 'secuencia guiada'}<br>
            ✓ Calorías estimadas: ${currentWorkout.calories}<br>
            ✓ Salud articular y consistencia blindadas
          </div>
        </div>

        <button class="btn-start-mission" onclick="WorkoutPlayer.close()">
          VOLVER AL CENTRO DE COMANDO
        </button>
      </div>
    `;
  }

  function toggleModVersion() {
    isModifiedVersion = !isModifiedVersion;
    renderActiveWorkoutUI();
  }

  function togglePause() {
    if (playerState === 'work' || playerState === 'rest') {
      clearInterval(timerInterval);
      playerState = playerState === 'work' ? 'work_paused' : 'rest_paused';
      renderPauseUI();
    } else if (playerState === 'work_paused') {
      playerState = 'work';
      resumeTimer(startRest);
    } else if (playerState === 'rest_paused') {
      playerState = 'rest';
      resumeTimer(advanceToNextExercise);
    }
  }

  function resumeTimer(onZero) {
    renderActiveWorkoutUI();
    clearInterval(timerInterval);
    timerInterval = setInterval(() => {
      secondsRemaining--;
      if (secondsRemaining <= 3 && secondsRemaining > 0) ProtocoloStore.audioBeep.warning();
      if (secondsRemaining <= 0) {
        clearInterval(timerInterval);
        if (onZero) onZero();
      } else {
        updateTimerDigits();
      }
    }, 1000);
  }

  function renderActiveWorkoutUI() {
    const overlay = document.getElementById(playerContainerId);
    if (!overlay || !currentWorkout) return;

    const ex = currentWorkout.exercises[currentExerciseIdx];
    const totalSteps = currentWorkout.rounds * currentWorkout.exercises.length;
    const currentStep = (currentRound - 1) * currentWorkout.exercises.length + currentExerciseIdx + 1;
    const progressPct = Math.round((currentStep / totalSteps) * 100);

    const activeName = isModifiedVersion && ex.beginnerMod ? ex.beginnerMod.name : ex.name;
    const activeCues = isModifiedVersion && ex.beginnerMod ? ex.beginnerMod.cues : ex.cues;

    overlay.innerHTML = `
      <div class="player-top-bar">
        <div class="player-top-info">
          <span class="user-rank-name">${currentWorkout.title}</span>
          <div class="player-step-counter">${isBlindajeRoutine ? 'MOVILIDAD' : `RONDA ${currentRound}/${currentWorkout.rounds}`} • EJERCICIO ${currentExerciseIdx + 1}/${currentWorkout.exercises.length}</div>
        </div>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()" title="Salir del entrenamiento" aria-label="Cerrar">&times;</button>
      </div>

      <div class="player-progress-bar">
        <div class="player-progress-fill" style="width:${progressPct}%"></div>
      </div>

      <div class="player-center-stage">
        <!-- Encabezado con Enfoque y Nombre del Ejercicio -->
        <div class="player-header-card">
          <div class="player-phase-title">${ex.focus || 'CALISTENIA MILITAR'}</div>
          <h2 class="player-ex-name">${activeName}</h2>
          
          <div class="player-meta-badges">
            <span class="player-pill-reps">🎯 ${ex.targetReps || ex.reps || 'Por tiempo'}</span>
            ${ex.tempo ? `<span class="player-pill-tempo">⏱️ Tempo ${ex.tempo}</span>` : ''}
            ${(currentWorkout.jointProtected || ex.isSafeVariantActive) ? `
              <span class="player-pill-safe">🛡️ Articulación Segura</span>
            ` : ''}
          </div>
        </div>

        <!-- Escenario del Atleta 100% Libre de Textos Superpuestos -->
        <div class="player-athlete-frame">
          <div id="exerciseAnimatorBox" class="exercise-animator-box"></div>
        </div>

        ${ex.beginnerMod ? `
          <button class="player-mod-toggle ${isModifiedVersion ? 'active' : ''}" onclick="WorkoutPlayer.toggleMod()">
            ${isModifiedVersion ? '🛡️ Modo Suave Activo (Toca para versión estándar)' : '🛡️ Cambiar a Modificación Suave'}
          </button>
        ` : ''}

        <!-- Dock Integrado: Timer Centralizado y Controles Tácticos -->
        <div class="player-dock-strip">
          <button class="player-btn-secondary" onclick="WorkoutPlayer.prevExercise()" title="Anterior" aria-label="Anterior">‹</button>

          <div class="player-timer-circle" id="playerTimerCircle">
            <div class="player-timer-digits" id="timerDigits">${formatTime(secondsRemaining)}</div>
            <div class="player-timer-label">EN ACCIÓN</div>
          </div>

          <button class="player-btn-primary" onclick="WorkoutPlayer.togglePause()" id="btnPlayPause" title="Pausar / Reanudar" aria-label="Play/Pausa">⏸</button>

          <button class="player-btn-secondary" onclick="WorkoutPlayer.nextExercise()" title="Siguiente" aria-label="Siguiente">›</button>
        </div>

        <!-- Indicación de Postura (Organizada, Sin Cortes de Palabras) -->
        <div class="player-cues-box">
          <div class="player-cues-title">🎯 INDICACIÓN DE POSTURA:</div>
          <div class="player-cues-list">
            ${activeCues.map(c => `<div class="player-cue-item">• ${c}</div>`).join('')}
          </div>
        </div>
      </div>
    `;

    // Iniciar Animación Cinemática Táctica en SVG
    setTimeout(() => {
      const animBox = document.getElementById('exerciseAnimatorBox');
      if (animBox && typeof window !== 'undefined' && window.ExerciseAnimator) {
        const isSafe = Boolean(currentWorkout.jointProtected || ex.isSafeVariantActive || ex.isSafeVariant || isModifiedVersion);
        window.ExerciseAnimator.render(animBox, ex.id, isSafe, ex.tempo);
      }
    }, 20);
  }

  function renderRestUI(nextExName) {
    const overlay = document.getElementById(playerContainerId);
    if (!overlay) return;

    overlay.innerHTML = `
      <div class="player-top-bar">
        <div class="player-top-info">
          <span class="user-rank-name">PAUSA TÁCTICA</span>
          <div class="player-step-counter">RECUPERACIÓN Y RESPIRACIÓN</div>
        </div>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()" title="Salir" aria-label="Cerrar">&times;</button>
      </div>

      <div class="player-center-stage">
        <div class="player-header-card">
          <div class="player-phase-title" style="color:var(--tactical-gold);">FASE DE DESCANSO</div>
          <h2 class="player-ex-name" style="font-size:20px;">Toma aire e hidrátate</h2>
        </div>

        <div class="player-timer-circle rest-state" id="playerTimerCircle" style="margin: 24px auto;">
          <div class="player-timer-digits text-gold" id="timerDigits">${formatTime(secondsRemaining)}</div>
          <div class="player-timer-label">DESCANSO</div>
        </div>

        <div class="card-tactical" style="width:100%; max-width:400px; margin: 12px auto; text-align:center; background:#121612; border:1px solid rgba(255,255,255,0.08); border-radius:12px; padding:14px;">
          <div style="font-size:11px; color:#71717a; text-transform:uppercase; letter-spacing:1px; font-weight:700;">A continuación:</div>
          <div style="font-size:16px; font-weight:800; color:#fff; margin-top:4px;">${nextExName}</div>
        </div>

        <div class="player-controls" style="margin-top:20px;">
          <button class="btn-start-mission" style="font-size:13px; font-weight:800; padding:14px 28px; width:auto; border-radius:999px; box-shadow:0 4px 20px rgba(34,197,94,0.35);" onclick="WorkoutPlayer.skipRest()">
            SALTAR DESCANSO ›
          </button>
        </div>
      </div>
    `;
  }

  function renderPauseUI() {
    const btn = document.getElementById('btnPlayPause');
    if (btn) btn.innerHTML = '▶';
  }

  function updateTimerDigits() {
    const el = document.getElementById('timerDigits');
    if (el) el.textContent = formatTime(secondsRemaining);
  }

  function formatTime(s) {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m > 0 ? m + ':' : ''}${sec < 10 ? '0' : ''}${sec}`;
  }

  window.WorkoutPlayer = {
    start: startWorkout,
    startBlindaje: startBlindajeRoutine,
    close: closePlayer,
    togglePause,
    toggleMod: toggleModVersion,
    skipRest: () => {
      clearInterval(timerInterval);
      advanceToNextExercise();
    },
    nextExercise: () => {
      clearInterval(timerInterval);
      advanceToNextExercise();
    },
    prevExercise: () => {
      clearInterval(timerInterval);
      if (currentExerciseIdx > 0) currentExerciseIdx--;
      startExercise();
    }
  };

})();