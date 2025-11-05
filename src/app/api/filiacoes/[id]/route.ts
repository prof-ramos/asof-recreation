import { NextRequest, NextResponse } from 'next/server'
import { filiacoesDb } from '@/lib/database'

// GET /api/filiacoes/[id] - Buscar filiação específica
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const filiacao = filiacoesDb.findById(id)
    if (!filiacao) {
      return NextResponse.json(
        { error: 'Filiação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(filiacao)
  } catch (error) {
    console.error('Erro ao buscar filiação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// PUT /api/filiacoes/[id] - Atualizar filiação
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const body = await request.json()
    const filiacaoAtualizada = filiacoesDb.update(id, body)

    if (!filiacaoAtualizada) {
      return NextResponse.json(
        { error: 'Filiação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json(filiacaoAtualizada)
  } catch (error) {
    console.error('Erro ao atualizar filiação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// DELETE /api/filiacoes/[id] - Excluir filiação
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    const deleted = filiacoesDb.delete(id)
    if (!deleted) {
      return NextResponse.json(
        { error: 'Filiação não encontrada' },
        { status: 404 }
      )
    }

    return NextResponse.json({ message: 'Filiação excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir filiação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// POST /api/filiacoes/[id]/approve - Aprovar filiação
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id: idStr } = await params
    const id = parseInt(idStr)
    if (isNaN(id)) {
      return NextResponse.json(
        { error: 'ID inválido' },
        { status: 400 }
      )
    }

    // Verificar se a filiação existe
    const filiacao = filiacoesDb.findById(id)
    if (!filiacao) {
      return NextResponse.json(
        { error: 'Filiação não encontrada' },
        { status: 404 }
      )
    }

    // Extrair dados do body
    const body = await request.json()
    const { observacoes } = body

    // Atualizar o status da filiação para 'aprovada'
    const filiacaoAtualizada = filiacoesDb.update(id, { 
      status: 'aprovada' as const,
      observacoes: observacoes || filiacao.observacoes 
    })

    if (!filiacaoAtualizada) {
      return NextResponse.json(
        { error: 'Erro ao atualizar filiação' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      ...filiacaoAtualizada,
      message: 'Filiação aprovada com sucesso'
    })
  } catch (error) {
    console.error('Erro ao aprovar filiação:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}


