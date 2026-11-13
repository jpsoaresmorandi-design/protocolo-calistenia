-- ==============================================================================
-- PROTOCOLO DA CALISTENIA - BACKEND SUPABASE (POSTGRESQL + RLS + COTAS IA)
-- Arquivo de Migração Inicial: 20261113_init_schema.sql
-- ==============================================================================

-- Habilita extensão UUID para geração de identificadores universais
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. TABELA: PROFILES (Perfis de Usuários Táticos vinculados ao Supabase Auth)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT NOT NULL DEFAULT 'Recluta',
  nickname TEXT NOT NULL DEFAULT 'Operador-01',
  avatar TEXT NOT NULL DEFAULT 'tactical-helmet',
  gender TEXT NOT NULL DEFAULT 'hombre' CHECK (gender IN ('hombre', 'mujer')),
  age INT DEFAULT 28,
  height NUMERIC(5,2) DEFAULT 175.0,
  start_weight NUMERIC(5,2) DEFAULT 75.0,
  current_weight NUMERIC(5,2) DEFAULT 75.0,
  target_weight NUMERIC(5,2) DEFAULT 70.0,
  goal TEXT DEFAULT 'perder-peso',
  experience_level TEXT DEFAULT 'principiante',
  time_availability TEXT DEFAULT 'estandar',
  is_vip BOOLEAN NOT NULL DEFAULT false,
  military_rank TEXT DEFAULT 'Recluta',
  military_points INT NOT NULL DEFAULT 150,
  streak_days INT NOT NULL DEFAULT 1,
  daily_calories_target INT DEFAULT 2100,
  daily_protein_target INT DEFAULT 140,
  daily_carbs_target INT DEFAULT 220,
  daily_fats_target INT DEFAULT 60,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ativa Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver seu próprio perfil"
  ON public.profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem atualizar seu próprio perfil"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id);

CREATE POLICY "Usuários podem inserir seu próprio perfil"
  ON public.profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- ------------------------------------------------------------------------------
-- 2. TABELA: MEALS (Diário Nutricional e Registro de Refeições)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.meals (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  meal_date DATE NOT NULL DEFAULT CURRENT_DATE,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('desayuno', 'almuerzo', 'cena', 'snack')),
  title TEXT NOT NULL,
  photo_url TEXT,
  confidence_score NUMERIC(4,2) DEFAULT 0.90,
  total_calories INT NOT NULL DEFAULT 0,
  total_protein NUMERIC(6,1) NOT NULL DEFAULT 0,
  total_carbs NUMERIC(6,1) NOT NULL DEFAULT 0,
  total_fats NUMERIC(6,1) NOT NULL DEFAULT 0,
  items JSONB NOT NULL DEFAULT '[]'::jsonb,
  tactical_notes TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.meals ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem visualizar suas próprias refeições"
  ON public.meals FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem cadastrar suas próprias refeições"
  ON public.meals FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar suas próprias refeições"
  ON public.meals FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir suas próprias refeições"
  ON public.meals FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_meals_user_date ON public.meals (user_id, meal_date);

-- ------------------------------------------------------------------------------
-- 3. TABELA: AI_USAGE_QUOTAS (Controle Rígido de Cotas Diárias de IA Gemini)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.ai_usage_quotas (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  usage_date DATE NOT NULL DEFAULT CURRENT_DATE,
  scans_count INT NOT NULL DEFAULT 0,
  daily_limit INT NOT NULL DEFAULT 1, -- 1 scan/dia para usuários comuns; 5 para VIPs
  last_scan_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  CONSTRAINT unique_user_usage_day UNIQUE (user_id, usage_date)
);

ALTER TABLE public.ai_usage_quotas ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem consultar suas cotas"
  ON public.ai_usage_quotas FOR SELECT
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- FUNÇÃO SEGURA: CHECK_AND_INCREMENT_AI_QUOTA
-- Executada no servidor com permissões elevadas (SECURITY DEFINER)
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.check_and_increment_ai_quota(target_user_id UUID)
RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE
  v_is_vip BOOLEAN;
  v_limit INT;
  v_current_count INT;
  v_today DATE := CURRENT_DATE;
