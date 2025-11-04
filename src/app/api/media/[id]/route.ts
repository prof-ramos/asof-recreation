import { NextRequest, NextResponse } from 'next/server';
import { mediaDb } from '@/lib/database';
import { unlink } from 'fs/promises';
import path from 'path';

// GET /api/media/[id] - Buscar arquivo de mídia específico
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const media = mediaDb.findById(id);
    if (!media) {
      return NextResponse.json(
        { error: 'Arquivo de mídia não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(media);
  } catch (error) {
    console.error('Erro ao buscar mídia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/media/[id] - Excluir arquivo de mídia
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = parseInt(params.id);
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      );
    }

    const media = mediaDb.findById(id);
    if (!media) {
      return NextResponse.json(
        { error: 'Arquivo de mídia não encontrado' },
        { status: 404 }
      );
    }

    // Excluir o arquivo do sistema de arquivos
    try {
      const filePath = path.join(process.cwd(), 'public', media.path);
      await unlink(filePath);
    } catch (fsError) {
      console.error('Erro ao excluir arquivo do sistema:', fsError);
      // Continuar com a exclusão do banco de dados mesmo se o arquivo não existir
    }

    // Excluir do banco de dados
    const deleted = mediaDb.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Erro ao excluir arquivo de mídia do banco de dados' },
        { status: 500 }
      );
    }

    return NextResponse.json({ message: 'Arquivo de mídia excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir mídia:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}