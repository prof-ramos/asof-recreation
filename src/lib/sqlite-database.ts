import Database from 'better-sqlite3';
import { 
  Noticia, 
  Evento, 
  Banner, 
  Filiacao, 
  Categoria, 
  Usuario, 
  Foto, 
  Album, 
  Contato, 
  Faq, 
  Pagina, 
  Publicacao, 
  Video, 
  CmsUser, 
  NewsletterData, 
  Media 
} from '@/types';

// Caminho para o banco de dados SQLite
const DB_PATH = process.env.DATABASE_URL || './asof_database.db';

// Conectar ao banco de dados
const db = new Database(DB_PATH);

// Habilitar modo WAL para melhor concorrência
db.pragma('journal_mode = WAL');

// Classe base para operações CRUD com SQLite
class SQLiteDatabase<T extends { id: number }> {
  protected tableName: string;
  protected db: Database.Database;

  constructor(tableName: string) {
    this.tableName = tableName;
    this.db = db;
    this.createTableIfNotExists();
  }

  protected createTableIfNotExists() {
    // Esta função deve ser sobrescrita por classes específicas para criar a estrutura da tabela
    // com as colunas apropriadas para cada entidade
    throw new Error('createTableIfNotExists must be implemented by subclasses');
  }

  findAll(): T[] {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} ORDER BY id ASC`);
    return stmt.all() as T[];
  }

  findAndCountAll(options: { page?: number; limit?: number; search?: string; category?: string; } = {}): { data: T[]; total: number } {
    const { page = 1, limit = 10, search, category } = options;
    let query = `SELECT * FROM ${this.tableName}`;
    let countQuery = `SELECT COUNT(*) FROM ${this.tableName}`;
    const params: (string | number)[] = [];
    const whereClauses: string[] = [];

    if (search) {
      whereClauses.push(`(titulo LIKE ? OR conteudo LIKE ?)`);
      params.push(`%${search}%`, `%${search}%`);
    }

    if (category) {
      // This assumes 'categorias' is a JSON string and we're searching within it.
      // For 'noticias', this will be handled in NoticiasDatabase subclass.
      // For other tables, this might need adjustment or removal.
      whereClauses.push(`categorias LIKE ?`);
      params.push(`%${category}%`);
    }

    if (whereClauses.length > 0) {
      query += ` WHERE ${whereClauses.join(' AND ')}`;
      countQuery += ` WHERE ${whereClauses.join(' AND ')}`;
    }

    query += ` ORDER BY id ASC LIMIT ? OFFSET ?`;
    params.push(limit, (page - 1) * limit);

    const stmt = this.db.prepare(query);
    const data = stmt.all(...params) as T[];

    const countStmt = this.db.prepare(countQuery);
    const total = (countStmt.get(...params.slice(0, params.length - 2)) as { 'COUNT(*)': number })['COUNT(*)'];

    return { data, total };
  }

  findById(id: number): T | undefined {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE id = ?`);
    return stmt.get(id) as T | undefined;
  }

  create(item: Omit<T, 'id'>): T {
    // Obter colunas (excluindo 'id' que é autoincrementado)
    const keys = Object.keys(item);
    const placeholders = keys.map(() => '?').join(', ');
    const values = keys.map(key => (item as any)[key]);
    
    const stmt = this.db.prepare(
      `INSERT INTO ${this.tableName} (${keys.join(', ')}) VALUES (${placeholders})`
    );
    
    const result = stmt.run(...values);
    
    // Retorna o item com o ID gerado
    return {
      ...(item as any),
      id: result.lastInsertRowid as number
    } as T;
  }

  update(id: number, updates: Partial<T>): T | null {
    const keys = Object.keys(updates);
    if (keys.length === 0) {
      return this.findById(id) || null;
    }
    
    const setClause = keys.map(key => `${key} = ?`).join(', ');
    const values = keys.map(key => (updates as any)[key]);
    values.push(id); // Para WHERE id = ?
    
    const stmt = this.db.prepare(
      `UPDATE ${this.tableName} SET ${setClause} WHERE id = ?`
    );
    
    const result = stmt.run(...values);
    
    if (result.changes === 0) {
      return null; // Nenhuma linha foi atualizada, então o ID não existe
    }
    
    return this.findById(id) || null;
  }

  delete(id: number): boolean {
    const stmt = this.db.prepare(`DELETE FROM ${this.tableName} WHERE id = ?`);
    const result = stmt.run(id);
    
    return result.changes > 0;
  }
}

// Implementações específicas para cada entidade

