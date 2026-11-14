-- ==============================================================================
-- PROTOCOLO DA CALISTENIA - BACKEND SUPABASE
-- Migração: 20261114_strict_security_defaults_and_access_lock.sql
-- 
-- 1. Bloqueio padrão de novos usuários (is_vip = false, has_base_access = false)
-- 2. Proteção contra liberação indevida sem webhook aprovado da Hotmart
-- 3. Inclusão e sincronização do campo email em public.profiles
-- 4. Validação estrita de sessão e RLS
-- ==============================================================================

-- 1. Garantir que as colunas possuam valor padrão FALSE
ALTER TABLE public.profiles ADD COLUMN IF NOT EXISTS email TEXT;
ALTER TABLE public.profiles ALTER COLUMN is_vip SET DEFAULT false;
ALTER TABLE public.profiles ALTER COLUMN has_base_access SET DEFAULT false;

-- 2. Atualizar trigger para novos cadastros
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (
    id,
    email,
    full_name,
    nickname,
    is_vip,
    has_base_access,
    has_orderbump_abdomen,
    has_orderbump_batidos
  )
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'Recluta'),
    COALESCE(NEW.raw_user_meta_data->>'nickname', 'Operador-' || SUBSTRING(NEW.id::text, 1, 4)),
    false, -- Apenas pagamento aprovado pode liberar VIP
    false, -- Apenas pagamento aprovado pode liberar Base
    false,
    false
  )
  ON CONFLICT (id) DO UPDATE SET
    email = COALESCE(public.profiles.email, EXCLUDED.email);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- 3. Atualizar política de atualização: Usuário não pode auto-conceder is_vip ou has_base_access
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.profiles;

CREATE POLICY "Usuários podem atualizar seus dados pessoais mas não privilégios"
  ON public.profiles FOR UPDATE
  USING (auth.uid() = id)
  WITH CHECK (
    auth.uid() = id AND
    (
      -- Garante que se o usuário tentar alterar is_vip ou has_base_access no client-side, a tentativa é ignorada/bloqueada
      is_vip = (SELECT p.is_vip FROM public.profiles p WHERE p.id = auth.uid()) AND
      has_base_access = (SELECT p.has_base_access FROM public.profiles p WHERE p.id = auth.uid())
    )
  );

-- 4. Trancar imediatamente contas existentes criadas sem pagamento aprovado
UPDATE public.profiles
SET has_base_access = false, is_vip = false
WHERE id NOT IN (
  SELECT p.id 
  FROM public.profiles p
  JOIN public.payment_events pe ON LOWER(p.email) = LOWER(pe.buyer_email)
  WHERE pe.status = 'APPROVED' OR pe.event_type = 'PURCHASE_APPROVED'
);

