# GUIA DEFINITIVO: CONFIGURAÇÃO DE WEB PUSH — PROTOCOLO DA CALISTENIA
> **Para que serve:** Envia lembretes diários militares aos recrutas no horário escolhido (ex: 18h30), **mesmo com o aplicativo e o navegador totalmente fechados**, em iPhones e celulares Android.

---

## PASSO 1: GERAR AS CHAVES CRIPTOGRÁFICAS VAPID
Abra o terminal do seu computador e execute apenas este comando:

```bash
npx web-push generate-vapid-keys
```

Ele vai imprimir na tela algo parecido com isso:
```text
=======================================
Public Key:
BN9x...sua_chave_publica_aqui...
Private Key:
5Kq...sua_chave_privada_aqui...
=======================================
```
> Copie e guarde esses dois códigos em um bloco de notas seguro.

---

## PASSO 2: COLOCAR A CHAVE PÚBLICA NO APLICATIVO
1. Abra o arquivo `app/js/app.js`.
2. Procure pela linha que começa com `const DEFAULT_VAPID_PUBLIC_KEY`.
3. Cole a sua **Public Key** gerada entre as aspas:
   ```javascript
   const DEFAULT_VAPID_PUBLIC_KEY = 'SUA_PUBLIC_KEY_AQUI';
   ```
4. Salve o arquivo.

---

## PASSO 3: CRIAR A TABELA NO SUPABASE (BANCO DE DADOS)
1. Acesse o seu painel do Supabase ([supabase.com](https://supabase.com)).
2. Clique no seu projeto e vá em **SQL Editor** no menu esquerdo.
3. Clique em **New Query**.
4. Abra o arquivo `supabase/migrations/20261113_push_subscriptions.sql` deste projeto, copie todo o conteúdo e cole no editor do Supabase.
5. Clique no botão verde **Run** (Executar).
   *(A tabela `push_subscriptions` e as regras de segurança já estão criadas).*

---

## PASSO 4: CONFIGURAR OS SECRETS NO SUPABASE
Vá em **Project Settings** > **Configuration** > **Edge Functions** (ou via terminal) e adicione as seguintes variáveis secretas:

| Nome do Secret | O que colocar |
|---|---|
| `VAPID_PUBLIC_KEY` | Cole a sua chave pública do Passo 1 |
| `VAPID_PRIVATE_KEY` | Cole a sua chave privada do Passo 1 |
| `VAPID_SUBJECT` | `mailto:soporte@protocolocalistenia.com` |

---

## PASSO 5: FAZER O DEPLOY DA EDGE FUNCTION
No terminal do seu computador (dentro da pasta do projeto), execute:

```bash
npx supabase functions deploy send-scheduled-push
```

---

## PASSO 6: ATIVAR O AGENDAMENTO AUTOMÁTICO (CRON A CADA 15 MINUTOS)
1. No painel do Supabase, vá em **Database** > **Extensions**.
2. Procure por `pg_cron` e ative a extensão (clicando no botão para ligar).
3. Volte ao **SQL Editor**, abra uma nova query e execute o código abaixo (troque apenas `SEU_PROJETO` e `SUA_SERVICE_ROLE_KEY`):

```sql
SELECT cron.schedule(
  'enviar-push-calistenia-15m',
  '*/15 * * * *',
  $$
  SELECT net.http_post(
    url := 'https://SEU_PROJETO.supabase.co/functions/v1/send-scheduled-push',
    headers := jsonb_build_object(
      'Content-Type', 'application/json',
      'Authorization', 'Bearer SUA_SERVICE_ROLE_KEY_AQUI'
    )
  ) AS request_id;
  $$
);
```

---

## PRONTO! COMO O SISTEMA FUNCIONA NA PRÁTICA:
1. O usuário entra no app e ativa os avisos para as **18:30**.
2. No iPhone, o app verifica automaticamente se o usuário instalou o app na tela inicial (requisito obrigatório da Apple para push). Se não instalou, ensina o passo a passo com um clique.
3. A cada 15 minutos, o robô do Supabase roda silenciosamente em nuvem.
4. Quando der 18:30 no fuso do usuário, o robô verifica se ele já treinou hoje. Se não treinou, o celular toca com uma mensagem militar personalizada do Dia correspondente.

