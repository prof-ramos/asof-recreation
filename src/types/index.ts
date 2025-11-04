export interface Noticia {
  id: number;
  hexa: string;
  slug: string;
  uuid: string;
  titulo: string;
  categorias: Categoria[];
  conteudo: string;
  imagem: string;
  destaque_video?: string;
  video_corpo: number;
  datetime: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Evento {
  id: number;
  uuid: string;
  titulo: string;
  descricao: string;
  data: string;
  local?: string;
  imagem?: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Banner {
  id: number;
  uuid: string;
  title: string;
  categoria_id: number;
  featured?: any;
  path_image: string;
  url: string;
  window: '_blank' | '_self';
  published_at: string;
  expired_at: string;
  status: number;
  user_id: number;
  type: string;
  clicks: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Categoria {
  id: number;
  uuid: string;
  nome: string;
  slug: string;
  descricao?: string;
  tipos?: string;
  tipo: string;
  cor: string;
  icone?: string;
  imagem?: string;
  email?: string;
  telefone?: string;
  categoria_id?: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Usuario {
  id: number;
  nome: string;
  email: string;
  data_adesao?: string;
  perfil?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Foto {
  id: number;
  album_id: number;
  flickr_photo_id: string;
  title: string;
  url: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Album {
  id: number;
  titulo: string;
  descricao?: string;
  fotos: Foto[];
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Contato {
  id: number;
  nome: string;
  email: string;
  telefone?: string;
  mensagem: string;
  created_at: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Faq {
  id: number;
  pergunta: string;
  resposta: string;
  ordem?: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Pagina {
  id: number;
  slug: string;
  titulo: string;
  conteudo: string;
  imagem?: string;
  status: 'ativo' | 'inativo';
  user_id: number;
  acessos: number;
  data_criacao: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Publicacao {
  id: number;
  titulo: string;
  descricao: string;
  categoria: string;
  tipo: string;
  tamanho: string;
  dataPublicacao: string;
  downloads: number;
  destaque: boolean;
  status: 'ativo' | 'inativo';
  user_id: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Video {
  id: number;
  titulo: string;
  descricao: string;
  url: string;
  thumbnail: string;
  categoria: string;
  status: 'ativo' | 'inativo';
  visualizacoes: number;
  user_id: number;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Filiacao {
  id: number;
  nome: string;
  email: string;
  telefone: string;
  data_solicitacao: string;
  status: 'pendente' | 'aprovada' | 'rejeitada';
  documentos: string[];
  observacoes?: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface DashboardStats {
  total_noticias: number;
  total_eventos: number;
  total_banners: number;
  total_filiacoes_pendentes: number;
  acessos_hoje: number;
  acessos_mes: number;
}

export interface CmsUser {
  id: number;
  nome: string;
  email: string;
  perfil: 'admin' | 'editor' | 'viewer';
  data_adesao: string;
  status: 'ativo' | 'inativo';
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface NewsletterData {
  assunto: string;
  conteudo: string;
  destinatarios: string[];
  data_envio: string;
  createdAt: string;
  updatedAt: string;
  version: number;
}

export interface Media {
  id: number;
  originalName: string;
  filename: string;
  path: string;
  size: number;
  type: string;
  folder: string;
  uploadedAt: string;
}
