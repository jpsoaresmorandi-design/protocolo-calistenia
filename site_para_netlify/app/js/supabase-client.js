/**
 * Supabase Client & Cloud Integration Adapter
 * Permite conexão segura com o backend Supabase, execução de Edge Functions,
 * autenticação de usuários, sincronização de perfil/progresso e feed real da comunidade.
 * Suporta fallback resiliente offline caso o usuário ainda não tenha configurado as chaves.
 */
(function() {
  'use strict';

  const STORAGE_KEY_CONFIG = 'protocolo_supabase_config_v1';
  const STORAGE_KEY_USER = 'protocolo_supabase_user_v1';

  // Configuração Oficial de Produção do Supabase
  const DEFAULT_SUPABASE_URL = 'https://roomyqvuwaotnwgceahe.supabase.co';
  const DEFAULT_SUPABASE_KEY = 'sb_publishable_iqrFq3ns5Lyd9QT3QHgKMA_0-kciliC';

  function getStoredConfig() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_CONFIG);
      if (raw) {
        const parsed = JSON.parse(raw);
        if (parsed.url && parsed.anonKey) return parsed;
      }
    } catch (e) {}
    return { url: DEFAULT_SUPABASE_URL, anonKey: DEFAULT_SUPABASE_KEY, token: null };
  }

  function getStoredUser() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY_USER);
      if (raw) return JSON.parse(raw);
    } catch (e) {}
    return null;
  }

  let config = getStoredConfig();
  if (!config.url || !config.anonKey) {
    config.url = DEFAULT_SUPABASE_URL;
    config.anonKey = DEFAULT_SUPABASE_KEY;
  }
  let currentUser = getStoredUser();

  const SupabaseClient = {
    isConfigured() {
      return Boolean(config.url && config.anonKey);
    },

    isAuthenticated() {
      return Boolean(config.token && currentUser);
    },

    getConfig() {
      return { ...config };
    },

    getUser() {
      return currentUser;
    },

    setCredentials(url, anonKey) {
      config.url = (url || '').trim().replace(/\/+$/, '');
      config.anonKey = (anonKey || '').trim();
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
      } catch (e) {}
      console.log('Supabase configurado:', config.url ? 'Ativo' : 'Desativado');
      return this.isConfigured();
    },

    setAuthSession(token, user) {
      config.token = token;
      currentUser = user;
      try {
        localStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
        if (user) {
          localStorage.setItem(STORAGE_KEY_USER, JSON.stringify(user));
        } else {
          localStorage.removeItem(STORAGE_KEY_USER);
        }
      } catch (e) {}
    },

    getHeaders() {
      return {
        'Content-Type': 'application/json',
        'apikey': config.anonKey,
        'Authorization': `Bearer ${config.token || config.anonKey}`
      };
    },

    // --- AUTENTICAÇÃO SUPABASE AUTH ---
    async signUp(email, password, metadata = {}) {
      if (!this.isConfigured()) return { success: false, message: 'Supabase no configurado.' };
      try {
        const resp = await fetch(`${config.url}/auth/v1/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': config.anonKey },
          body: JSON.stringify({
            email,
            password,
            data: metadata
          })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error_description || data.msg || data.message || 'Error al registrar.');
        
        if (data.access_token) {
          this.setAuthSession(data.access_token, data.user);
        }
        return { success: true, user: data.user, session: data };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    async signIn(email, password) {
      if (!this.isConfigured()) return { success: false, message: 'Supabase no configurado.' };
      try {
        const resp = await fetch(`${config.url}/auth/v1/token?grant_type=password`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': config.anonKey },
          body: JSON.stringify({ email, password })
        });
        const data = await resp.json();
        if (!resp.ok) throw new Error(data.error_description || data.msg || data.message || 'Credenciales inválidas.');
        
        this.setAuthSession(data.access_token, data.user);
        return { success: true, user: data.user, token: data.access_token };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    async resetPassword(email) {
      if (!this.isConfigured()) return { success: false, message: 'Supabase no configurado.' };
      try {
        const resp = await fetch(`${config.url}/auth/v1/recover`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'apikey': config.anonKey },
          body: JSON.stringify({ email })
        });
        const data = await resp.json().catch(() => ({}));
        if (!resp.ok) throw new Error(data.error_description || data.msg || data.message || 'Error al solicitar recuperación');
        return { success: true };
      } catch (err) {
        return { success: false, error: err.message };
      }
    },

    signOut() {
      this.setAuthSession(null, null);
      return { success: true };
    },

    // --- SINCRONIZACIÓN DE PERFIL Y PROGRESO ---
    async syncProfile(profile, progress, weightLog) {
      if (!this.isConfigured() || !this.isAuthenticated()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/profiles`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'resolution=merge-duplicates,return=representation'
          },
          body: JSON.stringify({
            id: currentUser.id,
            email: currentUser.email,
            full_name: profile.name,
            nickname: profile.nickname,
            avatar_id: profile.avatar,
            gender: profile.gender,
            age: profile.age,
            height_cm: profile.height,
            start_weight: profile.startWeight,
            target_weight: profile.targetWeight,
            current_weight: profile.currentWeight,
            fitness_goal: profile.goal,
            experience_level: profile.experienceLevel,
            time_availability: profile.timeAvailability,
            joint_protection_active: profile.jointProtection,
            joint_regions: profile.jointRegions,
            current_day: progress.currentDay,
            completed_days: progress.completedDays,
            points_xp: progress.points,
            streak_days: progress.streak,
            weight_history: weightLog || []
          })
        });
        return { success: resp.ok };
      } catch (e) {
        return { success: false, error: e.message };
      }
    },

    async pullProfile() {
      if (!this.isConfigured() || !this.isAuthenticated()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/profiles?id=eq.${currentUser.id}&select=*`, {
          method: 'GET',
          headers: this.getHeaders()
        });
        if (resp.ok) {
          const list = await resp.json();
          return { success: true, data: list[0] || null };
        }
      } catch (e) {}
      return { success: false };
    },

    // --- COMUNIDAD SUPABASE (POSTS, LIKES, COMENTARIOS) ---
    async fetchCommunityPosts(limit = 30) {
      if (!this.isConfigured()) return { success: false, offline: true };
      try {
        const url = `${config.url}/rest/v1/community_posts?select=id,user_id,author_name,author_nickname,author_rank,avatar_id,tag,tag_label,content_text,image_url,likes_count,comments_count,created_at,community_comments(id,author_name,author_nickname,content_text,created_at)&order=created_at.desc&limit=${limit}`;
        const resp = await fetch(url, {
          method: 'GET',
          headers: this.getHeaders()
        });
        if (resp.ok) {
          const data = await resp.json();
          return { success: true, data };
        }
      } catch (err) {
        console.warn('Error al cargar posts comunitarios de Supabase:', err.message);
      }
      return { success: false, offline: true };
    },

    async createCommunityPost(post) {
      if (!this.isConfigured()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/community_posts`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            user_id: currentUser ? currentUser.id : undefined,
            author_name: post.author || 'Recluta',
            author_nickname: post.nickname || 'Alfa-01',
            author_rank: post.rankBadge || 'R-1',
            author_avatar: post.avatar || 'tactical-helmet',
            avatar_id: post.avatar || 'tactical-helmet',
            tag: post.tag || 'misiones',
            tag_label: post.tagLabel || 'MISIÓN',
            text: post.text,
            content_text: post.text,
            image_url: post.image || null
          })
        });
        if (resp.ok) {
          const data = await resp.json();
          return { success: true, data: data[0] };
        }
      } catch (e) {
        return { success: false, error: e.message };
      }
      return { success: false };
    },

    async likeCommunityPost(postId) {
      if (!this.isConfigured()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/community_likes`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: currentUser ? currentUser.id : '00000000-0000-0000-0000-000000000000'
          })
        });
        return { success: resp.ok };
      } catch (e) {
        return { success: false };
      }
    },

    async createCommunityComment(postId, commentText, authorName, authorNickname) {
      if (!this.isConfigured()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/community_comments`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            post_id: postId,
            user_id: currentUser ? currentUser.id : undefined,
            author_name: authorName || 'Recluta',
            author_nickname: authorNickname || 'Alfa-01',
            text: commentText,
            content_text: commentText
          })
        });
        return { success: resp.ok };
      } catch (e) {
        return { success: false };
      }
    },

    // --- RECONOCIMIENTO NUTRICIONAL IA ---
    async analyzeFood(base64Image, mimeType = 'image/jpeg') {
      if (!this.isConfigured()) {
        return {
          success: false,
          offlineMode: true,
          message: 'Backend do Supabase não configurado. Utilizando motor nutricional híbrido local.'
        };
      }

      const functionUrl = `${config.url}/functions/v1/analyze-food`;
      try {
        const resp = await fetch(functionUrl, {
          method: 'POST',
          headers: this.getHeaders(),
          body: JSON.stringify({
            imageBase64: base64Image,
            mimeType
          })
        });

        const data = await resp.json();
        if (!resp.ok) {
          if (resp.status === 403 || data.code === 'VIP_REQUIRED') {
            return {
              success: false,
              vipRequired: true,
              status: 403,
              error: data.error || 'Acceso exclusivo para miembros VIP.'
            };
          }
          throw new Error(data.error || `Erro HTTP ${resp.status} na Edge Function`);
        }

        return {
          success: true,
          offlineMode: false,
          data: data.data,
          quota: data.quota
        };
      } catch (err) {
        return {
          success: false,
          offlineMode: true,
          error: err.message,
          message: 'Falha na conexão com o servidor. Alternando para o motor de análise local.'
        };
      }
    },

    async saveMealRemote(meal) {
      if (!this.isConfigured()) return { success: false, offline: true };
      try {
        const resp = await fetch(`${config.url}/rest/v1/meals`, {
          method: 'POST',
          headers: {
            ...this.getHeaders(),
            'Prefer': 'return=representation'
          },
          body: JSON.stringify({
            meal_date: meal.date,
            meal_type: meal.type,
            title: meal.title,
            photo_url: meal.photoUrl || null,
            confidence_score: meal.confidence || 0.9,
            total_calories: meal.calories,
            total_protein: meal.protein,
            total_carbs: meal.carbs,
            total_fats: meal.fats,
            items: meal.items || [],
            tactical_notes: meal.notes || null
          })
        });
        if (resp.ok) {
          const res = await resp.json();
          return { success: true, data: res };
        }
      } catch (e) {}
      return { success: false };
    }
  };

  window.SupabaseClient = SupabaseClient;
})();
