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
  }

  function closePlayer() {
    clearInterval(timerInterval);
    if (typeof window !== 'undefined' && window.ExerciseAnimator) window.ExerciseAnimator.stop();
    const overlay = document.getElementById(playerContainerId);
    if (overlay) {
      overlay.style.display = 'none';
      overlay.innerHTML = '';
    }
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
        <div>
          <span class="user-rank-name">${currentWorkout.title}</span>
          <div style="font-size:11px; color:#71717a;">${isBlindajeRoutine ? 'MOVILIDAD' : `RONDA ${currentRound}/${currentWorkout.rounds}`} • EJERCICIO ${currentExerciseIdx + 1}/${currentWorkout.exercises.length}</div>
        </div>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()">&times;</button>
      </div>

      <div class="player-progress-bar">
        <div class="player-progress-fill" style="width:${progressPct}%"></div>
      </div>

      <div class="player-center-stage">
        <div class="player-phase-title">${ex.focus}</div>
        <div class="player-ex-name">${activeName}</div>
        
        ${(currentWorkout.jointProtected || ex.isSafeVariantActive) ? `
          <div class="joint-safe-active-banner">
            <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="#22c55e" stroke-width="2.5"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/></svg>
            <span>ARTICULACIÓN SEGURA ACTIVA</span>
          </div>
        ` : ''}

        <!-- Animación Cinemática Táctica SVG (Silueta Humana Lateral en Bucle) -->
        <div class="player-athlete-frame">
          <div id="exerciseAnimatorBox" class="exercise-animator-box" style="width:100%; height:100%; min-height:180px; display:flex; align-items:center; justify-content:center;"></div>
          <div class="player-athlete-overlay">
            <span class="player-athlete-reps">${ex.targetReps || ex.reps || ''}</span>
          </div>
        </div>

        ${ex.beginnerMod ? `
          <button class="player-mod-toggle ${isModifiedVersion ? 'active' : ''}" onclick="WorkoutPlayer.toggleMod()">
            ${isModifiedVersion ? '🛡️ Modo Suave (Activo)' : '🛡️ Cambiar a Modificación Suave'}
          </button>
        ` : ''}

        <div class="player-timer-circle" id="playerTimerCircle">
          <div class="player-timer-digits" id="timerDigits">${formatTime(secondsRemaining)}</div>
          <div class="player-timer-label">EN ACCIÓN</div>
        </div>

        <div class="player-cues-box">
          <strong>Indicación de Postura:</strong>
          ${activeCues.map(c => `<div>• ${c}</div>`).join('')}
        </div>

        <div class="player-controls">
          <button class="player-btn-secondary" onclick="WorkoutPlayer.prevExercise()" title="Anterior">‹</button>
          <button class="player-btn-primary" onclick="WorkoutPlayer.togglePause()" id="btnPlayPause">⏸</button>
          <button class="player-btn-secondary" onclick="WorkoutPlayer.nextExercise()" title="Siguiente">›</button>
        </div>
      </div>
    `;

    // Iniciar Animación Cinemática Táctica en SVG si no hay video reproduciéndose
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
        <span class="user-rank-name">PAUSA TÁCTICA</span>
        <button class="player-close-btn" onclick="WorkoutPlayer.close()">&times;</button>
      </div>

      <div class="player-center-stage">
        <div class="player-phase-title" style="color:var(--tactical-gold);">RECUPERACIÓN Y RESPIRACIÓN</div>
        <div class="player-ex-name" style="font-size:20px;">Toma aire e hidrátate</div>

        <div class="player-timer-circle rest-state" id="playerTimerCircle">
          <div class="player-timer-digits text-gold" id="timerDigits">${formatTime(secondsRemaining)}</div>
          <div class="player-timer-label">DESCANSO</div>
        </div>

        <div class="card-tactical" style="width:100%; max-width:360px; margin-top:10px;">
          <div style="font-size:11px; color:#71717a; text-transform:uppercase;">A continuación:</div>
          <div style="font-size:14px; font-weight:700; color:#fff; margin-top:2px;">${nextExName}</div>
        </div>

        <div class="player-controls">
          <button class="btn-start-mission" style="font-size:13px; padding:12px 20px; width:auto;" onclick="WorkoutPlayer.skipRest()">
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