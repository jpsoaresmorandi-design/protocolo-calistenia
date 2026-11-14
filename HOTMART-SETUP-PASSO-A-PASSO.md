# MANUAL COMPLETO DE CONFIGURAÇÃO E INTEGRAÇÃO HOTMART
## Protocolo da Calistenia (PWA) — Vendas Internacionais (Latam, Espanha e Leste Europeu)

Este guia contém **todas as informações prontas para você copiar e colar** no seu painel da Hotmart, garantindo que seu produto e assinatura fiquem no ar com máxima conversão internacional e liberação automática via Webhook.

---

## 1. DADOS CADASTRAIS DO PRODUTO PRINCIPAL (PRODUTO DE ENTRADA)

No painel da Hotmart, vá em **Produtos > Cadastrar Produto**.

- **Nome do Produto:** `Protocolo de Calistenia Militar: 21 Días de Transformación`
- **Formato:** `Aplicativo Móvel / Software` (ou `Área de Membros / Curso Online`)
- **Idioma Principal:** `Espanhol`
- **País de Venda:** `Global / Internacional` (Aceitar todas as moedas)
- **Categoria:** `Saúde e Esportes > Fitness e Exercícios Físicos`

### Descrição Comercial (Copie e Cole):
```text
El Protocolo de Calistenia Militar es un sistema operativo de entrenamiento corporal y recomposición física progresiva diseñado para ejecutarse en 21 días.

Sin necesidad de gimnasios costosos ni pesas, utiliza únicamente el peso corporal con tempos de contracción muscular controlados (fases excêntricas y concêntricas militares), blindaje articular progresivo para evitar dolores de rodilla, hombro y muñeca, y una calculadora biométrica de macronutrientes adaptada a tu objetivo (definición extrema, ganancia muscular o pérdida de grasa).

Incluye acceso completo al aplicativo web progresivo (PWA), reproductor de sesiones en tiempo real con silueta biomecánica interactiva, recetario militar con más de 40 preparaciones hiperproteicas y registro fotográfico de evolución.
```

- **Preço do Produto de Entrada:** `US$ 9.90` (Pagamento Único)
- **Garantia:** `7 dias` (Padrão de alta conversão)
- **Página de Vendas:** `https://protocolo-calistenia.netlify.app/vsl` (ou o funil completo `https://protocolo-calistenia.netlify.app/`)
- **Página de Agradecimento / Entrega (Página de Obrigado & Criação de Senha):** `https://protocolo-calistenia.netlify.app/app/onboarding.html`
  - *Dica Hotmart:* Marque a opção de **"Enviar parâmetros do comprador na URL"** para que o e-mail do cliente venha preenchido automaticamente na tela de criação de senha!

---

## 2. CONFIGURAÇÃO DA ASSINATURA VIP (RECORRÊNCIA MENSAL)

Na aba **Precificação / Ofertas** do mesmo produto ou como um produto de assinatura vinculado:

- **Nome da Oferta:** `Hermandad Táctica VIP + Scanner Nutricional IA`
- **Tipo de Cobrança:** `Assinatura Recorrente (Mensal)`
- **Preço da Mensalidade:** `US$ 4.90 / mes`
- **Frequência:** `Mensal`
- **Recursos Exclusivos Entregues:**
  - Scanner Tático por Foto com Inteligência Artificial (reconhecimento automático de calorias e macros).
  - Acesso irrestrito ao Feed Social da Hermandad Táctica (postagens, fotos, comentários e likes).
  - Respaldo prioritário e sincronização em tempo real na nuvem militar.

---

## 3. CONFIGURAÇÃO DO ORDER BUMP (LUCRO MÁXIMO NO CHECKOUT)

O Order Bump permite que quem estiver comprando o produto de entrada de **$9.90** marque uma caixinha no checkout e leve também a assinatura VIP de **$4.90** no mesmo segundo!

Na Hotmart, vá na aba **Ferramentas > Order Bump**:
- **Título do Bump:** `☑️ Activar Scanner Nutricional por Foto (IA) + Hermandad VIP`
- **Preço:** `US$ 4.90 / mes` (Primeiro mês incluso)
- **Texto Persuasivo do Bump:**
  > *"No calcules tus macros a mano. Apunta la cámara de tu celular a tu plato y la Inteligencia Artificial segmentará los gramos y nutrientes de tu comida al instante. Incluye acceso al canal exclusivo de soldados. Cancela con 1 clic cuando quieras."*

---

## 4. CONFIGURAÇÃO DO CHECKOUT PERSONALIZADO (DARK TACTICAL LUXURY)

Na Hotmart, vá em **Ferramentas > Aparência do Checkout (Checkout Builder)**:

