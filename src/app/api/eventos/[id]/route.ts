import { NextRequest, NextResponse } from 'next/server';
import { eventosDb } from '@/lib/database';

// GET /api/eventos/[id] - Buscar evento específico
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

    const evento = eventosDb.findById(id);
    if (!evento) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json(evento);
  } catch (error) {
    console.error('Erro ao buscar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// PUT /api/eventos/[id] - Atualizar evento
export async function PUT(
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

    // Verificar se a requisição é multipart/form-data (upload de arquivos)
    if (request.headers.get('content-type')?.includes('multipart/form-data')) {
      const formData = await request.formData();
      
      // Extrair dados do formulário
      const titulo = formData.get('titulo') as string;
      const descricao = formData.get('descricao') as string;
      const data = formData.get('data') as string;
      const local = formData.get('local') as string;
      const status = formData.get('status') as string;
      
      // Preparar objeto de atualização
      const updateData: any = {};
      if (titulo) updateData.titulo = titulo;
      if (descricao) updateData.descricao = descricao;
      if (data) updateData.data = data;
      if (local !== undefined) updateData.local = local;
      if (status) updateData.status = status as 'ativo' | 'inativo';
      
      // Tratar upload de imagem (se fornecida)
      const imagem = formData.get('imagem') as File | null;
      if (imagem) {
        // Simulação de salvamento da imagem (em produção, usaríamos a API de mídia)
        const timestamp = Date.now();
        const randomString = Math.random().toString(36).substring(2, 10);
        const fileExtension = imagem.name.split('.').pop()?.toLowerCase() || 'jpg';
        const filename = `${timestamp}-${randomString}.${fileExtension}`;
        updateData.imagem = `/uploads/eventos/${filename}`;
      }

      const eventoAtualizado = eventosDb.update(id, updateData);

      if (!eventoAtualizado) {
        return NextResponse.json(
          { error: 'Evento não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(eventoAtualizado);
    } else {
      // Requisição JSON tradicional
      const body = await request.json();
      const eventoAtualizado = eventosDb.update(id, body);

      if (!eventoAtualizado) {
        return NextResponse.json(
          { error: 'Evento não encontrado' },
          { status: 404 }
        );
      }

      return NextResponse.json(eventoAtualizado);
    }
  } catch (error) {
    console.error('Erro ao atualizar evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}

// DELETE /api/eventos/[id] - Excluir evento
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

    const deleted = eventosDb.delete(id);
    if (!deleted) {
      return NextResponse.json(
        { error: 'Evento não encontrado' },
        { status: 404 }
      );
    }

    return NextResponse.json({ message: 'Evento excluído com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir evento:', error);
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    );
  }
}