class NoticiasDatabase extends SQLiteDatabase<Noticia> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS noticias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_noticias_slug ON noticias(slug);
      CREATE INDEX IF NOT EXISTS idx_noticias_uuid ON noticias(uuid);
    `);
  }

  findBySlug(slug: string): Noticia | undefined {
    const stmt = this.db.prepare(`SELECT * FROM ${this.tableName} WHERE slug = ?`);
    return stmt.get(slug) as Noticia | undefined;
  }
}

class EventosDatabase extends SQLiteDatabase<Evento> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS eventos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        data TEXT NOT NULL,
        local TEXT,
        imagem TEXT,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_eventos_uuid ON eventos(uuid);
    `);
  }
}

class FiliacoesDatabase extends SQLiteDatabase<Filiacao> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS filiacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT NOT NULL,
        telefone TEXT NOT NULL,
        data_solicitacao TEXT NOT NULL,
        status TEXT NOT NULL,
        documentos TEXT NOT NULL, -- Armazenado como JSON
        observacoes TEXT,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      )
    `);
  }
}

class BannersDatabase extends SQLiteDatabase<Banner> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS banners (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL,
        title TEXT NOT NULL,
        categoria_id INTEGER,
        featured TEXT,
        path_image TEXT NOT NULL,
        url TEXT NOT NULL,
        window TEXT NOT NULL,
        published_at TEXT,
        expired_at TEXT,
        status INTEGER DEFAULT 0,
        user_id INTEGER,
        type TEXT,
        clicks INTEGER DEFAULT 0,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_banners_uuid ON banners(uuid);
    `);
  }
}

class CategoriasDatabase extends SQLiteDatabase<Categoria> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS categorias (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        uuid TEXT NOT NULL,
        nome TEXT NOT NULL,
        slug TEXT UNIQUE NOT NULL,
        descricao TEXT,
        tipos TEXT,
        tipo TEXT NOT NULL,
        cor TEXT NOT NULL,
        icone TEXT,
        imagem TEXT,
        email TEXT,
        telefone TEXT,
        categoria_id INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_categorias_uuid ON categorias(uuid);
    `);
  }
}

class PaginasDatabase extends SQLiteDatabase<Pagina> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS paginas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        slug TEXT UNIQUE NOT NULL,
        titulo TEXT NOT NULL,
        conteudo TEXT NOT NULL,
        imagem TEXT,
        status TEXT NOT NULL,
        user_id INTEGER,
        acessos INTEGER DEFAULT 0,
        data_criacao TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      )
    `);
  }
}

class PublicacoesDatabase extends SQLiteDatabase<Publicacao> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS publicacoes (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        categoria TEXT NOT NULL,
        tipo TEXT NOT NULL,
        tamanho TEXT NOT NULL,
        dataPublicacao TEXT NOT NULL,
        downloads INTEGER DEFAULT 0,
        destaque BOOLEAN DEFAULT 0,
        status TEXT NOT NULL,
        user_id INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      )
    `);
  }
}

class VideosDatabase extends SQLiteDatabase<Video> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS videos (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        titulo TEXT NOT NULL,
        descricao TEXT NOT NULL,
        url TEXT NOT NULL,
        thumbnail TEXT NOT NULL,
        categoria TEXT NOT NULL,
        status TEXT NOT NULL,
        visualizacoes INTEGER DEFAULT 0,
        user_id INTEGER,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      )
    `);
  }
}

class UsuariosDatabase extends SQLiteDatabase<CmsUser> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS usuarios (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL,
        email TEXT UNIQUE NOT NULL,
        perfil TEXT NOT NULL,
        data_adesao TEXT NOT NULL,
        status TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_usuarios_email ON usuarios(email);
    `);
  }
}

class MediaDatabase extends SQLiteDatabase<Media> {
  protected createTableIfNotExists() {
    this.db.exec(`
      CREATE TABLE IF NOT EXISTS media (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        originalName TEXT NOT NULL,
        filename TEXT NOT NULL,
        path TEXT NOT NULL,
        size INTEGER NOT NULL,
        type TEXT NOT NULL,
        folder TEXT NOT NULL,
        uploadedAt TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        updatedAt TEXT NOT NULL,
        version INTEGER DEFAULT 1
      );
      CREATE INDEX IF NOT EXISTS idx_media_uuid ON media(uuid);
    `);
  }
}

// Exportar instâncias das classes de banco de dados
export const noticiasDb = new NoticiasDatabase();
export const eventosDb = new EventosDatabase();
export const filiacoesDb = new FiliacoesDatabase();
export const bannersDb = new BannersDatabase();
export const categoriasDb = new CategoriasDatabase();
export const pagesDb = new PaginasDatabase();
export const documentsDb = new PublicacoesDatabase();
export const videosDb = new VideosDatabase();
export const usersDb = new UsuariosDatabase();
export const mediaDb = new MediaDatabase();