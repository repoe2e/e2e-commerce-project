// Deploy manual para Cloudflare Pages
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🚀 Iniciando deploy manual...');

// 1. Gerar pasta dist
console.log('📦 Gerando pasta dist...');
execSync('npm run build', { stdio: 'inherit' });

// 2. Verificar se dist existe
if (!fs.existsSync('dist')) {
  console.error('❌ Pasta dist não encontrada!');
  process.exit(1);
}

console.log('✅ Pasta dist gerada com sucesso!');

// 3. Listar arquivos
const files = fs.readdirSync('dist');
console.log('📁 Arquivos na pasta dist:', files);

// 4. Instruções para deploy manual
console.log('\n🎯 Para fazer deploy manual:');
console.log('1. Instale Wrangler: npm install -g wrangler');
console.log('2. Faça login: wrangler login');
console.log('3. Deploy: wrangler pages deploy dist --project-name e2e-commerce');
console.log('\n🌐 Ou use o painel do Cloudflare Pages para fazer upload da pasta dist/');
