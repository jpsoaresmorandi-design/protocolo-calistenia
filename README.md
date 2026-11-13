# Protocolo da Calistenia

Projeto completo reconstruído localmente a partir da página original, sem dependências de ferramentas pagas de vídeo ou rastreamentos legados.

## 📁 Estrutura de Arquivos

- `index.html`: Página principal do Quiz. Todo o CSS inline original, fontes locais e imagens foram mantidos com precisão cirúrgica de pixels e proporções. As tags antigas do Meta Pixel, UTMify e Supabase foram removidas para uma base limpa.
- `app.js`: Motor interativo das 19 etapas do funil militar (perguntas, régua de altura/peso, gráfico SVG, animação militar de recrutamento e aprovação).
- `vsl.html`: Página do Vídeo de Vendas (VSL). Possui o **player local estilo VTurbo**, com suporte a:
  - Smart Autoplay com o banner animado *"HAZ CLIC AQUÍ PARA ESCUCHAR"*.
  - Desbloqueio e reprodução local de alta performance via HLS/MP4 offline.
  - Barra de progresso discreta (fakeBar).
  - Revelação do botão de checkout aos 505 segundos (ou instantaneamente testável adicionando `?cta=1` na URL).
  - Botão de checkout preservado visualmente e pronto para receber o novo link.
  - Memória de reprodução (*"Continuar viendo?"*).
- `assets/`:
  - 34 imagens, fotos e ícones originais do quiz.
  - Fonte própria `inter-latin.woff2`.
  - Vídeo completo `vsl-video.mp4` (53 MB) e streaming local em `assets/hls/`.
  - Poster de abertura `vsl-poster.jpg`.
  - Biblioteca `hls.min.js`.

---

## 🚀 Como Visualizar e Testar no Computador

Você pode dar um duplo clique diretamente em `index.html` ou `vsl.html` para abrir no navegador, ou rodar o servidor local com o comando:

```bash
npx serve .
```

E acessar no navegador: `http://localhost:3000`

### Como testar o botão de checkout na VSL sem esperar 8 minutos:
Basta acessar:
`http://localhost:3000/vsl.html?cta=1`

### Onde alterar o link do Checkout futuramente:
Abra o arquivo `vsl.html` e edite a linha 328:
```javascript
const CHECKOUT_URL = 'https://seu-link-de-checkout-aqui.com';
```

