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

// Interface base para operações de banco de dados
export interface DatabaseRepository<T extends { id: number }> {
  findAll(): Promise<T[]>;
  findById(id: number): Promise<T | null>;
  create(item: Omit<T, 'id'>): Promise<T>;
  update(id: number, updates: Partial<T>): Promise<T | null>;
  delete(id: number): Promise<boolean>;
}

// Implementação usando JSON Files (atual)
class JSONDatabase<T extends { id: number }> implements DatabaseRepository<T> {
  private filePath: string;
  private data: T[] = [];

  constructor(filename: string) {
    // Inicialização com arquivo JSON (implementação atual)
    // Para simplificar, vou manter a lógica de leitura/gravação de arquivos
    this.filePath = filename;
    this.data = this.loadData();
  }

  private loadData(): T[] {
    // Implementação simplificada - na aplicação real, seria lido do arquivo
    return [];
  }

  private saveData() {
    // Implementação simplificada - na aplicação real, seria gravado no arquivo
  }

  async findAll(): Promise<T[]> {
    return this.data;
  }

  async findById(id: number): Promise<T | null> {
    const item = this.data.find(item => item.id === id);
    return item || null;
  }

  async create(item: Omit<T, 'id'>): Promise<T> {
    const newId = this.data.length > 0 ? Math.max(...this.data.map(d => d.id)) + 1 : 1;
    const newItem = { 
      ...item, 
      id: newId,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      version: 1
    } as T;
    
    this.data.push(newItem);
    this.saveData();
    return newItem;
  }

  async update(id: number, updates: Partial<T>): Promise<T | null> {
    const index = this.data.findIndex(item => item.id === id);
    if (index === -1) return null;

    const existingItem = this.data[index];
    const updatedItem = { 
      ...existingItem, 
      ...updates, 
      updatedAt: new Date().toISOString(),
      version: (existingItem as any).version ? (existingItem as any).version + 1 : 1
    } as T;
    
    this.data[index] = updatedItem;
    this.saveData();
    return updatedItem;
  }

  async delete(id: number): Promise<boolean> {
    const initialLength = this.data.length;
    this.data = this.data.filter(item => item.id !== id);
    const deleted = initialLength !== this.data.length;
    
    if (deleted) {
      this.saveData();
    }
    
    return deleted;
  }
}

// Configuração para determinar qual implementação usar
const USE_JSON_DATABASE = process.env.USE_JSON_DATABASE === 'true' || false;

// Factory para criar repositórios
export class RepositoryFactory {
  static createNoticiasRepository(): DatabaseRepository<Noticia> {
    return new JSONDatabase<Noticia>('noticias');
  }

  static createEventosRepository(): DatabaseRepository<Evento> {
    return new JSONDatabase<Evento>('eventos');
  }

  static createFiliacoesRepository(): DatabaseRepository<Filiacao> {
    return new JSONDatabase<Filiacao>('filiacoes');
  }

  static createBannersRepository(): DatabaseRepository<Banner> {
    return new JSONDatabase<Banner>('banners');
  }

  static createCategoriasRepository(): DatabaseRepository<Categoria> {
    return new JSONDatabase<Categoria>('categorias');
  }

  static createPagesRepository(): DatabaseRepository<Pagina> {
    return new JSONDatabase<Pagina>('pages');
  }

  static createDocumentsRepository(): DatabaseRepository<Publicacao> {
    return new JSONDatabase<Publicacao>('documents');
  }

  static createVideosRepository(): DatabaseRepository<Video> {
    return new JSONDatabase<Video>('videos');
  }

  static createUsersRepository(): DatabaseRepository<CmsUser> {
    return new JSONDatabase<CmsUser>('users');
  }

  static createMediaRepository(): DatabaseRepository<Media> {
    return new JSONDatabase<Media>('media');
  }
}

// Exportar instâncias dos repositórios
export const noticiasRepository = RepositoryFactory.createNoticiasRepository();
export const eventosRepository = RepositoryFactory.createEventosRepository();
export const filiacoesRepository = RepositoryFactory.createFiliacoesRepository();
export const bannersRepository = RepositoryFactory.createBannersRepository();
export const categoriasRepository = RepositoryFactory.createCategoriasRepository();
export const pagesRepository = RepositoryFactory.createPagesRepository();
export const documentsRepository = RepositoryFactory.createDocumentsRepository();
export const videosRepository = RepositoryFactory.createVideosRepository();
export const usersRepository = RepositoryFactory.createUsersRepository();
export const mediaRepository = RepositoryFactory.createMediaRepository();