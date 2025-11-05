import { NextRequest, NextResponse } from 'next/server';
import { noticiasDb } from '@/lib/database';
import { Noticia } from '@/types';

// GET /api/noticias/slug/[slug] - Buscar notícia por slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug não fornecido' },
        { status: 400 }
      );
    }

    // Buscar notícia por slug
    const noticias = noticiasDb.findAll();
    const noticia = noticias.find(n => n.slug === slug);

    if (!noticia) {
      return NextResponse.json(
        { error: 'Notícia não encontrada' },
        { status: 404 }
      );
    }

    return NextResponse.json(noticia);
  } catch (error) {
    console.error('Erro ao buscar notícia por slug:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}