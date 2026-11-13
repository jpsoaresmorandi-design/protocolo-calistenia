/**
 * Servidor HTTP Nativo Zero-Dependências
 * Protocolo de Calistenia Militar - PWA & Funil
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const ROOT_DIR = __dirname;
const APP_DIR = path.join(ROOT_DIR, 'app');

const MIME_TYPES = {
  '.html': 'text/html; charset=utf-8',
  '.js': 'application/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.woff2': 'font/woff2',
  '.woff': 'font/woff',
  '.mp4': 'video/mp4',
  '.ico': 'image/x-icon'
};

function getSafeFilePath(urlPath) {
  let cleanUrl = urlPath.split('?')[0].split('#')[0];

  // Atalhos de rota amigáveis
  if (cleanUrl === '/' || cleanUrl === '/app') {
    return path.join(APP_DIR, 'index.html');
  }
  if (cleanUrl === '/quiz' || cleanUrl === '/funil') {
    return path.join(ROOT_DIR, 'index.html');
  }
  if (cleanUrl === '/vsl') {
    return path.join(ROOT_DIR, 'vsl.html');
  }

  // Normaliza caminhos com ../assets ou app/assets
  if (cleanUrl.startsWith('/../assets/')) {
    cleanUrl = cleanUrl.replace('/../assets/', '/assets/');
  }

  // Se a rota começar com /app/
  if (cleanUrl.startsWith('/app/')) {
    const sub = cleanUrl.substring(5);
    if (!sub || sub === '/') return path.join(APP_DIR, 'index.html');
    const cand = path.join(APP_DIR, sub);
    if (fs.existsSync(cand) && !fs.statSync(cand).isDirectory()) return cand;
    if (fs.existsSync(path.join(cand, 'index.html'))) return path.join(cand, 'index.html');
  }

  // Tenta resolver no diretório raiz
  const directPath = path.join(ROOT_DIR, cleanUrl);
  if (fs.existsSync(directPath) && !fs.statSync(directPath).isDirectory()) {
    return directPath;
  }

  // Tenta resolver dentro de app/
  const appPath = path.join(APP_DIR, cleanUrl);
  if (fs.existsSync(appPath) && !fs.statSync(appPath).isDirectory()) {
    return appPath;
  }

  // Fallback para assets no diretório raiz
  if (cleanUrl.startsWith('/assets/')) {
    const assetPath = path.join(ROOT_DIR, cleanUrl);
    if (fs.existsSync(assetPath)) return assetPath;
  }

  return null;
}

const server = http.createServer((req, res) => {
  // CORS & PWA headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, HEAD, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', '*');
  res.setHeader('Service-Worker-Allowed', '/');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const cleanPath = req.url.split('?')[0].split('#')[0];
  if (cleanPath === '/app') {
    res.writeHead(301, { 'Location': '/app/' });
    res.end();
    return;
  }

  const filePath = getSafeFilePath(req.url);

  if (!filePath || !fs.existsSync(filePath)) {
    // 404 amigável
    res.writeHead(404, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(`
      <!DOCTYPE html>
      <html>
      <head><title>404 - Página no encontrada</title><meta charset="utf-8"></head>
      <body style="background:#0a0c0a; color:#fff; font-family:sans-serif; text-align:center; padding:50px 20px;">
        <h1 style="color:#d4af37;">404 - Archivo no encontrado</h1>
        <p style="color:#a1a1aa;">La ruta solicitada <code>${req.url}</code> no existe en el servidor.</p>
        <div style="margin-top:20px;">
          <a href="/app/" style="background:#d4af37; color:#000; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold; margin-right:10px;">Ir a la App PWA</a>
          <a href="/quiz" style="background:#2e432f; color:#fff; padding:10px 20px; border-radius:6px; text-decoration:none; font-weight:bold;">Ir al Quiz</a>
        </div>
      </body>
      </html>
    `);
    return;
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  try {
    const stat = fs.statSync(filePath);

    // Suporte para streaming parcial de vídeo MP4 (Seek / Range Requests)
    if (ext === '.mp4' && req.headers.range) {
      const range = req.headers.range;
      const parts = range.replace(/bytes=/, '').split('-');
      const start = parseInt(parts[0], 10);
      const end = parts[1] ? parseInt(parts[1], 10) : stat.size - 1;
      const chunkSize = (end - start) + 1;
      const stream = fs.createReadStream(filePath, { start, end });

      res.writeHead(206, {
        'Content-Range': `bytes ${start}-${end}/${stat.size}`,
        'Accept-Ranges': 'bytes',
        'Content-Length': chunkSize,
        'Content-Type': contentType
      });
      stream.pipe(res);
      return;
    }

    res.writeHead(200, {
      'Content-Type': contentType,
      'Content-Length': stat.size,
      'Cache-Control': ext === '.html' ? 'no-cache' : 'public, max-age=86400'
    });

    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (err) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Erro interno do servidor: ' + err.message);
  }
});

function startServer(port = 3000) {
  server.listen(port, () => {
    console.log('\n======================================================');
    console.log('🚀 SERVIDOR DO PROTOCOLO DA CALISTENIA ATIVO!');
    console.log('======================================================');
    console.log(`\n📱 Aplicativo PWA Principal:   http://localhost:${port}/`);
    console.log(`📱 Aplicativo PWA (URL direta): http://localhost:${port}/app/`);
    console.log(`🎯 Funil / Quiz:                http://localhost:${port}/quiz`);
    console.log(`🎬 Vídeo de Vendas (VSL):       http://localhost:${port}/vsl`);
    console.log('\nPressione Ctrl+C para encerrar o servidor.');
    console.log('======================================================\n');
  }).on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Porta ${port} ocupada, tentando ${port + 1}...`);
      startServer(port + 1);
    } else {
      console.error('Falha ao iniciar servidor:', err);
    }
  });
}

const targetPort = parseInt(process.env.PORT || '3000', 10);
startServer(targetPort);

