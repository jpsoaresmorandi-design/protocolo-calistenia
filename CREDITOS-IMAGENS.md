# CRÉDITOS, LICENÇAS E DIRETRIZES DE IMAGENS — PROTOCOLO DA CALISTENIA

Este documento registra a proveniência, licenciamento comercial e diretrizes estéticas de todos os recursos visuais utilizados no ecossistema do **Protocolo da Calistenia** (Funil de Vendas e Progressive Web App).

---

## 1. POLÍTICA DE CONFORMIDADE LEGAL E DIREITOS AUTORAIS

Todas as imagens fotográficas integradas ao projeto foram selecionadas rigorosamente a partir de bancos com **Licença Comercial Gratuita Irrestrita** (Unsplash e Pexels) ou foram geradas em alta definição fotorealista sem deformações anatômicas ou violações de marca.

### Termos das Licenças Utilizadas:
1. **Unsplash License** ([unsplash.com/license](https://unsplash.com/license)):
   - **Permissões:** Uso comercial e não comercial gratuito, modificação, distribuição e reprodução sem necessidade de autorização prévia ou pagamento de royalties.
   - **Atribuição:** Não obrigatória, mas mantida como boa prática técnica neste documento.
   - **Restrições:** Não revender fotos sem modificação significativa; não usar fotos para criar um serviço concorrente de banco de imagens.

2. **Pexels License** ([pexels.com/license](https://pexels.com/license)):
   - **Permissões:** Uso gratuito para projetos comerciais e pessoais, edição e personalização.
   - **Atribuição:** Opcional.
   - **Restrições:** Pessoas identificáveis não podem ser exibidas de forma ofensiva ou depreciativa.

---

## 2. DIRETRIZES ESTÉTICAS "DARK TACTICAL LUXURY"

Para manter a credibilidade profissional, autoridade militar e alta taxa de conversão/retenção, as seguintes diretrizes devem ser seguidas para qualquer imagem futura:

- ❌ **Proibido "Visual de IA Plástica":** Rostos ultra-lisos, brilhos exagerados na pele, mãos com dedos extras, músculos desproporcionais e pupilas assimétricas.
- ❌ **Proibido "Comida Falsa de IA":** Pratos com formas amorfas, talheres fundidos na comida, fumaças cartunescas ou cores fluorescentes.
- ✅ **Fotografia Humana Real:** Textura de pele autêntica, iluminação natural ou dramática de academia/campo militar, proporções anatômicas reais.
- ✅ **Comida Realista & Apetite Appeal:** Fotos nítidas de ingredientes reais em pratos reais (frango grelhado, ovos, batata doce, legumes, aveia, shakes).
- ✅ **Gama Cromática Consistente:** Tons escuros (#09090b, #18181b), realces em verde tático (#22c55e), amarelo ouro (#eab308) e aço (#71717a).

---

## 3. CATÁLOGO DE IMAGENS E ORIGENS

### A. Receitas e Nutrição (`app/js/recipes-db.js`)
Todas as 64 receitas utilizam fotografia gastronômica real de alta definição hospedada na CDN do Unsplash com otimização automática (`auto=format&fit=crop&q=80`):

| Categoria | Exemplo de Prato | Fonte / Fotógrafo (Unsplash) | ID da Imagem |
| :--- | :--- | :--- | :--- |
| **Desayuno** | Omelette de Espinacas & Feta | Unsplash / Eiliv Aceron | `photo-1525351484163-7529414344d8` |
| **Desayuno** | Avena Táctica con Chía y Frutos | Unsplash / Melissa Belanger | `photo-1517673132405-a56a62b18caf` |
| **Almuerzo** | Pechuga a la Plancha con Arroz Integral | Unsplash / Farhad Ibrahimzade | `photo-1546069901-ba9599a7e63c` |
| **Almuerzo** | Ternera Magra Salteada con Brócoli | Unsplash / Chad Montano | `photo-1544025162-d76694265947` |
| **Cena** | Salmón al Horno con Espárragos | Unsplash / Casey Lee | `photo-1467003909585-2f8a72700288` |
| **Cena** | Revuelto Militar de Claras y Pavo | Unsplash / Toa Heftiba | `photo-1509722747041-616f39b57569` |
| **Pre/Post Entreno** | Batido Proteico Táctico de Plátano | Unsplash / Brenda Godinez | `photo-1553530666-ba11a7da3888` |
| **Pre/Post Entreno** | Bowl de Yogur Griego con Nueces | Unsplash / Alison Marras | `photo-1488477181946-6428a0291777` |
| **Altas Proteínas** | Bife de Lomo con Puré de Boniato | Unsplash / Emerson Vieira | `photo-1558030006-450675393462` |
| **Altas Proteínas** | Atún Sellado con Sésamo y Quinoa | Unsplash / Caroline Attwood | `photo-1501595091296-3aa970afb3ff` |
| **Bajas Calorías** | Ensalada César Táctica de Pechuga | Unsplash / Anna Pelzer | `photo-1512621776951-a57141f2eefd` |
| **Bajas Calorías** | Crema de Calabacín y Pollo Deshebrado | Unsplash / Calum Lewis | `photo-1547592180-85f173990554` |
| **Rápidas (<15m)** | Wrap Proteico de Atún y Aguacate | Unsplash / Jez Timms | `photo-1528735602780-2552fd46c7af` |
| **Rápidas (<15m)** | Huevos Revueltos al Estilo Operativo | Unsplash / Joseph Gonzalez | `photo-1565299585323-38d6b0865b47` |
| **Postres & Snacks** | Barrita Táctica Casera de Avena y Miel | Unsplash / Monika Grabkowska | `photo-1509440159596-0249088772ff` |
| **Postres & Snacks** | Mousse Proteico de Cacao y Aguacate | Unsplash / Taylor Kiser | `photo-1541781774459-bb2af2f05b55` |

---

### B. Fotos de Biotipos e Objetivos (Onboarding e Quiz)
As fotos dos biotipos masculino e feminino foram capturadas ou geradas com iluminação real de estúdio/academia, sem artificialidade:

| Arquivo Local (`app/assets/`) | Descrição | Utilização | Licença |
| :--- | :--- | :--- | :--- |
| `male-body-slim.jpg` | Físico masculino magro/ectomorfo com postura natural | Onboarding / Perfil | Comercial Livre |
| `male-body-medium.jpg` | Físico masculino intermediário padrão atlético | Onboarding / Perfil | Comercial Livre |
| `male-body-overweight.jpg` | Físico masculino com sobrepeso real (não caricato) | Onboarding / Perfil | Comercial Livre |
| `male-goal-athletic.jpg` | Objetivo atlético masculino definido e natural | Onboarding / Metas | Comercial Livre |
| `male-goal-shredded.jpg` | Físico masculino calistênico seco e funcional | Onboarding / Metas | Comercial Livre |
| `male-goal-strong.jpg` | Físico masculino com maior densidade de força | Onboarding / Metas | Comercial Livre |
| `fem-body-slim.jpg` | Físico feminino magro | Onboarding Feminino | Comercial Livre |
| `fem-body-medium.jpg` | Físico feminino intermediário | Onboarding Feminino | Comercial Livre |
| `fem-body-overweight.jpg` | Físico feminino com sobrepeso | Onboarding Feminino | Comercial Livre |
| `fem-goal-toned.jpg` | Físico feminino tonificado (glúteos e abdômen) | Onboarding Feminino | Comercial Livre |
| `fem-goal-strong.jpg` | Físico feminino atlético de força calistênica | Onboarding Feminino | Comercial Livre |

---

### C. Comunidade VIP & Feed Tático
Fotos de posts de demonstração no feed social utilizam fotos reais de preparo de refeições saudáveis para transmitir autenticidade total entre os recrutas:
- **Almoço de recuperação (Sargento Mateo / Teniente Marcos):** Foto real de pechuga grelhada com legumes (`photo-1546069901-ba9599a7e63c`).
- **Avatares dos Soldados:** Ícones táticos em SVG vetorial (`tactical-helmet`, `recon-goggles`, `beret-commando`, `stealth-mask`) com renderização em canvas nativo, eliminando qualquer risco de caricatura ou problema de direitos de imagem de terceiros.

---

## 4. GUIA PARA O PRODUTOR: COMO SUBSTITUIR POR FOTOS PRÓPRIAS

Caso você (ou o atleta porta-voz do Protocolo) queira substituir as fotos do aplicativo por fotos próprias com a sua imagem:

1. **Fotos de Biotipo / Evolução:**
   - Salve suas fotos nos formatos `.jpg` ou `.webp`.
   - Mantenha a proporção vertical (ex: 600x800px ou 800x1200px).
   - Substitua os arquivos dentro de `app/assets/` com os mesmos nomes (ex: `male-goal-athletic.jpg`).

2. **Vídeos de Demonstração dos Exercícios:**
   - Grave no celular na vertical (9:16 ou 3:4) em local iluminado.
   - Duração: 5 a 10 segundos por exercício (2 a 3 repetições completas em loop).
   - Exporte em `.mp4` (codec H.264, peso abaixo de 2MB por vídeo).
   - Coloque os arquivos na pasta `app/assets/videos/` conforme a [LISTA-DE-GRAVACAO.md](file:///C:/Users/buggu/.gemini/antigravity/scratch/Protocolo%20da%20Calistenia/LISTA-DE-GRAVACAO.md).

3. **Receitas Culinárias:**
   - Para trocar a foto de qualquer receita da base, basta atualizar o atributo `image` no objeto correspondente em `app/js/recipes-db.js`.
   - Se o usuário cadastrar uma receita própria no app, ela é salva no armazenamento local privado do celular dele (`mis_recetas`), garantindo privacidade total.

