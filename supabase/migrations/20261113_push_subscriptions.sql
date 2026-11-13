-- ========================================================
-- MIGRATION: TABELA DE ASSINATURAS WEB PUSH (VAPID)
-- Armazena tokens de push de navegadores e celulares para envio
-- mesmo com aplicativo e navegador completamente fechados.
-- ========================================================

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

-- Índices de alta performance para consulta do cron job
CREATE INDEX IF NOT EXISTS idx_push_subs_time ON public.push_subscriptions (preferred_hour, is_active);
CREATE INDEX IF NOT EXISTS idx_push_subs_user ON public.push_subscriptions (user_id);

-- Ativação de Row Level Security
ALTER TABLE public.push_subscriptions ENABLE ROW LEVEL SECURITY;

-- Políticas de RLS:
-- 1. Qualquer usuário autenticado ou visitante pode registrar sua assinatura
CREATE POLICY "Permitir inserção de assinatura de push"
  ON public.push_subscriptions FOR INSERT
  WITH CHECK (true);

-- 2. Usuário pode ver apenas suas assinaturas
CREATE POLICY "Permitir leitura da própria assinatura de push"
  ON public.push_subscriptions FOR SELECT
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 3. Atualizar assinatura própria
CREATE POLICY "Permitir atualização de assinatura de push"
  ON public.push_subscriptions FOR UPDATE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- 4. Excluir assinatura
CREATE POLICY "Permitir exclusão de assinatura"
  ON public.push_subscriptions FOR DELETE
  USING (auth.uid() = user_id OR auth.role() = 'service_role');

-- Trigger para updated_at automático
CREATE OR REPLACE FUNCTION public.handle_push_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_push_subs_updated_at ON public.push_subscriptions;
CREATE TRIGGER trg_push_subs_updated_at
  BEFORE UPDATE ON public.push_subscriptions
  FOR EACH ROW EXECUTE FUNCTION public.handle_push_updated_at();

-- Instrução de agendamento no pg_cron (a cada 15 minutos):
-- SELECT cron.schedule(
--   'enviar-push-calistenia-15m',
--   '*/15 * * * *',
--   $$
--   SELECT net.http_post(
--     url := 'https://SEU_PROJETO.supabase.co/functions/v1/send-scheduled-push',
--     headers := jsonb_build_object(
--       'Content-Type', 'application/json',
--       'Authorization', 'Bearer ' || current_setting('app.settings.service_role_key', true)
--     )
--   ) AS request_id;
--   $$
-- );

