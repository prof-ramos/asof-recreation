import { NextResponse } from 'next/server';
import { categoriasDb } from '@/lib/database';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    logger.info('Fetching all categories');
    const categorias = categoriasDb.findAll();
    return NextResponse.json(categorias);
  } catch (error) {
    logger.error('Erro ao buscar categorias:', { error: (error as Error).message, stack: (error as Error).stack });
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}
