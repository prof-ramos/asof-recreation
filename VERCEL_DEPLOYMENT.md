# Vercel Deployment Guide

Este guia fornece instruções detalhadas para fazer deploy do portal ASOF na plataforma Vercel.

## 📋 Índice

- [Pré-requisitos](#pré-requisitos)
- [Configuração Inicial](#configuração-inicial)
- [Limitações Importantes](#limitações-importantes)
- [Deploy Manual](#deploy-manual)
- [Deploy via GitHub](#deploy-via-github)
- [Variáveis de Ambiente](#variáveis-de-ambiente)
- [Monitoramento e Analytics](#monitoramento-e-analytics)
- [Troubleshooting](#troubleshooting)

## 🎯 Pré-requisitos

- Conta Vercel (gratuita ou paga)
- Repositório Git (GitHub, GitLab, ou Bitbucket)
- Node.js 18+ instalado localmente
- Vercel CLI (opcional): `npm i -g vercel`

## ⚙️ Configuração Inicial

### 1. Conectar Repositório ao Vercel

1. Acesse [vercel.com](https://vercel.com) e faça login
2. Clique em "Add New Project"
3. Importe seu repositório do GitHub
4. Configure as seguintes opções:
   - **Framework Preset**: Next.js
   - **Root Directory**: `./` (raiz do projeto)
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`

### 2. Configurar Variáveis de Ambiente

Na dashboard do Vercel, vá em "Settings" > "Environment Variables" e adicione:

```bash
# Obrigatórias para produção
NEXT_PUBLIC_APP_URL=https://seu-dominio.vercel.app
NEXT_PUBLIC_SITE_URL=https://www.asof.org.br
DATABASE_URL=postgresql://user:pass@host/db  # Ver seção de banco de dados
```

**Ver arquivo `.env.example` para lista completa de variáveis.**

## ⚠️ Limitações Importantes

### 🗄️ Banco de Dados SQLite

**PROBLEMA**: O projeto atualmente usa SQLite com `better-sqlite3`, que **NÃO funciona em ambientes serverless** como Vercel.

**MOTIVO**:
- Vercel usa funções serverless sem sistema de arquivos persistente
- Cada requisição pode rodar em um container diferente
- O arquivo `.db` não persiste entre invocações

**SOLUÇÕES RECOMENDADAS**:

#### Opção 1: Vercel Postgres (Recomendado)
```bash
# Instalar pacote
npm install @vercel/postgres

# Ativar no dashboard do Vercel
# Settings > Data > Vercel Postgres > Create Database
```

**Vantagens**:
- Integração nativa com Vercel
- Conexão automática via variáveis de ambiente
- Plano gratuito disponível
- Pool de conexões gerenciado

**Migração necessária**:
- Reescrever `src/lib/sqlite-database.ts` para usar Postgres
- Adaptar queries SQL (sintaxe é similar mas há diferenças)
- Migrar dados do SQLite para Postgres

#### Opção 2: Neon Database
```bash
npm install @neondatabase/serverless
```

**Vantagens**:
- Postgres serverless otimizado
- Edge functions com latência baixa
- Plano gratuito generoso
- Compatível com Vercel

#### Opção 3: Turso (SQLite na Edge)
```bash
npm install @libsql/client
```

**Vantagens**:
- Mantém SQLite (menos migração)
- Distribuído globalmente
- API compatível com SQLite

#### Opção 4: PlanetScale (MySQL)
```bash
npm install @planetscale/database
```

**Vantagens**:
- Escala automática
- Branching de database (como Git)
- Plano gratuito robusto

### 📁 Upload de Arquivos

**PROBLEMA**: Arquivos salvos em `public/storage/` **NÃO persistem** no Vercel.

**MOTIVO**:
- Sistema de arquivos é efêmero em serverless
- Cada deploy limpa arquivos não versionados
- Uploads são perdidos no próximo deploy

**SOLUÇÕES RECOMENDADAS**:

#### Opção 1: Vercel Blob Storage (Recomendado)
```bash
npm install @vercel/blob

# Exemplo de uso
import { put } from '@vercel/blob';

const blob = await put('avatar.png', file, {
  access: 'public',
});
// blob.url - URL pública do arquivo
```

**Vantagens**:
- Integração nativa com Vercel
- CDN global automático
- Plano gratuito: 1 GB transfer/mês

#### Opção 2: Cloudinary
```bash
npm install cloudinary

# Oferece transformação de imagens
# Plano gratuito: 25GB storage, 25GB bandwidth
```

#### Opção 3: AWS S3 + CloudFront
```bash
npm install @aws-sdk/client-s3
npm install @aws-sdk/s3-request-presigner

# Maior controle e escalabilidade
# Requer configuração AWS
```

#### Opção 4: UploadThing
```bash
npm install uploadthing

# Simples de integrar
# Plano gratuito: 2GB storage
```

### 🔄 Implementação Recomendada

Para minimizar impacto, sugere-se uma abordagem faseada:

**Fase 1 - Deploy Básico** (atual):
- Deploy do site público apenas para visualização
- Database read-only ou mock data
- Sem funcionalidade de upload

**Fase 2 - Migração de Dados**:
- Escolher provedor de banco (recomendado: Vercel Postgres)
- Migrar esquema e dados do SQLite
- Atualizar `src/lib/database.ts`
- Testar CRUD operations

**Fase 3 - Sistema de Upload**:
- Implementar Vercel Blob ou alternativa
- Atualizar API routes de upload (`/api/media`)
- Migrar arquivos existentes para cloud storage
- Atualizar URLs de imagens no banco

## 🚀 Deploy Manual

### Via Vercel CLI

```bash
# Instalar CLI globalmente
npm i -g vercel

# Login
vercel login

# Deploy para preview
vercel

# Deploy para produção
vercel --prod
```

### Via Dashboard

1. Acesse o projeto no dashboard
2. Vá em "Deployments"
3. Clique em "Redeploy" no último deploy bem-sucedido
4. Ou faça push para a branch `main` para deploy automático

## 🔄 Deploy via GitHub

### Configuração Automática

1. Conecte o repositório ao Vercel (veja seção Configuração Inicial)
2. A cada push, o Vercel automaticamente:
   - **Branch `main`**: Deploy em produção
   - **Pull Requests**: Preview deployment com URL única
   - **Outras branches**: Preview deployment

### GitHub Actions (Opcional)

Se quiser mais controle, crie `.github/workflows/deploy.yml`:

```yaml
name: Deploy to Vercel

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Run linter
        run: npm run lint

      - name: Run tests
        run: npm test

      - name: Build project
        run: npm run build

      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
```

**Secrets necessários** (em Settings > Secrets):
- `VERCEL_TOKEN`: Token da API Vercel
- `VERCEL_ORG_ID`: ID da organização/team
- `VERCEL_PROJECT_ID`: ID do projeto

## 🔐 Variáveis de Ambiente

### Produção

Configure em: **Dashboard > Settings > Environment Variables > Production**

```bash
# Database (CRÍTICO - migrar de SQLite)
DATABASE_URL=postgresql://...

# Site URLs
NEXT_PUBLIC_APP_URL=https://www.asof.org.br
NEXT_PUBLIC_SITE_URL=https://www.asof.org.br

# Email (quando implementado)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=email@asof.org.br
SMTP_PASSWORD=app-password-here
SMTP_FROM=noreply@asof.org.br

# Google Verification
GOOGLE_SITE_VERIFICATION=seu-token-aqui
```

### Preview/Development

Configure variáveis específicas para ambientes de teste:

```bash
DATABASE_URL=postgresql://preview-db...
NEXT_PUBLIC_APP_URL=https://preview-asof.vercel.app
```

## 📊 Monitoramento e Analytics

### Vercel Analytics

**Já configurado!** Os componentes estão no `src/app/layout.tsx`:

```typescript
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
```

**Acesso**:
- Dashboard > Analytics (disponível após primeiro deploy)
- Monitora: Page views, Top pages, Visitors, Devices

### Speed Insights

**Já configurado!** Coleta Core Web Vitals:
- LCP (Largest Contentful Paint)
- FID (First Input Delay)
- CLS (Cumulative Layout Shift)

**Acesso**:
- Dashboard > Speed Insights
- Filtre por página, dispositivo, país

### Logs e Erros

**Runtime Logs**:
- Dashboard > Deployments > [Deployment] > Logs
- Mostra console.log e erros em tempo real

**Recomendação**: Integrar com:
- **Sentry** para error tracking
- **LogRocket** para session replay
- **Datadog** para APM completo

## 🛠️ Troubleshooting

### Build Falha

**Erro**: `Module not found: Can't resolve 'better-sqlite3'`

**Solução**:
- SQLite não funciona no Vercel - migre para Postgres (veja seção Limitações)
- Temporariamente, comente código relacionado ao database para testar build

**Erro**: `Failed to fetch 'Geist' from Google Fonts` (durante build local)

**Solução**:
- Este erro ocorre apenas em ambientes com restrições de rede/TLS
- No Vercel, o build funcionará normalmente
- Para testar localmente, use: `NEXT_TURBOPACK_EXPERIMENTAL_USE_SYSTEM_TLS_CERTS=1 npm run build`
- Ou remova temporariamente as fontes do Google do layout

**Erro**: `Image optimization error`

**Solução**:
- Verifique `next.config.ts` > `images.remotePatterns`
- Adicione domínios de CDN/storage que você usa

### Timeout de Função

**Erro**: `FUNCTION_INVOCATION_TIMEOUT`

**Solução**:
- Plano gratuito: máximo 10s por request
- Plano Pro: máximo 30s (já configurado em `vercel.json`)
- Otimize queries lentas ou mova para background jobs

### Cold Start Lento

**Problema**: Primeira requisição após inatividade demora muito

**Soluções**:
- Reduza tamanho do bundle (já otimizado com `optimizePackageImports`)
- Use ISR (Incremental Static Regeneration) para páginas públicas
- Considere Edge Functions para rotas críticas
- Plano Pro tem menos cold starts

### Database Connection Issues

**Erro**: `Too many connections`

**Solução**:
- Use connection pooling (Postgres)
- Para Vercel Postgres, use `@vercel/postgres` que gerencia automaticamente
- Limite: 20 conexões no plano gratuito

### Upload de Arquivos Não Funciona

**Problema**: Arquivos salvos desaparecem

**Causa**: Sistema de arquivos é efêmero (veja seção Limitações)

**Solução**: Migre para cloud storage (Vercel Blob, S3, Cloudinary)

## 📚 Recursos Adicionais

- [Documentação Vercel](https://vercel.com/docs)
- [Next.js no Vercel](https://vercel.com/docs/frameworks/nextjs)
- [Vercel Postgres](https://vercel.com/docs/storage/vercel-postgres)
- [Vercel Blob Storage](https://vercel.com/docs/storage/vercel-blob)
- [Edge Functions](https://vercel.com/docs/functions/edge-functions)

## 🎯 Checklist de Deploy

Antes de fazer deploy para produção:

- [ ] Migrar banco de dados de SQLite para Postgres/Neon/Turso
- [ ] Implementar cloud storage para uploads
- [ ] Configurar todas as variáveis de ambiente
- [ ] Testar build localmente: `npm run build && npm start`
- [ ] Configurar domínio customizado (www.asof.org.br)
- [ ] Adicionar SSL certificate (automático via Vercel)
- [ ] Configurar redirects (HTTP → HTTPS, www ↔ non-www)
- [ ] Testar todas as rotas públicas e CMS
- [ ] Configurar backups de database
- [  ] Implementar autenticação no CMS
- [ ] Adicionar rate limiting nas API routes
- [ ] Configurar error monitoring (Sentry)
- [ ] Testar Core Web Vitals (target: 90+ score)
- [ ] Validar SEO (meta tags, sitemap, robots.txt)

## 🚨 Atenção

**Este deploy inicial é para PREVIEW/TESTE apenas.**

Para usar em produção, é **OBRIGATÓRIO** migrar:
1. ✅ Banco de dados SQLite → Postgres/Neon/Turso
2. ✅ Sistema de arquivos local → Cloud storage

Sem essas migrações, o CMS não funcionará corretamente em produção.
