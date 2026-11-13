-- ==============================================================================
-- PROTOCOLO DA CALISTENIA - BACKEND SUPABASE
-- Migração: 20261113_protect_vip_and_add_vip_until.sql
-- Adiciona is_vip e vip_until com proteção de segurança anti-fraude via Trigger/RLS
-- ==============================================================================

-- 1. Garante que as colunas is_vip e vip_until existem na tabela profiles
ALTER TABLE public.profiles 
  ADD COLUMN IF NOT EXISTS is_vip BOOLEAN NOT NULL DEFAULT false,
  ADD COLUMN IF NOT EXISTS vip_until TIMESTAMPTZ DEFAULT NULL;

-- 2. Índice para consultas rápidas de status VIP ativo
CREATE INDEX IF NOT EXISTS idx_profiles_vip_status 
  ON public.profiles (id, is_vip, vip_until);

-- 3. Função de segurança anti-fraude: impede que clientes comuns alterem is_vip ou vip_until
-- Apenas a service_role (usada por Edge Functions / Webhooks seguros) ou o superusuário postgres
-- têm permissão para ativar ou prorrogar o status VIP.
CREATE OR REPLACE FUNCTION public.protect_profile_vip_fields()
RETURNS TRIGGER AS $$
BEGIN
  -- Se houver tentativa de alterar is_vip ou vip_until
  IF (NEW.is_vip IS DISTINCT FROM OLD.is_vip) OR (NEW.vip_until IS DISTINCT FROM OLD.vip_until) THEN
    -- Verifica se o executor da transação é a service_role ou postgres
    IF current_setting('role', true) != 'service_role' AND current_user != 'postgres' THEN
      -- Bloqueia a alteração indevida restaurando silenciosamente os valores antigos
      NEW.is_vip := OLD.is_vip;
      NEW.vip_until := OLD.vip_until;
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 4. Trigger BEFORE UPDATE na tabela profiles
DROP TRIGGER IF EXISTS trg_protect_profile_vip_update ON public.profiles;
CREATE TRIGGER trg_protect_profile_vip_update
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_vip_fields();

-- 5. Trigger BEFORE INSERT na tabela profiles
-- Impede que um usuário se cadastre já com is_vip = true via cliente Supabase
CREATE OR REPLACE FUNCTION public.protect_profile_vip_insert()
RETURNS TRIGGER AS $$
BEGIN
  IF current_setting('role', true) != 'service_role' AND current_user != 'postgres' THEN
    NEW.is_vip := false;
    NEW.vip_until := NULL;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

DROP TRIGGER IF EXISTS trg_protect_profile_vip_insert ON public.profiles;
CREATE TRIGGER trg_protect_profile_vip_insert
  BEFORE INSERT ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.protect_profile_vip_insert();

-- 6. Comentários explicativos para documentação no catálogo do banco
COMMENT ON COLUMN public.profiles.is_vip IS 'Flag de status VIP. Controlada exclusivamente por webhooks de pagamento via service_role.';
COMMENT ON COLUMN public.profiles.vip_until IS 'Data de expiração da assinatura VIP. NULL para vitalício enquanto ativo.';

