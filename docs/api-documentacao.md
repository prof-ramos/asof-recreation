# Documentação da API ASOF

## Visão Geral

A API do sistema ASOF fornece endpoints RESTful para gerenciar todos os aspectos do website institucional. A API é organizada em recursos lógicos e fornece operações CRUD completas para entidades principais.

## Convenções

### Autenticação
A maior parte dos endpoints não requer autenticação, exceto os endpoints do CMS que requerem autenticação via sessão.

### Formato de Dados
- **Content-Type**: `application/json` para requisições
- **Accept**: `application/json` para respostas
- **Codificação**: UTF-8

### Respostas de Erro
Todas as respostas de erro seguem o padrão:
```json
{
  "error": "Mensagem de erro descritiva"
}
```

### Paginação
Muitos endpoints retornam dados paginados usando este formato:
```json
{
  "data": [...],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 100,
    "totalPages": 10,
    "hasNext": true,
    "hasPrev": false
  }
}
```

## Endpoints

### Notícias

#### GET /api/noticias
Lista notícias com paginação e filtros.

**Parâmetros de Query:**
- `page` (opcional, padrão: 1)
- `limit` (opcional, padrão: 10, máximo: 100)
- `search` (opcional, busca em título e conteúdo)
- `categoria` (opcional, filtra por categoria)

**Exemplo de Resposta:**
```json
{
  "data": [
    {
      "id": 1,
      "hexa": "n/000001",
      "slug": "noticia-exemplo",
      "uuid": "uuid-exemplo",
      "titulo": "Título da notícia",
      "categorias": [...],
      "conteudo": "Conteúdo da notícia",
      "imagem": "/path/para/imagem.jpg",
      "destaque_video": "https://youtube.com/embed/video",
      "video_corpo": 0,
      "datetime": "2025-01-01",
      "createdAt": "2025-01-01T00:00:00.000Z",
      "updatedAt": "2025-01-01T00:00:00.000Z",
      "version": 1
    }
  ],
  "pagination": { ... }
}
```

#### GET /api/noticias/[id]
Obtém uma notícia específica pelo ID.

**Exemplo de Resposta:**
```json
{
  "id": 1,
  "hexa": "n/000001",
  "slug": "noticia-exemplo",
  // ... outros campos
}
```

#### GET /api/noticias/slug/[slug]
Obtém uma notícia específica pelo slug.

#### POST /api/noticias
Cria uma nova notícia. Requer autenticação de administrador.

**Body:**
```json
{
  "titulo": "Título da notícia",
  "conteudo": "Conteúdo da notícia",
  "categorias": [...],
  "imagem": "/path/para/imagem.jpg",
  "datetime": "2025-01-01"
}
```

**Exemplo de Resposta:**
```json
{
  "id": 1,
  // ... todos os campos da notícia
}
```

### Eventos

#### GET /api/eventos
Lista eventos com paginação e filtros.

**Parâmetros de Query:**
- `page` (opcional, padrão: 1)
- `limit` (opcional, padrão: 10, máximo: 100)
- `search` (opcional, busca em título e descrição)

#### POST /api/eventos
Cria um novo evento. Requer autenticação de administrador.

**Body:**
```json
{
  "titulo": "Título do evento",
  "descricao": "Descrição do evento",
  "data": "2025-02-15",
  "local": "Local do evento (opcional)",
  "status": "ativo"
}
```

#### GET /api/eventos/[id]
Obtém um evento específico pelo ID.

#### PUT /api/eventos/[id]
Atualiza um evento existente. Requer autenticação de administrador.

#### DELETE /api/eventos/[id]
Exclui um evento. Requer autenticação de administrador.

### Filiações

#### POST /api/filiacoes
Cria uma nova solicitação de filiação.

**Body:**
```json
{
  "nome": "Nome do solicitante",
  "email": "email@exemplo.com",
  "telefone": "(11) 99999-9999",
  "documentos": ["/path/para/documento.pdf"],
  "observacoes": "Observações (opcional)"
}
```

#### GET /api/filiacoes
Lista filiações (requer autenticação de administrador).

**Parâmetros de Query:**
- `status` (opcional, filtra por status: pendente, aprovada, rejeitada)

#### GET /api/filiacoes/[id]
Obtém uma filiação específica pelo ID (requer autenticação de administrador).

#### POST /api/filiacoes/[id]/approve
Aprova uma filiação pendente (requer autenticação de administrador).

**Body:**
```json
{
  "observacoes": "Observações (opcional)"
}
```

#### POST /api/filiacoes/[id]/reject
Rejeita uma filiação pendente (requer autenticação de administrador).

### Banners

#### GET /api/banners
Lista banners ativos.

#### POST /api/banners
Cria um novo banner (requer autenticação de administrador).

### Estatísticas

#### GET /api/stats
Obtém estatísticas gerais do sistema para o dashboard.

**Exemplo de Resposta:**
```json
{
  "total_noticias": 45,
  "total_eventos": 12,
  "total_banners": 8,
  "total_filiacoes_pendentes": 3,
  "acessos_hoje": 1250,
  "acessos_mes": 45230,
  "detalhes": {
    "banners": { ... },
    "filiacoes": { ... },
    "acessos": { ... }
  }
}
```

### Mídia

#### GET /api/media
Lista arquivos de mídia com paginação.

#### POST /api/media
Faz upload de um novo arquivo de mídia.

**Body (multipart/form-data):**
- `file`: arquivo a ser enviado
- `folder`: pasta de destino (opcional, padrão: "general")

#### DELETE /api/media/[id]
Exclui um arquivo de mídia e o arquivo do sistema de arquivos (requer autenticação de administrador).

## Versionamento

O sistema mantém histórico de versões para todas as entidades modificáveis. Cada entidade inclui:
- `version`: Número da versão
- `createdAt`: Timestamp da criação
- `updatedAt`: Timestamp da última atualização

## Segurança

### Rate Limiting
- 100 requisições por 15 minutos por IP para endpoints públicos
- Implementado para prevenir abuso

### Validação
- Todos os endpoints validam entradas
- Sanitização de conteúdo para prevenir XSS

## Limitações

### Tamanhos de Arquivo
- Upload de mídia: máximo 10MB por arquivo
- Tipos permitidos: imagens (JPEG, PNG, GIF) e PDF

### Parâmetros de Query
- Limite máximo de paginação: 100 itens por página

## Erros Comuns

| Código | Descrição |
|--------|-----------|
| 400 | Requisição inválida (parâmetros ausentes ou inválidos) |
| 404 | Recurso não encontrado |
| 403 | Acesso proibido (sem autenticação ou permissões insuficientes) |
| 429 | Limite de requisições excedido |
| 500 | Erro interno do servidor |

## Exemplos de Código

### JavaScript
```javascript
// Listar notícias
const response = await fetch('/api/noticias?page=1&limit=10');
const noticias = await response.json();

// Criar nova filiação
const formData = new FormData();
formData.append('nome', 'João Silva');
formData.append('email', 'joao@email.com');
formData.append('telefone', '(11) 99999-9999');

const response = await fetch('/api/filiacoes', {
  method: 'POST',
  body: formData
});
```

## SDKs e Bibliotecas

O sistema não fornece SDKs oficiais, mas a API é compatível com qualquer linguagem de programação que suporte HTTP.