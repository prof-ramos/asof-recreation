import { NextRequest, NextResponse } from 'next/server';
import { filiacoesDb } from '@/lib/database';

// POST /api/filiacoes/[id]/reject - Rejeitar filiação
export async function POST(
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

    // Verificar se a filiação existe
    const filiacao = filiacoesDb.findById(id);
    if (!filiacao) {
      return NextResponse.json(
        { error: 'Filiação não encontrada' },
        { status: 404 }
      );
    }

    // Extrair dados do body
    const body = await request.json();
    const { observacoes } = body;

    // Atualizar o status da filiação para 'rejeitada'
    const filiacaoAtualizada = filiacoesDb.update(id, { 
      status: 'rejeitada' as const,
      observacoes: observacoes || filiacao.observacoes 
    });

    if (!filiacaoAtualizada) {
      return NextResponse.json(
        { error: 'Erro ao atualizar filiação' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ...filiacaoAtualizada,
      message: 'Filiação rejeitada com sucesso'
    });
  } catch (error) {
    console.error('Erro ao rejeitar filiação:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}