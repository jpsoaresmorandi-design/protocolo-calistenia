# PROTOCOLO DA CALISTENIA — DOSSIÊ COMPLETO DE CONTEXTO E ARQUITETURA
> **Documento de Contexto Geral para Modelos de IA (Claude, Gemini, GPT)**  
> **Versão:** 2.0 Tática Estável | **Data:** Novembro de 2026  
> **Objetivo:** Fornecer um panorama 100% detalhado de todas as conversas, decisões estratégicas, conceitos visuais, regras de negócio, integrações de IA e arquitetura de software implementadas no projeto.

---

## 1. VISÃO GERAL DO PRODUTO

* **Nome do Produto:** Protocolo da Calistenia (Protocolo Militar de Calistenia / Centro de Comando Tático).
* **Conceito Central:** Uma plataforma digital e aplicativo PWA (Progressive Web App) focado em transformação física acelerada através de um **desafio guiado de 21 dias de calistenia**, sem necessidade de academia ou equipamentos caros.
* **Proposta de Valor:** Transformar o treino com o peso do próprio corpo em uma experiência imersiva de "treinamento militar de elite", unindo disciplina, progressão diária clara, blindagem articular contra lesões, nutrição inteligente com IA e comunidade fechada de alta camaradagem.
* **Público-Alvo:** Homens e mulheres que buscam perder gordura, definir o corpo ou ganhar massa muscular treinando em casa ou ao ar livre. O sistema adapta linguagem, treinos e visuais conforme o gênero selecionado.
* **Modelo de Negócio:**
  1. *Front-End (Aquisição):* Funil de vendas composto por **Quiz Interativo** de alta personalização $\rightarrow$ **Página de Vendas em Vídeo (VSL)** $\rightarrow$ Acesso ao PWA.
  2. *Back-End / Assinatura Recorrente:* Acesso opcional à **Comunidade VIP (Hermandad Táctica)** por **$4.99 USD/mês** para suporte contínuo, motivação em rede e troca de experiências.

---

## 2. IDENTIDADE VISUAL: *DARK TACTICAL LUXURY*

A estética do projeto foi batizada de **Dark Tactical Luxury** (Luxo Tático Noturno), inspirada em interfaces de comando militar de forças especiais, monitores táticos furtivos e acabamento moderno:

* **Paleta de Cores:**
  * **Fundo Primário:** `#050705` a `#090d09` (preto carvão com leve tonalidade militar oliva profunda).
  * **Superfícies e Cards:** `#0e130e` e `#141a14` com bordas sutis em `rgba(255, 255, 255, 0.08)`.
  * **Verde Tático Primário:** `#22c55e` (verde militar neon para elementos ativos, timers, botões de ação e sucesso).
  * **Dourado Metálico / Ouro de Elite:** `#d4af37` / `#eab308` (usado para patentes de prestígio, selos VIP, insígnias de honra e destaque de conquistas).
  * **Vermelho Alerta / Tático:** `#ef4444` (cronômetros de descanso, intensidade máxima e likes da comunidade).
  * **Texto e Contraste:** Branco titânio `#ffffff` para títulos e `#a1a1aa` / `#71717a` para textos secundários.
* **Tipografia e Ícones:**
  * Tipografia sem serifa geométrica, pesada, com caixas altas táticas, letter-spacing expandido (`0.8px` a `1.5px`) para transmitir autoridade militar.
  * Ícones SVG embutidos de alta resolução (sem dependência de fontes externas como FontAwesome que atrasam o carregamento).

---

## 3. ESTRUTURA DO FUNIL DE CONVERSÃO E MARKETING

O ecossistema conta com páginas dedicadas para aquisição de tráfego antes do app:

