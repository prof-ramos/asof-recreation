# ASOF Website Recreation
Reimplementação completa do portal da Associação Nacional dos Oficiais de Chancelaria (ASOF), incluindo site público e CMS administrativo, usando Next.js 16 e a stack moderna do ecossistema React. A experiência, conteúdos e fluxos de gestão foram reconstruídos para operar como um produto final — apenas a camada de persistência ainda está em modo MVP (SQLite/local store) até a migração para o banco definitivo.

## 🚀 Panorama
- Navegação pública espelha o site original (home, notícias, eventos, associação, biblioteca, contato).
- CMS `/cms` permite administrar banners, páginas, eventos, vídeos, biblioteca e filiações.
- API Routes em `/api/filiacoes` oferecem CRUD completo e endpoints auxiliares para aprovação/rejeição.
- Design responsivo, acessibilidade via Radix UI e tipagem end-to-end com TypeScript.

## ⚙️ Stack Principal
- **Next.js 16 + React 19** (App Router, server/client components).
- **TypeScript** com strict mode, ESLint flat config e alias `@/`.
- **Tailwind CSS** + **shadcn/ui** + **Radix UI** para UI consistente.
- **Zustand** para stores locais, **TanStack Table** e **Recharts** para dashboards.
- **React Hook Form** + **Zod** na validação dos formulários administrativos.

## 📁 Estrutura Essencial
```
src/
 ├─ app/             # Rotas e layouts (público + /cms)
 ├─ components/      # Componentes reutilizáveis (ui/, cms/, etc.)
 ├─ hooks/           # Hooks específicos da aplicação
 ├─ lib/             # Persistência e integrações (database.ts, seeds)
 ├─ stores/          # Estados Zustand por domínio
 ├─ types/           # Modelos TypeScript compartilhados
 └─ utils/           # Helpers e camada de acesso a dados (api.ts)
public/              # Assets estáticos
data/                # Dumps gerados pelas operações CRUD
```

## ▶️ Como executar
```bash
# 1. Pré-requisitos
node --version   # deve ser 18+

# 2. Instale dependências
npm install

# 3. Ambiente de desenvolvimento
npm run dev      # http://localhost:3000 e http://localhost:3000/cms

# 4. Produção local
npm run build
npm run start
```
Scripts úteis: `npm run lint` (linting completo) e `npm run dev -- --turbo` para acelerar o desenvolvimento em máquinas mais lentas.

## 🧱 Arquitetura & Persistência
- **Front-end**: App Router com layouts independentes para público e CMS, reaproveitando cabeçalhos/rodapés via `src/components`.
- **API Routes**: `src/app/api` encapsula regras de negócio (validação, filtros, estados de filiação).
- **Persistência (MVP)**: `src/lib/database.ts` abstrai CRUD em arquivos `data/*.json`, reproduzindo o contrato pensado para um SQLite local. Essa camada é a única tratada como MVP temporário e será substituída por uma instância SQLite/SQL dedicada sem alterar o contrato das rotas.
- **Mocks sincronizados**: `src/utils/api.ts` fornece dados baseados no site original e deve permanecer em sincronia com a camada persistente para evitar divergências em páginas públicas.

## 🛠️ Convenções de desenvolvimento
- Respeitar o formato de importação com alias `@/`.
- Seguir identação de 2 espaços, componentes em PascalCase e hooks prefixados com `use`.
- Rodar `npm run lint` antes de abrir PRs e anexar evidências (prints/GIFs) para mudanças visuais.
- Atualizar `seedDatabase()` ao introduzir novos campos para garantir consistência em ambientes limpos.

## 📌 Roadmap imediato
- Migrar `src/lib/database.ts` para SQLite file-based definitivo.
- Configurar pipeline de CI (lint + build + smoke tests).
- Introduzir autenticação/autorização no CMS assim que o backend oficial estiver disponível.

## 📄 Licença
Este repositório é de uso restrito à ASOF e colaboradores autorizados. Consulte a diretoria antes de distribuir ou publicar forks.
