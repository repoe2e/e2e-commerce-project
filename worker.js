// Cloudflare Worker com autenticação Access
import { jwtVerify, createRemoteJWKSet } from 'jose';

export default {
  async fetch(request, env, ctx) {
    // Verificar se o POLICY_AUD está configurado
    if (!env.POLICY_AUD) {
      return new Response('Missing required audience', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    // Obter o JWT do header
    const token = request.headers.get('cf-access-jwt-assertion');

    // Verificar se o token existe
    if (!token) {
      return new Response('Missing required CF Access JWT', {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }

    try {
      // Criar JWKS do domínio da equipe
      const JWKS = createRemoteJWKSet(new URL(`${env.TEAM_DOMAIN}/cdn-cgi/access/certs`));

      // Verificar o JWT
      const { payload } = await jwtVerify(token, JWKS, {
        issuer: env.TEAM_DOMAIN,
        audience: env.POLICY_AUD,
      });

      // Token válido, prosseguir com a lógica da aplicação
      const url = new URL(request.url);
      let pathname = url.pathname;

      // Se for a raiz, servir index.html
      if (pathname === '/') {
        pathname = '/index.html';
      }

      // Mapear arquivos estáticos
      const staticFiles = {
        '/index.html': 'text/html',
        '/404.html': 'text/html',
        '/styles.css': 'text/css',
        '/script.js': 'application/javascript',
        '/manifest.json': 'application/json',
        '/sw.js': 'application/javascript',
        '/cloudflare-integration.js': 'application/javascript'
      };

      // Verificar se é um arquivo estático conhecido
      if (staticFiles[pathname]) {
        try {
          // Em produção, os arquivos estariam no KV ou R2
          // Por enquanto, vamos retornar uma resposta básica
          if (pathname === '/index.html') {
            return new Response(`
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>E2E-Commerce</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
        .container { max-width: 800px; margin: 0 auto; background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 10px rgba(0,0,0,0.1); }
        .header { text-align: center; margin-bottom: 30px; }
        .logo { font-size: 2em; color: #667eea; font-weight: bold; }
        .message { text-align: center; color: #666; }
        .btn { background: #667eea; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; text-decoration: none; display: inline-block; margin: 10px; }
        .btn:hover { background: #5a6fd8; }
        .user-info { background: #e8f4fd; padding: 15px; border-radius: 5px; margin: 20px 0; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🛒 E2E-Commerce</div>
        </div>
        <div class="user-info">
            <h3>🔐 Autenticado com Cloudflare Access</h3>
            <p><strong>Email:</strong> ${payload.email || 'Usuário autenticado'}</p>
            <p><strong>Token válido:</strong> ✅</p>
        </div>
        <div class="message">
            <h2>🚀 Site em Construção</h2>
            <p>O E2E-Commerce está sendo configurado para Cloudflare Pages.</p>
            <p>Em breve, você terá acesso ao sistema completo de e-commerce!</p>
            <a href="#" class="btn">Em Breve</a>
        </div>
    </div>
</body>
</html>
            `, {
              headers: {
                'Content-Type': 'text/html',
                'Cache-Control': 'public, max-age=3600'
              }
            });
          }
        } catch (error) {
          return new Response('Erro ao carregar arquivo', { status: 500 });
        }
      }

      // Para outros arquivos, retornar 404
      return new Response('Arquivo não encontrado', { status: 404 });

    } catch (error) {
      // Falha na verificação do token
      return new Response(`Invalid token: ${error.message}`, {
        status: 403,
        headers: { 'Content-Type': 'text/plain' }
      });
    }
  }
};
