# ARQUITETURA DE AUTENTICAÇÃO, CHECKOUT & CONTROLE DE ACESSO VIP
## Protocolo da Calistenia (PWA)

Este documento apresenta a análise técnica detalhada, a arquitetura implementada e as diretrizes de integração entre checkout (Hotmart / Stripe / Kiwify / Mercado Pago), Supabase Auth, Banco de Dados PostgreSQL e liberação automática de acessos VIP.

---

## 1. RECOMENDAÇÃO DA PLATAFORMA DE AUTENTICAÇÃO

### Plataforma Recomendada: **Supabase Auth (PostgreSQL nativo)**

### Por que o Supabase Auth é a melhor opção para este projeto?
1. **Zero Dependências & PWA Ultraleve:** O Supabase Auth opera via chamadas HTTP REST padrão (`fetch()`), sem necessidade de SDKs pesados de 500KB+ (como Firebase ou bibliotecas de React do Clerk). Nosso cliente nativo em `app/js/supabase-client.js` possui menos de 10KB.
2. **Integração Profunda com Row Level Security (RLS):** O `auth.uid()` do Supabase é verificado diretamente pelo motor do PostgreSQL nas tabelas `profiles`, `community_posts`, `community_likes`, `community_comments` e `meals`. Nenhum usuário consegue ler ou escrever dados sem que a política do banco de dados autorize.
3. **Custo Praticamente Zero no Início:** O Supabase inclui **50.000 usuários ativos mensais (MAU)** gratuitos.
4. **Edge Functions Nativas para Webhooks:** O Supabase possui Edge Functions (Deno/TypeScript) que recebem webhooks de Hotmart/Stripe com baixa latência e executam chamadas de administração via `SUPABASE_SERVICE_ROLE_KEY` sem expor chaves ao navegador.
5. **Recuperação de Senha Embutida:** Suporte nativo a envio de magic links ou tokens de recuperação de senha por e-mail com 1 chamada (`auth.resetPasswordForEmail()`).

### Comparativo Técnico com as outras opções:
- **Firebase Authentication:** Exigiria Firestore ou Realtime Database com regras de segurança em formato proprietário e SDK volumoso; migração de dados mais engessada.
- **Clerk:** Excelente para ecossistemas React/Next.js, mas custa caro para infoprodutos ($25 a $99+/mês com franquias pequenas de MAU) e possui dependências pesadas incompatíveis com Vanilla JS puro.

---

## 2. FLUXO COMPLETO: DA COMPRA À LIBERAÇÃO VIP

```
[COMPRADOR]
    │
    ▼ Realiza compra no Checkout (Hotmart / Stripe / Kiwify / Mercado Pago)
[CHECKOUT]
    │
    ▼ Dispara Webhook seguro (POST com payload JSON)
[EDGE FUNCTION: payment-webhook]
    │
    ├─► 1. Valida Token Secreto & Registra Evento na tabela `payment_events` (Idempotência)
    ├─► 2. Localiza ou Cria o Usuário no Supabase Auth (`admin.createUser` com senha temporária)
    ├─► 3. Atualiza `public.profiles`: define `is_vip = true` e `vip_until = now() + 30 dias`
    └─► 4. Envia e-mail com dados de acesso e link direto para o PWA
          │
          ▼
    [CLIENTE ACESSA O APP]
          │
          ├─► Digita o e-mail da compra + senha
          ├─► App valida sessão via `SupabaseClient.signIn()`
          └─► Supabase confirma `is_vip = true` -> Desbloqueia Scanner IA e Comunidade
```

---

## 3. RESPOSTAS ÀS 9 PERGUNTAS TÉCNICAS DO PROMPT

### 1. Qual plataforma você recomenda para implementar o login?
**Supabase Auth**. Já está estruturada e compatibilizada com o projeto através do adapter `app/js/supabase-client.js` e das migrações SQL na pasta `supabase/migrations/`.

### 2. Por que ela é a melhor opção para o projeto?
Mantém a arquitetura zero-framework do PWA, reduz custos operacionais, oferece segurança RLS direto no PostgreSQL e permite que Edge Functions façam a ponte entre o webhook do checkout e o banco de dados de forma blindada.

### 3. Como seria feita a integração com a plataforma de checkout utilizada?
A plataforma de checkout (ex.: Hotmart, Kiwify ou Stripe) é configurada para enviar notificações Webhook para a URL da Edge Function:
`https://<SEU-PROJETO>.supabase.co/functions/v1/payment-webhook`
Configura-se um token de segurança no cabeçalho `x-webhook-token` para impedir que terceiros enviem requisições forjadas.

### 4. Como o sistema identificaria que determinado e-mail realizou uma compra?
O payload enviado pelo webhook traz obrigatoriamente o e-mail do comprador (ex.: `body.data.buyer.email` na Hotmart ou `body.Customer.email` na Kiwify). O normalizador em `payment-webhook/index.ts` extrai e higieniza esse e-mail (`trim().toLowerCase()`).

