# Casos de Teste ASOF

## Módulo de Notícias

### Caso de Teste: Listar Notícias
- **Objetivo**: Verificar se o endpoint retorna a lista de notícias corretamente
- **Pré-condições**: Banco de dados com notícias cadastradas
- **Passos**:
  1. Fazer requisição GET para /api/noticias
  2. Verificar status 200
  3. Verificar estrutura de resposta
- **Resultado esperado**: Lista de notícias com paginação

### Caso de Teste: Filtrar Notícias por Categoria
- **Objetivo**: Verificar se o filtro por categoria funciona corretamente
- **Pré-condições**: Banco de dados com notícias em diferentes categorias
- **Passos**:
  1. Fazer requisição GET para /api/noticias?categoria=Noticias
  2. Verificar status 200
  3. Verificar se apenas notícias da categoria 'Noticias' são retornadas
- **Resultado esperado**: Lista contendo apenas notícias da categoria especificada

### Caso de Teste: Criar Nova Notícia
- **Objetivo**: Verificar se é possível criar uma nova notícia
- **Pré-condições**: Usuário autenticado como administrador
- **Passos**:
  1. Fazer requisição POST para /api/noticias com dados válidos
  2. Verificar status 201
  3. Verificar se notícia foi criada com ID e timestamps corretos
- **Resultado esperado**: Notícia criada com sucesso e retornada com ID

## Módulo de Filiação

### Caso de Teste: Submeter Solicitação de Filiação
- **Objetivo**: Verificar se é possível submeter uma solicitação de filiação
- **Pré-condições**: 
- **Passos**:
  1. Fazer requisição POST para /api/filiacoes com dados válidos
  2. Verificar status 201
  3. Verificar se solicitação foi criada com status 'pendente'
- **Resultado esperado**: Filiação criada com status 'pendente'

### Caso de Teste: Aprovar Filiação
- **Objetivo**: Verificar se é possível aprovar uma filiação pendente
- **Pré-condições**: Filiação com status 'pendente' existe
- **Passos**:
  1. Fazer requisição POST para /api/filiacoes/[id]/approve
  2. Verificar status 200
  3. Verificar se status da filiação foi atualizado para 'aprovada'
- **Resultado esperado**: Filiação aprovada com sucesso

### Caso de Teste: Rejeitar Filiação
- **Objetivo**: Verificar se é possível rejeitar uma filiação pendente
- **Pré-condições**: Filiação com status 'pendente' existe
- **Passos**:
  1. Fazer requisição POST para /api/filiacoes/[id]/reject
  2. Verificar status 200
  3. Verificar se status da filiação foi atualizado para 'rejeitada'
- **Resultado esperado**: Filiação rejeitada com sucesso

## Módulo de Eventos

### Caso de Teste: Criar Novo Evento
- **Objetivo**: Verificar se é possível criar um novo evento
- **Pré-condições**: Usuário autenticado como administrador
- **Passos**:
  1. Fazer requisição POST para /api/eventos com dados válidos
  2. Verificar status 201
  3. Verificar se evento foi criado com timestamps corretos
- **Resultado esperado**: Evento criado com sucesso

### Caso de Teste: Atualizar Evento Existente
- **Objetivo**: Verificar se é possível atualizar os dados de um evento
- **Pré-condições**: Evento existente no banco de dados
- **Passos**:
  1. Fazer requisição PUT para /api/eventos/[id] com dados atualizados
  2. Verificar status 200
  3. Verificar se evento foi atualizado com novos dados e timestamp
- **Resultado esperado**: Evento atualizado com sucesso

## Módulo de Upload de Mídia

### Caso de Teste: Upload de Imagem
- **Objetivo**: Verificar se é possível fazer upload de uma imagem
- **Pré-condições**: Usuário autenticado como administrador
- **Passos**:
  1. Fazer requisição POST para /api/media com arquivo de imagem
  2. Verificar status 201
  3. Verificar se arquivo foi salvo e informações armazenadas
- **Resultado esperado**: Arquivo de mídia salvo com sucesso

### Caso de Teste: Exclusão de Mídia
- **Objetivo**: Verificar se é possível excluir um arquivo de mídia
- **Pré-condições**: Arquivo de mídia existente
- **Passos**:
  1. Fazer requisição DELETE para /api/media/[id]
  2. Verificar status 200
  3. Verificar se arquivo foi removido do sistema de arquivos
- **Resultado esperado**: Arquivo de mídia excluído com sucesso

## Módulo de Estatísticas

### Caso de Teste: Obter Estatísticas do Dashboard
- **Objetivo**: Verificar se o endpoint de estatísticas retorna dados corretamente
- **Pré-condições**: Dados existentes no banco de dados
- **Passos**:
  1. Fazer requisição GET para /api/stats
  2. Verificar status 200
  3. Verificar estrutura e valores das estatísticas
- **Resultado esperado**: Estatísticas retornadas com valores consistentes

## Casos de Teste de Segurança

### Caso de Teste: Rate Limiting
- **Objetivo**: Verificar se o rate limiting está funcionando
- **Pré-condições**: 
- **Passos**:
  1. Fazer mais de 100 requisições para /api/noticias em 15 minutos
  2. Verificar resposta 429 após limite
- **Resultado esperado**: Requisições bloqueadas após limite

### Caso de Teste: Validação de Dados
- **Objetivo**: Verificar se campos obrigatórios são validados
- **Pré-condições**: 
- **Passos**:
  1. Fazer requisição POST para /api/noticias sem campos obrigatórios
  2. Verificar status 400
  3. Verificar mensagem de erro
- **Resultado esperado**: Erro de validação com mensagem clara