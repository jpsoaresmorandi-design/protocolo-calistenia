# GUIA DE CONFIGURAÇÃO E GESTÃO VIP — PROTOCOLO DA CALISTENIA

Este documento descreve como funciona o controle de membros VIP no aplicativo, como ativar o status VIP manualmente no Supabase para testes e como integrar webhooks de pagamento (Stripe / Hotmart).

---

## 1. Arquitetura de Segurança VIP

O acesso às funcionalidades VIP (como o **Scanner Tático de Alimentos por Foto** e o feed interativo da **Hermandad Táctica**) possui dupla camada de segurança:

1. **Frontend (PWA):**
   - O botão do Scanner Tático exibe um cadeado `🔒 VIP` para não-assinantes.
   - Ao clicar, abre o modal de oferta tática sem expor a câmera ou a galeria.
   - O registro manual, a busca na base TACO/USDA e o livro de receitas continuam 100% gratuitos para todos os usuários.
2. **Backend (Supabase Edge Function + PostgreSQL):**
   - A Edge Function `analyze-food` valida o JWT do usuário e consulta a tabela `profiles`.
   - Se `is_vip = false` ou se `vip_until < now()`, retorna imediatamente **HTTP 403 Forbidden (`VIP_REQUIRED`)**, impedindo o consumo de tokens e a chamada à API de IA.
   - A tabela `profiles` possui um trigger anti-fraude (`trg_protect_profile_vip_update`): clientes comuns não conseguem alterar `is_vip` diretamente via REST/GraphQL. Apenas transações com a `service_role` (webhooks) conseguem ativar membros.

---

## 2. Como Ativar um Usuário como VIP Manualmente (Para Testes)

### Método A: Via SQL Editor no Supabase Dashboard
Acesse o **SQL Editor** do Supabase e execute um dos comandos abaixo:

#### Opção 1: Ativar por Email do Usuário (Mais Prático)
```sql
UPDATE public.profiles
SET 
  is_vip = true,
  vip_until = now() + interval '30 days',
  updated_at = now()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'seu-email@teste.com'
);
```

#### Opção 2: Ativar por ID do Usuário (UUID)
```sql
UPDATE public.profiles
SET 
  is_vip = true,
  vip_until = now() + interval '1 year',
  updated_at = now()
WHERE id = 'SEU_USER_UUID_AQUI';
```

#### Opção 3: Ativar como VIP Vitalício (Sem Expiração)
```sql
UPDATE public.profiles
SET 
  is_vip = true,
  vip_until = NULL,
  updated_at = now()
WHERE id IN (
  SELECT id FROM auth.users WHERE email = 'seu-email@teste.com'
);
```

---

### Método B: Via Table Editor no Supabase Dashboard
1. No painel do Supabase, clique em **Table Editor** > tabela `profiles`.
2. Localize a linha correspondente ao usuário.
3. Altere a coluna `is_vip` para `true`.
4. (Opcional) Na coluna `vip_until`, defina uma data futura (ex: 30 dias à frente).
5. Clique em **Save**.

---

## 3. Modo de Teste Local no Frontend (Sem Supabase)

Para testar o fluxo do scanner liberado no computador ou celular sem precisar estar logado no Supabase, existe uma flag de teste em `app/js/state.js`:

```javascript
window.PROTOCOLO_CONFIG = {
  pricing: {
    amount: '4.99',
    currencySymbol: '$',
    currencyCode: 'USD',
    periodText: 'mes',
    formattedPrice: '$4.99',
    formattedMonthly: '$4.99 USD / mes',
    formattedMonthlyShort: '$4.99/mes',
    approxDaily: '$0.16 USD / día'
  },
  scanner: {
    // Para testar o scanner liberado localmente: mude para true
    // DESLIGADO POR PADRÃO para produção
    localTestMode: false
  }
};
```

Basta alterar `localTestMode: true` para simular o comportamento de usuário VIP em testes locais.

---

## 4. Integração Futura com Webhooks (Stripe / Hotmart)

Quando conectar o gateway de pagamento, crie uma Edge Function dedicada (ex: `supabase/functions/stripe-webhook` ou `hotmart-webhook`) usando a chave `SUPABASE_SERVICE_ROLE_KEY`.

### Ponto de Atualização no Webhook:

```typescript
// Exemplo no handler do webhook pós-confirmação de pagamento:
const supabaseAdmin = createClient(
  Deno.env.get('SUPABASE_URL')!,
  Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')! // Obrigatório para bypassar o trigger de segurança
);

// 1. Ao receber evento checkout.session.completed ou invoice.paid:
await supabaseAdmin
  .from('profiles')
  .update({
    is_vip: true,
    vip_until: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
    updated_at: new Date().toISOString()
  })
  .eq('id', customerUserId);

// 2. Ao receber evento customer.subscription.deleted (cancelamento definitivo):
await supabaseAdmin
  .from('profiles')
  .update({
    is_vip: false,
    vip_until: new Date().toISOString(),
    updated_at: new Date().toISOString()
  })
  .eq('id', customerUserId);
```

