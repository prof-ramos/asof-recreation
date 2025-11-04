# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Projeto

Portal da Associação Nacional dos Oficiais de Chancelaria (ASOF) - Uma reimplementação completa do site público e CMS administrativo usando Next.js 16 e React 19.

## Comandos Essenciais

### Desenvolvimento
```bash
npm run dev              # Inicia servidor de desenvolvimento em http://localhost:3000
npm run dev -- --turbo   # Usa Turbopack para builds mais rápidos (recomendado no MacBook Air M3)
```

### Build e Produção
```bash
npm run build            # Build de produção
npm run start            # Inicia servidor de produção (requer build primeiro)
```

### Qualidade de Código
```bash
npm run lint             # Executa ESLint em todo o projeto
```

### Testes
```bash
npm test                 # Executa testes Jest
npm run test:watch       # Executa testes em modo watch
npm run test:coverage    # Gera relatório de cobertura de testes
npx playwright test      # Executa testes E2E com Playwright
npx playwright test --ui # Interface interativa do Playwright
```

### Teste de Arquivo Único
```bash
npm test -- src/__tests__/caminho/arquivo.test.ts
npx playwright test tests/caminho/arquivo.spec.ts
```

## Arquitetura de Alto Nível

### Estrutura de Rotas (App Router)
O projeto usa Next.js 16 App Router com dois "mundos" separados:
- **Site Público**: rotas em `src/app/` (home, notícias, eventos, biblioteca, contato, etc.)
- **CMS Administrativo**: rotas em `src/app/cms/` com layout independente para gerenciar todo o conteúdo

### Camada de Dados
O projeto passou de JSON mockado para SQLite persistente:
- **`src/lib/database.ts`**: ponto único de entrada para todas as operações de dados, re-exporta instâncias de `sqlite-database.ts`
- **`src/lib/sqlite-database.ts`**: implementação real do SQLite com todas as tabelas e operações CRUD
- **`src/utils/api.ts`**: funções auxiliares para consumir as API routes no cliente (fetchNoticias, fetchEventos, etc.) - alguns dados ainda mockados para páginas públicas

### API Routes Pattern
Todas as API routes seguem o padrão RESTful em `src/app/api/`:
```
/api/noticias          GET (lista c/ paginação), POST
/api/noticias/[id]     GET, PUT, DELETE
/api/noticias/slug/[slug]  GET (busca por slug)
/api/filiacoes         GET (com filtro ?status=), POST
/api/filiacoes/[id]    GET, PUT, DELETE
/api/filiacoes/[id]/approve   POST
/api/filiacoes/[id]/reject    POST
/api/eventos           GET (paginado), POST
/api/eventos/[id]      GET, PUT, DELETE
/api/categorias        GET
/api/media             GET, POST (upload)
/api/media/[id]        DELETE
/api/stats             GET (dashboard CMS)
```

**Convenção importante**: rotas que aceitam uploads usam `FormData`, outras usam JSON. As funções em `api.ts` já tratam ambos os casos.

### Gerenciamento de Estado
- **Zustand**: stores locais por domínio em `src/stores/` (ex: `filiacao-store.ts`)
- **Server State**: dados vêm das API routes, sem cache client-side complexo
- **Form State**: React Hook Form + Zod para validação

### Componentes UI
- **shadcn/ui + Radix UI**: todos os componentes base estão em `src/components/ui/`
- **Componentes de domínio**: organizados por contexto (cms/, public/, shared/)
- **Convenção**: usar alias `@/` para imports absolutos

### Imagens e Assets
- **Next.js Image**: configurado para aceitar múltiplos domínios (Flickr, localhost, asof.harnet.dev)
- **Upload de mídia**: via `/api/media` com armazenamento em `public/storage/`
- **Formatos otimizados**: AVIF e WebP habilitados, cache de 24h

## TypeScript e Aliases

- **Strict mode ativado**: todo código deve ter tipagem completa
- **Alias `@/`**: sempre use `@/` para imports relativos a `src/`
  ```typescript
  import { Noticia } from '@/types'
  import { noticiasDb } from '@/lib/database'
  ```
- **Tipos compartilhados**: todos os tipos/interfaces estão em `src/types/`

## Convenções de Código

1. **Naming**:
   - Componentes: PascalCase (`NoticiaCard.tsx`)
   - Hooks: prefixo `use` (`useFiliacoes.ts`)
   - Variáveis/funções: camelCase em inglês
   - Comentários: português brasileiro quando apropriado

2. **Indentação**: 2 espaços (configurado no projeto)

3. **Imports**: ordenar por: externos → internos → tipos → relativos

4. **API Routes**:
   - Sempre validar entrada com Zod ou checks básicos
   - Retornar status HTTP apropriados (400, 404, 500)
   - Usar try-catch e logar erros no console

5. **Client Components**: marcar explicitamente com `'use client'` apenas quando necessário (interatividade, hooks do React, event handlers)

## Performance e Otimizações

- **Turbopack**: use `--turbo` no dev para builds mais rápidos no MacBook Air M3
- **Image optimization**: Next.js otimiza automaticamente todas as imagens via `next/image`
- **Bundle analysis**: componentes Lucide otimizados via `experimental.optimizePackageImports`
- **Security headers**: configurados em `next.config.ts` (CSP, XSS protection, etc.)

## Workflow de Desenvolvimento

1. **Antes de abrir PRs**:
   - Rodar `npm run lint` e corrigir problemas
   - Garantir que `npm run build` passa sem erros
   - Anexar evidências visuais (screenshots/GIFs) para mudanças de UI

2. **Mudanças na estrutura de dados**:
   - Atualizar tipos em `src/types/`
   - Modificar schema em `sqlite-database.ts`
   - Garantir que API routes refletem as mudanças
   - Manter `api.ts` sincronizado se houver mocks

3. **Novos componentes UI**:
   - Preferir shadcn/ui quando disponível
   - Documentar props com JSDoc se complexo
   - Garantir acessibilidade (ARIA labels, keyboard nav)

## Pontos de Atenção

- **SQLite migration**: a camada de persistência foi migrada de JSON para SQLite. Se encontrar referências antigas a `data/*.json`, considere obsoletas.
- **Mock vs Real data**: `api.ts` ainda tem alguns mocks (banners, fotos) para páginas públicas. Mantenha sincronia com dados reais.
- **Uploads**: arquivos vão para `public/storage/`. Em produção, considerar CDN/cloud storage.
- **Auth**: CMS ainda não tem autenticação. Está no roadmap para próxima fase.
- **Memory constraints**: no MacBook Air M3 8GB, evite rodar múltiplos dev servers ou builds simultâneos.

## Contexto de Negócio

A ASOF é uma associação de oficiais de chancelaria. O portal serve para:
1. Divulgar notícias e eventos da categoria
2. Disponibilizar biblioteca de documentos e vídeos
3. Gerenciar processos de filiação de novos membros
4. Informar sobre a associação e permitir contato

Qualquer dúvida sobre requisitos, consultar `README.md` ou a documentação em `docs/` (se existir).