1. **Escolha o Modelo de 1 Etapa (One-Step):** Reduz o atrito de preenchimento e aumenta a conversão no celular.
2. **Paleta de Cores Tática:**
   - **Fundo da Página:** `#0a0c0a` (Preto Militar)
   - **Cor dos Botões de Ação:** `#22c55e` (Verde Tático)
   - **Cor dos Títulos / Destaques:** `#ffffff` e `#eab308` (Ouro)
3. **Elementos Visuais para Inserir:**
   - **Contador Regressivo (Urgência):** 15 minutos para garantir o preço de lançamento.
   - **Selos de Segurança:** Criptografia SSL 256 bits, Garantia Incondicional de 7 Dias.
   - **Campos do Formulário:** Peça apenas o essencial: **Nome**, **E-mail** e **Telefone**. (Não peça endereço físico nem CPF para tráfego internacional).

---

## 5. CONFIGURAÇÃO DAS VENDAS INTERNACIONAIS (AMÉRICA LATINA, ESPANHA E LESTE EUROPEU)

Na Hotmart, na aba **Configurações da Conta / Vendas Internacionais**:

- **Moeda Base:** `USD (Dólares Americanos)`
- **Conversão Automática de Moeda (Ativar):** A Hotmart detecta o IP do cliente e mostra o preço equivalente na moeda local dele:
  - No México: exibe em Pesos Mexicanos (MXN) com pagamento via **OXXO** e cartões locais.
  - Na Colômbia: exibe em Pesos Colombianos (COP) com **PSE** e **Efecty**.
  - No Chile: exibe em Pesos Chilenos (CLP) com **Webpay**.
  - Na Espanha / Europa: exibe em Euros (EUR) com cartão e **PayPal**.
  - No Leste Europeu: exibe em USD ou EUR via cartões locais e carteiras digitais.
- **Idiomas Permitidos no Checkout:** Espanhol (padrão) e Inglês.

---

## 6. CONFIGURAÇÃO DO WEBHOOK (INTEGRAÇÃO AUTOMÁTICA COM O APP)

Essa é a etapa que faz a mágica acontecer: quando alguém paga na Hotmart, a nossa Edge Function do Supabase cria a conta do cliente e libera o VIP na hora.

1. No menu lateral da Hotmart, clique em **Ferramentas > Webhook (HotConnect)**.
2. Clique no botão **Cadastrar Webhook** (ou Nova Configuração).
3. Preencha os campos exatamente assim:
   - **Nome da Configuração:** `Protocolo Calistenia PWA Production`
   - **Selecionar Produto:** Selecione o `Protocolo de Calistenia` (e a assinatura VIP).
   - **URL de Envio:**
     ```text
     https://<SEU-PROJETO>.supabase.co/functions/v1/payment-webhook
     ```
   - **Versão:** `2.0.0 (JSON)`
4. Na lista de eventos, marque as seguintes caixas:
   - ✅ **Compra Aprovada** (`PURCHASE_APPROVED`)
   - ✅ **Assinatura Renovada** (`SUBSCRIPTION_RENEWAL`)
   - ✅ **Compra Reembolsada** (`PURCHASE_REFUNDED`)
   - ✅ **Reclamação de Disputa / Chargeback** (`PURCHASE_CHARGEBACK`)
   - ✅ **Assinatura Cancelada** (`SUBSCRIPTION_CANCELLATION`)
   - ✅ **Compra Cancelada** (`PURCHASE_CANCELED`)
5. Copie o código **Hottok** (token secreto exibido na tela do webhook).
6. Salve o webhook na Hotmart.

---

## 7. O QUE OCORRE DE FORMA 100% AUTOMATIZADA APÓS A CONFIGURAÇÃO:

1. O cliente compra no checkout da Hotmart por $9.90 (ou assina o VIP por $4.90/mês).
2. A Hotmart dispara o webhook em milissegundos para o nosso backend Supabase.
3. A nossa função `payment-webhook`:
   - Checa a idempotência (impede crédito duplicado).
   - Encontra o usuário pelo e-mail ou cria um novo usuário seguro no Supabase Auth.
   - Atualiza a tabela `public.profiles`:
     - Se comprou o produto base ($9.90): define `has_base_access = true`.
     - Se assinou o VIP ($4.90): define `is_vip = true` e `vip_until = now() + 30 dias`.
4. O cliente abre o app PWA:
   - Se comprou o produto base: todo o treinamento de 21 dias, diário de macros, receitas e blindagem estão liberados.
   - Se é VIP: o Scanner de Alimentos por Foto (IA) e a Comunidade Hermandad Táctica ficam 100% liberados e sem cadeados.
5. Se o cliente cancelar a assinatura ou pedir reembolso:
   - A Hotmart avisa nosso webhook instantaneamente.
   - O status `is_vip` é alterado para `false` e a IA/Comunidade são bloqueados com o modal de reativação.

