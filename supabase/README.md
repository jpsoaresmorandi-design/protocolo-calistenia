# Backend Supabase & Google Gemini — Protocolo de Calistenia

Esta pasta contém toda a infraestrutura de backend necessária para transformar o **Protocolo da Calistenia (PWA)** em uma aplicação em nuvem segura, escalável e com inteligência artificial operacional.

---

## 1. Estrutura de Arquivos

* `migrations/20261113_init_schema.sql`: Script SQL completo com tabelas `profiles`, `meals`, `ai_usage_quotas`, `community_posts`, `community_likes`, `community_comments`, funções de segurança (`check_and_increment_ai_quota`) e Row Level Security (RLS).
* `functions/analyze-food/index.ts`: Supabase Edge Function (Deno) que valida a identidade do usuário, gerencia cotas diárias de escaneamento, comunica com o Google Gemini 2.0 Flash e devolve o JSON nutricional estruturado.

---

## 2. Passo a Passo de Implantação no Supabase (Plano Gratuito)

### Passo 1: Criar o Projeto no Supabase
1. Acesse [supabase.com](https://supabase.com) e crie uma conta gratuita (Free Tier).
2. Clique em **"New Project"**, defina o nome (ex: `protocolo-calistenia`) e crie uma senha forte para o banco de dados.
3. Escolha a região mais próxima (ex: `sa-east-1` São Paulo).

### Passo 2: Executar a Migração do Banco de Dados
1. No painel do seu projeto no Supabase, acesse **SQL Editor** no menu lateral.
2. Abra o arquivo `supabase/migrations/20261113_init_schema.sql`, copie todo o conteúdo e cole no SQL Editor.
3. Clique em **"Run"**. Todas as tabelas, índices e políticas de segurança (RLS) serão criadas instantaneamente.

### Passo 3: Configurar o Segredo da API do Gemini
A chave do Google Gemini **nunca** é colocada no código do frontend. Ela fica armazenada nos segredos criptografados do Supabase:

Via Supabase CLI no terminal:
```bash
supabase login
supabase link --project-ref SEU_PROJECT_REF
supabase secrets set GEMINI_API_KEY="SUA_CHAVE_GEMINI_AQUI"
```
Ou diretamente no painel web:
* Acesse **Project Settings** > **Edge Functions** > **Secrets** > **Add new secret** com nome `GEMINI_API_KEY` e o valor da chave obtida no [Google AI Studio](https://aistudio.google.com/).

### Passo 4: Fazer Deploy da Edge Function
No diretório raiz do projeto:
```bash
supabase functions deploy analyze-food --no-verify-jwt
```
*(Nota: O JWT é validado internamente no código da função via Supabase Auth).*

### Passo 5: Conectar o PWA ao Supabase
No aplicativo PWA, acesse a aba **Perfil** > **Configuração do Servidor / Nuvem** e insira:
* **Supabase URL:** `https://xxxxxxxx.supabase.co`
* **Supabase Anon Key:** `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...`

> **Modo Local / Offline Resiliente:** Se as credenciais do Supabase não forem preenchidas, o aplicativo continua funcionando 100% no modo local (IndexedDB / LocalStorage) com a base nutricional TACO/USDA e motor de análise inteligente integrado!

