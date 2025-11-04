import { NextRequest, NextResponse } from 'next/server';
import { eventosDb } from '@/lib/database';

// GET /api/eventos/slug/[slug] - Buscar evento por slug
export async function GET(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params;
    
    if (!slug) {
      return NextResponse.json(
        { error: 'Slug não fornecido' },
        { status: 400 }
      );
    }

    // Buscar evento por slug (se tivermos slug) ou por ID
    // Para esta implementação, assumiremos que estamos buscando por ID
    // mas o padrão de rota é [slug], então convertemos para número
    const id = parseInt(slug);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const evento = eventosDb.findById(id);

    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento por slug:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}