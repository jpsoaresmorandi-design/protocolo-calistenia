-- ==============================================================================
-- PROTOCOLO DA CALISTENIA MILITAR - SETUP COMPLETO DO SUPABASE
-- Execute este script no menu: Supabase Dashboard > SQL Editor > New query > Run
-- ==============================================================================

-- 1. Habilitar extensões necessárias
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ------------------------------------------------------------------------------
-- 2. TABELA: PROFILES (Perfis de Usuários, Ranks Militares e Entitlements)
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
  
  -- Controle de Acesso e VIP (Estritamente bloqueado por padrão; liberado apenas por webhook pago)
  is_vip BOOLEAN NOT NULL DEFAULT false,
  vip_until TIMESTAMPTZ DEFAULT NULL,
  has_base_access BOOLEAN NOT NULL DEFAULT false,
  
  -- Order Bumps Entitlements (Bloqueio / Desbloqueio de Produtos Adicionais)
  has_orderbump_abdomen BOOLEAN NOT NULL DEFAULT false,
  has_orderbump_batidos BOOLEAN NOT NULL DEFAULT false,
  
  -- Gamificação Militar
  military_rank TEXT DEFAULT 'Recluta',
  military_points INT NOT NULL DEFAULT 150,
  streak_days INT NOT NULL DEFAULT 1,
  
  -- Metas Nutricionais Diárias
  daily_calories_target INT DEFAULT 2100,
  daily_protein_target INT DEFAULT 140,
  daily_carbs_target INT DEFAULT 220,
  daily_fats_target INT DEFAULT 60,
  
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

-- Ativa Row Level Security
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
-- 3. TRIGGER AUTOMÁTICO: CRIAR PERFIL NO CADASTRO DO USUÁRIO
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    full_name,
    nickname,
    is_vip,
    has_base_access,
    has_orderbump_abdomen,
    has_orderbump_batidos
  )
  VALUES (
    NEW.id,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Recluta'),
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'Operador-' || SUBSTRING(NEW.id::text, 1, 4)),
    false, -- Estritamente falso: Somente webhook com pagamento aprovado pode liberar VIP
    false, -- Estritamente falso: Somente webhook com pagamento aprovado pode liberar Base
    COALESCE((NEW.raw_user_meta_data->>'has_orderbump_abdomen')::boolean, false),
    COALESCE((NEW.raw_user_meta_data->>'has_orderbump_batidos')::boolean, false)
  )
  ON CONFLICT (id) DO NOTHING;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- ------------------------------------------------------------------------------
-- 4. TABELA: COMMUNITY_POSTS (Mural da Comunidade Tática)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_nickname TEXT NOT NULL,
  author_avatar TEXT NOT NULL DEFAULT 'tactical-helmet',
  author_rank TEXT NOT NULL DEFAULT 'R-1 🎖️',
  tag TEXT NOT NULL DEFAULT 'misiones' CHECK (tag IN ('misiones', 'motivacion', 'nutricion', 'blindaje')),
  tag_label TEXT NOT NULL DEFAULT 'MISIÓN CUMPLIDA',
  text TEXT NOT NULL,
  content_text TEXT,
  image_url TEXT,
  likes_count INT NOT NULL DEFAULT 0,
  comments_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_posts ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários autenticados podem ver posts da comunidade"
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
-- 5. TABELAS: COMMUNITY_COMMENTS & COMMUNITY_LIKES
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.community_comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID NOT NULL REFERENCES public.community_posts(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  author_name TEXT NOT NULL,
  author_nickname TEXT NOT NULL,
  text TEXT NOT NULL,
  content_text TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.community_comments ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Usuários podem ver comentários"
  ON public.community_comments FOR SELECT
  USING (auth.role() = 'authenticated');

CREATE POLICY "Usuários podem comentar"
  ON public.community_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

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

-- ------------------------------------------------------------------------------
-- 6. TABELA: PUSH_SUBSCRIPTIONS (Notificações Push no Celular)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.push_subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  endpoint TEXT NOT NULL UNIQUE,
  p256dh TEXT NOT NULL,
  auth TEXT NOT NULL,
  preferred_hour TEXT NOT NULL DEFAULT '18:30',
  timezone TEXT NOT NULL DEFAULT 'America/Sao_Paulo',
  user_agent TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  last_notified_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Permitir inserção de assinatura de push"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Permitir leitura da própria assinatura de push"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- ------------------------------------------------------------------------------
-- 7. TABELA: PAYMENT_EVENTS (Auditoria de Compras e Webhook Hotmart)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  event_id TEXT UNIQUE NOT NULL,
  platform TEXT NOT NULL DEFAULT 'hotmart',
  event_type TEXT NOT NULL,
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  product_id TEXT,
  amount_cents INT,
  currency TEXT DEFAULT 'USD',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Apenas service_role pode gerenciar payment_events"
  ON public.payment_events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

-- ==============================================================================
-- FIM DO SCRIPT: BANCO DE DADOS CONFIGURADO COM SUCESSO!
-- ==============================================================================