BEGIN
  -- Determina limite de acordo com o status VIP no banco de dados (não confia no frontend)
  SELECT is_vip INTO v_is_vip FROM public.profiles WHERE id = target_user_id;
  IF v_is_vip IS TRUE THEN
    v_limit := 5; -- 5 scans diários para membros VIP
  ELSE
    v_limit := 1; -- 1 scan diário para usuários gratuitos / degustação
  END IF;

  -- Insere ou busca o registro de hoje
  INSERT INTO public.ai_usage_quotas (user_id, usage_date, scans_count, daily_limit, last_scan_at)
  VALUES (target_user_id, v_today, 0, v_limit, now())
  ON CONFLICT (user_id, usage_date)
  DO UPDATE SET daily_limit = v_limit;

  SELECT scans_count INTO v_current_count
  FROM public.ai_usage_quotas
  WHERE user_id = target_user_id AND usage_date = v_today;

  IF v_current_count >= v_limit THEN
    RETURN jsonb_build_object(
      'allowed', false,
      'current', v_current_count,
      'limit', v_limit,
      'message', 'Cota diária de análise nutricional por IA atingida. Limite renovado à meia-noite.'
    );
  END IF;

  -- Incrementa o contador
  UPDATE public.ai_usage_quotas
  SET scans_count = scans_count + 1, last_scan_at = now()
  WHERE user_id = target_user_id AND usage_date = v_today;

  RETURN jsonb_build_object(
    'allowed', true,
    'current', v_current_count + 1,
    'limit', v_limit,
    'remaining', v_limit - (v_current_count + 1)
  );
END;
$$;

-- ------------------------------------------------------------------------------
-- 4. TABELA: COMMUNITY_POSTS (Publicações Sociais da Comunidade VIP)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_nickname TEXT NOT NULL,
  author_avatar TEXT NOT NULL DEFAULT 'tactical-helmet',
  author_rank TEXT NOT NULL DEFAULT 'R-1 🎖️',
  tag TEXT NOT NULL DEFAULT 'misiones' CHECK (tag IN ('misiones', 'motivacion', 'nutricion', 'blindaje')),
  tag_label TEXT NOT NULL DEFAULT 'MISIÓN CUMPLIDA',
  text TEXT NOT NULL,
  image_url TEXT,
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Todos os usuários autenticados podem ver posts da comunidade"
  ON public.community_posts FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem criar posts na comunidade"
  ON public.community_posts FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem editar seus próprios posts"
  ON public.community_posts FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuários podem excluir seus próprios posts"
  ON public.community_posts FOR DELETE
  USING (auth.uid() = user_id);

-- ------------------------------------------------------------------------------
-- 5. TABELA: COMMUNITY_LIKES & COMMUNITY_COMMENTS
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_likes (
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  PRIMARY KEY (post_id, user_id)
);

ALTER TABLE public.community_likes ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver curtidas"
  ON public.community_likes FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem curtir posts"
  ON public.community_likes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuários podem descurtir posts"
  ON public.community_likes FOR DELETE
  USING (auth.uid() = user_id);

CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_nickname TEXT NOT NULL,
  text TEXT NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver comentários"
  ON public.community_comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem comentar"
  ON public.community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_comments_post ON public.community_comments (post_id, created_at);



-- ------------------------------------------------------------------------------
-- 6. TABELA: CUSTOM_RECIPES (Receitas Personalizadas e Privadas do Usuário)
-- Regra estrita de privacidade: visíveis e editáveis exclusivamente pelo proprietário
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.custom_recipes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  category TEXT NOT NULL DEFAULT 'almuerzo',
  prep_time TEXT NOT NULL DEFAULT '15 min',
  servings TEXT NOT NULL DEFAULT '1 porción',
  calories INT NOT NULL DEFAULT 350,
  protein NUMERIC(5,1) NOT NULL DEFAULT 30.0,
  carbs NUMERIC(5,1) NOT NULL DEFAULT 35.0,
  fats NUMERIC(5,1) NOT NULL DEFAULT 10.0,
  description TEXT,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  is_private BOOLEAN NOT NULL DEFAULT true,
  image_url TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.custom_recipes ENABLE ROW LEVEL SECURITY;

-- POLÍTICAS RLS ESTRITAS DE ISOLAMENTO TOTAL
CREATE POLICY "Usuário só pode ler suas próprias receitas particulares"
  ON public.custom_recipes FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário só pode criar suas próprias receitas particulares"
  ON public.custom_recipes FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Usuário só pode atualizar suas próprias receitas particulares"
  ON public.custom_recipes FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Usuário só pode excluir suas próprias receitas particulares"
  ON public.custom_recipes FOR DELETE
  USING (auth.uid() = user_id);

CREATE INDEX IF NOT EXISTS idx_custom_recipes_user ON public.custom_recipes (user_id);