1. **Quiz Interativo (`/quiz` ou `index.html` raiz):**
   * Pergunta sexo (Masculino / Feminino), idade, peso, altura, tipo físico atual (com fotografias reais de homens e mulheres em alta resolução), objetivo principal (perder gordura, definir, ganhar massa) e nível de experiência.
   * Barra de progresso dinâmica, gatilhos de prova social ("+50.000 pessoas transformadas"), cálculo de calorias e IMC em tempo real na tela de processamento.
   * Redireciona para a VSL ou diretamente para o checkout/app com parâmetros de personalização gravados em `localStorage` e na URL.
2. **Vídeo de Vendas / VSL (`/vsl` ou `vsl.html`):**
   * Player de vídeo otimizado (HLS / MP4) com barra de reprodução tática.
   * Delay tático para exibição da oferta e do botão de compra.
   * Comparativo comercial realizado entre gateways de pagamento (**Hotmart vs Stripe**), identificando Stripe como ideal para pagamentos globais e menores taxas em assinaturas em dólar ($4.99/mês), mantendo Hotmart como opção viável no mercado brasileiro/latino.
   * O botão de checkout encaminha o comprador ao aplicativo PWA (`./app/`).

---

## 4. ARQUITETURA TÉCNICA DO PWA

* **Tecnologia Principal:** Vanilla JavaScript (ES6+), HTML5 Semântico e CSS3 puro com variáveis customizadas. Não depende de frameworks pesados (React/Vue/Angular), garantindo inicialização instantânea em qualquer celular básico.
* **Zero Dependências no Servidor:** Criado um servidor nativo Node.js ([server.js](file:///C:/Users/buggu/.gemini/antigravity/scratch/Protocolo%20da%20Calistenia/server.js)) na porta 3000 que mapeia:
  * `/` $\rightarrow$ Entrega diretamente o **PWA do Protocolo da Calistenia** (`app/index.html`).
  * `/app/` $\rightarrow$ PWA em rota direta.
  * `/quiz` $\rightarrow$ Quiz de captura e diagnóstico.
  * `/vsl` $\rightarrow$ Página de vendas em vídeo.
* **Compatibilidade PWA (Progressive Web App):**
  * Possui `manifest.json` com `display: "standalone"`, tema de cores escuro e ícones adaptados para Android e iOS.
  * `sw.js` (Service Worker) para cache de assets e funcionamento em modo offline.
* **Gerenciamento de Estado Reativo:**
  * Módulo [app/js/state.js](file:///C:/Users/buggu/.gemini/antigravity/scratch/Protocolo%20da%20Calistenia/app/js/state.js) baseado em padrão *Store / Observer* com persistência automática no `localStorage`.

---

## 5. MÓDULOS E FUNCIONALIDADES PRINCIPAIS DO APLICATIVO

### A. Onboarding Tático Inicial
Se o usuário entrar pela primeira vez (ou se reiniciar seu perfil), é recebido por um fluxo passo a passo de configuração:
* Seleção de Avatar Militar (Capacete Tático, Óculos de Reconhecimento, Boina de Comandos, etc.).
* Nome e Codinome de Recruta (ex.: *Halcón-04*, *Valquiria-07*).
* Gênero, idade, peso atual e meta de peso.
* Objetivo físico e nível de experiência.
* Adapta automaticamente o vocabulário (ex.: *Recluta* vs *Soldada*) e as fotos da interface.

### B. Módulo de Missões Diárias (Desafio dos 21 Dias)
* **Desbloqueio Progressivo Real:**
  * O recruta só pode iniciar a missão do **Dia 1**.
  * Ao completar a missão do Dia 1, o Dia 2 é liberado com fanfarra de XP; ao completar o Dia 2, libera o Dia 3, até o Dia 21.
  * **Inspeção Livre:** O usuário pode clicar em dias futuros bloqueados para visualizar a lista de exercícios, séries e orientações táticas, mas o botão de início permanece trancado com um cadeado tático militar.
* **Player de Treino Tático Guiado:**
  * Cronômetro de execução e contagem de descanso visual e sonoro via sintetizador Web Audio API (bipes curtos e bipe de conclusão, operando 100% offline).
  * Instruções passo a passo de execução, músculos ativados e botões de "Modificação Suave" para quem não consegue realizar o movimento padrão (ex.: flexão com joelhos no chão).
  * Animações/fotos de demonstração dos exercícios.

### C. Módulo de Blindaje Articular
* Biblioteca de rotinas de prevenção de lesões e preparação articular:
  * *Blindaje Pre-Misión (5 minutos):* Aquecimento de pulsos, ombros, quadris e escápulas.
  * *Descompresión Post-Misión:* Alongamentos passivos e descompressão da coluna.
  * *Blindaje de Muñecas & Codos:* Específico para suportar flexões e pranchas sem dor.

### D. Perfil do Usuário e Carreira Militar
* **Patentes Militares por Pontuação (XP):**
  * *R-1 Recruta* ($0-299 \text{ XP}$)
  * *R-2 Soldado* ($300-599 \text{ XP}$)
  * *R-3 Cabo* ($600-999 \text{ XP}$)
  * *R-4 Sargento* ($1000-1499 \text{ XP}$)
  * *R-5 Tenente* ($1500-2099 \text{ XP}$)
  * *R-6 Comandante de Elite* ($2100+ \text{ XP}$)
* Ficha de serviço com data de alistamento, dias consecutivos (racha), peso inicial vs atual, galeria de evolução (fotos Dia 1 vs Dia Atual) e modal de edição completa dos dados.

### E. Nutrição & Diário Alimentar
* **Metas Calculadas Automaticamente:** Calorias diárias, proteínas, carboidratos e gorduras calculados com base no peso e objetivo selecionado (Perder Peso: $24 \text{ kcal/kg}$ e $2.0 \text{g/kg}$ prot; Ganhar Massa: $32 \text{ kcal/kg}$ e $2.2 \text{g/kg}$ prot).
* **Diário por Refeição:** Registro de *Desayuno*, *Almuerzo*, *Pre/Post Entreno* e *Cena*.
* **Rastreador de Hidratação:** Contador de copos d'água ($250\text{ml}$) com meta diária visual de $3\text{L}$.
* **Banco de Alimentos Integrado (NutriDB):** 42 alimentos calibrados pelas tabelas **TACO e USDA** com busca instantânea.

### F. Biblioteca de Receitas Táticas Expandida (28 Receitas)
Catálogo oficial com 28 receitas divididas em 9 categorias:
1. *☀️ Desayuno* (Omelette de Espinacas, Tazón de Avena Militar, Tostadas con Huevo, Revuelto con Pavo).
2. *⚡ Almuerzo* (Bowl de Pollo y Aguacate, Bife con Batata, Salmón con Quinoa, Pechuga Rellena de Ricota).
3. *🌙 Cena* (Pescado en Papillote, Ensalada de Pavo, Crema de Calabacín y Pollo, Hamburguesas Magras de Ternera).
4. *🔥 Pre/Post Entreno* (Batido Pre-Misión, Pancakes de Avena, Batido Post Cacao y Banana, Yogur Griego con Miel).
5. *🥩 Altas Proteínas* (Wrap Anabólico de Atún, Solomillo con Puré de Guisantes, Ensalada de Garbanzos y Atún).
6. *🥗 Bajas Calorías* (Wok Liviano de Pollo, Zoodles Boloñesa Magra, Sopa Termogénica de Jengibre).
7. *⏱️ Rápidas (<15m)* (Scramble Cottage, Quesadilla Rápida de Pollo, Tazón Exprés de Atún y Arroz).
8. *🥑 Postres & Snacks* (Mousse Proteico de Chocolate, Pudín de Chía y Cacao, Bolitas Energéticas de Avena).
9. *🔒 Mis Recetas Privadas* (área restrita das receitas do usuário).

### G. Sistema de Criação de Receitas Personalizadas (Privacidade Estrita)
* O usuário pode criar suas próprias receitas informando título, categoria, tempo, porções, ingredientes e passo a passo.
* **Privacidade 100% Garantida:** Toda receita personalizada recebe a flag `isPrivate: true` e fica armazenada exclusivamente no seu perfil local e na sua linha do banco de dados (`custom_recipes`). Elas **jamais** vazam para o catálogo público ou para a Comunidade VIP.
* **Auto-Cálculo de Macronutrientes com 1 Clique (`⚡ AUTO-CALCULAR MACROS`):** Um algoritmo varre o texto dos ingredientes, identifica as quantidades em gramas, consulta a base NutriDB e preenche automaticamente as calorias, proteínas, carboidratos e gorduras.
* Cards privados com selo de identificação dourado, edição completa e exclusão.

### H. Comunidade VIP / Hermandad Táctica
* Ambiente social militar com estética Dark Tactical:
  * **Ticker Superior ao Vivo:** Indicador pulsante com 1.428 soldados ativos e conquistas recentes da unidade.
  * **Composer de Posts:** Permite escrever texto, categorizar (`Misión Cumplida`, `Nutrición`, `Evolución`, `Movilidad`), anexar foto com previsualização em alta resolução e ganhar +30 XP ao publicar.
  * **Interações Sociais:** Botão de Apoio (Like) com coração animado e contador, lista de comentários expansível com input direto e botão de exclusão exclusivo para o autor do post.
  * **Filtros Rápidos:** *Todos*, *🎯 Misiones*, *🥗 Nutrición*, *🔥 Evolución*, *👤 Mis Reportes*.
  * **Paywall Tático & Modo Demonstração:** Apresenta os pilares da irmandade militar com oferta de $4.99/mês e botão de demonstração para testar as funcionalidades livremente.

---

## 6. AUDITORIA E INTEGRAÇÃO DE INTELIGÊNCIA ARTIFICIAL (GOOGLE GEMINI)

### Decisões da Auditoria Técnica e Financeira
* **Assinatura do Usuário (Google AI Pro):** Esclareceu-se que a assinatura de consumo Google One / Gemini Pro dá acesso ao app Gemini web e a benefícios de armazenamento/Docs, mas as chamadas de API de desenvolvimento são geridas via Google Cloud / Google AI Studio.
* **Modelo Escolhido:** **Google Gemini 2.0 Flash** (`gemini-2.0-flash`). É o modelo multimodal mais moderno, com menor latência e custo por token praticamente desprezível (frações de centavo de dólar por foto), suportando Structured JSON Outputs.
* **Compressão no Cliente (Browser Canvas):** Antes de enviar a foto da refeição (que na câmera do celular tem 4MB a 10MB), o app redimensiona a imagem para $768\text{px}$ a $82\%$ de qualidade JPEG ($\approx 70\text{KB}$ base64). Isso gera economia massiva de tokens de entrada e resposta quase instantânea.
* **Arquitetura Segura via Supabase Edge Function:**
  * O PWA envia a imagem para `supabase/functions/analyze-food/index.ts`.
  * A Edge Function valida a autenticação JWT do usuário, confere a cota diária na tabela `ai_usage_quotas` do PostgreSQL e dispara a requisição ao Gemini com a chave `GEMINI_API_KEY` guardada em segredo no servidor.
  * O Gemini retorna estritamente um JSON padronizado com os alimentos identificados, porções estimadas em gramas e macronutrientes.
  * O frontend recebe o resultado, cruza com a tabela NutriDB e abre um modal interativo para o usuário ajustar as gramaturas antes de salvar no diário.

---

## 7. BACKEND, BANCO DE DADOS E POLÍTICAS DE SEGURANÇA (SUPABASE)

O arquivo [supabase/migrations/20261113_init_schema.sql](file:///C:/Users/buggu/.gemini/antigravity/scratch/Protocolo%20da%20Calistenia/supabase/migrations/20261113_init_schema.sql) contém o esquema completo do banco PostgreSQL com **Row Level Security (RLS)** ativado em todas as tabelas:

1. `profiles`: Armazena dados do atleta, patente militar, pontos XP, racha e avatar. RLS: `auth.uid() = id`.
2. `meals`: Diário alimentar e fotos de refeições. RLS: `auth.uid() = user_id`.
3. `ai_usage_quotas`: Controle de cotas diárias de análises de fotos por IA através da função `check_and_increment_ai_quota`.
4. `custom_recipes`: Receitas particulares criadas pelos usuários. RLS estrito: somente o próprio criador pode ler, inserir, editar ou apagar (`auth.uid() = user_id`).
5. `community_posts`, `community_likes`, `community_comments`: Feed social da Hermandad Táctica com permissão de leitura para membros autorizados e escrita/exclusão restrita ao dono da postagem.

---

## 8. MAPA DE ARQUIVOS E ESTRUTURA DO PROJETO

```
Protocolo da Calistenia/
├── server.js                          # Servidor HTTP nativo Node.js (rotas /, /app/, /quiz, /vsl)
├── package.json                       # Scripts npm start e npm run dev apontados para server.js
├── index.html                         # Quiz interativo e funil de entrada
├── vsl.html                           # Vídeo de Vendas Tático com oferta
├── assets/                            # Imagens e mídias do funil de vendas e quiz
├── supabase/
│   ├── README.md                      # Instruções de implantação do backend
│   ├── migrations/
│   │   └── 20261113_init_schema.sql   # Esquema SQL com RLS, tabelas e procedures
│   └── functions/
│       └── analyze-food/
│           └── index.ts               # Edge Function intermediando PWA e Gemini 2.0 Flash
└── app/                               # DIRETÓRIO DO APLICATIVO PWA PRINCIPAL
    ├── index.html                     # Entrada do PWA
    ├── manifest.json                  # Manifesto PWA com tema Dark Tactical
    ├── sw.js                          # Service Worker para suporte offline
    ├── css/
    │   └── app.css                    # Folha de estilos Dark Tactical Luxury (2.400+ linhas)
    ├── assets/                        # Fotografias, ícones táticos e mídias dos exercícios
    └── js/
        ├── nutri-db.js                # Base TACO/USDA com 42 alimentos e calculadora
        ├── supabase-client.js         # Cliente Supabase seguro para autenticação e fotos
        ├── gemini-nutrition.js        # Módulo de compressão e IA Gemini 2.0 Flash
        ├── state.js                   # Estado global, persistência e ações do app
        ├── exercises-db.js            # Base completa de exercícios e treinos dos 21 dias
        ├── recipes-db.js              # 28 receitas táticas categorizadas + gerenciador
        ├── workout-player.js          # Player de treino com áudio-bipes e cronômetros
        ├── views.js                   # Renderizadores de todas as abas, telas e modais
        └── app.js                     # Controlador principal e listeners de eventos
```

---

## 9. COMO EXECUTAR E TESTAR O PROJETO

1. No terminal, navegar até o diretório:
   ```bash
   cd "Protocolo da Calistenia"
   ```
2. Iniciar o servidor nativo:
   ```bash
   npm start
   ```
3. Acessos locais disponíveis:
   * **Aplicativo PWA:** `http://localhost:3000/`
   * **Quiz Interativo:** `http://localhost:3000/quiz`
   * **Vídeo de Vendas:** `http://localhost:3000/vsl`

---

## 10. ESTADO ATUAL E PRONTIDÃO

* **Status:** 100% implementado, testado e validado em ambiente local.
* **Testes Automatizados:** Todos os 9 scripts JS passam com 100% de sucesso sem erros de sintaxe ou execução. Testes de isolamento de privacidade de receitas aprovados sem vazamento de dados.
* **Próximas Possibilidades (se desejado no futuro):**
  * Conexão final com chaves de produção do Supabase e Google Cloud.
  * Integração de webhook de pagamento (Stripe/Hotmart) para liberação automática de token VIP.
  * Adição de notificações push no Service Worker para lembrar o soldado do horário do treino diário.

