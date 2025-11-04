import { NextRequest, NextResponse } from 'next/server';
import { noticiasDb } from '@/lib/database';
import { Noticia } from '@/types';
import { apiRateLimiter, getClientIdentifier } from '@/lib/rate-limit';
import { logger, logApiRequest } from '@/lib/logger';

// GET /api/noticias - Listar notícias com paginação e filtros
export async function GET(request: NextRequest) {
  const startTime = Date.now();
  
  // Aplicar rate limiting
  const identifier = getClientIdentifier(request);
  const rateLimitCheck = apiRateLimiter.checkLimit(identifier);
  
  if (!rateLimitCheck.allowed) {
    logger.warn('Rate limit exceeded', { 
      identifier, 
      endpoint: '/api/noticias',
      method: 'GET' 
    });
    
    const response = NextResponse.json(
      { error: rateLimitCheck.message || 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.floor((rateLimitCheck.resetTime! - Date.now()) / 1000).toString(),
        }
      }
    );
    
    logApiRequest(request, startTime, 'error', 429);
    return response;
  }

  try {
    const { searchParams } = new URL(request.url);
    
    // Parâmetros de paginação
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const categoria = searchParams.get('categoria') || '';
    
    logger.info('Fetching noticias', { 
      page, 
      limit, 
      search: search ? true : false, 
      categoria: categoria || 'all' 
    });

    // Validar parâmetros
    if (page < 1 || limit < 1 || limit < 1 || limit > 100) {
      logger.warn('Invalid parameters', { page, limit });
      return NextResponse.json(
        { error: 'Parâmetros inválidos' },
        { status: 400 }
      );
    }

    const { data: noticias, total } = noticiasDb.findAndCountAll({
      page,
      limit,
      search,
      category: categoria,
    });

    // Calcular paginação
    const totalPages = Math.ceil(total / limit);

    const response = NextResponse.json({
      data: noticias,
      pagination: {
        page,
        limit,
        total,
        totalPages,
        hasNext: page < totalPages,
        hasPrev: page > 1,
      }
    });
    
    logApiRequest(request, startTime, 'success', 200);
    return response;
  } catch (error) {
    logger.error('Erro ao buscar notícias:', { error: (error as Error).message, stack: (error as Error).stack });
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
    
    logApiRequest(request, startTime, 'error', 500);
    return response;
  }
}

// POST /api/noticias - Criar nova notícia (para uso no CMS)
export async function POST(request: NextRequest) {
  const startTime = Date.now();
  
  // Aplicar rate limiting (usando um limitador mais restrito para operações de escrita)
  const identifier = getClientIdentifier(request);
  const rateLimitCheck = apiRateLimiter.checkLimit(identifier);
  
  if (!rateLimitCheck.allowed) {
    logger.warn('Rate limit exceeded', { 
      identifier, 
      endpoint: '/api/noticias',
      method: 'POST' 
    });
    
    const response = NextResponse.json(
      { error: rateLimitCheck.message || 'Too many requests' },
      { 
        status: 429,
        headers: {
          'Retry-After': Math.floor((rateLimitCheck.resetTime! - Date.now()) / 1000).toString(),
        }
      }
    );
    
    logApiRequest(request, startTime, 'error', 429);
    return response;
  }

  try {
    logger.info('Creating new noticia', { endpoint: '/api/noticias', method: 'POST' });
    
    const body = await request.json();

    // Validação básica
    const { titulo, conteudo, categorias, imagem, datetime } = body;
    if (!titulo || !conteudo || !categorias || !imagem || !datetime) {
      logger.warn('Missing required fields when creating noticia', { 
        missingFields: {
          titulo: !titulo,
          conteudo: !conteudo,
          categorias: !categorias,
          imagem: !imagem,
          datetime: !datetime
        }
      });
      
      return NextResponse.json(
        { error: 'Campos obrigatórios ausentes: titulo, conteudo, categorias, imagem, datetime' },
        { status: 400 }
      );
    }

    const novaNoticia = noticiasDb.create({
      ...body,
      datetime: body.datetime || new Date().toISOString().split('T')[0],
    });

    logger.info('Noticia created successfully', { 
      id: novaNoticia.id, 
      titulo: novaNoticia.titulo 
    });

    const response = NextResponse.json(novaNoticia, { status: 201 });
    logApiRequest(request, startTime, 'success', 201);
    return response;
  } catch (error) {
    logger.error('Erro ao criar notícia:', { 
      error: (error as Error).message, 
      stack: (error as Error).stack 
    });
    
    const response = NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
    
    logApiRequest(request, startTime, 'error', 500);
    return response;
  }
}