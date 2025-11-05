import { Noticia, Evento, Banner, Foto, Pagina, Publicacao, Video, Filiacao, DashboardStats, CmsUser, NewsletterData, Categoria } from '@/types';

const mockEventos: Evento[] = [
  {
    id: 1,
    uuid: 'event-uuid-1',
    titulo: 'Seminário Técnico - Previdência Sustentável',
    descricao: 'Evento sobre previdência sustentável para RPPS municipais',
    data: '22/08/2023',
    local: 'Brasília',
    status: 'ativo',
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z',
    version: 1
  }
];

const mockBanners: Banner[] = [
  {
    id: 1,
    uuid: '5ee76f83-bd33-4377-a4e7-57dafb40761c',
    title: 'Banner Inicial',
    categoria_id: 10,
    path_image: '07af06d3-9873-415a-b64c-14ef2e86f375.jpg',
    url: 'https://www.youtube.com/',
    window: '_blank',
    published_at: '2024-06-29T12:47:00.000000Z',
    expired_at: '2034-12-15T12:47:00.000000Z',
    status: 1,
    user_id: 1,
    type: 'Super Banners',
    clicks: 0,
    createdAt: '2024-06-29T12:47:00.000Z',
    updatedAt: '2024-06-29T12:47:00.000Z',
    version: 1
  }
];

const mockFotos: Foto[] = [
  {
    id: 3744,
    album_id: 74,
    flickr_photo_id: '53134215517',
    title: '22/08/2023 - Seminário Técnico',
    url: 'https://farm66.staticflickr.com/65535/53134215517_8231b05ea6.jpg',
    createdAt: '2023-08-22T00:00:00.000Z',
    updatedAt: '2023-08-22T00:00:00.000Z',
    version: 1
  }
];

// Interface para a resposta da API de notícias
interface NoticiasResponse {
  data: Noticia[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

export async function fetchNoticias(page: number = 1, limit: number = 10, search: string = '', categoria: string = ''): Promise<NoticiasResponse> {
  // Montar a query string com os parâmetros
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  
  if (search) {
    params.set('search', search);
  }
  
  if (categoria) {
    params.set('categoria', categoria);
  }

  try {
    const response = await fetch(`/api/noticias?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const result: NoticiasResponse = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao buscar notícias:', error);
    // Retorna uma resposta vazia em caso de erro
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  }
}

export async function fetchNoticiaBySlug(slug: string): Promise<Noticia | null> {
  // Para buscar uma notícia específica, precisamos buscar todas e filtrar
  // ou implementar um endpoint específico para isso
  try {
    // Primeiro, vamos buscar a notícia específica por slug via API
    // Por enquanto, como não temos um endpoint específico para busca por slug,
    // faremos uma busca geral e filtramos, mas idealmente deveria haver
    // um endpoint /api/noticias/slug/{slug}
    
    // Para otimização, vamos implementar busca direta via um novo endpoint
    // Por enquanto, vamos buscar todas as notícias (isso será otimizado posteriormente)
    const response = await fetch('/api/noticias?page=1&limit=100'); // Buscar todas as notícias
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const result: NoticiasResponse = await response.json();
    const noticia = result.data.find(n => n.slug === slug);
    
    return noticia || null;
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return null;
  }
}

// Nova função para buscar notícia por slug via endpoint específico
export async function fetchNoticiaBySlugDirect(slug: string): Promise<Noticia | null> {
  try {
    const response = await fetch(`/api/noticias/slug/${slug}`);
    
    if (!response.ok) {
      if (response.status === 404) {
        return null;
      }
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const noticia: Noticia = await response.json();
    return noticia;
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return null;
  }
}

export async function fetchEventos(): Promise<Evento[]> {
  try {
    const response = await fetch('/api/eventos');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return [];
  }
}

// Função para buscar eventos com paginação
export async function fetchEventosPaginados(page: number = 1, limit: number = 10, search: string = ''): Promise<any> {
  const params = new URLSearchParams();
  params.set('page', page.toString());
  params.set('limit', limit.toString());
  
  if (search) {
    params.set('search', search);
  }

  try {
    const response = await fetch(`/api/eventos?${params.toString()}`);
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Erro ao buscar eventos paginados:', error);
    return {
      data: [],
      pagination: {
        page: 1,
        limit: 10,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      }
    };
  }
}

// Função para criar evento
export async function createEvento(evento: Partial<Omit<Evento, 'id' | 'uuid' | 'createdAt' | 'updatedAt' | 'version'>>, imagemFile?: File): Promise<Evento | null> {
  try {
    let response;
    
    if (imagemFile) {
      // Enviar como multipart/form-data se houver imagem
      const formData = new FormData();
      if (evento.titulo) formData.append('titulo', evento.titulo);
      if (evento.descricao) formData.append('descricao', evento.descricao);
      if (evento.data) formData.append('data', evento.data);
      if (evento.local) formData.append('local', evento.local);
      if (evento.status) formData.append('status', evento.status);
      formData.append('imagem', imagemFile);
      
      response = await fetch('/api/eventos', {
        method: 'POST',
        body: formData,
      });
    } else {
      // Enviar como JSON se não houver imagem
      response = await fetch('/api/eventos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      });
    }
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return null;
  }
}

// Função para atualizar evento
export async function updateEvento(id: number, evento: Partial<Evento>, imagemFile?: File): Promise<Evento | null> {
  try {
    let response;
    
    if (imagemFile) {
      // Enviar como multipart/form-data se houver imagem
      const formData = new FormData();
      if (evento.titulo !== undefined) formData.append('titulo', evento.titulo);
      if (evento.descricao !== undefined) formData.append('descricao', evento.descricao);
      if (evento.data !== undefined) formData.append('data', evento.data);
      if (evento.local !== undefined) formData.append('local', evento.local);
      if (evento.status !== undefined) formData.append('status', evento.status);
      if (imagemFile) formData.append('imagem', imagemFile);
      
      response = await fetch(`/api/eventos/${id}`, {
        method: 'PUT',
        body: formData,
      });
    } else {
      // Enviar como JSON se não houver imagem
      response = await fetch(`/api/eventos/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(evento),
      });
    }
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return null;
  }
}

// Função para deletar evento
export async function deleteEvento(id: number): Promise<boolean> {
  try {
    const response = await fetch(`/api/eventos/${id}`, {
      method: 'DELETE',
    });
    
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    
    return true;
  } catch (error) {
    console.error('Erro ao deletar evento:', error);
    return false;
  }
}

export async function fetchCategorias(): Promise<Categoria[]> {
  try {
    const response = await fetch('/api/categorias');
    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erro ao buscar categorias:', error);
    return [];
  }
}

export async function fetchBanners(): Promise<Banner[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockBanners;
}

export async function fetchFotos(): Promise<Foto[]> {
  await new Promise(resolve => setTimeout(resolve, 500));
  return mockFotos;
}

export function formatDate(dateString: string): string {
  // Formatar datas em português
  const date = new Date(dateString);
  return date.toLocaleDateString('pt-BR', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

export function truncateText(text: string, length: number): string {
  if (text.length <= length) return text;
  return text.substring(0, length) + '...';
}
