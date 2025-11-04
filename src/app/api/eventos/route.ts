import { NextRequest, NextResponse } from 'next/server';
import { eventosDb } from '@/lib/database';
import { Evento } from '@/types';

// Interface para a resposta da API de eventos
interface EventosResponse {
  data: Evento[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
    hasNext: boolean;
    hasPrev: boolean;
  };
}

// GET /api/eventos - Listar eventos com paginação e filtros
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    
    // Validar parâmetros
    if (page < 1 || limit < 1 || limit > 100) {
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    let eventos = eventosDb.findAll();

    // Filtrar por busca (título ou descrição)
    if (search) {
      eventos = eventos.filter(evento => 
        evento.titulo.toLowerCase().includes(search.toLowerCase()) ||
        evento.descricao.toLowerCase().includes(search.toLowerCase())
      );
    }

    // Calcular paginação
    const total = eventos.length;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedEventos = eventos.slice(startIndex, endIndex);
    const totalPages = Math.ceil(total / limit);

    return NextResponse.json({
      data: paginatedEventos,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
  } catch (error) {
    console.error('Erro ao buscar eventos:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// POST /api/eventos - Criar novo evento
export async function POST(request: NextRequest) {
  try {
    // Verificar se a requisição é multipart/form-data (upload de arquivos)
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extrair dados do formulário
      const titulo = formData.get('titulo') as string;
      const descricao = formData.get('descricao') as string;
      const data = formData.get('data') as string;
      const local = formData.get('local') as string;
      const status = formData.get('status') as string;
      
      // Validação básica
      if (!titulo || !descricao || !data) {
        return NextResponse.json(
          { error: 'Campos obrigatórios ausentes: titulo, descricao, data' },
          { status: 400 }
        );
      }

      // Tratar upload de imagem (se fornecida)
      let imagemPath = '';
      const imagem = formData.get('imagem') as File | null;
      if (imagem) {
        // Simulação de salvamento da imagem (em produção, usaríamos a API de mídia)
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const fileExtension = imagem.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${timestamp}-${randomString}.${fileExtension}`;
        imagemPath = `/uploads/eventos/${filename}`;
      }

      const novoEvento = eventosDb.create({
        titulo,
        descricao,
        data,
        local: local || undefined,
        status: (status as 'ativo' | 'inativo') || 'ativo',
        imagem: imagemPath || undefined,
      });

      return NextResponse.json(novoEvento, { status: 201 });
    } else {
      // Requisição JSON tradicional
      const body = await request.json();

      // Validação básica
      const { titulo, descricao, data, local, status, imagem } = body;
      if (!titulo || !descricao || !data) {
        return NextResponse.json(
          { error: 'Campos obrigatórios ausentes: titulo, descricao, data' },
          { status: 400 }
        );
      }

      const novoEvento = eventosDb.create({
        titulo,
        descricao,
        data,
        local,
        status: status || 'ativo',
        imagem,
      });

      return NextResponse.json(novoEvento, { status: 201 });
    }
  } catch (error) {
    console.error('Erro ao criar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}