### 5. Como o acesso seria liberado automaticamente após a confirmação do pagamento?
A Edge Function executa com a `SUPABASE_SERVICE_ROLE_KEY`. Ela busca se o e-mail já existe na tabela `auth.users`:
- Se existir: atualiza a linha correspondente na tabela `public.profiles` definindo `is_vip = true` e `vip_until = now() + 30 days`.
- Se não existir: cria o usuário com uma senha temporária segura e registra o perfil com status VIP ativo.

### 6. Como funcionaria a recuperação de senha?
Implementada no modal `Views.renderAuthModal('recover')` e no método `SupabaseClient.resetPassword(email)`. O usuário digita seu e-mail e o Supabase envia um e-mail com link seguro para redefinição.

### 7. Como impedir que pessoas que não compraram tenham acesso às funcionalidades pagas?
Proteção em **duas camadas independentes**:
1. **Frontend:** As abas e botões VIP verificam `ProtocoloStore.isVip()`. Se falso, a tela da comunidade exibe a página de vendas e os botões da câmera abrem a oferta VIP.
2. **Backend (Impenetrável):**
   - **Banco de Dados (RLS):** A migração `20261113_strict_vip_rls_and_webhooks.sql` aplica a política:
     `SELECT is_active_vip_user(auth.uid())` em `community_posts`, `community_likes` e `community_comments`. Um usuário não-VIP que tentar consultar a API do Supabase via cURL ou console receberá 0 registros e terá INSERT recusado.
   - **Edge Function da IA (`analyze-food`):** Verifica `is_vip = true` e `vip_until > now()` antes de despachar qualquer token para a API do Google Gemini. Retorna `403 Forbidden` com código `VIP_REQUIRED`.

### 8. Qual seria o custo estimado da solução?
- **Supabase:** Plano Gratuito (Free Tier) comporta até 50.000 usuários ativos/mês, 500MB de banco de dados e 500.000 invocações de Edge Functions por mês. **Custo: $0,00/mês** no início.
- **Google Gemini API:** Com o plano Pro / cota gratuita ou Pay-as-you-go, o custo por foto analisada fica em torno de $0,0002 a $0,001 USD. Cobrando $4.99/mês do assinante, a margem de lucro supera **95%**.

### 9. Quais configurações, credenciais ou integrações ainda seriam necessárias?
Para produção definitiva, você só precisa preencher em seu painel:
1. `SUPABASE_URL` e `SUPABASE_ANON_KEY` no arquivo `app/js/supabase-client.js`.
2. Rodar as migrações SQL da pasta `supabase/migrations/` no SQL Editor do seu Supabase.
3. Cadastrar a URL da Edge Function `payment-webhook` no seu checkout (Hotmart / Stripe / Kiwify) com os eventos de compra aprovada e reembolso.

---

## 4. TRATAMENTO DE CASOS EXCEPCIONAIS (EDGE CASES)

| Cenário de Exceção | Solução Implementada |
|---|---|
| **Webhook duplicado** | Tabela `payment_events` possui coluna `event_id UNIQUE`. Eventos repetidos retornam `200 OK` imediatamente sem duplicar crédito. |
| **Reembolso ou Chargeback** | Eventos `REFUNDED` ou `CHARGEBACK` alteram instantaneamente `is_vip = false` e `vip_until = now()`, revogando o acesso no mesmo segundo. |
| **Compra com e-mail diferente do login** | O usuário pode vincular seu e-mail de compra na aba Perfil ou acessar pelo e-mail com o qual realizou a compra no checkout. |
| **Tentativa de burlar RLS via console** | Triggers PostgreSQL (`protect_profile_vip_fields`) bloqueiam tentativas do próprio cliente de alterar seu status VIP para true. |

---

## 5. MATRIZ DE FUNCIONALIDADES CENTRALIZADA

```javascript
PROTOCOLO_CONFIG.features = {
  // BASE (Incluído no Protocolo de 21 Dias)
  misiones:     { tier: 'base', name: 'Protocolo de 21 Días' },
  blindaje:     { tier: 'base', name: 'Blindaje Articular' },
  nutri_base:   { tier: 'base', name: 'Base de Alimentos & Macros' },
  hidratacion:  { tier: 'base', name: 'Fórmula de Hidratación Dinámica' },
  recetas:      { tier: 'base', name: 'Recetario Militar 40+' },
  evolucion:    { tier: 'base', name: 'Registro de Peso & Fotos' },
  medallas:     { tier: 'base', name: 'Ficha de Servicio & Medallas' },

  // VIP EXCLUSIVO ($4.99/mês)
  scanner_ia:    { tier: 'vip', name: 'Escáner Nutricional Táctico por Foto (IA Gemini)' },
  comunidad_vip: { tier: 'vip', name: 'Hermandad Táctica VIP (Feed, Posts, Likes, Comentários)' },
  nube_vip:      { tier: 'vip', name: 'Respaldo Prioritario en la Nube' }
};
```

