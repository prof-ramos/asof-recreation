# Guia de Desenvolvimento ASOF

## Configuração do Ambiente

### Pré-requisitos
- Node.js 18+ 
- npm ou yarn
- Git

### Instalação

1. Clone o repositório:
```bash
git clone <url-do-repositorio>
cd asof-recreation
```

2. Instale as dependências:
```bash
npm install
```

3. Configure as variáveis de ambiente:
```bash
cp .env.example .env.local
# Edite .env.local com as configurações adequadas
```

### Variáveis de Ambiente

| Variável | Descrição | Padrão |
|----------|-----------|---------|
| DATABASE_URL | Caminho para o banco de dados SQLite | ./asof_database.db |
| USE_SQLITE | Habilitar uso do SQLite | false |
| LOG_LEVEL | Nível de log (debug, info, warn, error) | info |
| LOG_TO_FILE | Registrar logs em arquivo | true |

## Estrutura do Projeto

```
asof-recreation/
├── public/              # Arquivos estáticos
├── src/
│   ├── app/            # Páginas e rotas do Next.js
│   ├── components/     # Componentes reutilizáveis
│   ├── context/        # Contextos do React
│   ├── hooks/          # Hooks personalizados
│   ├── lib/            # Lógica de negócios e utilitários
│   ├── stores/         # Stores do Zustand
│   ├── types/          # Tipos TypeScript
│   └── utils/          # Utilitários genéricos
├── docs/               # Documentação
├── tests/              # Testes (quando aplicável)
└── package.json
```

## Desenvolvimento

### Executando o Projeto

Durante o desenvolvimento:
```bash
npm run dev
```

O servidor estará disponível em `http://localhost:3000`

### Scripts Disponíveis

- `npm run dev` - Executa o servidor de desenvolvimento
- `npm run build` - Cria uma build de produção
- `npm start` - Inicia o servidor de produção
- `npm run lint` - Executa o linter
- `npm test` - Executa os testes unitários
- `npm test:watch` - Executa os testes em modo watch
- `npm test:coverage` - Executa os testes com cobertura

## Convenções de Código

### Estilização

- Usamos Tailwind CSS para estilização
- Componentes acessíveis seguindo WCAG 2.1 AA
- Cores institucionais: `#1e40af` (azul primário), `#3b82f6` (azul secundário)

### Componentes

- Componentes devem ser definidos em `src/components`
- Use o prefixo `ui/` para componentes de interface genéricos (botões, inputs, etc.)
- Componentes específicos do domínio devem ter nomes descritivos

### Tipos

- Todos os tipos devem ser definidos em `src/types/index.ts`
- Siga o padrão PascalCase para interfaces
- Use types somente quando necessário (preferir interfaces)

### APIs

- As rotas da API devem ser definidas em `src/app/api`
- Siga o padrão REST para design de APIs
- Implemente versionamento quando necessário

## Padrões de Codificação

### TypeScript

- Use tipagem estrita (`strict: true` no tsconfig.json)
- Evite `any` quando possível
- Use interfaces em vez de types para objetos
- Valide props com PropTypes ou Zod

### React

- Use hooks ao invés de componentes de classe
- Siga a regra de hooks do React
- Evite efeitos colaterais nos componentes
- Use `React.memo` para otimização de renderização

### Segurança

- Sanitizar entradas de usuário
- Evitar XSS com dangerouslySetInnerHTML
- Validar e sanitizar dados de formulários
- Implementar CSRF tokens quando necessário

## Testes

### Estratégia de Testes

- Testes unitários para funções puras e utilitários
- Testes de integração para APIs e fluxos complexos
- Testes E2E para fluxos críticos do usuário (futuro)

### Escrevendo Testes

- Armazene testes em `__tests__` ou com extensão `.test.ts`
- Use Jest e React Testing Library
- Siga o padrão AAA (Arrange, Act, Assert)
- Teste comportamentos, não implementação

Exemplo de teste:
```typescript
import { render, screen } from '@testing-library/react';
import { MeuComponente } from '@/components/MeuComponente';

describe('MeuComponente', () => {
  test('deve renderizar corretamente', () => {
    render(<MeuComponente />);
    expect(screen.getByText('Conteúdo esperado')).toBeInTheDocument();
  });
});
```

## Processo de Contribuição

### Git Workflow

1. Crie uma branch a partir da `main`:
```bash
git checkout -b feature/nome-da-feature
```

2. Faça commits atômicos com mensagens descritivas:
```bash
git commit -m "feat: adicionar componente de notícia"
```

3. Abra um Pull Request para a branch `main`

### Tipos de Commits

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, ponto e vírgula, etc.
- `refactor`: Refatoração de código
- `test`: Adicionando ou corrigindo testes
- `chore`: Tarefas de build, configuração, etc.

## Deploy

### Pré-deploy Checklist

- [ ] Todos os testes passam
- [ ] Cobertura de testes está acima do limiar
- [ ] Lint não reporta erros
- [ ] Documentação está atualizada
- [ ] Mudanças de banco de dados foram testadas

### Processo de Deploy

O deploy é feito automaticamente via pipeline CI/CD quando o PR é mergeado na branch `main`.

## Troubleshooting

### Problemas Comuns

#### Banco de Dados Não Inicializando
- Verifique as variáveis de ambiente
- Tente excluir o arquivo de banco de dados e reiniciar o servidor

#### Componentes Não Atualizando
- Verifique se as props estão sendo passadas corretamente
- Certifique-se de que os hooks estão usando as dependências corretas

#### Erros de Build
- Execute `npm run lint` para identificar problemas
- Verifique dependências faltantes

## Melhores Práticas

### Performance
- Use `React.memo` para componentes puros
- Implemente lazy loading para páginas
- Use preload para fontes críticas
- Otimizar imagens e usar formatos modernos (WebP, AVIF)

### Acessibilidade
- Use semântica HTML apropriada
- Forneça textos alternativos para imagens
- Garanta contraste adequado de cores
- Use ARIA quando necessário

### SEO
- Use metadados dinâmicos adequados
- Implemente structured data
- Use URLs amigáveis
- Otimizar títulos e descrições