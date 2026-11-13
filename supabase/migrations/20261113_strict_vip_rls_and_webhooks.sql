-- ==============================================================================
-- PROTOCOLO DA CALISTENIA - BACKEND SUPABASE
-- Migração: 20261113_strict_vip_rls_and_webhooks.sql
-- 
-- 1. Tabela de Auditoria e Idempotência de Pagamentos (Webhooks de Checkout)
-- 2. Políticas Estritas de RLS: Bloqueio Total da Comunidade para Não-VIPs
-- 3. Função de Validação VIP Server-Side
-- ==============================================================================

-- ------------------------------------------------------------------------------
-- 1. TABELA DE AUDITORIA DE WEBHOOKS (HOTMART / STRIPE / KIWIFY / MERCADOPAGO)
-- ------------------------------------------------------------------------------
-- Compatibilidade de colunas de texto para posts e comentários
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS has_base_access BOOLEAN NOT NULL DEFAULT true;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS content_text TEXT;
ALTER TABLE public.community_posts ADD COLUMN IF NOT EXISTS text TEXT;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS content_text TEXT;
ALTER TABLE public.community_comments ADD COLUMN IF NOT EXISTS text TEXT;

CREATE TABLE IF NOT EXISTS public.payment_events (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  event_id TEXT UNIQUE NOT NULL, -- Idempotência: impede reprocessamento
  platform TEXT NOT NULL,         -- 'hotmart', 'stripe', 'kiwify', 'mercadopago'
  event_type TEXT NOT NULL,       -- 'PURCHASE_APPROVED', 'REFUNDED', 'CHARGEBACK', 'SUBSCRIPTION_CANCELED'
  buyer_email TEXT NOT NULL,
  buyer_name TEXT,
  product_id TEXT,
  subscription_id TEXT,
  amount_cents INT,
  currency TEXT DEFAULT 'USD',
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  payload JSONB NOT NULL,
  processed_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now()),
  created_at TIMESTAMPTZ NOT NULL DEFAULT timezone('utc'::text, now())
);

ALTER TABLE public.payment_events ENABLE ROW LEVEL SECURITY;

-- Apenas a service_role (usada por Edge Functions) pode ler e escrever payment_events
CREATE POLICY "Apenas service_role pode gerenciar payment_events"
  ON public.payment_events
  FOR ALL
  USING (auth.jwt() ->> 'role' = 'service_role');

CREATE INDEX IF NOT EXISTS idx_payment_events_buyer_email 
  ON public.payment_events (buyer_email, event_type);

CREATE INDEX IF NOT EXISTS idx_payment_events_idempotency 
  ON public.payment_events (event_id);

-- ------------------------------------------------------------------------------
-- 2. FUNÇÃO AUXILIAR DE VERIFICAÇÃO VIP SERVER-SIDE
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.is_active_vip_user(check_user_id UUID)
RETURNS BOOLEAN AS $$
DECLARE
  active_status BOOLEAN;
BEGIN
  SELECT (is_vip = true OR (vip_until IS NOT NULL AND vip_until > timezone('utc'::text, now())))
  INTO active_status
  FROM public.profiles
  WHERE id = check_user_id;

  RETURN COALESCE(active_status, false);
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- ------------------------------------------------------------------------------
-- 3. RLS ESTRITO NA COMUNIDADE VIP (BLOQUEIO TOTAL DE LEITURA E ESCRITA PARA NÃO-VIP)
-- ------------------------------------------------------------------------------

-- Remover políticas antigas permissivas
DROP POLICY IF EXISTS "Todos os usuários autenticados podem ver posts da comunidade" ON public.community_posts;
DROP POLICY IF EXISTS "Usuários podem criar posts na comunidade" ON public.community_posts;
DROP POLICY IF EXISTS "Usuários podem editar seus próprios posts" ON public.community_posts;
DROP POLICY IF EXISTS "Usuários podem excluir seus próprios posts" ON public.community_posts;

-- Nova política: Apenas usuários VIP ATIVOS podem ler posts
CREATE POLICY "Apenas membros VIP ativos podem ler posts da comunidade"
  ON public.community_posts FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    public.is_active_vip_user(auth.uid())
  );

-- Nova política: Apenas usuários VIP ATIVOS podem criar posts
CREATE POLICY "Apenas membros VIP ativos podem criar posts na comunidade"
  ON public.community_posts FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id AND
    public.is_active_vip_user(auth.uid())
  );

-- Edição e exclusão mantidas para o próprio autor VIP
CREATE POLICY "Membros VIP podem editar seus próprios posts"
  ON public.community_posts FOR UPDATE
  USING (
    auth.uid() = user_id AND
    public.is_active_vip_user(auth.uid())
  );

CREATE POLICY "Membros VIP podem excluir seus próprios posts"
  ON public.community_posts FOR DELETE
  USING (
    auth.uid() = user_id AND
    public.is_active_vip_user(auth.uid())
  );

-- Atualização das políticas de Likes (apenas VIP ativo pode curtir)
DROP POLICY IF EXISTS "Todos os usuários autenticados podem ver likes" ON public.community_likes;
DROP POLICY IF EXISTS "Usuários autenticados podem dar like" ON public.community_likes;

CREATE POLICY "Apenas membros VIP ativos podem ver likes"
  ON public.community_likes FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    public.is_active_vip_user(auth.uid())
  );

CREATE POLICY "Apenas membros VIP ativos podem curtir posts"
  ON public.community_likes FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    auth.uid() = user_id AND
    public.is_active_vip_user(auth.uid())
  );

-- Atualização das políticas de Comentários (apenas VIP ativo pode ver e comentar)
DROP POLICY IF EXISTS "Todos os usuários autenticados podem ver comentários" ON public.community_comments;
DROP POLICY IF EXISTS "Usuários autenticados podem criar comentários" ON public.community_comments;

CREATE POLICY "Apenas membros VIP ativos podem ver comentários"
  ON public.community_comments FOR SELECT
  USING (
    auth.role() = 'authenticated' AND
    public.is_active_vip_user(auth.uid())
  );

CREATE POLICY "Apenas membros VIP ativos podem criar comentários"
  ON public.community_comments FOR INSERT
  WITH CHECK (
    auth.role() = 'authenticated' AND
    public.is_active_vip_user(auth.uid())
  );
