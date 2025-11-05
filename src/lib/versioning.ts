import fs from 'fs';
import path from 'path';
import { Noticia, Evento, Banner, Filiacao, Categoria, Usuario, Foto, Album, Contato, Faq, Pagina, Publicacao, Video, CmsUser, NewsletterData, Media } from '@/types';

// Diretório para armazenar dados
const DATA_DIR = path.join(process.cwd(), 'data');

// Garante que o diretório existe
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Interface para um registro de versão
export interface VersionRecord<T> {
  id: number; // ID da entidade original
  version: number;
  entity: T;
  timestamp: string;
  action: 'create' | 'update' | 'delete';
  userId?: number; // ID do usuário que fez a alteração
}

// Classe para gerenciar versões de entidades
class VersionManager<T extends { id: number; version: number }> {
  private filePath: string;

  constructor(entityName: string) {
    this.filePath = path.join(DATA_DIR, `versions_${entityName}.json`);
    this.ensureFile();
  }

  private ensureFile() {
    if (!fs.existsSync(this.filePath)) {
      fs.writeFileSync(this.filePath, JSON.stringify([], null, 2));
    }
  }

  private readData(): VersionRecord<T>[] {
    try {
      const data = fs.readFileSync(this.filePath, 'utf-8');
      return JSON.parse(data);
    } catch {
      return [];
    }
  }

  private writeData(data: VersionRecord<T>[]) {
    fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
  }

  // Salvar uma nova versão
  saveVersion(entity: T, action: 'create' | 'update' | 'delete', userId?: number) {
    const data = this.readData();
    
    const versionRecord: VersionRecord<T> = {
      id: entity.id,
      version: entity.version,
      entity: { ...entity },
      timestamp: new Date().toISOString(),
      action,
      userId
    };
    
    data.push(versionRecord);
    this.writeData(data);
  }

  // Obter histórico de versões para uma entidade
  getVersions(entityId: number): VersionRecord<T>[] {
    const data = this.readData();
    return data.filter(record => record.id === entityId)
               .sort((a, b) => b.version - a.version); // Ordem decrescente de versão
  }

  // Obter uma versão específica de uma entidade
  getVersion(entityId: number, version: number): VersionRecord<T> | undefined {
    const data = this.readData();
    return data.find(record => record.id === entityId && record.version === version);
  }

  // Reverter para uma versão específica
  revertToVersion(entityId: number, version: number): T | null {
    const versionRecord = this.getVersion(entityId, version);
    if (!versionRecord) {
      return null;
    }
    
    // Retorna a entidade da versão específica
    return versionRecord.entity;
  }

  // Obter todas as versões de todas as entidades
  getAllVersions(): VersionRecord<T>[] {
    const data = this.readData();
    return data.sort((a, b) => {
      // Ordenar por ID e depois por versão
      if (a.id !== b.id) return a.id - b.id;
      return b.version - a.version;
    });
  }
}

// Instâncias do gerenciador de versões para cada entidade
export const noticiasVersionManager = new VersionManager<Noticia>('noticias');
export const eventosVersionManager = new VersionManager<Evento>('eventos');
export const bannersVersionManager = new VersionManager<Banner>('banners');
export const filiacoesVersionManager = new VersionManager<Filiacao>('filiacoes');
export const categoriasVersionManager = new VersionManager<Categoria>('categorias');
export const usuariosVersionManager = new VersionManager<Usuario>('usuarios');
export const fotosVersionManager = new VersionManager<Foto>('fotos');
export const albumsVersionManager = new VersionManager<Album>('albums');
export const contatosVersionManager = new VersionManager<Contato>('contatos');
export const faqsVersionManager = new VersionManager<Faq>('faqs');
export const paginasVersionManager = new VersionManager<Pagina>('paginas');
export const publicacoesVersionManager = new VersionManager<Publicacao>('publicacoes');
export const videosVersionManager = new VersionManager<Video>('videos');
export const cmsUsersVersionManager = new VersionManager<CmsUser>('cms_users');
// Temporarily commented out due to missing 'id' field requirement
// export const newslettersVersionManager = new VersionManager<NewsletterData>('newsletters');
// export const mediaVersionManager = new VersionManager<Media>('media');